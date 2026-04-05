import { CitationBlock } from '@/components/ui/citation';

export default function Availability() {
  return (
    <section id="availability" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가용성 보장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Danezis et al. — Narwhal §4 Correctness" citeKey={3} type="paper">
          <p className="italic">
            "Narwhal guarantees that if any honest validator receives a certificate, then all honest validators will eventually obtain the corresponding data."
          </p>
        </CitationBlock>

        {/* ── Availability 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Availability Guarantee 형식 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Narwhal Availability Property:
//
// Formal Statement:
// "For any header h with certificate C(h),
//  if any honest validator has C(h),
//  then eventually all honest validators
//  will obtain the data referenced by h."
//
// 3개 보장 요소:
// 1. Integrity: 받은 data = original
// 2. Agreement: 모든 honest가 같은 data 수신
// 3. Termination: 결국 수신 (eventual)

// Formal Proof (sketch):
//
// 가정:
// - header h, certificate C(h) exists
// - honest validator A가 C(h) 보유
// - C(h) = 2f+1 signatures
//
// Claim:
// - 모든 honest validator가 결국 data 수신
//
// Proof:
// - C(h)는 2f+1 signatures
// - 2f+1 중 f+1은 honest (pigeonhole)
// - honest validator는 sign 전 data 수신 + 저장
// - f+1 honest validators hold data
// - 어떤 honest가 request 하면
// - f+1 중 1+ 가 response 가능
// - reliable point-to-point channels 가정
// - eventual delivery 보장

// Impossibility:
// - f+1 honest 모두 data 유실?
//   → Byzantine 영향 (but honest는 유실 안 함)
// - honest가 data 제공 거부?
//   → 정의상 honest 아님

// 결론:
// - Narwhal availability = BFT reliability
// - 2f+1 sig가 quorum intersection 기반
// - FUD (Fear, Uncertainty, Doubt) 저항

// 구체적 메커니즘:
// - 각 honest는 signed data 저장
// - 다른 validator의 request 응답
// - gossip protocol로 data 전파
// - retry with exponential backoff`}
        </pre>
        <p className="leading-7">
          Availability 증명: <strong>2f+1 sig → f+1 honest → data 보유</strong>.<br />
          quorum intersection + reliable channels.<br />
          "한 honest가 cert 보면 모든 honest가 data 결국 수신".
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">가용성 보장 원리</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">쿼럼 교차</p>
            <p className="text-sm">
              증명서 = 2f+1 서명. 이 중 최소 f+1은 정직 노드.<br />
              정직 노드는 서명 전에 데이터를 반드시 저장.<br />
              나중에 누구든 정직 노드에게 요청하면 복구 가능
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">인과적 완전성</p>
            <p className="text-sm">
              라운드 r의 증명서는 r-1의 2f+1 증명서를 참조.<br />
              DAG를 역추적하면 모든 이전 TX에 도달.<br />
              TX 유실 구조적으로 불가능
            </p>
          </div>
        </div>

        {/* ── Data Retrieval ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Data Retrieval 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Validator A가 certificate C는 있는데 data 없을 때:

// 1. Request data:
// for validator_j in signers(C):
//     send(Request(C.header.payload_digests)) → j
//
// 2. Response 기다림:
// while not data_received:
//     for each response:
//         if data matches digest:
//             store(data)
//             break

// 3. Fallback (retry):
// - first 1 signer에 request
// - timeout (e.g., 500ms)
// - next signer에 request
// - continue until data 수신
//
// 4. Eventually success:
// - f+1 honest signers exist
// - 최소 1명은 data 보유 + respond
// - eventual delivery 보장

// 실제 Narwhal 구현:
// - parallel requests to multiple signers
// - first response wins
// - failed signers tracked
// - congestion control

// Catching up 시나리오:
// - new validator 합류
// - 현재 DAG state 필요
// - state sync protocol:
//   - latest committed cert부터 역추적
//   - parent chain 따라 data 다운로드
//   - 병렬 batch retrieval

// Byzantine retrieval attack:
// - Byzantine이 fake data 전송
// - receiver가 digest 검증
// - mismatch → reject
// - 다른 signer에게 재요청

// Storage 요구:
// - validator는 signed data 저장 필수
// - retention period: GC까지
// - 일반적으로 수 시간
// - committed 후 archive (optional)

// Performance metrics (Narwhal):
// - retrieval latency: 100-500ms
// - success rate: 99.9%+
// - bandwidth: cert의 payload 크기
// - 기존 ledger sync 대비 10-100x fast`}
        </pre>
        <p className="leading-7">
          Data retrieval: <strong>signer에게 parallel request → first wins</strong>.<br />
          f+1 honest signers → 최소 1명 응답 보장.<br />
          ~100-500ms retrieval, 99.9%+ success.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">리더 기반 BFT와의 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">속성</th>
                <th className="border border-border px-4 py-2 text-left">리더 기반</th>
                <th className="border border-border px-4 py-2 text-left">Narwhal DAG</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['TX 제안', '리더만', '모든 검증자'],
                ['처리량 병목', '리더 대역폭', '총 대역폭'],
                ['리더 장애', 'TX 유실 가능', 'TX 보존'],
                ['가용성 보장', '없음', '증명서 기반'],
              ].map(([attr, leader, dag]) => (
                <tr key={attr}>
                  <td className="border border-border px-4 py-2 font-medium">{attr}</td>
                  <td className="border border-border px-4 py-2">{leader}</td>
                  <td className="border border-border px-4 py-2">{dag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Narwhal이 TX censorship resistance 강한가</strong> — distributed proposal.<br />
          리더 기반: 리더가 특정 TX 제외 가능 (censorship).<br />
          Narwhal: 모든 validator propose, f+1 honest가 포함 시도.<br />
          censorship 성공하려면 2f+1 Byzantine 필요 → 불가능 (f &lt; n/3).
        </p>
      </div>
    </section>
  );
}
