import type { CodeRef } from "@/components/code/types";
import fitGo from "./codebase/kubernetes/pkg/scheduler/framework/plugins/noderesources/fit.go?raw";
import typesGo from "./codebase/kubernetes/pkg/scheduler/framework/types.go?raw";
import evictionDefaultsGo from "./codebase/kubernetes/pkg/kubelet/eviction/defaults_linux.go?raw";
import kubeletDefaultsGo from "./codebase/kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go?raw";
import helpersLinuxGo from "./codebase/kubernetes/pkg/kubelet/cm/helpers_linux.go?raw";
import cgroupManagerGo from "./codebase/kubernetes/pkg/kubelet/cm/cgroup_manager_linux.go?raw";
import qosPolicyGo from "./codebase/kubernetes/pkg/kubelet/qos/policy.go?raw";
import reserveDoc from "./codebase/website/content/en/docs/tasks/administer-cluster/reserve-compute-resources.md?raw";
import evictionDoc from "./codebase/website/content/en/docs/concepts/scheduling-eviction/node-pressure-eviction.md?raw";
import resourcesDoc from "./codebase/website/content/en/docs/concepts/configuration/manage-resources-containers.md?raw";
import qosDoc from "./codebase/website/content/en/docs/concepts/workloads/pods/pod-qos.md?raw";
import limitRangeDoc from "./codebase/website/content/en/docs/concepts/policy/limit-range.md?raw";
import quotaDoc from "./codebase/website/content/en/docs/concepts/policy/resource-quotas.md?raw";

export const codeRefs: Record<string, CodeRef> = {
  "allocatable-example": {
    path: "website/content/en/docs/tasks/administer-cluster/reserve-compute-resources.md",
    highlight: [224, 240],
    desc: "공식 문서의 Allocatable 계산 예입니다. 32Gi·16 CPU·100Gi 노드가 예약과 eviction 하한을 빼고 28.5Gi·14.5 CPU·88Gi를 Pod에 내줍니다.",
    annotations: [
      { lines: [228, 231], color: "sky", note: "kubeReserved 2Gi + systemReserved 1Gi + evictionHard 500Mi = 3.5Gi를 32Gi에서 뺍니다. CPU는 1000m + 500m = 1.5 CPU를 뺍니다. eviction 하한은 메모리와 디스크에만 있고 CPU에는 없습니다." },
      { lines: [233, 236], color: "amber", note: "scheduler가 보는 것은 requests 합이 28.5Gi를 넘는지입니다. 같은 문장이 '사용량'이 아니라 'requests'라고 적습니다. 4절의 Pending이 여기서 나옵니다." },
      { lines: [237, 239], color: "violet", note: "kubelet은 실제 사용량이 28.5Gi를 넘으면 eviction을 시작합니다. 같은 숫자 28.5Gi를 scheduler는 requests로, kubelet은 사용량으로 비교합니다." },
    ],
    code: reserveDoc,
    lang: "python",
  },
  "eviction-hard-defaults": {
    path: "kubernetes/pkg/kubelet/eviction/defaults_linux.go",
    highlight: [21, 28],
    desc: "kubeReserved·systemReserved는 설정하지 않으면 0이지만 eviction 하한은 기본값이 있습니다. 아무 설정 없는 노드도 memory.available 100Mi만큼은 Allocatable에서 빠집니다.",
    annotations: [
      { lines: [23, 23], color: "sky", note: "memory.available 100Mi가 기본 하한입니다. 문서 예시의 500Mi는 운영자가 올려 쓴 값입니다." },
      { lines: [24, 27], color: "amber", note: "nodefs 10%·inode 5%·imagefs 15%·5%는 디스크 쪽 하한입니다. 이 값들이 DiskPressure eviction의 기준이 됩니다." },
    ],
    code: evictionDefaultsGo,
    lang: "go",
  },
  "fits-request": {
    path: "kubernetes/pkg/scheduler/framework/plugins/noderesources/fit.go",
    highlight: [710, 760],
    desc: "NodeResourcesFit 플러그인이 Pod 하나가 노드에 들어가는지 판정하는 함수입니다. 비교 대상은 사용량이 아니라 Allocatable − Requested(이미 배치된 Pod들의 requests 합)입니다.",
    annotations: [
      { lines: [713, 721], color: "sky", note: "첫 검사는 Pod 수입니다. 노드의 maxPods(기본 110)를 넘으면 'Too many pods'를 남깁니다." },
      { lines: [732, 741], color: "amber", note: "podRequest.MilliCPU > Allocatable.MilliCPU − Requested.MilliCPU면 'Insufficient cpu'입니다. 4절 사례에서는 1000 > 14,500 − 14,000 = 500이라 실패합니다. Unresolvable은 어느 노드에도 못 들어가는 경우(요청이 Allocatable 자체보다 큼)를 표시합니다." },
      { lines: [742, 751], color: "violet", note: "메모리도 같은 식입니다. Requested는 nodeInfo가 더해 둔 Pod requests 합이지 kubelet이 잰 사용량이 아닙니다." },
    ],
    code: fitGo,
    lang: "go",
  },
  "no-node-available-msg": {
    path: "kubernetes/pkg/scheduler/framework/types.go",
    highlight: [1446, 1475],
    desc: "FailedScheduling event의 '0/3 nodes are available: 3 Insufficient cpu.' 문장을 조립하는 곳입니다.",
    annotations: [
      { lines: [1446, 1447], color: "sky", note: "앞머리는 '0/%v nodes are available'이고 %v는 전체 노드 수입니다. 그래서 1절 메시지의 3은 '시도한 노드 3대'라는 뜻입니다." },
      { lines: [1471, 1471], color: "amber", note: "뒤에 PreFilter·Filter·PostFilter 메시지가 붙습니다. 'Insufficient cpu'는 Filter 단계의 fit.go가, 'preemption: …'은 PostFilter가 적습니다." },
    ],
    code: typesGo,
    lang: "go",
  },
  "cfs-quota": {
    path: "kubernetes/pkg/kubelet/cm/helpers_linux.go",
    highlight: [94, 160],
    desc: "CPU limit과 request를 cgroup 값으로 바꾸는 식입니다. limit은 CFS quota(μs), request는 shares가 됩니다.",
    annotations: [
      { lines: [103, 108], color: "sky", note: "QuotaPeriod 100,000μs = 100ms가 한 주기입니다. 최소 quota는 1,000μs라 10m 아래 limit은 10m처럼 동작합니다." },
      { lines: [117, 142], color: "amber", note: "quota = milliCPU × period ÷ 1000입니다. limit 500m이면 500 × 100,000 ÷ 1,000 = 50,000μs, 곧 100ms마다 50ms입니다. CPUCFSQuotaPeriod 게이트가 꺼져 있으면 period는 항상 100ms입니다." },
      { lines: [144, 160], color: "violet", note: "shares = milliCPU × 1024 ÷ 1000입니다. request 500m이면 512입니다. 0이면 커널 기본 1024가 아니라 2를 써서 '아무것도 요청 안 한' Pod가 가장 적은 몫을 받게 합니다." },
    ],
    code: helpersLinuxGo,
    lang: "go",
  },
  "cpu-weight": {
    path: "kubernetes/pkg/kubelet/cm/cgroup_manager_linux.go",
    highlight: [268, 277],
    desc: "cgroup v2 노드에서 shares [2, 262144]를 cpu.weight [1, 10000]으로 선형 변환합니다.",
    annotations: [
      { lines: [273, 276], color: "sky", note: "weight = 1 + (shares − 2) × 9999 ÷ 262142입니다. request 500m(shares 512)은 1 + 510 × 9999 ÷ 262142 = 20, request 1 CPU(1024)는 39입니다. 정수 나눗셈이라 작은 request들은 같은 weight로 뭉칩니다." },
    ],
    code: cgroupManagerGo,
    lang: "go",
  },
  "kubelet-cfs-defaults": {
    path: "kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go",
    highlight: [204, 209],
    desc: "kubelet 설정 기본값입니다. CPU limit을 CFS quota로 집행하는 스위치가 켜져 있고 주기는 100ms입니다.",
    annotations: [
      { lines: [204, 206], color: "sky", note: "cpuCFSQuota: true가 기본입니다. false로 두면 limit이 cgroup에 쓰이지 않아 throttling이 사라지지만 Pod 하나가 노드 CPU를 다 쓸 수 있습니다." },
      { lines: [207, 209], color: "amber", note: "cpuCFSQuotaPeriod 100ms가 6절 계산의 주기입니다. 짧게 바꾸면 quota도 같은 비율로 줄어 평균은 같고 한 번에 멈추는 길이만 짧아집니다." },
    ],
    code: kubeletDefaultsGo,
    lang: "go",
  },
  "limits-enforcement-doc": {
    path: "website/content/en/docs/concepts/configuration/manage-resources-containers.md",
    highlight: [43, 56],
    desc: "공식 문서가 두 limit의 집행 방식을 나눠 적은 부분입니다. CPU는 throttling, 메모리는 OOM kill입니다.",
    annotations: [
      { lines: [43, 46], color: "sky", note: "CPU limit은 커널이 그 이상을 못 쓰게 막는 hard limit입니다. 넘어서려는 순간 멈출 뿐 죽이지 않습니다." },
      { lines: [48, 53], color: "amber", note: "메모리 limit은 커널이 메모리 압력을 감지했을 때 OOM kill로 집행합니다. 'reactively'라는 단어가 핵심이며, limit을 조금 넘어도 바로 죽지 않을 수 있습니다." },
    ],
    code: resourcesDoc,
    lang: "python",
  },
  "oomkilled-137-doc": {
    path: "website/content/en/docs/concepts/configuration/manage-resources-containers.md",
    highlight: [695, 721],
    desc: "메모리 limit을 넘은 컨테이너의 kubectl describe 출력 예입니다.",
    annotations: [
      { lines: [700, 701], color: "sky", note: "Reason OOMKilled, Exit Code 137입니다. 137 = 128 + SIGKILL(9)이고 왜 이 숫자인지는 리눅스 메모리 글 10절에 있습니다." },
    ],
    code: resourcesDoc,
    lang: "python",
  },
  "qos-rules-doc": {
    path: "website/content/en/docs/concepts/workloads/pods/pod-qos.md",
    highlight: [46, 76],
    desc: "QoS class 판정 규칙입니다. Guaranteed는 모든 컨테이너가 cpu·memory 모두 request = limit이어야 합니다.",
    annotations: [
      { lines: [46, 51], color: "sky", note: "메모리와 CPU 각각 limit과 request가 모두 있고 서로 같아야 합니다. 하나라도 빠지면 Guaranteed가 아닙니다." },
      { lines: [72, 76], color: "amber", note: "Guaranteed가 아니면서 어느 컨테이너든 request나 limit이 하나라도 있으면 Burstable입니다. 아무것도 없으면 BestEffort입니다." },
    ],
    code: qosDoc,
    lang: "python",
  },
  "eviction-order-doc": {
    path: "website/content/en/docs/concepts/scheduling-eviction/node-pressure-eviction.md",
    highlight: [341, 363],
    desc: "node-pressure eviction의 순서입니다. QoS class가 직접 기준이 아니라는 문장이 note에 있습니다.",
    annotations: [
      { lines: [343, 347], color: "sky", note: "세 기준은 ① 사용량이 requests를 넘었는가 ② Pod Priority ③ requests 대비 초과량입니다." },
      { lines: [349, 356], color: "amber", note: "requests를 넘긴 BestEffort·Burstable이 먼저, requests 이하인 Guaranteed·Burstable이 나중입니다. 같은 묶음 안에서는 Priority가 정합니다." },
      { lines: [358, 363], color: "violet", note: "'The kubelet does not use the pod's QoS class to determine the eviction order.' QoS는 추정 도구일 뿐이고 DiskPressure에는 그 추정도 맞지 않습니다." },
    ],
    code: evictionDoc,
    lang: "python",
  },
  "kubelet-oom-adj": {
    path: "kubernetes/pkg/kubelet/qos/policy.go",
    highlight: [31, 72],
    desc: "QoS class별 oom_score_adj입니다. 계산과 노드 전역 OOM 순서는 리눅스 메모리 글 11절에서 다룹니다.",
    annotations: [
      { lines: [31, 36], color: "sky", note: "kubelet·kube-proxy −999, Guaranteed −997, BestEffort 1000입니다." },
      { lines: [62, 68], color: "amber", note: "Burstable은 request가 노드 메모리의 10%면 900이 되는 식입니다. request보다 많이 쓰는 컨테이너가 먼저 죽도록 설계한 휴리스틱이라고 주석이 밝힙니다." },
    ],
    code: qosPolicyGo,
    lang: "go",
  },
  "limit-range-doc": {
    path: "website/content/en/docs/concepts/policy/limit-range.md",
    highlight: [49, 60],
    desc: "LimitRange는 admission 시점에 기본 request·limit을 채우거나 범위를 검사합니다. 이미 도는 Pod에는 적용되지 않습니다.",
    annotations: [
      { lines: [55, 56], color: "sky", note: "범위를 어기면 403 Forbidden으로 거절됩니다. Deployment는 만들어졌는데 Pod가 없는 장애의 한 원인입니다." },
      { lines: [59, 59], color: "amber", note: "검사는 Pod admission 때만 합니다. LimitRange를 나중에 바꿔도 도는 Pod는 그대로입니다." },
    ],
    code: limitRangeDoc,
    lang: "python",
  },
  "resource-quota-doc": {
    path: "website/content/en/docs/concepts/policy/resource-quotas.md",
    highlight: [44, 54],
    desc: "ResourceQuota는 namespace 합계를 제한하고 위반 요청을 403 Forbidden으로 거절합니다.",
    annotations: [
      { lines: [48, 50], color: "sky", note: "거절은 API 요청 단계에서 일어나므로 Pod 객체 자체가 생기지 않습니다. ReplicaSet의 FailedCreate event에 이 메시지가 남습니다." },
      { lines: [51, 53], color: "amber", note: "cpu·memory quota가 있는 namespace에서는 requests·limits를 적지 않은 Pod 생성이 거부될 수 있습니다. LimitRange로 기본값을 채워 두는 이유입니다." },
    ],
    code: quotaDoc,
    lang: "python",
  },
};
