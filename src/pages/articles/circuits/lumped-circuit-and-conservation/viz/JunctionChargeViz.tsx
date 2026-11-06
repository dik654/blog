import { ArrowHead } from "./CircuitSketch";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #junction — 1초에 0.006 C가 들어오면 각 출구로 0.003 C씩 나간다.
 * 점 하나 = 0.001 C(그림 단위). 들어옴 6개, 나감 3 + 3개. 6 − 3 − 3 = 0.
 */
const CX = 180;
const CY = 100;
const IN_X = [28, 46, 64, 82, 100, 118];
const OUT_T = [0.42, 0.57, 0.72];
const outPoint = (t: number, sign: 1 | -1) => ({ x: CX + 160 * t, y: CY + sign * 60 * t });
const AFTER = [...OUT_T.map((t) => outPoint(t, -1)), ...OUT_T.map((t) => outPoint(t, 1))];

const SCENES = [
  { label: "갈림길에 경계를 긋습니다", summary: "1초에 0.006 C 들어옴", note: "점선이 갈림길 주변에 그린 작은 경계입니다. 전류 6 mA는 1초에 0.006 C가 지나간다는 뜻이므로 왼쪽 도선에 점 여섯 개를 놓았습니다." },
  { label: "두 출구로 나갑니다", summary: "0.003 C + 0.003 C", note: "점이 둘로 쪼개지지 않습니다. 같은 1초 동안 온전한 점 셋씩 두 출구로 나갑니다. 전류가 갈라진다는 말은 이렇게 총량이 나뉜다는 뜻입니다." },
  { label: "부호를 붙여 셉니다", summary: "6 − 3 − 3 = 0 mA", note: "들어온 흐름은 양수, 나간 흐름은 음수로 셉니다. 합이 0이면 경계 안에 전하가 계속 쌓이지 않는 상태와 맞습니다." },
];

export default function JunctionChargeViz() {
  return (
    <SceneShell
      eyebrow="갈림길에서 세기"
      title="1초 동안 경계를 드나드는 전하를 세어 봅니다"
      description="파란 점 하나를 0.001 C 묶음으로 그렸습니다(그림 단위, 가정). 전자 하나를 뜻하지 않습니다."
      ariaLabel="갈림길 경계로 들어온 전하 여섯 묶음이 두 출구로 세 묶음씩 나가는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <path d={`M 14 ${CY} H ${CX} L ${CX + 160} ${CY - 60} M ${CX} ${CY} L ${CX + 160} ${CY + 60}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
          <ArrowHead x={CX - 40} y={CY} />
          <ArrowHead x={CX + 160} y={CY - 60} angle={-20.6} />
          <ArrowHead x={CX + 160} y={CY + 60} angle={20.6} />
          <circle cx={CX} cy={CY} r={46} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 4" />
          <circle cx={CX} cy={CY} r={3.5} fill="#64748b" />
          <text x={CX} y={CY - 56} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">경계</text>
          {IN_X.map((x, index) => {
            const at = active === 0 ? { x, y: CY } : AFTER[index];
            return <circle key={index} cx={0} cy={0} r={5.5} fill="#2563eb" className="transition-transform duration-500 motion-reduce:transition-none" style={{ transform: `translate(${at.x}px, ${at.y}px)` }} />;
          })}
          <g fontSize={12} fontWeight={700} fill="currentColor">
            <text x={74} y={CY - 16} textAnchor="middle">{active === 2 ? "들어옴 +6 mA" : "들어옴 0.006 C"}</text>
            {active >= 1 && (
              <>
                <text x={348} y={CY - 72} textAnchor="end">{active === 2 ? "나감 −3 mA" : "나감 0.003 C"}</text>
                <text x={348} y={CY + 80} textAnchor="end">{active === 2 ? "나감 −3 mA" : "나감 0.003 C"}</text>
              </>
            )}
          </g>
          {active === 2 && <text x={CX} y={CY + 30} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">합 0</text>}
        </svg>
      )}
    />
  );
}
