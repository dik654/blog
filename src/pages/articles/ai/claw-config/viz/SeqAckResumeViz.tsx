import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #remote "아래 protocol은 현재 근거가 아니라 다음 hardening 계약이다" — 재연결 뒤 같은 event가
 * 다시 오거나 일부가 빠질 수 있다. monotonic sequence로 duplicate와 gap을 구분하고, 마지막 처리 sequence를
 * ack한 뒤 보존 범위 안에서 replay하거나 현재 snapshot을 다시 보낸다.
 * 칸 하나 = sequence 번호 하나. 번호 1–8과 보존 범위는 가정.
 */
type Cell = "done" | "empty" | "dup" | "gap" | "arrive" | "replay";

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  cells: readonly Cell[];
  last: number;
  keep: readonly [number, number] | null;
  footer: string;
}[] = [
  {
    label: "끊기기 전에 4번까지 처리했습니다",
    summary: "마지막 처리 = 4",
    note: "event마다 1씩 커지는 sequence 번호가 붙습니다. receiver는 4번까지 처리했고 그 번호를 기억합니다.",
    cells: ["done", "done", "done", "done", "empty", "empty", "empty", "empty"],
    last: 4,
    keep: null,
    footer: "재연결 전",
  },
  {
    label: "재연결 직후 4번이 다시 옵니다",
    summary: "4 ≤ 4 → duplicate",
    note: "도착한 번호가 이미 처리한 번호보다 크지 않으면 같은 event가 다시 온 것입니다. 한 번 더 적용하지 않고 버립니다.",
    cells: ["done", "done", "done", "dup", "empty", "empty", "empty", "empty"],
    last: 4,
    keep: null,
    footer: "도착: 4",
  },
  {
    label: "그다음 6번이 옵니다",
    summary: "기대 5 · 도착 6 → gap",
    note: "다음에 와야 할 번호는 5인데 6이 왔습니다. 끊긴 사이 5가 빠졌다는 뜻이므로 6을 바로 적용하지 않습니다.",
    cells: ["done", "done", "done", "done", "gap", "arrive", "empty", "empty"],
    last: 4,
    keep: null,
    footer: "도착: 6",
  },
  {
    label: "ack 4를 보내고 5번부터 replay 받습니다",
    summary: "보존 범위 안 → replay",
    note: "receiver가 마지막 처리 번호 4를 ack하면 sender는 5번부터 다시 보냅니다. 5번이 sender의 보존 범위 안에 있을 때만 가능합니다.",
    cells: ["done", "done", "done", "done", "replay", "replay", "replay", "replay"],
    last: 8,
    keep: [5, 8],
    footer: "replay: 5 → 8",
  },
  {
    label: "5번이 보존 범위 밖이면 snapshot을 받습니다",
    summary: "보존 범위 밖 → snapshot",
    note: "sender가 7번부터만 보존하고 있다면(가정) 빠진 5번을 replay할 수 없습니다. 이때는 빈칸을 메우는 대신 현재 snapshot을 다시 보내 상태를 맞춥니다.",
    cells: ["done", "done", "done", "done", "gap", "arrive", "empty", "empty"],
    last: 4,
    keep: [7, 8],
    footer: "5 보존 안 됨 → 현재 snapshot",
  },
];

const FILL: Record<Cell, { fill: string; stroke: string; dash?: string; text: string }> = {
  done: { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
  empty: { fill: "#ffffff", stroke: "#cbd5e1", dash: "3 3", text: "#94a3b8" },
  dup: { fill: "#fef3c7", stroke: "#b45309", text: "#92400e" },
  gap: { fill: "#ffffff", stroke: "#dc2626", dash: "4 3", text: "#dc2626" },
  arrive: { fill: "#fef3c7", stroke: "#b45309", text: "#92400e" },
  replay: { fill: "#dcfce7", stroke: "#16a34a", text: "#14532d" },
};

const W = 340;
const H = 132;
const X0 = 12;
const CELL = 36;
const STEP = 40;
const ROW_Y = 48;
const cx = (seq: number) => X0 + (seq - 1) * STEP;

export default function SeqAckResumeViz() {
  return (
    <ClawSceneShell
      eyebrow="Hardening target"
      title="sequence 번호 하나로 다시 온 event와 빠진 event를 가려냅니다"
      description="pinned remote.rs의 구현이 아니라 별도 transport가 갖춰야 할 계약입니다. 칸 하나가 sequence 번호 하나이며 번호와 보존 범위는 가정입니다."
      ariaLabel="재연결 뒤 duplicate와 gap을 sequence로 판별하고 replay 또는 snapshot으로 복구하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.keep && (
              <g>
                <line x1={cx(scene.keep[0])} x2={cx(scene.keep[1]) + CELL} y1={24} y2={24} stroke="#16a34a" strokeWidth={1.25} />
                <line x1={cx(scene.keep[0])} x2={cx(scene.keep[0])} y1={20} y2={28} stroke="#16a34a" strokeWidth={1.25} />
                <line x1={cx(scene.keep[1]) + CELL} x2={cx(scene.keep[1]) + CELL} y1={20} y2={28} stroke="#16a34a" strokeWidth={1.25} />
                <text x={cx(scene.keep[1]) + CELL} y={15} textAnchor="end" fontSize={11} fontWeight={700} fill="#15803d">sender 보존 범위</text>
              </g>
            )}
            {scene.cells.map((cell, index) => {
              const style = FILL[cell];
              const seq = index + 1;
              return (
                <g key={seq}>
                  <rect x={cx(seq)} y={ROW_Y - 14} width={CELL} height={32} rx={5} fill={style.fill} stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />
                  <text x={cx(seq) + CELL / 2} y={ROW_Y + 7} textAnchor="middle" fontSize={13} fontWeight={700} fill={style.text}>{seq}</text>
                  {cell === "dup" && <text x={cx(seq) + CELL / 2} y={ROW_Y + 34} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">중복</text>}
                  {cell === "gap" && <text x={cx(seq) + CELL / 2} y={ROW_Y + 34} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">빠짐</text>}
                  {cell === "arrive" && <text x={cx(seq) + CELL / 2} y={ROW_Y + 34} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">보류</text>}
                </g>
              );
            })}
            <line x1={cx(scene.last) + CELL + 2} x2={cx(scene.last) + CELL + 2} y1={ROW_Y - 20} y2={ROW_Y + 24} stroke="#0f172a" strokeWidth={1.25} />
            <text x={X0} y={108} fontSize={11} fontWeight={700} fill="#0f172a">마지막 처리 = {scene.last}</text>
            <text x={W - X0} y={108} textAnchor="end" fontSize={11} fill="#475569">{scene.footer}</text>
            <text x={X0} y={126} fontSize={10} fill="#64748b">검은 세로선 = 처리 완료 경계</text>
          </svg>
        );
      }}
    />
  );
}
