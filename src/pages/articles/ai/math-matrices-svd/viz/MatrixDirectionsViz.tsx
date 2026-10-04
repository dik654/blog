import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const scenes=[
{label:"입력",detail:"두 칸의 값을 가로와 세로로 놓으면 (4,2)입니다. 이 점을 만드는 두 이동을 나누어 보겠습니다."},
{label:"나누기",detail:"(3,3)까지 함께 움직인 뒤 (1,−1)만큼 더 갑니다. 도착점은 여전히 (4,2)이며 아직 버린 정보는 없습니다."},
{label:"배율 적용",detail:"함께 가는 이동만 3배인 (9,9)로 늘립니다. 남은 (1,−1)을 더하면 도착점은 (10,8)입니다."},
{label:"하나만 남기기",detail:"(1,−1)을 생략하면 (9,9)가 남습니다. 원래 출력 (10,8)과 비교해 첫 칸은 1 작고 둘째 칸은 1 큽니다."},
] as const;
export default function MatrixDirectionsViz(){
const controller=useAnimatedScenes(scenes.length); const active=controller.active;
const enlarged=active>=2; const common=enlarged?9:3; const end=enlarged?[10,8]:[4,2];
const px=(x:number)=>36+18*x;const py=(y:number)=>240-18*y;
return <VizFrame eyebrow="두 부분으로 같은 계산 추적" title="함께 가는 부분은 3배 · 차이는 1배" description="선택을 바꾸어 두 이동을 이어 보세요. 모든 화면에서 가로·세로의 눈금과 크기는 같습니다." note="두 번째 이동은 첫 이동의 끝으로 옮겨 그렸습니다. 생략 화면의 빈 점은 원래 출력이고 채운 점은 근사 출력입니다.">
<div data-viz-canvas role="group" tabIndex={0} aria-label="두 입력이 두 출력이 되는 네 장면" onKeyDown={controller.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 300 290" className="mx-auto block w-full max-w-[320px]" role="img" aria-label="가로 첫 칸, 세로 둘째 칸으로 그린 입력과 두 성분의 이동">
<g stroke="currentColor" opacity=".15" strokeWidth="1">{[3,6,9].map(n=><g key={n}><line x1={px(n)} y1="30" x2={px(n)} y2="240"/><line x1="36" y1={py(n)} x2="252" y2={py(n)}/></g>)}</g>
<g stroke="currentColor" opacity=".5" strokeWidth="1"><line x1="36" y1="240" x2="257" y2="240"/><line x1="36" y1="240" x2="36" y2="23"/></g>
{active===0?<line x1="36" y1="240" x2={px(4)} y2={py(2)} stroke="var(--primary)" strokeWidth="1.25"/>:<><line x1="36" y1="240" x2={px(common)} y2={py(common)} stroke="var(--primary)" strokeWidth="1.25"/><line x1={px(common)} y1={py(common)} x2={px(end[0])} y2={py(end[1])} stroke="currentColor" strokeWidth="1.25" opacity={active===3?.35:1} strokeDasharray={active===3?"3 3":undefined}/></>}
<circle cx={px(active===3?9:end[0])} cy={py(active===3?9:end[1])} r="3" fill="var(--primary)"/>
{active===3&&<circle cx={px(10)} cy={py(8)} r="3" fill="none" stroke="currentColor" strokeWidth="1"/>}
<g fill="currentColor" fontSize="12"><text x="17" y="259">0</text><text x="241" y="273">첫 칸</text><text x="7" y="17">둘째 칸</text>{[3,6,9].map(n=><g key={n}><text x={px(n)-4} y="259">{n}</text><text x="16" y={py(n)+4}>{n}</text></g>)}
<text x={px(end[0])+8} y={py(end[1])+16}>{enlarged?"(10,8)":"(4,2)"}</text>
{active>0&&<text x={px(common)-42} y={py(common)-12}>{enlarged?"(9,9)":"(3,3)"}</text>}
</g></svg>
<p className="min-h-[6rem] text-sm leading-7" aria-live="polite">{scenes[active].detail}</p>
<AnimatedSceneControls {...controller} labels={scenes.map(s=>s.label)}/>
</div>
</VizFrame>;
}
