import { CitationBlock } from '@/components/ui/citation';

export default function Responsiveness() {
  return (
    <section id="responsiveness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">응답성 (Responsiveness)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §6" citeKey={3} type="paper">
          <p className="italic">
            "A protocol is responsive if the leader can make progress as soon as it receives messages from a quorum of replicas, without waiting for a known upper bound on network delay."
          </p>
        </CitationBlock>

        {/* ── Responsiveness 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Responsiveness 형식 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Responsiveness 정의 (Pass-Shi 2018):
//
// "A protocol is responsive if, in all executions,
//  the time to complete consensus is within O(δ),
//  where δ is the actual (unknown) message delay."
//
// Formal:
// ∃ constant c such that
// ∀ executions, Time_consensus <= c * δ
// where δ = actual message delay

// Non-responsive 예:
// - fixed timeout 기반 프로토콜
// - timeout = worst-case estimate (Δ)
// - 실제 δ << Δ 여도 Δ 대기
// - 네트워크가 빨라도 합의 느림

// Responsive 예:
// - 2f+1 응답 즉시 진행
// - δ에 비례하는 시간
// - 네트워크 빠르면 합의 빠름

// 비교:
//
// PBFT (not responsive in view change):
// - normal: 3δ (responsive)
// - view change: timeout 기반 (non-responsive)
// - worst case: O(Δ)

// HotStuff (optimistically responsive):
// - normal: 3δ (responsive)
// - view change: 2f+1 NewView 대기 (responsive)
// - worst case: O(δ) under GST

// Tendermint (non-responsive):
// - timeout 기반 round advance
// - 2/3+ prevote 대기 + timeout
// - 실제 지연 작아도 timeout 기다림

// HotStuff-2, Jolteon:
// - fully responsive (normal + view change)
// - 2-phase optimistic

// Asymptotic complexity:
// Responsive: O(δ) latency
// Non-responsive: O(Δ) latency
// Δ >> δ in practice (safety margin)`}
        </pre>
        <p className="leading-7">
          Responsive = <strong>실제 지연 δ에 비례</strong>.<br />
          non-responsive는 고정 timeout Δ 대기 (pessimistic).<br />
          δ ≪ Δ 에서 큰 성능 차이.
        </p>

        {/* ── HotStuff의 부분 응답성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff의 부분 응답성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff responsiveness 분석:
//
// Normal operation:
// - leader가 2f+1 vote 받으면 즉시 다음 phase
// - timeout 대기 없음
// - fully responsive
// - latency: 3δ per block (chained)
//
// View change (partial responsiveness):
// - leader 실패 감지: timeout 필요
// - 실패한 leader는 응답 안 보냄
// - timeout이 leader 장애 감지 수단
// - 이 부분은 non-responsive

// View change의 non-responsive 부분:
//
// Phase 1 (timeout detection): Δ 대기
// - leader가 propose 안 보냄 감지
// - 고정 timeout 필요
//
// Phase 2 (NewView collection): δ
// - 2f+1 NewView 즉시 수집 가능
// - responsive
//
// Phase 3 (new propose): δ
// - new leader가 propose 바로 전송
// - responsive
//
// 총: Δ + 2δ (view change)

// 개선: Optimistic Responsiveness
//
// 1. Happy path (normal): fully responsive
//    - 2f+1 vote 즉시 진행
//    - latency 3δ (chained) or 4δ (basic)
//
// 2. Sad path (view change): partial responsive
//    - timeout 1회 필요
//    - 이후 responsive

// HotStuff-2의 개선:
// - 2-phase protocol
// - locking 제거 (view-based)
// - view change도 fully responsive
// - latency 2δ (normal), Δ + δ (view change)

// Jolteon (Aptos):
// - 2-chain commit
// - async fallback (Ditto)
// - responsive in normal + view change

// Responsiveness의 가치:
// - LAN: δ ≈ 1ms, Δ ≈ 100ms → 100x 차이
// - WAN: δ ≈ 100ms, Δ ≈ 1s → 10x 차이
// - 실제 응답 시간 크게 개선`}
        </pre>
        <p className="leading-7">
          HotStuff normal = <strong>responsive</strong>, view change = <strong>partial responsive</strong>.<br />
          leader 장애 감지에만 timeout 필요.<br />
          HotStuff-2가 이 마지막 non-responsive 부분도 해결.
        </p>

        {/* ── 실측 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 성능 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// WAN 환경 (100ms RTT):
//
// PBFT (3-phase):
// - normal: 3 × 100 = 300ms
// - view change: ~1s (timeout dependent)
// - throughput: 1000 TPS (limited by O(n²))
//
// Tendermint:
// - normal: 3-4 × 100 = 400ms
// - view change: ~2s (exponential backoff)
// - throughput: 10K TPS
//
// HotStuff (chained):
// - normal: 3 × 100 = 300ms (latency)
// - steady state: 1 block per 100ms
// - view change: 500-1000ms
// - throughput: 20K TPS (O(n))
//
// HotStuff-2:
// - normal: 2 × 100 = 200ms
// - view change: 200-500ms
// - throughput: 30K+ TPS
//
// Jolteon (Aptos):
// - normal: 2 × 100 = 200ms
// - view change: 200-500ms
// - throughput: 100K+ TPS (with DAG)

// LAN 환경 (1ms RTT):
//
// PBFT: 3ms
// HotStuff: 3ms (latency), 1ms (throughput)
// HotStuff-2: 2ms
// Jolteon: 2ms

// 프로토콜 선택 기준:
// - WAN + 응답성: HotStuff-2, Jolteon
// - LAN + 단순성: Tendermint
// - 범용: HotStuff
// - 고처리량: Jolteon + DAG

// Aptos 실측 (2024):
// - TPS: 100,000+
// - latency: ~1s (end-to-end)
// - Jolteon + Quorum Store (DAG mempool)
// - validator: ~100`}
        </pre>
        <p className="leading-7">
          WAN 환경에서 responsiveness 차이가 큼.<br />
          HotStuff 300ms → HotStuff-2 200ms → Jolteon 200ms.<br />
          DAG-based mempool 결합으로 100K+ TPS 달성.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff의 응답성 한계</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">정상 경로: 응답적</p>
            <p className="text-sm">
              리더가 2f+1 투표를 받으면 즉시 다음 단계 진행.<br />
              타임아웃 대기 없음
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">View Change: 비응답적</p>
            <p className="text-sm">
              리더 장애 감지에 타임아웃 필요.<br />
              이 타임아웃이 실제 네트워크 지연보다 클 수 있음
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">후속 프로토콜의 개선</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Jolteon</p>
            <p className="text-sm">
              정상 경로에서 낙관적 응답성 추가.<br />
              2단계 fast path + 3단계 slow path
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">HotStuff-2</p>
            <p className="text-sm">
              3단계를 2단계로 축소하면서 응답성 유지.<br />
              View Change에서도 최적 지연 달성
            </p>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 responsiveness가 BFT 진화 방향인가</strong> — 인터넷은 δ &lt; Δ.<br />
          보안 마진으로 Δ 크게 설정 필요, but 실제 δ는 훨씬 작음.<br />
          responsive 프로토콜은 그 차이만큼 성능 향상.<br />
          HotStuff → HotStuff-2 → Jolteon 진화의 핵심 동기.
        </p>
      </div>
    </section>
  );
}
