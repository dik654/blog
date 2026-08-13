import VizFrame from "@/components/viz/VizFrame";

const losses = [["Minimax generator","min log(1−D(G(z)))","D가 fake를 확신하면 signal이 약해짐"],["Non-saturating generator","min −log D(G(z))","같은 equilibrium, 초기 gradient 강화"]] as const;

export default function GradientSignalViz(){return <VizFrame eyebrow="Generator objective" title="목표 지점이 같아도 그곳으로 가는 gradient field는 다릅니다" description="Non-saturating loss는 별도 GAN family가 아니라 original paper가 제안한 practical generator update입니다."><div className="grid gap-4 md:grid-cols-2">{losses.map(([name,formula,note])=><div key={name} className="min-w-0 rounded-lg border border-border/70 bg-background p-5"><p className="text-xs font-bold text-primary">{name}</p><p className="mt-3 break-words font-mono text-sm font-semibold text-foreground">{formula}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p></div>)}</div></VizFrame>}
