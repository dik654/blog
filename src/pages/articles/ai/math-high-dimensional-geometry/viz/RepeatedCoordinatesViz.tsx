import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const scenes=[{label:"거리 보존",factor:2,detail:"네 칸의 합을 2로 나누면 0, 2, 4, 6입니다. 위아래의 여섯 점 쌍이 같은 거리를 가집니다."},{label:"첫 칸만",factor:1,detail:"첫 칸만 고르면 0, 1, 2, 3입니다. 순서는 남지만 모든 거리가 절반입니다."},{label:"두 칸 차이",factor:0,detail:"첫 칸에서 둘째 칸을 빼면 모두 0입니다. 서로 다른 네 점이 겹쳐 입력을 구분할 수 없습니다."}] as const;
export default function RepeatedCoordinatesViz(){const c=useAnimatedScenes(scenes.length);return <VizFrame eyebrow="같은 점 네 개 · 같은 거리 눈금" title="한 칸을 남기는 규칙에 따라 거리가 달라진다" description="윗줄은 원래 직선의 거리이고 아랫줄은 변환한 숫자입니다. 좌우 눈금의 배율은 같습니다." note="첫 점은 0, 나머지 점은 같은 값을 네 칸에 복사한 가정 사례입니다. 겹친 점은 작은 동심원으로 표시합니다.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="네 점의 사영 세 장면" onKeyDown={c.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 260" className="mx-auto mt-4 block w-full max-w-[480px]" role="img" aria-label="동일한 거리 눈금에서 입력과 출력 네 점의 간격 비교">
<g fontSize="12" fill="currentColor"><text x="24" y="24">원래 네 칸의 점들</text><text x="24" y="148">한 칸으로 줄인 결과</text></g>
{[65,188].map(y=><g key={y}><line x1="28" x2="292" y1={y} y2={y} stroke="currentColor" strokeWidth="1" opacity=".35"/>{[0,1,2,3,4,5,6].map(n=><g key={n}><line x1={34+42*n} x2={34+42*n} y1={y-4} y2={y+5} stroke="currentColor" strokeWidth="1" opacity=".4"/><text x={34+42*n} y={y+25} textAnchor="middle" fontSize="11" fill="currentColor">{n}</text></g>)}</g>)}
{[0,1,2,3].map(t=><g key={t}><line x1={34+84*t} x2={34+42*t*scenes[c.active].factor} y1="100" y2="165" stroke="currentColor" strokeWidth="1" opacity=".2"/><circle cx={34+84*t} cy="65" r="4" fill="currentColor"/><circle cx={34+42*t*scenes[c.active].factor} cy="188" r={scenes[c.active].factor===0?3+t*2:4} fill={scenes[c.active].factor===0?"none":"var(--primary)"} stroke="var(--primary)" strokeWidth="1"/></g>)}
<text x="160" y="247" textAnchor="middle" fontSize="11" fill="currentColor">좌우 한 눈금 = 거리 1</text>
</svg>
<p className="min-h-[6rem] text-sm leading-7" aria-live="polite">{scenes[c.active].detail}</p>
<AnimatedSceneControls {...c} labels={scenes.map(s=>s.label)}/>
</div></VizFrame>;}
