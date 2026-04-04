import ChipInteractionViz from './viz/ChipInteractionViz';
import CodePanel from '@/components/ui/code-panel';
import {
  RISCV_AIR_CODE, riscvAirAnnotations,
  AIR_BUILDER_CODE, airBuilderAnnotations, CPU_ROLE,
} from './ChipArchitectureData';

export default function ChipArchitecture() {
  return (
    <section id="chip-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">칩 아키텍처</h2>
      <div className="not-prose mb-8"><ChipInteractionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1의 AIR 시스템은 <strong>RiscvAir enum</strong>으로
          20개 이상의 칩을 정의합니다. CPU 칩이 중앙 조정자 역할을 하며,
          각 연산을 전담 칩에 <code>send_interaction</code>으로 위임합니다.
        </p>
        <CodePanel title="RiscvAir 열거형" code={RISCV_AIR_CODE}
          annotations={riscvAirAnnotations} />
        <h3>CPU 칩의 역할</h3>
      </div>
      <div className="space-y-1.5 mt-4 mb-6">
        {CPU_ROLE.map(r => (
          <div key={r.role} className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="font-mono text-xs font-bold text-indigo-400 w-32 flex-shrink-0">
              {r.role}
            </span>
            <span className="text-sm text-foreground/75">{r.desc}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel title="SP1CoreAirBuilder trait" code={AIR_BUILDER_CODE}
          annotations={airBuilderAnnotations} />
      </div>
    </section>
  );
}
