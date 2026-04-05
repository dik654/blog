import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Mysticeti: Sui 최신 합의</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Mysticeti (Babel-Chursin-Sonnino, 2024) — <strong>Sui의 production 합의</strong>.<br />
          Narwhal+Bullshark의 certificate overhead 제거 → 390ms e2e latency.<br />
          Uncertified DAG + Fast Path 두 혁신.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">설계 목표</h3>
        <p className="leading-7">
          증명서 없는 DAG(uncertified DAG)로 인증 라운드 제거.<br />
          소유 객체 트랜잭션은 <strong>합의를 우회하는 fast path</strong>.<br />
          결과: Bullshark 대비 커밋 지연 50%+ 감소.
        </p>

        {/* ── Mysticeti 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mysticeti의 3가지 혁신</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Mysticeti 3가지 혁신 (2024):
//
// 1. Uncertified DAG:
//    - Narwhal: 2f+1 signatures per vertex (certificate)
//    - Mysticeti: NO certificate
//    - reference만 있어도 OK
//    - reference = implicit vote
//    - 1 round saved
//
// 2. Fast Path for Owned Objects:
//    - Sui's object model
//    - 소유 객체 TX는 충돌 없음
//    - consensus 우회
//    - 100ms 이내 확정
//    - 대부분 TX에 해당
//
// 3. 3-round Commit Rule:
//    - Bullshark: 4-round (2 wave + fallback)
//    - Mysticeti: 3-round (단축)
//    - 더 적은 vote rounds
//    - 빠른 decision

// 성능 비교:
//
// Narwhal+Bullshark (Sui 2022-2023):
// - latency: 2s e2e (WAN)
// - throughput: 130K TPS
//
// Mysticeti (Sui 2024-):
// - latency: 390ms e2e (WAN)
// - throughput: 160K+ TPS
// - 5x latency improvement
// - 23% throughput increase

// Sui 채택 (2024):
// - Mysticeti mainnet
// - Narwhal → deprecated
// - Bullshark → Mysticeti
// - production grade

// Paper: "Mysticeti: Reaching the Limits of
//         Latency with Uncertified DAGs"
// - Mysten Labs (2024)
// - Sui 개발팀
// - EuroSys 2025 (예정)

// 이름 유래:
// - Mysticeti = whale parvorder (고래 아목)
// - Narwhal, Tusk, Bullshark 계보 계승
// - 모두 고래/바다 생물 이름`}
        </pre>
        <p className="leading-7">
          Mysticeti: <strong>Uncertified DAG + Fast Path + 3-round commit</strong>.<br />
          Sui 2024 production, 390ms e2e, 160K+ TPS.<br />
          Narwhal/Bullshark 후계자.
        </p>

        {/* ── Sui Object Model ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sui의 Object Model (핵심 배경)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sui Object Model:
//
// Object types:
// 1. Owned objects:
//    - single owner (address)
//    - only owner can modify
//    - 예: coins, NFTs, 개인 자산
//    - no concurrency issues
//
// 2. Shared objects:
//    - multiple accessors
//    - 예: DEX liquidity pool, AMM
//    - concurrent modifications
//    - ordering required
//
// 3. Immutable objects:
//    - read-only after creation
//    - 예: frozen NFT, package
//    - no ordering needed

// Transaction types:
// - "owned object tx": 소유 객체만 사용
// - "shared object tx": 공유 객체 포함
// - "read-only tx": 읽기만

// 통계 (Sui 실측):
// - 80-90% TXs: owned object only
// - 10-20% TXs: shared objects
// - 대부분 consensus 불필요

// Fast Path 활용:
// - owned TX: consensus 우회
//   - validator 2f+1 sig 모음
//   - finalize immediate (~100ms)
// - shared TX: Mysticeti consensus
//   - DAG + ordering
//   - ~390ms commit

// 비교:
// - Ethereum: 모든 TX global ordering (12s)
// - Sui: owned TXs 100ms, shared TXs 390ms
// - 평균 latency 크게 감소

// Architectural advantage:
// - parallelism by design (object model)
// - consensus bottleneck 감소
// - horizontal scalability

// Move language:
// - resource semantics
// - owned vs shared objects
// - Sui's programming model
// - object model 직접 지원`}
        </pre>
        <p className="leading-7">
          Sui object model: <strong>Owned (80%) + Shared (20%)</strong>.<br />
          Owned → Fast Path (100ms), Shared → Mysticeti (390ms).<br />
          Move language가 object model 지원.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Mysticeti의 철학: "consensus는 필요한 곳만"</strong>.<br />
          Ethereum: 모든 TX consensus → 병목.<br />
          Sui: owned object TX는 consensus 불필요 → bypass.<br />
          object model 인식 합의 = 평균 latency 극적 감소.
        </p>
      </div>
    </section>
  );
}
