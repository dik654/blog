import SimplexViz from './viz/SimplexViz';

export default function Simplex() {
  return (
    <section id="simplex" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Simplex Consensus</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Benjamin Chan · Rafael Pass가 TCC 2023에서 발표한 BFT 프로토콜
          <br />
          PBFT(1999) → Tendermint(2014) → HotStuff(2018) → <strong>Simplex(2023)</strong> 계보의 최신 합의
        </p>
        <p className="leading-7">
          4가지 핵심 혁신:
          <br />
          <strong>즉시 View 전환</strong> — Cert(k, x) 수집 즉시 view k+1로 이동. 기존처럼 머무르며 View-change 전송 불가
          <br />
          <strong>No-Commit 증명</strong> — n-f개 View-change(k) = 해당 view에서 결정 없었음을 증명
          <br />
          <strong>리더 대기 제거</strong> — 기존 2Δ 대기 완전 제거. 리더는 즉시 제안
          <br />
          <strong>짧은 Timeout</strong> — View-change timeout 6Δ → 3Δ로 단축
        </p>
        <p className="leading-7">
          Commonware의 <code>consensus::simplex</code>가 프로덕션 구현
          <br />
          <code>consensus::threshold_simplex</code> — VRF + BLS 임계 서명 추가 변형
        </p>
      </div>
      <div className="not-prose mb-8"><SimplexViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">BFT Consensus 계보</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// BFT consensus 진화

// PBFT (1999, Castro & Liskov)
// - 첫 실용적 BFT
// - 3 phases (pre-prepare, prepare, commit)
// - Quadratic O(n²) view change
// - 37 pages paper

// Tendermint (2014, Buchman)
// - Practical BFT for blockchain
// - Locking mechanism for safety
// - Used in Cosmos, Celestia
// - Higher latency

// HotStuff (2018, Yin et al.)
// - Linear view change O(n)
// - 3-chain commit
// - Pipeline possible (Chained HotStuff)
// - Used by Diem/Aptos

// HotStuff-2 / Fast-HotStuff (2022)
// - 2-chain commit (optimistic)
// - Better latency

// Simplex (2023, Chan & Pass)
// - 2 round optimal (happy path)
// - O(n²) messages but simpler proofs
// - 15 pages paper
// - Fast view change (3Δ vs 6Δ)

// Trade-offs
// Simplex: simplicity + speed
// HotStuff: scalability (linear view change)
// Tendermint: battle-tested`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Simplex 라운드 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Simplex 2-round (happy path)

// Round 1: Propose + Vote
// 1) Leader broadcasts Propose(k, block)
// 2) Each replica:
//    - Verify block
//    - Vote for block if valid
//    - Broadcast Vote(k, block_hash)
// 3) On 2f+1 votes: form Cert(k, block_hash)

// Round 2: Finalize
// 1) Any replica sees Cert(k, block_hash)
// 2) Broadcasts Finalize(k, block_hash)
// 3) On 2f+1 Finalize: block committed
// 4) IMMEDIATELY transition to view k+1

// Key innovation: 즉시 view 전환
// - Cert 받으면 바로 k+1 진입
// - 과거 view에서 추가 vote/lock 불필요
// - Linear messaging in happy path

// Unhappy path: View change
// 1) Timer expires without Cert(k)
// 2) Broadcast ViewChange(k)
// 3) 2f+1 ViewChange → No-Commit proof for k
// 4) Start view k+1 with new leader

// Safety
// - No conflicting Cert in same view
// - Block committed in view k → remains committed
// - View change cannot rewrite history

// Liveness
// - Good leader → progress
// - Faulty leader → 3Δ timeout → view change
// - GST (global stabilization time) 후 progress guaranteed`}</pre>

      </div>
    </section>
  );
}
