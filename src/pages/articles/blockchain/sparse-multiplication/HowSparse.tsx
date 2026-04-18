import M from '@/components/ui/math';
import HowSparseViz from './viz/HowSparseViz';

export default function HowSparse() {
  return (
    <section id="how-sparse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        어떤 슬롯끼리 곱해지는가
      </h2>
      <div className="not-prose mb-8"><HowSparseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Full Fp12 곱셈은 12개 슬롯 x 12개 슬롯 = 144개 항을 계산한다.<br />
          Karatsuba 최적화를 적용해도 <strong>54 Fp곱</strong>이 필요하다.
        </p>
        <p>
          Sparse 곱셈에서는 l(P)의 non-zero 슬롯이 3개뿐이다.
          0인 슬롯과의 곱은 항상 0이므로 건너뛸 수 있다.<br />
          실제 계산해야 할 항은 <strong>12 x 3 = 36개</strong>다.
        </p>
        <p>
          이 36개 항에 Karatsuba 트릭을 추가 적용하면{' '}
          <strong>18 Fp곱</strong>까지 줄어든다.<br />
          구현 코드에서는{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul_by_034
          </code>{' '}
          같은 이름으로 sparse 곱셈 전용 함수를 제공한다.
          "034"는 non-zero인 슬롯 인덱스를 뜻한다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">mul_by_034 구현 상세</h3>

        {/* Fp12 구조 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Fp12 원소 구조</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'f = c_0 + c_1 w'}</M> &mdash; <M>{'c_0, c_1'}</M> 각각 Fp6, <M>{'w^2 = v'}</M>.
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            각 Fp6 = <M>{'a_0 + a_1 v + a_2 v^2'}</M> (Fp2 x 3) &rarr; 총 12 Fp 계수 (6 Fp2 원소).
          </p>
          <div className="rounded bg-muted/50 p-3 text-sm text-muted-foreground">
            <span className="font-medium">Sparse line function:</span> <M>{'l = l_0 + l_3 w + l_4 wv'}</M> &mdash; 3개 Fp2 성분만 non-zero.
            "034"는 Fp12 배열의 위치 0, 3, 4.
          </div>
        </div>

        {/* Dense vs Sparse */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Dense x Dense</div>
            <p className="text-sm text-muted-foreground mb-2">
              <M>{'(a_0 + a_1 w)(b_0 + b_1 w)'}</M> = Fp6 mult 3회 (Karatsuba)
            </p>
            <p className="text-sm text-muted-foreground font-semibold">18 Fp2 mults = 54 Fp mults</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Dense x Sparse (mul_by_034)</div>
            <p className="text-sm text-muted-foreground mb-2">
              <M>{'l_{c0} = (l_0, 0, 0)'}</M>, <M>{'l_{c1} = (0, l_3, l_4)'}</M> &mdash; sparsity를 활용
            </p>
            <p className="text-sm text-muted-foreground font-semibold">13 Fp2 mults = ~39 Fp mults</p>
          </div>
        </div>

        {/* 세부 계산 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">세부 계산 (034 패턴)</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>f</M> = <code>(f00, f01, f02, f10, f11, f12)</code> (Fp2), <M>l</M> = <code>(l00, 0, 0, 0, l10, l11)</code>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium mb-1"><M>{'f_{c0} \\cdot l_{c0}'}</M></div>
              <p className="text-xs"><M>{'l_{00}'}</M>만 non-zero &rarr; 3 Fp2 mults</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium mb-1"><M>{'f_{c1} \\cdot l_{c1}'}</M></div>
              <p className="text-xs"><M>{'l_{10}, l_{11}'}</M> non-zero &rarr; 5 Fp2 mults (Karatsuba)</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium mb-1"><M>{'f_{c0} \\cdot l_{c1}'}</M></div>
              <p className="text-xs">Sparse mult &rarr; 5 Fp2 mults</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium mb-1"><M>{'f_{c1} \\cdot l_{c0}'}</M></div>
              <p className="text-xs"><M>{'l_{00}'}</M>만 non-zero &rarr; 3 Fp2 mults</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Clever Karatsuba 적용으로 최종 13 Fp2 mults = ~39 Fp mults.
          </p>
        </div>

        {/* arkworks 구현 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">arkworks 구현 패턴</div>
          <div className="text-sm text-muted-foreground font-mono space-y-0.5">
            <p><code>fn mul_by_034(self, c0, c3, c4) {'{'}</code></p>
            <p className="pl-4"><code>let a = self.c0 * Fp6::new(c0, 0, 0);</code></p>
            <p className="pl-4"><code>let b = self.c1 * Fp6::new(c3, c4, 0);</code></p>
            <p className="pl-4"><code>let c0 = Fp6::mul_by_nonresidue(b) + a;</code></p>
            <p className="pl-4"><code>let c1 = (self.c0+self.c1)*Fp6::new(c0+c3, c4, 0) - a - b;</code></p>
            <p><code>{'}'}</code></p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Fp12 레벨에서 Karatsuba + sparse 입력 활용.</p>
        </div>

        {/* 추가 최적화 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Sparse x Sparse (01234)</div>
            <p className="text-sm text-muted-foreground">
              두 sparse 원소 곱 &rarr; 5 non-zero 위치. <code>mul_034_by_034</code>.
              <M>{'l_1 \\cdot l_2'}</M>를 먼저 계산 후 <M>f</M>와 곱할 때 사용. 추가 절감.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">G2 Precomputation</div>
            <p className="text-sm text-muted-foreground">
              Line 계수를 Fp2 triple로 사전 계산 &mdash; 메모리 절약 + 캐시 친화적.
              BN254 pairing당 ~64 entries.
            </p>
          </div>
        </div>

        {/* 성능 + 비대칭 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">성능 영향</div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm text-muted-foreground mb-3">
            <div className="rounded bg-muted/50 p-2">Dense mult: ~55 ns</div>
            <div className="rounded bg-muted/50 p-2">Sparse <code>mul_by_034</code>: ~20 ns</div>
            <div className="rounded bg-muted/50 p-2 font-semibold">Speedup: 2.7x</div>
          </div>
          <p className="text-sm text-muted-foreground">
            Type-3 pairing (비대칭: <M>P</M> in <M>{'G_1'}</M>, <M>Q</M> in <M>{'G_2'}</M>)에서 line function이 sparse.
            Type-1 (대칭)은 sparse 불가 &rarr; 실무에서 Type-3 항상 선호.
          </p>
        </div>
      </div>
    </section>
  );
}
