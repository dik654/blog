import { CitationBlock } from '../../../../components/ui/citation';
import V1ArchViz from './viz/V1ArchViz';

export default function V1Architecture() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">V1 멀티프로세스 아키텍처</h3>
      <div className="not-prose mb-6"><V1ArchViz /></div>

      <CitationBlock source="vllm/v1/engine/core.py — EngineCore.__init__" citeKey={3} type="code"
        href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/engine/core.py">
        <div className="not-prose grid gap-3 sm:grid-cols-2 mt-2">
          <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">Executor</p>
            <p className="text-xs">GPU Worker 관리 — 모델 로딩 및 실행</p>
            <p className="text-xs font-mono mt-2 text-foreground/50">model_executor = executor_class(vllm_config)</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">KV Cache</p>
            <p className="text-xs">프로파일링 후 GPU 메모리에 KV 캐시 할당</p>
            <p className="text-xs font-mono mt-2 text-foreground/50">_initialize_kv_caches(vllm_config)</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Scheduler</p>
            <p className="text-xs">KV config 기반으로 요청 스케줄링</p>
            <p className="text-xs font-mono mt-2 text-foreground/50">Scheduler(vllm_config, kv_cache_config)</p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950 p-4">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">Batch Queue</p>
            <p className="text-xs">Pipeline Parallelism 배치 큐 설정</p>
            <p className="text-xs font-mono mt-2 text-foreground/50">batch_queue_size = max_concurrent_batches</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-foreground/70">
          V1 EngineCore — 별도 프로세스에서 실행, ZeroMQ IPC로 API Server와 통신.
          Executor &rarr; KV Cache 초기화 &rarr; Scheduler 생성 순서가 핵심
        </p>
      </CitationBlock>
    </>
  );
}
