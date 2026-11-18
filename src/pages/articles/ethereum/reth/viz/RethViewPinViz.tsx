import SceneShell from "./RethSceneShell";

/**
 * 본문 대응: "조회 계층(Provider)은 … 일관된 조회 시점을 제공합니다".
 * RPC 하나가 블록 머리글을 먼저 읽고 상태를 나중에 읽는 사이에 분기 재편이 끼어드는 경우.
 * 고정하지 않으면 이전 머리글 + 새 상태가 섞이고, 고정하면 끝까지 이전 시점을 읽거나 처음부터 새 시점으로 다시 읽는다.
 */
const W = 360;
const H = 206;
const X0 = 78;
const X1 = 350;
const T1 = 128;
const T2 = 214;
const T3 = 292;
const LANE_HEAD = 38;
const LANE_READ = 88;
const AXIS_Y = 178;

const OLD = "#64748b";
const NEW = "#2563eb";
const BAD = "#dc2626";
const OK = "#16a34a";
const MUTED = "#94a3b8";

type Read = { x: number; label: string; from: "old" | "new" | "none" };

const SCENES = [
  {
    label: "조회 시작",
    summary: "머리글 ← 이전 head",
    reorg: false,
    pinned: false,
    reads: [{ x: T1, label: "머리글", from: "old" }, { x: T3, label: "상태", from: "none" }] as Read[],
    answer: { text: "아직 상태를 읽지 않음", color: MUTED },
    note: "RPC 요청 하나가 블록 머리글을 먼저 읽고 상태는 조금 뒤에 읽는다고 하겠습니다(가정). 첫 읽기 때 정본의 끝(head)은 이전 head입니다.",
  },
  {
    label: "읽는 도중 분기 재편",
    summary: "head: 이전 → 새",
    reorg: true,
    pinned: false,
    reads: [{ x: T1, label: "머리글", from: "old" }, { x: T3, label: "상태", from: "none" }] as Read[],
    answer: { text: "두 번째 읽기를 앞두고 head가 바뀜", color: MUTED },
    note: "분기 재편(reorg)은 합의 쪽 분기 선택이 바뀌어 head가 다른 분기로 옮겨 가는 일입니다. 두 읽기 사이에 끼어들면 두 번째 읽기가 어느 쪽을 볼지가 문제가 됩니다.",
  },
  {
    label: "시점을 고정하지 않으면",
    summary: "이전 머리글 + 새 상태",
    reorg: true,
    pinned: false,
    reads: [{ x: T1, label: "머리글", from: "old" }, { x: T3, label: "상태", from: "new" }] as Read[],
    answer: { text: "섞인 답 · 서로 다른 분기의 자료", color: BAD },
    note: "두 번째 읽기가 그때의 최신 head를 따라가면 머리글은 이전 분기, 상태는 새 분기에서 옵니다. 어느 블록에도 속하지 않는 답이 됩니다.",
  },
  {
    label: "고정한 시점을 끝까지",
    summary: "이전 머리글 + 이전 상태",
    reorg: true,
    pinned: true,
    reads: [{ x: T1, label: "머리글", from: "old" }, { x: T3, label: "상태", from: "old" }] as Read[],
    answer: { text: "일관된 답 · 한 블록 해시와 상태 루트", color: OK },
    note: "조회 시점(view)은 블록 해시 하나와 그 상태 루트에 속한 자료만 읽도록 시작할 때 묶어 둔 기준입니다. head가 바뀌어도 이 요청은 묶어 둔 이전 시점을 끝까지 읽습니다.",
  },
  {
    label: "처음부터 다시",
    summary: "새 머리글 + 새 상태",
    reorg: true,
    pinned: true,
    reads: [{ x: 254, label: "머리글", from: "new" }, { x: 320, label: "상태", from: "new" }] as Read[],
    answer: { text: "일관된 답 · 새 head의 한 시점", color: OK },
    note: "다른 선택은 읽던 것을 버리고 새 head에서 시점을 다시 묶어 처음부터 읽는 것입니다. 어느 쪽이든 한 답 안의 자료는 같은 조회 시점에서 나옵니다.",
  },
] as const;

function readColor(from: Read["from"]) {
  return from === "old" ? OLD : from === "new" ? NEW : MUTED;
}

export default function RethViewPinViz() {
  return (
    <SceneShell
      eyebrow="조회 시점 · 분기 재편 중의 읽기"
      title="읽는 도중 head가 바뀌어도 한 답은 한 조회 시점에서만 나와야 합니다"
      description="조회 시점은 한 블록 해시와 그 상태 루트에 속한 자료만 읽도록 묶은 기준입니다. 위 띠는 시간에 따라 바뀌는 정본의 끝(head), 가운데 점은 RPC 요청 하나의 두 번 읽기입니다. 점 아래 글자와 색은 그 읽기가 어느 head 쪽 자료를 가져왔는지를 뜻합니다. 읽기 순서와 시각은 설명용 가정입니다."
      ariaLabel="RPC 요청이 머리글과 상태를 나눠 읽는 사이 분기 재편이 일어날 때 조회 시점을 고정하는지에 따른 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const reads = scene.reads;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={LANE_HEAD + 4} fontSize={10} fontWeight={700} fill="#475569">정본 head</text>
            <text x={8} y={LANE_READ + 4} fontSize={10} fontWeight={700} fill="#475569">RPC 읽기</text>

            {scene.reorg ? (
              <>
                <rect x={X0} y={LANE_HEAD - 11} width={T2 - X0 - 2} height={22} rx={4} fill={OLD} opacity={0.18} stroke={OLD} strokeWidth={1} />
                <text x={(X0 + T2) / 2} y={LANE_HEAD + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={OLD}>이전 head</text>
                <rect x={T2 + 2} y={LANE_HEAD - 11} width={X1 - T2 - 2} height={22} rx={4} fill={NEW} opacity={0.18} stroke={NEW} strokeWidth={1} />
                <text x={(T2 + X1) / 2} y={LANE_HEAD + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={NEW}>새 head</text>
                <line x1={T2} x2={T2} y1={LANE_HEAD - 18} y2={114} stroke={BAD} strokeWidth={1} strokeDasharray="3 3" />
              </>
            ) : (
              <>
                <rect x={X0} y={LANE_HEAD - 11} width={X1 - X0} height={22} rx={4} fill={OLD} opacity={0.18} stroke={OLD} strokeWidth={1} />
                <text x={(X0 + X1) / 2} y={LANE_HEAD + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={OLD}>이전 head</text>
              </>
            )}

            {scene.pinned && active === 3 && (
              <rect x={T1 - 44} y={LANE_READ - 14} width={T3 - T1 + 88} height={44} rx={6} fill="none" stroke={OLD} strokeWidth={1.25} strokeDasharray="4 3" />
            )}
            {scene.pinned && active === 3 && (
              <text x={(X0 + X1) / 2} y={168} textAnchor="middle" fontSize={10} fontWeight={700} fill={OLD}>점선 상자 = 시작 때 묶은 조회 시점 (이전 head)</text>
            )}
            {active === 4 && (
              <>
                <line x1={T1 - 8} x2={T1 + 8} y1={LANE_READ - 8} y2={LANE_READ + 8} stroke={MUTED} strokeWidth={1.25} />
                <line x1={T1 - 8} x2={T1 + 8} y1={LANE_READ + 8} y2={LANE_READ - 8} stroke={MUTED} strokeWidth={1.25} />
                <text x={T1} y={LANE_READ + 24} textAnchor="middle" fontSize={11} fill={MUTED}>버림</text>
                <rect x={222} y={LANE_READ - 14} width={130} height={44} rx={6} fill="none" stroke={NEW} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={(X0 + X1) / 2} y={168} textAnchor="middle" fontSize={10} fontWeight={700} fill={NEW}>점선 상자 = 다시 묶은 조회 시점 (새 head)</text>
              </>
            )}

            {reads.map((read) => {
              const color = readColor(read.from);
              const source = read.from === "old" ? "이전" : read.from === "new" ? "새" : "?";
              return (
                <g key={`${read.label}-${read.x}`}>
                  <circle cx={read.x} cy={LANE_READ} r={6} fill={read.from === "none" ? "none" : color} stroke={color} strokeWidth={1.25} strokeDasharray={read.from === "none" ? "2 2" : undefined} />
                  {!(active === 4 && read.x === T1) && (
                    <text x={read.x} y={LANE_READ + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{`${read.label} ← ${source}`}</text>
                  )}
                </g>
              );
            })}

            <rect x={X0} y={120} width={X1 - X0} height={30} rx={6} fill="none" stroke={scene.answer.color} strokeWidth={1} />
            <text x={(X0 + X1) / 2} y={139} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.answer.color}>{scene.answer.text}</text>
            <text x={8} y={139} fontSize={10} fontWeight={700} fill="#475569">한 답</text>

            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke={MUTED} strokeWidth={1} />
            {scene.reorg && <line x1={T2} x2={T2} y1={AXIS_Y - 5} y2={AXIS_Y + 3} stroke={BAD} strokeWidth={1.25} />}
            <text x={X1} y={AXIS_Y + 22} textAnchor="end" fontSize={9} fill={MUTED}>시간 →</text>
            <text x={T2} y={AXIS_Y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={scene.reorg ? BAD : MUTED}>{scene.reorg ? "분기 재편" : ""}</text>
          </svg>
        );
      }}
    />
  );
}
