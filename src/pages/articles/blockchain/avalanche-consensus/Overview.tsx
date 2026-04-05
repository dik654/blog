import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Avalanche 합의: Snowball/Snowflake</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Team Rocket (Rocket et al., 2018) — <strong>metastable randomized consensus</strong>.<br />
          결정론적 BFT와 다른 접근: 무작위 sub-sampling으로 O(k log n) 통신.<br />
          Avalanche blockchain(2020)의 합의 엔진.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">확률적 합의</h3>
        <p className="leading-7">
          PBFT/HotStuff: 결정론적 합의.<br />
          Avalanche: <strong>확률적 합의</strong>. 충분한 라운드 후 번복 확률 무시 가능.<br />
          trade-off: 절대 안전성 대신 확장성.
        </p>

        {/* ── Avalanche 등장 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Avalanche의 등장과 새로운 철학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Avalanche 등장 (Team Rocket 2018):
//
// 기존 합의의 한계:
// 1. Nakamoto (PoW):
//    - 10분 finality
//    - 에너지 낭비
//    - probabilistic but slow
//
// 2. Classical BFT (PBFT, HotStuff):
//    - O(n²)/O(n) communication
//    - 수백 노드 한계
//    - deterministic but bounded scalability

// Avalanche의 새 접근:
// "가십 + 샘플링으로 빠르면서 확장 가능"
//
// Core idea:
// - 각 노드가 small random sample에 query
// - majority 따라감
// - 반복 → "metastable" 수렴
// - 확률적 합의

// 주요 성능:
// - 1-2초 finality
// - 4500+ TPS
// - 수천 validators 가능
// - 적은 에너지

// 프로토콜 계보:
// - Slush (theoretical baseline)
// - Snowflake (binary agreement)
// - Snowball (confidence counters)
// - Avalanche (DAG version)
// - Snowman (chain version)

// 실제 배포:
// - Avalanche blockchain (2020 mainnet)
// - AVAX token
// - Subnets (custom chains)
// - C-Chain (EVM compatible)
// - X-Chain (exchange chain)
// - P-Chain (platform chain)

// 설계 철학:
// "Byzantine 과반 (51%) 대신 확률적 다수"
// "결정론적 certainty 대신 probabilistic convergence"
// "O(n) 통신 대신 O(k log n)"

// 수학적 기반:
// - metastability theory
// - random sampling
// - gossip protocols
// - Markov chains`}
        </pre>
        <p className="leading-7">
          Avalanche 철학: <strong>random sampling + gossip + probabilistic convergence</strong>.<br />
          수천 validators, 1-2초 finality, 4500+ TPS.<br />
          classical BFT vs Nakamoto의 중간 지점.
        </p>

        {/* ── 이론적 기반 ── */}
        <h3 className="text-xl function font-semibold mt-6 mb-3">이론적 기반: Metastability</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Metastability 개념:
//
// - state machine with stable states (0, 1)
// - metastable state = unstable balance
// - small perturbation → tip to one stable state
//
// 물리 예시:
// - ball on top of hill (metastable)
// - 작은 움직임 → 한 쪽으로 굴러감
// - stable = 바닥 (valley)

// Avalanche consensus에도 적용:
// - 두 선택지 (Red, Blue)
// - 초기: metastable (50/50)
// - random perturbation (one validator choice)
// - small bias → cascade
// - eventually stable (all Red or all Blue)

// Slush protocol (baseline):
// - each node has preference (Red/Blue)
// - query k random nodes
// - if majority different, switch
// - repeat m rounds

// Slush 문제:
// - m rounds 후 stop (arbitrary)
// - 확률 보장 없음
// - Byzantine 저항 약함

// Snowflake 개선:
// - β (beta) consecutive identical results → decide
// - finite termination
// - probabilistic safety

// Snowball 개선:
// - confidence counters (cumulative)
// - 일시 변동 저항
// - more robust

// Avalanche (DAG):
// - Snowball + DAG
// - transaction-level decisions
// - 4500+ TPS

// Snowman (chain):
// - linear chain (not DAG)
// - simpler for EVM
// - Avalanche C-Chain 사용

// Safety probability:
// P(safety violation) <= e^(-α * β) * ...
// - α: threshold (e.g., 14 out of 20)
// - β: confidence threshold (e.g., 20)
// - extremely small (10^-20 typically)`}
        </pre>
        <p className="leading-7">
          Metastability: <strong>small perturbation → cascade → stable state</strong>.<br />
          Slush → Snowflake → Snowball → Avalanche/Snowman 계층.<br />
          safety probability ≈ e^(-α×β), 실용적으로 무시 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Avalanche가 "10,000+ validators"를 가능케 하나</strong> — O(k log n) 통신.<br />
          PBFT: O(n²) → 1000 validators = 1M messages.<br />
          Avalanche: O(k log n), k=20, n=10000 → ~266 messages per node.<br />
          4000배+ 효율 — sub-sampling의 힘.
        </p>
      </div>
    </section>
  );
}
