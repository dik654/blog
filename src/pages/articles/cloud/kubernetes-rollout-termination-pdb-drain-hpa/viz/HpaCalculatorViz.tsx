import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * HPA 컨트롤러가 15초마다 하는 계산을 Pod 다섯 칸으로 그린다.
 * 한 mechanism: 평균은 ready Pod만으로 내고, ratio = 평균 ÷ 목표, tolerance 0.1 안이면 유지, 아니면 ceil(ratio × 센 Pod 수).
 * 지표 없는 Pod·아직 Ready가 아닌 Pod는 방향에 따라 0% 또는 100%로 채워 다시 계산한다(replica_calculator.go 80–165행). 목표 50%, request 500m은 가정이다.
 */
type PodState = { name: string; usage: number | null; ready: boolean };

interface Scene {
  label: string;
  pods: readonly PodState[];
  line1: string;
  line2: string;
  result: string;
  resultColor: string;
  note: string;
}

const P = (name: string, usage: number | null, ready = true): PodState => ({ name, usage, ready });

const SCENES: readonly Scene[] = [
  {
    label: "확대: 4 → 7",
    pods: [P("a", 80), P("b", 80), P("c", 80), P("d", 80)],
    line1: "평균 80% ÷ 목표 50% = ratio 1.6",
    line2: "1.6 > 1.1 → tolerance 밖",
    result: "ceil(1.6 × 4 ready) = 7",
    resultColor: "#dc2626",
    note: "네 Pod 모두 Ready이고 지표가 있습니다. request 500m 대비 평균 400m(80%)이라 ratio는 1.6이고, 0.9~1.1 밖이므로 ceil(1.6 × 4) = 7로 늘립니다. behavior 기본값은 15초에 max(4개, 100%)까지 허용하므로 한 번에 7이 됩니다.",
  },
  {
    label: "tolerance 안: 유지",
    pods: [P("a", 54), P("b", 54), P("c", 54), P("d", 54)],
    line1: "평균 54% ÷ 50% = ratio 1.08",
    line2: "0.9 ≤ 1.08 ≤ 1.1 → tolerance 안",
    result: "현재 4 유지",
    resultColor: "#2563eb",
    note: "목표보다 8% 높지만 ratio 1.08은 0.1 안입니다. 컨트롤러는 아무것도 하지 않습니다. 이 띠가 없으면 지표가 흔들릴 때마다 4 ↔ 5를 오가는 flapping이 생깁니다.",
  },
  {
    label: "unready 보정: 유지",
    pods: [P("a", 90), P("b", 90), P("c", 90), P("d", null, false), P("e", null, false)],
    line1: "ready 3개 평균 90% → ratio 1.8 (확대 방향)",
    line2: "unready를 0%로 넣어 재계산: 270 ÷ 5 = 54% → ratio 1.08",
    result: "tolerance 안 → 5 유지",
    resultColor: "#2563eb",
    note: "방금 3 → 5로 늘려 d·e가 아직 Ready가 아닙니다. ready 셋만 보면 ratio 1.8이라 또 늘려야 할 것 같지만, 확대 방향일 때 unready Pod를 0%로 넣어 다시 계산하면 54%, ratio 1.08로 tolerance 안입니다. 새 Pod가 뜨기도 전에 더 늘리는 일을 이 보정이 막습니다.",
  },
  {
    label: "지표 없는 Pod: 축소 완화",
    pods: [P("a", 20), P("b", 20), P("c", 20), P("d", null)],
    line1: "지표 있는 3개 평균 20% → ratio 0.4 (축소 방향)",
    line2: "missing을 100%로 넣어 재계산: 160 ÷ 4 = 40% → ratio 0.8",
    result: "ceil(0.8 × 4) = 4 → 유지",
    resultColor: "#2563eb",
    note: "d의 지표가 metrics-server에서 빠졌습니다. 셋만 보면 ratio 0.4라 2개로 줄여야 하지만, 축소 방향에서 지표 없는 Pod는 100%를 쓴다고 가정해 다시 계산하면 ratio 0.8, ceil(0.8 × 4) = 4로 현재와 같습니다. 모르는 Pod 때문에 과감히 줄이지 않습니다.",
  },
  {
    label: "축소 안정화 5분",
    pods: [P("a", 30), P("b", 30), P("c", 30), P("d", 30), P("e", 30)],
    line1: "이번 권고: ceil(0.6 × 5) = 3",
    line2: "최근 5분 권고 {7, 7, 6, 3} 의 최댓값 = 7",
    result: "7 유지 (창이 지나야 내려감)",
    resultColor: "#f59e0b",
    note: "부하가 빠져 이번 계산은 3이지만 stabilizeRecommendation은 최근 5분 권고 가운데 최댓값을 돌려줍니다. 2분 전 권고가 7이었으면 7에 머뭅니다. 부하가 다시 올 때 Pod를 새로 띄우는 비용보다 5분 더 쓰는 비용이 싸다는 선택입니다.",
  },
  {
    label: "request 없음: 계산 불가",
    pods: [P("a", null), P("b", null), P("c", null), P("d", null)],
    line1: "calculateRequests → 오류 (CPU request 없음)",
    line2: "ratio를 만들 분모가 없음",
    result: "스케일 안 함 · FailedGetResourceMetric",
    resultColor: "#94a3b8",
    note: "Utilization 목표는 requests 대비 비율이라 컨테이너에 CPU request가 없으면 분모가 없습니다. HPA는 ScalingActive=False 조건과 FailedGetResourceMetric 이유를 남기고 아무것도 하지 않습니다. 'HPA가 안 움직인다'의 가장 흔한 원인입니다.",
  },
];

const SLOTS = 5;

export default function HpaCalculatorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const s = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="HPA replica 계산"
      title="HPA는 ready Pod의 평균 ÷ 목표를 구해 0.9~1.1이면 멈추고, 아니면 올림한 뒤 5분 창으로 축소를 늦춥니다"
      description="위 칸은 Pod 하나씩의 CPU 사용률(request 500m 대비)입니다. 회색 칸은 아직 Ready가 아니거나 지표가 없는 Pod이고, 아래 세 줄이 그 순간의 계산입니다."
      note="목표 50%, request 500m, 사용률 값은 가정입니다. 계산 규칙은 Kubernetes v1.37.1 pkg/controller/podautoscaler/replica_calculator.go와 horizontal.go의 기본값을 따릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="HPA replica 계산 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.2rem] flex-wrap items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{s.label}</h4>
            <span className="font-mono text-xs font-bold text-muted-foreground">목표 50% · request 500m</span>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2">
            {Array.from({ length: SLOTS }, (_, i) => {
              const pod = s.pods[i];
              if (!pod) return <div key={i} className="h-16 rounded-md border border-dashed border-border/60" />;
              const grey = pod.usage === null;
              const fill = grey ? 0 : Math.min(100, pod.usage ?? 0);
              return (
                <div key={pod.name} className="relative h-16 overflow-hidden rounded-md border" style={{ borderColor: grey ? "#94a3b8" : "#2563eb" }}>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ backgroundColor: grey ? "#cbd5e1" : fill > 55 ? "#f59e0b" : "#93c5fd" }}
                    initial={false}
                    animate={{ height: `${grey ? 100 : fill}%`, opacity: grey ? 0.5 : 0.85 }}
                    transition={{ duration: reduced ? 0 : 0.35 }}
                  />
                  <div className="relative flex h-full flex-col items-center justify-between py-1">
                    <span className="text-[10px] font-bold text-muted-foreground">{pod.name}</span>
                    <span className="text-xs font-black text-foreground">{grey ? (pod.ready ? "지표 없음" : "unready") : `${pod.usage}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <dl className="mt-3 grid gap-1.5 font-mono text-xs">
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 rounded-md border border-border px-3 py-1.5">
              <dt className="text-muted-foreground">평균·ratio</dt>
              <dd className="min-h-[1.25rem] font-bold text-foreground">{s.line1}</dd>
            </div>
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 rounded-md border border-border px-3 py-1.5">
              <dt className="text-muted-foreground">판정</dt>
              <dd className="min-h-[1.25rem] font-bold text-foreground">{s.line2}</dd>
            </div>
            <motion.div
              className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 rounded-md border px-3 py-1.5"
              initial={false}
              animate={{ borderColor: s.resultColor, backgroundColor: `${s.resultColor}14` }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <dt className="text-muted-foreground">결과</dt>
              <dd className="min-h-[1.25rem] font-black" style={{ color: s.resultColor }}>
                {s.result}
              </dd>
            </motion.div>
          </dl>

          <p className="mt-4 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[6rem]">{s.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((x) => x.label)} />
      </div>
    </VizFrame>
  );
}
