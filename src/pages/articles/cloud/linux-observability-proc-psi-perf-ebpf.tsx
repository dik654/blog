import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import UseGridViz from "./linux-observability-proc-psi-perf-ebpf/viz/UseGridViz";
import PsiAverageViz from "./linux-observability-proc-psi-perf-ebpf/viz/PsiAverageViz";
import { codeRefs } from "./linux-observability-proc-psi-perf-ebpf/codeRefs";
import { linuxObservabilityTrees } from "./linux-observability-proc-psi-perf-ebpf/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxObservabilityProcPsiPerfEbpfArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. CPU 40%인 서버에서 왜 p99가 열 배로 튀었나요?</h2>
          <div className={prose}>
            <p>
              (가정) 4 vCPU 서버 한 대의 CPU 사용률 그래프는 40%에서 평평합니다. 그런데 이 서버에 올라간 API의 p99 지연이 180 ms에서 2초 가까이로 튀었고, 로그에는 아무 오류도
              없습니다. 메모리도 디스크도 그래프상으로는 한가합니다. 이 글은 이 한 장면을 커널이 세는 숫자부터 거꾸로 따라갑니다.
            </p>
            <p>
              답을 먼저 적겠습니다. 사용률은 "바쁜 시간의 평균"이고 지연은 "기다린 순간"에서 나옵니다. 리눅스는 기다린 시간을 사용률과 별도로 셉니다. /proc/pressure/cpu의
              some 줄이 그 숫자이고 이 서버에서는 25%입니다. 곧 최근 10초 가운데 네 번에 한 번꼴로 어떤 작업이 CPU를 받지 못해 서 있었다는 뜻입니다. 사용률 40%와 대기
              25%는 모순이 아닙니다. 1초 폭주와 3초 한가함이 번갈아 왔을 때 두 숫자가 정확히 이렇게 나옵니다.
            </p>
            <p>
              이 숫자들을 읽는 방법에는 순서가 있습니다. 자원마다 사용률·포화·오류 세 칸을 빠짐없이 보는 USE 격자로 병목이 어느 자원인지 좁히고, 그 자원 안에서 perf로 "어느 코드가"를,
              bpftrace로 "어떤 이벤트가"를 찾습니다. 그리고 Prometheus 대시보드에서 보는 노드 지표도 결국 같은 /proc 파일을 node_exporter가 읽어 보낸 것이라 그래프와
              명령은 하나의 숫자를 두 창으로 보는 셈입니다.
            </p>
            <p>
              리눅스 서버 시리즈의 <a href="/cs/cloud/linux-server-interview-incident-map#picture">첫 60초 점검</a>이 "어떤 명령을 치는가"였다면 이 글은 그 명령들이 어디서 숫자를
              가져오고 그 숫자가 무엇을 세는지를 다룹니다. 메모리 쪽 PSI와 available은 <a href="/cs/cloud/linux-memory-page-cache-oom#overview">메모리 글</a>에서 이미 다뤘으므로
              여기서는 CPU를 중심 사례로 삼고 네 자원의 격자를 완성합니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 커널은 누적 카운터를 파일로 내놓고, 도구는 그 파일을 두 번 읽어 뺍니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 리눅스 관측은 네 층입니다. 맨 아래에서 커널이 자원마다 누적 카운터를 유지합니다. CPU가 사용자 모드에서 보낸 tick 수, 디스크가 처리한 요청 수, 작업이 CPU를 기다린 나노초 같은 것입니다. 커널은 이 카운터를 /proc와 /sys 아래 텍스트 파일로 내놓습니다. 파일처럼 보이지만 디스크에 없는 가상 파일이라 읽을 때마다 커널이 그 순간의 값을 적어 줍니다.
            </p>
            <p>
              둘째 층이 top·vmstat·mpstat·iostat 같은 명령입니다. 이 명령들이 하는 일은 거의 하나입니다. 파일을 읽은 뒤 간격만큼 기다렸다가 다시 읽어 빼고 그 차이를 간격으로 나눕니다. "CPU 40%"는 그렇게 나온 비율이고 "iostat %util"도 같은 뺄셈입니다. 셋째 층이 node_exporter 같은 수집기인데 이것도 같은 파일을 읽되 뺄셈을 하지 않고 카운터 그대로 Prometheus에 넘깁니다.
            </p>
            <p>
              뺄셈은 PromQL의 rate()가 합니다. 넷째 층이 대시보드입니다. 이 네 층과 결이 다른 도구가 둘 있습니다. perf는 카운터를 읽는 대신 일정 빈도로 "지금 CPU에서 무엇이 실행 중인가"를 표본화합니다. bpftrace는 커널 안의 특정 지점(시스템 콜 진입, 블록 I/O 발행)에 작은 프로그램을 붙여 이벤트가 날 때마다 셉니다. 카운터가 "얼마나"를 말한다면 표본과 이벤트는 "무엇이"를 말합니다.
            </p>
            <p>
              이 글이 다루는 것은 카운터 층의 CPU·메모리·디스크·네트워크 파일, 그 위의 USE 격자, 그리고 perf·bpftrace로 내려가는 한 번의 진단입니다. 각 자원의 커널 내부 동작은 각 글이 맡습니다. CPU 스케줄러는 <a href="/cs/cloud/linux-kernel-process-syscall-scheduler#overview">커널과 프로세스</a>, 디스크 경로는{" "} <a href="/cs/cloud/linux-vfs-mount-page-cache-fsync#overview">파일이 디스크에 닿기까지</a>, 패킷 경로는{" "} <a href="/cs/cloud/linux-network-interface-route-netfilter-dns#overview">패킷이 프로세스에 닿기까지</a>입니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. /proc/stat을 10초 간격으로 두 번 읽으면 사용률 40%가 나옵니다</h2>
          <div className={prose}>
            <p>
              (가정) 4 vCPU 서버에서 /proc/stat의 첫 줄을 읽었더니 cpu 뒤에 열 개의 숫자가 있습니다. 순서는 user, nice, system, idle, iowait, irq, softirq, steal, guest, guest_nice이고
              단위는 USER_HZ, 보통 1/100초인 tick입니다. 부팅 뒤 누적값이라 한 번 읽어서는 아무것도 알 수 없어 10초 뒤 다시 읽어 뺍니다.
            </p>
            <p>
              10초 동안 4개 CPU가 쓸 수 있는 tick은 4 × 10 × 100 = 4,000입니다. 두 번 읽은 차이가 user 1,280, system 320, idle 2,400이었다면 바쁜 tick은 1,600이고 사용률은
              1,600 ÷ 4,000 = 40%입니다. mpstat -P ALL 1이 보여 주는 %usr·%sys와 top의 CPU 줄이 이 뺄셈의 결과입니다.
            </p>
            <p>
              같은 파일 아래쪽의 procs_running은 "지금 실행 중이거나 실행을 기다리는 스레드 수"입니다. 이 값은 누적이 아니라 순간값이라 뺄셈 없이 그대로 읽습니다. vmstat의 r 열이 이
              줄입니다. 사용률 40%를 계산한 10초 동안 이 값이 1·2 사이를 오가다가 1초쯤 12를 찍었다면, 평균은 평평했지만 그 1초 동안 4개 CPU에 12개 스레드가 몰린 것입니다.
            </p>
          </div>
          <figure className="not-prose my-6">
            <svg viewBox="0 0 480 130" className="h-auto w-full" role="img" aria-label="4 CPU × 10초 = 40칸, 각 칸 100 tick, 바쁜 칸 16개">
              <text x="0" y="12" fontSize="10" fontWeight="700" className="fill-foreground">4 CPU × 10 s × 100 tick/s = 40칸 × 100 tick = 4,000 tick</text>
              <rect x="2" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="46" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="90" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="134" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="178" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="222" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="266" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="310" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="354" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="398" y="22" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="2" y="42" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="46" y="42" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="90" y="42" width="40" height="16" rx="2" fill="#2563eb" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="134" y="42" width="40" height="16" rx="2" fill="#f59e0b" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="178" y="42" width="40" height="16" rx="2" fill="#f59e0b" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="222" y="42" width="40" height="16" rx="2" fill="#f59e0b" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="266" y="42" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="310" y="42" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="354" y="42" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="398" y="42" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="2" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="46" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="90" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="134" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="178" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="222" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="266" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="310" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="354" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="398" y="62" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="2" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="46" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="90" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="134" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="178" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="222" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="266" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="310" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="354" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="398" y="82" width="40" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <text x="444" y="34" fontSize="8" className="fill-muted-foreground">CPU0</text>
              <text x="444" y="54" fontSize="8" className="fill-muted-foreground">CPU1</text>
              <text x="444" y="74" fontSize="8" className="fill-muted-foreground">CPU2</text>
              <text x="444" y="94" fontSize="8" className="fill-muted-foreground">CPU3</text>
              <rect x="0" y="110" width="10" height="10" fill="#2563eb" />
              <text x="14" y="119" fontSize="9" className="fill-foreground">user 1,280 tick ≈ 13칸</text>
              <rect x="150" y="110" width="10" height="10" fill="#f59e0b" />
              <text x="164" y="119" fontSize="9" className="fill-foreground">system 320 ≈ 3칸</text>
              <rect x="280" y="110" width="10" height="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
              <text x="294" y="119" fontSize="9" className="fill-foreground">idle 2,400 = 24칸 → 바쁜 16 ÷ 40 = 40%</text>
            </svg>
            <figcaption className="mt-2 text-xs text-muted-foreground">가로 한 칸이 1초, 세로 한 줄이 CPU 하나입니다. 칸 하나가 100 tick이라 바쁜 1,600 tick은 16칸이고, user 12.8칸은 그림에서 13칸으로 올렸습니다. 어느 칸이 바빴는지는 사용률이 말하지 않습니다.</figcaption>
          </figure>
          <CalculationWalkthrough
            title="사용률 40%가 나오는 과정"
            question="/proc/stat을 10초 간격으로 두 번 읽은 4 vCPU 서버의 CPU 사용률은 얼마일까요?"
            scope="USER_HZ 100, vCPU 4개로 계산합니다. 두 번 읽은 cpu 줄의 차이는 (가정) user 1,280 · nice 0 · system 320 · idle 2,400 · iowait 0 · irq 0 · softirq 0 · steal 0입니다."
            steps={[
              { label: "쓸 수 있는 tick", expression: "4 CPU × 10 s × 100 tick/s", result: "4,000 tick", reason: "모든 열의 차이를 더한 값과 같아야 합니다. 1,280 + 320 + 2,400 = 4,000으로 맞습니다." },
              { label: "바쁜 tick", expression: "4,000 − idle 2,400 − iowait 0", result: "1,600 tick", reason: "idle과 iowait를 뺀 나머지가 바쁜 시간입니다. 커널 문서가 iowait를 믿을 수 없다고 적으므로 iowait는 '한가함' 쪽으로 셉니다." },
              { label: "사용률", expression: "1,600 ÷ 4,000", result: "40%", reason: "mpstat·top·Grafana의 'CPU 사용률'이 모두 이 비율입니다." },
              { label: "사용자·커널 분리", expression: "1,280 ÷ 4,000 · 320 ÷ 4,000", result: "32% · 8%", reason: "%usr 32, %sys 8입니다. %sys가 %usr보다 크면 시스템 콜·인터럽트 쪽을 먼저 의심합니다." },
              { label: "순간 run queue", expression: "procs_running 최대", result: "12 > 4 CPU", reason: "누적이 아니라 순간값입니다. 1초 동안 12였다면 8개 스레드가 그 순간 기다렸습니다." },
            ]}
            conclusion="같은 10초를 사용률로 보면 40%가 남고, run queue로 보면 한때 vCPU 수의 세 배가 몰렸습니다. 사용률은 이 폭주를 평균 안에 숨깁니다."
            caveats={["iowait는 'I/O를 기다리는 task가 있는 동안 CPU가 쉰 시간'이라 다중 코어에서 정확하지 않고 값이 줄어들 수도 있다고 커널 문서가 적습니다.", "steal이 0이 아니면 하이퍼바이저가 CPU를 가져간 시간이라 사용률 계산과 별도로 봐야 합니다."]}
          />
          {code("proc-stat-doc", "/proc/stat 열 정의")}
          {code("proc-stat-source", "cpu 줄을 찍는 show_stat")}
        </section>

        <section id="pressure-case" data-teach-level="1" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 같은 10초를 PSI cpu 파일로 보면 25%가 기다렸습니다</h2>
          <div className={prose}>
            <p>
              이 서버의 폭주가 규칙적이라고 합시다. (가정) 12스레드짜리 배치 작업이 4초마다 1초씩 돌고, 나머지 3초는 웹 앱이 CPU의 20%를 씁니다. 폭주하는 1초 동안 4개 CPU는 모두
              100% 바쁘고 8개 스레드가 run queue에서 기다립니다. 사용률 평균은 0.25 × 100% + 0.75 × 20% = 40%로 3절과 같습니다.
            </p>
            <p>
              커널은 이 1초를 "CPU 때문에 멈춘 시간"으로 따로 셉니다. 멈춘 시간의 비율은 작업 수를 그대로 세지 않고 실행 가능한 스레드 수(min(쉬지 않는 작업 수, CPU 수) = 4)로 나눕니다. 기다리는 작업이 8개면 8 ÷ 4 = 2이지만 상한이 1이라 그 1초 동안은 100%가 멈춘 것으로 봅니다. 나머지 3초는 아무도 기다리지 않아 0%입니다.
            </p>
            <p>
              4초 주기의 평균은 25%이고 이것이 /proc/pressure/cpu의 some avg10으로 보이는 25%입니다.
            </p>
            <p>
              같은 파일의 total 열은 멈춘 시간의 누적 마이크로초입니다. 두 번 읽어 빼면 10초 동안 2,500,000 µs가 늘었고, 10,000,000 µs로 나누면 역시 25%입니다. 평균 줄은 커널이 2초마다
              갱신하는 지수 이동 평균이라 폭주가 막 시작된 순간에는 25%보다 낮게, 막 끝난 순간에는 높게 보입니다(7절). total로 직접 빼면 그 지연이 없습니다.
            </p>
            <p>
              이 숫자가 왜 지연을 설명하는지는 웹 앱 쪽에서 보면 분명합니다. 폭주하는 1초 동안 들어온 요청은 CPU를 받기 위해 줄을 서며, 그 줄이 p99를 2초 가까이로 밀어 올립니다. 1초의
              대기가 4초마다 반복되므로 요청의 약 4분의 1이 느립니다. 사용률 40%는 이 사실을 보여 주지 못하고, PSI 25%와 run queue 12는 보여 줍니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="PSI cpu some 25%가 나오는 과정"
            question="1초 폭주 + 3초 한가함이 반복되는 4 vCPU 서버에서 /proc/pressure/cpu의 some은 얼마일까요?"
            scope="kernel/sched/psi.c 머리 주석의 식 threads = min(nr_nonidle_tasks, nr_cpus), SOME = min(nr_delayed_tasks ÷ threads, 1)을 그대로 씁니다. 폭주 중 실행 가능 스레드 12개, CPU 4개입니다."
            steps={[
              { label: "threads", expression: "min(12, 4)", result: "4", reason: "실행 잠재력은 CPU 수를 넘지 못합니다. 분모가 CPU 수인 이유입니다." },
              { label: "폭주 중 SOME", expression: "min(8 ÷ 4, 1)", result: "100%", reason: "12개 중 4개가 실행되고 8개가 기다립니다. 비율 2는 상한 1로 잘립니다." },
              { label: "한가할 때 SOME", expression: "min(0 ÷ 4, 1)", result: "0%", reason: "웹 앱 스레드 몇 개가 20%를 쓰지만 기다리는 작업이 없습니다." },
              { label: "4초 주기 평균", expression: "(1 × 100% + 3 × 0%) ÷ 4", result: "25%", reason: "avg10이 정상 상태에서 수렴하는 값입니다." },
              { label: "total로 확인", expression: "2,500,000 µs ÷ 10,000,000 µs", result: "25%", reason: "10초 동안 늘어난 total 누적값을 간격으로 나눈 값입니다. EMA의 지연이 없습니다." },
            ]}
            conclusion="사용률 40%와 PSI 25%는 같은 10초의 두 측면입니다. 전자는 CPU가 바빴던 시간, 후자는 작업이 CPU를 못 받아 서 있던 시간입니다."
            caveats={["시스템 전체의 cpu full은 커널이 정의하지 않아 항상 0으로 찍힙니다(cgroup 단위에서는 나옵니다).", "폭주 중 '8개가 모두 기다린다'는 단순화입니다. 실제 스케줄러는 스레드를 밀리초 단위로 번갈아 실행하므로 기다리는 수가 순간마다 바뀌지만 비율의 상한 1은 그대로입니다."]}
          />
          {code("psi-formula", "SOME·FULL 정의 주석")}
          {code("psi-show", "/proc/pressure 출력 코드")}
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 세 질문의 이름은 사용률, 포화, 오류이고 네 자원마다 proc 파일이 다릅니다</h2>
          <div className={prose}>
            <p>
              앞 두 절의 두 숫자에 표준 이름을 붙입니다. 자원이 일을 하느라 바빴던 시간의 비율이 사용률(utilization)입니다. 자원이 처리하지 못해 쌓아 둔 일의 양, 곧 대기열의
              길이나 기다린 시간이 포화(saturation)입니다. 오류(errors)는 그 자원에서 난 오류 이벤트의 수입니다. 이 세 질문을 모든 자원에 빠짐없이 던지는 점검법을 Brendan Gregg가
              USE Method라고 이름 붙였습니다.
            </p>
            <p>
              같은 세 질문이 자원마다 다른 파일에 있습니다. CPU는 /proc/stat(사용률)과 /proc/pressure/cpu와 procs_running(포화)입니다. 메모리는 /proc/meminfo의 MemAvailable(사용률의 반대인 남은 양)과 /proc/pressure/memory와 /proc/vmstat의 swap 열(포화), dmesg의 OOM 줄(오류)입니다.
            </p>
            <p>
              디스크는 /proc/diskstats 한 파일에서 iostat가 %util, aqu-sz, await를 모두 계산하고, 네트워크는 /proc/net/dev에서 bytes(사용률), drop(포화), errs(오류)를 읽습니다.
            </p>
            <p>
              프로세스 하나로 내려가면 /proc/&lt;pid&gt;/ 아래에 같은 구조가 반복됩니다. status 파일의 VmRSS가 메모리 사용량, nonvoluntary_ctxt_switches가 CPU를 빼앗긴 횟수,
              schedstat의 둘째 숫자가 run queue에서 기다린 누적 나노초입니다. PSI가 서버 전체의 포화라면 schedstat는 그 프로세스 하나의 포화입니다.
            </p>
            <p>
              이 파일들은 크게 두 종류입니다. 부팅 뒤 계속 늘어나는 누적값(counter)은 두 번 읽어 빼야 하지만 그 순간의 값(gauge)은 그대로 읽습니다. /proc/stat의 cpu 줄과 PSI의
              total은 counter, procs_running·MemAvailable·PSI의 avg 줄은 gauge입니다. Prometheus가 지표 타입을 counter와 gauge로 나누는 이유가 이 구분과 같습니다.
            </p>
            <p>
              USE는 자원 쪽 질문이고, 사용자 쪽 질문인 지연·트래픽·오류·포화(golden signals)와 짝을 이룹니다. 어느 쪽을 경보에 걸고 어느 쪽을 대시보드에 둘지는{" "}
              <a href="/cs/cloud/linux-sre-metrics-slo-safe-change#overview">SRE로 서버 보기</a>에서 다룹니다.
            </p>
          </div>
          {code("proc-pid-status", "/proc/<pid>/status 예시")}
          {code("pid-schedstat", "/proc/<pid>/schedstat 세 숫자")}
          <div id="paper-gregg-use" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Brendan Gregg · The USE Method (brendangregg.com/usemethod.html, 2026-10-17 확인)" citeKey={1} href="https://www.brendangregg.com/usemethod.html">
              <q>For every resource, check utilization, saturation, and errors.</q> 같은 글은 사용률을 "자원이 일을 처리하느라 바빴던 시간의 평균", 포화를 "자원이 처리하지 못해 대개 줄을 선 추가 작업의 정도", 오류를 "오류 이벤트의 수"로 정의하고, 사용률 100%가 보통 병목의 신호이지만 70%만 넘어도 문제가 시작될 수 있다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="use-grid" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 격자 열두 칸을 다 채우면 빨간 칸은 CPU 포화 하나뿐입니다</h2>
          <div className={prose}>
            <p>
              1절의 서버에 격자를 적용합니다. 네 자원 × 세 질문이라 열두 칸입니다. 칸마다 그 숫자를 보여 주는 명령과 그 명령이 읽는 파일을 적고, 서버의 값을 넣어 임계를 넘는 칸을 칠합니다.
              이 격자의 값어치는 건너뛰지 않는 데 있습니다. "CPU 40%니까 CPU는 아니다"라고 사용률 한 칸만 보고 다음 자원으로 넘어가면 포화 칸을 놓칩니다.
            </p>
            <p>
              Gregg의 리눅스 체크리스트는 CPU 포화 칸에 vmstat의 r이 CPU 수보다 큰지, 그리고 /proc/&lt;pid&gt;/schedstat의 run_delay를 적습니다. 체크리스트가 쓰인 2012년에는
              PSI가 없었고(커널 4.20에서 추가) 지금은 /proc/pressure/cpu가 같은 칸의 가장 직접적인 숫자입니다. 메모리 포화 칸의 si·so와 디스크 포화 칸의 aqu-sz·await는 체크리스트
              그대로입니다.
            </p>
            <p>
              아래 Viz에서 자원별로 칸을 채워 가면 메모리·디스크·네트워크의 아홉 칸은 모두 조용하고 CPU 포화 칸만 빨갛게 남습니다. 네트워크 포화 칸의 TCP 재전송 초당 3건은
              경계에 있는데, CPU 폭주 때 응답이 늦어 상대가 재전송한 결과일 수 있어 원인이 아니라 증상 쪽으로 분류합니다. 이렇게 "다른 자원이 아님"을 지우는 것이 격자의 두 번째 역할입니다.
            </p>
          </div>
          <UseGridViz />
          <div id="paper-gregg-use-linux" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Brendan Gregg · USE Method: Linux Performance Checklist (2026-10-17 확인)" citeKey={2} href="https://www.brendangregg.com/USEmethod/use-linux.html">
              CPU 포화 칸에 <q>vmstat 1, "r" &gt; CPU count</q>와 /proc/PID/schedstat의 둘째 필드(sched_info.run_delay)를, 메모리 포화에 vmstat의 si/so와 sar -B의 pgscan을, 디스크 포화에 iostat의 avgqu-sz &gt; 1 또는 높은 await를, 네트워크 포화에 /proc/net/dev의 drop을 적습니다. 각주는 load average를 CPU 지표에서 뺀 이유로 리눅스 load가 uninterruptible 상태(보통 I/O)를 포함한다는 점을 듭니다.
            </CitationBlock>
          </div>
        </section>

        <section id="psi-mechanism" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. avg10은 2초마다 넣는 표본을 10초 시정수로 섞은 지수 이동 평균입니다</h2>
          <div className={prose}>
            <p>
              4절의 25%가 /proc/pressure/cpu에 어떻게 찍히는지 한 단계 더 내려갑니다. 커널은 CPU마다 "지금 기다리는 작업이 있는가"의 상태 변화를 나노초로 기록해 두었다가 2초마다 한 번씩 지난 주기 동안 멈춘 시간을 모읍니다. 2초 가운데 1초가 멈춘 상태였다면 표본은 50%입니다. 이 표본을 세 평균에 각각 다른 감쇠 계수로 섞습니다.
            </p>
            <p>
              감쇠 계수는 load average와 같은 고정소수점 식입니다. avg10의 계수는 1/exp(2초 ÷ 10초)를 2048 기준으로 적은 1677이고, 새 표본의 가중치는 나머지 371 ÷ 2048 ≈ 18%입니다. 그래서 avg10은 "최근 10초의 산술 평균"이 아니라 10초 시정수의 지수 평균입니다. 표본 50%와 0%가 번갈아 들어오면 avg10은 22~27%를 오가며 25%에 수렴하고 그러기까지 30초쯤 걸립니다.
            </p>
            <p>
              avg60은 같은 표본으로 1분이 지나도 16%에 머뭅니다. 세 창의 차이가 정보입니다. avg10이 avg60·avg300보다 훨씬 높으면 압력이 방금 시작된 것이고, 셋이 비슷하면 5분 넘게 이어진 것입니다. 장애 직후 처음 몇 초에 avg10만 보고 "낮다"고 판단하면 틀리는 이유가 이 지연입니다. 지연 없이 보려면 total을 두 번 읽어 빼거나, 아래 trigger를 씁니다.
            </p>
            <p>
              trigger는 /proc/pressure/cpu에 "some 150000 1000000"처럼 임계와 창을 µs로 써 넣고 그 파일 디스크립터를 poll()하는 방식입니다. 1초 창에 150 ms 이상 멈추면 깨워 줍니다. 창은 500 ms부터 10초까지이고 알림은 창마다 한 번으로 제한됩니다. systemd-oomd가 메모리 압력을 이 방식으로 감시합니다.
            </p>
          </div>
          <ExplainedFormula
            question="2초마다 들어오는 표본이 avg10에 어떻게 섞입니까?"
            idea="옛 평균을 1677/2048만큼 남기고 새 표본을 371/2048만큼 더합니다. load average의 calc_load와 같은 식입니다."
            formula={"\\text{avg}_{10} \\leftarrow \\frac{\\text{avg}_{10}\\cdot 1677 + \\text{pct}\\cdot(2048-1677)}{2048},\\quad \\text{pct}=\\frac{\\text{stall}\\cdot 100}{\\text{period}}"}
            annotatedFormula={"\\text{avg}_{10} \\leftarrow \\underbrace{\\frac{\\text{avg}_{10}\\cdot 1677}{2048}}_{\\text{옛 평균의 81.9\\%}} + \\underbrace{\\frac{\\text{pct}\\cdot 371}{2048}}_{\\text{새 표본의 18.1\\%}},\\quad \\text{pct}=\\underbrace{\\frac{\\text{stall}}{\\text{period}}}_{\\text{2초 중 멈춘 비율}}\\cdot 100"}
            operations={[
              { expression: "\\text{pct} = \\text{stall}\\cdot 100 / \\text{period}", annotation: ["첫 주기: 1,000,000 µs ÷ 2,000,000 µs × 100 = 50%.", "둘째 주기: 0 ÷ 2,000,000 × 100 = 0%."] },
              { expression: "\\text{avg}_{10} \\leftarrow (0\\cdot 1677 + 50\\cdot 371)/2048", annotation: ["첫 표본 뒤 avg10 = 9.06%입니다."] },
              { expression: "\\text{avg}_{10} \\leftarrow (9.06\\cdot 1677 + 0\\cdot 371)/2048", annotation: ["둘째 표본 뒤 7.42%. 다섯 표본 뒤 19.2%, 열다섯 표본(30초) 뒤 21~27% 사이에서 진동합니다."] },
            ]}
            terms={[
              { symbol: "1677", name: "EXP_10s", description: "1/exp(2s/10s) = 0.8187을 2048배 해 정수로 적은 값입니다. avg60은 1981, avg300은 2034입니다." },
              { symbol: "2048", name: "FIXED_1", description: "고정소수점 1.0입니다. 커널은 부동소수점을 쓰지 않습니다." },
              { symbol: "\\text{stall}", name: "주기 안 멈춘 시간", description: "CPU별 상태 기록을 모아 '어떤 task가 기다린' 나노초를 합한 값입니다. 주기보다 크면 주기로 자르고 초과분은 다음 주기로 넘깁니다." },
              { symbol: "\\text{period}", name: "실제 경과 시간", description: "명목상 2초(PSI_FREQ)이지만 tick이 늦어지면 실제 경과로 계산합니다." },
            ]}
            assumptions={["4초 주기 폭주라 2초 표본이 50·0·50·0으로 번갈아 든다고 봤습니다. 폭주 위상이 주기 경계와 어긋나면 25·25로 들어와 진동 없이 25%에 더 빨리 닿습니다.", "활동이 전혀 없어 갱신을 건너뛴 주기는 0을 넣어 평균을 식힙니다(calc_load_n)."]}
            interpretation="avg10이 25% 근처에 닿기까지 30초쯤 걸리고 avg60은 1분 뒤에도 16%입니다. 경보를 avg 줄에 걸면 그만큼 늦게 울리고 늦게 꺼집니다. 빠른 반응이 필요하면 total의 차분이나 trigger를, 추세는 avg300을 봅니다."
          />
          <PsiAverageViz />
          {code("psi-constants", "PSI_FREQ와 EXP 계수")}
          {code("psi-calc-avgs", "calc_avgs 원문")}
          {code("psi-trigger-doc", "trigger 사용법")}
        </section>

        <section id="kernel-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 원문은 CPU마다 열 가지 시간을 더해 tick으로 찍고, 멈춘 시간은 2초마다 평균에 섞습니다</h2>
          <div className={prose}>
            <p>
              Linux v6.12 fs/proc/stat.c의 show_stat(82–137행)이 3절의 cpu 줄입니다. 105–114행이 온라인 CPU마다 user, nice, system, idle, iowait, irq, softirq, steal, guest, guest_nice를 더하고, 127–137행이 그 순서대로 nsec_to_clock_t를 거쳐 씁니다. 커널 내부는 나노초이고 파일에는 USER_HZ tick으로 나옵니다.
            </p>
            <p>
              3절의 4,000 tick은 이 변환 뒤의 값입니다. idle과 iowait만 get_idle_time·get_iowait_time을 따로 거칩니다(25–55행). NO_HZ 커널에서는 tick이 멈춘 동안의 시간을 다른 경로로 세기 때문입니다. 문서가 iowait를 믿지 말라고 적는 이유도 여기 있습니다. iowait는 "어떤 task가 I/O를 기다리는 동안 CPU가 쉰 시간"이라 그 CPU에 다른 task가 올라오면 idle로 바뀝니다.
            </p>
            <p>
              kernel/sched/psi.c는 4절의 식을 머리 주석(60–105행)에 숫자 예시로 적어 두었습니다. 256 CPU에 257개 작업이면 SOME은 1/256 = 0.4%이고, 4 CPU에서 넷 중 하나가 메모리 때문에 멈추면 SOME도 FULL도 25%입니다. 157–160행이 7절의 PSI_FREQ와 세 EXP 계수이고, calc_avgs(320–338행)가 pct = time × 100 ÷ period를 만들어 calc_load에 넣습니다.
            </p>
            <p>
              update_averages(503–553행)는 2초 주기가 늦어졌을 때의 처리를 보여 줍니다. 놓친 주기 수를 세어 그만큼 0을 넣고(missed_periods), 표본이 주기보다 크면 주기로 잘라 초과분을 다음 주기로 넘깁니다. 100%를 넘는 압력을 찍지 않으면서 멈춘 시간을 버리지도 않는 선택입니다. psi_show(1236–1275행)가 some·full 두 줄을 찍되 시스템 전체의 cpu full은 비워 둡니다.
            </p>
            <p>
              psi_trigger_create(1279–1334행)는 "some 150000 1000000" 문자열을 sscanf로 읽고, 창이 10초 이하인지, 권한 없는 사용자라면 2초의 배수인지, 임계가 창보다 작은지를 차례로 검사합니다. 이 검사 순서가 곧 trigger를 쓸 때 받는 오류의 순서입니다.
            </p>
          </div>
          {code("proc-stat-source", "show_stat 원문")}
          {code("psi-formula", "psi.c 머리 주석")}
          {code("psi-calc-avgs", "calc_avgs")}
          {code("psi-show", "psi_show")}
          {code("psi-trigger", "psi_trigger_create")}
          {code("psi-doc", "psi.rst some·full")}
        </section>

        <section id="tools-trace" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 격자가 자원을 고르면 perf가 코드를, bpftrace가 이벤트를 찾습니다</h2>
          <div className={prose}>
            <p>
              6절의 격자가 "CPU 포화"를 가리켰으니 다음 질문은 "무엇이 4초마다 1초씩 CPU를 다 쓰는가"입니다. 카운터는 여기서 멈춥니다. /proc/stat은 어느 프로세스인지 말하지 않고,
              top은 1초 평균이라 1초 폭주를 다른 프로세스와 섞어 보여 줍니다. 이 지점부터 표본화와 이벤트 추적으로 넘어갑니다.
            </p>
            <p>
              perf top은 성능 카운터를 일정 빈도로 표본화해 그 순간 CPU에 있던 함수를 실시간으로 집계합니다. 매뉴얼의 설명은 한 줄입니다. "performance counter profile in real time." 기본은 시스템 전체이고 -F로 빈도를 정합니다. 운영 서버에서는 timer tick과 겹치지 않도록 99 Hz 같은 소수를 쓰는 것이 관례입니다.
            </p>
            <p>
              (가정) 이 서버에서 perf top -F 99를 10초 돌리면 report-gen이라는 프로세스의 함수들이 표본의 60% 안팎을 차지하며, 그 표본은 폭주하는 1초에 몰려 있습니다.
            </p>
            <p>
              perf record는 같은 표본을 perf.data 파일에 남깁니다. "perf record -a -g -F 99 -- sleep 30"처럼 30초 동안 전체 CPU의 호출 스택을 초당 99번 표본화하면 장애 당시의
              기록을 나중에 perf report로 볼 수 있습니다. -g가 호출 스택(call graph)을 함께 남기라는 뜻입니다.
            </p>
            <p>
              bpftrace는 질문의 종류가 다릅니다. "지금 CPU에 무엇이 있는가"가 아니라 "이 이벤트가 날 때 무엇을 셀까"를 적습니다. 매뉴얼의 첫 예제는 open·openat 시스템 콜 tracepoint에 붙어 pid·comm·파일 이름을 찍는 세 줄짜리 프로그램입니다. 한 줄로 줄이면 아래 명령이고, (가정) 이 서버에서는 폭주하는 1초마다 report-gen이 같은 CSV 파일 수십 개를 다시 여는 것이 보입니다.
            </p>
            <p>
              배치 작업이 매 주기 파일을 처음부터 다시 읽고 파싱하는 것이 CPU 폭주의 내용이었습니다.
            </p>
          </div>
          <AlgorithmBlock
            title="USE 격자에서 bpftrace까지 한 번의 진단"
            input={["증상: API p99 180 ms → 2초, 오류 없음", "서버: 4 vCPU, CPU 사용률 40%", "도구: /proc 파일, mpstat·vmstat·iostat, perf, bpftrace"]}
            steps={[
              { code: "for resource in [CPU, 메모리, 디스크, 네트워크]: read U, S, E", note: "열두 칸을 모두 읽습니다. 사용률 한 칸으로 자원을 지우지 않습니다. 결과: CPU S만 빨강(PSI some 25%, r 12)." },
              { code: "confirm with total: Δtotal / Δt == 25%", note: "/proc/pressure/cpu의 total을 10초 간격으로 빼 avg10의 EMA 지연 없이 확인합니다." },
              { code: "perf top -F 99   # 10초", note: "표본의 60%가 report-gen의 함수에 몰립니다(가정). '어느 코드가'에 대한 답입니다." },
              { code: "bpftrace -e 'profile:hz:99 { @[comm] = count(); }'", note: "같은 질문을 bpftrace로. 99 Hz × 10초 × 4 CPU = 3,960 표본 가운데 report-gen이 약 2,400(가정)." },
              { code: "bpftrace -e 'tracepoint:syscalls:sys_enter_openat /comm == \"report-gen\"/ { @[str(args.filename)] = count(); }'", note: "폭주 1초마다 같은 CSV 파일 수십 개를 다시 엽니다(가정). '어떤 이벤트가'에 대한 답이자 수정 방향(결과 캐시·주기 분산)입니다." },
              { code: "fix; re-read grid", note: "고친 뒤 격자를 다시 읽어 CPU S 칸이 내려갔는지, 다른 칸이 올라오지 않았는지 확인합니다." },
            ]}
            output="병목 자원 하나(CPU 포화), 그 안의 프로세스 하나(report-gen), 그 안의 동작 하나(주기마다 파일 재파싱). 사용률 40%만 봤다면 서버 증설로 끝났을 진단입니다."
            repeatUntil="격자의 빨간 칸이 없어지거나, 남은 빨간 칸이 '설계상 받아들인 포화'로 문서화될 때까지 반복합니다."
          />
          {code("perf-top-doc", "perf top 매뉴얼")}
          {code("perf-record-doc", "perf record 매뉴얼")}
          {code("perf-record-freq", "-F 빈도와 상한")}
          {code("bpftrace-open", "bpftrace open 예제")}
          {code("bpftrace-profile", "profile:hz:99")}
          {code("bpftrace-hist", "hist()로 분포 보기")}
        </section>

        <section id="node-exporter" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 대시보드의 노드 지표는 node_exporter가 같은 /proc 파일을 읽어 보낸 것입니다</h2>
          <div className={prose}>
            <p>
              Grafana에서 보던 "CPU 40%" 그래프로 돌아갑니다. node_exporter v1.9.1의 cpu 수집기는 /proc/stat을 읽어 node_cpu_seconds_total{"{"}cpu, mode{"}"}라는 counter로 내보냅니다. mode 라벨은 user, nice, system, idle, iowait, irq, softirq, steal 여덟 가지입니다. 3절에서 손으로 한 뺄셈을 PromQL이 합니다.
            </p>
            <p>
              1 − avg(rate(node_cpu_seconds_total{"{"}mode="idle"{"}"}[1m]))이 흔히 쓰는 사용률이고, 이 서버에서 0.4입니다.
            </p>
            <p>
              pressure 수집기는 /proc/pressure/{"{"}cpu,memory,io,irq{"}"}를 읽되 avg 줄이 아니라 total을 보냅니다. node_pressure_cpu_waiting_seconds_total이 cpu some의 total(µs를 초로)이고, rate(node_pressure_cpu_waiting_seconds_total[1m])이 1분 평균 some 비율입니다. 이 서버에서 0.25입니다.
            </p>
            <p>
              avg10 대신 total을 보내는 덕분에 창 길이를 Prometheus 쪽에서 자유롭게 고를 수 있고, 7절의 EMA 지연도 없습니다.
            </p>
            <p>
              나머지 수집기도 같은 표에 있습니다. loadavg → /proc/loadavg, meminfo → /proc/meminfo(node_memory_MemAvailable_bytes), diskstats → /proc/diskstats, netdev → /proc/net/dev, stat → /proc/stat의 나머지 줄(부팅 시각, fork 수, procs_running·blocked), vmstat → /proc/vmstat.
            </p>
            <p>
              격자의 열두 칸 가운데 dmesg를 읽는 오류 칸 몇 개를 빼면 전부 이 표 안에 있습니다. 따라서 명령으로 보는 숫자와 대시보드의 숫자가 다르면 대개 셋 중 하나입니다. 뺄셈의 창이 다르거나(mpstat 1초 vs rate 1분), 단위가 다르거나(tick vs 초), gauge를 평균했거나입니다.
            </p>
            <p>
              Kubernetes 노드의 "CPU 사용률" 패널도 이 수집기나 cAdvisor의 cgroup 파일에서 옵니다. 노드 지표가 /proc에서 어떻게 cgroup 단위로 쪼개지는지는{" "} <a href="/cs/cloud/linux-containers-cgroup-namespace#overview">컨테이너는 cgroup과 namespace다</a>에서 봅니다.
            </p>
          </div>
          {code("node-exporter-collectors", "수집기 → /proc 표")}
          {code("node-exporter-cpu", "cpu 수집기 원문")}
          {code("node-exporter-pressure", "pressure 수집기 원문")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 사용률은 평균, PSI는 대기, 표본은 확률이라는 한계를 알고 읽습니다</h2>
          <div className={prose}>
            <p>
              먼저 경보를 바꿉니다. CPU 사용률 임계(예: 80%) 하나로 걸던 경보에 포화 지표를 더합니다. rate(node_pressure_cpu_waiting_seconds_total[1m])이 0.2를 넘거나 procs_running이 CPU 수의 두 배를 넘는 상태가 몇 분 이어지면 사용자 지연이 함께 오르고 있을 가능성이 큽니다.
            </p>
            <p>
              다만 호출(page)은 사용자 지표에 걸고 이 지표들은 대시보드에 두는 것이 원칙이며, 그 이유는 <a href="/cs/cloud/linux-sre-metrics-slo-safe-change#overview">SRE로 서버 보기</a>에서 다룹니다.
            </p>
            <p>
              각 숫자의 한계도 적어 둡니다. 사용률은 평균이라 폭주를 숨깁니다. iowait는 다중 코어에서 정확하지 않고 줄어들 수도 있어 "I/O 때문에 느리다"의 근거로 쓰기 어렵고, 그 질문에는
              /proc/pressure/io와 iostat의 await가 낫습니다. PSI의 avg 줄은 2초 갱신·EMA라 반응이 늦고, 시스템 전체의 cpu full은 정의되지 않아 0입니다. load average는 D 상태를
              포함해 CPU 포화 지표로는 부정확합니다.
            </p>
            <p>
              perf의 표본은 확률입니다. 99 Hz로 10초면 CPU당 990개라 1% 미만을 쓰는 함수는 몇 번 안 잡히며, 아주 짧게 폭주하는 작업은 빈도를 올려야 보입니다. 빈도를 올리면 오버헤드가 따라 오르고 kernel.perf_event_max_sample_rate가 상한을 겁니다.
            </p>
            <p>
              bpftrace는 이벤트를 빠뜨리지 않지만 root 권한과 커널 디버그 정보(BTF 등)가 필요하며, 초당 수십만 번 나는 이벤트에 printf를 걸면 그 자체가 부하가 됩니다. 그래서 매뉴얼의 예제들이 printf 대신 count()·hist()로 커널 안에서 집계합니다.
            </p>
            <p>
              이 글의 숫자는 가정한 서버를 커널 식으로 손 계산한 값이며 실제로 잰 것이 아닙니다. 실제 서버에서는 /proc/stat·/proc/pressure/cpu를 직접 두 번 읽어 보고, perf·bpftrace
              출력은 그 서버의 것으로 바꿔 읽어야 합니다. 격자가 CPU가 아니라 메모리를 가리켰다면 <a href="/cs/cloud/linux-memory-page-cache-oom#pressure">메모리 글의 회수 압력</a>으로,
              디스크를 가리켰다면 <a href="/cs/cloud/linux-disk-full-inode-deleted-files#overview">디스크 글</a>로 이어집니다.
            </p>
          </div>
          <ContentBoundary article="linux-observability-proc-psi-perf-ebpf" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 서버로 다음 숫자를 예상해 보세요</h2>
          <div className={prose}>
            <p>
              같은 4 vCPU 서버에서 배치 작업의 스레드가 12개가 아니라 6개였다면 폭주 1초 동안의 SOME은 몇 %이고 avg10이 수렴하는 값은 얼마일까요? (답: 4절) 폭주가 4초 주기가 아니라 2초 주기(1초 폭주 + 1초 한가)로 바뀌면 2초 표본은 어떻게 들어오고, avg10은 진동할까요? (답: 7절) Grafana의 CPU 사용률 패널이 rate(…[5m])으로 그려져 있다면 mpstat 1과 비교해 폭주가 어떻게 달리 보일까요? (답: 10절)
            </p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxObservabilityTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          bpftrace: { id: "bpftrace", label: "bpftrace v0.23.2 매뉴얼", badgeClass: "bg-amber-500/10 border-amber-500 text-amber-700" },
          node_exporter: { id: "node_exporter", label: "node_exporter v1.9.1 원문", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
        }}
      />
    </>
  );
}
