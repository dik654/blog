const Item = ({ title, text }: { title: string; text: string }) => (
  <div className="min-w-0 rounded-lg border border-border bg-background p-4">
    <p className="text-sm font-bold text-foreground">{title}</p>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
  </div>
);

export function LotusMpoolFlowViz() {
  return (
    <figure data-viz="lotus-mpool-head-relative-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-bold">Sender nonce 7·8·9가 현재 head에서 block 후보가 되는 흐름</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Mpool admission은 commit이 아니며, head가 바뀌면 같은 signed message도 다시 평가합니다.</p>
      </figcaption>
      <div className="grid min-w-0 gap-4 md:grid-cols-4 md:gap-6">
        <Item title="Admit @ head H" text="Signature·network version·funds·fee cap과 sender nonce를 검사합니다." />
        <Item title="Build nonce chain" text="On-chain nonce 7부터 gap 없는 7→8→9 package만 만듭니다." />
        <Item title="Select by budget" text="Effective premium과 block gas/message limits 안에서 dependency째 고릅니다." />
        <Item title="Reconcile @ H′" text="Applied messages를 제거하고 reverted·stale candidates를 새 state에서 재검사합니다." />
      </div>
    </figure>
  );
}
