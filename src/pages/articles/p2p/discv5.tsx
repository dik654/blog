import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import HandshakeFlowViz from "./discv5/viz/HandshakeFlowViz";
import SessionKeyViz from "./discv5/viz/SessionKeyViz";
import PacketLayoutViz from "./discv5/viz/PacketLayoutViz";
import DistanceShelfViz from "./discv5/viz/DistanceShelfViz";
import NodesSplitViz from "./discv5/viz/NodesSplitViz";

const WIRE_SPEC =
  "https://github.com/ethereum/devp2p/blob/e0091d1140bddce2a9805047b94110d3ad439e6e/discv5/discv5-wire.md";
const THEORY_SPEC =
  "https://github.com/ethereum/devp2p/blob/b4d1074d85f8229e516b894f39d270d4ce44d982/discv5/discv5-theory.md";
const GETH_CRYPTO =
  "https://github.com/ethereum/go-ethereum/blob/v1.17.8/p2p/discover/v5wire/crypto.go";

export default function Discv5Article() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Discv5는 낯선 주소와 먼저 열쇠를 만든 뒤, 노드 목록을 암호화해
          묻습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              Node Discovery Protocol v5는 처음 만난 UDP endpoint에 WHOAREYOU
              challenge를 보내 identity와 새 session key를 묶고, 그 뒤에야
              FINDNODE와 NODES를 인증·암호화하는 발견 프로토콜입니다.
            </strong>{" "}
            이것은 Ethereum 실행 프로토콜 연결 자체가 아니라, 다음 transport가
            시도할 주소 후보를 만드는 단계입니다.
          </p>
          <p>
            Alice는 Bob의 서명된 ENR와 UDP endpoint를 알고 있습니다. Bob은 Alice
            ENR의 옛 사본 <code>sequence=7</code>을 갖고 있지만 Alice의 현재
            record는 <code>sequence=8</code>입니다. Alice가 Bob 주변의 node를
            찾는 FINDNODE 요청 <code>R₁</code>을 보내려 하나, 둘 사이에는 아직
            session key가 없습니다. 첫 packet nonce를 <code>N₀</code>, Bob이
            만들 16-byte challenge를 <code>C</code>라고 부르겠습니다.
          </p>
          <p>
            가장 먼저 생기는 질문은 “열쇠가 없는데 첫 요청을 어떻게 암호화하나?”
            입니다. 답은 암호화하지 못한 FINDNODE를 평문으로 보내는 것이
            아닙니다. Alice는 <code>R₁</code>을 보관하고, wire에는 해독될 필요가
            없는 무작위 body의 ordinary packet을 보냅니다. Bob의 WHOAREYOU가
            <code>N₀</code>를 가리키면 Alice가 identity proof와 새 열쇠 재료,
            원래 <code>R₁</code>을 handshake packet 하나에 함께 넣습니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <HandshakeFlowViz />
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            그림의 이름을 이제 붙이면, 열쇠가 없는 첫 봉투가 ordinary packet,
            Bob의 challenge가 WHOAREYOU, 신원 증명과 원래 요청을 다시 실은
            봉투가 handshake packet입니다. 이후 FINDNODE와 NODES는 cached
            session key를 쓰는 ordinary message가 됩니다.
          </p>
          <p>
            이 글은 base Discovery v5.1의 message type <code>0x01~0x06</code>과
            go-ethereum v1.17.8을 기준으로 합니다. 2026년에 같은 wire 문서에
            추가된 TopDisc message <code>0x07~0x0A</code>는 별도
            service-discovery 확장이라 여기서는 다루지 않습니다. “현재 문서에
            있다”와 “geth v1.17.8이 구현한다”도 같은 말이 아닙니다.
          </p>
          <p>
            Session이 보호하는 범위도 discovery UDP datagram까지입니다. 이후
            QUIC·TCP·RLPx 연결, capability 협상, chain 일치 확인은 별도
            절차입니다. 발견된 ENR는 “연결해 볼 주소 카드”이지 연결 성공이나
            정직한 peer의 증명이 아닙니다.
          </p>
        </div>
      </section>

      <section id="wire" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Header masking은 위장이며, 실제 보안은 body의 AES-GCM이 맡습니다
        </h2>
        <PacketLayoutViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Discv5 packet은 <code>masking-iv || masked-header || message</code>
            순서입니다. Header는 목적지 node ID의 앞 16 byte를 key로 삼은
            AES-CTR로 가립니다. 하지만 목적지 node ID를 아는 누구나 같은 key를
            계산할 수 있습니다. 규격도 이 처리를 정적 protocol fingerprint를
            firewall에서 덜 드러내기 위한 masking이라고 부릅니다. 기밀성이나
            송신자 인증으로 세면 안 됩니다.
          </p>
          <p>
            실제 message body는 방향별 16-byte session key와 12-byte nonce를
            쓰는 AES-128-GCM으로 암호화합니다. Unmasked header와 masking IV는
            additional authenticated data, 즉{" "}
            <em>보이지만 바뀌면 tag 검증이 실패하는 영역</em>입니다. WHOAREYOU는
            예외로 message body가 없고, ordinary와 handshake packet만 암호화된
            body를 갖습니다.
          </p>
          <p>
            Packet 전체는 63 byte 이상 1280 byte 이하여야 합니다. 모든 message의
            첫 RLP 항목인 request ID는 최대 8 byte이며, response가 그대로
            되돌려줘야 합니다. 1280 byte는 “payload를 마음껏 1280 byte 쓴다”는
            뜻이 아니라 masking IV, header, authdata, GCM tag까지 합친 packet
            상한입니다.
          </p>
        </div>

        <CitationBlock
          source="Ethereum devp2p — Discovery v5.1 Wire Protocol · pinned commit"
          citeKey={1}
          href={WIRE_SPEC}
        >
          <p id="paper-devp2p-v5-wire" className="text-sm leading-6">
            Commit e0091d1의 wire 문서에서 63~1280-byte 경계, header masking,
            AES-GCM AAD, 8-byte 이하 request ID, WHOAREYOU와 base message
            semantics를 사용합니다. 같은 문서의 TopDisc 확장을 geth v1.17.8의
            구현 보장으로 확대하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="handshake" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          WHOAREYOU는 N₀·C·sequence 7로 “어떤 요청, 어떤 증명, 어떤 ENR”인지
          정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Bob은 첫 packet의 source node ID를 읽지만 body를 인증·복호화하지
            못합니다. 그래서 nonce <code>N₀</code>를 그대로 넣고, 새 16-byte
            <code>id-nonce C</code>와 자신이 가진 Alice ENR sequence 7을 붙인
            WHOAREYOU를 보냅니다. <code>N₀</code>는 Alice가 보관한 여러 요청 중
            <code>R₁</code>을 찾는 표식이고, <code>C</code>는 이 handshake의
            signature와 key를 다른 handshake와 분리하는 challenge입니다.
          </p>
          <p>
            Alice의 record는 sequence 8이라 Bob의 사본보다 새롭습니다. 따라서
            handshake authdata에 signed ENR 8을 포함합니다. Bob이 Alice record를
            전혀 몰라 <code>enr-seq=0</code>을 보냈다면 record는 반드시 포함해야
            합니다. Sequence가 같다면 생략할 수 있습니다. 이 판단은 “8이 더 크니
            Alice가 정직하다”가 아니라 “Bob의 주소 카드 사본을 갱신해야 한다”는
            뜻뿐입니다.
          </p>
          <p>
            Alice는{" "}
            <code>
              challenge-data = masking-iv || static-header || authdata
            </code>
            를 signature와 HKDF에 그대로 묶습니다. ID signature는 고정 label,
            challenge-data, 33-byte ephemeral public key, Bob node ID를
            SHA-256한 값에 Alice identity key로 서명한 64 byte입니다.
          </p>
          <p>
            Bob은 ENR signature와 이 ID signature를 확인해야 ephemeral key가
            “누군가의 새 key”가 아니라 Alice가 이 Bob·이 challenge를 위해 만든
            key임을 알 수 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="Unknown-key packet을 인증된 FINDNODE로 바꾸는 상태 절차"
          input={[
            "Alice current ENR seq=8, Bob cached Alice ENR seq=7",
            "pending request R₁=FINDNODE, first packet nonce N₀",
          ]}
          steps={[
            {
              code: "Alice: pending[N₀] = R₁; send random-body ordinary packet",
              note: "세션 key가 없으므로 R₁을 평문에 넣지 않습니다. N₀와 보류 요청의 관계를 timeout까지 유지합니다.",
            },
            {
              code: "Bob: decrypt fails → store challenge C; send WHOAREYOU(N₀, C, seq=7)",
              note: "WHOAREYOU에는 encrypted message가 없고 N₀가 어떤 packet을 촉발 원인으로 삼았는지 가리킵니다.",
            },
            {
              code: "Alice: require pending[N₀] and unexpired challenge",
              note: "가리킬 요청이 없는 unsolicited WHOAREYOU나 만료된 challenge는 무시합니다.",
            },
            {
              code: "Alice: derive keys; attach ID signature, eph key, ENR seq 8",
              note: "Bob의 cached sequence 7보다 Alice record 8이 새로우므로 signed ENR를 포함합니다.",
            },
            {
              code: "Alice: send handshake(message=AES-GCM(Kₐ→ᵦ, R₁))",
              note: "원래 논리 요청 R₁을 새 handshake packet body로 다시 싣습니다. 첫 random probe를 그대로 재전송하는 것이 아닙니다.",
            },
            {
              code: "Bob: verify ENR → ID signature → derive keys → verify GCM tag",
              note: "모든 단계가 성공한 뒤에만 session을 사용하고 FINDNODE R₁을 handler에 넘깁니다.",
            },
          ]}
          repeatUntil="Bob이 handshake를 기다리는 동안 또 해독 불가능한 ordinary packet을 받으면 새 challenge를 만들지 말고, 저장한 같은 WHOAREYOU를 다시 보냅니다."
          output="endpoint에 결속된 방향별 session key + 인증된 FINDNODE R₁, 또는 단계별 typed reject"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>“재전송하지 않는다”와 “다시 보낸다”는 서로 다른 상황입니다</h3>
          <p>
            일반 request가 응답 없이 timeout됐다고 같은 UDP packet을 자동
            재전송하지 않는 것이 wire 원칙입니다. 반면 WHOAREYOU는 “그 packet을
            해독할 key가 없다”는 명시적 응답입니다. 이때 참조된 논리 request는
            handshake body로 다시 보내야 합니다.
          </p>
          <p>
            Challenge 진행 중 또 ordinary packet이 들어오면 Bob도 새 challenge를
            만들지 않고 이미 진행 중인 WHOAREYOU를 다시 보냅니다.
          </p>
          <p>
            Alice가 동시에 세 요청을 보냈는데 WHOAREYOU가 그중 PING nonce만
            가리켰다면 PING을 handshake에 싣습니다. 나머지 packet도 Bob이
            해독하지 못했을 가능성이 있으므로, 새 session이 성립한 뒤 논리
            요청으로 다시 보낼 수 있습니다.
          </p>
          <p>
            “무응답 retry”, “challenge가 요구한 handshake 재전송”, “session 성립
            뒤 보류 요청 재발행”을 같은 retry로 세면 중복 실행과 잘못된 timeout
            해석이 생깁니다.
          </p>
        </div>

        <CitationBlock
          source="Ethereum devp2p — Discovery v5.1 Theory · pinned commit"
          citeKey={2}
          href={THEORY_SPEC}
        >
          <p id="paper-devp2p-v5-theory" className="text-sm leading-6">
            Commit b4d1074의 theory 문서에서 random first packet, challenge에
            참조된 요청의 handshake 재전송, concurrent pending request 처리,
            진행 중 challenge 재사용, endpoint-bound session cache를 사용합니다.
            Lookup의 기대 성질을 packet delivery나 adversarial topology의 성공
            보장으로 확대하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="session" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          ECDH 하나에서 Alice→Bob과 Bob→Alice 열쇠를 따로 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice는 이번 handshake용 ephemeral private key <code>aₑ</code>와 Bob
            ENR의 static public key <code>Bₛ</code>로 ECDH를 계산합니다. Bob은
            자신의 static private key와 Alice가 보낸 ephemeral public key로 같은
            curve point를 얻습니다. geth v1.17.8은 이 점을 33-byte compressed
            형식으로 만들어 HKDF secret에 넣습니다.
          </p>
          <p>
            ECDH 결과만 그대로 AES key로 쓰면 어느 challenge와 어느 상대를 위한
            값인지 드러나지 않습니다. 그래서 WHOAREYOU challenge-data를 salt로,
            <code>"discovery v5 key agreement" || Alice ID || Bob ID</code>를
            info로 넣습니다. Node ID의 순서는 role을 고정합니다. 32-byte 결과를
            16 byte씩 나누면 Alice가 쓰는 key가 Bob에게는 읽는 key가 됩니다.
          </p>
        </div>

        <ExplainedFormula
          question="같은 ECDH 공유점에서 두 방향 session key를 어떻게 구분할까요?"
          idea="Challenge를 salt로, 고정 label과 Alice·Bob ID 순서를 info로 넣은 HKDF-SHA256 출력을 앞뒤 16 byte로 나눕니다."
          formula={String.raw`K_{A\to B}\parallel K_{B\to A}=\operatorname{HKDF}_{\mathrm{SHA256}}(\operatorname{ECDH}(a_e,B_s),c,\ell\parallel id_A\parallel id_B,32)`}
          annotatedFormula={String.raw`\underbrace{K_{A\to B}}_{\text{앞 16B}}\parallel\underbrace{K_{B\to A}}_{\text{뒤 16B}}=\operatorname{HKDF}_{\mathrm{SHA256}}(\underbrace{\operatorname{ECDH}(a_e,B_s)}_{\text{33B compressed shared point}},\underbrace{c}_{\text{WHOAREYOU challenge-data}},\underbrace{\ell\parallel id_A\parallel id_B}_{\text{label과 role 순서}},\underbrace{32}_{\text{output bytes}})`}
          operations={[
            {
              expression: String.raw`\operatorname{ECDH}(a_e,B_s)`,
              annotation: [
                "Alice ephemeral secret과 Bob ENR static public key",
                "양쪽이 같은 33-byte compressed point를 얻음",
              ],
            },
            {
              expression: String.raw`c`,
              annotation: [
                "WHOAREYOU의 unmasked IV·static header·authdata",
                "다른 challenge가 같은 key를 만들지 않게 salt로 사용",
              ],
            },
            {
              expression: String.raw`\ell\parallel id_A\parallel id_B`,
              annotation: [
                "고정 label 뒤에 initiator와 recipient ID를 순서대로",
                "상대와 보내는 방향을 context에 결속",
              ],
            },
            {
              expression: String.raw`K_{A\to B}\parallel K_{B\to A}`,
              annotation: [
                "32-byte stream을 16B + 16B로 읽음",
                "Bob은 같은 조각의 read·write 역할을 뒤집어 저장",
              ],
            },
          ]}
          terms={[
            {
              symbol: "a_e",
              name: "Alice ephemeral private key",
              description:
                "이 handshake를 위해 새로 만든 secp256k1 scalar입니다.",
            },
            {
              symbol: "B_s",
              name: "Bob static public key",
              description: "Bob의 signed ENR identity에 결속된 공개키입니다.",
            },
            {
              symbol: "c",
              name: "Challenge data",
              description:
                "WHOAREYOU의 masking IV, static header, authdata를 이어 붙인 bytes입니다.",
            },
            {
              symbol: String.raw`\ell`,
              name: "Domain label",
              description: "문자열 discovery v5 key agreement입니다.",
            },
            {
              symbol: String.raw`K_{A\to B}`,
              name: "Initiator key",
              description:
                "Alice가 암호화하고 Bob이 복호화하는 16-byte AES key입니다.",
            },
            {
              symbol: String.raw`K_{B\to A}`,
              name: "Recipient key",
              description:
                "Bob이 암호화하고 Alice가 복호화하는 16-byte AES key입니다.",
            },
          ]}
          assumptions={[
            "Pinned geth release의 v4 identity scheme, secp256k1 ECDH와 HKDF-SHA256 경로를 따릅니다.",
            "Ephemeral private key는 예측 불가능하게 만들고 다른 handshake에 재사용하지 않습니다.",
            "ENR와 ID signature 검증이 끝나야 ECDH public key를 상대 identity에 결속할 수 있습니다.",
          ]}
          interpretation="두 node가 같은 32 byte를 얻는 것만으로 Alice 인증이 끝난 것은 아닙니다. ENR signature, ID signature, AES-GCM tag를 차례로 통과하고 나서야 session과 R₁을 수락합니다."
        />

        <div className="not-prose my-8">
          <SessionKeyViz />
        </div>

        <CalculationWalkthrough
          title="Session key·nonce·GCM tag의 byte 장부"
          question="한 방향 key와 nonce는 몇 byte이고, plaintext P byte를 암호화하면 body가 얼마나 늘어날까요?"
          scope="go-ethereum v1.17.8의 crypto.go 상수와 theory 문서의 권장 nonce 구성을 구분해 계산합니다."
          steps={[
            {
              label: "HKDF 출력 길이를 방향별로 나눕니다",
              expression: "32 B ÷ 2 directions",
              result: "각 방향 AES key 16 B",
              reason:
                "geth는 HKDF stream에서 writeKey 16B와 readKey 16B를 차례로 읽습니다.",
            },
            {
              label: "권장 nonce의 두 부분을 더합니다",
              expression: "outgoing counter 4 B + secure random 8 B",
              result: "GCM nonce 12 B",
              reason:
                "Wire의 필수 조건은 unique 96-bit nonce이고, 4+8 구성은 theory 문서의 강한 권장 방식입니다.",
            },
            {
              label: "GCM 인증 tag 길이를 더합니다",
              expression: "plaintext P B + tag 16 B",
              result: "ciphertext body P + 16 B",
              reason:
                "geth encryptGCM도 결과가 plaintext보다 16 byte 길다고 명시합니다.",
            },
            {
              label: "예시 message body에 적용합니다",
              expression: "plaintext 80 B + tag 16 B",
              result: "암호화된 body 96 B",
              reason:
                "Nonce와 header는 이 96B 안이 아니라 packet의 별도 header 영역에 있습니다.",
            },
          ]}
          conclusion="HKDF 32B는 16B 방향 key 두 개가 되고, 권장 nonce는 12B입니다. 80B plaintext의 AES-GCM ciphertext는 tag를 포함해 96B지만 packet 전체 크기는 여기에 header와 authdata까지 더해야 합니다."
          caveats={[
            "4-byte counter + 8-byte random은 nonce uniqueness를 위한 권장 생성법이지 wire에서 nonce 내부 구조를 강제하는 encoding 규칙은 아닙니다.",
            "같은 방향 key 아래 nonce가 한 번이라도 재사용되면 GCM 보안 전제가 깨집니다. 단순히 packet nonce가 12B라는 사실만으로 안전하지 않습니다.",
          ]}
        />

        <CitationBlock
          source="go-ethereum v1.17.8 — discv5 crypto.go"
          citeKey={3}
          href={GETH_CRYPTO}
        >
          <p id="source-geth-v5-crypto" className="text-sm leading-6">
            Tag v1.17.8의 <code>crypto.go</code>에서 16-byte AES key, 12-byte
            GCM nonce, 33-byte compressed ECDH point, label·ordered node IDs를
            넣은 HKDF와 16-byte GCM tag를 확인합니다. 이 구현 상수를 다른
            client나 미래 identity scheme 전체의 고정값으로 확대하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="findnode" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          FINDNODE는 목표 ID가 아니라 Bob 기준 거리 선반을 요청합니다
        </h2>
        <DistanceShelfViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Session이 생겼으니 Alice는 보류했던 <code>R₁</code>을 실행할 수
            있습니다. 먼저 찾고 싶은 target <code>x</code>와 Bob node ID의 XOR
            logarithmic distance <code>d</code>를 계산하고, FINDNODE에
            <code>[d]</code> 또는 인접 거리 목록을 넣습니다. Bob은 target
            <code>x</code>를 받는 것이 아니라 “내 ID에서 거리 d인 bucket의 ENR를
            달라”는 요청을 받습니다. Distance 0만 Bob 자신의 현재 ENR를 달라는
            특수값입니다.
          </p>
        </div>

        <NodesSplitViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Bob은 요청 거리와 맞고 local liveness policy를 통과한 record를 모아
            NODES로 답합니다. 권장 result 상한은 16개입니다. 각 NODES에는 같은
            request ID <code>R₁</code>, 전체 response packet 수{" "}
            <code>total</code>, 이번 packet의 ENR list가 들어갑니다. UDP 순서가
            뒤바뀔 수 있으므로 Alice는 packet 도착 순서가 아니라 <code>R₁</code>
            과 <code>total</code>로 묶습니다.
          </p>
        </div>

        <CalculationWalkthrough
          title="16개 ENR가 NODES 여러 packet으로 나뉘는 이유"
          question="ENR가 각각 최대 300 byte라면 16개를 1280-byte packet 하나에 넣을 수 있을까요?"
          scope="ENR record bytes만 먼저 세어 이론적 하한을 구합니다. Header·RLP·request ID·total·GCM tag는 뒤에서 추가되는 overhead입니다."
          steps={[
            {
              label: "최대 크기 ENR 16개를 곱합니다",
              expression: "16 records × 300 B/record",
              result: "ENR bytes만 4800 B",
              reason:
                "Wire 문서가 정한 ENR 하나의 최대 크기를 모두 사용한 최악의 경우입니다.",
            },
            {
              label: "Packet 상한과 먼저 비교합니다",
              expression: "4800 B > 1280 B",
              result: "한 packet에는 절대 들어가지 않음",
              reason:
                "아직 header와 GCM tag도 더하지 않았는데 이미 상한의 3.75배입니다.",
            },
            {
              label: "Overhead가 0이라고 가정한 하한을 올림합니다",
              expression: "ceil(4800 ÷ 1280)",
              result: "최소 4 packets",
              reason:
                "실제 overhead가 0일 수 없으므로 4는 가능한 packet 수의 보장이 아니라 이론적 최솟값입니다.",
            },
            {
              label: "실제 구현의 payload budget을 적용합니다",
              expression:
                "record bytes + RLP + request ID + total + header + tag ≤ 1280",
              result: "record 크기에 따라 4개보다 더 필요할 수 있음",
              reason:
                "geth v1.17.8은 record 묶음에 별도 1000-byte budget을 두므로 정확한 packet 수는 ENR 크기 분포에 따라 달라집니다.",
            },
          ]}
          conclusion="최악의 ENR 16개는 record bytes만 4800B여서 NODES를 반드시 나눠야 합니다. total은 이 분할 수를 알려주지만, 수신자는 total을 무제한 신뢰해서 memory를 예약하면 안 됩니다."
          caveats={[
            "모든 ENR가 실제로 300B인 것은 아닙니다. 따라서 언제나 정확히 4개 또는 6개 packet이라는 결론은 틀립니다.",
            "geth의 1000-byte record budget과 response total 상한 5는 v1.17.8 구현 정책이지 wire 규격 전체의 고정 상수가 아닙니다.",
          ]}
        />

        <AlgorithmBlock
          title="순서가 섞인 NODES를 R₁의 검증된 후보로 합치기"
          input={[
            "pending FINDNODE R₁, requested distances D",
            "unordered NODES datagrams, local total cap and dedup set",
          ]}
          steps={[
            {
              code: "if response.request_id != R₁: reject_unmatched",
              note: "다른 lookup의 packet이나 늦게 온 이전 response를 현재 결과에 섞지 않습니다.",
            },
            {
              code: "expected = min(first_response.total, local_total_cap)",
              note: "상대가 보낸 큰 total을 그대로 믿고 무제한 상태를 만들지 않습니다. geth v1.17.8의 local cap은 5입니다.",
            },
            {
              code: "for ENR in response: verify size, signature, endpoint, requested distance",
              note: "서명이 맞아도 Bob 기준 요청 거리와 다르면 이 FINDNODE 결과로 받지 않습니다.",
            },
            {
              code: "if node_id not in seen: append candidate; seen.add(node_id)",
              note: "같은 ENR가 여러 NODES packet에 반복돼도 shortlist에는 한 번만 넣습니다.",
            },
            {
              code: "received += 1; finish when received >= expected or timeout",
              note: "Packet 순서는 중요하지 않습니다. 일부만 온 뒤 timeout이면 partial response라는 사실도 receipt에 남깁니다.",
            },
            {
              code: "merge validated candidates into XOR-distance shortlist",
              note: "그다음 후보 선택과 종료는 Kademlia 반복 탐색 절차가 맡습니다.",
            },
          ]}
          output="validated unique candidates + received/expected count + complete or partial outcome"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            무응답이면 wire layer가 같은 FINDNODE datagram을 자동 재전송하지
            않습니다. Lookup은 Bob query를 timeout으로 기록하고 아직 묻지 않은
            다음 후보로 진행합니다. 이 후속 후보표의 갱신과 종료 조건은
            <Link to="/cs/p2p/kad-lookup"> Kademlia 반복 탐색</Link>에서
            이어지고, XOR 거리와 bucket 의미는
            <Link to="/cs/p2p/kademlia"> Kademlia 거리표</Link>에서 먼저 볼 수
            있습니다.
          </p>
          <p>
            geth v1.17.8은 FINDNODE handler 결과를 최대 16개로 제한하고, NODES
            record 묶음에 1000-byte budget을 둡니다. 수신 쪽은 첫 response의
            <code>RespCount</code>를 local 상한 5와 비교합니다. 이는 규격의
            “result limit 16을 권장하고 total에 local cap을 둘 수 있다”를 특정
            숫자로 구현한 한 사례입니다.
          </p>
        </div>
      </section>

      <section id="talk" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          TALKREQ는 연결 전에 작은 질문을 보내는 통로이지, 새 stream이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TALKREQ는 <code>[request-id, protocol, request]</code>를 session
            안에서 보냅니다. Bob은 application handler가 만든 bytes를 같은
            request ID의 TALKRESP로 돌려줘야 합니다. Protocol을 모르면 response
            data가 빈 TALKRESP를 보냅니다. 빈 bytes는 transport 오류와 다르지만,
            application 성공을 뜻하지도 않습니다.
          </p>
          <p>
            목적은 다른 application-specific protocol로 연결하기 전 작은 정보를
            미리 협상하는 것입니다. Packet 전체 1280-byte 상한이 그대로
            적용되고, 지속 stream·큰 file transfer·무제한 RPC를 제공하지
            않습니다. Handler CPU, request 크기, peer별 rate, timeout을 제한하지
            않으면 암호화된 packet이어도 resource exhaustion 통로가 됩니다.
          </p>
          <p>
            따라서 운영 기록은 적어도 <code>unknown_protocol</code>,
            <code>handler_timeout</code>, <code>invalid_response</code>,
            <code>session_expired</code>를 구분해야 합니다. 큰 payload가
            필요하면 TALK로 연결 정보를 합의한 뒤 별도 QUIC·TCP·RLPx transport로
            넘어갑니다.
          </p>
        </div>
      </section>

      <section id="limits" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          암호화된 발견이 해결하는 것과 해결하지 않는 것을 나눠야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Discv4의 signed plaintext와 비교하면 discv5는 discovery message의
            기밀성·무결성, 상대 identity에 결속된 ephemeral session을 얻습니다.
            그러나 valid identity key를 많이 만든 Sybil, 특정 후보만 돌려주는
            Eclipse, 거짓 application data까지 자동으로 막지는 않습니다.
          </p>
          <p>
            Routing-table 다양성, IP·subnet 제한, 다중 경로 lookup과 별도 평판
            정책이 여전히 필요합니다.
          </p>
          <p>
            Session cache도 node ID만으로 찾으면 안 됩니다. Theory 문서는 node
            ID와 IP·UDP port를 함께 key로 삼으라고 합니다. Alice가 다른
            네트워크로 이동하면 옛 key가 있더라도 새 endpoint에서 온 packet은
            복호화하지 않고 다시 WHOAREYOU를 보내야 합니다. 이것이 NAT 이동을
            자동 추적한다는 뜻은 아닙니다.
          </p>
          <h3>이 흐름을 이해했다면 다음 상황을 예측할 수 있어야 합니다</h3>
          <ul>
            <li>
              Bob의 cached ENR가 이미 sequence 8이면 Alice는 handshake에서
              record를 생략할 수 있습니다.
            </li>
            <li>
              WHOAREYOU가 보류 목록에 없는 nonce를 가리키면 Alice는 새 session을
              만들지 않고 무시합니다.
            </li>
            <li>
              NODES의 total이 200이어도 수신자는 local cap까지만 기다리고, 받은
              ENR마다 requested distance를 다시 계산합니다.
            </li>
            <li>
              Bob endpoint가 바뀌면 같은 node ID와 valid ENR가 있어도 기존
              session key를 새 주소에 그대로 재사용하지 않습니다.
            </li>
            <li>
              TALKRESP가 정상적으로 왔어도 상위 transport 연결이나 application
              요청의 의미적 성공은 별도로 확인해야 합니다.
            </li>
          </ul>
          <p>
            구현을 바꿀 때는 같은 ENR·endpoint·loss·reordering fixture에서
            handshake packet bytes, reject reason, NODES partial outcome과 최종
            shortlist를 release별로 비교해야 합니다. Spec commit, client tag,
            identity scheme을 함께 고정하지 않으면 protocol 변화와 구현 차이를
            구분할 수 없습니다.
          </p>
        </div>
      </section>
    </>
  );
}
