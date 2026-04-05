import SafetyLivenessViz from './viz/SafetyLivenessViz';

export default function SafetyLiveness() {
  return (
    <section id="safety-liveness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전성 vs 활성</h2>
      <div className="not-prose mb-6"><SafetyLivenessViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          분산 합의의 <strong>양대 정확성 속성</strong>.<br />
          Safety — "나쁜 일은 절대 일어나지 않음", Liveness — "좋은 일은 결국 일어남".<br />
          FLP 불가능성: 비동기에서 둘 다 deterministic 보장 불가.
        </p>

        {/* ── 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">형식적 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Safety (안전성): "Nothing bad happens"
//
// 합의에서:
// - Agreement: 모든 정직 노드가 같은 값 decide
// - Validity: decide된 값은 어떤 노드가 제안한 값
//
// 블록체인에서:
// - No double-spend: 같은 UTXO 두 번 사용 불가
// - No fork conflict: 두 상충 block 모두 finalize 불가
// - Determinism: 같은 input → 같은 output
//
// 형식:
// ∀ execution, ∀ states s1 s2 reached,
//   bad_predicate(s1, s2) = false
//
// "violated in finite time" — 위반은 유한 시간 내 감지 가능
// → Safety 위반은 '목격'할 수 있음

// Liveness (활성): "Something good eventually happens"
//
// 합의에서:
// - Termination: 모든 정직 노드가 결국 decide
// - Progress: 새 값이 결국 추가됨
//
// 블록체인에서:
// - Block finalization: TX가 결국 finalize
// - Chain advance: 새 block이 주기적 생성
// - Validator rotation: 리더 교체 보장
//
// 형식:
// ∀ execution, ∃ time t s.t.
//   good_predicate(state at t) = true
//
// "not violated in finite time" — 위반은 관측만으로 증명 불가
// → "아직 안 일어남" ≠ "영원히 안 일어남"`}
        </pre>
        <p className="leading-7">
          Safety는 <strong>유한 관측으로 위반 감지</strong> 가능.<br />
          Liveness는 <strong>무한 관측 필요</strong> — 위반 증명이 이론적으로 어려움.<br />
          Safety는 확률적 보장 불가, Liveness는 timing 가정 필요.
        </p>

        {/* ── FLP 불가능성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FLP 불가능성 정리 (1985)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fischer-Lynch-Paterson Impossibility (1985)
//
// 명제:
// 비동기 분산 시스템에서, 단 1개 노드 crash 가능해도,
// 모든 정직 노드가 유한 시간에 합의에 도달하는
// deterministic 알고리즘은 존재하지 않는다.

// 증명 개요:
// - bivalent state: 아직 0/1 어느 쪽으로도 갈 수 있는 상태
// - univalent state: 한 쪽으로 고정된 상태
// - 비동기 → 메시지 delay 조절 가능
// - 항상 bivalent 유지하는 스케줄 존재 증명
// - → 영원히 decide 안 할 수 있음

// 의미:
// - Deterministic: 불가능
// - Randomized: 가능 (확률 1로 terminate)
// - Timing assumption: 가능 (partial sync)

// 3가지 우회 전략:

// 1. Randomization (무작위화)
//    - Ben-Or 1983 algorithm
//    - HoneyBadger BFT
//    - coin-flip으로 bivalent 탈출
//    - 확률 1로 terminate (expected time bounded)

// 2. Partial synchrony (부분 동기)
//    - DLS 1988
//    - GST 이후 동기 가정
//    - 거의 모든 실무 BFT 선택
//    - PBFT, HotStuff, Tendermint

// 3. Failure detector (불완전 감지기)
//    - Chandra-Toueg 1996
//    - ◇P (eventually perfect)
//    - 감지기 자체에 timing 가정

// 왜 FLP가 중요?
// - "완벽한 BFT 왜 안 나와?"의 답
// - 이론적 trade-off 이해 필수
// - partial sync vs async 선택 근거`}
        </pre>
        <p className="leading-7">
          FLP = <strong>비동기 deterministic 합의 불가능</strong>.<br />
          우회: randomization, partial sync, failure detector.<br />
          실무 BFT는 대부분 partial sync 선택 (HotStuff, PBFT, Tendermint).
        </p>

        {/* ── Safety vs Liveness Trade-off ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety/Liveness Trade-off (CAP 정리)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CAP 정리 (Brewer 2000, Gilbert-Lynch 2002):
// Consistency, Availability, Partition tolerance
// 3개 중 2개만 동시 보장 가능

// 분산 합의 언어로 번역:
// - Consistency ≈ Safety (같은 값 보장)
// - Availability ≈ Liveness (응답 보장)
// - Partition tolerance = 필수 (네트워크 항상 파티션 가능)

// 따라서 P는 고정, C vs A 선택:
// - CP 시스템: Safety 우선, Liveness 포기 가능
//   예: HBase, MongoDB (strong consistency mode)
// - AP 시스템: Liveness 우선, Safety 포기 가능
//   예: Cassandra, DynamoDB (eventual consistency)

// 블록체인 매핑:
// - BFT 블록체인 (CP): safety 우선
//   - Tendermint: 1/3+ 다운 시 halt (liveness 포기)
//   - 절대 fork 안 남 (safety 보장)
// - Nakamoto 블록체인 (AP): liveness 우선
//   - Bitcoin: 네트워크 파티션에도 각자 계속 생산
//   - fork 가능 (safety probabilistic)

// 부분 동기의 답:
// - GST 이전: AP 모드 (liveness 보장 못 함)
// - GST 이후: CP 모드 (둘 다 보장)
// - Safety는 '영원히' 보장, Liveness만 희생

// Tendermint 실제 예:
// validator 34% 다운 → 합의 halt
// but 체인 fork 없음 (safety 유지)
// validator 복구 → liveness 회복
// 이것이 CP 선택의 현실`}
        </pre>
        <p className="leading-7">
          BFT 블록체인 = <strong>CP (Safety &gt; Liveness)</strong>.<br />
          validator 1/3 이상 다운 시 halt — fork는 절대 안 남.<br />
          금융 시스템이 safety 포기할 수 없기 때문.
        </p>

        {/* ── 실제 프로토콜의 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 프로토콜의 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 프로토콜의 Safety/Liveness 선택:

// PBFT (1999):
// - Safety: always
// - Liveness: during synchronous periods
// - view change로 stuck 탈출

// Tendermint (2014):
// - Safety: always
// - Liveness: 1/3+ 다운 시 halt
// - 안전하지만 취약 (1/3+ offline → stop)

// HotStuff (2018):
// - Safety: always
// - Liveness: partial sync + leader rotation
// - 3-chain rule로 commit

// Nakamoto (2008):
// - Safety: probabilistic (with high probability)
// - Liveness: always (honest majority)
// - 51% 공격 시 safety 깨짐

// Avalanche (2019):
// - Safety: probabilistic (metastable)
// - Liveness: always (sub-sampling)
// - 파라미터 튜닝으로 1-ε safety

// Ethereum 2.0:
// - Casper FFG: BFT safety (finalized)
// - LMD-GHOST: probabilistic liveness
// - 하이브리드: 각 속성에 다른 메커니즘

// 설계 교훈:
// 1. 안전성이 뚫리면 복구 불가 (rollback 재앙)
// 2. 활성이 안 되면 잠시 멈춤 (복구 가능)
// 3. 따라서 BFT는 항상 safety 우선
// 4. Nakamoto는 liveness 우선 (open membership)`}
        </pre>
        <p className="leading-7">
          <strong>Safety 깨짐 = 복구 불가</strong>, Liveness 멈춤 = 일시적.<br />
          그래서 BFT는 항상 safety 우선 — Tendermint는 1/3 다운에 halt 감수.<br />
          Ethereum 2.0은 하이브리드 — FFG(safety) + GHOST(liveness) 각각.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "항상 Safety 우선"이 합리적인가</strong> — 비대칭적 손실.<br />
          Liveness 실패는 복구 가능한 불편함, Safety 실패는 돈이 두 곳에 존재하는 재앙.<br />
          금융 시스템의 전제: 일시적 halt &gt;&gt; 영구적 불일치.
        </p>
      </div>
    </section>
  );
}
