import {AnimatedSceneControls} from "@/components/viz/AnimatedSceneControls";
import {useAnimatedScenes} from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
const scenes=["원래 100", "한 칸 80", "추가 비용 85", "남는 60"] as const;
const current=[[15,40,35,10,0],[15,20,35,10,0],[15,20,35,10,5],[15,0,35,10,0]];
const notes=[
"(가정) 네 일이 겹치지 않고 15→40→35→10 ms로 이어집니다. 결과는 100 ms에 도착합니다.",
"관계 계산만 40에서 20 ms로 줄입니다. 나머지 60 ms는 같아서 전체는 80 ms, 가속은 1.25 배입니다.",
"같은 개선에 준비 5 ms가 추가되면 85 ms입니다. 바뀐 계산과 함께 새 비용도 세어야 합니다.",
"관계 계산을 0에 가깝게 줄여도 남은 60 ms는 그대로입니다. 다른 구간이 변하지 않을 때의 극한입니다."
];
const labels=["확인","관계","변환","전송","추가"];
function Row({values,y,title}:{values:number[];y:number;title:string}){let x=40;return <g><text x={8} y={y-10} fontSize={11} fill="currentColor">{title}</text>{values.map((v,i)=>{const start=x;x+=v*2;if(!v)return null;return <g key={i}><rect x={start} y={y} width={v*2} height={28} fill="var(--primary)" fillOpacity={i===1?.38:i===4?.6:.1} stroke="var(--border)" strokeWidth={1}/><text x={start+v} y={y+19} textAnchor="middle" fontSize={11} fill="currentColor">{v}</text></g>})}<text x={x+8} y={y+19} fontSize={11} fill="currentColor">{values.reduce((a,b)=>a+b,0)}ms</text></g>}
export default function OptimizationBudgetViz(){const a=useAnimatedScenes(scenes.length,3500);return <VizFrame eyebrow="한 구간의 개선" title="같은 60 ms를 남겨 두고 비교합니다" description="같은 축에서 한 칸만 줄인 뒤 새 비용을 더합니다. 모든 값은 설명용 가정입니다." note="각 칸은 확인·관계 계산·값 변환·전송 순서입니다. 이 그림에는 동시 실행과 대기가 없으며 측정 결과가 아닙니다."><div data-viz-canvas tabIndex={0} role="group" aria-label="한 구간의 개선과 남는 시간" onKeyDown={a.onKeyDown} className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"><div className="flex min-h-[18rem] flex-1 flex-col justify-center"><p className="text-xs font-bold text-primary">장면 {a.active+1} · {scenes[a.active]}</p><div className="mt-3 w-full"><svg viewBox="0 0 300 165" className="h-[10.5rem] w-full" role="img" aria-label="원래 시간과 변경 후 시간 막대"><Row values={current[0]} y={30} title="기준"/><Row values={current[a.active]} y={93} title="변경"/>{[0,50,100].map(t=><g key={t}><path d={`M${40+t*2} 130v5`} stroke="var(--border)" strokeWidth={1}/><text x={40+t*2} y={150} fontSize={10} textAnchor="middle" fill="currentColor">{t}</text></g>)}<text x={270} y={150} fontSize={10} fill="currentColor">ms</text></svg></div><p className="mt-2 text-xs text-muted-foreground">칸 순서: {labels.join(" · ")}</p><p data-scene-note className="mt-3 border-l border-primary/40 pl-4 text-sm leading-7">{notes[a.active]}</p></div><AnimatedSceneControls {...a} labels={scenes}/></div></VizFrame>}
