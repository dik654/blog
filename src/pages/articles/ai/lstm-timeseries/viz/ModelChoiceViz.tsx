const ladder = [
  ["Naive", "마지막 값"], ["Seasonal naive", "지난 주기"], ["ARIMA", "선형 dependence"], ["DLinear", "단순 learned baseline"], ["LSTM", "순차 nonlinear state"], ["PatchTST", "patch attention"],
] as const;

export default function ModelChoiceViz() {
  return (
    <figure data-viz="model-choice" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">복잡한 모델은 같은 운영 시험을 통과해야 한다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">같은 forecast origins·horizons·features·budget에서 단순한 기준선부터 차례대로 비교합니다.</p></figcaption>
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-6 sm:p-6">{ladder.map(([name, body], index) => <div key={name} className={`rounded-lg border p-3 ${name === "LSTM" ? "border-primary/40 bg-primary/[0.05]" : "border-border/70 bg-background"}`}><p className="font-mono text-xs text-primary">0{index + 1}</p><p className="mt-2 text-sm font-bold leading-5">{name}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
    </figure>
  );
}
