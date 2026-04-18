import M from '@/components/ui/math';
import NaiveViz from './viz/NaiveViz';

export default function NaiveMul() {
  return (
    <section id="naive-mul" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Naive 곱셈: 4회 방식</h2>
      <div className="not-prose mb-8"><NaiveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          (a+bu)(c+du)를 전개하면 ac + adu + bcu + bdu²가 된다.
          <br />
          여기서 u² = -1을 대입하면 실수부는 ac - bd, 허수부는 ad + bc다.
        </p>
        <p>
          총 <strong>4번의 Fp 곱셈</strong>과 2번의 Fp 덧셈/뺄셈이 필요하다.
          <br />
          Fp 곱셈 한 번은 256-bit 정수의 Montgomery 곱셈이므로 비용이 크다.
          <br />
          덧셈은 곱셈 대비 약 1/10의 비용이다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Naive Fp2 곱셈 구현 상세</h3>

        {/* Fp2 정의 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Fp2 구조</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'\\mathbb{F}_{p^2} = \\mathbb{F}_p[u] / (u^2 + 1)'}</M> &mdash; <M>{'u^2 = -1'}</M> (허수 단위).
            원소 표현: <M>{'z = a + bu'}</M> where <M>{'a, b \\in \\mathbb{F}_p'}</M>.
          </p>
        </div>

        {/* 곱셈 전개 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">곱셈 전개</div>
          <M display>{'z_1 z_2 = (a_1 + b_1 u)(a_2 + b_2 u) = \\underbrace{(a_1 a_2 - b_1 b_2)}_{\\text{실수부 (2 mults)}} + \\underbrace{(a_1 b_2 + a_2 b_1)}_{\\text{허수부 (2 mults)}} \\cdot u'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'z_1, z_2'}</M>: Fp2 원소. <M>u</M>: 허수 단위 (<M>{'u^2 = -1'}</M>). 실수부와 허수부 각각 2회씩, 총 4회 곱셈
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">실수부: <M>{'a_1 a_2 - b_1 b_2'}</M> &mdash; 2 mults + 1 sub</div>
            <div className="rounded bg-muted/50 p-2">허수부: <M>{'a_1 b_2 + a_2 b_1'}</M> &mdash; 2 mults + 1 add</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 font-semibold">Total: 4 mults + 2 add/sub</p>
        </div>

        {/* Pseudocode */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Rust Pseudocode (naive)</div>
          <div className="text-sm text-muted-foreground font-mono space-y-0.5">
            <p><code>let t1 = a1 * a2;</code> <span className="text-xs text-muted-foreground/60">// mult #1</span></p>
            <p><code>let t2 = b1 * b2;</code> <span className="text-xs text-muted-foreground/60">// mult #2</span></p>
            <p><code>let t3 = a1 * b2;</code> <span className="text-xs text-muted-foreground/60">// mult #3</span></p>
            <p><code>let t4 = a2 * b1;</code> <span className="text-xs text-muted-foreground/60">// mult #4</span></p>
            <p><code>let real = t1 - t2;</code></p>
            <p><code>let imag = t3 + t4;</code></p>
          </div>
        </div>

        {/* CPU 성능 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">CPU 성능 (256-bit field, x86_64)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Fp 곱셈</div>
              <p>~18-25 cycles (BMI2, ADX). Montgomery multiplication 사용.</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Fp 덧셈/뺄셈</div>
              <p>~2-3 cycles. Add + conditional subtract.</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">비율</div>
              <p>1 Fp mult = 8-10 Fp adds &rarr; 곱셈 절감이 핵심</p>
            </div>
          </div>
        </div>

        {/* Montgomery multiplication */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Montgomery Multiplication</div>
          <p className="text-sm text-muted-foreground mb-2">
            전통적 방식: <M>{'a \\times b \\bmod p'}</M> &mdash; 나눗셈 ~100 cycles (매우 느림).
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Montgomery: <M>x</M>를 <M>{'xR \\bmod p'}</M>로 표현 (<M>{'R = 2^{256}'}</M>). 곱셈이 add-and-shift로 변환 &mdash; 나눗셈 불필요.
          </p>
          <div className="text-sm text-muted-foreground">
            절차: schoolbook 256x256=512 &rarr; Montgomery reduction &rarr; conditional subtract. ~18 cycles (vs 100+).
          </div>
        </div>

        {/* 페어링 영향 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">페어링에 미치는 영향 (BN254)</div>
          <p className="text-sm text-muted-foreground mb-2">
            Miller Loop 254 반복. 각 반복: Fp12 곱셈 다수. Naive chain:
          </p>
          <M display>{'\\text{Fp12 mult} = \\underbrace{4}_{\\text{Fp12→Fp6}} \\times \\underbrace{9}_{\\text{Fp6→Fp2}} \\times \\underbrace{4}_{\\text{Fp2→Fp}} = 144 \\text{ Fp mults}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            각 층의 naive 곱셈 수가 곱해져서 144회. Karatsuba 적용 시 3 x 6 x 3 = 54회로 감소
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            전체 페어링: ~50,000 Fp mults &rarr; 20 cycles/mult 기준 ~1ms. Karatsuba 적용 시 ~0.35ms.
          </p>
        </div>

        {/* SIMD */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">SIMD 벡터화 (Fp2 레벨)</div>
          <p className="text-sm text-muted-foreground">
            AVX-512: 8 x 64-bit ops/instruction. BN254 modulus = 4 limbs &rarr; Fp 2개가 한 레지스터에 적합.
            <M>{'a_1 a_2, b_1 b_2'}</M> 병렬 + <M>{'a_1 b_2, a_2 b_1'}</M> 병렬. 실제 속도 1.5-2x. arkworks, Geth precompile에서 사용.
          </p>
        </div>
      </div>
    </section>
  );
}
