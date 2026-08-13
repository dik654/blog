import VizFrame from "@/components/viz/VizFrame";

export default function ExpectationBalanceViz() {
  const values = [{x:0,p:0.25},{x:1,p:0.5},{x:2,p:0.25}];
  return <VizFrame eyebrow="Probability-weighted center" title="Expectation은 가장 자주 나오는 값이 아니라 mass의 무게중심입니다"><div className="mx-auto max-w-2xl"><div className="grid grid-cols-3 gap-4">{values.map(item=><div key={item.x} className="text-center"><div className="mx-auto flex h-24 items-end justify-center"><div className="w-10 rounded-t-sm bg-primary/65" style={{height:`${item.p*150}px`}} /></div><p className="mt-2 font-mono text-sm font-bold">x={item.x}</p><p className="text-xs text-muted-foreground">p={item.p}</p></div>)}</div><div className="relative mt-7 h-px bg-border"><span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-primary" /><span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-primary">E[X]=1</span></div></div></VizFrame>;
}
