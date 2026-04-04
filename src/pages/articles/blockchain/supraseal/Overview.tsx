import CodePanel from '@/components/ui/code-panel';
import SealingPipelineViz from './viz/SealingPipelineViz';
import { SEALING_CODE, PERF_CODE } from './OverviewData';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요</h2>
      <div className="not-prose mb-8">
        <SealingPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SupraSeal</strong>은 Filecoin 스토리지 제공자를 위한
          고도로 최적화된 봉인(sealing) 프리미티브 컬렉션입니다.<br />
          기존 <code>rust-fil-proofs</code> 대비
          <strong>처리량 대비 비용</strong>을 극적으로 개선합니다.
        </p>
        <h3>Filecoin Sealing 6단계</h3>
        <CodePanel title="봉인 프로세스" code={SEALING_CODE}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'PC1: 가장 큰 병목 구간' },
            { lines: [6, 8], color: 'emerald', note: 'PC2: GPU 가속 대상' },
            { lines: [10, 11], color: 'amber', note: 'C1/C2: 증명 생성' },
          ]} />
        <h3>성능 개선 결과</h3>
        <CodePanel title="SupraSeal 성능" code={PERF_CODE}
          annotations={[
            { lines: [4, 6], color: 'sky', note: '코어 효율성 16배 향상' },
            { lines: [8, 10], color: 'emerald', note: '메모리 75% 절감' },
            { lines: [12, 14], color: 'amber', note: 'GPU 가속 PC2/C2' },
          ]} />
      </div>
    </section>
  );
}
