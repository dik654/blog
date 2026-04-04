import CodePanel from '@/components/ui/code-panel';
import PerformanceViz from './viz/PerformanceViz';
import { PIPPENGER_CODE, PARALLEL_CODE, BENCHMARK_CODE } from './PerformanceData';

export default function Performance() {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 최적화</h2>
      <div className="not-prose mb-8"><PerformanceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16 증명 시간의 <strong>78%가 MSM</strong>입니다.<br />
          Pippenger 알고리즘, 멀티스레드 병렬화, 메모리 최적화를 통해 성능을 극대화합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Pippenger MSM</h3>
        <CodePanel
          title="O(n/log n) MSM 알고리즘"
          code={PIPPENGER_CODE}
          annotations={[
            { lines: [5, 6], color: 'sky', note: '최적 윈도우 크기' },
            { lines: [7, 9], color: 'emerald', note: '버킷 분류 + 시프트 누적' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">병렬 처리 전략</h3>
        <CodePanel
          title="rayon 기반 멀티스레드"
          code={PARALLEL_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: 'A/B + B_g2/B_g1 병렬' },
            { lines: [6, 7], color: 'amber', note: '8코어 ~5-7배 속도 향상' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">벤치마크 비교</h3>
        <p>
          벤치마크 비교 (BN254, 2^16 제약 기준)<br />
          단계 시간 비중<br />
          Setup ~2.5s 1회성<br />
          Prove ~1.8s 매번<br />
          witness ~0.1s 5%<br />
          FFT(h) ~0.3s 17%<br />
          MSM(A,B,C) ~1.4s 78%<br />
          Verify ~4ms O(1)<br />
          GPU 가속 시 Prove ~0.3s (6배 개선)
        </p>
      </div>
    </section>
  );
}
