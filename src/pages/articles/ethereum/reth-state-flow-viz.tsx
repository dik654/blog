type Mode = "trie" | "pipeline" | "execution";

const FLOWS = {
  trie: {
    eyebrow: "STATE ROOT · DIRTY FRONTIER",
    input: ["parent root", "0xa balance +1"],
    action: ["hash · nibble · overlay", "reuse clean siblings"],
    outputs: [
      ["account path", "changed"],
      ["storage paths", "unchanged"],
      ["new root", "header oracle"],
    ],
    receipt:
      "parent root · hashed key · dirty prefixes · computed root · header root",
  },
  pipeline: {
    eyebrow: "STAGED SYNC · CHECKPOINT",
    input: ["checkpoint 99", "target 250"],
    action: ["bounded batch", "100…163 · commit"],
    outputs: [
      ["checkpoint 163", "durable"],
      ["next batch", "164…227"],
      ["unwind", "common ancestor"],
    ],
    receipt:
      "stage id · input checkpoint · target · committed range · output checkpoint",
  },
  execution: {
    eyebrow: "BLOCK TRANSITION · ONE PRE-STATE",
    input: ["block 101", "parent state σ₁₀₀"],
    action: ["ordered EVM", "tx₀ → tx₁ → system"],
    outputs: [
      ["receipts", "status · gas · logs"],
      ["bundle", "original + present"],
      ["post-state root", "match header"],
    ],
    receipt:
      "block hash · chain spec · pre-root · receipts root · gas used · post-root",
  },
} as const;

export default function RethStateFlowViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  return (
    <figure
      data-viz
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6"
    >
      <figcaption>
        <p className="text-xs font-bold tracking-[0.16em] text-primary">
          {flow.eyebrow}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          입력 → 순서가 있는 계산 → 검증 가능한 결과
        </p>
      </figcaption>
      <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1.4fr] lg:items-center lg:gap-6">
        <Card number="01" title={flow.input[0]} detail={flow.input[1]} />
        <Arrow />
        <Card
          number="02"
          title={flow.action[0]}
          detail={flow.action[1]}
          active
        />
        <Arrow />
        <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {flow.outputs.map(([title, detail], index) => (
            <Card
              key={title}
              number={`0${index + 3}`}
              title={title}
              detail={detail}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">
          RECEIPT
        </p>
        <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">
          {flow.receipt}
        </p>
      </div>
    </figure>
  );
}

function Card({
  number,
  title,
  detail,
  active = false,
}: {
  number: string;
  title: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border p-4 ${
        active
          ? "border-primary/50 bg-primary/[0.04]"
          : "border-border bg-muted/15"
      }`}
    >
      <p className="font-mono text-[10px] font-bold text-primary">{number}</p>
      <p className="mt-2 break-words text-sm font-bold">{title}</p>
      <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="hidden text-primary lg:block">
      →
    </span>
  );
}
