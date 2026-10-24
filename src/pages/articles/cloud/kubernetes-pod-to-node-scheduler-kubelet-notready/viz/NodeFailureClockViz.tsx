import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * worker-2의 kubelet이 t=0에 멈춘 뒤 Pod가 다른 노드에서 다시 뜨기까지의 시계를 그린다.
 * 한 mechanism: 아무도 "노드가 죽었다"는 신호를 보내지 않는다. 10초마다 오던 Lease 갱신이 멈추고,
 * 컨트롤러가 마지막 갱신 + 50초를 넘긴 것을 보고 Unknown을 적고, Pod의 300초 toleration이 끝나야 삭제가 시작된다.
 * 숫자는 kubelet defaults.go(40s·0.25), nodelifecycle defaults.go(50s·5s), defaulttolerationseconds admission.go(300s)의 기본값이다.
 *
 * 장면마다 길이가 다른 라벨·칩·설명은 모두 같은 grid 셀에 겹쳐 그리고 비활성은 invisible로 둔다.
 * 그래서 가장 긴 장면이 높이를 정하고, 장면을 넘겨도 figure 높이와 버튼 위치가 움직이지 않는다.
 */
interface Scene {
  label: string;
  t: number;
  lease: "fresh" | "stale" | "expired";
  ready: "True" | "Unknown";
  taint: boolean;
  pod: "running" | "tolerating" | "deleting" | "replaced";
  note: string;
}

const T_END = 400;

const SCENES: readonly Scene[] = [
  { label: "t = −10 s 평소", t: -10, lease: "fresh", ready: "True", taint: false, pod: "running", note: "worker-2의 kubelet은 10초마다 kube-node-lease/worker-2 Lease의 renewTime을 갱신하고, Node.status는 바뀐 것이 없으면 5분에 한 번만 씁니다. 컨트롤러는 5초마다 모든 노드를 훑으며 Lease 갱신이 보이면 probe 시각을 지금으로 당깁니다." },
  { label: "t = 0 kubelet 정지", t: 0, lease: "fresh", ready: "True", taint: false, pod: "running", note: "전원이 꺼졌습니다. 마지막 Lease 갱신은 t = 0 직전입니다. 아무 객체도 바뀌지 않았으므로 API server도 컨트롤러도 아직 아무것도 모릅니다. Pod는 Running으로 보입니다." },
  { label: "t = 30 s 갱신 3회 누락", t: 30, lease: "stale", ready: "True", taint: false, pod: "running", note: "10·20·30초에 와야 할 갱신이 오지 않았습니다. Lease 기간은 40초라 아직 만료 전이고, 컨트롤러의 판정 기준은 Lease 만료가 아니라 probe 시각 + 50초입니다. 여전히 Ready=True입니다." },
  { label: "t ≈ 50–55 s Unknown", t: 52, lease: "expired", ready: "Unknown", taint: true, pod: "tolerating", note: "probe 시각 + 50초를 넘긴 뒤 첫 5초 검사에서 컨트롤러가 Ready·MemoryPressure·DiskPressure·PIDPressure를 Unknown으로 바꾸고 node.kubernetes.io/unreachable:NoExecute taint를 붙입니다. 이때부터 Pod의 toleration 300초가 흐릅니다." },
  { label: "t = 200 s 기다리는 중", t: 200, lease: "expired", ready: "Unknown", taint: true, pod: "tolerating", note: "Pod는 kubectl get pods에 아직 Running으로 보입니다. 상태를 보고할 kubelet이 없어 마지막 보고가 남아 있을 뿐입니다. 이 구간에서 Service가 트래픽을 보내는지는 readiness와 EndpointSlice가 정합니다." },
  { label: "t ≈ 350–355 s 삭제 시작", t: 352, lease: "expired", ready: "Unknown", taint: true, pod: "deleting", note: "toleration 300초가 끝나 taint eviction 컨트롤러가 Pod 삭제를 요청합니다. 삭제는 deletionTimestamp를 적는 것이고, 컨테이너를 실제로 멈출 kubelet이 없으므로 Pod는 Terminating에 머뭅니다." },
  { label: "t ≈ 360 s 다른 노드에서", t: 365, lease: "expired", ready: "Unknown", taint: true, pod: "replaced", note: "ReplicaSet은 Terminating Pod를 활성으로 세지 않으므로 차이 −1로 새 Pod를 만들고, scheduler는 unreachable:NoSchedule taint가 함께 붙은 worker-2를 걸러 worker-1에 바인딩합니다. 옮긴 것이 아니라 새 Pod입니다. 옛 Pod는 노드가 돌아오거나 강제 삭제될 때까지 Terminating으로 남습니다." },
];

const MARKS = [
  { t: 0, label: "0" },
  { t: 50, label: "50 s" },
  { t: 350, label: "350 s" },
] as const;

const pct = (t: number) => `${((Math.max(t, -12) + 12) / (T_END + 12)) * 100}%`;
const leaseAgeOf = (s: Scene) => Math.max(0, s.t);
const tolerationLeftOf = (s: Scene) => (s.taint ? Math.max(0, 352 - s.t) : null);

/** 모든 장면의 내용을 같은 셀에 겹쳐 두고 활성 장면만 보이게 한다. 높이는 가장 긴 장면이 정한다. */
function Stack({ active, className, render }: { active: number; className?: string; render: (scene: Scene, index: number) => ReactNode }) {
  return (
    <div className={`grid ${className ?? ""}`}>
      {SCENES.map((s, i) => (
        <div key={s.label} aria-hidden={i !== active} className={`col-start-1 row-start-1 min-w-0 ${i === active ? "" : "invisible"}`}>
          {render(s, i)}
        </div>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.2rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
      <span className="text-[11px] font-bold text-muted-foreground">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Chip({ text, bg, fg, border }: { text: string; bg: string; fg: string; border: string }) {
  return (
    <span className="inline-block rounded-sm border px-2 py-0.5 font-mono text-[11px] font-bold" style={{ backgroundColor: bg, color: fg, borderColor: border }}>
      {text}
    </span>
  );
}

function LeaseChip({ scene }: { scene: Scene }) {
  if (scene.lease === "fresh") return <Chip text="renewTime 갱신됨 · 10 s마다" bg="#dcfce7" fg="#166534" border="#16a34a" />;
  if (scene.lease === "stale") return <Chip text={`갱신 누락 ${Math.floor(leaseAgeOf(scene) / 10)}회 · 아직 유효`} bg="#fef3c7" fg="#92400e" border="#f59e0b" />;
  return <Chip text="갱신 없음 · probe + 50 s 초과" bg="#fee2e2" fg="#991b1b" border="#dc2626" />;
}

function ReadyChips({ scene }: { scene: Scene }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {scene.ready === "True" ? (
        <Chip text="Ready=True" bg="#dcfce7" fg="#166534" border="#16a34a" />
      ) : (
        <Chip text="Ready=Unknown · NodeStatusUnknown" bg="#fee2e2" fg="#991b1b" border="#dc2626" />
      )}
      {scene.taint ? <Chip text="taint unreachable:NoExecute" bg="#ede9fe" fg="#5b21b6" border="#7c3aed" /> : null}
    </div>
  );
}

function PodChips({ scene }: { scene: Scene }) {
  if (scene.pod === "running") return <Chip text="Running on worker-2" bg="#dbeafe" fg="#1e3a8a" border="#2563eb" />;
  if (scene.pod === "tolerating") return <Chip text="Running(표시) · toleration 300 s 소모 중" bg="#fef3c7" fg="#92400e" border="#f59e0b" />;
  if (scene.pod === "deleting") return <Chip text="Terminating · deletionTimestamp 기록" bg="#fee2e2" fg="#991b1b" border="#dc2626" />;
  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip text="web-x Terminating (남음)" bg="#f1f5f9" fg="#475569" border="#94a3b8" />
      <Chip text="web-y Running on worker-1" bg="#dcfce7" fg="#166534" border="#16a34a" />
    </div>
  );
}

export default function NodeFailureClockViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800, { loop: false });
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Node failure clock · worker-2"
      title="노드가 죽어도 신호는 없고, 50초 + 300초 뒤에야 Pod 삭제가 시작됩니다"
      description="가로축은 kubelet이 멈춘 뒤 흐른 시간입니다. 첫 줄은 Lease 갱신, 둘째 줄은 컨트롤러가 적는 Ready 조건과 taint, 셋째 줄은 Pod입니다. 세 줄 모두 누군가 보낸 알림이 아니라 '마지막 갱신 뒤 얼마나 지났나'로만 바뀝니다."
      note="Lease 40초·갱신 10초, NodeMonitorGracePeriod 50초·검사 5초, 기본 toleration 300초는 v1.37.1 기본값입니다. 검사 주기 때문에 실제 전환은 50~55초, 350~355초 사이 어딘가입니다. 실측이 아니라 기본값의 합입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="노드 장애 뒤 Lease·Ready 조건·Pod가 바뀌는 시각"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <Stack
            active={active}
            render={(s) => (
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className="font-mono text-xs font-bold text-primary sm:text-sm">
                  마지막 Lease 갱신 뒤 {leaseAgeOf(s)}s{tolerationLeftOf(s) !== null ? ` · toleration 남은 ${tolerationLeftOf(s)}s` : ""}
                </span>
              </div>
            )}
          />

          {/* 시간축 */}
          <div className="relative mt-3 h-9">
            <div className="absolute inset-x-0 top-3 h-1 rounded bg-border" />
            <div className="absolute top-3 h-1 rounded" style={{ left: pct(50), width: `calc(${pct(350)} - ${pct(50)})`, backgroundColor: "#fde68a" }} />
            {MARKS.map((m) => (
              <div key={m.t} className="absolute top-0 -translate-x-1/2" style={{ left: pct(m.t) }}>
                <div className="mx-auto h-3 w-px bg-foreground/60" />
                <div className="mt-1 whitespace-nowrap font-mono text-[10px] text-muted-foreground">{m.label}</div>
              </div>
            ))}
            <motion.div
              className="absolute top-1 h-5 w-5 -translate-x-1/2 rounded-full border-2 bg-background"
              style={{ borderColor: "#2563eb" }}
              initial={false}
              animate={{ left: pct(scene.t) }}
              transition={{ duration: reduced ? 0 : 0.5 }}
              aria-hidden
            />
          </div>

          <div className="mt-2 space-y-2 border-y border-border py-2">
            <Row label="Lease (40 s)">
              <Stack active={active} render={(s) => <LeaseChip scene={s} />} />
            </Row>
            <Row label="Node Ready">
              <Stack active={active} render={(s) => <ReadyChips scene={s} />} />
            </Row>
            <Row label="Pod web-x">
              <Stack active={active} render={(s) => <PodChips scene={s} />} />
            </Row>
          </div>

          <Stack
            active={active}
            className="mt-3"
            render={(s) => <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{s.note}</p>}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
