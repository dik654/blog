import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["점수", "허용 범위", "선택", "위치와 값"] as const;
const EXPLANATIONS = [
  "제곱한 차이가 0인 x=3에서 점수 2를 얻습니다. 아직 허용 범위를 적용하지 않았습니다.",
  "가로축의 굵은 구간은 0≤x≤2입니다. x=3은 점수가 낮아도 범위 밖입니다.",
  "허용 구간 안에서 가장 낮은 점은 x=2, 점수 3입니다. 빈 점은 사용할 수 없습니다.",
  "고른 위치 2와 그 위치의 점수 3을 따로 기록합니다. 가로축과 세로축은 다른 값을 나타냅니다.",
] as const;
const xPixel = (x: number) => 34 + 60 * x;
const yPixel = (y: number) => 216 - 15 * y;
const curve = Array.from({ length: 101 }, (_, i) => {
  const x = i / 25;
  return `${i ? "L" : "M"}${xPixel(x)},${yPixel((x - 3) ** 2 + 2)}`;
}).join(" ");

export default function OptimizationProblemViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  return <VizFrame eyebrow="같은 함수의 두 답" title="허용 구간 안에서 점수가 가장 낮은 점을 고른다"
    description="곡선은 실제 f(x)=(x−3)²+2입니다. 가로축의 선택과 세로축의 점수를 구별합니다."
    note="검은 빈 점 (3,2)은 제약 없는 답이고 강조 점 (2,3)은 [0,2] 안의 답입니다. 서로 다른 축의 단위와 화면 축척은 다릅니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="허용 범위에 따른 최소점과 최솟값" onKeyDown={scenes.onKeyDown}
      className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 300 248" className="mx-auto h-auto w-full max-w-[340px]" aria-label="실제 제곱 점수 곡선과 구간 [0,2]">
        <line x1="34" y1="26" x2="34" y2="216" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
        <line x1="34" y1="216" x2="280" y2="216" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
        {[0, 1, 2, 3, 4].map(x => <g key={x}><line x1={xPixel(x)} y1="216" x2={xPixel(x)} y2="220" stroke="currentColor" strokeWidth="1" /><text x={xPixel(x)} y="236" textAnchor="middle" fontSize="12" fill="currentColor">{x}</text></g>)}
        {[3, 6, 11].map(y => <g key={y}><line x1="30" y1={yPixel(y)} x2="34" y2={yPixel(y)} stroke="currentColor" strokeWidth="1" /><text x="24" y={yPixel(y) + 4} textAnchor="end" fontSize="12" fill="currentColor">{y}</text></g>)}
        <text x="34" y="15" fontSize="12" fill="currentColor">점수</text>
        <text x="289" y="216" fontSize="12" fill="currentColor">x</text>
        <path d={curve} fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth="1" />
        <rect x={xPixel(0)} y="209" width={xPixel(2) - xPixel(0)} height="4" fill="var(--primary)" opacity={active >= 1 ? 1 : 0} />
        <circle cx={xPixel(3)} cy={yPixel(2)} r="5" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
        <line x1={xPixel(2)} y1={yPixel(3)} x2={xPixel(2)} y2="209" stroke="var(--primary)" strokeWidth="1" strokeDasharray="3 3" opacity={active >= 2 ? 1 : 0} />
        <circle cx={xPixel(2)} cy={yPixel(3)} r="5" fill="var(--primary)" opacity={active >= 2 ? 1 : 0} />
      </svg>
      <div aria-live="polite" className="mt-4 grid min-h-[138px] content-start gap-3 border-t border-border pt-4">
        <p className="text-base font-semibold">{active < 2 ? "제약 없는 답: 위치 3 · 점수 2" : "구간 안의 답: 위치 2 · 점수 3"}</p>
        <p className="text-sm leading-6">{EXPLANATIONS[active]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
