import VizFrame from "@/components/viz/VizFrame";

const decisions = [
  ["Access", "Weight를 직접 바꿀 수 있는가?", "API only · prompt/runtime", "Weights · smoothing/SFT/RL 후보"],
  ["Target", "어느 failure를 줄이려는가?", "표면 문자 · checker/smoothing", "Reasoning behavior · SFT/RL"],
  ["Cost", "비용을 언제 지불할 수 있는가?", "Request time · fast path 우선", "Offline · checkpoint 실험"],
  ["Evidence", "정답 판정이 결정적인가?", "Yes · checker/reward", "No · judge/human review"],
] as const;

export default function DecisionMatrixViz() {
  return (
    <VizFrame
      eyebrow="Intervention decision matrix"
      title="Access·target·cost·evidence 네 축을 확인해 가장 단순한 개입 후보부터 비교합니다"
      description="도구 이름을 먼저 고르지 않고 무엇을 바꿀 권한이 있으며 어떤 failure를 어떤 evidence로 판정할지 정합니다."
      note="같은 evaluation set에서 목표를 충족한 가장 단순한 구성에서 멈춥니다. 여러 층을 함께 쓰면 prompt policy·weight change·runtime enforcement의 책임과 version을 따로 기록합니다."
    >
      <div className="divide-y divide-border/70">
        {decisions.map(([axis, question, left, right], index) => (
          <section
            key={axis}
            className="grid min-w-0 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[2rem_6rem_1.2fr_1fr_1fr] sm:items-baseline"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="text-sm font-bold">{axis}</h4>
            <p className="min-w-0 text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
              {question}
            </p>
            <p className="min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {left}
            </p>
            <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {right}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
