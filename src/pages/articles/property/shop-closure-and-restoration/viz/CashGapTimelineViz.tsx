import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 반환액과 지급 날짜를 따로 계산한다. 100 − 300 = −200만 원, 보증금 2천만 원은 그 뒤에 들어온다.
 * 가로는 순서만 뜻하고 간격은 날짜 수가 아닙니다. 세로 축은 만 원이고, 2천만 원은 축 밖으로 나갑니다.
 */
const W = 340;
const H = 250;
const LEFT = 42;
const RIGHT = 14;
const TOP = 30;
const BOTTOM = 34;
const V_MAX = 300;
const V_MIN = -300;

const py = (v: number) => TOP + ((V_MAX - v) / (V_MAX - V_MIN)) * (H - TOP - BOTTOM);
const X0 = LEFT + 22;
const X1 = 176;
const X2 = W - RIGHT - 30;

const TEXT_COLOR = "#64748b";
const AXIS_COLOR = "#94a3b8";
const CASH_COLOR = "#2563eb";
const GAP_COLOR = "#dc2626";
const IN_COLOR = "#16a34a";

const SCENES = [
  { label: "오늘 통장", summary: "잔액 100만 원", note: "보증금은 아직 들어오지 않았습니다. 정산서에 적힌 금액과 오늘 쓸 수 있는 돈은 다른 숫자입니다." },
  { label: "지급 기한", summary: "100 − 300 = −200만 원", note: "보증금이 돌아오기 전에 임금·환불 합계 300만 원을 지급하기로 했다면 그날 200만 원이 부족합니다." },
  { label: "보증금 입금", summary: "2천만 원은 그다음", note: "2천만 원이 들어오는 때는 이미 지급 기한 뒤입니다. 나중에 들어온다는 사실이 앞선 지급 기한을 저절로 바꾸지는 않습니다." },
] as const;

export default function CashGapTimelineViz() {
  return (
    <SceneShell
      eyebrow="날짜의 빈틈"
      title="받을 돈이 충분한데 왜 그날 돈이 모자랄까요"
      description="세로는 통장 잔액(만 원), 가로는 일이 일어나는 순서입니다. 빨간 칸이 0 아래로 내려간 부족분입니다. 간격은 실제 날짜 수가 아닙니다."
      note="300만·100만 원과 지급 순서는 추가 (가정)이고, 보증금 2천만 원은 앞의 정산 조건이 성립할 때의 (가정)입니다."
      ariaLabel="통장 잔액 100만 원에서 300만 원을 지급하면 200만 원 부족해지고 그 뒤에 보증금 2천만 원이 들어오는 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[-200, -100, 0, 100, 200].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke={AXIS_COLOR} strokeWidth={value === 0 ? 1 : 0.5} strokeDasharray={value === 0 ? undefined : "2 3"} />
              <text x={LEFT - 5} y={py(value) + 4} textAnchor="end" fontSize={12} fill={TEXT_COLOR}>{value < 0 ? `−${-value}` : value}</text>
            </g>
          ))}
          <text x={2} y={14} fontSize={12} fill={TEXT_COLOR}>만 원</text>
          {[{ x: X0, t: "오늘" }, { x: X1, t: "지급 기한" }, { x: X2, t: "보증금 입금" }].map((tick) => (
            <text key={tick.t} x={tick.x} y={H - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT_COLOR}>{tick.t}</text>
          ))}

          <line x1={X0} x2={X1} y1={py(100)} y2={py(100)} stroke={CASH_COLOR} strokeWidth={1.25} />
          <circle cx={X0} cy={py(100)} r={4} fill={CASH_COLOR} />
          <text x={X0} y={py(100) - 9} fontSize={13} fontWeight={700} fill={CASH_COLOR}>통장 100만</text>

          {active >= 1 && (
            <g>
              <rect x={X1} y={py(0)} width={X2 - X1} height={py(-200) - py(0)} fill={GAP_COLOR} opacity={0.14} />
              <line x1={X1} x2={X1} y1={py(100)} y2={py(-200)} stroke={GAP_COLOR} strokeWidth={1.25} />
              <line x1={X1} x2={X2} y1={py(-200)} y2={py(-200)} stroke={GAP_COLOR} strokeWidth={1.25} />
              <circle cx={X1} cy={py(-200)} r={4} fill={GAP_COLOR} />
              <text x={X1 - 7} y={py(-60)} textAnchor="end" fontSize={13} fontWeight={700} fill={GAP_COLOR}>300만 지급</text>
              <text x={(X1 + X2) / 2} y={py(-100) + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={GAP_COLOR}>200만 부족</text>
            </g>
          )}

          {active === 2 && (
            <g>
              <line x1={X2} x2={X2} y1={py(-200)} y2={TOP - 8} stroke={IN_COLOR} strokeWidth={1.25} />
              <path d={`M${X2 - 5} ${TOP - 1} L${X2} ${TOP - 9} L${X2 + 5} ${TOP - 1}`} fill="none" stroke={IN_COLOR} strokeWidth={1.25} />
              <text x={X2 - 8} y={py(240)} textAnchor="end" fontSize={13} fontWeight={700} fill={IN_COLOR}>+2천만</text>
              <text x={X2 - 8} y={py(240) + 16} textAnchor="end" fontSize={12} fill={IN_COLOR}>(축 밖으로)</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
