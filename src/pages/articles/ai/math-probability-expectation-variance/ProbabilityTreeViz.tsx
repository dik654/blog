import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
const labels=["네 기록","정확히 한 번","첫 결과는 앞","적어도 한 번"];
const records=["앞 · 앞","앞 · 뒤","뒤 · 앞","뒤 · 뒤"];
const details=["네 기록의 비중은 각각 1/4이며 합은 1입니다. 아직 어떤 정보로도 기록을 제외하지 않았습니다.","정확히 한 번 앞면인 두 칸을 굵게 표시합니다. 비중의 합은 1/4+1/4=1/2입니다.","첫 결과가 앞면인 위쪽 두 칸만 남습니다. 새 전체 안에서는 각각 1/2이며 원하는 칸은 그중 하나입니다.","뒤·뒤만 제외하면 세 칸이 남습니다. 새 전체 안에서는 각각 1/3이며 원하는 두 칸의 합은 2/3입니다."];
export default function ProbabilityTreeViz(){const c=useAnimatedScenes(labels.length);return <VizFrame eyebrow="같은 네 기록 · 바뀌는 정보" title="어느 칸을 남기고 무엇으로 나누는가" description="각 장면의 네 칸은 같은 기록을 나타냅니다. 흐린 칸은 비교에서 빠지고 굵은 테두리는 정확히 한 번 앞면인 기록을 가리킵니다." note="각 던짐의 앞뒤가 반반이고 첫 결과가 다음의 기회를 바꾸지 않는다고 정한 가정 사례입니다.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="네 기록의 조건별 비중" onKeyDown={c.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 265" className="mx-auto block w-full max-w-[480px]" role="img" aria-label={details[c.active]}>
{records.map((r,i)=>{const keep=c.active<2||(c.active===2?i<2:i!==3),target=(i===1||i===2)&&c.active>0;const x=20+(i%2)*150,y=18+Math.floor(i/2)*118;const fraction=c.active===2?"1/2":c.active===3?"1/3":"1/4";return <g key={r} opacity={keep?1:.2}><rect x={x} y={y} width="130" height="92" rx="4" fill="none" stroke={target?"var(--primary)":"currentColor"} strokeWidth={target?2:1}/><text x={x+65} y={y+28} textAnchor="middle" fontSize="14" fill="currentColor">{r}</text><text x={x+65} y={y+54} textAnchor="middle" fontSize="16" fill="currentColor">{keep?fraction:"제외"}</text><text x={x+65} y={y+76} textAnchor="middle" fontSize="10" fill="currentColor">{target?"정확히 한 번 앞면":" "}</text></g>})}
<text x="160" y="255" textAnchor="middle" fontSize="11" fill="currentColor">남은 칸의 비중 합 = 1</text>
</svg>
<p className="min-h-[7rem] text-sm leading-7" aria-live="polite">{details[c.active]}</p>
<AnimatedSceneControls {...c} labels={labels}/>
</div></VizFrame>;}
