import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import SynergyViz from "./viz/SynergyViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        모델 압축 파이프라인은 더 작은 checkpoint를 만드는 절차가 아니라, 배포
        제약을 통과하는 가장 단순한 실행 artifact를 찾는 절차입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          같은 model도 batch·sequence length·concurrency와 hardware에 따라
          병목이 달라집니다. Weight bandwidth가 병목이면 quantization이
          직접적이지만 KV cache가 메모리를 차지하면 weight-only 4-bit만으로 동시
          요청이 크게 늘지 않을 수 있습니다. Dense kernel만 빠른 장치에서는
          arbitrary pruning보다 작은 student나 structured shape가 낫습니다.
        </p>
        <p>
          따라서 먼저 quality·memory·latency·throughput의 통과 조건을 쓰고 dense
          baseline을 같은 환경에서 측정합니다. 그다음{" "}
          <a href="/ai/quantization">양자화</a>,{" "}
          <a href="/ai/pruning">프루닝</a>,{" "}
          <a href="/ai/knowledge-distillation">지식 증류</a> 정본에서 필요한
          lever만 가져옵니다. <a href="/ai/lora-finetuning">LoRA</a>는
          adaptation parameter와 training memory를 줄이는 방법이므로 merge 뒤
          inference graph가 같다면 그 자체를 serving compression으로 세지
          않습니다.
        </p>
      </div>
      <ContentBoundary article="compression-pipeline" />
      <ExplainedFormula
        question="여러 평균 점수를 하나로 더하지 않고 후보가 모든 필수 SLA를 통과했는지 어떻게 표현할까요?"
        idea={
          <>
            각 guardrail을 만족하면 1, 아니면 0인 indicator를 곱합니다. 하나라도
            실패하면 전체 feasibility가 0이 되어 다른 축의 큰 이득으로 필수
            조건을 상쇄하지 못합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
I_k(a)&=\mathbf1[g_k(a)\le b_k],\\
F(a)&=\prod_{k=1}^{K}I_k(a),\\
a^*&=\arg\min_{a:F(a)=1}C_{\mathrm{ops}}(a).
\end{aligned}`}
        terms={[
          {
            symbol: "a",
            name: "artifact candidate",
            description:
              "Baseline 또는 compression stage 조합으로 만든 실행 artifact입니다.",
          },
          {
            symbol: "g_k",
            name: "measured guardrail",
            description:
              "Quality loss·peak memory·p95 latency·error rate처럼 방향을 맞춘 측정값입니다.",
          },
          {
            symbol: "b_k",
            name: "budget",
            description: "해당 guardrail이 넘지 않아야 하는 최대 허용값입니다.",
          },
          {
            symbol: "F",
            name: "feasibility",
            description:
              "모든 필수 조건을 통과하면 1, 하나라도 실패하면 0입니다.",
          },
          {
            symbol: "C_ops",
            name: "operational cost",
            description:
              "통과 후보 사이에서 비교할 복잡도·비용·유지보수 부담입니다.",
          },
        ]}
        assumptions={[
          "각 metric의 방향과 단위·slice·confidence rule을 사전에 고정합니다.",
          "Soft tradeoff가 가능한 선호도와 반드시 지켜야 하는 hard guardrail을 구분합니다.",
          "여러 통과 후보가 있으면 가장 높은 압축률이 아니라 운영 목적에 맞는 cost와 Pareto 축으로 선택합니다.",
        ]}
        interpretation="평균 quality가 좋아도 safety slice가 기준을 넘으면 F=0입니다. 목표를 통과한 후보 중에서는 stage가 적고 runtime support가 안정적인 artifact를 우선할 수 있습니다."
      />
      <div className="not-prose my-8">
        <SynergyViz />
      </div>
    </section>
  );
}
