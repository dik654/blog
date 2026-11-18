import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 비육우 5만 lb, 매수가 2.20·마지막 지수 2.25 → 0.05×50,000 = 2,500달러(가정).
 * 사업장 판매가격 2.23(가정) → 지수와의 0.02 차이는 선물 정산과 별도인 베이시스로 남는다.
 * 세로축은 파운드당 달러 가격이며, 세 가격의 위치는 본문 숫자 그대로다.
 */
const BUY = 2.2;
const LOCAL = 2.23;
const INDEX = 2.25;
const UNIT_LB = 50000;

const W = 360;
const H = 200;
const AXIS_X = 74;
const TOP = 24;
const BOTTOM = 176;
const P_MIN = 2.18;
const P_MAX = 2.27;
const y = (price: number) => BOTTOM - ((price - P_MIN) / (P_MAX - P_MIN)) * (BOTTOM - TOP);

const SCENES = [
  { label: "세 가격의 자리", summary: "2.20 · 2.23 · 2.25", note: "비육우 계약을 2.20달러에 샀고, 마지막 지수는 2.25달러, 내 사업장의 실제 판매가격은 2.23달러라고 놓은 가정입니다. 모두 파운드당 가격입니다." },
  { label: "선물은 지수로 닫힙니다", summary: `0.05 × 50,000 = ${(Math.round((INDEX - BUY) * 100) / 100 * UNIT_LB).toLocaleString("en-US")}달러`, note: "현금정산은 내 판매가격이 아니라 마지막 지수 2.25로 계산합니다. 매수가 2.20과의 차이 0.05에 5만 파운드를 곱한 2,500달러가 정산액입니다." },
  { label: "지수와 내 가격의 틈", summary: `${(Math.round((INDEX - LOCAL) * 100) / 100).toFixed(2)}달러/lb 베이시스`, note: "사업장 가격 2.23은 지수 2.25와 0.02 벌어져 있습니다. 이 차이는 선물 정산액에 들어가지 않으므로 별도 베이시스 손익으로 기록합니다." },
] as const;

function Mark({ price, label, color, bold }: { price: number; label: string; color: string; bold: boolean }) {
  return (
    <g opacity={bold ? 1 : 0.45}>
      <line x1={AXIS_X - 4} x2={AXIS_X + 150} y1={y(price)} y2={y(price)} stroke={color} strokeWidth={1} />
      <text x={AXIS_X - 8} y={y(price) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={color}>{price.toFixed(2)}</text>
      <text x={AXIS_X + 156} y={y(price) + 4} fontSize={11} fill={color}>{label}</text>
    </g>
  );
}

export default function BasisLadderViz() {
  return (
    <SceneShell
      eyebrow="지수와 사업장 가격"
      title="선물은 지수 2.25로 닫히고, 내 가격 2.23과의 틈은 따로 남습니다"
      description="세로축은 파운드당 달러 가격입니다. 베이시스는 내 사업장의 현물가격과 정산 기준 가격(여기서는 지수)의 차이입니다. 세 가격 모두 본문의 가정입니다(가정)."
      ariaLabel="비육우 선물 매수가 2.20, 마지막 지수 2.25, 사업장 판매가격 2.23의 위치와 현금정산액 2,500달러, 지수와 사업장 가격의 0.02 차이"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          <line x1={AXIS_X} x2={AXIS_X} y1={TOP - 8} y2={BOTTOM + 8} stroke="#94a3b8" strokeWidth={1} />
          <text x={AXIS_X - 8} y={TOP - 12} textAnchor="end" fontSize={10} fill="#64748b">달러/lb</text>
          <Mark price={INDEX} label="마지막 지수" color="#2563eb" bold />
          <Mark price={LOCAL} label="사업장 판매가 (가정)" color="#b45309" bold={index !== 1} />
          <Mark price={BUY} label="선물 매수가" color="#475569" bold={index !== 2} />
          {index === 1 ? (
            <g>
              <line x1={AXIS_X + 40} x2={AXIS_X + 40} y1={y(BUY) - 2} y2={y(INDEX) + 6} stroke="#16a34a" strokeWidth={1.25} />
              <path d={`M ${AXIS_X + 36} ${y(INDEX) + 8} L ${AXIS_X + 40} ${y(INDEX) + 1} L ${AXIS_X + 44} ${y(INDEX) + 8} Z`} fill="#16a34a" />
              <text x={AXIS_X + 48} y={(y(BUY) + y(INDEX)) / 2 + 14} fontSize={11} fontWeight={700} fill="#16a34a">+0.05 → 2,500달러</text>
            </g>
          ) : null}
          {index === 2 ? (
            <g>
              <rect x={AXIS_X + 96} y={y(INDEX)} width={40} height={y(LOCAL) - y(INDEX)} fill="#b45309" opacity={0.18} stroke="#b45309" strokeWidth={1} />
              <text x={AXIS_X + 92} y={(y(INDEX) + y(LOCAL)) / 2 + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">0.02</text>
            </g>
          ) : null}
        </svg>
      )}
    />
  );
}
