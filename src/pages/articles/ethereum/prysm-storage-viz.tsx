type Mode = "slot" | "database";

const DATA = {
  slot: {
    eyebrow: "SLOT TRANSITION · ORDERED REPLAY",
    input: ["pre-state", "slot 30 · target 33"],
    action: ["repeat per slot", "root receipt · epoch boundary"],
    outputs: [
      ["slot 31", "empty"],
      ["slot 32", "epoch"],
      ["slot 33", "block-ready"],
    ],
    receipt:
      "pre root · processed slot · ring index · epoch trigger · post root",
  },
  database: {
    eyebrow: "BEACON DB · ONE LOGICAL COMMIT",
    input: ["block + state", "root-addressed bytes"],
    action: ["write transaction", "primary · index · checkpoint"],
    outputs: [
      ["durable view", "all mappings agree"],
      ["reader", "one snapshot"],
      ["pruner", "finality fence"],
    ],
    receipt: "DB schema · tx id · block/state root · index set · sync result",
  },
} as const;

export default function PrysmStorageViz({ mode }: { mode: Mode }) {
  const data = DATA[mode];
  return (
    <figure
      data-viz
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6"
    >
      <figcaption>
        <p className="text-xs font-bold tracking-[0.16em] text-primary">
          {data.eyebrow}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          입력 → 순서가 있는 상태 변화 → 검증 가능한 결과
        </p>
      </figcaption>
      <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1.45fr] lg:items-center lg:gap-6">
        <Card number="01" title={data.input[0]} detail={data.input[1]} />
        <Arrow />
        <Card
          number="02"
          title={data.action[0]}
          detail={data.action[1]}
          active
        />
        <Arrow />
        <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {data.outputs.map(([title, detail], index) => (
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
          {data.receipt}
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
      className={`min-w-0 rounded-lg border p-4 ${active ? "border-primary/50 bg-primary/[0.04]" : "border-border bg-muted/15"}`}
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
