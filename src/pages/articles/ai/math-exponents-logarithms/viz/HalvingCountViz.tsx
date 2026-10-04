import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const scenes=[{label:"시작",value:"1",detail:"아직 절반으로 줄이지 않았습니다. 남은 양은 1이고 횟수는 0입니다."},{label:"한 번",value:"1/2",detail:"처음의 절반이 남았습니다. 양은 1/2이고 횟수는 1입니다."},{label:"두 번",value:"1/4",detail:"앞의 1/2에서 다시 절반만 남습니다. 양은 1/4이고 횟수는 2입니다."},{label:"세 번",value:"1/8",detail:"남은 양은 1/8입니다. 세 번의 절반 줄이기를 더해 횟수는 1+1+1=3입니다."}] as const;
export default function HalvingCountViz(){const c=useAnimatedScenes(scenes.length);return <VizFrame eyebrow="같은 변화를 두 눈금으로 기록" title="남은 양은 곱하고 횟수는 더한다" description="위 막대의 전체 길이는 항상 1입니다. 아래는 같은 비율의 변화를 한 칸씩 셉니다." note="배율이 1/2일 때의 가정 사례입니다. 아래 눈금의 수를 확률로 읽지 않습니다.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="절반으로 줄이는 네 장면" onKeyDown={c.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 230" className="mx-auto mt-4 block w-full max-w-[420px]" role="img" aria-label="길이가 절반씩 줄어드는 막대와 일정하게 늘어나는 횟수 눈금">
<g fontSize="13" fill="currentColor"><text x="20" y="25">남은 양</text><text x="300" y="25" textAnchor="end">{scenes[c.active].value}</text></g>
<rect x="20" y="45" width="280" height="28" fill="none" stroke="currentColor" strokeWidth="1" opacity=".3"/>
<rect x="20" y="45" width={280/2**c.active} height="28" fill="var(--primary)" opacity=".3"/>
<g stroke="currentColor" strokeWidth="1" opacity=".4">{[0,1,2,3].map(n=><line key={n} x1={20+280/2**n} y1="78" x2={20+280/2**n} y2="84"/>)}</g>
<g fontSize="11" fill="currentColor"><text x="300" y="100" textAnchor="middle">1</text><text x="160" y="100" textAnchor="middle">1/2</text><text x="90" y="100" textAnchor="middle">1/4</text><text x="55" y="100" textAnchor="middle">1/8</text><text x="20" y="130" fontSize="13">절반으로 줄인 횟수</text></g>
<line x1="30" y1="163" x2="285" y2="163" stroke="currentColor" strokeWidth="1" opacity=".4"/>
{[0,1,2,3].map(n=><g key={n}><line x1={30+85*n} y1="158" x2={30+85*n} y2="169" stroke="currentColor" strokeWidth="1"/><text x={30+85*n} y="192" fill="currentColor" fontSize="12" textAnchor="middle">{n}</text></g>)}
<circle cx={30+85*c.active} cy="163" r="5" fill="var(--primary)"/>
</svg>
<p className="min-h-[6rem] text-sm leading-7" aria-live="polite">{scenes[c.active].detail}</p>
<AnimatedSceneControls {...c} labels={scenes.map(s=>s.label)}/>
</div></VizFrame>;}
