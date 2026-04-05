import BroadcastViz from './viz/BroadcastViz';

export default function Broadcast() {
  return (
    <section id="broadcast" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">브로드캐스트 & DSMR</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          기존 블록체인 데이터 전파: 리더가 전체 블록을 모든 검증자에게 전송
          <br />
          문제 — 대역폭 낭비(중복 전송), 리더 병목(단일 노드 의존), 리더 비응답 시 성능 저하
        </p>
        <p className="leading-7">
          <strong>ordered_broadcast</strong> — Commonware의 데이터 전파 프리미티브
          <br />
          합의와 분리: 브로드캐스트는 합의 없이 독립적으로 동작
          <br />
          다중 시퀀서: 리더 병목 없이 병렬 데이터 전파
          <br />
          연결된 인증서: 각 메시지가 이전 메시지의 임계 서명을 포함 — Pre-Consensus Receipt
        </p>
        <p className="leading-7">
          <strong>DSMR</strong>(Decoupled State Machine Replication) — Replicate → Sequence → Execute를 독립 단계로 분리
          <br />
          <strong>ZODA</strong>(Zero-Overhead Data Availability) — Reed-Solomon 인코딩으로 샤드 분할, 신뢰 설정 불필요
        </p>
      </div>
      <div className="not-prose mb-8"><BroadcastViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">DSMR Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Decoupled State Machine Replication
// 전통 BFT의 monolithic 구조 분해

// 전통 SMR (Tendermint, HotStuff)
// ┌──────────────────────────┐
// │ Consensus + Execution    │
// │ Block proposal           │
// │   → Vote                 │
// │   → Commit               │
// │   → Execute              │
// │ All sequential           │
// └──────────────────────────┘
// 문제: 병목 쉬움, 전체 재시작

// DSMR 구조
// Phase 1: Replicate (data availability)
// ┌──────────────────────────┐
// │ Multiple sequencers      │
// │ Parallel data broadcast  │
// │ Threshold signatures     │
// └──────────────────────────┘
//
// Phase 2: Sequence (ordering)
// ┌──────────────────────────┐
// │ BFT consensus only on order │
// │ Not data content         │
// └──────────────────────────┘
//
// Phase 3: Execute (state transition)
// ┌──────────────────────────┐
// │ Deterministic execution  │
// │ Can be batched/parallel  │
// └──────────────────────────┘

// 장점
// ✓ Horizontal scaling (multiple sequencers)
// ✓ Execution parallelism
// ✓ Data availability separate concern
// ✓ Modular composability

// Related work
// - Narwhal/Bullshark (Aptos, Sui)
// - Celestia DA layer
// - EigenDA`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ZODA Data Availability</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Zero-Overhead Data Availability

// Problem: 블록 데이터 저장 분산
// - Large blocks (MBs~GBs)
// - Not every node can store all
// - Need: "data is available" 증명

// ZODA 해결책
// 1) Reed-Solomon encoding
//    - n data chunks → n+k encoded chunks
//    - Any n chunks can recover original
//    - Redundancy factor: (n+k)/n

// 2) Horizontal sharding
//    - Each node stores subset of chunks
//    - Probabilistic sampling for verification
//    - O(sqrt(n)) verification

// 3) No trusted setup
//    - 기존 DA (KZG-based) needs trusted setup
//    - ZODA uses hash-based commitments
//    - Transparent, post-quantum secure

// 4) Fraud proofs
//    - Light client sampling
//    - Invalid encoding → proof submittable
//    - Cryptoeconomic security

// 성능 지표
// - 1GB block with 100 validators
// - Each stores: ~20MB (2%)
// - Sample verification: O(log n)
// - Recovery: with 30% validators`}</pre>

      </div>
    </section>
  );
}
