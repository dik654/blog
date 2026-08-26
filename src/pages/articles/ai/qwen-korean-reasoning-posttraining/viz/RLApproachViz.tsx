import VizFrame from "@/components/viz/VizFrame";

const training = [
  ["SFT", "한국어 reasoning example로 따라 할 경로 제시", "supervised checkpoint"],
  ["Rollout", "같은 질문에서 여러 candidate outcome 생성", "response set"],
  ["Checker", "형식·언어처럼 결정적으로 판정 가능한 항목", "rule reward"],
  ["Oracle judge", "정확도처럼 의미 판단이 필요한 candidate 비교", "guided reward"],
  ["Dr.GRPO + eval", "reward로 policy를 갱신하고 기준 checkpoint와 비교", "paired outcomes"],
] as const;

export default function RLApproachViz() {
  return (
    <VizFrame
      eyebrow="Two-stage post-training"
      title="SFT로 reasoning 경로를 학습한 뒤 Oracle-guided Dr.GRPO가 checker와 judge reward로 candidate를 비교합니다"
      description="Reward 하나로 모든 품질을 대신하지 않고 결정적 규칙과 의미 판정을 나눈 뒤, 기준 checkpoint 대비 결과를 확인합니다."
      note="Paired outcome에는 정답 품질·한국어 일관성·형식·길이와 정상 예외를 함께 둡니다. 한 지표가 올랐다는 이유로 다른 능력이 유지됐다고 결론내리지 않습니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {training.map(([stage, action, artifact], index) => (
          <li key={stage} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-2 min-w-0 text-sm font-bold [overflow-wrap:anywhere]">{stage}</h4>
            <p className="mt-3 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {action}
            </p>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {artifact}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
