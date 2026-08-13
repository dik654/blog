import VizFrame from "@/components/viz/VizFrame";

const path = [
  ["Generate", "model·prompt·sampling과 원본 응답 기록", "raw response"],
  ["Deterministic checker", "문자·연속 구간으로 clear pass/fail 판정", "fast verdict"],
  ["Ambiguous only judge", "인용·고유명사 등 의미가 필요한 사례만 전달", "typed verdict"],
  ["Bounded retry", "위반 이유를 반영해 제한된 횟수로 재생성", "attempt receipt"],
  ["Review / fallback", "상한 뒤에는 사람이 검토하거나 안전한 응답", "closed outcome"],
] as const;

export default function RuntimeGuardViz() {
  return (
    <VizFrame
      eyebrow="Fast path · slow path"
      title="결정적 checker가 명확한 사례를 처리하고 애매한 응답만 judge와 제한된 복구 경로로 보냅니다"
      description="모든 요청에 의미 판정을 붙이지 않고, 판정 비용과 오판 위험이 필요한 사례에만 slow path를 사용합니다."
      note="무제한 retry는 latency와 token만 늘릴 수 있습니다. 시도 상한·review 조건·fallback 형태를 미리 정하고 각 attempt의 원인과 결과를 남깁니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {path.map(([stage, action, artifact], index) => (
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
