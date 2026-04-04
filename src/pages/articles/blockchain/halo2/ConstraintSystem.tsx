import ConstraintGateViz from './viz/ConstraintGateViz';
import CodePanel from '@/components/ui/code-panel';
import { FLEX_GATE_CODE, RANGE_GATE_CODE } from './ConstraintSystemData';
import { flexGateAnnotations, rangeGateAnnotations } from './ConstraintSystemAnnotations';

export default function ConstraintSystem({ title }: { title?: string }) {
  return (
    <section id="constraint-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '제약 조건 시스템 (FlexGate & RangeGate)'}</h2>
      <div className="not-prose mb-8"><ConstraintGateViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          halo2-lib의 제약 조건 시스템은 <code>FlexGate</code>와 <code>RangeGate</code> 두 가지
          핵심 게이트로 구성됩니다. FlexGate는 단일 제약식 <code>q*(a + b*c - d) = 0</code>으로
          덧셈, 곱셈, 곱셈-덧셈을 모두 표현하며, RangeGate는 lookup 테이블로
          값의 범위를 효율적으로 검사합니다.
        </p>
        <p>
          <code>GateInstructions</code> 트레이트가 <code>add</code>, <code>sub</code>,
          <code>mul</code>, <code>inner_product</code>, <code>select</code>,
          <code>is_equal</code> 등 고수준 API를 제공하고,
          <code>RangeInstructions</code>는 limb 분해 기반 범위 검사를 담당합니다.
        </p>
        <CodePanel title="FlexGate — Vertical Gate Strategy" code={FLEX_GATE_CODE} annotations={flexGateAnnotations} />
        <CodePanel title="RangeGate — Lookup 기반 범위 검사" code={RANGE_GATE_CODE} annotations={rangeGateAnnotations} />
      </div>
    </section>
  );
}
