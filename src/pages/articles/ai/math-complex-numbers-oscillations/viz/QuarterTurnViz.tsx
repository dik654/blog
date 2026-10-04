import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const points=[[3,4],[-4,3],[-3,-4],[4,-3],[3,4]] as const;
const labels=["출발","한 번","두 번","세 번","네 번"];
const details=["가로 3, 세로 4인 점입니다. 원점에서 길이는 5이며 두 좌표의 단위는 같습니다.","반시계로 한 바퀴의 1/4만큼 돕니다. 새 좌표는 (−4,3)입니다.","같은 이동을 두 번 하면 두 좌표의 부호가 모두 바뀐 (−3,−4)입니다.","세 번 이동한 좌표는 (4,−3)입니다. 두 숫자가 같은 길이의 다른 방향을 나타냅니다.","네 번 이동해 처음 점으로 돌아옵니다. 현재 좌표는 같아도 누적 이동 횟수는 0번과 4번으로 다릅니다."];
export default function QuarterTurnViz(){const c=useAnimatedScenes(5);const [x,y]=points[c.active];const sx=(a:number)=>160+a*21,sy=(b:number)=>150-b*21;const previous=points[Math.max(0,c.active-1)];return <VizFrame eyebrow="같은 점 · 같은 크기의 네 번 이동" title="두 좌표를 함께 바꾸면 길이를 지키며 돈다" description="양쪽 축은 한 칸의 길이가 같습니다. 색 점이 현재 위치이고 가는 선은 가로·세로 좌표를 읽는 길입니다." note="반시계 한 번을 1/4바퀴로 정한 가정 사례입니다. 점의 이동 순서와 누적 횟수를 함께 보세요.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="점의 네 번 회전" onKeyDown={c.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 300" className="mx-auto block w-full max-w-[450px]" role="img" aria-label="원점에서 거리 5인 점이 네 번 회전해 돌아오는 그림">
<circle cx="160" cy="150" r="105" fill="none" stroke="currentColor" strokeWidth="1" opacity=".2"/>
<path d="M24 150H296M160 18V282" stroke="currentColor" strokeWidth="1" opacity=".4"/>
{[-4,-2,2,4].map(n=><g key={n}><path d={`M${sx(n)} 147v6M157 ${sy(n)}h6`} stroke="currentColor" strokeWidth="1" opacity=".35"/><text x={sx(n)} y="168" textAnchor="middle" fontSize="10" fill="currentColor">{n}</text><text x="150" y={sy(n)+4} textAnchor="end" fontSize="10" fill="currentColor">{n}</text></g>)}
<text x="288" y="141" fontSize="11" fill="currentColor">가로</text><text x="171" y="25" fontSize="11" fill="currentColor">세로</text>
{points.slice(0,4).map(([a,b],i)=><circle key={i} cx={sx(a)} cy={sy(b)} r="3" fill="currentColor" opacity=".2"/>)}
{c.active>0&&<path d={`M${sx(previous[0])} ${sy(previous[1])}A105 105 0 0 0 ${sx(x)} ${sy(y)}`} fill="none" stroke="var(--primary)" strokeWidth="1.25"/>}
<path d={`M${sx(x)} 150V${sy(y)}H160`} fill="none" stroke="var(--primary)" strokeWidth="1" strokeDasharray="3 3" opacity=".6"/>
<line x1="160" y1="150" x2={sx(x)} y2={sy(y)} stroke="var(--primary)" strokeWidth="1.25"/>
<circle cx={sx(x)} cy={sy(y)} r="5" fill="var(--primary)"/>
<text x={sx(x)} y={sy(y)+(y>0?-12:22)} textAnchor="middle" fontSize="12" fill="currentColor">({x},{y})</text>
<text x="18" y="24" fontSize="11" fill="currentColor">길이 5 유지</text>
</svg>
<p className="min-h-[7rem] text-sm leading-7" aria-live="polite">{details[c.active]}</p>
<AnimatedSceneControls {...c} labels={labels}/>
</div></VizFrame>;}
