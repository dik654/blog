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

        <h3 className="text-xl font-semibold mt-8 mb-3">Gate 설계 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Halo2 custom gate 수학
// q(X) · constraint_polynomial(X) = 0 (for all X in evaluation domain)

// FlexGate의 우아함
// 하나의 제약식으로 여러 연산 표현
// q_selector * (a + b*c - d) = 0

// 용법별 witness 할당
// ADD(x, y): a=x, b=1, c=y, d=x+y
//   → 0·1 + 1·y - (x+y) = y - x - y = -x ?
//   잠깐, 다시:
//   제약식: a + b*c = d
//   ADD: 0 + 1·y - (x+y)는 계산 오류
//   실제 용법: a=x, b=y, c=1, d=x+y
//   → x + y·1 = x+y ✓

// MUL(x, y): a=0, b=x, c=y, d=x·y
//   → 0 + x·y = x·y ✓

// MULADD(x, y, z): a=z, b=x, c=y, d=x·y+z
//   → z + x·y = x·y+z ✓

// 하나의 제약식 → 3가지 연산 가능
// → Constraint 수 감소 → prove 시간 단축

// RangeGate의 lookup
// "이 value가 [0, 2^16)에 있음" 증명
// Naive: 16 bit decomposition (16 constraints)
// Lookup: table [0, 2^16) 미리 만들어두고 lookup (1 constraint)
// Poseidon 등과 결합하여 효율 극대화`}</pre>

      </div>
    </section>
  );
}
