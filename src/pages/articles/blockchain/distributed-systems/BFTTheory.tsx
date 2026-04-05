import ByzantineViz from './viz/ByzantineViz';

export default function BFTTheory() {
  return (
    <section id="bft-theory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Byzantine 장군 문제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lamport, Shostak, Pease(1982) — 배신자가 있는 분산 합의의 형식화. n명 중 f명이 악의적일 때 합의 가능 조건.
        </p>
      </div>
      <div className="not-prose"><ByzantineViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Byzantine Generals Problem</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Byzantine Generals Problem (Lamport, Shostak, Pease 1982)
//
// 시나리오:
//   n명의 장군이 도시 포위
//   결정: 공격 vs 후퇴
//   일부는 배신자 (악의적)
//   목표: 정직한 장군끼리 같은 결정
//
// 조건:
//   - 모든 정직한 장군이 같은 계획
//   - 정직한 장군이 계획 제안하면 모두 따름
//
// 핵심 정리:
//   n ≥ 3f + 1
//   (f = 최대 Byzantine 노드 수)
//
//   예:
//     f=1: n≥4
//     f=2: n≥7
//     f=3: n≥10
//
//   → 1/3 미만의 악의적 노드만 허용

// 왜 3f+1?
//
// 증명 스케치:
//   n = 3f 인 경우:
//     정직한 노드 2f
//     악의적 f
//
//   악의적 노드 배치:
//     가상 분할 시나리오 구성 가능
//     정직한 노드들 다른 결정 유도
//   → impossible
//
// n = 3f+1 일 때:
//   다수결: 2f+1 > f
//   quorum intersection 보장됨

// PBFT (Castro-Liskov 1999):
//
// 3-phase protocol:
//   1. Pre-prepare: leader가 제안
//   2. Prepare: 모두 검증, 2f+1 prepare 수집
//   3. Commit: 2f+1 commit 수집 → finalize
//
// View Change:
//   Leader 악의적 → 새 leader
//   2f+1 view change 메시지 필요
//
// 통신 복잡도:
//   Normal: O(n²)
//   View change: O(n³)

// 현대 BFT 개선:
//
// Tendermint (2016):
//   2-phase (pre-vote + pre-commit)
//   Instant finality
//   Cosmos, Binance Chain
//
// HotStuff (2019):
//   Linear view change O(n)
//   Pipelining
//   Diem (Meta), Aptos, Sui
//
// Fast BFT variants:
//   SBFT, Mir-BFT, Narwhal+Bullshark
//   Scalability 개선

// 블록체인 관점:
//   PoW: "economic Byzantine" via cost
//   PoS: slashing + BFT finality gadget
//   DPoS: limited validator set + BFT
//   BFT-direct: Tendermint, HotStuff

// Limit:
//   n ≥ 3f+1 은 asynchronous BFT의 tight bound
//   Synchronous: n ≥ 2f+1 (다수결) 가능`}
        </pre>
      </div>
    </section>
  );
}
