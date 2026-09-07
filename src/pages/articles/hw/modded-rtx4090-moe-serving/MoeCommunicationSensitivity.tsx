import TermBreakdown from "@/components/articles/term-breakdown";
import MoeCommunicationSensitivityViz from "./viz/MoeCommunicationSensitivityViz";

export default function MoeCommunicationSensitivity() {
  return (
    <section id="moe-communication-sensitivity" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        MoE는 연산은 줄이고 통신은 늘리는 구조라서 이 격차에 더 예민하다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="sparse-compute-dense-memory" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          연산은 sparse, 메모리는 dense
        </h3>
        <p className="leading-7">
          MoE FFN은 토큰마다 top-k개의 expert만 활성화한다. 그래서 같은 총 파라미터 수의 dense 모델보다 토큰 하나를 처리하는
          데 드는 FLOPs가 훨씬 적다 — 이게 MoE가 매력적인 이유다. 그런데 어떤 expert가 선택될지는 라우터가 토큰별로 그때
          결정하므로, 전체 expert 중 어느 것이든 선택될 수 있다는 전제 아래 모든 expert의 weight가 항상 메모리에 상주해
          있어야 한다. 연산은 sparse인데 메모리 footprint는 dense 모델과 똑같이 전체 파라미터 크기다. 이 tradeoff 자체는{" "}
          <a href="/ai/model-vram-budgeting#moe-vram-serving-tradeoff">
            model VRAM budgeting 글의 dense·MoE decode bandwidth 비교
          </a>
          에서 이미 다뤘다. 이 글에서 추가하는 건 그 다음 단계, 즉 expert를 여러 GPU에 나눠 놓았을 때 벌어지는 일이다.
        </p>

        <h3 id="expert-parallel-all-to-all" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          Expert parallel은 매 layer마다 dispatch와 combine 두 번의 all-to-all을 만든다
        </h3>
        <p className="leading-7">
          Expert 수가 GPU 한 장의 VRAM보다 많거나, 개조로 용량은 넉넉해졌어도 batch가 커서 activation까지 감안하면 expert를 여러 장에 나눠야 할 때,
          expert parallelism(EP)을 쓴다. 각 GPU가 전체 expert 중 일부만 들고 있고 토큰은 라우팅 결과에 따라 자기 expert가 있는 GPU로 보내져야 한다.
          이 과정이 두 단계다. 먼저 토큰을 목적지 GPU로 흩뿌리는 dispatch, expert 연산이 끝난 뒤 원래 위치로 결과를 되돌리는 combine이다. 이 두 all-to-
          all이 MoE layer마다 한 번씩, 즉 모델 전체로는 MoE layer 개수만큼 반복된다.
        </p>
        <p className="leading-7">
          <a href="/ai/model-vram-budgeting#multi-gpu-vram-strategies">
            Tensor parallel의 통신 패턴
          </a>
          과 비교하면 차이가 분명해진다. TP는 attention 뒤와 MLP 뒤로 layer마다 all-reduce가 두 번 들어가는데, all-reduce는
          모든 GPU가 같은 크기의 partial sum을 주고받는 대칭 통신이다. EP의 all-to-all은 어떤 GPU가 어떤 GPU에 얼마나 보낼지가
          라우팅 결과에 따라 매 스텝 달라지는 비대칭 통신이다. 통신량 자체도 라우팅이 얼마나 균등한지에 좌우된다. 라우팅이
          한쪽 expert로 쏠리면(load imbalance) 그 expert가 있는 GPU로 트래픽이 몰려 개별 링크의 실제 사용률이 특정 pair에서만
          치솟는다. 이 불균형은{" "}
          <a href="/ai/moe-routing-and-load-balancing">MoE 라우팅·load balancing 글</a>이 라우터 쪽 대응을 다룬다.
        </p>

        <h3 id="why-interconnect-matters-more" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          왜 dense보다 인터커넥트에 더 민감한가
        </h3>
        <p className="leading-7">
          Dense 모델을 tensor parallel로 나누면 all-reduce 통신량은 GPU 개수가 늘어도 layer당 고정 비율로 남는다 — TP degree를 올려도 통신이
          사라지지 않을 뿐, 늘어나지도 않는다. 반면 MoE를 expert parallel로 나누면 통신량은 토큰이 몇 개의 GPU 경계를 넘어 라우팅되느냐에 달려 있고 이건 GPU
          개수·expert 개수·top-k 값·batch 구성이 모두 얽힌 함수다. 같은 파라미터 수라면 MoE 쪽이 구조적으로 "통신이 늘어날 여지가 더 큰" 쪽이다. NVSwitch처럼
          어떤 pair도 같은 대역폭을 보장하는 fabric에서는 이 비대칭성이 성능에 잘 드러나지 않지만 PCIe만 있는 4090 다중 구성에서는 라우팅이 조금만 쏠려도 특정 링크가
          병목이 된다.
        </p>
      </div>

      <div className="not-prose">
        <MoeCommunicationSensitivityViz />
      </div>

      <TermBreakdown
        title="TP의 all-reduce vs EP의 all-to-all"
        description="같은 '매 layer 통신'이라는 말이 가리키는 두 패턴은 성격이 다르다."
        items={[
          {
            term: "Tensor parallel all-reduce",
            description: "모든 GPU가 같은 크기의 partial sum을 대칭으로 주고받는다.",
            example: "Attention 뒤 1번, MLP 뒤 1번, layer마다 고정 2회.",
            boundary: "통신량은 TP degree·hidden size로 정해지고 라우팅과 무관하다.",
          },
          {
            term: "Expert parallel all-to-all (dispatch)",
            description: "라우터가 고른 목적지 GPU로 토큰을 비대칭으로 흩뿌린다.",
            example: "토큰 100개 중 60개가 GPU 0의 expert로 몰리면 그 링크만 붐빈다.",
            boundary: "통신량이 라우팅 균형도에 따라 매 스텝 달라진다.",
          },
          {
            term: "Expert parallel all-to-all (combine)",
            description: "Expert 연산 결과를 원래 토큰 위치로 되돌리는 반대 방향 통신.",
            example: "Dispatch와 같은 페어 사이에서 방향만 반대로 다시 발생.",
            boundary: "Dispatch가 불균형하면 combine도 같은 불균형을 그대로 물려받는다.",
          },
        ]}
      />

      <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
        <p className="font-semibold mb-1">💡 용량이 늘었다고 통신이 줄지는 않는다</p>
        <p className="text-sm leading-6">
          48GB 개조로 GPU 한 장에 더 많은 expert를 올릴 수 있게 됐다면, 그만큼 GPU 간 경계를 넘는 라우팅 자체를 줄일 수
          있다는 게 유일하게 실질적인 이득이다.
          <br />
          하지만 expert 수가 GPU 용량을 넘는 배치라면, 개조 이전과 통신 패턴은 동일하게 남는다.
        </p>
      </div>
    </section>
  );
}
