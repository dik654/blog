import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #cert-sync의 fork-choice 식 Head = argmax_{B∈Valid: F⪯B} W_EC(B).
 * 본문 예: F=C, C→D=100, C→D′=110, C와 충돌하는 X=130.
 * 순서: fence(F⪯B)로 X를 먼저 거르고, 남은 D·D′ 사이에서만 weight를 비교해 D′.
 * X가 갈라지는 위치(B)는 그림을 위한 가정입니다.
 */

const NODE_W = 46;
const NODE_H = 26;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GREEN = "#16a34a";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

type NodeKey = "B" | "C" | "D" | "Dp" | "X";
type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

type Layout = {
  w: number;
  h: number;
  pos: Record<NodeKey, Point>;
  fixedBox: Box;
  openBox: Box;
  // branch weight 막대: 넓은 화면은 각 끝 node 옆, 좁은 화면은 나무 아래 세 줄
  bar: ((index: number, tip: NodeKey) => { labelX: number; labelY: number; x: number; y: number; max: number }) | null;
  caption: Point | null;
};

const WIDE: Layout = {
  w: 480,
  h: 214,
  pos: {
    B: { x: 52, y: 104 },
    C: { x: 150, y: 74 },
    D: { x: 252, y: 40 },
    Dp: { x: 252, y: 110 },
    X: { x: 176, y: 174 },
  },
  fixedBox: { x: 20, y: 50, w: 160, h: 80 },
  openBox: { x: 200, y: 16, w: 104, h: 112 },
  bar: (_index, tip) => {
    const y = WIDE.pos[tip].y;
    return { labelX: 316, labelY: y - 9, x: 316, y: y - 4, max: 100 };
  },
  caption: { x: 316, y: 210 },
};

const COMPACT: Layout = {
  w: 320,
  h: 190,
  pos: {
    B: { x: 26, y: 92 },
    C: { x: 100, y: 64 },
    D: { x: 196, y: 36 },
    Dp: { x: 196, y: 100 },
    X: { x: 130, y: 150 },
  },
  fixedBox: { x: 2, y: 42, w: 130, h: 76 },
  openBox: { x: 166, y: 16, w: 60, h: 106 },
  bar: null,
  caption: null,
};

const TIPS = [
  { key: "D", name: "C→D", weight: 100 },
  { key: "Dp", name: "C→D′", weight: 110 },
  { key: "X", name: "X", weight: 130 },
] as const;

const MAX_WEIGHT = 130;

type Scene = {
  label: string;
  summary: string;
  note: string;
  fence: boolean;
  head: NodeKey;
  open: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "Weight만 보면 X가 head",
    summary: "130 > 110 > 100",
    note: "세 branch 모두 EC full validation은 통과했다고 둡니다. Fence 없이 weight만 비교하면 X(130)가 head입니다.",
    fence: false,
    head: "X",
    open: false,
  },
  {
    label: "F=C가 X를 후보에서 뺌",
    summary: "X가 C를 포함? → 아니오",
    note: "Branch가 F=C와 그 ancestors를 정확히 포함하는지 먼저 묻습니다. C와 충돌하는 X는 130이어도 비교에서 빠집니다.",
    fence: true,
    head: "X",
    open: false,
  },
  {
    label: "Fence 안에서 D′ 선택",
    summary: "110 > 100 → head = D′",
    note: "C를 잇는 C→D와 C→D′만 남고, 둘 중 EC weight가 큰 D′(110)가 head입니다.",
    fence: true,
    head: "Dp",
    open: false,
  },
  {
    label: "C 뒤쪽은 아직 변동 가능",
    summary: "B→C 고정 · D/D′ 변동 가능",
    note: "F 이후 구간의 head는 아직 바뀔 수 있습니다. Rollback은 release 전 local candidate와 cache에만 적용하고 B→C는 되돌리지 않습니다.",
    fence: true,
    head: "Dp",
    open: true,
  },
];

function Node({ at, label, stroke, dashed = false, strong = false }: { at: Point; label: string; stroke: string; dashed?: boolean; strong?: boolean }) {
  const { x, y } = at;
  return (
    <g>
      <rect
        x={x - NODE_W / 2}
        y={y - NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill={strong ? stroke : "none"}
        fillOpacity={strong ? 0.12 : 0}
        stroke={stroke}
        strokeWidth={strong ? 1.25 : 1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={stroke === MUTED ? TEXT : stroke}>
        {label}
      </text>
    </g>
  );
}

function Edge({ a, b, color, dashed = false }: { a: Point; b: Point; color: string; dashed?: boolean }) {
  return (
    <line
      x1={a.x + NODE_W / 2}
      y1={a.y}
      x2={b.x - NODE_W / 2}
      y2={b.y}
      stroke={color}
      strokeWidth={1}
      strokeDasharray={dashed ? "4 3" : undefined}
    />
  );
}

function Diagram({ scene, compact }: { scene: Scene; compact: boolean }) {
  const L = compact ? COMPACT : WIDE;
  const P = L.pos;
  const xOut = scene.fence;
  const fixedColor = scene.fence ? GREEN : MUTED;
  const tipColor = (key: NodeKey) => (key === "X" && xOut ? RED : key === scene.head ? BLUE : MUTED);

  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} className={compact ? "h-auto w-full sm:hidden" : "mx-auto hidden h-auto w-full max-w-[600px] sm:block"} role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {/* 확정 prefix 영역 */}
      {scene.fence && (
        <g>
          <rect x={L.fixedBox.x} y={L.fixedBox.y} width={L.fixedBox.w} height={L.fixedBox.h} rx={8} fill="none" stroke={GREEN} strokeWidth={1} strokeDasharray="5 4" />
          <text x={L.fixedBox.x + 4} y={L.fixedBox.y - 6} fontSize={11} fontWeight={700} fill={GREEN}>F = C까지 확정 prefix</text>
        </g>
      )}
      {/* F 이후 구간 */}
      {scene.open && (
        <g>
          <rect x={L.openBox.x} y={L.openBox.y} width={L.openBox.w} height={L.openBox.h} rx={8} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="2 3" />
          <text x={L.openBox.x + L.openBox.w / 2} y={L.openBox.y - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>F 이후 · 바뀔 수 있음</text>
        </g>
      )}

      <Edge a={P.B} b={P.C} color={fixedColor} />
      <Edge a={P.C} b={P.D} color={tipColor("D")} />
      <Edge a={P.C} b={P.Dp} color={tipColor("Dp")} />
      <Edge a={P.B} b={P.X} color={tipColor("X")} dashed={xOut} />

      <Node at={P.B} label="B" stroke={fixedColor} />
      <Node at={P.C} label="C" stroke={fixedColor} strong={scene.fence} />
      <Node at={P.D} label="D" stroke={tipColor("D")} strong={scene.head === "D"} />
      <Node at={P.Dp} label="D′" stroke={tipColor("Dp")} strong={scene.head === "Dp"} />
      <Node at={P.X} label="X" stroke={tipColor("X")} dashed={xOut} strong={!xOut && scene.head === "X"} />

      {xOut && (
        <text x={P.X.x} y={P.X.y + 30} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
          C 미포함 · fence 밖
        </text>
      )}

      {/* branch별 EC weight */}
      {L.caption && <text x={L.caption.x} y={L.caption.y} fontSize={10} fill={TEXT}>branch EC weight</text>}
      {TIPS.map((tip, index) => {
        const color = tipColor(tip.key);
        const isHead = tip.key === scene.head && !(tip.key === "X" && xOut);
        const valueFill = color === MUTED ? TEXT : color;
        const valueText = `${tip.weight}${isHead ? " · head" : ""}`;
        if (!L.bar) {
          // 좁은 화면: 막대 대신 끝 node 바로 옆에 branch weight를 적습니다.
          const at = P[tip.key];
          return (
            <text key={tip.key} x={at.x + NODE_W / 2 + 5} y={at.y + 4} fontSize={12} fontWeight={700} fill={valueFill}>
              W {valueText}
            </text>
          );
        }
        const bar = L.bar(index, tip.key);
        const width = (tip.weight / MAX_WEIGHT) * bar.max;
        return (
          <g key={tip.key}>
            <text x={bar.labelX} y={bar.labelY} fontSize={10} fill={TEXT}>{tip.name}</text>
            <rect
              x={bar.x}
              y={bar.y}
              width={width}
              height={10}
              rx={2}
              fill={color}
              fillOpacity={tip.key === "X" && xOut ? 0.25 : isHead ? 0.9 : 0.45}
            />
            <text x={bar.x + width + 6} y={bar.y + 9} fontSize={12} fontWeight={700} fill={valueFill}>
              {valueText}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ForkChoiceFenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="Fork choice · F=C"
      title="Fence를 먼저 통과한 branch만 weight로 비교합니다"
      description="F는 검증된 certificate chain의 마지막 decision이 고정한 prefix(여기서는 C)입니다. W는 본문 예시의 branch EC weight이고, X가 B에서 갈라지는 위치는 가정입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Finalized checkpoint fence와 EC weight 비교 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="break-keep text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <Diagram scene={SCENES[scenes.active]} compact />
          <Diagram scene={SCENES[scenes.active]} compact={false} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
