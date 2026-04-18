import M from '@/components/ui/math';
import RecursiveViz from './viz/RecursiveViz';

export default function Recursive() {
  return (
    <section id="recursive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        재귀 적용: Fp2 &rarr; Fp6 &rarr; Fp12 타워
      </h2>
      <div className="not-prose mb-8"><RecursiveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Karatsuba는 한 층에서만 적용되는 기법이 아니다.
          <br />
          확장체 타워의 <strong>각 층</strong>에서 재귀적으로 적용된다.
        </p>
        <p>
          Fp2 곱셈에서 Fp 곱셈 4회 &rarr; 3회. Fp6 곱셈에서 Fp2 곱셈 9회 &rarr; 6회.
          <br />
          Fp12 곱셈에서 Fp6 곱셈 4회 &rarr; 3회.
          <br />
          각 단계의 절감이 곱해져서, 최종적으로 Fp12 곱셈 한 번에 필요한 Fp 곱셈이
          <strong> 144회에서 54회</strong>로 줄어든다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">확장체 타워 재귀 적용</h3>

        {/* 타워 정의 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BN254 Tower</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'\\mathbb{F}_p \\to \\mathbb{F}_{p^2} = \\mathbb{F}_p[u]/(u^2+1)'}</M></li>
              <li><M>{'\\mathbb{F}_{p^2} \\to \\mathbb{F}_{p^6} = \\mathbb{F}_{p^2}[v]/(v^3-(u+9))'}</M></li>
              <li><M>{'\\mathbb{F}_{p^6} \\to \\mathbb{F}_{p^{12}} = \\mathbb{F}_{p^6}[w]/(w^2-v)'}</M></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BLS12-381 Tower</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'\\mathbb{F}_p \\to \\mathbb{F}_{p^2} = \\mathbb{F}_p[u]/(u^2+1)'}</M></li>
              <li><M>{'\\mathbb{F}_{p^2} \\to \\mathbb{F}_{p^6} = \\mathbb{F}_{p^2}[v]/(v^3-(u+1))'}</M></li>
              <li><M>{'\\mathbb{F}_{p^6} \\to \\mathbb{F}_{p^{12}} = \\mathbb{F}_{p^6}[w]/(w^2-v)'}</M></li>
            </ul>
          </div>
        </div>

        {/* Level 1: Fp2 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Level 1: Fp2 Karatsuba</div>
          <p className="text-sm text-muted-foreground">
            Fp2 mult = 3 Fp mults + adds (vs 4 naive). Fp2 square = 2 Fp squares + adds.
          </p>
        </div>

        {/* Level 2: Fp6 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Level 2: Fp6 Karatsuba-Toom</div>
          <p className="text-sm text-muted-foreground mb-2">
            원소 <M>{'(a, b, c)'}</M> where each is Fp2. 곱셈 <M>{'(a+bv+cv^2)(d+ev+fv^2)'}</M>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-red-500 mb-1">Naive: 9 Fp2 mults</div>
              <p className="text-sm text-muted-foreground"><M>{'ad, ae, af, bd, be, bf, cd, ce, cf'}</M></p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-emerald-500 mb-1">Karatsuba-Toom: 6 Fp2 mults</div>
              <div className="text-sm text-muted-foreground font-mono space-y-0.5">
                <p><code>v0=a*d, v1=b*e, v2=c*f</code></p>
                <p><code>v3=(a+b)(d+e)-v0-v1</code></p>
                <p><code>v4=(b+c)(e+f)-v1-v2</code></p>
                <p><code>v5=(a+c)(d+f)-v0-v2</code></p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <M>{'v^3'}</M> 감약 시 <M>{'(u+1)'}</M> 곱은 저비용 (permutation).
          </p>
        </div>

        {/* Level 3: Fp12 */}
        <div className="not-prose rounded-lg border-l-4 border-l-purple-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Level 3: Fp12 Karatsuba</div>
          <p className="text-sm text-muted-foreground mb-2">
            원소 <M>{'(a, b)'}</M> where each is Fp6. 곱셈 <M>{'(a + bw)(c + dw)'}</M>, <M>{'w^2 = v'}</M>.
          </p>
          <div className="text-sm text-muted-foreground font-mono space-y-0.5">
            <p><code>v0 = a*c</code>, <code>v1 = b*d</code>, <code>v2 = (a+b)(c+d) - v0 - v1</code></p>
            <p><code>c0 = v0 + v1*v</code> (v 곱은 shift), <code>c1 = v2</code></p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Naive 4 &rarr; Karatsuba 3 Fp6 mults.</p>
        </div>

        {/* 총 절감 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Total 절감 (곱셈적 누적)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-red-500 mb-1">Naive</div>
              <M display>{'\\underbrace{4}_{\\text{Fp12→Fp6}} \\times \\underbrace{9}_{\\text{Fp6→Fp2}} \\times \\underbrace{4}_{\\text{Fp2→Fp}} = 144 \\text{ Fp mults}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                각 층에서 naive 곱셈 수가 곱해진 결과. 최적화 없이 Fp12 곱셈 1회에 144번의 Fp 곱셈
              </p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="text-xs font-mono text-emerald-500 mb-1">Karatsuba (all levels)</div>
              <M display>{'\\underbrace{3}_{\\text{Karatsuba}} \\times \\underbrace{6}_{\\text{Toom-like}} \\times \\underbrace{3}_{\\text{Karatsuba}} = 54 \\text{ Fp mults}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                각 층에서 Karatsuba/Toom 적용 후 곱셈 수. 144 대비 62% 절감 (2.67배 빠름)
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center font-semibold">
            개선: 144 / 54 = 2.67x
          </p>
        </div>

        {/* Squaring */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Squaring 절감</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>Fp12 squaring (naive): 144 Fp mults &rarr; Karatsuba: ~36 Fp mults (4x 개선)</div>
            <div>Final exponentiation에서 ~200회 squaring &rarr; 누적 절감 매우 큼</div>
          </div>
        </div>

        {/* Miller Loop 비용 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Miller Loop 비용 (BN254, 254 iterations)</div>
          <p className="text-sm text-muted-foreground mb-2">
            각 반복: line function eval (sparse) + Fp12 mult (full) + Fp12 squaring.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">Naive: 254 x (144+144+sparse) &asymp; 80,000 Fp mults</div>
            <div className="rounded bg-muted/50 p-2">Karatsuba: 254 x (54+36+sparse) &asymp; 28,000 Fp mults (~2.8x)</div>
          </div>
        </div>

        {/* Sparse mult + 성능 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Sparse 곱셈 (line functions)</div>
            <p className="text-sm text-muted-foreground">
              Normal Fp12 mult 3 Fp6 mults &rarr; Sparse mult 2 Fp6 mults. 추가 33% 절감.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BLST 실측 (BLS12-381)</div>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>Fp mult: ~80 ns / Fp2: ~250 ns / Fp6: ~1700 ns</p>
              <p>Fp12 mult: ~5300 ns / Fp12 sq: ~3500 ns</p>
              <p className="font-semibold">Pairing: ~1.5 ms (MSM 최적화 시 ~0.8 ms)</p>
            </div>
          </div>
        </div>

        {/* 추가 최적화 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">추가 최적화 기법</div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><strong>Lazy reduction</strong> &mdash; 중간 값을 감약하지 않고 유지, 최종 결과에서만 감약. 20-30% 추가 절감.</li>
            <li><strong>Cyclotomic subgroup squaring</strong> &mdash; Final exponentiation 전용. Fp12 cyclotomic sq = 9 Fp mults (vs 36 generic, 4x).</li>
            <li><strong>Frobenius precomputation</strong> &mdash; Frobenius 연산자 거듭제곱 사전 계산. Final exponentiation에 활용.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
