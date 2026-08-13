const methods = [
  ["PPO", "Pair → reward", "필요", "Online", "새 policy sample을 평가할 수 있을 때"],
  ["DPO", "Pair", "필요", "Offline", "정제된 chosen·rejected pair가 있을 때"],
  ["ORPO", "Pair + SFT", "없음", "Offline", "SFT와 preference를 한 stage로 묶을 때"],
  ["KTO", "Binary", "필요*", "Offline", "독립적인 like/dislike log가 중심일 때"],
] as const;

export default function MethodChoiceViz() {
  return (
    <figure data-viz="method-choice" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-sm font-bold">선택 기준은 benchmark 순위보다 data·loop 계약이다</p>
      </figcaption>
      <div className="space-y-3 p-4 sm:p-6">
        {methods.map(([name, data, reference, loop, fit]) => (
          <div key={name} className="grid min-w-0 gap-2 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[4rem_8rem_5rem_5rem_minmax(0,1fr)] sm:items-center sm:gap-4">
            <p className="font-mono text-sm font-black text-primary">{name}</p>
            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground sm:hidden">Data · </span>{data}</p>
            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground sm:hidden">Reference · </span>{reference}</p>
            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground sm:hidden">Loop · </span>{loop}</p>
            <p className="text-xs leading-5 text-foreground/75">{fit}</p>
          </div>
        ))}
      </div>
      <p className="border-t border-border/60 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">* 표준 KTO는 reference policy와 KL reference point를 사용합니다. 논문의 reference-free ablation과 구분해야 합니다.</p>
    </figure>
  );
}
