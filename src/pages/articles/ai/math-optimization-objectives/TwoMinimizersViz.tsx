import PlotAxes from "./PlotAxes";
import { curvePath, makeScale } from "./plotMath";
import SceneShell from "./SceneShell";

/** 본문 대응: #minimizer — q(x)=(x²−1)² (글의 가정). argmin q = {−1, 1}, min q = 0. */
const q = (x: number) => (x * x - 1) ** 2;
const scale = makeScale([-2, 2], [0, 3], { left: 26, right: 340, top: 22, bottom: 200 });
const REACH = Math.sqrt(1 + Math.sqrt(3));
const MARK = "#2563eb";

const SCENES = [
  { label: "위치는 둘", summary: "argmin q = {−1, 1}", note: "가로축에서 읽으면 점수를 가장 낮추는 위치가 두 군데입니다. 그래서 argmin 은 값 하나가 아니라 집합입니다." },
  { label: "점수는 하나", summary: "min q = 0", note: "세로축에서 읽으면 두 위치의 점수는 똑같이 0 입니다. 최소점의 집합과 점수 하나를 구별하는 이유가 여기 있습니다." },
] as const;

export default function TwoMinimizersViz() {
  return (
    <SceneShell
      eyebrow="최소점이 여럿일 때"
      title="가장 낮은 위치는 둘인데 가장 낮은 점수는 하나입니다"
      description="곡선은 앞의 f 와 다른 함수 q(x)=(x²−1)² 입니다(가정). 가로축은 위치, 세로축은 점수입니다."
      ariaLabel="q 함수의 두 최소점과 하나의 최솟값"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <PlotAxes scale={scale} xTicks={[-1, 1]} yTicks={[0, 1]} />
          <path d={curvePath(q, -REACH, REACH, scale)} fill="none" stroke="#64748b" strokeWidth={1} />
          {[-1, 1].map((x) => (
            <circle key={x} cx={scale.sx(x)} cy={scale.sy(0)} r={5} fill={MARK} />
          ))}
          {active === 0 ? (
            <text x={scale.sx(0)} y={scale.sy(0) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">위치 −1, 1</text>
          ) : (
            <g>
              <line x1={scale.left} x2={scale.right} y1={scale.sy(0)} y2={scale.sy(0)} stroke={MARK} strokeWidth={1.25} />
              <text x={scale.sx(0)} y={scale.sy(0) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">점수 0</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
