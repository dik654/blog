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
        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Formal Statement</p>
          <p className="text-sm italic mb-2">"For any header h with certificate C(h), if any honest validator has C(h), then eventually all honest validators will obtain the data referenced by h."</p>
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li><strong>Integrity</strong>: 받은 data = original</li>
            <li><strong>Agreement</strong>: 모든 honest가 같은 data 수신</li>
            <li><strong>Termination</strong>: 결국 수신 (eventual)</li>
          </ol>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Formal Proof (sketch)</p>
            <p className="text-sm mb-1">가정: <code className="text-xs">C(h) = 2f+1</code> signatures. honest validator A가 <code className="text-xs">C(h)</code> 보유.</p>
            <p className="text-sm"><code className="text-xs">2f+1</code> 중 <code className="text-xs">f+1</code>은 honest(pigeonhole). honest는 sign 전 data 저장 → <code className="text-xs">f+1</code> honest hold data. 어떤 honest가 request → <code className="text-xs">f+1</code> 중 1+가 response → reliable channels → eventual delivery.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">결론 + 메커니즘</p>
            <p className="text-sm mb-1">Narwhal availability = BFT reliability. <code className="text-xs">2f+1</code> sig = quorum intersection 기반.</p>
            <p className="text-sm text-muted-foreground">메커니즘: 각 honest는 signed data 저장 + request 응답. gossip protocol 전파. retry with exponential backoff.</p>
          </div>
        </div>
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
        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Certificate C는 있는데 data 없을 때</p>
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li><strong>Request</strong>: <code className="text-xs">signers(C)</code>에 <code className="text-xs">payload_digests</code> 요청</li>
            <li><strong>Response</strong>: data matches digest → store + break</li>
            <li><strong>Fallback</strong>: 1 signer → timeout(500ms) → next signer → continue</li>
            <li><strong>Eventually success</strong>: <code className="text-xs">f+1</code> honest signers → 최소 1명 respond → delivery 보장</li>
          </ol>
          <p className="text-sm mt-2 text-muted-foreground">실제: parallel requests to multiple signers. first response wins. failed signers tracked.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Catching Up</p>
            <p className="text-sm">new validator 합류 시 latest committed cert부터 역추적 → parent chain data 다운로드 → 병렬 batch retrieval.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Byzantine 방어</p>
            <p className="text-sm">fake data 전송 → digest 검증 → mismatch reject → 다른 signer 재요청.</p>
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-1">성능</p>
            <p className="text-sm">Retrieval: 100-500ms. Success: 99.9%+. 기존 ledger sync 대비 10-100x fast.</p>
          </div>
        </div>
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
