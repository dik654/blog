type Mode = "update" | "state" | "execution";

const FLOWS = {
  update: {
    eyebrow: "LIGHT-CLIENT UPDATE · TWO HEADS",
    input: ["검증된 Store", "finalized 100 · optimistic 104"],
    gate: ["Update 검증", "slot · period · branch · BLS"],
    output: [
      ["optimistic", "slot 105 · 빠른 head"],
      ["finalized", "slot 102 · 2/3 update"],
      ["committee", "period 경계에서 handoff"],
    ],
    anchor: "network · genesis root · fork · expected slot · store period",
  },
  state: {
    eyebrow: "STATE PROOF · ANCHOR CHAIN",
    input: ["검증된 block H", "header.stateRoot = R"],
    gate: ["EIP-1186 검증", "account proof → storage proof"],
    output: [
      ["account", "nonce · balance · roots"],
      ["storage slot", "storageRoot 아래 값"],
      ["absence", "마지막 matching node"],
    ],
    anchor: "checkpoint → execution block hash H → state root R → proof",
  },
  execution: {
    eyebrow: "LOCAL EXECUTION · TRUST BOUNDARY",
    input: ["eth_call @ block H", "tx · block env · fork"],
    gate: ["ProofDB + revm", "miss → proof fetch → replay"],
    output: [
      ["call output", "H에 고정된 simulation"],
      ["logs", "receipt-root membership"],
      ["sendRawTx", "unverified broadcast"],
    ],
    anchor: "verified read · local simulation · trusted write를 따로 기록",
  },
} as const;

export default function HeliosTrustFlowViz({ mode }: { mode: Mode }) {
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
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          원격 응답을 받는 단계와 로컬에서 검증해 신뢰를 얻는 단계를 분리합니다.
        </p>
      </figcaption>

      <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1.35fr] lg:items-center lg:gap-6">
        <FlowCard number="01" title={flow.input[0]} detail={flow.input[1]} />
        <Arrow />
        <FlowCard
          number="02"
          title={flow.gate[0]}
          detail={flow.gate[1]}
          active
        />
        <Arrow />
        <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {flow.output.map(([title, detail], index) => (
            <FlowCard
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
          ANCHOR / RECEIPT
        </p>
        <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">
          {flow.anchor}
        </p>
      </div>
    </figure>
  );
}

function FlowCard({
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
      <p className="mt-2 break-words text-sm font-bold leading-5">{title}</p>
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
