import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source — 게티어의 두 번째 사례. 스미스의 믿음은 f를 거쳐 h에 닿고,
 * h를 참으로 만든 것은 스미스가 몰랐던 브라운의 위치다. 두 길은 h에서만 만난다.
 */
const SCENES = [
  { label: "믿음이 지나간 길", summary: "증거 → f → h", note: "스미스는 강한 증거로 f를 믿고, f에서 h를 이끌어 내 받아들입니다. 브라운이 어디 있는지는 전혀 모릅니다." },
  { label: "h를 참으로 만든 길", summary: "브라운의 위치 → h", note: "실제로 존스에게 포드는 없어 f는 거짓입니다. 우연히 브라운이 바르셀로나에 있어 ‘또는’의 다른 쪽이 h를 참으로 만듭니다." },
  { label: "두 길 겹치기", summary: "h에서만 만남", note: "h는 참이고 스미스는 h를 믿으며 좋은 증거에서 이끌어 냈으니 정당화도 있습니다. 그래도 믿음의 길과 참의 길은 서로 다릅니다." },
] as const;

const W = 340;
const H = 256;
const BELIEF = "#2563eb";
const TRUTH = "#d97706";
const MUTED = "#94a3b8";

function Box({ x, y, w, h, color, lines, dashed = false }: { x: number; y: number; w: number; h: number; color: string; lines: string[]; dashed?: boolean }) {
  const mid = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={mid + 5 + (index - (lines.length - 1) / 2) * 17} textAnchor="middle" fontSize={13} fontWeight={600} fill={color}>{line}</text>
      ))}
    </g>
  );
}

function Down({ x, y1, y2, color }: { x: number; y1: number; y2: number; color: string }) {
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={y2 - 5} stroke={color} strokeWidth={1.25} />
      <path d={`M${x} ${y2} l-4 -6 h8 z`} fill={color} />
    </g>
  );
}

const LEFT_X = 4;
const RIGHT_X = 180;
const COL_W = 156;
const LEFT_MID = LEFT_X + COL_W / 2;
const RIGHT_MID = RIGHT_X + COL_W / 2;
const ROW1 = 4;
const ROW2 = 78;
const ROW3 = 196;
const BOX_H = 48;

export default function GettierForkViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const beliefColor = active === 1 ? MUTED : BELIEF;
  const truthColor = active === 0 ? MUTED : TRUTH;

  return (
    <VizFrame
      eyebrow="게티어의 두 번째 사례"
      title="믿음이 지나간 길과 문장을 참으로 만든 길이 다릅니다"
      description="f는 ‘존스에게 포드가 있다’는 스미스의 믿음입니다. h는 f에 ‘브라운이 바르셀로나에 있다’를 ‘또는’으로 이은 문장(선언 문장)이며, 둘 중 하나만 참이어도 참입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="게티어 사례에서 믿음의 경로와 문장을 참으로 만든 경로를 나누어 보는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={LEFT_X} y={ROW1} w={COL_W} h={BOX_H} color={beliefColor} lines={["스미스의 강한 증거"]} />
          <Down x={LEFT_MID} y1={ROW1 + BOX_H} y2={ROW2} color={beliefColor} />
          <Box x={LEFT_X} y={ROW2} w={COL_W} h={BOX_H} color={beliefColor} lines={["f: 존스에게", "포드가 있다"]} />
          <Down x={LEFT_MID} y1={ROW2 + BOX_H} y2={ROW3} color={beliefColor} />
          <text x={LEFT_MID + 8} y={(ROW2 + BOX_H + ROW3) / 2 + 5} fontSize={13} fill={beliefColor}>연역</text>

          <Box x={RIGHT_X} y={ROW2} w={COL_W} h={BOX_H} color={truthColor} lines={["브라운이", "바르셀로나에 있다"]} dashed={active === 0} />
          {active === 0 && <text x={RIGHT_MID} y={ROW2 - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>스미스는 모름</text>}
          {active >= 1 && <Down x={RIGHT_MID} y1={ROW2 + BOX_H} y2={ROW3} color={truthColor} />}
          {active >= 1 && <text x={RIGHT_MID + 8} y={(ROW2 + BOX_H + ROW3) / 2 + 5} fontSize={13} fontWeight={700} fill={truthColor}>실제로 참</text>}
          {active >= 1 && <text x={RIGHT_MID} y={ROW2 - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={truthColor}>스미스는 모름</text>}
          {active >= 1 && (
            <g>
              <text x={LEFT_MID - 8} y={ROW2 - 10} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">f는 거짓</text>
            </g>
          )}

          <Box x={LEFT_X} y={ROW3} w={RIGHT_X + COL_W - LEFT_X} h={BOX_H + 8} color={active === 2 ? "#64748b" : active === 0 ? BELIEF : TRUTH} lines={["h: 존스가 포드를 가졌거나", "브라운이 바르셀로나에 있다"]} />
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
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
