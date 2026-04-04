import MemoryReadViz from './viz/MemoryReadViz';
import CodePanel from '@/components/ui/code-panel';
import {
  MEMORY_STRUCT_CODE, memoryStructAnnotations,
  MR_CODE, mrAnnotations, LAYOUT,
} from './MemorySystemData';

export default function MemorySystem() {
  return (
    <section id="memory-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 관리 시스템</h2>
      <div className="not-prose mb-8"><MemoryReadViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1 메모리는 <strong>PagedMemory</strong>로 관리됩니다.
          16KB 페이지 단위로 지연 할당하며, 각 주소의 접근 이력을
          <strong>MemoryRecord</strong>(값 + 샤드 + 타임스탬프)로 추적합니다.
        </p>
        <CodePanel title="메모리 구조체" code={MEMORY_STRUCT_CODE}
          annotations={memoryStructAnnotations} />
        <h3>메모리 레이아웃</h3>
      </div>
      <div className="space-y-1.5 mt-4 mb-6">
        {LAYOUT.map(l => (
          <div key={l.name} className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="font-mono text-[11px] text-indigo-400 w-52 flex-shrink-0">
              {l.range}
            </span>
            <span className="font-mono text-xs font-bold text-foreground/70 w-28 flex-shrink-0">
              {l.name}
            </span>
            <span className="text-xs text-foreground/60">{l.desc}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel title="메모리 읽기 (mr 함수)" code={MR_CODE}
          annotations={mrAnnotations} />
      </div>
    </section>
  );
}
