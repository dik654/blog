import type { CodeRef } from "@/components/code/types";
import cgroupV2Rst from "./codebase/linux/Documentation/admin-guide/cgroup-v2.rst?raw";
import psiRst from "./codebase/linux/Documentation/accounting/psi.rst?raw";
import fairC from "./codebase/linux/kernel/sched/fair.c?raw";
import coreC from "./codebase/linux/kernel/sched/core.c?raw";
import schedH from "./codebase/linux/kernel/sched/sched.h?raw";
import nsproxyH from "./codebase/linux/include/linux/nsproxy.h?raw";
import uapiSchedH from "./codebase/linux/include/uapi/linux/sched.h?raw";
import capabilityH from "./codebase/linux/include/uapi/linux/capability.h?raw";
import afInetC from "./codebase/linux/net/ipv4/af_inet.c?raw";
import helpersLinuxGo from "./codebase/kubernetes/pkg/kubelet/cm/helpers_linux.go?raw";
import cgroupManagerGo from "./codebase/kubernetes/pkg/kubelet/cm/cgroup_manager_linux.go?raw";
import kuberuntimeLinuxGo from "./codebase/kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container_linux.go?raw";
import namespaces7 from "./codebase/man-pages/man/man7/namespaces.7?raw";
import capabilities7 from "./codebase/man-pages/man/man7/capabilities.7?raw";

export const codeRefs: Record<string, CodeRef> = {
  "cpu-max-doc": {
    path: "linux/Documentation/admin-guide/cgroup-v2.rst",
    highlight: [1134, 1145],
    desc: "cpu.max의 형식과 기본값입니다. 두 숫자 \"$MAX $PERIOD\"는 \"$PERIOD마다 $MAX까지\"라는 뜻이고 기본값은 \"max 100000\"이라 100ms 주기에 상한이 없습니다.",
    annotations: [
      { lines: [1136, 1136], color: "sky", note: "기본값 \"max 100000\". 주기는 처음부터 100ms이고 상한만 비어 있습니다. kubelet도 같은 100000µs 주기를 씁니다." },
      { lines: [1142, 1144], color: "amber", note: "\"$PERIOD마다 $MAX까지\"가 전부입니다. 주기 안에서 언제 쓰는지는 묻지 않으므로 네 스레드가 12.5ms 만에 50ms를 다 쓰면 나머지 87.5ms는 멈춥니다." },
    ],
    code: cgroupV2Rst,
    lang: "python",
  },
  "cpu-weight-doc": {
    path: "linux/Documentation/admin-guide/cgroup-v2.rst",
    highlight: [1112, 1120],
    desc: "cpu.weight는 경합할 때의 비율이지 상한이 아닙니다. 기본 100, 범위 1~10000입니다.",
    annotations: [
      { lines: [1114, 1114], color: "sky", note: "기본 100. 형제 cgroup이 모두 100이면 CPU가 모자랄 때 1:1로 나눕니다. 놀고 있는 CPU는 weight와 무관하게 누구나 씁니다." },
      { lines: [1116, 1117], color: "amber", note: "범위 [1, 10000]. kubelet은 requests를 shares 2~262144로 바꾼 뒤 다시 이 범위로 눌러 넣습니다(getCPUWeight)." },
    ],
    code: cgroupV2Rst,
    lang: "python",
  },
  "cpu-stat-doc": {
    path: "linux/Documentation/admin-guide/cgroup-v2.rst",
    highlight: [1094, 1110],
    desc: "cpu.stat의 여덟 항목입니다. 컨트롤러가 켜지면 nr_periods·nr_throttled·throttled_usec이 추가되고, 이 셋이 quota 때문에 멈춘 시간의 증거입니다.",
    annotations: [
      { lines: [1106, 1108], color: "sky", note: "nr_throttled은 '멈춤이 있었던 주기 수', throttled_usec은 그 주기들에서 멈춘 시간의 합입니다. 평균 사용률이 낮아도 이 두 값이 오르면 limit이 지연을 만들고 있습니다." },
    ],
    code: cgroupV2Rst,
    lang: "python",
  },
  "memory-high-max-doc": {
    path: "linux/Documentation/admin-guide/cgroup-v2.rst",
    highlight: [1282, 1308],
    desc: "memory.high는 넘으면 감속과 강한 회수를 받지만 OOM killer를 부르지 않고, memory.max는 회수로 줄일 수 없으면 cgroup 안에서 OOM killer를 부릅니다.",
    annotations: [
      { lines: [1286, 1288], color: "amber", note: "\"throttled and put under heavy reclaim pressure\". 느려지는 것이 high의 증상입니다." },
      { lines: [1290, 1291], color: "rose", note: "\"Going over the high limit never invokes the OOM killer\". 죽지 않는다는 보장은 이 한 줄에서 옵니다." },
      { lines: [1302, 1304], color: "sky", note: "max는 \"can't be reduced\"일 때 그 cgroup 안에서 OOM killer를 부릅니다. 희생자 점수 계산은 메모리 글 7절에 있습니다." },
    ],
    code: cgroupV2Rst,
    lang: "python",
  },
  "memory-high-guideline": {
    path: "linux/Documentation/admin-guide/cgroup-v2.rst",
    highlight: [3200, 3214],
    desc: "커널 문서의 운영 지침입니다. high를 보수적으로 두면 죽는 대신 점진적으로 느려지므로 운영자가 관찰하고 고칠 시간을 번다고 적습니다.",
    annotations: [
      { lines: [3200, 3206], color: "sky", note: "\"a high boundary that is chosen too aggressively will not terminate the processes, but instead it will lead to gradual performance degradation\"." },
      { lines: [3208, 3214], color: "amber", note: "극단적으로는 high를 넘을 수 있고, 그 넘침을 막는 마지막 울타리가 max입니다. high는 신호, max는 벽입니다." },
    ],
    code: cgroupV2Rst,
    lang: "python",
  },
  "psi-doc": {
    path: "linux/Documentation/accounting/psi.rst",
    highlight: [38, 58],
    desc: "/proc/pressure/{cpu,memory,io}와 cgroup의 cpu.pressure·memory.pressure·io.pressure가 같은 형식으로 some·full 두 줄을 냅니다.",
    annotations: [
      { lines: [42, 43], color: "sky", note: "some avg10= avg60= avg300= total= / full ... 형식입니다. avg는 최근 10·60·300초 비율, total은 누적 µs입니다." },
      { lines: [45, 50], color: "amber", note: "some은 적어도 한 작업이 그 자원 때문에 멈춘 시간 비율, full은 일할 수 있는 작업 전부가 멈춘 비율입니다. CPU full은 시스템 수준에서는 정의되지 않습니다." },
    ],
    code: psiRst,
    lang: "python",
  },
  "psi-trigger": {
    path: "linux/Documentation/accounting/psi.rst",
    highlight: [83, 88],
    desc: "PSI 트리거 형식입니다. \"some 150000 1000000\"은 1초 창에서 150ms 이상 멈추면 깨워 달라는 뜻입니다.",
    annotations: [
      { lines: [85, 86], color: "sky", note: "메모리 some 150ms/1s 예시. systemd-oomd 같은 사용자 공간 도구가 커널 OOM보다 먼저 움직이는 근거가 이 트리거입니다." },
    ],
    code: psiRst,
    lang: "python",
  },
  "cfs-slice": {
    path: "linux/kernel/sched/fair.c",
    highlight: [5736, 5765],
    desc: "quota는 cgroup 전체 통(cfs_b->runtime)에 주기마다 채워지고, 각 CPU의 run queue는 5ms slice 단위로 꺼내 씁니다.",
    annotations: [
      { lines: [5736, 5739], color: "sky", note: "slice는 sysctl_sched_cfs_bandwidth_slice(기본 5000µs, 124행)입니다. 네 CPU가 각각 5ms씩 꺼내면 통에서 20ms가 한 번에 빠집니다." },
      { lines: [5748, 5765], color: "amber", note: "__refill_cfs_bandwidth_runtime: 주기 timer가 부르면 runtime += quota 하고 quota + burst로 자릅니다. 이번 주기에 못 쓴 몫은 burst가 0이면 넘어가지 않습니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "cfs-assign": {
    path: "linux/kernel/sched/fair.c",
    highlight: [5772, 5829],
    desc: "실행 시간이 쌓일 때마다 run queue의 runtime_remaining에서 빼고, 바닥나면 통에서 slice를 더 받아 오며, 통도 비어 있으면 재스케줄을 요청해 throttle로 갑니다.",
    annotations: [
      { lines: [5786, 5790], color: "sky", note: "통(cfs_b->runtime)에 남은 만큼만 min()으로 받습니다. 주기 1에서 50ms가 전부 나가면 다음 요청은 amount 0입니다." },
      { lines: [5812, 5829], color: "amber", note: "__account_cfs_rq_runtime: delta_exec를 빼고, 음수가 됐는데 slice를 못 받으면 resched_curr로 현재 작업을 내립니다. 이 줄이 '12.5ms에 멈춤'의 시작점입니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "cfs-throttle": {
    path: "linux/kernel/sched/fair.c",
    highlight: [5915, 5935],
    desc: "throttle_cfs_rq는 마지막으로 1ns만 더 받아 보고, 그것도 못 받으면 이 cgroup의 run queue를 통째로 dequeue합니다.",
    annotations: [
      { lines: [5925, 5934], color: "sky", note: "1ns 재시도는 '막 채워진 통'과의 경주를 피하려는 것입니다. 실패하면 dequeue = 1이고 네 스레드가 모두 run queue에서 내려옵니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "cfs-period-timer": {
    path: "linux/kernel/sched/fair.c",
    highlight: [6279, 6330],
    desc: "100ms마다 깨어나는 period timer입니다. nr_periods를 올리고 통을 다시 채운 뒤, 멈춰 있던 run queue가 있으면 nr_throttled을 올리고 runtime을 나눠 주며 풀어 줍니다.",
    annotations: [
      { lines: [6287, 6291], color: "sky", note: "nr_periods += overrun 뒤 __refill로 통을 채웁니다. 주기 2의 시작, 벽시계 100ms 시점입니다." },
      { lines: [6304, 6305], color: "amber", note: "멈춘 queue가 있던 주기만 nr_throttled에 셉니다. cpu.stat의 nr_throttled이 여기서 오릅니다." },
      { lines: [6310, 6314], color: "violet", note: "distribute_cfs_runtime이 throttled 목록을 돌며 runtime을 나눠 주고 unthrottle합니다. 남은 2.5ms × 4가 이때 돌기 시작합니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "cfs-check": {
    path: "linux/kernel/sched/fair.c",
    highlight: [6488, 6503],
    desc: "스케줄러가 작업을 바꿀 때마다 부르는 판정입니다. runtime_remaining이 0 이하이고 이미 멈춘 상태가 아니면 throttle_cfs_rq로 갑니다.",
    annotations: [
      { lines: [6493, 6494], color: "sky", note: "runtime_remaining > 0이면 바로 false. 대부분의 주기는 이 줄에서 끝납니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "cpu-max-write": {
    path: "linux/kernel/sched/core.c",
    highlight: [9291, 9322],
    desc: "cpu.max에 쓴 값의 허용 범위입니다. quota와 period 모두 1ms 이상, period는 1초 이하여야 합니다.",
    annotations: [
      { lines: [9291, 9292], color: "sky", note: "max 1s, min 1ms. kubelet의 MinQuotaPeriod 1000µs와 CPUCFSQuotaPeriod 기본 100ms가 이 범위 안에 있습니다." },
      { lines: [9312, 9313], color: "amber", note: "quota가 1ms 미만이면 -EINVAL. 그래서 kubelet은 limit 10m 미만도 quota 1000µs로 올립니다(MinMilliCPULimit 10)." },
    ],
    code: coreC,
    lang: "c",
  },
  "cpu-weight-write": {
    path: "linux/kernel/sched/core.c",
    highlight: [9797, 9812],
    desc: "cpu.weight에 쓴 1~10000을 스케줄러의 shares(기본 1024)로 바꿔 저장합니다.",
    annotations: [
      { lines: [9806, 9808], color: "sky", note: "sched_weight_from_cgroup(100) = 1024. 커널은 weight 100을 shares 1024에 대응시키므로 kubelet이 쓴 weight 39는 shares 399로 저장됩니다." },
    ],
    code: coreC,
    lang: "c",
  },
  "cpu-stat-show": {
    path: "linux/kernel/sched/core.c",
    highlight: [9583, 9590],
    desc: "cpu.stat의 nr_periods·nr_throttled·throttled_time을 출력하는 함수입니다. 값의 출처는 fair.c의 cfs_bandwidth 구조체입니다.",
    annotations: [{ lines: [9588, 9590], color: "sky", note: "세 줄이 fair.c에서 올린 카운터를 그대로 보여 줍니다. 컨테이너 안에서 cat /sys/fs/cgroup/cpu.stat으로 읽을 수 있습니다." }],
    code: coreC,
    lang: "c",
  },
  "weight-conversion": {
    path: "linux/kernel/sched/sched.h",
    highlight: [258, 273],
    desc: "cgroup weight ↔ 스케줄러 shares 변환식입니다. weight × 1024 ÷ 100을 반올림합니다.",
    annotations: [
      { lines: [258, 262], color: "sky", note: "주석이 'MIN·DFL·MAX = 1·100·10000'이고 'shares 값에 잘 대응된다'고 적습니다. 100 ↔ 1024가 기준점입니다." },
      { lines: [263, 266], color: "amber", note: "weight 20 → 205, 39 → 399, 79 → 809. kubelet이 준 weight가 커널 안에서 다시 shares가 됩니다." },
    ],
    code: schedH,
    lang: "c",
  },
  "nsproxy": {
    path: "linux/include/linux/nsproxy.h",
    highlight: [32, 42],
    desc: "작업(task)이 가리키는 namespace 묶음입니다. uts·ipc·mnt·pid·net·time·cgroup 포인터가 한 구조체에 모여 있고, user namespace는 자격 증명(cred) 쪽에 따로 있습니다.",
    annotations: [
      { lines: [34, 38], color: "sky", note: "컨테이너 하나는 이 포인터들 가운데 몇 개를 새 namespace로 바꾼 프로세스일 뿐입니다. 바꾸지 않은 포인터는 호스트와 같은 객체를 가리킵니다." },
      { lines: [37, 37], color: "amber", note: "pid_ns_for_children: 자식에게 적용될 PID namespace. unshare(CLONE_NEWPID) 뒤 다음 fork부터 새 namespace의 PID 1이 됩니다." },
    ],
    code: nsproxyH,
    lang: "c",
  },
  "clone-flags": {
    path: "linux/include/uapi/linux/sched.h",
    highlight: [20, 44],
    desc: "clone·unshare·setns가 받는 CLONE_NEW* 플래그 여덟 개입니다. 런타임은 이 비트들을 OR 해서 컨테이너의 첫 프로세스를 만듭니다.",
    annotations: [
      { lines: [20, 20], color: "sky", note: "CLONE_NEWNS(0x20000)가 mount namespace입니다. 이름이 NS인 것은 처음 만들어진 namespace라서입니다." },
      { lines: [28, 33], color: "amber", note: "CGROUP·UTS·IPC·USER·PID·NET 여섯 개. Pod sandbox는 NET·UTS·IPC를 만들고 컨테이너마다 NS·PID를 더합니다." },
      { lines: [44, 44], color: "violet", note: "CLONE_NEWTIME(0x80)은 2020년에 추가된 여덟째 namespace로 boot·monotonic clock 오프셋만 격리합니다." },
    ],
    code: uapiSchedH,
    lang: "c",
  },
  "cap-numbers": {
    path: "linux/include/uapi/linux/capability.h",
    highlight: [114, 190],
    desc: "capability 번호표입니다. 번호 n은 bitmap의 n번째 비트이고 /proc/PID/status의 CapEff가 이 bitmap을 16진수로 보여 줍니다.",
    annotations: [
      { lines: [184, 184], color: "sky", note: "CAP_NET_BIND_SERVICE = 10 → 1 << 10 = 0x400. 1024 미만 포트에 bind할 권한입니다." },
      { lines: [114, 114], color: "amber", note: "CAP_CHOWN = 0이 최하위 비트. 기본 컨테이너 bitmap 0xa80425fb의 마지막 1이 이 비트입니다." },
    ],
    code: capabilityH,
    lang: "c",
  },
  "bind-cap-check": {
    path: "linux/net/ipv4/af_inet.c",
    highlight: [509, 514],
    desc: "bind()가 1024 미만 포트를 받을 때 capability를 확인하는 자리입니다. 없으면 -EACCES입니다.",
    annotations: [
      { lines: [511, 513], color: "sky", note: "inet_port_requires_bind_service(net, snum)이 참이고 ns_capable(net->user_ns, CAP_NET_BIND_SERVICE)가 거짓이면 실패. 확인 대상은 그 네트워크 namespace를 소유한 user namespace입니다." },
    ],
    code: afInetC,
    lang: "c",
  },
  "kubelet-quota-shares": {
    path: "kubernetes/pkg/kubelet/cm/helpers_linux.go",
    highlight: [94, 160],
    desc: "kubelet이 milliCPU를 CFS quota와 shares로 바꾸는 식입니다. quota = milli × period ÷ 1000, shares = milli × 1024 ÷ 1000입니다.",
    annotations: [
      { lines: [97, 108], color: "sky", note: "MinShares 2, MaxShares 262144, SharesPerCPU 1024, QuotaPeriod 100000µs, MinQuotaPeriod 1000µs. 전부 커널 상수를 그대로 옮긴 값입니다." },
      { lines: [134, 139], color: "amber", note: "limit 500m → 500 × 100000 ÷ 1000 = 50000µs. 1ms 미만이면 1000으로 올립니다." },
      { lines: [152, 158], color: "violet", note: "request 500m → 512 shares, 1000m → 1024, 2000m → 2048. 0이면 커널 기본 '없음'과 맞추려고 2를 돌려줍니다." },
    ],
    code: helpersLinuxGo,
    lang: "go",
  },
  "kubelet-cpu-weight": {
    path: "kubernetes/pkg/kubelet/cm/cgroup_manager_linux.go",
    highlight: [268, 277],
    desc: "cgroup v2 노드에서 shares [2, 262144]를 cpu.weight [1, 10000]으로 눌러 넣는 선형식입니다.",
    annotations: [
      { lines: [276, 276], color: "sky", note: "1 + (shares − 2) × 9999 ÷ 262142. 512 → 20, 1024 → 39, 2048 → 79. 커널의 100 ↔ 1024 기준과 다르지만 Pod끼리의 비율은 보존됩니다." },
    ],
    code: cgroupManagerGo,
    lang: "go",
  },
  "kubelet-linux-resources": {
    path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container_linux.go",
    highlight: [355, 402],
    desc: "컨테이너 하나의 spec을 CRI LinuxContainerResources로 바꾸는 함수입니다. requests → CpuShares, limits.cpu → CpuQuota·CpuPeriod, limits.memory → MemoryLimitInBytes, cgroup v2면 memory.oom.group=1입니다.",
    annotations: [
      { lines: [365, 371], color: "sky", note: "request가 없고 limit만 있으면 limit으로 shares를 계산합니다. API 서버가 하는 기본값 채우기를 kubelet이 한 번 더 합니다." },
      { lines: [379, 390], color: "amber", note: "cpuCFSQuota가 켜져 있으면(기본 true) limit → quota. disableCPUQuota면 −1(무제한)입니다." },
      { lines: [394, 400], color: "violet", note: "singleProcessOOMKill이 비어 있으면 memory.oom.group=1을 써 컨테이너 cgroup 전체를 함께 죽입니다. 메모리 글 8절과 같은 줄입니다." },
    ],
    code: kuberuntimeLinuxGo,
    lang: "go",
  },
  "kubelet-memory-high": {
    path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container_linux.go",
    highlight: [238, 278],
    desc: "MemoryQoS 기능 게이트가 켜졌을 때만 memory.high를 requests + factor × (limit − requests)로 계산하고, 꺼져 있으면 \"max\"로 되돌립니다.",
    annotations: [
      { lines: [238, 244], color: "sky", note: "memory.high = floor[(requests + factor × (limits 또는 Allocatable − requests)) / pageSize] × pageSize. KEP-2570, v1.27 alpha 식입니다." },
      { lines: [270, 277], color: "amber", note: "MemoryQoS가 꺼진 기본 상태에서는 memory.high = \"max\"를 명시해 둡니다. 그래서 기본 Kubernetes 컨테이너는 느려지는 구간 없이 바로 memory.max의 OOM을 만납니다." },
    ],
    code: kuberuntimeLinuxGo,
    lang: "go",
  },
  "namespaces-man": {
    path: "man-pages/man/man7/namespaces.7",
    highlight: [28, 70],
    desc: "namespace 여덟 종류와 각각이 격리하는 자원의 표입니다.",
    annotations: [
      { lines: [38, 65], color: "sky", note: "Cgroup·IPC·Network·Mount·PID·Time·User·UTS. 메모리·CPU 양은 어느 namespace도 격리하지 않습니다. 그것은 cgroup의 일입니다." },
    ],
    code: namespaces7,
    lang: "python",
  },
  "capabilities-man": {
    path: "man-pages/man/man7/capabilities.7",
    highlight: [938, 975],
    desc: "스레드마다 있는 다섯 집합 가운데 Bounding과 Ambient의 정의입니다. 컨테이너 런타임이 손대는 집합이 이 둘입니다.",
    annotations: [
      { lines: [938, 950], color: "sky", note: "Bounding: execve 때 얻을 수 있는 능력의 상한. 컨테이너의 기본 14개 밖에 있는 능력은 setuid 바이너리를 실행해도 얻지 못합니다." },
      { lines: [951, 975], color: "amber", note: "Ambient: 권한 없는 프로그램을 execve해도 유지되는 집합. runAsUser 1000에 capabilities.add를 주면 런타임이 이 집합까지 채워야 실제로 쓸 수 있습니다." },
    ],
    code: capabilities7,
    lang: "python",
  },
  "capabilities-bind-man": {
    path: "man-pages/man/man7/capabilities.7",
    highlight: [266, 268],
    desc: "CAP_NET_BIND_SERVICE의 정의: 1024 미만 특권 포트에 소켓을 bind한다.",
    annotations: [{ lines: [266, 268], color: "sky", note: "번호 10, 비트 0x400. 80·443에 non-root로 bind하려면 이 능력 하나면 됩니다. NET_ADMIN이나 root는 필요 없습니다." }],
    code: capabilities7,
    lang: "python",
  },
};
