import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #receptive-span 둘째 문단 — "Layer stride는 현재 output의 receptive field를
 * 바로 넓히지 않고, 다음 layer가 보는 간격을 먼저 바꿉니다."
 * Layer 1(k=3, s=1)의 output A…G는 input에서 한 칸씩 떨어져 시작합니다(j₁=1, r₁=3).
 * Layer 2(k=3, s=2)의 output 0은 A·B·C(input 0–4), output 1은 C·D·E(input 2–6)를 읽습니다:
 * 둘 다 r₂=5이고 시작 간격만 j₂=2입니다.
 * 셋째 layer(가정 k=3, d=1)는 output 0·1·2를 읽어 r₃=5+(3−1)×1×2=9, input 0–8을 연결합니다.
 */

const INPUTS = 9;
const H = 214;
const RAIL_Y = 146;
const RAIL_H = 30;
const L1_Y = 110;
const L2_Y = 64;
const L3_Y = 18;
const R = 11;

const BLUE = "#2563eb";
const ORANGE = "#d97706";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const L1 = ["A", "B", "C", "D", "E", "F", "G"] as const;

type Span = { from: number; to: number; color: string };

type Scene = {
  label: string;
  summary: string;
  note: string;
  showL2: boolean;
  showL3: boolean;
  l1: readonly { k: number; color: string }[];
  l2: readonly { m: number; color: string }[];
  l3: boolean;
  spans: readonly Span[];
};

const SCENES: readonly Scene[] = [
  {
    label: "Layer 1: 한 칸씩 이동",
    summary: "r₁=3 · j₁=1",
    note: "Kernel 3인 첫 layer의 output A는 input 0·1·2를, 옆 output B는 1·2·3을 읽습니다. 하나가 연결한 input 수 r은 3, 두 시작점의 간격 j는 1입니다.",
    showL2: false,
    showL3: false,
    l1: [
      { k: 0, color: BLUE },
      { k: 1, color: ORANGE },
    ],
    l2: [],
    l3: false,
    spans: [
      { from: 0, to: 2, color: BLUE },
      { from: 1, to: 3, color: ORANGE },
    ],
  },
  {
    label: "Layer 2 output 0: A·B·C",
    summary: "r₂=5 · input 0–4",
    note: "둘째 layer의 kernel 3이 A·B·C를 읽습니다. 세 window의 합집합은 input 0–4라 output 0은 input 다섯 개에 연결됩니다.",
    showL2: true,
    showL3: false,
    l1: [
      { k: 0, color: BLUE },
      { k: 1, color: BLUE },
      { k: 2, color: BLUE },
    ],
    l2: [{ m: 0, color: BLUE }],
    l3: false,
    spans: [{ from: 0, to: 4, color: BLUE }],
  },
  {
    label: "Stride 2: 옆 output은 C부터",
    summary: "r₂는 그대로 5 · j₂=2",
    note: "Stride 2라 output 1은 B가 아니라 C·D·E를 읽고 input 2–6에 연결됩니다. 두 output 모두 다섯 칸이라 r₂는 그대로이고, 시작점 간격만 j₂=2가 됐습니다.",
    showL2: true,
    showL3: false,
    l1: [
      { k: 0, color: BLUE },
      { k: 1, color: BLUE },
      { k: 2, color: BLUE },
      { k: 3, color: ORANGE },
      { k: 4, color: ORANGE },
    ],
    l2: [
      { m: 0, color: BLUE },
      { m: 1, color: ORANGE },
    ],
    l3: false,
    spans: [
      { from: 0, to: 4, color: BLUE },
      { from: 2, to: 6, color: ORANGE },
    ],
  },
  {
    label: "다음 layer: 간격 2가 범위를 넓힘",
    summary: "r₃=5+(3−1)×1×2=9",
    note: "본문에 없는 kernel 3, dilation 1 layer를 더 쌓으면(가정) output 0·1·2를 읽습니다. 셋이 2칸씩 떨어져 있어 r₃=5+2×2=9, input 0–8입니다.",
    showL2: true,
    showL3: true,
    l1: [],
    l2: [
      { m: 0, color: BLUE },
      { m: 1, color: BLUE },
      { m: 2, color: BLUE },
    ],
    l3: true,
    spans: [{ from: 0, to: 8, color: BLUE }],
  },
];

function Diagram({ scene, compact }: { scene: Scene; compact: boolean }) {
  // 좁은 화면은 행 이름 칸과 input 칸을 줄여 글자가 7px 아래로 작아지지 않게 합니다.
  const LEFT = compact ? 46 : 92;
  const CELL = compact ? 34 : 46;
  const W = LEFT + INPUTS * CELL + 6;
  const cx = (input: number) => LEFT + input * CELL + CELL / 2;
  // Layer 1 output k는 input k…k+2를 읽으므로 가운데 input k+1 위에 둡니다.
  const l1x = (k: number) => cx(k + 1);
  // Layer 2 output m은 layer 1 output 2m…2m+2를 읽으므로 가운데 2m+1 위에 둡니다.
  const l2x = (m: number) => l1x(2 * m + 1);
  const rowFont = compact ? 11 : 12;
  const l1Color = new Map(scene.l1.map((item) => [item.k, item.color]));
  const l2Color = new Map(scene.l2.map((item) => [item.m, item.color]));
  const covered = (input: number) => scene.spans.some((span) => input >= span.from && input <= span.to);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={compact ? "h-auto w-full sm:hidden" : "mx-auto hidden h-auto w-full max-w-[600px] sm:block"}
      role="img"
      aria-label={`${scene.label}: ${scene.summary}`}
    >
      {/* 행 이름 */}
      <text x={2} y={RAIL_Y + 19} fontSize={rowFont} fontWeight={700} fill={TEXT}>input</text>
      <text x={2} y={L1_Y + (compact ? 0 : 4)} fontSize={rowFont} fontWeight={700} fill={TEXT}>{compact ? "layer 1" : "layer 1 · s=1"}</text>
      {compact && <text x={2} y={L1_Y + 13} fontSize={10} fill={TEXT}>s=1</text>}
      <text x={2} y={L2_Y + (compact ? 0 : 4)} fontSize={rowFont} fontWeight={700} fill={scene.showL2 ? TEXT : "#cbd5e1"}>{compact ? "layer 2" : "layer 2 · s=2"}</text>
      {compact && <text x={2} y={L2_Y + 13} fontSize={10} fill={scene.showL2 ? TEXT : "#cbd5e1"}>s=2</text>}
      <text x={2} y={L3_Y + (compact ? 0 : 4)} fontSize={rowFont} fontWeight={700} fill={scene.showL3 ? TEXT : "#cbd5e1"}>{compact ? "다음" : "다음 layer"}</text>
      <text x={2} y={L3_Y + (compact ? 13 : 18)} fontSize={10} fill={scene.showL3 ? TEXT : "#cbd5e1"}>(가정)</text>

      {/* layer 3 → layer 2 edges */}
      {scene.l3 &&
        [0, 1, 2].map((m) => (
          <line key={`e3-${m}`} x1={cx(4)} y1={L3_Y + R} x2={l2x(m)} y2={L2_Y - R} stroke={BLUE} strokeWidth={1.25} />
        ))}
      {/* layer 2 → layer 1 edges */}
      {scene.l2.map(({ m, color }) =>
        [0, 1, 2].map((offset) => (
          <line
            key={`e2-${m}-${offset}`}
            x1={l2x(m)}
            y1={L2_Y + R}
            x2={l1x(2 * m + offset)}
            y2={L1_Y - R}
            stroke={color}
            strokeWidth={1.25}
            opacity={scene.l3 ? 0.45 : 1}
          />
        )),
      )}
      {/* layer 1 → input edges */}
      {scene.l1.map(({ k, color }) =>
        [0, 1, 2].map((offset) => (
          <line
            key={`e1-${k}-${offset}`}
            x1={l1x(k)}
            y1={L1_Y + R}
            x2={cx(k + offset)}
            y2={RAIL_Y}
            stroke={color}
            strokeWidth={1}
            opacity={0.8}
          />
        )),
      )}

      {/* input rail: 칸 채움은 어느 output이든 연결된 input이라는 뜻이라 중립색이고, output별 범위는 아래 색 막대가 나눕니다 */}
      {Array.from({ length: INPUTS }, (_, input) => (
        <g key={`in-${input}`}>
          <rect
            x={LEFT + input * CELL + 2}
            y={RAIL_Y}
            width={CELL - 4}
            height={RAIL_H}
            rx={4}
            fill={covered(input) ? TEXT : "none"}
            fillOpacity={covered(input) ? 0.14 : 0}
            stroke={covered(input) ? TEXT : MUTED}
            strokeWidth={1}
          />
          <text x={cx(input)} y={RAIL_Y + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{input}</text>
          <text x={cx(input)} y={RAIL_Y + 25} textAnchor="middle" fontSize={9} fill={TEXT}>src {input * 2}</text>
        </g>
      ))}

      {/* 각 output이 연결한 input 범위 */}
      {scene.spans.map((span, index) => {
        const y = RAIL_H + RAIL_Y + 10 + index * 12;
        const x1 = LEFT + span.from * CELL + 4;
        const x2 = LEFT + (span.to + 1) * CELL - 4;
        return (
          <g key={`span-${index}`}>
            <line x1={x1} x2={x2} y1={y} y2={y} stroke={span.color} strokeWidth={1.25} />
            <line x1={x1} x2={x1} y1={y - 4} y2={y + 4} stroke={span.color} strokeWidth={1.25} />
            <line x1={x2} x2={x2} y1={y - 4} y2={y + 4} stroke={span.color} strokeWidth={1.25} />
            <text x={x1 - 6} y={y + 4} textAnchor="end" fontSize={10} fill={span.color} fontWeight={700}>
              {span.to - span.from + 1}칸
            </text>
          </g>
        );
      })}

      {/* layer 1 nodes */}
      {L1.map((name, k) => {
        const color = l1Color.get(k);
        return (
          <g key={`l1-${name}`}>
            <circle cx={l1x(k)} cy={L1_Y} r={R} fill="none" stroke={color ?? MUTED} strokeWidth={color ? 1.25 : 1} />
            <text x={l1x(k)} y={L1_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={color ?? TEXT}>{name}</text>
          </g>
        );
      })}

      {/* layer 2 nodes */}
      {scene.showL2 &&
        [0, 1, 2].map((m) => {
          const color = l2Color.get(m);
          return (
            <g key={`l2-${m}`}>
              <circle cx={l2x(m)} cy={L2_Y} r={R} fill="none" stroke={color ?? MUTED} strokeWidth={color ? 1.25 : 1} />
              <text x={l2x(m)} y={L2_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={color ?? TEXT}>{m}</text>
            </g>
          );
        })}

      {/* 다음 layer node (가정) */}
      {scene.showL3 && (
        <g>
          <circle cx={cx(4)} cy={L3_Y} r={R} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={cx(4)} y={L3_Y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>0</text>
        </g>
      )}
    </svg>
  );
}

export default function StrideJumpViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="Stride와 output jump"
      title="Stride는 지금의 범위가 아니라 다음 layer의 간격을 바꿉니다"
      description="r은 output 하나가 연결한 input position 수, j는 인접한 두 output의 시작점이 input에서 떨어진 칸 수입니다. 아래 칸은 model input position이고 src는 30 fps 원본의 source index입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Layer stride가 output jump와 다음 layer의 receptive span을 바꾸는 과정"
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
