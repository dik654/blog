export default function ScaleInverseViz() {
  const items = [
    { label: "원래 공간", value: "0.5 × 0.5 × 0.5", note: "확률을 곱한다" },
    { label: "log 변환", value: "3 × log 0.5", note: "반복을 계수한다" },
    { label: "loss", value: "−log 0.125", note: "낮은 확률에 큰 비용" },
  ];
  return (
    <figure className="not-prose my-8 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="text-sm font-bold">곱셈 경로를 덧셈 경로로 옮기기</figcaption>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => <div key={item.label} className="min-w-0 border-l border-primary/45 pl-4"><p className="text-xs font-bold text-primary">0{index + 1} · {item.label}</p><p className="mt-2 break-words font-mono text-sm font-semibold">{item.value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.note}</p></div>)}
      </div>
    </figure>
  );
}
