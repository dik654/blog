import { INSIDE } from "../model";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #specific-assets — 밖의 비용 b = 탐색 1 + 협상 1 + 확인 2 + 재협상 2 × 1/2 = 5.
 * b가 4에서 5로 오르면 최저인 안의 작업 수가 3개·4개에서 4개·5개로 옮겨 간다. 안쪽 1~6은 그대로.
 */
const UNIT = 64;
const X0 = 20;

const PARTS = [
  { name: "탐색", size: 1, fill: "#94a3b8" },
  { name: "협상", size: 1, fill: "#cbd5e1" },
  { name: "확인", size: 2, fill: "#94a3b8" },
] as const;

const SCENES = [
  { label: "범용 부품의 b", summary: "1 + 1 + 2 = 4", note: "지금까지의 밖의 비용입니다. 상대를 찾고 조건을 협상하고 이행을 확인하는 값입니다. 부품을 만드는 비용은 들어 있지 않습니다." },
  { label: "묶인 뒤 규격이 바뀔 때", summary: "2 × 1/2 = 1", note: "전용 설비로 서로 묶인 상태에서 규격이 바뀌면 늘어난 이득을 누가 얼마나 가져갈지 흥정합니다. 두 번에 한 번꼴로 2가 드니 작업 하나에 평균 1을 더합니다. 그림에서 바뀌는 주문을 둘째로 둔 것은 설명용 배치입니다." },
  { label: "전용 설비의 b", summary: "4 + 1 = 5", note: "재협상 1이 밖의 비용에만 더해집니다. 안에서는 규격 변경을 지시로 맞추므로 이 1이 생기지 않는다고 두었습니다(가정)." },
  { label: "최저인 개수가 옮겨 간다", summary: "3개·4개 → 4개·5개", note: "일을 안으로 들일 때의 비용 1~6은 바꾸지 않았습니다. b가 5가 되자 일 4가 안쪽으로 넘어오고 일 5가 동률이 됩니다. 최저 합계는 18에서 20이 됩니다." },
] as const;

function Choice({ y, b }: { y: number; b: number }) {
  return (
    <g>
      <text x={X0} y={y + 18} fontSize={12} fontWeight={700} fill="#64748b">b = {b}</text>
      {INSIDE.map((a, i) => {
        const x = 72 + i * 46;
        const word = a < b ? "안" : a > b ? "밖" : "동률";
        return (
          <g key={a}>
            <rect x={x} y={y} width={42} height={28} rx={4} fill={a < b ? "#94a3b8" : "none"} stroke="#64748b" strokeWidth={1} strokeDasharray={a === b ? "3 2" : undefined} />
            <text x={x + 21} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={a < b ? "#0f172a" : "#64748b"}>{a}·{word}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function RenegotiationViz() {
  return (
    <SceneShell
      eyebrow="밖의 비용 쌓기"
      title="재협상의 기대 비용 1이 b를 4에서 5로 올립니다"
      description="가로 막대의 길이가 작업 하나당 밖의 비용입니다. 탐색·협상·확인의 분해, 재협상 2와 확률 1/2, 그 결과인 b = 5는 모두 본문의 (가정)입니다."
      ariaLabel="밖의 비용 구성에 재협상 기대 비용을 더해 최저 개수가 옮겨 가는 과정"
      scenes={SCENES}
      render={(active) => {
        const offsets = PARTS.map((_, i) => PARTS.slice(0, i).reduce<number>((sum, part) => sum + part.size, 0));
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {PARTS.map((part, i) => (
              <g key={part.name}>
                <rect x={X0 + offsets[i] * UNIT} y={10} width={part.size * UNIT} height={36} fill={part.fill} stroke="#64748b" strokeWidth={1} />
                <text x={X0 + (offsets[i] + part.size / 2) * UNIT} y={33} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{part.name} {part.size}</text>
              </g>
            ))}
            <rect x={X0 + 4 * UNIT} y={10} width={UNIT} height={36} fill={active >= 2 ? "#d97706" : "none"} stroke="#64748b" strokeWidth={1} strokeDasharray={active >= 2 ? undefined : "3 2"} />
            <text x={X0 + 4.5 * UNIT} y={33} textAnchor="middle" fontSize={11} fontWeight={700} fill={active >= 2 ? "#0f172a" : "#64748b"}>{active >= 1 ? "재협상 1" : "없음"}</text>

            {active === 1 && (
              <g>
                <rect x={X0} y={72} width={150} height={36} rx={4} fill="none" stroke="#64748b" strokeWidth={1} />
                <text x={X0 + 75} y={94} textAnchor="middle" fontSize={12} fill="#64748b">주문 ① 규격 그대로 · 0</text>
                <rect x={X0 + 170} y={72} width={150} height={36} rx={4} fill="#d97706" stroke="#64748b" strokeWidth={1} />
                <text x={X0 + 245} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">주문 ② 규격 변경 · 2</text>
                <text x={180} y={134} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">작업 하나당 평균 2 × 1/2 = 1</text>
              </g>
            )}
            {active === 2 && (
              <text x={180} y={96} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">탐색 1 + 협상 1 + 확인 2 + 재협상 1 = 5</text>
            )}
            {active === 0 && (
              <text x={180} y={96} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">탐색 1 + 협상 1 + 확인 2 = 4</text>
            )}
            {active === 3 && (
              <g>
                <Choice y={70} b={4} />
                <Choice y={112} b={5} />
                <text x={180} y={162} textAnchor="middle" fontSize={11} fill="#64748b">칸 = 일의 안쪽 비용·선택</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
