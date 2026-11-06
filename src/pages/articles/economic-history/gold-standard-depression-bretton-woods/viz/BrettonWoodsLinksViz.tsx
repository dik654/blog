import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #comparison — 금·달러·다른 통화를 잇는 두 고리와 그 고리에 닿은 서로 다른 사건.
 * 아래 두 막대는 "국외 달러가 금 보유에 비해 커진다"는 방향만 보입니다. 길이는 실측값이 아닙니다.
 */
type LinkState = "on" | "stress" | "cut" | "float";

const SCENES: readonly {
  label: string;
  summary: string;
  upper: LinkState;
  upperText: readonly [string, string];
  lower: LinkState;
  lowerText: readonly [string, string];
  dollars: number;
  note: string;
}[] = [
  {
    label: "1944년의 두 고리",
    summary: "금 — 달러 — 다른 통화",
    upper: "on",
    upperText: ["달러를 금에 연결", "달러의 금 교환 약속"],
    lower: "on",
    lowerText: ["다른 통화를 달러에 고정", "지속적 불균형이면 비율 조정"],
    dollars: 0.25,
    note: "금과 바로 이어진 통화는 달러이고, 다른 통화는 달러를 거쳐 금에 닿습니다.",
  },
  {
    label: "달러가 밖으로 나감",
    summary: "금 대비 국외 달러 증가",
    upper: "stress",
    upperText: ["금 교환 약속의", "신뢰가 약해짐"],
    lower: "on",
    lowerText: ["준비자산이 될 달러가", "국외로 나감"],
    dollars: 0.72,
    note: "준비자산을 공급하려면 미국이 달러를 내보내야 했고, 국외 달러가 금에 비해 커질수록 위쪽 약속의 신뢰가 약해졌습니다.",
  },
  {
    label: "1971년 8월 15일",
    summary: "위쪽 고리 중단",
    upper: "cut",
    upperText: ["닉슨 대통령이 '금 창구'를 닫음", "달러의 금 교환 중단"],
    lower: "on",
    lowerText: ["이 사건이 끊은 고리가", "아닙니다"],
    dollars: 1,
    note: "'금 창구'는 달러를 금으로 바꿔 주던 통로입니다. 주요 통화의 변동환율 전환은 다음 장면에서 따로 봅니다.",
  },
  {
    label: "1973년 3월",
    summary: "아래쪽 고리 변동",
    upper: "cut",
    upperText: ["1971년에 이미 중단", ""],
    lower: "float",
    lowerText: ["서독을 비롯한 주요 통화가", "변동환율로 옮겨 감"],
    dollars: 1,
    note: "변동환율은 고정 비율 없이 통화 가격이 움직이는 방식입니다. 두 사건은 서로 다른 고리에 닿았고, 함께 이 체제의 끝을 이룹니다.",
  },
];

const W = 320;
const H = 216;
const NODE_W = 92;
const NODE_H = 30;
const NODE_X = 2;
const LINK_X = NODE_X + NODE_W / 2;
const GOLD_Y = 2;
const DOLLAR_Y = 66;
const OTHER_Y = 130;
const BAR_X = 62;
const BAR_MAX = W - BAR_X - 2;
const ACTIVE = "#2563eb";
const MUTED = "#64748b";
const WARN = "#dc2626";

const LINK_COLOR: Record<LinkState, string> = { on: MUTED, stress: "#d97706", cut: WARN, float: ACTIVE };

function Link({ top, state, text }: { top: number; state: LinkState; text: readonly [string, string] }) {
  const bottom = top + (DOLLAR_Y - GOLD_Y - NODE_H);
  const mid = (top + bottom) / 2;
  const color = LINK_COLOR[state];
  const emphasized = state !== "on";
  return (
    <g>
      {state === "float" ? (
        <path
          d={`M${LINK_X} ${top} q 7 6 0 11 q -7 6 0 12 q 7 6 0 11`}
          fill="none"
          stroke={color}
          strokeWidth={1.25}
        />
      ) : (
        <line
          x1={LINK_X}
          x2={LINK_X}
          y1={top}
          y2={bottom}
          stroke={color}
          strokeWidth={emphasized ? 1.25 : 1}
          strokeDasharray={state === "cut" ? "3 3" : state === "stress" ? "6 2" : undefined}
        />
      )}
      {state === "cut" && (
        <g stroke={color} strokeWidth={1.25}>
          <line x1={LINK_X - 7} x2={LINK_X + 7} y1={mid - 7} y2={mid + 7} />
          <line x1={LINK_X - 7} x2={LINK_X + 7} y1={mid + 7} y2={mid - 7} />
        </g>
      )}
      <text x={LINK_X + 16} y={text[1] ? mid - 3 : mid + 4} fontSize={12} fontWeight={emphasized ? 700 : 400} fill={emphasized ? color : MUTED}>
        {text[0]}
      </text>
      {text[1] && (
        <text x={LINK_X + 16} y={mid + 13} fontSize={12} fontWeight={emphasized ? 700 : 400} fill={emphasized ? color : MUTED}>
          {text[1]}
        </text>
      )}
    </g>
  );
}

function Node({ y, label }: { y: number; label: string }) {
  return (
    <g>
      <rect x={NODE_X} y={y} width={NODE_W} height={NODE_H} rx={8} fill="none" stroke={MUTED} strokeWidth={1} />
      <text x={LINK_X} y={y + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>{label}</text>
    </g>
  );
}

export default function BrettonWoodsLinksViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const active = scenes.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      eyebrow="두 고리"
      title="금 교환 중단과 변동환율 전환은 다른 고리에서 일어났습니다"
      description="1971년과 1973년의 사건은 무엇을 끊었을까요? 금, 달러, 다른 통화를 잇는 두 고리에 차례로 표시합니다."
      note="아래 두 막대의 길이는 커지는 방향만 보이려는 그림이며 실제 금액이 아닙니다. 나라별 태환과 전환 시점은 달랐습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="금과 달러, 달러와 다른 통화를 잇는 두 고리에 1971년과 1973년의 사건을 표시한 지도"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          <Link top={GOLD_Y + NODE_H} state={scene.upper} text={scene.upperText} />
          <Link top={DOLLAR_Y + NODE_H} state={scene.lower} text={scene.lowerText} />
          <Node y={GOLD_Y} label="금" />
          <Node y={DOLLAR_Y} label="달러" />
          <Node y={OTHER_Y} label="다른 통화" />
          <text x={0} y={181} fontSize={12} fill={MUTED}>미국 금</text>
          <rect x={BAR_X} y={170} width={BAR_MAX * 0.8} height={14} fill="none" stroke="#d97706" strokeWidth={1} />
          <text x={0} y={206} fontSize={12} fill={MUTED}>국외 달러</text>
          <rect x={BAR_X} y={195} width={BAR_MAX * scene.dollars} height={14} fill="#94a3b8" className="transition-[width] duration-500 motion-reduce:transition-none" />
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
