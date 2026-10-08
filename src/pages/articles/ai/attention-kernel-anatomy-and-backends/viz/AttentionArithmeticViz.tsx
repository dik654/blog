import VizFrame from "@/components/viz/VizFrame";

function CellGrid({ label }: { label: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-center text-xs font-bold text-muted-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-1" aria-label={`${label} 2행 2열`}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex aspect-square items-center justify-center border border-border bg-muted/40 text-xs font-bold text-foreground">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AttentionArithmeticViz() {
  return (
    <VizFrame
      eyebrow="2×2 조각 하나의 계산"
      title="점수 네 칸을 만들고, 같은 네 칸으로 값을 다시 섞습니다"
      description="Q와 K의 행마다 성분이 두 개입니다. 결과 한 칸에는 두 번 곱하고 두 번 더하는 것으로 세어 4 FLOP를 배정합니다."
      note="지수 호출, 최대값, 합산, mask와 주소 계산은 행렬곱 FLOP에 섞지 않고 따로 셉니다."
    >
      <div className="grid min-w-0 items-center gap-4 sm:grid-cols-[minmax(0,0.7fr)_auto_minmax(0,0.7fr)_auto_minmax(0,1fr)]">
        <CellGrid label="Q · 관심 두 행" />
        <span className="hidden text-center text-lg font-bold text-muted-foreground sm:block" aria-hidden="true">×</span>
        <CellGrid label="Kᵀ · 비교 두 열" />
        <span className="hidden text-center text-lg font-bold text-muted-foreground sm:block" aria-hidden="true">=</span>
        <div className="min-w-0">
          <p className="mb-2 text-center text-xs font-bold text-muted-foreground">점수 2×2 · 네 칸</p>
          <div className="grid grid-cols-2 gap-1">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="border border-primary/50 bg-primary/15 p-2 text-center">
                <span className="block text-xs font-bold text-primary">4 FLOP</span>
                <span className="mt-1 block text-[11px] text-muted-foreground">곱 2 · 합 2</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="border-l-2 border-border pl-3 text-sm leading-6"><strong>QK</strong><br /><span className="font-mono">4칸 × 4 FLOP = 16</span></div>
        <div className="border-l-2 border-border pl-3 text-sm leading-6"><strong>softmax 준비</strong><br /><span className="font-mono">4칸 × exp 1회 = 4회</span></div>
        <div className="border-l-2 border-primary pl-3 text-sm leading-6"><strong>PV</strong><br /><span className="font-mono">4칸 × 4 FLOP = 16</span></div>
      </div>
      <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-foreground">
        조각 하나의 행렬곱 장부는 <strong>16 + 16 = 32 FLOP</strong>이고, 지수 호출은 <strong>4회</strong>로 따로 남습니다.
      </p>
    </VizFrame>
  );
}
