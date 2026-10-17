import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AcceptQueueViz from "./linux-tcp-time-wait-ports-backlog/viz/AcceptQueueViz";
import CloseHandshakeViz from "./linux-tcp-time-wait-ports-backlog/viz/CloseHandshakeViz";
import PortPoolViz from "./linux-tcp-time-wait-ports-backlog/viz/PortPoolViz";
import { codeRefs } from "./linux-tcp-time-wait-ports-backlog/codeRefs";
import { tcpTrees } from "./linux-tcp-time-wait-ports-backlog/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxTcpTimeWaitPortsBacklogArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. CPU는 한가한데 새 연결이 열리지 않는 이유는 포트와 대기열에 있습니다</h2>
          <div className={prose}>
            <p>API 서버 한 대가 같은 upstream으로 짧은 HTTP 호출을 초당 600번 엽니다. 배포 직후에는 멀쩡하다가 1분이 채 안 되어 로그에 'Cannot assign requested address'가 쏟아집니다. CPU와 메모리는 절반도 쓰지 않았습니다.</p>
            <p>이 글의 답부터 적겠습니다. 연결을 먼저 끊은 쪽은 그 연결을 TIME_WAIT 상태로 60초 동안 들고 있습니다. 그 사이 같은 목적지로 가는 출발 포트는 다시 쓸 수 없고, 기본 범위의 포트는 28,232개라서 초당 600개를 열면 48초째에 바닥납니다.</p>
            <p>
            받는 쪽에도 같은 모양의 한계가 있습니다. handshake를 마친 연결은 프로그램이 accept()로 꺼낼 때까지 줄을 서는데 줄 길이는 listen()에 준 값과
            somaxconn 중 작은 값입니다. 줄이 차면 커널은 SYN을 조용히 버리고 클라이언트는 1초 뒤에야 다시 보냅니다.
          </p>
            <p>흔히 처방하는 tcp_fin_timeout 낮추기는 TIME_WAIT를 줄이지 못합니다. 그 값은 FIN_WAIT_2라는 다른 상태의 시간이기 때문입니다. 이 사실을 Linux v6.12 소스의 두 줄로 확인합니다.</p>
            <p>국내 리눅스 엔지니어 질문지의 'TIME_WAIT가 왜 필요한가', 'TCP 연결과 종료 handshake', 'half-open 연결'과 제3자가 정리한 Google SRE 면접 안내서의 'CPU 50%인데 지연이 두 배' 질문이 모두 이 경로 위에 있습니다. 면접 질문 전체 지도는 <a href="/cs/cloud/linux-server-interview-incident-map#overview">리눅스 서버 면접·장애 지도</a>에 있습니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 커널은 연결 하나를 주소 네 개의 묶음으로 기억합니다</h2>
          <div className={prose}>
            <p>바깥에서 보면 프로그램은 connect()로 연결을 열고 close()로 닫을 뿐입니다. 그 사이 커널은 연결마다 출발 IP, 출발 포트, 목적 IP, 목적 포트 네 값을 묶어 table에 넣습니다. 들어온 packet이 어느 연결의 것인지 이 네 값으로 찾습니다.</p>
            <p>클라이언트가 고르는 값은 출발 포트 하나뿐입니다. 출발 IP는 나가는 인터페이스가, 목적지는 호출 대상이 정합니다. 그래서 같은 upstream으로 가는 연결끼리는 출발 포트만으로 서로를 구분해야 합니다.</p>
            <p>서버 쪽은 모양이 다릅니다. listen() 중인 소켓 하나가 포트 8080을 지키고, handshake 중인 연결과 handshake를 마치고 accept()를 기다리는 연결을 두 줄에 세웁니다. 연결이 끝나도 서버의 8080은 그대로라서 서버는 포트가 바닥나지 않습니다.</p>
            <p>이 글은 연결을 열고 닫는 자리만 봅니다. 혼잡 제어, 재전송 알고리즘, 버퍼 크기 조정은 다루지 않습니다. 클라우드 방화벽과 경로 문제는 <a href="/cs/cloud/cloud-networking-request-path#mechanism">요청 경로 추적</a>에서 먼저 봅니다. 소켓이 왜 fd 하나로 보이고 packet이 인터페이스에서 라우팅 표와 netfilter 훅을 지나 그 소켓에 닿는 길은 <a href="/cs/cloud/linux-network-interface-route-netfilter-dns#netfilter-hooks">네트워크 기초 글</a>이 맡습니다.</p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 초당 600개를 60초 붙잡으면 36,000칸이 필요하지만 풀은 28,232칸입니다</h2>
          <div className={prose}>
            <p>
            (가정) API 서버 10.0.0.5가 10.0.0.11:8080으로 요청마다 새 연결을 열고 응답을 받으면 클라이언트가 먼저 close()를 부릅니다. 요청은 초당
            600개이고 응답은 수 ms 안에 옵니다.
          </p>
            <p>연결이 끝날 때마다 출발 포트 하나가 TIME_WAIT 소켓에 묶여 60초 동안 돌아오지 않습니다. 1초에 600칸, 10초에 6,000칸이 묶입니다. 60초를 채우기 전에 풀려나는 칸은 없으므로 묶인 칸은 시간에 비례해 늘어납니다.</p>
            <p>기본 출발 포트 범위는 32768부터 60999까지입니다. 양 끝을 포함해 28,232개입니다. 28,232 ÷ 600 ≈ 47.05이므로 47초가 지나면 32칸만 남고, 48번째 초에는 600개 중 32개만 포트를 받습니다.</p>
            <p>칸은 묶인 지 정확히 60초 뒤에 풀리므로 어느 초에 열 수 있는 수는 60초 전 그 초에 연 수와 같습니다. 49번째 초부터 60번째 초까지 12초 동안은 풀리는 칸이 없어 600개가 모두 실패합니다.</p>
            <p>61번째 초부터는 첫 초에 묶인 600칸이 풀리면서 다시 47초 동안 600개씩 열리고 같은 모양이 60초마다 되풀이됩니다. 평균으로 보면 초당 28,232 ÷ 60 ≈ 470개가 상한이고 실패는 초당 약 130개이지만, 실제로는 매 60초 가운데 약 13초 동안 연결이 전부 막히는 모습으로 나타납니다. 이 주기는 요청률을 낮추기 전까지 계속됩니다.</p>
          </div>
          <CalculationWalkthrough
            title="같은 목적지로 가는 출발 포트 장부"
            question="초당 600개를 여는 클라이언트는 언제 포트가 바닥나고, 그 뒤 초당 몇 개만 열 수 있나요?"
            scope="출발 IP 10.0.0.5에서 10.0.0.11:8080 하나로 가는 연결만 셉니다. 클라이언트가 먼저 끊고, 연결이 열려 있는 수 ms는 60초에 비해 무시합니다."
            steps={[
              { label: "포트 수", expression: "60999 − 32768 + 1", result: "28,232개", reason: "ip_local_port_range 기본값의 양 끝을 포함한 개수입니다. 커널 코드도 high에 1을 더해 [32768, 61000)으로 셉니다." },
              { label: "필요한 칸", expression: "600 개/초 × 60 초", result: "36,000개", reason: "연결 하나가 TIME_WAIT로 포트를 60초 붙잡으므로 한순간에 묶인 칸은 도착률 × 체류 시간입니다." },
              { label: "바닥나는 시각", expression: "28,232 ÷ 600", result: "≈ 47.05초", reason: "60초가 되기 전에는 풀리는 칸이 없으므로 묶인 칸은 600t로 늘어납니다." },
              { label: "48번째 초", expression: "28,232 − 47 × 600", result: "32개 성공, 568개 실패", reason: "남은 32칸이 먼저 나가고 나머지 connect()는 EADDRNOTAVAIL을 받습니다." },
              { label: "지속 상한", expression: "28,232 ÷ 60", result: "≈ 470개/초 (평균)", reason: "칸은 60초 뒤에 풀리므로 60초마다 28,232개만 엽니다. 남는 7,768개 실패는 매초 고르게 나지 않고 49~60번째 초 같은 약 13초 구간에 몰립니다." },
            ]}
            conclusion="필요한 36,000칸이 풀 28,232칸보다 많으므로 이 클라이언트는 설정을 바꾸지 않는 한 초당 약 470개 넘게 같은 목적지로 연결을 열 수 없습니다."
            caveats={["TIME_WAIT는 출발 IP·목적 IP·목적 포트 묶음마다 따로 셉니다. 목적지가 다르면 같은 출발 포트를 다시 쓸 수 있습니다.", "TIME_WAIT 소켓 총수에는 tcp_max_tw_buckets 상한도 있습니다. v6.12 기본값은 established hash 칸 수의 절반이고, 이 칸은 메모리 128KiB마다 하나라 4GiB 호스트에서는 16,384입니다. 상한에 닿으면 커널은 TIME_WAIT를 만들지 않고 바로 닫으므로 그런 호스트에서는 이 계산대로 포트가 바닥나지 않습니다. 이 글은 메모리가 넉넉해 상한이 28,232보다 큰 호스트를 가정합니다.", "서버가 먼저 끊는 프로토콜이라면 TIME_WAIT는 서버에 생기고 클라이언트 포트는 바로 풀립니다(5절)."]}
          />
          <PortPoolViz />
        </section>

        <section id="close-states" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 연결을 닫는 데는 segment 네 개가 오가고 먼저 끊은 쪽이 마지막에 남습니다</h2>
          <div className={prose}>
            <p>TCP는 양방향을 따로 닫습니다. 클라이언트가 FIN을 보내면 '나는 더 보낼 것이 없다'는 뜻일 뿐이고, 서버는 아직 보낼 것이 남았다면 계속 보낼 수 있습니다. 그래서 FIN과 ACK가 방향마다 한 번씩, 모두 네 번 오갑니다.</p>
            <p>
            먼저 FIN을 보낸 클라이언트는 FIN_WAIT_1을 거쳐 서버가 ACK하면 FIN_WAIT_2에서 서버의 FIN을 기다립니다. FIN을 받은 서버 커널은 CLOSE_WAIT가
            되어 서버 프로그램이 close()를 부르기를 기다립니다.
          </p>
            <p>
            서버 프로그램이 close()하면 서버가 FIN을 보내고 LAST_ACK가 됩니다. 클라이언트가 마지막 ACK를 보내면 서버는 바로 CLOSED이고 클라이언트만
            TIME_WAIT로 들어가 60초를 셉니다.
          </p>
            <p>CLOSE_WAIT가 수천 개 쌓였다는 장애 보고는 이 흐름에서 읽힙니다. 상대는 이미 FIN을 보냈는데 우리 프로그램이 소켓을 닫지 않은 것입니다. 커널 설정이 아니라 close()를 빠뜨린 코드나 끝나지 않는 요청 처리를 찾아야 합니다.</p>
          </div>
          <CloseHandshakeViz />
        </section>

        <section id="why-time-wait" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. TIME_WAIT는 잃어버린 마지막 ACK와 옛 연결의 늦은 segment를 위해 남습니다</h2>
          <div className={prose}>
            <p>
            마지막 ACK가 사라지면 서버는 FIN을 다시 보냅니다. 클라이언트가 이미 연결을 지웠다면 그 FIN에 RST로 답하게 되어 서버 쪽에서는 정상 종료가 오류로 바뀝니다.
            TIME_WAIT 소켓은 그 FIN에 ACK를 다시 보내고 타이머를 새로 겁니다.
          </p>
            <p>둘째 이유는 같은 4-tuple로 바로 새 연결을 열 때입니다. 네트워크 어딘가에 늦게 도착할 옛 연결의 segment가 남아 있으면 새 연결의 데이터로 잘못 받아들여질 수 있습니다. RFC 9293은 이것을 연결의 incarnation 문제로 설명하고 TIME_WAIT가 재사용 속도를 제한한다고 적습니다.</p>
            <p>RFC는 TIME_WAIT 길이를 2 × MSL로 정하고 MSL을 2분으로 둡니다. Linux는 이 4분 대신 60초 상수를 씁니다. 서버의 TIME_WAIT는 같은 클라이언트가 더 큰 순서 번호나 새 timestamp로 SYN을 보내면 받아 줍니다. 그래서 TIME_WAIT 때문에 포트가 막히는 쪽은 대개 먼저 끊은 클라이언트입니다.</p>
            <p>half-open 연결은 반대 방향의 문제입니다. 한쪽이 재부팅이나 장애로 연결을 잊었는데 다른 쪽은 여전히 ESTABLISHED로 믿는 상태입니다. RFC 9293은 어느 쪽이든 데이터를 보내려 하면 RST로 드러난다고 적습니다. 보낼 데이터가 없으면 keepalive 같은 별도 확인이 있어야 발견됩니다.</p>
          </div>
          {code("time-wait-reack", "TIME_WAIT가 FIN에 다시 ACK하고 새 SYN을 받는 원문")}
          <div id="rfc-9293" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="RFC 9293 · Transmission Control Protocol (TCP), 2022-08 · §3.4.1, §3.4.2, §3.5.1, §3.6" citeKey={1} href="https://www.rfc-editor.org/rfc/rfc9293">
              <q>the TIME-WAIT state limits the rate of connection reuse</q> 같은 문서는 먼저 닫은 쪽이 2 × MSL 동안 TIME-WAIT에 머물러야 한다(MUST-13)고 적고 §3.4.2에서 MSL을 2분으로 정합니다. half-open 연결은 데이터를 보내려 할 때 reset으로 드러난다고 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 묶인 포트 수는 초당 여는 수에 60초를 곱한 값입니다</h2>
          <div className={prose}>
            <p>
            지금까지의 대상에 이름을 붙이겠습니다. 클라이언트가 자동으로 받는 출발 포트를 ephemeral port라고 부르고 그 범위는 sysctl
            net.ipv4.ip_local_port_range입니다. 먼저 끊은 쪽이 60초 머무는 상태가 TIME_WAIT입니다.
          </p>
            <p>
            포트를 찾지 못한 connect()가 돌려주는 오류 번호는 EADDRNOTAVAIL이고 메시지로는 'Cannot assign requested address'입니다. 같은
            증상을 포트 고갈(ephemeral port exhaustion)이라고 부릅니다.
          </p>
            <p>3절의 36,000은 대기열 이론의 <a href="/cs/ai/llm-serving-ops#paper-little-law">Little 법칙</a>과 같은 계산입니다. 평균 도착률에 평균 체류 시간을 곱하면 한순간 시스템 안에 머무는 수가 나옵니다. 여기서 시스템은 TIME_WAIT 상태이고 체류 시간은 60초로 고정입니다. 다만 N_TW가 tcp_max_tw_buckets를 넘으면 넘친 연결은 TIME_WAIT 없이 닫히고 TcpExtTCPTimeWaitOverflow counter만 올라갑니다.</p>
          </div>
          <ExplainedFormula
            question="같은 목적지로 초당 λ개를 열고 먼저 끊는 클라이언트에는 TIME_WAIT 소켓이 몇 개 쌓이고, 언제 포트가 부족해지나요?"
            idea="TIME_WAIT 체류 시간이 상수라서 쌓이는 수는 도착률에 정비례하고, 그 수가 4-tuple 하나에 쓸 수 있는 포트 수를 넘으면 connect가 실패합니다."
            formula={"N_{\\text{TW}} = \\lambda \\cdot T_{\\text{TW}},\\qquad \\lambda_{\\max} = \\frac{k\\cdot P}{T_{\\text{TW}}}"}
            annotatedFormula={"\\begin{aligned}N_{\\text{TW}}&=\\underbrace{\\lambda}_{\\text{초당 새 연결}}\\cdot\\underbrace{T_{\\text{TW}}}_{\\text{TIME\\_WAIT 60초}}\\\\\\lambda_{\\max}&=\\frac{\\overbrace{k}^{\\text{목적지 묶음 수}}\\cdot\\overbrace{P}^{\\text{포트 범위 크기}}}{\\underbrace{T_{\\text{TW}}}_{\\text{포트가 묶이는 시간}}}\\end{aligned}"}
            operations={[
              { expression: "\\lambda \\cdot T_{\\text{TW}}", annotation: ["600 × 60 = 36,000개가 한순간에 묶입니다."] },
              { expression: "\\frac{k\\cdot P}{T_{\\text{TW}}}", annotation: ["k = 1, P = 28,232이면 28,232 ÷ 60 ≈ 470개/초입니다.", "600 > 470이라 이 클라이언트는 실패합니다."] },
              { expression: "k", annotation: ["목적 IP를 4개로 나누면 k = 4, 상한은 약 1,882개/초입니다."] },
            ]}
            terms={[
              { symbol: "\\lambda", name: "새 연결 도착률", description: "같은 출발 IP·목적 IP·목적 포트로 초당 새로 여는 연결 수입니다." },
              { symbol: "T_{\\text{TW}}", name: "TIME_WAIT 체류 시간", description: "Linux에서는 TCP_TIMEWAIT_LEN = 60초 상수입니다." },
              { symbol: "P", name: "포트 범위 크기", description: "기본 32768–60999에서 28,232개입니다." },
              { symbol: "k", name: "목적지 묶음 수", description: "출발 IP·목적 IP·목적 포트 조합의 개수입니다. 조합마다 포트를 따로 셉니다." },
            ]}
            assumptions={["클라이언트가 먼저 끊습니다.", "연결이 ESTABLISHED로 머무는 시간은 60초에 비해 무시합니다.", "tcp_tw_reuse로 TIME_WAIT 포트를 넘겨받지 않는다고 봅니다(10절)."]}
            interpretation="해결책은 이 식의 세 자리 중 하나를 바꾸는 일입니다. λ를 줄이는 연결 재사용, k를 늘리는 목적지 분산, P를 늘리는 범위 확장, 실질 T를 줄이는 tw_reuse가 각각 다른 비용을 냅니다."
          />
        </section>

        <section id="port-search" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. connect()는 짝수 포트부터 훑고 4-tuple이 겹치지 않는 첫 포트를 고릅니다</h2>
          <div className={prose}>
            <p>출발 포트를 정하지 않은 connect()는 커널의 __inet_hash_connect로 들어갑니다. 함수는 출발 IP·목적 IP·목적 포트의 hash로 table_perturb라는 칸 하나를 고르고, 그 칸의 값에 hash를 더해 범위 안의 시작 위치를 정합니다. 짝수 포트를 한 바퀴 돈 뒤 홀수 포트를 돕니다. 칸의 값은 연결이 성공할 때마다 훑은 거리만큼 앞으로 밀리므로 같은 목적지라도 다음 연결은 조금 뒤에서 찾기 시작합니다.</p>
            <p>후보 포트마다 두 번 묻습니다. 먼저 그 포트에 bind()나 listen()한 소켓이 있으면 건너뜁니다. 없으면 후보 포트로 만든 4-tuple이 이미 연결 table에 있는지 확인합니다. 같은 4-tuple의 TIME_WAIT 소켓이 있으면 tcp_tw_reuse 판정을 통과할 때만 그 자리를 넘겨받습니다.</p>
            <p>
            3절의 48번째 초에는 28,232개 후보가 모두 '같은 4-tuple의 TIME_WAIT가 있음'으로 떨어집니다. 함수는 -EADDRNOTAVAIL을 돌려줍니다.
          </p>
            <p>
            코드 구조상 이 실패는 후보 포트마다 lock을 잡고 table을 확인한 뒤에야 나옵니다. 비용은 거의 찼을 때가 아니라 절반이 찼을 때부터 커집니다. 짝수 포트 14,116개가 먼저 차므로 약 23.5초부터는 connect()마다 짝수 후보 14,116개를 모두 확인한 뒤에야 홀수 포트에 닿습니다.
          </p>
          </div>
          <AlgorithmBlock
            title="출발 포트 고르기 (__inet_hash_connect의 의사코드)"
            input={["출발 IP 10.0.0.5, 목적 10.0.0.11:8080", "포트 범위 [32768, 61000) → 28,232개", "tcp_tw_reuse = 2 (loopback만)"]}
            steps={[
              { code: "offset ← (table_perturb[hash(src_ip, dst_ip, dst_port)] + hash) mod 28,232; offset ← 짝수로 내림", note: "목적지마다 시작 위치가 다르고, 같은 목적지도 연결마다 시작 위치가 앞으로 밀립니다. 짝수부터 훑습니다." },
              { code: "for port in 짝수 후보(offset부터 한 바퀴):", note: "범위를 넘으면 처음으로 돌아갑니다." },
              { code: "  if port ∈ ip_local_reserved_ports: continue", note: "예약 포트는 자동 배정에서 뺍니다." },
              { code: "  if port에 bind()·listen() 소켓이 있음: continue", note: "서버가 쓰는 포트는 빌려 쓰지 않습니다." },
              { code: "  if (src, port, dst, dport)가 table에 없음: return port", note: "같은 포트라도 목적지가 다르면 여기서 통과합니다." },
              { code: "  if 그 소켓이 TIME_WAIT이고 tw_reuse 허용: 넘겨받고 return port", note: "기본 2는 loopback만 허용하므로 이 사례에서는 거절됩니다." },
              { code: "홀수 후보로 같은 순회를 한 번 더", note: "짝수에서 못 찾았을 때만 돕니다." },
              { code: "return -EADDRNOTAVAIL", note: "애플리케이션이 'Cannot assign requested address'를 받습니다." },
            ]}
            output="고른 출발 포트, 또는 48번째 초의 568개 연결처럼 EADDRNOTAVAIL"
          />
          {code("hash-connect", "출발 포트 순회와 EADDRNOTAVAIL")}
          {code("check-established", "4-tuple 중복과 TIME_WAIT 넘겨받기")}
          {code("port-range-default", "기본 범위 32768–60999")}
        </section>

        <section id="kernel-timers" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. tcp_fin_timeout은 FIN_WAIT_2의 시간이고 TIME_WAIT는 상수 60초입니다</h2>
          <div className={prose}>
            <p>포트 고갈을 검색하면 net.ipv4.tcp_fin_timeout을 10초로 내리라는 조언이 자주 나옵니다. v6.12 소스에서 타이머 계산에 이 값을 쓰는 곳은 tcp_fin_time() 하나이고(getsockopt TCP_LINGER2가 기본값을 알려 줄 때도 읽습니다), 그 결과는 FIN_WAIT_2를 얼마나 기다릴지에만 쓰입니다. 커널 문서도 이 값을 고아 연결이 FIN_WAIT_2에 머무는 시간이라고 정의합니다.</p>
            <p>tcp.h 126행은 TCP_TIMEWAIT_LEN을 60*HZ로 정의합니다. sysctl이 아니라 컴파일된 상수입니다. tcp_minisocks.c의 tcp_time_wait()는 넘겨받은 시간을 쓰다가도 상태가 TIME_WAIT이면 348–349행에서 그 값을 TCP_TIMEWAIT_LEN으로 덮어씁니다.</p>
            <p>FIN_WAIT_2를 짧게 하면 무엇이 달라질까요? 프로그램이 close()한 뒤 상대가 FIN을 끝내 보내지 않는 고아 연결이 더 빨리 정리됩니다. 상대가 FIN을 보내면 그 순간 진짜 TIME_WAIT로 바뀌고 타이머는 다시 60초로 걸립니다. 3절의 사례에서는 서버가 수 ms 안에 FIN을 보내므로 TIME_WAIT 수가 달라지지 않습니다.</p>
            <p>tcp.c의 주석은 FIN_WAIT_2를 1분 뒤 끊는 동작이 RFC를 일부러 어긴 것이라고 밝힙니다. 상대가 FIN을 보내지 않으면 이쪽 소켓이 영원히 남는 문제 때문입니다. 면접에서 'tcp_fin_timeout으로 TIME_WAIT를 줄인다'고 답하면 이 구분을 묻는 후속 질문을 받기 쉽습니다.</p>
          </div>
          {code("timewait-len", "TCP_TIMEWAIT_LEN과 TCP_FIN_TIMEOUT 상수")}
          {code("time-wait-timer", "TIME_WAIT면 60초로 덮어쓰는 두 줄")}
          {code("fin-time", "타이머 계산에서 tcp_fin_timeout을 읽는 자리")}
          {code("close-fin-wait2", "close() 뒤 FIN_WAIT_2 처리")}
          {code("fin-wait2-to-time-wait", "FIN이 오면 TIME_WAIT로 바뀌고 60초 재설정")}
          {code("sysctl-doc", "커널 문서의 tcp_fin_timeout 정의")}
        </section>

        <section id="listen-queues" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 받는 쪽은 accept 대기열이 차면 SYN을 버리고 클라이언트는 1초를 잃습니다</h2>
          <div className={prose}>
            <p>이제 upstream 서버 쪽입니다. (가정) 서버 프로그램이 listen(fd, 511)을 부르고 somaxconn은 기본 4096입니다. 커널은 socket.c에서 둘 중 작은 511을 listener에 저장합니다. 반대로 프로그램이 65535를 넘기면 4096으로 잘립니다.</p>
            <p>accept 대기열이 찼는지는 sock.h의 sk_acceptq_is_full이 판정합니다. 비교가 &gt;라서 511이면 512개까지 들어갑니다. (가정) 서버 프로그램이 GC나 lock 때문에 1초 동안 accept()를 못 부르면 초당 600개 중 처음 512개가 약 0.85초 만에 줄을 채웁니다.</p>
            <p>그 뒤 온 SYN은 tcp_conn_request에서 버려지고 ListenOverflows와 ListenDrops가 늘어납니다. 서버는 RST도 SYN-ACK도 보내지 않으므로 클라이언트는 오류를 받지 않습니다. 첫 재전송 시간 1초 뒤에 SYN을 다시 보내고, 이 88개 요청의 응답 시간에는 1초가 그대로 더해집니다.</p>
            <p>CPU 사용률이 50%인데 지연이 두 배가 됐다는 면접 질문에 이 경로가 하나의 답이 됩니다. 평균 CPU는 한가해 보여도 짧은 정지 동안 줄이 넘치면 일부 요청만 1초씩 늦어져 꼬리 지연이 커집니다.</p>
          </div>
          <AcceptQueueViz />
          <div className={prose}>
            <p>handshake 중인 연결이 서는 SYN 대기열도 있습니다. v6.12에서는 이 줄도 같은 backlog 값과 비교합니다. 차면 syncookies(기본 1)가 켜져 있으므로 연결 상태를 저장하지 않고 순서 번호에 정보를 담은 SYN-ACK로 답합니다. 이때 dmesg에 'Possible SYN flooding on port'가 찍힙니다.</p>
            <p>커널 문서는 cookie가 공격 대비책이지 정상 요청이 많은 서버를 버티게 하는 수단이 아니라고 적습니다. 공격이 아닌데 이 경고가 보이면 backlog와 accept 속도를 고치라는 뜻입니다. tcp_max_syn_backlog는 cookie를 끈 경우 마지막 4분의 1을 이미 아는 상대에게 남기는 데 쓰입니다.</p>
            <p>handshake의 마지막 ACK가 도착한 순간 줄이 차 있으면 그 ACK가 버려집니다. 서버의 요청 소켓은 SYN 대기열에 남지만 클라이언트는 연결이 됐다고 믿지만 서버에는 소켓이 없는, 짧은 half-open 상태입니다. tcp_abort_on_overflow가 기본값 0이면 서버는 남아 있는 요청 소켓으로 SYN-ACK를 다시 보내 회복할 기회를 줍니다.</p>
          </div>
          <AlgorithmBlock
            title="listener가 SYN을 받았을 때 (tcp_conn_request 앞부분의 의사코드)"
            input={["listener backlog = min(511, somaxconn 4096) = 511", "accept 대기열 512개 가득, SYN 대기열 여유", "tcp_syncookies = 1"]}
            steps={[
              { code: "if SYN 대기열 길이 ≥ backlog: want_cookie ← syncookies 사용 가능", note: "cookie를 못 쓰면 drop. 이 사례에서는 SYN 대기열이 여유라 건너뜁니다." },
              { code: "if accept 대기열 길이 > backlog: ListenOverflows += 1; goto drop", note: "512 > 511이라 여기서 버립니다. cookie 여부와 상관이 없습니다." },
              { code: "req ← 요청 소켓 할당; SYN-ACK 전송", note: "정상 경로입니다. cookie면 요청 소켓을 SYN 대기열에 넣지 않습니다." },
              { code: "drop: ListenDrops += 1; return", note: "응답을 보내지 않습니다. 클라이언트는 1초 뒤 SYN을 다시 보냅니다." },
            ]}
            output="SYN-ACK를 보내거나, 88개처럼 조용히 버리고 counter만 남김"
          />
          {code("listen-clamp", "backlog를 somaxconn으로 자르는 곳")}
          {code("somaxconn-default", "SOMAXCONN 4096")}
          {code("listen-backlog-store", "잘린 backlog 저장")}
          {code("acceptq-full", "> 비교로 판정하는 accept 대기열")}
          {code("reqsk-full", "SYN 대기열도 같은 backlog와 비교")}
          {code("conn-request", "SYN을 버리는 두 갈래")}
          {code("syn-flood-action", "cookie 결정과 SYN flooding 경고")}
          {code("syn-recv-overflow", "마지막 ACK에서 넘칠 때")}
          {code("rto-init", "첫 재전송 1초")}
          {code("sysctl-doc-syncookies", "커널 문서의 syncookies 경고")}
        </section>

        <section id="fixes" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 포트 고갈의 해법은 식의 어느 자리를 바꾸느냐에 따라 비용이 다릅니다</h2>
          <div className={prose}>
            <p>6절의 상한 kP ÷ T에서 λ를 줄이거나 k·P를 늘리거나 실질 T를 줄이면 됩니다. 같은 600개/초 사례에 넣어 하나씩 봅니다.</p>
            <p>
            가장 근본적인 답은 연결을 재사용하는 것입니다. HTTP keep-alive connection pool에 연결 32개를 열어 두고 요청을 그 위로 보내면 새 연결은 pool이
            줄거나 idle timeout이 지날 때만 생깁니다. λ가 600에서 한 자릿수로 떨어지고 handshake 비용도 함께 사라집니다. 대신 upstream이 끊은 연결을
            pool이 알아채고 다시 여는 처리가 필요합니다. (가정)
          </p>
            <p>목적지를 늘리면 4-tuple이 달라지므로 k가 커집니다. upstream IP 4개로 고르게 나누면 한 묶음에 초당 150개, TIME_WAIT 9,000개만 쌓여 28,232칸 안에 들어갑니다. 상한은 약 1,882개/초입니다. load balancer 뒤의 VIP 하나만 부른다면 k는 1이라 이 방법이 통하지 않습니다.</p>
            <p>범위를 넓히면 P가 커집니다. 1024–65535로 잡으면 64,512개, 상한은 약 1,075개/초입니다. 커널 문서는 범위의 시작이 ip_unprivileged_port_start(기본 1024)보다 작으면 안 된다고 적습니다. 서비스가 나중에 listen할 포트는 ip_local_reserved_ports로 자동 배정에서 빼 두어야 합니다.</p>
            <p>tcp_tw_reuse를 1로 두면 같은 4-tuple의 TIME_WAIT 소켓을 새 connect()가 넘겨받습니다. 조건은 그 연결이 TCP timestamp를 썼고 마지막 timestamp를 받은 초가 지났을 것입니다. 실질 T가 60초에서 1초 안쪽으로 줄지만, 커널 문서는 이 값을 전문가 조언 없이 바꾸지 말라고 적고 기본은 loopback 전용 2입니다.</p>
          </div>
          <CalculationWalkthrough
            title="해법별 같은 목적지 지속 상한"
            question="600개/초 사례에서 각 해법은 상한을 얼마로 바꾸나요?"
            scope="상한 = k × P ÷ T. keep-alive는 상한 대신 λ를 줄이므로 따로 적습니다. 숫자는 설명용 계산이며 측정값이 아닙니다."
            steps={[
              { label: "현재", expression: "1 × 28,232 ÷ 60", result: "≈ 470개/초", reason: "목적지 하나, 기본 범위, TIME_WAIT 60초입니다. 600보다 작아 실패합니다." },
              { label: "목적지 4개", expression: "4 × 28,232 ÷ 60", result: "≈ 1,882개/초", reason: "4-tuple이 목적 IP마다 달라 포트를 따로 셉니다." },
              { label: "범위 1024–65535", expression: "1 × 64,512 ÷ 60", result: "≈ 1,075개/초", reason: "65535 − 1024 + 1 = 64,512개입니다." },
              { label: "tw_reuse = 1", expression: "1 × 28,232 ÷ 1", result: "≥ 28,232개/초", reason: "timestamp가 있으면 마지막 timestamp를 받은 초가 바뀌는 즉시, 길어야 1초 안에 넘겨받습니다. timestamp가 없으면 60초 그대로입니다." },
              { label: "keep-alive 32개", expression: "λ ≈ 재연결 수", result: "λ ≪ 470", reason: "요청 수와 연결 수가 분리되어 식의 왼쪽이 거의 0이 됩니다." },
            ]}
            conclusion="연결 재사용이 λ 자체를 줄여 가장 큰 여유를 만들고, 나머지 셋은 같은 짧은 연결 패턴을 유지한 채 상한만 올립니다."
            caveats={["tcp_tw_reuse 값은 timestamp 시각을 초 단위로 비교해서 생기는 대략값입니다.", "서버 쪽 TIME_WAIT 수, conntrack table, upstream의 accept 대기열은 이 상한과 별개로 다시 확인해야 합니다."]}
          />
          <div className={prose}>
            <p>쓰면 안 되는 처방이 둘 있습니다. tcp_tw_recycle은 NAT 뒤 여러 호스트의 timestamp가 섞이는 연결에서 이미 제대로 동작하지 않았고, timestamp offset이 연결마다 무작위가 된 뒤로는 모든 연결에서 깨져 Linux 4.12에서 삭제되었습니다. 오래된 블로그의 sysctl 목록에 남아 있어도 지금 커널에는 없습니다.</p>
            <p>SO_LINGER를 켜고 시간을 0으로 두면 close()가 FIN 대신 RST를 보내 TIME_WAIT를 건너뜁니다. 5절에서 본 두 보호가 함께 사라지고 상대는 정상 종료 대신 reset을 받습니다. 포트 수를 맞추려고 쓰는 수단이 아닙니다.</p>
            <p>bind()로 출발 IP를 먼저 정한 뒤 connect()하는 프로그램은 함정이 하나 더 있습니다. bind 시점에는 목적지를 모르므로 커널이 포트 하나를 통째로 잡아 4-tuple 재사용이 막힙니다. Cloudflare는 IP_BIND_ADDRESS_NO_PORT로 포트 선택을 connect 시점까지 미루라고 권합니다.</p>
          </div>
          {code("tw-unique", "tcp_tw_reuse 판정과 timestamp 조건")}
          {code("sysctl-doc-reuse", "커널 문서의 tcp_tw_reuse")}
          {code("sysctl-doc-ports", "포트 범위와 예약 포트 문서")}
          {code("linger-zero", "SO_LINGER 0이면 RST로 끝내는 분기")}
          <div id="linux-tw-recycle" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="torvalds/linux commit 4396e46 · tcp: remove tcp_tw_recycle (2017-03-15, v4.12에 포함)" citeKey={2} href="https://github.com/torvalds/linux/commit/4396e46187ca5070219b81773c4e65088dac50cc">
              <q>the tcp_tw_recycle is broken for all types of connections</q> 커밋 메시지는 NAT 뒤 연결에서 이미 깨져 있었고, 연결별 timestamp offset 무작위화 뒤 모든 연결에서 깨졌다고 적습니다. v4.11 문서에는 항목이 있고 v4.12 문서에는 없습니다.
            </CitationBlock>
          </div>
          <div id="cloudflare-ephemeral" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Marek Majkowski · How to stop running out of ephemeral ports and start to love long-lived connections · Cloudflare blog, 2022-02-02" citeKey={3} href="https://blog.cloudflare.com/how-to-stop-running-out-of-ephemeral-ports-and-start-to-love-long-lived-connections/">
              <q>This option tells the kernel to delay reserving the source port.</q> 글은 보통의 TCP connect()가 고갈되면 EADDRNOTAVAIL, bind-before-connect는 EADDRINUSE를 받는다고 정리합니다. 한 목적지로는 범위만큼 연결을 열 수 있고 목적지가 다르면 출발 포트를 다시 쓸 수 있다고 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="conntrack" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 중간에 NAT가 있으면 conntrack table이 세 번째 장부가 됩니다</h2>
          <div className={prose}>
            <p>클라이언트와 서버 사이에 netfilter NAT를 쓰는 호스트가 있으면, 그 호스트는 연결마다 conntrack 항목을 하나 만들어 주소 변환과 응답 경로를 기억합니다. Kubernetes Service와 SNAT가 이 장부를 쓰는 경로는 <a href="/cs/cloud/kubernetes-network-packet-path#mtu-egress">Kubernetes 패킷 경로의 MTU·SNAT·conntrack</a>에서 다뤘습니다. 장부의 크기가 RAM으로 정해지고 항목이 어느 netfilter 훅에서 만들어지는지는 <a href="/cs/cloud/linux-network-interface-route-netfilter-dns#conntrack">네트워크 기초 글의 conntrack 절</a>에 있습니다.</p>
            <p>이 장부에도 TIME_WAIT가 있지만 시간이 다릅니다. 커널 문서의 nf_conntrack_tcp_timeout_time_wait 기본값은 120초입니다. 600개/초면 항목 72,000개가 남습니다. 64비트에서 메모리가 4GiB를 넘으면 nf_conntrack_max 기본값은 262,144라서 아직 여유가 있습니다.</p>
            <p>같은 계산으로 초당 약 2,184개를 넘으면 120초 동안 쌓인 항목이 상한에 닿습니다. 커널은 먼저 같은 hash 칸의 확인되지 않은 항목을 지워 자리를 만들고, 못 만들면 새 연결의 packet을 버리며 dmesg에 'nf_conntrack: table full, dropping packet'을 찍습니다.</p>
            <p>이때 gc가 깨어나 개수가 상한의 95% 아래로 내려갈 때까지 TIME_WAIT·FIN_WAIT·CLOSE 같은 끝나 가는 TCP 항목을 지웁니다. 그래서 항목 대부분이 TIME_WAIT라면 버려짐은 짧게 몰렸다 풀리고, 상한이 단단한 벽이 되는 것은 ESTABLISHED처럼 지울 수 없는 항목이 table을 채웠을 때입니다. 어느 쪽이든 애플리케이션은 오류 대신 SYN 재전송으로 늦어진 응답을 봅니다.</p>
          </div>
          {code("conntrack-full", "table full이면 packet을 버리는 원문")}
          {code("conntrack-size", "메모리로 정하는 table 크기")}
          {code("conntrack-doc", "nf_conntrack_max 문서")}
        </section>

        <section id="triage" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 증상에서 어느 장부가 찼는지 명령 세 개로 가릅니다</h2>
          <div className={prose}>
            <p>면접에서 'SSH가 안 된다'나 '지연이 두 배'를 받으면 먼저 어느 쪽의 장부가 찼는지 가릅니다. 클라이언트에서 connect()가 오류로 끝나는지, 서버에서 응답이 늦는지가 첫 갈림길입니다.</p>
            <p>클라이언트에서 EADDRNOTAVAIL이 보이면 ss -tan state time-wait로 TIME_WAIT 소켓의 목적지 분포를 봅니다. 한 목적지에 28,000개 가까이 몰려 있으면 3절의 상황입니다. /proc/net/sockstat의 tw 값으로 전체 수를 빠르게 셀 수 있습니다. nstat의 TcpExtTCPTimeWaitOverflow가 늘고 있다면 tcp_max_tw_buckets에 닿아 TIME_WAIT를 건너뛰는 중입니다.</p>
            <p>서버에서 꼬리 지연이 늘었다면 ss -lnt로 LISTEN 소켓의 Recv-Q와 Send-Q를 봅니다. LISTEN 줄에서 Recv-Q는 지금 서 있는 연결 수, Send-Q는 상한입니다. 연결된 소켓 줄에서는 뜻이 다르므로 섞어 읽지 않습니다.</p>
            <p>nstat -az TcpExtListenOverflows TcpExtListenDrops TcpExtTCPReqQFullDoCookies는 누적 counter라서 두 번 찍어 차이를 봅니다. 늘고 있다면 9절의 상황입니다. dmesg에 'Possible SYN flooding'이나 'nf_conntrack: table full'이 있는지도 함께 봅니다.</p>
          </div>
          {code("listen-diag", "LISTEN 소켓의 Recv-Q·Send-Q 출처")}
          {code("snmp-names", "nstat counter 이름")}
          {code("somaxconn-init", "namespace별 somaxconn")}
          {code("sysctl-doc-listen", "somaxconn과 tcp_abort_on_overflow 문서")}
          {code("tcp-defaults", "TCP sysctl 기본값")}
          <div className={prose}>
            <p>이 글의 숫자는 모두 상수와 가정에서 손으로 계산한 값입니다. 실제 서버에서는 연결 수명, 서버가 먼저 끊는 프로토콜, load balancer의 연결 재사용, 컨테이너마다 따로인 network namespace 값이 결과를 바꿉니다. 측정은 위 명령으로 직접 합니다.</p>
            <p>
            sysctl을 바꾸기 전에 식의 어느 자리가 문제인지 먼저 정합니다. 연결을 너무 자주 여는 코드라면 pool이 답이고 목적지가 하나뿐이면 범위나 목적지를 늘립니다. 서버가
            accept()를 늦게 부르면 backlog보다 정지 원인을 먼저 고칩니다.
          </p>
          </div>
          <ContentBoundary article="linux-tcp-time-wait-ports-backlog" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>같은 클라이언트가 초당 400개만 연다면 포트가 바닥나나요? 서버가 먼저 끊는 HTTP/1.0 방식으로 바꾸면 TIME_WAIT는 어느 쪽에 생기고 클라이언트 포트는 어떻게 되나요? (답: 3절, 5절)</p>
            <p>tcp_fin_timeout을 60에서 10으로 내린 뒤 ss로 세어 본 TIME_WAIT 수가 줄지 않았습니다. 커널 소스의 어느 두 줄 때문인가요? 그렇다면 그 설정이 줄인 것은 무엇인가요? (답: 8절)</p>
            <p>listen(fd, 65535)를 부른 서버의 ss -lnt에서 Send-Q가 4096으로 보입니다. 왜 그런가요? Recv-Q가 4097이면 무엇이 일어나고 있나요? (답: 9절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={tcpTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
