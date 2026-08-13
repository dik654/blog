const methods = [
  { method: "Grid", proposes: "미리 정한 좌표의 곱집합", strength: "축이 적고 값이 이산적일 때", audit: "중요하지 않은 축에서 좌표 반복" },
  { method: "Random", proposes: "정의한 분포에서 독립 표본", strength: "강한 기본선·병렬 실행", audit: "분포와 seed가 곧 탐색 정책" },
  { method: "Sequential", proposes: "완료된 history로 다음 후보", strength: "비싼 objective의 sample efficiency", audit: "noise·parallel pending·초기 편향" },
];

export default function SearchEvolutionViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Search contract → proposal rule</p>
      <h3 className="mt-1 text-lg font-semibold">같은 실험 계약 위에서 후보를 제안하는 규칙만 바꿉니다</h3>
      <div className="mt-5 rounded-lg border border-border/60">
        <div className="grid gap-2 border-b border-border/60 bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid-cols-[.65fr_1.15fr_1.15fr_1.2fr] md:gap-5">
          <span>방법</span><span>다음 후보</span><span>잘 맞는 조건</span><span>반드시 감사할 점</span>
        </div>
        {methods.map((row) => (
          <div key={row.method} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 md:grid-cols-[.65fr_1.15fr_1.15fr_1.2fr] md:gap-5 md:py-3">
            <p className="text-sm font-semibold">{row.method}</p>
            <p className="text-sm">{row.proposes}</p>
            <p className="text-xs leading-5 text-muted-foreground">{row.strength}</p>
            <p className="text-xs leading-5 text-muted-foreground">검사 · {row.audit}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <p className="rounded-md border border-border/50 px-3 py-2">고정 · split / metric / resource</p>
        <p className="rounded-md border border-border/50 px-3 py-2">변경 · proposal rule</p>
        <p className="rounded-md border border-border/50 px-3 py-2">확인 · outer evaluation</p>
      </div>
    </div>
  );
}
