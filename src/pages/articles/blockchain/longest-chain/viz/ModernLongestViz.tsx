const trunk = ["A", "B", "C"] as const;
const upper = ["D₁ · 2 work", "E₁ · 2 work"] as const;
const lower = ["D₂ · 5 work"] as const;

function Block({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return <div className={`min-w-[86px] rounded-lg border px-3 py-3 text-center text-xs font-medium ${active ? "border-primary/70 bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground"}`}>{children}</div>;
}

export function ChainWorkViz() {
  return (
    <figure data-viz="pow-chainwork-fork" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">블록 수가 아니라 누적 work로 정하는 canonical branch</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">공통 prefix 뒤 위쪽은 2개 블록, 아래쪽은 1개 블록이지만 아래쪽이 더 큰 work를 담는 toy example입니다.</p>
      </figcaption>
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px]">
          <div className="flex items-center gap-2">
            {trunk.map((block) => <Block key={block}>{block}</Block>)}
            <span className="px-1 text-muted-foreground">→</span>
            <div className="grid gap-3">
              <div className="flex items-center gap-2">{upper.map((block) => <Block key={block}>{block}</Block>)}<span className="text-xs text-muted-foreground">합 4</span></div>
              <div className="flex items-center gap-2">{lower.map((block) => <Block active key={block}>{block}</Block>)}<span className="text-xs font-semibold text-primary">합 5 · 선택</span></div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

const stages = [
  { depth: "0 confirmation", meaning: "head 후보", risk: "자연 fork·reorg에 가장 민감" },
  { depth: "z confirmations", meaning: "뒤에 work 누적", risk: "모델 전제 아래 catch-up 확률 감소" },
  { depth: "deterministic finality", meaning: "PoW longest-chain만으로 없음", risk: "확률이 일반적으로 0이 되지는 않음" },
] as const;

export function ProbabilisticFinalityViz() {
  return (
    <figure data-viz="pow-probabilistic-finality" className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">확인 수는 확정 스위치가 아니라 위험 예산</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">확인 수가 늘면 공격자가 따라잡아야 할 work deficit이 커지지만, 확률적 모델의 전제가 깨지면 숫자도 다시 계산해야 합니다.</p>
      </figcaption>
      <div className="grid gap-3 md:grid-cols-3">
        {stages.map((stage, index) => (
          <div key={stage.depth} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-primary">0{index + 1}</span>
            <p className="mt-2 break-words text-sm font-semibold text-foreground">{stage.depth}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{stage.meaning}</p>
            <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">{stage.risk}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
