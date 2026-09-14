import TermBreakdown from "@/components/articles/term-breakdown";
import EngineeringRecoveryViz from "./viz/EngineeringRecoveryViz";

export default function EngineeringRecovery() {
  return (
    <section id="engineering-recovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        링크를 넓힐 수 없으면 링크를 덜 쓰게 만든다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PCIe raw bandwidth는 소프트웨어로 바꿀 수 없는 상수다. 그래서 엔지니어링이 할 수 있는 일은 두 갈래뿐이다. 링크를
          건너는 바이트 수 자체를 줄이거나, 그 바이트를 옮기는 시간을 다른 작업(연산)으로 가려서 병목을 체감하지 못하게
          만드는 것이다. 아래 네 가지가 이 두 갈래 안에서 실제로 쓰이는 방법이다.
        </p>

        <h3 id="expert-placement" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          1) Expert 배치: 넘는 경계 자체를 줄인다
        </h3>
        <p className="leading-7">
          자주 함께 활성화되는 expert들을 같은 GPU에 몰아 두면, 그 조합이 걸릴 때는 GPU 경계를 아예 넘지 않는다. 공유
          expert(항상 활성화되는 shared expert)가 있는 아키텍처라면 이건 특히 유효하다 — 공유 expert는 모든 토큰이
          거치므로, 이걸 각 GPU에 복제해 두면 최소한 공유 expert 경로의 dispatch·combine은 사라진다. 라우팅 대상 expert의
          배치 자체는{" "}
          <a href="/cs/ai/expert-parallelism-moe-systems">expert parallelism 글</a>이 다루는 영역이고, 이 글에서는
          "PCIe만 있는 topology에서는 배치 최적화의 보상이 NVSwitch 환경보다 크다"는 지점만 강조한다. NVSwitch에서는 어떤
          pair든 같은 대역폭이라 배치를 잘못해도 손해가 균일하지만, PCIe 2-way 구성에서는 애초에 넘을 경계가 하나뿐이라
          최적 배치가 곧 "그 경계를 최대한 안 넘기는 것"으로 단순해진다.
        </p>

        <h3 id="tp-vs-ep-choice" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          2) Tensor parallel 대신 pipeline parallel: all-reduce를 아예 피한다
        </h3>
        <p className="leading-7">
          Attention·dense 부분을 tensor parallel로 나누면 layer마다 all-reduce 두 번이 PCIe를 반드시 거친다. 링크가
          PCIe 하나뿐이면 이 all-reduce가 매 layer, 매 토큰마다 critical path에 그대로 얹힌다. 대안은 pipeline
          parallel(PP)이다. Layer 구간을 통째로 GPU별로 나누면 GPU 사이 통신은 구간 경계에서 activation 텐서 하나만
          넘기면 되고, all-reduce 자체가 없다. 대신 마이크로배치를 충분히 잘게 쪼개지 않으면 파이프라인 버블(한 GPU가
          다른 GPU의 결과를 기다리며 노는 시간)이 생긴다. PCIe 링크 하나짜리 구성에서는 "매 layer 통신"보다 "구간마다
          한 번 통신"이 절대적인 바이트 수가 적기 때문에, TP보다 PP를 기본값으로 놓는 편이 유리한 경우가 많다. TP·PP의
          기본 분할 방식은{" "}
          <a href="/cs/ai/tensor-and-pipeline-parallel-inference">tensor·pipeline parallel 글</a>이 정본이다.
        </p>

        <h3 id="quantization-shrinks-payload" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          3) Quantization: 옮기는 바이트 자체를 줄인다
        </h3>
        <p className="leading-7">
          FP16/BF16 대신 FP8이나 INT4로 activation·weight를 낮추면, 같은 텐서를 옮기는 데 필요한 바이트 수가 절반에서
          4분의 1로 준다. All-to-all이든 all-reduce든 통신 시간은 결국 <code>바이트 수 ÷ bandwidth</code>이므로, 대역폭을
          못 올린다면 분자(바이트 수)를 줄이는 게 유일하게 남는 레버다. 다만 quantization은 통신 문제를 풀려고 넣는 게
          아니라 정확도와 맞바꾸는 결정이라서, all-to-all 페이로드만 낮추는 부분 적용(communication-only quantization)과
          weight 전체를 낮추는 전면 적용을 구분해서 판단해야 한다. Quantization level별 VRAM 크기 자체는{" "}
          <a href="/cs/ai/model-vram-budgeting#quantization-vram-tradeoff">Q8·NVFP4 tradeoff 글</a>에서 다룬 계산을
          그대로 쓴다 — 여기서는 그 바이트 수 감소가 통신 시간에도 같은 비율로 적용된다는 점만 더한다.
        </p>

        <h3 id="batching-amortizes-overhead" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          4) Batching: 통신을 연산 뒤에 숨긴다
        </h3>
        <p className="leading-7">
          Batch가 클수록 GPU 하나가 한 스텝에 처리하는 연산량이 늘어난다. All-to-all 통신 시간 자체는 크게 안 바뀌어도,
          그 시간 대비 연산 시간의 비율(arithmetic intensity)이 커지면 통신을 연산과 겹쳐(overlap) 가릴 여지가 커진다.
          Continuous batching으로 decode 요청을 최대한 많이 묶으면, 통신이 끝나길 기다리는 GPU idle 시간의 비중이
          줄어든다. 단, batch를 키우면 activation 메모리도 같이 늘어나므로 이 레버는 앞서 다룬 VRAM 여유(48GB 개조로
          벌어들인 용량)와 정확히 트레이드오프 관계에 있다. Prefill과 decode의 통신 패턴이 다르다는 점까지 고려하면{" "}
          <a href="/cs/ai/disaggregated-prefill-decode-serving">prefill·decode disaggregation 글</a>처럼 두 단계를
          아예 분리해 각각 다른 batching·병렬화 전략을 쓰는 것도 선택지다.
        </p>
      </div>

      <div className="not-prose">
        <EngineeringRecoveryViz />
      </div>

      <TermBreakdown
        title="네 가지 완화 기법이 줄이는 것"
        description="같은 목표(통신 병목 완화)를 서로 다른 방식으로 공략한다."
        items={[
          {
            term: "Expert 배치 최적화",
            description: "자주 같이 뽑히는 expert를 같은 GPU에 몰아 경계를 넘는 라우팅 자체를 줄인다.",
            example: "공유 expert를 모든 GPU에 복제하면 그 경로의 통신이 사라진다.",
            boundary: "Expert 수·조합이 GPU 용량을 넘으면 배치만으로 해결되지 않는다.",
          },
          {
            term: "TP 대신 PP",
            description: "매 layer all-reduce를 구간 경계 activation 전달 한 번으로 대체한다.",
            example: "12-layer 모델을 2구간으로 나누면 통신이 layer 12회에서 1회로 준다.",
            boundary: "마이크로배치가 작으면 파이프라인 버블이 그 절감분을 상쇄한다.",
          },
          {
            term: "Quantization",
            description: "통신 페이로드의 바이트 수 자체를 FP8·INT4로 줄인다.",
            example: "BF16 대비 INT4는 통신 바이트가 이론상 4분의 1.",
            boundary: "정확도 손실과 맞바꾸는 결정이라 통신 절감만을 이유로 전면 적용하지 않는다.",
          },
          {
            term: "Batching·disaggregation",
            description: "통신 대비 연산 비율을 높여 통신 대기 시간을 연산 뒤에 숨긴다.",
            example: "Continuous batching으로 decode 요청을 묶어 GPU idle을 줄인다.",
            boundary: "Batch 확대는 activation 메모리를 늘려 VRAM 여유와 트레이드오프된다.",
          },
        ]}
      />

      <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
        <p className="font-semibold mb-1">💡 이 네 가지는 대역폭을 만들어 내지 않는다</p>
        <p className="text-sm leading-6">
          네 기법 모두 PCIe raw bandwidth 상한 자체를 올리지 못한다. 통신량을 줄이거나(배치·quantization) 통신을
          숨기거나(PP·batching) 할 뿐이다.
          <br />
          그래서 이 기법들의 효과는 항상 "원래 병목이 얼마나 심했는가"에 비례한다 — 병목이 없던 워크로드에 적용하면
          체감 이득도 작다.
        </p>
      </div>
    </section>
  );
}
