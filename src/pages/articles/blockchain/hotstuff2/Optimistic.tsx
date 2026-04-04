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

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 인사이트</h3>
        <p>
          HotStuff의 3단계 구조는 "View Change에서 Safety 보장"을 위한 것.<br />
          HotStuff-2의 TC는 View Change 시점의 정보를 암호학적으로 보존하여,<br />
          정상 경로에서 불필요한 단계를 제거.<br />
          결과적으로 최적 지연(4 delays) + O(n) 통신 + 전체 응답성 달성
        </p>
      </div>
    </section>
  );
}
