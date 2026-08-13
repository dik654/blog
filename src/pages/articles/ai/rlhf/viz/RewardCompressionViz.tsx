export default function RewardCompressionViz() {
  return (
    <figure data-viz="reward-compression" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-sm font-bold">Pairwise judgment가 scalar reward가 되는 경로</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Reward model은 품질의 모든 축을 보존하지 않고, 관측한 비교를 설명하는 한 숫자를 학습합니다.</p>
      </figcaption>
      <div className="grid items-stretch gap-4 p-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:p-6">
        <Block title="두 응답" body="같은 prompt에서 A와 B를 비교" />
        <Arrow />
        <Block title="Score 차이" body="r(A) − r(B)만 식별 가능" accent />
        <Arrow />
        <Block title="Policy reward" body="새 응답을 scalar로 평가" />
      </div>
      <p className="border-t border-border/60 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">절대 score의 원점은 정해지지 않으며, labeler bias와 reward shortcut도 함께 압축될 수 있습니다.</p>
    </figure>
  );
}

function Block({ title, body, accent = false }: { title: string; body: string; accent?: boolean }) {
  return <div className={`rounded-lg border p-4 ${accent ? "border-primary/40 bg-primary/[0.05]" : "border-border/70 bg-background"}`}><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>;
}

function Arrow() {
  return <span aria-hidden className="self-center text-center text-sm text-muted-foreground">↓<span className="hidden sm:inline">→</span></span>;
}
