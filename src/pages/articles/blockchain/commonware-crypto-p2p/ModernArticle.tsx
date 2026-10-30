import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import CommonwareP2PLocator, { CommonwareP2PMapReturn } from "./CommonwareP2PLocator";
import { codeRefs } from "./codeRefs";
import { commonwareP2PTree } from "./fileTrees";
import {
  CommonwareChannelCapacityViz,
  CommonwareHandshakeViz,
  CommonwareP2PBoundaryViz,
  CommonwareP2PFlowViz,
} from "./viz/ModernCommonwareP2PViz";

export default function ModernCommonwareCryptoP2PArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <CommonwareP2PLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            Alice가 보낸 bytes는 언제 Bob의 Application이 받은 message가 됩니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            Alice가 Bob에게 channel 7로 한 payload를 보낸다고 가정하겠습니다. 이 payload를 글 안에서만 <code>m7</code>이라고 부릅니다. <code>m7</code>은 protocol field나 실제 message ID가 아니라, 같은 bytes가 어느 process와 queue에 있는지 놓치지 않기 위한 설명용 이름입니다.
          </p>
        </div>
        <CommonwareP2PFlowViz />
        <p className="text-lg leading-8">
          <strong>Alice의 send 결과는 Bob의 수신 확인이 아닙니다.</strong> Alice 쪽 rate check와 router mailbox가 요청을 받아도, 연결된 relay 선택, encrypted stream, Bob의 decode·channel 검사·rate limit과 bounded inbox가 남아 있습니다. Bob의 <code>Receiver</code>가 <code>(Alice public key, m7 bytes)</code>를 반환해야 Bob process 안의 receipt가 생깁니다.
        </p>
        <p>
          이 글은 Commonware <code>v2026.9.0</code>의 authenticated P2P와 encrypted stream 경로만 다룹니다. Message를 합의 순서로 확정하는 일, disk에 durable하게 기록하는 일과 payload의 업무 권한을 승인하는 일은 다른 계층의 책임입니다. Diffie–Hellman과 authenticated transcript의 일반 원리는 <Link to="/cs/crypto/diffie-hellman#authenticated-transcript" className="font-bold text-primary hover:underline">DH 정본</Link>에서 이어 읽을 수 있습니다.
        </p>
        <ContentBoundary article="commonware-crypto-p2p" />
      </section>

      <section id="handshake" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Bob은 허용한 identity와 같은 session key를 확인한 뒤에만 연결을 엽니다</h2>
        <CommonwareHandshakeViz />
        <p>
          Listener는 상대의 static public key를 먼저 읽고 bouncer에 넘깁니다. 허용된 peer라면 Syn을 읽습니다.
        </p>
        <p>
          Syn과 SynAck의 transcript에는 namespace, dialer·listener 역할, 양쪽 identity, timestamp, ephemeral public keys와 shared secret이 순서대로 결합됩니다. 각자의 long-term key signature와 양방향 confirmation이 모두 맞아야 cipher를 반환합니다.
        </p>
        <p>
          Timestamp는 현재 시각에서 <code>max_handshake_age</code>를 뺀 하한부터 <code>synchrony_bound</code>를 더한 상한 직전까지 허용합니다. 너무 오래됐거나 지나치게 미래인 handshake는 signature가 맞아도 거절합니다. 전체 handshake에는 별도 timeout도 적용됩니다.
        </p>
        <ExplainedFormula
          question="상대가 보낸 handshake 시각이 허용 범위에 있는지 어떻게 판단합니까?"
          idea={<>현재 시각에서 오래된 handshake의 최대 나이를 빼고, 허용할 clock 차이를 더해 half-open range를 만듭니다.</>}
          formula={String.raw`t_{now}-a_{max}\le t_{peer}<t_{now}+s`}
          annotatedFormula={String.raw`\underbrace{t_{now}-a_{max}}_{\text{오래된 요청 하한}}\le\underbrace{t_{peer}}_{\text{서명된 상대 시각}}<\underbrace{t_{now}+s}_{\text{미래 시각 상한}}`}
          operations={[
            { expression: String.raw`t_{min}=t_{now}-a_{max}`, annotation: ["현재 시각에서 max handshake age를 빼", "replay 허용 구간의 하한을 만듭니다."] },
            { expression: String.raw`t_{max}=t_{now}+s`, annotation: ["synchrony bound만큼 미래를 허용하되", "상한 자체는 포함하지 않습니다."] },
            { expression: String.raw`t_{peer}\in[t_{min},t_{max})`, annotation: ["두 조건을 모두 만족할 때만", "signature와 confirmation 검증을 계속합니다."] },
          ]}
          terms={[
            { symbol: "t_now", name: "현재 시각", description: "Runtime Clock에서 얻은 현재 millisecond 시각입니다." },
            { symbol: "a_max", name: "최대 handshake age", description: "이보다 오래된 handshake를 거절하는 정책값입니다." },
            { symbol: "s", name: "synchrony bound", description: "상대 clock이 미래로 앞설 수 있다고 허용하는 범위입니다." },
            { symbol: "t_peer", name: "상대 시각", description: "Syn 또는 SynAck transcript에 포함되고 signature로 인증된 값입니다." },
          ]}
          assumptions={[
            "모든 값은 같은 millisecond 단위와 clock convention을 사용합니다.",
            "Timestamp 검사는 identity signature와 key confirmation을 대신하지 않습니다.",
            "시간 범위를 넓히면 연결 성공 가능성뿐 아니라 허용하는 replay window도 커집니다.",
          ]}
          interpretation="현재 시각 100,000ms, max age 5,000ms, synchrony bound 2,000ms라면 [95,000, 102,000)ms만 통과합니다. 102,000ms는 상한이라 거절됩니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Syn·SynAck·Ack 코드" onClick={() => sidebar.open("handshake-flow", codeRefs["handshake-flow"])} />
          <CodeViewButton label="Encrypted listener 코드" onClick={() => sidebar.open("encrypted-listener", codeRefs["encrypted-listener"])} />
        </div>
      </section>

      <section id="local-submission" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Alice의 send는 local queue에 넣는 단계까지만 확인합니다</h2>
        <p>
          Channel sender는 message size를 검사하고 recipient별 rate limiter를 확인한 뒤, channel과 payload를 한 번 encode하여 shared router mailbox에 넣습니다. 모든 recipient가 현재 rate-limited이면 <code>check</code>는 가장 이른 재시도 시각을 돌려주고, 기본 <code>Sender::send</code> 경로는 실제로 시도한 recipient 목록과 local admission 결과를 기준으로 끝납니다.
        </p>
        <p>
          Router가 시작되기 전에는 연결된 peer가 없으므로 ingress가 <code>Feedback::Ok</code>를 반환하면서도 frame을 만들거나 enqueue하지 않습니다. Router가 시작된 뒤에도 현재 연결된 recipient만 relay를 찾습니다. Relay의 high·low queue 결과는 router actor 안에서 소비되므로 최초 caller는 Bob receipt를 받지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Router·relay 전달 코드" onClick={() => sidebar.open("delivery-path", codeRefs["delivery-path"])} />
        </div>
      </section>

      <section id="channel-quota" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Bob의 channel inbox는 모든 peer의 burst를 합친 bounded queue입니다</h2>
        <CommonwareChannelCapacityViz />
        <p>
          <code>register(channel, quota)</code>는 그 channel의 sender와 receiver를 만들고 <code>max_peers × burst_size</code>를 inbound mailbox 용량으로 사용합니다. Sender clone들은 outbound quota를 공유하며 recipient별로 따로 소비합니다.
        </p>
        <p>
          반대로 Bob의 한 channel receiver에는 허용된 모든 peer가 들어옵니다. 따라서 slow Application 하나가 전체 inbox를 채울 수 있습니다.
        </p>
        <p>
          Peer actor는 복호화한 frame을 decode하고 channel이 등록돼 있는지 검사합니다. 그 peer에 적용되는 receive rate가 찼으면 허용 시각까지 기다립니다. 그 뒤 inbound mailbox에는 blocking 없이 enqueue하고 결과를 기다리지 않습니다. Queue가 가득 차면 이미 들어 있던 message를 유지하고 새 도착을 버려 connection의 ping과 다른 channel 처리를 막지 않습니다.
        </p>
        <ExplainedFormula
          question="Channel 하나의 inbound mailbox 용량은 어떻게 계산합니까?"
          idea={<>허용할 수 있는 각 peer가 quota burst만큼 한꺼번에 보낼 수 있다고 보고 두 값을 곱합니다.</>}
          formula={String.raw`C_{in}=P_{max}\times B`}
          annotatedFormula={String.raw`\underbrace{C_{in}}_{\text{channel inbox capacity}}=\underbrace{P_{max}}_{\text{허용 peer 수}}\times\underbrace{B}_{\text{peer별 burst size}}`}
          operations={[
            { expression: String.raw`P_{max}=2,\ B=2`, annotation: ["공식 test가 사용하는 두 값입니다."] },
            { expression: String.raw`C_{in}=2\times2=4`, annotation: ["네 건까지 accepted가 되고", "다섯 번째 새 도착은 Rejected입니다."] },
          ]}
          terms={[
            { symbol: "C_in", name: "inbound capacity", description: "등록 channel 하나의 node-local bounded mailbox 크기입니다." },
            { symbol: "P_max", name: "maximum peers", description: "Network가 동시에 허용하는 peer 수의 상한입니다." },
            { symbol: "B", name: "burst size", description: "Channel quota가 peer 한 명에게 순간적으로 허용하는 message 수입니다." },
          ]}
          assumptions={[
            "공식 구현의 register 계산과 overflow test를 그대로 읽은 식입니다.",
            "Queue capacity는 remote acknowledgement나 처리 완료 건수가 아닙니다.",
            "Application이 dequeue하지 않으면 네 칸은 계속 찬 상태로 남을 수 있습니다.",
          ]}
          interpretation="max_peers=2와 burst_size=2이면 네 건까지 queue에 남길 수 있습니다. 다섯 번째 enqueue가 Rejected라는 사실은 기존 네 건이 제거됐다는 뜻이 아니라 새 도착만 처리되지 않았다는 뜻입니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Channel register·overflow 코드" onClick={() => sidebar.open("channel-registration", codeRefs["channel-registration"])} />
        </div>
      </section>

      <section id="bob-receipt" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Receiver가 Alice의 key와 bytes를 함께 반환할 때 Bob receipt가 생깁니다</h2>
        <p>
          Encrypted receiver는 AEAD tag와 counter를 사용해 frame을 복호화합니다. Counter는 순서대로 증가하므로 decrypt가 한 번 실패하면 같은 connection에서 counter를 되돌려 재동기화하지 않습니다. Peer actor가 종료되고 새 handshake로 connection을 다시 만드는 편이 경계를 분명하게 유지합니다.
        </p>
        <p>
          최종 channel receiver는 <code>(sender public key, decrypted bytes)</code>를 반환합니다. 따라서 Bob Application은 누가 보냈는지와 payload를 함께 얻습니다. 그러나 peer identity가 알려졌다는 사실만으로 payload schema, message-level signature, operation idempotency와 저장 성공이 확인되는 것은 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Bob decode·inbox 코드" onClick={() => sidebar.open("delivery-path", codeRefs["delivery-path"])} />
          <CodeViewButton label="Receiver 반환 코드" onClick={() => sidebar.open("channel-registration", codeRefs["channel-registration"])} />
        </div>
      </section>

      <section id="failure-boundaries" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패는 멈춘 경계에 따라 서로 다른 상태를 남깁니다</h2>
        <CommonwareP2PBoundaryViz />
        <p>
          Wrong identity, 오래된 timestamp, signature·confirmation 불일치와 AEAD 오류는 session 실패입니다. Alice의 rate limit과 router mailbox overflow는 local submission 실패입니다.
        </p>
        <p>
          Offline recipient와 relay queue overflow는 그 뒤의 delivery 실패지만 caller가 remote acknowledgement로 확인하는 구조는 아닙니다. Bob의 미등록 channel과 decode 오류는 peer actor를 끝낼 수 있고, full inbound inbox는 새 message만 drop합니다.
        </p>
        <p>
          이 차이 때문에 retry를 하나의 성공 boolean으로 설계할 수 없습니다. Application이 end-to-end 확인을 원한다면 message 안에 operation ID를 두고 Bob이 별도 response를 보내도록 protocol을 만들어야 합니다. 그 response도 다시 같은 P2P 경로를 지나므로 duplicate 처리와 timeout은 Application 책임으로 남습니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 버전 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px lg:grid-cols-3">
          <div id="paper-commonware-handshake-v2026">
            <CitationBlock source="Commonware handshake source · v2026.9.0 · d476a236" citeKey={1} type="code" href="https://github.com/commonwarexyz/monorepo/blob/d476a2361ce6840d2b9d0aa6fb30a924429046d4/cryptography/src/handshake.rs">
              <p><strong>확인한 것:</strong> Syn·SynAck·Ack transcript, timestamp range, signatures, confirmations와 방향별 ciphers입니다.</p>
              <p><strong>말하지 않는 것:</strong> Application authorization, payload correctness와 durable delivery를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-commonware-encrypted-v2026">
            <CitationBlock source="Commonware encrypted stream · v2026.9.0 · d476a236" citeKey={2} type="code" href="https://github.com/commonwarexyz/monorepo/blob/d476a2361ce6840d2b9d0aa6fb30a924429046d4/stream/src/encrypted.rs">
              <p><strong>확인한 것:</strong> Static key bouncer, handshake timeout, 시각 범위와 encrypted sender·receiver 생성 경로입니다.</p>
              <p><strong>말하지 않는 것:</strong> Identity hiding, padding, 0-RTT와 long-term identity key 탈취 뒤의 미래 session 안전을 제공하지 않습니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-commonware-p2p-v2026">
            <CitationBlock source="Commonware authenticated P2P · v2026.9.0 · d476a236" citeKey={3} type="code" href="https://github.com/commonwarexyz/monorepo/tree/d476a2361ce6840d2b9d0aa6fb30a924429046d4/p2p/src/authenticated">
              <p><strong>확인한 것:</strong> Channel registration, sender rate check, router·relay와 peer actor의 bounded delivery path입니다.</p>
              <p><strong>말하지 않는 것:</strong> Remote acknowledgement, consensus order, disk commit와 business side effect를 제공하지 않습니다.</p>
            </CitationBlock>
          </div>
        </div>
        <p>
          Alice·Bob, channel 7과 <code>m7</code>은 source의 state transition을 한 번에 추적하기 위한 글 안의 가정입니다. 이전 글은 <code>Rejected</code>를 <code>Feedback</code> variant처럼 설명했지만 현재 구현에서 <code>Rejected</code>는 bounded mailbox의 <code>Unreliable</code> 결과이고, <code>Feedback</code>은 <code>Ok·Backoff·Closed</code>입니다. 이 차이를 현재 버전에 맞게 바로잡았습니다.
        </p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">한 payload의 경계를 다시 말해 보기</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>Alice의 local send가 accepted여도 Bob 수신을 확정할 수 없는 이유는 무엇입니까? <strong>(답: Router·relay, encrypted transport, Bob의 decode·channel·rate 검사와 inbound mailbox가 아직 남아 있기 때문입니다.)</strong></li>
          <li>SynAck 뒤에도 Ack confirmation이 필요한 이유는 무엇입니까? <strong>(답: Listener인 Bob도 Alice가 같은 transcript와 shared secret을 계산했음을 확인한 뒤 ciphers를 공개해야 하기 때문입니다.)</strong></li>
          <li>max_peers=2, burst_size=2에서 다섯 번째 message가 버려져도 앞선 네 건이 유지되는 이유는 무엇입니까? <strong>(답: Bounded unreliable mailbox가 full일 때 새 enqueue만 Rejected하고 이미 queue에 있던 message는 보존하기 때문입니다.)</strong></li>
          <li>Bob Receiver가 <code>(Alice, m7)</code>을 반환한 뒤에도 업무 완료가 아닌 이유는 무엇입니까? <strong>(답: Schema·message signature·idempotency·disk commit와 side effect는 P2P crate 밖의 Application 상태이기 때문입니다.)</strong></li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Commonware 안에서 이 message가 여러 peer에게 퍼지고 digest waiter와 cache를 바꾸는 과정은 <Link to="/cs/blockchain/commonware-broadcast#overview" className="font-bold text-primary hover:underline">Commonware Broadcast</Link>에서 이어집니다.
        </p>
      </section>

      <CommonwareP2PMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareP2PTree }}
        projectMetas={{
          commonware: {
            id: "commonware",
            label: "Commonware v2026.9.0 · Rust",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
