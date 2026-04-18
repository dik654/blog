import M from '@/components/ui/math';
import TrickViz from './viz/TrickViz';

export default function KaratsubaTrick() {
  return (
    <section id="karatsuba-trick" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Karatsuba 트릭: 3회로 줄이기</h2>
      <div className="not-prose mb-8"><TrickViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          핵심 관찰: ad + bc = (a+b)(c+d) - ac - bd.
          <br />
          ac와 bd는 실수부 계산에 이미 필요하므로 <strong>재사용</strong>할 수 있다.
        </p>
        <p>
          곱셈은 3번(ac, bd, (a+b)(c+d))만 수행하고,
          나머지는 덧셈과 뺄셈으로 해결한다.
          <br />
          덧셈이 2회 더 늘어나지만, 곱셈 1회를 절약하는 것이 훨씬 이득이다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Karatsuba Fp2 구현 상세</h3>

        {/* Karatsuba 관찰 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Karatsuba 관찰</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'z_1 = a_1 + b_1 u'}</M>, <M>{'z_2 = a_2 + b_2 u'}</M>. 교차항을 기존 곱으로 표현:
          </p>
          <M display>{'\\underbrace{a_1 b_2 + a_2 b_1}_{\\text{허수부 (교차항)}} = \\underbrace{(a_1 + b_1)(a_2 + b_2)}_{\\text{새 곱셈 1회}} - \\underbrace{a_1 a_2}_{\\text{이미 계산}} - \\underbrace{b_1 b_2}_{\\text{이미 계산}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'a_1 a_2'}</M>와 <M>{'b_1 b_2'}</M>는 실수부 <M>{'a_1 a_2 - b_1 b_2'}</M>에 이미 필요 &rarr; 재사용하여 곱셈 1회 절약
          </p>
        </div>

        {/* 알고리즘 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">알고리즘 (3 mults)</div>
          <div className="text-sm text-muted-foreground font-mono space-y-0.5">
            <p><code>let v0 = a1 * a2;</code> <span className="text-xs text-muted-foreground/60">// mult #1</span></p>
            <p><code>let v1 = b1 * b2;</code> <span className="text-xs text-muted-foreground/60">// mult #2</span></p>
            <p><code>let s1 = a1 + b1;</code></p>
            <p><code>let s2 = a2 + b2;</code></p>
            <p><code>let v2 = s1 * s2;</code> <span className="text-xs text-muted-foreground/60">// mult #3</span></p>
            <p className="mt-1"><code>let real = v0 - v1;</code> <span className="text-xs text-muted-foreground/60">// <M>{'a_1 a_2 - b_1 b_2'}</M></span></p>
            <p><code>let imag = v2 - v0 - v1;</code> <span className="text-xs text-muted-foreground/60">// <M>{'a_1 b_2 + a_2 b_1'}</M></span></p>
          </div>
        </div>

        {/* 비용 비교 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">비용 비교</div>
            <table className="w-full text-sm text-muted-foreground">
              <tbody>
                <tr className="border-b border-muted"><td className="py-1 pr-3"></td><td className="pr-3 font-medium">Naive</td><td className="font-medium">Karatsuba</td></tr>
                <tr className="border-b border-muted"><td className="py-1 pr-3">Mults</td><td className="pr-3">4</td><td>3</td></tr>
                <tr className="border-b border-muted"><td className="py-1 pr-3">Add/Sub</td><td className="pr-3">2</td><td>5</td></tr>
                <tr><td className="py-1 pr-3">절감</td><td className="pr-3" colSpan={2}>-1 mult (~20 cyc) +3 add (~9 cyc) = 순 ~11 cyc 절감</td></tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Squaring 최적화 (2 mults)</div>
            <M display>{'z^2 = (a + bu)^2 = \\underbrace{(a^2 - b^2)}_{\\text{실수부 = (a+b)(a-b), 1 mult}} + \\underbrace{2ab}_{\\text{허수부, 1 mult}} \\cdot u'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'a^2 - b^2'}</M>를 <M>{'(a+b)(a-b)'}</M>로 변환하면 곱셈 1회. <M>{'2ab'}</M>도 곱셈 1회. 총 2회로 squaring 완료
            </p>
          </div>
        </div>

        {/* arkworks 구현 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">arkworks 구현 패턴</div>
          <div className="text-sm text-muted-foreground font-mono space-y-0.5">
            <p><code>let v0 = self.c0 * other.c0;</code></p>
            <p><code>let v1 = self.c1 * other.c1;</code></p>
            <p><code>let c0 = v0 - v1;</code> <span className="text-xs text-muted-foreground/60">// <M>{'u^2 = -1'}</M></span></p>
            <p><code>let c1 = (self.c0 + self.c1) * (other.c0 + other.c1) - v0 - v1;</code></p>
          </div>
        </div>

        {/* 일반화 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">다른 <M>{'u^2'}</M>로 일반화</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'\\mathbb{F}_{p^2} = \\mathbb{F}_p[u] / (u^2 - \\beta)'}</M> &mdash; <M>{'\\beta'}</M>는 -1, -2, -5 등.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2"><M>{'\\beta = -1'}</M> (BN254, BLS12-381): <code>c0 = v0 - v1</code></div>
            <div className="rounded bg-muted/50 p-2"><M>{'\\beta = -5'}</M>: <code>c0 = v0 + 5*v1</code> (소정수 곱 저비용)</div>
            <div className="rounded bg-muted/50 p-2">NQR: 체 선택에 따라 구성 변경</div>
          </div>
        </div>

        {/* Assembly 최적화 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Assembly 최적화 (BLST)</div>
          <p className="text-sm text-muted-foreground">
            BLST (Supranational): hand-written <code>.asm</code>으로 Rust intrinsics 대비 ~20% 빠른 Fp2 mult.
            세심한 레지스터 할당 + 파이프라인 Montgomery reduction.
          </p>
        </div>
      </div>
    </section>
  );
}
