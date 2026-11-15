import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tick-math 둘째 식 — Alice(√pₐ=1, √pᵦ=3, L=60)의 token0·token1 양이 √P에 따라 바뀐다.
 * 범위 안: x = 60(1/√P − 1/3), y = 60(√P − 1). 왼쪽 밖 (40, 0), 오른쪽 밖 (0, 120).
 * √P=2 → (10, 60), √P=2.5 → (4, 90): 첫 swap step의 Δx 6, Δy 30과 같은 차이.
 */
const L = 60;
const LOW = 1;
const HIGH = 3;

const tokenX = (s: number) => (s <= LOW ? L * (1 / LOW - 1 / HIGH) : s >= HIGH ? 0 : L * (1 / s - 1 / HIGH));
const tokenY = (s: number) => (s <= LOW ? 0 : s >= HIGH ? L * (HIGH - LOW) : L * (s - LOW));

const W = 360;
const H = 214;
const PLOT_L = 36;
const PLOT_R = 344;
const PLOT_T = 22;
const PLOT_B = 164;
const S_MIN = 0.5;
const S_MAX = 3.5;
const V_MAX = 120;

const px = (s: number) => PLOT_L + ((s - S_MIN) / (S_MAX - S_MIN)) * (PLOT_R - PLOT_L);
const py = (v: number) => PLOT_B - (v / V_MAX) * (PLOT_B - PLOT_T);

const SAMPLES = Array.from({ length: 61 }, (_, index) => S_MIN + index * 0.05);
const pathOf = (fn: (s: number) => number) =>
  SAMPLES.map((s, index) => `${index === 0 ? "M" : "L"}${px(s).toFixed(1)} ${py(fn(s)).toFixed(1)}`).join(" ");
const PATH_X = pathOf(tokenX);
const PATH_Y = pathOf(tokenY);

const SCENES = [
  {
    label: "범위 왼쪽 끝",
    summary: "√P ≤ 1 → token0 40 · token1 0",
    s: 1,
    note: "왼쪽 경계 1에 닿으면 token1이 0이 되고 token0 40만 남습니다. 가격이 더 내려가 범위 밖으로 나가면 이 position은 교환과 새 수수료 누적에 참여하지 않습니다.",
  },
  {
    label: "현재 √P = 2",
    summary: "token0 10 · token1 60",
    s: 2,
    note: "범위 안에서는 두 token을 함께 가집니다. token0은 오른쪽 경계 3까지 남은 역수 거리 60×(1/2−1/3)=10, token1은 왼쪽 경계에서 온 거리 60×(2−1)=60입니다.",
  },
  {
    label: "√P = 2.5로 오른쪽 이동",
    summary: "token0 4 · token1 90",
    s: 2.5,
    note: "token1이 들어와 √P가 2.5로 오르면 token0은 10→4로 6 줄고 token1은 60→90으로 30 늘어납니다. 다음 절 첫 step의 출력 6과 순입력 30이 바로 이 차이입니다.",
  },
  {
    label: "범위 오른쪽 끝",
    summary: "√P ≥ 3 → token0 0 · token1 120",
    s: 3,
    note: "오른쪽 경계 3에 닿으면 token0이 0이 되고 token1 120만 남습니다. 가격이 더 올라 범위 밖으로 나가면 Alice의 양은 더 바뀌지 않고, 교환과 새 수수료 누적에서 빠집니다.",
  },
] as const;

export default function TokenCompositionViz() {
  return (
    <SceneShell
      eyebrow="Alice position의 구성 · 설명용 연속값"
      title="가격이 오른쪽으로 갈수록 token0은 줄고 token1은 늘어납니다"
      description="가로축은 제곱근 가격 √P, 세로축은 token 양입니다. Alice는 √P 1~3에 유동성 L 60을 둡니다. token0과 token1은 단위가 다르므로 두 선을 더하지 않습니다. 정수 반올림은 생략했습니다."
      ariaLabel="Alice 범위에서 제곱근 가격에 따라 바뀌는 token0과 token1 양"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active].s;
        const vx = tokenX(s);
        const vy = tokenY(s);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={px(LOW)} y={PLOT_T} width={px(HIGH) - px(LOW)} height={PLOT_B - PLOT_T} fill="#2563eb" opacity={0.06} />
            <text x={(px(LOW) + px(HIGH)) / 2} y={PLOT_T - 8} textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={700}>Alice 범위 · L 60</text>
            {[0, 40, 80, 120].map((v) => (
              <g key={v}>
                <line x1={PLOT_L} x2={PLOT_R} y1={py(v)} y2={py(v)} stroke="#94a3b8" strokeWidth={0.5} opacity={0.5} />
                <text x={PLOT_L - 5} y={py(v) + 3} textAnchor="end" fontSize={11} fill="#64748b">{v}</text>
              </g>
            ))}
            <line x1={PLOT_L} x2={PLOT_R} y1={PLOT_B} y2={PLOT_B} stroke="#94a3b8" strokeWidth={1} />
            {[1, 2, 2.5, 3].map((t) => (
              <text key={t} x={px(t)} y={PLOT_B + 14} textAnchor="middle" fontSize={11} fill="#64748b">{t}</text>
            ))}
            <text x={PLOT_R} y={PLOT_B + 14} textAnchor="end" fontSize={11} fill="#64748b">√P →</text>
            <path d={PATH_X} fill="none" stroke="#d97706" strokeWidth={1.25} />
            <path d={PATH_Y} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <text x={px(0.55)} y={py(40) - 6} fontSize={12} fill="#b45309" fontWeight={700}>token0</text>
            <text x={px(3.45)} y={py(120) + 14} textAnchor="end" fontSize={12} fill="#1d4ed8" fontWeight={700}>token1</text>
            <line x1={px(s)} x2={px(s)} y1={PLOT_T} y2={PLOT_B} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={px(s)} cy={py(vx)} r={4} fill="#d97706" />
            <circle cx={px(s)} cy={py(vy)} r={4} fill="#2563eb" />
            <text x={px(s) + (s >= 3 ? -6 : 6)} y={py(vx) - 6} textAnchor={s >= 3 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#b45309">x {Math.round(vx)}</text>
            <text x={px(s) + (s >= 3 ? -6 : 6)} y={py(vy) + (vy < 10 ? -8 : 14)} textAnchor={s >= 3 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#1d4ed8">y {Math.round(vy)}</text>
            <text x={px(s)} y={PLOT_B + 30} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">√P {s}</text>
          </svg>
        );
      }}
    />
  );
}
