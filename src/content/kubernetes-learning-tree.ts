export type KubernetesLearningTrack = "concept" | "practice" | "reference";

export type KubernetesLearningNodeId =
  | "map"
  | "request"
  | "controllers"
  | "placement"
  | "resources"
  | "health"
  | "storage"
  | "network"
  | "lifecycle"
  | "operations";

export interface KubernetesLearningGroup {
  id: "map" | "control" | "runtime" | "traffic" | "operations";
  slug: string;
  name: string;
  description: string;
  parentLabel: string;
  parentHref: string;
}

export interface KubernetesLearningNode {
  id: KubernetesLearningNodeId;
  slug: string;
  title: string;
  shortTitle: string;
  track: KubernetesLearningTrack;
  form: "explanation" | "lab" | "decision";
  group: KubernetesLearningGroup["id"];
  href: string;
  question: string;
  closure: string;
  parent?: KubernetesLearningNodeId;
  conceptAnchors?: readonly {
    label: string;
    href: string;
    node?: KubernetesLearningNodeId;
  }[];
  reviewStatus: "pending" | "reviewed";
}

export const KUBERNETES_LEARNING_GROUPS: readonly KubernetesLearningGroup[] = [
  {
    id: "map",
    slug: "cloud-kubernetes-map",
    name: "전체 지도와 실습",
    description: "Pod 하나의 전체 경로를 먼저 이해한 뒤 같은 경로를 명령과 증거로 확인합니다.",
    parentLabel: "Kubernetes 전체 지도",
    parentHref: "/cs/cloud/kubernetes-concept-map#map",
  },
  {
    id: "control",
    slug: "cloud-kubernetes-control",
    name: "원하는 상태와 배치",
    description: "Controller가 객체 수를 맞추고 Scheduler가 Node와 자원 조건을 판단합니다.",
    parentLabel: "원하는 상태와 배치",
    parentHref: "/cs/cloud/kubernetes-concept-map#questions",
  },
  {
    id: "runtime",
    slug: "cloud-kubernetes-runtime",
    name: "Pod 실행 준비",
    description: "kubelet·Probe·CSI가 컨테이너와 볼륨을 요청 가능한 상태로 만듭니다.",
    parentLabel: "Pod 실행 준비",
    parentHref: "/cs/cloud/kubernetes-concept-map#questions",
  },
  {
    id: "traffic",
    slug: "cloud-kubernetes-traffic",
    name: "사용자 요청 전달",
    description: "Service·EndpointSlice·Node 데이터 경로가 Ready Pod로 패킷을 옮깁니다.",
    parentLabel: "사용자 요청 전달",
    parentHref: "/cs/cloud/kubernetes-concept-map#questions",
  },
  {
    id: "operations",
    slug: "cloud-kubernetes-operations",
    name: "변경과 운영",
    description: "Pod 교체 메커니즘을 이해한 뒤 SLO·변경·복구 판단으로 넘어갑니다.",
    parentLabel: "변경과 운영",
    parentHref: "/cs/cloud/kubernetes-concept-map#questions",
  },
] as const;

export const KUBERNETES_LEARNING_NODES: readonly KubernetesLearningNode[] = [
  {
    id: "map",
    slug: "kubernetes-concept-map",
    title: "Kubernetes 개념 지도",
    shortTitle: "전체 지도",
    track: "concept",
    form: "explanation",
    group: "map",
    href: "/cs/cloud/kubernetes-concept-map#overview",
    question: "replicas 한 줄은 어떤 상태 변화를 거쳐 요청을 받는 Pod가 되는가?",
    closure: "저장 → 객체 생성 → Node 선택 → 실행 준비 → 요청 전달의 다섯 경계를 한 Pod로 추적합니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "controllers",
    slug: "kubernetes-controllers-reconcile-deployment-job",
    title: "Controller와 reconcile",
    shortTitle: "Controller",
    track: "concept",
    form: "explanation",
    group: "control",
    parent: "map",
    href: "/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview",
    question: "API에 적은 replicas와 실제 Pod 수의 차이는 누가 줄이는가?",
    closure: "Deployment와 ReplicaSet Controller는 서로 다른 객체의 숫자를 맞추며 Pod를 직접 되살리지 않습니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "placement",
    slug: "kubernetes-pod-to-node-scheduler-kubelet-notready",
    title: "Scheduler와 Node 상태",
    shortTitle: "Scheduler·Node",
    track: "concept",
    form: "explanation",
    group: "control",
    parent: "map",
    href: "/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview",
    question: "Pod는 어느 Node에 배치되고 응답하지 않는 Node에서는 언제 떠나는가?",
    closure: "Scheduler의 Binding과 kubelet Lease, Node lifecycle Controller의 시간 판단을 분리합니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "resources",
    slug: "kubernetes-requests-limits-allocatable-qos",
    title: "requests·limits·Allocatable",
    shortTitle: "자원",
    track: "concept",
    form: "explanation",
    group: "control",
    parent: "map",
    href: "/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview",
    question: "같은 YAML의 자원 숫자를 Scheduler와 kubelet은 어떻게 다르게 쓰는가?",
    closure: "requests는 배치 입력이고 limits는 Node에서 집행되는 실행 상한입니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "health",
    slug: "kubernetes-pod-states-crashloop-probes-events",
    title: "Pod 상태·Probe·Event",
    shortTitle: "Pod 상태",
    track: "concept",
    form: "explanation",
    group: "runtime",
    parent: "map",
    href: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview",
    question: "Pod가 목표 상태에 닿지 못한 단계와 이유는 어디에 남는가?",
    closure: "phase·container state·Condition·Event를 서로 다른 기록으로 읽어 첫 실패 경계를 찾습니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "storage",
    slug: "kubernetes-pvc-pv-storageclass-csi",
    title: "PVC·PV·StorageClass·CSI",
    shortTitle: "스토리지",
    track: "concept",
    form: "explanation",
    group: "runtime",
    parent: "map",
    href: "/cs/cloud/kubernetes-pvc-pv-storageclass-csi#overview",
    question: "PVC의 저장 요구는 언제 실제 디스크와 mount로 바뀌는가?",
    closure: "binding과 provision, attach, stage, publish는 서로 다른 객체와 실행 주체가 맡습니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "network",
    slug: "kubernetes-network-packet-path",
    title: "Service에서 Pod까지의 패킷 경로",
    shortTitle: "패킷 경로",
    track: "concept",
    form: "explanation",
    group: "traffic",
    parent: "map",
    href: "/cs/cloud/kubernetes-network-packet-path#overview",
    question: "Service 주소로 보낸 요청은 어떤 준비된 Pod까지 어떻게 이동하는가?",
    closure: "EndpointSlice의 준비된 주소와 Node의 데이터 경로가 실제 전달 대상을 만듭니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "lifecycle",
    slug: "kubernetes-rollout-termination-pdb-drain-hpa",
    title: "롤아웃·종료·PDB·drain·HPA",
    shortTitle: "교체·확장",
    track: "concept",
    form: "explanation",
    group: "operations",
    parent: "map",
    href: "/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview",
    question: "실행 중인 Pod 수가 바뀔 때 가용 수와 요청 경로는 어떻게 달라지는가?",
    closure: "삭제 시계, Eviction 허용, rollout 상한·하한, HPA 계산은 각자 다른 상태를 바꿉니다.",
    reviewStatus: "reviewed",
  },
  {
    id: "request",
    slug: "kubernetes-request-path-and-cka",
    title: "요청 경로 실습과 CKA",
    shortTitle: "요청 경로 실습",
    track: "practice",
    form: "lab",
    group: "map",
    href: "/cs/cloud/kubernetes-request-path-and-cka#overview",
    question: "한 Pod가 준비되지 않았을 때 어떤 증거 순서로 원인을 좁히고 복구를 확인하는가?",
    closure: "마지막 성공 전환 다음의 첫 실패를 찾아 수정 전후 사용자 요청으로 확인합니다.",
    conceptAnchors: [
      { node: "map", label: "Pod 요청의 전체 경로", href: "/cs/cloud/kubernetes-concept-map#map" },
      { node: "placement", label: "Scheduler의 Filter·Bind", href: "/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#small-case" },
      { node: "resources", label: "requests 합과 Allocatable", href: "/cs/cloud/kubernetes-requests-limits-allocatable-qos#scheduling-sum" },
      { node: "health", label: "Pending의 두 갈래", href: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#pending-two-kinds" },
      { node: "network", label: "Service에서 Pod까지", href: "/cs/cloud/kubernetes-network-packet-path#case" },
    ],
    reviewStatus: "reviewed",
  },
  {
    id: "operations",
    slug: "kubernetes-sre-slo-burn-rate-upgrades",
    title: "Kubernetes SRE와 변경 판단",
    shortTitle: "SRE·변경",
    track: "practice",
    form: "decision",
    group: "operations",
    href: "/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview",
    question: "사용자 영향과 원인 지표를 어떤 기준으로 연결해 알림·변경·복구를 결정하는가?",
    closure: "사용자 쪽 SLI와 burn rate로 알리고 error budget과 version skew 안에서 변경합니다.",
    conceptAnchors: [
      { node: "map", label: "Kubernetes 상태 소유권 지도", href: "/cs/cloud/kubernetes-concept-map#questions" },
      { node: "health", label: "Event의 보존과 집계", href: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#events" },
      { node: "network", label: "사용자 요청의 관측 경계", href: "/cs/cloud/kubernetes-network-packet-path#edge-mesh" },
      { node: "lifecycle", label: "종료·EndpointSlice의 두 시계", href: "/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#termination-flow" },
      { label: "SLI·SLO·burn rate 개념", href: "/cs/ai/llm-serving-ops#observability-aiops" },
    ],
    reviewStatus: "reviewed",
  },
] as const;

export function getKubernetesLearningNode(id: KubernetesLearningNodeId) {
  const node = KUBERNETES_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Unknown Kubernetes learning node: ${id}`);
  return node;
}

export function getKubernetesLearningGroup(id: KubernetesLearningGroup["id"]) {
  const group = KUBERNETES_LEARNING_GROUPS.find((candidate) => candidate.id === id);
  if (!group) throw new Error(`Unknown Kubernetes learning group: ${id}`);
  return group;
}

export function getKubernetesTrackNodes(track: KubernetesLearningTrack) {
  return KUBERNETES_LEARNING_NODES.filter((node) => node.track === track);
}

export const KUBERNETES_SUBCATEGORY_CURRICULA = Object.fromEntries(
  KUBERNETES_LEARNING_GROUPS.map((group) => [
    group.slug,
    KUBERNETES_LEARNING_NODES.filter((node) => node.group === group.id).map((node) => node.slug),
  ]),
) as Readonly<Record<string, readonly string[]>>;
