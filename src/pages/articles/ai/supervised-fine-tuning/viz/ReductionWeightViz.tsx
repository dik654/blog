import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #response-loss 두 번째 식 — 유효 token 1개·loss 2인 짧은 답과 유효 token 9개·loss 0인 긴 답.
 * token mean: token 하나 weight 1/10 → 짧은 답 몫 0.1, 긴 답 몫 0.9 → 0.1×2 + 0.9×0 = 0.2.
 * example mean: 답 하나 weight 1/2 → 짧은 token 0.5, 긴 답 token 0.5/9 → 0.5×2 + 0.5×0 = 1.0.
 */
const SHORT_LOSS = 2;
const LONG_TOKENS = 9;

const ROWS = [
  {
    label: "Token mean",
    rule: "token 10개가 1/10씩",
    shortWeight: 1 / (1 + LONG_TOKENS),
    result: "0.1 × 2 + 0.9 × 0 = 0.2",
  },
  {
    label: "Example mean",
    rule: "답 2개가 1/2씩",
    shortWeight: 1 / 2,
    result: "0.5 × 2 + 0.5 × 0 = 1.0",
  },
] as const;

const SHORT_COLOR = "#dc2626";
const LONG_COLOR = "#94a3b8";

export default function ReductionWeightViz() {
  return (
    <VizFrame
      eyebrow="Loss reduction"
      title="같은 두 답도 평균 내는 방식에 따라 각 답이 차지하는 몫이 달라집니다"
      description="막대 전체가 batch loss에 들어가는 weight 1입니다. 칸 하나가 채점되는 response token 하나이고, 칸 폭이 그 token이 받는 weight입니다."
      note="짧은 답은 유효 token 1개의 loss가 2, 긴 답은 유효 token 9개의 loss가 모두 0인 본문의 예입니다. 두 reduction 모두 유효한 선택이며 어느 쪽을 쓸지 계약으로 고정합니다."
    >
      <div className="space-y-6">
        {ROWS.map((row) => {
          const longWeight = (1 - row.shortWeight) / LONG_TOKENS;
          return (
            <div key={row.label} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-sm font-bold">{row.label}</h4>
                <span className="text-xs text-muted-foreground">{row.rule}</span>
              </div>
              <div className="mt-2 flex h-9 w-full min-w-0 overflow-hidden rounded-md border border-border" role="img" aria-label={`${row.label}: 짧은 답 weight ${row.shortWeight}, 긴 답 weight ${1 - row.shortWeight}`}>
                <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ width: `${row.shortWeight * 100}%`, backgroundColor: SHORT_COLOR }}>
                  {row.shortWeight >= 0.3 ? "짧은 답 · loss 2" : "2"}
                </div>
                {Array.from({ length: LONG_TOKENS }, (_, index) => (
                  <div key={index} className="h-full border-l border-white" style={{ width: `${longWeight * 100}%`, backgroundColor: LONG_COLOR }} />
                ))}
              </div>
              <div className="mt-1.5 flex text-[11px] text-muted-foreground">
                <span style={{ width: `${row.shortWeight * 100}%` }} className="min-w-0 shrink-0 font-mono">{Math.round(row.shortWeight * 100)}%</span>
                <span className="min-w-0 flex-1 text-right">긴 답 token 9개 · loss 0 · 합 {Math.round((1 - row.shortWeight) * 100)}%</span>
              </div>
              <p className="mt-2 font-mono text-sm font-bold" style={{ color: SHORT_COLOR }}>{row.result}</p>
            </div>
          );
        })}
        <p className="text-xs leading-5 text-muted-foreground">
          Token mean에서는 긴 답이 weight의 90%를 가져가 batch loss가 0.2로 낮게 보입니다. Example mean에서는 짧은 답의 loss 2가 절반 weight를 받아 1.0이 됩니다. 짧은 답의 loss {SHORT_LOSS}는 그대로인데 그 답에 주는 gradient weight가 달라졌습니다.
        </p>
      </div>
    </VizFrame>
  );
}
