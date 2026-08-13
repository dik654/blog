import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["A", "0.70", "0.60", "0.36", "0.51"],
  ["B", "0.20", "0.30", "0.32", "0.24"],
  ["C", "0.10", "0.10", "0.23", "0.23"],
];

export default function DistributionPenaltyViz() {
  return (
    <VizFrame
      eyebrow="Distribution accounting"
      title="같은 사건도 어느 분포의 확률을 log에 넣느냐에 따라 목적이 달라집니다"
      description="아래 수치는 natural log를 사용한 항별 기여도입니다. 합하면 entropy와 cross-entropy가 됩니다."
      note="Cross-entropy와 entropy의 차이가 KL divergence입니다. Q가 P와 달라질수록 오른쪽 합계에 추가 비용이 생깁니다."
    >
      <div>
        <div className="hidden sm:block">
          <div className="grid grid-cols-[0.7fr_repeat(4,1fr)] gap-px overflow-hidden rounded-lg border border-border/70 bg-border/60 text-xs">
            {[
              "사건",
              "실제 P(x)",
              "모델 Q(x)",
              "−P log P",
              "−P log Q",
            ].map((head) => (
              <div key={head} className="bg-muted/45 px-3 py-3 font-semibold text-foreground">{head}</div>
            ))}
            {rows.flatMap((row) =>
              row.map((cell, index) => (
                <div
                  key={`${row[0]}-${index}`}
                  className={`bg-background px-3 py-3 ${index === 0 ? "font-semibold" : "font-mono text-muted-foreground"}`}
                >
                  {cell}
                </div>
              )),
            )}
          </div>
        </div>
        <div className="space-y-2 sm:hidden">
          {rows.map(([event, p, q, entropy, crossEntropy]) => (
            <div key={event} className="rounded-lg border border-border/70 bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">사건 {event}</p>
                <p className="font-mono text-xs text-muted-foreground">P {p} · Q {q}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border/60 pt-3 text-xs">
                <p><span className="block text-muted-foreground">−P log P</span><strong className="mt-1 block font-mono">{entropy}</strong></p>
                <p><span className="block text-muted-foreground">−P log Q</span><strong className="mt-1 block font-mono">{crossEntropy}</strong></p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Metric label="H(P)" value="0.802 nat" detail="P 자체의 불확실성" />
          <Metric label="H(P,Q)" value="0.980 nat" detail="Q로 설명한 평균 비용" />
          <Metric label="KL(P‖Q)" value="0.178 nat" detail="모델 때문에 늘어난 비용" accent />
        </div>
      </div>
    </VizFrame>
  );
}

function Metric({ label, value, detail, accent = false }: { label: string; value: string; detail: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? "border-primary/45 bg-primary/[0.04]" : "border-border/70 bg-background"}`}>
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}
