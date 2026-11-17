import SceneShell from "./SceneShell";

/**
 * 본문 대응: #modeling — "이상적인 AR(p)에서는 PACF가 p 뒤에서, MA(q)에서는 ACF가 q 뒤에서 약해지는 전형적 pattern".
 * 무한 표본의 이론값. 계수는 ImpulseResponseViz와 같은 0.6(가정).
 * AR(1): ρ_k = φ^k. MA(1): ρ_1 = θ/(1+θ²) = 0.441, ρ_k = 0 (k≥2).
 * PACF는 이론 ACF에서 Durbin–Levinson 재귀로 계산: MA(1)은 0.44, −0.24, 0.14, −0.08 …
 */
const MAX_LAG = 6;
const COEF = 0.6;

const AR_ACF = Array.from({ length: MAX_LAG }, (_, i) => COEF ** (i + 1));
const MA_ACF = Array.from({ length: MAX_LAG }, (_, i) => (i === 0 ? COEF / (1 + COEF * COEF) : 0));

/** 이론 ACF ρ_1..ρ_n에서 PACF φ_kk를 구하는 Durbin–Levinson 재귀. */
function pacf(rho: readonly number[]): number[] {
  const steps = rho.reduce<{ prev: number[]; out: number[] }>(
    (acc, _value, index) => {
      const k = index + 1;
      const num = rho[k - 1] - acc.prev.reduce<number>((sum, phi, j) => sum + phi * rho[k - 2 - j], 0);
      const den = 1 - acc.prev.reduce<number>((sum, phi, j) => sum + phi * rho[j], 0);
      const phiKK = num / den;
      const next = [...acc.prev.map((phi, j) => phi - phiKK * acc.prev[k - 2 - j]), phiKK];
      return { prev: next, out: [...acc.out, phiKK] };
    },
    { prev: [], out: [] },
  );
  return steps.out;
}

const AR_PACF = pacf(AR_ACF);
const MA_PACF = pacf(MA_ACF);

const SCENES = [
  {
    label: "AR(1), φ₁=0.6 (가정)",
    summary: "ACF 서서히 감소 · PACF lag 1 뒤 0",
    acf: AR_ACF,
    pacf: AR_PACF,
    note: "ACF는 0.6, 0.36, 0.22처럼 서서히 줄어듭니다. lag 2의 상관은 lag 1을 거쳐 전파된 몫이기 때문입니다. 그 중간 경로를 빼는 PACF는 lag 1에만 값이 있고 그 뒤로 0이라, p=1에서 끊깁니다.",
  },
  {
    label: "MA(1), θ₁=0.6 (가정)",
    summary: "ACF lag 1 뒤 0 · PACF 부호 바꾸며 감소",
    acf: MA_ACF,
    pacf: MA_PACF,
    note: "MA(1)은 lag 1만 충격을 공유하므로 ACF가 0.44 하나 뒤에 0으로 끊깁니다(q=1). 반대로 PACF는 0.44, −0.24, 0.14처럼 줄어들며 꼬리를 남깁니다. AR과 역할이 뒤바뀐 모양입니다.",
  },
] as const;

const W = 360;
const H = 112;
const LEFT = 30;
const RIGHT = 8;
const ZERO_Y = 54;
const UNIT = 40;
const SLOT = (W - LEFT - RIGHT) / MAX_LAG;
const BAR_W = 20;

function fmt(value: number): string {
  if (Math.abs(value) < 0.005) return "0";
  const rounded = Math.round(value * 100) / 100;
  return rounded < 0 ? `−${Math.abs(rounded).toFixed(2)}` : rounded.toFixed(2);
}

function Bars({ title, values, color }: { title: string; values: readonly number[]; color: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-bold text-muted-foreground">{title}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title}: ${values.map(fmt).join(", ")}`}>
        <line x1={LEFT} x2={W - RIGHT} y1={ZERO_Y - UNIT} y2={ZERO_Y - UNIT} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={LEFT} x2={W - RIGHT} y1={ZERO_Y + UNIT} y2={ZERO_Y + UNIT} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
        <text x={LEFT - 5} y={ZERO_Y - UNIT + 4} textAnchor="end" fontSize={12} fill="#64748b">1</text>
        <text x={LEFT - 5} y={ZERO_Y + 4} textAnchor="end" fontSize={12} fill="#64748b">0</text>
        <text x={LEFT - 5} y={ZERO_Y + UNIT + 4} textAnchor="end" fontSize={12} fill="#64748b">−1</text>
        {values.map((value, i) => {
          const cx = LEFT + SLOT * i + SLOT / 2;
          const h = Math.abs(value) * UNIT;
          const zero = h < 0.5;
          return (
            <g key={i}>
              {zero ? (
                <circle cx={cx} cy={ZERO_Y} r={2.5} fill="#94a3b8" />
              ) : (
                <rect x={cx - BAR_W / 2} y={value >= 0 ? ZERO_Y - h : ZERO_Y} width={BAR_W} height={h} rx={2} fill={color} opacity={0.8} />
              )}
              <text x={cx} y={value >= 0 || zero ? ZERO_Y - Math.max(h, 2) - 5 : ZERO_Y + h + 13} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">
                {fmt(value)}
              </text>
              <text x={cx} y={H - 2} textAnchor="middle" fontSize={12} fill="#64748b">
                {i + 1}
              </text>
            </g>
          );
        })}
        <line x1={LEFT} x2={W - RIGHT} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
      </svg>
    </div>
  );
}

export default function AcfPacfViz() {
  return (
    <SceneShell
      eyebrow="ACF · PACF 모양"
      title="AR은 PACF에서, MA는 ACF에서 끊깁니다"
      description="ACF(autocorrelation function)는 lag k 떨어진 두 값의 전체 상관이고, PACF(partial ACF)는 그 사이 lag들의 선형 영향을 뺀 직접 상관입니다. 가로축은 lag 1–6, 막대는 무한 표본 이론값이며 계수 0.6은 가정입니다. 유한 표본·계절성·ARMA 혼합에서는 이렇게 선명하게 끊기지 않습니다."
      ariaLabel="AR(1)과 MA(1)의 이론 ACF와 PACF 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <Bars title="ACF" values={scene.acf} color="#2563eb" />
            <Bars title="PACF" values={scene.pacf} color="#d97706" />
          </div>
        );
      }}
    />
  );
}
