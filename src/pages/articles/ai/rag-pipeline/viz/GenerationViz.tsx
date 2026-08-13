const lanes = [
  ["고정 입력", "system 500 · history 1,000 · query 200", "1,700"],
  ["문서 예산", "dedup·parent 복원 뒤 선택", "4,992"],
  ["출력 예약", "답변·citation·거절 사유", "1,500"],
] as const;

export default function GenerationViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Context assembly</p>
        <p className="mt-1 font-semibold">8,192 token을 먼저 장부로 나누고 근거를 예산 안에 배치합니다</p>
      </figcaption>
      <div className="mt-5 divide-y divide-border border-y border-border">
        {lanes.map(([name, detail, tokens]) => (
          <div key={name} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr_5rem] sm:items-center">
            <p className="text-sm font-semibold">{name}</p><p className="text-xs leading-5 text-muted-foreground">{detail}</p><p className="font-mono text-sm sm:text-right">{tokens}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="border-l border-primary pl-4"><p className="text-xs font-semibold text-primary">실행 가능한 것</p><p className="mt-1 text-sm leading-6">System과 application policy만 instruction으로 처리</p></div>
        <div className="border-l border-border pl-4"><p className="text-xs font-semibold text-muted-foreground">신뢰하지 않는 data</p><p className="mt-1 text-sm leading-6">검색 문서 안 명령문은 인용·요약 대상일 뿐 실행하지 않음</p></div>
      </div>
    </figure>
  );
}
