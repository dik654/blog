import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 금융감독원 소비자경보(2024-26호) 사례.
 * NAV 10,000원에서 매달 5% 하락, 매달 그달 NAV의 1%를 분배.
 * 분배금 = 100 × 0.95^k → 1월 100, 2월 95, 12월 57, 합계 919원.
 */
const NAV = Array.from({ length: 12 }, (_, month) => 10000 * 0.95 ** month);
const PAID = NAV.map((nav) => nav * 0.01);
const TOTAL = Math.round(PAID.reduce((sum, value) => sum + value, 0));
const MONTHS = PAID.length;

const W = 360;
const H = 176;
const LEFT = 10;
const BASE_Y = 148;
const TOP_Y = 26;
const BAR_W = 20;
const GAP = (W - 2 * LEFT - MONTHS * BAR_W) / (MONTHS - 1);
const bx = (month: number) => LEFT + month * (BAR_W + GAP);

const SCENES = [
  { label: "NAV가 내려갑니다", summary: "10,000원 → 12월 5,688원", note: "매달 5%씩 내리면 12월의 NAV는 5,688원입니다. 값이 일정하게 빠지는 것이 아니라 줄어든 값에서 다시 5%가 빠집니다." },
  { label: "분배금도 같이 줄어듭니다", summary: "100원 → 95원 → … → 57원", note: "분배금은 처음 1만 원이 아니라 그달 NAV의 1%입니다. NAV가 줄어든 만큼 1월 100원, 2월 95원, 12월 57원으로 함께 줄어듭니다." },
  { label: "열두 달 합계", summary: `${TOTAL}원 · 1,200원 아님`, note: "종목명의 연 12%를 보고 기대한 1,200원이 아니라 919원입니다. 점선까지 채우지 못한 칸이 그 차이입니다." },
] as const;

export default function NavDecayDistributionViz() {
  return (
    <SceneShell
      eyebrow="연 12%라는 이름"
      title="매달 1%를 받아도 열두 달 합은 12%가 되지 않습니다"
      description="막대 하나가 한 달입니다. 금융감독원 소비자경보(2024-26호)의 사례이며 특정 상품의 실적이 아닙니다."
      ariaLabel="NAV 하락과 함께 줄어드는 월 분배금과 열두 달 합계"
      scenes={SCENES}
      render={(active) => {
        const showNav = active === 0;
        const max = showNav ? 10000 : 100;
        const values = showNav ? NAV : PAID;
        const height = (value: number) => (value / max) * (BASE_Y - TOP_Y);
        const emphasize = new Set([0, 1, MONTHS - 1]);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 2 && (
              <>
                <line x1={LEFT} x2={W - LEFT} y1={TOP_Y} y2={TOP_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={W - LEFT} y={TOP_Y - 6} textAnchor="end" fontSize={11} fill="#64748b">매달 100원이면 합계 1,200원</text>
              </>
            )}
            {values.map((value, month) => (
              <g key={month}>
                <rect
                  x={bx(month)}
                  y={BASE_Y - height(value)}
                  width={BAR_W}
                  height={height(value)}
                  rx={2}
                  fill={showNav ? "#64748b" : "#2563eb"}
                  opacity={emphasize.has(month) ? 0.9 : 0.55}
                />
                {emphasize.has(month) && (
                  <text x={bx(month) + BAR_W / 2} y={BASE_Y - height(value) - 5} textAnchor="middle" fontSize={showNav ? 9 : 11} fontWeight={700} fill={showNav ? "#475569" : "#2563eb"}>
                    {Math.round(value).toLocaleString("en-US")}
                  </text>
                )}
                {(month === 0 || month === 1 || month === MONTHS - 1) && (
                  <text x={bx(month) + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fill="#64748b">{month + 1}월</text>
                )}
              </g>
            ))}
            <line x1={LEFT} x2={W - LEFT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
