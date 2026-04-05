import ConsensusClassViz from './viz/ConsensusClassViz';

export default function ConsensusClass() {
  return (
    <section id="consensus-class" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 알고리즘 분류</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          장애 모델(CFT vs BFT)과 최종성 유형(결정적 vs 확률적)으로 분류.
        </p>
      </div>
      <div className="not-prose"><ConsensusClassViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">합의 알고리즘 분류</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Consensus Algorithm Taxonomy
//
// 1. Fault Model별 분류
//
// CFT (Crash Fault Tolerance):
//   - n ≥ 2f+1 nodes
//   - 노드가 멈추거나 연결 끊김만 허용
//   - 악의적 행동 X
//   예: Paxos, Raft, ZAB (ZooKeeper)
//
// BFT (Byzantine Fault Tolerance):
//   - n ≥ 3f+1 nodes
//   - 악의적 노드 허용
//   - 블록체인 표준
//   예: PBFT, Tendermint, HotStuff

// 2. Finality별 분류
//
// Deterministic Finality:
//   - 한번 확정 = 영원히 유효
//   - 즉시 또는 빠른 finality
//   예: Tendermint, HotStuff, Algorand
//
// Probabilistic Finality:
//   - 시간이 지날수록 확실
//   - Fork 가능성 점차 감소
//   예: Bitcoin (6 confirmations)
//
// Economic Finality:
//   - 롤백 = 경제적 비용
//   - Slashing mechanism
//   예: Ethereum 2.0 Casper

// 3. Leader 선출별
//
// Rotating Leader:
//   - 라운드마다 다른 리더
//   - Round-robin 또는 random
//   예: PBFT, Tendermint
//
// Stable Leader:
//   - 실패 전까지 한 리더
//   - View change on failure
//   예: Paxos, Raft
//
// Leaderless:
//   - 리더 없음
//   - Probabilistic
//   예: Avalanche, Snowflake

// 4. Chain structure별
//
// Linear Chain:
//   - 하나의 체인
//   예: Bitcoin, Ethereum, BFT
//
// DAG (Directed Acyclic Graph):
//   - 병렬 블록
//   - 높은 throughput
//   예: IOTA, Narwhal+Bullshark, Aleph

// 실제 블록체인 매핑:
//
// ┌──────────────┬────────┬──────────────┬──────────────┐
// │  Blockchain  │ Fault  │  Finality    │   Throughput │
// ├──────────────┼────────┼──────────────┼──────────────┤
// │ Bitcoin      │ PoW    │ Probabilistic│ 7 tps        │
// │ Ethereum     │ PoS+BFT│ Deterministic│ 15 tps       │
// │ Solana       │ PoS    │ Probabilistic│ 65K tps      │
// │ Cosmos       │ BFT    │ Deterministic│ ~10K tps     │
// │ Avalanche    │ PoS    │ Probabilistic│ 4500 tps     │
// │ Aptos        │ HotStuff│Deterministic│ ~160K tps   │
// │ Sui          │ DAG BFT │Deterministic│ 120K+ tps   │
// └──────────────┴────────┴──────────────┴──────────────┘

// Trade-offs:
//   Decentralization ↔ Throughput
//   Finality speed ↔ Finality certainty
//   Leader stability ↔ Fairness
//   Chain purity ↔ Parallelism`}
        </pre>
      </div>
    </section>
  );
}
