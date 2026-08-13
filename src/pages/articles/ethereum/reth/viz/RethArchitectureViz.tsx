import VizFrame from "@/components/viz/VizFrame";

const FLOW = [
  ["01 · ingest", "Network·Engine input", "Block bytes와 payload request를 source·parent·version과 함께 받습니다."],
  ["02 · validate", "Protocol rules", "Header·transaction·fork activation과 parent context를 검증합니다."],
  ["03 · execute", "EVM transition", "같은 prior state에서 receipts·logs·post-state root를 계산합니다."],
  ["04 · canonicalize", "Fork-choice handoff", "Head·safe·finalized reference에 따라 canonical chain view를 갱신합니다."],
  ["05 · persist/read", "Storage·Provider·RPC", "Block·state·history를 저장하고 pinned view로 consumer에게 제공합니다."],
] as const;

export default function RethArchitectureViz() {
  return (
    <VizFrame
      eyebrow="Reth block lifecycle"
      title="Historical sync와 live Engine path는 같은 execution·storage invariant에 합류합니다"
      description="단계별 success를 하나로 합치지 않고 block hash·state root·storage checkpoint를 이어 추적합니다."
      note="Reth는 execution client입니다. Consensus finality와 validator duty는 consensus client가 소유하며 Engine API가 두 owner를 연결합니다."
    >
      <ol className="grid min-w-0 gap-5 lg:grid-cols-5">
        {FLOW.map(([label, title, body]) => (
          <li key={label} className="min-w-0 border-t border-border pt-4">
            <p className="font-mono text-[11px] font-semibold text-primary">{label}</p>
            <p className="mt-2 text-sm font-bold leading-5">{title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-7 grid gap-3 border-t border-border pt-5 md:grid-cols-3">
        <p className="text-xs leading-5"><strong>Historical cursor</strong><br /><span className="text-muted-foreground">stage · range · checkpoint · unwind</span></p>
        <p className="text-xs leading-5"><strong>Live cursor</strong><br /><span className="text-muted-foreground">head · safe · finalized · payload status</span></p>
        <p className="text-xs leading-5"><strong>Shared oracle</strong><br /><span className="text-muted-foreground">block hash · receipts · state root · provider view</span></p>
      </div>
    </VizFrame>
  );
}
