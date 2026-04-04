import CodePanel from '@/components/ui/code-panel';
import OptPipelineViz from './viz/OptPipelineViz';
import { FFT_CODE, OPT_CODE } from './OptimizationData';

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">최적화</h2>
      <div className="not-prose mb-8">
        <OptPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libiop는 실용적 성능을 위해 다양한 최적화 기법을 적용합니다.
          <strong>NTT</strong>(Number Theoretic Transform)로 다항식 연산을 가속하고,
          배치 역원 계산, 코셋 FFT, 지연 머클 트리 등으로
          메모리와 연산 비용을 줄입니다.
        </p>
        <h3>NTT(Number Theoretic Transform)</h3>
        <CodePanel title="OptimizedNTT 구현" code={FFT_CODE}
          annotations={[
            { lines: [6, 7], color: 'sky', note: '미리 계산된 단위근 테이블' },
            { lines: [10, 10] as [number, number], color: 'emerald', note: '비트 역순 정렬' },
            { lines: [15, 19], color: 'amber', note: 'Cooley-Tukey 버터플라이' },
          ]} />
        <h3>핵심 최적화 기법</h3>
        <CodePanel title="최적화 기법 요약" code={OPT_CODE}
          annotations={[
            { lines: [3, 5], color: 'sky', note: '배치 역원: 3(n-1) 곱셈' },
            { lines: [8, 9], color: 'emerald', note: '코셋 FFT 소거' },
            { lines: [12, 17], color: 'amber', note: '지연 머클 트리' },
            { lines: [20, 21], color: 'violet', note: 'SIMD 병렬 해싱' },
          ]} />
      </div>
    </section>
  );
}
