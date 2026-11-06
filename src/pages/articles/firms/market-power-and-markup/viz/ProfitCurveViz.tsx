import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stopping-point — 매출 13q−q², 비용 7q, 이익 6q−q²=9−(q−3)².
 * 2: 22−14=8, 3: 30−21=9, 4: 36−28=8, 5: 40−35=5. 수량 3에서 이익의 변화율 6−2q가 0입니다.
 */
const SCENES = [
  { label: "수량 2", q: 2, summary: "22 − 14 = 8", note: "위 그림의 두 선 사이 간격이 아래 그림의 이익 높이입니다. 수량 2에서는 간격이 8입니다." },
  { label: "수량 3", q: 3, summary: "30 − 21 = 9", note: "간격이 9로 늘었습니다. 2에서 3으로 갈 때 매출은 8, 비용은 7 늘어 이익이 1 늘어납니다." },
  { label: "수량 4", q: 4, summary: "36 − 28 = 8", note: "매출은 더 커졌지만 비용이 더 늘어 간격은 8로 줄었습니다." },
  { label: "수량 5", q: 5, summary: "40 − 35 = 5", note: "이 네 수량 중 매출은 40으로 가장 크지만 간격은 5입니다. 매출이 커지는 것과 이익이 커지는 것은 다릅니다." },
  { label: "전체 모양", q: 3, summary: "9 − (q − 3)², 최대 9", note: "제곱은 음수가 아니므로 어떤 수량에서도 이익은 9를 넘지 못합니다. 3에서 기울기 6 − 2q가 0이고, 이때 한계수입 7과 한계비용 7이 같습니다." },
] as const;

const W = 360;
const L = 34;
const R = 14;
const TOP_Y0 = 14;
const TOP_Y1 = 150;
const BOT_Y0 = 176;
const BOT_Y1 = 276;
const H = 300;
const QMAX = 7;
const px = (q: number) => L + (q / QMAX) * (W - L - R);
const pyTop = (value: number) => TOP_Y0 + ((50 - value) / 50) * (TOP_Y1 - TOP_Y0);
const pyBot = (value: number) => BOT_Y0 + ((10 - value) / 18) * (BOT_Y1 - BOT_Y0);
const revenue = (q: number) => q * (13 - q);
const profit = (q: number) => 6 * q - q * q;

const samples = Array.from({ length: 71 }, (_, index) => (index / 70) * QMAX);
const REVENUE_LINE = samples.map((q) => `${px(q)},${pyTop(revenue(q))}`).join(" ");
const PROFIT_LINE = samples.map((q) => `${px(q)},${pyBot(profit(q))}`).join(" ");

export default function ProfitCurveViz() {
  return (
    <SceneShell
      eyebrow="매출·비용에서 이익으로"
      title="두 선의 간격이 가장 넓은 곳이 이익의 꼭대기입니다"
      description="위는 매출과 비용, 아래는 그 차이인 이익입니다. 가로축 수량은 두 그림이 같고 세로 눈금은 다릅니다. 수요와 비용은 이 글의 (가정)이며, 0부터 13까지의 수량 중 0~7만 그렸습니다."
      ariaLabel="수량에 따른 매출, 비용, 이익 곡선과 이익 최대점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const q = scene.q;
        const whole = active === 4;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[410px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={L} x2={W - R} y1={TOP_Y1} y2={TOP_Y1} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={TOP_Y0} y2={TOP_Y1} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={BOT_Y0} y2={BOT_Y1} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={W - R} y1={pyBot(0)} y2={pyBot(0)} stroke="#94a3b8" strokeWidth={1} />
            {[0, 25, 50].map((tick) => <text key={tick} x={L - 5} y={pyTop(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>)}
            {[0, 9].map((tick) => <text key={tick} x={L - 5} y={pyBot(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>)}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((tick) => <text key={tick} x={px(tick)} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>)}

            <line x1={px(q)} x2={px(q)} y1={TOP_Y0} y2={BOT_Y1} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
            <polyline points={REVENUE_LINE} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <line x1={px(0)} y1={pyTop(0)} x2={px(7)} y2={pyTop(49)} stroke="#64748b" strokeWidth={1.25} />
            <text x={px(2.3)} y={pyTop(29)} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">매출</text>
            <text x={px(3.6)} y={pyTop(17)} fontSize={12} fontWeight={700} fill="#64748b">비용 7q</text>
            <line x1={px(q)} x2={px(q)} y1={pyTop(revenue(q))} y2={pyTop(7 * q)} stroke="#d97706" strokeWidth={1.25} />

            <polyline points={PROFIT_LINE} fill="none" stroke="#d97706" strokeWidth={1.25} />
            <text x={px(6.9)} y={pyBot(5)} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">이익</text>
            {whole && <line x1={px(1.7)} x2={px(4.3)} y1={pyBot(9)} y2={pyBot(9)} stroke="#2563eb" strokeWidth={1.25} />}
            {whole && <text x={px(4.4)} y={pyBot(9) + 4} fontSize={11} fontWeight={700} fill="#2563eb">기울기 0</text>}
            <circle cx={px(q)} cy={pyBot(profit(q))} r={4} fill="#d97706" />
            <text x={px(q) + 7} y={pyBot(profit(q)) - 7} fontSize={12} fontWeight={700} fill="#d97706">{whole ? "" : profit(q)}</text>
          </svg>
        );
      }}
    />
  );
}
