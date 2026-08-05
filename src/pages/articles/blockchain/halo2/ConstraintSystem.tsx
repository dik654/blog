import M from '@/components/ui/math';
import ConstraintGateViz from './viz/ConstraintGateViz';
import FlexGateViz from './viz/FlexGateViz';

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

        {/* FlexGate 구조 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">FlexGate &mdash; Vertical Gate Strategy</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>FlexGateConfig</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>basic_gates: Vec&lt;BasicGateConfig&gt;</code> &mdash; 4열(a, b, c, d) + selector q로 구성된 vertical gate 벡터.
                phase별로 생성
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>GateInstructions</code> 트레이트</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>add</code>, <code>sub</code>, <code>mul</code>, <code>inner_product</code>, <code>select</code>, <code>is_equal</code> &mdash;
                모두 내부적으로 <code>a + b*c = d</code> 단일 제약으로 환원
              </p>
            </div>
          </div>
        </div>

        {/* RangeGate 구조 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">RangeGate &mdash; Lookup 기반 범위 검사</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>RangeConfig</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>gate: FlexGateConfig</code> + <code>lookup_advice / lookup_bits</code> &mdash;
                FlexGate를 내장하고 lookup table 열을 추가
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>RangeInstructions</code> 트레이트</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>range_check(a, bits)</code> &mdash; 값을 limb로 분해하여 각 limb를 lookup table에서 검증.
                <code>check_less_than</code>, <code>is_less_than</code> 등 비교 연산 제공
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Gate 설계 원리 + RangeGate</h3>
        <div className="not-prose mb-4"><FlexGateViz /></div>

      </div>
    </section>
  );
}
