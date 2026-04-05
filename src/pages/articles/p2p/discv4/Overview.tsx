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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Discv4 = "Discovery Protocol v4"
// Ethereum 최초 node discovery (2016~)

// 설계 목표
// - Decentralized peer discovery
// - No central bootstrap server 의존
// - UDP 기반 (fast, stateless)
// - Byzantine 저항 (Sybil 대응)

// 기반 기술
// Kademlia DHT (2002, Maymounkov & Mazières)
// - XOR distance metric
// - k-buckets (k=16)
// - O(log n) lookup
// - Probabilistic routing

// Ethereum 특화 변형
// - 256-bit node ID (Keccak of pubkey)
// - ECDSA signatures on packets
// - 1280 byte packet size limit
// - UDP port 30303 (default)

// Packet types
// 0x01 PING      - liveness check
// 0x02 PONG      - response to ping
// 0x03 FINDNODE  - "누가 ID에 가까운지?"
// 0x04 NEIGHBORS - list of nearby nodes
// 0x05 ENRREQUEST - Ethereum Node Record 요청
// 0x06 ENRRESPONSE - ENR 응답

// 한계 (discv5에서 개선)
// - Signature만 (no encryption)
// - Amplification attack 가능 (small req → large resp)
// - Topic discovery 없음`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Packet 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Packet format (wire)
//
// ┌─────────────────────────────────────────────┐
// │ MAC (32 bytes)                              │
// │ = keccak256(signature || payload)           │
// ├─────────────────────────────────────────────┤
// │ Signature (65 bytes)                        │
// │ = ECDSA_sign(keccak256(type || payload))   │
// ├─────────────────────────────────────────────┤
// │ Type (1 byte)                               │
// │ 0x01=PING 0x02=PONG 0x03=FINDNODE ...       │
// ├─────────────────────────────────────────────┤
// │ Payload (RLP encoded, variable)             │
// │ Packet-specific fields                      │
// └─────────────────────────────────────────────┘
// Total: 98 bytes header + payload

// Signature verification
// 1) Receive packet
// 2) Verify MAC: hash(sig || payload) == mac_field
// 3) Recover pubkey from signature
// 4) Pubkey → node_id (keccak256)

// 핵심: sender identity 자동 도출
// - 별도 handshake 불필요
// - Every packet self-authenticating

// Size limits
// - Max UDP packet: 1280 bytes
// - NEIGHBORS response: ~16 nodes × 79 bytes = 1264 bytes
// - Careful sizing to fit IP MTU`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kademlia in Ethereum Discovery</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Kademlia XOR metric
// distance(a, b) = a XOR b

// 왜 XOR?
// - Symmetric: d(a,b) = d(b,a)
// - Unidirectional (triangle inequality 변형)
// - No concentric neighborhoods
// - Routing table 구성 쉬움

// K-buckets (bucket size k=16)
// - Node ID space = 2^256
// - 256 buckets, one per distance range
// - Bucket[i]: distance in [2^i, 2^(i+1))
// - LRU eviction when full

// Routing table example
// Our node ID: 0x1234...
// Bucket[0]: nodes with ID ending in opposite bit (distance 2^0-2^1)
// Bucket[255]: nodes very close to us (distance 2^255-2^256)

// Lookup algorithm
// "Find closest nodes to target T"
// 1) Query 3 closest known nodes
// 2) Each returns their closest nodes
// 3) Repeat with new closer nodes
// 4) O(log n) rounds

// 성능
// - Routing table size: O(k × log n)
// - Ethereum mainnet: ~16 buckets populated × 16 nodes = ~256 total
// - Small memory footprint
// - Query latency: 3-5 rounds typical`}</pre>

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
