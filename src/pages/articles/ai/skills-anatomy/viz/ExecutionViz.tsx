import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["선택", "요청과 적용 범위 확인", "선택 기록"],
  ["읽기", "지침 전체 로딩", "작업 순서"],
  ["허용", "신원·범위·승인", "허용 또는 거절"],
  ["실행", "도구·script·추론", "관측 가능한 효과"],
  ["검증", "출력·회귀·안전", "완료 근거"],
  ["보고", "결과·변경·남은 일", "이어갈 수 있는 결과물"],
] as const;

export default function ExecutionViz() {
  return (
    <VizFrame
      eyebrow="실행 경계"
      title="작업 지침과 실행 권한, 완료 판정을 분리합니다"
      description="Skill이 선택된 사실은 권한 승인도 완료 근거도 아니므로 실행 전후의 판정을 따로 남깁니다."
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
