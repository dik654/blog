export function ModernNttGpuViz() {
  return (
    <figure className="not-prose rounded-xl border border-border bg-card p-5" aria-labelledby="ntt-viz-title">
      <figcaption id="ntt-viz-title" className="text-sm font-bold">NTT 호출 하나를 stage tile·order·buffer 계약으로 내리기</figcaption>
      <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
        <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-semibold text-primary">INPUT RECEIPT</p><p className="mt-2 break-words text-sm font-bold">field · N · direction · order</p><p className="mt-2 text-xs leading-5 text-muted-foreground">coefficient/evaluation form과 coset을 함께 고정</p></div>
        <span aria-hidden className="hidden h-px w-5 bg-border lg:block" />
        <div className="min-w-0 rounded-lg border border-primary/40 bg-primary/5 p-4"><p className="text-xs font-semibold text-primary">STAGE TILES</p><p className="mt-2 break-words text-sm font-bold">butterfly + twiddle</p><p className="mt-2 text-xs leading-5 text-muted-foreground">CT/GS 선택과 shared/global 경계를 기록</p></div>
        <span aria-hidden className="hidden h-px w-5 bg-border lg:block" />
        <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4"><p className="text-xs font-semibold text-primary">OUTPUT RECEIPT</p><p className="mt-2 break-words text-sm font-bold">natural 또는 bit-reversed</p><p className="mt-2 text-xs leading-5 text-muted-foreground">inverse scale·permutation 완료 여부를 명시</p></div>
      </div>
    </figure>
  );
}
