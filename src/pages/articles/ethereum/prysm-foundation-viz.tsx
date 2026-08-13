type Mode = "ssz" | "bls" | "state";

const FLOWS = {
  ssz: {
    eyebrow: "SSZ · one schema, two outputs",
    input: ["typed value", "List[uint64, 4]", "[7, 9]"],
    transform: [
      "schema rules",
      "offset · chunk · length",
      "fork-specific type",
    ],
    outputs: [
      ["wire bytes", "bounded decode"],
      ["32 B root", "field proof"],
    ],
    receipt: "type · fork · byte length · root · decode result",
  },
  bls: {
    eyebrow: "BLS · authorization before aggregation",
    input: ["consensus object", "object root + domain", "validator key"],
    transform: [
      "signing pipeline",
      "hash-to-curve · scalar multiply",
      "point validation",
    ],
    outputs: [
      ["96 B signature", "single verify"],
      ["aggregate", "same/different message API"],
    ],
    receipt: "fork · domain · signing root · key · API · verify result",
  },
  state: {
    eyebrow: "BeaconState · value, cache, identity",
    input: ["parent state", "slot · fork", "block operations"],
    transform: [
      "state transition",
      "copy-on-write · dirty paths",
      "incremental Merkle root",
    ],
    outputs: [
      ["post-state", "fork-specific schema"],
      ["state root", "block commitment"],
    ],
    receipt: "pre/post root · fork · dirty fields · cache generation",
  },
} as const;

export default function PrysmFoundationViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  return (
    <figure
      data-viz
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6"
      aria-label={`${flow.eyebrow} 흐름`}
    >
      <figcaption className="mb-5 flex min-w-0 flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {flow.eyebrow}
        </span>
        <span className="text-xs text-muted-foreground">
          입력 → 규칙 적용 → 검증 가능한 출력
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr] lg:items-stretch lg:gap-6">
        <FlowCard step="01" title={flow.input[0]} lines={flow.input.slice(1)} />
        <Connector />
        <FlowCard
          step="02"
          title={flow.transform[0]}
          lines={flow.transform.slice(1)}
          accent
        />
        <Connector />
        <div className="grid min-w-0 gap-3">
          {flow.outputs.map(([title, line], index) => (
            <FlowCard
              key={title}
              step={`0${index + 3}`}
              title={title}
              lines={[line]}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 min-w-0 border-t border-border pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          재현 영수증
        </p>
        <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">
          {flow.receipt}
        </p>
      </div>
    </figure>
  );
}

function FlowCard({
  step,
  title,
  lines,
  accent = false,
}: {
  step: string;
  title: string;
  lines: readonly string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border p-4 ${accent ? "border-primary/50 bg-primary/[0.04]" : "border-border bg-muted/15"}`}
    >
      <p className="font-mono text-[10px] font-bold text-primary">{step}</p>
      <p className="mt-2 break-words text-sm font-bold leading-5">{title}</p>
      <div className="mt-3 space-y-1.5">
        {lines.map((line) => (
          <p
            key={line}
            className="break-words text-xs leading-5 text-muted-foreground"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div
      aria-hidden
      className="hidden items-center justify-center text-base text-primary lg:flex"
    >
      →
    </div>
  );
}
