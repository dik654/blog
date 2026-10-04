import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const scenes=[
 {label:"출발",points:[[0,1]],text:"시간 0에서 양은 1입니다. 회색 곡선은 계속 달라지는 감소 속도를 반영한 기준 경로입니다."},
 {label:"첫 이동",points:[[0,1],[.5,.5]],text:"출발점의 초당 −1을 0.5초 동안 유지해 0.5에 갑니다. 같은 시각의 기준값은 약 0.607입니다."},
 {label:"두 번째",points:[[0,1],[.5,.5],[1,.25]],text:"남은 양 0.5에서 초당 −0.5를 사용합니다. 다음 0.5초에 0.25만큼 줄어 최종값은 0.25입니다."},
 {label:"짧게 네 번",points:[[0,1],[.25,.75],[.5,.5625],[.75,.421875],[1,.31640625]],text:"0.25초마다 감소 속도를 다시 읽으면 네 번 뒤 약 0.316입니다. 기준값 약 0.368에 더 가까워집니다."},
 {label:"두 곳 확인",points:[[0,1],[.5,.625],[1,.390625]],text:"출발점과 예상 끝점의 속도를 평균하면 같은 0.5초 간격에서도 0.625, 약 0.391이 됩니다. 각 간격에서 두 번 확인합니다."},
];
export default function DecayStepsViz(){const c=useAnimatedScenes(scenes.length);const s=scenes[c.active];const sx=(x:number)=>42+244*x,sy=(y:number)=>236-190*y;const exact=Array.from({length:51},(_,i)=>{const x=i/50;return `${i?'L':'M'}${sx(x)} ${sy(Math.exp(-x))}`;}).join(' ');return <VizFrame eyebrow="같은 출발점 · 같은 1초" title="속도를 다시 읽는 시점이 경로를 바꾼다" description="가로는 시간, 세로는 남은 양입니다. 점선은 기준 곡선이고 색 선은 계산한 점들을 이은 선입니다." note="초당 감소 속도가 현재 양의 음수인 가정 사례입니다. 두 축의 물리 단위는 다르며 모든 장면에서 같은 눈금을 씁니다.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="감소 경로의 다섯 계산 장면" onKeyDown={c.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 280" className="mx-auto block w-full max-w-[520px]" role="img" aria-label="연속 감소 곡선과 짧은 선분으로 계산한 경로">
<path d="M42 25V236H303" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5"/>
{[0,.25,.5,.75,1].map((n,i)=><g key={i}><path d={`M${sx(n)} 236v4M38 ${sy(n)}h4`} stroke="currentColor" strokeWidth="1" opacity=".35"/><text x={sx(n)} y="255" textAnchor="middle" fontSize="10" fill="currentColor">{n}</text><text x="33" y={sy(n)+4} textAnchor="end" fontSize="10" fill="currentColor">{n}</text></g>)}
<text x="45" y="17" fontSize="11" fill="currentColor">남은 양</text><text x="284" y="275" textAnchor="end" fontSize="11" fill="currentColor">시간(초)</text>
<path d={exact} fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 3" opacity=".55"/>
<path d={s.points.map(([x,y],i)=>`${i?'L':'M'}${sx(x)} ${sy(y)}`).join(' ')} fill="none" stroke="var(--primary)" strokeWidth="1.25"/>
{s.points.map(([x,y],i)=><circle key={i} cx={sx(x)} cy={sy(y)} r="4" fill="var(--primary)"/>)}
<text x="184" y="39" fontSize="10" fill="currentColor">기준 끝값 ≈ 0.368</text>
</svg>
<p className="min-h-[7rem] text-sm leading-7" aria-live="polite">{s.text}</p><AnimatedSceneControls {...c} labels={scenes.map(x=>x.label)}/>
</div></VizFrame>;}
