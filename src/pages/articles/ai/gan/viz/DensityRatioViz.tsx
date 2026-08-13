import VizFrame from "@/components/viz/VizFrame";

const regions = [["real ≫ fake","D*(x) → 1","generator가 덜 덮은 영역"],["real = fake","D*(x) = 1/2","분류로 구분할 정보가 없음"],["fake ≫ real","D*(x) → 0","generator가 과도하게 보낸 영역"]] as const;

export default function DensityRatioViz(){return <VizFrame eyebrow="Optimal discriminator" title="Discriminator의 이상적 출력은 real 확률 자체보다 두 density의 비율입니다" description="같은 x에서 real과 generated density가 차지하는 상대 비중을 분류 문제로 추정합니다."><div className="grid gap-4 md:grid-cols-3">{regions.map(([name,value,meaning])=><div key={name} className="min-w-0 rounded-lg border border-border/70 bg-background p-4"><p className="font-mono text-xs font-bold text-primary">{name}</p><p className="mt-3 text-base font-bold text-foreground">{value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{meaning}</p></div>)}</div></VizFrame>}
