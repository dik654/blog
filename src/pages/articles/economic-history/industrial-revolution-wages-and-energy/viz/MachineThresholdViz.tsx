import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — 사람 방식 10w와 기계 방식 50+4w가 만나는 주급 문턱.
 * 가로 = 주급 w, 세로 = 같은 생산의 주당 총비용. 모든 값은 본문의 설명용 가정입니다.
 */
const person = (w: number) => 10 * w;
const machine = (w: number) => 50 + 4 * w;
const machineDearCoal = (w: number) => 70 + 4 * w;

const W = 330;
const H = 240;
const LEFT = 34;
const RIGHT = 8;
const TOP = 10;
const BOTTOM = 40;
const W_MAX = 14;
const V_MAX = 160;

const px = (w: number) => LEFT + (w / W_MAX) * (W - LEFT - RIGHT);
const py = (value: number) => TOP + ((V_MAX - value) / V_MAX) * (H - TOP - BOTTOM);
const segment = (fn: (w: number) => number) => `${px(0).toFixed(1)},${py(fn(0)).toFixed(1)} ${px(W_MAX).toFixed(1)},${py(fn(W_MAX)).toFixed(1)}`;

const PERSON = "#64748b";
const MACHINE = "#2563eb";
const COAL = "#d97706";

const THRESHOLD = 50 / 6;
const THRESHOLD_COAL = 70 / 6;

const SCENES = [
  { label: "사람 10명", summary: "비용 = 10w", note: "사람 방식은 주급에 10을 곱한 직선입니다. 주급이 0이면 0이고, 주급이 오르는 만큼 가파르게 오릅니다." },
  { label: "기계와 4명", summary: "비용 = 50 + 4w", note: "기계 35와 석탄 15는 주급과 무관하게 50으로 시작하고, 사람이 4명뿐이라 기울기가 완만합니다. 두 선은 w=50/6≈8.33에서 만납니다." },
  { label: "두 지역 읽기", summary: "w=6은 사람, w=10은 기계", note: "w=6에서는 사람 60, 기계 74라 기계가 14 비쌉니다. w=10에서는 사람 100, 기계 90이라 기계가 10 쌉니다. 같은 기계인데 문턱의 어느 쪽에 있느냐로 갈립니다." },
  { label: "석탄비 35", summary: "문턱 8.33 → 11.67", note: "석탄비가 15에서 35로 오르면 기계 선이 20만큼 올라 70+4w가 되고 문턱은 70/6≈11.67입니다. w=10에서도 기계가 110으로 사람 100보다 비싸집니다." },
] as const;

function Gap({ w, a, b, color, text, labelW, labelValue, anchor }: { w: number; a: number; b: number; color: string; text: string; labelW: number; labelValue: number; anchor: "start" | "middle" | "end" }) {
  const x = px(w);
  return (
    <g>
      <line x1={x} x2={x} y1={py(a)} y2={py(b)} stroke={color} strokeWidth={1.25} />
      <circle cx={x} cy={py(a)} r={3} fill={PERSON} />
      <circle cx={x} cy={py(b)} r={3} fill={color} />
      <text x={px(labelW)} y={py(labelValue)} textAnchor={anchor} fontSize={12} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

export default function MachineThresholdViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const active = scenes.active;
  const threshold = active === 3 ? THRESHOLD_COAL : THRESHOLD;
  const crossing = person(threshold);

  return (
    <VizFrame
      eyebrow="손익 문턱"
      title="두 직선이 만나는 주급이 기계 선택을 가릅니다"
      description="주급이 얼마를 넘어야 기계가 싸질까요? 가로는 주급 w, 세로는 같은 양을 만드는 주당 총비용입니다."
      note="노동자 10명, 기계 35, 석탄 15, 기계 방식 4명은 모두 설명용 가정이며 역사 실측값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="주급에 따른 사람 방식과 기계 방식의 총비용 그래프"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 50, 100, 150].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke="#94a3b8" strokeWidth={value === 0 ? 1 : 0.5} strokeDasharray={value === 0 ? undefined : "2 3"} />
              <text x={LEFT - 6} y={py(value) + 4} textAnchor="end" fontSize={12} fill="#64748b">{value}</text>
            </g>
          ))}
          {[0, 6, 10, 14].map((w) => (
            <text key={w} x={px(w)} y={H - 22} textAnchor="middle" fontSize={12} fill="#64748b">{w}</text>
          ))}
          <text x={W - RIGHT} y={H - 4} textAnchor="end" fontSize={12} fill="#64748b">주급 w</text>

          <polyline points={segment(person)} fill="none" stroke={PERSON} strokeWidth={1.25} />
          <text x={px(13.4)} y={py(152)} textAnchor="end" fontSize={12} fontWeight={700} fill={PERSON}>사람 10w</text>

          {active >= 1 && (
            <>
              <polyline points={segment(machine)} fill="none" stroke={MACHINE} strokeWidth={1.25} opacity={active === 3 ? 0.35 : 1} />
              <text x={px(14)} y={py(75)} textAnchor="end" fontSize={12} fontWeight={700} fill={MACHINE} opacity={active === 3 ? 0.5 : 1}>기계 50+4w</text>
            </>
          )}
          {active === 3 && (
            <>
              <polyline points={segment(machineDearCoal)} fill="none" stroke={COAL} strokeWidth={1.25} />
              <text x={px(0.3)} y={py(108)} fontSize={12} fontWeight={700} fill={COAL}>석탄 35일 때 70+4w</text>
            </>
          )}
          {(active === 1 || active === 3) && (
            <g>
              <line x1={px(threshold)} x2={px(threshold)} y1={py(crossing)} y2={py(0)} stroke={active === 3 ? COAL : MACHINE} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(threshold)} cy={py(crossing)} r={3.5} fill={active === 3 ? COAL : MACHINE} />
              <text x={px(threshold) + 5} y={py(0) - 6} fontSize={13} fontWeight={700} fill={active === 3 ? COAL : MACHINE}>{threshold.toFixed(2)}</text>
            </g>
          )}
          {active === 2 && (
            <>
              <Gap w={6} a={person(6)} b={machine(6)} color={MACHINE} text="기계가 14 비쌈" labelW={6.3} labelValue={42} anchor="start" />
              <Gap w={10} a={person(10)} b={machine(10)} color={MACHINE} text="기계가 10 쌈" labelW={9.7} labelValue={108} anchor="end" />
            </>
          )}
          {active === 3 && <Gap w={10} a={person(10)} b={machineDearCoal(10)} color={COAL} text="기계가 10 비쌈" labelW={9.9} labelValue={122} anchor="end" />}
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
