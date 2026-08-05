import Discv4HistoryViz from './viz/Discv4HistoryViz';
import Discv4PacketStructViz from './viz/Discv4PacketStructViz';
import KademliaXorViz from './viz/KademliaXorViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 & 패킷 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          discv4 = Ethereum의 첫 번째 노드 발견 프로토콜. Kademlia DHT 위에 구축된 UDP 기반 프로토콜.
          <br />
          모든 패킷이 ECDSA 서명되어 발신자 인증. 최대 1280바이트.
        </p>
        <p>
          패킷 구조: <code>[32B MAC][64B Signature][1B Type][RLP Payload]</code>
          <br />
          MAC = keccak256(signature + payload) — 무결성 검증.
          <br />
          Signature = ECDSA(sha3(type + payload)) — 발신자 공개키 복원 가능.
        </p>
        <p>
          6가지 패킷 타입: PING, PONG, FINDNODE, NEIGHBORS, ENRREQUEST, ENRRESPONSE.
          <br />
          go-ethereum <code>v4wire/v4wire.go</code>에서 인코딩/디코딩 구현.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">discv4 프로토콜 역사</h3>
        <div className="not-prose mb-4"><Discv4HistoryViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Packet 구조 상세</h3>
        <div className="not-prose mb-4"><Discv4PacketStructViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kademlia in Ethereum Discovery</h3>
        <div className="not-prose mb-4"><KademliaXorViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: discv4의 단순성과 한계</p>
          <p>
            <strong>설계 단순성</strong>: ~1000 lines Go code로 구현 가능<br />
            <strong>No encryption</strong>: 모든 packet 평문 (signed only)<br />
            <strong>Amplification attack</strong>: 36B FINDNODE → 1000B+ NEIGHBORS<br />
            <strong>Eclipse attack</strong>: k-bucket 조작 가능성
          </p>
          <p className="mt-2">
            <strong>discv5의 개선</strong>:<br />
            - AES-GCM encrypted handshake<br />
            - Session keys per peer<br />
            - Topic discovery (service advertising)<br />
            - Flood control, rate limiting
          </p>
        </div>

      </div>
    </section>
  );
}
