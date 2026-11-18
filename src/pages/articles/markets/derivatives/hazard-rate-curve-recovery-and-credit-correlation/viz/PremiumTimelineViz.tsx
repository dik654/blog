import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box 첫 문단 — 살아 있는 동안은 보호료, 부도가 나면 보호료가 멈추고 손실−회수만큼 보호금.
 * 1절 가정: 보호 대상 100, 연 보호료 1.2%, 회수 40. 분기 지급과 2년 기간, 부도 시점은 설명용 가정.
 * 분기 보호료 100×1.2%÷4=0.3, 8회 합계 2.4. 5번째 분기 중 부도면 4회 1.2에서 멈추고 보호금 100−40=60.
 */
const NOTIONAL = 100;
const RECOVERY = 40;
const QUARTERLY = (NOTIONAL * 0.012) / 4;
const QUARTERS = 8;
const DEFAULT_AFTER = 4;
const PAYOUT = NOTIONAL - RECOVERY;
const fmt = (value: number) => Number(value.toFixed(1)).toString();

const W = 360;
const H = 176;
const X0 = 40;
const X1 = 348;
const DX = (X1 - X0) / QUARTERS;
const AXIS_Y = 92;
const xq = (quarter: number) => X0 + quarter * DX;
const DEFAULT_X = xq(DEFAULT_AFTER + 0.5);

const SCENES = [
  {
    label: "끝까지 살아 있는 경로",
    summary: `분기 ${fmt(QUARTERLY)} × ${QUARTERS}회 = ${fmt(QUARTERLY * QUARTERS)}`,
    note: `보호 매수자는 회사채 100을 보호받으려고 보호료를 내는 쪽, 보호 매도자는 부도 손실을 메워 주는 쪽입니다. 연 1.2%를 분기마다 나눠 내면 한 번에 ${fmt(QUARTERLY)}이고, 회사가 2년 내내 살아 있으면 ${QUARTERS}번을 모두 냅니다. 이 경로에서 보호금은 한 번도 나가지 않습니다.`,
  },
  {
    label: "중간에 부도나는 경로(가정)",
    summary: `보호료 ${fmt(QUARTERLY * DEFAULT_AFTER)}에서 멈춤 · 보호금 ${PAYOUT}`,
    note: `5번째 분기 중에 부도가 났다고 하겠습니다(가정). 보호료는 그때까지 낸 ${DEFAULT_AFTER}번, ${fmt(QUARTERLY * DEFAULT_AFTER)}에서 멈춥니다. 보호 매도자는 100에서 회수 40을 뺀 ${PAYOUT}을 보호금으로 냅니다. 실제 계약의 미지급분 처리와 할인은 생략했습니다.`,
  },
  {
    label: "날짜마다 두 갈래",
    summary: `살아 있으면 ${fmt(QUARTERLY)} · 그 구간에 부도나면 ${PAYOUT}`,
    note: `미리 아는 것은 어느 경로가 올지가 아니라 날짜별 갈래입니다. 각 지급일의 보호료 ${fmt(QUARTERLY)}은 그날까지 살아 있을 때만, 보호금 ${PAYOUT}은 그 구간에 부도가 날 때만 움직입니다. 그래서 생존 현금흐름과 부도 현금흐름을 같은 날짜 칸에 맞춰 놓아야 합니다.`,
  },
] as const;

export default function PremiumTimelineViz() {
  return (
    <SceneShell
      eyebrow="보호료와 보호금"
      title="살아 있는 동안은 보호료가, 부도 순간에는 보호금이 움직입니다"
      description="가로축은 2년, 눈금 하나가 한 분기입니다. 1절의 보호 대상 100·연 보호료 1.2%·회수 40을 쓰고, 분기 지급과 2년 기간은 설명용 가정입니다. 위 줄은 보호 매수자가 내는 보호료, 아래 줄은 보호 매도자가 내는 보호금입니다."
      ariaLabel="분기별 보호료가 생존 동안 이어지고 부도 시 멈추며 보호금 60이 지급되는 시간선"
      scenes={SCENES}
      render={(active) => {
        const defaulted = active === 1;
        const both = active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={52} fontSize={11} fontWeight={700} fill="#2563eb">보호료</text>
            <text x={4} y={140} fontSize={11} fontWeight={700} fill="#dc2626">보호금</text>
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {Array.from({ length: QUARTERS + 1 }, (_, quarter) => (
              <line key={quarter} x1={xq(quarter)} x2={xq(quarter)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
            ))}
            {[0, 4, 8].map((quarter) => (
              <text key={quarter} x={xq(quarter)} y={AXIS_Y + 16} textAnchor="middle" fontSize={10} fill="#64748b">
                {quarter === 0 ? "0" : `${quarter / 4}년`}
              </text>
            ))}
            {Array.from({ length: QUARTERS }, (_, index) => {
              const quarter = index + 1;
              const paid = !defaulted || quarter <= DEFAULT_AFTER;
              const x = xq(quarter);
              return (
                <g key={quarter}>
                  <rect
                    x={x - 8}
                    y={58}
                    width={16}
                    height={20}
                    rx={2}
                    fill={paid && !both ? "#2563eb" : "none"}
                    fillOpacity={0.75}
                    stroke={paid ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={1}
                    strokeDasharray={both || !paid ? "3 2" : undefined}
                  />
                  <text x={x} y={52} textAnchor="middle" fontSize={9} fill={paid ? "#1e40af" : "#94a3b8"}>
                    {paid ? fmt(QUARTERLY) : "멈춤"}
                  </text>
                </g>
              );
            })}
            {both &&
              Array.from({ length: QUARTERS }, (_, index) => {
                const left = xq(index) + 4;
                return (
                  <g key={`payout-${index}`}>
                    <rect x={left} y={120} width={DX - 8} height={26} rx={2} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                    <text x={left + (DX - 8) / 2} y={137} textAnchor="middle" fontSize={9} fill="#b91c1c">{PAYOUT}?</text>
                  </g>
                );
              })}
            {defaulted && (
              <g>
                <line x1={DEFAULT_X} x2={DEFAULT_X} y1={30} y2={156} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={DEFAULT_X} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">부도(가정)</text>
                <rect x={DEFAULT_X - 20} y={118} width={40} height={30} rx={2} fill="#dc2626" fillOpacity={0.8} />
                <text x={DEFAULT_X} y={137} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">{PAYOUT}</text>
                <text x={DEFAULT_X + 26} y={137} textAnchor="start" fontSize={10} fill="#64748b">= 100 − 회수 40</text>
              </g>
            )}
            {active === 0 && (
              <text x={(X0 + X1) / 2} y={137} textAnchor="middle" fontSize={10} fill="#94a3b8">부도가 없으니 보호금도 없음</text>
            )}
            {both && (
              <text x={(X0 + X1) / 2} y={168} textAnchor="middle" fontSize={10} fill="#64748b">점선 칸 = 그 날짜까지 살아 있을 때 / 그 구간에 부도날 때만</text>
            )}
          </svg>
        );
      }}
    />
  );
}
