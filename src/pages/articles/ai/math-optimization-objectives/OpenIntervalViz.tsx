import PlotAxes from "./PlotAxes";
import { curvePath, makeScale } from "./plotMath";
import SceneShell from "./SceneShell";

/** 본문 대응: #boundaries — f 를 [0,2)에서 본다(글의 가정). f(1.9)=3.21, f(1.99)=3.0201, 하한 3, 최소점 없음. */
const f = (x: number) => (x - 3) ** 2 + 2;
const scale = makeScale([1.85, 2.02], [2.9, 3.35], { left: 34, right: 340, top: 22, bottom: 204 });
const MARK = "#2563eb";

const SCENES = [
  { label: "x = 1.9", summary: "점수 3.21", note: "구간 끝에서 조금 떨어진 x=1.9 의 점수는 3.21 입니다. 2 에 더 가까이 가면 점수가 더 내려갑니다." },
  { label: "x = 1.99", summary: "점수 3.0201", note: "x=1.99 의 점수는 3.0201 입니다. 2 에 가까이 갈수록 점수도 3 에 가까워집니다." },
  { label: "x = 2 는 제외", summary: "하한 3 · 최솟값 없음", note: "2 가 빠졌으므로 허용된 어떤 x 도 3 을 만들지 못합니다. 하한은 3 이어도 최소점과 최솟값은 존재하지 않습니다. 교재가 일반적인 최적값을 min 대신 inf 로 쓰는 이유입니다." },
] as const;

export default function OpenIntervalViz() {
  return (
    <SceneShell
      eyebrow="끝점이 빠진 구간"
      title="[0, 2)에서는 점수가 3에 얼마든지 가까워져도 3이 되지는 못합니다"
      description="같은 f(x)=(x−3)²+2 의 x=2 근처만 크게 확대했습니다. 구간을 [0, 2)로 바꾼 것은 글의 가정이고, 곡선의 점선은 2 를 넘어 허용되지 않는 부분, 가로 점선은 점수 3 입니다."
      ariaLabel="끝점 2 가 빠진 구간에서 점수가 하한 3 에 다가가지만 닿지 못하는 모습"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <PlotAxes scale={scale} xTicks={[1.9, 1.99]} yTicks={[3, 3.21]} />
          <text x={scale.sx(2)} y={scale.bottom + 17} textAnchor="start" fontSize={12} fontWeight={700} fill="currentColor">2</text>
          <line x1={scale.sx(2)} x2={scale.sx(2)} y1={scale.bottom} y2={scale.bottom + 4} stroke="currentColor" strokeWidth={1} />
          <line x1={scale.left} x2={scale.right} y1={scale.sy(3)} y2={scale.sy(3)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          <path d={curvePath(f, 1.85, 2, scale)} fill="none" stroke="#64748b" strokeWidth={1.25} />
          <path d={curvePath(f, 2, 2.02, scale)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
          {active === 0 && (
            <g>
              <circle cx={scale.sx(1.9)} cy={scale.sy(3.21)} r={5} fill={MARK} />
              <text x={scale.sx(1.9) + 10} y={scale.sy(3.21) - 8} fontSize={12} fontWeight={700} fill="currentColor">(1.9, 3.21)</text>
            </g>
          )}
          {active === 1 && (
            <g>
              <circle cx={scale.sx(1.9)} cy={scale.sy(3.21)} r={3} fill={MARK} opacity={0.4} />
              <circle cx={scale.sx(1.99)} cy={scale.sy(3.0201)} r={5} fill={MARK} />
              <text x={scale.right} y={scale.sy(3.0201) - 32} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">(1.99, 3.0201)</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <circle cx={scale.sx(1.99)} cy={scale.sy(3.0201)} r={3} fill={MARK} opacity={0.4} />
              <circle cx={scale.sx(2)} cy={scale.sy(3)} r={5} fill="var(--background)" stroke={MARK} strokeWidth={1.25} />
              <text x={scale.right} y={scale.sy(3.0201) - 32} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">(2, 3)은 허용 안 됨</text>
              <text x={scale.left + 8} y={scale.sy(3) + 18} fontSize={12} fill="currentColor">하한 3</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
