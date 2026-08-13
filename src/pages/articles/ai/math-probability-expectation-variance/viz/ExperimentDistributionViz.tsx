import VizFrame from "@/components/viz/VizFrame";

const columns = [
  ["실험", "동전을 두 번 던진다", "아직 결과가 정해지지 않은 절차"],
  ["Outcome", "HT", "한 번 실행해 실제로 나온 결과"],
  ["Random variable", "X(HT)=1", "Outcome을 앞면 수로 변환"],
  ["Distribution", "P(X=1)=1/2", "숫자별 probability mass"],
] as const;

export default function ExperimentDistributionViz() {
  return <VizFrame eyebrow="불확실성을 읽는 네 층" title="실험의 결과와 그 결과에 붙인 숫자를 분리합니다" description="Probability는 outcome에 붙고, random variable은 outcome을 계산 가능한 값으로 바꿉니다."><div className="grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/60 md:grid-cols-4">{columns.map(([label,value,detail],index)=><div key={label} className="min-w-0 bg-background p-5"><p className="font-mono text-[10px] font-bold text-primary">0{index+1} · {label}</p><p className="mt-5 break-words font-mono text-sm font-bold">{value}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">{detail}</p></div>)}</div></VizFrame>;
}
