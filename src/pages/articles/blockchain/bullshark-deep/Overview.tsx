import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bullshark 순서화 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Bullshark (Spiegelman et al., CCS 2022) — <strong>Narwhal DAG 위 ordering consensus</strong>.<br />
          wave(2 rounds) 단위 anchor 선정 + causal history commit.<br />
          partial sync 2-round fast path + async 4-round fallback.
        </p>

        {/* ── Bullshark의 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bullshark의 이론적 기여</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bullshark 3가지 기여:

// 1. Optimal amortized latency:
//    - partial sync: 2 rounds per commit
//    - Pass-Shi lower bound 달성
//    - DAG 위에서 이론적 최적
//
// 2. Zero-extra-communication consensus:
//    - DAG 자체가 voting
//    - 추가 consensus 메시지 없음
//    - Narwhal output 직접 사용
//
// 3. Sync/Async hybrid:
//    - fast path: partial sync (2 rounds)
//    - fallback: async (4 rounds)
//    - 자동 전환
//    - both safe

// DAG + Consensus 분리:
// - Narwhal: data dissemination (DAG)
// - Bullshark: order determination (consensus)
// - 각 layer 독립 발전
// - modular architecture

// 이전 프로토콜 대비:

// PBFT/HotStuff (sequential):
// - 1 block per round
// - leader bottleneck
// - 10-30K TPS

// DAG-Rider (2021, asynchronous):
// - DAG-based
// - 4-round latency
// - async-safe
// - but higher latency

// Narwhal+Tusk (2022):
// - Narwhal mempool + Tusk ordering
// - 4-round async
// - Sui initial use

// Narwhal+Bullshark (2022):
// - same mempool
// - Bullshark ordering
// - 2-round partial sync
// - 4-round async fallback
// - Sui production

// Mysticeti (2024):
// - uncertified DAG
// - 3-round commit
// - 390ms e2e

// 계보:
// DAG-Rider → Tusk → Bullshark → Mysticeti
// 각각 latency 또는 throughput 개선`}
        </pre>
        <p className="leading-7">
          Bullshark: <strong>2-round partial sync + 4-round async fallback</strong>.<br />
          DAG 자체가 voting — zero extra communication.<br />
          DAG-Rider → Tusk → Bullshark → Mysticeti 계보.
        </p>

        {/* ── 핵심 개념 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bullshark 핵심 개념</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 핵심 개념:

// Wave (웨이브):
// - 2 rounds per wave (partial sync)
// - 4 rounds per wave (async)
// - wave w = rounds [2w, 2w+1] or [4w, 4w+3]

// Anchor:
// - wave의 특정 round의 designated leader vertex
// - leader_w = schedule[w % n] (round-robin)
// - anchor commit → entire wave committed

// Vote:
// - next wave의 vertex가 anchor 참조 (DAG edge)
// - f+1+ votes → anchor committed
// - 별도 vote message 불필요 (DAG 자체가 vote)

// Commit Rule:
// commit anchor(w) iff:
//   exists a_(w+1) such that
//     f+1 votes from round(2w+1) point to anchor(w)
//   OR
//     anchor(w+1) has 2f+1 causal ancestors back to anchor(w)

// Skipped Wave:
// - anchor가 없거나 insufficient votes
// - skip, but include in later commit
// - next committed anchor가 skip wave도 process

// Total Order:
// 1. committed anchors 순서 (wave 순)
// 2. 각 anchor의 causal history 추출
// 3. (round, author) 순 sort
// 4. deterministic linear order

// 예시 (n=4, fast path):
// wave 0: rounds 0, 1
//   leader = V0
//   anchor = V0's round 0 vertex
// wave 1: rounds 2, 3
//   leader = V1
//   anchor = V1's round 2 vertex

// wave 1 의 round 2에서:
// - V0, V1, V2가 anchor(0) 참조
// - 3 votes >= f+1+1=2
// - anchor(0) committed
// - anchor(0)의 causal history all committed`}
        </pre>
        <p className="leading-7">
          핵심: <strong>Wave + Anchor + Vote (DAG edge) + Causal History</strong>.<br />
          DAG edge = implicit vote → zero extra communication.<br />
          deterministic round-robin leader.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "DAG edge = vote"인가</strong> — 구조 자체로 consensus.<br />
          Narwhal이 DAG를 만들 때 reliable broadcast로 safety 보장.<br />
          Bullshark는 DAG를 다시 해석(interpret)만 — anchor는 vote 받은 leader.<br />
          결과: consensus의 고전적 "voting + commit" 단계 불필요.
        </p>
      </div>
    </section>
  );
}
