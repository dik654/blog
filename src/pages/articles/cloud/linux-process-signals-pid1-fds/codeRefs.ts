import type { CodeRef } from "@/components/code/types";
import signalC from "./codebase/linux/kernel/signal.c?raw";
import exitC from "./codebase/linux/kernel/exit.c?raw";
import forkC from "./codebase/linux/kernel/fork.c?raw";
import pidC from "./codebase/linux/kernel/pid.c?raw";
import fileC from "./codebase/linux/fs/file.c?raw";
import fileTableC from "./codebase/linux/fs/file_table.c?raw";
import signalH from "./codebase/linux/include/linux/signal.h?raw";
import threadsH from "./codebase/linux/include/linux/threads.h?raw";
import uapiFsH from "./codebase/linux/include/uapi/linux/fs.h?raw";
import runcUtils from "./codebase/runc/libcontainer/utils/utils.go?raw";
import tiniC from "./codebase/tini/src/tini.c?raw";

export const codeRefs: Record<string, CodeRef> = {
  "unkillable-mark": {
    path: "linux/kernel/fork.c",
    highlight: [2552, 2562],
    desc: "새 PID namespace의 첫 프로세스를 그 namespace의 child_reaper로 정하고 SIGNAL_UNKILLABLE 표시를 붙입니다.",
    annotations: [
      { lines: [2558, 2561], color: "sky", note: "컨테이너의 PID 1이 만들어지는 순간입니다. 이 표시 하나가 뒤의 신호 판정과 고아 입양을 모두 바꿉니다. start.sh가 바로 이 프로세스입니다." },
    ],
    code: forkC,
    lang: "c",
  },
  "send-force": {
    path: "linux/kernel/signal.c",
    highlight: [1214, 1249],
    desc: "kill 한 번이 들어오면 보낸 쪽이 대상의 조상 PID namespace인지 보고 force를 정합니다.",
    annotations: [
      { lines: [1241, 1245], color: "sky", note: "host의 dockerd·runc는 컨테이너 namespace에서 PID가 없으므로 task_pid_nr_ns가 0을 돌려주고 force = true가 됩니다." },
      { lines: [1238, 1239], color: "amber", note: "같은 컨테이너 안에서 보낸 kill은 SI_KERNEL도 조상도 아니므로 force = false로 남습니다." },
    ],
    code: signalC,
    lang: "c",
  },
  "task-ignored": {
    path: "linux/kernel/signal.c",
    highlight: [82, 123],
    desc: "보내는 순간 신호를 버릴지 정하는 함수입니다. PID 1의 SIGTERM이 여기서 사라집니다.",
    annotations: [
      { lines: [92, 94], color: "rose", note: "UNKILLABLE ∧ 처리기 SIG_DFL ∧ ¬(force ∧ SIGKILL·SIGSTOP)이면 버립니다. host에서 온 SIGTERM은 force가 true여도 SIGKILL이 아니라서 버려집니다." },
      { lines: [104, 112], color: "sky", note: "막아 둔(blocked) 신호는 버리지 않습니다. 나중에 처리기가 바뀔 수 있기 때문입니다." },
    ],
    code: signalC,
    lang: "c",
  },
  "prepare-drop": {
    path: "linux/kernel/signal.c",
    highlight: [1073, 1086],
    desc: "prepare_signal이 false면 신호를 대기열에 넣지 않고 바로 끝냅니다.",
    annotations: [
      { lines: [1083, 1085], color: "rose", note: "TRACE_SIGNAL_IGNORED로 기록하고 goto ret. 버려진 SIGTERM은 pending에도 남지 않으므로 나중에 trap을 걸어도 되살아나지 않습니다." },
    ],
    code: signalC,
    lang: "c",
  },
  "get-signal-init": {
    path: "linux/kernel/signal.c",
    highlight: [2827, 2845],
    desc: "받는 쪽에서 기본 동작을 고를 때 한 번 더 init을 보호합니다.",
    annotations: [
      { lines: [2833, 2845], color: "sky", note: "보낼 때 걸러지지 않고 대기열에 남은 신호도 init이면 SIGKILL·SIGSTOP이 아닌 한 기본 동작을 하지 않습니다." },
    ],
    code: signalC,
    lang: "c",
  },
  "kernel-only-mask": {
    path: "linux/include/linux/signal.h",
    highlight: [419, 448],
    desc: "처리기를 둘 수 없는 신호(SIGKILL·SIGSTOP)와 기본 동작이 무시인 신호 목록입니다.",
    annotations: [
      { lines: [419, 420], color: "sky", note: "sig_kernel_only는 이 두 신호뿐입니다. SIGTERM(15)은 여기에 없으므로 앞 판정의 예외가 되지 못합니다." },
      { lines: [434, 436], color: "amber", note: "SIGCHLD의 기본 동작은 무시입니다. 그래서 처리기를 두지 않은 부모는 자식이 끝나도 아무 일도 하지 않습니다." },
    ],
    code: signalH,
    lang: "c",
  },
  "exit-notify": {
    path: "linux/kernel/exit.c",
    highlight: [731, 778],
    desc: "프로세스가 끝날 때 자식을 넘기고 자신을 좀비로 표시한 뒤 부모에게 알립니다.",
    annotations: [
      { lines: [737, 743], color: "sky", note: "먼저 자기 자식을 새 부모에게 넘기고(forget_original_parent) 자신은 EXIT_ZOMBIE가 됩니다. helper 하나가 끝나는 순간입니다." },
      { lines: [756, 767], color: "rose", note: "부모가 SIGCHLD를 무시하지 않으면 autoreap는 false입니다. 이때 PID와 종료 상태 칸은 부모가 wait할 때까지 남습니다." },
    ],
    code: exitC,
    lang: "c",
  },
  "new-reaper": {
    path: "linux/kernel/exit.c",
    highlight: [618, 658],
    desc: "부모가 먼저 끝나면 고아가 된 자식을 누가 넘겨받을지 정합니다.",
    annotations: [
      { lines: [619, 623], color: "sky", note: "같은 스레드 그룹 → 가장 가까운 subreaper → 그 namespace의 PID 1 순서입니다. 컨테이너 안의 고아는 PID 1에게 갑니다." },
      { lines: [636, 654], color: "amber", note: "tini를 PID 1로 못 쓰면 -s로 subreaper 표시를 해 이 고리에서 대신 입양됩니다." },
    ],
    code: exitC,
    lang: "c",
  },
  "child-reaper-dies": {
    path: "linux/kernel/exit.c",
    highlight: [587, 616],
    desc: "죽는 프로세스가 namespace의 init이면 남은 프로세스를 모두 정리합니다.",
    annotations: [
      { lines: [607, 612], color: "rose", note: "zap_pid_ns_processes가 namespace의 나머지에 SIGKILL을 보냅니다. start.sh가 죽으면 python도 이 경로로 끝납니다." },
    ],
    code: exitC,
    lang: "c",
  },
  "autoreap": {
    path: "linux/kernel/signal.c",
    highlight: [2115, 2147],
    desc: "부모가 SIGCHLD를 SIG_IGN으로 두거나 SA_NOCLDWAIT를 켰다면 좀비를 남기지 않습니다.",
    annotations: [
      { lines: [2116, 2134], color: "sky", note: "POSIX가 정한 특별한 의미입니다. 이때 autoreap = true가 되어 exit_notify가 바로 release_task를 부릅니다." },
    ],
    code: signalC,
    lang: "c",
  },
  "wait-zombie": {
    path: "linux/kernel/exit.c",
    highlight: [1143, 1262],
    desc: "부모의 wait가 좀비 하나를 찾아 종료 상태를 읽고 칸을 돌려줍니다.",
    annotations: [
      { lines: [1164, 1170], color: "sky", note: "EXIT_ZOMBIE → EXIT_DEAD를 한 스레드만 바꿀 수 있습니다. 같은 좀비를 두 번 거두지 않습니다." },
      { lines: [1249, 1250], color: "sky", note: "release_task가 PID와 task 구조체를 놓습니다. 여기서야 ps의 Z 줄이 사라집니다." },
      { lines: [1253, 1261], color: "amber", note: "status 하위 7비트가 0이면 정상 종료 코드, 아니면 죽인 신호 번호입니다. 셸과 runc의 128 + N은 이 신호 번호를 더한 값입니다." },
    ],
    code: exitC,
    lang: "c",
  },
  "alloc-fd": {
    path: "linux/fs/file.c",
    highlight: [485, 551],
    desc: "새 fd는 비어 있는 가장 낮은 번호입니다. 그 번호가 RLIMIT_NOFILE 이상이면 EMFILE입니다.",
    annotations: [
      { lines: [494, 501], color: "sky", note: "next_fd부터 비트맵에서 빈 칸을 찾습니다. 그래서 fd는 0·1·2 다음 3부터 차례로 채워집니다." },
      { lines: [506, 508], color: "rose", note: "end는 soft limit 1,024입니다. 1,000번째 연결까지 1,023번을 쓰고, 1,001번째의 fd = 1024 ≥ 1024에서 -EMFILE입니다." },
      { lines: [548, 551], color: "sky", note: "검사 상한은 프로세스의 rlimit(RLIMIT_NOFILE)에서 옵니다. 시스템 전체 수와는 따로입니다." },
    ],
    code: fileC,
    lang: "c",
  },
  "file-max": {
    path: "linux/fs/file_table.c",
    highlight: [191, 230],
    desc: "열린 파일 객체 수가 시스템 전체 한도 file-max에 닿으면 ENFILE입니다.",
    annotations: [
      { lines: [197, 207], color: "sky", note: "CAP_SYS_ADMIN이 없는 프로세스만 막습니다. 관리자 셸은 한도를 넘어 들어가 정리할 수 있습니다." },
      { lines: [223, 229], color: "rose", note: "dmesg의 'VFS: file-max limit N reached'가 이 줄입니다. EMFILE과 달리 서버 전체가 같은 오류를 봅니다." },
    ],
    code: fileTableC,
    lang: "c",
  },
  "file-max-default": {
    path: "linux/fs/file_table.c",
    highlight: [535, 549],
    desc: "file-max 기본값은 부팅 때 메모리의 약 10%를 파일 하나당 1KiB로 나눈 값입니다.",
    annotations: [
      { lines: [541, 548], color: "sky", note: "64GiB 서버에서 부팅 때 쓰는 메모리를 무시하면 16,777,216쪽 × 4 ÷ 10 ≈ 671만입니다. 이 값은 설명용 근사입니다." },
    ],
    code: fileTableC,
    lang: "c",
  },
  "nofile-defaults": {
    path: "linux/include/uapi/linux/fs.h",
    highlight: [30, 40],
    desc: "커널이 처음 프로세스에 주는 nofile soft·hard 값입니다.",
    annotations: [
      { lines: [37, 38], color: "sky", note: "soft 1,024, hard 4,096이 커널 초기값입니다. systemd는 서비스에 1024:524288을 기본으로 줍니다." },
    ],
    code: uapiFsH,
    lang: "c",
  },
  "pid-max": {
    path: "linux/kernel/pid.c",
    highlight: [650, 661],
    desc: "pid_max 기본값은 32,768과 CPU당 1,024 중 큰 값입니다.",
    annotations: [
      { lines: [655, 657], color: "sky", note: "16 CPU면 1,024 × 16 = 16,384라 32,768이 남습니다. 64 CPU면 65,536이 됩니다." },
    ],
    code: pidC,
    lang: "c",
  },
  "pid-max-consts": {
    path: "linux/include/linux/threads.h",
    highlight: [24, 44],
    desc: "PID_MAX_DEFAULT 0x8000(32,768)과 PIDS_PER_CPU_DEFAULT 1,024를 정의합니다.",
    annotations: [
      { lines: [28, 28], color: "sky", note: "0x8000 = 32,768. 좀비 계산의 분자입니다." },
    ],
    code: threadsH,
    lang: "c",
  },
  "runc-exit": {
    path: "runc/libcontainer/utils/utils.go",
    highlight: [13, 24],
    desc: "runc가 컨테이너 프로세스의 wait 상태를 종료 코드 하나로 바꿉니다.",
    annotations: [
      { lines: [19, 22], color: "sky", note: "신호로 죽었으면 128 + 신호 번호입니다. SIGKILL(9)이면 137, SIGTERM(15)이면 143입니다." },
    ],
    code: runcUtils,
    lang: "go",
  },
  "tini-mask": {
    path: "tini/src/tini.c",
    highlight: [463, 545],
    desc: "tini는 처리기를 등록하지 않고 신호를 막아 둔 뒤 sigtimedwait로 꺼내 자식에게 다시 보냅니다.",
    annotations: [
      { lines: [464, 483], color: "sky", note: "거의 모든 신호를 sigprocmask로 막습니다. signal.c sig_ignored 111행대로 막힌 신호는 버려지지 않으므로, PID 1인 tini에도 SIGTERM이 대기열에 남습니다." },
      { lines: [511, 541], color: "sky", note: "대기열에서 꺼낸 신호가 SIGCHLD가 아니면 자식(-g면 자식의 프로세스 그룹)에게 kill로 그대로 보냅니다." },
    ],
    code: tiniC,
    lang: "c",
  },
  "tini-reap": {
    path: "tini/src/tini.c",
    highlight: [548, 590],
    desc: "waitpid(-1, WNOHANG)를 비어 있을 때까지 돌려 입양된 좀비까지 모두 거둡니다.",
    annotations: [
      { lines: [552, 553], color: "sky", note: "-1은 어느 자식이든입니다. 고아가 되어 넘어온 좀비도 이 호출로 칸을 돌려줍니다." },
      { lines: [579, 584], color: "amber", note: "주 자식이 신호로 죽으면 sh·bash처럼 128 + 신호 번호를 종료 코드로 씁니다. SIGTERM이면 143입니다." },
    ],
    code: tiniC,
    lang: "c",
  },
};
