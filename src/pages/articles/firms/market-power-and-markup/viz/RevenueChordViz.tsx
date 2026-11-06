import SceneShell from "./SceneShell";

/**
 * 본문 대응: #marginal-revenue — R(q)=q(13−q). R(3)=30, R(4)=36, 구간 차이 6.
 * R′(3)=7, R′(4)=5는 각 점의 접선 기울기이고, 평균 6이 구간 차이와 같은 것은 직선 수요·구간 길이 1인 이번 사례입니다.
 */
const SCENES = [
  { label: "실제 두 매출", summary: "R(3) = 30, R(4) = 36", note: "곡선이 매출 R(q) = q(13 − q)입니다. 정수로 3개와 4개를 비교할 때는 이 두 점만 있으면 됩니다." },
  { label: "한 번에 늘린 차이", summary: "36 − 30 = 6", note: "두 점을 잇는 선의 기울기가 한 개 구간의 매출 차이 6입니다. 실제로 비교하는 값은 이것입니다." },
  { label: "수량 3의 미분값", summary: "R′(3) = 7", note: "미분값은 그 점에서 아주 조금 움직일 때의 비율이고, 그 점을 스치는 선(접선)의 기울기입니다. 곡선이 위로 볼록해 7은 구간의 6보다 큽니다." },
  { label: "수량 4의 미분값", summary: "R′(4) = 5", note: "4에서 스치는 선의 기울기는 5로 더 완만합니다. 구간 차이 6은 이 두 끝점의 미분값과 모두 다릅니다." },
  { label: "이번 사례의 평균", summary: "(7 + 5) ÷ 2 = 6", note: "수요가 직선이고 구간 길이가 1인 이번 사례에서는 두 미분값의 평균이 구간 차이와 같습니다. 일반적인 수요에서도 항상 단순 평균을 쓰는 것은 아닙니다." },
] as const;

const W = 360;
const H = 240;
const L = 34;
const R = 14;
const T = 12;
const B = 30;
const QMIN = 2.5;
const QMAX = 4.5;
const RMIN = 24;
const RMAX = 42;
const px = (q: number) => L + ((q - QMIN) / (QMAX - QMIN)) * (W - L - R);
const py = (value: number) => T + ((RMAX - value) / (RMAX - RMIN)) * (H - T - B);
const revenue = (q: number) => q * (13 - q);

const CURVE = Array.from({ length: 41 }, (_, index) => {
  const q = QMIN + (index / 40) * (QMAX - QMIN);
  return `${px(q)},${py(revenue(q))}`;
}).join(" ");

function Slope({ q0, value, slope, color }: { q0: number; value: number; slope: number; color: string }) {
  const at = (q: number) => value + slope * (q - q0);
  return <line x1={px(QMIN)} y1={py(at(QMIN))} x2={px(QMAX)} y2={py(at(QMAX))} stroke={color} strokeWidth={1.25} />;
}

export default function RevenueChordViz() {
  return (
    <SceneShell
      eyebrow="구간 차이와 변화율"
      title="6은 두 점을 잇는 기울기, 7과 5는 각 점을 스치는 기울기입니다"
      description="가로는 수량, 세로는 매출입니다. 차이가 잘 보이도록 수량 2.5~4.5, 매출 24~42 구간만 확대했습니다. 수요 p = 13 − q는 이 글의 (가정)입니다."
      ariaLabel="매출 곡선에서 구간 차이 6과 수량 3, 4의 미분값 7, 5 비교"
      scenes={SCENES}
      render={(active) => {
        const chord = active >= 1;
        const t3 = active === 2 || active === 4;
        const t4 = active === 3 || active === 4;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={T} y2={H - B} stroke="#94a3b8" strokeWidth={1} />
            {[3, 4].map((q) => (
              <g key={q}>
                <line x1={px(q)} x2={px(q)} y1={py(revenue(q))} y2={H - B} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
                <text x={px(q)} y={H - B + 16} textAnchor="middle" fontSize={11} fill="#64748b">수량 {q}</text>
                <line x1={L} x2={px(q)} y1={py(revenue(q))} y2={py(revenue(q))} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
                <text x={L - 5} y={py(revenue(q)) + 4} textAnchor="end" fontSize={11} fill="#64748b">{revenue(q)}</text>
              </g>
            ))}
            <polyline points={CURVE} fill="none" stroke="#64748b" strokeWidth={1.25} />
            {t3 && <Slope q0={3} value={30} slope={7} color="#2563eb" />}
            {t4 && <Slope q0={4} value={36} slope={5} color="#16a34a" />}
            {chord && <line x1={px(3)} y1={py(30)} x2={px(4)} y2={py(36)} stroke="#d97706" strokeWidth={1.25} />}
            <circle cx={px(3)} cy={py(30)} r={4} fill="#d97706" />
            <circle cx={px(4)} cy={py(36)} r={4} fill="#d97706" />
            {chord && <text x={px(3.56)} y={py(31.4)} fontSize={12} fontWeight={700} fill="#d97706">차이 6</text>}
            {t3 && <text x={px(3.62)} y={py(36.6)} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">기울기 7</text>}
            {t4 && <text x={px(4.47)} y={py(36.2)} textAnchor="end" fontSize={12} fontWeight={700} fill="#16a34a">기울기 5</text>}
            <text x={px(4.47)} y={py(25.6)} textAnchor="end" fontSize={11} fill="#64748b">회색 곡선: 매출</text>
          </svg>
        );
      }}
    />
  );
}
