import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import HandshakeFlowViz from "./discv5/viz/HandshakeFlowViz";
import SessionKeyViz from "./discv5/viz/SessionKeyViz";

export default function Discv5Article() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          발견 후보를 인증된 discovery session으로 조회하기
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 Bob의 ENR 하나를 bootstrapping으로 얻었다고 하자. Node
            Discovery Protocol v5의 현재 규격은 protocol version v5.1이다.
            Alice는 Bob의 node ID와 UDP endpoint를 사용해 discovery message를
            보내고, Bob이 key를 모르면 WHOAREYOU challenge를 돌려준다. Alice가
            identity proof와 ephemeral public key를 담은 handshake packet으로
            응답하면 두 방향 session key가 만들어진다.
          </p>
          <p>
            이 글의 경계는 discovery다. Session은 discovery datagram의
            confidentiality와 authentication을 제공하지만, 이후 QUIC·TCP·RLPx
            transport나 application capability를 대신 협상하지 않는다. 고정
            흐름은 ENR 확인 → WHOAREYOU handshake → key cache → FINDNODE/NODES
            → 필요하면 TALKREQ/TALKRESP → 별도 transport dial이다.
          </p>
          <p>
            V5.1 discovery packet은 63 byte보다 작거나 1280 byte보다 크면
            처리하지 않는다. UDP는 loss와 reordering을 허용하며 짧은 timeout을
            권하지만, 무응답 request 자체를 resend하지 않는다. Lookup은 그
            candidate를 timeout으로 기록하고 아직 묻지 않은 다음 후보로 간다.
          </p>
        </div>

        <CitationBlock
          source="Ethereum devp2p — Discovery v5.1 Wire Protocol"
          citeKey={1}
          href="https://github.com/ethereum/devp2p/blob/master/discv5/discv5-wire.md"
        >
          <div id="paper-devp2p-v5-wire" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> Lossy UDP에서 discovery message를 식별·인증·암호화하고 응답을 맞춰야 한다.</p>
            <p><strong>기여:</strong> v5.1 packet header, WHOAREYOU, AES-GCM과 protocol message encoding을 규정한다.</p>
            <p><strong>전제:</strong> Protocol v5.1 문서와 지원 identity scheme, 구현 revision을 함께 고정한다.</p>
            <p><strong>근거 범위:</strong> 63~1280-byte packet, request ID, FINDNODE·NODES·TALK wire semantics에 한정한다.</p>
            <p><strong>비보장:</strong> 상위 transport 보안, peer honesty, 자동 UDP 재전송이나 고정 timeout 성공을 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>

      <section id="handshake" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">WHOAREYOU challenge와 identity proof</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice에게 cached key가 없으면 우선 해독될 것을 기대하지 않는 ordinary
            message를 보낸다. Bob은 source node ID를 읽고 key cache로 복호화를
            시도한다. 실패하면 그 message nonce를 되돌려 가리키는 WHOAREYOU와
            random 16-byte <code>id-nonce</code>, Alice ENR의 cached sequence를
            보낸다. Challenge 자체에는 encrypted message가 없다.
          </p>
          <p>
            Alice는 WHOAREYOU 전체 challenge data를 identity signature와 key
            derivation에 묶고 원래 요청을 handshake packet으로 다시 보낸다.
            Bob이 Alice의 ENR를 모르거나 sequence가 오래됐으면 signed ENR도
            포함한다. Bob은 ENR signature와 identity signature를 검증한 뒤에만
            새 key로 message를 인증·복호화한다. Unsolicited 또는 오래된 challenge,
            invalid ENR, signature failure는 서로 다른 reject 이유다.
          </p>
        </div>

        <div className="not-prose my-8">
          <HandshakeFlowViz />
        </div>

        <CitationBlock
          source="Ethereum devp2p — Discovery v5.1 Theory"
          citeKey={2}
          href="https://github.com/ethereum/devp2p/blob/master/discv5/discv5-theory.md"
        >
          <div id="paper-devp2p-v5-theory" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> 어느 쪽도 client로 고정되지 않은 UDP discovery에서 session과 table을 유지해야 한다.</p>
            <p><strong>기여:</strong> WHOAREYOU handshake, key cache, lookup과 liveness algorithm을 설명한다.</p>
            <p><strong>전제:</strong> v5.1 theory와 wire 문서를 같은 revision으로 읽고 clock·endpoint를 고정한다.</p>
            <p><strong>근거 범위:</strong> Discovery session lifecycle과 routing algorithm의 설계 의도에 한정한다.</p>
            <p><strong>비보장:</strong> 모든 implementation parameter, adversarial topology에서 완전한 lookup이나 상위 연결을 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>

      <section id="session" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ECDH 결과를 두 방향 AES-GCM key로 나누기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice는 ephemeral secp256k1 key pair를 만들고 Bob ENR의 static public
            key와 ECDH를 수행한다. Raw shared secret을 바로 AES key로 쓰지 않고,
            challenge data를 HKDF salt에 넣고 두 node ID와 role 순서를 info에
            넣어 32 byte를 유도한다. 앞 16 byte는 initiator가 보내는 방향,
            뒤 16 byte는 recipient가 보내는 방향의 AES-128-GCM key다.
          </p>
          <p>
            구현은 ENR signature와 identity key, identity-scheme에 맞는 encoded
            curve point와 ECDH input을 먼저 검사한다. HKDF context가 일치해도
            id-signature와 AES-GCM tag 검증이 끝나기 전에는 session key를
            accepted state에 넣지 않는다. 같은 directional key에서는 outgoing
            nonce uniqueness도 별도 counter와 secure random bytes로 지킨다.
          </p>
        </div>

        <ExplainedFormula
          question="같은 ECDH secret에서 Alice→Bob과 Bob→Alice key를 어떻게 분리하는가?"
          idea="WHOAREYOU transcript를 salt로, 두 node ID와 고정 label을 context로 넣어 handshake와 role을 key에 결속한다. 32-byte output을 16 byte씩 나누면 방향이 바뀐 message가 같은 key 용도로 겹치지 않는다."
          formula={String.raw`\begin{aligned}p&=\operatorname{HKDFExtract}(c,\operatorname{ECDH}(B_s,a_e))\\K_i\parallel K_r&=\operatorname{HKDFExpand}(p,\text{"discovery v5 key agreement"}\parallel id_A\parallel id_B,32)\end{aligned}`}
          terms={[
            { symbol: "c", name: "Challenge data", description: "WHOAREYOU의 unmasked masking IV, static header, authdata byte sequence" },
            { symbol: "B_s", name: "Recipient static key", description: "Bob의 signed ENR identity에 결속된 secp256k1 public key" },
            { symbol: "a_e", name: "Initiator ephemeral secret", description: "Alice가 이 handshake를 위해 새로 생성한 private scalar" },
            { symbol: "p", name: "Pseudorandom key", description: "HMAC-SHA-256 HKDF-Extract가 만든 중간 key material" },
            { symbol: "K_i,K_r", name: "Directional keys", description: "각각 16-byte initiator·recipient AES-128-GCM key" },
            { symbol: "id_A,id_B", name: "Ordered node IDs", description: "Alice와 Bob의 순서를 보존한 각 32-byte node ID" },
          ]}
          assumptions={[
            "v5.1의 v4 identity scheme, secp256k1 ECDH와 HMAC-SHA-256 HKDF profile을 따른다.",
            "Ephemeral private key는 예측 불가능하게 생성하고 재사용하지 않는다.",
            "각 AES-GCM message nonce는 같은 directional key 아래에서 유일해야 한다.",
          ]}
          interpretation="Output은 32 byte이고 두 key는 각 16 byte다. ECDH만으로 Alice identity가 인증되는 것이 아니라 signed ENR와 id-signature 검증까지 성공해야 한다. Endpoint가 바뀌거나 cache key가 사라지면 새 handshake가 필요하다."
        />

        <div className="not-prose my-8">
          <SessionKeyViz />
        </div>
      </section>

      <section id="findnode" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">FINDNODE는 target ID가 아니라 거리 목록을 요청한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 target x에 가까운 후보를 찾을 때 Bob과 x의 logarithmic
            distance를 계산해 FINDNODE에 positive distance 목록을 넣는다.
            Distance 0은 Bob 자신의 current ENR를 요청하는 특수값이다. Bob은
            요청한 distance bucket에 맞고 liveness가 검증된 ENR를 모아 NODES로
            답하며, 권장 result limit은 16개다.
          </p>
          <p>
            ENR 한 개가 최대 300 byte라 한 packet에 모두 담기지 않을 수 있다.
            NODES의 <code>total</code>은 response message 수를 알리고 request ID가
            요청과 응답을 결속한다. Alice는 requested distance, signature,
            endpoint와 duplicate를 검증한다. UDP는 loss·reordering을 허용하고
            규격은 무응답 요청을 재전송하지 말라고 하므로, timeout 뒤 다음
            candidate로 진행하는 lookup policy와 transport retry를 혼동하면 안 된다.
          </p>
          <p>
            Receiver는 local resource policy로 NODES total 상한을 두고, oversize
            ENR·wrong distance·bad signature·duplicate를 typed reject로 남긴다.
            일부 datagram만 오면 partial response와 timeout을 함께 기록해 최종
            shortlist가 완전한 응답에서 왔다고 가장하지 않는다.
          </p>
          <p>
            Shortlist merge와 termination은{" "}
            <Link to="/p2p/kad-lookup">Kademlia 반복 탐색</Link>을 재사용하고,
            ENR structure의 canonical 설명은{" "}
            <Link to="/p2p/discv4#enr">discv4의 ENR section</Link>을 잇는다.
          </p>
        </div>
      </section>

      <section id="talk" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TALKREQ는 작은 discovery 확장 통로다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TALKREQ는 request ID, protocol byte string, request payload를 session
            안에서 보낸다. Bob은 반드시 같은 request ID의 TALKRESP로 답하고,
            protocol을 모르면 empty response를 보낸다. 이는 “지원하지 않음”을
            typed response로 표현할 뿐 application 성공이나 새 transport stream을
            만들지 않는다.
          </p>
          <p>
            운영자는 1280-byte discovery packet 상한, parser와 handler CPU,
            per-peer rate limit을 함께 둔다. Oversize, unknown protocol, handler
            timeout, invalid response와 session expiry를 별도 receipt로 남기고,
            큰 streaming payload는 적합한 상위 transport로 보낸다. Discv4의
            signed plaintext packet과 비교하면 discv5의 session 보호 범위가
            넓지만 Sybil·Eclipse 저항이 자동으로 생기는 것은 아니다.
          </p>
          <p>
            Discv4와 비교하는 release gate는 v4 signed plaintext와 v5.1
            WHOAREYOU·directional AES-GCM을 protocol revision·client SHA별로
            고정한다. 같은 endpoint·ENR·loss/reorder fixture에서 lookup result,
            pending state, packet byte와 reject reason parity를 먼저 확인하고
            resource threshold를 넘으면 rollback한다.
          </p>
        </div>
      </section>
    </>
  );
}
