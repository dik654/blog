import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 둘째 문단과 #overview 사건 — checkpoint는 한 process 쓰기로 완성되지 않는다.
 * 칸 128개 = 16 node × 8 rank의 shard(원장의 16 nodes × 8 ranks). 한 줄 8칸 = node 하나.
 * 순서: 계산 재개 → 모든 rank shard → 전체 세대 목록 공개 → restart가 실제로 읽음.
 * 진행 중 장면의 채운 칸 수는 설명용(가정)이다.
 */
const NODES = 16;
const RANKS = 8;
const LOST_NODE = 11;

const MILESTONES = ["계산 재개", "모든 rank shard", "세대 목록 공개", "restart가 읽음"] as const;

const SCENES = [
  {
    label: "계산은 먼저 다시 시작합니다",
    summary: "화면의 최신 세대 ≠ 복구 가능",
    reached: 1,
    filled: 40,
    lost: false,
    note: "계산이 다시 시작되고 화면에 최신 세대가 보여도 rank별 shard는 아직 쓰이는 중입니다(채운 칸 수는 가정). 이 시각을 저장 완료로 기록하면 처음 사건처럼 됩니다.",
  },
  {
    label: "저장 중 node 하나가 사라지면",
    summary: "8개 shard 없음 → 목록 미공개",
    reached: 1,
    filled: 104,
    lost: true,
    note: "Node 하나에는 rank 8개의 shard가 있습니다. 그 칸들이 끝나지 못하면 전체 세대를 가리키는 목록을 공개할 수 없고, restart는 이 세대를 쓸 수 없습니다. 직전 complete 세대를 유지해야 하는 이유입니다.",
  },
  {
    label: "128개가 모두 쓰여야 다음 단계",
    summary: "shard 128/128 → 목록 공개",
    reached: 3,
    filled: 128,
    lost: false,
    note: "모든 rank의 shard가 성공한 뒤에만 전체 세대를 가리키는 목록을 공개합니다. 그전에는 이 세대를 restart 후보로 보이지 않게 둡니다.",
  },
  {
    label: "restart가 실제로 읽어야 완료",
    summary: "복구 가능한 저장 완료",
    reached: 4,
    filled: 128,
    lost: false,
    note: "마지막으로 restart가 그 세대를 실제로 읽어야 복구 가능한 완료입니다. 그래서 ‘계산 재개 시각’과 ‘복구 가능한 저장이 끝난 시각’을 따로 기록합니다.",
  },
] as const;

const CELL = 15;
const GAP = 3;
const GRID_X = 8;
const GRID_Y = 8;

export default function CheckpointCompletionViz() {
  return (
    <SceneShell
      eyebrow="checkpoint의 완료 조건"
      title="계산이 다시 돌아도 checkpoint 세대는 아직 미완성일 수 있습니다"
      description="Checkpoint는 학습 상태를 나중에 다시 시작할 수 있게 저장한 한 세대이고, shard는 rank(process) 하나가 쓰는 조각입니다. 칸 하나가 shard 하나, 한 줄 8칸이 node 하나입니다(16 node × 8 rank)."
      ariaLabel="checkpoint 한 세대가 계산 재개, shard 128개, 목록 공개, restart 확인을 거쳐 완료되는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-4 gap-1.5">
              {MILESTONES.map((item, index) => {
                const done = index < scene.reached;
                const blocked = scene.lost && index >= 1;
                return (
                  <li
                    key={item}
                    className={`rounded-md border px-1.5 py-1.5 text-center text-[11px] font-semibold leading-4 sm:text-xs ${
                      blocked ? "border-dashed border-[#dc2626] text-[#dc2626] dark:text-[#f87171]" : done ? "border-[#2563eb] bg-background text-[#1d4ed8] dark:text-[#93c5fd]" : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    <span className="block font-mono text-[10px]">{blocked ? "✕" : done ? "✓" : "…"}</span>
                    {item}
                  </li>
                );
              })}
            </ol>
            <svg
              viewBox={`0 0 ${GRID_X * 2 + RANKS * (CELL + GAP) * 2 - GAP} ${GRID_Y * 2 + (NODES / 2) * (CELL + GAP) - GAP}`}
              className="mx-auto mt-4 h-auto w-full max-w-[420px]"
              role="img"
              aria-label={`${scene.label}: ${scene.summary}`}
            >
              {Array.from({ length: NODES * RANKS }, (_, index) => {
                const node = Math.floor(index / RANKS);
                const rank = index % RANKS;
                const col = (node % 2) * RANKS + rank;
                const row = Math.floor(node / 2);
                const x = GRID_X + col * (CELL + GAP) + (node % 2) * 6;
                const y = GRID_Y + row * (CELL + GAP);
                const isLost = scene.lost && node === LOST_NODE;
                const order = rank * NODES + node;
                const filled = !isLost && order < scene.filled;
                return isLost ? (
                  <g key={index}>
                    <rect x={x} y={y} width={CELL} height={CELL} rx={2} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
                    <path d={`M${x + 4} ${y + 4}L${x + CELL - 4} ${y + CELL - 4}M${x + CELL - 4} ${y + 4}L${x + 4} ${y + CELL - 4}`} stroke="#dc2626" strokeWidth={1} />
                  </g>
                ) : (
                  <rect key={index} x={x} y={y} width={CELL} height={CELL} rx={2} fill={filled ? "#2563eb" : "#ffffff"} fillOpacity={filled ? 0.8 : 1} stroke={filled ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                );
              })}
            </svg>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {scene.lost ? "빨간 점선 줄 = 사라진 node의 shard 8개" : `쓰기를 마친 shard ${scene.filled}/128`}
            </p>
          </div>
        );
      }}
    />
  );
}
