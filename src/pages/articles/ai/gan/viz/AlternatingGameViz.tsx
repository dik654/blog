import VizFrame from "@/components/viz/VizFrame";

const steps = [["D step","fake = G(z).detach()","real/fake boundary update"],["G step","freeze D parameters","gradient는 D를 지나 G로 전달"],["Evaluate","fresh fixed seeds","quality·coverage·dynamics 기록"]] as const;

export default function AlternatingGameViz(){return <VizFrame eyebrow="Two-player loop" title="Detach와 freeze는 같은 말이 아닙니다" description="D를 학습할 때는 fake graph를 끊고, G를 학습할 때는 D weight update만 막되 input gradient 경로는 유지합니다."><div className="grid gap-4 md:grid-cols-3">{steps.map(([title,code,body],i)=><div key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4"><span className="font-mono text-xs font-bold text-primary">0{i+1}</span><p className="mt-3 text-sm font-bold text-foreground">{title}</p><p className="mt-2 break-words font-mono text-xs text-primary">{code}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div></VizFrame>}
