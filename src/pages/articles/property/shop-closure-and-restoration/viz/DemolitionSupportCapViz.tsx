import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #limits — 2026-01-19 공고의 폐업일 한도와 면적 한도가 겹쳐 작은 값이 상한이 되는 관계.
 * 가로 = 인정 전용면적(㎡), 세로 = 상한(만 원). 면적 한도 = 면적 ÷ 3.3 × 20만.
 * 66㎡와 99㎡의 만나는 점은 같은 식의 계산입니다: 66 ÷ 3.3 × 20 = 400, 99 ÷ 3.3 × 20 = 600.
 */
const W = 340;
const H = 252;
const LEFT = 34;
const RIGHT = 44;
const TOP = 24;
const BOTTOM = 38;
const M_MAX = 120;
const V_MAX = 800;

const px = (m: number) => LEFT + (m / M_MAX) * (W - LEFT - RIGHT);
const py = (v: number) => TOP + ((V_MAX - v) / V_MAX) * (H - TOP - BOTTOM);
const areaCap = (m: number) => (m / 3.3) * 20;

const AREA_COLOR = "#64748b";
const LOW_COLOR = "#d97706";
const HIGH_COLOR = "#2563eb";
const AXIS_COLOR = "#94a3b8";
const TEXT_COLOR = "#64748b";

const SCENES = [
  { label: "면적 한도", summary: "3.3㎡당 20만 원", note: "넓을수록 올라가는 한도입니다. 33㎡면 33 ÷ 3.3 × 20만 = 200만 원, 99㎡면 600만 원입니다." },
  { label: "폐업일 한도", summary: "400만 또는 600만 원", note: "면적과 상관없는 평평한 선입니다. 2023-01-01부터 2025-07-10까지 폐업했으면 400만 원, 2025-07-11 이후 폐업했으면 600만 원입니다." },
  { label: "33㎡ 점포", summary: "둘 중 작은 값 200만 원", note: "실선이 작은 값을 따라간 실제 상한입니다. 66㎡까지는 면적 한도가 더 낮아 두 실선이 겹칩니다. 그래서 33㎡면 2025-03-10에 닫든 2025-09-30에 닫든 200만 원입니다." },
  { label: "99㎡ 점포", summary: "400만 또는 600만 원", note: "99㎡면 면적 한도가 600만 원까지 올라가 이제 폐업일 한도가 답을 가릅니다. 2025-03-10 폐업은 400만 원, 2025-09-30 폐업은 600만 원입니다." },
] as const;

export default function DemolitionSupportCapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const showMin = active >= 2;

  return (
    <VizFrame
      documentFlow
      className="!h-auto !max-h-none"
      eyebrow="철거비 지원 상한"
      title="두 한도 중 작은 값이 상한입니다"
      description="가로는 인정 전용면적, 세로는 철거비 지원 상한입니다. 공고는 폐업일 한도와 면적 한도 중 작은 값을 넘지 못하게 합니다."
      note="2026-01-19 공고를 읽는 예이며 2026-10-09에 확인했습니다. 면적과 폐업일은 (가정)이고, 이 금액은 신청할 수 있는 상한일 뿐 지급 확정액이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="폐업일 한도와 면적 한도 중 작은 값으로 철거비 지원 상한을 읽는 그래프"
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
          {[0, 200, 400, 600, 800].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke={AXIS_COLOR} strokeWidth={value === 0 ? 1 : 0.5} strokeDasharray={value === 0 ? undefined : "2 3"} />
              <text x={LEFT - 5} y={py(value) + 4} textAnchor="end" fontSize={12} fill={TEXT_COLOR}>{value}</text>
            </g>
          ))}
          <text x={2} y={11} fontSize={12} fill={TEXT_COLOR}>만 원</text>
          {[0, 33, 66, 99].map((m) => (
            <text key={m} x={px(m)} y={H - 22} textAnchor="middle" fontSize={12} fill={TEXT_COLOR}>{m}</text>
          ))}
          <text x={(LEFT + W - RIGHT) / 2} y={H - 5} textAnchor="middle" fontSize={12} fill={TEXT_COLOR}>인정 전용면적(㎡)</text>

          <line x1={px(0)} y1={py(0)} x2={px(M_MAX)} y2={py(areaCap(M_MAX))} stroke={AREA_COLOR} strokeWidth={1} strokeDasharray={showMin ? "4 3" : undefined} />
          <text x={px(40)} y={py(areaCap(46))} textAnchor="end" fontSize={12} fontWeight={700} fill={AREA_COLOR}>면적 한도</text>

          {active >= 1 && (
            <g>
              <line x1={LEFT} x2={W - RIGHT} y1={py(600)} y2={py(600)} stroke={HIGH_COLOR} strokeWidth={1} strokeDasharray={showMin ? "4 3" : undefined} />
              <line x1={LEFT} x2={W - RIGHT} y1={py(400)} y2={py(400)} stroke={LOW_COLOR} strokeWidth={1} strokeDasharray={showMin ? "4 3" : undefined} />
              <text x={LEFT + 4} y={py(600) - 5} fontSize={12} fontWeight={700} fill={HIGH_COLOR}>2025-07-11 이후 폐업</text>
              <text x={LEFT + 4} y={py(400) - 5} fontSize={12} fontWeight={700} fill={LOW_COLOR}>2025-07-10까지 폐업</text>
            </g>
          )}

          {showMin && (
            <g fill="none" strokeWidth={1.25}>
              <polyline points={`${px(0)},${py(0)} ${px(66)},${py(400)}`} stroke={AREA_COLOR} />
              <polyline points={`${px(66)},${py(400)} ${px(M_MAX)},${py(400)}`} stroke={LOW_COLOR} />
              <polyline points={`${px(66)},${py(400)} ${px(99)},${py(600)} ${px(M_MAX)},${py(600)}`} stroke={HIGH_COLOR} />
            </g>
          )}

          {active === 2 && (
            <g>
              <line x1={px(33)} x2={px(33)} y1={py(0)} y2={py(200)} stroke={AXIS_COLOR} strokeWidth={1} />
              <circle cx={px(33)} cy={py(200)} r={4} fill={AREA_COLOR} />
              <text x={px(33) + 8} y={py(200) + 15} fontSize={13} fontWeight={700} fill={TEXT_COLOR}>200만 원</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <line x1={px(99)} x2={px(99)} y1={py(0)} y2={py(600)} stroke={AXIS_COLOR} strokeWidth={1} />
              <circle cx={px(99)} cy={py(400)} r={4} fill={LOW_COLOR} />
              <circle cx={px(99)} cy={py(600)} r={4} fill={HIGH_COLOR} />
              <text x={px(99) + 7} y={py(400) + 16} fontSize={13} fontWeight={700} fill={LOW_COLOR}>400만</text>
              <text x={px(99) + 7} y={py(600) + 16} fontSize={13} fontWeight={700} fill={HIGH_COLOR}>600만</text>
            </g>
          )}
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
