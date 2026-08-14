const Step = ({ n, title, text }: { n: string; title: string; text: string }) => (
  <div className="min-w-0 rounded-lg border border-border bg-background p-4">
    <p className="text-xs font-semibold text-primary">{n}</p>
    <p className="mt-1 text-sm font-bold text-foreground">{title}</p>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
  </div>
);

export function OnchainCloudFlowViz() {
  return (
    <figure data-viz="onchain-cloud-proof-settlement" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-bold">한 piece가 proof-gated payment receipt가 되기까지</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Upload, PDP period와 Filecoin Pay settlement는 연결되지만 어느 한 단계의 성공이 다음 단계를 대신하지 않습니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-4 md:grid-cols-4 md:gap-6">
        <Step n="01" title="Upload receipt" text="Provider가 piece bytes를 저장하고 PieceCID를 돌려줍니다." />
        <Step n="02" title="Dataset commit" text="Client·provider·piece·PDP listener·payment rail을 같은 generation으로 묶습니다." />
        <Step n="03" title="Period verdict" text="Proven·faulted·open을 deadline별로 판정하고 open에서 정산을 멈춥니다." />
        <Step n="04" title="Rail settlement" text="Validator가 허용한 epoch만 누적하고 settledUpTo를 전진시킵니다." />
      </div>
    </figure>
  );
}
