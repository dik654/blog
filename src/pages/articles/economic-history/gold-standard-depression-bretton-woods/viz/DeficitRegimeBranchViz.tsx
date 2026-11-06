import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — 같은 국외 순지급 20이 제도에 따라 어느 자리로 가는지.
 * 위 상자는 고정, 세 갈래 가운데 실선 화살표가 그 제도에서 먼저 받는 자리입니다.
 */
type Slot = { value: string; on: boolean };

const SCENES: readonly {
  label: string;
  summary: string;
  gold: Slot;
  loan: Slot;
  rate: Slot;
  moves: string;
  cost: string;
}[] = [
  {
    label: "엄격한 금 교환",
    summary: "금 100 → 80",
    gold: { value: "100 → 80", on: true },
    loan: { value: "새 차입 없음", on: false },
    rate: { value: "5:1 고정", on: false },
    moves: "금리 인상·신용 축소로 수입과 국내 가격을 낮춤",
    cost: "실업과 채무 부담",
  },
  {
    label: "조정 가능한 고정: 한 해의 충격",
    summary: "20을 빌림",
    gold: { value: "감소를 늦춤", on: false },
    loan: { value: "20 빌림", on: true },
    rate: { value: "5:1 유지", on: false },
    moves: "일시적 부족을 국제 지원으로 메워 금 감소를 늦춤",
    cost: "지원 조건과 다른 나라의 동의",
  },
  {
    label: "조정 가능한 고정: 계속되는 차이",
    summary: "공식 비율 5 → 6.25",
    gold: { value: "이번 갈래 아님", on: false },
    loan: { value: "이번 갈래 아님", on: false },
    rate: { value: "5 → 6.25", on: true },
    moves: "금 1당 통화 5를 6.25로 바꾸는 평가절하로 상대 가격을 한 번에 고침",
    cost: "다른 나라의 동의가 범위를 정함",
  },
  {
    label: "변동환율",
    summary: "자국 통화 값 하락",
    gold: { value: "이번 갈래 아님", on: false },
    loan: { value: "이번 갈래 아님", on: false },
    rate: { value: "통화 값 하락", on: true },
    moves: "비율을 정해 두지 않아 통화 값이 내려가고, 수입은 비싸지고 수출은 싸짐",
    cost: "외화 부채와 수입 물가가 즉시 부담",
  },
];

const W = 320;
const H = 150;
const NODE_W = 100;
const NODE_Y = 74;
const NODE_H = 54;
const ACTIVE = "#2563eb";
const IDLE = "#94a3b8";
const NODES = [
  { key: "gold", name: "금 준비자산", x: 2 },
  { key: "loan", name: "국제 대출", x: 110 },
  { key: "rate", name: "환율", x: 218 },
] as const;

export default function DeficitRegimeBranchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const active = scenes.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      eyebrow="세 갈래"
      title="같은 적자 20이 제도마다 다른 자리로 갑니다"
      description="금·대출·환율 가운데 무엇이 먼저 20을 받을까요? 실선 화살표가 그 제도에서 먼저 움직이는 자리입니다."
      note="금 100, 통화 500, 약속 5:1의 설명용 가정을 그대로 넣었습니다. 어느 제도도 20의 실물 자원 차이를 공짜로 없애지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="국외 순지급 20이 제도에 따라 금, 국제 대출, 환율 가운데 어디로 가는지 보여 주는 분기"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          <rect x={85} y={2} width={150} height={32} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
          <text x={160} y={23} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">국외 순지급 20</text>
          {NODES.map((node) => {
            const slot = scene[node.key];
            const cx = node.x + NODE_W / 2;
            const stroke = slot.on ? ACTIVE : IDLE;
            return (
              <g key={node.key}>
                <path
                  d={`M160 34 C160 52 ${cx} 50 ${cx} ${slot.on ? NODE_Y - 7 : NODE_Y}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={slot.on ? 1.25 : 1}
                  strokeDasharray={slot.on ? undefined : "3 3"}
                />
                {slot.on && <polygon points={`${cx - 4},${NODE_Y - 7} ${cx + 4},${NODE_Y - 7} ${cx},${NODE_Y}`} fill={ACTIVE} />}
                <rect
                  x={node.x}
                  y={NODE_Y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={slot.on ? 1.25 : 1}
                  strokeDasharray={slot.on ? undefined : "3 3"}
                />
                <text x={cx} y={NODE_Y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={slot.on ? ACTIVE : "#64748b"}>{node.name}</text>
                <text x={cx} y={NODE_Y + 41} textAnchor="middle" fontSize={12} fontWeight={slot.on ? 700 : 400} fill={slot.on ? ACTIVE : "#64748b"}>{slot.value}</text>
                {slot.on && <line x1={cx} x2={cx} y1={NODE_Y + NODE_H} y2={H} stroke={ACTIVE} strokeWidth={1.25} />}
              </g>
            );
          })}
        </svg>
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <dl key={item.label} className="mx-auto w-full max-w-[520px] rounded-lg border border-primary/50 px-3 py-2 text-sm leading-6">
              <dt className="text-xs font-bold text-muted-foreground">그다음 움직이는 것</dt>
              <dd className="font-semibold text-foreground">{item.moves}</dd>
              <dt className="mt-1 text-xs font-bold text-muted-foreground">비용과 제약</dt>
              <dd className="font-semibold text-foreground">{item.cost}</dd>
            </dl>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => `${item.moves}. ${item.cost}.`)} />
      </div>
    </VizFrame>
  );
}
