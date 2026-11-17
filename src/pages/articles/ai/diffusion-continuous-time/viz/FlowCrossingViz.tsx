import SceneShell from "./SceneShell";

/**
 * 본문 대응: #flow-matching — 직선 path xₜ=(1−t)x₀+tx₁의 target velocity u=x₁−x₀,
 * 그리고 여러 endpoint pair가 같은 xₜ를 지나면 squared-error optimum E[uₜ|xₜ,t]가 평균이 된다는 해석.
 * 가정 좌표: A: (0,0)→(2,2), B: (0,2)→(2,0). t=0.5에서 둘 다 (1,1).
 * u_A=(2,2), u_B=(2,−2), 두 쌍이 같은 비중이면 평균 (2,0).
 */
type P = readonly [number, number];
const A0: P = [0, 0];
const A1: P = [2, 2];
const B0: P = [0, 2];
const B1: P = [2, 0];

const lerp = (a: P, b: P, t: number): P => [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const UA = sub(A1, A0);
const UB = sub(B1, B0);
const UMEAN: P = [(UA[0] + UB[0]) / 2, (UA[1] + UB[1]) / 2];

const W = 360;
const H = 270;
const OX = 70;
const OY = 240;
const UNIT = 80;
const sx = (p: P) => OX + p[0] * UNIT;
const sy = (p: P) => OY - p[1] * UNIT;
const ARROW_SCALE = 0.32;

const fmt = (p: P) => `(${p[0]}, ${p[1] < 0 ? "−" : ""}${Math.abs(p[1])})`;

const SCENES = [
  {
    label: "한 쌍의 직선 path",
    summary: `x₀=${fmt(A0)} → x₁=${fmt(A1)}`,
    note: "출발점과 도착점을 하나씩 묶은 pair A입니다(가정 좌표). 중간 state xₜ는 두 끝점을 (1−t):t 비중으로 섞어 직선 위에 놓입니다.",
  },
  {
    label: "속도는 어디서나 같습니다",
    summary: `u = x₁ − x₀ = ${fmt(UA)}`,
    note: "t=0, 0.5, 1 어느 위치에서도 옆의 파란 화살표 u_A가 같습니다. 직선 보간의 시간 미분이 x₁−x₀라서, 이 pair 하나만 보면 network가 맞힐 target은 일정합니다.",
  },
  {
    label: "다른 쌍이 같은 점을 지납니다",
    summary: `B: ${fmt(B0)} → ${fmt(B1)}, u = ${fmt(UB)}`,
    note: "pair B도 t=0.5에서 같은 점 (1, 1)을 지납니다. 같은 xₜ와 같은 t에 target 화살표가 두 개 생깁니다.",
  },
  {
    label: "network가 배우는 것",
    summary: `평균 ${fmt(UMEAN)}`,
    note: "Network는 위치 xₜ와 t만 보고 pair가 A인지 B인지 모릅니다. 두 pair가 같은 비중일 때(가정) squared error를 가장 줄이는 답은 두 target의 평균 E[uₜ|xₜ,t]입니다.",
  },
] as const;

function Vec({ from, v, color, label, dy = -8, side = "right" }: { from: P; v: P; color: string; label: string; dy?: number; side?: "left" | "right" }) {
  const x1 = sx(from);
  const y1 = sy(from);
  const x2 = x1 + v[0] * UNIT * ARROW_SCALE;
  const y2 = y1 - v[1] * UNIT * ARROW_SCALE;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * 9;
  const by = y2 - uy * 9;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x2},${y2} ${bx - uy * 4.5},${by + ux * 4.5} ${bx + uy * 4.5},${by - ux * 4.5}`} fill={color} />
      <text x={side === "right" ? x2 + 6 : x2 - 8} y={y2 + dy} textAnchor={side === "right" ? "start" : "end"} fontSize={11} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Dot({ p, color, label, anchor = "end", dx = -8, dy = 4 }: { p: P; color: string; label: string; anchor?: "start" | "end" | "middle"; dx?: number; dy?: number }) {
  return (
    <g>
      <circle cx={sx(p)} cy={sy(p)} r={4} fill={color} />
      <text x={sx(p) + dx} y={sy(p) + dy} textAnchor={anchor} fontSize={11} fill="currentColor">{label}</text>
    </g>
  );
}

export default function FlowCrossingViz() {
  return (
    <SceneShell
      eyebrow="Conditional flow matching"
      title="직선 path의 속도는 일정하지만, 길이 겹치는 점에서는 평균 속도를 배웁니다"
      description="2차원 평면에 endpoint pair 두 개를 놓은 예시입니다(좌표는 가정). 화살표 길이는 속도 크기에 비례합니다."
      ariaLabel="두 직선 path가 교차하는 점에서 target velocity가 평균되는 과정"
      scenes={SCENES}
      render={(active) => {
        const mid = lerp(A0, A1, 0.5);
        const showB = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={sx(A0)} y1={sy(A0)} x2={sx(A1)} y2={sy(A1)} stroke="#2563eb" strokeWidth={1.25} strokeDasharray={active === 3 ? "4 4" : undefined} />
            <Dot p={A0} color="#2563eb" label="A의 x₀" />
            <Dot p={A1} color="#2563eb" label="A의 x₁" anchor="end" dx={-8} dy={-8} />
            {showB && (
              <>
                <line x1={sx(B0)} y1={sy(B0)} x2={sx(B1)} y2={sy(B1)} stroke="#d97706" strokeWidth={1.25} strokeDasharray={active === 3 ? "4 4" : undefined} />
                <Dot p={B0} color="#d97706" label="B의 x₀" />
                <Dot p={B1} color="#d97706" label="B의 x₁" anchor="start" dx={8} dy={16} />
              </>
            )}
            {active === 0 &&
              [0.25, 0.5, 0.75].map((t) => {
                const p = lerp(A0, A1, t);
                return <Dot key={t} p={p} color="#64748b" label={`t=${t}`} anchor="start" dx={8} dy={12} />;
              })}
            {active === 1 &&
              [0, 0.5, 1].map((t) => {
                const p = lerp(A0, A1, t);
                const start: P = [p[0] + 0.2, p[1] - 0.2];
                return (
                  <g key={t}>
                    <circle cx={sx(p)} cy={sy(p)} r={3} fill="#64748b" />
                    <line x1={sx(p)} y1={sy(p)} x2={sx(start)} y2={sy(start)} stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" />
                    <Vec from={start} v={UA} color="#2563eb" label={`t=${t}`} dy={14} />
                  </g>
                );
              })}
            {active >= 2 && (
              <>
                <circle cx={sx(mid)} cy={sy(mid)} r={5} fill="none" stroke="currentColor" strokeWidth={1} />
                <text x={sx(mid) - 10} y={sy(mid) + 4} textAnchor="end" fontSize={11} fill="currentColor">t=0.5 · (1, 1)</text>
                <Vec from={mid} v={UA} color="#2563eb" label={`u_A ${fmt(UA)}`} side="left" dy={-4} />
                <Vec from={mid} v={UB} color="#d97706" label={`u_B ${fmt(UB)}`} side="left" dy={14} />
              </>
            )}
            {active === 3 && <Vec from={mid} v={UMEAN} color="#16a34a" label={`평균 ${fmt(UMEAN)}`} dy={4} />}
          </svg>
        );
      }}
    />
  );
}
