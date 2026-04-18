import M from '@/components/ui/math';
import CostViz from './viz/CostViz';

export default function CostComparison() {
  return (
    <section id="cost-comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BN254 비용 비교</h2>
      <div className="not-prose mb-8"><CostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BN254 페어링에서 Fp12 곱셈은 가장 빈번한 연산이다.
          <br />
          Miller Loop 254회 반복마다 Fp12 곱셈이 등장한다.
        </p>
        <p>
          Karatsuba 타워로 한 번의 Fp12 곱셈이 <strong>144 &rarr; 54</strong> Fp 곱셈으로 줄어든다.
          <br />
          2.7배의 절감이 254번 반복되므로, 페어링 전체 성능에 결정적인 차이를 만든다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BN254 페어링 비용 분석</h3>

        {/* 페어링 정의 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Pairing</div>
          <p className="text-sm text-muted-foreground">
            <M>{'e(P, Q): G_1 \\times G_2 \\to G_T'}</M> &mdash;
            <M>P</M> in <M>{'G_1'}</M> (curve over <M>{'\\mathbb{F}_p'}</M>),
            <M>Q</M> in <M>{'G_2'}</M> (curve over <M>{'\\mathbb{F}_{p^2}'}</M>),
            결과 in <M>{'G_T'}</M> (<M>{'\\mathbb{F}_{p^{12}}'}</M> subgroup).
            Ate pairing (optimal variant) &mdash; Miller loop + Final exponentiation.
          </p>
        </div>

        {/* Phase 1: Miller loop */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Phase 1: Miller Loop (주 비용)</div>
          <p className="text-sm text-muted-foreground mb-2">
            BN254: <M>{'t = 6x + 2'}</M>, <M>{'\\log_2(t) \\approx 64'}</M> iterations.
            매 반복: Fp12 squaring + sparse line mult (+ 비트 set 시 addition step).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground mb-2">
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium mb-1">Doubling step: ~38 Fp mults</div>
              <p className="text-xs">cyclotomic sq 9m + sparse mult 13m + line eval 6m + adds</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium mb-1">Addition step: ~47 Fp mults</div>
              <p className="text-xs">line eval 10m + sparse mult 13m + adds (bit set일 때만)</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            64 doublings + ~33 additions (Hamming weight): <M>{'64 \\times 38 + 33 \\times 47 \\approx 4{,}000'}</M> Fp mults.
          </p>
        </div>

        {/* Phase 2: Final exp */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Phase 2: Final Exponentiation</div>
          <M display>{'f^{(p^{12}-1)/r} = \\underbrace{f^{(p^6-1)}}_{\\text{easy part①}} \\cdot \\underbrace{f^{(p^2+1)}}_{\\text{easy part②}} \\cdot \\underbrace{f^{(p^4-p^2+1)/r}}_{\\text{hard part}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>f</M>: Miller loop 결과. <M>r</M>: 곡선 차수. easy part는 Frobenius로 저비용, hard part가 주 비용 (cyclotomic squaring 활용)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mt-3">
            <div className="rounded bg-muted/50 p-2"><M>{'p^6 - 1'}</M>: inversion + Fp6 mult</div>
            <div className="rounded bg-muted/50 p-2"><M>{'p^2 + 1'}</M>: Frobenius + Fp12 mult</div>
            <div className="rounded bg-muted/50 p-2">Hard part: ~400 cyclotomic sq + ~30 Fp12 mults</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Total final exp: ~3,600 Fp mults.</p>
        </div>

        {/* 전체 비용 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">전체 BN254 페어링 비용</div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm text-muted-foreground mb-2">
            <div className="rounded bg-muted/50 p-2">Miller loop: ~4,000m</div>
            <div className="rounded bg-muted/50 p-2">Final exp: ~3,600m</div>
            <div className="rounded bg-muted/50 p-2 font-semibold">Total: ~7,600m</div>
          </div>
          <p className="text-sm text-muted-foreground text-center">20ns/Fp mult 기준: ~0.15 ms per pairing</p>
        </div>

        {/* Karatsuba 영향 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Without Karatsuba</div>
            <p className="text-sm text-muted-foreground">
              Miller loop: 64 x 144 &asymp; 9,200m. Total: ~18,000m. ~0.36 ms/pairing.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">With Karatsuba</div>
            <p className="text-sm text-muted-foreground">
              Miller loop: 64 x 54 &asymp; 3,500m. Total: ~7,600m. ~0.15 ms/pairing. Speedup 2.4x.
            </p>
          </div>
        </div>

        {/* 벤치마크 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">실측 벤치마크</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Go (cloudflare/bn256)</div>
              <p>Single: ~1.5 ms / Batch 10: ~12 ms (shared exp)</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Rust (arkworks-bn254)</div>
              <p>Single: ~0.8 ms / BLST (asm): ~0.4 ms</p>
            </div>
          </div>
        </div>

        {/* 활용 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">최적화가 필요한 응용</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">ZK Proof Verification</div>
              <p>Groth16: 3 pairings / BLS sig: 1 pairing / Batch: N+1 pairings</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">Ethereum EIP-196/197</div>
              <p>BN254 pairing: 181,000 gas. zkSNARK verifiers, ZK rollups.</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">BLS Signatures</div>
              <p>~1M BLS sigs aggregated/epoch. 2 pairings + aggregate.</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <div className="font-medium mb-1">zk-Rollups</div>
              <p>Groth16 on-chain 검증. Gas 최적화 = L2 경제성.</p>
            </div>
          </div>
        </div>

        {/* 곡선 비교 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BN254</div>
            <p className="text-sm text-muted-foreground">
              ~100-110 bit security (하향 조정). Ethereum precompile로 여전히 사용.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BLS12-381</div>
            <p className="text-sm text-muted-foreground">
              128-bit security (현재 표준). 381-bit field. Zcash, Filecoin, Ethereum 2.0.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BLS12-377</div>
            <p className="text-sm text-muted-foreground">
              ZK 증명용 (arithmetic-friendly). Aleo, Celo, 일부 zkVM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
