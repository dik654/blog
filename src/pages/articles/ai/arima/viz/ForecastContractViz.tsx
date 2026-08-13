const fields = [
  ["Target", "무엇을 예측하는가"],
  ["Interval", "관측 간격은 일정한가"],
  ["Horizon", "몇 step 앞까지 필요한가"],
  ["Cutoff", "예측 시점에 무엇을 아는가"],
] as const;

export default function ForecastContractViz() {
  return (
    <figure data-viz="forecast-contract" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">모델보다 먼저 고정하는 forecast contract</p><p className="mt-1 text-xs leading-5 text-muted-foreground">같은 series도 horizon과 cutoff가 달라지면 서로 다른 예측 문제입니다.</p></figcaption>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        {fields.map(([title, body], index) => <div key={title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border border-border/70 bg-background p-4"><span className="font-mono text-xs font-black text-primary">0{index + 1}</span><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div></div>)}
      </div>
    </figure>
  );
}
