import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 노드가 죽은 뒤 RWO 볼륨이 새 노드의 Pod를 따라가기까지의 시계를 그린다.
 * 한 mechanism: 노드 판정(50s) → toleration(300s) → Pod 재생성 → Multi-Attach 대기 → 6분 뒤 forceDetach(노드가 unhealthy일 때만) → attach·stage·publish.
 * 수치는 v1.37.1 기본값(NodeMonitorGracePeriod 50s, DefaultTolerationSeconds 300s, ReconcilerMaxWaitForUnmountDuration 6m)의 합이며 실측이 아니다.
 */
interface Scene {
  label: string;
  t: string;
  pos: number;
  volumeOn: "a" | "a→b" | "b";
  mountedByNode: boolean;
  healthy: boolean;
  podB: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "kubelet 멈춤", t: "t = 0", pos: 0, volumeOn: "a", mountedByNode: true, healthy: true, podB: "—", note: "(가정) worker-a의 kubelet이 멈췄습니다. 10초마다 오던 Lease 갱신이 끊기지만 노드는 아직 Ready로 보이고, 볼륨은 worker-a에 attach·mount된 채입니다." },
  { label: "Ready=Unknown", t: "t ≈ 50 s", pos: 7, volumeOn: "a", mountedByNode: true, healthy: false, podB: "—", note: "NodeMonitorGracePeriod 50초가 지나 node lifecycle 컨트롤러가 Ready를 Unknown으로 바꾸고 unreachable taint를 답니다. 모든 Pod가 기본으로 가진 toleration 300초가 흐르기 시작합니다." },
  { label: "새 Pod · Multi-Attach", t: "t ≈ 350 s", pos: 49, volumeOn: "a", mountedByNode: true, healthy: false, podB: "ContainerCreating", note: "toleration이 끝나 Pod가 삭제되고 컨트롤러가 worker-b에 새 Pod를 만듭니다. A/D 컨트롤러의 desired state는 b인데 actual state는 'a에 attach, 아직 mount 중'이라 detach를 건너뛰고, 새 Pod에는 Multi-Attach 경고가 남습니다. 이 순간 detach 요청 시각이 기록됩니다." },
  { label: "6분 뒤 forceDetach", t: "t ≈ 710 s", pos: 100, volumeOn: "a→b", mountedByNode: true, healthy: false, podB: "ContainerCreating", note: "detach 요청 뒤 6분이 지났고 노드가 unhealthy이므로 forceDetach가 참이 됩니다. '아직 mount 중'이라는 보고를 무시하고 안전 확인 없이 worker-a에서 떼어 냅니다. 노드가 건강했다면 6분이 지나도 이 줄은 실행되지 않습니다." },
  { label: "attach·stage·publish", t: "t ≈ 710 s + α", pos: 100, volumeOn: "b", mountedByNode: true, healthy: false, podB: "Running", note: "worker-b에 VolumeAttachment가 만들어지고 external-attacher가 붙인 뒤 kubelet이 NodeStage·NodePublish를 마치면 Pod가 Running입니다. 노드 장애부터 여기까지 기본값만으로 약 12분이며 드라이버의 attach 시간 α가 더해집니다." },
  { label: "out-of-service 지름길", t: "운영자 개입", pos: 49, volumeOn: "b", mountedByNode: true, healthy: false, podB: "Running", note: "노드가 확실히 꺼졌다고 아는 운영자가 node.kubernetes.io/out-of-service=nodeshutdown:NoExecute taint를 달면 mount 보고를 무시하고 바로 detach합니다. 6분을 기다리지 않는 대신 노드가 살아 있다면 두 노드가 같은 디스크에 쓸 위험을 운영자가 집니다." },
];

const MARKS = [
  { pos: 0, label: "0" },
  { pos: 7, label: "50 s" },
  { pos: 49, label: "350 s" },
  { pos: 100, label: "710 s" },
] as const;

function NodeBox({ name, attached, mounted, healthy, pod }: { name: string; attached: boolean; mounted: boolean; healthy: boolean; pod: string }) {
  return (
    <div className="rounded-lg border px-3 py-2" style={{ borderColor: healthy ? "#16a34a" : "#dc2626" }}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold">{name}</span>
        <span className="text-[11px] font-semibold" style={{ color: healthy ? "#16a34a" : "#dc2626" }}>
          {healthy ? "Ready" : "Unknown"}
        </span>
      </div>
      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 font-mono text-[11px] leading-5">
        <dt className="text-muted-foreground">attached</dt>
        <dd className="font-bold" style={{ color: attached ? "#2563eb" : "#94a3b8" }}>{attached ? "yes" : "no"}</dd>
        <dt className="text-muted-foreground">MountedByNode</dt>
        <dd className="font-bold" style={{ color: mounted ? "#f59e0b" : "#94a3b8" }}>{mounted ? "true (보고 그대로)" : "—"}</dd>
        <dt className="text-muted-foreground">Pod</dt>
        <dd className="font-bold text-foreground">{pod}</dd>
      </dl>
    </div>
  );
}

export default function NodeFailureVolumeClockViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
  const s = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const onA = s.volumeOn === "a" || s.volumeOn === "a→b";
  const onB = s.volumeOn === "b";

  return (
    <VizFrame
      eyebrow="노드 장애와 RWO 볼륨의 시계"
      title="볼륨은 Pod를 바로 따라가지 못하고, 노드가 unhealthy일 때만 6분 뒤 강제로 떼어집니다"
      description="위 막대는 노드 장애 뒤 흐른 시간, 아래 두 상자는 attach-detach 컨트롤러가 보는 두 노드의 상태입니다. MountedByNode는 죽은 노드가 마지막으로 보고한 값이 그대로 남습니다."
      note="50 s·300 s·6 min은 kube-controller-manager·kube-apiserver admission·attach-detach 컨트롤러의 기본값입니다. 합산 시각은 가정이고 실측이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="노드 장애 뒤 볼륨이 옮겨가는 시간선"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="grid">
            {SCENES.map((x, i) => (
              <div key={x.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex flex-wrap items-baseline justify-between gap-2 ${i === scenes.active ? "" : "invisible"}`}>
                <h4 className="text-base font-bold">{x.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{x.t}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-5 h-12">
            <div className="absolute left-0 right-0 top-3 h-1 rounded bg-[#cbd5e1]" />
            <motion.div
              className="absolute left-0 top-3 h-1 rounded bg-[#2563eb]"
              initial={false}
              animate={{ width: `${s.pos}%` }}
              transition={{ duration: reduced ? 0 : 0.4 }}
            />
            {MARKS.map((m) => (
              <div key={m.label} className={`absolute top-0 ${m.pos === 0 ? "" : m.pos === 100 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${m.pos}%` }}>
                <div className="mx-auto h-7 w-px bg-[#94a3b8]" />
                <span className="block whitespace-nowrap text-[10px] font-bold text-muted-foreground">{m.label}</span>
              </div>
            ))}
            <motion.div
              className="absolute top-1 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#2563eb] bg-background"
              initial={false}
              animate={{ left: `${3 + s.pos * 0.94}%` }}
              transition={{ duration: reduced ? 0 : 0.4 }}
            />
          </div>
          <div className="mt-1 grid grid-cols-3 text-[10px] font-semibold text-muted-foreground">
            <span>50 s 판정</span>
            <span className="text-center">300 s toleration</span>
            <span className="text-right">6 min unmount 대기</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <NodeBox name="worker-a (죽은 노드)" attached={onA} mounted={onA && s.mountedByNode} healthy={s.healthy} pod={scenes.active === 0 ? "Running (보고 끊김)" : scenes.active <= 1 ? "Running?" : "삭제됨"} />
            <NodeBox name="worker-b (새 노드)" attached={onB} mounted={onB} healthy pod={s.podB} />
          </div>

<div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((item, i) => (
              <p key={i} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-7 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {item.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((x) => x.label)} />
      </div>
    </VizFrame>
  );
}
