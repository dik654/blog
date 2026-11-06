import PlotAxes from "./PlotAxes";
import { curvePath, makeScale } from "./plotMath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #feasible-set — f(x)=(x−3)²+2 에 벌점 max(0,x−2)² 를 더하면 x=2.5 에서 총점 2.5.
 * x>2 에서 총점 = 2(x−2.5)²+2.5, f(2)=3. 벌점 방식 자체가 글의 (가정)이다.
 */
const f = (x: number) => (x - 3) ** 2 + 2;
const penalty = (x: number) => Math.max(0, x - 2) ** 2;
const total = (x: number) => f(x) + penalty(x);

const scale = makeScale([1, 4], [0, 6], { left: 26, right: 340, top: 18, bottom: 206 });
const F_COLOR = "#64748b";
const PENALTY_COLOR = "#d97706";
const TOTAL_COLOR = "#2563eb";

const SCENES = [
  { label: "강제 제약", summary: "x≤2 → 위치 2 · 점수 3", note: "x≤2 를 강제하면 음영 구간은 비교에서 빠집니다. 점수가 더 낮은 (3, 2)가 있어도 쓸 수 없으므로 남는 답은 (2, 3)입니다." },
  { label: "제약 대신 벌점", summary: "벌점 = max(0, x−2)²", note: "벌점은 규칙을 어긴 만큼 점수에 더하는 값입니다. x≤2 에서는 0이고 2를 넘은 만큼 제곱으로 커집니다. 이제 음영이 없으니 2를 넘는 값도 다시 후보입니다." },
  { label: "두 위치의 총점", summary: "x=2.5: 2.25 + 0.25 = 2.5", note: "x=2 의 총점은 3 + 0 = 3 입니다. x=2.5 의 총점은 원래 점수 2.25 에 벌점 0.25 를 더한 2.5 입니다. 규칙을 어긴 쪽이 오히려 낮습니다." },
  { label: "새 문제의 답", summary: "최소점 2.5 · 총점 2.5", note: "x>2 의 총점은 2(x−2.5)²+2.5 로 정리되므로 새 문제의 최소점은 2.5 입니다. 유한한 벌점 하나가 강제 제약과 같은 결과를 보장하지 않는 반례입니다." },
] as const;

export default function PenaltyViz() {
  return (
    <SceneShell
      eyebrow="제약과 벌점"
      title="상한을 벌점으로 바꾸면 최소점이 2에서 2.5로 넘어갑니다"
      description="회색이 원래 점수 f(x)=(x−3)²+2, 주황이 벌점, 파랑이 둘을 더한 총점입니다(가정). x 는 1부터 4까지만 그렸습니다."
      ariaLabel="강제 제약과 벌점 방식에서 달라지는 최소점"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 0 && (
              <g>
                <rect x={scale.sx(2)} y={scale.top} width={scale.right - scale.sx(2)} height={scale.bottom - scale.top} fill="#94a3b8" fillOpacity={0.18} />
                <text x={scale.sx(3.75)} y={scale.top + 16} textAnchor="middle" fontSize={12} fill="currentColor">제외</text>
              </g>
            )}
            <PlotAxes scale={scale} xTicks={[1, 2, 2.5, 3, 4]} yTicks={[2, 3, 6]} />
            <path d={curvePath(f, 1, 4, scale)} fill="none" stroke={F_COLOR} strokeWidth={1} />
            {active >= 1 && <path d={curvePath(penalty, 1, 4, scale)} fill="none" stroke={PENALTY_COLOR} strokeWidth={1} />}
            {active >= 2 && <path d={curvePath(total, 1, 3.8, scale)} fill="none" stroke={TOTAL_COLOR} strokeWidth={1.25} />}

            {active === 0 && (
              <g>
                <circle cx={scale.sx(3)} cy={scale.sy(2)} r={5} fill="none" stroke="currentColor" strokeWidth={1} />
                <text x={scale.sx(3)} y={scale.sy(2) + 20} textAnchor="middle" fontSize={12} fill="currentColor">(3, 2)</text>
                <circle cx={scale.sx(2)} cy={scale.sy(3)} r={5} fill={F_COLOR} />
                <text x={scale.sx(2) - 8} y={scale.sy(3) + 20} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">(2, 3)</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <line x1={scale.sx(2.5)} x2={scale.sx(2.5)} y1={scale.sy(2.25)} y2={scale.sy(2.5)} stroke={PENALTY_COLOR} strokeWidth={1.25} />
                <circle cx={scale.sx(2.5)} cy={scale.sy(2.25)} r={3} fill={F_COLOR} />
                <circle cx={scale.sx(2.5)} cy={scale.sy(2.5)} r={4} fill={TOTAL_COLOR} />
                <circle cx={scale.sx(2)} cy={scale.sy(3)} r={4} fill={TOTAL_COLOR} />
                <text x={scale.sx(2) - 8} y={scale.sy(3) + 20} textAnchor="end" fontSize={12} fill="currentColor">x=2: 3</text>
                <line x1={scale.sx(2.5)} x2={scale.sx(2.5)} y1={scale.sy(2.25) + 4} y2={scale.sy(1.25) - 12} stroke="#94a3b8" strokeWidth={1} />
                <text x={scale.sx(2.5)} y={scale.sy(1.25)} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">x=2.5: 2.5</text>
              </g>
            )}
            {active === 3 && (
              <g>
                <circle cx={scale.sx(2)} cy={scale.sy(3)} r={4} fill="none" stroke={TOTAL_COLOR} strokeWidth={1} />
                <text x={scale.sx(2) - 8} y={scale.sy(3) + 20} textAnchor="end" fontSize={12} fill="currentColor">(2, 3)</text>
                <circle cx={scale.sx(2.5)} cy={scale.sy(2.5)} r={5} fill={TOTAL_COLOR} />
                <line x1={scale.sx(2.5)} x2={scale.sx(2.5)} y1={scale.sy(2.5) + 6} y2={scale.sy(1.25) - 12} stroke="#94a3b8" strokeWidth={1} />
                <text x={scale.sx(2.5)} y={scale.sy(1.25)} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">(2.5, 2.5) x≤2 위반</text>
              </g>
            )}
          </svg>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: F_COLOR }} />원래 점수</span>
            <span className={active >= 1 ? undefined : "invisible"}><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: PENALTY_COLOR }} />벌점</span>
            <span className={active >= 2 ? undefined : "invisible"}><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: TOTAL_COLOR }} />총점</span>
          </div>
        </div>
      )}
    />
  );
}
