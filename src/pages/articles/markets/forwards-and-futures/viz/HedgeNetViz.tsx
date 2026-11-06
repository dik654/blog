import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 현물 대금과 선도 차액을 합한 제빵업자의 순지출.
 * 35만: 3500 − 500 = 3000, 25만: 2500 + 500 = 3000, 실제 36만·정산 35만: 3600 − 500 = 3100 (만 원).
 */
const FIXED = 3000;

const SCENES = [
  { label: "밀값 35만 원", summary: "3500 − 500 = 3000만 원", spot: 3500, diff: -500, note: "현물 100톤에 3500만 원을 낸 뒤 선도 차액 500만 원을 받습니다. 시장대금이 약속보다 높아도 순지출은 약정대금과 같은 3000만 원입니다." },
  { label: "밀값 25만 원", summary: "2500 + 500 = 3000만 원", spot: 2500, diff: 500, note: "현물은 2500만 원으로 싸졌지만 계약 손실 500만 원을 냅니다. 방향이 반대여도 합은 3000만 원입니다." },
  { label: "실제 36만 · 정산 35만", summary: "3600 − 500 = 3100만 원", spot: 3600, diff: -500, note: "실제 36만 원, 정산 기준 35만 원이면(가정) 차액은 500만 원뿐이라 100만 원이 남습니다. 위치나 품질에서 생긴 톤당 1만 원 차이가 6절의 베이시스입니다." },
] as const;

const W = 360;
const H = 204;
const BASE_Y = 172;
const PLOT = 140;
const MAX = 3700;
const y = (value: number) => BASE_Y - (value / MAX) * PLOT;
const COLS = [28, 138, 248];
const BAR_W = 76;

export default function HedgeNetViz() {
  return (
    <SceneShell
      eyebrow="두 장부 합산"
      title="현물 대금과 계약 차액을 합해야 3000만 원이 보입니다"
      description="제빵업자가 밀 100톤을 톤당 30만 원에 사기로 한 3절의 가정입니다. 수량은 변하지 않는다고 두었고 막대 단위는 만 원입니다."
      ariaLabel="만기 밀값별 현물 대금, 선도 차액, 순지출 비교"
      scenes={SCENES}
      render={(active) => {
        const { spot, diff } = SCENES[active];
        const net = spot + diff;
        const gets = diff < 0;
        const diffTop = Math.max(spot, net);
        const diffBottom = Math.min(spot, net);
        const spare = net - FIXED;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={COLS[0] + BAR_W} x2={COLS[1]} y1={y(spot)} y2={y(spot)} stroke="#94a3b8" strokeWidth={1} />
              <line x1={COLS[1] + BAR_W} x2={COLS[2]} y1={y(net)} y2={y(net)} stroke="#94a3b8" strokeWidth={1} />

              <rect x={COLS[0]} y={y(spot)} width={BAR_W} height={BASE_Y - y(spot)} rx={2} fill="#64748b" />
              <text x={COLS[0] + BAR_W / 2} y={y(spot) - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">{spot}</text>

              <rect x={COLS[1]} y={y(diffTop)} width={BAR_W} height={y(diffBottom) - y(diffTop)} rx={2} fill={gets ? "#16a34a" : "#d97706"} />
              <text x={COLS[1] + BAR_W / 2} y={y(diffTop) - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={gets ? "#16a34a" : "#d97706"}>{gets ? "500 받음" : "500 냄"}</text>

              <rect x={COLS[2]} y={y(net)} width={BAR_W} height={BASE_Y - y(net)} rx={2} fill="#2563eb" />
              {spare > 0 && <rect x={COLS[2]} y={y(net)} width={BAR_W} height={y(FIXED) - y(net)} fill="#dc2626" />}
              <text x={COLS[2] + BAR_W / 2} y={BASE_Y - 12} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">{net}</text>
              {spare > 0 && <text x={COLS[2] + BAR_W + 4} y={y(net) + 8} fontSize={11} fontWeight={700} fill="#dc2626">+{spare}</text>}

              <line x1={COLS[0] - 8} x2={W} y1={y(FIXED)} y2={y(FIXED)} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
              <line x1={COLS[0] - 8} x2={W} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
              <text x={COLS[0] + BAR_W / 2} y={BASE_Y + 18} textAnchor="middle" fontSize={12} fill="#64748b">현물 100톤</text>
              <text x={COLS[1] + BAR_W / 2} y={BASE_Y + 18} textAnchor="middle" fontSize={12} fill="#64748b">선도 차액</text>
              <text x={COLS[2] + BAR_W / 2} y={BASE_Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">순지출</text>
            </svg>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">파란 점선 = 약정대금 3000만 원(100톤 × 30만 원)</p>
          </div>
        );
      }}
    />
  );
}
