import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loop — 본문의 예 B_micro=16, A=4, W=8.
 * 칸 하나 = micro-batch iteration 하나(모든 rank가 동시에 한 번).
 * A=4번 backward가 끝날 때마다 optimizer update가 1 늘어난다 → iteration 8에서 update 2.
 * update 하나가 반영하는 sample = 16 × 4 × 8 = 512.
 */
const B_MICRO = 16;
const ACCUM = 4;
const WORLD = 8;
const ITERATIONS = 8;
const EFFECTIVE = B_MICRO * ACCUM * WORLD;

const SCENES = [
  {
    label: "micro-batch 1",
    summary: "iteration 1 · update 0",
    iter: 1,
    focus: "iter",
    note: "Rank 8개가 각자 16개 sample로 forward·loss·backward를 한 번 합니다. Gradient가 쌓이기만 하고 optimizer는 아직 움직이지 않습니다.",
  },
  {
    label: "micro-batch 3",
    summary: "iteration 3 · update 0",
    iter: 3,
    focus: "iter",
    note: "Backward를 세 번 했지만 A=4회 누적이 아직 끝나지 않았습니다. Iteration 숫자는 3인데 optimizer update 숫자는 여전히 0입니다.",
  },
  {
    label: "micro-batch 4 · 첫 update",
    summary: `${B_MICRO} × ${ACCUM} × ${WORLD} = ${EFFECTIVE} samples`,
    iter: 4,
    focus: "update",
    note: "네 번째 backward로 누적이 끝나면 optimizer가 한 번 update합니다. 이 update는 rank당 16 × 4 = 64개, rank 8개를 합쳐 명목상 512개 sample의 평균 gradient를 반영합니다.",
  },
  {
    label: "micro-batch 8 · 두 번째 update",
    summary: "iteration 8 · update 2",
    iter: 8,
    focus: "update",
    note: "다음 네 micro-batch가 끝나면 update가 2가 됩니다. Iteration이 4 늘 때 update는 1 늡니다.",
  },
  {
    label: "같은 “step”의 두 숫자",
    summary: "iteration 8 ≠ update 2",
    iter: 8,
    focus: "both",
    note: "이 시점의 “step”을 iteration으로 세면 8, optimizer update로 세면 2입니다. Scheduler·logging·checkpoint 주기를 적을 때 어느 쪽인지 밝혀야 하며, 본문은 이 차이를 resume 후 scheduler가 한 칸 밀리는 흔한 원인으로 꼽습니다.",
  },
] as const;

const W = 360;
const H = 84;
const LEFT = 12;
const CELL = 35;
const GAP = 6;
const GROUP_GAP = 14;
const CELL_Y = 4;
const CELL_H = 38;
const cellX = (index: number) => LEFT + index * (CELL + GAP) + (index >= ACCUM ? GROUP_GAP : 0);
const CELL_INDEXES = Array.from({ length: ITERATIONS }, (_, index) => index);
const GROUPS = [0, 1] as const;

function Figure({ sceneIndex }: { sceneIndex: number }) {
  const scene = SCENES[sceneIndex];
  const updates = Math.floor(scene.iter / ACCUM);
  const iterStrong = scene.focus === "iter" || scene.focus === "both";
  const updateStrong = scene.focus === "update" || scene.focus === "both";
  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
        {CELL_INDEXES.map((index) => {
          const done = index < scene.iter;
          const current = index === scene.iter - 1;
          return (
            <g key={index}>
              <rect
                x={cellX(index)}
                y={CELL_Y}
                width={CELL}
                height={CELL_H}
                rx={4}
                fill={done ? "#2563eb" : "#ffffff"}
                fillOpacity={done ? (current ? 1 : 0.7) : 0}
                stroke={done ? "#2563eb" : "#94a3b8"}
                strokeWidth={current ? 1.25 : 1}
              />
              <text x={cellX(index) + CELL / 2} y={CELL_Y + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={done ? "#ffffff" : "#94a3b8"}>
                {index + 1}
              </text>
            </g>
          );
        })}
        {GROUPS.map((group) => {
          const reached = updates > group;
          const x1 = cellX(group * ACCUM);
          const x2 = cellX(group * ACCUM + ACCUM - 1) + CELL;
          return (
            <g key={group}>
              <path
                d={`M ${x1} 50 L ${x1} 56 L ${x2} 56 L ${x2} 50`}
                fill="none"
                stroke={reached ? "#7c3aed" : "#cbd5e1"}
                strokeWidth={1}
                strokeDasharray={reached ? undefined : "3 3"}
              />
              <text x={(x1 + x2) / 2} y={76} textAnchor="middle" fontSize={12} fontWeight={reached ? 700 : 400} fill={reached ? "#7c3aed" : "#94a3b8"}>
                {reached ? `optimizer update ${group + 1}` : scene.iter > group * ACCUM ? "누적 중 · update 대기" : "다음 누적 구간"}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className={`rounded-lg border px-2 py-2 ${iterStrong ? "border-[#2563eb]" : "border-border"}`}>
          <span className="block text-muted-foreground">iteration 수</span>
          <strong className="mt-1 block font-mono text-base text-[#2563eb]">{scene.iter}</strong>
        </div>
        <div className={`rounded-lg border px-2 py-2 ${updateStrong ? "border-[#7c3aed]" : "border-border"}`}>
          <span className="block text-muted-foreground">optimizer update 수</span>
          <strong className="mt-1 block font-mono text-base text-[#7c3aed]">{updates}</strong>
        </div>
        <div className="rounded-lg border border-border px-2 py-2">
          <span className="block text-muted-foreground">update 1번의 sample</span>
          <strong className="mt-1 block font-mono text-xs leading-6">{updates > 0 ? `${EFFECTIVE} (명목)` : "아직 없음"}</strong>
        </div>
      </div>
    </div>
  );
}

export default function AccumulationClockViz() {
  return (
    <SceneShell
      eyebrow="두 개의 시계"
      title="Backward는 네 번, optimizer update는 한 번 셉니다"
      description="본문의 예를 그대로 씁니다: rank 하나의 micro-batch 크기 B_micro=16, update 전 gradient 누적 횟수 A=4, data-parallel rank 수 W=8. 칸 하나가 micro-batch iteration 한 번(rank 8개가 각자 16개씩)이고, 네 칸이 끝날 때마다 optimizer update가 한 번 일어납니다. 같은 학습을 iteration으로 세느냐 update로 세느냐에 따라 “step” 숫자가 달라집니다."
      ariaLabel="gradient accumulation에서 micro-batch iteration 수와 optimizer update 수가 갈라지는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => <Figure key={scene.label} sceneIndex={index} />)}
        />
      )}
    />
  );
}
