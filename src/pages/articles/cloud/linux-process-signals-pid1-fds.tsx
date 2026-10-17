import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ZombieTableViz from "./linux-process-signals-pid1-fds/viz/ZombieTableViz";
import StopSequenceViz from "./linux-process-signals-pid1-fds/viz/StopSequenceViz";
import SignalVerdictViz from "./linux-process-signals-pid1-fds/viz/SignalVerdictViz";
import FdTableViz from "./linux-process-signals-pid1-fds/viz/FdTableViz";
import { codeRefs } from "./linux-process-signals-pid1-fds/codeRefs";
import { linuxProcTrees } from "./linux-process-signals-pid1-fds/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";
const pre = "not-prose my-4 overflow-x-auto rounded-sm border border-border bg-muted/40 p-3 font-mono text-xs leading-5";

export default function LinuxProcessSignalsPid1FdsArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. docker stop이 10초를 꽉 채우고 137로 끝났습니다</h2>
          <div className={prose}>
            <p>
              (가정) 배포 때마다 shop-api 컨테이너를 내리는 데 정확히 10초가 걸립니다. docker ps에는 Exited (137)이 남고 그 순간 처리 중이던 주문 요청 몇
              건은 응답 없이 끊깁니다. 이미지의 ENTRYPOINT는 start.sh이고 이 스크립트는 DB migration을 돌린 뒤 python server.py를 실행합니다.
            </p>
            <p>
              이 글의 답을 먼저 적겠습니다. 컨테이너의 PID 1은 처리기를 등록하지 않은 신호를 커널이 버립니다. trap이 없는 start.sh는 SIGTERM을 받지 못하고
              python은 신호를 받은 적이 없으니 정리를 시작하지 않습니다. 10초가 지나 SIGKILL이 오면 둘 다 끝나고, 9번 신호로 죽었다는 뜻의 128 + 9 = 137이
              남습니다.
            </p>
            <p>
              같은 사례가 SRE·인프라 면접의 단골 질문을 차례로 엽니다. 좀비 프로세스는 무엇이고 어떻게 정리하는지, SIGTERM과 SIGKILL은 무엇이 다른지, 신호
              처리기와 신호 막기(masking)는 어떻게 동작하는지, Too many open files는 왜 나는지입니다. 어떤 질문이 어디서 나오는지는{" "}
              <Link to="/cs/cloud/linux-server-interview-incident-map#overview">리눅스 면접·장애 지도</Link>에 정리했습니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 프로세스는 만들고, 바꾸고, 끝내고, 거두는 네 단계를 거칩니다</h2>
          <div className={prose}>
            <p>
              먼저 이름 없이 흐름만 보겠습니다. 실행 중인 프로그램 하나가 자기를 복제해 자식을 만듭니다. 자식은 복제된 몸을 다른 프로그램으로 갈아 끼우고 일을 마치면 끝납니다. 끝난
              자식이 남긴 종료 결과를 부모가 읽어 가면 그때 자식의 흔적이 완전히 사라집니다.
            </p>
            <p>
              이 흐름에 바깥에서 끼어드는 통로가 하나 있습니다. 운영자나 다른 프로그램이 숫자 하나짜리 알림을 보내면 받는 쪽은 미리 등록한 함수로 처리하거나 커널이 정한 기본 동작을
              따릅니다. 기본 동작은 대개 종료입니다. 이 알림을 누가 보냈고 받는 쪽이 누구인지에 따라 커널이 알림을 아예 버리기도 합니다.
            </p>
            <p>
              마지막으로 프로세스마다 열린 파일을 가리키는 번호표가 있습니다. 번호표는 0번부터 차례로 나가고 프로세스가 쓸 수 있는 최대 번호에 상한이 있습니다.
              이 세 흐름이 각각 좀비, 신호, fd 한도라는 면접 질문으로 이어집니다. 복제된 자식이 부모와 무엇을 공유하는지(스레드와의 차이)와 프로세스가 R·S·D·Z 사이를 어떻게 옮겨 다니는지는 <a href="/cs/cloud/linux-kernel-process-syscall-scheduler#threads">커널과 프로세스 글</a>에서 먼저 봅니다.
            </p>
          </div>
        </section>

        <section id="case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 10초와 137은 같은 사건의 두 숫자입니다</h2>
          <div className={prose}>
            <p>
              (가정) 컨테이너 안의 프로세스는 둘입니다. PID 1은 /bin/sh start.sh이고, migration을 마친 뒤 PID 7로 python server.py를 띄워 끝날 때까지
              기다립니다. 컨테이너는 자기만의 PID 번호 공간을 가지므로 그 안에서 첫 프로세스가 1번을 받습니다.
            </p>
            <p>
              Docker 문서에 따르면 docker stop은 컨테이너의 주 프로세스에 SIGTERM을 보내고, 유예 시간 뒤에도 끝나지 않으면 SIGKILL로 강제 종료합니다. Linux
              컨테이너의 기본 유예는 10초입니다. 10초를 꽉 채웠다는 것은 SIGTERM이 아무 효과도 내지 못했다는 뜻입니다. Kubernetes에서는 같은 SIGTERM이 기본 30초 유예와 함께 가고 endpoint 제거와 경주하는데, 그 순서는 <a href="/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#termination-flow">종료·롤아웃 글</a>에 있습니다.
            </p>
            <p>
              137은 종료 코드입니다. bash 매뉴얼은 명령이 치명적인 신호 N으로 끝나면 128 + N을 종료 상태로 쓴다고 적고, Docker에서 PID 1을 거두는 containerd-shim과 runc의 ExitStatus도 같은 규칙으로 컨테이너의 종료
              코드를 만듭니다. SIGKILL은 9번이니 137, SIGTERM으로 끝났다면 143이었을 것입니다.
            </p>
          </div>
          <ExplainedFormula
            question="신호로 끝난 프로세스의 종료 코드는 어떻게 정해집니까?"
            idea="관례적으로 128 이상을 신호 종료에 쓰므로, 숫자에서 128을 빼면 몇 번 신호로 죽었는지 거꾸로 읽을 수 있습니다. 프로그램이 exit(137)을 직접 불러도 같은 숫자가 되므로 완전히 구별되지는 않습니다."
            formula={"\\text{status}=128+N"}
            annotatedFormula={"\\text{status}=\\underbrace{128}_{\\text{신호로 죽었다는 표시}}+\\underbrace{N}_{\\text{죽인 신호 번호}}"}
            operations={[
              { expression: "128+N", annotation: ["SIGKILL N = 9이면 137입니다.", "SIGTERM N = 15이면 143입니다."] },
              { expression: "N", annotation: ["커널의 wait 상태 하위 7비트에 들어 있는 값입니다.", "containerd-shim과 runc ExitStatus가 이 값을 꺼내 128에 더합니다."] },
            ]}
            terms={[
              { symbol: "\\text{status}", name: "종료 코드", description: "셸의 $? 와 docker ps의 Exited (…)에 보이는 값입니다." },
              { symbol: "N", name: "신호 번호", description: "x86·ARM에서 SIGINT 2, SIGKILL 9, SIGTERM 15입니다." },
            ]}
            assumptions={["프로그램이 exit(137)을 직접 불러도 같은 숫자가 나옵니다. 신호로 죽었는지는 wait 상태로 확인합니다.", "137만으로는 SIGKILL을 누가 보냈는지 모릅니다. 메모리 한도 초과로 커널이 죽여도 같은 9번입니다."]}
            interpretation="shop-api의 137은 SIGKILL로 끝났다는 뜻이고, 10초는 그 SIGKILL이 유예가 다 지난 뒤에 왔다는 뜻입니다. 둘을 합치면 SIGTERM이 효과를 내지 못했다는 결론이 나옵니다."
          />
          <div className={prose}>
            <p>
              메모리 한도로 죽은 137과 구별하는 방법은 <Link to="/cs/cloud/linux-memory-page-cache-oom#overview">메모리·OOM 글</Link>에서 다룹니다. 여기서는 SIGTERM이
              왜 효과가 없었는지를 따라갑니다. 그 전에 프로세스가 끝나고 거둬지는 흐름부터 숫자로 보겠습니다.
            </p>
          </div>
          {code("runc-exit", "runc의 128 + 신호 번호")}
        </section>

        <section id="lifecycle" data-teach-level="1" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 끝난 helper도 부모가 읽기 전까지 PID 칸을 붙잡습니다</h2>
          <div className={prose}>
            <p>
              자식을 만드는 시스템 콜이 fork입니다. fork(2) 문서는 호출한 프로세스를 복제해 새 프로세스를 만들고, 자식은 고유한 PID와 부모의 열린 fd 복사본을
              받는다고 적습니다. execve는 새 프로세스를 만들지 않습니다. 같은 PID를 유지한 채 그 안의 프로그램만 새것으로 덮어씁니다.
            </p>
            <p>
              자식이 끝나면 커널은 PID, 종료 상태, 자원 사용량을 남겨 둡니다. 부모가 wait로 그 정보를 읽어 가야 칸이 비워집니다. wait(2) 문서는 끝났지만 아직 wait되지
              않은 자식을 좀비(zombie)라고 부릅니다. ps의 STAT 열에 Z로 보이는 프로세스입니다.
            </p>
            <p>
              (가정) server.py가 썸네일 요청마다 helper를 하나 fork하고 wait를 부르지 않는다고 합시다. 초당 3개씩 만들면 좀비가 1분에 180개, 1시간에
              10,800개 쌓입니다. 좀비는 메모리를 거의 쓰지 않지만 PID를 하나씩 잡고 있고 PID는 개수에 상한이 있습니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="좀비가 PID 공간을 채우는 시간"
            question="wait하지 않는 helper가 초당 3개씩 생기면 언제 fork가 실패합니까?"
            scope="16 CPU 서버 한 대의 PID 공간 하나만 셉니다. 다른 프로세스가 쓰는 PID, cgroup pids.max, 컨테이너 런타임의 PID 제한은 넣지 않습니다."
            steps={[
              { label: "pid_max", expression: "max(32,768, 1,024 × 16 CPU)", result: "32,768", reason: "커널 pid.c는 CPU당 1,024개와 기본값 32,768 중 큰 쪽을 씁니다. 16 CPU면 16,384라 기본값이 남습니다." },
              { label: "1분", expression: "3 개/초 × 60 초", result: "180개", reason: "helper가 끝나도 부모가 wait하지 않으므로 하나도 칸을 돌려주지 않습니다." },
              { label: "1시간", expression: "3 개/초 × 3,600 초", result: "10,800개", reason: "같은 비율로 계속 쌓입니다." },
              { label: "가득 참", expression: "32,768 ÷ 3 개/초", result: "10,923초 ≈ 3시간 2분", reason: "모든 PID가 좀비에게 잡히면 fork(2)가 EAGAIN으로 실패합니다." },
            ]}
            conclusion="좀비는 메모리가 아니라 PID 칸을 소모합니다. 3시간쯤 뒤에는 새 helper는 물론 운영자가 들어가 띄울 셸도 fork할 수 없습니다."
            caveats={["실제로는 다른 프로세스가 수백 개의 PID를 쓰고 있어 더 일찍 찹니다.", "컨테이너에 pids.max를 걸었다면 그 값이 먼저 상한이 됩니다."]}
          />
          <ZombieTableViz />
          <div className={prose}>
            <p>
              좀비는 이미 끝난 프로세스라 kill로 지울 수 없습니다. 지우는 길은 두 가지입니다. 부모가 wait를 부르게 고치거나, 부모를 끝내서 좀비들이 새 부모에게 넘어가게 하는
              것입니다. wait(2) 문서는 부모가 끝나면 좀비 자식이 init(PID 1)이나 가장 가까운 subreaper에게 입양되고 init이 자동으로 wait해 거둔다고
              적습니다. 컨테이너 안에서는 그 init이 start.sh라는 점이 9절의 문제가 됩니다.
            </p>
            <p>면접에서 좀비를 찾으라고 하면 아래처럼 STAT이 Z인 줄과 그 부모를 함께 보입니다. 정리 대상은 좀비가 아니라 같은 PPID를 가진 부모입니다.</p>
          </div>
          <pre className={pre}>{`$ ps -eo pid,ppid,stat,comm | awk '$3 ~ /Z/'      # (예시 출력)
  812     7 Z    convert <defunct>
  815     7 Z    convert <defunct>
$ ps -o pid,comm -p 7
    7 python`}</pre>
          {code("pid-max", "pid_max 기본값 계산")}
        </section>

        <section id="signals" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. SIGTERM은 정리할 기회를 주고 SIGKILL은 주지 않습니다</h2>
          <div className={prose}>
            <p>
              신호는 프로세스에게 보내는 번호 하나짜리 알림입니다. 받는 프로세스는 신호마다 세 가지 중 하나를 정해 둡니다. 기본 동작을 따르거나, 무시하거나, 자기 함수를
              실행합니다. 이 선택을 신호 처리 방식(signal disposition)이라고 부르고, 등록한 함수를 신호 처리기(signal handler)라고 부릅니다.
            </p>
            <p>
              signal(7)에 따르면 SIGTERM의 기본 동작은 종료이지만 처리기를 등록할 수 있습니다. 그래서 서버는 SIGTERM을 받으면 새 요청을 멈추고 진행 중인 요청을
              끝낸 뒤 스스로 나갈 수 있습니다. SIGKILL과 SIGSTOP은 처리기를 두거나 막거나 무시할 수 없습니다. SIGKILL은 커널이 바로 끝내므로 정리 코드가 돌 틈이 없고, SIGSTOP은 끝내지 않고 멈춰 세웁니다.
            </p>
            <p>
              신호를 잠시 막아 두는 것을 신호 마스크(signal mask)라고 합니다. 막힌 신호는 사라지지 않고 대기(pending) 상태로 남았다가 막기를 풀면 전달됩니다. 중요한
              구간 동안만 처리기 실행을 미룰 때 씁니다. 버리는 것과 막는 것은 다르다는 점이 면접에서 자주 확인하는 지점입니다.
            </p>
            <p>
              fork한 자식은 부모의 처리 방식을 물려받습니다. execve는 처리기로 등록된 신호를 기본 동작으로 되돌리고 무시하던 신호는 그대로 둡니다. 새 프로그램의 메모리에는 옛
              처리기 함수가 없기 때문입니다. Python은 시작할 때 SIGINT를 KeyboardInterrupt로 바꾸는 처리기와 SIGPIPE·SIGXFSZ 무시만 설치하므로, SIGTERM은
              따로 등록하지 않는 한 기본 동작입니다. 이 사실이 10절에서 exec 하나로는 부족한 이유가 됩니다.
            </p>
            <p>
              터미널의 foreground와 background도 신호로 나뉩니다. credentials(7)에 따르면 Ctrl-C가 만든 SIGINT는 foreground 작업의 프로세스들에게만 갑니다.
              &amp;로 띄운 background 작업이 터미널을 읽으려 하면 SIGTTIN을 받아 멈춥니다. Ctrl-C가 background 작업을 끝내지 못하는 이유가 이것입니다.
            </p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 좀비를 거두는 쪽과 신호를 버리는 규칙에 이름을 붙입니다</h2>
          <div className={prose}>
            <p>
              고아가 된 자식을 넘겨받아 wait해 주는 프로세스를 reaper라고 부릅니다. 커널 안에서는 PID namespace마다 child_reaper 하나가 정해져 있고(PID namespace가 다른 일곱 namespace와 함께 무엇을 가리는지는 <a href="/cs/cloud/linux-containers-cgroup-namespace#namespaces">cgroup과 namespace 글</a>) 그것이
              그 namespace의 PID 1입니다. PID 1이 아니어도 prctl로 표시하면 자기 자손의 고아를 대신 받는 subreaper가 될 수 있습니다.
            </p>
            <p>
              커널은 child_reaper가 될 프로세스에 SIGNAL_UNKILLABLE 표시를 붙입니다. 이 표시가 있는 프로세스는 처리기를 등록하지 않은 신호를 받지 않습니다. 예외는
              조상 namespace에서 온 SIGKILL과 SIGSTOP, 그리고 OOM killer처럼 커널이 직접 만든 SIGKILL입니다. 막아 둔 신호는 이 검사를 거치지 않고 pending으로 남습니다.
            </p>
            <p>
              pid_namespaces(7)도 같은 규칙을 적습니다. 같은 namespace의 프로세스는 init이 처리기를 둔 신호만 보낼 수
              있고, 조상 namespace에서 온 SIGKILL·SIGSTOP은 강제로 전달됩니다.
            </p>
            <p>
              fd 한도에도 이름이 둘입니다. 프로세스 하나가 가질 수 있는 fd 번호의 상한은 RLIMIT_NOFILE이고, 넘으면 EMFILE이 납니다. 서버 전체의 열린 파일 개수 상한은
              file-max이고, 넘으면 ENFILE이 납니다. 둘 다 Too many open files로 보이지만 고칠 곳이 다릅니다. 이 둘은 11절에서 다시 봅니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("unkillable-mark", "PID 1에 UNKILLABLE 표시")}
            {code("kernel-only-mask", "SIGKILL·SIGSTOP만 kernel_only")}
          </div>
        </section>

        <section id="pid1-trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. host에서 온 SIGTERM이 PID 1에서 사라지는 경로를 따라갑니다</h2>
          <div className={prose}>
            <p>
              3절의 사례를 이름이 붙은 부품으로 다시 따라가겠습니다. docker stop은 host에서 실행되는 runc를 통해 컨테이너 PID 1에 kill을 보냅니다. 보낸 쪽은 컨테이너
              namespace의 조상 namespace에 있으므로 커널은 이 신호에 force 표시를 붙입니다.
            </p>
            <p>
              start.sh에는 trap이 없으므로 SIGTERM 처리기가 SIG_DFL입니다. 대상에 UNKILLABLE이 있고, 처리기가 기본값이고, 신호가 SIGKILL·SIGSTOP이 아니라서 force가
              예외를 만들지 못합니다. 세 조건이 모두 맞으므로 커널은 SIGTERM을 대기열에 넣지도 않고 버립니다. 아래 절차는 이 판정이 10초 뒤의 SIGKILL과 어떻게
              다른지까지 한 줄씩 보여 줍니다.
            </p>
          </div>
          <AlgorithmBlock
            title="docker stop shop-api 한 번"
            input={["PID 1 = sh start.sh (trap 없음), PID 7 = python server.py", "유예 10초, 첫 신호 SIGTERM"]}
            steps={[
              { code: "docker stop shop-api", note: "Linux 컨테이너의 기본 유예는 10초입니다." },
              { code: "kill(PID 1, SIGTERM)", note: "host에서 보냈으므로 send_signal_locked가 force = true로 둡니다." },
              { code: "if UNKILLABLE ∧ SIG_DFL ∧ ¬(force ∧ kernel_only) → 버림", note: "SIGTERM은 kernel_only가 아니어서 버려집니다. pending에도 남지 않습니다." },
              { code: "wait(10초)", note: "python은 신호를 받지 못했으므로 정리를 시작하지 않습니다." },
              { code: "kill(PID 1, SIGKILL)", note: "force ∧ kernel_only라 UNKILLABLE 검사를 통과합니다." },
              { code: "PID 1 종료 → namespace 전체 SIGKILL", note: "init이 죽으면 커널이 namespace의 나머지를 SIGKILL로 정리합니다. python도 여기서 끝납니다." },
              { code: "exit status = 128 + 9", note: "PID 1을 거둔 containerd-shim이 runc와 같은 규칙으로 137을 기록합니다." },
            ]}
            output="10.0초 뒤 Exited (137). python은 SIGTERM을 한 번도 받지 못했으므로 진행 중인 요청은 응답 없이 끊깁니다."
          />
          <StopSequenceViz />
          <div className={prose}>
            <p>
              같은 판정을 다섯 경우에 적용하면 면접에서 자주 섞이는 질문이 정리됩니다. 컨테이너 안에서 kill -9 1을 쳐도 PID 1이 죽지 않는 이유, PID 7에 보낸 SIGTERM은
              처리기가 없어도 프로세스를 끝내는 이유가 같은 세 조건에서 나옵니다.
            </p>
          </div>
          <SignalVerdictViz />
        </section>

        <section id="kernel-signal" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 커널은 신호를 보내는 순간 init 보호 규칙을 적용합니다</h2>
          <div className={prose}>
            <p>
              Linux v6.12의 kernel/fork.c 2558~2561행은 새 PID namespace의 첫 프로세스를 child_reaper로 정하고 SIGNAL_UNKILLABLE을 켭니다. 이 줄은 runc가 새 PID namespace에 첫 프로세스(runc init)를 clone할 때 지나고,
              그 프로세스가 execve로 start.sh가 되어도 signal_struct의 표시는 그대로 남습니다.
            </p>
            <p>
              kernel/signal.c의 send_signal_locked(1214~1249행)가 force를 정합니다. 1241~1245행은 보낸 쪽이 대상 namespace에서 PID가 없으면, 곧 조상 namespace에서
              왔으면 force를 true로 둡니다. 컨테이너 안의 셸에서 보낸 kill은 1239행의 SI_KERNEL 검사도 통과하지 못해 force가 false로 남습니다.
            </p>
            <p>
              sig_task_ignored(82~101행)의 92~94행이 3절 사례의 원인입니다. UNKILLABLE이고 처리기가 SIG_DFL이며 force ∧ sig_kernel_only가 아니면 true를 돌려줍니다.
              signal.h 419~420행이 정의하는 sig_kernel_only는 SIGKILL과 SIGSTOP뿐이므로 SIGTERM 15는 여기서 버려집니다. __send_signal_locked 1084행이 그 결과를 받아
              대기열에 넣지 않고 끝냅니다.
            </p>
            <p>
              받는 쪽에도 한 겹이 더 있습니다. get_signal의 2843~2845행은 기본 동작을 고를 때 init이면 kernel_only가 아닌 신호를 건너뜁니다. 보낼 때 막아 두었다가
              나중에 풀린 신호도 결국 init에서는 기본 동작을 하지 않는다는 뜻입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("send-force", "조상 namespace면 force")}
            {code("task-ignored", "UNKILLABLE 판정")}
            {code("prepare-drop", "버린 신호는 대기열에 없음")}
            {code("get-signal-init", "받는 쪽의 init 보호")}
          </div>
          <div id="paper-pid-namespaces" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="man7.org · pid_namespaces(7) (2026-10-15 확인)" citeKey={1} href="https://man7.org/linux/man-pages/man7/pid_namespaces.7.html">
              namespace의 init에는 init이 처리기를 등록한 신호만 같은 namespace에서 보낼 수 있고, 조상 namespace에서 온 SIGKILL·SIGSTOP은 강제로 전달됩니다. init이
              끝나면 커널이 namespace의 모든 프로세스를 SIGKILL로 끝냅니다.
            </CitationBlock>
          </div>
        </section>

        <section id="reaper" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 좀비를 남기는 줄과 거두는 줄은 exit.c에 있습니다</h2>
          <div className={prose}>
            <p>
              helper 하나가 끝나면 kernel/exit.c의 exit_notify(731~778행)가 돕니다. 738행에서 자기 자식을 새 부모에게 넘기고, 743행에서 자신을
              EXIT_ZOMBIE로 표시한 뒤 부모에게 SIGCHLD를 보냅니다. 756~767행의 autoreap가 false면 여기서 멈추고 좀비는 부모의 wait를 기다립니다.
            </p>
            <p>
              autoreap가 true가 되는 길은 signal.c do_notify_parent의 2116~2134행에 있습니다. 부모가 SIGCHLD를 SIG_IGN으로 두었거나 SA_NOCLDWAIT를 켰다면 POSIX가 정한
              대로 좀비를 남기지 않습니다.
            </p>
            <p>
              signal.h 434~436행이 보여 주듯 SIGCHLD의 기본 동작 자체도 무시이지만, 기본값인 SIG_DFL은 이 특별 규칙에 해당하지
              않습니다. 처리기를 두지 않은 server.py가 좀비를 쌓는 이유입니다.
            </p>
            <p>
              부모의 wait는 wait_task_zombie(1143행~)로 들어갑니다. 1169행에서 EXIT_ZOMBIE를 EXIT_DEAD로 바꾸고 1250행의 release_task가 PID를 놓습니다. 1253~1261행은
              wait 상태의 하위 7비트로 정상 종료와 신호 종료를 가르는데, 3절의 128 + N에서 N이 바로 이 값입니다.
            </p>
            <p>
              부모가 먼저 끝나면 find_new_reaper(618~658행)가 고아를 넘길 곳을 고릅니다. 같은 스레드 그룹, 가장 가까운 subreaper, 그 namespace의 PID 1 순서입니다.
              컨테이너에서 server.py가 죽으면 남은 좀비는 start.sh에게 갑니다. 그리고 PID 1이 죽으면 find_child_reaper의 612행이 zap_pid_ns_processes로 namespace를
              통째로 정리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("exit-notify", "exit_notify: 좀비 표시")}
            {code("autoreap", "SIG_IGN이면 자동으로 거둠")}
            {code("wait-zombie", "wait가 칸을 돌려줌")}
            {code("new-reaper", "고아를 넘겨받을 곳")}
            {code("child-reaper-dies", "init이 죽으면 전체 정리")}
          </div>
        </section>

        <section id="fixes" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. exec·tini·처리기는 서로 다른 구멍을 막습니다</h2>
          <div className={prose}>
            <p>
              shop-api에는 구멍이 셋입니다. SIGTERM이 python에 닿지 않고, 닿더라도 python에 처리기가 없으면 정리할 기회가 없으며, server.py는 자기 helper를
              wait하지 않습니다. 흔히 권하는 세 가지 고침을 이 세 축에 대어 보면 어느 하나도 셋을 모두 막지 못합니다.
            </p>
            <p>
              첫째는 start.sh의 마지막 줄을 exec python server.py로 바꾸는 것입니다. Dockerfile 참조 문서도 셸 형식 ENTRYPOINT는 /bin/sh -c 아래에서 돌아 신호를 받지
              못하므로 exec를 붙이라고 권합니다.
            </p>
            <p>
              exec 뒤에는 같은 PID 1에서 python이 돕니다. 그러나 이제 python이 UNKILLABLE인 PID 1이고, 5절에서 본 대로 Python은
              SIGTERM 처리기를 기본으로 두지 않습니다. 7절의 세 조건이 그대로 맞아 SIGTERM은 여전히 버려집니다.
            </p>
            <p>
              둘째는 docker run --init이나 tini입니다. tini README는 tini가 자식 하나를 띄워 기다리면서 좀비를 거두고 신호를 전달한다고 적습니다. 그런데 start.sh를 그대로 두면
              트리는 tini(PID 1) → sh start.sh(PID 2) → python입니다. tini.c 533행은 기본으로 직계 자식 하나에만 kill을 보내므로 SIGTERM은 sh가 받습니다. trap이 없는
              sh는 PID 1이 아니라서 기본 동작으로 죽고, tini는 143을 기록하고 끝납니다. python은 SIGTERM을 받지 못한 채 tini에 입양됐다가 tini가 끝날 때 namespace
              정리의 SIGKILL로 죽습니다. 종료는 빨라져 고친 것처럼 보이지만 python에게 정리할 기회는 여전히 없습니다.
            </p>
            <p>
              그래서 tini는 start.sh에 exec를 함께 쓰거나(tini → python), tini -g로 자식의 프로세스 그룹 전체에 신호를 보내게 해야 python에 SIGTERM이 닿습니다. 그러면
              python은 PID 2이므로 처리기가 없어도 기본 동작으로 끝나고 tini는 128 + 15 = 143을 돌려줍니다. 고아 좀비도 tini가 거둡니다.
            </p>
            <p>
              tini 자신도 PID 1인데 어떻게 SIGTERM을 받을까요? tini.c는 처리기를 등록하는 대신 거의 모든 신호를 막아 두고 sigtimedwait로 꺼내 읽습니다.
              kernel/signal.c의 sig_ignored는 111행에서 막힌 신호를 버리지 않고 돌아가므로 SIGTERM이 대기열에 남고 tini가 그것을 꺼내 python에게 kill로 다시 보냅니다.
            </p>
            <p>
              하지만 tini도 server.py가 직접 낳은 helper 좀비는 거두지 못합니다. 그 좀비들의 부모는 여전히 살아 있는 server.py이고, 4절의 칸은 server.py가 wait하거나
              끝나야 비워집니다. 기본 동작으로 끝나는 python 역시 진행 중인 요청을 마무리하지 않습니다.
            </p>
            <p>
              셋째는 앱을 고치는 것입니다. server.py가 signal.signal(SIGTERM, …)로 새 요청을 멈추고 진행 중인 요청을 마친 뒤 나가게 하고, helper는 wait하거나
              SIGCHLD를 SIG_IGN으로 둡니다. 실무에서는 tini로 PID 1 문제를 막고 앱 쪽 처리기와 wait로 나머지 둘을 막는 조합을 씁니다. 유예 10초 안에 정리가 끝나지
              않으면 -t나 --stop-timeout으로 유예를 늘립니다.
            </p>
          </div>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-3 font-semibold">고침</th>
                  <th className="py-2 pr-3 font-semibold">python에 SIGTERM 도달</th>
                  <th className="py-2 pr-3 font-semibold">요청 정리 기회</th>
                  <th className="py-2 pr-3 font-semibold">고아 좀비</th>
                  <th className="py-2 font-semibold">helper 좀비</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-3">exec만</td>
                  <td className="py-2 pr-3">python이 PID 1이라 버려짐</td>
                  <td className="py-2 pr-3">없음 (137)</td>
                  <td className="py-2 pr-3">python이 wait하지 않으면 남음</td>
                  <td className="py-2">남음</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-3">tini·--init (start.sh 그대로)</td>
                  <td className="py-2 pr-3">sh만 받고 python은 못 받음</td>
                  <td className="py-2 pr-3">없음, tini 종료 때 SIGKILL (143)</td>
                  <td className="py-2 pr-3">tini가 거둠</td>
                  <td className="py-2">남음</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-3">tini + exec (또는 tini -g)</td>
                  <td className="py-2 pr-3">전달됨</td>
                  <td className="py-2 pr-3">없음, 기본 동작 종료 (143)</td>
                  <td className="py-2 pr-3">tini가 거둠</td>
                  <td className="py-2">남음</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-3">exec + 앱 처리기·wait</td>
                  <td className="py-2 pr-3">전달됨</td>
                  <td className="py-2 pr-3">있음 (0)</td>
                  <td className="py-2 pr-3">앱이 직접 거둬야 함</td>
                  <td className="py-2">거둠</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">tini + exec + 앱 처리기·wait</td>
                  <td className="py-2 pr-3">전달됨</td>
                  <td className="py-2 pr-3">있음 (0)</td>
                  <td className="py-2 pr-3">tini가 거둠</td>
                  <td className="py-2">거둠</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={prose}>
            <p>
              셸 스크립트를 PID 1로 꼭 남겨야 한다면 처리기를 걸되 기다리는 방식도 바꿔야 합니다. bash 매뉴얼에 따르면 셸이 foreground 명령을 기다리는 동안에는 trap이
              명령이 끝날 때까지 실행되지 않습니다. python을 &amp;로 띄운 뒤 wait 내장 명령으로 기다리면 wait가 곧바로 돌아오고 trap이 실행됩니다.
            </p>
          </div>
          <pre className={pre}>{`#!/bin/sh
python manage.py migrate
python server.py &
child=$!
trap 'kill -TERM "$child"' TERM INT
wait "$child"        # 신호를 받으면 바로 돌아와 trap을 실행
wait "$child"        # 자식이 정리를 마칠 때까지 다시 기다림`}</pre>
          <div className="flex flex-wrap gap-2">
            {code("tini-mask", "tini: 막고 꺼내 전달")}
            {code("tini-reap", "tini: waitpid(-1) 반복")}
          </div>
          <div id="paper-tini" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="krallin/tini README (2026-10-15 확인)" citeKey={2} href="https://github.com/krallin/tini">
              tini는 자식 하나를 띄워 끝날 때까지 기다리면서 좀비를 거두고 신호를 전달합니다. Docker 1.13 이상에는 tini가 포함되어 --init으로 쓸 수 있고, PID 1로
              쓸 수 없으면 -s로 subreaper 등록을 합니다. -g는 신호를 자식의 프로세스 그룹 전체에 보냅니다.
            </CitationBlock>
          </div>
        </section>

        <section id="fd-limits" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. fd는 프로세스 한도와 시스템 한도 두 곳에 걸립니다</h2>
          <div className={prose}>
            <p>
              (가정) 같은 server.py가 이번에는 컨테이너 밖 VM의 서비스로 돌고, 손님 연결이 1,000개를 넘는 순간부터 로그에 accept: Too many open files가 찍힙니다. fd는
              프로세스의 열린 파일 표에서 칸 번호입니다. socket 하나, 로그 파일 하나, pipe 하나가 모두 칸 하나씩을 씁니다.
            </p>
            <p>
              getrlimit(2) 문서는 RLIMIT_NOFILE을 이 프로세스가 열 수 있는 최대 fd 번호보다 하나 큰 값이라고 정의하고 넘으면 EMFILE이라고 적습니다.
              soft 값은 커널이 실제로 검사하는 값이고, hard 값은 권한 없는 프로세스가 soft를 올릴 수 있는 상한입니다. fork한 자식은 이 한도를 물려받고 execve
              뒤에도 유지됩니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="1,001번째 연결에서 EMFILE이 나는 이유"
            question="soft limit 1,024인 프로세스는 몇 번째 손님 연결부터 accept에 실패합니까?"
            scope="server.py 프로세스 하나의 fd 표만 셉니다. 손님 연결 하나가 fd 하나를 쓴다고 가정하고, 백엔드 DB 연결과 일시적인 파일 열기는 넣지 않습니다."
            steps={[
              { label: "쓸 수 있는 번호", expression: "0 ~ (1,024 − 1)", result: "1,024칸", reason: "RLIMIT_NOFILE은 최대 번호보다 하나 큰 값입니다." },
              { label: "기본으로 쓴 칸", expression: "3 (0·1·2) + 21 (로그·라이브러리·epoll·listen)", result: "24칸", reason: "(가정) 서버가 손님을 받기 전에 이미 연 칸입니다." },
              { label: "연결에 남은 칸", expression: "1,024 − 24", result: "1,000칸 (24~1,023번)", reason: "alloc_fd는 비어 있는 가장 낮은 번호부터 줍니다." },
              { label: "1,001번째 연결", expression: "다음 번호 1,024 ≥ soft 1,024", result: "EMFILE", reason: "file.c 506~508행이 fd ≥ end이면 -EMFILE을 돌려줍니다." },
            ]}
            conclusion="EMFILE은 서버 전체가 아니라 이 프로세스의 표가 찼다는 뜻입니다. soft limit을 올리거나 새는 fd를 찾아 닫아야 합니다."
            caveats={["연결마다 백엔드 연결을 하나씩 더 연다면 501번째 손님에서 이미 막힙니다.", "fd가 새는 버그라면 한도를 올려도 시간만 늦출 뿐입니다."]}
          />
          <FdTableViz />
          <div className={prose}>
            <p>
              fs/file.c의 alloc_fd(485~541행)는 next_fd부터 비트맵을 훑어 빈 번호를 찾고, 506~508행에서 그 번호가 end 이상이면 EMFILE을 돌려줍니다. 548~551행의
              get_unused_fd_flags가 end에 rlimit(RLIMIT_NOFILE)을 넣습니다. 1,001번째 연결의 번호 1,024가 바로 이 검사에서 걸립니다.
            </p>
            <p>
              시스템 전체 한도는 다른 파일에 있습니다. fs/file_table.c의 alloc_empty_file(191~230행)은 열린 파일 객체 수가 file-max에 닿으면 VFS: file-max limit N
              reached를 찍고 ENFILE을 돌려줍니다.
            </p>
            <p>
              커널 기본 file-max는 부팅 때 메모리의 약 10%를 파일 하나당 1KiB로 나눈 값이라 64GiB 서버라면 수백만 단위입니다. systemd를 PID 1로 쓰는
              host는 부팅 때 file-max를 LONG_MAX(9223372036854775807)로, nr_open을 커널이 받아 주는 최댓값으로 올려 둡니다. 어느 쪽이든
              현장에서 보는 Too many open files는 대부분 EMFILE 쪽입니다.
            </p>
            <p>
              soft 1,024는 어디서 올까요? uapi fs.h의 INR_OPEN_CUR 1024가 커널의 초기값이고, systemd는 서비스에 DefaultLimitNOFILE=1024:524288을 줍니다. systemd
              문서는 select()가 1,023보다 큰 fd를 다루지 못하므로 soft를 함부로 올리지 말고, select를 쓰지 않는 앱이 스스로 soft를 hard까지 올리라고 권합니다.
            </p>
            <p>
              rlimit은 fork로 물려받으므로 로그인 셸에서 친 ulimit -n은 systemd가 띄운 서비스에 닿지 않습니다. 서비스 쪽 설정은{" "}
              <Link to="/cs/cloud/linux-systemd-boot-change-incidents#overview">systemd 글</Link>에서 이어집니다.
            </p>
            <p>proc_sys_fs(5)에 따르면 RLIMIT_NOFILE을 올릴 수 있는 천장은 /proc/sys/fs/nr_open이고 기본값은 1,048,576입니다. 세 한도를 한 번에 보면 이렇습니다.</p>
          </div>
          <pre className={pre}>{`$ grep 'open files' /proc/<pid>/limits     # 프로세스: soft · hard
Max open files            1024                 524288               files
$ ls /proc/<pid>/fd | wc -l                  # 지금 쓰는 칸 수
1024
$ cat /proc/sys/fs/file-nr                   # 시스템: 할당 · 여유 · file-max
13856	0	6710886
$ cat /proc/sys/fs/nr_open                   # RLIMIT_NOFILE 천장
1048576
# systemd가 없는 64GiB 커널 기본값의 예시 출력입니다. systemd host라면
# file-max는 9223372036854775807, nr_open은 1073741816처럼 보입니다.`}</pre>
          <div className="flex flex-wrap gap-2">
            {code("alloc-fd", "alloc_fd의 EMFILE 검사")}
            {code("file-max", "file-max와 ENFILE")}
            {code("file-max-default", "file-max 기본값")}
            {code("nofile-defaults", "INR_OPEN_CUR 1024")}
          </div>
        </section>

        <section id="evidence" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 면접 답은 세 출력으로 증명합니다</h2>
          <div className={prose}>
            <p>
              3절의 결론을 추측이 아니라 출력으로 확인하는 순서입니다. 먼저 PID 1이 SIGTERM 처리기를 가졌는지 봅니다. proc_pid_status(5)에 따르면 SigBlk·SigIgn·SigCgt는
              각각 막은 신호, 무시하는 신호, 처리기를 둔 신호의 16진 마스크입니다. 신호 N은 N − 1번째 비트이므로 SIGTERM 15는 0x4000 자리입니다.
            </p>
          </div>
          <pre className={pre}>{`$ docker exec shop-api grep -E 'SigIgn|SigCgt' /proc/1/status
SigIgn: 0000000000000000
SigCgt: 0000000000010002      # 0x4000 비트가 없음 → SIGTERM 처리기 없음 (예시 출력)
$ docker top shop-api -o pid,ppid,stat,comm   # PID 1이 sh인지, 좀비(Z)가 있는지`}</pre>
          <div className={prose}>
            <p>
              다음은 신호가 실제로 어디에 도착하는지 봅니다. strace(1) 문서에 따르면 -f는 fork·clone으로 생긴 자식까지 따라가고, -e trace=%signal은 신호 관련
              시스템 콜만 고릅니다. 퍼센트 기호 없는 trace=signal 표기는 폐기 예정입니다. host에서 python의 host PID에 붙이면 SIGTERM이 오는지, 처리기가 도는지를 한
              화면에서 확인할 수 있습니다.
            </p>
          </div>
          <pre className={pre}>{`$ sudo strace -f -e trace=%signal -p <python의 host PID>
--- SIGTERM {si_signo=SIGTERM, si_code=SI_USER, si_pid=1, ...} ---
+++ killed by SIGTERM +++
# tini + exec 뒤의 모습입니다. si_pid=1은 같은 namespace의 tini가 보냈다는 표시입니다.
# server.py에 처리기를 달았다면 killed 줄 대신 rt_sigreturn 줄이 보입니다. (예시 출력)`}</pre>
          <div className={prose}>
            <p>
              si_pid는 보낸 쪽 PID를 받는 쪽 namespace에서 본 번호입니다. tini는 같은 namespace의 PID 1이라 1이 찍힙니다. host에서 kill로 직접 보낸 신호라면 8절의
              send_signal_locked 1243행이 보낸 쪽 PID를 0으로 지우므로 si_pid=0이 보입니다. tini를 붙이기 전에는 python에 이 줄 자체가 나오지 않습니다. 면접에서는 이 세 출력(처리기 마스크, 프로세스 트리, 신호 추적)을 근거로 원인과 고침을 말하면 됩니다.
            </p>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 처리기를 달아도 유예 시간과 정리 순서는 남습니다</h2>
          <div className={prose}>
            <p>
              SIGTERM을 받게 만드는 것은 시작일 뿐입니다. 처리기가 진행 중인 요청을 마치는 데 10초보다 오래 걸리면 결국 SIGKILL이 오고 137이 남습니다. 요청 하나의 최대
              처리 시간과 연결 닫기 시간을 재서 유예를 정하고, 그보다 짧게 끝내도록 앞단의 부하 분산에서 먼저 손님을 빼야 합니다.
            </p>
            <p>
              SIGKILL은 프로그램 안의 어떤 정리 코드도 실행하지 않습니다. 버퍼에 남은 로그, 임시 파일, 잠금 파일이 그대로 남을 수 있습니다. 137을 정상 종료처럼 다루는
              배포 스크립트는 이런 흔적을 놓칩니다.
            </p>
            <p>
              이 글은 Docker의 docker stop을 기준으로 했습니다. systemd 서비스의 정지 순서, 정지 시간 초과와 KillMode는{" "}
              <Link to="/cs/cloud/linux-systemd-boot-change-incidents#overview">systemd 글</Link>에서, 컨테이너가 namespace와 cgroup으로 무엇을 가리는지는{" "}
              <Link to="/cs/ai/agent-sandbox-security#namespace">에이전트 샌드박스 보안</Link>에서 이어집니다.
            </p>
          </div>
          <ContentBoundary article="linux-process-signals-pid1-fds" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">14. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>start.sh에 trap 'exit 0' TERM만 추가하고 python server.py를 foreground로 그대로 두면 docker stop은 몇 초 뒤 어떤 종료 코드로 끝날까요? (답: 7절, 10절)</p>
            <p>tini를 붙인 뒤에도 ps에 convert &lt;defunct&gt; 줄이 계속 늘어난다면 누구의 코드를 고쳐야 하고, 그 줄들의 PPID는 무엇일까요? (답: 4절, 9절, 10절)</p>
            <p>soft limit을 65,536으로 올린 뒤에도 같은 로그가 나오고 dmesg에 VFS: file-max limit가 찍혔다면 무엇이 다르고 어디를 봐야 할까요? systemd host라면 이 줄이 찍히기 쉬운지도 생각해 보세요. (답: 11절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxProcTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          tini: { id: "tini", label: "tini 369448a 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          runc: { id: "runc", label: "runc v1.2.0 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
