const cases = [
  ["곱", "가로 × 세로", "면적", "두 단위가 곱해짐"],
  ["비율", "매출 ÷ 거래 수", "객단가", "분모 0·결측"],
  ["차이", "현재 − 이전", "변화량", "관측 시점 정렬"],
  ["교차", "지역 × 채널", "조합별 행동", "희소·unknown"],
];

export default function InteractionViz() {
  const slopes = ["w₁", "w₁+w₁₂", "w₁+2w₁₂"];

  return (
    <figure data-viz="interaction-feature-mechanics" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Interaction mechanics</p>
        <p className="mt-2 text-lg font-semibold">원본 두 축에서 업무상 의미가 있는 새 축을 만듭니다</p>
      </figcaption>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0 border-y border-border/70 py-5">
          <p className="text-xs font-semibold text-muted-foreground">같은 x₁ 변화, 다른 x₂ 조건</p>
          <div className="mt-5 space-y-4">
            {[0, 1, 2].map((level) => (
              <div key={level} className="grid grid-cols-[3.5rem_1fr_5rem] items-center gap-3">
                <span className="text-xs text-muted-foreground">x₂ = {level}</span>
                <div className="h-px bg-border"><div className="h-px bg-primary" style={{ width: `${35 + level * 25}%` }} /></div>
                <span className="whitespace-nowrap text-right font-mono text-xs text-primary">{slopes[level]}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">w₁₂가 0이 아니면 x₂의 조건에 따라 x₁의 기울기가 달라집니다.</p>
        </div>

        <div className="min-w-0 divide-y divide-border/60 border-y border-border/70">
          {cases.map(([kind, expression, meaning, check]) => (
            <div key={kind} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[3.3rem_1fr_0.8fr_1fr] sm:gap-3">
              <p className="text-xs font-bold text-primary">{kind}</p>
              <p className="min-w-0 break-words font-mono text-xs">{expression}</p>
              <p className="text-sm">{meaning}</p>
              <p className="text-xs text-muted-foreground">점검 · {check}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
