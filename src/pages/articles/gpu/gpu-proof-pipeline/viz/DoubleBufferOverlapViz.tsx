import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlap — chunk k의 kernel 동안 chunk k+1을 전송할 수 있을 때만 double buffering이 유효하다.
 * 같은 buffer를 쓰거나 transcript barrier 뒤에만 생성되는 data는 겹칠 수 없고,
 * enqueue 시각과 실제 timeline은 다를 수 있다.
 * 모든 작업 길이를 한 칸으로 둔 것은 설명용 가정이다. 칸 수는 측정값이 아니다.
 */
type Lane = 0 | 1 | 2;

interface Block {
  lane: Lane;
  slot: number;
  label: string;
  ghost?: boolean;
}

const SLOTS = 7;
const LANES = ["전송", "Kernel", "Transcript"] as const;

const COLORS: Record<string, string> = {
  A: "#7c3aed",
  B: "#0284c7",
  R: "#d97706",
  T: "#475569",
};

const SCENES = [
  {
    label: "겹치지 않을 때",
    summary: "6칸 (가정)",
    note: "Buffer 하나로 전송과 kernel을 번갈아 하면 한 쪽이 일할 때 다른 쪽은 쉽니다. 모든 작업을 같은 한 칸으로 둔 가정에서 chunk 세 개는 6칸이 걸립니다.",
    blocks: [
      { lane: 0, slot: 0, label: "#0 A" },
      { lane: 1, slot: 1, label: "#0 A" },
      { lane: 0, slot: 2, label: "#1 A" },
      { lane: 1, slot: 3, label: "#1 A" },
      { lane: 0, slot: 4, label: "#2 A" },
      { lane: 1, slot: 5, label: "#2 A" },
    ] as Block[],
  },
  {
    label: "Double buffering",
    summary: "4칸 (가정)",
    note: "Buffer A·B 두 개를 번갈아 씁니다. Kernel이 A의 chunk 0을 읽는 동안 chunk 1을 B로 보냅니다. Chunk 2를 A에 다시 받는 것은 chunk 0의 kernel이 끝난 뒤라 덮어쓰지 않습니다.",
    blocks: [
      { lane: 0, slot: 0, label: "#0 A" },
      { lane: 1, slot: 1, label: "#0 A" },
      { lane: 0, slot: 1, label: "#1 B" },
      { lane: 1, slot: 2, label: "#1 B" },
      { lane: 0, slot: 2, label: "#2 A" },
      { lane: 1, slot: 3, label: "#2 A" },
    ] as Block[],
  },
  {
    label: "같은 buffer면 기다림",
    summary: "다시 6칸 (가정)",
    note: "Chunk 1도 A에 받아야 한다면, kernel이 아직 읽는 A를 덮어쓰면 race가 납니다. 점선 칸에서 미리 보내지 못하고 chunk 0의 kernel이 끝날 때까지 기다리므로 겹친 효과가 사라집니다.",
    blocks: [
      { lane: 0, slot: 0, label: "#0 A" },
      { lane: 1, slot: 1, label: "#0 A" },
      { lane: 0, slot: 1, label: "#1 A", ghost: true },
      { lane: 0, slot: 2, label: "#1 A" },
      { lane: 1, slot: 3, label: "#1 A" },
      { lane: 0, slot: 4, label: "#2 A" },
      { lane: 1, slot: 5, label: "#2 A" },
    ] as Block[],
  },
  {
    label: "Transcript barrier",
    summary: "β 전에는 R2 data가 없음",
    note: "R1은 첫 round, R2는 challenge β를 받아야 만들 수 있는 다음 round의 data입니다. β는 R1의 commitment를 transcript에 흡수해야 정해지므로 전송 칸이 비어 있어도 R2를 앞당겨 보낼 수 없습니다.",
    blocks: [
      { lane: 0, slot: 0, label: "R1" },
      { lane: 1, slot: 1, label: "R1" },
      { lane: 2, slot: 2, label: "β" },
      { lane: 0, slot: 1, label: "R2", ghost: true },
      { lane: 0, slot: 3, label: "R2" },
      { lane: 1, slot: 4, label: "R2" },
    ] as Block[],
  },
  {
    label: "Enqueue와 실제",
    summary: "enqueue 4칸 ≠ 기록 6칸일 수 있음",
    note: "점선은 double buffering대로 enqueue하며 기대한 위치(3번 칸에서 끝남)이고, 실선은 실제로 실행된 위치의 가상 예(5번 칸에서 끝남)입니다. 한 칸에 둘이 겹치면 위가 기대, 아래가 실제입니다. Copy engine 수, pageable/pinned memory, stream ordering, resource contention 때문에 실제 겹침이 줄 수 있으므로 profiler timeline과 completion event로 확인합니다.",
    blocks: [
      { lane: 0, slot: 0, label: "#0 A" },
      { lane: 1, slot: 1, label: "#0 A" },
      { lane: 0, slot: 1, label: "#1 B", ghost: true },
      { lane: 0, slot: 2, label: "#1 B" },
      { lane: 1, slot: 2, label: "#1 B", ghost: true },
      { lane: 1, slot: 3, label: "#1 B" },
      { lane: 0, slot: 2, label: "#2 A", ghost: true },
      { lane: 0, slot: 4, label: "#2 A" },
      { lane: 1, slot: 3, label: "#2 A", ghost: true },
      { lane: 1, slot: 5, label: "#2 A" },
    ] as Block[],
  },
] as const;

function colorOf(label: string) {
  if (label.startsWith("R")) return COLORS.R;
  if (label === "β") return COLORS.T;
  return label.endsWith("B") ? COLORS.B : COLORS.A;
}

export default function DoubleBufferOverlapViz() {
  return (
    <SceneShell
      eyebrow="Double buffering"
      title="전송과 kernel은 서로를 기다리지 않을 때만 겹칩니다"
      description="가로 한 칸이 같은 길이의 작업 하나입니다(가정). #0·#1·#2는 chunk 번호, A·B는 그 chunk가 들어가는 device buffer입니다. 점선 칸은 그때 실행하려 했지만 실제로는 실행되지 못한 자리입니다."
      note="칸 길이와 칸 수는 구조를 보이려는 가정이며 측정값이 아닙니다."
      ariaLabel="전송과 kernel lane에서 chunk가 겹치는 경우와 겹칠 수 없는 경우"
      scenes={SCENES}
      render={(active) => {
        const blocks = SCENES[active].blocks;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-end gap-2">
              <span className="text-[10px] font-bold text-muted-foreground">시간 칸</span>
              <div className="grid grid-cols-7 text-center font-mono text-[10px] text-muted-foreground">
                {Array.from({ length: SLOTS }, (_, i) => <span key={i}>{i}</span>)}
              </div>
            </div>
            <div className="mt-1 space-y-2">
              {LANES.map((lane, laneIndex) => (
                <div key={lane} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-2">
                  <span className="text-xs font-bold">{lane}</span>
                  <div className="grid h-10 grid-cols-7 gap-0.5 rounded-md bg-muted/40 p-0.5">
                    {Array.from({ length: SLOTS }, (_, slot) => {
                      const solid = blocks.find((b) => b.lane === laneIndex && b.slot === slot && !b.ghost);
                      const ghost = blocks.find((b) => b.lane === laneIndex && b.slot === slot && b.ghost);
                      if (solid && ghost) {
                        const sc = colorOf(solid.label);
                        const gc = colorOf(ghost.label);
                        return (
                          <span key={slot} className="flex min-w-0 flex-col gap-px">
                            <span
                              className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-sm border border-dashed font-mono text-[9px] leading-none tracking-tighter opacity-70 sm:tracking-normal"
                              style={{ borderColor: gc, color: gc }}
                            >
                              {ghost.label}
                            </span>
                            <span
                              className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-sm border font-mono text-[9px] font-bold leading-none tracking-tighter sm:tracking-normal"
                              style={{ borderColor: sc, backgroundColor: `${sc}22`, color: sc }}
                            >
                              {solid.label}
                            </span>
                          </span>
                        );
                      }
                      if (solid) {
                        const color = colorOf(solid.label);
                        return (
                          <span
                            key={slot}
                            className="flex min-w-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-sm border font-mono text-[9px] font-bold leading-none tracking-tighter sm:text-[10px] sm:tracking-normal"
                            style={{ borderColor: color, backgroundColor: `${color}22`, color }}
                          >
                            {solid.label}
                          </span>
                        );
                      }
                      if (ghost) {
                        const color = colorOf(ghost.label);
                        return (
                          <span
                            key={slot}
                            className="flex min-w-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-sm border border-dashed font-mono text-[9px] leading-none tracking-tighter opacity-70 sm:text-[10px] sm:tracking-normal"
                            style={{ borderColor: color, color }}
                          >
                            {ghost.label}
                          </span>
                        );
                      }
                      return <span key={slot} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span><span className="font-bold" style={{ color: COLORS.A }}>A</span> · <span className="font-bold" style={{ color: COLORS.B }}>B</span> device buffer</span>
              <span><span className="font-bold" style={{ color: COLORS.R }}>R1·R2</span> round별 data</span>
              <span><span className="font-bold" style={{ color: COLORS.T }}>β</span> transcript가 정한 challenge</span>
            </div>
          </div>
        );
      }}
    />
  );
}
