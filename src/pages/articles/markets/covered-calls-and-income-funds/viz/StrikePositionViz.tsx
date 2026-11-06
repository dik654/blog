import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 행사가를 어디에 놓느냐에 따라 보유자가 남기는 상승 구간이 달라진다.
 * 가로 = 주가. 파란 구간 = 보유자 몫, 주황 구간 = 넘겨주는 상승. 프리미엄 금액은 본문에 없어 숫자로 적지 않습니다.
 */
const W = 360;
const H = 118;
const P_MIN = 95;
const P_MAX = 120;
const AXIS_Y = 66;
const x = (price: number) => 14 + ((price - P_MIN) / (P_MAX - P_MIN)) * (W - 28);

const SCENES = [
  { label: "등가격(ATM)", summary: "행사가 ≈ 현재 가격", note: "행사가를 현재 가격 부근에 놓으면 오르는 몫을 거의 처음부터 넘겨줍니다. 설명서의 지수 콜도 대개 현재 지수와 같거나 그보다 높게 정합니다." },
  { label: "외가격(OTM)", summary: "행사가 105", note: "행사가를 위에 놓으면 그 지점까지의 상승은 보유자 몫입니다. 3절 사례의 105가 여기에 해당합니다." },
  { label: "더 높은 행사가", summary: "남는 구간↑ · 프리미엄 보통↓", note: "같은 만기·변동성 조건에서 105보다 높은 행사가를 고르면 남길 구간은 늘고, 받는 프리미엄은 보통 줄어듭니다. 110은 위치를 보이려는 가정이며 프리미엄 금액은 정하지 않았습니다." },
] as const;

const STRIKES = [100, 105, 110];

export default function StrikePositionViz() {
  return (
    <SceneShell
      eyebrow="행사가의 위치"
      title="행사가를 올리면 내 몫의 구간이 넓어집니다"
      description="가로는 주가이고 현재 가격은 100입니다(가정). 파란 구간은 보유자가 남기는 상승, 주황 구간은 상대에게 넘기는 상승입니다."
      ariaLabel="현재 가격 100에 대한 행사가 위치별 상승 구간 비교"
      scenes={SCENES}
      render={(active) => {
        const strike = STRIKES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: 행사가 ${strike}`}>
            <line x1={x(P_MIN)} x2={x(P_MAX)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {strike > 100 && <rect x={x(100)} y={AXIS_Y - 15} width={x(strike) - x(100)} height={15} fill="#2563eb" opacity={0.75} />}
            <rect x={x(strike)} y={AXIS_Y - 15} width={x(P_MAX) - x(strike)} height={15} fill="#d97706" opacity={0.45} />
            <line x1={x(100)} x2={x(100)} y1={AXIS_Y - 26} y2={AXIS_Y + 5} stroke="#475569" strokeWidth={1} />
            <text x={x(100)} y={AXIS_Y + 19} textAnchor="middle" fontSize={12} fill="#475569">100</text>
            <text x={x(100)} y={AXIS_Y + 34} textAnchor="middle" fontSize={11} fill="#64748b">현재</text>
            {strike > 100 ? (
              <>
                <line x1={x(strike)} x2={x(strike)} y1={AXIS_Y - 26} y2={AXIS_Y + 5} stroke="#d97706" strokeWidth={1.25} />
                <text x={x(strike)} y={AXIS_Y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">{strike}</text>
                <text x={x(strike)} y={AXIS_Y + 34} textAnchor="middle" fontSize={11} fill="#b45309">행사가</text>
                <text x={(x(100) + x(strike)) / 2} y={AXIS_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">내 몫</text>
              </>
            ) : (
              <text x={x(100)} y={AXIS_Y - 32} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">행사가</text>
            )}
            <text x={(x(strike) + x(P_MAX)) / 2} y={AXIS_Y - 22} textAnchor="middle" fontSize={11} fill="#b45309">넘기는 상승</text>
          </svg>
        );
      }}
    />
  );
}
