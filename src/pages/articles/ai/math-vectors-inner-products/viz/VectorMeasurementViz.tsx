import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const scenes = [
  { label: "전체 이동", detail: "가로 3과 세로 4를 함께 가면 도착점은 (3,4)입니다. 곧장 잰 길이는 5입니다." },
  { label: "가로 부분", detail: "같은 이동에서 가로만 남기면 (3,0)입니다. 원래 길이 5보다 짧은 3이 남습니다." },
  { label: "남은 부분", detail: "가로 부분을 뺀 나머지는 (0,4)입니다. 두 부분을 더하면 다시 (3,4)가 됩니다." },
] as const;
export default function VectorMeasurementViz() {
  const controller = useAnimatedScenes(scenes.length);
  const active = controller.active;
  return <VizFrame eyebrow="같은 이동을 세 번 읽기" title="가로 3 · 세로 4 · 직선 길이 5" description="한 칸을 두 축에서 같은 길이로 그렸습니다. 선택을 바꿔 전체와 두 성분을 비교하세요.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="같은 이동의 세 성분" onKeyDown={controller.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
    <svg className="mx-auto mt-4 block w-full max-w-[320px]" viewBox="0 0 300 300" role="img" aria-label="원점에서 (3,4)까지의 길이 5와 가로 3, 세로 4인 직각삼각형">
      {[1,2,3,4,5].map(i => <g key={i} stroke="currentColor" opacity=".1"><line x1={40+40*i} y1="30" x2={40+40*i} y2="250"/><line x1="40" y1={250-40*i} x2="260" y2={250-40*i}/></g>)}
      <g stroke="currentColor" opacity=".5"><line x1="40" y1="250" x2="270" y2="250"/><line x1="40" y1="250" x2="40" y2="25"/></g>
      <line x1="40" y1="250" x2="160" y2="90" stroke={active===0 ? "var(--primary)" : "currentColor"} strokeWidth={active===0 ? 1.25 : 1} opacity={active===0 ? 1 : .35}/>
      <line x1="40" y1="250" x2="160" y2="250" stroke={active===1 ? "var(--primary)" : "currentColor"} strokeWidth={active===1 ? 1.25 : 1} opacity={active===1 ? 1 : .35}/>
      <line x1="160" y1="250" x2="160" y2="90" stroke={active===2 ? "var(--primary)" : "currentColor"} strokeWidth={active===2 ? 1.25 : 1} opacity={active===2 ? 1 : .35} strokeDasharray={active===2 ? undefined : "4 4"}/>
      <path d="M148 250 V238 H160" stroke="currentColor" opacity=".5" fill="none"/><circle cx="160" cy="90" r="4" fill="currentColor"/>
      <g fill="currentColor" fontSize="12"><text x="21" y="269">(0,0)</text><text x="170" y="88">(3,4)</text><text x="135" y="274">(3,0)</text><text x="95" y="241">3</text><text x="168" y="178">4</text><text x="85" y="161">5</text><text x="258" y="270">가로</text><text x="17" y="21">세로</text></g>
    </svg>
    <p className="mt-3 min-h-[6rem] text-sm leading-7" aria-live="polite">{scenes[active].detail}</p>
    <AnimatedSceneControls {...controller} labels={scenes.map(scene => scene.label)} />
    </div>
    <p className="mt-2 text-xs leading-6 text-muted-foreground">세로 부분은 (3,0)에서 시작하도록 옮겨 그렸습니다. 이동량은 (0,4)이며 출발점의 위치와는 다릅니다.</p>
  </VizFrame>;
}
