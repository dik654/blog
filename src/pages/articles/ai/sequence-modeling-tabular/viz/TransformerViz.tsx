const bidirectional = Array.from({ length: 4 }, () => Array(4).fill(true));
const causal = Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_value, column) => column <= row));

function MaskMatrix({ values, label }: { values: boolean[][]; label: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-3 text-sm font-semibold">{label}</p>
      <div className="grid grid-cols-[1.5rem_repeat(4,minmax(0,1fr))] gap-1 text-center text-xs">
        <span />
        {[1, 2, 3, 4].map((value) => <span key={`k-${value}`} className="py-1 text-muted-foreground">k{value}</span>)}
        {values.flatMap((row, rowIndex) => [
          <span key={`q-${rowIndex}`} className="flex items-center justify-start text-muted-foreground">q{rowIndex + 1}</span>,
          ...row.map((visible, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              className={`flex aspect-square min-h-7 items-center justify-center border ${visible ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-800 dark:text-indigo-200" : "border-border text-muted-foreground/55"}`}
            >
              {visible ? "0" : "−∞"}
            </span>
          )),
        ])}
      </div>
    </div>
  );
}

export default function TransformerViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">Visibility contract</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">같은 event tokens라도 질문이 달라지면 보이는 영역이 달라집니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
          <MaskMatrix values={bidirectional} label="미래 label 하나 · bidirectional" />
          <MaskMatrix values={causal} label="다음 event · causal" />
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <div className="grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <p><span className="font-semibold">Event states</span><br /><span className="text-muted-foreground">h₁ … hL</span></p>
            <span className="hidden text-muted-foreground sm:block">→</span>
            <p><span className="font-semibold">Masked pooling</span><br /><span className="text-muted-foreground">CLS · mean · last valid</span></p>
            <span className="hidden text-muted-foreground sm:block">→</span>
            <p><span className="font-semibold">Future target</span><br /><span className="text-muted-foreground">purchase in +24h</span></p>
          </div>
        </div>
      </div>
    </figure>
  );
}
