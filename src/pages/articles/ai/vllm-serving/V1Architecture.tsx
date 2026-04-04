import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';
import V1ArchViz from './viz/V1ArchViz';
import { engineCoreInit } from './codeRefs';

export default function V1Architecture() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">V1 멀티프로세스 아키텍처</h3>
      <div className="not-prose mb-6"><V1ArchViz /></div>

      <CitationBlock source="vllm/v1/engine/core.py — EngineCore.__init__" citeKey={3} type="code"
        href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/engine/core.py">
        <CodePanel
          title={`${engineCoreInit.file} — ${engineCoreInit.title}`}
          code={engineCoreInit.code}
          lang="python"
          startLine={engineCoreInit.startLine}
          annotations={engineCoreInit.annotations}
        />
        <p className="mt-2 text-xs text-foreground/70">
          V1 EngineCore — 별도 프로세스에서 실행, ZeroMQ IPC로 API Server와 통신.
          Executor &rarr; KV Cache 초기화 &rarr; Scheduler 생성 순서가 핵심
        </p>
      </CitationBlock>
    </>
  );
}
