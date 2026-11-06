import PlotAxes from "./PlotAxes";
import { curvePath, makeScale } from "./plotMath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — r(x)=min((x+1)²+1,(x−2)²) (글의 가정).
 * r(−1)=1 이 주변 최솟값, r(2)=0 이 더 낮다. 두 식은 x=1/3 에서 만난다(계산).
 */
const a = (x: number) => (x + 1) ** 2 + 1;
const b = (x: number) => (x - 2) ** 2;
const r = (x: number) => Math.min(a(x), b(x));
const scale = makeScale([-3, 4], [0, 5], { left: 26, right: 340, top: 22, bottom: 204 });
const MARK = "#2563eb";
const LOCAL = "#d97706";

const SCENES = [
  { label: "더 작은 식을 따라", summary: "r(x) = 두 식 중 작은 값", note: "x=1/3 왼쪽에서는 첫 식이, 오른쪽에서는 둘째 식이 더 작습니다. 파란 선이 r(x)이고 골짜기가 두 개 생깁니다." },
  { label: "주변에서만 보면", summary: "x=−1 · 점수 1", note: "−1 근처만 보면 양옆이 모두 더 높아 점수 1 이 주변 최솟값입니다. 이런 위치를 국소 최소점이라고 합니다." },
  { label: "전체를 보면", summary: "x=2 · 점수 0", note: "x=2 에서는 점수가 0 이라 더 좋은 선택이 있습니다. 전체에서 가장 낮은 이 위치가 전역 최소점이고, 주변에서 개선이 안 된다는 사실만으로 전체 최적을 보장할 수 없습니다." },
] as const;

export default function LocalGlobalViz() {
  return (
    <SceneShell
      eyebrow="주변과 전체"
      title="주변에서 가장 낮아도 전체에서 가장 낮지는 않습니다"
      description="점선은 (x+1)²+1 과 (x−2)², 파란 선은 둘 중 작은 값을 고른 r(x)입니다(가정). 가로축은 위치, 세로축은 점수입니다."
      ariaLabel="r 함수의 국소 최소점 x=-1 과 전역 최소점 x=2"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <PlotAxes scale={scale} xTicks={[-1, 2]} yTicks={[0, 1]} />
          <path d={curvePath(a, -3, 1, scale)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          <path d={curvePath(b, -0.236, 4, scale)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          <path d={curvePath(r, -3, 4, scale, 280)} fill="none" stroke={MARK} strokeWidth={1.25} />
          {active === 1 && (
            <g>
              <rect x={scale.sx(-1.6)} y={scale.top} width={scale.sx(-0.4) - scale.sx(-1.6)} height={scale.bottom - scale.top} fill={LOCAL} fillOpacity={0.12} />
              <circle cx={scale.sx(-1)} cy={scale.sy(1)} r={5} fill={LOCAL} />
              <text x={scale.sx(-1)} y={scale.sy(1) + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">(−1, 1)</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <circle cx={scale.sx(-1)} cy={scale.sy(1)} r={5} fill="none" stroke={LOCAL} strokeWidth={1.25} />
              <text x={scale.sx(-1)} y={scale.sy(1) + 20} textAnchor="middle" fontSize={12} fill="currentColor">국소</text>
              <circle cx={scale.sx(2)} cy={scale.sy(0)} r={5} fill={MARK} />
              <text x={scale.sx(2)} y={scale.sy(1.1)} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">(2, 0) 전역</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
