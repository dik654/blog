import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #comparison — 일일 2배 재설정과 수량 고정 차입이 같은 지수에서 갈리는 지점.
 * 재설정: 재산 100, 노출 200 → 120, 220 → 노출 240 → 240×(10÷110)≈21.82 손실 → 98.18.
 * 수량 고정: 자산 200 → 220 → 200, 빚 100을 빼면 100 → 120 → 100. 비용을 뺀 가정입니다.
 */
const SCENES = [
  { label: "시작", index: "지수 100", summary: "둘 다 재산 100 · 노출 200", note: "두 경우 모두 자기 몫 100으로 지수 200만큼의 움직임을 받습니다.", reset: [100, 200], fixed: [100, 200] },
  { label: "첫날 지수 +10%", index: "지수 110", summary: "둘 다 +20", note: "노출 200의 10%인 20을 벌어 재산이 120이 됩니다. 여기까지는 두 경우가 같습니다.", reset: [120, 220], fixed: [120, 220] },
  { label: "재설정", index: "지수 110", summary: "노출 220 → 240", note: "재설정하는 쪽은 재산 120의 두 배인 240으로 노출을 20 늘립니다. 수량을 고정한 쪽은 220 그대로입니다.", reset: [120, 240], fixed: [120, 220] },
  { label: "둘째 날 지수 −9.09%", index: "지수 100", summary: "98.18 대 100", note: "지수가 110에서 100으로 내리면 240에서 21.82, 220에서 20을 잃습니다. 차이 1.82는 늘린 노출 20이 함께 맞은 하락입니다.", reset: [98.18, 218.18], fixed: [100, 200] },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const LEFT = 52;
const MAX_WIDTH = 226;
const scale = (value: number) => (value / 240) * MAX_WIDTH;

function Bar({ y, name, value, tone, changed }: { y: number; name: string; value: number; tone: string; changed: boolean }) {
  return (
    <g>
      <text x={LEFT - 6} y={y + 13} textAnchor="end" fontSize={12} fill="#64748b">{name}</text>
      <rect x={LEFT} y={y} width={scale(value)} height={18} rx={3} fill={tone} opacity={changed ? 0.9 : 0.55} />
      <text x={LEFT + scale(value) + 5} y={y + 13} fontSize={12} fontWeight={changed ? 700 : 400} fill="currentColor">{value}</text>
    </g>
  );
}

export default function DailyResetExposureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const scene = SCENES[active];
  const previous = active > 0 ? SCENES[active - 1] : scene;

  return (
    <VizFrame
      eyebrow="일일 재설정"
      title="지수가 제자리로 와도 2배 상품이 98.18이 되는 이유"
      description="노출은 지수가 움직일 때 손익이 걸리는 금액입니다. 재설정은 그 금액을 매일 그날 재산의 두 배로 다시 맞추는 일입니다."
      note="비용과 이자를 뺀 가정입니다. 수량 고정 쪽은 자기 돈 100에 빌린 돈 100을 더한 경우입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="일일 재설정과 수량 고정의 노출과 재산을 날짜별로 비교하는 과정"
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
        <svg viewBox="0 0 340 190" className="mx-auto mt-3 h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          <text x={0} y={14} fontSize={13} fontWeight={700} fill={ACCENT}>매일 재설정</text>
          <text x={340} y={14} textAnchor="end" fontSize={13} fontWeight={700} fill="currentColor">{scene.index}</text>
          <Bar y={22} name="재산" value={scene.reset[0]} tone={ACCENT} changed={scene.reset[0] !== previous.reset[0]} />
          <Bar y={46} name="노출" value={scene.reset[1]} tone={ACCENT} changed={scene.reset[1] !== previous.reset[1]} />
          <line x1={0} x2={340} y1={82} y2={82} stroke={MUTED} strokeWidth={0.5} strokeDasharray="2 3" />
          <text x={0} y={106} fontSize={13} fontWeight={700} fill="#64748b">수량 고정</text>
          <Bar y={114} name="자기 몫" value={scene.fixed[0]} tone={MUTED} changed={scene.fixed[0] !== previous.fixed[0]} />
          <Bar y={138} name="자산" value={scene.fixed[1]} tone={MUTED} changed={scene.fixed[1] !== previous.fixed[1]} />
          <line x1={LEFT} x2={LEFT} y1={18} y2={160} stroke={MUTED} strokeWidth={1} />
          <text x={LEFT} y={180} fontSize={12} fill="#64748b">막대 길이는 금액에 비례합니다</text>
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
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
