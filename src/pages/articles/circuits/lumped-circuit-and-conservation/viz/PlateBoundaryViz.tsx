import { ArrowHead } from "./CircuitSketch";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #junction — Kirchhoff 1845의 금속판과 닫힌 곡선, 그리고 ∫ ds · du/dN = 0의 기호.
 * 금속판에는 숫자를 주지 않았으므로 판 장면에 숫자를 적지 않는다. 화살표의 수와 방향은 그림용이다.
 */
const CX = 180;
const CY = 97;
const RX = 72;
const RY = 50;
const FLOW_Y = [68, 86, 108, 126];
const edge = (y: number) => RX * Math.sqrt(1 - ((y - CY) / RY) ** 2);

const THETA = (-20 * Math.PI) / 180;
const onCurve = (angle: number) => ({ x: CX + RX * Math.cos(angle), y: CY + RY * Math.sin(angle) });
const DS_START = onCurve(THETA - 0.22);
const DS_END = onCurve(THETA + 0.22);
const DS_MID = onCurve(THETA);
const NORMAL_LENGTH = Math.hypot(Math.cos(THETA) / RX, Math.sin(THETA) / RY);
const NORMAL_TIP = {
  x: DS_MID.x + (46 * Math.cos(THETA)) / RX / NORMAL_LENGTH,
  y: DS_MID.y + (46 * Math.sin(THETA)) / RY / NORMAL_LENGTH,
};
const NORMAL_ANGLE = (Math.atan2(NORMAL_TIP.y - DS_MID.y, NORMAL_TIP.x - DS_MID.x) * 180) / Math.PI;

const SCENES = [
  { label: "1845년의 대상은 금속판", summary: "닫힌 곡선을 드나드는 흐름", note: "정상 상태(흐름이 시간에 따라 변하지 않는 상태)의 얇은 금속판에 닫힌 곡선을 그립니다. 곡선 안에 전류를 따로 넣지 않으면 경계로 드나드는 흐름의 합이 0이라고 적었습니다. 이 그림은 원문의 도판이 아니며, 화살표의 수와 방향은 그림용입니다(가정)." },
  { label: "원문 식의 기호", summary: "∫ ds · du/dN = 0", note: "곡선을 작은 길이 ds로 나누고, 그 조각에 수직인 방향 N을 따라 전위 u가 변하는 정도 du/dN을 곱합니다. ∫는 그 값을 닫힌 곡선 전체에서 더한다는 표시입니다. 판의 좌표나 전도율(전기가 통하는 정도)을 정하지 않았으므로 숫자는 넣지 않습니다." },
  { label: "세 도선으로 줄이면", summary: "6 − 3 − 3 = 0 mA", note: "연속적인 흐름을 갈림길의 세 도선으로 줄였습니다. 경계의 순유입이 0이라는 조건만 옮겨 왔고, 숫자를 넣을 수 있는 곳은 이 세 도선입니다." },
];

export default function PlateBoundaryViz() {
  return (
    <SceneShell
      eyebrow="원문의 대상"
      title="금속판의 닫힌 곡선이 갈림길의 경계로 줄어듭니다"
      description="Kirchhoff 원문이 다룬 판과 이 글의 세 도선을 같은 경계로 놓았습니다."
      ariaLabel="금속판의 닫힌 곡선과 경계 조각, 그리고 같은 경계를 지나는 세 도선"
      scenes={SCENES}
      render={(active) => {
        const plate = active < 2;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {plate && <rect x={16} y={18} width={328} height={160} rx={6} fill="#64748b" fillOpacity={0.1} stroke="#94a3b8" strokeWidth={1} />}
            {plate && <text x={26} y={36} fontSize={11} fill="#64748b">얇은 금속판</text>}
            {plate && FLOW_Y.map((y) => (
              <g key={y} opacity={active === 1 ? 0.3 : 1}>
                <line x1={36} x2={324} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
                <ArrowHead x={CX - edge(y) + 3} y={y} color="#2563eb" />
                <ArrowHead x={CX + edge(y) + 3} y={y} color="#d97706" />
              </g>
            ))}
            {active === 2 && (
              <g>
                <path d={`M 30 ${CY} H ${CX} L 330 ${CY - 62} M ${CX} ${CY} L 330 ${CY + 62}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <ArrowHead x={CX - RX + 3} y={CY} color="#2563eb" />
                <ArrowHead x={330} y={CY - 62} angle={-22.5} color="#d97706" />
                <ArrowHead x={330} y={CY + 62} angle={22.5} color="#d97706" />
                <circle cx={CX} cy={CY} r={3.5} fill="#64748b" />
                <g fontSize={12} fontWeight={700} fill="currentColor">
                  <text x={56} y={CY - 10} textAnchor="middle">+6 mA</text>
                  <text x={346} y={CY - 72} textAnchor="end">−3 mA</text>
                  <text x={346} y={CY + 80} textAnchor="end">−3 mA</text>
                </g>
              </g>
            )}
            <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 4" />
            {active === 0 && (
              <g fontSize={12} fontWeight={700}>
                <text x={72} y={160} textAnchor="middle" fill="#2563eb">들어오는 흐름 →</text>
                <text x={288} y={160} textAnchor="middle" fill="#b45309">나가는 흐름 →</text>
                <text x={CX} y={CY + 4} textAnchor="middle" fill="#64748b" fontWeight={400} fontSize={11}>따로 넣은 전류 없음</text>
              </g>
            )}
            {active === 1 && (
              <g fontSize={13} fontWeight={700}>
                <path d={`M ${DS_START.x} ${DS_START.y} A ${RX} ${RY} 0 0 1 ${DS_END.x} ${DS_END.y}`} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                <circle cx={DS_START.x} cy={DS_START.y} r={2.5} fill="#dc2626" />
                <circle cx={DS_END.x} cy={DS_END.y} r={2.5} fill="#dc2626" />
                <line x1={DS_MID.x} y1={DS_MID.y} x2={NORMAL_TIP.x} y2={NORMAL_TIP.y} stroke="#2563eb" strokeWidth={1.25} />
                <ArrowHead x={NORMAL_TIP.x} y={NORMAL_TIP.y} angle={NORMAL_ANGLE} color="#2563eb" />
                <text x={DS_MID.x - 8} y={DS_MID.y + 5} textAnchor="end" fill="#dc2626">ds 작은 길이</text>
                <text x={NORMAL_TIP.x + 6} y={NORMAL_TIP.y - 2} fill="#2563eb">N 수직</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
