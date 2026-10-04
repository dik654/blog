import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export function cc70RegisterBound(registers:number,threads:number){
 const perWarp=Math.ceil(registers*32/256)*256;
 const warpCapacity=4*Math.floor(16384/perWarp);
 const warpsPerBlock=Math.ceil(threads/32);
 const blocks=Math.min(Math.floor(warpCapacity/warpsPerBlock),Math.floor(64/warpsPerBlock),32);
 return {perWarp,warpCapacity,warpsPerBlock,blocks,warps:blocks*warpsPerBlock,percent:100*blocks*warpsPerBlock/64};
}
const inputs=[[37,128],[37,320],[96,256]] as const;
const labels=["37칸 · 128명","37칸 · 320명","96칸 · 256명"];
const notes=["32명 단위의 자리를 48개 확보합니다. 4개씩 묶은 일을 12개 놓을 수 있습니다.","같은 공간이지만 10개씩 묶어야 합니다. 4묶음이 들어가고 남은 8자리에는 다음 10자리 묶음이 들어가지 못합니다.","한 사람이 96칸을 붙잡으면 32명 단위 자리는 20개까지입니다. 8개씩 묶어 놓으면 2묶음, 16자리를 사용합니다."];
export default function AllocationPackingViz(){const scenes=useAnimatedScenes(3,2400);const [r,t]=inputs[scenes.active];const x=cc70RegisterBound(r,t);return <figure data-viz="register-allocation" className="my-8 border-y border-border py-4">
<figcaption className="mb-3 text-sm leading-6">한 구역의 64자리 중 몇 자리를 함께 사용할 수 있을까요? 작은 사각형 하나는 32명 분량입니다.</figcaption>
<div data-viz-canvas tabIndex={0} role="group" aria-label="저장량과 묶음 크기의 배치 계산" onKeyDown={scenes.onKeyDown} className="flex h-[min(650px,calc(100dvh-140px))] min-h-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<div className="min-h-0 flex-1 overflow-y-auto py-2">
<p className="text-sm font-semibold">{labels[scenes.active]}</p>
<div className="my-4 grid grid-cols-4 gap-4" aria-label={`${x.warps}개 사용, ${x.warpCapacity-x.warps}개 묶음 때문에 남음`}>
{[0,1,2,3].map(part=><div key={part}><p className="mb-2 text-center text-xs">공간 {part+1}</p><div className="grid grid-cols-2 gap-1">{Array.from({length:16},(_,i)=><span key={i} className={`flex h-5 items-center justify-center border text-[10px] ${i<x.warps/4?'border-primary bg-primary/15':i<x.warpCapacity/4?'border-primary border-dashed':'border-border bg-muted/20'}`}>{i<x.warps/4?'●':i<x.warpCapacity/4?'○':'—'}</span>)}</div></div>)}
</div>
<p className="text-xs leading-6">● 사용 · ○ 남았지만 묶음이 못 들어감 · — 저장량 한도</p>
<p className="mt-3 font-mono text-sm">{x.blocks}묶음 × {x.warpsPerBlock}자리 = {x.warps}/64 → {x.percent}%</p>
<p className="mt-3 min-h-24 text-sm leading-6">{notes[scenes.active]}</p>
</div><AnimatedSceneControls {...scenes} labels={labels}/>
</div></figure>}
export function RegisterOccupancyCurve(){const data=Array.from({length:128},(_,i)=>({r:i+1,p:cc70RegisterBound(i+1,128).percent}));return <figure className="my-8 border-y border-border py-4"><figcaption className="mb-4 text-sm leading-6">같은 128명 묶음에서는 필요한 저장량이 늘어도 비율이 매번 줄지는 않습니다. 배정 경계를 넘을 때 계단처럼 떨어집니다. CC 7.0 사례의 register·warp·block 한도만 계산했습니다.</figcaption><div className="h-64 w-full" aria-label="thread당 register1부터128까지의 조건부 occupancy 계단 그래프"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{left:0,right:14,top:8,bottom:14}}><CartesianGrid vertical={false} stroke="var(--border)"/><XAxis dataKey="r" type="number" domain={[1,128]} ticks={[1,32,64,96,128]} label={{value:"1명당 저장칸",position:"insideBottom",offset:-10}} tick={{fontSize:11}}/><YAxis domain={[0,100]} width={36} ticks={[0,25,50,75,100]} unit="%" tick={{fontSize:11}}/><Tooltip formatter={v=>[`${v}%`,'배치 비율']} labelFormatter={v=>`${v}칸/명`}/><Line type="stepAfter" dataKey="p" stroke="var(--primary)" strokeWidth={1.25} dot={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div></figure>}
