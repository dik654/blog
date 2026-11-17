import SceneShell from "./SceneShell";

/**
 * 본문 대응: #spectral-normalization — diag(3,1)을 σmax=3으로 나누면 diag(1,1/3).
 * 길이 1인 입력 방향: e₁=(1,0), e₂=(0,1), d=(1/√2,1/√2)(대각, 비교용 선택).
 * W: e₁→3, e₂→1, d→√5≈2.24. W/3: e₁→1, e₂→1/3≈0.33, d→√5/3≈0.75.
 */
const R = Math.SQRT1_2;
const DIRS = [
  { name: "e₁ (가로)", v: [1, 0], color: "#2563eb" },
  { name: "e₂ (세로)", v: [0, 1], color: "#16a34a" },
  { name: "d (대각)", v: [R, R], color: "#c2410c" },
] as const;

const SCENES = [
  {
    label: "길이 1인 입력 방향",
    summary: "모든 방향의 길이 = 1",
    m: [1, 1],
    note: "길이가 1인 입력 vector를 모든 방향으로 모으면 점선 단위원이 됩니다. 세 화살표는 그중 가로·세로·대각 방향 하나씩입니다.",
  },
  {
    label: "W = diag(3, 1)",
    summary: "가장 크게 늘리는 비율 σmax = 3",
    m: [3, 1],
    note: "W는 가로 방향을 3배, 세로 방향을 1배로 늘려 단위원을 타원으로 바꿉니다. 대각 방향은 √5≈2.24배로, 어느 방향도 3배를 넘지 않습니다. 이 최대 확대율 3이 largest singular value입니다.",
  },
  {
    label: "W ÷ σmax = diag(1, 1/3)",
    summary: "최대 확대율 1, 단위원 안",
    m: [1, 1 / 3],
    note: "W 전체를 3으로 나누면 가로는 1배, 세로는 1/3배, 대각은 약 0.75배가 됩니다. 모든 방향을 같은 값으로 나눴으므로 가장 크게 늘던 방향이 정확히 1이 되고, 나머지 방향은 그보다 작아집니다.",
  },
] as const;

const W = 360;
const H = 214;
const CX = 180;
const CY = 72;
const U = 38;
const fmt = (x: number) => (Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : x.toFixed(2));

export default function SpectralNormViz() {
  return (
    <SceneShell
      eyebrow="최대 확대율"
      title="diag(3,1)을 3으로 나누면 가장 크게 늘던 방향이 1배가 됩니다"
      description="점선 원은 길이 1인 입력 vector 전체입니다. 실선 타원은 그 원을 weight가 옮긴 결과이고, 아래 줄은 세 방향의 확대율입니다. 대각 방향은 비교를 위해 고른 예입니다."
      ariaLabel="단위원이 diag(3,1)에 의해 타원으로 늘어나고 3으로 나누면 단위원 안으로 들어가는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const [a, b] = scene.m;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={CX - 3.3 * U} y1={CY} x2={CX + 3.3 * U} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
            <line x1={CX} y1={CY - 1.6 * U} x2={CX} y2={CY + 1.6 * U} stroke="#e2e8f0" strokeWidth={1} />
            <circle cx={CX} cy={CY} r={U} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <ellipse cx={CX} cy={CY} rx={a * U} ry={b * U} fill="#7c3aed" fillOpacity={0.06} stroke="#7c3aed" strokeWidth={1.25} />
            {[3, -3].map((t) => (
              <text key={t} x={CX + t * U} y={CY + 14} textAnchor="middle" fontSize={10} fill="#64748b">{t}</text>
            ))}
            {DIRS.map((d) => {
              const x = d.v[0] * a;
              const y = d.v[1] * b;
              return (
                <g key={d.name}>
                  <line x1={CX} y1={CY} x2={CX + x * U} y2={CY - y * U} stroke={d.color} strokeWidth={1.25} />
                  <circle cx={CX + x * U} cy={CY - y * U} r={3.5} fill={d.color} />
                </g>
              );
            })}
            {DIRS.map((d, i) => {
              const len = Math.hypot(d.v[0] * a, d.v[1] * b);
              const y = 150 + i * 22;
              return (
                <g key={d.name}>
                  <line x1={70} y1={y - 4} x2={90} y2={y - 4} stroke={d.color} strokeWidth={1.25} />
                  <text x={98} y={y} fontSize={12} fill="currentColor">{d.name}</text>
                  <text x={290} y={y} textAnchor="end" fontSize={12} fontWeight={700} fill={d.color}>{`${fmt(len)}배`}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
