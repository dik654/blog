import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ddm — 끝이 없는 배당을 할인해 더하면 왜 하나의 값으로 닫히는가.
 * 본문 식 해석의 예: D1 = 1,000원, r = 8%, g = 3% → 20,000원, g = 4% → 25,000원.
 * t년 배당의 현재가치 = 1000 × (1+g)^(t−1) / 1.08^t, 해마다 (1+g)/1.08 배.
 * g = 8%(= r, 가정)이면 해마다 926원이 줄지 않아 합이 끝없이 커진다.
 */
const D1 = 1000;
const R = 0.08;
const BAR_YEARS = 30;
const CURVE_YEARS = 100;

const pv = (g: number, t: number) => (D1 * (1 + g) ** (t - 1)) / (1 + R) ** t;
const nominal = (g: number, t: number) => D1 * (1 + g) ** (t - 1);
const partial = (g: number, n: number) =>
  Array.from({ length: n }, (_, i) => pv(g, i + 1)).reduce<number>((sum, value) => sum + value, 0);
const won = (value: number) => `${Math.round(value).toLocaleString("ko-KR")}원`;

const SCENES = [
  { label: "해마다 받는 배당", summary: "1,000원 → 30년째 2,357원", note: "1년 뒤 1,000원에서 시작해 해마다 3%씩 늘어난다고 가정합니다. 만기가 없으므로 이 막대는 30년에서 끝나지 않고 계속 이어집니다." },
  { label: "오늘 가치로 바꾸면", summary: "926원 → 30년째 234원", note: "t년 뒤 배당을 1.08로 t번 나눕니다. 배당은 1.03배씩 커지지만 할인은 1.08배씩 커져, 오늘 가치는 해마다 앞 해의 1.03/1.08 ≈ 0.954배로 줄어듭니다." },
  { label: "더해 가면 한 값에 다가갑니다", summary: `10년 ${won(partial(0.03, 10))} · 100년 ${won(partial(0.03, 100))}`, note: "줄어드는 항을 계속 더하면 합은 늘지만 20,000원을 넘지 못하고 그 값에 다가갑니다. 1,000 ÷ (0.08 − 0.03) = 20,000원이 이 끝없는 합의 값입니다." },
  { label: "성장률만 4%로 올리면", summary: "다가가는 값 20,000원 → 25,000원", note: "줄어드는 배율이 1.04/1.08 ≈ 0.963으로 1에 가까워져 항이 더 천천히 줄어듭니다. 합이 다가가는 값은 1,000 ÷ 0.04 = 25,000원으로 25% 커집니다." },
  { label: "g가 r과 같으면 (가정)", summary: "해마다 926원 · 100년 92,593원", note: "성장률을 요구 수익률과 같은 8%로 두면 오늘 가치가 해마다 926원으로 줄지 않습니다. 더할수록 끝없이 커지므로 r > g가 아니면 식이 성립하지 않습니다." },
] as const;

const W = 360;
const H = 200;
const LEFT = 14;
const RIGHT = 14;
const BASE = 172;
const TOP = 26;
const BAR_MAX = 2400;
const CURVE_MAX = 26000;
const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const AMBER = "#d97706";
const INK = "#475569";

const barX = (t: number) => LEFT + ((t - 1) * (W - LEFT - RIGHT)) / BAR_YEARS;
const BAR_W = (W - LEFT - RIGHT) / BAR_YEARS - 2;
const barH = (value: number) => (value / BAR_MAX) * (BASE - TOP);
const curveX = (n: number) => LEFT + (n * (W - LEFT - RIGHT)) / CURVE_YEARS;
const curveY = (value: number) => BASE - (value / CURVE_MAX) * (BASE - TOP);

function curvePath(g: number) {
  const points = Array.from({ length: CURVE_YEARS + 1 }, (_, n) => `${curveX(n).toFixed(1)},${curveY(partial(g, n)).toFixed(1)}`);
  return `M${points.join(" L")}`;
}

const YEARS = Array.from({ length: BAR_YEARS }, (_, i) => i + 1);

export default function DividendSeriesViz() {
  return (
    <SceneShell
      eyebrow="끝없는 합이 닫히는 이유"
      title="할인한 배당은 해마다 같은 배율로 줄어들어 한 값에 다가갑니다"
      description="아래 식 해석의 예와 같은 숫자를 씁니다. 1년 뒤 배당 1,000원, 요구 수익률 r(이 위험을 지는 대가로 요구하는 연 수익률) 8%, 배당 성장률 g(배당이 해마다 늘어나는 비율) 3%를 가정합니다."
      ariaLabel="성장하는 배당의 현재가치와 그 누적합"
      scenes={SCENES}
      render={(active) => {
        const bars = active <= 1 || active === 4;
        const g = active === 4 ? R : 0.03;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {bars &&
              YEARS.map((t) => {
                const nom = nominal(0.03, t);
                const now = pv(g, t);
                return (
                  <g key={t}>
                    {active === 0 && <rect x={barX(t)} y={BASE - barH(nom)} width={BAR_W} height={barH(nom)} fill={GRAY} opacity={0.7} />}
                    {active === 1 && <rect x={barX(t)} y={BASE - barH(nom)} width={BAR_W} height={barH(nom)} fill="none" stroke={GRAY} strokeWidth={1} opacity={0.5} />}
                    {active >= 1 && <rect x={barX(t)} y={BASE - barH(now)} width={BAR_W} height={barH(now)} fill={active === 4 ? AMBER : BLUE} opacity={0.8} />}
                  </g>
                );
              })}
            {bars && (
              <g fontSize={12} fill={INK}>
                <text x={barX(1)} y={BASE + 16}>1년</text>
                <text x={barX(BAR_YEARS) + BAR_W} y={BASE + 16} textAnchor="end">30년</text>
                {active === 0 && <text x={barX(BAR_YEARS) + BAR_W} y={BASE - barH(nominal(0.03, BAR_YEARS)) - 6} textAnchor="end">2,357원</text>}
                {active === 0 && <text x={barX(1)} y={BASE - barH(D1) - 6}>1,000원</text>}
                {active === 1 && <text x={barX(1)} y={BASE - barH(pv(0.03, 1)) - 6} fill={BLUE}>926원</text>}
                {active === 1 && <text x={barX(BAR_YEARS) + BAR_W} y={BASE - barH(pv(0.03, BAR_YEARS)) - 6} textAnchor="end" fill={BLUE}>234원</text>}
                {active === 1 && <text x={W - RIGHT} y={TOP} textAnchor="end">테두리 = 받는 금액, 채움 = 오늘 가치</text>}
                {active === 4 && <text x={W / 2} y={BASE - barH(pv(R, 1)) - 8} textAnchor="middle" fill={AMBER}>해마다 926원, 줄지 않음</text>}
              </g>
            )}
            {!bars && (
              <g>
                <line x1={LEFT} x2={W - RIGHT} y1={curveY(20000)} y2={curveY(20000)} stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
                <text x={LEFT + 4} y={curveY(20000) - 6} fontSize={12} fill={BLUE}>20,000원</text>
                <path d={curvePath(0.03)} fill="none" stroke={BLUE} strokeWidth={1.25} />
                {active === 2 &&
                  [10, 30, 100].map((n) => (
                    <g key={n}>
                      <circle cx={curveX(n)} cy={curveY(partial(0.03, n))} r={3} fill={BLUE} />
                      <text x={Math.min(curveX(n) + 4, W - RIGHT)} y={curveY(partial(0.03, n)) + 16} textAnchor={n === 100 ? "end" : "start"} fontSize={11} fill={INK}>
                        {n}년 {won(partial(0.03, n))}
                      </text>
                    </g>
                  ))}
                {active === 3 && (
                  <g>
                    <line x1={LEFT} x2={W - RIGHT} y1={curveY(25000)} y2={curveY(25000)} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                    <text x={W - RIGHT} y={curveY(25000) - 6} textAnchor="end" fontSize={12} fill={AMBER}>25,000원 (g = 4%)</text>
                    <path d={curvePath(0.04)} fill="none" stroke={AMBER} strokeWidth={1.25} />
                    <text x={curveX(40)} y={curveY(partial(0.03, 40)) + 18} fontSize={12} fill={BLUE}>g = 3%</text>
                  </g>
                )}
                <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke={GRAY} strokeWidth={1} />
                <text x={LEFT} y={BASE + 16} fontSize={12} fill={INK}>0년</text>
                <text x={W - RIGHT} y={BASE + 16} textAnchor="end" fontSize={12} fill={INK}>100년까지 더한 합</text>
              </g>
            )}
            {bars && <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke={GRAY} strokeWidth={1} />}
          </svg>
        );
      }}
    />
  );
}
