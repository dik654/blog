import type { CodeRef } from "@/components/code/types";
import entry64S from "./codebase/linux/arch/x86/entry/entry_64.S?raw";
import entry64Rst from "./codebase/linux/Documentation/arch/x86/entry_64.rst?raw";
import forkC from "./codebase/linux/kernel/fork.c?raw";
import uapiSchedH from "./codebase/linux/include/uapi/linux/sched.h?raw";
import schedH from "./codebase/linux/include/linux/sched.h?raw";
import procArrayC from "./codebase/linux/fs/proc/array.c?raw";
import procRst from "./codebase/linux/Documentation/filesystems/proc.rst?raw";
import coreC from "./codebase/linux/kernel/sched/core.c?raw";
import fairC from "./codebase/linux/kernel/sched/fair.c?raw";
import eevdfRst from "./codebase/linux/Documentation/scheduler/sched-eevdf.rst?raw";
import niceRst from "./codebase/linux/Documentation/scheduler/sched-nice-design.rst?raw";
import syscalls2 from "./codebase/man-pages/man2/syscalls.2?raw";
import sched7 from "./codebase/man-pages/man7/sched.7?raw";
import clone2 from "./codebase/man-pages/man2/clone.2?raw";
import strace1 from "./codebase/strace/doc/strace.1.in?raw";

export const codeRefs: Record<string, CodeRef> = {
  "syscall-entry": {
    path: "linux/arch/x86/entry/entry_64.S",
    highlight: [87, 121],
    desc: "x86-64에서 사용자 프로그램이 syscall 명령을 실행하면 CPU가 이 주소로 뛰어듭니다. 레지스터를 커널 스택에 쌓고 C 함수 do_syscall_64를 부르기까지가 '모드 전환'의 실체입니다.",
    annotations: [
      { lines: [69, 78], color: "sky", note: "호출 규약입니다. rax에 시스템 콜 번호, rdi·rsi·rdx·r10·r8·r9에 인자 여섯 개. read(3, buf, 4096)이면 rax = 0, rdi = 3, rsi = buf, rdx = 4096입니다." },
      { lines: [91, 95], color: "amber", note: "swapgs로 커널의 per-CPU 영역을 가리키게 바꾸고, 사용자 스택 포인터를 치운 뒤 커널 스택으로 갈아탑니다. 사용자 스택을 그대로 쓰면 사용자 코드가 커널 스택을 조작할 수 있기 때문입니다." },
      { lines: [101, 109], color: "violet", note: "pt_regs 구조를 스택에 만듭니다. 돌아갈 주소(rcx), 플래그(r11), 시스템 콜 번호(orig_ax)를 저장하고 나머지 레지스터는 -ENOSYS로 채웁니다. 이 저장·복원이 시스템 콜 고정 비용의 큰 몫입니다." },
      { lines: [121, 121], color: "rose", note: "여기서 비로소 C 코드 do_syscall_64가 번호표(rsi)로 sys_read 같은 핸들러를 고릅니다. 돌아올 때는 164~166행의 swapgs와 sysretq로 사용자 모드로 복귀합니다." },
    ],
    code: entry64S,
    lang: "c",
  },
  "syscall-return": {
    path: "linux/arch/x86/entry/entry_64.S",
    highlight: [123, 170],
    desc: "커널에서 사용자 공간으로 돌아가는 길입니다. 가능하면 빠른 sysretq를, 조건이 어긋나면 느린 iret 경로를 씁니다.",
    annotations: [
      { lines: [123, 131], color: "sky", note: "돌아갈 사용자 상태가 깨끗하면 sysret, 아니면 swapgs_restore_regs_and_return_to_usermode로 갑니다. Xen PV에서는 항상 iret입니다." },
      { lines: [164, 166], color: "amber", note: "swapgs로 사용자 gs를 되돌리고 sysretq가 rcx에 저장된 주소로 복귀합니다. 들어올 때 쌓은 pt_regs는 그 전에 모두 복원됩니다." },
    ],
    code: entry64S,
    lang: "c",
  },
  "entry-doc": {
    path: "linux/Documentation/arch/x86/entry_64.rst",
    highlight: [13, 30],
    desc: "커널로 들어오는 입구가 여러 개라는 점과, syscall 명령이 64비트 코드의 입구라는 점을 커널 문서가 정리합니다.",
    annotations: [
      { lines: [25, 30], color: "sky", note: "64비트 코드의 syscall 명령은 system_call(entry_SYSCALL_64)로, 32비트 호환 코드의 int 0x80은 다른 입구로 들어옵니다. 이 글은 64비트 입구 하나만 따라갑니다." },
      { lines: [56, 61], color: "amber", note: "swapgs가 왜 까다로운지 적습니다. 사용자 gs와 커널 gs를 토글하는 명령이라 정확히 한 번씩 짝을 맞춰야 하고 어긋나면 커널이 죽습니다." },
    ],
    code: entry64Rst,
    lang: "python",
  },
  "syscalls-man": {
    path: "man-pages/man2/syscalls.2",
    highlight: [20, 52],
    desc: "시스템 콜은 프로그램과 커널 사이의 기본 인터페이스이고, 프로그램은 보통 glibc 래퍼를 거쳐 부른다는 man page 정의입니다.",
    annotations: [
      { lines: [20, 25], color: "sky", note: "직접 syscall 명령을 쓰는 일은 드물고 glibc의 read()·write() 같은 래퍼가 인자를 레지스터에 옮긴 뒤 명령을 실행합니다." },
      { lines: [43, 52], color: "amber", note: "커널은 실패를 음수 오류 번호로 돌려줍니다. 래퍼가 부호를 뒤집어 errno에 넣고 -1을 반환합니다. read가 -11을 돌려주면 errno는 EAGAIN(11)이 됩니다." },
    ],
    code: syscalls2,
    lang: "python",
  },
  "clone-flags": {
    path: "linux/include/uapi/linux/sched.h",
    highlight: [11, 19],
    desc: "프로세스와 스레드를 가르는 것은 clone()에 주는 비트들입니다. 무엇을 공유할지 비트마다 하나씩 정합니다.",
    annotations: [
      { lines: [11, 11], color: "sky", note: "CLONE_VM 0x100: 주소 공간(mm_struct)을 공유합니다. 스레드는 켜고 fork는 끕니다." },
      { lines: [13, 13], color: "amber", note: "CLONE_FILES 0x400: 열린 파일 표(files_struct)를 공유합니다. 켜져 있으면 한 스레드가 연 fd 7을 다른 스레드도 바로 씁니다." },
      { lines: [19, 19], color: "violet", note: "CLONE_THREAD 0x10000: 같은 thread group에 넣습니다. ps가 보여 주는 PID는 그룹 리더의 것이고 각 스레드는 TID를 따로 가집니다." },
      { lines: [32, 33], color: "rose", note: "같은 비트 자리에 CLONE_NEWPID·CLONE_NEWNET이 있습니다. 컨테이너가 쓰는 namespace도 결국 clone 비트입니다. 다음 글(컨테이너는 cgroup과 namespace다)에서 이어집니다." },
    ],
    code: uapiSchedH,
    lang: "c",
  },
  "copy-mm": {
    path: "linux/kernel/fork.c",
    highlight: [1697, 1733],
    desc: "copy_process가 새 task의 주소 공간을 정하는 함수입니다. 비트 하나로 '공유'와 '복제'가 갈립니다.",
    annotations: [
      { lines: [1720, 1722], color: "sky", note: "CLONE_VM이 켜져 있으면 부모의 mm_struct에 참조 수만 올리고(mmget) 같은 것을 가리킵니다. pthread_create가 만든 스레드 네 개가 같은 heap을 보는 이유입니다." },
      { lines: [1723, 1727], color: "amber", note: "꺼져 있으면 dup_mm으로 주소 공간을 복제합니다. fork의 경로입니다. page 자체는 copy-on-write라 처음 쓸 때 복사됩니다." },
    ],
    code: forkC,
    lang: "c",
  },
  "copy-files": {
    path: "linux/kernel/fork.c",
    highlight: [1756, 1784],
    desc: "열린 파일 표를 공유할지 복제할지 정하는 함수입니다. 스레드는 공유하고 fork는 복제합니다.",
    annotations: [
      { lines: [1773, 1776], color: "sky", note: "CLONE_FILES면 files_struct의 count만 올립니다. 스레드 T2가 accept로 받은 소켓 fd 7은 T1·T3·T4의 표에도 그대로 있습니다." },
      { lines: [1778, 1783], color: "amber", note: "아니면 dup_fd로 표를 복사합니다. fork 뒤 자식이 fd를 닫아도 부모의 표는 그대로입니다. 복사본이라도 가리키는 file 구조는 같아 offset은 공유됩니다." },
    ],
    code: forkC,
    lang: "c",
  },
  "copy-process-checks": {
    path: "linux/kernel/fork.c",
    highlight: [2140, 2160],
    desc: "copy_process 앞머리의 비트 조합 검사입니다. 스레드를 만들려면 시그널 핸들러도, 주소 공간도 같이 공유해야 합니다.",
    annotations: [
      { lines: [2145, 2146], color: "sky", note: "CLONE_THREAD인데 CLONE_SIGHAND가 아니면 EINVAL입니다. 같은 thread group은 시그널 처리기 표를 공유해야 하기 때문입니다." },
      { lines: [2153, 2154], color: "amber", note: "CLONE_SIGHAND인데 CLONE_VM이 아니어도 EINVAL입니다. 결국 스레드 = VM + FILES + SIGHAND + THREAD의 묶음입니다." },
    ],
    code: forkC,
    lang: "c",
  },
  "clone-man": {
    path: "man-pages/man2/clone.2",
    highlight: [1176, 1200],
    desc: "clone(2) man page의 CLONE_VM·CLONE_FILES·CLONE_THREAD 설명입니다.",
    annotations: [
      { lines: [1176, 1200], color: "sky", note: "CLONE_VM이면 한쪽의 mmap·munmap이 다른 쪽에도 보입니다. 꺼져 있으면 fork(2)처럼 주소 공간 사본을 받습니다." },
      { lines: [489, 510], color: "amber", note: "CLONE_FILES면 한쪽이 연 fd가 다른 쪽에서도 바로 유효하고, 한쪽이 닫으면 다른 쪽에도 닫힙니다. execve를 부르면 표가 다시 분리됩니다." },
      { lines: [1024, 1040], color: "violet", note: "CLONE_THREAD면 같은 thread group에 들어가고 getpid()가 같은 값을 돌려줍니다. 스레드끼리는 TID로 구분합니다." },
    ],
    code: clone2,
    lang: "python",
  },
  "task-states": {
    path: "linux/include/linux/sched.h",
    highlight: [99, 136],
    desc: "task의 상태 비트입니다. R은 0, 나머지는 '왜 자고 있는가'를 나타내는 비트입니다.",
    annotations: [
      { lines: [99, 101], color: "sky", note: "TASK_RUNNING 0(R: 실행 중이거나 run queue에서 대기), TASK_INTERRUPTIBLE 1(S: 시그널로 깨울 수 있는 잠), TASK_UNINTERRUPTIBLE 2(D: 시그널로도 못 깨우는 잠)." },
      { lines: [106, 106], color: "amber", note: "EXIT_ZOMBIE 0x20은 __state가 아니라 exit_state에 들어갑니다. 종료했지만 부모가 wait로 거두지 않은 Z 상태입니다." },
      { lines: [129, 133], color: "violet", note: "TASK_KILLABLE은 D이되 SIGKILL만은 받는 변종, TASK_IDLE은 D이되 load average에 세지 않는(NOLOAD) 변종입니다. 커널 스레드가 I로 보이는 이유입니다." },
    ],
    code: schedH,
    lang: "c",
  },
  "state-letters": {
    path: "linux/fs/proc/array.c",
    highlight: [126, 140],
    desc: "ps와 /proc/PID/status가 보여 주는 한 글자 상태는 이 배열에서 나옵니다.",
    annotations: [
      { lines: [129, 131], color: "sky", note: "R (running), S (sleeping), D (disk sleep). D의 이름이 disk sleep인 것은 역사적으로 디스크 I/O 대기가 대표 사례였기 때문이고 실제로는 모든 TASK_UNINTERRUPTIBLE이 D입니다." },
      { lines: [135, 139], color: "amber", note: "Z (zombie), I (idle). 글자 하나가 비트 하나에 대응하므로 상태는 겹치지 않고 하나만 표시됩니다." },
    ],
    code: procArrayC,
    lang: "c",
  },
  "proc-stat-doc": {
    path: "linux/Documentation/filesystems/proc.rst",
    highlight: [1519, 1571],
    desc: "/proc/stat의 ctxt·procs_running·procs_blocked 줄입니다. 서버 전체의 상태 분포를 한 번에 세는 곳입니다.",
    annotations: [
      { lines: [1519, 1519], color: "sky", note: "ctxt는 부팅 뒤 문맥 전환 누적 횟수입니다. vmstat의 cs 열이 이 값의 초당 차이입니다." },
      { lines: [1568, 1571], color: "amber", note: "procs_running은 R 상태 스레드 수, procs_blocked는 I/O 완료를 기다리며 막힌(D) 수입니다. vmstat의 r·b 열입니다." },
    ],
    code: procRst,
    lang: "python",
  },
  "weight-table": {
    path: "linux/kernel/sched/core.c",
    highlight: [10000, 10021],
    desc: "nice 값 40단계를 가중치로 바꾸는 표입니다. nice 0 = 1024이고 한 단계마다 약 1.25배씩 차이 납니다.",
    annotations: [
      { lines: [10000, 10011], color: "sky", note: "nice 한 단계는 CPU 몫 약 10% 차이로 설계됐습니다. 두 작업이 서로 한 단계씩 벌어지면 상대 거리는 약 25%, 그래서 곱수가 1.25입니다." },
      { lines: [10017, 10018], color: "amber", note: "nice 0은 1024, nice 5는 335입니다. 둘이 한 CPU를 두고 겨루면 1024 ÷ (1024 + 335) = 75.4% 대 24.6%입니다." },
      { lines: [10020, 10020], color: "violet", note: "nice 19는 15입니다. nice 0과 겨루면 15 ÷ 1039 = 1.4%만 받습니다." },
    ],
    code: coreC,
    lang: "c",
  },
  "nice-design-doc": {
    path: "linux/Documentation/scheduler/sched-nice-design.rst",
    highlight: [1, 20],
    desc: "nice가 왜 timeslice 길이가 아니라 가중치로 바뀌었는지 설명하는 설계 문서입니다.",
    annotations: [
      { lines: [8, 14], color: "sky", note: "예전에는 nice가 timeslice 길이에 묶여 있어 nice 19가 충분히 약하지 않았고, 최소 단위가 1/HZ였습니다." },
    ],
    code: niceRst,
    lang: "python",
  },
  "calc-delta-fair": {
    path: "linux/kernel/sched/fair.c",
    highlight: [286, 295],
    desc: "실제 실행 시간을 가상 시간으로 바꾸는 함수입니다. 가중치가 클수록 가상 시간이 천천히 흐릅니다.",
    annotations: [
      { lines: [289, 294], color: "sky", note: "delta × 1024 ÷ weight입니다. nice 0(1024)은 그대로, nice 5(335)는 0.75 ms를 실행하면 가상 시간이 2.29 ms 흐릅니다." },
      { lines: [259, 284], color: "amber", note: "__calc_delta는 나눗셈 대신 미리 계산한 역수(sched_prio_to_wmult, 2^32/weight)를 곱해 시프트합니다. 스케줄러는 매우 자주 불리므로 나눗셈을 피합니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "vruntime-eligible": {
    path: "linux/kernel/sched/fair.c",
    highlight: [708, 740],
    desc: "작업이 '아직 받을 몫이 남았는가(lag ≥ 0)'를 판정하는 함수입니다. 자기 vruntime이 가중 평균 V보다 작거나 같으면 자격이 있습니다.",
    annotations: [
      { lines: [708, 724], color: "sky", note: "lag_i = w_i × (V − v_i). V는 모든 작업의 vruntime 가중 평균입니다. 나눗셈 오차를 피하려고 분모를 곱해 비교합니다." },
      { lines: [726, 740], color: "amber", note: "현재 실행 중인 작업(curr)은 트리 밖에 있으므로 avg와 load에 따로 더한 뒤 avg ≥ (v − min_v) × load 로 비교합니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "pick-eevdf": {
    path: "linux/kernel/sched/fair.c",
    highlight: [888, 970],
    desc: "다음에 실행할 작업을 고르는 함수입니다. 자격 있는 작업 중 가상 마감(deadline)이 가장 이른 것을 O(log n)에 찾습니다.",
    annotations: [
      { lines: [888, 906], color: "sky", note: "두 조건입니다. ① 자격이 있어야 하고(받을 몫이 남음) ② 그중 가상 마감이 가장 이른 것. 트리는 deadline 순으로 정렬하되 각 노드가 서브트리의 최소 vruntime도 들고 있어 자격 없는 가지를 통째로 건너뜁니다." },
      { lines: [918, 919], color: "amber", note: "run queue에 작업이 하나뿐이면 자격 검사 없이 그것을 돌립니다." },
      { lines: [925, 926], color: "violet", note: "RUN_TO_PARITY: 한번 고른 작업은 자격을 잃거나 새 slice를 받을 때까지 계속 돌립니다. 너무 잦은 전환을 막는 장치입니다." },
      { lines: [935, 962], color: "rose", note: "힙 탐색입니다. 왼쪽 서브트리에 자격 있는 노드가 있으면 거기(더 이른 마감)로, 없으면 현재 노드를 검사하고 오른쪽으로 갑니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "update-deadline": {
    path: "linux/kernel/sched/fair.c",
    highlight: [1007, 1029],
    desc: "작업이 자기 요청량(slice)을 다 쓰면 다음 가상 마감을 정하는 함수입니다.",
    annotations: [
      { lines: [1009, 1010], color: "sky", note: "vruntime이 아직 deadline에 못 미쳤으면 아무것도 안 합니다. 요청량을 다 쓴 작업만 새 마감을 받습니다." },
      { lines: [1017, 1018], color: "amber", note: "slice의 기본값은 sysctl_sched_base_slice = 750,000 ns(0.75 ms, 76행)입니다. sched_setattr로 작업마다 다르게 줄 수 있습니다." },
      { lines: [1023, 1023], color: "violet", note: "vd_i = ve_i + r_i / w_i. nice 0은 vruntime + 0.75 ms, nice 5는 vruntime + 2.29 ms가 마감입니다. 가중치가 작을수록 마감이 멀어 덜 자주 뽑힙니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "update-curr": {
    path: "linux/kernel/sched/fair.c",
    highlight: [1216, 1232],
    desc: "틱마다 현재 작업의 실행 시간을 vruntime에 더하고 마감을 갱신하는 함수입니다.",
    annotations: [
      { lines: [1226, 1226], color: "sky", note: "실제 흐른 시간 delta_exec을 calc_delta_fair로 가상 시간으로 바꿔 더합니다. nice 5 작업은 같은 시간을 써도 vruntime이 3.06배 빨리 늘어납니다." },
      { lines: [1231, 1231], color: "amber", note: "update_deadline이 true를 돌려주면(요청량 소진) 재스케줄 표시를 해 pick_eevdf가 다시 불립니다." },
    ],
    code: fairC,
    lang: "c",
  },
  "eevdf-doc": {
    path: "linux/Documentation/scheduler/sched-eevdf.rst",
    highlight: [5, 24],
    desc: "EEVDF가 CFS를 대체하기 시작한 판본과, lag·가상 마감이라는 두 개념의 정의입니다.",
    annotations: [
      { lines: [5, 10], color: "sky", note: "1995년 논문의 EEVDF를 Linux 6.6부터 CFS 대신 쓰기 시작했습니다." },
      { lines: [13, 24], color: "amber", note: "lag가 양수면 CPU 시간을 덜 받은 작업, 음수면 더 받은 작업입니다. lag ≥ 0인 작업 중 가상 마감이 가장 이른 것을 고릅니다. 짧은 slice를 요청한 지연 민감 작업이 먼저 뽑힐 수 있습니다." },
    ],
    code: eevdfRst,
    lang: "python",
  },
  "sched-man-nice": {
    path: "man-pages/man7/sched.7",
    highlight: [400, 425],
    desc: "sched(7)의 nice 값 절입니다. 범위와 의미를 정의합니다.",
    annotations: [
      { lines: [422, 422], color: "sky", note: "현대 Linux에서 nice 범위는 −20(높은 우선순위)부터 +19(낮은 우선순위)입니다. 위 가중치 표의 40칸이 이 범위입니다." },
    ],
    code: sched7,
    lang: "python",
  },
  "strace-options": {
    path: "strace/doc/strace.1.in",
    highlight: [1161, 1170],
    desc: "strace의 -T 옵션 설명입니다. 시스템 콜 하나하나에 걸린 시간을 꼬리에 붙입니다.",
    annotations: [
      { lines: [1161, 1165], color: "sky", note: "-T는 시스템 콜 시작과 끝의 시간 차를 보여 줍니다. read()가 <0.000012>면 page cache에서 바로 왔고, <0.004120>이면 디스크를 기다린(D 상태) 시간이 섞인 것입니다." },
      { lines: [1323, 1325], color: "amber", note: "-c는 호출별 횟수·시간·오류 수를 집계해 끝에 표로 냅니다. '어느 시스템 콜을 너무 자주 부르는가'를 볼 때 씁니다." },
    ],
    code: strace1,
    lang: "python",
  },
};
