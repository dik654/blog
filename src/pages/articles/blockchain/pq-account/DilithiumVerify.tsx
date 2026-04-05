import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Dilithium Verify(pk, message, signature)

function Verify(pk, M, sig):
    (seed, t_high) = pk
    (c_tilde, z, h) = sig

    // 1) Bounds check
    if ||z||_∞ >= γ1 - β:
        return FAIL

    // 2) Expand public key
    A = ExpandA(seed)
    t_high_bits = t_high · 2^d

    // 3) Decode challenge
    c = H(c_tilde)  // back to polynomial

    // 4) Reconstruct w_high
    // Key equation: A·z - c·t_high = A·y - c·s2 + c·t_low
    // With hint, we recover w_high
    w_recon = A·z - c·t_high_bits
    w_high_recon = UseHint(h, w_recon, 2γ2)

    // 5) Hash check
    c_tilde' = H(H(tr || M) || w_high_recon)

    // 6) Compare
    return (c_tilde == c_tilde')

// Verify cost analysis
// Matrix-vector mult A·z: ~k·l polynomial mults
// Dilithium2 (k=l=4): 16 poly mults
// Each poly mult: ~1500 cycles (with NTT)
// Total A·z: ~24,000 cycles
// + hash operations: ~5,000 cycles
// Total verify: ~30,000 cycles ≈ 10μs on 3GHz CPU

// Sign vs Verify performance
// Sign: ~500,000 cycles (rejection loop)
// Verify: ~30,000 cycles
// Ratio: ~17x faster verify`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">On-chain Verification Gas Cost</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Solidity implementation (no precompile)
// 예상 gas cost

// Components
// - Hash (Keccak or SHAKE): ~500 gas each
// - Polynomial mult (naive): ~150,000 gas
// - Polynomial mult (NTT in Solidity): ~80,000 gas
// - Matrix-vector: 16 × poly_mult

// Estimated total
// Dilithium2 verify: ~2,500,000 gas
// 비교: ecrecover (precompile) = 3,000 gas
// → 800x more expensive

// Optimization attempts
// 1) Precompile (EIP proposal)
//    - Native implementation → ~50k gas
//    - 50x improvement
// 2) Batch verification
//    - Amortize cost over multiple sigs
// 3) Off-chain + succinct proof
//    - ZK proof of valid Dilithium sig
//    - On-chain: verify ZK proof only

// 현재 상태
// - No EVM precompile yet
// - Research implementations exist
// - 실전 배포 아직 이름 (2024)

// Trade-off
// - Immediate quantum safety
// - High gas cost
// - Large signatures (2.4 KB per tx)`}</pre>

      </div>
    </section>
  );
}
