import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tusk: 비동기 DAG 합의</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Danezis et al. (EuroSys 2022) — <strong>완전 비동기 DAG 합의</strong>.<br />
          Narwhal DAG 위에서 network timing 가정 없이 safety + liveness.<br />
          Sui 초기 버전, 이후 Bullshark로 대체.
        </p>

        {/* ── Tusk 등장 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Tusk 등장 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Async BFT 필요성:
//
// 1. FLP Impossibility:
//    - 비동기 + deterministic → consensus 불가
//    - randomization으로만 우회 가능
//
// 2. 실제 네트워크 문제:
//    - DDoS 공격
//    - network partition
//    - ISP 장애
//    - cloud region 실패
//
// 3. 기존 BFT 한계:
//    - PBFT, HotStuff, Tendermint: partial sync
//    - GST 기다림 필요
//    - 긴 공격 시 halt
//
// Tusk의 해결:
// - randomized consensus (FLP 우회)
// - DAG 기반 (Narwhal)
// - coin-based leader selection
// - 비동기 liveness 보장

// Narwhal + Tusk 구조:
//
// Narwhal:
// - data dissemination
// - DAG 구축 (reliable broadcast)
// - async-safe (no timing)
//
// Tusk:
// - ordering consensus
// - coin-based leader
// - 3-round wave
// - async liveness

// 이론적 기반:
// - DAG-Rider (PODC 2021)
// - Canetti-Rabin common coin
// - Ben-Or randomized consensus
// - Feldman verifiable secret sharing

// 역사:
// - 2021: DAG-Rider (이론 기반)
// - 2022: Narwhal + Tusk (Danezis)
// - 2022: Bullshark (Spiegelman) → 더 빠름
// - 2022: Sui Tusk → Bullshark 전환
// - 2024: Mysticeti (새 접근)

// 왜 "Tusk" 이름?
// - Narwhal은 "외뿔고래"
// - Tusk는 Narwhal의 뿔
// - 의미: Narwhal을 쏘는 것, ordering`}
        </pre>
        <p className="leading-7">
          Tusk = <strong>async randomized DAG consensus</strong>.<br />
          Narwhal 이름(외뿔고래)의 "뿔" 의미.<br />
          Sui에 초기 사용 → Bullshark로 upgrade.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal + Tusk 분리 설계</h3>
        <p className="leading-7">
          Narwhal이 DAG를 구축해 데이터 가용성을 보장.<br />
          Tusk는 DAG 위에서 순서만 결정.<br />
          <strong>멤풀(데이터 전파)과 합의(순서 결정)를 분리</strong>해 처리량 극대화.
        </p>

        {/* ── Tusk 핵심 아이디어 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Tusk 핵심 아이디어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tusk 핵심 아이디어:

// 1. DAG as implicit voting:
//    - vertex references = votes
//    - no extra consensus messages
//    - Narwhal이 제공한 DAG 재사용
//
// 2. Common coin:
//    - verifiable random function
//    - wave 종료 시 unpredictable leader 선택
//    - Byzantine이 미리 알 수 없음
//    - biased 공격 방어
//
// 3. 3-round wave:
//    - round 1: potential leaders propose
//    - round 2: votes
//    - round 3: certify/commit decision
//    - O(1) expected waves for commit
//
// 4. Async safety + liveness:
//    - safety: DAG structure + quorum
//    - liveness: randomization (prob 1)
//    - no GST required

// Common Coin 구현:
// - threshold signature (Dfinity style)
// - VRF (Verifiable Random Function)
// - each validator contributes share
// - 2f+1 shares → reconstruct coin value
// - coin value = random number
// - leader = coin mod n

// Expected Latency:
// - probability 1/3 per wave (leader honest)
// - expected 3 waves for commit
// - 3 waves × 3 rounds = 9 rounds expected
// - 확률적으로 빨리 종료 가능

// vs Bullshark:
// - Bullshark fast path: 2 rounds (sync)
// - Tusk: always 3-9 rounds (async)
// - trade-off: speed vs async liveness`}
        </pre>
        <p className="leading-7">
          Tusk 아이디어: <strong>DAG voting + common coin + 3-round wave</strong>.<br />
          Expected 3 waves (9 rounds) for commit.<br />
          async-safe: DDoS에도 진행.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Bullshark가 Tusk 대체했나</strong> — 실무 우선순위.<br />
          Tusk: 느리지만 async-safe.<br />
          Bullshark: 빠르지만 partial sync (fast path).<br />
          실제 네트워크는 대부분 stable → Bullshark fast path가 99% 사용.<br />
          async fallback(Bullshark)이 Tusk 장점 흡수 → Tusk 불필요.
        </p>
      </div>
    </section>
  );
}
