import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #why — 저장 자리 두 벌의 사용 시간. 가로 = 0–24ms, 값은 본문의 2·5·2ms 시간표 그대로입니다.
 * 자리 0: A 0–9, C 9–19. 자리 1: B 2–14, D 14–24. 대기는 계산 자리가 비기를 기다리는 구간입니다.
 */
const SCENES = [
  { label: "A의 마지막 사용", summary: "자리 0의 사용자 = A, 9ms까지", note: "A의 계산은 7ms에 끝나지만 결과 8을 가져오는 일이 9ms까지 이어집니다. 마지막 읽기가 끝날 때까지 이 자리는 A의 것입니다." },
  { label: "7ms에 C를 주면", summary: "7–9ms 겹침", note: "계산이 끝난 7ms만 보고 결과 공간을 C에 주면 7–9ms에 가져가던 8을 덮을 수 있습니다. 이 시간표는 쓸 수 없습니다." },
  { label: "9ms에 C를 주면", summary: "겹침 0ms", note: "자리 한 벌 전체를 9ms까지 보관한 뒤 C에 줍니다. 입력과 출력을 따로 관리하면 더 일찍 넘길 수 있는 부분도 있지만, 어느 사용이 끝났는지 각각 증명해야 합니다." },
  { label: "두 자리 돌려 쓰기", summary: "9 · 14 · 19 · 24ms", note: "A 뒤 9ms에 C가, B 뒤 14ms에 D가 들어갑니다. 대기 칸은 계산 자리 하나를 기다리는 시간이고, 줄을 늘려도 이 가정은 그대로입니다." },
] as const;

type Kind = "send" | "wait" | "run" | "fetch";
const JOBS: Record<string, [Kind, number, number][]> = {
  A: [["send", 0, 2], ["run", 2, 7], ["fetch", 7, 9]],
  B: [["send", 2, 4], ["wait", 4, 7], ["run", 7, 12], ["fetch", 12, 14]],
  C: [["send", 9, 11], ["wait", 11, 12], ["run", 12, 17], ["fetch", 17, 19]],
  D: [["send", 14, 16], ["wait", 16, 17], ["run", 17, 22], ["fetch", 22, 24]],
};

const W = 340;
const H = 192;
const LEFT = 48;
const RIGHT = 10;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const MUTED = "#64748b";
const SLOT_Y = [46, 110];
const BAR_H = 26;
const px = (t: number) => LEFT + (t / 24) * (W - LEFT - RIGHT);

function Job({ name, y }: { name: string; y: number }) {
  return (
    <g>
      {JOBS[name].map(([kind, start, end]) => (
        <rect
          key={kind}
          x={px(start)}
          y={y}
          width={px(end) - px(start)}
          height={BAR_H}
          fill={kind === "run" ? BLUE : kind === "send" ? `${BLUE}40` : kind === "fetch" ? `${AMBER}80` : "none"}
          stroke={kind === "wait" ? MUTED : "#94a3b8"}
          strokeWidth={0.75}
          strokeDasharray={kind === "wait" ? "2 2" : undefined}
        />
      ))}
      {JOBS[name].filter(([kind]) => kind === "run").map(([, start, end]) => (
        <text key={name} x={(px(start) + px(end)) / 2} y={y + 18} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">{name}</text>
      ))}
    </g>
  );
}

function Legend() {
  const items: [string, string, string][] = [
    ["보내기", `${BLUE}40`, "#94a3b8"],
    ["계산", BLUE, "#94a3b8"],
    ["가져오기", `${AMBER}80`, "#94a3b8"],
    ["대기", "none", MUTED],
  ];
  const xs = [LEFT - 40, LEFT + 42, LEFT + 106, LEFT + 196];
  return (
    <g>
      {items.map(([name, fill, stroke], i) => (
        <g key={name}>
          <rect x={xs[i]} y={H - 16} width={12} height={12} fill={fill} stroke={stroke} strokeWidth={0.75} strokeDasharray={name === "대기" ? "2 2" : undefined} />
          <text x={xs[i] + 16} y={H - 5} fontSize={13} fill={MUTED}>{name}</text>
        </g>
      ))}
    </g>
  );
}

export default function BufferSlotReuseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const ticks = active === 3 ? [0, 9, 14, 19, 24] : active === 2 ? [0, 9, 19, 24] : [0, 7, 9, 24];
  const AXIS_Y = 158;

  return (
    <VizFrame
      eyebrow="저장 자리 시간표"
      title="저장 자리를 언제 다음 작업에 넘겨도 될까요"
      description="입력과 출력을 둘 자리 한 벌을 한 줄로 그렸습니다. 2·5·2ms와 계산 자리 하나는 글에서 놓은 가정이며 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="저장 자리 두 벌을 네 작업이 언제 쓰는지 보여 주는 시간표"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 1 && <rect x={px(7)} y={18} width={px(9) - px(7)} height={AXIS_Y - 18} fill={`${RED}22`} />}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={px(t)} x2={px(t)} y1={24} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />
              <text x={px(t)} y={AXIS_Y + 13} textAnchor="middle" fontSize={13} fill={MUTED}>{t}</text>
            </g>
          ))}
          <text x={W - RIGHT} y={14} textAnchor="end" fontSize={13} fill={MUTED}>시간(ms)</text>
          <text x={2} y={SLOT_Y[0] + 18} fontSize={13} fontWeight={700} fill={MUTED}>자리 0</text>
          <text x={2} y={SLOT_Y[1] + 18} fontSize={13} fontWeight={700} fill={MUTED}>자리 1</text>
          <line x1={LEFT} x2={W - RIGHT} y1={SLOT_Y[0] + BAR_H + 1} y2={SLOT_Y[0] + BAR_H + 1} stroke="#94a3b8" strokeWidth={0.5} />
          <line x1={LEFT} x2={W - RIGHT} y1={SLOT_Y[1] + BAR_H + 1} y2={SLOT_Y[1] + BAR_H + 1} stroke="#94a3b8" strokeWidth={0.5} />
          <Job name="A" y={SLOT_Y[0]} />
          {active >= 2 && <Job name="C" y={SLOT_Y[0]} />}
          {active === 3 && <Job name="B" y={SLOT_Y[1]} />}
          {active === 3 && <Job name="D" y={SLOT_Y[1]} />}
          {active === 0 && <text x={px(9) + 5} y={SLOT_Y[0] + 18} fontSize={13} fontWeight={700} fill={AMBER}>8 도착 = 9ms</text>}
          {active === 1 && (
            <g>
              <rect x={px(7)} y={SLOT_Y[0] + BAR_H + 4} width={px(9) - px(7)} height={BAR_H} fill="none" stroke={RED} strokeWidth={1.25} strokeDasharray="3 2" />
              <text x={px(9) + 5} y={SLOT_Y[0] + BAR_H + 22} fontSize={13} fontWeight={700} fill={RED}>C가 8을 덮을 수 있음</text>
            </g>
          )}
          <Legend />
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
