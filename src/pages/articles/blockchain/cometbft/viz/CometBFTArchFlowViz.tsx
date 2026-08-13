import VizFrame from "@/components/viz/VizFrame";

const STEPS = [
  ["01 · receive", "TX bytes", "P2P/RPC가 bytes를 받고 stable transaction ID를 기록합니다."],
  ["02 · admit", "Mempool·CheckTx", "후보 admission은 최종 실행이나 commit receipt가 아닙니다."],
  ["03 · order", "Proposal·votes", "Consensus가 height·round·block hash와 commit evidence를 만듭니다."],
  ["04 · execute", "FinalizeBlock", "Application이 합의된 순서에 deterministic state transition을 적용합니다."],
  ["05 · persist", "Commit·app hash", "Block과 app state를 다음 height의 입력으로 영속화합니다."],
] as const;

export default function CometBFTArchFlowViz() {
  return (
    <VizFrame
      eyebrow="CometBFT ownership trace"
      title="수신부터 app commit까지, 단계마다 owner와 receipt가 바뀝니다"
      description="CheckTx PASS·proposal 포함·consensus commit·application Commit을 하나의 성공 상태로 합치지 않습니다."
      note="Remote 처리 완료와 external effect exactly-once는 이 pipeline만으로 보장되지 않습니다. Application이 idempotency·outbox·reconciliation을 별도로 설계해야 합니다."
    >
      <ol className="grid min-w-0 gap-5 lg:grid-cols-5">
        {STEPS.map(([label, title, body]) => (
          <li key={label} className="min-w-0 border-t border-border pt-4">
            <p className="font-mono text-[11px] font-semibold text-primary">{label}</p>
            <p className="mt-2 text-sm font-bold leading-5">{title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-7 grid gap-3 border-t border-border pt-5 md:grid-cols-3">
        <p className="text-xs leading-5"><strong>Consensus receipt</strong><br /><span className="text-muted-foreground">height · round · block hash · commit evidence</span></p>
        <p className="text-xs leading-5"><strong>Application receipt</strong><br /><span className="text-muted-foreground">tx result · event · app hash · version</span></p>
        <p className="text-xs leading-5"><strong>Operational receipt</strong><br /><span className="text-muted-foreground">binary · config · DB schema · restart state</span></p>
      </div>
    </VizFrame>
  );
}
