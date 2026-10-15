import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import LoadSplitViz from "./linux-server-interview-incident-map/viz/LoadSplitViz";
import TriageProcessViz from "./linux-server-interview-incident-map/viz/TriageProcessViz";
import LoadEmaViz from "./linux-server-interview-incident-map/viz/LoadEmaViz";
import { codeRefs } from "./linux-server-interview-incident-map/codeRefs";
import { linuxLoadTrees } from "./linux-server-interview-incident-map/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

const TOPICS = [
  { topic: "프로세스·시그널·좀비", marks: ["○", "○", "○", "○", "○"], count: 5 },
  { topic: "파일·inode·디스크가 찼을 때", marks: ["○", "○", "○", "○", "○"], count: 5 },
  { topic: "네트워크·TCP 연결", marks: ["○", "○", "○", "○", "○"], count: 5 },
  { topic: "메모리·page cache·OOM", marks: ["○", "○", "○", "○", "○"], count: 5 },
  { topic: "장애를 좁히는 명령 순서", marks: ["○", "○", "○", "○", "○"], count: 5 },
  { topic: "스크립트·코딩", marks: ["○", "○", "", "○", "○"], count: 4 },
  { topic: "권한·보안", marks: ["", "○", "○", "○", ""], count: 3 },
  { topic: "부팅·systemd·로그", marks: ["", "", "○", "○", "○"], count: 3 },
] as const;

const SOURCES = ["Google SRE", "Meta PE", "국내 질문지", "LinkedIn", "준비 목록"] as const;

const SERIES = [
  { href: "/cs/cloud/linux-memory-page-cache-oom#overview", title: "메모리·page cache·OOM", question: "free가 거의 0인데 정상인가요? OOM killer는 누구를 고르나요?" },
  { href: "/cs/cloud/linux-disk-full-inode-deleted-files#overview", title: "디스크가 찼을 때", question: "df는 여유가 있는데 쓰기가 실패합니다. 지운 파일의 공간은 왜 안 돌아오나요?" },
  { href: "/cs/cloud/linux-process-signals-pid1-fds#overview", title: "프로세스·시그널·PID 1", question: "좀비는 어떻게 찾고 치우나요? SIGTERM과 SIGKILL은 무엇이 다른가요?" },
  { href: "/cs/cloud/linux-tcp-time-wait-ports-backlog#overview", title: "TCP 연결의 한도", question: "TIME_WAIT은 왜 필요한가요? 나가는 연결이 갑자기 안 맺어지는 이유는요?" },
  { href: "/cs/cloud/linux-systemd-boot-change-incidents#overview", title: "systemd와 변경 사고", question: "보안 업데이트 하나가 왜 여러 지역의 노드를 동시에 떨어뜨렸나요?" },
] as const;

export default function LinuxServerInterviewIncidentMapArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 접속하자마자 30이라는 숫자를 봤다면 다음에 무엇을 치나요?</h2>
          <div className={prose}>
            <p>
            느려졌다는 신고를 받고 서버에 SSH로 들어갔습니다. 첫 명령 uptime이 30.02, 26.43, 19.02를 돌려줍니다. 면접관은 여기서 멈추고 묻습니다. 이 숫자가
            무엇을 뜻하고 다음에 어떤 명령을 치겠습니까?
          </p>
            <p>이 장면은 꾸민 것이 아닙니다. Netflix 성능 팀의 Brendan Gregg가 2015년에 공개한 첫 60초 점검 글의 실제 출력입니다. 그 서버의 CPU는 32개였습니다. CPU가 16개였다면 같은 30을 다르게 읽어야 하고, CPU 수를 알아도 30만으로는 원인을 정할 수 없습니다.</p>
            <p>이 글의 답은 이렇습니다. 대기업 SRE·인프라 면접의 리눅스 질문은 명령을 얼마나 외웠는지보다 증상 하나를 자원 하나로 좁히는 순서를 묻습니다. 첫 60초에는 오류와 포화를 먼저 보고, 30처럼 큰 숫자는 CPU를 기다리는 줄과 디스크를 기다리는 줄을 함께 센 값이라 다른 도구로 갈라야 합니다.</p>
            <p>이 답을 공개 질문 자료 다섯 곳, Gregg의 실제 출력 열 개, 리눅스 v6.12 커널의 계산 코드 순서로 확인합니다. 메모리, 디스크, 프로세스, TCP, systemd는 이어지는 다섯 글이 하나씩 끝까지 따라가고 이 글은 그 입구를 맡습니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 공개 자료 다섯 곳은 질문 목록보다 다섯 자원을 묻습니다</h2>
          <div className={prose}>
            <p>회사별로 어떤 리눅스 질문이 몇 번 나왔는지 집계한 공개 통계는 찾지 못했습니다. 네이버·카카오·쿠팡 같은 국내 대기업이 공식으로 낸 질문 목록도 찾지 못했습니다. 그래서 이 글은 직접 연 자료 다섯 곳에 어떤 주제가 나오는지만 셉니다. 빈도가 아니라 공통 분모입니다.</p>
            <p>
            다섯 곳은 성격이 다릅니다. Google SRE 면접 정리는 aced.io(옛 tryexponent)라는 제3자 가이드입니다. Meta Production Engineer 쪽은
            지원자 후기와 <a href="https://prepfully.com/interview-guides/meta-production-engineer">prepfully</a> 같은 준비 사이트의 정리입니다. 국내 질문지는 22명이 이름을 올려 경력별로 만든 문서이고 LinkedIn School of SRE는 회사가
            공개한 신입 교육 과정입니다. 마지막은 커뮤니티의 SRE 면접 준비 목록입니다.
          </p>
            <p>School of SRE는 level101과 level102 두 단계 전체를 한 곳으로 셉니다. 리눅스 기초 단원만 보면 네트워크와 스크립트가 빠지지만 같은 과정의 다른 단원이 그 주제를 맡기 때문입니다.</p>
            <p>Google 가이드에 따르면 SRE 면접에는 45분짜리 장애 추적 시간이 있습니다. 공유 문서에 명령과 가설을 적어 가며 가상의 장애를 푸는 형식이고, CPU·메모리·네트워크에 걸쳐 원인을 차례로 지우는지를 본다고 적습니다. Linux·systems 시간에는 좀비 정리, inode, SIGTERM과 SIGKILL의 차이 같은 질문이 예시로 나옵니다. Meta 지원자 후기 하나는 첫 장애 추적 문제의 원인이 디스크 가득 참이었다고 적습니다.</p>
            <p>세어 보면 프로세스, 파일, 네트워크, 메모리, 장애 추적 순서가 다섯 곳 모두에 나오고 스크립트·코딩이 네 곳에 나옵니다. 질문의 겉모양은 달라도 결국 CPU, 메모리, 디스크, 프로세스, 네트워크 가운데 어디가 막혔는지를 고르는 문제입니다. 다음 절부터는 이 상자 다섯 개를 하나의 서버에서 실제 숫자로 가릅니다.</p>
          </div>
          <div className="not-prose my-8 min-w-0 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <caption className="mb-2 text-left text-xs text-muted-foreground">주제별로 직접 연 자료 다섯 곳 중 몇 곳에 나오는가 (2026-10-15 확인, LinkedIn은 level101·102 전체)</caption>
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-3 font-semibold">주제</th>
                  {SOURCES.map((source) => (
                    <th key={source} className="px-2 py-2 text-center text-xs font-semibold">{source}</th>
                  ))}
                  <th className="py-2 pl-2 text-right font-semibold">합</th>
                </tr>
              </thead>
              <tbody>
                {TOPICS.map((row) => (
                  <tr key={row.topic} className="border-b border-border/60">
                    <td className="py-2 pr-3">{row.topic}</td>
                    {row.marks.map((mark, index) => (
                      <td key={index} className="px-2 py-2 text-center font-mono">{mark}</td>
                    ))}
                    <td className="py-2 pl-2 text-right font-mono font-bold">{row.count}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={prose}>
            <p>부팅·systemd·로그는 세 곳에 나옵니다. 국내 질문지는 부트 과정 설명을 경험 문항 1번으로 두고 지운 로그와 차오르는 로그를 장애 추적 문항으로 묻습니다. 그런데 실제 대형 장애에서는 이 주제가 자주 출발점이 됩니다. 2023년 3월 Datadog의 여러 지역 장애는 자동 적용된 systemd 보안 업데이트에서 시작했습니다. 면접 빈도와 장애 빈도가 다를 수 있다는 점을 기억해 두고 systemd 글에서 다시 봅니다.</p>
          </div>
        </section>

        <section id="case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 같은 30이 CPU 32개에서는 꽉 찬 상태이고 16개에서는 두 가지 뜻입니다</h2>
          <div className={prose}>
            <p>30이라는 숫자는 지금 일하거나 일할 차례를 기다리는 task의 평균 개수입니다. task는 커널이 스케줄하는 실행 단위로, 프로세스와 그 안의 스레드를 모두 포함합니다. 개수이므로 CPU 수와 비교해야 의미가 생깁니다.</p>
            <p>Gregg의 서버는 CPU가 32개였습니다. 30 ÷ 32 = 0.94이므로 CPU 하나에 평균 0.94개가 몰린 셈이고, 같은 글의 vmstat 예시는 CPU를 쓰거나 기다리는 수 r을 32~34, I/O를 기다리며 막힌 수 b를 0으로 보여 줍니다. CPU가 막 포화되는 경계입니다.</p>
            <p>
            (가정) 같은 30이 CPU 16개짜리 서버에서 나왔다고 합시다. vmstat의 r이 30이고 b가 0이면 14개가 CPU를 기다립니다. r이 8이고 b가 22라면 CPU
            절반이 노는데도 30입니다. 앞의 경우는 CPU를 늘리거나 일을 줄여야 하고 뒤의 경우는 디스크를 봐야 합니다.
          </p>
            <p>
            두 경우 모두 uptime은 30을 보여 줍니다. 그래서 uptime은 수요가 크다는 사실과 오르고 있는지만 알려 주고 어느 자원인지는 r과 b를 따로 보여 주는 다음 명령이
            정합니다. 왜 디스크를 기다리는 task까지 세는지는 5절에서 역사와 함께 봅니다.
          </p>
          </div>
          <CalculationWalkthrough
            title="같은 load 30을 CPU 수와 두 줄로 나누기"
            question="load 30은 CPU 32개, 16개 서버에서 각각 무엇을 뜻할까요?"
            scope="1분 load 값만 봅니다. 32 CPU는 Gregg 글의 실제 출력, 16 vCPU의 r·b는 설명용 가정입니다. 지수 감쇠 때문에 순간 값과 평균은 다를 수 있습니다."
            steps={[
              { label: "CPU 하나당 수요", expression: "30.02 ÷ 32 CPU", result: "0.94", reason: "load는 개수라 CPU 수로 나눠야 한 CPU에 몰린 정도가 됩니다." },
              { label: "Gregg 서버의 두 줄", expression: "r 32~34 + b 0", result: "32~34", reason: "vmstat r은 CPU를 쓰거나 기다리는 수, b는 I/O 완료를 기다리며 막힌 수입니다." },
              { label: "16 vCPU · CPU 포화", expression: "r 30 − CPU 16", result: "14개 대기", reason: "(가정) r이 CPU 수를 넘는 만큼이 CPU를 기다리는 줄입니다." },
              { label: "16 vCPU · 디스크 대기", expression: "r 8 + b 22", result: "30", reason: "(가정) CPU는 절반이 비어도 b가 load를 30으로 올립니다." },
              { label: "판정", expression: "r > CPU 수 · b ≫ 0", result: "CPU 포화 · I/O 대기", reason: "같은 30을 r과 b 중 어느 쪽이 채웠는지가 다음 명령을 정합니다." },
            ]}
            conclusion="load 30은 수요의 크기일 뿐입니다. CPU 줄과 D 줄로 나눈 뒤에야 CPU를 볼지 디스크를 볼지 정해집니다."
            caveats={["r은 순간 값이고 load는 지수 감쇠 평균이라 두 수가 정확히 같지는 않습니다.", "b는 I/O 대기만 셉니다. lock을 기다리는 D task는 load에는 들어가도 b에는 없어서 D 전체는 ps -eo state로 셉니다(6·8절).", "TASK_IDLE로 자는 task는 load에 들어가지 않습니다(8절)."]}
          />
          <LoadSplitViz />
        </section>

        <section id="picture" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 첫 60초는 오류와 포화를 먼저 보고 사용률은 나중에 봅니다</h2>
          <div className={prose}>
            <p>
            Gregg의 글은 첫 60초에 칠 명령 열 개를 순서대로 제시합니다. 원칙은 하나입니다. 해석하기 쉬운 오류와 포화를 먼저 보고 사용률은 그다음에 봅니다. 포화는 자원이
            감당하는 것보다 일이 많아 줄이 생기거나 기다리는 시간이 생긴 상태입니다.
          </p>
            <p>사용률을 나중에 보는 이유가 있습니다. CPU 사용률 98%는 혼자서는 문제가 아닐 수 있습니다. 일이 많아도 줄이 없으면 아직 감당하는 중입니다. 반대로 커널 로그의 오류 한 줄이나 0보다 큰 swap 출입은 그 자체로 원인 후보가 됩니다.</p>
            <p>또 하나의 원칙은 의심을 지우는 일도 기록하는 것입니다. 일을 받는 디스크의 대기가 1 ms 아래라면 디스크를 용의선에서 빼고 남은 후보에 집중합니다. 아래 의사코드는 열 줄을 차례로 실행하며 다섯 자원에 표시를 남기고, Viz는 Gregg의 실제 출력으로 그 표시가 바뀌는 과정을 보여 줍니다.</p>
          </div>
          <AlgorithmBlock
            title="첫 60초 점검: 오류 → 포화 → 사용률"
            input={["SSH로 접속한 느린 서버 한 대", "자원 다섯 개: CPU, 메모리, 디스크, 네트워크, 오류(커널 로그)", "모든 자원의 표시는 미확인"]}
            steps={[
              { code: "uptime → 1·5·15분 load를 비교한다", note: "1분 값이 15분 값보다 크면 수요가 오르는 중, 작으면 사건을 놓쳤을 수 있습니다." },
              { code: "dmesg | tail → OOM kill·드롭 같은 커널 오류를 찾는다", note: "오류는 해석이 쉬워 가장 먼저 봅니다. 과거 기록인지 지금 일인지는 다음 줄들이 가릅니다." },
              { code: "vmstat 1 → r을 CPU 수와, b·wa·si·so를 0과 비교한다", note: "r > CPU 수면 CPU 포화, b·wa가 크면 I/O 대기, si·so가 0이 아니면 메모리 부족입니다." },
              { code: "mpstat -P ALL 1 → CPU별 불균형을 본다", note: "CPU 하나만 뜨거우면 단일 스레드 병목일 수 있습니다." },
              { code: "pidstat 1 → CPU를 쓰는 프로세스를 찾는다", note: "%CPU는 모든 CPU를 합친 값이라 1591%는 약 16 CPU 몫입니다." },
              { code: "iostat -xz 1 → await·avgqu-sz·%util로 디스크 포화를 본다", note: "await는 대기와 처리 시간을 합친 ms, %util 100% 근처는 포화 신호입니다." },
              { code: "free -m → buffers·cached가 0에 가까운지 본다", note: "cache는 곧 회수할 수 있는 메모리라 used가 크다고 부족한 것이 아닙니다." },
              { code: "sar -n DEV 1 → NIC 처리량을 한도와 비교한다", note: "rxkB/s × 8 = kbit/s로 바꿔 링크 속도와 비교합니다." },
              { code: "sar -n TCP,ETCP 1 → retrans/s로 재전송을 본다", note: "재전송은 망 문제이거나 과부하로 패킷을 버리는 서버의 신호입니다." },
              { code: "top → 앞의 값과 다른 것이 있는지 확인한다", note: "값이 크게 다르면 부하가 출렁이는 중이라 다시 관찰합니다." },
            ]}
            output="원인 자원 하나와 그 자원을 쓰는 프로세스, 용의선에서 뺀 자원 목록"
          />
          <TriageProcessViz />
          <div className={prose}>
            <p>
            Gregg의 서버에서는 CPU가 원인으로 남았습니다. java 두 개가 CPU 약 16개씩을 사용자 코드로 썼고 디스크·메모리·네트워크는 모두 풀려났습니다. 다음 단계는 커널이
            아니라 애플리케이션의 profile입니다. 여기까지가 면접에서 첫 몇 분에 보여 줄 수 있는 범위입니다.
          </p>
          </div>
          <div id="paper-gregg-60s" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Brendan Gregg · Linux Performance Analysis in 60,000 Milliseconds · Netflix TechBlog, 2015-11-30" citeKey={1} href="https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55">
              <q>Look for errors and saturation metrics, as they are both easy to interpret</q> 열 개 명령의 순서와 이 글의 출력 예시(load 30.02, vmstat r 32~34, java 1591%, eth0 약 22 MB/s)는 모두 이 글에서 가져왔습니다. 출력은 한 운영 서버에서 서로 다른 시각에 찍은 예시입니다. 이 방법을 USE Method의 일부라고 설명합니다. 같은 글의 <a href="https://www.brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf">PDF 사본</a>이 brendangregg.com에 있습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="need" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 리눅스는 1993년부터 디스크를 기다리는 task도 부하로 셉니다</h2>
          <div className={prose}>
            <p>다른 운영체제의 부하 숫자는 CPU를 쓰거나 기다리는 수만 세는 경우가 많습니다. 리눅스도 처음에는 그랬습니다. 1993년 10월 Matthias Urlichs가 커널 메일링 리스트에 "Load average broken ?"이라는 글과 함께 고친 코드를 올리면서 바뀌었습니다.</p>
            <p>그가 든 예는 이렇습니다. 빠른 swap 디스크를 느린 디스크로 바꾸면 서버는 더 힘들어지는데 부하 숫자는 오히려 내려가니 직관에 어긋난다는 것입니다. task들이 CPU 대신 느린 디스크 앞에서 기다리게 되기 때문입니다. 그는 swap이나 빠른 I/O를 기다리는 task도 자원을 쓰고 있다고 보고 이 수를 더하게 했습니다.</p>
            <p>
            그 결과 리눅스의 load average는 CPU 부하가 아니라 시스템 전체의 수요가 됐습니다. Gregg는 2017년 글에서 이 역사를 추적한 뒤 리눅스 load는 스레드
            수요를 재는 값으로 보면 여전히 의도대로 동작한다고 정리합니다. 대신 혼자서는 어느 자원인지 말하지 못하므로 다른 도구로 갈라야 합니다.
          </p>
            <p>그래서 면접에서 load가 CPU 수보다 높으면 CPU가 부족하다고 바로 답하면 반쪽 답이 됩니다. 디스크를 기다리는 task도 들어간다는 점, 그래서 vmstat의 r과 b, 필요하면 ps의 D 상태 수를 나눠 본다는 점까지 말해야 3절의 16 vCPU 두 경우를 구별할 수 있습니다.</p>
          </div>
          <div id="paper-gregg-loadavg" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Brendan Gregg · Linux Load Averages: Solving the Mystery · 2017-08-08" citeKey={2} href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html">
              <q>processes which are swapping or waiting on "fast", i.e. noninterruptible, I/O, also consume resources.</q> 1993-10-29 Matthias Urlichs의 메일에서 인용한 문장입니다. 같은 글은 EXP_1·EXP_5·EXP_15 상수와, 유휴 시스템에서 CPU 스레드 하나를 1분 돌리면 1분 값이 약 0.62가 된다는 실험을 함께 다룹니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 두 줄과 세 숫자에는 각각 표준 이름이 있습니다</h2>
          <div className={prose}>
            <p>
            uptime이 보여 주는 세 숫자를 부하 평균(load average)이라고 부릅니다. CPU를 쓰거나 차례를 기다리는 task의 줄은 실행 대기열(run queue)이고
            vmstat의 r 열이 그 길이입니다.
          </p>
            <p>신호를 받아도 깨지 않고 디스크 응답이나 일부 lock 같은 사건만 기다리는 잠을 끊김 없는 잠(uninterruptible sleep)이라고 부릅니다. ps의 상태 열에 D로 찍혀서 흔히 D state라고 합니다. load는 이 D task를 모두 셉니다.</p>
            <p>vmstat의 b 열은 이름이 비슷해도 다른 수입니다. /proc/stat의 procs_blocked, 곧 I/O 완료를 기다리는 task 수를 보여 줍니다. 디스크를 기다리는 D task는 대개 b에도 들어가지만 lock을 기다리는 D task는 load만 올리고 b에는 나오지 않습니다. 그래서 load는 대략 r과 D의 합이고, D 전체는 ps -eo state의 D를 세어 확인합니다.</p>
            <p>4절의 점검 원칙에는 Gregg가 붙인 이름이 있습니다. 모든 자원마다 사용률(utilization), 포화(saturation), 오류(errors)를 확인하는 방법이라 머리글자를 따서 USE Method라고 부릅니다. 세 load 값은 1분, 5분, 15분 창의 평균처럼 불리지만 실제로는 아래 식의 감쇠 상수 이름입니다.</p>
          </div>
          <ExplainedFormula
            question="커널은 5초마다 load 값을 어떻게 새로 계산합니까?"
            idea="새 값은 이전 값을 조금 줄인 것과 지금 센 task 수를 조금 섞은 것의 합입니다. 상수가 1에 가까울수록 과거를 오래 기억합니다."
            formula={"a_{t}=a_{t-1}\\,e^{-5/T}+n_t\\,\\big(1-e^{-5/T}\\big)"}
            annotatedFormula={"a_{t}=\\underbrace{a_{t-1}}_{\\text{5초 전 load}}\\cdot\\underbrace{e^{-5/T}}_{\\text{남기는 비율}}+\\underbrace{n_t}_{\\text{지금 센 task 수}}\\cdot\\underbrace{\\big(1-e^{-5/T}\\big)}_{\\text{새로 섞는 비율}}"}
            operations={[
              { expression: "e^{-5/T}", annotation: ["T = 60초면 0.9200입니다.", "커널은 이를 1884 ÷ 2048로 씁니다."] },
              { expression: "n_t", annotation: ["CPU 줄과 D 줄의 합입니다.", "Gregg 사례에서는 32~34개입니다."] },
              { expression: "a_{t-1}e^{-5/T}", annotation: ["0에서 시작하면 0입니다."] },
              { expression: "n_t(1-e^{-5/T})", annotation: ["n_t = 1이면 0.08입니다.", "첫 5초 뒤 1분 값은 0.08입니다."] },
            ]}
            terms={[
              { symbol: "a_t", name: "load 값", description: "t번째 5초 표본 뒤의 1분·5분·15분 값 가운데 하나입니다." },
              { symbol: "T", name: "감쇠 시간 상수", description: "60, 300, 900초입니다. 창의 길이가 아니라 줄어드는 속도입니다." },
              { symbol: "n_t", name: "센 task 수", description: "nr_running과 nr_uninterruptible의 전체 합입니다." },
            ]}
            assumptions={["5초마다 정확히 한 번 계산합니다.", "커널은 실수 대신 2048배한 정수로 계산하고 올림을 섞습니다(7·8절)."]}
            interpretation="T = 60이어도 1분 뒤에 이전 값이 사라지지 않습니다. 12번 곱하면 0.92¹² ≈ 0.37이 남고, 수요 1이 1분 동안 이어져도 1분 값은 약 0.63에 머뭅니다."
          />
        </section>

        <section id="mechanism" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 스레드 하나가 1분 동안 돌면 1분 값은 0.63까지만 오릅니다</h2>
          <div className={prose}>
            <p>
            유휴 서버에서 CPU를 계속 쓰는 스레드 하나를 띄웠다고 합시다. 실제 수요는 처음부터 1입니다. 커널은 5초마다 이 1을 2048로 바꿔 넣고, 이전 값에는 1884를 곱한
            뒤 전체를 2048로 나눕니다. 정수 나눗셈이라 버리는 몫이 생기므로 새 수가 이전 값 이상이면 2047을 더해 올림합니다.
          </p>
            <p>첫 표본은 0 × 1884 + 2048 × 164 = 335,872에 2,047을 더해 2048로 나눈 164입니다. load로는 164 ÷ 2048 = 0.08입니다. 다음 표본은 164 × 1884 + 335,872 + 2,047을 2048로 나눈 315입니다. 매번 1.0까지 남은 거리의 약 8%만 다가갑니다.</p>
            <p>12번째 표본, 곧 60초 뒤의 값은 1,299입니다. /proc/loadavg는 여기에 10을 더해 소수 둘째 자리까지 찍으므로 0.63이 보입니다. Gregg는 같은 실험을 측정 그래프에서 읽어 약 0.62로 적었습니다. 정수 계산으로는 표본 11개면 0.60, 12개면 0.63이라 그래프 값과 딱 맞는 표본 수는 없습니다. LOAD_FREQ가 5초보다 1 tick 길어 12번째 표본은 60초를 조금 넘긴 뒤에 찍힙니다.</p>
            <p>스레드가 끝나도 값은 바로 0이 되지 않습니다. 1,299에서 수 0을 12번 섞으면 474, 곧 0.23이 남습니다. 이때 15분 값은 0.06이라 1분 값이 아직 더 큽니다. 같은 계산을 이어 가면 스레드가 끝나고 약 155초(표본 31개) 뒤에야 1분 값 93이 15분 값 101 아래로 내려갑니다. 늦게 접속해 1분 값이 15분 값보다 낮다면 이미 지나간 사건의 꼬리를 보는 중일 수 있다는 Gregg의 말이 이 감쇠에서 나옵니다.</p>
          </div>
          <CalculationWalkthrough
            title="calc_load 정수 계산 12번"
            question="수요 1이 60초 동안 이어지면 1분 load는 얼마로 보일까요?"
            scope="FIXED_1 = 2048, EXP_1 = 1884, 5초 표본 12개입니다. 스레드가 첫 표본 직전에 시작해 매 표본에 잡힌다고 가정합니다."
            steps={[
              { label: "넣는 수", expression: "1 task × 2048", result: "active = 2,048", reason: "커널은 load 1.0을 정수 2048로 다룹니다." },
              { label: "첫 표본", expression: "(0 × 1884 + 2,048 × 164 + 2,047) ÷ 2048", result: "164", reason: "2048 − 1884 = 164가 새로 섞는 몫입니다. 2,047은 올림용입니다." },
              { label: "둘째 표본", expression: "(164 × 1884 + 335,872 + 2,047) ÷ 2048", result: "315", reason: "이전 값 164에 남기는 비율을 곱하고 같은 몫을 다시 섞습니다." },
              { label: "12번째 표본", expression: "같은 계산을 12번", result: "1,299", reason: "60초 ÷ 5초 = 12번입니다. 매번 남은 거리의 약 8%를 줄입니다." },
              { label: "화면 값", expression: "(1,299 + 10) × 100 ÷ 2048의 정수부", result: "0.63", reason: "/proc/loadavg는 FIXED_1/200 = 10을 더한 뒤 두 자리로 찍습니다." },
              { label: "같은 60초의 5분·15분", expression: "EXP_5 2014 · EXP_15 2037로 12번", result: "378 · 132 → 0.18 · 0.06", reason: "입력은 같고 상수만 달라 더 천천히 오릅니다." },
            ]}
            conclusion="1분 값은 1분짜리 평균이 아닙니다. 수요가 그대로여도 60초 뒤 0.63에 머무르고, 세 값의 간격이 수요가 바뀐 시점을 알려 줍니다."
            caveats={["실수 식으로는 1 − (1884/2048)¹² ≈ 0.633, e⁻¹로 쓰면 0.632입니다. 정수 계산과 올림이 같은 자리를 줍니다.", "부팅해 측정하지 않았고 calc_load를 Python으로 다시 구현해 계산했습니다."]}
          />
          <LoadEmaViz />
        </section>

        <section id="source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 커널은 잠드는 순간 그 잠을 load에 넣을지 정합니다</h2>
          <div className={prose}>
            <p>
            리눅스 v6.12의 include/linux/sched/loadavg.h 18–23행이 7절의 상수를 정의합니다. FSHIFT 11, FIXED_1 2048, 5초 간격
            LOAD_FREQ, 그리고 1884·2014·2037입니다. 28–38행의 calc_load가 6절의 식을 정수로 옮긴 함수이고 34–35행이 7절의 올림 2,047입니다.
          </p>
            <p>kernel/sched/loadavg.c 16–17행 주석은 load average를 nr_running과 nr_uninterruptible의 지수 감쇠 평균이라고 정의합니다. 78–91행 calc_load_fold_active가 CPU 하나의 두 수를 더해 지난번과의 차이만 돌려주고, 349–379행 calc_global_load가 그 합에 2048을 곱해 세 값에 한 번씩 섞습니다.</p>
          </div>
          {code("load-constants", "고정소수점 상수와 calc_load")}
          {code("load-definition", "load average의 커널 정의")}
          {code("fold-active", "CPU 하나가 보태는 수")}
          {code("global-load", "5초마다 세 값에 섞기")}
          <div className={prose}>
            <p>D 줄의 수는 kernel/sched/core.c의 __schedule에서 생깁니다. 6622–6625행은 CPU를 내놓는 task가 UNINTERRUPTIBLE이면서 NOLOAD도 FROZEN도 아닐 때만 load에 보탤 잠으로 표시합니다. kernel/sched/sched.h 2773–2774행이 그 표시를 보고 nr_uninterruptible을 올리고, core.c 3665–3666행은 깨어날 때 내립니다.</p>
            <p>vmstat의 b는 다른 길로 나옵니다. sched.h 2776–2778행은 in_iowait가 켜진 task만 rq의 nr_iowait를 올리고, fs/proc/stat.c 177–183행이 그 합 nr_iowait()를 procs_blocked로 찍습니다. lock을 기다리는 D task는 첫 표시만 받고 둘째 표시는 받지 않으므로 load에는 들어가도 b에는 없습니다.</p>
            <p>
            3절의 16 vCPU 디스크 대기 장면을 이 코드에 넣어 봅니다. (가정) task 22개가 디스크 응답을 UNINTERRUPTIBLE 잠으로 기다린다면 모두 이 표시를 받아
            nr_uninterruptible을 22만큼 올립니다. 돌고 있는 8개와 합쳐 calc_load_tasks는 30이 되고 5초마다 30 × 2048 = 61,440이
            calc_load에 들어갑니다.
          </p>
            <p>include/linux/sched.h 133행은 TASK_IDLE을 UNINTERRUPTIBLE과 NOLOAD의 합으로 정의합니다. 같은 22개가 TASK_IDLE로 잤다면 6624행의 조건에서 걸러져 load는 8입니다. 신호로 깨지 않는 잠이라도 모두 load에 들어가는 것은 아닙니다.</p>
            <p>이 장면은 조건을 보이려고 꾸민 반사실입니다. 실제 디스크 대기는 보통 UNINTERRUPTIBLE로 자고, TASK_IDLE로 자는 task는 ps에 D가 아니라 I로 보입니다.</p>
            <p>
            마지막으로 fs/proc/loadavg.c 18–25행이 화면에 찍는 문자열을 만듭니다. avenrun은 시스템 전체에 하나뿐인 값이라 이 파일을 그대로 보여 주는
            container 안에서는 container에 준 CPU 몫과 무관한 host 전체의 load가 나옵니다.
          </p>
          </div>
          {code("contributes-to-load", "잠드는 task를 load에 넣을지 정하는 조건")}
          {code("uninterruptible-count", "nr_uninterruptible과 nr_iowait를 올리는 곳")}
          {code("proc-stat-blocked", "vmstat b가 읽는 procs_blocked")}
          {code("wakeup-decrement", "깨어날 때 내리는 곳")}
          {code("task-states", "R·S·D와 TASK_IDLE 비트")}
          {code("proc-loadavg", "/proc/loadavg 출력 형식")}
        </section>

        <section id="interview" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 면접 답변은 질문 → 첫 명령 → 가설 → 단기·장기 조치로 짭니다</h2>
          <div className={prose}>
            <p>Google 가이드의 장애 추적 시간에서 면접관이 보는 것은 명령 자체보다 순서입니다. 가이드는 어떤 확인 질문을 하는지, 다음에 어떤 명령을 치는지, 단기와 장기 조치가 무엇인지를 묻는다고 적습니다. 아래 세 답은 이 틀에 이 글의 원칙을 넣어 본 예시입니다. (가정)</p>
            <p>첫 문제는 원격 서버에 SSH가 안 된다는 신고입니다. 확인 질문은 전부 안 되는지 한 사람만 안 되는지, 언제부터인지입니다. 경로를 바깥에서 안으로 좁힙니다. 이름이 맞는 주소로 풀리는지, 22번 포트까지 TCP가 닿는지, 서버 안의 sshd가 떠 있고 인증 로그에 거절이 찍히는지를 차례로 봅니다.</p>
            <p>단기 조치는 실패한 첫 관문만 고치는 것입니다. 방화벽이었다면 그 규칙 하나를 되돌립니다. 장기 조치는 그 관문을 바깥에서 검사하는 감시를 다는 것입니다. 경로를 관문별로 나누는 방법은 <a href="/cs/cloud/cloud-networking-request-path#overview">요청 경로 추적</a>에서 이미 다뤘습니다.</p>
            <p>
            둘째 문제는 CPU가 50%인데 지연이 두 배가 된 서비스입니다. 평균 50%는 CPU 32개 중 16개가 완전히 놀 수도 있다는 뜻이라 mpstat로 CPU 하나만
            100%인지부터 봅니다. Gregg는 CPU 하나만 뜨거우면 단일 스레드 병목일 수 있다고 적습니다. 그다음 vmstat의 wa와 b, 가상 머신이라면 다른 손님이 빼앗은
            시간인 st를 봅니다.
          </p>
            <p>여기서도 깨끗하면 sar -n TCP,ETCP의 retrans/s로 재전송을 봅니다. 재전송이 늘면 요청 하나가 재전송 대기 시간만큼 늦어지므로 CPU가 놀아도 지연이 커집니다. 연결 대기열과 재전송은 <a href="/cs/cloud/linux-tcp-time-wait-ports-backlog#overview">TCP 연결의 한도</a>에서 이어집니다.</p>
            <p>셋째 문제는 배포 직후 오류가 늘었다는 상황입니다. 먼저 바뀐 것이 무엇인지와 영향 범위를 묻습니다. dmesg에 OOM kill이 있는지, 새 프로세스가 열린 파일 한도에 걸렸는지를 확인합니다. 단기 조치는 원인이 확정되기 전이라도 이전 버전으로 되돌려 영향을 멈추는 것이고, 장기 조치는 일부 서버에 먼저 배포해 같은 오류를 미리 잡는 것입니다.</p>
            <p>국내 질문지는 같은 주제를 경력별로 나눕니다. 3년 미만은 하, 10년 미만은 중, 10년 이상은 상입니다. 장애 추적 항목에는 df는 여유가 있는데 파일 시스템이 찼다고 나오는 상황, OOM killer가 희생 프로세스를 고르는 기준이 있습니다. 둘은 각각 디스크 글과 메모리 글에서 끝까지 따라갑니다. load가 0.5~1이던 서버가 갑자기 100을 넘는 상황을 묻는 장애 추적 10번 문항은 이 글 3절과 같은 질문입니다.</p>
          </div>
          <div id="paper-google-sre-guide" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="aced.io(옛 tryexponent) · Google Site Reliability Engineer Interview 가이드 (제3자 정리, 2026-10-15 확인)" citeKey={3} href="https://www.aced.io/guides/google-site-reliability-engineer-interview">
              <q>A user can't SSH into a remote machine; walk through how you'd diagnose it.</q> 같은 가이드는 SWE-SRE는 코딩, SE-SRE는 Linux·네트워크 비중이 크다고 적고, 45분 장애 추적과 45분 Linux·systems 시간의 예시 질문을 나열합니다. Google의 공식 문서가 아닙니다.
            </CitationBlock>
          </div>
          <div id="paper-korean-question-bank" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="리눅스 엔지니어 기술면접 질문지 · github.com/pjhwa/linux-engineers wiki (22명 작성, 2026-10-15 확인)" citeKey={4} href="https://github.com/pjhwa/linux-engineers/wiki">
              System Administration, Kernel Internals, Network, Troubleshooting, Security 등 열 개 분류와 하(3년 미만)·중(10년 미만)·상(10년 이상) 난이도를 둡니다. 특정 회사의 공식 질문 목록은 아닙니다.
            </CitationBlock>
          </div>
          <div id="paper-meta-pe-reports" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Meta Production Engineer 면접 후기 · reliabilitywhisperer.substack.com (2025-04-02) · prepfully 가이드 (지원자 자기보고·제3자 정리)" citeKey={5} href="https://reliabilitywhisperer.substack.com/p/2025meta-e4-production-engineer-interview">
              2025년 3월 면접 후기는 장애 추적 문제의 원인이 디스크 가득 참이었고, 온사이트 Linux 시간이 메모리·프로세스·파일 시스템·보안 기초·네트워크를 다뤘다고 적습니다. <a href="https://prepfully.com/interview-guides/meta-production-engineer">prepfully</a>는 시스템 시간 주제로 시스템 콜, swap, 프로세스 수명 주기를 듭니다.
            </CitationBlock>
          </div>
          <div id="paper-linkedin-school-of-sre" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="LinkedIn · School of SRE · level101·102 (2026-10-15 확인)" citeKey={6} href="https://linkedin.github.io/school-of-sre/">
              level101 Linux Basics는 시스템 관리 단원에 사용자·그룹, 파일 권한, SSH, 패키지, 프로세스, 메모리, 데몬과 systemd, 로그를 두고 Bash 스크립트는 범위 밖이라고 적습니다. 같은 level101에 Linux Networking(TCP)과 Security 단원이, level102에 Bash 스크립트와 장애 추적·성능 단원이 있어 표의 LinkedIn 열은 두 단계 전체로 셉니다.
            </CitationBlock>
          </div>
        </section>

        <section id="limits" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. load는 방향만 알려 주고 원인은 다섯 자원의 글이 닫습니다</h2>
          <div className={prose}>
            <p>load average에는 분명한 한계가 있습니다. CPU와 디스크 대기를 섞고, TASK_IDLE은 빼고, 감쇠 때문에 늦게 반응합니다. container 안에서는 host 전체 값이 보일 수도 있습니다. Gregg의 결론처럼 같은 서버의 과거 값과 비교하는 추세 지표로 쓰는 편이 안전합니다.</p>
            <p>
            60초 점검도 범위가 정해져 있습니다. 열 개 명령은 어느 자원인지를 고르는 데까지만 갑니다. 그 자원 안에서 무엇이 왜 막혔는지는 profile, 추적, 커널 코드로 내려가야
            하고 면접의 둘째 질문도 대개 그쪽을 향합니다.
          </p>
            <p>그 아래 단계를 다섯 글이 나눠 맡습니다. 각 글은 이 글처럼 실제 장애 하나와 작은 숫자로 시작해 명령과 커널 코드까지 내려갑니다. 2절의 표에서 3~5곳에 나온 질문이 어느 글에서 끝나는지 아래에 적었습니다.</p>
          </div>
          <ol className="not-prose my-6 space-y-3">
            {SERIES.map((item, index) => (
              <li key={item.href} className="border-l border-primary/50 pl-4">
                <a href={item.href} className="text-sm font-bold text-foreground underline-offset-4 hover:underline">
                  {String(index + 1).padStart(2, "0")} · {item.title}
                </a>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.question}</p>
              </li>
            ))}
          </ol>
          <div className={prose}>
            <p>Kubernetes 노드에서 같은 증상을 만나면 conntrack과 MTU처럼 노드 바깥 경계가 더해집니다. 그 경로는 <a href="/cs/cloud/kubernetes-network-packet-path#overview">Kubernetes 패킷 경로</a>에서, 관측 지표와 복구 절차를 운영 체계로 묶는 일은 <a href="/cs/cloud/cloud-reliability-observability-iac#overview">신뢰성·관측·IaC</a>에서 다룹니다.</p>
          </div>
          <ContentBoundary article="linux-server-interview-incident-map" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 같은 서버로 다음 판단을 예상해 보세요</h2>
          <div className={prose}>
            <p>CPU 8개 서버에서 uptime이 12.0, 11.8, 4.1이고 vmstat의 r이 3, b가 9라면 다음에 어떤 명령을 치겠습니까? 디스크를 의심하는 근거는 무엇인가요? (답: 3절, 4절)</p>
            <p>유휴 서버에서 CPU 스레드 두 개를 동시에 띄우면 첫 5초 표본 뒤 1분 load의 정수 값은 얼마일까요? (답: 7절)</p>
            <p>디스크 응답을 기다리는 task가 TASK_KILLABLE로 잤다면 load에 들어갈까요? sched.h의 비트 정의와 core.c의 조건으로 답해 보세요. (답: 8절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxLoadTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
