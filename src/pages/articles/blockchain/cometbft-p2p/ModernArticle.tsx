import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosCoreLocator, { CosmosCoreMapReturn } from "../CosmosCoreLocator";
import P2PTransactionTraceViz from "./viz/P2PTransactionTraceViz";
import { codeRefs } from "./codeRefs";
import { cometbftP2PTree } from "./fileTrees";

const sourceCommit = "0880b4d378f347ab16e54ec677ff50d803f37d62";

export default function ModernCometBFTP2PArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosCoreLocator
            currentSlug="cometbft-p2p"
            region="peer 연결부터 transaction admission 직전까지"
            question="alice→bob 10 transaction이 다른 node의 CheckTx에 닿을 때, 각 P2P 계층의 성공은 정확히 무엇을 뜻할까요?"
          />
          <h2 className="mb-6 text-2xl font-bold">한 transaction을 socket에서 remote CheckTx까지 따라갑니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              보내는 node의 mempool에 <code>alice→bob 10</code> transaction이 있다고 하겠습니다. Mempool Reactor는 이 bytes를
              channel <code>0x30</code>의 <code>Txs</code> message로 감싸 peer에 보냅니다. Remote node는 packet을 다시 message로
              조립하고 같은 channel의 Reactor에 전달한 뒤 transaction마다 <code>CheckTx</code>를 호출합니다.
            </p>
            <p className="text-lg leading-8">
              이 과정에는 연결 인증, local queue 수용, socket 전송, message decode와 transaction admission이라는 서로 다른 성공이
              있습니다. 어느 하나도 block 포함이나 consensus Commit을 뜻하지 않습니다.
            </p>
            <p>
              이 글은 CometBFT v0.40.0의 legacy P2P stack에서 한 message가 지나가는 경로만 다룹니다. CheckTx 뒤의 mempool 상태와
              proposal 선택은 <Link to="/cs/blockchain/cometbft-mempool#overview">다음 mempool 글</Link>에서 이어집니다.
            </p>
          </div>
          <ContentBoundary article="cometbft-p2p" />
          <P2PTransactionTraceViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>네 성공은 서로 다른 영수증입니다</h3>
            <ul>
              <li>Handshake 성공은 remote public key와 NodeInfo가 호환된다는 뜻입니다.</li>
              <li>Send 성공은 local channel queue가 protobuf bytes를 받았다는 뜻입니다.</li>
              <li>Receive 성공은 packet이 완성 message로 조립되고 protocol owner에게 전달됐다는 뜻입니다.</li>
              <li>CheckTx 성공은 remote node의 현재 mempool 규칙에서 local admission을 통과했다는 뜻입니다.</li>
            </ul>
            <p>
              이 네 단계를 “transaction 전송 성공” 하나로 부르면 어느 상태까지 진행됐는지 알 수 없습니다. 각 영수증의 owner와 다음
              실패 가능 구간을 따로 봐야 합니다.
            </p>
            <h3>코드는 tag 이름보다 content commit을 기준으로 읽습니다</h3>
            <p>
              <code>v0.40.0</code> annotated tag가 가리키는 content commit은 <code>{sourceCommit}</code>입니다. 아래 코드 패널은 이
              commit의 <code>p2p/transport.go</code>, <code>p2p/conn/connection.go</code>, <code>p2p/peer.go</code>,
              <code>p2p/switch.go</code>와 <code>mempool/reactor.go</code>에서 제어 흐름을 발췌했습니다.
            </p>
          </div>
        </section>

        <section id="mconnection" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Send가 true여도 remote node는 아직 아무것도 확인하지 않았습니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>Peer.Send</code>는 peer가 실행 중인지, handshake에서 상대가 channel 0x30을 지원한다고 밝혔는지 확인합니다. 이어
              wrapper message를 protobuf bytes로 직렬화해 <code>MConnection.Send</code>에 넘깁니다.
            </p>
            <p>
              MConnection은 channel별 bounded queue를 가집니다. <code>Send</code>는 queue에 자리가 생길 때까지 제한된 시간 기다리고,
              <code>TrySend</code>는 자리가 없으면 즉시 false를 반환합니다. True는 enqueue receipt이며 socket write나 remote ack가
              아닙니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Peer.Send와 queue 원문" onClick={() => sidebar.open("send-queue", codeRefs["send-queue"])} />
          </div>

          <ExplainedFormula
            question="Consensus와 mempool channel이 동시에 밀려오면 다음 packet은 어디에서 고릅니까?"
            idea={<>Pending channel마다 최근 실제 framing bytes를 priority로 나눈 비용을 비교합니다. 과거 전송량은 주기적으로 줄어들어 오래된 traffic이 선택을 계속 막지 않습니다.</>}
            formula={String.raw`i^*=\arg\min_i\frac{R_i}{p_i},\qquad R_{i^*}\leftarrow R_{i^*}+n,\qquad R_i\leftarrow0.8R_i`}
            annotatedFormula={String.raw`i^*=\arg\min_i\underbrace{\frac{R_i}{p_i}}_{\text{정규화한 최근 전송량}},\quad \underbrace{R_{i^*}\leftarrow R_{i^*}+n}_{\text{이번 framing bytes}},\quad \underbrace{R_i\leftarrow0.8R_i}_{\text{주기적 감쇠}}`}
            operations={[
              { expression: String.raw`R_i/p_i`, annotation: ["consensus 2000/10=200", "mempool 600/5=120", "이 순간에는 mempool 선택"] },
              { expression: String.raw`R_{i^*}+n`, annotation: ["mempool이 400 bytes를 보내면", "R=1000, ratio=200", "다음 선택에서 다시 경쟁"] },
              { expression: String.raw`0.8R_i`, annotation: ["updateStats가 과거 전송량 감쇠", "상대적 weight 유지", "절대 latency 예약은 아님"] },
            ]}
            terms={[
              { symbol: "i*", name: "Selected channel", description: "이번 PacketMsg를 만들 pending channel입니다." },
              { symbol: "R_i", name: "Recently sent", description: "Channel i가 최근 보낸 framing bytes의 감쇠 누적값입니다." },
              { symbol: "p_i", name: "Priority", description: "ChannelDescriptor에 적힌 양수 weight입니다." },
              { symbol: "n", name: "Written bytes", description: "Proto writer가 이번 PacketMsg에 기록한 실제 bytes입니다." },
            ]}
            assumptions={[
              "Queue가 비어 있는 channel은 선택 후보가 아닙니다.",
              "비율이 같으면 channels slice에서 먼저 만난 pending channel이 남습니다.",
              "Priority는 같은 connection 안의 상대적 선택 weight이며 대역폭이나 p99 지연 보장이 아닙니다.",
              "Socket rate limit과 remote Reactor 처리 시간은 이 식 밖의 병목입니다.",
            ]}
            interpretation="Priority가 낮아도 최근에 덜 보낸 channel은 다음 packet을 먼저 보낼 수 있습니다. 반대로 priority를 높여도 느린 socket이나 remote handler는 빨라지지 않습니다."
          />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>큰 message는 channel ID를 유지한 여러 packet으로 나뉩니다</h3>
            <p>
              선택된 channel은 message를 <code>MaxPacketMsgPayloadSize</code>만큼 잘라 <code>PacketMsg</code>로 씁니다. 마지막 조각만
              <code>EOF=true</code>입니다. Remote channel은 조각을 순서대로 붙이며 누적 크기가 <code>RecvMessageCapacity</code>를
              넘으면 connection 오류로 중단합니다.
            </p>
            <p>
              Packet EOF는 protobuf message 하나가 완성됐다는 표시입니다. Transaction이 유효하거나 mempool에 수용됐다는 표시는
              아닙니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Channel 선택과 packet 분할 원문" onClick={() => sidebar.open("schedule-packet", codeRefs["schedule-packet"])} />
          </div>
          <div id="paper-cometbft-p2p-connection-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · p2p/conn/connection.go" citeKey={1} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/p2p/conn/connection.go`}>
              <p><strong>문제:</strong> 한 peer connection에서 여러 protocol message를 bounded channel queue와 packet으로 운반합니다.</p>
              <p><strong>기여:</strong> Send·TrySend, weighted scheduler, packet 분할·재조립과 receive capacity 실패를 구현합니다.</p>
              <p><strong>전제:</strong> v0.40.0 legacy MConnection과 ordered TCP stream, 등록된 ChannelDescriptor를 사용합니다.</p>
              <p><strong>근거 범위:</strong> Local queue admission, channel scheduling과 connection-level I/O입니다.</p>
              <p><strong>말하지 않는 것:</strong> Remote Reactor 처리, CheckTx 성공이나 consensus Commit을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="switch" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Channel ID 하나에는 protocol owner가 하나만 있습니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Node 시작 시 Switch는 각 Reactor의 <code>GetChannels</code>를 읽습니다. Channel 0x30에는 mempool Reactor와
              <code>protomem.Message</code> type을 연결합니다. 다른 Reactor가 같은 ID를 등록하면 어느 parser가 bytes를 소유하는지
              모호해지므로 panic합니다.
            </p>
            <p>
              TCP 연결은 먼저 SecretConnection으로 올라가 remote public key를 인증합니다. 양쪽은 NodeInfo를 동시에 교환하고, 인증된
              ID와 self-reported ID, network와 version compatibility를 대조합니다. 이 handshake는 peer identity와 capability를
              확인할 뿐 transaction 내용은 보지 않습니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Channel owner 등록 원문" onClick={() => sidebar.open("channel-owner", codeRefs["channel-owner"])} />
            <CodeViewButton label="연결 인증 원문" onClick={() => sidebar.open("transport-handshake", codeRefs["transport-handshake"])} />
            <CodeViewButton label="Peer 시작 순서 원문" onClick={() => sidebar.open("peer-lifecycle", codeRefs["peer-lifecycle"])} />
          </div>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>Message owner lookup은 Switch가 만든 map을 사용합니다</h3>
            <p>
              완성된 bytes가 도착하면 peer의 <code>onReceive</code> callback이 channel ID로 Reactor와 message prototype을 찾습니다. 선택적
              <code>MsgBytesFilter</code>가 raw bytes를 먼저 검사하고, protobuf unmarshal과 wrapper 해제 뒤 source peer를 포함한
              <code>Envelope</code>를 <code>Reactor.Receive</code>에 넘깁니다.
            </p>
            <p>
              이 Receive 호출은 MConnection의 같은 <code>recvRoutine</code>에서 실행됩니다. 따라서 Reactor가 오래 멈추면 그 peer
              connection의 다음 packet read도 멈춥니다. 다른 peer는 별도 MConnection routine을 가지지만 같은 peer의 다른 channel은 이
              지연을 공유합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="재조립과 Reactor dispatch 원문" onClick={() => sidebar.open("receive-dispatch", codeRefs["receive-dispatch"])} />
          </div>
        </section>

        <section id="reactor" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Mempool Reactor에서 처음 transaction의 의미를 판단합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Mempool Reactor는 channel 0x30, priority 5, 최대 receive message 크기와 wrapper type을 선언합니다. Receive는 node가 state
              sync 중이면 message를 무시하고, 빈 <code>Txs</code> batch를 거절합니다. 그다음 source peer ID를 <code>TxInfo</code>에 넣어
              transaction마다 <code>mempool.CheckTx</code>를 호출합니다.
            </p>
            <p>
              CheckTx 오류는 cache 중복, mempool full과 application 거절로 나눠 기록합니다. Invalid transaction 한 건은 transport framing
              오류가 아니므로 곧바로 peer connection을 끊는 조건과 같지 않습니다. 반면 mempool channel에서 전혀 다른 message type을
              받으면 protocol violation으로 peer를 중지합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Mempool Receive와 CheckTx 원문" onClick={() => sidebar.open("mempool-receive", codeRefs["mempool-receive"])} />
          </div>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>수용된 transaction도 아직 block에 들어간 것은 아닙니다</h3>
            <p>
              Peer별 <code>broadcastTxRoutine</code>은 sender에게 같은 transaction을 되돌려 보내지 않고 다른 peer에 전파합니다. Peer가
              뒤처졌거나 Send queue가 가득 차면 기다렸다가 다시 시도할 수 있습니다. 이 gossip 결과와 block proposal 선택, consensus
              Commit은 각각 다음 상태 전이입니다.
            </p>
            <h3>실패는 멈춘 계층에 따라 다르게 처리됩니다</h3>
            <ul>
              <li>Queue가 가득 차면 TrySend는 false이고 Send는 timeout 뒤 false입니다. Caller가 retry·drop을 결정합니다.</li>
              <li>알 수 없는 channel, receive capacity 초과와 protobuf decode 오류는 connection을 중지하고 peer error로 올립니다.</li>
              <li>Raw-byte filter 거절도 같은 connection 오류 경로로 올라가 해당 peer를 제거합니다.</li>
              <li>CheckTx 거절은 transaction admission 실패이며 framing이 정상이라면 다른 message 수신을 계속할 수 있습니다.</li>
              <li>Persistent peer reconnect는 새 연결을 다시 시도할 뿐 message delivery나 consensus progress를 복구했다고 증명하지 않습니다.</li>
            </ul>
          </div>

          <div id="paper-cometbft-p2p-switch-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · transport.go · peer.go · switch.go · mempool/reactor.go" citeKey={2} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/p2p/peer.go`}>
              <p><strong>문제:</strong> 인증된 peer의 channel message를 유일한 protocol owner에게 전달하고 transaction admission까지 연결합니다.</p>
              <p><strong>기여:</strong> SecretConnection·NodeInfo handshake, unique channel ownership, filter·decode·dispatch와 Mempool CheckTx 경로를 구현합니다.</p>
              <p><strong>전제:</strong> v0.40.0 legacy transport와 Switch·Reactor 구성이 같은 channel descriptor를 공유합니다.</p>
              <p><strong>근거 범위:</strong> Node-local peer lifecycle과 inbound mempool message의 처리 경계입니다.</p>
              <p><strong>말하지 않는 것:</strong> Internet reachability, 악성 peer 완전 탐지, block 포함이나 BFT safety·liveness를 단독으로 보장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>이 글만으로 확인할 질문</h3>
            <ol>
              <li>Handshake 성공과 CheckTx 성공이 확인하는 사실을 각각 설명할 수 있습니까?</li>
              <li>Peer.Send가 true인데 remote node가 transaction을 받지 못할 수 있는 구간을 찾을 수 있습니까?</li>
              <li>Priority가 높은 channel이 항상 먼저 선택되거나 낮은 p99를 보장하지 않는 이유를 계산할 수 있습니까?</li>
              <li>EOF=true와 CheckTx 성공이 서로 다른 영수증인 이유를 설명할 수 있습니까?</li>
              <li>느린 Reactor가 같은 peer connection의 다른 channel까지 늦출 수 있는 호출 위치를 찾을 수 있습니까?</li>
              <li>Queue full, malformed message와 invalid transaction이 서로 다른 실패 경로인 이유를 구분할 수 있습니까?</li>
            </ol>
          </div>
        </section>

        <CosmosCoreMapReturn
          currentSlug="cometbft-p2p"
          closure="CometBFT P2P는 peer identity와 channel owner를 먼저 확정한 뒤 bounded queue와 weighted packet 전송으로 bytes를 옮깁니다. Remote node는 message를 재조립·filter·decode해 Reactor에 전달하며, mempool CheckTx에서 처음 transaction admission을 판정합니다. 각 단계의 성공은 block 포함이나 Commit과 다릅니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftP2PTree }}
        projectMetas={{
          cometbft: {
            id: "cometbft",
            label: "CometBFT · Go",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
