import CodePanel from '@/components/ui/code-panel';
import { COST_MODEL, BENCH_CODE, BENCH_ANNOTATIONS } from './PerformanceData';

export default function Performance({ title }: { title?: string }) {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '성능 & 비용 분석'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Walrus의 RedStuff 2D 이레이저 코딩은 전통적인 3x 복제 대비
          <strong>~4.5x 확장 비율</strong>로 유사한 내결함성을 달성합니다.<br />
          SIMD 최적화 RS 인코딩으로 대용량 블롭도 효율적으로 처리합니다.
        </p>

        <h3>비용 모델</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {COST_MODEL.map(c => (
            <div key={c.metric} className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-teal-400">{c.metric}</span>
                <span className="text-xs text-foreground/60">{c.value}</span>
              </div>
              <p className="text-xs mt-1 text-foreground/75">{c.desc}</p>
            </div>
          ))}
        </div>

        <h3>성능 벤치마크</h3>
        <CodePanel title="인코딩/네트워크/복구 비용 분석" code={BENCH_CODE}
          annotations={BENCH_ANNOTATIONS} />
      </div>
    </section>
  );
}
