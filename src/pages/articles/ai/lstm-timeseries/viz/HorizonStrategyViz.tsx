const methods = [
  { name: "Direct multi-output", path: "hₜ → [ŷₜ₊₁ … ŷₜ₊H]", gain: "한 번에 병렬 출력", cost: "고정 horizon·출력 head 증가" },
  { name: "Recursive", path: "ŷₜ₊₁ → 입력 → ŷₜ₊₂", gain: "길이를 순차 확장", cost: "오차와 조건 차이가 누적" },
] as const;

export default function HorizonStrategyViz() {
  return (
    <figure data-viz="horizon-strategy" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">같은 LSTM state에서 horizon을 읽는 두 계약</p></figcaption>
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
        {methods.map((method, index) => <div key={method.name} className="rounded-lg border border-border/70 bg-background p-4"><p className="text-xs font-black text-primary">0{index + 1}</p><p className="mt-2 text-sm font-bold">{method.name}</p><p className="mt-3 rounded-md bg-muted/40 px-3 py-2 font-mono text-xs leading-5">{method.path}</p><div className="mt-3 grid gap-2 text-xs leading-5"><p><b>얻는 것</b> <span className="text-muted-foreground">{method.gain}</span></p><p><b>치르는 비용</b> <span className="text-muted-foreground">{method.cost}</span></p></div></div>)}
      </div>
    </figure>
  );
}
