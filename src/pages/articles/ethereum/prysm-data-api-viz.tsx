type Mode = "state-cache" | "beacon-api";

const FLOWS = {
  "state-cache": {
    eyebrow: "State retrieval · root 하나를 끝까지 추적",
    input: ["target identity", "root · slot · fork/schema", "caller consistency requirement"],
    transform: ["cache → anchor → replay", "copy boundary · ordered transitions", "distance and source receipt"],
    output: ["verified state view", "slot/root postcondition", "promote, return, or fail closed"],
    receipt: "target root/slot · fork · cache generation · anchor root/slot · block range · transition count · output root",
  },
  "beacon-api": {
    eyebrow: "Beacon API · validator duty 하나를 끝까지 추적",
    input: ["versioned request", "transport · endpoint · media type", "state/duty identifier"],
    transform: ["decode → authorize → service", "canonical lookup · deadline", "schema and error mapping"],
    output: ["typed response or effect", "HTTP/gRPC status", "reconcile after timeout or stream gap"],
    receipt: "API/spec version · endpoint · request digest · state root/dependent root · deadline · status · response digest",
  },
} as const;

export default function PrysmDataApiViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  return (
    <figure
      data-viz
      data-viz-canvas
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6"
      aria-label={`${flow.eyebrow} 처리 흐름`}
    >
      <figcaption className="mb-5 flex min-w-0 flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{flow.eyebrow}</span>
        <span className="text-xs text-muted-foreground">입력 → 결정 → 검증 가능한 결과</span>
      </figcaption>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-6">
        <FlowCard step="01" title={flow.input[0]} lines={flow.input.slice(1)} />
        <Connector />
        <FlowCard step="02" title={flow.transform[0]} lines={flow.transform.slice(1)} accent />
        <Connector />
        <FlowCard step="03" title={flow.output[0]} lines={flow.output.slice(1)} />
      </div>
      <div className="mt-5 min-w-0 border-t border-border pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">재현 영수증</p>
        <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">{flow.receipt}</p>
      </div>
    </figure>
  );
}

function FlowCard({ step, title, lines, accent = false }: { step: string; title: string; lines: readonly string[]; accent?: boolean }) {
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

function Connector() {
  return <div aria-hidden className="hidden items-center justify-center text-base text-primary lg:flex">→</div>;
}
