import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #warmup — eager 와 lazy initialization 이 준비 비용을 ready 앞과 뒤 중 어디에 두는지.
 * 막대 길이는 비율이 아니다(본문이 단계별 시간을 하나로 정하지 않음). 요청 몇 개가 compile 을 떠안는지도 가정.
 */
const SCENES = [
  {
    label: "Eager",
    summary: "준비를 ready 앞에 모두",
    note: "Eager initialization 은 weight 전송, profile run, graph capture 를 모두 ready 신호 전에 끝냅니다. cold start 는 길지만 첫 요청부터 latency 가 균일합니다.",
  },
  {
    label: "Lazy",
    summary: "필요해질 때 준비",
    note: "Lazy initialization 은 그 shape 나 kernel 이 실제로 필요해질 때 준비합니다. ready 는 빨라지지만 초기 요청 몇 개가 compile 시간을 떠안습니다.",
  },
  {
    label: "누가 비용을 내나",
    summary: "ready 앞 vs 초기 요청",
    note: "선택 기준은 누가 그 비용을 내느냐입니다. 항상 켜 두는 production replica 는 eager 가 맞습니다. replica 를 자주 띄우는 autoscaling 환경에서는 capture size 를 줄이거나 일부를 lazy 로 두어 ready 를 앞당깁니다.",
  },
] as const;

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

const W = 360;
const H = 188;
const X0 = 8;
const BAR_H = 24;
const GAP = 4;

const PREP = "#64748b";
const REQ = "#16a34a";
const COMPILE = "#d97706";
const LINE = "#94a3b8";

type Seg = { w: number; label: string; color: string; dashed?: boolean };

// eager 의 마지막 칸은 lazy 가 요청 뒤로 미루는 compile 과 같은 준비 비용입니다(본문: warmup 이 compile·capture 를 미리 밟음).
const EAGER_PREP: readonly Seg[] = [
  { w: 70, label: "weight 전송", color: PREP },
  { w: 48, label: "profile", color: PREP },
  { w: 92, label: "compile·capture", color: COMPILE },
];
const LAZY_PREP: readonly Seg[] = [
  { w: 70, label: "weight 전송", color: PREP },
  { w: 48, label: "profile", color: PREP },
];

function Lane({
  y,
  name,
  prep,
  lazy,
  on,
  caption,
}: {
  y: number;
  name: string;
  prep: readonly Seg[];
  lazy: boolean;
  on: boolean;
  caption: string;
}) {
  const prepW = prep.reduce<number>((sum, seg) => sum + seg.w, 0);
  const prepX = prep.map((_, i) => X0 + prep.slice(0, i).reduce<number>((sum, seg) => sum + seg.w, 0));
  const readyX = X0 + prepW;
  const reqs: readonly { req: number; compile: number }[] = lazy
    ? [
        { req: 38, compile: 44 },
        { req: 38, compile: 44 },
        { req: 38, compile: 0 },
      ]
    : [
        { req: 38, compile: 0 },
        { req: 38, compile: 0 },
        { req: 38, compile: 0 },
      ];
  const reqX = reqs.map(
    (_, i) => readyX + GAP + reqs.slice(0, i).reduce<number>((sum, r) => sum + r.req + r.compile + GAP, 0),
  );
  return (
    <g opacity={on ? 1 : 0.35}>
      <text x={X0} y={y - 15} fontSize={13} fontWeight={700} fill="currentColor">
        {name}
      </text>
      {prep.map((seg, i) => (
        <g key={seg.label}>
          <rect x={prepX[i]} y={y} width={seg.w} height={BAR_H} rx={3} fill={seg.color} fillOpacity={0.25} stroke={seg.color} strokeWidth={1} />
          <text x={prepX[i] + seg.w / 2} y={y + 16} textAnchor="middle" fontSize={11} fill="currentColor">
            {seg.label}
          </text>
        </g>
      ))}
      <line x1={readyX} x2={readyX} y1={y - 12} y2={y + BAR_H + 4} stroke="currentColor" strokeWidth={1.25} />
      <text x={readyX} y={y - 15} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
        ready
      </text>
      {reqs.map((r, i) => (
        <g key={i}>
          {r.compile > 0 && (
            <g>
              <rect x={reqX[i]} y={y} width={r.compile} height={BAR_H} rx={3} fill={COMPILE} fillOpacity={0.25} stroke={COMPILE} strokeWidth={1} strokeDasharray="3 2" />
              <text x={reqX[i] + r.compile / 2} y={y + 16} textAnchor="middle" fontSize={11} fill="currentColor">
                compile
              </text>
            </g>
          )}
          <rect x={reqX[i] + r.compile} y={y} width={r.req} height={BAR_H} rx={3} fill={REQ} fillOpacity={0.25} stroke={REQ} strokeWidth={1} />
          <text x={reqX[i] + r.compile + r.req / 2} y={y + 16} textAnchor="middle" fontSize={11} fill="currentColor">
            요청{i + 1}
          </text>
        </g>
      ))}
      <text x={X0} y={y + BAR_H + 17} fontSize={12} fill="#64748b">
        {caption}
      </text>
    </g>
  );
}

function Picture({ index }: { index: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
      <Lane y={36} name="Eager" prep={EAGER_PREP} lazy={false} on={index !== 1} caption="cold start 가 길고, 요청 시간은 처음부터 같음" />
      <Lane y={118} name="Lazy" prep={LAZY_PREP} lazy on={index !== 0} caption="ready 가 빠르고, 초기 요청이 compile 을 떠안음" />
      <line x1={X0} x2={W - 8} y1={184} y2={184} stroke={LINE} strokeWidth={1} />
      <text x={W - 8} y={180} textAnchor="end" fontSize={11} fill="#64748b">
        시간 → (길이는 비율 아님)
      </text>
    </svg>
  );
}

export default function EagerLazyTimelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);

  return (
    <VizFrame
      eyebrow="Warmup 시점"
      title="준비 비용을 ready 앞에 둘지 뒤에 둘지"
      description="ready 는 runtime 이 frontend 에 요청을 받을 수 있다고 알리는 신호입니다. 이 그림의 lazy 는 shape·kernel 준비만 미루는 경우이고, 막대 길이와 compile 을 떠안는 요청 수(2개)는 설명용 가정입니다."
      note="본문 예시의 단계별 시간(weight 전송 9초~140초, profile run 몇 초, graph capture 수십 초)은 hardware 마다 지배 항이 달라 그림에 비율로 옮기지 않았습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="eager 와 lazy initialization 에서 준비 비용이 ready 앞과 뒤에 놓이는 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene, index) => (
            <Picture key={scene.label} index={index} />
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
