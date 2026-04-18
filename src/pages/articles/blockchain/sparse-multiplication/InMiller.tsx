import M from '@/components/ui/math';
import InMillerViz from './viz/InMillerViz';
import MillerLoopTraceViz from './viz/MillerLoopTraceViz';

export default function InMiller() {
  return (
    <section id="in-miller" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">254회 반복의 누적 효과</h2>
      <div className="not-prose mb-8"><InMillerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Miller Loop는 약 254번 반복한다.<br />
          매 반복마다 f = f² * l(P) 연산이 있으므로,
          sparse 곱셈은 254번 적용된다.
        </p>
        <p>
          Full로 계산하면 254 x 54 = 약 <strong>13,700 Fp곱</strong>이다.<br />
          Sparse로 계산하면 254 x 18 = 약 <strong>4,600 Fp곱</strong>이다.<br />
          절감량은 약 <strong>9,100 Fp곱</strong>이다.
        </p>
        <p>
          전체 페어링 연산(Miller Loop + Final Exp)은 약 20,000 Fp곱이다.
          sparse 곱셈 최적화 하나로 전체의 약 <strong>45%</strong>를 절약한다.
        </p>
        <p>
          twist가 sparse를 만들고, sparse가 페어링을 실용적으로 만든다.<br />
          이 최적화 없이는 ZK-SNARK 검증이 현실적인 시간 내에 불가능하다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Miller Loop 누적 최적화</h3>

        {/* Loop counter 비교 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BN254</div>
            <p className="text-sm text-muted-foreground">
              Loop counter = <M>{'6x + 2'}</M>. ~64 bits, Hamming weight ~30. 반복: ~64 doublings + ~30 additions.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BLS12-381</div>
            <p className="text-sm text-muted-foreground">
              Loop counter = <M>x</M> (더 짧음). ~64 bits, Hamming weight ~6 &rarr; addition step 훨씬 적음.
            </p>
          </div>
        </div>

        {/* Miller Loop trace + 반복당 비용 + 누적 → Viz */}
        <div className="not-prose mb-4"><MillerLoopTraceViz /></div>

        {/* Multi-pairing */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Multi-pairing (Groth16)</div>
            <p className="text-sm text-muted-foreground">
              <M>{'e(A,B) \\cdot e(-C,D) \\cdot e(-IC,\\gamma) = 1'}</M>.
              3 pairings &mdash; 단, final exponentiation 공유 가능. 2 final exp (~12,000m) 절약.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">BLS Aggregate Verification</div>
            <p className="text-sm text-muted-foreground">
              <M>{'e(G_1, pk_{aggr}) = e(H(m), sig)'}</M>. 공개키 집계 후 2 pairings (shared final exp).
            </p>
          </div>
        </div>

        {/* Ethereum gas */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Ethereum 페어링 Gas</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <span className="font-medium">EIP-196/197:</span> BN254 pairing check. 34,000 + 34,000 x k gas.
            </div>
            <div className="rounded bg-muted/50 p-2">
              <span className="font-medium">EIP-2537:</span> BLS12-381. 메인넷 미적용. BLS sig + ZK 업그레이드 목적.
            </div>
          </div>
        </div>

        {/* 총 비용 요약 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">전체 페어링 비용 요약</div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm text-muted-foreground mb-2">
            <div className="rounded bg-muted/50 p-2">Miller: ~6,700m (~1.3 ms)</div>
            <div className="rounded bg-muted/50 p-2">Final exp: ~3,500m (~0.7 ms)</div>
            <div className="rounded bg-muted/50 p-2 font-semibold">Total: ~10,200m (~2 ms)</div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Optimized (blst, asm): BLS12-381 ~0.5 ms, BN254 ~0.3 ms.
          </p>
        </div>

        {/* 구현 비교 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">구현 비교</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium">arkworks</div>
              <p className="text-xs">Generic pairing + sparse 포함</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium">blst</div>
              <p className="text-xs">Hand-written asm. 최고 성능.</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium">gnark</div>
              <p className="text-xs">Go. zkSNARK 최적화.</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <div className="font-medium">py_ecc</div>
              <p className="text-xs">Pure Python. ~100x 느림. 리서치용.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
