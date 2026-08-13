const paths = [
  ["표준화", "평균·표준편차", "거리·gradient가 scale에 민감", "fold 안에서 μ·σ fit"],
  ["Robust scaling", "중앙값·IQR", "극단값이 중심 통계를 흔듦", "이상값을 제거하진 않음"],
  ["Log / power", "값 사이 간격", "오른쪽 꼬리와 곱셈 관계", "단위·0·음수 정의"],
  ["Binning", "연속값의 구간", "업무상 threshold가 실제로 존재", "경계 정보 손실"],
];

export default function NumericViz() {
  return (
    <figure data-viz="numeric-transform-decision" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Numeric transform decision</p>
        <p className="mt-2 text-lg font-semibold">분포 모양이 아니라 model 가정에서 변환을 고릅니다</p>
      </figcaption>
      <div className="mt-6 overflow-hidden rounded-lg border border-border/70">
        <div className="hidden grid-cols-[0.8fr_1fr_1.35fr_1.2fr] gap-4 bg-muted/35 px-4 py-2 text-xs font-semibold text-muted-foreground sm:grid">
          <span>변환</span><span>바뀌는 기준</span><span>선택하는 상황</span><span>남는 위험</span>
        </div>
        {paths.map(([name, basis, use, risk], index) => (
          <div key={name} className={`grid min-w-0 gap-2 px-4 py-4 sm:grid-cols-[0.8fr_1fr_1.35fr_1.2fr] sm:gap-4 ${index ? "border-t border-border/60" : ""}`}>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground"><span className="sm:hidden">기준 · </span>{basis}</p>
            <p className="text-sm text-muted-foreground"><span className="sm:hidden">조건 · </span>{use}</p>
            <p className="text-sm text-primary"><span className="sm:hidden">점검 · </span>{risk}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-border/70 pt-4 text-sm sm:grid-cols-3">
        <p><span className="font-semibold">fit</span><br/><span className="text-muted-foreground">training fold 통계 추정</span></p>
        <p><span className="font-semibold">transform</span><br/><span className="text-muted-foreground">validation·serving에 고정 적용</span></p>
        <p><span className="font-semibold">verify</span><br/><span className="text-muted-foreground">원 단위 metric·drift 확인</span></p>
      </div>
    </figure>
  );
}
