import MonadArchViz from './viz/MonadArchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Monad 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Monad — EVM 호환 고성능 L1 블록체인<br />
          병렬 실행 + JIT 컴파일 + io_uring 비동기 I/O로 10,000+ TPS 목표
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-parallel-exec', codeRefs['monad-parallel-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              execute_block.cpp
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <MonadArchViz />
      </div>
    </section>
  );
}
