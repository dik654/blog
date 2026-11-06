import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 새 현금 200을 공정한 가격으로 받는다는 가정.
 * 200/1200≈16.67%, 1000/1200≈83.33%. 200/2075≈9.64%, 1875/2075≈90.36%. 차이 ≈7.03%포인트.
 */
const SCENES = [
  { label: "회사 가치 1000", summary: "200 ÷ 1200 ≈ 16.67%", note: "새 현금 200이 들어오면 회사는 1200이 되고, 새 투자자는 낸 돈만큼의 칸을 가져갑니다. 기존 주주 몫은 약 83.33%입니다." },
  { label: "회사 가치 1875", summary: "200 ÷ 2075 ≈ 9.64%", note: "돈은 똑같이 200이지만 전체가 2075로 커져 같은 칸의 비율이 작아집니다. 기존 주주 몫은 약 90.36%입니다." },
  { label: "두 경우를 나란히", summary: "약 7.03%포인트 적게 넘김", note: "가치 상승은 같은 투자비를 더 적은 비율의 지분으로 조달할 여지를 줍니다." },
] as const;

const X0 = 12;
const FULL = 336;
const VALUE_SCALE = FULL / 2075;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

function Panel({ y, value, faded }: { y: number; value: number; faded: boolean }) {
  const total = value + 200;
  const newShare = 200 / total;
  const oldW = (1 - newShare) * FULL;
  return (
    <g opacity={faded ? 0.3 : 1}>
      <text x={X0} y={y} fontSize={12} fontWeight={700} fill={GRAY}>회사 {value} + 새 현금 200 = {total}</text>
      <rect x={X0} y={y + 6} width={value * VALUE_SCALE} height={14} fill="#64748b" opacity={0.7} />
      <rect x={X0 + value * VALUE_SCALE} y={y + 6} width={200 * VALUE_SCALE} height={14} fill={AMBER} />
      <text x={X0} y={y + 37} fontSize={11} fill={GRAY}>지분 비율로 다시 그리면</text>
      <rect x={X0} y={y + 42} width={oldW} height={18} fill={BLUE} opacity={0.8} />
      <rect x={X0 + oldW} y={y + 42} width={FULL - oldW} height={18} fill={AMBER} />
      <text x={X0 + 6} y={y + 55} fontSize={12} fontWeight={700} fill="#ffffff">기존 {((1 - newShare) * 100).toFixed(2)}%</text>
      <text x={X0 + FULL} y={y + 37} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>새 투자자 {(newShare * 100).toFixed(2)}%</text>
    </g>
  );
}

export default function DilutionShareViz() {
  return (
    <SceneShell
      eyebrow="같은 200, 다른 몫"
      title="회사 가치가 높을수록 같은 돈에 넘기는 칸이 작아집니다"
      description="회색과 주황 띠는 같은 축척의 금액이고, 파랑과 주황 띠는 전체를 100%로 본 지분입니다. 새 현금 200을 공정한 가격으로 받는다는 가정입니다."
      ariaLabel="새 현금 200에 대한 새 투자자 지분을 회사 가치 1000과 1875에서 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Panel y={16} value={1000} faded={active === 1} />
          <Panel y={100} value={1875} faded={active === 0} />
        </svg>
      )}
    />
  );
}
