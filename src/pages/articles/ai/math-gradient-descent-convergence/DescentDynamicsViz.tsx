import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["η=0.5", "η=2", "η=3"] as const;
const CASES = [
  { eta: .5, title: "0까지의 거리가 절반씩 줄어든다", text: "배율 0.5: 4→2→1→0.5. 점수는 8→2→0.5→0.125입니다." },
  { eta: 2, title: "같은 거리를 좌우로 오간다", text: "배율 −1: 4→−4→4→−4. 점수는 매번 8로 그대로입니다." },
  { eta: 3, title: "좌우를 오가며 거리가 두 배가 된다", text: "배율 −2: 4→−8→16→−32. 점수는 8→32→128→512입니다." },
] as const;
const sx = (x: number) => 148 + 3.5 * x;
const sy = (step: number) => 32 + 52 * step;

export default function DescentDynamicsViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const selected = CASES[scenes.active];
  const points = Array.from({ length: 4 }, (_, t) => 4 * (1 - selected.eta) ** t);
  return <VizFrame eyebrow="같은 축에서 세 경로" title="보폭만 바꾸면 수축·왕복·발산이 갈린다"
    description="f(x)=x²/2, 시작값 4를 고정했습니다. 가로축은 실제 위치이고 아래로 내려갈수록 반복 횟수가 늘어납니다."
    note="점수 곡선이 아닌 위치의 기록입니다. 세 장면은 동일한 가로축을 사용하며 −32까지의 값을 자르거나 축척을 바꾸지 않았습니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="같은 축에서 보폭별 반복 위치" onKeyDown={scenes.onKeyDown}
      className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 300 245" className="mx-auto h-auto w-full max-w-[350px]" aria-label="0부터 세 번까지 반복한 실제 위치의 경로">
        <line x1="28" y1="215" x2="273" y2="215" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
        <line x1={sx(0)} y1="22" x2={sx(0)} y2="215" stroke="currentColor" strokeOpacity=".3" strokeWidth="1" strokeDasharray="3 4" />
        {[-32, -16, 0, 16, 32].map(x => <g key={x}><line x1={sx(x)} y1="215" x2={sx(x)} y2="219" stroke="currentColor" strokeWidth="1" /><text x={sx(x)} y="238" textAnchor="middle" fontSize="12" fill="currentColor">{x}</text></g>)}
        {points.map((x, t) => <g key={t}>
          <text x="12" y={sy(t) + 4} fontSize="12" fill="currentColor">{t}</text>
          {t > 0 && <line x1={sx(points[t - 1])} y1={sy(t - 1)} x2={sx(x)} y2={sy(t)} stroke="var(--primary)" strokeWidth="1" />}
          <circle cx={sx(x)} cy={sy(t)} r="4" fill={t === 0 ? "var(--background)" : "var(--primary)"} stroke="var(--primary)" strokeWidth="1.2" />
          <text x={sx(x)} y={sy(t) - 9} textAnchor="middle" fontSize="12" fill="currentColor">{x}</text>
        </g>)}
      </svg>
      <div aria-live="polite" className="mt-4 grid min-h-[150px] content-start gap-3 border-t border-border pt-4">
        <p className="text-base font-semibold">{selected.title}</p><p className="text-sm leading-6">{selected.text}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
