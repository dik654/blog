import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * CPU 하나를 두고 nice 0(weight 1024) 작업 A와 nice 5(weight 335) 작업 B가 겨루는 여섯 장면.
 * 한 mechanism: 실제로 0.75 ms(기본 slice)를 쓰면 vruntime이 0.75 × 1024 / weight만큼 늘고,
 * 가중 평균 V보다 vruntime이 작거나 같은(lag ≥ 0) 작업 가운데 가상 마감이 가장 이른 것을 고른다(kernel/sched/fair.c pick_eevdf).
 * 숫자는 손으로 계산한 값이다. V = (1024·vA + 335·vB) / 1359.
 */
interface Scene {
  label: string;
  t: string;
  vA: number;
  vB: number;
  dA: number;
  dB: number;
  V: number;
  pick: "A" | "B";
  ranA: number;
  ranB: number;
  note: string;
}

const MAX_V = 5; // 가상 시간 축 상한(ms)

const SCENES: readonly Scene[] = [
  { label: "t = 0, 둘 다 새로 들어옴", t: "0.00", vA: 0, vB: 0, dA: 0.75, dB: 2.29, V: 0, pick: "A", ranA: 0, ranB: 0, note: "vruntime은 둘 다 0이라 둘 다 자격이 있습니다. 마감은 A가 0 + 0.75 ms, B가 0 + 0.75 × 1024 ÷ 335 = 2.29 ms입니다. 더 이른 A를 고릅니다." },
  { label: "A가 0.75 ms 씀", t: "0.75", vA: 0.75, vB: 0, dA: 1.5, dB: 2.29, V: 0.57, pick: "B", ranA: 0.75, ranB: 0, note: "A의 vruntime이 0.75가 되고 마감에 닿아 새 마감 1.5를 받습니다. V = 1024 × 0.75 ÷ 1359 = 0.57이라 A(0.75)는 자격을 잃고 B(0)만 남아 B가 뽑힙니다." },
  { label: "B가 0.75 ms 씀", t: "1.50", vA: 0.75, vB: 2.29, dA: 1.5, dB: 4.58, V: 1.13, pick: "A", ranA: 0.75, ranB: 0.75, note: "같은 0.75 ms를 썼지만 B의 vruntime은 2.29만큼 늘었습니다. 가중치가 작아 가상 시간이 3.06배 빨리 흐르기 때문입니다. V = 1.13이라 A만 자격이 있습니다." },
  { label: "A가 다시 0.75 ms", t: "2.25", vA: 1.5, vB: 2.29, dA: 2.25, dB: 4.58, V: 1.69, pick: "A", ranA: 1.5, ranB: 0.75, note: "A는 1.5, V는 1.69입니다. A는 아직 평균 아래라 자격이 있고 B(2.29)는 위라 없습니다. A가 또 뽑힙니다." },
  { label: "A가 세 번째 0.75 ms", t: "3.00", vA: 2.25, vB: 2.29, dA: 3.0, dB: 4.58, V: 2.26, pick: "A", ranA: 2.25, ranB: 0.75, note: "A 2.25, V 2.26으로 아슬아슬하게 A가 자격을 지킵니다. B는 2.29로 여전히 평균 위입니다." },
  { label: "A가 네 번째 0.75 ms", t: "3.75", vA: 3.0, vB: 2.29, dA: 3.75, dB: 4.58, V: 2.83, pick: "B", ranA: 3.0, ranB: 0.75, note: "A가 3.0으로 V 2.83을 넘어 자격을 잃고 B가 뽑힙니다. 3.75 ms 동안 A 3.0, B 0.75를 받아 80 : 20이고, 오래 돌리면 1024 : 335 = 75.4 : 24.6으로 수렴합니다." },
];

const pct = (v: number) => `${Math.min(100, (v / MAX_V) * 100)}%`;

function Row({ name, nice, weight, v, d, V, eligible, picked }: { name: string; nice: number; weight: number; v: number; d: number; V: number; eligible: boolean; picked: boolean }) {
  const color = name === "A" ? "#2563eb" : "#d97706";
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
      <div className="font-mono text-xs leading-tight">
        <div className="font-black" style={{ color }}>
          {name} <span className="font-normal text-muted-foreground">nice {nice}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">w {weight}</div>
      </div>
      <div className="relative h-9 rounded-sm border border-border">
        <div className="absolute inset-y-0 left-0 rounded-l-sm transition-[width] duration-500" style={{ width: pct(v), backgroundColor: `${color}33` }} />
        <div className="absolute inset-y-0 w-0.5 transition-[left] duration-500" style={{ left: pct(v), backgroundColor: color }} title={`vruntime ${v}`} />
        <div className="absolute inset-y-1 w-0 border-l-2 border-dashed transition-[left] duration-500" style={{ left: pct(d), borderColor: color }} title={`deadline ${d}`} />
        <div className="absolute -inset-y-1 w-0 border-l-2 border-[#dc2626] transition-[left] duration-500" style={{ left: pct(V) }} title={`V ${V}`} />
        <div className="absolute inset-0 flex items-center justify-between px-1.5 font-mono text-[10px]">
          <span style={{ color }}>v {v.toFixed(2)}</span>
          <span className="rounded-sm px-1 font-black" style={{ backgroundColor: picked ? color : "transparent", color: picked ? "#ffffff" : eligible ? color : "#94a3b8" }}>
            {picked ? "선택" : eligible ? "자격 있음" : "자격 없음"}
          </span>
          <span className="text-muted-foreground">마감 {d.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function EevdfPickViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const s = SCENES[scenes.active];
  const eligA = s.vA <= s.V + 1e-9;
  const eligB = s.vB <= s.V + 1e-9;
  const total = s.ranA + s.ranB;

  return (
    <VizFrame
      eyebrow="EEVDF pick · 1 CPU · 2 tasks"
      title="평균보다 덜 받은 작업 가운데 가상 마감이 가장 이른 것을 고릅니다"
      description="막대는 가상 시간 축(0~5 ms)입니다. 진한 선이 vruntime, 점선이 가상 마감, 빨간 세로선이 가중 평균 V입니다. vruntime이 V 왼쪽이면 자격이 있습니다."
      note="기본 slice 0.75 ms(sysctl_sched_base_slice), weight는 sched_prio_to_weight[]의 nice 0 = 1024, nice 5 = 335입니다. 두 작업 모두 CPU만 쓰고 잠들지 않는다고 가정했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="EEVDF가 두 작업 중 하나를 고르는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{s.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">실제 시각 {s.t} ms</span>
          </div>
          <div className="mt-3 space-y-3">
            <Row name="A" nice={0} weight={1024} v={s.vA} d={s.dA} V={s.V} eligible={eligA} picked={s.pick === "A"} />
            <Row name="B" nice={5} weight={335} v={s.vB} d={s.dB} V={s.V} eligible={eligB} picked={s.pick === "B"} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">가중 평균 V</dt>
              <dd className="font-bold text-[#dc2626]">{s.V.toFixed(2)} ms</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">다음에 도는 작업</dt>
              <dd className="font-bold text-foreground">{s.pick}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">A가 받은 실제 시간</dt>
              <dd className="font-bold text-[#2563eb]">{s.ranA.toFixed(2)} ms{total ? ` · ${Math.round((s.ranA / total) * 100)}%` : ""}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">B가 받은 실제 시간</dt>
              <dd className="font-bold text-[#d97706]">{s.ranB.toFixed(2)} ms{total ? ` · ${Math.round((s.ranB / total) * 100)}%` : ""}</dd>
            </div>
          </dl>
          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[5rem]">{s.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((x) => x.label)} />
      </div>
    </VizFrame>
  );
}
