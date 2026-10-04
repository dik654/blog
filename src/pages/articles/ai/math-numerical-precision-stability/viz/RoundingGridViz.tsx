import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const scenes=[
 {input:0,output:0,label:"출발",text:"현재 저장값은 1입니다. 채운 점 사이의 간격은 작은 양 δ의 두 배입니다."},
 {input:1,output:0,label:"한 번 더하기",text:"1+δ는 0번과 1번 자리의 가운데입니다. 짝수인 0번 자리 1을 저장합니다."},
 {input:1,output:0,label:"다시 더하기",text:"저장된 1에서 δ를 다시 더하므로 같은 가운데입니다. 또 1을 저장합니다."},
 {input:2,output:2,label:"먼저 묶기",text:"δ+δ를 먼저 모아 더하면 1+2δ입니다. 1번 자리와 정확히 겹쳐 그 값이 남습니다."},
 {input:3,output:4,label:"옆의 가운데",text:"1+3δ는 1번과 2번 자리의 가운데입니다. 짝수인 2번 자리 1+4δ로 올라갑니다."},
];
export default function RoundingGridViz(){const c=useAnimatedScenes(scenes.length);const s=scenes[c.active];const x=(n:number)=>38+61*n;return <VizFrame eyebrow="같은 입력 · 명시한 저장 시점" title="빈 점에서 가까운 저장 자리로 간다" description="가로축은 1에서 더 간 양을 δ 단위로 표시합니다. 선의 기울기나 화살표 길이는 실행 시간을 뜻하지 않습니다." note="δ=1/2048인 가정 사례입니다. 자리 번호 0·1·2는 여기 보인 이웃 자리의 번호입니다.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="반올림 자리 선택" onKeyDown={c.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 220" className="mx-auto block w-full max-w-[550px]" role="img" aria-label={`${s.label}: 저장 직전 위치 ${s.input}δ, 저장 뒤 위치 ${s.output}δ`}>
<path d="M20 130H300" stroke="currentColor" strokeWidth="1" opacity=".35"/>
{[0,1,2,3,4].map(n=><g key={n}><path d={`M${x(n)} 126v8`} stroke="currentColor" opacity=".3"/><text x={x(n)} y="171" textAnchor="middle" fontSize="11" fill="currentColor">{n===0?"0":`${n}δ`}</text></g>)}
{[0,2,4].map((n,i)=><g key={n}><circle cx={x(n)} cy="130" r="5" fill="currentColor" opacity=".45"/><text x={x(n)} y="198" textAnchor="middle" fontSize="11" fill="currentColor">{i}번 자리</text></g>)}
<path d={`M${x(s.input)} 67L${x(s.output)} 120`} stroke="var(--primary)" strokeWidth="1.25" fill="none"/>
<circle cx={x(s.input)} cy="62" r="6" fill="var(--background)" stroke="var(--primary)" strokeWidth="1.5"/>
<circle cx={x(s.output)} cy="130" r="7" fill="var(--primary)"/>
<text x="160" y="28" textAnchor="middle" fontSize="12" fill="currentColor">저장 전: 1{s.input>0?` + ${s.input}δ`:""}</text>
<text x="160" y="154" textAnchor="middle" fontSize="11" fill="currentColor">1에서 더 간 양</text>
</svg>
<p className="min-h-[7rem] text-sm leading-7" aria-live="polite">{s.text}</p>
<AnimatedSceneControls {...c} labels={scenes.map(v=>v.label)}/>
</div></VizFrame>;}
