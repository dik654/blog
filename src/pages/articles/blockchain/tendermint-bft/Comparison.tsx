export default function Comparison() {
  const rows = [
    { prop: '정상 경로', pbft: 'O(n²)', tm: 'O(n²)', note: '동일' },
    { prop: 'View Change', pbft: 'O(n³)', tm: 'O(n²) 자동', note: 'Tendermint 단순' },
    { prop: '확정 지연', pbft: '5 delays', tm: '4 delays', note: '1 delay 절감' },
    { prop: '확정성', pbft: '즉시', tm: '즉시', note: '동일' },
    { prop: '구현 복잡도', pbft: '높음', tm: '중간', note: '라운드 기반 단순화' },
  ];

  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT vs Tendermint 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">속성</th>
                <th className="border border-border px-4 py-2 text-left">PBFT</th>
                <th className="border border-border px-4 py-2 text-left">Tendermint</th>
                <th className="border border-border px-4 py-2 text-left">비고</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.prop}>
                  <td className="border border-border px-4 py-2 font-medium">{r.prop}</td>
                  <td className="border border-border px-4 py-2">{r.pbft}</td>
                  <td className="border border-border px-4 py-2">{r.tm}</td>
                  <td className="border border-border px-4 py-2 text-muted-foreground">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">CometBFT와의 관계</h3>
        <p>
          Tendermint Core가 CometBFT로 리브랜딩(2023).<br />
          ABCI(Application Blockchain Interface)를 통해<br />
          합의 엔진과 애플리케이션 로직을 완전히 분리.<br />
          Cosmos SDK, Penumbra 등 다양한 체인이 CometBFT 위에 구축
        </p>
      </div>
    </section>
  );
}
