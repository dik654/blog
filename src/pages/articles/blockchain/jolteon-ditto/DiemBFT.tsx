import { CitationBlock } from '@/components/ui/citation';

export default function DiemBFT() {
  return (
    <section id="diembft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DiemBFT v4 (Aptos 합의)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Baudet et al. — DiemBFT v4" citeKey={2} type="paper"
          href="https://developers.diem.com/papers/diem-consensus-state-machine-replication-in-the-diem-blockchain/2021-08-17.pdf">
          <p className="italic">
            "DiemBFT v4 employs a reputation mechanism that promotes leaders based on their recent performance."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Jolteon 기반 개선</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">리더 평판 시스템</p>
            <p className="text-sm">
              최근 라운드에서 성공적으로 블록을 확정한 검증자에게<br />
              더 높은 리더 선출 확률 부여.<br />
              느린 검증자가 리더가 되어 시스템을 지연시키는 것 방지
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Pacemaker 동기화</p>
            <p className="text-sm">
              검증자 간 라운드 진행 속도를 동기화.<br />
              timeout-certificate 기반 view 진행.<br />
              라운드가 분기되지 않도록 보장
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">진화 계보 정리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">핵심 기여</th>
                <th className="border border-border px-4 py-2 text-left">채택</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['HotStuff (2019)', 'O(n) 통신, 선형 VC', 'Libra 초기'],
                ['Jolteon (2022)', '낙관적 fast path', '이론적 개선'],
                ['Ditto (2022)', 'DAG fallback', '이론적 개선'],
                ['DiemBFT v4', '리더 평판 + Jolteon', 'Aptos 메인넷'],
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
      </div>
    </section>
  );
}
