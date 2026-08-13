import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./MultilayerVizData";

const rows = [
  { input: "(0,0)", nand: 1, or: 0, xor: 0 },
  { input: "(0,1)", nand: 1, or: 1, xor: 1 },
  { input: "(1,0)", nand: 1, or: 1, xor: 1 },
  { input: "(1,1)", nand: 0, or: 1, xor: 0 },
];

function Flow() {
  const blocks = [["입력", "x₁, x₂"], ["은닉 feature 1", "NAND(x)"], ["은닉 feature 2", "OR(x)"], ["출력", "AND(h₁,h₂)"]];
  return <div className="grid gap-3 sm:grid-cols-4">{blocks.map(([name,value],i)=><div key={name} className="relative rounded-xl border border-border/75 bg-background p-4"><p className="text-xs text-muted-foreground">{name}</p><p className="mt-2 font-mono text-sm font-semibold">{value}</p>{i<3&&<span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 bg-background px-1 text-muted-foreground sm:block">→</span>}</div>)}</div>;
}

export default function MultilayerViz() {
  return <StepViz steps={STEPS}>{(step)=><div className="w-full max-w-4xl">{step===0?<div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-rose-500/30 bg-background p-5"><p className="text-xs font-semibold text-rose-600">입력 공간</p><p className="mt-2 text-lg font-semibold">XOR은 한 half-space가 아니다</p><p className="mt-3 text-sm leading-6 text-muted-foreground">affine score 하나와 step function 하나로는 대각선 positive pattern을 만들 수 없습니다.</p></div><div className="rounded-xl border border-border/75 bg-background p-5"><p className="text-xs font-semibold text-primary">필요한 변화</p><p className="mt-2 text-lg font-semibold">입력을 새 feature로 다시 표현한다</p><p className="mt-3 text-sm leading-6 text-muted-foreground">두 은닉 경계의 출력을 다음 층이 받으면 결정 영역을 조합할 수 있습니다.</p></div></div>:step===1?<><Flow/><div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs"><span className="text-muted-foreground">input</span><span>NAND</span><span>OR</span><span className="font-semibold">XOR</span>{rows.flatMap(r=>[r.input,r.nand,r.or,r.xor]).map((v,i)=><span key={i} className="rounded-lg border border-border/65 bg-background px-2 py-2 font-mono">{v}</span>)}</div></>:<div className="rounded-xl border border-border/75 bg-background p-6"><p className="text-xs font-semibold text-primary">표현 가능성 ≠ 학습 보장</p><h4 className="mt-2 text-lg font-semibold">충분한 hidden unit은 넓은 함수 집합을 근사할 수 있다</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">Universal approximation theorem은 특정 activation과 compact domain 같은 조건 아래의 표현 가능성을 말합니다. 필요한 width, sample 수, optimizer가 그 해를 찾는 시간까지 보장하지 않습니다.</p></div>}</div>}</StepViz>;
}
