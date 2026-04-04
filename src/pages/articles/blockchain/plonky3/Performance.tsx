import CodePanel from '@/components/ui/code-panel';
import {
  DFT_COMPARISON, BENCH_CODE, BENCH_ANNOTATIONS,
  OPTIMIZATION_CODE, OPTIMIZATION_ANNOTATIONS,
} from './PerformanceData';

export default function Performance({ title }: { title?: string }) {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '성능 벤치마크'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3는 31비트 BabyBear 필드, Bowers FFT, SIMD 병렬 해싱 등
          다양한 최적화로 높은 증명 생성 성능을 달성합니다.
        </p>

        <h3>DFT 구현체 비교</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {DFT_COMPARISON.map(d => (
            <div key={d.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-mono text-xs font-bold text-indigo-400">{d.name}</p>
              <p className="text-[10px] text-foreground/50 mt-0.5">
                시간: {d.time} | 메모리: {d.memory}
              </p>
              <p className="text-xs mt-1 text-foreground/75">{d.desc}</p>
            </div>
          ))}
        </div>

        <h3>성능 특성</h3>
        <CodePanel title="BabyBear 기준 성능 분석" code={BENCH_CODE}
          annotations={BENCH_ANNOTATIONS} />

        <h3>최적화 기법</h3>
        <CodePanel title="배치/SIMD/메모리/병렬화 최적화" code={OPTIMIZATION_CODE}
          annotations={OPTIMIZATION_ANNOTATIONS} />
      </div>
    </section>
  );
}
