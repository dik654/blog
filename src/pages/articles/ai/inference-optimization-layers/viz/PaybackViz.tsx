import SceneShell from "./SceneShell";

/**
 * 본문 대응: #roi — 40,000 GPU초/3,600×2달러 = 하루 200/9 ≈ 22.22달러.
 * 365일 8,111.11달러, 편익/비용 0.2028, ROI −79.72%. 1,800일에 40,000달러 회수.
 * 트래픽 100배면 18일.
 */
const DAILY = (40000 / 3600) * 2;
const COST = 40000;
const W = 340;
const H = 142;
const LEFT = 42;
const RIGHT = 334;
const TOP = 10;
const BOTTOM = 120;
const DAY_MAX = 2000;
const USD_MAX = 48000;
const px = (day: number) => LEFT + (day / DAY_MAX) * (RIGHT - LEFT);
const py = (usd: number) => BOTTOM - (usd / USD_MAX) * (BOTTOM - TOP);

const SCENES = [
  { label: "하루 절감액", summary: "40,000초 ÷ 3,600 × 2달러 ≈ 22.22달러", day: 1, rate: DAILY, days: "1일", saved: "22.22달러", bcr: "0.0006", roi: "−99.94%", note: "하루 200만 요청×20 ms=40,000 GPU초를 시간으로 바꾸고 시간당 2달러를 곱합니다. 그래프에서는 원점에 거의 붙어 있습니다." },
  { label: "한 해", summary: "22.22달러 × 365일 ≈ 8,111달러", day: 365, rate: DAILY, days: "365일", saved: "8,111.11달러", bcr: "0.2028", roi: "−79.72%", note: "한 해 절감액은 비용에 한참 못 미칩니다. 편익/비용은 0.2028, 순편익을 나눈 투자수익률은 −79.72%입니다." },
  { label: "회수 지점", summary: "40,000달러 ÷ 22.22달러 = 1,800일", day: 1800, rate: DAILY, days: "1,800일", saved: "40,000달러", bcr: "1", roi: "0%", note: "선을 만나는 곳이 단순 회수 지점입니다. 편익/비용은 1, 투자수익률은 0%로 손익분기 기준값이 서로 다릅니다." },
  { label: "트래픽만 100배", summary: "40,000달러 ÷ 2,222달러 = 18일", day: 18, rate: DAILY * 100, days: "18일", saved: "40,000달러", bcr: "1", roi: "0%", note: "트래픽만 100배면 18일입니다. 그 규모에서도 묶음과 단가가 같은지는 따로 확인해야 합니다." },
] as const;

export default function PaybackViz() {
  return (
    <SceneShell
      eyebrow="비용 회수"
      title="하루 약 22달러가 쌓여 40,000달러에 닿기까지 1,800일입니다"
      description="가로는 경과일, 세로는 누적 절감액(달러)이고 빨간 점선이 처음 쓴 비용입니다."
      note="(별도 가정) 요청당 독점 GPU 20 ms와 그만큼의 청구가 실제로 줄고 유지비·할인·성장·잔존가치는 0입니다."
      ariaLabel="누적 절감액과 초기 비용 40,000달러의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fast = active === 3;
        const pointUsd = Math.min(scene.day * scene.rate, COST);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 20000, 40000].map((tick) => (
                <text key={tick} x={LEFT - 5} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick === 0 ? "0" : `${tick / 10000}만`}</text>
              ))}
              {[0, 365, 1000, 1800].map((tick) => (
                <text key={tick} x={px(tick)} y={BOTTOM + 15} textAnchor="middle" fontSize={11} fill="#64748b">{tick.toLocaleString("en-US")}</text>
              ))}
              <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={RIGHT} y1={py(COST)} y2={py(COST)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              <text x={px(1000)} y={py(COST) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">초기 비용 40,000달러</text>
              <line x1={px(0)} y1={py(0)} x2={px(DAY_MAX)} y2={py(DAY_MAX * DAILY)} stroke="#2563eb" strokeWidth={1.25} opacity={fast ? 0.35 : 1} />
              {fast && <line x1={px(0)} y1={py(0)} x2={px(18)} y2={py(COST)} stroke="#d97706" strokeWidth={1.25} />}
              <circle cx={px(scene.day)} cy={py(pointUsd)} r={4} fill={fast ? "#d97706" : "#2563eb"} />
              {fast && <text x={px(18) + 8} y={py(COST) + 16} fontSize={12} fontWeight={700} fill="#d97706">18일에 도달</text>}
            </svg>
            <dl className="mt-2 flex justify-between gap-x-2 whitespace-nowrap font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">경과</dt>
                <dd className="mt-0.5 font-bold">{scene.days}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">절감 누적</dt>
                <dd className="mt-0.5 font-bold">{scene.saved}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">편익/비용</dt>
                <dd className="mt-0.5 font-bold">{scene.bcr}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">투자수익률</dt>
                <dd className="mt-0.5 font-bold">{scene.roi}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
