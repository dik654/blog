import BuildPipelineViz from './viz/BuildPipelineViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATES, BUILD_CODE, buildAnnotations } from './ProjectStructureData';

export default function ProjectStructure() {
  return (
    <section id="project-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">크레이트 구조 &amp; 빌드 파이프라인</h2>
      <div className="not-prose mb-8"><BuildPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1은 <strong>8개 핵심 크레이트</strong>로 구성됩니다.<br />
          각 크레이트가 독립적 책임을 가지며, 빌드 시 Rust 소스가
          LLVM riscv32im 백엔드를 거쳐 ELF 바이너리로 컴파일됩니다.
        </p>
      </div>
      <div className="space-y-1.5 mt-4 mb-6">
        {CRATES.map(c => (
          <div key={c.name} className="rounded-lg border p-3 flex items-start gap-3"
            style={{ borderColor: c.color + '30', background: c.color + '06' }}>
            <span className="text-xs font-mono font-bold mt-0.5 w-44 flex-shrink-0"
              style={{ color: c.color }}>{c.name}</span>
            <span className="text-sm text-foreground/75">{c.desc}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel title="빌드 파이프라인" code={BUILD_CODE} annotations={buildAnnotations} />
      </div>
    </section>
  );
}
