import ParallelExecViz from './viz/ParallelExecViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ParallelExecution({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="parallel-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">병렬 실행 & Optimistic Concurrency</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Boost.Fiber 기반 경량 스레드로 모든 TX 동시 실행<br />
          Promise 체인으로 머지 순서 보장, 재실행 비율 10% 미만
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-parallel-exec', codeRefs['monad-parallel-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              execute_block.cpp — 병렬 실행 코어
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <ParallelExecViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
