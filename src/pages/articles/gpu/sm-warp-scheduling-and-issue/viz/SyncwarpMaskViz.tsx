import SceneShell from "./SceneShell";

/**
 * 본문 대응: #thread-scheduling — __syncwarp(mask)의 호출 규칙. 네 자리만 그린 그림이다.
 * 호출 thread의 bit가 mask에 있어야 하고, mask에 포함된 종료하지 않은 thread는 같은 mask로 호출해야 한다.
 */
type LaneState = "call" | "away" | "outside";
const INK = "#64748b";
const ACCENT = "#2563eb";
const BAD = "#dc2626";
const BARRIER_X = 228;

const CASES: readonly { bits: readonly number[]; lanes: readonly { state: LaneState; order?: number; text: string; bad?: boolean }[]; verdict: string; ok: boolean }[] = [
  {
    bits: [1, 1, 1, 1],
    lanes: [{ state: "call", order: 2, text: "호출" }, { state: "call", order: 4, text: "호출" }, { state: "call", order: 1, text: "호출" }, { state: "call", order: 3, text: "호출" }],
    verdict: "규칙 충족 · 네 자리의 대기와 메모리 순서 보장",
    ok: true,
  },
  {
    bits: [1, 1, 1, 1],
    lanes: [{ state: "call", order: 1, text: "호출" }, { state: "call", order: 3, text: "호출" }, { state: "call", order: 2, text: "호출" }, { state: "away", text: "호출 없음", bad: true }],
    verdict: "규칙 위반 · mask에 있는 lane 3의 대응 호출 없음",
    ok: false,
  },
  {
    bits: [1, 1, 0, 1],
    lanes: [{ state: "call", order: 3, text: "호출" }, { state: "call", order: 1, text: "호출" }, { state: "call", order: 2, text: "자기 bit 0", bad: true }, { state: "call", order: 4, text: "호출" }],
    verdict: "규칙 위반 · 호출한 lane 2의 bit가 mask에 없음",
    ok: false,
  },
  {
    bits: [1, 1, 0, 0],
    lanes: [{ state: "call", order: 2, text: "호출" }, { state: "call", order: 1, text: "호출" }, { state: "outside", text: "참여 안 함" }, { state: "outside", text: "참여 안 함" }],
    verdict: "규칙 충족 · 보장은 lane 0·1 사이에만",
    ok: true,
  },
];

const SCENES = [
  { label: "모두 호출", summary: "mask 1 1 1 1", note: "__syncwarp(mask)는 지정한 참여 thread들의 대기와 메모리 순서를 보장하는 도구입니다. 같은 warp라는 이유로 같은 지점에 함께 도착한다고 가정하지 않으므로 도착 순서를 섞어 그렸습니다(가정)." },
  { label: "참여자가 빠짐", summary: "mask 1 1 1 1 · 호출 3개", note: "Mask에 포함된 종료하지 않은 thread는 같은 mask의 대응 호출을 실행해야 합니다. Lane 3이 다른 경로로 가서 호출하지 않으면 일부 참여자가 도달하지 않는 대기가 되어 문제가 생깁니다." },
  { label: "자기 bit가 없음", summary: "mask 1 1 0 1 · 호출 4개", note: "각 호출 thread의 bit가 mask에 있어야 합니다. Lane 2는 호출했지만 자기 자리가 0입니다." },
  { label: "mask 밖의 자리", summary: "mask 1 1 0 0 · 호출 2개", note: "순서 보장은 참여 범위 안에서만 성립하며, block 전체나 다른 block의 순서를 제공하지 않습니다. 빠진 참여자를 덮으려고 아무 mask나 쓰면 안 되므로 누가 무엇을 언제 읽는지부터 확인합니다." },
] as const;

export default function SyncwarpMaskViz() {
  return (
    <SceneShell
      eyebrow="__syncwarp(mask)의 참여 규칙"
      title="Mask의 bit와 실제 호출이 자리마다 맞아야 합니다"
      description="Mask는 참여할 thread를 자리마다 1로 표시한 값입니다. 한 warp의 32자리 중 네 자리만 그렸고 왼쪽 bit부터 lane 0으로 읽습니다(그림의 가정). 동그라미 숫자는 도착 순서입니다."
      ariaLabel="mask bit와 호출 여부 조합별 규칙 충족 여부"
      scenes={SCENES}
      render={(index) => {
        const item = CASES[index];
        const lastCall = item.lanes.reduce<number>((last, lane, row) => (lane.state === "call" ? row : last), 0);
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${item.verdict}`}>
            <text x={62} y={16} textAnchor="middle" fontSize={12} fill={INK}>bit</text>
            <text x={BARRIER_X} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>__syncwarp</text>
            <line x1={BARRIER_X} x2={BARRIER_X} y1={24} y2={52 + lastCall * 40 + 16} stroke={ACCENT} strokeWidth={1.25} />
            {item.lanes.map((lane, row) => {
              const y = 52 + row * 40;
              const bit = item.bits[row];
              return (
                <g key={row}>
                  <text x={0} y={y + 4} fontSize={12} fill={INK}>lane {row}</text>
                  <rect x={50} y={y - 12} width={24} height={24} rx={4} fill={bit ? ACCENT : "none"} opacity={bit ? 0.85 : 1} stroke={lane.bad && !bit ? BAD : INK} strokeWidth={1} />
                  <text x={62} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={bit ? "#ffffff" : lane.bad ? BAD : INK}>{bit}</text>
                  {lane.state === "call" && (
                    <>
                      <line x1={84} x2={BARRIER_X - 14} y1={y} y2={y} stroke={INK} strokeWidth={1} />
                      <circle cx={BARRIER_X - 12} cy={y} r={10} fill={ACCENT} />
                      <text x={BARRIER_X - 12} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">{lane.order}</text>
                    </>
                  )}
                  {lane.state === "away" && <path d={`M84 ${y} H150 L176 ${y + 16}`} fill="none" stroke={BAD} strokeWidth={1} strokeDasharray="4 3" />}
                  {lane.state === "outside" && <line x1={84} x2={BARRIER_X + 2} y1={y} y2={y} stroke={INK} strokeWidth={1} strokeDasharray="2 4" />}
                  <text x={BARRIER_X + 12} y={y + 4} fontSize={12} fontWeight={lane.bad ? 700 : 400} fill={lane.bad ? BAD : INK}>{lane.text}</text>
                </g>
              );
            })}
            <text x={0} y={208} fontSize={12} fontWeight={700} fill={item.ok ? ACCENT : BAD}>{item.verdict}</text>
          </svg>
        );
      }}
    />
  );
}
