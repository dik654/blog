import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Discv4Article() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          연결할 Ethereum 노드를 찾되, discovery와 transport를 나누기
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice의 새 실행 클라이언트가 bootnode 주소 하나만 알고 시작한다고
            하자. Node Discovery Protocol v4, 즉 discv4는 UDP로 PING/PONG을
            주고받고 Kademlia-like table에서 목표 ID에 가까운 후보를 찾는다.
            여기서 얻는 것은 node identity와 endpoint가 담긴 발견 결과다.
            RLPx 연결, ETH capability 협상, block 동기화는 그 다음 transport와
            application protocol의 책임이다.
          </p>
          <p>
            고정 흐름은 bootnode packet 검증 → endpoint proof → FINDNODE와
            NEIGHBORS → ENR 갱신 → 별도 transport dial이다. 각 UDP packet은
            identity key로 서명되지만 payload는 암호화되지 않는다. 서명된
            endpoint를 받았다는 사실도 그 node가 정직하거나 원하는 chain을
            제공한다는 보장은 아니다.
          </p>
        </div>

        <CitationBlock
          source="Ethereum devp2p — Node Discovery Protocol v4"
          citeKey={1}
          href="https://github.com/ethereum/devp2p/blob/master/discv4.md"
        >
          <div id="paper-devp2p-v4" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> 중앙 directory 없이 Ethereum node endpoint를 찾고 갱신해야 한다.</p>
            <p><strong>기여:</strong> Protocol v4의 identity, table, endpoint proof와 여섯 packet type을 규정한다.</p>
            <p><strong>전제:</strong> 현재 master 문서의 “current protocol version 4”와 배포 구현 revision을 고정한다.</p>
            <p><strong>근거 범위:</strong> discv4 UDP discovery semantics와 1280-byte packet limit에 한정한다.</p>
            <p><strong>비보장:</strong> RLPx 보안, chain compatibility, Sybil·Eclipse 부재나 고정 latency를 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>

      <section id="wire" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">서명된 UDP datagram을 검증하는 순서</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Wire packet은 <code>hash || signature || packet-type || packet-data</code>
            순서다. Hash 32 byte, recoverable signature 65 byte, type 1 byte 뒤에
            RLP list가 온다. 수신자는 최소 길이와 1280-byte 상한을 먼저
            확인하고 hash를 재계산한 뒤, type과 data에 대한 서명에서 public
            key를 복원한다. Hash는 여러 protocol이 같은 UDP port를 쓸 때
            형식을 식별하는 값이며 규격은 그 밖의 보안 목적을 부여하지 않는다.
          </p>
        </div>

        <ExplainedFormula
          question="Packet 앞의 32-byte hash는 정확히 어떤 byte들을 묶는가?"
          idea="서명을 포함한 packet 나머지를 다시 hash하면 손상되거나 다른 framing인 datagram을 먼저 걸러낼 수 있다. Identity 증명은 이 hash가 아니라 뒤의 signature 검증이 맡는다."
          formula={String.raw`h=\operatorname{keccak256}(\sigma\parallel t\parallel d)`}
          annotatedFormula={String.raw`h=\underbrace{\operatorname{keccak256}(\sigma\parallel t\parallel d)}_{\text{Concatenation 계산}}`}
          operations={[
            { expression: String.raw`\operatorname{keccak256}(\sigma\parallel t\parallel d)`, annotation: ["Concatenation이(가) 식의 결과에 기여하는 방식을","계산합니다.","서명을 포함한 packet 나머지를 다시 hash하면","손상되거나 다른 framing인 datagram을 먼저 걸러낼"] },
          ]}
          terms={[
            { symbol: "h", name: "Packet hash", description: "Packet 맨 앞의 32-byte Keccak-256 결과" },
            { symbol: "\\sigma", name: "Recoverable signature", description: "r, s, recovery id를 잇는 65-byte 서명" },
            { symbol: "t", name: "Packet type", description: "PING부터 ENRRESPONSE까지를 구분하는 1 byte" },
            { symbol: "d", name: "Packet data", description: "Packet type별 RLP list와 허용된 trailing bytes" },
            { symbol: "\\parallel", name: "Concatenation", description: "길이와 순서를 바꾸지 않는 byte 연결" },
          ]}
          assumptions={[
            "Keccak-256과 byte 경계는 discv4 규격대로 해석한다.",
            "전체 UDP discovery packet은 1280 byte를 넘지 않는다.",
            "Hash 일치만으로 sender identity나 confidentiality를 주장하지 않는다.",
          ]}
          interpretation="Hash가 일치해야 framing 후보로 처리할 수 있지만, sender는 별도로 sign(t∥d)를 검증해 복원한다. Payload는 평문이고 expiration은 정확한 clock에 의존하므로 replay 방어가 완전하지 않다."
        />
      </section>

      <section id="handshake" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">PING/PONG은 endpoint proof이지 세션 handshake가 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 Bob에게 PING을 보내고, Bob의 PONG에 최근 PING의 hash가
            들어 있으면 Alice는 그 응답을 요청과 맞춘다. 반대 방향에서 Bob도
            Alice의 valid PONG을 최근 12시간 안에 받았을 때 Alice가 discovery에
            실제 참여한다고 본다. 규격이 이 endpoint proof를 요구하는 이유는
            작은 spoofed FINDNODE가 피해자에게 큰 NEIGHBORS traffic을 보내는
            amplification을 줄이기 위해서다.
          </p>
          <p>
            이 과정은 shared session key를 만들지 않고 encryption도 추가하지
            않는다. Timeout이면 “악성”이라고 단정하지 않고 UDP loss, clock,
            endpoint 변경을 나눠 기록한다. Alice는 fresh proof가 필요한 경우
            PING/PONG을 다시 수행한 뒤 FINDNODE를 보낸다.
          </p>
        </div>
      </section>

      <section id="findnode" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">FINDNODE에서 routing 후보를 얻는 경계</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            FINDNODE의 target은 64-byte secp256k1 public key다. Verified sender의
            요청을 받은 Bob은 자기 table에서 target에 가까운 최대 16개 node를
            NEIGHBORS로 답한다. Alice는 packet signature, expiration, endpoint,
            node ID 중복을 확인하고 shortlist에 합친 다음 아직 묻지 않은 가까운
            후보에게 같은 절차를 반복한다.
          </p>
          <p>
            한 응답이 1280 byte를 넘을 수 있어 NEIGHBORS가 여러 datagram으로
            올 수 있으며, UDP에서는 loss와 순서 변경을 예상해야 한다. Lookup의
            shortlist 상태와 종료 receipt는{" "}
            <Link to="/p2p/kad-lookup">Kademlia 반복 탐색</Link>이 정본으로
            다룬다. Discv4는 후보를 찾는 protocol이지 transport 연결 성공을
            반환하는 API가 아니다.
          </p>
        </div>
      </section>

      <section id="enr" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ENR sequence로 endpoint 갱신 여부 판단하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Ethereum Node Record(ENR)는 signature, 64-bit sequence number,
            정렬된 unique key/value pairs로 구성된다. PING/PONG의 optional
            <code>enr-seq</code>가 Alice의 cache보다 크면 ENRREQUEST를 보내고,
            ENRRESPONSE의 request hash와 record signature, response signer가
            같은 identity인지 검증한 뒤 교체한다. Sequence가 크다는 사실만으로
            signature가 맞거나 endpoint가 reachable하다고 볼 수는 없다.
          </p>
          <p>
            갱신된 TCP/UDP endpoint를 얻으면 그제야 별도 transport dial을
            시도한다. Invalid signature는 reject, expired request는 no reply,
            timeout은 retry budget과 다른 candidate로 분류한다. Network view가
            한 source에 갇히는 공격은 <Link to="/p2p/dht-security">DHT 보안</Link>
            에서 다룬다.
          </p>
          <p>
            배포 검증에는 protocol version 4, devp2p spec revision과 확인 날짜,
            client semver·commit SHA를 함께 고정한다. Hash·signature·expiry,
            fresh/stale proof, partial NEIGHBORS, ENR sequence와 dial outcome을
            같은 packet fixture로 비교하고 packet 수·byte·pending state 상한을
            넘으면 canary를 중단해 이전 build로 돌린다.
          </p>
        </div>

        <CitationBlock
          source="Ethereum devp2p — Ethereum Node Records"
          citeKey={2}
          href="https://github.com/ethereum/devp2p/blob/master/enr.md"
        >
          <div id="paper-enr" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> Node identity에 변경 가능한 endpoint와 capability를 결속해야 한다.</p>
            <p><strong>기여:</strong> Signature, uint64 sequence와 sorted unique key/value record 형식을 정의한다.</p>
            <p><strong>전제:</strong> 사용 identity scheme과 record encoding version을 명시한다.</p>
            <p><strong>근거 범위:</strong> ENR structure, signature validation과 monotonic update 판단에 한정한다.</p>
            <p><strong>비보장:</strong> 높은 sequence가 reachability·honesty·최신 network view를 자동 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>
    </>
  );
}
