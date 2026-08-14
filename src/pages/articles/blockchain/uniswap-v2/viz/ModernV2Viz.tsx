import StepViz from "@/components/ui/step-viz";

type Mode = "swap" | "pair" | "router" | "flash";

const FLOWS: Record<Mode, { label: string; body: string; cards: [string, string, string][] }> = {
  swap: {
    label: "수수료 포함 swap",
    body: "입력에서 0.3%를 분리한 유효 입력으로 출력량을 정하고 실제 balance의 adjusted product를 검사합니다.",
    cards: [
      ["BEFORE", "reserve", "x=1,000 · y=1,000"],
      ["QUOTE", "effective input", "100 × 0.997 = 99.7"],
      ["AFTER", "output", "Δy ≈ 90.66 · k 증가"],
    ],
  },
  pair: {
    label: "LP share 회계",
    body: "초기 mint는 기하평균, 이후 mint는 두 reserve 비율 중 작은 몫을 사용해 기존 LP를 희석하지 않습니다.",
    cards: [
      ["DEPOSIT", "token0 + token1", "현재 reserve 비율"],
      ["MINT", "LP shares", "min(Δx·S/x, Δy·S/y)"],
      ["RECEIPT", "pool ownership", "share / totalSupply"],
    ],
  },
  router: {
    label: "Router 실행 경계",
    body: "Quote는 보장이 아니며 사용자가 amountOutMin·deadline·path를 서명한 transaction으로 고정해야 합니다.",
    cards: [
      ["QUOTE", "reserve snapshot", "getAmountsOut(path)"],
      ["BOUND", "user constraints", "min output · deadline"],
      ["SETTLE", "pair balances", "각 hop invariant 검사"],
    ],
  },
  flash: {
    label: "Flash settlement",
    body: "Pair가 먼저 보내고 callback 뒤 입력을 balance 차이로 관측합니다. 같은 transaction 끝에 adjusted invariant가 틀리면 전체가 revert됩니다.",
    cards: [
      ["SEND", "optimistic output", "amount0Out / amount1Out"],
      ["CALLBACK", "external action", "trade · repay"],
      ["VERIFY", "adjusted balances", "product ≥ old reserve product"],
    ],
  },
};

export default function ModernV2Viz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const steps = flow.cards.map(([label, title, detail]) => ({ label: title, body: `${label}: ${detail}` }));

  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="grid min-w-0 gap-3 md:grid-cols-3">
          {flow.cards.map(([eyebrow, title, detail], index) => (
            <div key={title} className={`min-w-0 rounded-lg border p-4 ${step === index ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"}`}>
              <p className="text-[10px] font-bold tracking-wide text-primary">{eyebrow}</p>
              <p className="mt-2 break-words text-sm font-bold">{title}</p>
              <code className="mt-3 block max-w-full break-all rounded-md border bg-background px-2 py-1 text-[11px]">{detail}</code>
            </div>
          ))}
          <p className="md:col-span-3 text-xs leading-5 text-muted-foreground">{flow.label} · {flow.body}</p>
        </div>
      )}
    </StepViz>
  );
}
