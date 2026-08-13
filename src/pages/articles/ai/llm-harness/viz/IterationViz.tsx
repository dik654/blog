import VizFrame from "@/components/viz/VizFrame";

const loop = [
  ["Trace", "입력·model/tool version·action·observation"],
  ["Classify", "context / schema / authority / verifier / model"],
  ["Reproduce", "최소 실패 case와 정상 control을 고정"],
  ["Change", "해당 계층만 작게 수정"],
  ["Regress", "quality·safety·cost를 함께 비교"],
  ["Canary", "일부 traffic에서 관찰 후 확대"],
] as const;

export default function IterationViz() {
  return (
    <VizFrame
      eyebrow="Improvement loop"
      title="운영 실패를 재현 case로 고정해야 하네스 변경이 다음 run에도 남습니다"
    >
      <div className="divide-y divide-border/70">
        {loop.map(([name, detail], index) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[3rem_7rem_1fr] sm:items-center sm:gap-5"
          >
            <span className="font-mono text-xs font-bold text-primary">
              0{index + 1}
            </span>
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="break-words text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
