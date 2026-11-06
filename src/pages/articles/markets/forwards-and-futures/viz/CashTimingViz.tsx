import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 선도는 만기에 차액 500, 선물은 31만 날 100 + 이후 누적 400.
 * 도착점은 같고 현금이 움직이는 날짜만 다르다. 가로 간격은 날짜에 비례하지 않는다.
 */
const SCENES = [
  { label: "계약일 30만 원", summary: "아직 오간 돈 0원", note: "가격이 정해졌을 뿐 차액은 없습니다. 여기서 일일 정산은 선물의 손익을 날마다 반영하는 것입니다. 실제 평가 빈도와 납부 시한은 상품·청산·중개 계약에 따라 확인해야 합니다." },
  { label: "31만 원인 날", summary: "100톤 × 1만 원 = 100만 원", note: "선물이라면 그날 매수자가 100만 원을 받고 매도자가 100만 원을 냅니다. 이 글의 선도 예에서는 아직 오간 돈이 없습니다. 가격이 되돌아오면 반대 방향 정산이 생길 수 있습니다." },
  { label: "35만 원 만기", summary: "선도 500 = 선물 100 + 400", note: "31만에서 35만까지 누적 400만 원이 같은 방향으로 갑니다. 전체 차액 500만 원은 같습니다. 점선은 그 사이 날짜별 금액이 정해져 있지 않다는 표시입니다." },
  { label: "매도한 농가 쪽", summary: "수확대금 전에 100만 원부터 냄", note: "농가는 수확대금을 아직 받지 않았으므로 이 돈을 따로 마련해야 합니다. 중간 증거금을 못 내서 매도 계약을 닫으면 만기까지 계산했던 고정 대금은 실현되지 않습니다." },
] as const;

const X = [60, 170, 290];
const Y0 = 105;
const per = 75 / 500;
const yOf = (value: number) => Y0 - value * per;
const AXIS = [
  ["계약일", "30만 원"],
  ["중간의 어느 날", "31만 원"],
  ["만기", "35만 원"],
] as const;

const GRAY = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";

function FuturesLine({ sign, reach, color, opacity }: { sign: 1 | -1; reach: number; color: string; opacity: number }) {
  return (
    <g opacity={opacity}>
      {reach >= 1 && <polyline points={`${X[0]},${Y0} ${X[1]},${Y0} ${X[1]},${yOf(sign * 100)}`} fill="none" stroke={color} strokeWidth={1.25} />}
      {reach >= 1 && <circle cx={X[1]} cy={yOf(sign * 100)} r={3} fill={color} />}
      {reach >= 2 && <line x1={X[1]} y1={yOf(sign * 100)} x2={X[2]} y2={yOf(sign * 500)} stroke={color} strokeWidth={1.25} strokeDasharray="4 3" />}
      {reach >= 2 && <circle cx={X[2]} cy={yOf(sign * 500)} r={3} fill={color} />}
    </g>
  );
}

export default function CashTimingViz() {
  return (
    <SceneShell
      eyebrow="현금이 움직이는 날"
      title="전체 차액은 같아도 돈이 움직이는 날짜가 다릅니다"
      description="세로축은 밀 100톤 계약에서 그때까지 받거나 낸 돈의 누적(만 원)입니다. 가격 경로는 글의 가정이고, 가로 간격은 날짜에 비례하지 않습니다."
      ariaLabel="선도와 선물의 누적 현금 흐름 비교"
      scenes={SCENES}
      render={(active) => {
        const reach = Math.min(active, 2);
        const sellerOnly = active === 3;
        const focus = sellerOnly ? 1 : reach;
        return (
          <svg viewBox="0 0 360 216" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={40} fontSize={11} fill={GRAY}>누적 받음</text>
            <text x={4} y={176} fontSize={11} fill={GRAY}>누적 냄</text>
            <line x1={X[0] - 6} x2={X[2] + 6} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <text x={X[0] - 10} y={Y0 + 4} textAnchor="end" fontSize={11} fill={GRAY}>0</text>
            {X.map((x, index) => (
              <g key={x}>
                <line x1={x} x2={x} y1={26} y2={184} stroke="#94a3b8" strokeWidth={1} strokeDasharray="1 3" />
                <text x={x} y={198} textAnchor="middle" fontSize={11} fontWeight={index === focus ? 700 : 400} fill={GRAY}>{AXIS[index][0]}</text>
                <text x={x} y={212} textAnchor="middle" fontSize={11} fontWeight={index === focus ? 700 : 400} fill={GRAY}>{AXIS[index][1]}</text>
              </g>
            ))}

            <g opacity={sellerOnly ? 0.3 : 1}>
              {reach >= 1 && <line x1={X[0]} x2={X[1]} y1={Y0 - 2} y2={Y0 - 2} stroke={GRAY} strokeWidth={1.25} />}
              {reach >= 1 && <text x={X[1] + 42} y={Y0 - 6} fontSize={11} fill={GRAY}>선도 매수</text>}
              {reach >= 2 && <polyline points={`${X[1]},${Y0 - 2} ${X[2]},${Y0 - 2} ${X[2]},${yOf(500)}`} fill="none" stroke={GRAY} strokeWidth={1.25} />}
            </g>
            <FuturesLine sign={1} reach={reach} color={BLUE} opacity={sellerOnly ? 0.3 : 1} />
            <FuturesLine sign={-1} reach={reach} color={AMBER} opacity={1} />

            {reach >= 1 && (
              <>
                <g opacity={sellerOnly ? 0.3 : 1}>
                  <text x={X[1] - 6} y={yOf(100) + 2} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>+100</text>
                  <text x={X[1] - 20} y={60} fontSize={11} fill={BLUE}>선물 매수</text>
                </g>
                <text x={X[1] - 6} y={yOf(-100) + 6} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>−100</text>
                <text x={X[1] - 20} y={160} fontSize={11} fill={AMBER}>선물 매도</text>
              </>
            )}
            {reach >= 2 && (
              <>
                <text x={X[2] + 7} y={yOf(500) + 4} fontSize={12} fontWeight={700} fill={BLUE} opacity={sellerOnly ? 0.3 : 1}>+500</text>
                <text x={X[2] + 7} y={yOf(-500) + 4} fontSize={12} fontWeight={700} fill={AMBER}>−500</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
