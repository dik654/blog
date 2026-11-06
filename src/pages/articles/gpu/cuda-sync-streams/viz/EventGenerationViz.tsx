import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #events — record와 wait의 제출 순서가 정하는 연결.
 * 가로 = 제출 순서. 화살표는 B의 wait가 실제로 붙잡는 기록을 가리킵니다.
 */
type Box = readonly [number, string, string?, ("record" | "wait" | "bad")?];
type Scene = {
  label: string;
  summary: string;
  a: readonly Box[];
  b: readonly Box[];
  links: readonly (readonly [number, number])[];
  caption: string;
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "기록 뒤 기다리기",
    summary: "B가 A의 생산 뒤 진행",
    a: [[0, "생산", "8"], [1, "record", "ready", "record"]],
    b: [[2, "wait", "ready", "wait"], [3, "소비", "8"]],
    links: [[1, 2]],
    caption: "",
    note: "A의 생산 뒤 ready를 record하고 B의 소비 앞에 wait를 제출합니다. 이 wait는 device 쪽 의존 관계로, host의 완료 대기와 다릅니다.",
  },
  {
    label: "어디에 기록하나",
    summary: "기록 위치 = 기다리는 지점",
    a: [[0, "계산", "8"], [1, "record", "device", "record"], [2, "D2H", "복사"], [3, "record", "host", "record"]],
    b: [[4, "wait", "택일", "wait"]],
    links: [[1, 4], [3, 4]],
    caption: "",
    note: "계산 뒤에 기록하면 8이 device에 준비된 지점을, D2H 뒤에 기록하면 host 출력까지 도착한 지점을 기다립니다. 기록 뒤 추가한 작업은 그 기록에 들어가지 않습니다.",
  },
  {
    label: "기다리기가 먼저면",
    summary: "연결이 생기지 않습니다",
    a: [[2, "생산", "8"], [3, "record", "ready", "record"]],
    b: [[0, "wait", "빈 표식", "bad"], [1, "소비", "?"]],
    links: [],
    caption: "뒤늦은 record는 기존 wait를 고치지 않음",
    note: "기록하지 않은 event는 빈 작업 집합이며 미래의 작업을 기다리는 약속이 아닙니다. B가 먼저 wait를 제출한 뒤 A가 record해도 안전한 연결은 생기지 않습니다.",
  },
  {
    label: "wait 뒤 세대2 기록",
    summary: "wait는 세대1을 붙잡음",
    a: [[0, "생산", "세대1"], [1, "record", "세대1", "record"], [3, "생산", "세대2"], [4, "record", "세대2", "record"]],
    b: [[2, "wait", "handle", "wait"]],
    links: [[1, 2]],
    caption: "",
    note: "같은 event handle을 세대1에 기록하고 B가 기다린 뒤 세대2에 다시 기록해도, B의 기존 wait는 세대1을 붙잡습니다.",
  },
  {
    label: "wait 전 세대2 기록",
    summary: "wait는 세대2를 씀",
    a: [[0, "생산", "세대1"], [1, "record", "세대1", "record"], [2, "생산", "세대2"], [3, "record", "세대2", "record"]],
    b: [[4, "wait", "handle", "wait"]],
    links: [[3, 4]],
    caption: "",
    note: "B의 wait 호출 전에 세대2를 기록하면 가장 최근인 세대2를 씁니다. host thread가 여럿이면 이 제출 순서도 프로그램에서 맞춰야 합니다.",
  },
];

const W = 340;
const H = 176;
const LANE_A = 24;
const LANE_B = 106;
const BOX_W = 60;
const BOX_H = 40;
const colX = (col: number) => 6 + col * 66.5;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";

function Lane({ boxes, y }: { boxes: readonly Box[]; y: number }) {
  return (
    <g>
      <line x1={6} x2={W - 6} y1={y + BOX_H / 2} y2={y + BOX_H / 2} stroke={LINE} strokeWidth={0.5} />
      {boxes.map(([col, top, bottom, kind]) => {
        const stroke = kind === "record" ? AMBER : kind === "wait" ? BLUE : kind === "bad" ? RED : LINE;
        return (
          <g key={`${col}-${top}`}>
            <rect x={colX(col)} y={y} width={BOX_W} height={BOX_H} rx={4} fill={kind === "wait" ? "#2563eb1f" : kind === "record" ? "#d977061f" : "#94a3b81f"} stroke={stroke} strokeWidth={1} strokeDasharray={kind === "bad" ? "3 2" : undefined} />
            <text x={colX(col) + BOX_W / 2} y={y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={kind === "bad" ? RED : MUTED}>{top}</text>
            <text x={colX(col) + BOX_W / 2} y={y + 32} textAnchor="middle" fontSize={13} fill={MUTED}>{bottom}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function EventGenerationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      eyebrow="제출 순서"
      title="record와 wait 중 무엇을 먼저 제출했나요"
      description="가로는 제출 순서입니다. 위 줄이 stream A, 아래 줄이 stream B이고, 화살표는 B의 wait가 실제로 붙잡는 기록입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="record와 wait의 제출 순서에 따라 stream 사이 연결이 달라지는 다섯 경우"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          <text x={6} y={14} fontSize={13} fontWeight={700} fill={MUTED}>stream A</text>
          <text x={6} y={LANE_B - 8} fontSize={13} fontWeight={700} fill={MUTED}>stream B</text>
          <Lane boxes={scene.a} y={LANE_A} />
          <Lane boxes={scene.b} y={LANE_B} />
          {scene.links.map(([from, to]) => {
            const x1 = colX(from) + BOX_W / 2;
            const x2 = colX(to) + BOX_W / 2;
            const y2 = LANE_B - 1;
            const angle = Math.atan2(y2 - (LANE_A + BOX_H), x2 - x1);
            const left = `${x2 - 7 * Math.cos(angle - 0.45)},${y2 - 7 * Math.sin(angle - 0.45)}`;
            const right = `${x2 - 7 * Math.cos(angle + 0.45)},${y2 - 7 * Math.sin(angle + 0.45)}`;
            return (
              <g key={`${from}-${to}`}>
                <line x1={x1} y1={LANE_A + BOX_H} x2={x2} y2={y2} stroke={BLUE} strokeWidth={1.25} />
                <polygon points={`${x2},${y2} ${left} ${right}`} fill={BLUE} />
              </g>
            );
          })}
          {scene.caption && <text x={W - 6} y={H - 8} textAnchor="end" fontSize={13} fontWeight={700} fill={RED}>{scene.caption}</text>}
          {!scene.caption && <text x={W - 6} y={H - 8} textAnchor="end" fontSize={13} fill={MUTED}>제출 순서 →</text>}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
