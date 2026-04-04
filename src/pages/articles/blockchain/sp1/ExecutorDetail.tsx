import ExecutionCycleViz from './viz/ExecutionCycleViz';
import CodePanel from '@/components/ui/code-panel';
import {
  EXECUTOR_STRUCT_CODE, executorStructAnnotations,
  EXEC_MODES_DETAIL, CYCLE_CODE, cycleAnnotations,
} from './ExecutorDetailData';

export default function ExecutorDetail() {
  return (
    <section id="executor-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Core Executor 심층 분석</h2>
      <div className="not-prose mb-8"><ExecutionCycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Executor는 <strong>RISC-V RV32IM</strong> 명령어를 해석 실행하면서
          증명에 필요한 모든 이벤트를 기록합니다.<br />
          실행 모드에 따라 기록 수준이 달라집니다.
        </p>
        <CodePanel title="Executor 구조체 상세" code={EXECUTOR_STRUCT_CODE}
          annotations={executorStructAnnotations} />
        <h3>ExecutorMode 상세</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-6">
        {EXEC_MODES_DETAIL.map(m => (
          <div key={m.name} className="rounded-lg border p-3"
            style={{ borderColor: m.color + '30', background: m.color + '06' }}>
            <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.name}</p>
            <p className="text-xs text-foreground/60 mt-1">{m.fields}</p>
            <p className="text-xs text-foreground/75 mt-1">→ {m.useCase}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel title="실행 사이클 (execute_cycle)" code={CYCLE_CODE}
          annotations={cycleAnnotations} />
      </div>
    </section>
  );
}
