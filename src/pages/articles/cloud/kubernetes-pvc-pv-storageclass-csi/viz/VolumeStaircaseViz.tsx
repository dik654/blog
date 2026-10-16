import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * PVC 하나가 컨테이너의 디렉터리가 되기까지 여섯 계단을 그린다.
 * 한 mechanism: 계단마다 담당 컨트롤러가 다르고, 각 계단은 API 객체 하나(또는 주석 하나)를 바꿔 다음 계단에 신호를 보낸다.
 * CSI 상태 이름(CREATED·NODE_READY·VOL_READY·PUBLISHED)은 container-storage-interface/spec Figure 6, 나머지는 kubernetes v1.37.1 원문 기준이다.
 */
interface Step {
  short: string;
  state: string;
  actor: string;
  signal: string;
}

const STEPS: readonly Step[] = [
  { short: "PVC 생성", state: "PVC Pending", actor: "PV 컨트롤러", signal: "Event: WaitForFirstConsumer" },
  { short: "Pod 스케줄", state: "selected-node 주석", actor: "scheduler · volumebinding", signal: "pvc.annotations[volume.kubernetes.io/selected-node] = worker-c" },
  { short: "CreateVolume", state: "CREATED → PV Bound", actor: "external-provisioner", signal: "PV 생성, claimRef → volumeName 두 번 저장" },
  { short: "ControllerPublish", state: "NODE_READY", actor: "A/D 컨트롤러 · external-attacher", signal: "VolumeAttachment.status.attached = true" },
  { short: "NodeStage", state: "VOL_READY", actor: "kubelet → 노드 플러그인", signal: "…/csi/pv-hash/globalmount 에 mkfs·mount (노드당 1회)" },
  { short: "NodePublish", state: "PUBLISHED → Pod Running", actor: "kubelet → 노드 플러그인", signal: "…/pods/<uid>/volumes/kubernetes.io~csi/<pv>/mount 에 bind mount" },
];

const NOTES: readonly string[] = [
  "(가정) StorageClass fast(WaitForFirstConsumer)로 20Gi PVC를 만들었습니다. 맞는 PV가 없고 아직 쓰는 Pod도 없으므로 PV 컨트롤러는 Normal 이벤트 WaitForFirstConsumer만 남깁니다. 이 Pending은 오류가 아닙니다.",
  "PVC를 쓰는 Pod가 생기자 스케줄러가 메모리·affinity를 보고 존 c의 worker-c를 고르고, 묶이지 않은 PVC에 선택한 노드를 주석으로 적습니다. spec.nodeName으로 스케줄러를 건너뛰면 이 주석이 생기지 않아 PVC가 영원히 Pending입니다.",
  "external-provisioner가 주석을 보고 존 c에 디스크를 만들라고 CSI CreateVolume을 호출한 뒤 PV 객체를 만듭니다. PV 컨트롤러가 PV.spec.claimRef와 PVC.spec.volumeName을 차례로 저장하면 둘 다 Bound입니다.",
  "Pod가 worker-c에 묶이자 attach-detach 컨트롤러가 VolumeAttachment 객체를 만들고 external-attacher가 ControllerPublishVolume으로 디스크를 그 노드에 붙입니다. 아직 파일시스템은 없습니다.",
  "worker-c의 kubelet이 노드 플러그인에 NodeStageVolume을 요청합니다. 디스크를 포맷하고 노드 전역 staging 경로에 한 번 마운트합니다. 같은 노드의 다른 Pod가 같은 PV를 써도 이 계단은 다시 밟지 않습니다.",
  "kubelet이 Pod마다 NodePublishVolume을 요청해 staging 경로를 Pod의 volumes 디렉터리에 bind mount합니다. 컨테이너가 파일을 쓰기 시작하는 순간이고, 여기서 실패하면 FailedMount 이벤트가 남습니다.",
];

export default function VolumeStaircaseViz() {
  const scenes = useAnimatedScenes(STEPS.length, 4200);
  const active = scenes.active;
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="PVC → 컨테이너 디렉터리"
      title="PVC는 여섯 계단을 거쳐 Pod의 디렉터리가 되고, 계단마다 담당자가 다릅니다"
      description="왼쪽 번호는 계단, 가운데는 그 계단이 끝났을 때의 상태, 오른쪽은 담당 컨트롤러와 API에 남는 신호입니다. 파란 계단이 지금 진행 중인 단계입니다."
      note="(가정) 존 세 개 클러스터, 20Gi RWO PVC, WaitForFirstConsumer StorageClass. 경로 문자열은 kubelet 기본 루트 /var/lib/kubelet 아래의 형태를 줄여 적었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="PVC가 마운트되기까지의 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.2rem] flex-wrap items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">
              {active + 1}. {STEPS[active].short}
            </h4>
            <span className="font-mono text-xs font-bold text-primary sm:text-sm">{STEPS[active].state}</span>
          </div>

          <ol className="mt-3 space-y-1.5" aria-label="단계 목록">
            {STEPS.map((step, i) => {
              const done = i < active;
              const now = i === active;
              return (
                <motion.li
                  key={step.short}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-x-2 rounded-md border px-2 py-1.5 sm:grid-cols-[1.75rem_minmax(0,11rem)_minmax(0,1fr)] sm:gap-x-3"
                  initial={false}
                  animate={{
                    borderColor: now ? "#2563eb" : done ? "#16a34a" : "#cbd5e1",
                    backgroundColor: now ? "rgba(37,99,235,0.08)" : "rgba(0,0,0,0)",
                  }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black"
                    style={{
                      backgroundColor: now ? "#2563eb" : done ? "#16a34a" : "transparent",
                      color: now || done ? "#ffffff" : "#64748b",
                      border: now || done ? "none" : "1px solid #cbd5e1",
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold leading-6 ${now ? "text-foreground" : done ? "text-foreground/80" : "text-muted-foreground"}`}>{step.state}</p>
                    <p className="text-[11px] leading-5 text-muted-foreground sm:hidden">{step.actor}</p>
                  </div>
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <p className="hidden text-xs font-semibold leading-5 text-muted-foreground sm:block">{step.actor}</p>
                    <p className={`break-all font-mono text-[11px] leading-5 ${now ? "text-primary" : "text-muted-foreground/80"}`}>{step.signal}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[5.25rem]">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={STEPS.map((s) => s.short)} />
      </div>
    </VizFrame>
  );
}
