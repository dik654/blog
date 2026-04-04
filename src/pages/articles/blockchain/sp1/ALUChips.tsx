import CodePanel from '@/components/ui/code-panel';
import { ADD_CHIP_CODE, addChipAnnotations, ALU_CHIPS } from './ALUChipsData';

export default function ALUChips() {
  return (
    <section id="alu-chips" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ALU 칩 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 ALU 칩은 독립적인 <strong>AIR 제약 조건</strong>을 가집니다.
          32비트 연산을 바이트 단위로 분해하고, carry chain으로
          오버플로우를 처리하며, 선택자(is_add/is_sub)로
          칩 내 연산을 구분합니다.
        </p>
      </div>
      <div className="space-y-2 mt-4 mb-6">
        {ALU_CHIPS.map(c => (
          <div key={c.name} className="rounded-lg border p-3"
            style={{ borderColor: c.color + '30', background: c.color + '06' }}>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-mono text-xs font-bold" style={{ color: c.color }}>
                {c.name}
              </span>
              <span className="text-sm text-foreground/75">{c.desc}</span>
            </div>
            <p className="text-[11px] font-mono text-foreground/45 break-all">{c.cols}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel title="AddSubChip eval() 제약 조건" code={ADD_CHIP_CODE}
          annotations={addChipAnnotations} />
        <p>
          모든 ALU 칩은 동일한 패턴을 따릅니다: <code>Cols</code> 구조체 정의 →
          <code>Air::eval()</code> 구현 → <code>MachineAir::generate_trace()</code>에서
          ExecutionRecord의 이벤트를 행렬 행으로 변환합니다.
        </p>
      </div>
    </section>
  );
}
