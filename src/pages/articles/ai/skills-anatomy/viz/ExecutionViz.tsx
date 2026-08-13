import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Select", "Trigger scope 확인", "선택 trace"],
  ["Read", "Instructions 전체 로딩", "작업 계약"],
  ["Authorize", "Identity·scope·approval", "허용 또는 거부"],
  ["Execute", "Tool·script·reasoning", "관측 가능한 effect"],
  ["Validate", "Output·regression·safety", "Acceptance evidence"],
  ["Handoff", "Result·changes·unfinished", "재개 가능한 artifact"],
] as const;

export default function ExecutionViz() {
  return (
    <VizFrame
      eyebrow="Execution contract"
      title="Workflow instructions와 runtime authority, artifact acceptance를 분리합니다"
      description="Skill이 선택된 사실은 권한 승인도 완료 증거도 아니므로 실행 전·후의 판정 지점을 독립적으로 남깁니다."
    >
      <ol className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map(([name, action, output], index) => (
          <li key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-sm font-bold text-foreground">{name}</h4>
              <span className="font-mono text-[11px] text-primary">0{index + 1}</span>
            </div>
            <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">{action}</p>
            <p className="mt-2 break-words text-xs font-semibold leading-5 text-foreground/75">→ {output}</p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
