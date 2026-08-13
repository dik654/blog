const stages = [
  ["관측", "어디서 어떤 activation을 수집했나"],
  ["분해", "어떤 SAE가 어떻게 복원했나"],
  ["가설", "무슨 입력에서 latent가 켜지나"],
  ["검증", "개입하면 예측한 behavior가 바뀌나"],
] as const;

export default function InterpretationContractViz() {
  return <figure data-viz="sae-contract" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card"><figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">SAE가 바로 제공하는 것은 설명이 아니라 검증할 좌표다</p></figcaption><div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">{stages.map(([title,body],i)=><div key={title} className="rounded-lg border border-border/70 bg-background p-4"><p className="font-mono text-xs font-black text-primary">0{i+1}</p><p className="mt-2 text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div><p className="border-t border-border/60 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">앞 단계가 달라지면 같은 feature index라도 같은 의미라고 볼 수 없습니다.</p></figure>;
}
