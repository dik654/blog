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
      </div>
    </section>
  );
}
