import M from '@/components/ui/math';
import ConstraintGateViz from './viz/ConstraintGateViz';

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

        <h3 className="text-xl font-semibold mt-8 mb-3">Gate 설계 원리</h3>

        {/* 핵심 제약식 */}
        <div className="not-prose rounded-lg border-l-4 border-l-purple-500 bg-card p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-2">FlexGate 제약식</p>
          <M display>{'q(X) \\cdot \\bigl(a + b \\cdot c - d\\bigr) = 0'}</M>
          <p className="text-xs text-muted-foreground mt-2">
            evaluation domain의 모든 <M>{'X'}</M> 에서 성립. selector <M>{'q'}</M> 가 0이면 제약 비활성
          </p>
        </div>

        {/* 연산별 witness 할당 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">하나의 제약식 &rarr; 3가지 연산</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-sky-300">ADD(x, y)</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p><code>a=x, b=y, c=1, d=x+y</code></p>
                <M display>{'x + y \\cdot 1 = x + y \\;\\checkmark'}</M>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300">MUL(x, y)</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p><code>a=0, b=x, c=y, d=x*y</code></p>
                <M display>{'0 + x \\cdot y = x \\cdot y \\;\\checkmark'}</M>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-amber-300">MULADD(x, y, z)</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p><code>a=z, b=x, c=y, d=x*y+z</code></p>
                <M display>{'z + x \\cdot y = x \\cdot y + z \\;\\checkmark'}</M>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            단일 제약으로 세 연산을 모두 표현 &rarr; constraint 수 감소 &rarr; 증명 시간 단축
          </p>
        </div>

        {/* RangeGate Lookup 비교 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">RangeGate &mdash; Lookup vs Naive 비교</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-red-300">Naive Decomposition</p>
              <p className="text-xs text-muted-foreground mt-1">
                "값이 <M>{'[0,\\,2^{16})'}</M> 범위" 증명에 16 bit 분해 &rarr; <strong>16 constraints</strong>
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300">Lookup Table</p>
              <p className="text-xs text-muted-foreground mt-1">
                <M>{'[0,\\,2^{16})'}</M> 테이블을 미리 구성하고 lookup &rarr; <strong>1 constraint</strong>.
                Poseidon 등과 결합하여 효율 극대화
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
