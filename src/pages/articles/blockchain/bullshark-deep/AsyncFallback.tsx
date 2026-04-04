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

        <h3 className="text-xl font-semibold mt-6 mb-3">비동기 폴백 메커니즘</h3>
        <p>
          Bullshark는 부분 동기 모드에서 2라운드 지연으로 빠르게 커밋.<br />
          네트워크가 비동기 상태에 빠지면 자동으로 비동기 모드 전환.<br />
          비동기 모드에서는 코인 플립(공통 동전) 기반 앵커 선택으로<br />
          4라운드 지연으로 합의를 유��
        </p>
        <p>
          Tusk는 처음부터 비동기만 지원하여 항상 4라운드.<br />
          Bullshark는 정상 시 2라운드, 비동기 시 4라운드 — 최적 조합.<br />
          Sui 블록체인이 Narwhal+Bullshark 조합을 채택한 이유
        </p>
      </div>
    </section>
  );
}
