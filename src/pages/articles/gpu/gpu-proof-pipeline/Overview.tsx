import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import PipelineOverviewViz from './viz/PipelineOverviewViz';
import { pipelineOverviewCode, speedupTableRows } from './OverviewData';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 = MSM + NTT의 조합</h2>
      <div className="not-prose mb-8"><PipelineOverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ZK 증명 생성은 결국 <strong>다항식 연산의 연쇄</strong>입니다.
          <br />
          Witness를 만들고, 다항식을 평가(NTT)하고, 타원곡선 위에서 커밋(MSM)합니다.
          <br />
          이 중 MSM이 전체 시간의 60-70%, NTT가 20-30%를 차지합니다.
        </p>
        <CitationBlock source="Filecoin bellperson — GPU Groth16 Prover" citeKey={1} type="code"
          href="https://github.com/filecoin-project/bellperson">
          <p className="text-xs">
            bellperson 프로파일링 결과, 2^20 constraints 기준 MSM이 전체 증명 시간의 65%,
            NTT/FFT가 25%를 차지합니다. GPU 가속 시 CPU 대비 40-90배 속도 향상이 가능합니다.
          </p>
        </CitationBlock>
        <p>
          GPU가 효과적인 이유는 두 연산 모두 <strong>대규모 병렬 처리</strong>에 적합하기 때문입니다.
          <br />
          MSM은 수백만 개의 독립적인 타원곡선 스칼라 곱을 동시에 수행합니다.
          <br />
          NTT는 butterfly 연산을 스테이지별로 병렬 실행합니다.
        </p>
        <CodePanel title="증명 파이프라인 전체 구조" code={pipelineOverviewCode} annotations={[
          { lines: [3, 8], color: 'sky', note: 'Witness -> NTT -> MSM -> Proof 흐름' },
          { lines: [10, 12], color: 'emerald', note: 'GPU 시간 비중' },
          { lines: [14, 18], color: 'amber', note: '시간 비중 시각화' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 가속 효과</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">연산</th>
                <th className="border border-border px-4 py-2 text-left">CPU</th>
                <th className="border border-border px-4 py-2 text-left">GPU (A100)</th>
                <th className="border border-border px-4 py-2 text-left">배속</th>
              </tr>
            </thead>
            <tbody>
              {speedupTableRows.map((r) => (
                <tr key={r.op}>
                  <td className="border border-border px-4 py-2 font-medium">{r.op}</td>
                  <td className="border border-border px-4 py-2">{r.cpu}</td>
                  <td className="border border-border px-4 py-2">{r.gpu}</td>
                  <td className="border border-border px-4 py-2">{r.speedup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
