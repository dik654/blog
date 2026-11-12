import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 변화율 1, 1, −1, β=0.9, η=0.1 (1절의 비교용 가정).
 * 기록 v: 0.9×0+1=1, 0.9×1+1=1.9, 0.9×1.9−1=0.71.
 * 기록 사용 θ: 3→2.9→2.71→2.639, 이번 변화율만 θ: 3→2.9→2.8→2.9.
 */
const G = [1, 1, -1] as const;
const RETAINED = [0, 0.9, 1.71] as const;
const V = [1, 1.9, 0.71] as const;
const THETA_M = [3, 2.9, 2.71, 2.639] as const;
const THETA_P = [3, 2.9, 2.8, 2.9] as const;

const SCENES = [
  {
    label: "1번째 변화율 1",
    summary: "v = 0.9×0 + 1 = 1",
    note: "기록이 0에서 시작하므로 기록은 새 변화율 1과 같습니다. 두 규칙 모두 0.1×1을 빼서 3에서 2.9로 갑니다.",
  },
  {
    label: "2번째 변화율 1",
    summary: "v = 0.9×1 + 1 = 1.9",
    note: "회색 막대는 직전 기록의 90%인 0.9, 보라 화살표는 새 변화율 1입니다. 기록 1.9의 0.1배인 0.19를 빼서 2.71이 되고, 변화율만 쓰면 0.1만 빼서 2.8이 됩니다.",
  },
  {
    label: "3번째 변화율 −1",
    summary: "v = 1.71 − 1 = 0.71",
    note: "−1이 기록을 1.71에서 0.71로 끌어내렸지만 0 아래로 넘기지는 못했습니다. 기록이 아직 양수라 값은 2.639로 계속 줄고, 변화율만 쓰는 규칙은 2.8에서 2.9로 되돌아갑니다.",
  },
] as const;

const W = 360;
const COL = [70, 180, 290] as const;
const BASE = 112;
const UNIT = 38;
const vy = (value: number) => BASE - value * UNIT;
const LINE_L = 34;
const LINE_R = 326;
const tx = (theta: number) => LINE_L + ((theta - 2.6) / 0.4) * (LINE_R - LINE_L);
const TRACK_M = 186;
const TRACK_P = 252;

function Track({ path, y, color, active, name }: { path: readonly number[]; y: number; color: string; active: number; name: string }) {
  const shown = path.slice(0, active + 2);
  const unique = shown.filter((value, index) => shown.indexOf(value) === index);
  return (
    <g>
      <line x1={LINE_L} x2={LINE_R} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
      <text x={LINE_L} y={y - 20} fontSize={11} fontWeight={700} fill={color}>{name}</text>
      {shown.slice(1).map((to, index) => {
        const from = shown[index];
        const x1 = tx(from);
        const x2 = tx(to);
        const back = to > from;
        const cy = back ? y + 16 : y - 14;
        const current = index === active;
        return (
          <path
            key={index}
            d={`M${x1} ${y}Q${(x1 + x2) / 2} ${cy} ${x2} ${y}`}
            fill="none"
            stroke={color}
            strokeWidth={current ? 1.25 : 1}
            opacity={current ? 1 : 0.4}
          />
        );
      })}
      {unique.map((value) => (
        <g key={value}>
          <circle cx={tx(value)} cy={y} r={3.5} fill={value === shown[shown.length - 1] ? color : "#ffffff"} stroke={color} strokeWidth={1} />
          <text x={tx(value)} y={y + 30} textAnchor="middle" fontSize={10} fill="#64748b">{value}</text>
        </g>
      ))}
    </g>
  );
}

export default function MomentumTraceViz() {
  return (
    <SceneShell
      eyebrow="변화율 1, 1, −1 (가정)"
      title="같은 세 변화율이 두 규칙에서 다른 경로를 만듭니다"
      description="위는 걸음마다 남긴 직전 기록(회색)에 새 변화율(보라)을 더해 만든 기록 v(파랑 선)입니다. 아래는 학습 값 θ가 놓이는 수직선입니다. 직전 기록을 남기는 비율 β=0.9, 기록을 이동량으로 바꾸는 배율 η=0.1과 변화율 목록은 1절의 비교용 가정입니다."
      ariaLabel="변화율 1, 1, −1을 넣을 때 기록 v와 학습 값 θ가 바뀌는 세 단계"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 292`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={12} y={14} fontSize={11} fontWeight={700} fill="#475569">기록 v</text>
          <line x1={20} x2={W - 20} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <text x={16} y={BASE + 4} textAnchor="end" fontSize={9} fill="#64748b">0</text>
          {COL.map((x, step) => {
            const on = step <= active;
            const ret = RETAINED[step];
            const end = ret + G[step];
            const up = G[step] > 0;
            return (
              <g key={step} opacity={on ? 1 : 0.18}>
                {ret > 0 && <rect x={x - 26} y={vy(ret)} width={22} height={ret * UNIT} rx={2} fill="#94a3b8" />}
                {ret > 0 && <text x={x - 15} y={vy(ret) - 4} textAnchor="middle" fontSize={9} fill="#64748b">{ret}</text>}
                <line x1={x + 8} x2={x + 8} y1={vy(ret)} y2={vy(end) + (up ? 5 : -5)} stroke="#7c3aed" strokeWidth={1.25} />
                <path d={up ? `M${x + 4} ${vy(end) + 6}L${x + 8} ${vy(end)}L${x + 12} ${vy(end) + 6}Z` : `M${x + 4} ${vy(end) - 6}L${x + 8} ${vy(end)}L${x + 12} ${vy(end) - 6}Z`} fill="#7c3aed" />
                <text x={x + 14} y={(vy(ret) + vy(end)) / 2 + 4} fontSize={9} fill="#7c3aed">{up ? "+1" : "−1"}</text>
                <line x1={x - 30} x2={x + 22} y1={vy(V[step])} y2={vy(V[step])} stroke="#2563eb" strokeWidth={1.25} />
                <text x={x + 26} y={vy(V[step]) + 4} fontSize={10} fontWeight={700} fill="#2563eb">{V[step]}</text>
                <text x={x} y={BASE + 16} textAnchor="middle" fontSize={10} fill="#475569">{step + 1}번째 변화율 {G[step] > 0 ? "1" : "−1"}</text>
              </g>
            );
          })}
          <text x={12} y={146} fontSize={11} fontWeight={700} fill="#475569">학습 값 θ (왼쪽이 작음)</text>
          <Track path={THETA_M} y={TRACK_M} color="#2563eb" active={active} name="기록을 0.1배 빼기" />
          <Track path={THETA_P} y={TRACK_P} color="#d97706" active={active} name="이번 변화율만 0.1배 빼기" />
        </svg>
      )}
    />
  );
}
