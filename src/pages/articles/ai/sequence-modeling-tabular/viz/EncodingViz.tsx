const signals = [
  ["의미", "Etype[cart]", "무슨 행동인가"],
  ["수치", "Wnum[amount, duration]", "event에 딸린 값"],
  ["순번", "p₂", "sequence에서 몇 번째인가"],
  ["간격", "gψ(16 min)", "직전 event 뒤 얼마나 지났나"],
];

export default function EncodingViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Event-token trace</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">서로 다른 네 신호가 같은 width의 token 한 개로 모입니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <div className="divide-y divide-border border-y border-border">
          {signals.map(([label, value, role]) => (
            <div key={label} className="grid gap-1 py-3 text-sm sm:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1.35fr)] sm:gap-4">
              <span className="font-semibold text-cyan-800 dark:text-cyan-200">{label}</span>
              <span className="break-words font-mono text-xs sm:text-sm">{value}</span>
              <span className="text-muted-foreground">{role}</span>
            </div>
          ))}
        </div>
        <div className="my-4 flex items-center gap-3 text-sm">
          <span className="h-px flex-1 bg-border" />
          <span className="font-medium">element-wise sum</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="border-l border-cyan-500 pl-4">
            <p className="font-mono text-sm font-semibold">z₂ ∈ ℝᵈ</p>
            <p className="mt-1 text-sm text-muted-foreground">두 번째 cart event의 encoded token</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Batch representation</p>
            <div className="mt-2 grid grid-cols-5 gap-1 text-center font-mono text-xs sm:gap-2 sm:text-sm">
              {["z₁", "z₂", "z₃", "PAD", "PAD"].map((token, index) => (
                <span key={`${token}-${index}`} className={`border px-1 py-2 ${token === "PAD" ? "border-dashed border-border text-muted-foreground" : "border-cyan-500/50"}`}>{token}</span>
              ))}
              {["1", "1", "1", "0", "0"].map((value, index) => (
                <span key={`${value}-${index}`} className="px-1 py-1 text-muted-foreground">{value}</span>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">valid-token mask · PAD는 attention과 pooling에서 제외</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
