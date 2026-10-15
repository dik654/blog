import type { CodeRef } from "@/components/code/types";
import oomKillC from "./codebase/linux/mm/oom_kill.c?raw";
import showMemC from "./codebase/linux/mm/show_mem.c?raw";
import memcontrolC from "./codebase/linux/mm/memcontrol.c?raw";
import pageAllocC from "./codebase/linux/mm/page_alloc.c?raw";
import internalH from "./codebase/linux/mm/internal.h?raw";
import procBaseC from "./codebase/linux/fs/proc/base.c?raw";
import cgroupV2Rst from "./codebase/linux/Documentation/admin-guide/cgroup-v2.rst?raw";
import procRst from "./codebase/linux/Documentation/filesystems/proc.rst?raw";
import psiRst from "./codebase/linux/Documentation/accounting/psi.rst?raw";
import vmRst from "./codebase/linux/Documentation/admin-guide/sysctl/vm.rst?raw";
import overcommitRst from "./codebase/linux/Documentation/mm/overcommit-accounting.rst?raw";
import mmInlineH from "./codebase/linux/include/linux/mm_inline.h?raw";
import kubeletPolicyGo from "./codebase/kubernetes/pkg/kubelet/qos/policy.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "mem-available": {
    path: "linux/mm/show_mem.c",
    highlight: [32, 72],
    desc: "/proc/meminfo의 MemAvailable과 free의 available 열이 이 함수의 결과입니다. 빈 page에 회수할 수 있는 page cache와 slab을 더하되 절반 또는 low watermark만큼은 남겨 둡니다.",
    annotations: [
      { lines: [47, 47], color: "sky", note: "출발점은 MemFree에서 커널 예약분(totalreserve_pages)을 뺀 값입니다. 이 글의 사례에서는 1,536 − 160 = 1,376 MiB입니다." },
      { lines: [54, 57], color: "amber", note: "file LRU의 page cache 9,216 MiB에서 min(절반, low watermark 64 MiB)를 빼고 더합니다. 9,152 MiB가 회수 가능한 몫으로 잡힙니다." },
      { lines: [64, 67], color: "violet", note: "회수 가능한 slab 512 MiB도 같은 방식으로 448 MiB만 셉니다. 합이 available 10,976 MiB입니다." },
    ],
    code: showMemC,
    lang: "c",
  },
  "mem-available-doc": {
    path: "linux/Documentation/filesystems/proc.rst",
    highlight: [1076, 1084],
    desc: "MemAvailable은 swap 없이 새 프로그램을 시작할 수 있는 양의 추정치라고 커널 문서가 정의합니다.",
    annotations: [
      { lines: [1077, 1080], color: "sky", note: "MemFree, SReclaimable, file LRU 크기, zone의 low watermark로 계산한다고 적습니다. show_mem.c의 세 덧셈과 같은 재료입니다." },
      { lines: [1081, 1084], color: "amber", note: "page cache 전부를 비울 수는 없고 slab도 전부 회수되지 않는다는 점을 반영한 추정치입니다. 정확한 값이 아니라 판단용 숫자입니다." },
    ],
    code: procRst,
    lang: "python",
  },
  "file-lru": {
    path: "linux/include/linux/mm_inline.h",
    highlight: [20, 31],
    desc: "page가 file LRU와 anon LRU 중 어디에 놓이는지 정하는 함수입니다. tmpfs·공유 메모리는 swap으로만 내보낼 수 있어 anon 쪽에 놓입니다.",
    annotations: [
      { lines: [23, 26], color: "sky", note: "일반 파일 page cache는 1, tmpfs folio는 0입니다. si_mem_available은 file LRU만 더하므로 /dev/shm의 page는 available에 들어가지 않습니다." },
      { lines: [28, 31], color: "amber", note: "판정 기준은 swap-backed 여부 하나입니다. 디스크 원본이 없는 page는 비울 수 없고 swap으로만 내보낼 수 있습니다." },
    ],
    code: mmInlineH,
    lang: "c",
  },
  "cached-doc": {
    path: "linux/Documentation/filesystems/proc.rst",
    highlight: [1088, 1091],
    desc: "/proc/meminfo의 Cached에는 파일 page cache뿐 아니라 tmpfs와 shmem도 들어갑니다.",
    annotations: [
      { lines: [1089, 1090], color: "sky", note: "free의 buff/cache 열이 이 값을 씁니다. 그래서 buff/cache 전체를 비울 수 있는 양으로 읽으면 tmpfs만큼 과대평가합니다." },
    ],
    code: procRst,
    lang: "python",
  },
  "commit-limit-doc": {
    path: "linux/Documentation/filesystems/proc.rst",
    highlight: [1162, 1176],
    desc: "overcommit 모드 2에서 commit 총량의 상한인 CommitLimit의 계산식입니다.",
    annotations: [
      { lines: [1169, 1172], color: "sky", note: "RAM 16,384 MiB, swap 0, overcommit_ratio 50이면 CommitLimit은 8,192 MiB입니다. 그 뒤의 malloc은 실패로 돌아옵니다." },
    ],
    code: procRst,
    lang: "python",
  },
  "overcommit-modes": {
    path: "linux/Documentation/mm/overcommit-accounting.rst",
    highlight: [5, 37],
    desc: "vm.overcommit_memory의 세 모드입니다. 기본값 0은 명백한 과다 요청만 거절합니다.",
    annotations: [
      { lines: [7, 10], color: "sky", note: "0은 휴리스틱입니다. 주소 공간을 크게 잡아도 실제로 쓰기 전에는 물리 page가 붙지 않으므로 대부분 통과합니다." },
      { lines: [19, 28], color: "amber", note: "2는 swap + RAM의 일정 비율(기본 50%)을 넘는 commit을 거절합니다. 나중에 OOM으로 죽는 대신 할당 순간 오류를 받습니다." },
    ],
    code: overcommitRst,
    lang: "python",
  },
  "swappiness-doc": {
    path: "linux/Documentation/admin-guide/sysctl/vm.rst",
    highlight: [943, 965],
    desc: "swappiness는 swap과 파일 page 회수의 상대 I/O 비용을 0~200으로 적는 값이며 기본은 60입니다.",
    annotations: [
      { lines: [946, 950], color: "sky", note: "100이면 page cache와 swap 대상 page에 같은 회수 압력을 줍니다. 낮을수록 swap을 비싸게 봅니다." },
      { lines: [964, 965], color: "amber", note: "0이어도 swap을 아예 끄지는 않습니다. 빈 page와 파일 page가 high watermark 아래로 내려가면 swap을 시작합니다." },
    ],
    code: vmRst,
    lang: "python",
  },
  "panic-on-oom-doc": {
    path: "linux/Documentation/admin-guide/sysctl/vm.rst",
    highlight: [857, 883],
    desc: "OOM 때 프로세스 하나를 죽일지 커널을 panic시킬지 정하는 sysctl입니다. 기본값은 0입니다.",
    annotations: [
      { lines: [862, 864], color: "sky", note: "0이면 OOM killer가 프로세스 하나를 고릅니다. 이 글의 모든 사례는 이 기본값입니다." },
      { lines: [873, 876], color: "amber", note: "2이면 memory cgroup 안의 OOM이어도 시스템 전체가 panic합니다. 클러스터 failover를 위한 선택입니다." },
    ],
    code: vmRst,
    lang: "python",
  },
  "psi-doc": {
    path: "linux/Documentation/accounting/psi.rst",
    highlight: [34, 60],
    desc: "/proc/pressure/memory의 some·full 줄이 무엇을 세는지 정의합니다.",
    annotations: [
      { lines: [45, 46], color: "sky", note: "some은 적어도 한 작업이 메모리를 기다리며 멈춰 있던 시간의 비율입니다." },
      { lines: [48, 53], color: "amber", note: "full은 일하던 모든 작업이 동시에 멈춘 시간의 비율이고, 이 상태가 길면 thrashing으로 봅니다." },
    ],
    code: psiRst,
    lang: "python",
  },
  "alloc-slowpath": {
    path: "linux/mm/page_alloc.c",
    highlight: [4204, 4440],
    desc: "빈 page가 watermark 아래면 할당은 느린 경로로 들어가 kswapd 깨우기 → 직접 회수 → compaction → 재시도 → OOM 순서를 밟습니다.",
    annotations: [
      { lines: [4279, 4280], color: "sky", note: "먼저 백그라운드 회수 스레드 kswapd를 깨웁니다. 할당한 프로세스는 아직 기다리지 않습니다." },
      { lines: [4379, 4383], color: "amber", note: "그래도 page가 없으면 할당한 프로세스가 직접 회수(direct reclaim)를 합니다. 이 시간이 지연으로 보입니다." },
      { lines: [4403, 4405], color: "violet", note: "회수가 진전을 보이는 동안은 다시 시도합니다. 진전이 없을 때만 다음 줄로 내려갑니다." },
      { lines: [4428, 4431], color: "rose", note: "회수가 실패했다는 주석과 함께 OOM 경로로 들어갑니다." },
    ],
    code: pageAllocC,
    lang: "c",
  },
  "memcg-charge": {
    path: "linux/mm/memcontrol.c",
    highlight: [2157, 2290],
    desc: "cgroup 안에서 page를 새로 쓸 때마다 memory.max까지 남은 몫을 확인하는 charge 함수입니다. 넘으면 그 cgroup 안에서 회수하고, 16번 재시도 뒤에도 안 되면 그 cgroup의 OOM으로 갑니다.",
    annotations: [
      { lines: [2177, 2178], color: "sky", note: "새로 쓸 page를 더해도 memory.max 아래면 여기서 끝납니다. 대부분의 할당은 이 두 줄에서 바로 통과합니다." },
      { lines: [2207, 2212], color: "amber", note: "한도를 넘으면 memory.events의 max를 하나 올리고, 회수하는 동안을 PSI memory stall로 기록합니다. 회수 대상은 이 cgroup의 page뿐입니다." },
      { lines: [2244, 2245], color: "violet", note: "MAX_RECLAIM_RETRIES(16)번까지 회수를 반복합니다. cgroup의 page cache가 남아 있으면 이 단계에서 해결됩니다." },
      { lines: [2259, 2264], color: "rose", note: "재시도가 모두 실패하면 mem_cgroup_oom으로 이 cgroup 안에서만 희생자를 고릅니다." },
    ],
    code: memcontrolC,
    lang: "c",
  },
  "reclaim-retries": {
    path: "linux/mm/internal.h",
    highlight: [468, 468],
    desc: "회수를 몇 번 반복한 뒤 OOM으로 넘어갈지 정하는 상수입니다.",
    annotations: [{ lines: [468, 468], color: "sky", note: "16입니다. memcg charge와 page allocator가 같은 상수를 씁니다." }],
    code: internalH,
    lang: "c",
  },
  "memcg-get-max": {
    path: "linux/mm/memcontrol.c",
    highlight: [1557, 1574],
    desc: "memcg OOM에서 oom_badness의 totalpages가 되는 값입니다. memory.max에 쓸 수 있는 swap을 더합니다.",
    annotations: [
      { lines: [1559, 1559], color: "sky", note: "memory.max가 2 GiB면 524,288 page에서 출발합니다." },
      { lines: [1569, 1571], color: "amber", note: "swap이 없는 노드에서는 total_swap_pages가 0이라 더해지는 몫이 없습니다. totalpages는 524,288 그대로입니다." },
    ],
    code: memcontrolC,
    lang: "c",
  },
  "oom-badness": {
    path: "linux/mm/oom_kill.c",
    highlight: [193, 239],
    desc: "OOM killer가 프로세스마다 매기는 점수입니다. 메모리 사용량 page 수에 oom_score_adj를 totalpages의 1/1000 단위로 바꿔 더합니다.",
    annotations: [
      { lines: [219, 225], color: "rose", note: "oom_score_adj가 −1000(OOM_SCORE_ADJ_MIN)이면 LONG_MIN을 돌려 후보에서 아예 빠집니다." },
      { lines: [231, 232], color: "sky", note: "RSS + swap에 나간 page + page table을 page 단위로 더합니다. 1,536 MiB RSS와 page table 3 MiB면 393,216 + 768 = 393,984입니다." },
      { lines: [235, 237], color: "amber", note: "adj에 totalpages ÷ 1000을 곱합니다. memory.max 2 GiB면 524라서 adj −500은 −262,000 page로 바뀝니다." },
    ],
    code: oomKillC,
    lang: "c",
  },
  "oom-constraint": {
    path: "linux/mm/oom_kill.c",
    highlight: [249, 266],
    desc: "OOM이 어느 범위에서 났는지에 따라 totalpages가 달라집니다.",
    annotations: [
      { lines: [260, 263], color: "sky", note: "cgroup OOM이면 totalpages는 그 cgroup의 상한입니다." },
      { lines: [265, 266], color: "amber", note: "전역 OOM이면 RAM 전체와 swap의 합입니다. 16 GiB 노드라면 4,194,304 page입니다." },
    ],
    code: oomKillC,
    lang: "c",
  },
  "oom-select": {
    path: "linux/mm/oom_kill.c",
    highlight: [309, 380],
    desc: "후보를 하나씩 평가해 점수가 가장 큰 프로세스를 고르는 반복문입니다.",
    annotations: [
      { lines: [319, 331], color: "violet", note: "이미 죽어 가는 희생자가 있으면 새로 고르지 않고 멈춥니다. 같은 OOM에서 여럿을 연달아 죽이지 않으려는 장치입니다." },
      { lines: [342, 351], color: "sky", note: "점수가 지금까지의 최대보다 작으면 건너뛰고, 크거나 같으면 그 프로세스를 새 후보로 둡니다." },
      { lines: [369, 379], color: "amber", note: "cgroup OOM이면 그 cgroup의 작업만, 전역 OOM이면 모든 프로세스를 훑습니다." },
    ],
    code: oomKillC,
    lang: "c",
  },
  "oom-kill-sigkill": {
    path: "linux/mm/oom_kill.c",
    highlight: [916, 956],
    desc: "고른 희생자에게 SIGKILL을 보내고 dmesg에 남을 한 줄을 출력합니다.",
    annotations: [
      { lines: [947, 947], color: "rose", note: "SIGKILL은 9번 신호입니다. 셸과 컨테이너 런타임은 이 종료를 128 + 9 = 137로 보고합니다." },
      { lines: [949, 955], color: "sky", note: "'Killed process … anon-rss … oom_score_adj' 줄이 장애 뒤 dmesg와 journalctl -k에서 찾는 증거입니다." },
    ],
    code: oomKillC,
    lang: "c",
  },
  "oom-group": {
    path: "linux/mm/oom_kill.c",
    highlight: [1012, 1058],
    desc: "memory.oom.group이 켜진 cgroup이면 희생자 하나가 아니라 그 cgroup의 모든 작업을 함께 죽입니다.",
    annotations: [
      { lines: [1040, 1045], color: "sky", note: "희생자를 죽이기 전에 함께 죽일 cgroup이 있는지 먼저 봅니다." },
      { lines: [1047, 1057], color: "amber", note: "oom.group이면 cgroup 안을 훑으며 oom_score_adj −1000이 아닌 작업을 모두 죽입니다." },
    ],
    code: oomKillC,
    lang: "c",
  },
  "out-of-memory": {
    path: "linux/mm/oom_kill.c",
    highlight: [1107, 1176],
    desc: "OOM killer의 입구입니다. 이미 죽어 가는 작업을 먼저 보고, 범위를 정하고, panic 설정을 확인한 뒤 희생자를 고릅니다.",
    annotations: [
      { lines: [1122, 1130], color: "sky", note: "할당한 프로세스 자신이 이미 SIGKILL을 받았으면 새 희생자를 고르지 않습니다." },
      { lines: [1144, 1147], color: "amber", note: "constrained_alloc이 totalpages를 정하고 panic_on_oom을 확인합니다." },
      { lines: [1157, 1175], color: "rose", note: "점수 최댓값을 고르고 죽입니다. 죽일 대상이 전혀 없는 전역 OOM이면 panic합니다." },
    ],
    code: oomKillC,
    lang: "c",
  },
  "proc-oom-score": {
    path: "linux/fs/proc/base.c",
    highlight: [586, 605],
    desc: "/proc/<pid>/oom_score는 같은 oom_badness를 쓰지만 totalpages를 항상 노드의 RAM + swap으로 둡니다.",
    annotations: [
      { lines: [589, 589], color: "rose", note: "cgroup 상한이 아니라 노드 전체입니다. 컨테이너 안의 OOM 순서를 이 파일로 예측하면 틀릴 수 있습니다(10절)." },
      { lines: [599, 600], color: "sky", note: "점수를 0~2000 범위로 옮긴 뒤 2/3을 곱해 0~1333 정도의 숫자로 보여 줍니다." },
    ],
    code: procBaseC,
    lang: "c",
  },
  "cgroup-memory-max": {
    path: "linux/Documentation/admin-guide/cgroup-v2.rst",
    highlight: [1282, 1311],
    desc: "memory.high는 넘으면 느려지고 memory.max는 넘으면 그 cgroup 안에서 OOM killer가 불립니다.",
    annotations: [
      { lines: [1286, 1293], color: "amber", note: "memory.high를 넘으면 강한 회수 압력과 감속을 받지만 OOM killer는 절대 부르지 않습니다." },
      { lines: [1300, 1304], color: "rose", note: "memory.max에 닿고 회수로 줄일 수 없으면 그 cgroup 안에서 OOM killer가 불립니다." },
    ],
    code: cgroupV2Rst,
    lang: "python",
  },
  "cgroup-oom-group": {
    path: "linux/Documentation/admin-guide/cgroup-v2.rst",
    highlight: [1355, 1416],
    desc: "memory.oom.group과 memory.events의 max·oom·oom_kill 카운터입니다.",
    annotations: [
      { lines: [1359, 1364], color: "sky", note: "oom.group을 켜면 cgroup의 모든 작업을 함께 죽이거나 하나도 죽이지 않습니다." },
      { lines: [1398, 1413], color: "amber", note: "max는 한도에 닿을 뻔한 횟수, oom은 할당이 실패하려던 횟수, oom_kill은 실제로 죽은 프로세스 수입니다. 137의 원인을 확인할 때 이 숫자를 봅니다." },
    ],
    code: cgroupV2Rst,
    lang: "python",
  },
  "kubelet-oom-adj": {
    path: "kubernetes/pkg/kubelet/qos/policy.go",
    highlight: [28, 120],
    desc: "kubelet이 컨테이너 프로세스에 oom_score_adj를 정하는 규칙입니다. QoS class와 memory request가 입력입니다.",
    annotations: [
      { lines: [28, 35], color: "sky", note: "Guaranteed는 −997, BestEffort는 1000, kubelet 자신은 −999입니다." },
      { lines: [84, 84], color: "amber", note: "Burstable은 1000 − 1000 × request ÷ 노드 메모리입니다. 16 GiB 노드에서 request 1 GiB면 1000 − 62 = 938입니다." },
      { lines: [110, 119], color: "violet", note: "결과를 3~999 사이로 묶어 Guaranteed보다 높고 BestEffort보다 낮게 둡니다." },
    ],
    code: kubeletPolicyGo,
    lang: "go",
  },
};
