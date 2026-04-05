import { CitationBlock } from '@/components/ui/citation';

export default function Optimistic() {
  return (
    <section id="optimistic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">낙관적 응답성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Malkhi & Nayak — HotStuff-2 §4" citeKey={2} type="paper">
          <p className="italic">
            "In the optimistic case, the protocol proceeds at the speed of the actual network delay, without waiting for timeouts."
          </p>
        </CitationBlock>

        {/* ── Optimistic Responsiveness ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Optimistic Responsiveness 의미</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Optimistic Responsiveness 정의:
//
// "In the optimistic path (honest leader, GST passed),
//  protocol proceeds at the speed of δ (actual delay),
//  without any timeout waiting."
//
// 3가지 가정 필요:
// 1. honest leader (current view)
// 2. GST passed (network stable)
// 3. f < n/3 Byzantine

// 조건 만족 시:
// - propose: 0 wait
// - vote collection: δ
// - next phase: 0 wait
// - 전체 latency: O(δ)

// Pessimistic responsiveness (기존):
// - timeout 대기 포함
// - latency: O(Δ) (worst case)
// - Δ = safe upper bound

// HotStuff-2의 달성:
// - normal path: optimistic responsive
//   → 4δ per commit
// - view change path: also responsive
//   → TC 형성 후 즉시 진행

// Pass-Shi lower bound (2018):
// - responsive BFT 하한: 2δ to commit
// - HotStuff-2: 4δ (2-chain) or 2δ (direct 2-phase)
// - optimal 달성

// 실제 이득:
// LAN (δ=1ms, Δ=100ms):
// - HotStuff: 3ms normal + 100ms view change
// - HotStuff-2: 4ms normal + 2ms view change
// - 98% 감소 (view change)

// WAN (δ=100ms, Δ=1s):
// - HotStuff: 300ms normal + 1s view change
// - HotStuff-2: 400ms normal + 200ms view change
// - 80% 감소 (view change)`}
        </pre>
        <p className="leading-7">
          Optimistic responsive = <strong>timeout 대기 없이 δ 속도</strong>.<br />
          view change도 TC 형성 즉시 진행 (no timeout).<br />
          Pass-Shi 하한 달성 — 이론적 최적.
        </p>

        {/* ── 프로토콜 비교표 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">단계 수</th>
                <th className="border border-border px-4 py-2 text-left">지연</th>
                <th className="border border-border px-4 py-2 text-left">VC 복잡도</th>
                <th className="border border-border px-4 py-2 text-left">응답성</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PBFT', '3', '5 delays', 'O(n³)', '정상만'],
                ['Tendermint', '3', '4 delays', 'O(n²)', '비응답적'],
                ['HotStuff', '3', '7 delays', 'O(n)', '정상만'],
                ['HotStuff-2', '2', '4 delays', 'O(n)', '전체 응답적'],
              ].map(([name, ...rest]) => (
                <tr key={name}>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  {rest.map((v, i) => (
                    <td key={i} className="border border-border px-4 py-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Chained HotStuff-2 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Chained HotStuff-2</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Chained HotStuff-2 (파이프라인):
//
// 핵심 아이디어:
// - 2-phase를 파이프라인
// - 각 view 1 block 생성
// - vote 재사용 (이전 block의 다음 단계)
//
// View v:   leader proposes B_v
//           B_v.qc = QC(B_(v-1))
//           "vote for B_v = commitQC for B_(v-1)"
//
// View v+1: leader proposes B_(v+1)
//           B_(v+1).qc = QC(B_v)
//           "vote for B_(v+1) = B_(v-1) committed!"
//
// → B commit latency: 2 views = 2δ × 2 = 4δ
// → B commit throughput: 1 block per 2δ

// 2-chain commit rule:
// B is committed when:
// - QC(B) exists
// - QC(B') exists where B ← B'
// - B.view + 1 == B'.view
// → B is committed

// HotStuff (3-chain) vs HotStuff-2 (2-chain):
// HotStuff:
// - commit needs B, B', B'' (3 consecutive)
// - latency: 3 views = 3δ × 2 = 6δ (basic), 3δ (chained)
// - 2-chain은 lock
//
// HotStuff-2:
// - commit needs B, B' (2 consecutive)
// - latency: 2 views = 4δ (basic), 2δ (chained)
// - 1-chain은 lock

// 왜 2-chain 충분한가 (HotStuff-2):
// - TC가 view change safety 추가 증거
// - TC.high_qc_view로 locked block 전달
// - Pre-commit 역할을 TC가 수행
// - 따라서 2-chain으로 safety 증명 가능

// HotStuff의 3-chain 필수 이유:
// - TC 없음
// - view change 시 highQC만 전달
// - 2-chain은 "locked" 보장하지만
//   "committed" 보장 부족
// - 3-chain으로 upgrade

// 결론:
// HotStuff-2 = HotStuff + TC + 1-chain 단축`}
        </pre>
        <p className="leading-7">
          Chained HotStuff-2: <strong>2-chain commit rule</strong>.<br />
          B, B' (연속 view) 2 QC → B committed.<br />
          HotStuff의 3-chain 대비 1 view 단축.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 인사이트</h3>
        <p className="leading-7">
          HotStuff의 3단계 구조는 "View Change에서 Safety 보장"을 위한 것.<br />
          HotStuff-2의 TC는 View Change 시점의 정보를 암호학적으로 보존하여,<br />
          정상 경로에서 불필요한 단계를 제거.<br />
          결과적으로 최적 지연(4 delays) + O(n) 통신 + 전체 응답성 달성.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 HotStuff-2가 아직 mainnet 채택 없나</strong> — 구현 복잡도.<br />
          TC verification, 2-chain safety proof, view change 복잡.<br />
          Aptos는 Jolteon 선택 (2-chain + async fallback).<br />
          HotStuff-2는 이론적 최적이지만 실무 채택은 후발.
        </p>
      </div>
    </section>
  );
}
