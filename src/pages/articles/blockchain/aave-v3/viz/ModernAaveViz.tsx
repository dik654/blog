import StepViz from "@/components/ui/step-viz";

type Mode = "pool" | "index" | "rate" | "liquidation" | "risk";

const FLOWS: Record<Mode, { body: string; cards: [string, string, string][] }> = {
  pool: { body: "Reserve별 cash·debt·indexes·risk configuration을 Pool이 조정하되 실제 parameter는 deployment와 governance snapshot에 속합니다.", cards: [["SUPPLY", "underlying in", "scaled aToken"], ["BORROW", "liquidity out", "scaled variable debt"], ["RISK", "account data", "LTV · HF · caps"]] },
  index: { body: "사용자별 scaled balance는 고정하고 reserve index를 전진시켜 많은 계정의 현재 balance를 한 번에 표현합니다.", cards: [["STORE", "scaled balance", "principal-like units"], ["ACCRUE", "reserve index", "ray math"], ["READ", "current balance", "scaled × index"]] },
  rate: { body: "Utilization이 optimal point 아래에서는 완만하고 위에서는 slope2가 적용됩니다. 숫자는 reserve별 governance configuration입니다.", cards: [["MEASURE", "usage ratio", "debt/(available+debt)"], ["PRICE", "borrow rate", "base+slope"], ["DISTRIBUTE", "liquidity rate", "rate×usage×(1−RF)"]] },
  liquidation: { body: "Oracle value와 weighted liquidation threshold로 HF를 계산하고, source version의 close-factor 규칙과 collateral bonus를 적용합니다.", cards: [["VALUE", "collateral/debt", "oracle + decimals"], ["CHECK", "health factor", "threshold value / debt"], ["SETTLE", "repay + seize", "close factor · bonus · fee"]] },
  risk: { body: "E-Mode와 isolation은 더 높은 효율 또는 제한된 exposure를 주는 별도 configuration gate이며 모든 asset 조합에 자동 적용되지 않습니다.", cards: [["SELECT", "mode/category", "deployment config"], ["VALIDATE", "asset compatibility", "caps · debt ceiling"], ["OPERATE", "supply/borrow", "mode-bound account data"]] },
};

export default function ModernAaveViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const steps = flow.cards.map(([label, title, detail]) => ({ label: title, body: `${label}: ${detail}` }));
  return <StepViz steps={steps}>{(step) => <div className="grid min-w-0 gap-3 md:grid-cols-3">{flow.cards.map(([eyebrow,title,detail], index) => <div key={title} className={`min-w-0 rounded-lg border p-4 ${step === index ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"}`}><p className="text-[10px] font-bold tracking-wide text-primary">{eyebrow}</p><p className="mt-2 break-words text-sm font-bold">{title}</p><code className="mt-3 block max-w-full break-all rounded-md border bg-background px-2 py-1 text-[11px]">{detail}</code></div>)}<p className="md:col-span-3 text-xs leading-5 text-muted-foreground">{flow.body}</p></div>}</StepViz>;
}
