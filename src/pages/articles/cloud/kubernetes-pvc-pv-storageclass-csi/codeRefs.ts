import type { CodeRef } from "@/components/code/types";
import pvControllerGo from "./codebase/kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go?raw";
import adcGo from "./codebase/kubernetes/pkg/controller/volume/attachdetach/attach_detach_controller.go?raw";
import adcReconcilerGo from "./codebase/kubernetes/pkg/controller/volume/attachdetach/reconciler/reconciler.go?raw";
import binderGo from "./codebase/kubernetes/pkg/scheduler/framework/plugins/volumebinding/binder.go?raw";
import coreDefaultsGo from "./codebase/kubernetes/pkg/apis/core/v1/defaults.go?raw";
import csiAttacherGo from "./codebase/kubernetes/pkg/volume/csi/csi_attacher.go?raw";
import csiMounterGo from "./codebase/kubernetes/pkg/volume/csi/csi_mounter.go?raw";
import csiSpecMd from "./codebase/csi-spec/spec.md?raw";

export const codeRefs: Record<string, CodeRef> = {
  "pv-bind-design": {
    path: "kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go",
    highlight: [97, 123],
    desc: "PV 컨트롤러 설계 주석입니다. PVC와 PV는 서로를 가리키는 두 포인터(pvc.spec.volumeName, pv.spec.claimRef)로 묶이고, 트랜잭션이 없는 API에서 두 번에 나눠 저장합니다.",
    annotations: [
      { lines: [99, 105], color: "sky", note: "양방향 포인터를 두는 이유가 적혀 있습니다. 한쪽만 기록하면 HA 컨트롤러 두 개가 같은 PV를 두 PVC에 묶어 데이터를 잃을 수 있기 때문입니다." },
      { lines: [117, 122], color: "amber", note: "바인딩은 두 단계입니다. PV.spec.claimRef를 먼저, PVC.spec.volumeName을 나중에 씁니다. 중간에 어느 쪽이 지워지거나 바뀌어도 다음 sync에서 복구해야 합니다." },
    ],
    code: pvControllerGo,
    lang: "go",
  },
  "pv-sync-unbound": {
    path: "kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go",
    highlight: [336, 397],
    desc: "아직 묶이지 않은 PVC 하나를 처리하는 본체입니다. 맞는 PV를 찾고, 없으면 기본 StorageClass를 채우고, WaitForFirstConsumer면 기다리고, 클래스가 있으면 프로비저닝하고, 아무것도 없으면 FailedBinding 이벤트를 남깁니다.",
    annotations: [
      { lines: [338, 338], color: "sky", note: "StorageClass의 volumeBindingMode가 WaitForFirstConsumer인지 먼저 확인합니다. 이 값이 아래 switch의 첫 갈래를 정합니다." },
      { lines: [344, 344], color: "sky", note: "이미 있는 Available PV 가운데 용량·접근 모드·클래스가 맞는 것을 찾습니다. 3절의 사례에서 Immediate 모드는 여기서 바로 묶입니다." },
      { lines: [354, 363], color: "emerald", note: "PV가 없으면 기본 StorageClass를 PVC에 채워 넣고 sync를 다시 시작합니다. storageClassName을 비워 둔 PVC가 나중에 생긴 기본 클래스를 받는 경로입니다." },
      { lines: [366, 370], color: "amber", note: "WaitForFirstConsumer이고 아직 Pod가 스케줄되지 않았으면 Normal 이벤트 WaitForFirstConsumer만 남깁니다. 이 Pending은 정상입니다." },
      { lines: [371, 380], color: "violet", note: "클래스가 있으면 provisionClaim이 비동기 프로비저닝을 시작합니다. 묶는 일은 다음 sync에서 이어집니다." },
      { lines: [381, 382], color: "rose", note: "PV도 없고 클래스도 없으면 'no persistent volumes available for this claim and no storage class is set'입니다. 기본 클래스가 없는 클러스터에서 가장 흔한 Pending 원인입니다." },
      { lines: [393, 397], color: "emerald", note: "PV를 찾았으면 bind로 넘어갑니다. 저장 중 하나라도 실패하면 다음 syncClaim이 이어서 끝냅니다." },
    ],
    code: pvControllerGo,
    lang: "go",
  },
  "pv-wffc-event": {
    path: "kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go",
    highlight: [305, 329],
    desc: "WaitForFirstConsumer PVC가 기다리는 동안 남기는 이벤트 문구입니다. kubectl describe pvc에서 보는 'waiting for first consumer to be created before binding'이 여기서 나옵니다.",
    annotations: [
      { lines: [308, 309], color: "sky", note: "쓰는 Pod가 아직 없을 때의 기본 문구입니다." },
      { lines: [313, 324], color: "amber", note: "PVC를 쓰는 Pod가 있지만 아직 스케줄되지 않았으면 WaitForPodScheduled로 바뀝니다. Pod가 Pending인 다른 이유(자원 부족 등)를 먼저 봐야 한다는 신호입니다." },
    ],
    code: pvControllerGo,
    lang: "go",
  },
  "pv-bind": {
    path: "kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go",
    highlight: [1095, 1133],
    desc: "PV와 PVC를 묶는 네 번의 저장입니다. 각 저장이 실패하면 함수가 돌아가고 다음 sync가 남은 단계를 이어서 합니다.",
    annotations: [
      { lines: [1105, 1109], color: "sky", note: "1단계: PV.spec.claimRef에 PVC의 이름·namespace·UID를 씁니다. 설계 주석의 '첫 포인터'입니다." },
      { lines: [1111, 1115], color: "emerald", note: "2단계: PV phase를 Bound로 바꿉니다." },
      { lines: [1117, 1121], color: "amber", note: "3단계: PVC.spec.volumeName에 PV 이름을 쓰고 bind-completed 주석을 답니다. '둘째 포인터'입니다." },
      { lines: [1123, 1127], color: "violet", note: "4단계: PVC status.phase를 Bound로 바꿉니다. kubectl get pvc의 STATUS 열이 여기서 바뀝니다." },
    ],
    code: pvControllerGo,
    lang: "go",
  },
  "pv-released": {
    path: "kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go",
    highlight: [665, 690],
    desc: "PV가 가리키는 PVC가 사라졌을 때의 처리입니다. phase를 Released로 바꾸고 reclaimPolicy를 실행합니다.",
    annotations: [
      { lines: [672, 681], color: "amber", note: "Released로 바꾸는 것은 phase 한 줄뿐입니다. 데이터는 아직 그대로 있고 다른 PVC가 이 PV를 받을 수 없습니다." },
      { lines: [682, 686], color: "rose", note: "그다음 reclaimVolume이 Retain이면 아무것도 하지 않고 Delete면 삭제를 예약합니다. 9절에서 이어집니다." },
    ],
    code: pvControllerGo,
    lang: "go",
  },
  "pv-reclaim-policy": {
    path: "kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go",
    highlight: [1181, 1222],
    desc: "reclaimPolicy 세 갈래입니다. Retain은 로그 한 줄, Delete는 백엔드 디스크 삭제 작업 예약, 알 수 없는 값은 Failed입니다.",
    annotations: [
      { lines: [1189, 1190], color: "sky", note: "Retain: 'nothing to do'. PV는 Released 상태로 남고 디스크와 데이터도 그대로입니다. 관리자가 PV를 지우고 다시 만들어야 재사용할 수 있습니다." },
      { lines: [1200, 1215], color: "rose", note: "Delete: deleteVolumeOperation이 CSI DeleteVolume을 통해 실제 디스크를 지웁니다. 동적으로 만든 PV의 기본값이 이쪽이라 PVC를 지우면 데이터도 사라집니다." },
    ],
    code: pvControllerGo,
    lang: "go",
  },
  "pv-default-retain": {
    path: "kubernetes/pkg/apis/core/v1/defaults.go",
    highlight: [324, 334],
    desc: "직접 만든 PV 객체의 기본값입니다. reclaimPolicy를 비우면 Retain, volumeMode를 비우면 Filesystem입니다.",
    annotations: [
      { lines: [328, 330], color: "sky", note: "수동 PV는 Retain이 기본입니다. StorageClass가 만든 PV는 반대로 클래스의 reclaimPolicy(미지정 시 Delete)를 따릅니다. 같은 'PV'인데 기본값이 다른 이유는 만든 주체가 다르기 때문입니다." },
    ],
    code: coreDefaultsGo,
    lang: "go",
  },
  "sched-volume-reasons": {
    path: "kubernetes/pkg/scheduler/framework/plugins/volumebinding/binder.go",
    highlight: [63, 70],
    desc: "스케줄러 volumebinding 플러그인이 노드를 거를 때 쓰는 네 가지 이유 문자열입니다. Pod Pending 이벤트의 '0/3 nodes are available: 3 node(s) …' 뒤에 그대로 붙습니다.",
    annotations: [
      { lines: [64, 64], color: "amber", note: "묶이지 않은 PVC에 맞는 PV를 그 노드에서 찾지 못했을 때입니다." },
      { lines: [66, 66], color: "rose", note: "이미 묶인 PV의 nodeAffinity가 그 노드와 맞지 않을 때입니다. 3절의 사례(존 a 디스크, 존 c 노드)가 이 문구를 냅니다." },
    ],
    code: binderGo,
    lang: "go",
  },
  "sched-find-pod-volumes": {
    path: "kubernetes/pkg/scheduler/framework/plugins/volumebinding/binder.go",
    highlight: [283, 312],
    desc: "노드 하나에 대해 Pod의 모든 PVC를 검사하는 입구입니다. 네 가지 불리언이 실패 이유 문자열로 바뀝니다.",
    annotations: [
      { lines: [292, 295], color: "sky", note: "볼륨이 없는 Pod는 모두 true로 시작해 통과합니다." },
      { lines: [297, 308], color: "amber", note: "묶인 PV의 nodeAffinity 불일치, 묶이지 않은 PVC에 맞는 PV 없음, 용량 부족, PV 없음 순으로 이유를 모읍니다." },
    ],
    code: binderGo,
    lang: "go",
  },
  "sched-assume-selected-node": {
    path: "kubernetes/pkg/scheduler/framework/plugins/volumebinding/binder.go",
    highlight: [404, 457],
    desc: "스케줄러가 노드를 고른 뒤 PVC에 선택한 노드를 기록하는 곳입니다. WaitForFirstConsumer가 '노드를 알고 디스크를 만들' 수 있는 이유가 이 주석 한 줄입니다.",
    annotations: [
      { lines: [412, 415], color: "sky", note: "모든 PVC가 이미 묶여 있으면 할 일이 없습니다." },
      { lines: [445, 457], color: "amber", note: "동적 프로비저닝 대상 PVC마다 volume.kubernetes.io/selected-node 주석에 노드 이름을 씁니다. external-provisioner는 이 주석을 보고 그 노드의 존에 디스크를 만듭니다. spec.nodeName으로 스케줄러를 건너뛰면 이 줄이 실행되지 않아 PVC가 영원히 Pending입니다." },
    ],
    code: binderGo,
    lang: "go",
  },
  "csi-attach-va": {
    path: "kubernetes/pkg/volume/csi/csi_attacher.go",
    highlight: [63, 139],
    desc: "attach-detach 컨트롤러 쪽 CSI 플러그인의 Attach입니다. 드라이버를 직접 부르지 않고 VolumeAttachment 객체를 만들어 external-attacher sidecar가 ControllerPublishVolume을 호출하게 합니다.",
    annotations: [
      { lines: [64, 67], color: "rose", note: "kubelet에서는 attach를 할 수 없습니다. attach는 컨트롤 플레인의 일입니다." },
      { lines: [79, 80], color: "sky", note: "VolumeAttachment 이름은 volumeHandle·드라이버·노드 이름의 해시입니다. 같은 볼륨을 다른 노드에 붙이려면 다른 객체가 필요합니다." },
      { lines: [107, 118], color: "amber", note: "VolumeAttachment{nodeName, attacher: 드라이버, source: PV 이름}을 API에 만듭니다. kubectl get volumeattachment로 보이는 객체입니다." },
      { lines: [131, 133], color: "violet", note: "external-attacher가 status.attached를 true로 바꿀 때까지 기다립니다. 드라이버 쪽 attach가 느리면 여기서 시간이 갑니다." },
    ],
    code: csiAttacherGo,
    lang: "go",
  },
  "csi-node-stage": {
    path: "kubernetes/pkg/volume/csi/csi_attacher.go",
    highlight: [264, 410],
    desc: "kubelet이 노드 플러그인에 NodeStageVolume을 요청하는 MountDevice입니다. 노드당 한 번, 전역 staging 경로에 포맷·마운트합니다.",
    annotations: [
      { lines: [295, 299], color: "sky", note: "드라이버가 STAGE_UNSTAGE_VOLUME 능력을 광고하는지 먼저 묻습니다. 없으면 stage 단계를 건너뛰고 바로 publish합니다." },
      { lines: [387, 397], color: "amber", note: "volumeHandle, publishContext(attach 결과), deviceMountPath(staging 경로), fsType, accessMode, 비밀, mountOptions를 넘깁니다. 드라이버는 여기서 블록 장치를 포맷하고 staging 경로에 마운트합니다." },
      { lines: [399, 406], color: "rose", note: "실패가 '끝난' 오류면 staging 디렉터리를 치웁니다. FailedMount 이벤트의 MountVolume.MountDevice failed 문구가 이 경로입니다." },
    ],
    code: csiAttacherGo,
    lang: "go",
  },
  "csi-node-publish": {
    path: "kubernetes/pkg/volume/csi/csi_mounter.go",
    highlight: [103, 330],
    desc: "kubelet이 Pod 하나의 볼륨 경로에 NodePublishVolume을 요청하는 SetUpAt입니다. staging 경로를 Pod의 volumes 디렉터리에 bind mount합니다.",
    annotations: [
      { lines: [301, 314], color: "amber", note: "deviceMountPath(staging)에서 dir(Pod별 target_path)로 publish합니다. 같은 노드의 Pod 두 개가 같은 PV를 쓰면 stage는 한 번, publish는 두 번입니다. RWO가 '노드 단위'인 이유가 이 구조에 있습니다." },
      { lines: [316, 325], color: "rose", note: "실패 시 mount 디렉터리를 지우되, 재마운트(requiresRepublish) 중이면 지우지 않습니다. 지우면 Pod가 보던 bind mount가 깨지기 때문입니다." },
    ],
    code: csiMounterGo,
    lang: "go",
  },
  "csi-spec-lifecycle": {
    path: "csi-spec/spec.md",
    highlight: [186, 212],
    desc: "CSI 명세의 Figure 6입니다. 동적으로 만든 볼륨이 CREATED → NODE_READY → VOL_READY → PUBLISHED를 거치고 해제는 역순입니다.",
    annotations: [
      { lines: [187, 192], color: "sky", note: "CreateVolume으로 CREATED. 컨트롤러 플러그인(external-provisioner가 호출)의 일입니다." },
      { lines: [193, 199], color: "emerald", note: "ControllerPublishVolume으로 NODE_READY. 디스크가 노드에 '붙은' 상태이고 아직 파일시스템은 없습니다." },
      { lines: [200, 205], color: "amber", note: "NodeStageVolume으로 VOL_READY. 노드당 한 번, 전역 staging 경로에 마운트합니다." },
      { lines: [206, 208], color: "violet", note: "NodePublishVolume으로 PUBLISHED. Pod마다 target_path에 bind mount합니다. 컨테이너가 파일을 쓰는 시점은 여기부터입니다." },
    ],
    code: csiSpecMd,
    lang: "python",
  },
  "adc-six-minutes": {
    path: "kubernetes/pkg/controller/volume/attachdetach/attach_detach_controller.go",
    highlight: [68, 93],
    desc: "attach-detach 컨트롤러의 타이머 기본값입니다. 노드가 unmount를 보고하지 않을 때 기다리는 상한이 6분입니다.",
    annotations: [
      { lines: [71, 75], color: "sky", note: "주석이 조건을 적습니다. 이 시간이 지나면 '노드나 kubelet이 응답하지 않는다고 가정하고' detach합니다. 건강한 노드의 느린 unmount를 위한 값이 아닙니다." },
      { lines: [90, 93], color: "amber", note: "ReconcilerMaxWaitForUnmountDuration 6분, reconcile 주기 100ms, desired state 재수집 1분·3분입니다." },
    ],
    code: adcGo,
    lang: "go",
  },
  "adc-force-detach": {
    path: "kubernetes/pkg/controller/volume/attachdetach/reconciler/reconciler.go",
    highlight: [206, 243],
    desc: "detach를 결정하는 조건식입니다. 6분이 지났다는 것만으로는 부족하고 노드가 unhealthy여야 강제 detach합니다.",
    annotations: [
      { lines: [210, 214], color: "sky", note: "detach 요청 시각을 기록하고 경과 시간이 maxWaitForUnmountDuration(6분)을 넘었는지 봅니다." },
      { lines: [216, 216], color: "emerald", note: "노드의 Ready 조건을 읽어 isHealthy를 정합니다." },
      { lines: [225, 229], color: "amber", note: "forceDetach = !isHealthy && 6분 경과 && 기능 플래그 미차단. 세 조건이 모두 참이어야 합니다. 건강한 노드에서 unmount가 안 끝나면 6분이 지나도 forceDetach는 false입니다." },
      { lines: [238, 243], color: "rose", note: "노드가 아직 마운트 중이라고 보고하면 forceDetach도 out-of-service taint도 없는 한 detach를 건너뜁니다. 8절의 Multi-Attach가 풀리지 않는 자리가 여기입니다." },
      { lines: [275, 276], color: "violet", note: "강제 detach일 때는 '안전한가' 확인(verifySafeToDetach)을 생략합니다. 데이터 일관성 위험을 감수하고 노드를 포기하는 선택입니다." },
    ],
    code: adcReconcilerGo,
    lang: "go",
  },
  "adc-multi-attach": {
    path: "kubernetes/pkg/controller/volume/attachdetach/reconciler/reconciler.go",
    highlight: [376, 437],
    desc: "Multi-Attach 이벤트를 만드는 함수입니다. 옛 노드에 아직 Pod가 있는지에 따라 문구가 둘로 갈립니다.",
    annotations: [
      { lines: [394, 402], color: "amber", note: "옛 노드의 Pod가 이미 지워졌으면 'Volume is already exclusively attached to one node, waiting on detach before it can be attached to another node'입니다. 노드 장애 뒤의 전형적인 문구이고, 위 forceDetach 조건이 풀릴 때까지 기다립니다." },
      { lines: [405, 433], color: "rose", note: "옛 노드에 아직 Pod가 있으면 'Volume is already used by pod(s) …'입니다. 주석이 말하듯 대개 사용자 오류입니다. RWO PVC를 replicas 2 이상의 Deployment가 쓰면 두 Pod가 다른 노드에 가는 순간 이 문구를 봅니다." },
    ],
    code: adcReconcilerGo,
    lang: "go",
  },
};
