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
      </div>
    </section>
  );
}
