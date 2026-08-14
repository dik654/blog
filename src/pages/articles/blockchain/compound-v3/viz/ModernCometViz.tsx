import StepViz from "@/components/ui/step-viz";

type Mode = "market" | "principal" | "rate" | "liquidation";

const FLOWS: Record<Mode, { body: string; cards: [string, string, string][] }> = {
  market: { body: "Comet instance마다 base asset 하나를 공급·차입하고 collateral assets는 차입 한도와 청산 판정에만 기여합니다.", cards: [["BASE +", "supply", "earns supply rate"], ["BASE −", "borrow", "pays borrow rate"], ["COLLATERAL", "risk support", "no lending interest"]] },
  principal: { body: "하나의 signed principal을 supply/borrow index 중 부호에 맞는 index로 현재가치화합니다. 0을 건너면 repay와 supply가 한 operation에서 분리됩니다.", cards: [["POSITIVE", "supply principal", "p × supplyIndex"], ["ZERO", "repay boundary", "borrow → 0"], ["NEGATIVE", "borrow principal", "−|p| × borrowIndex"]] },
  rate: { body: "Supply와 borrow에 독립 kink curve가 있고 utilization은 base borrow present value / base supply present value입니다.", cards: [["UTILIZE", "base market", "borrows/supply"], ["BORROW", "borrow curve", "own base/kink/slopes"], ["SUPPLY", "supply curve", "own base/kink/slopes"]] },
  liquidation: { body: "isLiquidatable은 liquidation factor를 사용합니다. absorb가 debt와 collateral을 protocol balance sheet로 옮긴 뒤 reserves gate가 열릴 때 별도 buyer가 collateral을 삽니다.", cards: [["CHECK", "liquidity sum", "liq factors"], ["ABSORB", "protocol reserves", "debt + collateral"], ["SELL", "buyCollateral", "discount · minAmount"]] },
};

export default function ModernCometViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const steps = flow.cards.map(([label,title,detail]) => ({ label: title, body: `${label}: ${detail}` }));
  return <StepViz steps={steps}>{(step) => <div className="grid min-w-0 gap-3 md:grid-cols-3">{flow.cards.map(([eyebrow,title,detail], index) => <div key={title} className={`min-w-0 rounded-lg border p-4 ${step === index ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"}`}><p className="text-[10px] font-bold tracking-wide text-primary">{eyebrow}</p><p className="mt-2 break-words text-sm font-bold">{title}</p><code className="mt-3 block max-w-full break-all rounded-md border bg-background px-2 py-1 text-[11px]">{detail}</code></div>)}<p className="md:col-span-3 text-xs leading-5 text-muted-foreground">{flow.body}</p></div>}</StepViz>;
}
