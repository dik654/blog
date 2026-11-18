import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 거래소 인도 조정(5 − 0.04 + 0.0625 = 5.0225)과 지역 현물 차이(4.70 − 5 = −0.30, 가정)는 다른 표다.
 * 세로축 = 부셸당 달러(4.65~5.10). 헤지 장면의 "움직일 수 있음"은 본문에 크기가 없어 방향만 표시.
 */
const W = 360;
const H = 220;
const y = (price: number) => 196 - ((price - 4.65) / 0.45) * 166;
const X_LEFT = 110;
const X_RIGHT = 230;

const SCENES = [
  { label: "기준은 선물 5달러", summary: "선물 $5.00/bu", note: "두 가지 차이를 모두 같은 선물가격 5달러에서 잽니다. 단위는 부셸당 달러입니다." },
  { label: "거래소 인도 조정", summary: "5 − 0.04 + 0.0625 = 5.0225", note: "계약을 실제로 인도할 때 거래소 규정표가 정한 품질 할인 4센트와 지역 가산 6.25센트를 붙입니다. 적용 월물의 규정표와 인도물의 품질·장소가 정해지면 이 값도 정해집니다(8절)." },
  { label: "한 지역의 현금가격", summary: "4.70 − 5.00 = −0.30 (가정)", note: "한 지역에서 평소 곡물을 사고파는 현금가격이 4.70달러라면 현물−선물은 −0.30달러입니다(가정). 6절에서 이 차이를 지역 베이시스라고 부릅니다. 운송비, 지역 수급과 저장 여건이 이 차이에 들어갈 수 있습니다." },
  { label: "같은 표가 아닙니다", summary: "헤지 뒤에도 −0.30 쪽은 움직일 수 있음", note: "선물로 헤지해도 지역 현물 차이가 예상과 다르게 움직일 위험은 남습니다. 오른쪽 점선은 방향만 뜻하며, 본문은 얼마나 움직일지 정하지 않았습니다." },
] as const;

function Mark({ x, price, color, label, side = "right" }: { x: number; price: number; color: string; label: string; side?: "left" | "right" | "below" }) {
  return (
    <g>
      <line x1={x - 14} x2={x + 14} y1={y(price)} y2={y(price)} stroke={color} strokeWidth={1.25} />
      <text x={side === "right" ? x + 18 : side === "left" ? x - 18 : x - 8} y={side === "below" ? y(price) + 20 : y(price) + 4} textAnchor={side === "right" ? "start" : side === "left" ? "end" : "middle"} fontSize={13} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function VArrow({ x, from, to, color, dashed = false }: { x: number; from: number; to: number; color: string; dashed?: boolean }) {
  const dir = to > from ? -1 : 1;
  return (
    <g>
      <line x1={x} x2={x} y1={y(from)} y2={y(to) - dir * 4} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M ${x} ${y(to)} l -4 ${-dir * 7} h 8 z`} fill={color} />
    </g>
  );
}

export default function BasisLadderViz() {
  return (
    <SceneShell
      eyebrow="두 가지 가격 차이"
      title="거래소 인도 조정과 지역 현물 차이는 다른 표입니다"
      description="세로축은 부셸당 달러입니다. 왼쪽은 1·3절의 품질·지역 조정, 오른쪽은 5절에서 가정한 한 지역의 현금가격 4.70달러입니다."
      ariaLabel="선물 5달러에서 거래소 인도 조정으로 5.0225달러, 지역 현금가격 4.70달러로 갈라지는 두 차이"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X_LEFT} y={14} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">거래소 인도 조정</text>
          <text x={X_RIGHT} y={14} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">한 지역 현금가격</text>
          <line x1={20} x2={W - 10} y1={y(5)} y2={y(5)} stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
          <text x={20} y={y(5) - 6} fontSize={13} fontWeight={700} fill="#475569">선물 5.00</text>

          {active >= 1 && (
            <g opacity={active === 3 ? 0.55 : 1}>
              <VArrow x={X_LEFT - 22} from={5} to={4.96} color="#d97706" />
              <text x={X_LEFT - 28} y={y(4.96) + 14} textAnchor="end" fontSize={12} fill="#b45309">품질 −4¢</text>
              <VArrow x={X_LEFT - 8} from={4.96} to={5.0225} color="#2563eb" />
              <text x={X_LEFT - 12} y={y(5.0225) - 18} textAnchor="end" fontSize={12} fill="#1d4ed8">지역 +6.25¢</text>
              <Mark x={X_LEFT + 10} price={5.0225} color="#2563eb" label="5.0225" />
            </g>
          )}

          {active >= 2 && (
            <g>
              <VArrow x={X_RIGHT - 20} from={5} to={4.7} color="#16a34a" />
              <text x={X_RIGHT - 26} y={(y(5) + y(4.7)) / 2 + 4} textAnchor="end" fontSize={13} fontWeight={700} fill="#15803d">−0.30</text>
              <Mark x={X_RIGHT} price={4.7} color="#16a34a" label="4.70 (가정)" side="below" />
            </g>
          )}

          {active === 3 && (
            <g>
              <line x1={X_RIGHT + 38} x2={X_RIGHT + 38} y1={y(4.7) - 26} y2={y(4.7) + 18} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
              <path d={`M ${X_RIGHT + 38} ${y(4.7) - 30} l -4 7 h 8 z`} fill="#16a34a" />
              <path d={`M ${X_RIGHT + 38} ${y(4.7) + 22} l -4 -7 h 8 z`} fill="#16a34a" />
              <text x={X_RIGHT + 47} y={y(4.7) - 18} fontSize={12} fill="#15803d">움직일 수 있음</text>
              <text x={X_RIGHT + 47} y={y(4.7) + 22} fontSize={12} fill="#15803d">(크기 미정)</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
