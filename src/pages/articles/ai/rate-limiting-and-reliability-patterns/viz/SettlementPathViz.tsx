import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-reservation — 예약 5,000, 실제 1,200, 돌려줌 3,800.
 * 예약 없이 끝난 뒤에만 빼는 경우 0 → 1,200. 연결이 끊긴 요청은 그때까지 만든 token으로 정산.
 * 끊기 전 출력 100은 가정이다: 1,000 + 100 = 1,100, 5,000 − 1,100 = 3,900.
 */
const W = 360;
const H = 172;
const COL = [84, 190, 306];
const y = (value: number) => 134 - (value / 5000) * 108;
const BLUE = "#2563eb";
const RED = "#dc2626";
const SLATE = "#64748b";

const SCENES = [
  { label: "예약 뒤 정산", summary: "5,000 → 1,200, 3,800 돌려줌", values: [5000, 5000, 1200], end: "끝난 뒤", tag: "1,200", gap: "3,800 돌려줌", color: BLUE, note: "받을 때 5,000을 빼 두고 끝나면 실제 1,200과의 차이를 돌려줍니다. 끝나지 않은 요청은 최대치로 잡혀 있으므로 이 방식도 한도를 넘지 않습니다." },
  { label: "돌려주지 않으면", summary: "5,000이 그대로 남음", values: [5000, 5000, 5000], end: "끝난 뒤", tag: "5,000", gap: "", color: RED, note: "실제로는 1,200만 썼는데 분마다 초기화될 때까지 5,000이 카운터에 남습니다. 앞의 48건처럼 실제 사용량이 한도에 한참 못 미쳐도 일찍 막힙니다." },
  { label: "예약 없이 끝난 뒤에만 빼면", summary: "진행 중에는 0", values: [0, 0, 1200], end: "끝난 뒤", tag: "1,200", gap: "", color: RED, note: "요청이 도는 동안 카운터에 아무것도 올라가지 않습니다. 동시에 들어온 긴 요청들이 모두 빈 카운터를 보고 한꺼번에 통과해, 끝난 뒤에 합치면 한도를 넘습니다." },
  { label: "도중에 연결이 끊기면", summary: "1,000 + 100 = 1,100 (가정)", values: [5000, 5000, 1100], end: "끊긴 뒤", tag: "1,100", gap: "3,900 돌려줌", color: BLUE, note: "끊긴 요청도 그때까지 만든 token으로 정산해야 예약이 새지 않습니다. 끊기기 전 출력이 100 token이었다고 가정한 계산입니다." },
] as const;

export default function SettlementPathViz() {
  return (
    <SceneShell
      eyebrow="한 요청의 예약"
      title="요청 하나가 카운터에 올려 둔 양은 시간에 따라 이렇게 바뀝니다"
      description="가로축은 요청의 진행, 세로축은 이 요청이 카운터에서 차지하는 token입니다. Prompt 1,000, max_tokens 4,000, 실제 출력 200인 앞의 요청입니다."
      ariaLabel="예약 뒤 정산과 정산이 어긋나는 경우에 요청이 카운터에서 차지하는 양의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const [a, b, c] = scene.values;
        const path = `M${COL[0]} ${y(a)}H${COL[1]}V${y(b)}H${COL[2] - 34}V${y(c)}H${COL[2] + 34}`;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 5000].map((value) => (
              <g key={value}>
                <line x1={52} x2={W - 12} y1={y(value)} y2={y(value)} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray={value === 0 ? undefined : "3 3"} />
                <text x={46} y={y(value) + 4} textAnchor="end" fontSize={11} fill={SLATE}>{value.toLocaleString("en-US")}</text>
              </g>
            ))}
            <path d={path} fill="none" stroke={scene.color} strokeWidth={1.25} />
            <circle cx={COL[0]} cy={y(a)} r={3} fill={scene.color} />
            <text x={COL[2] + 2} y={y(c) - 7} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.color}>{scene.tag}</text>
            {scene.gap && (
              <g>
                <path d={`M${COL[2] - 44} ${y(5000) + 4}V${y(c) - 4}M${COL[2] - 48} ${y(c) - 9}L${COL[2] - 44} ${y(c) - 4}L${COL[2] - 40} ${y(c) - 9}`} stroke="#16a34a" strokeWidth={1} fill="none" />
                <text x={COL[2] - 50} y={(y(5000) + y(c)) / 2 + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#16a34a">{scene.gap}</text>
              </g>
            )}
            {a === 0 && <text x={(COL[0] + COL[1]) / 2} y={y(0) - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>카운터에 아직 0</text>}
            {[["받을 때", COL[0]], ["진행 중", COL[1]], [scene.end, COL[2]]].map(([text, at]) => (
              <text key={String(text)} x={Number(at)} y={154} textAnchor="middle" fontSize={11} fill={SLATE}>{text}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
