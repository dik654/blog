import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import { levelParallelCode, csrCode, comparisonData } from './GpuApproachData';

export default function GpuApproach() {
  return (
    <section id="gpu-approach" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 접근법: 의존성 분석과 레벨 병렬화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          핵심 아이디어는 <strong>의존성 레벨</strong>별로 제약을 묶는 것이다.<br />
          같은 레벨의 제약은 서로 독립이므로 GPU 스레드 하나가 제약 하나를 담당한다.<br />
          레벨 수가 곧 순차 단계 수이고, 레벨당 제약 수가 GPU 활용도를 결정한다.
        </p>

        <CitationBlock source="Celer Network -- Parallel Witness Generation Research" citeKey={3} type="paper"
          href="https://celer.network">
          <p className="text-xs">
            실제 zkEVM 회로에서 레벨 수는 전체 제약 수의 0.1-1% 수준이다.<br />
            레벨당 평균 100-1000개 제약이 존재하여 GPU 병렬화가 효과적이다.
          </p>
        </CitationBlock>

        <CodePanel title="Level-Parallel GPU Solver" code={levelParallelCode}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '전처리: 의존성 분석 (CPU)' },
            { lines: [5, 7], color: 'emerald', note: 'GPU 메모리 할당 및 입력 전송' },
            { lines: [9, 16], color: 'amber', note: '레벨별 커널 실행 (핵심 루프)' },
            { lines: [17, 17], color: 'violet', note: '레벨 간 동기화 필수' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">희소 행렬: CSR 포맷</h3>
        <CodePanel title="CSR 포맷과 제약 시스템별 비교" code={csrCode}
          annotations={[
            { lines: [3, 6], color: 'sky', note: 'CSR: 비영 원소만 저장' },
            { lines: [8, 10], color: 'emerald', note: '밀집 vs CSR 메모리 비교' },
            { lines: [12, 14], color: 'amber', note: 'Plonkish는 CSR보다 더 효율적' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">제약 시스템별 병렬화 특성</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">시스템</th>
                <th className="border border-border px-4 py-2 text-left">제약 구조</th>
                <th className="border border-border px-4 py-2 text-left">GPU 메모리</th>
                <th className="border border-border px-4 py-2 text-left">병렬화 전략</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(([sys, structure, mem, strategy]) => (
                <tr key={sys}>
                  <td className="border border-border px-4 py-2 font-medium">{sys}</td>
                  <td className="border border-border px-4 py-2">{structure}</td>
                  <td className="border border-border px-4 py-2">{mem}</td>
                  <td className="border border-border px-4 py-2">{strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
