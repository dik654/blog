import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["두 점 사이", "접선 예측", "작은 이동", "오차 경계"] as const;
const TEXT = [
  "입력 0과 2를 이은 현의 중간 높이는 2입니다. 입력 1의 실제 점수 1은 그 아래입니다.",
  "입력 1의 접선은 y=2x−1입니다. x=1.1의 예측은 1.2로 실제 1.21보다 낮습니다.",
  "강조 점은 (1.1,1.21)입니다. 0.1만큼 이동하며 기울기는 2에서 2.2로 커집니다.",
  "이 제곱 함수의 L=μ=2입니다. 접선에 d²을 더하면 곡선과 정확히 같아집니다.",
] as const;
const sx = (x: number) => 40 + 110 * x;
const sy = (y: number) => 210 - 40 * y;
const path = (f: (x: number) => number) => Array.from({ length: 81 }, (_, i) => {
  const x = i / 40;
  return `${i ? "L" : "M"}${sx(x)},${sy(f(x))}`;
}).join(" ");

export default function CurvatureShapeViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return <VizFrame eyebrow="제곱 함수의 두 직선" title="현은 곡선 위에, 접선은 곡선 아래에 놓인다"
    description="같은 f(x)=x²에서 두 끝을 이은 선과 한 점의 기울기를 맞춘 선을 비교합니다."
    note="곡선과 선은 실제 식으로 계산했습니다. 가로축과 세로축의 화면 축척은 다르며 작은 오차 0.01은 본문의 수치로 검산합니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="제곱 함수의 현과 접선 및 오차" onKeyDown={scenes.onKeyDown}
      className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 300 278" className="mx-auto h-auto w-full max-w-[310px]" aria-label="제곱 곡선 y=x²와 현 y=2x 및 접선 y=2x−1">
        <line x1="40" y1="34" x2="40" y2="252" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
        <line x1="40" y1="210" x2="273" y2="210" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
        {[0, 1, 2].map(x => <g key={x}><line x1={sx(x)} y1="210" x2={sx(x)} y2="215" stroke="currentColor" strokeWidth="1" /><text x={sx(x)} y="270" textAnchor="middle" fontSize="12" fill="currentColor">{x}</text></g>)}
        {[-1, 1, 2, 4].map(y => <g key={y}><line x1="35" y1={sy(y)} x2="40" y2={sy(y)} stroke="currentColor" strokeWidth="1" /><text x="28" y={sy(y) + 4} textAnchor="end" fontSize="12" fill="currentColor">{y}</text></g>)}
        <text x="39" y="21" fontSize="12" fill="currentColor">점수</text><text x="281" y="214" fontSize="12" fill="currentColor">x</text>
        <path d={path(x => x * x)} fill="none" stroke={a === 3 ? "var(--primary)" : "currentColor"} strokeOpacity={a === 3 ? 1 : .45} strokeWidth="1.2" />
        <line x1={sx(0)} y1={sy(0)} x2={sx(2)} y2={sy(4)} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4 4" opacity={a === 0 ? 1 : 0} />
        <line x1={sx(0)} y1={sy(-1)} x2={sx(2)} y2={sy(3)} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4 4" opacity={a >= 1 ? 1 : 0} />
        <circle cx={sx(1)} cy={sy(1)} r="4" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
        <line x1={sx(1)} y1={sy(1)} x2={sx(1)} y2={sy(2)} stroke="var(--primary)" strokeWidth="1" opacity={a === 0 ? 1 : 0} />
        <circle cx={sx(1)} cy={sy(2)} r="4" fill="var(--primary)" opacity={a === 0 ? 1 : 0} />
        <circle cx={sx(1.1)} cy={sy(1.21)} r="4" fill="var(--primary)" opacity={a === 2 ? 1 : 0} />
      </svg>
      <div aria-live="polite" className="mt-4 grid min-h-[138px] content-start gap-3 border-t border-border pt-4">
        <p className="text-base font-semibold">{["현 2 · 곡선 1", "접선 예측 1.2", "실제 1.21 · 차이 0.01", "아래 경계 = 실제 = 위 경계"][a]}</p>
        <p className="text-sm leading-6">{TEXT[a]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}
