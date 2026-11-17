import SceneShell from "./SceneShell";
import {
  density,
  DIFFERENT_END,
  ENDPOINT_DIFFERENT,
  ODE_PATHS,
  PARTICLES,
  score,
  SDE_PATHS,
  T_END,
  T_START,
  TIMES,
} from "./marginalPathsData";

/**
 * 본문 대응: #probability-flow — "같은 것은 time marginal이고 particle trajectory는 같지 않다".
 * 장난감 가정과 계산은 marginalPathsData.ts 머리말에 있습니다.
 * 마지막 장면은 SDE와 ODE의 끝 부호가 다른 시작점만 진하게 그립니다.
 */
const TOP = 16;
const BOTTOM = 236;
const X_MAX = 4;
const LOG_SPAN = Math.log(T_START / T_END);
const SNAPSHOTS = [4, 1, 0.25, T_END] as const;
const SCORE_T = 0.25;
const SCORE_POINTS = [-3, -2, -0.4, 0.4, 2, 3] as const;
const GRID = Array.from({ length: 81 }, (_, i) => -X_MAX + (i * 2 * X_MAX) / 80);
const py = (x: number) => TOP + ((X_MAX - x) / (2 * X_MAX)) * (BOTTOM - TOP);

const SCENES = [
  {
    label: "시간별 분포",
    summary: "t=4 넓은 잡음 → t=0.02 두 봉우리",
    note: "데이터를 x=−1과 x=+1 두 점으로 두고 f=0, g=1로 퍼뜨린 분포 p_t입니다(가정). 왼쪽이 마지막 잡음이고, 샘플링은 왼쪽에서 오른쪽으로(t=T→0) 진행합니다.",
  },
  {
    label: "score 방향",
    summary: "화살표 = 밀도가 높아지는 쪽",
    note: "t=0.25 분포 위 여섯 점에서 score ∇log p_t를 화살표로 그렸습니다. 바깥 점은 안쪽 봉우리로, 두 봉우리 사이의 x=±0.4는 각자 가까운 봉우리 쪽으로 갈라집니다.",
  },
  {
    label: "역방향 SDE",
    summary: "drift f − g²·score + 무작위 증분",
    note: `시작점 ${PARTICLES}개에서 매 step score 보정과 새 Brownian 증분을 함께 더합니다. 같은 보정을 받아도 경로가 매 순간 흔들립니다.`,
  },
  {
    label: "Probability-flow ODE",
    summary: "f − ½g²·score · 무작위 항 없음",
    note: "같은 시작점에서 score 보정을 절반만 쓰고 Brownian 항을 뺐습니다. 시작점이 정해지면 경로도 하나로 정해집니다.",
  },
  {
    label: "같은 시작, 다른 끝",
    summary: `시작점 ${PARTICLES}개 중 ${ENDPOINT_DIFFERENT}개는 도착 봉우리가 다름`,
    note: `진한 선이 그 ${ENDPOINT_DIFFERENT}개입니다. 이론에서는 true score와 연속 시간 아래 두 방법의 시간별 분포가 같습니다. 경로 10개로는 그 분포를 확인할 수 없고, 같은 시작점에서도 끝점이 갈릴 수 있다는 것만 보여 줍니다.`,
  },
] as const;

const LEGENDS: readonly (readonly (readonly [string, string])[])[] = [
  [["#64748b", "회색 곡선 = 그 시각의 p_t 모양(높이는 각자 맞춤)"]],
  [["#16a34a", "초록 화살표 = t=0.25의 score"]],
  [["#ea580c", "주황 = 역방향 SDE 경로"]],
  [["#0284c7", "파랑 = probability-flow ODE 경로"]],
  [["#ea580c", "주황 = 역방향 SDE"], ["#0284c7", "파랑 = probability-flow ODE"]],
];

function Arrow({ x, y, dy, color }: { x: number; y: number; dy: number; color: string }) {
  const tip = y + dy;
  const dir = dy < 0 ? -1 : 1;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={tip - dir * 5} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x},${tip} ${x - 4},${tip - dir * 7} ${x + 4},${tip - dir * 7}`} fill={color} />
      <circle cx={x} cy={y} r={2.5} fill={color} />
    </g>
  );
}

function Chart({ active, width, className }: { active: number; width: number; className: string }) {
  const left = 46;
  const right = width - 40;
  const px = (t: number) => left + (Math.log(T_START / t) / LOG_SPAN) * (right - left);
  const pathD = (path: readonly number[]) =>
    path.map((x, i) => `${i === 0 ? "M" : "L"}${px(TIMES[i]).toFixed(1)} ${py(x).toFixed(1)}`).join(" ");
  const snapshotD = (t: number) => {
    const values = GRID.map((x) => density(x, t));
    const peak = Math.max(...values);
    return values.map((v, i) => `${i === 0 ? "M" : "L"}${(px(t) + (v / peak) * 30).toFixed(1)} ${py(GRID[i]).toFixed(1)}`).join(" ");
  };
  const showSde = active === 2 || active === 4;
  const showOde = active === 3 || active === 4;
  const height = BOTTOM + 82;
  const faded = (i: number) => active === 4 && !DIFFERENT_END[i];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <line x1={left} x2={right} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      <line x1={left} x2={left} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      {[-1, 1].map((x) => (
        <g key={x}>
          <line x1={left} x2={right} y1={py(x)} y2={py(x)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 4" opacity={0.6} />
          <text x={left - 6} y={py(x) + 4} textAnchor="end" fontSize={11} fill="currentColor">{`${x > 0 ? "+" : "−"}1`}</text>
        </g>
      ))}
      <text x={left - 6} y={py(0) + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>
      <text x={left - 6} y={TOP + 8} textAnchor="end" fontSize={11} fill="#64748b">x</text>
      {SNAPSHOTS.map((t) => (
        <g key={t}>
          <line x1={px(t)} x2={px(t)} y1={BOTTOM} y2={BOTTOM + 5} stroke="#94a3b8" strokeWidth={1} />
          <text x={px(t)} y={BOTTOM + 18} textAnchor={t === T_END ? "end" : t === 4 ? "start" : "middle"} fontSize={11} fill="currentColor">{`t=${t}`}</text>
          <path d={snapshotD(t)} fill="none" stroke="#64748b" strokeWidth={1} opacity={active === 0 ? 1 : 0.3} />
        </g>
      ))}
      <text x={left} y={BOTTOM + 36} fontSize={11} fill="#64748b">← 잡음 쪽</text>
      <text x={right} y={BOTTOM + 36} textAnchor="end" fontSize={11} fill="#64748b">데이터 쪽 →</text>
      {active === 1 &&
        SCORE_POINTS.map((x) => {
          const len = Math.max(-20, Math.min(20, score(x, SCORE_T) * 4));
          return <Arrow key={x} x={px(SCORE_T) - 12} y={py(x)} dy={-len} color="#16a34a" />;
        })}
      {showSde &&
        SDE_PATHS.map((p, i) => <path key={`s${i}`} d={pathD(p)} fill="none" stroke="#ea580c" strokeWidth={1} opacity={faded(i) ? 0.15 : 0.9} />)}
      {showOde &&
        ODE_PATHS.map((p, i) => <path key={`o${i}`} d={pathD(p)} fill="none" stroke="#0284c7" strokeWidth={1.25} opacity={faded(i) ? 0.15 : 0.95} />)}
      {(showSde || showOde) &&
        ODE_PATHS.map((p, i) => <circle key={`st${i}`} cx={px(TIMES[0])} cy={py(p[0])} r={3} fill="currentColor" opacity={faded(i) ? 0.25 : 1} />)}
      {LEGENDS[active].map(([color, label], i) => (
        <text key={label} x={left} y={BOTTOM + 56 + i * 16} fontSize={11} fill={color}>{label}</text>
      ))}
    </svg>
  );
}

export default function MarginalPathsViz() {
  return (
    <SceneShell
      eyebrow="같은 분포, 다른 경로"
      title="Reverse SDE와 probability-flow ODE는 같은 시작점에서도 다른 길로 갑니다"
      description="가로는 시간(t=4 → 0.02, 눈금 간격은 균일하지 않음), 세로는 1차원 위치 x입니다. 경로는 80 step Euler로 계산한 장난감 예시입니다(가정)."
      ariaLabel="두 점 데이터 분포에서 reverse SDE 경로와 probability-flow ODE 경로 비교"
      scenes={SCENES}
      render={(active) => (
        <>
          <Chart active={active} width={360} className="h-auto w-full sm:hidden" />
          <Chart active={active} width={640} className="mx-auto hidden h-auto w-full max-w-[720px] sm:block" />
        </>
      )}
    />
  );
}
