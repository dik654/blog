import { CircuitSketch } from "./CircuitSketch";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 두 갈래는 같은 위·아래 점에 닿고, 아래를 0으로 부르는 것은 기준을 고른 것이다.
 * 10을 더하는 장면의 10은 그림용 가정이다. 12 − 0 = 12, 22 − 10 = 12.
 */
const TOP = 44;
const BOTTOM = 160;

const SCENES = [
  { label: "이 모양이 아닙니다", summary: "두 부품을 차례로 ✕", note: "칸을 옆으로 이어 그린 앞 그림을 이렇게 읽으면 안 됩니다. 이 모양이면 흐름이 두 부품을 차례로 지나는 한 길이 됩니다." },
  { label: "실제 모양", summary: "같은 위·아래 점에 나란히", note: "어느 갈래를 택하든 출발점과 도착점이 같습니다. 주황 선이 두 갈래이고, 위쪽 점 하나와 아래쪽 도선 하나를 함께 씁니다." },
  { label: "아래쪽을 0이라 부릅니다", summary: "아래 0 · 위 12 · 갈림길 ?", note: "아래쪽을 비교 기준 0으로 골랐습니다. 아직 모르는 숫자는 갈림길의 값 하나뿐입니다." },
  { label: "모두에 10을 더해도", summary: "22 − 10 = 12", note: "10은 그림용으로 고른 수입니다(가정). 모든 점의 숫자는 바뀌어도 두 점 사이의 차이는 그대로 12입니다." },
];

export default function ParallelLayoutViz() {
  return (
    <SceneShell
      eyebrow="연결 모양"
      title="앞 그림의 세 번째 칸을 실제 배선으로 펼칩니다"
      description="원 안의 12는 공급 장치 양끝의 차이입니다. 숫자와 저항값은 모두 설명을 위한 가정입니다."
      ariaLabel="한 길로 잇지 않고 두 갈래를 같은 두 점에 나란히 붙인 회로와 기준점 이동"
      scenes={SCENES}
      render={(active) => {
        const shifted = active === 3;
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 0 ? (
              <g>
                <path d={`M 40 ${BOTTOM} V ${TOP} H 335 V ${BOTTOM} H 40`} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <circle cx={40} cy={102} r={14} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
                <text x={40} y={106} textAnchor="middle" fontSize={11} fontWeight={700} fill="#92400e">12</text>
                {[{ x: 75, text: "1 kΩ", fill: "#dbeafe", stroke: "#2563eb", ink: "#1e40af" }, { x: 160, text: "2 kΩ", fill: "#dcfce7", stroke: "#16a34a", ink: "#166534" }, { x: 245, text: "2 kΩ", fill: "#dcfce7", stroke: "#16a34a", ink: "#166534" }].map((box) => (
                  <g key={box.x}>
                    <rect x={box.x} y={TOP - 12} width={60} height={24} rx={5} fill={box.fill} stroke={box.stroke} strokeWidth={1} />
                    <text x={box.x + 30} y={TOP + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={box.ink}>{box.text}</text>
                  </g>
                ))}
                <text x={190} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">✕ 이 회로가 아닙니다</text>
              </g>
            ) : (
              <CircuitSketch top={TOP} bottom={BOTTOM} highlight={active === 1 ? ["left", "right"] : []} />
            )}
            {active === 1 && (
              <g fontSize={12} fontWeight={700} fill="#b45309">
                <circle cx={205} cy={TOP} r={4} fill="#d97706" />
                <circle cx={205} cy={BOTTOM} r={4} fill="#d97706" />
                <text x={252} y={TOP - 10} textAnchor="middle">같은 위쪽 점</text>
                <text x={252} y={BOTTOM + 18} textAnchor="middle">같은 아래쪽 도선</text>
              </g>
            )}
            {active >= 2 && (
              <g fontSize={13} fontWeight={700} fill="currentColor">
                <circle cx={205} cy={TOP} r={4} fill="#2563eb" />
                <text x={40} y={TOP - 10} textAnchor="middle">위 {shifted ? 22 : 12}</text>
                <text x={205} y={TOP - 10} textAnchor="middle">갈림길 {shifted ? "? + 10" : "?"}</text>
                <text x={120} y={BOTTOM + 18} textAnchor="middle">아래 {shifted ? 10 : 0}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
