import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import Discv4LookupViz from "./discv4/Discv4LookupViz";

export default function Discv4Article() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Discv4는 Ethereum 연결이 아니라, 연결해 볼 주소를 찾는 UDP 절차입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              Node Discovery Protocol v4는 서명된 평문 UDP packet으로 상대
              주소를 확인하고, target에 가까운 node 연락처를 받아 별도
              transport가 시도할 dial 후보를 만듭니다.
            </strong>{" "}
            여기서 후보를 찾았다는 말은 RLPx 연결이나 같은 chain 확인까지
            끝났다는 뜻이 아닙니다.
          </p>
          <p>
            Alice가 Bob의 identity public key와 UDP endpoint 하나만 알고
            시작한다고 하겠습니다. Alice의 첫 PING packet hash를
            <code>H_A</code>, Bob의 반대 방향 PING hash를
            <code>H_B</code>라 부릅니다. Alice는 64-byte target public key
            <code>K</code>와 가까운 연락처를 Bob에게 묻습니다.
          </p>
          <p>
            Bob의 table에는 target-near contact가 16개 있습니다. geth v1.17.8은
            한 NEIGHBORS datagram에 최대 12개만 담으므로 답은 12개와 4개로
            나뉩니다. 그중 후보 C의 cached ENR sequence가 7인데 packet이 8을
            알리면 Alice는 hash <code>H_R</code>인 ENRREQUEST로 sequence 8
            record를 다시 가져옵니다. 아래 여섯 장면은 이 fixture 하나를 끝까지
            보여 줍니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <Discv4LookupViz />
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            순서를 먼저 보면 이름도 덜 헷갈립니다. PING/PONG은 양쪽 UDP endpoint
            proof, FINDNODE/NEIGHBORS는 다음 후보 수집, ENRREQUEST/ENRRESPONSE는
            서명된 주소 카드 갱신입니다. 여섯 packet type 모두 같은 signed
            plaintext envelope를 씁니다.
          </p>
          <p>
            Discv4가 내놓는 것은 identity와 UDP·TCP endpoint입니다. 그 다음
            RLPx/TCP dial, 암호화 session, capability 협상, ETH Status와 chain
            호환성 확인은 별도 계층의 일입니다. Packet signature도 그 node가
            정직하거나 Sybil이 아니라는 증명은 아닙니다.
          </p>
        </div>
      </section>

      <section id="wire" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Packet은 98-byte 고정 envelope 뒤에 type별 RLP data를 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 packet의 byte 순서는
            <code>hash || signature || packet-type || packet-data</code>입니다.
            Hash는 32 byte, recoverable secp256k1 signature는 65 byte, type은 1
            byte입니다. 이 세 필드만 더하면 RLP data 앞에 98 byte가 이미
            놓입니다.
          </p>
        </div>

        <CalculationWalkthrough
          title="Discv4 packet byte 장부"
          question="1280-byte UDP packet에서 type별 data가 쓸 수 있는 최대 자리는 얼마일까요?"
          scope="IP·UDP header가 아니라 discv4 packet 자체의 1280-byte 상한과 내부 field만 계산합니다."
          steps={[
            {
              label: "Packet hash 길이를 적습니다",
              expression: "hash = 32 B",
              result: "32 B",
              reason: "Keccak-256 결과가 packet 맨 앞에 옵니다.",
            },
            {
              label: "Recoverable signature를 더합니다",
              expression: "32 + 65",
              result: "97 B",
              reason: "r·s와 recovery ID를 합친 65-byte signature입니다.",
            },
            {
              label: "Packet type 한 byte를 더합니다",
              expression: "97 + 1",
              result: "고정 envelope 98 B",
              reason: "0x01 PING부터 0x06 ENRRESPONSE까지 type을 구분합니다.",
            },
            {
              label: "전체 상한에서 고정 부분을 뺍니다",
              expression: "1280 − 98",
              result: "packet-data 최대 1182 B",
              reason:
                "RLP list와 허용된 trailing bytes가 함께 이 남은 범위 안에 있어야 합니다.",
            },
          ]}
          conclusion="Discv4 packet은 최소 98-byte 고정 envelope와 type별 RLP data로 이루어지며, data가 사용할 수 있는 남은 byte budget은 최대 1182 byte입니다."
          caveats={[
            "98 byte는 유효한 RLP data가 오기 전의 고정 길이입니다. 유효 packet 전체 최소 길이를 98 byte라고 단정한 값은 아닙니다.",
            "1280 byte는 discv4 packet 상한입니다. Ethernet MTU나 IP·UDP header를 이 장부에 더하지 않았습니다.",
          ]}
        />

        <ExplainedFormula
          question="맨 앞 hash와 뒤 signature는 서로 무엇을 확인할까요?"
          idea="Packet hash는 signature를 포함한 나머지 bytes가 그대로 왔는지 확인하고, signature는 type과 data를 서명한 public key를 복원합니다."
          formula={
            "h=\\operatorname{keccak256}(\\sigma\\parallel t\\parallel d)"
          }
          annotatedFormula={
            "\\underbrace{h}_{\\text{앞 32B}}=\\operatorname{keccak256}(\\underbrace{\\sigma}_{\\text{서명 65B}}\\parallel\\underbrace{t}_{\\text{type 1B}}\\parallel\\underbrace{d}_{\\text{RLP data}})"
          }
          operations={[
            {
              expression: "\\sigma\\parallel t\\parallel d",
              annotation: [
                "Packet의 33번째 byte부터 끝까지 순서대로 이어 붙입니다",
                "Signature 65B, type 1B, data가 들어갑니다",
              ],
            },
            {
              expression:
                "\\operatorname{keccak256}(\\sigma\\parallel t\\parallel d)",
              annotation: [
                "수신자가 다시 계산해 맨 앞 h와 비교합니다",
                "Spec은 이 hash에 packet format 인식 외 다른 목적을 부여하지 않습니다",
              ],
            },
            {
              expression:
                "\\operatorname{recover}(\\sigma,\\operatorname{keccak256}(t\\parallel d))",
              annotation: [
                "Signature가 type과 data에 결속한 public key를 복원합니다",
                "Hash 일치만으로 sender identity가 증명되는 것은 아닙니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "h",
              name: "Packet hash",
              description:
                "Signature부터 data 끝까지를 Keccak-256한 32 byte입니다.",
            },
            {
              symbol: "\\sigma",
              name: "Recoverable signature",
              description:
                "Sender public key를 복원할 수 있는 65-byte secp256k1 signature입니다.",
            },
            {
              symbol: "t",
              name: "Packet type",
              description:
                "PING·PONG·FINDNODE·NEIGHBORS·ENR request/response를 구분하는 1 byte입니다.",
            },
            {
              symbol: "d",
              name: "Packet data",
              description:
                "각 type이 정의한 RLP list와 forward-compatible trailing data입니다.",
            },
          ]}
          assumptions={[
            "Keccak-256과 secp256k1 recovery는 discv4 encoding과 같은 byte 경계를 사용합니다.",
            "Packet 길이는 1280 byte 이하이고 type별 RLP decode가 성공해야 합니다.",
            "Payload는 암호화되지 않으며 expiration은 절대 UNIX time이라 clock 정확도에 의존합니다.",
          ]}
          interpretation="Hash와 signature가 모두 맞아도 payload는 평문입니다. Identity key를 복원했다는 사실과 UDP source address로 실제 응답할 수 있다는 사실도 endpoint proof 전까지는 별개입니다."
        />

        <AlgorithmBlock
          title="수신한 discv4 datagram을 type handler에 넘기기 전 검사"
          input={[
            "packet bytes, UDP source endpoint",
            "packet_limit=1280, fixed_envelope=98",
          ]}
          steps={[
            {
              code: "if len(packet) > 1280 or len(packet) <= 98: reject_length",
              note: "고정 envelope 뒤에 type별 RLP payload가 있어야 합니다.",
            },
            {
              code: "received_hash = packet[0:32]; signed_bytes = packet[32:]",
              note: "Hash 비교 대상에는 65-byte signature도 포함됩니다.",
            },
            {
              code: "if keccak256(signed_bytes) != received_hash: reject_hash",
              note: "손상되거나 discv4 framing이 아닌 datagram을 여기서 거릅니다.",
            },
            {
              code: "sender_key = recover(packet[32:97], keccak256(packet[97:]))",
              note: "Type과 RLP data를 서명한 identity public key를 복원합니다.",
            },
            {
              code: "message = rlp_decode_by_type(packet[97], packet[98:])",
              note: "알 수 없는 type, 잘못된 RLP, 만료된 request는 type 정책에 따라 거절합니다.",
            },
            {
              code: "dispatch(message, sender_key, udp_source)",
              note: "Reply token·pending request·endpoint proof 같은 검사는 각 handler가 이어서 수행합니다.",
            },
          ]}
          output="typed packet + recovered sender identity, or typed reject reason"
        />

        <CitationBlock
          source="Ethereum devp2p — Node Discovery Protocol v4 · pinned spec"
          citeKey={1}
          href="https://github.com/ethereum/devp2p/blob/0b3b679be294324eb893340461c7c51fb4c15864/discv4.md"
        >
          <p id="paper-devp2p-v4" className="text-sm leading-6">
            Commit 0b3b679의 protocol version 4 문서에서 1280-byte 상한, signed
            plaintext envelope, six packet types, endpoint proof와 recursive
            lookup semantics를 사용합니다. RLPx·chain compatibility·Sybil 부재를
            이 규격의 보장으로 확대하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="handshake" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          PING/PONG은 양쪽 주소를 따로 증명하며 session key를 만들지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 Bob에게 보낸 PING의 전체 packet hash가 <code>H_A</code>
            입니다. Bob의 PONG <code>reply-token</code>이 H_A와 같고
            signature·expiration이 맞으면 Alice는 “Bob identity가 이 UDP
            source에서 내 요청에 응답했다”고 연결할 수 있습니다. PONG의{" "}
            <code>to</code>에는 Bob이 관측한 Alice의 UDP envelope address가
            들어가 NAT 바깥 주소를 아는 데도 쓰입니다.
          </p>
          <p>
            그러나 Bob이 Alice에게 큰 NEIGHBORS 응답을 보내려면 반대 방향
            proof가 필요합니다. Bob이 PING H_B를 보내고 Alice가 H_B를 담은
            PONG을 돌려줘야 Bob 쪽 recent-PONG 기록이 생깁니다. Spec의 window는
            최근 12시간입니다. 이 gate는 공격자가 피해자 주소를 source로 꾸며
            작은 FINDNODE를 보내고 큰 응답을 피해자에게 몰아주는 amplification을
            줄입니다.
          </p>
          <p>
            이 왕복은 TLS 같은 handshake가 아닙니다. Shared secret도,
            encryption도, forward secrecy도 만들지 않습니다. Timeout은 악성
            판정이 아니라 UDP loss·NAT mapping 변경·clock skew와 함께 typed
            outcome으로 남겨야 합니다. Absolute expiration은 clock이 틀리면 정상
            packet도 expired로 보일 수 있다는 알려진 한계가 있습니다.
          </p>
        </div>
      </section>

      <section id="findnode" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          가까운 16개 연락처는 12개와 4개, 두 UDP packet으로 돌아옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            FINDNODE의 target은 압축된 33-byte ENR key가 아니라
            <strong> 64-byte uncompressed secp256k1 public key</strong>입니다.
            Bob은 이 64 byte를 Keccak-256해 32-byte target ID로 만든 뒤 local
            table에서 가까운 최대 16개를 고릅니다.
          </p>
        </div>

        <CalculationWalkthrough
          title="NEIGHBORS packet 분할 장부"
          question="가까운 contact 16개를 왜 12개와 4개로 나눌까요?"
          scope="go-ethereum v1.17.8의 bucketSize=16과 v4wire.MaxNeighbors=12를 적용합니다."
          steps={[
            {
              label: "Lookup이 원하는 contact 수를 적습니다",
              expression: "bucketSize = 16",
              result: "최대 16 contacts",
              reason:
                "Bob의 table handler가 target에 가까운 결과를 최대 16개 고릅니다.",
            },
            {
              label: "Datagram 하나의 구현 상한을 적습니다",
              expression: "MaxNeighbors = 12",
              result: "packet당 최대 12 contacts",
              reason:
                "최대 크기 node를 넣어도 discv4 packet 1280 byte를 넘지 않게 계산한 v1.17.8 상수입니다.",
            },
            {
              label: "필요한 packet 수를 올림합니다",
              expression: "ceil(16 ÷ 12)",
              result: "2 packets",
              reason:
                "한 packet으로 16개를 모두 담을 수 없으므로 두 번째 packet이 필요합니다.",
            },
            {
              label: "첫 packet 뒤 남은 수를 구합니다",
              expression: "16 − 12",
              result: "12 contacts + 4 contacts",
              reason:
                "Fixture에서는 첫 NEIGHBORS에 12개, 두 번째에 나머지 4개가 옵니다.",
            },
          ]}
          conclusion="FINDNODE 한 번의 응답은 UDP datagram 한 개라는 뜻이 아닙니다. geth v1.17.8 fixture의 16 contacts는 12+4 두 NEIGHBORS packet으로 수신합니다."
          caveats={[
            "Bob의 table에 유효 contact가 16개보다 적으면 한 packet만 오거나 빈 packet이 올 수 있습니다.",
            "다른 client revision의 packet 분할 상수는 해당 source에서 다시 확인해야 합니다.",
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice는 같은 Bob identity·source IP의 pending FINDNODE에 매칭되는
            NEIGHBORS만 받고, expiration과 각 node의 IP·UDP·TCP·public key를
            검사합니다. go-ethereum v1.17.8 matcher는 raw contact를 받은 수가
            16에 이르면 request를 끝냅니다. Invalid contact는 result에 넣지
            않지만 raw receive count에는 포함된다는 구현 경계도 있습니다.
          </p>
          <p>
            Bob에게 유효 contact가 16개보다 적으면 첫 NEIGHBORS 뒤 matcher가
            다음 packet을 기다리다 timeout될 수 있습니다. 이 release는 packet을
            하나라도 받았다면 그 timeout을 오류로 반환하지 않고 지금까지 모은
            valid nodes를 사용합니다. 따라서 “응답 성공”과 “16개를 모두 받음”을
            같은 metric으로 세면 안 됩니다.
          </p>
          <p>
            받은 후보를 다음에 누구에게 물을지는{" "}
            <Link to="/cs/p2p/kad-lookup">Kademlia lookup</Link>의
            seen·asked·in-flight 상태가 결정합니다. Discv4는 query와 reply의
            wire를 제공하고, common lookup pump가 α개 query slot과 거리순
            result를 관리합니다.
          </p>
        </div>

        <CitationBlock
          source="go-ethereum v1.17.8 — v4_udp.go and v4wire.go"
          citeKey={2}
          type="code"
          href="https://github.com/ethereum/go-ethereum/blob/v1.17.8/p2p/discover/v4_udp.go"
        >
          <p id="paper-geth-v4-wire" className="text-sm leading-6">
            고정 release의 bucketSize=16, MaxNeighbors=12, multi-packet matcher,
            endpoint-proof gate와 partial reply timeout 처리를 적용했습니다.
            Moving master나 다른 client의 고정 동작으로 일반화하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="enr" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          ENR sequence 8은 새 record를 가져오라는 신호이지, 새 주소의 증명은
          아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Candidate C의 cached ENR sequence가 7인데 PING/PONG이 8을 알렸다고
            하겠습니다. Alice는 ENRREQUEST packet을 보내고 그 packet hash
            <code>H_R</code>을 보관합니다. Bob의 ENRRESPONSE
            <code>reply-token</code>이 H_R과 같아야 이 요청의 답으로 받습니다.
          </p>
          <p>
            그다음 record 자체를 v4 identity scheme으로 검증하고, record에서
            얻은 node ID가 요청한 C와 같은지 확인합니다. Sequence가 cached
            record보다 작으면 기존 record를 유지합니다. 새 IP가 relay-address
            규칙에 맞는지도 확인한 뒤에야 endpoint cache를 바꿉니다. Sequence
            숫자만 큰 unsigned record는 아무 권한도 없습니다.
          </p>
          <p>
            ENR은 <code>[signature, seq, k, v, ...]</code> RLP list이며 key는
            정렬되고 중복이 없어야 합니다. Current specification의 encoded-size
            상한은 300 byte입니다. IP와 port가 아예 없는 record도 signature가
            맞으면 형식상 valid할 수 있으므로, valid ENR와 dial 가능한
            endpoint도 구분해야 합니다.
          </p>
          <p>
            운영 receipt에는 packet type·sender identity·UDP source, request
            hash, expiration, reject reason, raw/valid NEIGHBORS 수, ENR old/new
            sequence와 최종 dial outcome을 같은 discovery ID로 묶습니다. p95·p99
            discovery latency가 나빠졌을 때 proof 왕복, partial NEIGHBORS
            timeout, ENR refresh, RLPx dial 중 어디가 늘었는지 이 경계로
            나눕니다.
          </p>
        </div>

        <CitationBlock
          source="Ethereum devp2p — Ethereum Node Records · pinned spec"
          citeKey={3}
          href="https://github.com/ethereum/devp2p/blob/e0091d1140bddce2a9805047b94110d3ad439e6e/enr.md"
        >
          <p id="paper-enr" className="text-sm leading-6">
            Commit e0091d1의 ENR specification에서 64-bit sequence, sorted
            unique key/value, v4 identity signature와 300-byte encoded limit을
            사용합니다. 높은 sequence를 reachability·honesty·최신 network view의
            증명으로 확대하지 않습니다.
          </p>
        </CitationBlock>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>배포 전에 같은 fixture로 확인할 예측</h3>
          <ul>
            <li>
              Bob이 Alice의 recent PONG을 갖지 못하면 FINDNODE에 NEIGHBORS를
              보내지 않습니다.
            </li>
            <li>
              16 contacts는 v1.17.8에서 12+4 두 packet으로 오고, 한 packet만
              와도 valid partial result는 남습니다.
            </li>
            <li>
              ENRRESPONSE token이 H_R과 다르거나 record ID가 C와 다르면 cache를
              바꾸지 않습니다.
            </li>
            <li>
              Discovery가 성공해도 뒤 RLPx/TCP dial과 chain handshake는 별도로
              실패할 수 있습니다.
            </li>
          </ul>
          <p>
            Network view를 한 source가 장악하는 Sybil·Eclipse 문제는{" "}
            <Link to="/cs/p2p/dht-security">DHT 보안</Link>이 소유합니다.
            여기서는 packet 한 개가 어떤 검사를 통과해 dial 후보가 되는지만
            끝까지 추적했습니다.
          </p>
        </div>
      </section>
    </>
  );
}
