import StepViz from "@/components/ui/step-viz";

const methods = [
  { name: "SGD", state: "없음", signal: "현재 mini-batch gradient", scale: "global η", caveat: "noise와 curvature에 직접 노출" },
  { name: "Momentum", state: "velocity 1개", signal: "과거 방향의 weighted sum", scale: "global η", caveat: "β convention과 damping 확인" },
  { name: "Adam", state: "m · v 2개", signal: "direction EMA · squared scale", scale: "coordinate-wise", caveat: "v는 variance가 아님" },
  { name: "AdamW", state: "m · v 2개", signal: "Adam + separate shrink", scale: "coordinate-wise", caveat: "decay parameter group 확인" },
] as const;
const steps = methods.map((method) => `${method.name} — state와 scale을 기준으로 보기`);

export default function OptimizerViz(){return <StepViz steps={steps}>{active=><div className="w-full max-w-4xl"><div className="grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/60 md:grid-cols-4">{methods.map((method,index)=><section key={method.name} className={`min-w-0 bg-background p-5 transition-opacity ${index===active?"opacity-100":"opacity-35"}`}><p className="font-mono text-[10px] font-bold text-primary">0{index+1}</p><p className="mt-4 text-base font-bold">{method.name}</p><dl className="mt-5 space-y-4 text-xs"><div><dt className="font-bold text-muted-foreground">저장 state</dt><dd className="mt-1 leading-5">{method.state}</dd></div><div><dt className="font-bold text-muted-foreground">사용 signal</dt><dd className="mt-1 leading-5">{method.signal}</dd></div><div><dt className="font-bold text-muted-foreground">step scale</dt><dd className="mt-1 leading-5">{method.scale}</dd></div></dl><p className="mt-5 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">{method.caveat}</p></section>)}</div></div>}</StepViz>}
