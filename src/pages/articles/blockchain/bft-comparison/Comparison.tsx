import BFTComparisonViz from './viz/BFTComparisonViz';
import { CELL, TABLE_ROWS, TRADEOFFS } from './ComparisonData';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">종합 비교</h2>
      <div className="not-prose mb-8"><BFTComparisonViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>속성</th>
                <th className={`${CELL} text-left`}>PBFT</th>
                <th className={`${CELL} text-left`}>HotStuff</th>
                <th className={`${CELL} text-left`}>Autobahn</th>
                <th className={`${CELL} text-left`}>Casper FFG</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(r => (
                <tr key={r.attr}>
                  <td className={`${CELL} font-medium`}>{r.attr}</td>
                  <td className={CELL}>{r.pbft}</td>
                  <td className={CELL}>{r.hotstuff}</td>
                  <td className={CELL}>{r.autobahn}</td>
                  <td className={CELL}>{r.casper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">트레이드오프 요약</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {TRADEOFFS.map(t => (
            <div key={t.title} className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">{t.title}</p>
              <p className="text-sm">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
