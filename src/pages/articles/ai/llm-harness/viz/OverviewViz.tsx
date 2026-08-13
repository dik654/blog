import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Objective", "무엇을 바꿀지", "acceptance criteria"],
  ["Context", "무엇을 근거로 볼지", "discovery · compaction"],
  ["Action", "무엇을 실행할지", "tool schema · capability"],
  ["State", "무엇을 이어받을지", "artifact · checkpoint"],
  ["Evidence", "언제 끝났는지", "verifier · receipt · trace"],
] as const;

export default function OverviewViz() {
  return (
    <VizFrame
      eyebrow="Responsibility boundary"
      title="Model은 다음 행동을 제안하고, 하네스는 실행 경계와 완료 근거를 보장합니다"
      description="Model 출력과 실제 side effect 사이에 authorization·execution·observation이 있어야 합니다."
    >
      <div className="divide-y divide-border/70">
        {rows.map(([name, question, system], index) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[3rem_7rem_1fr_11rem] sm:items-center sm:gap-5"
          >
            <span className="font-mono text-xs font-bold text-primary">
              0{index + 1}
            </span>
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="text-xs leading-5 text-muted-foreground">{question}</p>
            <p className="break-words font-mono text-xs leading-5 text-foreground/75 sm:text-right">
              {system}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
