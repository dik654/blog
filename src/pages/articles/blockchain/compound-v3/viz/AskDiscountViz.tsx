import SceneShell from "./SceneShell";

/**
 * 본문 대응: #liquidation ask discount 공식 — d = SF × (1 − LF), P_ask = P_oracle × (1 − d).
 * 본문 예시: oracle $100, LF 90%, SF 50% → haircut $10, 할인 $5, ask $95.
 * 막대 하나 = oracle 가격으로 잰 담보 $100.
 */
const ORACLE = 100;
const LF = 0.9;
const SF = 0.5;
const HAIRCUT = ORACLE * (1 - LF);
const DISCOUNT = HAIRCUT * SF;
const ASK = ORACLE - DISCOUNT;

const SCENES = [
  {
    label: "Oracle 가격으로 잰 담보",
    summary: "P_oracle = $100",
    note: "Absorb로 protocol이 넘겨받은 담보 가운데 oracle 가격 기준 $100어치를 예로 봅니다. 이 단계에서는 아직 아무 할인도 적용하지 않았습니다.",
  },
  {
    label: "LF가 남긴 haircut",
    summary: "1 − 90% = 10% → $10",
    note: "LF(liquidation factor)는 absorb 때 borrower에게 credit되는 담보 가치 비율입니다. LF 90%면 $90만 credit되고 나머지 10%, 즉 $10이 haircut 여유로 남습니다.",
  },
  {
    label: "SF만큼만 buyer 할인으로",
    summary: "d = 50% × 10% = 5% → $5",
    note: "SF(storefront price factor)는 그 haircut 중 얼마를 담보 구매자 할인으로 넘길지 정하는 비율입니다. SF 50%면 $10 중 $5만 할인이 되어 할인율 d는 5%입니다.",
  },
  {
    label: "Buyer가 보는 ask",
    summary: "P_ask = $100 × (1 − 5%) = $95",
    note: "buyCollateral의 buyer는 별도 transaction에서 이 $95 기준으로 담보를 삽니다. 이 5%는 absorb 호출자에게 즉시 지급되는 보너스가 아닙니다.",
  },
] as const;

const W = 360;
const H = 168;
const LEFT = 16;
const RIGHT = 16;
const ROW1_Y = 34;
const ROW2_Y = 106;
const ROW_H = 26;
const x = (value: number) => LEFT + (value / ORACLE) * (W - LEFT - RIGHT);
/** 아래 줄은 haircut $10만 가로 전체로 확대해 보여 준다. */
const zx = (value: number) => LEFT + (value / HAIRCUT) * (W - LEFT - RIGHT);
const money = (value: number) => "$" + Number(value.toFixed(2)).toString();

export default function AskDiscountViz() {
  return (
    <SceneShell
      eyebrow="담보 할인 견적"
      title="할인율은 두 factor를 곱해 만들어집니다"
      description="위 막대가 oracle 가격 기준 담보 $100, 아래 막대는 그중 haircut 부분만 확대한 것입니다. LF(liquidation factor) 90%·SF(storefront price factor) 50%는 본문 공식의 설명용 예시값입니다."
      note="실제 견적은 fresh oracle 가격, asset·base scale, targetReserves 조건과 pause 상태를 확인한 뒤에만 의미가 있습니다."
      ariaLabel="oracle 가격 100달러 담보에서 LF 90퍼센트 haircut 10달러 중 SF 50퍼센트인 5달러가 할인되어 ask 95달러"
      scenes={SCENES}
      render={(active) => {
        const showHaircut = active >= 1;
        const showDiscount = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={x(0)} y={ROW1_Y - 8} fontSize={11} fill="#64748b">$0</text>
            <text x={x(ORACLE)} y={ROW1_Y - 8} textAnchor="end" fontSize={11} fill="#64748b">{money(ORACLE)}</text>
            <rect x={x(0)} y={ROW1_Y} width={x(ORACLE) - x(0)} height={ROW_H} fill="#64748b" />
            {showHaircut && (
              <rect x={x(ORACLE - HAIRCUT)} y={ROW1_Y} width={x(ORACLE) - x(ORACLE - HAIRCUT)} height={ROW_H} fill="#d97706" />
            )}
            {showDiscount && (
              <rect x={x(ASK)} y={ROW1_Y} width={x(ORACLE) - x(ASK)} height={ROW_H} fill="#16a34a" />
            )}
            <text x={showHaircut ? x((ORACLE - HAIRCUT) / 2) : x(ORACLE / 2)} y={ROW1_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
              {showHaircut ? `borrower credit ${money(ORACLE * LF)}` : `oracle 가격 ${money(ORACLE)}`}
            </text>

            {showHaircut && (
              <g>
                <line x1={x(ORACLE - HAIRCUT)} y1={ROW1_Y + ROW_H} x2={zx(0)} y2={ROW2_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={x(ORACLE)} y1={ROW1_Y + ROW_H} x2={zx(HAIRCUT)} y2={ROW2_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={LEFT} y={ROW2_Y - 22} fontSize={11} fontWeight={700} fill="#b45309">haircut (1 − LF) × {money(ORACLE)} = {money(HAIRCUT)}</text>
                <text x={LEFT} y={ROW2_Y - 8} fontSize={10} fill="#64748b">확대</text>
                <rect x={zx(0)} y={ROW2_Y} width={zx(HAIRCUT) - zx(0)} height={ROW_H} fill="#d97706" />
              </g>
            )}
            {showDiscount && (
              <g>
                <rect x={zx(HAIRCUT - DISCOUNT)} y={ROW2_Y} width={zx(HAIRCUT) - zx(HAIRCUT - DISCOUNT)} height={ROW_H} fill="#16a34a" />
                <line x1={zx(HAIRCUT - DISCOUNT)} x2={zx(HAIRCUT - DISCOUNT)} y1={ROW2_Y} y2={ROW2_Y + ROW_H} stroke="#ffffff" strokeWidth={1} />
                <text x={zx((HAIRCUT - DISCOUNT) / 2)} y={ROW2_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                  (1 − SF) 부분 {money(HAIRCUT - DISCOUNT)}
                </text>
                <text x={zx(HAIRCUT - DISCOUNT / 2)} y={ROW2_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                  buyer 할인 {money(DISCOUNT)}
                </text>
                <text x={zx(HAIRCUT)} y={ROW2_Y + ROW_H + 16} textAnchor="end" fontSize={11} fontWeight={700} fill="#15803d">
                  d = SF × (1 − LF) = 5%
                </text>
              </g>
            )}
            {active === 3 && (
              <g>
                <line x1={x(ASK)} x2={x(ASK)} y1={ROW1_Y - 4} y2={ROW1_Y + ROW_H + 6} stroke="#2563eb" strokeWidth={1.25} />
                <text x={x(ASK) - 4} y={ROW1_Y + ROW_H + 18} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">
                  ask {money(ASK)}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
