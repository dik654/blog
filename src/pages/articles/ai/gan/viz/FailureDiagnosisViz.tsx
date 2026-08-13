import VizFrame from "@/components/viz/VizFrame";

const cells = [["High quality / High coverage","목표","다양한 mode가 선명함"],["High quality / Low coverage","mode dropping","선명하지만 비슷한 sample 반복"],["Low quality / High coverage","underfit/noise","다양하지만 data manifold와 멂"],["Low quality / Low coverage","training failure","artifact와 반복이 함께 나타남"]] as const;

export default function FailureDiagnosisViz(){return <VizFrame eyebrow="Failure diagnosis" title="Realism과 coverage는 한 축으로 합치면 안 됩니다" description="좋아 보이는 cherry-picked sample만으로는 mode collapse를 발견할 수 없습니다."><div className="grid gap-3 sm:grid-cols-2">{cells.map(([title,label,body])=><div key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4"><p className="text-xs font-bold text-primary">{label}</p><p className="mt-2 text-sm font-bold leading-6 text-foreground">{title}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div></VizFrame>}
