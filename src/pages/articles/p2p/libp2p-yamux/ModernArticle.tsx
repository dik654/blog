import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { YamuxBackpressureViz, YamuxStackViz } from "./viz/ModernYamuxViz";
import FailureScopeViz from "./viz/FailureScopeViz";
import FrameWireViz from "./viz/FrameWireViz";
import StreamOpenViz from "./viz/StreamOpenViz";
import WindowLedgerViz from "./viz/WindowLedgerViz";

export default function ModernYamuxArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            rust-libp2p v0.57.1 · libp2p-yamux 0.48.0 · rust-yamux 0.14.0
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Yamux는 연결을 복제하지 않고 대화의 줄을 나눕니다
          </h2>
        </header>
        <p className="text-lg leading-8">
          한 문장으로 답하면, Yamux는 Noise가 보호하는 TCP 연결 하나에 번호표를 붙여
          여러 독립적인 byte stream처럼 쓰게 하는 multiplexer입니다. 한 stream의 수신
          창이 닫혀도 다른 stream은 자기 창으로 진행할 수 있지만, 모두 같은 TCP socket과
          connection poll loop를 공유하므로 연결 자체가 막히면 함께 멈춥니다.
        </p>
        <p>
          Alice가 Bob에게 <code>payroll-report-v1</code>을 요청한다고 하겠습니다. 같은
          connection에서 stream 1은 200 KiB block을 받고, stream 3은 작은 receipt를
          주고받습니다. 이 한 사례를 stream open→16 KiB DATA frame→application
          read→WINDOW_UPDATE→FIN 또는 RST까지 따라갑니다.
        </p>
        <p>
          TCP는 ordered byte connection, Noise는 실제 PeerId와 암호화, Yamux는 stream
          분리만 맡습니다. 열린 stream에서 어떤 application protocol을 쓸지는 다시
          합의해야 하고, 받은 payroll bytes가 맞는지는 CID·digest로 별도 검증해야 합니다.
        </p>
        <YamuxStackViz />
      </section>

      <section id="stream-open" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 한 stream이 생기는 순간</p>
          <h2 className="mt-2 text-2xl font-bold">
            SYN은 새 줄을 만들고 ACK는 상대가 그 줄을 보았다고 알립니다
          </h2>
        </header>
        <StreamOpenViz />
        <p>
          Client인 Alice는 홀수 stream ID, server인 Bob은 짝수 ID를 사용합니다. Alice가
          stream 1의 첫 DATA 또는 WINDOW_UPDATE에 SYN을 붙이면 Bob은 ACK나 RST로
          답합니다.
        </p>
        <p>
          Yamux는 reliable connection 위에 있으므로 Alice는 ACK를 기다리지 않고 첫
          request bytes를 함께 보낼 수 있습니다. 따라서 빠르지만, 이미 보낸 request가
          뒤늦은 RST로 거절될 수 있다는 점을 application이 처리해야 합니다.
        </p>
        <p>
          현재 rust-yamux는 ACK를 아직 받지 못한 outbound stream이 256개에 이르면 새
          stream open을 <code>Pending</code>으로 둡니다. 전체 동시 stream 기본 상한은
          512개입니다. 둘은 서로 다른 제한입니다. 256은 “아직 ACK 없는 급한 open”을
          누르는 값이고, 512는 connection이 보유하는 전체 stream 수의 기본 상한입니다.
        </p>
        <div id="paper-yamux-spec">
          <CitationBlock
            source="Yamux specification — commit 98ba9c9"
            citeKey={1}
            type="code"
            href="https://github.com/hashicorp/yamux/blob/98ba9c9ac60f4c45b2331377b50305798b41f611/spec.md"
          >
            <p><strong>문제:</strong> 하나의 ordered reliable connection에서 여러 논리 stream을 구분합니다.</p>
            <p><strong>기여:</strong> 12-byte header, stream ID, DATA·WINDOW_UPDATE·PING·GO_AWAY와 SYN·ACK·FIN·RST 의미를 정의합니다.</p>
            <p><strong>전제:</strong> 아래 transport가 순서와 신뢰성을 제공하고 양쪽이 <code>/yamux/1.0.0</code>을 합의합니다.</p>
            <p><strong>근거 범위:</strong> Wire frame, 256 KiB 초기 stream window와 stream·session control입니다.</p>
            <p><strong>말하지 않는 것:</strong> Peer 인증, application 권한, payload digest, durable receipt를 제공하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="stream-credit" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 읽어야 돌아오는 byte 쿠폰</p>
          <h2 className="mt-2 text-2xl font-bold">
            도착한 양이 아니라 application이 소비한 양만큼 credit가 돌아옵니다
          </h2>
        </header>
        <p>
          각 stream은 처음 256 KiB의 receive window를 갖습니다. DATA가 200 KiB 도착하면
          receiver의 남은 창은 56 KiB가 되지만, 그 200 KiB가 아직 application buffer에
          남아 있다면 새 credit를 바로 돌려주지 않습니다.
        </p>
        <p>
          Bob의 application이 실제로 읽어 buffer를 비워야 WINDOW_UPDATE 후보가 생깁니다.
          이것이 느린 reader를 그
          stream의 sender backpressure로 바꾸는 지점입니다.
        </p>
        <YamuxBackpressureViz />
        <WindowLedgerViz />
        <ExplainedFormula
          question="Receiver가 지금 돌려줄 WINDOW_UPDATE는 몇 byte일까요?"
          idea={<>지금까지 받은 byte에서 아직 application buffer에 남은 byte를 빼면 실제로 소비된 양입니다. 그 값이 현재 최대 창의 절반보다 작으면 frame을 자주 보내지 않기 위해 아직 update하지 않습니다.</>}
          formula={String.raw`U=(M-R)-B,\qquad U\ge M/2`}
          annotatedFormula={String.raw`\underbrace{U}_{\text{돌려줄 credit}}=(\underbrace{M}_{\text{최대 창}}-\underbrace{R}_{\text{남은 창}})-\underbrace{B}_{\text{아직 안 읽은 buffer}},\quad U\ge M/2`}
          operations={[
            {
              expression: String.raw`(M-R)-B`,
              annotation: ["받았지만 아직 읽지 않은 byte를", "소비된 byte로 잘못 세지 않습니다."],
            },
            {
              expression: String.raw`U\ge M/2`,
              annotation: ["최대 창의 절반 이상을 돌려줄 때만", "WINDOW_UPDATE를 보냅니다."],
            },
          ]}
          terms={[
            { symbol: "U", name: "window update", description: "Remote sender에게 새로 돌려줄 byte credit입니다." },
            { symbol: "M", name: "max receive window", description: "이 stream에 현재 허용한 최대 수신 창입니다." },
            { symbol: "R", name: "receive window", description: "Remote가 아직 사용하지 않은 수신 credit입니다." },
            { symbol: "B", name: "buffered bytes", description: "도착했지만 local application이 아직 읽지 않은 bytes입니다." },
          ]}
          assumptions={[
            "같은 stream과 같은 시점의 byte 장부를 사용합니다.",
            "아래 계산에서는 RTT 기반 자동 확대 조건이 충족되지 않았다고 둡니다.",
            "창은 전송 허가량이지 disk 저장 완료나 application receipt가 아닙니다.",
          ]}
          interpretation="200 KiB를 받은 뒤 72 KiB만 읽었다면 돌려줄 후보는 72 KiB입니다. 절반인 128 KiB보다 작으므로 아직 update하지 않습니다. 64 KiB를 더 읽으면 후보가 136 KiB가 되어 그때 credit를 돌려줍니다."
        />
        <CalculationWalkthrough
          title="숫자를 따라가는 stream 1 장부"
          question="200 KiB가 도착한 뒤 두 번 읽으면 왜 두 번째에만 update가 나갈까요?"
          scope="max window 256 KiB, receive window 56 KiB, 최초 buffer 200 KiB. 자동 window 확대는 제외합니다."
          steps={[
            {
              label: "첫 72 KiB를 읽습니다",
              expression: "buffer = 200 - 72",
              result: "128 KiB",
              reason: "도착한 byte 중 application이 아직 읽지 않은 양입니다.",
            },
            {
              label: "돌려줄 후보를 셉니다",
              expression: "(256 - 56) - 128",
              result: "72 KiB",
              reason: "받은 200 KiB에서 buffer에 남은 128 KiB를 뺍니다.",
            },
            {
              label: "절반 문턱과 비교합니다",
              expression: "72 < 256 / 2",
              result: "보내지 않음",
              reason: "작은 update frame을 너무 자주 보내지 않습니다.",
            },
            {
              label: "64 KiB를 더 읽습니다",
              expression: "buffer = 128 - 64",
              result: "64 KiB",
              reason: "누적해서 application이 136 KiB를 소비했습니다.",
            },
            {
              label: "다시 후보와 문턱을 비교합니다",
              expression: "(256 - 56) - 64 = 136 ≥ 128",
              result: "UPDATE 136 KiB",
              reason: "후보가 절반 문턱을 넘었으므로 remote credit를 복구합니다.",
            },
          ]}
          conclusion="Bob은 stream 1의 application이 실제로 읽은 누적 136 KiB만큼 Alice에게 새 credit를 돌려줍니다."
          caveats={[
            "RTT와 소비 속도가 빠르면 구현은 최대 stream window를 두 배로 늘릴 수 있습니다.",
            "기본 connection-wide 최대 receive-window 합계는 1 GiB지만 Yamux wire 규격에 별도 session window가 생기는 것은 아닙니다.",
          ]}
        />
        <p>
          현재 구현은 half-window를 2 RTT보다 빨리 소비하면 stream의 최대 창을 두 배로
          늘리려 합니다. 다만 모든 stream의 최대 receive window 합계에는 기본 1 GiB
          상한을 둡니다. 이것은 local memory 보호용 구현 한계이며, wire protocol의
          connection-level credit와 같은 개념이 아닙니다.
        </p>
        <div id="paper-rust-yamux-014-flow">
          <CitationBlock
            source="rust-yamux 0.14.0 — flow_control.rs · commit 4a53e4a"
            citeKey={2}
            type="code"
            href="https://github.com/libp2p/rust-yamux/blob/4a53e4af660e422a4852d24ceb8f512afeab9140/yamux/src/connection/stream/flow_control.rs"
          >
            <p><strong>문제:</strong> Slow reader에는 backpressure를 걸면서 높은 BDP 연결에서는 한 stream이 대역폭을 쓸 수 있어야 합니다.</p>
            <p><strong>기여:</strong> Application buffer를 뺀 OnRead update, half-window 문턱, RTT 기반 window auto-tuning과 connection-wide memory cap을 구현합니다.</p>
            <p><strong>전제:</strong> rust-yamux 0.14.0의 default config와 connection poll이 계속 진행됩니다.</p>
            <p><strong>근거 범위:</strong> Local receive/send credit 계산과 최대 window accounting입니다.</p>
            <p><strong>말하지 않는 것:</strong> 특정 처리량, 공정성, remote application 처리 완료를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="connection-poll" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 독립 stream과 공유 connection</p>
          <h2 className="mt-2 text-2xl font-bold">
            한 stream의 credit 정체는 격리되지만 socket 정체는 모두에게 번집니다
          </h2>
        </header>
        <FrameWireViz />
        <p>
          Stream 1의 send window가 0이어도 stream 3에 credit가 있으면 connection은 stream
          3의 frame을 보낼 수 있습니다. 현재 구현은 한 DATA payload를 기본 최대 16 KiB로
          쪼개므로 큰 write 하나가 매번 거대한 단일 frame으로 socket을 독점하지 않습니다.
          40 KiB write는 16+16+8 KiB처럼 여러 poll에 나뉩니다.
        </p>
        <p>
          그러나 두 stream의 frame은 결국 같은 ordered TCP byte stream으로 직렬화됩니다.
          TCP send buffer가 막히거나 connection의 <code>poll()</code>을 호출하지 않거나,
          connection I/O error가 나면 stream 3도 진행하지 못합니다. “stream별 flow control”을
          “물리적으로 완전히 분리된 연결”로 읽으면 안 되는 이유입니다.
        </p>
        <AlgorithmBlock
          title="rust-libp2p wrapper가 connection을 한 번 poll하는 순서"
          input={[
            "stream 1: payroll DATA와 read credit 상태",
            "stream 3: receipt DATA 상태",
            "shared Noise/TCP socket + inbound queue",
          ]}
          steps={[
            {
              code: "poll_inner() → rust-yamux Connection::poll_next_inbound()",
              note: "새 inbound stream을 찾는 호출이 기존 stream frame과 socket 진행도 함께 움직입니다.",
            },
            {
              code: "privilege pending PONG / GO_AWAY, then pending stream frame",
              note: "Control frame과 이미 대기 중인 frame을 shared socket에 기록합니다.",
            },
            {
              code: "poll one StreamCommand from all live streams",
              note: "Credit가 있는 sibling stream은 자기 DATA나 FIN을 connection에 제출할 수 있습니다.",
            },
            {
              code: "read and dispatch one inbound frame by stream_id",
              note: "DATA·WINDOW_UPDATE·RST를 해당 stream state에 반영하고 reader/writer를 깨웁니다.",
            },
            {
              code: "if a new inbound stream appears: queue it, or drop when queue ≥ 256",
              note: "Wrapper의 임시 queue가 무한히 늘지 않도록 하고 caller를 다시 깨웁니다.",
            },
          ]}
          output="기존 streams 한 단계 진행 + 선택적으로 새 inbound Stream 또는 connection error"
          repeatUntil="connection이 Pending이면 등록된 waker가 깨울 때 다시 poll하고, close 시 모든 sibling stream의 failure scope를 정리합니다."
        />
        <div id="paper-rust-libp2p-yamux-048">
          <CitationBlock
            source="libp2p-yamux 0.48.0 — commit 2fed78f"
            citeKey={3}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/blob/2fed78f/muxers/yamux/src/lib.rs"
          >
            <p><strong>문제:</strong> rust-yamux connection을 libp2p의 poll 기반 StreamMuxer 계약에 맞추고 slow inbound consumer 앞의 queue를 제한합니다.</p>
            <p><strong>기여:</strong> <code>/yamux/1.0.0</code> upgrade, inbound/outbound/close adapter와 256-entry 임시 inbound queue를 구현합니다.</p>
            <p><strong>전제:</strong> rust-libp2p v0.57.1, libp2p-yamux 0.48.0, rust-yamux 0.14.0을 고정합니다.</p>
            <p><strong>근거 범위:</strong> Wrapper polling, local buffering, config 노출과 error mapping입니다.</p>
            <p><strong>말하지 않는 것:</strong> 256개 remote 처리 보장, 공정한 stream scheduling, end-to-end receipt를 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-libp2p-streammuxer">
          <CitationBlock
            source="rust-libp2p v0.57.1 — StreamMuxer contract · commit 2fed78f"
            citeKey={4}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/blob/2fed78f/core/src/muxing.rs"
          >
            <p><strong>문제:</strong> 여러 multiplexer의 inbound·outbound stream과 connection 진행을 같은 API로 다룹니다.</p>
            <p><strong>기여:</strong> <code>poll_inbound</code>, <code>poll_outbound</code>, unconditional <code>poll</code>과 graceful <code>poll_close</code> 계약을 정의합니다.</p>
            <p><strong>전제:</strong> Caller가 connection <code>poll</code>을 계속 호출하고 각 stream의 protocol을 별도 협상합니다.</p>
            <p><strong>근거 범위:</strong> Connection-local substream lifecycle과 caller·muxer ownership입니다.</p>
            <p><strong>말하지 않는 것:</strong> Remote handler 성공, exactly-once 처리, file correctness를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 실패 범위와 release</p>
          <h2 className="mt-2 text-2xl font-bold">
            RST는 한 줄을 버리고 GO_AWAY·I/O error는 연결 전체를 닫습니다
          </h2>
        </header>
        <FailureScopeViz />
        <p>
          Stream 1의 RST는 그 request와 partial payroll buffer만 실패시킵니다. Stream 3은
          connection이 건강하고 자기 credit가 남아 있으면 계속 진행할 수 있습니다. 반면
          GO_AWAY나 TCP·Noise I/O error는 connection의 모든 sibling stream을 깨웁니다.
          같은 PeerId의 in-flight request 전체를 재분류해야 합니다.
        </p>
        <p>
          FIN은 한 방향만 닫는 half-close입니다. 양쪽 FIN이 모여야 stream이 완전히 닫힙니다.
          <code>poll_flush</code> 성공은 local command queue를 밀었다는 뜻이지 Bob의 handler가
          payroll을 저장했다는 영수증이 아닙니다.
        </p>
        <p>
          최종 release gate는 expected PeerId,
          application protocol, requested range, byte count, CID·digest와 application receipt를
          함께 확인해야 합니다.
        </p>
        <div>
          <p>Release test는 다음 경계를 따로 재현합니다.</p>
          <ul className="mt-3 space-y-2 pl-5 text-sm leading-6">
            <li>Stream 1의 reader가 느릴 때 stream 3이 계속 진행하는지 봅니다.</li>
            <li>공유 socket이 막히면 두 stream이 함께 멈추는지 봅니다.</li>
            <li>256-entry inbound wrapper queue와 256 ACK backlog를 각각 넘겨 봅니다.</li>
            <li>512 total stream limit, RST, FIN, GO_AWAY, I/O error를 각각 분리합니다.</li>
          </ul>
          <p className="mt-3">결과에는 stream ID, protocol, bytes read, window update, close reason, digest와 retry count를 남깁니다.</p>
        </div>
        <h3 className="text-xl font-semibold">읽고 나면 답해야 할 질문</h3>
        <p>
          “느린 stream 하나가 왜 sibling을 항상 막지는 않는가?”, “그런데 왜 TCP socket이
          막히면 함께 멈추는가?”, “256 KiB·256개·512개·1 GiB는 각각 무엇의 한계인가?”,
          “flush와 remote receipt는 왜 다른가?”를 같은 payroll 사례로 설명할 수 있어야 합니다.
        </p>
      </section>
    </article>
  );
}
