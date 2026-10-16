import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import TaskStateViz from "./linux-kernel-process-syscall-scheduler/viz/TaskStateViz";
import EevdfPickViz from "./linux-kernel-process-syscall-scheduler/viz/EevdfPickViz";
import { codeRefs } from "./linux-kernel-process-syscall-scheduler/codeRefs";
import { linuxKernelProcessTrees } from "./linux-kernel-process-syscall-scheduler/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxKernelProcessSyscallSchedulerArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. CPU 사용률은 40%인데 왜 배치 작업은 느리고 load는 3인가요?</h2>
          <div className={prose}>
            <p>
              (가정) CPU 2개짜리 서버에 스레드 네 개짜리 웹 서버와 nice 5로 돌린 로그 압축 작업이 함께 있습니다. top은 CPU 사용률 40%를 보이지만 압축은 예상보다 세 배
              느리며, load average는 3을 넘습니다. 서로 모순처럼 보이는 세 숫자는 하나의 질문으로 모입니다. 커널은 실행할 것을 어떻게 고르고, 실행하지 못하는 것을 어디에 세어
              두나요?
            </p>
            <p>
              답을 먼저 적겠습니다. 프로그램은 커널에 직접 손대지 못한 채 시스템 콜이라는 좁은 문으로 부탁합니다. 커널은 스레드든 프로세스든 모두 task 하나로 취급해 R·S·D·Z 네 상태
              가운데 하나를 매깁니다.
            </p>
            <p>
              CPU에 올라가는 것은 R 가운데 스케줄러가 고른 것이며, 고르는 규칙은 nice 값을 가중치로 바꿔 "평균보다 덜 받은 작업 중 가상 마감이 가장 이른
              것"을 뽑는 EEVDF입니다. nice 5의 가중치는 335라 nice 0의 1024와 겨루면 24.6%만 받습니다. load는 R뿐 아니라 디스크를 기다리는 D까지 세기 때문에 CPU가 놀아도
              오릅니다.
            </p>
            <p>
              이 글은 <a href="/cs/cloud/linux-server-interview-incident-map#overview">리눅스 서버 면접·장애 지도</a>의 여섯 사례 글이 당연하게 쓰던 바닥 개념을 Linux v6.12 원문으로
              쌓습니다. fork, exec, 좀비는 <a href="/cs/cloud/linux-process-signals-pid1-fds#overview">프로세스·신호·PID 1</a>에서, load average의 계산식은 지도 글에서 이미
              다뤘으므로 여기서는 그 앞에 놓인 경계와 스레드, 상태, 선택 규칙을 채웁니다. 컨테이너가 이 위에 cgroup과 namespace를 어떻게 얹는지는 다음 글{" "}
              <a href="/cs/cloud/linux-containers-cgroup-namespace#overview">컨테이너는 cgroup과 namespace다</a>에서 이어집니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 프로그램은 부탁하고, 커널은 상태를 매기고, 스케줄러가 CPU를 나눕니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 흐름은 다섯 칸입니다. 프로그램이 파일을 읽고 싶으면 read()를 부릅니다. 그 호출은 CPU의 특권 모드를 바꾸는 명령 하나로 커널 코드에 들어가며, 커널이 일을 마친 뒤 같은 길로 돌아옵니다. 디스크를 기다려야 할 때 커널은 그 task를 잠재우고 다른 task를 CPU에 올립니다. 디스크의 답이 오면 잠든 task를 깨워 다시 줄에 세웁니다.
            </p>
            <p>
              첫 두 칸이 사용자 공간과 커널 공간의 경계입니다. 프로그램은 자기 주소 공간 안에서만 움직일 뿐 하드웨어나 다른 프로세스의 메모리에는 손대지 못합니다. 그 일은 모두
              커널에 부탁해야 하며, 부탁하는 유일한 통로가 시스템 콜입니다. 면접에서 "사용자 모드와 커널 모드의 차이"를 물으면 이 경계와 그 문을 지나는 비용을 묻는 것입니다.
            </p>
            <p>
              나머지 세 칸이 task의 상태와 스케줄링입니다. 커널은 프로세스와 스레드를 구분하지 않은 채 둘 다 task_struct 하나로 다룹니다. 차이는 만들 때 무엇을 공유하기로 했느냐뿐입니다.
              이 글은 경계(3절) → 스레드(4절) → 상태(5절) → 가중치(6절) → 선택 규칙(7절) 순서로 내려갑니다.
            </p>
          </div>
        </section>

        <section id="syscall-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. read(3, buf, 4096)은 번호 0을 rax에 싣고 문을 두드립니다</h2>
          <div className={prose}>
            <p>
              웹 서버 스레드가 glibc의 read(3, buf, 4096)을 부릅니다. glibc 래퍼는 시스템 콜 번호 0을 rax에, 인자 셋을 rdi·rsi·rdx에 넣은 뒤 syscall 명령을 실행합니다. 인자가
              여섯 개까지면 r10·r8·r9가 이어집니다. 이 규약은 커널 입구 코드의 주석에 그대로 적혀 있습니다.
            </p>
            <p>
              syscall 명령이 실행되면 CPU는 돌아갈 주소를 rcx에, 플래그를 r11에 저장한 다음 커널이 미리 등록해 둔 주소로 뜁니다. 커널 입구는 세 가지 일을 합니다.
            </p>
            <p>
              swapgs로 커널의
              per-CPU 영역을 가리키게 바꾸는 일, 사용자 스택 대신 커널 스택으로 갈아타는 일, 레지스터 전부를 pt_regs라는 구조로 스택에 쌓는 일입니다. 사용자 스택을 그대로 쓰지 않는 이유는
              사용자 코드가 그 메모리를 마음대로 바꿀 수 있기 때문입니다. 이 저장과 복원이 시스템 콜마다 반드시 치르는 고정 비용입니다.
            </p>
            <p>
              커널이 sys_read를 끝내면 결과를 rax에 담아 돌아옵니다. 소켓에 읽을 것이 없고 비차단 모드였다면 커널은 −11을 돌려줍니다. 래퍼가 부호를 뒤집어 errno에 11(EAGAIN)을 넣은 뒤
              프로그램에는 −1을 돌려줍니다. 시스템 콜이 실패를 음수로 알리면 래퍼가 그것을 errno로 바꾼다는 규칙은 syscalls(2) man page에 있습니다.
            </p>
            <p>
              그래서 시스템 콜의 비용은 "몇 바이트를 읽었나"보다 "몇 번 문을 두드렸나"에 더 가깝게 비례합니다. 1 바이트씩 4,096번 read하는 프로그램과 4,096 바이트를 한 번에
              read하는 프로그램은 같은 데이터를 받지만 전자는 입구·출구를 4,096번 지납니다. 9절의 strace -c가 바로 이 횟수를 셉니다.
            </p>
          </div>
          {code("syscall-entry", "entry_SYSCALL_64 입구")}
          {code("syscall-return", "sysretq로 돌아가는 길")}
          {code("entry-doc", "커널 입구 문서")}
          {code("syscalls-man", "syscalls(2): 래퍼와 errno")}
          <div id="paper-syscalls-man" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux man-pages 6.9.1 · syscalls(2) (2026-10-17 확인)" citeKey={1} href="https://man7.org/linux/man-pages/man2/syscalls.2.html">
              <q>The system call is the fundamental interface between an application and the Linux kernel.</q> 같은 page는 시스템 콜이 보통 glibc 래퍼를 거쳐 불리고, 래퍼가
              인자를 레지스터에 옮긴 뒤 실패 시 음수 오류 번호를 양수로 바꿔 errno에 넣고 −1을 돌려준다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="threads" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 스레드와 프로세스의 차이는 clone()에 준 비트 네 개입니다</h2>
          <div className={prose}>
            <p>
              웹 서버가 스레드를 네 개 만들었다고 했습니다. 커널 입장에서 pthread_create는 clone() 시스템 콜이며, fork()도 clone()입니다. 두 호출의 차이는 플래그 비트입니다.
            </p>
            <p>
              CLONE_VM(0x100)은 주소 공간, CLONE_FILES(0x400)는 열린 파일 표, CLONE_SIGHAND(0x800)는 시그널 처리기를 공유한다는 뜻이며,
              CLONE_THREAD(0x10000)는 같은 thread group에 넣습니다. pthread_create는 넷을 모두 켜지만 fork는 모두 끕니다.
            </p>
            <p>
              커널이 실제로 하는 일은 copy_process 안의 copy_mm·copy_files입니다. CLONE_VM이 켜져 있으면 부모의 mm_struct에 참조 수만 하나 올린 채 같은 것을 가리킵니다. 꺼져 있을 때는 dup_mm으로 주소 공간을 복제합니다.
            </p>
            <p>
              copy_files도 같은 모양이라 CLONE_FILES면 files_struct의 count만 올리며, 아니면 dup_fd로 표를 복사합니다. 그래서 스레드 T2가 accept로
              받은 소켓 fd 7은 T1·T3·T4의 표에도 바로 있는 반면, fork한 자식이 fd를 닫아도 부모의 표는 그대로입니다.
            </p>
            <p>
              이 비트들은 아무렇게나 조합할 수 없습니다. copy_process 앞머리는 CLONE_THREAD인데 CLONE_SIGHAND가 아니면, CLONE_SIGHAND인데 CLONE_VM이 아니면 EINVAL을 돌려줍니다. 같은
              thread group은 시그널 처리기 표를 공유해야 하며, 처리기 표를 공유하려면 그 표가 놓인 주소 공간도 공유해야 하기 때문입니다. 결국 "스레드"는 커널이 따로 아는 개념이 아니라
              이 네 비트가 모두 켜진 task입니다.
            </p>
            <p>
              같은 비트 자리에 CLONE_NEWPID·CLONE_NEWNET 같은 namespace 비트가 있습니다. 컨테이너 런타임이 첫 프로세스를 만들 때 켜는 비트이며 다음 글의 주제입니다. fork 뒤 execve로
              프로그램을 바꾸는 과정과 부모가 wait하지 않아 생기는 좀비는 <a href="/cs/cloud/linux-process-signals-pid1-fds#lifecycle">프로세스·신호·PID 1</a>에서 다뤘습니다.
            </p>
          </div>
          {code("clone-flags", "CLONE_* 비트 정의")}
          {code("copy-mm", "copy_mm: 공유 또는 복제")}
          {code("copy-files", "copy_files: fd 표 공유 또는 복제")}
          {code("copy-process-checks", "비트 조합 검사")}
          {code("clone-man", "clone(2): CLONE_VM·FILES·THREAD")}
        </section>

        <section id="states" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 상태는 R, S, D, Z 넷이고 load는 R과 D를 셉니다</h2>
          <div className={prose}>
            <p>
              앞 절의 다섯 task에 상태를 붙입니다. CPU에서 돌고 있거나 run queue에서 차례를 기다리는 task는 R(TASK_RUNNING, 비트 값 0)입니다. 새 연결을 기다리는 T2처럼 어떤
              사건을 기다리며 잠들어 있되 시그널로 깨울 수 있으면 S(TASK_INTERRUPTIBLE, 1)입니다.
            </p>
            <p>
              디스크 응답을 기다리는 T3처럼 중간에 깨워서는 안 되는 잠은 D(TASK_UNINTERRUPTIBLE,
              2)입니다. 종료했지만 부모가 wait로 거두지 않은 task는 Z(EXIT_ZOMBIE, 0x20)로 남습니다.
            </p>
            <p>
              ps와 /proc/PID/status가 보여 주는 글자는 fs/proc/array.c의 task_state_array에서 나옵니다. D의 이름이 "disk sleep"인 것은 디스크 대기가 대표 사례라 그런 것일 뿐, 실제로는
              모든 TASK_UNINTERRUPTIBLE이 D입니다. D에게 SIGTERM을 보내도 디스크가 답할 때까지 아무 일도 일어나지 않습니다. kill -9가 안 듣는 프로세스를 보면 먼저 상태 글자를 확인하는
              이유입니다.
            </p>
            <p>
              load average는 R과 D를 함께 셉니다. 지도 글에서 본 kernel/sched/loadavg.c의 계산이 이 두 상태의 수를 입력으로 받습니다. 그래서 1절의 서버는 CPU 2개 가운데 하나가
              놀아도 디스크를 기다리는 D가 있으면 load가 3을 넘습니다. 커널 스레드가 I(idle)로 보이는 것은 TASK_IDLE이 UNINTERRUPTIBLE에 NOLOAD 비트를 더한 변종이라 D처럼 자되
              load에는 세지 않기 때문입니다.
            </p>
            <p>
              서버 전체의 분포는 /proc/stat의 procs_running(R인 스레드 수)과 procs_blocked(I/O를 기다리며 막힌 수)에 있으며, vmstat의 r·b 열이 이 둘입니다. ctxt는 부팅 뒤 문맥 전환
              누적 횟수로, vmstat의 cs 열이 그 초당 차이입니다. 아래 그림은 다섯 task의 상태가 바뀔 때 CPU·run queue·이 세 숫자가 어떻게 따라 움직이는지 보여 줍니다.
            </p>
          </div>
          <TaskStateViz />
          {code("task-states", "TASK_* 비트 정의")}
          {code("state-letters", "task_state_array 글자표")}
          {code("proc-stat-doc", "/proc/stat의 running·blocked")}
        </section>

        <section id="weights" data-teach-level="3" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. nice 한 단계는 가중치 1.25배이고, nice 5는 nice 0의 24.6%를 받습니다</h2>
          <div className={prose}>
            <p>
              R인 task가 CPU 수보다 많으면 누가 먼저 도는지 정해야 합니다. 기본 정책 SCHED_OTHER에서 사용자가 줄 수 있는 손잡이는 nice 하나뿐이며 범위는 −20(높음)부터 +19(낮음)입니다.
              커널은 이 40단계를 sched_prio_to_weight 표로 가중치에 대응시킵니다. nice 0은 1024, nice 5는 335, nice 19는 15입니다.
            </p>
            <p>
              표의 주석은 설계 의도를 적습니다. nice 한 단계는 CPU 몫 약 10% 차이가 나도록 했으며, 두 작업이 서로 반대 방향으로 한 단계씩 움직이면 상대 거리가 약 25%가 되도록 곱수를
              1.25로 잡았습니다. 예전 스케줄러에서 nice가 timeslice 길이에 묶여 있어 nice 19가 충분히 약하지 않았던 문제를 가중치로 풀었다는 설명이 sched-nice-design 문서에 있습니다.
            </p>
            <p>
              CPU 하나를 두고 두 작업이 쉬지 않고 겨루면 각자의 몫은 자기 가중치를 가중치 합으로 나눈 값입니다. 1절의 압축 작업(nice 5)이 웹 서버 스레드(nice 0) 하나와 같은 CPU에서 겨룰 때 335 ÷ 1359 = 24.6%를 받습니다. 압축이 세 배 느리게 느껴진 이유가 이 비율입니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="nice 0과 nice 5가 CPU 하나를 나누는 비율"
            question="웹 서버 스레드(nice 0)와 로그 압축(nice 5)이 같은 CPU에서 쉬지 않고 돌면 각각 몇 %를 받을까요?"
            scope="kernel/sched/core.c의 sched_prio_to_weight 값을 그대로 씁니다. 두 작업 모두 CPU만 쓰고 잠들지 않으며 다른 작업은 없다고 봅니다."
            steps={[
              { label: "nice 0 가중치", expression: "sched_prio_to_weight[20]", result: "1024", reason: "표의 인덱스는 nice + 20입니다. nice 0이 기준값 NICE_0_LOAD입니다." },
              { label: "nice 5 가중치", expression: "sched_prio_to_weight[25]", result: "335", reason: "1024 ÷ 1.25⁵ ≈ 335.5를 정수로 적은 값입니다." },
              { label: "가중치 합", expression: "1024 + 335", result: "1359", reason: "run queue 전체 가중치입니다. 세 번째 작업이 들어오면 분모가 늘어 둘 다 몫이 줄어듭니다." },
              { label: "nice 0 몫", expression: "1024 ÷ 1359", result: "75.4%", reason: "가중치 비례 몫입니다." },
              { label: "nice 5 몫", expression: "335 ÷ 1359", result: "24.6%", reason: "압축 작업이 혼자 돌 때보다 약 4배 오래 걸립니다." },
              { label: "nice 19였다면", expression: "15 ÷ (1024 + 15)", result: "1.4%", reason: "nice 19는 거의 '남는 시간에만'이라는 뜻이 됩니다." },
            ]}
            conclusion="nice는 CPU 시간을 보장하지 않고 겨룰 때의 비율만 정합니다. 상대가 없으면 nice 19도 CPU 100%를 씁니다."
            caveats={["CPU가 둘 이상이면 두 작업이 다른 CPU에 놓여 겨루지 않을 수 있습니다. 비율은 같은 run queue 안에서만 뜻이 있습니다.", "cgroup의 cpu.weight(기본 100, 1~10000)는 이 가중치를 그룹 단위로 한 겹 더 얹습니다. Kubernetes의 CPU requests가 이 값으로 바뀝니다(다음 글)."]}
          />
          {code("weight-table", "sched_prio_to_weight 표")}
          {code("nice-design-doc", "nice를 가중치로 바꾼 이유")}
          {code("sched-man-nice", "sched(7): nice 범위")}
          <div id="paper-sched-man" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux man-pages 6.9.1 · sched(7) · The nice value (2026-10-17 확인)" citeKey={2} href="https://man7.org/linux/man-pages/man7/sched.7.html">
              <q>On modern Linux, the range is -20 (high priority) to +19 (low priority).</q> 같은 절은 POSIX가 nice를 프로세스 속성으로 정의하지만 Linux에서는 스레드마다 다른
              nice를 가질 수 있다고 적습니다. 4절에서 본 대로 커널에게 스레드는 그저 task이기 때문입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="eevdf" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. EEVDF는 평균보다 덜 받은 작업 가운데 가상 마감이 가장 이른 것을 고릅니다</h2>
          <div className={prose}>
            <p>
              비율은 정해졌지만 "지금 이 순간 누구를 올릴까"는 다른 문제입니다. Linux 6.6부터 CFS를 대신하기 시작한 EEVDF(Earliest Eligible Virtual Deadline First)는 작업마다
              가상 실행 시간 vruntime을 둡니다.
            </p>
            <p>
              실제로 Δ만큼 돌면 vruntime은 Δ × 1024 ÷ weight만큼 늘어납니다. 가중치가 작을수록 가상 시간이 빨리 흐르므로 nice 5 작업은 0.75 ms를
              돌아도 2.29 ms를 쓴 것으로 기록됩니다.
            </p>
            <p>
              고르는 규칙은 두 단계입니다. 먼저 자기 vruntime이 run queue의 가중 평균 V보다 작거나 같은 작업, 곧 아직 받을 몫이 남은(lag ≥ 0) 작업만 후보로 남깁니다. 그중에서
              가상 마감 deadline이 가장 이른 작업을 고릅니다. 마감은 작업이 요청량 slice(기본 0.75 ms)를 다 쓸 때마다 vruntime + slice × 1024 ÷ weight로 다시 정합니다. 그래서
              가중치가 작은 작업은 마감도 멀어 덜 자주 뽑힙니다.
            </p>
          </div>
          <ExplainedFormula
            question="다음에 CPU에 올릴 작업은 어떻게 정해집니까?"
            idea="받을 몫이 남은 작업(lag ≥ 0)만 후보로 두고, 그중 가상 마감이 가장 이른 작업을 고릅니다."
            formula={"\\text{lag}_i = w_i\\,(V - v_i) \\ge 0,\\qquad vd_i = ve_i + \\frac{r_i}{w_i}"}
            annotatedFormula={"\\underbrace{\\text{lag}_i = w_i\\,(V - v_i)}_{\\text{평균 }V\\text{보다 덜 받았으면 양수}} \\ge 0,\\qquad \\underbrace{vd_i}_{\\text{가상 마감}} = \\underbrace{ve_i}_{\\text{현재 vruntime}} + \\underbrace{\\frac{r_i}{w_i}}_{\\text{slice 0.75 ms를 가중치로 나눔}}"}
            operations={[
              { expression: "V = \\frac{\\sum w_i v_i}{\\sum w_i}", annotation: ["A가 0.75 ms, B가 0을 썼으면 V = 1024 × 0.75 ÷ 1359 = 0.57 ms입니다.", "A(0.75)는 V보다 커서 lag가 음수, B(0)는 양수입니다."] },
              { expression: "vd_B = 0 + 0.75 \\times \\frac{1024}{335}", annotation: ["B의 마감은 2.29 ms입니다. A의 0.75 ms보다 멀어 둘 다 자격이 있을 때는 A가 먼저입니다."] },
            ]}
            terms={[
              { symbol: "v_i", name: "vruntime", description: "실제 실행 시간을 1024 ÷ w_i 배 해서 누적한 가상 시간입니다(calc_delta_fair)." },
              { symbol: "V", name: "가중 평균 vruntime", description: "run queue 안 모든 작업의 vruntime을 가중치로 평균한 값입니다. 커널은 나눗셈 오차를 피하려고 분모를 곱한 꼴로 비교합니다(vruntime_eligible)." },
              { symbol: "w_i", name: "가중치", description: "6절의 sched_prio_to_weight 값입니다. cgroup cpu.weight가 있으면 그룹 단위로 한 겹 더 곱해집니다." },
              { symbol: "r_i", name: "요청량(slice)", description: "기본 sysctl_sched_base_slice = 0.75 ms입니다. sched_setattr로 작업마다 짧게 요청하면 마감이 가까워져 지연 민감 작업이 먼저 뽑힙니다." },
            ]}
            assumptions={["두 작업 모두 잠들지 않고 CPU만 씁니다. 잠들었다 깬 작업의 lag 처리는 EEVDF 문서가 '진행 중 논의'로 적은 부분이라 이 글은 다루지 않습니다.", "RUN_TO_PARITY 기능으로 한번 고른 작업은 자격을 잃거나 새 slice를 받을 때까지 계속 돕니다."]}
            interpretation="가중치는 장기 비율을, 마감은 단기 순서를 정합니다. 같은 nice라도 slice를 짧게 요청한 작업은 자주 짧게 뽑히고, 길게 요청한 작업은 드물게 길게 뽑힙니다."
          />
          <div className={prose}>
            <p>아래 의사코드는 틱마다 불리는 update_curr와 전환 시점에 불리는 pick_eevdf를 합쳐 한 줄씩 펼친 것입니다. 각 줄의 설명에 A(nice 0)와 B(nice 5)가 CPU 하나를 두고 겨루는 값을 적었습니다.</p>
          </div>
          <AlgorithmBlock
            title="틱마다 vruntime을 올리고, 전환 때 자격 있는 최단 마감을 고르는 순서"
            input={["A: w = 1024, v = 0, deadline = 0.75", "B: w = 335, v = 0, deadline = 2.29", "slice = 0.75 ms (sysctl_sched_base_slice)", "curr = A (처음 고른 작업)"]}
            steps={[
              { code: "delta = now - curr.exec_start", note: "틱이 울려 A가 0.75 ms를 썼습니다." },
              { code: "curr.vruntime += delta * 1024 / curr.weight", note: "A는 0.75 그대로 더해 v = 0.75. B였다면 0.75 × 1024 ÷ 335 = 2.29를 더했을 것입니다." },
              { code: "if curr.vruntime >= curr.deadline: curr.deadline = curr.vruntime + slice * 1024 / curr.weight; resched = true", note: "A가 마감 0.75에 닿았으므로 새 마감 1.5를 받고 재스케줄 표시가 섭니다." },
              { code: "V = sum(w_i * v_i) / sum(w_i)", note: "(1024 × 0.75 + 335 × 0) ÷ 1359 = 0.57 ms입니다." },
              { code: "candidates = [t for t in rq if t.vruntime <= V]", note: "A(0.75 > 0.57)는 빠지고 B(0 ≤ 0.57)만 남습니다." },
              { code: "next = min(candidates, key=deadline)", note: "B 하나뿐이라 B입니다. 후보가 여럿이면 마감이 가장 이른 것을 고릅니다. 트리는 마감 순으로 정렬돼 있고 각 노드가 서브트리의 최소 vruntime을 들고 있어 자격 없는 가지를 통째로 건너뜁니다." },
              { code: "context_switch(curr, next); ctxt += 1", note: "A의 레지스터를 저장하고 B의 것을 복원합니다. /proc/stat의 ctxt가 1 오릅니다." },
            ]}
            repeatUntil="틱마다 1~3번 줄을, 재스케줄 표시가 설 때마다 4~7번 줄을 반복합니다."
            output="3.75 ms 뒤 A는 3.0 ms, B는 0.75 ms를 받습니다(80 : 20). 오래 돌리면 1024 : 335 = 75.4 : 24.6으로 수렴합니다."
          />
          <EevdfPickViz />
          {code("eevdf-doc", "EEVDF 문서: lag와 가상 마감")}
          <div id="paper-eevdf-doc" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux v6.12 · Documentation/scheduler/sched-eevdf.rst (2026-10-17 확인)" citeKey={3} href="https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/scheduler/sched-eevdf.rst">
              <q>EEVDF picks tasks with lag greater or equal to zero and calculates a virtual deadline (VD) for each, selecting the task with the earliest VD to execute next.</q> 같은
              문서는 EEVDF가 1995년 논문에서 나왔고 커널 6.6부터 CFS를 대체하기 시작했으며, 잠든 작업의 lag는 가상 시간에 따라 서서히 줄이는 방식(deferred dequeue)을 쓴다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="kernel-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 원문은 가상 시간을 더하고, 자격을 판정하고, 트리에서 최단 마감을 뽑습니다</h2>
          <div className={prose}>
            <p>
              Linux v6.12 kernel/sched/fair.c의 calc_delta_fair(289–295행)가 7절의 첫 줄입니다. 가중치가 NICE_0_LOAD(1024)와 다를 때만 __calc_delta를 불러 delta × 1024 ÷ weight를
              계산하며, 그 나눗셈은 미리 계산한 역수 표 sched_prio_to_wmult(core.c 10030행)를 곱해 시프트하는 방식으로 피합니다.
            </p>
            <p>
              틱마다 불리는 update_curr(1216–1232행)가 이 값을
              vruntime에 더한 뒤(1226행) update_deadline(1007–1029행)을 부릅니다. 1009행은 아직 마감에 못 미친 작업을 그냥 돌려보내는 한편, 1017–1023행은 slice 기본값을 채운 뒤 vd = ve + r/w를
              적습니다.
            </p>
            <p>
              자격 판정은 vruntime_eligible(726–740행)입니다. 708–724행 주석이 lag_i = w_i(V − v_i) ≥ 0을 분모를 곱한 꼴 Σ(v_i − v)w_i ≥ (v_i − v)Σw_i로 바꾸는 이유를 적습니다.
              평균을 나눗셈으로 구하면 정밀도가 깎여 경계에서 잘못 판정할 수 있기 때문입니다. 현재 실행 중인 작업은 트리 밖에 있으므로 avg와 load에 따로 더합니다.
            </p>
            <p>
              pick_eevdf(907–970행)는 두 조건을 트리 한 번 훑기로 해결합니다. 작업이 하나뿐이면 바로 돌려주며(918–919행), RUN_TO_PARITY가 켜진 상태에서 현재 작업이 아직 요청량을 다
              쓰지 않았으면 계속 돌립니다(925–931행).
            </p>
            <p>
              그 뒤 왼쪽 서브트리의 최소 vruntime이 자격이 있으면 왼쪽으로(더 이른 마감), 없으면 현재 노드를 검사한 뒤 오른쪽으로 내려갑니다
              (935–962행). O(log n)에 "자격 있는 최단 마감"이 나옵니다.
            </p>
            <p>
              시스템 콜 입구는 arch/x86/entry/entry_64.S의 entry_SYSCALL_64(87–170행)입니다. 91–95행이 swapgs와 스택 교체, 101–109행이 pt_regs 구성, 121행이 do_syscall_64 호출,
              164–166행이 swapgs와 sysretq 복귀입니다.
            </p>
            <p>
              스레드와 프로세스를 가르는 copy_mm(fork.c 1697–1733행)과 copy_files(1756–1784행)는 각각 1720행과 1773행의 비트 검사 하나로
              공유와 복제를 가릅니다. 상태 비트는 include/linux/sched.h 99–136행, 글자표는 fs/proc/array.c 126–140행입니다.
            </p>
          </div>
          {code("calc-delta-fair", "calc_delta_fair: 가상 시간 환산")}
          {code("update-curr", "update_curr: 틱마다 누적")}
          {code("update-deadline", "update_deadline: 새 마감")}
          {code("vruntime-eligible", "vruntime_eligible: lag ≥ 0 판정")}
          {code("pick-eevdf", "pick_eevdf: 트리 탐색")}
        </section>

        <section id="observe" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. strace -T는 문을 지난 시간을, -c는 지난 횟수를 보여 줍니다</h2>
          <div className={prose}>
            <p>
              3절의 "몇 번 문을 두드렸나"를 재는 도구가 strace입니다. strace -f -T -p PID는 그 프로세스와 스레드(-f)가 부르는 시스템 콜을 한 줄씩 적은 뒤 각 줄 끝에 시작과 끝의 시간 차를
              붙입니다(-T).
            </p>
            <p>
              read()가 &lt;0.000012&gt;로 끝나면 page cache에서 바로 온 것이며, &lt;0.004120&gt;이면 그 사이 D 상태로 디스크를 기다린 시간이 섞인 것입니다. strace -c는
              호출별 횟수·시간·오류 수를 집계해 끝에 표로 냅니다. 1 바이트씩 4,096번 read하는 프로그램은 이 표의 calls 열에서 바로 드러납니다.
            </p>
            <p>
              strace는 ptrace로 대상 프로세스를 시스템 콜마다 멈춰 세우므로 대상이 눈에 띄게 느려집니다. 운영 중인 서비스에는 짧게, 특정 PID에만 거는 것이 안전합니다. 더 가벼운 관측
              도구(perf·eBPF)는 이 시리즈의 관측 글에서 다룹니다.
            </p>
            <p>
              상태는 /proc/PID/status의 State 줄(5절의 글자)과 /proc/PID/task/ 아래 스레드별 status에서 읽습니다. D가 오래 지속되면 /proc/PID/stack 또는 wchan에서 어느 커널 함수에서
              자고 있는지 확인합니다.
            </p>
            <p>
              서버 전체는 /proc/stat의 procs_running·procs_blocked와 ctxt, 곧 vmstat 1의 r·b·cs 열입니다. r이 CPU 수를 꾸준히 넘으면 CPU 포화, b가 0이 아니면
              I/O 대기, cs가 급증하면 잠들었다 깨기를 반복하는 작업이 있다는 뜻입니다.
            </p>
            <p>
              가중치와 마감은 /proc/PID/sched에서 se.vruntime·se.deadline·se.slice로, nice는 ps -o pid,ni,stat,wchan,comm으로 읽습니다. renice로 바꿀 수 있지만 6절에서 본 대로 nice는
              겨룰 때의 비율만 바꾸므로 상대가 없는 CPU에서는 아무 효과가 없습니다.
            </p>
          </div>
          {code("strace-options", "strace -T와 -c")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 볼 숫자는 r·b·cs와 상태 글자이고, 고칠 곳은 호출 횟수와 가중치입니다</h2>
          <div className={prose}>
            <p>
              1절의 세 숫자를 다시 읽습니다. CPU 사용률 40%는 CPU 2개 가운데 평균 0.8개가 바빴다는 뜻이며, load 3은 R과 D가 평균 세 개 있었다는 뜻입니다. 둘의 차이 2.2개가 디스크를
              기다리는 D거나, 두 CPU 가운데 한쪽 run queue에만 몰린 R입니다.
            </p>
            <p>
              압축이 느린 것은 nice 5의 가중치 335가 웹 서버 스레드의 1024와 겨뤄 24.6%만 받기 때문으로, 웹 서버가 한가한
              순간에는 100%를 씁니다. 세 숫자는 모순이 아니라 같은 run queue를 다른 각도에서 본 것입니다.
            </p>
            <p>
              고칠 곳은 두 층입니다. 시스템 콜 층에서는 작은 read·write를 버퍼로 모아 호출 횟수를 줄입니다. 문을 지나는 비용은 바이트 수가 아니라 횟수에 비례하기 때문입니다. 스케줄링
              층에서는 nice보다 cgroup의 cpu.weight와 cpu.max를 씁니다.
            </p>
            <p>
              nice는 스레드마다 다를 수 있는 데다 겨룰 때만 작동하지만, cgroup은 프로세스 묶음 단위로 비율(weight)과 상한(max)을
              따로 정합니다. Kubernetes의 CPU requests가 cpu.weight로, limits가 cpu.max로 바뀌는 과정은 <a href="/cs/cloud/linux-containers-cgroup-namespace#overview">다음 글</a>에
              있습니다.
            </p>
            <p>
              이 글의 수치는 Linux v6.12 원문의 표와 식으로 손 계산한 값이며 실제 스케줄러 trace를 기록한 것이 아닙니다. 두 작업이 잠들지 않는다는 가정을 뺀 실제 서버에서는 잠든 작업의
              lag 처리, CPU 간 이동(load balancing), cgroup 계층이 결과를 바꿉니다. 이 글이 세운 바닥 위에서 <a href="/cs/cloud/linux-server-interview-incident-map#mechanism">load average 식</a>,{" "}
              <a href="/cs/cloud/linux-process-signals-pid1-fds#overview">fork·exec·시그널</a>, <a href="/cs/cloud/linux-memory-page-cache-oom#overview">메모리 회수와 OOM</a>이 각각
              한 장애씩 내려갑니다.
            </p>
          </div>
          <ContentBoundary article="linux-kernel-process-syscall-scheduler" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>압축 작업을 nice 10으로 내리면 웹 서버 스레드 하나와 겨룰 때 몇 %를 받을까요? 가중치 표에서 값을 찾아 계산하세요. (답: 6절)</p>
            <p>7절의 두 작업에 nice 0인 세 번째 작업 C가 vruntime 0으로 들어오면 첫 전환에서 누가 뽑히고, V는 어떻게 바뀔까요? (답: 7절)</p>
            <p>fork로 만든 자식과 pthread_create로 만든 스레드가 각각 fd 7을 close()하면 부모(또는 다른 스레드)의 fd 7은 어떻게 될까요? copy_files의 두 갈래로 설명하세요. (답: 4절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxKernelProcessTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "man-pages": { id: "man-pages", label: "Linux man-pages 6.9.1", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
          strace: { id: "strace", label: "strace v6.12 man page", badgeClass: "bg-amber-500/10 border-amber-500 text-amber-700" },
        }}
      />
    </>
  );
}
