import type { CodeRef } from "@/components/code/types";
import kuberuntimeContainerGo from "./codebase/kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container.go?raw";
import kuberuntimeManagerGo from "./codebase/kubernetes/pkg/kubelet/kuberuntime/kuberuntime_manager.go?raw";
import coreDefaultsGo from "./codebase/kubernetes/pkg/apis/core/v1/defaults.go?raw";
import appsDefaultsGo from "./codebase/kubernetes/pkg/apis/apps/v1/defaults.go?raw";
import deploymentUtilGo from "./codebase/kubernetes/pkg/controller/deployment/util/deployment_util.go?raw";
import disruptionGo from "./codebase/kubernetes/pkg/controller/disruption/disruption.go?raw";
import evictionGo from "./codebase/kubernetes/pkg/registry/core/pod/storage/eviction.go?raw";
import drainGo from "./codebase/kubernetes/staging/src/k8s.io/kubectl/pkg/drain/drain.go?raw";
import replicaCalculatorGo from "./codebase/kubernetes/pkg/controller/podautoscaler/replica_calculator.go?raw";
import horizontalGo from "./codebase/kubernetes/pkg/controller/podautoscaler/horizontal.go?raw";
import hpaConfigDefaultsGo from "./codebase/kubernetes/pkg/controller/podautoscaler/config/v1alpha1/defaults.go?raw";
import autoscalingV2DefaultsGo from "./codebase/kubernetes/pkg/apis/autoscaling/v2/defaults.go?raw";
import endpointsliceUtilsGo from "./codebase/kubernetes/staging/src/k8s.io/endpointslice/utils.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "pod-grace-default": {
    path: "kubernetes/pkg/apis/core/v1/defaults.go",
    highlight: [243, 273],
    desc: "PodSpec 기본값입니다. terminationGracePeriodSeconds를 비우면 v1.DefaultTerminationGracePeriodSeconds(30)가 들어갑니다.",
    annotations: [
      { lines: [267, 270], color: "sky", note: "30초의 출처입니다. 상수 자체는 staging/src/k8s.io/api/core/v1/types.go 3987행에 있습니다. 이 값은 preStop과 SIGTERM 뒤 종료를 합친 예산이지 SIGTERM 뒤의 시간만이 아닙니다." },
    ],
    code: coreDefaultsGo,
    lang: "go",
  },
  "kubelet-kill-container": {
    path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container.go",
    highlight: [864, 930],
    desc: "kubelet이 컨테이너 하나를 끝내는 killContainer입니다. 예산을 정하고, preStop에 쓴 시간을 빼고, 최소 2초를 보장한 뒤 남은 예산으로 StopContainer(SIGTERM → 기다림 → SIGKILL)를 부릅니다.",
    annotations: [
      { lines: [882, 882], color: "sky", note: "예산의 출발점입니다. Pod 삭제 요청의 grace가 있으면 그것을, 없으면 spec의 terminationGracePeriodSeconds(기본 30)를 씁니다." },
      { lines: [889, 893], color: "emerald", note: "kubectl delete --grace-period 같은 override가 있으면 예산을 그 값으로 바꿉니다." },
      { lines: [896, 898], color: "amber", note: "preStop이 있고 예산이 남았으면 실행하고, 걸린 초를 예산에서 뺍니다. 6절의 사례에서 30 − 5 = 25초가 여기서 나옵니다." },
      { lines: [908, 910], color: "rose", note: "preStop이 예산을 다 써도 최소 minimumGracePeriodInSeconds(2초)는 남깁니다. 문서의 '2초 일회 연장'이 이 두 줄입니다." },
      { lines: [915, 915], color: "violet", note: "컨테이너 런타임에 남은 예산을 넘깁니다. 런타임이 PID 1에 SIGTERM을 보내고 예산이 끝나면 SIGKILL합니다." },
    ],
    code: kuberuntimeContainerGo,
    lang: "go",
  },
  "kubelet-prestop": {
    path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container.go",
    highlight: [784, 812],
    desc: "preStop 훅을 실행하고 걸린 시간을 돌려주는 함수입니다. 훅이 예산보다 오래 걸리면 기다리기를 멈추고 걸린 시간만 보고합니다.",
    annotations: [
      { lines: [790, 799], color: "sky", note: "훅은 별도 goroutine에서 돕니다. 실패해도 이벤트 FailedPreStopHook만 남기고 종료는 계속됩니다." },
      { lines: [801, 807], color: "amber", note: "gracePeriod초가 먼저 지나면 'PreStop hook not completed in grace period'를 남기고 돌아갑니다. 훅이 sleep 60인데 예산이 30이면 여기서 30초 뒤에 나옵니다." },
      { lines: [810, 810], color: "violet", note: "돌려주는 값은 실제로 흐른 초입니다. 호출한 killContainer가 이 값을 예산에서 뺍니다." },
    ],
    code: kuberuntimeContainerGo,
    lang: "go",
  },
  "kubelet-grace-source": {
    path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container.go",
    highlight: [1423, 1442],
    desc: "예산의 출처를 고르는 함수입니다. 삭제 요청의 grace, probe별 grace, spec의 grace 순입니다.",
    annotations: [
      { lines: [1426, 1427], color: "sky", note: "Pod 삭제 요청이 정한 DeletionGracePeriodSeconds가 있으면 그것이 우선입니다. kubectl delete의 --grace-period가 여기로 들어옵니다." },
      { lines: [1428, 1439], color: "amber", note: "liveness·startup probe 실패로 죽이는 경우 probe에 적은 terminationGracePeriodSeconds를 따로 쓸 수 있습니다. 없으면 spec 값입니다." },
    ],
    code: kuberuntimeContainerGo,
    lang: "go",
  },
  "kubelet-min-grace": {
    path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_manager.go",
    highlight: [80, 86],
    desc: "불필요한 SIGKILL을 피하기 위한 최소 종료 창입니다.",
    annotations: [
      { lines: [83, 84], color: "rose", note: "minimumGracePeriodInSeconds = 2. preStop이 예산을 다 써도 PID 1은 SIGTERM 뒤 2초는 받습니다." },
    ],
    code: kuberuntimeManagerGo,
    lang: "go",
  },
  "eps-conditions": {
    path: "kubernetes/staging/src/k8s.io/endpointslice/utils.go",
    highlight: [38, 62],
    desc: "Pod 하나를 EndpointSlice의 endpoint로 바꾸는 함수입니다. serving·terminating·ready 세 조건이 어디서 오는지 세 줄로 보입니다.",
    annotations: [
      { lines: [39, 40], color: "sky", note: "serving은 Pod의 Ready 조건 그대로, terminating은 deletionTimestamp가 있는지입니다. 삭제 요청 직후 컨테이너가 아직 살아 있어도 terminating은 true입니다." },
      { lines: [43, 43], color: "amber", note: "ready = publishNotReadyAddresses || (serving && !terminating). 종료 중인 Pod는 아직 응답할 수 있어도 ready가 false라 kube-proxy가 새 연결을 보내지 않습니다. 이 갱신이 각 노드에 퍼지는 시간이 5절의 경쟁 구간입니다." },
    ],
    code: endpointsliceUtilsGo,
    lang: "go",
  },
  "deploy-defaults": {
    path: "kubernetes/pkg/apis/apps/v1/defaults.go",
    highlight: [54, 71],
    desc: "Deployment 기본값입니다. maxUnavailable·maxSurge 25%, revisionHistoryLimit 10, progressDeadlineSeconds 600.",
    annotations: [
      { lines: [54, 62], color: "sky", note: "둘 다 25%입니다. 퍼센트는 replicas에 곱한 뒤 아래 ResolveFenceposts가 서로 다른 방향으로 반올림합니다." },
      { lines: [64, 67], color: "emerald", note: "옛 ReplicaSet을 10개까지 남깁니다. 0이면 rollout undo할 revision이 없습니다." },
      { lines: [68, 71], color: "amber", note: "600초 동안 진전이 없으면 Progressing=False·ProgressDeadlineExceeded 조건을 답니다. 조건만 달고 되돌리지는 않습니다." },
    ],
    code: appsDefaultsGo,
    lang: "go",
  },
  "deploy-fenceposts": {
    path: "kubernetes/pkg/controller/deployment/util/deployment_util.go",
    highlight: [883, 902],
    desc: "maxSurge와 maxUnavailable 퍼센트를 정수로 바꾸는 함수입니다. surge는 올림, unavailable은 내림이고 둘 다 0이면 unavailable을 1로 둡니다.",
    annotations: [
      { lines: [884, 884], color: "sky", note: "roundUp=true. replicas 4의 25%는 1, replicas 3의 25%(0.75)는 1입니다." },
      { lines: [888, 888], color: "amber", note: "roundUp=false. replicas 4의 25%는 1, replicas 3의 25%(0.75)는 0입니다. 3개짜리는 롤아웃 중 3개가 늘 Ready여야 합니다." },
      { lines: [893, 899], color: "rose", note: "둘 다 0으로 떨어지면(예: replicas 1에 maxSurge 0%) unavailable을 1로 강제합니다. surge는 quota 때문에 못 쓸 수 있다는 가정입니다." },
    ],
    code: deploymentUtilGo,
    lang: "go",
  },
  "pdb-expected": {
    path: "kubernetes/pkg/controller/disruption/disruption.go",
    highlight: [815, 856],
    desc: "PDB 컨트롤러가 '몇 개가 건강해야 하는가(desiredHealthy)'를 계산하는 함수입니다. minAvailable·maxUnavailable, 정수·퍼센트에 따라 분모가 다릅니다.",
    annotations: [
      { lines: [822, 834], color: "sky", note: "maxUnavailable이면 소유 워크로드의 .spec.replicas 합(expectedCount)에서 퍼센트(올림)를 뺍니다. replicas 4, maxUnavailable 25% → 4 − 1 = 3." },
      { lines: [835, 838], color: "amber", note: "minAvailable이 정수면 그대로 desiredHealthy이고 expectedCount는 selector에 잡힌 Pod 수입니다. replicas 4, minAvailable 3 → 3." },
      { lines: [839, 849], color: "emerald", note: "minAvailable이 퍼센트면 ownerReferences를 따라 워크로드의 replicas를 읽어 분모로 씁니다. 소유자가 없는 Pod는 퍼센트 PDB를 쓸 수 없습니다." },
    ],
    code: disruptionGo,
    lang: "go",
  },
  "pdb-healthy": {
    path: "kubernetes/pkg/controller/disruption/disruption.go",
    highlight: [921, 937],
    desc: "현재 건강한 Pod 수(currentHealthy)를 세는 함수입니다. DisruptionsAllowed = currentHealthy − desiredHealthy의 분자입니다.",
    annotations: [
      { lines: [924, 926], color: "rose", note: "삭제 중(deletionTimestamp)인 Pod는 세지 않습니다. 종료 중인 Pod는 응답하고 있어도 예산에서 빠집니다." },
      { lines: [928, 930], color: "amber", note: "방금 축출이 허용됐지만 아직 삭제가 관찰되지 않은 Pod(DisruptedPods, 2분 보존)도 빼서 같은 예산을 두 번 쓰지 못하게 합니다." },
      { lines: [931, 933], color: "sky", note: "Ready 조건이 참인 Pod만 셉니다. 새 Pod가 Ready가 되지 못하면 currentHealthy가 늘지 않아 drain이 멈춥니다." },
    ],
    code: disruptionGo,
    lang: "go",
  },
  "eviction-429": {
    path: "kubernetes/pkg/registry/core/pod/storage/eviction.go",
    highlight: [414, 450],
    desc: "Eviction API가 PDB를 보고 거절하는 자리입니다. 거절은 429 Too Many Requests이고 클라이언트가 다시 시도하라는 뜻입니다.",
    annotations: [
      { lines: [419, 420], color: "sky", note: "'Cannot evict pod as it would violate the pod's disruption budget.' 429에 Retry-After 10초를 붙입니다. drain이 이 문구를 반복해서 찍습니다." },
      { lines: [425, 428], color: "amber", note: "PDB 컨트롤러가 아직 최신 spec을 반영하지 못했으면(observedGeneration이 뒤짐) 그 자체로 429입니다. 방금 PDB를 고친 직후 drain이 잠깐 거절되는 이유입니다." },
      { lines: [446, 447], color: "rose", note: "DisruptionsAllowed가 0이면 429입니다. 8절의 replicas 4·minAvailable 3에서 Pod 하나가 이미 축출 중이면 여기서 막힙니다." },
    ],
    code: evictionGo,
    lang: "go",
  },
  "drain-retry": {
    path: "kubernetes/staging/src/k8s.io/kubectl/pkg/drain/drain.go",
    highlight: [284, 345],
    desc: "kubectl drain이 Pod마다 goroutine을 띄워 Eviction을 반복 호출하는 루프입니다. 429면 잠시 자고 다시 시도하며 전체 timeout(기본 무한)까지 멈추지 않습니다.",
    annotations: [
      { lines: [289, 296], color: "sky", note: "--timeout을 주지 않으면 사실상 무한입니다. 새 Pod가 Ready가 안 되면 drain은 끝나지 않습니다." },
      { lines: [318, 324], color: "emerald", note: "EvictPod가 성공하면 루프를 나가 삭제를 기다리고, Pod가 이미 없으면 끝입니다." },
      { lines: [326, 329], color: "amber", note: "429(TooManyRequests)면 'error when evicting pods … (will retry after 5s)'를 찍고 EvictErrorRetryDelay만큼 잔 뒤 처음부터 다시 합니다. 운영자가 보는 멈춘 drain 화면이 이 줄입니다." },
      { lines: [341, 343], color: "rose", note: "그 밖의 오류는 drain 전체를 실패로 끝냅니다." },
    ],
    code: drainGo,
    lang: "go",
  },
  "hpa-tolerance": {
    path: "kubernetes/pkg/controller/podautoscaler/replica_calculator.go",
    highlight: [56, 58],
    desc: "tolerance 판정입니다. 기본 0.1이면 usageRatio가 0.9 이상 1.1 이하일 때 아무것도 하지 않습니다.",
    annotations: [
      { lines: [57, 57], color: "sky", note: "(1 − down) ≤ ratio ≤ (1 + up). 목표 50%에서 현재 평균 46%(ratio 0.92)나 54%(1.08)는 무시됩니다." },
    ],
    code: replicaCalculatorGo,
    lang: "go",
  },
  "hpa-replicas": {
    path: "kubernetes/pkg/controller/podautoscaler/replica_calculator.go",
    highlight: [80, 165],
    desc: "CPU 사용률 기반 replica 계산 본체입니다. 문서의 ceil(current × ratio)와 달리 코드는 ready Pod 수에 비율을 곱하고, 지표가 없거나 아직 Ready가 아닌 Pod를 보수적으로 채워 다시 계산합니다.",
    annotations: [
      { lines: [93, 95], color: "sky", note: "Pod를 ready·unready·missing·ignored로 나누고 unready·ignored의 지표를 뺍니다. 평균은 ready Pod만으로 냅니다." },
      { lines: [100, 103], color: "emerald", note: "분모는 requests입니다. 컨테이너에 CPU request가 없으면 여기서 오류가 나 HPA가 계산을 못 합니다." },
      { lines: [110, 118], color: "amber", note: "unready도 missing도 없으면 tolerance 안이면 현재 유지, 아니면 ceil(ratio × readyPodCount)입니다. 9절의 ceil(1.6 × 4) = 7이 이 줄입니다." },
      { lines: [121, 135], color: "violet", note: "지표가 없는 Pod는 축소 때 100%(또는 목표치)를 쓴다고, 확대 때 0%를 쓴다고 가정해 변화를 줄입니다." },
      { lines: [138, 142], color: "violet", note: "확대 중이면 아직 Ready가 아닌 Pod도 0%로 넣습니다. 방금 뜬 Pod 때문에 또 늘리는 것을 막습니다." },
      { lines: [150, 154], color: "rose", note: "보정 뒤 비율이 tolerance 안이거나 방향이 뒤집히면 스케일하지 않습니다." },
    ],
    code: replicaCalculatorGo,
    lang: "go",
  },
  "hpa-defaults": {
    path: "kubernetes/pkg/controller/podautoscaler/config/v1alpha1/defaults.go",
    highlight: [35, 54],
    desc: "kube-controller-manager의 HPA 기본값입니다. sync 15초, 축소 안정화 5분, CPU 초기화 5분, 초기 readiness 지연 30초, tolerance 0.1.",
    annotations: [
      { lines: [40, 42], color: "sky", note: "15초마다 지표를 읽고 다시 계산합니다." },
      { lines: [43, 45], color: "amber", note: "축소 안정화 창 5분. 최근 5분의 권고값 가운데 최댓값을 쓰므로 부하가 빠져도 5분은 유지합니다." },
      { lines: [46, 51], color: "emerald", note: "뜬 지 5분 안의 Pod는 CPU 지표가 불안정하면 빼고, Ready 뒤 30초는 지표를 믿지 않습니다." },
      { lines: [52, 54], color: "violet", note: "tolerance 0.1의 출처입니다. v1.37에서 stable이 된 HPA별 tolerance 필드로 덮어쓸 수 있습니다." },
    ],
    code: hpaConfigDefaultsGo,
    lang: "go",
  },
  "hpa-v2-behavior": {
    path: "kubernetes/pkg/apis/autoscaling/v2/defaults.go",
    highlight: [27, 63],
    desc: "behavior를 적지 않았을 때의 확대·축소 규칙입니다. 확대는 15초마다 max(4개, 100%), 축소는 15초마다 100%이고 축소 창은 컨트롤러 플래그(5분)를 따릅니다.",
    annotations: [
      { lines: [29, 33], color: "sky", note: "확대 안정화 창은 0초, 한 번에 4개 또는 현재의 100% 중 큰 쪽입니다. replicas 4에서 7로 가는 것은 한 번에 허용됩니다." },
      { lines: [49, 51], color: "amber", note: "축소 창은 nil입니다. 주석대로 커맨드라인의 downscale-stabilization(5분)을 그대로 쓰기 위해서입니다." },
    ],
    code: autoscalingV2DefaultsGo,
    lang: "go",
  },
  "hpa-stabilize": {
    path: "kubernetes/pkg/controller/podautoscaler/horizontal.go",
    highlight: [1080, 1106],
    desc: "축소 안정화의 실체입니다. 최근 창 안의 권고값 가운데 최댓값을 돌려주므로 한 번 올라간 replicas는 창이 지나야 내려옵니다.",
    annotations: [
      { lines: [1087, 1087], color: "sky", note: "cutoff = 지금 − 5분. 이보다 오래된 표본은 버립니다." },
      { lines: [1091, 1098], color: "amber", note: "창 안의 권고 가운데 가장 큰 값을 고릅니다. 9절에서 7 → 4 권고가 5분 동안 7로 남는 이유입니다." },
      { lines: [1099, 1105], color: "emerald", note: "오래된 표본 자리에 새 권고를 덮어쓰거나 뒤에 붙입니다. 표본은 HPA마다 메모리에만 있어 컨트롤러가 재시작되면 비워집니다." },
    ],
    code: horizontalGo,
    lang: "go",
  },
};
