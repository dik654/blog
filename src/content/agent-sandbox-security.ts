import { defineArticleFlow } from "@/components/viz/article-flow";

export const AGENT_SANDBOX_FLOW = defineArticleFlow([
  {
    id: "untrusted-action",
    stage: "background",
    label: "에이전트가 외부 입력을 바탕으로 코드·도구를 실행한다",
  },
  {
    id: "mixed-signals",
    stage: "problem",
    label: "관찰 신호와 실제 침해 경로를 같은 위험도로 취급하기 쉽다",
  },
  {
    id: "boundary-chain",
    stage: "idea",
    label: "signal→capability→boundary crossing→impact로 위협을 추적한다",
  },
  {
    id: "layered-controls",
    stage: "implementation",
    label: "credential·egress·kernel·storage 통제를 독립적으로 결합한다",
  },
] as const);

export const THREAT_CHAIN = [
  {
    id: "input",
    label: "입력·prompt",
    question: "공격자가 무엇을 유도할 수 있는가?",
  },
  {
    id: "execution",
    label: "코드·tool 실행",
    question: "어떤 syscall·tool·파일을 사용할 수 있는가?",
  },
  {
    id: "capability",
    label: "보유 capability",
    question: "token·network route·mount·device가 있는가?",
  },
  {
    id: "crossing",
    label: "경계 통과",
    question: "control plane·내부망·host kernel로 닿는가?",
  },
  {
    id: "impact",
    label: "실제 영향",
    question: "유출·변조·횡적 이동·host 장악이 가능한가?",
  },
] as const;

export const RUNTIME_BOUNDARIES = [
  {
    runtime: "runc",
    kernel: "host kernel 공유",
    boundary: "namespace·cgroup·capability·LSM",
    strength: "호환성과 밀도",
    caveat: "kernel attack surface를 guest kernel로 분리하지 않는다",
  },
  {
    runtime: "runc + seccomp",
    kernel: "host kernel 공유",
    boundary: "위 경계 + syscall filter",
    strength: "불필요한 syscall 차단",
    caveat: "별도 kernel이 아니며 filesystem·network 정책을 대신하지 않는다",
  },
  {
    runtime: "gVisor",
    kernel: "Sentry application kernel",
    boundary: "system call 재구현·Gofer/LISAFS·선택적 host interface",
    strength: "host kernel에 직접 닿는 surface 축소",
    caveat: "호환성 비용이 있고 GPU ioctl은 nvproxy를 통해 host driver로 간다",
  },
  {
    runtime: "Kata Containers",
    kernel: "pod별 guest kernel",
    boundary: "lightweight VM·VMM·hardware virtualization",
    strength: "host와 guest kernel 경계",
    caveat: "기동·메모리·운영 비용과 device passthrough 조건이 따른다",
  },
] as const;

export const DEFENSE_LAYERS = [
  ["Identity", "전용 ServiceAccount, 최소 RBAC, token 자동 mount 차단"],
  [
    "Network",
    "default-deny에서 시작해 DNS·FQDN·egress proxy를 필요한 만큼 허용",
  ],
  ["Kernel", "PSS Restricted·seccomp, 위험도에 따라 gVisor 또는 Kata"],
  ["Filesystem", "read-only root, 제한된 writable volume, secret 분리"],
  ["Lifecycle", "resource limit, session 종료 시 폐기, trace와 alert"],
] as const;

export const WORKLOAD_DECISIONS = [
  {
    trust: "신뢰하는 내부 서비스",
    runtime: "runc",
    controls: "PSS Restricted + RuntimeDefault + 최소 RBAC + default-deny",
  },
  {
    trust: "부분 신뢰 코드·플러그인",
    runtime: "gVisor 우선 검토",
    controls: "호환성 test + FQDN/egress proxy + 제한된 writable path",
  },
  {
    trust: "사용자·에이전트 생성 코드",
    runtime: "gVisor 또는 Kata",
    controls: "세션 격리 + capability allowlist + 강제 egress proxy + 폐기",
  },
  {
    trust: "VM급 격리가 필요한 GPU 작업",
    runtime: "Kata + VFIO 지원 VMM 검토",
    controls: "device lifecycle·IOMMU·operator 지원 범위를 별도 검증",
  },
] as const;

export const AGENT_SECURITY_SOURCES = {
  gvisorSecurity: {
    label: "gVisor Security Model",
    href: "https://gvisor.dev/docs/architecture_guide/security/",
  },
  gvisorGpu: {
    label: "gVisor GPU Support",
    href: "https://gvisor.dev/docs/user_guide/gpu/",
  },
  kataVirtualization: {
    label: "Kata Containers virtualization design",
    href: "https://github.com/kata-containers/kata-containers/blob/main/docs/design/virtualization.md",
  },
  kataGpu: {
    label: "Kata NVIDIA GPU passthrough",
    href: "https://github.com/kata-containers/kata-containers/blob/main/docs/use-cases/NVIDIA-GPU-passthrough-and-Kata-QEMU.md",
  },
  networkPolicy: {
    label: "Kubernetes NetworkPolicy",
    href: "https://kubernetes.io/docs/concepts/services-networking/network-policies/",
  },
  serviceAccounts: {
    label: "Kubernetes ServiceAccounts",
    href: "https://kubernetes.io/docs/concepts/security/service-accounts/",
  },
  podSecurity: {
    label: "Kubernetes Pod Security Standards",
    href: "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  },
  seccomp: {
    label: "Kubernetes seccomp tutorial",
    href: "https://kubernetes.io/docs/tutorials/security/seccomp/",
  },
  ciliumDns: {
    label: "Cilium DNS and FQDN policies",
    href: "https://docs.cilium.io/en/stable/security/dns/",
  },
} as const;
