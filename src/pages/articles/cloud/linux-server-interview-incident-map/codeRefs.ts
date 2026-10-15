import type { CodeRef } from "@/components/code/types";
import loadavgH from "./codebase/linux/include/linux/sched/loadavg.h?raw";
import loadavgC from "./codebase/linux/kernel/sched/loadavg.c?raw";
import coreC from "./codebase/linux/kernel/sched/core.c?raw";
import schedInternalH from "./codebase/linux/kernel/sched/sched.h?raw";
import schedH from "./codebase/linux/include/linux/sched.h?raw";
import procLoadavgC from "./codebase/linux/fs/proc/loadavg.c?raw";

export const codeRefs: Record<string, CodeRef> = {
  "load-constants": {
    path: "linux/include/linux/sched/loadavg.h",
    highlight: [18, 38],
    desc: "load average를 2048배한 정수로 들고 다니는 상수와, 5초마다 부르는 한 번의 감쇠 계산입니다.",
    annotations: [
      { lines: [18, 20], color: "sky", note: "FIXED_1 = 2048이 load 1.0입니다. LOAD_FREQ는 5초(5*HZ+1 tick)라 1분 동안 계산은 12번뿐입니다." },
      { lines: [21, 23], color: "amber", note: "EXP_1 1884 ÷ 2048 = 0.9199 ≈ e^(−5/60)입니다. 5분·15분도 같은 식에 상수만 다릅니다." },
      { lines: [28, 38], color: "violet", note: "새 값 = 이전 값 × EXP + 지금 수 × (2048 − EXP). 지금 수가 이전 값 이상이면 2047을 더해 올림합니다. 0에서 시작해 수 1(=2048)을 넣으면 첫 결과가 164입니다." },
    ],
    code: loadavgH,
    lang: "c",
  },
  "load-definition": {
    path: "linux/kernel/sched/loadavg.c",
    highlight: [16, 25],
    desc: "커널 주석이 load average를 무엇의 평균으로 정의하는지 적은 부분입니다.",
    annotations: [
      { lines: [16, 17], color: "sky", note: "nr_running + nr_uninterruptible의 지수 감쇠 평균입니다. CPU를 쓰거나 기다리는 task와 끊김 없이 자는 task를 함께 셉니다." },
      { lines: [19, 25], color: "amber", note: "LOAD_FREQ마다 모든 CPU의 두 수를 더해 avenrun에 섞습니다. 큰 서버에서는 이 합을 CPU별 차이로 나눠 모읍니다." },
    ],
    code: loadavgC,
    lang: "c",
  },
  "fold-active": {
    path: "linux/kernel/sched/loadavg.c",
    highlight: [78, 91],
    desc: "CPU 하나의 run queue가 지금 몇 개를 load에 보태는지 세고, 지난번과의 차이만 돌려줍니다.",
    annotations: [
      { lines: [82, 83], color: "sky", note: "nr_running과 nr_uninterruptible을 더합니다. vmstat의 r과 b가 이 두 수의 사용자 쪽 모습입니다." },
      { lines: [85, 88], color: "amber", note: "전체 합을 매번 다시 세지 않고 차이만 전역 calc_load_tasks에 더합니다. CPU가 많을수록 이 방식이 싸집니다." },
    ],
    code: loadavgC,
    lang: "c",
  },
  "global-load": {
    path: "linux/kernel/sched/loadavg.c",
    highlight: [349, 397],
    desc: "전역 task 수를 2048배해 세 평균에 한 번씩 섞는 timer 쪽 함수와, CPU마다 차이를 보태는 tick 쪽 함수입니다.",
    annotations: [
      { lines: [365, 366], color: "sky", note: "active = calc_load_tasks × 2048입니다. Gregg 사례처럼 33개가 세어지면 67,584가 들어갑니다." },
      { lines: [368, 370], color: "amber", note: "같은 active를 EXP_1·EXP_5·EXP_15로 세 번 섞습니다. 세 값이 다른 이유는 입력이 아니라 상수입니다." },
      { lines: [385, 397], color: "violet", note: "sched_tick()에서 불려 5초가 지난 CPU만 자기 차이를 더합니다. 전역 계산은 10 tick 늦게 돌아 모든 CPU가 보탤 시간을 줍니다." },
    ],
    code: loadavgC,
    lang: "c",
  },
  "contributes-to-load": {
    path: "linux/kernel/sched/core.c",
    highlight: [6616, 6640],
    desc: "task가 잠들며 CPU를 내놓을 때 그 잠이 load에 보탤 잠인지 여기서 정합니다.",
    annotations: [
      { lines: [6622, 6625], color: "sky", note: "UNINTERRUPTIBLE이면서 NOLOAD도 FROZEN도 아닐 때만 보탭니다. 그래서 TASK_IDLE(UNINTERRUPTIBLE|NOLOAD)로 자는 kernel thread는 load를 올리지 않습니다." },
      { lines: [6640, 6640], color: "amber", note: "block_task가 run queue에서 빼면서 위에서 정한 표시에 따라 nr_uninterruptible을 올립니다." },
    ],
    code: coreC,
    lang: "c",
  },
  "uninterruptible-count": {
    path: "linux/kernel/sched/sched.h",
    highlight: [2771, 2780],
    desc: "잠드는 task를 run queue에서 뺄 때 nr_uninterruptible을 하나 올리는 곳입니다.",
    annotations: [
      { lines: [2773, 2774], color: "sky", note: "core.c에서 정한 sched_contributes_to_load가 참이면 1을 더합니다. vmstat b 열과 load의 D 몫이 여기서 생깁니다." },
      { lines: [2776, 2778], color: "amber", note: "I/O 대기라면 nr_iowait도 따로 셉니다. CPU 통계의 wa는 이 수가 있는 동안 노는 CPU 시간입니다." },
    ],
    code: schedInternalH,
    lang: "c",
  },
  "wakeup-decrement": {
    path: "linux/kernel/sched/core.c",
    highlight: [3657, 3667],
    desc: "잠든 task가 깨어나 run queue로 돌아올 때 nr_uninterruptible을 하나 내리는 곳입니다.",
    annotations: [
      { lines: [3665, 3666], color: "sky", note: "올릴 때와 다른 CPU에서 내릴 수 있습니다. 그래서 CPU별 값은 음수일 수 있고, 전체 합만 맞습니다(loadavg.c 47–52행 주석)." },
    ],
    code: coreC,
    lang: "c",
  },
  "task-states": {
    path: "linux/include/linux/sched.h",
    highlight: [98, 133],
    desc: "ps의 R·S·D와 load 계산이 쓰는 task 상태 비트입니다.",
    annotations: [
      { lines: [99, 101], color: "sky", note: "RUNNING 0, INTERRUPTIBLE 1(S, 신호로 깨움), UNINTERRUPTIBLE 2(D, 신호로 못 깨움)입니다." },
      { lines: [104, 106], color: "amber", note: "EXIT_ZOMBIE는 __state가 아닌 exit_state에 붙습니다. 끝난 task는 run queue에도 UNINTERRUPTIBLE 잠에도 있지 않으므로 load의 두 수에 들어가지 않습니다." },
      { lines: [113, 133], color: "violet", note: "TASK_NOLOAD 0x400을 UNINTERRUPTIBLE에 더한 것이 TASK_IDLE입니다. 신호로 깨지 않지만 load에는 보태지 않습니다." },
    ],
    code: schedH,
    lang: "c",
  },
  "proc-loadavg": {
    path: "linux/fs/proc/loadavg.c",
    highlight: [14, 27],
    desc: "/proc/loadavg와 uptime이 읽는 문자열을 만드는 함수입니다.",
    annotations: [
      { lines: [18, 23], color: "sky", note: "정수 값에 FIXED_1/200 = 10을 더한 뒤 정수부와 소수 두 자리로 찍습니다. 1,299는 0.63이 됩니다." },
      { lines: [24, 25], color: "amber", note: "넷째 칸은 지금 R인 수 / 전체 thread 수입니다. avenrun은 전역 값 하나라 이 파일을 그대로 보여 주는 container 안에서는 host 전체의 load가 나옵니다." },
    ],
    code: procLoadavgC,
    lang: "c",
  },
};
