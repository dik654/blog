import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import M from '@/components/ui/math';
import VerifyDilithiumViz from './viz/VerifyDilithiumViz';
import { codeRefs } from './codeRefs';

export default function DilithiumVerify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dilithium-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dilithium 검증 (UseHint)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          검증자는 공개키(A, t)와 서명(z, c_tilde, h)만 가지고 있습니다.
          비밀키(s1, s2) 없이도 <code>A*z - c*t</code>를 계산하고,
          힌트 h를 사용하여 w1의 상위 비트를 복원합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('dilithium-verify', codeRefs['dilithium-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">verify() 내부</span>
        </div>
        <h3>왜 작동하는가</h3>
        <p>
          <code>A*z - c*t = A*(y+c*s1) - c*(A*s1+s2) = A*y - c*s2</code><br />
          c*s2가 작으므로 HighBits(A*y - c*s2) = HighBits(A*y) = w1.
          힌트 h는 라운딩 경계 근처의 미세한 차이를 보정합니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 검증이 서명보다 빠른 이유: 서명은 거부 샘플링으로 평균 4-7회 반복하지만,
          검증은 항상 1번의 행렬 곱 + 해시로 완료됩니다.
        </p>
      </div>
      <div className="mt-8"><VerifyDilithiumViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Verify 알고리즘</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>Verify(pk, M, sig)</code></p>
            <p className="text-xs text-muted-foreground mb-2">
              <code>pk = (seed, t_high)</code>, <code>sig = (c_tilde, z, h)</code>
            </p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>Bounds check</strong> &mdash; <M>{'\\|z\\|_\\infty \\geq \\gamma_1 - \\beta'}</M> &rarr; FAIL</li>
              <li><strong>Expand</strong> &mdash; <M>{'A = \\text{ExpandA}(\\text{seed})'}</M>, <M>{'t_{\\text{high\\_bits}} = t_{\\text{high}} \\cdot 2^d'}</M></li>
              <li><strong>Decode challenge</strong> &mdash; <M>{'c = H(\\tilde{c})'}</M></li>
              <li><strong>Reconstruct</strong> &mdash; <M>{'w_{\\text{recon}} = A \\cdot z - c \\cdot t_{\\text{high\\_bits}}'}</M>, <M>{'w_{\\text{high}} = \\text{UseHint}(h, w_{\\text{recon}}, 2\\gamma_2)'}</M></li>
              <li><strong>Hash check</strong> &mdash; <M>{"\\tilde{c}' = H(H(\\text{tr} \\| M) \\| w_{\\text{high}})"}</M></li>
              <li><strong>Compare</strong> &mdash; <M>{"\\tilde{c} = \\tilde{c}'"}</M></li>
            </ol>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Verify Cost Analysis</p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><M>{'A \\cdot z'}</M>: <M>{'k \\cdot l'}</M> polynomial mults</p>
                <p>Dilithium2 (k=l=4): 16 poly mults</p>
                <p>Each poly mult: ~1,500 cycles (NTT)</p>
                <p>Total <M>{'A \\cdot z'}</M>: ~24,000 cycles</p>
                <p>+ hash: ~5,000 cycles</p>
                <p><strong>Total: ~30,000 cycles (~10us @ 3GHz)</strong></p>
              </div>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Sign vs Verify 성능</p>
              <div className="grid grid-cols-2 gap-3 text-sm text-center">
                <div><p className="text-muted-foreground">Sign</p><p className="font-mono">~500K cycles</p></div>
                <div><p className="text-muted-foreground">Verify</p><p className="font-mono">~30K cycles</p></div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">Verify가 <strong>~17x 빠름</strong> (rejection loop 없음)</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">On-chain Verification Gas Cost</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Solidity 구현 Gas Cost (no precompile)</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>Hash (Keccak/SHAKE): <strong>~500 gas</strong> each</div>
              <div>Polynomial mult (naive): <strong>~150K gas</strong></div>
              <div>Polynomial mult (NTT): <strong>~80K gas</strong></div>
              <div>Matrix-vector: 16 x poly_mult</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-center mt-3">
              <div className="rounded border border-red-500/30 p-2">
                <p className="text-muted-foreground">Dilithium2 verify</p>
                <p className="font-mono font-semibold text-red-400">~2,500,000 gas</p>
              </div>
              <div className="rounded border border-green-500/30 p-2">
                <p className="text-muted-foreground"><code>ecrecover</code> (precompile)</p>
                <p className="font-mono font-semibold text-green-400">3,000 gas</p>
              </div>
            </div>
            <p className="text-sm text-red-400 text-center mt-2 font-semibold">800x more expensive</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Optimization 시도</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>Precompile (EIP proposal)</strong> &mdash; native implementation &rarr; ~50K gas (50x improvement)</li>
              <li><strong>Batch verification</strong> &mdash; 여러 sig의 비용을 분산</li>
              <li><strong>Off-chain + succinct proof</strong> &mdash; ZK proof of valid Dilithium sig &rarr; on-chain은 ZK proof만 검증</li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">현재 상태 (2024)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>EVM precompile 아직 없음, research implementations 존재</li>
              <li><strong>Trade-off</strong>: 즉각적 양자 안전 vs 높은 gas cost vs 큰 signature (2.4KB/tx)</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
