import { CitationBlock } from '@/components/ui/citation';

export default function AsyncFallback() {
  return (
    <section id="async-fallback" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비동기 폴백 (Tusk와 비교)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Spiegelman et al. — Bullshark §5" citeKey={3} type="paper">
          <p className="italic">
            "Bullshark provides both a partially synchronous protocol with 2-round latency and an asynchronous fallback with 4-round latency."
          </p>
        </CitationBlock>

        {/* ── Async Fallback 동작 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Async Fallback 동작 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bullshark의 2 modes:

// Mode 1: Partial Sync (Fast Path)
// - 2-round wave
// - deterministic anchor
// - f+1+ votes → commit
// - latency: 2 rounds = 2δ

// Mode 2: Async (Fallback)
// - 4-round wave
// - randomized anchor (VRF/coin)
// - more robust voting rules
// - latency: 4 rounds = 4δ
// - guaranteed liveness (probability 1)

// Transition criteria:
// - consecutive skipped waves (e.g., 3+)
// - network timeout detected
// - explicit view change signal
// → switch to Mode 2

// Recovery criteria:
// - successful commits resume
// - network stabilized
// - → switch back to Mode 1

// Async mode 메커니즘:
//
// 1. 4-round wave:
//    wave w = rounds [4w, 4w+3]
//    - round 4w: potential anchors
//    - rounds 4w+1, 4w+2: voting
//    - round 4w+3: commit decision
//
// 2. Randomized anchor:
//    common coin at end of wave
//    anchor = coin_result mod n
//    - unpredictable
//    - uniform random
//    - Byzantine can't bias
//
// 3. Voting rules:
//    - round 4w+1: "strong" votes for anchor
//    - round 4w+2: "weak" votes (backup)
//    - round 4w+3: final decision
//
// 4. Commit conditions:
//    - 2f+1 strong votes → commit
//    - if not 2f+1, use weak votes + coin
//    - random anchor matches → commit
//    - probability of commit: ≥ 1/3 per wave

// Expected commit time:
// - probability 1/3 per wave
// - expected waves: 3
// - expected rounds: 12
// - but probability 1 eventually

// Safety:
// - both modes safe independently
// - transition safe (wave boundaries)
// - committed anchors preserved`}
        </pre>
        <p className="leading-7">
          Async mode: <strong>4-round wave + randomized anchor</strong>.<br />
          expected 3 waves (12 rounds) for commit.<br />
          probability 1 eventually — async-safe liveness.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Tusk vs Bullshark</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">속성</th>
                <th className="border border-border px-4 py-2 text-left">Tusk</th>
                <th className="border border-border px-4 py-2 text-left">Bullshark (부분동기)</th>
                <th className="border border-border px-4 py-2 text-left">Bullshark (비동기)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['네트워크 가정', '비동기', '부분 동기', '비동기'],
                ['커밋 지연', '4 라운드', '2 라운드', '4 라운드'],
                ['앵커 선택', '코인 플립', '결정론적', '코인 플립'],
                ['Safety', '항상', '항상', '항상'],
                ['Liveness', '비동기', 'GST 후', '비동기'],
              ].map(([attr, ...rest]) => (
                <tr key={attr}>
                  <td className="border border-border px-4 py-2 font-medium">{attr}</td>
                  {rest.map((v, i) => (
                    <td key={i} className="border border-border px-4 py-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── 하이브리드 전환 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Hybrid 전환 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bullshark 자동 전환:

// Detection:
// - monitor consecutive skipped waves
// - threshold: 3 skipped (configurable)
// - 원인: network partition, DDoS, multi-failure

// Transition steps:
//
// 1. Fast → Slow:
//    - detect 3 skipped waves
//    - next wave: 4-round mode
//    - announce via special marker (in next vertex)
//    - all validators switch
//
// 2. Slow → Fast:
//    - detect 2 consecutive successful commits (slow)
//    - next wave: 2-round mode
//    - optimistic restart

// 상태 공유:
// - mode state in DAG (special field)
// - validators 동일 상태 유지
// - byzantine이 잘못된 state 삽입 시 detect

// Adaptive behavior:
// - 네트워크 unstable: stay in slow mode
// - 네트워크 stable: fast mode
// - 자동 adaptation
// - no manual intervention

// 실제 시나리오:
//
// 정상 운영:
// - 99% time in fast mode
// - 2-round commits
// - 130K+ TPS (Bullshark)
//
// DDoS 공격:
// - 일시적 slow mode
// - 4-round commits
// - throughput 감소
// - but progress 유지
//
// 회복:
// - 공격 종료
// - fast mode 복귀
// - 정상 throughput

// Tusk (Bullshark 이전):
// - only async mode
// - always 4 rounds
// - simpler but slower
// - was Sui initial choice

// Bullshark:
// - hybrid benefits
// - fast in common case
// - async safety in worst case
// - optimal adaptive BFT`}
        </pre>
        <p className="leading-7">
          Hybrid 전환: <strong>consecutive skips → slow, successful commits → fast</strong>.<br />
          99% fast mode + 1% slow mode (실제).<br />
          DDoS 공격에도 progress 유지.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">비동기 폴백 메커니즘</h3>
        <p className="leading-7">
          Bullshark는 부분 동기 모드에서 2라운드 지연으로 빠르게 커밋.<br />
          네트워크가 비동기 상태에 빠지면 자동으로 비동기 모드 전환.<br />
          비동기 모드에서는 코인 플립(공통 동전) 기반 앵커 선택으로<br />
          4라운드 지연으로 합의를 유지.
        </p>
        <p className="leading-7">
          Tusk는 처음부터 비동기만 지원하여 항상 4라운드.<br />
          Bullshark는 정상 시 2라운드, 비동기 시 4라운드 — 최적 조합.<br />
          Sui 블록체인이 Narwhal+Bullshark 조합을 채택한 이유.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "hybrid"가 최선인가</strong> — async safety + sync speed.<br />
          Pure sync: DDoS에 취약 (liveness halt).<br />
          Pure async: 느림 (4+ rounds 항상).<br />
          Hybrid: 평소 빠름 + 위기에도 progress → 양쪽 장점.
        </p>
      </div>
    </section>
  );
}
