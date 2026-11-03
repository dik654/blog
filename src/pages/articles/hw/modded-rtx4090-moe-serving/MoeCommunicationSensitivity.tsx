import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import MoeCommunicationSensitivityViz from "./viz/MoeCommunicationSensitivityViz";

export default function MoeCommunicationSensitivity() {
  return (
    <section id="moe-communication-sensitivity" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Expert parallel은 라우팅 의존 통신을 critical path에 더한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="sparse-compute-dense-memory" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">연산은 일부 expert만, 저장은 전체 expert를 기준으로 한다</h3>
        <p className="leading-7">
          MoE FFN은 토큰마다 top-k expert만 계산하므로 같은 총 파라미터의 dense 모델보다 토큰당 FLOPs를 줄일 수 있다.
          하지만 다음 토큰이 어느 expert를 고를지 미리 확정할 수 없어서 serving 중에는 전체 expert 가중치를 접근 가능한
          메모리에 두어야 한다. 즉 연산량은 활성 expert 수를, 가중치 용량은 전체 expert 수를 기준으로 계산한다. 이 경계는{" "}
          <a href="/cs/ai/model-vram-budgeting#moe-vram-serving-tradeoff">모델 VRAM 예산 글</a>에서 더 계산한다.
        </p>

        <h3 id="expert-parallel-all-to-all" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">GPU를 나누면 dispatch와 combine이 생긴다</h3>
        <p className="leading-7">
          Expert parallel(EP)은 각 GPU가 expert 일부만 보유하게 한다. Router가 고른 expert가 다른 GPU에 있으면 activation을
          그 rank로 보내는 dispatch가 먼저 발생한다. Expert 계산 뒤에는 결과를 원래 토큰 순서로 돌려보내는 combine이
          이어진다. 이 두 단계가 각 MoE layer에서 반복된다.
        </p>
        <p className="leading-7">
          공유 expert 복제나 expert 배치로 경계를 덜 넘게 할 수는 있다. 그러나 EP가 남아 있는 한 통신 경로 자체는
          사라지지 않는다.
        </p>
        <p className="leading-7">
          여기서 병목은 단순한 총 바이트만이 아니다. 특정 expert로 토큰이 몰리면 해당 rank가 늦게 끝나고 나머지 rank가
          기다린다. 그래서 평균 링크 사용률보다 rank별 dispatch bytes, expert load, collective duration과 p95·p99를
          함께 봐야 한다.
        </p>

        <h3 id="why-interconnect-matters-more" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">Dense와 MoE는 통신량을 정하는 변수가 다르다</h3>
        <p className="leading-7">
          Dense TP의 all-reduce는 라우팅과 무관하지만 TP degree와 collective 알고리즘에 따라 wire traffic이 달라진다.
          EP all-to-all은 여기에 토큰 수, top-k, expert 배치와 load balance가 더 들어간다.
        </p>
        <p className="leading-7">
          따라서 “MoE는 항상 dense보다 더 많은 바이트를 보낸다”거나 “항상 더 느리다”고 말할 수 없다. 같은 workload와
          topology에서 TP/PP/EP 후보를 profile해야 결론이 나온다. 구조에서 미리 예측할 수 있는 것은 좁고 비균일한
          링크에서 EP 쏠림이 tail latency로 드러날 가능성이 크다는 정도다.
        </p>
      </div>

      <div className="not-prose"><MoeCommunicationSensitivityViz /></div>

      <TermBreakdown
        title="TP와 EP에서 반드시 따로 재야 할 것"
        description="둘 다 collective이지만 payload를 정하는 변수가 다르다."
        items={[
          { term: "TP all-reduce", description: "각 rank의 partial result를 집계한다.", example: "Attention·MLP 경계의 collective 시간을 잰다.", boundary: "라우팅과 무관하지만 degree와 알고리즘에 따라 wire traffic은 변한다." },
          { term: "EP dispatch", description: "토큰 activation을 선택된 expert의 rank로 보낸다.", example: "인기 expert rank에 payload가 몰릴 수 있다.", boundary: "총량뿐 아니라 rank별 불균형과 straggler를 봐야 한다." },
          { term: "EP combine", description: "Expert 결과를 원래 토큰 순서가 있는 rank로 돌려보낸다.", example: "Dispatch 뒤 두 번째 통신 구간이다.", boundary: "Dispatcher backend와 overlap에 따라 비용이 달라진다." },
        ]}
      />

      <CitationBlock source="NVIDIA Megatron Bridge · MoE Training Optimization" citeKey={8} href="https://docs.nvidia.com/nemo/megatron-bridge/nightly/training/moe-optimization.html">
        NVIDIA 문서는 MoE의 memory wall을 전체 expert 저장, communication wall을 EP all-to-all로 구분한다. 또한 dispatcher와 overlap의 승자는 topology만으로 고정하지 말고 workload를 profile해 선택하라고 설명한다.
      </CitationBlock>
    </section>
  );
}
