import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Nakamoto 최장 체인 합의</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          2008년 Satoshi Nakamoto 논문에서 제시된 <strong>open-membership 합의</strong>.<br />
          누구나 참여 가능, 사전 신원 확인 없음, 확률적 최종성.<br />
          BFT와 정반대 철학 — liveness 우선, safety는 시간으로 확률적 보장.
        </p>

        {/* ── Nakamoto Consensus 핵심 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Nakamoto Consensus 핵심 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Nakamoto Consensus (Bitcoin 2008):
//
// 4가지 요소:
// 1. Proof of Work (Sybil 저항)
// 2. Longest chain rule (포크 해결)
// 3. Probabilistic finality (확률적 최종성)
// 4. Open membership (누구나 참여)
//
// 핵심 가정:
// - 정직 해시파워 > 50%
// - 네트워크 partition 없음 (weak synchrony)
// - 대부분 노드가 최신 블록 수신

// 프로토콜:
// 1. miner가 block 마다 nonce brute-force
// 2. hash(block) < target 만족 시 block 발견
// 3. network에 broadcast
// 4. 다른 노드는 longest chain 위에서 작업 계속
// 5. fork 발생 시 더 긴 체인 선택

// 왜 동작하는가:
// - 정직 miner 51%+ 가정
// - 긴 체인 만들려면 누적 work 더 많아야
// - 공격자는 정직 miner 따라잡기 불가
// - 시간이 지날수록 reorg 확률 기하급수 감소

// Safety vs Liveness:
// - Liveness: 항상 보장 (block 계속 생성)
// - Safety: probabilistic (k confirmation 후 1-ε)
// - k=6: 99.9%+ 확률 안전 (Bitcoin 기본)

// 블록체인 매핑:
// - Bitcoin: PoW + longest chain
// - Ethereum (pre-merge): PoW + GHOST (변형)
// - Litecoin, Dogecoin: Bitcoin 계승
// - Ethereum 2.0: longest chain + BFT finality`}
        </pre>
        <p className="leading-7">
          PoW가 <strong>Sybil 저항</strong>, longest chain이 <strong>포크 해결</strong>.<br />
          사전 validator 등록 없음 — 누구나 해시파워만 있으면 참여.<br />
          이것이 permissionless 블록체인을 가능케 한 혁신.
        </p>

        {/* ── PoW 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Proof of Work 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bitcoin PoW 알고리즘:

// block header 구조:
// struct BlockHeader {
//     version: u32,          // protocol version
//     prev_hash: [u8; 32],   // 이전 block hash
//     merkle_root: [u8; 32], // TX merkle tree root
//     timestamp: u32,        // UTC timestamp
//     bits: u32,             // 난이도 encoded
//     nonce: u32,            // 찾아야 할 값
// }

// Mining loop:
while True:
    header.nonce = rand()
    h = sha256(sha256(header))
    if h < target(bits):
        // 성공! block broadcast
        broadcast(block)
        break

// 난이도 조정:
// Bitcoin: 2016 블록마다 재계산
// target_new = target_old * (actual_time / expected_time)
// expected_time = 2016 * 10분 = 2주
// 목표: 평균 10분/block 유지

// 해시파워 경쟁:
// - 1 hash: 1/2^256 확률 (무시 가능)
// - 1 TH/s = 10^12 hash/s
// - 전체 Bitcoin: 500 EH/s (500 × 10^18)
// - 평균 10분에 1 block
// - 누적 work = Σ(1/target_i)

// 공격 비용:
// 51% 공격:
// - 전체 해시파워 반 필요
// - Bitcoin: 250 EH/s 필요
// - ASIC 장비 수십억 달러
// - 지속 운영 전력 수백 MW
// - 공격 성공 시 코인 가치 폭락 (자기 파괴)`}
        </pre>
        <p className="leading-7">
          PoW = <strong>해시 복권</strong> — 해시파워 비례 block 생성 확률.<br />
          난이도 자동 조정으로 10분/block 유지.<br />
          51% 공격은 이론 가능하지만 경제적 비합리적.
        </p>

        {/* ── Fork 해결 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fork 발생과 해결</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fork 발생 조건:
// - 두 miner가 거의 동시에 block 생성
// - 네트워크 지연으로 서로 다른 체인 형성
// - 일시적 상태 불일치

// 시나리오:
// block #100까지 공통
// miner A: block #101_A 생성 → propagate
// miner B: block #101_B 생성 → propagate
// 네트워크 일부는 #101_A 먼저 수신, 일부는 #101_B

// Fork 해결 (다음 block):
// miner X가 #102 생성:
// - #101_A 기반: #101_A → #102
// - #101_B 기반: #101_B → #102
// 더 빨리 #102 나온 쪽이 longest chain

// 결과:
// - winning chain: 2+ block
// - losing chain: 1 block (orphan)
// - orphan의 TX는 다시 mempool
// - coinbase 보상 잃음 (miner 손실)

// Selfish mining 공격:
// - 공격자가 block 발견해도 감춤
// - 비밀 체인 구축
// - 정직 miner 따라잡으면 공개
// - 정직 miner block orphan화
// - 공격자 해시파워 비율 크게 만듬
// - 이론: 25%+ 해시파워로 이득 가능

// Ethereum의 uncle block (GHOST):
// - orphan block도 부분 보상
// - 공격 인센티브 완화
// - 체인 가중치에 uncle work 포함
// - Nakamoto longest chain의 개선판

// 실제 빈도:
// Bitcoin: 1-2 orphan/1000 blocks
// Ethereum (pre-merge): 5-10% uncle rate
// 짧은 blocktime → fork 많음`}
        </pre>
        <p className="leading-7">
          Fork는 <strong>자연 현상</strong> — 네트워크 지연으로 불가피.<br />
          longest chain 규칙으로 시간이 지나면 자동 수렴.<br />
          Ethereum GHOST는 uncle reward로 orphan 손실 완화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 사전 vs 사후 합의</strong> — BFT와 Nakamoto의 철학 차이.<br />
          BFT: 투표로 사전 합의 → 즉시 finalize.<br />
          Nakamoto: 누구나 block 제안 → 시간이 해결 → 확률적 finalize.<br />
          BFT는 멤버십 제한 + 낮은 지연, Nakamoto는 open + 긴 지연.
        </p>
      </div>
    </section>
  );
}
