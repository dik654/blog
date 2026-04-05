export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: DHT 공격 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DHT는 공개 네트워크이므로 누구나 참여할 수 있다. 이것이 공격 표면이 된다.
          <br />
          주요 공격: Sybil(가짜 노드 대량 생성), Eclipse(특정 노드를 악성 피어로 포위).
        </p>
        <p>
          go-ethereum은 여러 방어를 구현한다:
          <br />
          <strong>IP 쿼터</strong> — 같은 /24 서브넷에서 버킷당 2개, 테이블 전체 10개까지만.
          <br />
          <strong>재검증</strong> — 죽은 노드를 빠르게 걸러내어 공격자가 테이블을 장악하기 어렵게.
          <br />
          <strong>Kademlia 자체 특성</strong> — 노드 ID가 제곱근적으로 분포하여 특정 영역 독점이 어려움.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DHT Attack Landscape</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// DHT 공격 카테고리

// 1. Sybil Attack (1자가 다수 ID 생성)
// 공격자가 수천~수만 fake nodes 배포
// Goal: routing table dominance
// Ethereum: node ID = hash(pubkey) 제한

// 2. Eclipse Attack (target 격리)
// Target의 routing table을 공격자 노드로 채움
// Result: target isolated, sees only attacker's view
// Vulnerabilities: bootstrap poisoning, ID grinding

// 3. Routing Table Poisoning
// Inject fake nodes into target's table
// Manipulate k-bucket contents
// Gradual takeover (slow eclipse)

// 4. ID Grinding
// Brute force node IDs close to target
// 2^256 space makes this hard (but possible)
// Use: pre-eclipse preparation

// 5. Denial of Service
// Packet flooding
// Amplification attacks (discv4 vulnerable)
// FINDNODE spam

// 6. Message Manipulation
// Lying about known nodes
// False routing information
// Not forwarding messages

// 7. Data Spoofing
// In data-storing DHT (not Ethereum)
// Return wrong data for key
// Need content verification`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Ethereum의 방어 기법</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// geth Table 방어 (p2p/discover/table.go)

// 1) IP Quota
// Per-bucket: max 2 nodes from same /24
// Per-table: max 10 nodes from same /24
// Rationale: 단일 /24 subnet에 100+ nodes 의심

const IPBucketLimit = 2;
const IPTableLimit = 10;

// 2) Revalidation (health check)
// Periodic PING to random nodes
// Dead nodes evicted quickly
// Revalidation interval: ~10 seconds

// 3) Bucket Filling Strategy
// New node insertion checks:
// - IP not in bucket >= 2 times
// - IP not in table >= 10 times
// - Signature valid
// - Not in blacklist

// 4) Limited Seen Requirement
// Node must PONG before added to table
// Proof-of-responsiveness
// Filters out scanners/crawlers

// 5) Bucket Refresh
// Each bucket refreshed every hour
// Lookup random ID in bucket's distance range
// Keeps table diverse

// 6) Endpoint Proof
// PING-PONG required before any FINDNODE
// Proves node can receive UDP
// Prevents address forgery`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">방어의 한계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 현재 방어의 한계

// IP Quota 우회
// - Attacker controls many IPs
// - Cloud providers: cheap diverse IPs
// - IPv6: huge address space
// - 100 /24 subnets = 1000 nodes in same table

// Bucket Fill Time
// - New buckets fill slowly
// - Attacker can time insertions
// - Fresh nodes vulnerable

// Botnet-scale Sybils
// - 10K+ compromised devices
// - Diverse IPs naturally
// - 예: Meris botnet (2021)

// 연구 방어 (not yet in Ethereum)
// 1) Proof-of-Work on node creation
// 2) Cryptographic stake (deposit to participate)
// 3) Trust graphs (social proof)
// 4) Machine learning anomaly detection
// 5) Formal verification of routing

// Academic attacks (2020~)
// - "Eclipse Attacks on Ethereum's P2P Network" (USENIX 2018)
// - "Low-Resource Eclipse Attacks" (NDSS 2020)
// - "TxProbe: Discovering Bitcoin's Network Topology Using Orphan Transactions" (FC 2020)

// Takeaway
// Perfect DHT security is theoretically difficult
// Current defenses: good enough for Ethereum mainnet scale
// Active research area`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DHT Security의 Trade-off</p>
          <p>
            <strong>완벽한 방어는 불가능</strong>:<br />
            - Open participation 원칙 vs 공격 저항<br />
            - Decentralization vs 강한 identity<br />
            - Performance vs overhead
          </p>
          <p className="mt-2">
            <strong>Ethereum의 접근</strong>:<br />
            ✓ Defense in depth (여러 layer)<br />
            ✓ Economic cost to attack (gas, infrastructure)<br />
            ✓ Monitoring & response<br />
            ✓ Gradual improvement
          </p>
          <p className="mt-2">
            <strong>장기 방향</strong>:<br />
            - Crypto-economic security (stake-based)<br />
            - ZK proofs of honest behavior<br />
            - TEE-attested routing
          </p>
        </div>

      </div>
    </section>
  );
}
