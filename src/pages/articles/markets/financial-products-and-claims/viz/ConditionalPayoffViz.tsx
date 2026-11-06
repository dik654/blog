import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source — 50% 참여·10% 상한 계약과 60% 손실 문턱 계약의 만기 지급.
 * 상한 계약: 1000 + 1000×min(50%×상승률, 10%). 상승 20%에서 상한에 닿습니다(10÷50).
 * 문턱 계약: 최종 비율 60% 이상이면 1060, 미만이면 1000×비율. 61%→1060, 59%→590, 차이 470.
 */
const SCENES = [
  { label: "상한 계약", summary: "+30%에서도 1100만 원", note: "상승의 50%를 받되 수익 상한은 10%입니다. 상승 20%에서 상한에 닿아 30%가 올라도 1100만 원입니다." },
  { label: "손실 문턱 계약", summary: "60% 이상이면 1060만 원", note: "최종 기준가격이 60% 이상이면 1060만 원, 미만이면 원금에 그 비율을 곱해 받습니다. 그래서 60%에서 선이 끊깁니다." },
  { label: "문턱 양쪽 읽기", summary: "61% 1060 · 59% 590", note: "최종 가격 차이는 2%포인트인데 지급액은 470만 원 차이입니다." },
  { label: "같은 축에 겹치기", summary: "손실 모습이 다름", note: "상한 계약은 아래가 1000만 원에서 평평하고, 문턱 계약은 60% 아래로 떨어지면 원금이 줄어듭니다." },
] as const;

const W = 340;
const H = 226;
const LEFT = 42;
const RIGHT = 12;
const TOP = 14;
const BOTTOM = 34;
const X_MAX = 140;
const Y_MAX = 1200;
const px = (ratio: number) => LEFT + (ratio / X_MAX) * (W - LEFT - RIGHT);
const py = (value: number) => TOP + ((Y_MAX - value) / Y_MAX) * (H - TOP - BOTTOM);
const pts = (rows: readonly (readonly [number, number])[]) => rows.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");

const CAP = [[0, 1000], [100, 1000], [120, 1100], [140, 1100]] as const;
const LOW = [[0, 0], [60, 600]] as const;
const HIGH = [[60, 1060], [140, 1060]] as const;

const CAP_TONE = "#2563eb";
const GATE_TONE = "#d97706";
const RED = "#dc2626";

export default function ConditionalPayoffViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const showCap = active === 0 || active === 3;
  const showGate = active >= 1;

  return (
    <VizFrame
      eyebrow="만기 지급"
      title="두 조건부 계약의 지급액을 최종 가격에 따라 그립니다"
      description="가로는 처음을 100%로 둔 최종 가격, 세로는 1000만 원을 넣은 계약의 만기 지급액(만 원)입니다."
      note="두 계약 모두 설명용 가정이며 발행자가 약속대로 지급할 때의 만기 값입니다. 발행자 부도와 중도 매각, 실제 ELS의 조기상환이나 기간 중 장벽 조건은 뺐습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="상한 계약과 손실 문턱 계약의 만기 지급 그래프"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 500, 1000].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke="#94a3b8" strokeWidth={value === 0 ? 1 : 0.5} strokeDasharray={value === 0 ? undefined : "2 3"} />
              <text x={LEFT - 5} y={py(value) + 4} textAnchor="end" fontSize={11} fill="#64748b">{value}</text>
            </g>
          ))}
          {[0, 60, 100, 140].map((ratio) => (
            <text key={ratio} x={px(ratio)} y={H - 16} textAnchor={ratio === 140 ? "end" : ratio === 0 ? "start" : "middle"} fontSize={11} fill="#64748b">{ratio}%</text>
          ))}
          <text x={(LEFT + W - RIGHT) / 2} y={H - 2} textAnchor="middle" fontSize={11} fill="#64748b">최종 가격</text>
          {showCap && (
            <g>
              <polyline points={pts(CAP)} fill="none" stroke={CAP_TONE} strokeWidth={1.25} />
              <text x={px(138)} y={py(1100) - 7} textAnchor="end" fontSize={12} fontWeight={700} fill={CAP_TONE}>상한 계약 1100</text>
            </g>
          )}
          {active === 0 && (
            <g>
              <circle cx={px(130)} cy={py(1100)} r={3.5} fill={CAP_TONE} />
              <line x1={px(130)} x2={px(130)} y1={py(1100)} y2={py(0)} stroke={CAP_TONE} strokeWidth={0.5} strokeDasharray="2 3" />
              <text x={px(130)} y={py(0) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={CAP_TONE}>130%</text>
              <circle cx={px(120)} cy={py(1100)} r={2.5} fill={CAP_TONE} />
              <text x={px(126)} y={py(1000) + 16} textAnchor="end" fontSize={11} fill={CAP_TONE}>120%에서 막힘</text>
            </g>
          )}
          {showGate && (
            <g>
              <polyline points={pts(LOW)} fill="none" stroke={GATE_TONE} strokeWidth={1.25} />
              <polyline points={pts(HIGH)} fill="none" stroke={GATE_TONE} strokeWidth={1.25} />
              <line x1={px(60)} x2={px(60)} y1={py(1060)} y2={py(600)} stroke={GATE_TONE} strokeWidth={0.75} strokeDasharray="3 3" />
              <text x={px(active === 3 ? 62 : 138)} y={py(1060) + (active === 3 ? -7 : -7)} textAnchor={active === 3 ? "start" : "end"} fontSize={12} fontWeight={700} fill={GATE_TONE}>문턱 계약 1060</text>
              {active !== 2 && <text x={px(58)} y={py(600) - 8} textAnchor="end" fontSize={12} fill={GATE_TONE}>60% 아래 줄어듦</text>}
            </g>
          )}
          {active === 2 && (
            <g>
              <circle cx={px(61)} cy={py(1060)} r={3.5} fill={GATE_TONE} />
              <circle cx={px(59)} cy={py(590)} r={3.5} fill={RED} />
              <text x={px(55)} y={py(590) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={RED}>59% → 590</text>
              <text x={px(65)} y={py(1060) + 16} fontSize={12} fontWeight={700} fill={GATE_TONE}>61% → 1060</text>
              <text x={px(66)} y={py(820)} fontSize={12} fontWeight={700} fill={RED}>차이 470</text>
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
