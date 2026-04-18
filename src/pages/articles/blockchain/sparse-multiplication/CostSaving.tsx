import M from '@/components/ui/math';
import CostViz from './viz/CostViz';

export default function CostSaving() {
  return (
    <section id="cost-saving" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full vs Sparse 비용 비교</h2>
      <div className="not-prose mb-8"><CostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 번의 Fp12 곱셈에서 Full은 54 Fp곱, Sparse는 18 Fp곱이다.<br />
          차이는 <strong>36 Fp곱</strong>이고, 절감률은 67%다.
        </p>
        <p>
          이 절감은 단순 이론이 아니다.<br />
          실제 구현체(gnark, arkworks, py_ecc)에서{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul_by_034
          </code>{' '}
          함수는 Full{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            mul
          </code>{' '}
          대비 약 3배 빠르다.
        </p>
        <p>
          Karatsuba가 곱셈 횟수를 144에서 54로 줄였다면,
          sparse 구조는 54에서 18로 한 번 더 줄인다.<br />
          두 최적화는 독립적으로 작동하며, 함께 적용된다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">비용 비교 상세</h3>

        {/* 연산 비용 테이블 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4 overflow-x-auto">
          <div className="text-sm font-semibold mb-3">연산 비용 (Fp 곱셈 m 단위)</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium">Level</th>
                <th className="pb-2 pr-4 font-medium">연산</th>
                <th className="pb-2 font-medium">비용</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-muted"><td className="py-1.5 pr-4" rowSpan={3}>Fp2</td><td className="pr-4">mult (Karatsuba)</td><td>3m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">square</td><td>2m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">add</td><td>~0 (무시)</td></tr>
              <tr className="border-b border-muted"><td className="py-1.5 pr-4" rowSpan={4}>Fp6</td><td className="pr-4">mult (dense, Karatsuba-Toom)</td><td>18m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">square (dense)</td><td>~15m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">mul_by_01 (partially sparse)</td><td>13m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">mul_by_1 (very sparse)</td><td>7m</td></tr>
              <tr className="border-b border-muted"><td className="py-1.5 pr-4" rowSpan={5}>Fp12</td><td className="pr-4">mult (dense)</td><td>~54m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">sq (cyclotomic, GT subgroup)</td><td>~18m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">sq (generic)</td><td>~36m</td></tr>
              <tr className="border-b border-muted"><td className="pr-4">mul_by_034 / mul_by_014 (sparse)</td><td>~39m</td></tr>
              <tr><td className="pr-4">mul_034_by_034 (sparse x sparse)</td><td>~46m</td></tr>
            </tbody>
          </table>
        </div>

        {/* Miller loop 반복 비용 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Doubling step (매 반복)</div>
            <p className="text-sm text-muted-foreground mb-1">
              <M>{'f = f^2 \\cdot l_{T,T}(P)'}</M>
            </p>
            <ul className="text-sm text-muted-foreground space-y-0.5">
              <li>cyclotomic sq: 18m + line 계산: 15m + sparse mult: 39m</li>
              <li className="font-semibold">Total: ~72m</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Addition step (bit set 시)</div>
            <p className="text-sm text-muted-foreground mb-1">
              <M>{'f = f \\cdot l_{T,Q}(P)'}</M>
            </p>
            <ul className="text-sm text-muted-foreground space-y-0.5">
              <li>line 계산: 20m + sparse mult: 39m</li>
              <li className="font-semibold">Total: ~59m</li>
            </ul>
          </div>
        </div>

        {/* BN254 전체 비용 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">BN254 전체 페어링 비용 (sparse 적용)</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm text-muted-foreground mb-2">
            <div className="rounded bg-muted/50 p-2">64 doublings x 72m = 4,608m</div>
            <div className="rounded bg-muted/50 p-2">30 additions x 59m = 1,770m</div>
            <div className="rounded bg-muted/50 p-2">Final exp: ~3,100m</div>
            <div className="rounded bg-muted/50 p-2 font-semibold">Total: ~9,500m</div>
          </div>
          <p className="text-sm text-muted-foreground text-center">20 ns/Fp mult 기준: ~0.19 ms per pairing</p>
        </div>

        {/* Without sparse */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Sparse 없이 (가상 시나리오)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">64 doublings x (18+15+54) = 5,568m / 30 additions x (20+54) = 2,220m &rarr; Total: ~7,800m</div>
            <div className="rounded bg-muted/50 p-2">Sparse 절감: ~1,400m (Miller loop 18%, 전체 pairing ~15%)</div>
          </div>
        </div>

        {/* 실측 벤치마크 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">실측 벤치마크 (BLS12-381, x86)</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center"><strong>blst</strong>: 0.7 ms</div>
            <div className="rounded bg-muted/50 p-2 text-center"><strong>arkworks</strong>: 1.2 ms</div>
            <div className="rounded bg-muted/50 p-2 text-center"><strong>Go crypto</strong>: 1.4 ms</div>
            <div className="rounded bg-muted/50 p-2 text-center"><strong>py_ecc</strong>: 600 ms</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Groth16 verify: 3 pairings &asymp; 2 ms. BLS sig verify: 2 pairings &asymp; 1.5 ms.
          </p>
        </div>

        {/* Pairing 알고리즘 비교 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Ate pairing</div>
            <p className="text-sm text-muted-foreground">표준 Miller loop. Sparse 적용. 실무 지배적.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Optimal ate</div>
            <p className="text-sm text-muted-foreground">더 짧은 loop. Sparse mult 여전히 사용. 전체 더 빠름.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">R-ate pairing</div>
            <p className="text-sm text-muted-foreground">가장 짧음. 복잡한 구조. 주로 리서치 수준.</p>
          </div>
        </div>

        {/* 연구 방향 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">연구 방향</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Lazy reduction</strong> &mdash; 모듈러 감약 지연. +10-20% speedup.</li>
            <li><strong>SIMD sparse mults</strong> &mdash; AVX-512로 Fp2 병렬 처리. 구현체별 차이.</li>
            <li><strong>GPU batching</strong> &mdash; 독립 pairings 병렬. Sparse loop 배치 분담. ICICLE (CUDA).</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
