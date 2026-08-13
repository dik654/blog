import VizFrame from "@/components/viz/VizFrame";

const flow = [
  ["Discover", "name · description · path", "작은 후보 index"],
  ["Route", "explicit 또는 implicit", "한 Skill 선택"],
  ["Load", "SKILL.md 전체", "workflow contract"],
  ["Expand", "필요한 reference만", "task-specific context"],
  ["Run", "tool·script·validation", "검증된 artifact"],
] as const;

export default function LoadingViz() {
  return (
    <VizFrame
      eyebrow="Progressive disclosure"
      title="선택 전의 작은 index가 선택 뒤의 전체 지침과 필요한 자료로 확장됩니다"
      description="각 단계의 output이 다음 단계 input이 되며, 설치된 모든 reference를 한 번에 context에 넣지 않습니다."
    >
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {flow.map(([name, input, output], index) => (
          <li key={name} className="min-w-0 border-l border-border/80 pl-4">
            <span className="font-mono text-[11px] font-bold text-primary">0{index + 1}</span>
            <h4 className="mt-2 text-sm font-bold text-foreground">{name}</h4>
            <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">{input}</p>
            <p className="mt-2 break-words text-xs font-semibold leading-5 text-foreground/75">
              → {output}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-7 grid gap-3 border-t border-border/70 pt-5 text-xs leading-5 sm:grid-cols-3">
        <p className="text-muted-foreground"><strong className="text-foreground">초기 목록</strong><br />최대 context 2%</p>
        <p className="text-muted-foreground"><strong className="text-foreground">크기 미확인</strong><br />최대 8,000 characters</p>
        <p className="text-muted-foreground"><strong className="text-foreground">선택 이후</strong><br />SKILL.md 전체 로딩</p>
      </div>
    </VizFrame>
  );
}
