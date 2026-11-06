import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #case·#picture — 64개 작업을 32개씩 또는 64개로 묶을 때 37번의 위치와 표식 자리.
 * 칸 하나 = 작업 하나, 칸 안 숫자 = 작업 번호. 묶음 위치는 번호에서 묶음 시작 번호를 뺀 값입니다.
 */
const SCENES = [
  { label: "32개 단위", summary: "37번 = 묶음 1·위치 5", note: "32개씩 묶으면 37 − 32 = 5이므로 37번은 묶음 1의 위치 5입니다. 함께 진행하는 이웃은 32–63번입니다." },
  { label: "64개 단위", summary: "37번 = 묶음 0·위치 37", note: "한 묶음으로 두면 37번의 위치는 37이고 이웃은 64개 전부입니다. 묶음 수가 절반이라고 실행 시간이 절반이 되지는 않습니다." },
  { label: "32비트 표식 · 32개 단위", summary: "37번 = 묶음 1 표식의 5번 비트", note: "참여 여부를 비트 하나씩 적는 32비트 표식은 0–31번 자리만 있습니다. 묶음이 32개씩이면 위치가 31을 넘지 않아 묶음마다 꼭 맞습니다." },
  { label: "32비트 표식 · 64개 단위", summary: "37번 = 적을 자리 없음", note: "같은 표식을 64개 묶음에 쓰면 37번의 참여를 적을 자리가 없습니다. 이번 덧셈의 답은 같지만, 참여를 모으는 코드는 다시 검사합니다." },
] as const;

const COLS = 8;
const PITCH_X = 39;
const PITCH_Y = 29;
const CELL_W = 36;
const CELL_H = 26;
const LEFT = 10;
const TOP = 24;
const SPLIT = 26;
const W = 330;
const H = TOP + PITCH_Y * 8 + SPLIT + 2;
const BLUE = "#2563eb";
const RED = "#dc2626";
const MUTED = "#64748b";

const TASKS = Array.from({ length: 64 }, (_, id) => id);

export default function LaneGroupingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const merged = active === 1;
  const oneBundle = active === 1 || active === 3;
  const split = merged ? 0 : SPLIT;
  const cellY = (id: number) => {
    const row = Math.floor(id / COLS);
    return TOP + row * PITCH_Y + (row >= 4 ? split : 0);
  };
  const lowerTop = cellY(32);
  const bottom = cellY(63) + CELL_H + 4;
  const neighbor = (id: number) => (active === 0 ? id >= 32 : active === 1);
  const hasSlot = (id: number) => active === 2 || (active === 3 && id < 32);
  const label = [
    ["묶음 0 · 작업 0–31", "묶음 1 · 작업 32–63"],
    ["묶음 0 · 작업 0–63", ""],
    ["묶음 0 · 표식 32자리", "묶음 1 · 표식 32자리"],
    ["묶음 0 · 표식은 0–31번까지", "32–63번 · 표식 자리 없음"],
  ][active];

  return (
    <VizFrame
      eyebrow="64칸 세기"
      title="묶음 크기가 바뀌면 37번의 이웃과 표식 자리가 달라집니다"
      description="칸 하나가 작업 하나이고 숫자는 작업 번호입니다(작업 64개는 가정)."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="64개 작업을 묶는 크기에 따라 37번 작업의 위치와 표식 자리가 달라지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={LEFT - 4} y={TOP - 9} fontSize={14} fontWeight={700} fill={MUTED}>{label[0]}</text>
          {label[1] && <text x={LEFT - 4} y={lowerTop - 9} fontSize={14} fontWeight={700} fill={active === 3 ? RED : MUTED}>{label[1]}</text>}
          {oneBundle ? (
            <rect x={LEFT - 5} y={TOP - 4} width={W - 2 * (LEFT - 5)} height={bottom - TOP + 4} rx={6} fill="none" stroke={MUTED} strokeWidth={1} />
          ) : (
            <>
              <rect x={LEFT - 5} y={TOP - 4} width={W - 2 * (LEFT - 5)} height={PITCH_Y * 4 + 4} rx={6} fill="none" stroke={MUTED} strokeWidth={1} />
              <rect x={LEFT - 5} y={lowerTop - 4} width={W - 2 * (LEFT - 5)} height={PITCH_Y * 4 + 4} rx={6} fill="none" stroke={MUTED} strokeWidth={1} />
            </>
          )}
          {TASKS.map((id) => {
            const x = LEFT + (id % COLS) * PITCH_X;
            const y = cellY(id);
            const target = id === 37;
            const lost = active === 3 && id >= 32;
            const fill = target ? (active === 3 ? RED : BLUE) : active < 2 && neighbor(id) ? "#2563eb22" : "none";
            return (
              <g key={id}>
                <rect x={x} y={y} width={CELL_W} height={CELL_H} rx={3} fill={fill} stroke={lost ? RED : "#94a3b8"} strokeWidth={lost ? 1 : 0.75} strokeDasharray={lost ? "3 3" : undefined} />
                {active >= 2 && hasSlot(id) && <rect x={x + 5} y={y + CELL_H - 5} width={CELL_W - 10} height={3} fill={target ? "#ffffff" : BLUE} />}
                <text x={x + CELL_W / 2} y={y + (active >= 2 ? 15 : 18)} textAnchor="middle" fontSize={13} fontWeight={target ? 700 : 400} fill={target ? "#ffffff" : lost ? RED : MUTED}>{id}</text>
              </g>
            );
          })}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
