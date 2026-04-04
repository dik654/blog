import CodePanel from '@/components/ui/code-panel';
import FractalIndexerViz from './viz/FractalIndexerViz';
import { FRACTAL_CODE, VERIFY_CODE } from './FractalPCSData';

export default function FractalPCS() {
  return (
    <section id="fractal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fractal PCS</h2>
      <div className="not-prose mb-8">
        <FractalIndexerViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Fractal</strong>은 홀로그래픽 IOP 기반 프로토콜로,
          <strong>인덱서(Indexer)</strong>를 통한 전처리로
          검증 시간을 O(N)에서 <strong>O(log N)</strong>으로 단축합니다.<br />
          동일한 회로에 대해 인덱스를 재사용할 수 있어
          대규모 시스템에서 효율적입니다.
        </p>
        <h3>인덱서: 행렬 분해</h3>
        <CodePanel title="Fractal 인덱서 구조" code={FRACTAL_CODE}
          annotations={[
            { lines: [4, 5], color: 'sky', note: 'A, B, C 행렬별 인덱서' },
            { lines: [8, 10], color: 'emerald', note: 'row/col/val 다항식 분해' },
            { lines: [13, 15], color: 'amber', note: '오라클 핸들 등록' },
          ]} />
        <h3>O(log N) 검증 시간</h3>
        <CodePanel title="Fractal 검증 매개변수" code={VERIFY_CODE}
          annotations={[
            { lines: [6, 12], color: 'sky', note: '전처리 매개변수 설정' },
            { lines: [14, 16], color: 'emerald', note: '인덱스 재사용 및 IVC' },
          ]} />
      </div>
    </section>
  );
}
