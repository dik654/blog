import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ExecutionTraceViz from './viz/ExecutionTraceViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ExecutionTrace({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="execution-trace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>call()</code>은 Helios의 핵심 함수다.
          ProofDB 생성 → revm 빌드 → EVM 실행 → 결과 추출의 4단계로 구성된다.
          EVM 코드는 Reth와 동일하고, DB 레이어(ProofDB)만 교체한다.
        </p>
      </div>

      {/* Viz: 4 step — call 흐름 / lazy loading / estimate_gas / Reth 비교 */}
      <div className="not-prose my-8">
        <ExecutionTraceViz />
      </div>

      {/* 소스 보기 */}
      <div className="not-prose mt-4">
        <div className="flex items-center gap-2 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-evm-call', codeRefs['hl-evm-call'])} />
          <span className="text-[10px] text-muted-foreground">evm.rs — call() 전체 흐름</span>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-evm-estimate', codeRefs['hl-evm-estimate'])} />
          <span className="text-[10px] text-muted-foreground">evm.rs — estimate_gas() + 10% 마진</span>
        </div>
      </div>
    </section>
  );
}
