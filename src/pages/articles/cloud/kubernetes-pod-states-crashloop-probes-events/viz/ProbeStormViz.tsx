import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * (가정) replica 3개가 같은 DB를 liveness probe로 확인할 때 DB가 30초 멈추면 어떻게 되는지 그린다.
 * 한 mechanism: liveness 실패 3회(기본 period 10s · failureThreshold 3)는 "재시작"이고,
 * 재시작 중 readiness가 false라 EndpointSlice에서 모두 빠져 서비스 전체가 비며, 복구 뒤에도 backoff가 회복을 늦춘다.
 * 비교 장면은 같은 확인을 readiness에만 두었을 때다.
 */
type PodState = "ready" | "probing" | "restarting" | "backoff" | "notready";

interface Scene {
  label: string;
  pods: readonly [PodState, PodState, PodState];
  endpoints: number;
  db: "up" | "down";
  kind: "liveness" | "readiness";
  tick: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "평소 · DB 정상", pods: ["ready", "ready", "ready"], endpoints: 3, db: "up", kind: "liveness", tick: "t = 0s", note: "replica 세 개가 모두 Ready이고 EndpointSlice에 세 주소가 있습니다. liveness probe는 /healthz에서 DB 연결까지 확인합니다. (가정)" },
  { label: "DB 30초 멈춤 · 실패 3회", pods: ["probing", "probing", "probing"], endpoints: 3, db: "down", kind: "liveness", tick: "t = 0~30s", note: "DB가 멈추자 세 Pod의 /healthz가 모두 1초 timeout을 넘깁니다. 10초마다 한 번씩 세 번 연속 실패하면 failureThreshold 3에 닿습니다. 아직은 endpoint에 남아 있어 요청은 DB 오류로 실패합니다." },
  { label: "세 Pod 동시 재시작", pods: ["restarting", "restarting", "restarting"], endpoints: 0, db: "down", kind: "liveness", tick: "t ≈ 30s", note: "kubelet이 세 컨테이너를 모두 죽이고 다시 띄웁니다. 재시작 중에는 readiness가 성공할 수 없어 세 주소가 EndpointSlice에서 빠지고 Service는 보낼 곳이 없어 전부 5xx가 됩니다. DB 장애가 서비스 전체 장애로 바뀐 순간입니다." },
  { label: "DB 복구 · backoff가 남음", pods: ["backoff", "backoff", "ready"], endpoints: 1, db: "up", kind: "liveness", tick: "t ≈ 60s", note: "DB가 돌아왔지만 재시작 뒤에도 DB가 없던 동안 다시 죽은 컨테이너는 10초, 20초 backoff를 기다립니다. 복구는 DB가 돌아온 순간이 아니라 backoff가 끝난 순간부터 replica 하나씩 돌아옵니다." },
  { label: "비교 · readiness에만 두면", pods: ["notready", "notready", "notready"], endpoints: 0, db: "down", kind: "readiness", tick: "DB 멈춤 중", note: "같은 확인을 readiness에만 두면 DB가 멈춘 동안 세 Pod가 endpoint에서 빠질 뿐 재시작은 없습니다. DB가 돌아오면 다음 probe 한 번(최대 10초)에 세 주소가 모두 돌아옵니다. liveness는 프로세스 자체의 교착만 보게 둡니다." },
];

const STATE_LABEL: Record<PodState, string> = {
  ready: "Ready",
  probing: "probe 실패 중",
  restarting: "재시작",
  backoff: "back-off",
  notready: "NotReady",
};
const STATE_FILL: Record<PodState, string> = {
  ready: "#16a34a",
  probing: "#f59e0b",
  restarting: "#b91c1c",
  backoff: "#b45309",
  notready: "#64748b",
};

export default function ProbeStormViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const dur = reduced ? 0 : 0.35;

  return (
    <VizFrame
      eyebrow="Probe storm"
      title="liveness가 공용 의존성을 보면 의존성 장애가 전 replica 재시작으로 증폭됩니다"
      description="왼쪽은 DB, 가운데는 replica 세 개, 오른쪽은 Service가 보낼 수 있는 EndpointSlice 주소 수입니다."
      note="replica 3개·DB 30초 장애는 가정이고, 10초 주기·실패 3회·timeout 1초는 probe 기본값, 10·20초는 CrashLoopBackOff 시작 대기입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="DB 장애가 probe를 거쳐 서비스 장애로 번지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="grid">
            {SCENES.map((s, i) => (
              <div key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex flex-wrap items-baseline justify-between gap-2 ${i === scenes.active ? "" : "invisible"}`}>
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{s.tick}</span>
              </div>
            ))}
          </div>

          <svg viewBox="0 0 480 150" className="mt-3 h-auto w-full" role="img" aria-label={`DB ${scene.db}, endpoint ${scene.endpoints}개`}>
            {/* DB */}
            <motion.rect x={16} y={48} width={72} height={54} rx={6} initial={false} animate={{ fill: scene.db === "up" ? "#dcfce7" : "#fee2e2", stroke: scene.db === "up" ? "#16a34a" : "#b91c1c" }} transition={{ duration: dur }} />
            <text x={52} y={70} fontSize={11} fontWeight={700} textAnchor="middle" className="fill-foreground">DB</text>
            <text x={52} y={88} fontSize={10} fontWeight={700} textAnchor="middle" fill={scene.db === "up" ? "#166534" : "#991b1b"}>
              {scene.db === "up" ? "정상" : "멈춤"}
            </text>
            {/* probe 화살표 */}
            {scene.pods.map((_, i) => (
              <line key={i} x1={88} y1={75} x2={150} y2={30 + i * 44} stroke={scene.db === "up" ? "#94a3b8" : "#f59e0b"} strokeWidth={1} strokeDasharray={scene.db === "up" ? undefined : "3 2"} />
            ))}
            <text x={118} y={140} fontSize={9} textAnchor="middle" className="fill-muted-foreground">
              {scene.kind === "liveness" ? "livenessProbe → DB" : "readinessProbe → DB"}
            </text>
            {/* pods */}
            {scene.pods.map((state, i) => (
              <g key={i}>
                <motion.rect x={150} y={14 + i * 44} width={170} height={32} rx={6} initial={false} animate={{ fill: STATE_FILL[state] }} transition={{ duration: dur }} />
                <text x={162} y={34 + i * 44} fontSize={11} fontWeight={700} fill="#ffffff">
                  pod-{i + 1}
                </text>
                <text x={308} y={34 + i * 44} fontSize={11} fontWeight={700} fill="#ffffff" textAnchor="end">
                  {STATE_LABEL[state]}
                </text>
                {/* endpoint 선 */}
                <motion.line x1={320} y1={30 + i * 44} x2={380} y2={75} stroke="#2563eb" strokeWidth={1.5} initial={false} animate={{ opacity: state === "ready" ? 1 : 0.12 }} transition={{ duration: dur }} />
              </g>
            ))}
            {/* endpoints */}
            <rect x={380} y={48} width={84} height={54} rx={6} className="fill-background" stroke="#2563eb" />
            <text x={422} y={68} fontSize={10} fontWeight={700} textAnchor="middle" className="fill-muted-foreground">EndpointSlice</text>
            <motion.text x={422} y={92} fontSize={16} fontWeight={800} textAnchor="middle" initial={false} animate={{ fill: scene.endpoints === 0 ? "#b91c1c" : "#1d4ed8" }} transition={{ duration: dur }}>
              {scene.endpoints} / 3
            </motion.text>
          </svg>

<div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((item, i) => (
              <p key={i} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-7 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {item.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
