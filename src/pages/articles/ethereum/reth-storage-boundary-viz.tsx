type Mode = "alloy" | "db" | "provider";

const FLOWS = {
  alloy: {
    eyebrow: "Alloy · semantic value to canonical bytes",
    input: ["typed value", "Address · B256 · U256", "field meaning + width"],
    transform: ["canonical encoding", "RLP kind · payload length", "minimal integer · exact consume"],
    output: ["wire bytes", "hash / DB key / network", "typed decode or reasoned error"],
    receipt: "crate version · Rust type · value · encoded bytes · consumed length · decode outcome",
  },
  db: {
    eyebrow: "Reth DB · typed write to durable generation",
    input: ["logical record", "table · key · value", "canonical block context"],
    transform: ["transaction + route", "encode · put · index", "commit · sync · manifest"],
    output: ["durable generation", "mutable DB + static history", "cursor / recovery receipt"],
    receipt: "schema version · table/key · tx ID · commit generation · sync policy · segment coverage",
  },
  provider: {
    eyebrow: "Reth provider · one query, one state view",
    input: ["read intent", "latest / block hash / number", "account · storage · bytecode"],
    transform: ["pin + overlay", "canonical root · DB snapshot", "BundleState · history fallback"],
    output: ["consistent answer", "value + provenance", "retryable stale-view error"],
    receipt: "view ID · block/root · storage generation · overlay revision · source tier · outcome",
  },
} as const;

export default function RethStorageBoundaryViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  return (
    <figure
      data-viz
      aria-label={`${flow.eyebrow} 흐름`}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6"
    >
      <figcaption className="mb-5 flex min-w-0 flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{flow.eyebrow}</span>
        <span className="text-xs text-muted-foreground">입력 → 경계·상태 변화 → 출력</span>
      </figcaption>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-6">
        <Card step="01" title={flow.input[0]} lines={flow.input.slice(1)} />
        <Arrow />
        <Card step="02" title={flow.transform[0]} lines={flow.transform.slice(1)} accent />
        <Arrow />
        <Card step="03" title={flow.output[0]} lines={flow.output.slice(1)} />
      </div>
      <div className="mt-5 min-w-0 border-t border-border pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">재현 영수증</p>
        <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">{flow.receipt}</p>
      </div>
    </figure>
  );
}

function Card({ step, title, lines, accent = false }: { step: string; title: string; lines: readonly string[]; accent?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-4 ${accent ? "border-primary/50 bg-primary/[0.04]" : "border-border bg-muted/15"}`}>
      <p className="font-mono text-[10px] font-bold text-primary">{step}</p>
      <p className="mt-2 break-words text-sm font-bold leading-5">{title}</p>
      <div className="mt-3 space-y-1.5">
        {lines.map((line) => <p key={line} className="break-words text-xs leading-5 text-muted-foreground">{line}</p>)}
      </div>
    </div>
  );
}

function Arrow() {
  return <div aria-hidden className="hidden items-center justify-center text-base text-primary lg:flex">→</div>;
}
