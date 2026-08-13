const SIGNALS = [
  ["source", "checkpoint 출발점"],
  ["target", "epoch 경계 root"],
  ["head", "관찰 당시 chain head"],
] as const;

export default function RewardDetailViz() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="text-sm font-bold">Attestation 한 개도 세 가지 정확성을 따로 기록합니다</figcaption>
      <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-6">
        {SIGNALS.map(([title, detail]) => (
          <section key={title} className="min-w-0 border-l border-primary/60 pl-4">
            <code className="text-xs font-semibold text-primary">{title}</code>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
          </section>
        ))}
      </div>
      <p className="mt-5 border-l border-amber-500/70 pl-4 text-xs leading-5 text-muted-foreground">참여 flag와 reward weight는 fork 규격에 귀속됩니다. 고정 APR이나 모든 flag의 대칭 penalty를 뜻하지 않습니다.</p>
    </figure>
  );
}
