import type { CodeRef } from "@/components/code/types";
import scheduleOneGo from "./codebase/kubernetes/pkg/scheduler/schedule_one.go?raw";
import defaultBinderGo from "./codebase/kubernetes/pkg/scheduler/framework/plugins/defaultbinder/default_binder.go?raw";
import kubeletApiserverGo from "./codebase/kubernetes/pkg/kubelet/config/apiserver.go?raw";
import kubeletDefaultsGo from "./codebase/kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go?raw";
import kubeletGo from "./codebase/kubernetes/pkg/kubelet/kubelet.go?raw";
import leaseControllerGo from "./codebase/kubernetes/staging/src/k8s.io/component-helpers/apimachinery/lease/controller.go?raw";
import nlcDefaultsGo from "./codebase/kubernetes/pkg/controller/nodelifecycle/config/v1alpha1/defaults.go?raw";
import nlcGo from "./codebase/kubernetes/pkg/controller/nodelifecycle/node_lifecycle_controller.go?raw";
import tolerationAdmissionGo from "./codebase/kubernetes/plugin/pkg/admission/defaulttolerationseconds/admission.go?raw";
import kcmOptionsGo from "./codebase/kubernetes/cmd/kube-controller-manager/app/options/nodelifecyclecontroller.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "schedule-pod": {
    path: "kubernetes/pkg/scheduler/schedule_one.go",
    highlight: [572, 628],
    desc: "Pod 하나에 노드 하나를 고르는 함수입니다. 노드 0개, 통과 노드 0개, 1개, 여러 개의 네 경우가 차례로 나옵니다.",
    annotations: [
      { lines: [577, 579], color: "rose", note: "스냅샷에 노드가 하나도 없으면 ErrNoNodesAvailable입니다. 'no nodes available to schedule pods' 메시지가 여기서 나옵니다." },
      { lines: [581, 592], color: "sky", note: "Filter 플러그인을 모두 통과한 노드 목록이 feasibleNodes입니다. 비어 있으면 FitError에 노드별 탈락 이유(Diagnosis)를 담아 돌려주고, 그 내용이 '0/3 nodes are available: …' Event가 됩니다." },
      { lines: [595, 605], color: "amber", note: "통과 노드가 하나뿐이면 점수를 매기지 않고 바로 씁니다. 글의 사례에서 worker-1이 taint로, worker-3이 CPU 부족으로 빠지면 worker-2가 이 분기에서 뽑힙니다." },
      { lines: [608, 615], color: "violet", note: "여럿이면 Score 플러그인으로 점수를 매겨 가장 높은 노드를 고릅니다. 결과는 SuggestedHost라는 '제안'이고, 실제 기록은 Bind가 합니다." },
    ],
    code: scheduleOneGo,
    lang: "go",
  },
  bind: {
    path: "kubernetes/pkg/scheduler/schedule_one.go",
    highlight: [1100, 1111],
    desc: "고른 노드를 API server에 기록하는 함수입니다. extender가 없으면 Bind 플러그인(기본 DefaultBinder)을 부릅니다.",
    annotations: [
      { lines: [1103, 1105], color: "sky", note: "결과와 무관하게 finishBinding이 불려 assume해 둔 캐시 상태를 정리합니다. Bind가 실패하면 Pod는 다시 큐로 돌아갑니다." },
      { lines: [1110, 1110], color: "amber", note: "RunBindPlugins가 DefaultBinder.Bind를 부릅니다. scheduler는 kubelet에 아무것도 보내지 않고 API server에 한 줄을 씁니다." },
    ],
    code: scheduleOneGo,
    lang: "go",
  },
  "default-binder": {
    path: "kubernetes/pkg/scheduler/framework/plugins/defaultbinder/default_binder.go",
    highlight: [52, 70],
    desc: "scheduler가 결정을 기록하는 단 하나의 쓰기입니다. Pod의 binding 하위 자원에 Target Node 이름을 POST합니다.",
    annotations: [
      { lines: [54, 57], color: "sky", note: "Binding 객체의 Target이 Kind Node, Name worker-2입니다. API server가 이것을 받아 Pod의 spec.nodeName을 채웁니다." },
      { lines: [70, 71], color: "amber", note: "util.BindPod 호출입니다. 이 한 줄이 끝나야 kubelet의 watch가 Pod를 보기 시작합니다." },
    ],
    code: defaultBinderGo,
    lang: "go",
  },
  "kubelet-watch": {
    path: "kubernetes/pkg/kubelet/config/apiserver.go",
    highlight: [36, 38],
    desc: "kubelet이 자기 Pod를 아는 방법입니다. 모든 namespace의 Pod를 spec.nodeName이 자기 이름인 것만 걸러 list/watch합니다.",
    annotations: [
      { lines: [37, 37], color: "sky", note: "fields.OneTermEqualSelector(\"spec.nodeName\", 자기 노드 이름). scheduler가 Bind로 이 필드를 채우는 순간 이 watch에 Pod가 나타납니다. 누가 보내 주는 것이 아니라 kubelet이 자기 이름이 적힌 것을 읽습니다." },
    ],
    code: kubeletApiserverGo,
    lang: "go",
  },
  "kubelet-defaults": {
    path: "kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go",
    highlight: [136, 151],
    desc: "kubelet 심장박동의 세 기본값입니다. status 계산 10초, 변화 없을 때 보고 5분, Lease 기간 40초.",
    annotations: [
      { lines: [136, 145], color: "sky", note: "NodeStatusReportFrequency 5분. 바뀐 것이 없으면 Node.status는 5분에 한 번만 API server에 씁니다. 그래서 status의 lastHeartbeatTime만 보고 노드 생사를 판단하면 늦습니다." },
      { lines: [146, 148], color: "amber", note: "NodeStatusUpdateFrequency 10초. kubelet이 상태를 다시 계산하는 주기이고, 바뀌었으면 즉시 씁니다." },
      { lines: [149, 151], color: "violet", note: "NodeLeaseDurationSeconds 40. Lease 객체에 적히는 유효 기간이고, 갱신 간격은 kubelet.go에서 이 값의 0.25배인 10초로 계산됩니다." },
    ],
    code: kubeletDefaultsGo,
    lang: "go",
  },
  "kubelet-lease-ctl": {
    path: "kubernetes/pkg/kubelet/kubelet.go",
    highlight: [1155, 1166],
    desc: "kubelet이 Lease 갱신 컨트롤러를 만드는 자리입니다. 40초 × 0.25 = 10초마다 kube-node-lease namespace의 자기 이름 Lease를 갱신합니다.",
    annotations: [
      { lines: [1155, 1156], color: "sky", note: "leaseDuration 40초에 nodeLeaseRenewIntervalFraction 0.25(236–237행)를 곱해 renewInterval 10초를 얻습니다. 갱신을 세 번 놓쳐도 Lease는 아직 유효합니다." },
      { lines: [1157, 1166], color: "amber", note: "holderIdentity와 Lease 이름이 모두 노드 이름이고 namespace는 kube-node-lease입니다. onRepeatedHeartbeatFailure는 갱신이 반복 실패할 때 kubelet이 부르는 콜백입니다." },
    ],
    code: kubeletGo,
    lang: "go",
  },
  "lease-sync": {
    path: "kubernetes/staging/src/k8s.io/component-helpers/apimachinery/lease/controller.go",
    highlight: [148, 194],
    desc: "10초마다 도는 Lease 갱신 루프입니다. 마지막으로 성공한 Lease를 기억해 GET 없이 UPDATE만 보냅니다.",
    annotations: [
      { lines: [153, 153], color: "sky", note: "renewInterval에 4% jitter를 섞어 반복합니다. 수천 노드가 같은 순간에 쓰지 않도록 흩뿌립니다." },
      { lines: [166, 178], color: "amber", note: "latestLease가 있으면 그 버전으로 바로 UPDATE를 시도합니다. 주석대로 etcd와 API server 부하를 줄이려는 최적화입니다." },
      { lines: [180, 186], color: "violet", note: "실패하면 Lease를 다시 확보(없으면 생성)하고 UPDATE합니다. 다섯 번 연속 실패하면 오류를 남기고 다음 10초를 기다립니다." },
    ],
    code: leaseControllerGo,
    lang: "go",
  },
  "nlc-defaults": {
    path: "kubernetes/pkg/controller/nodelifecycle/config/v1alpha1/defaults.go",
    highlight: [36, 52],
    desc: "node lifecycle controller의 기본값입니다. 글의 50초가 여기 있고, PodEvictionTimeout 5분은 남아 있지만 쓰이지 않습니다.",
    annotations: [
      { lines: [38, 40], color: "rose", note: "PodEvictionTimeout 5분. 설정 구조체에는 남아 있지만 v1.37.1의 node_lifecycle_controller.go에는 이 값을 읽는 코드가 없습니다. 실제 5분은 아래 admission 플러그인의 300초에서 나옵니다." },
      { lines: [41, 48], color: "sky", note: "NodeMonitorGracePeriod 50초. 주석이 이유를 적습니다. HTTP/2 ping timeout 30초 + read idle 15초보다 커야 느린 연결을 죽은 노드로 오판하지 않습니다. v1.31까지는 40초였습니다." },
      { lines: [49, 51], color: "amber", note: "NodeStartupGracePeriod 60초. 막 등록된 노드는 첫 heartbeat까지 1분을 봐줍니다." },
    ],
    code: nlcDefaultsGo,
    lang: "go",
  },
  "nlc-taints": {
    path: "kubernetes/pkg/controller/nodelifecycle/node_lifecycle_controller.go",
    highlight: [74, 95],
    desc: "Ready 조건의 값이 어떤 taint로 바뀌는지 정하는 표입니다. False는 not-ready, Unknown은 unreachable이고 둘 다 NoExecute입니다.",
    annotations: [
      { lines: [75, 85], color: "sky", note: "두 taint 모두 Effect가 NoExecute입니다. 이미 돌고 있는 Pod도 toleration이 없으면 쫓겨나는 효과이고, toleration에 tolerationSeconds가 있으면 그 시간만큼 버팁니다." },
      { lines: [91, 95], color: "amber", note: "kubelet이 스스로 Ready=False를 보고하면 not-ready, 컨트롤러가 heartbeat 부재로 Unknown을 적으면 unreachable입니다. 글의 '노드가 꺼진' 사례는 Unknown 쪽입니다." },
    ],
    code: nlcGo,
    lang: "go",
  },
  "nlc-grace": {
    path: "kubernetes/pkg/controller/nodelifecycle/node_lifecycle_controller.go",
    highlight: [950, 1025],
    desc: "heartbeat가 끊긴 노드를 Unknown으로 바꾸는 판정입니다. Lease 갱신이 보이면 probe 시각을 지금으로 당기고, 그 시각 + 50초가 지나면 Unknown입니다.",
    annotations: [
      { lines: [950, 958], color: "sky", note: "Lease의 renewTime이 저장해 둔 것보다 새로우면 probeTimestamp를 now로 둡니다. 주석대로 status를 한 번도 안 보내도 Lease만 갱신되면 건강한 노드로 봅니다." },
      { lines: [962, 962], color: "amber", note: "now > probeTimestamp + gracePeriod(50초). 마지막 Lease 갱신이 t=0이면 t=50 이후 첫 검사(5초 주기)에서 참이 됩니다." },
      { lines: [1004, 1024], color: "violet", note: "Ready·MemoryPressure·DiskPressure·PIDPressure 조건을 모두 Unknown으로 바꿉니다. reason은 NodeStatusUnknown, message는 \"Kubelet stopped posting node status.\"이고, 그 뒤 taint 패스가 unreachable taint를 붙입니다." },
    ],
    code: nlcGo,
    lang: "go",
  },
  "nlc-noschedule": {
    path: "kubernetes/pkg/controller/nodelifecycle/node_lifecycle_controller.go",
    highlight: [539, 566],
    desc: "조건이 나쁜 노드에 NoSchedule taint를 붙이는 패스입니다. Unknown 노드에는 unreachable:NoExecute와 별개로 unreachable:NoSchedule도 붙어 새 Pod가 가지 않습니다.",
    annotations: [
      { lines: [552, 558], color: "sky", note: "같은 표(nodeConditionToTaintKeyStatusMap)로 taint key를 고르되 Effect는 NoSchedule입니다. 기본 toleration 300초는 NoExecute 쪽만 참으므로, 새 Pod는 이 NoSchedule taint 때문에 죽은 노드로 스케줄되지 않습니다." },
    ],
    code: nlcGo,
    lang: "go",
  },
  "nlc-taint-pass": {
    path: "kubernetes/pkg/controller/nodelifecycle/node_lifecycle_controller.go",
    highlight: [594, 660],
    desc: "Unknown·False가 된 노드에 NoExecute taint를 붙이는 패스입니다. 노드별 rate limiter를 거쳐 한 번에 너무 많은 노드를 처리하지 않습니다.",
    annotations: [
      { lines: [640, 647], color: "sky", note: "Ready가 False면 not-ready taint, Unknown이면 unreachable taint를 고르고 반대쪽은 뗍니다. 두 taint가 동시에 붙지는 않습니다." },
    ],
    code: nlcGo,
    lang: "go",
  },
  "toleration-defaults": {
    path: "kubernetes/plugin/pkg/admission/defaulttolerationseconds/admission.go",
    highlight: [44, 58],
    desc: "모든 Pod에 not-ready·unreachable taint를 300초 동안 참는 toleration을 기본으로 붙이는 API server admission 플러그인입니다. 글의 5분이 여기서 나옵니다.",
    annotations: [
      { lines: [44, 45], color: "sky", note: "둘 다 300초. Pod가 직접 toleration을 적지 않으면 이 값이 들어갑니다. 노드가 Unknown이 되고 300초 뒤에 Pod 삭제가 시작되는 이유입니다." },
      { lines: [53, 58], color: "amber", note: "kube-apiserver 플래그 --default-not-ready-toleration-seconds와 --default-unreachable-toleration-seconds로 바꿉니다. kube-controller-manager의 --pod-eviction-timeout이 아닙니다." },
    ],
    code: tolerationAdmissionGo,
    lang: "go",
  },
  "eviction-rates": {
    path: "kubernetes/cmd/kube-controller-manager/app/options/nodelifecyclecontroller.go",
    highlight: [44, 54],
    desc: "노드가 여럿 죽었을 때 Pod 축출 속도를 제한하는 플래그들입니다. 작은 클러스터에서 zone 전체가 비정상이면 축출을 멈춥니다.",
    annotations: [
      { lines: [48, 48], color: "sky", note: "--node-eviction-rate 0.1. 건강한 zone에서는 10초에 노드 하나씩만 Pod를 지웁니다." },
      { lines: [49, 50], color: "amber", note: "zone의 NotReady 비율이 0.55(최소 3개) 이상이면 비정상 zone으로 보고 속도를 0.01(100초에 하나)로 낮추고, 노드가 50개 이하인 클러스터면 0으로 두어 축출을 아예 멈춥니다. 네트워크 분단에서 전체 Pod를 한꺼번에 지우지 않으려는 장치입니다." },
      { lines: [51, 51], color: "violet", note: "--unhealthy-zone-threshold 0.55. ComputeZoneState(1347행)는 비율 조건과 함께 NotReady 노드가 3개 이상이어야 비정상 zone으로 봅니다. 3노드 클러스터에서 2개가 죽은 0.67은 정상 zone이고, 10노드 중 6개가 죽은 0.6은 비정상 zone이라 50개 이하 클러스터에서 축출이 멈춥니다. 모든 노드가 NotReady면 taint를 떼고 축출을 전부 멈춥니다." },
    ],
    code: kcmOptionsGo,
    lang: "go",
  },
};
