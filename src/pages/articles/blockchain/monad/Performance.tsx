import PerfBenchViz from './viz/PerfBenchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Performance({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 분석 & 벤치마크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          3가지 최적화 축: JIT 2.01x + 병렬 5.56x + io_uring 4.17x<br />
          EvmStackAllocator로 메모리 할당 16.7배 개선
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-perf-benchmark', codeRefs['monad-perf-benchmark'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              벤치마크 결과
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <PerfBenchViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
