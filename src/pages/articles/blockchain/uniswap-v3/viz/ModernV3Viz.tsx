import StepViz from "@/components/ui/step-viz";

type Mode = "range" | "tick" | "position" | "swap";

const FLOWS: Record<Mode, { body: string; cards: [string, string, string][] }> = {
  range: {
    body: "V2의 전 가격 곡선을 position별 [pₐ,pᵦ] 조각으로 겹칩니다. 현재 가격 안에 있는 liquidity만 swap에 참여합니다.",
    cards: [["LEFT", "P ≤ pₐ", "token0 only"], ["ACTIVE", "pₐ < P < pᵦ", "token0 + token1"], ["RIGHT", "P ≥ pᵦ", "token1 only"]],
  },
  tick: {
    body: "Tick은 가격을 1.0001의 정수 지수로 이산화하고 core는 sqrtPriceX96으로 같은 상태를 고정소수점 저장합니다.",
    cards: [["INDEX", "tick i", "P=1.0001ⁱ"], ["ENCODE", "sqrt price", "√P × 2⁹⁶"], ["BOUND", "tick spacing", "initializable ticks only"]],
  },
  position: {
    body: "Position은 owner·lower·upper·liquidity로 식별되고 구간 안 fee growth의 snapshot 차이로 수수료를 계산합니다.",
    cards: [["GLOBAL", "fee growth", "per liquidity · Q128"], ["RANGE", "inside growth", "global−below−above"], ["OWED", "position delta", "L × growth delta"]],
  },
  swap: {
    body: "한 step은 다음 initialized tick 또는 price limit까지만 진행합니다. 경계를 넘으면 liquidityNet을 방향에 맞게 반영하고 반복합니다.",
    cards: [["SEARCH", "next tick", "bitmap word"], ["STEP", "price movement", "amount in/out + fee"], ["CROSS", "liquidity update", "± liquidityNet"]],
  },
};

export default function ModernV3Viz({ mode }: { mode: Mode }) {
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
          <p className="md:col-span-3 text-xs leading-5 text-muted-foreground">{flow.body}</p>
        </div>
      )}
    </StepViz>
  );
}
