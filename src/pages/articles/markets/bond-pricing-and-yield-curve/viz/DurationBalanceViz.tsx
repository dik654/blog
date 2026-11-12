import BondSceneShell from "./BondSceneShell";

/**
 * 본문 대응: #duration·#duration-use — 듀레이션은 현금흐름 현재가치를 무게로 삼은 시점의 무게중심이다.
 * 할인율은 세 채권 모두 3%로 둔다(가정).
 * 3년·표면 3%: 비중 2.9/2.8/94.3% → D 2.91년, D* 2.83
 * 10년·표면 8%: D 7.73년, D* 7.51 / 10년·무이표: D 10년, D* 9.71
 */
const YIELD = 0.03;

const BONDS = [
  { years: 3, coupon: 0.03, label: "만기 3년 · 표면금리 3%" },
  { years: 10, coupon: 0.08, label: "만기 10년 · 표면금리 8%" },
  { years: 10, coupon: 0, label: "만기 10년 · 이자 없음" },
];

function profile(years: number, coupon: number) {
  const pv = Array.from({ length: years }, (_, i) => {
    const t = i + 1;
    const cash = coupon * 100 + (t === years ? 100 : 0);
    return { t, value: cash / (1 + YIELD) ** t };
  });
  const price = pv.reduce<number>((sum, p) => sum + p.value, 0);
  const weights = pv.map((p) => ({ t: p.t, w: p.value / price }));
  const duration = weights.reduce<number>((sum, p) => sum + p.t * p.w, 0);
  return { weights, duration, modified: duration / (1 + YIELD) };
}

const PROFILES = BONDS.map((b) => profile(b.years, b.coupon));

const NOTES = [
  "이자 3은 작고 마지막 해의 103이 가격의 94% 남짓을 차지합니다. 그래서 무게중심이 만기 3년 바로 앞, 약 2.91년에 놓입니다.",
  "표면금리 8%면 앞쪽 아홉 해의 이자가 가격의 40% 남짓을 차지해 무게중심이 만기 10년보다 2년 넘게 앞당겨집니다.",
  "이자가 없으면 모든 무게가 10년 한 곳에 있어 무게중심이 만기와 같습니다. 같은 만기에서 금리 변화에 가장 크게 흔들립니다.",
];

const SCENES = BONDS.map((b, i) => ({
  label: b.label,
  summary: `D ${PROFILES[i].duration.toFixed(2)}년 · D* ${PROFILES[i].modified.toFixed(2)}`,
  note: NOTES[i],
}));

const X = (t: number) => 40 + t * 40;
const BASE = 140;
const H = (w: number) => w * 100 * 1.05;
const MUTED = "#94a3b8";
const BAR = "#2563eb";
const PIVOT = "#d97706";

export default function DurationBalanceViz() {
  return (
    <BondSceneShell
      eyebrow="듀레이션"
      title="막대 무게로 시점을 평균하면 받침점이 듀레이션입니다"
      description="막대 높이는 그 해 현금흐름의 현재가치가 가격에서 차지하는 비중(w)입니다. 막대들이 균형을 이루는 받침점이 듀레이션 D이고, D를 1+y로 나눈 수정 듀레이션 D*는 금리 1%포인트당 가격 변화율(%)의 직선 근사입니다."
      note="할인율은 세 채권 모두 3%로 둔 가정입니다. 두 10년물은 본문 아래 예와 같은 만기·표면금리입니다."
      ariaLabel="현금흐름 현재가치 비중의 무게중심으로 본 듀레이션"
      scenes={SCENES}
      render={(active) => {
        const p = PROFILES[active];
        const maturity = BONDS[active].years;
        const lineEnd = BASE - H(p.weights[p.weights.length - 1].w) - 18;
        return (
          <div className="w-full min-w-0 overflow-x-auto">
            <svg viewBox="0 0 480 190" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`} className="mx-auto h-auto w-full min-w-[30rem] max-w-xl">
              <line x1={X(0)} y1={BASE} x2={X(10) + 16} y2={BASE} stroke="#64748b" strokeWidth={1} />
              {Array.from({ length: 11 }, (_, t) => (
                <text key={t} x={X(t)} y={BASE + 34} textAnchor="middle" fontSize={12} fill={MUTED}>
                  {t}
                </text>
              ))}
              <text x={X(10) + 14} y={BASE + 34} fontSize={12} fill={MUTED}>
                년
              </text>
              {p.weights.filter(({ w }) => w > 1e-9).map(({ t, w }) => (
                <g key={t}>
                  <rect x={X(t) - 9} y={BASE - H(w)} width={18} height={H(w)} fill={BAR} fillOpacity={0.25} stroke={BAR} strokeWidth={1} />
                  <text x={X(t)} y={BASE - H(w) - 4} textAnchor="middle" fontSize={12} fill={BAR}>
                    {(w * 100).toFixed(1)}
                  </text>
                </g>
              ))}
              <text x={X(0)} y={16} fontSize={12} fill={MUTED}>
                비중 w (%)
              </text>
              <polygon
                points={`${X(p.duration)},${BASE + 1} ${X(p.duration) - 8},${BASE + 16} ${X(p.duration) + 8},${BASE + 16}`}
                fill={PIVOT}
              />
              <text
                x={X(p.duration)}
                y={BASE + 48}
                textAnchor={p.duration > 8.5 ? "end" : "middle"}
                fontSize={12}
                fontWeight={700}
                fill={PIVOT}
              >
                받침점 D = {p.duration.toFixed(2)}년
              </text>
              {lineEnd > 28 && <line x1={X(maturity)} y1={24} x2={X(maturity)} y2={lineEnd} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />}
              <text x={X(maturity) - 6} y={20} textAnchor="end" fontSize={12} fill="#64748b">
                만기 {maturity}년
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
