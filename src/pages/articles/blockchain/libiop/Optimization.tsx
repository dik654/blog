import CodePanel from '@/components/ui/code-panel';
import OptPipelineViz from './viz/OptPipelineViz';
import { FFT_CODE, OPT_CODE } from './OptimizationData';

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">최적화</h2>
      <div className="not-prose mb-8">
        <OptPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libiop는 실용적 성능을 위해 다양한 최적화 기법을 적용합니다.
          <strong>NTT</strong>(Number Theoretic Transform)로 다항식 연산을 가속하고,
          배치 역원 계산, 코셋 FFT, 지연 머클 트리 등으로
          메모리와 연산 비용을 줄입니다.
        </p>
        <h3>NTT(Number Theoretic Transform)</h3>
        <CodePanel title="OptimizedNTT 구현" code={FFT_CODE}
          annotations={[
            { lines: [6, 7], color: 'sky', note: '미리 계산된 단위근 테이블' },
            { lines: [10, 10] as [number, number], color: 'emerald', note: '비트 역순 정렬' },
            { lines: [15, 19], color: 'amber', note: 'Cooley-Tukey 버터플라이' },
          ]} />
        <h3>핵심 최적화 기법</h3>
        <CodePanel title="최적화 기법 요약" code={OPT_CODE}
          annotations={[
            { lines: [3, 5], color: 'sky', note: '배치 역원: 3(n-1) 곱셈' },
            { lines: [8, 9], color: 'emerald', note: '코셋 FFT 소거' },
            { lines: [12, 17], color: 'amber', note: '지연 머클 트리' },
            { lines: [20, 21], color: 'violet', note: 'SIMD 병렬 해싱' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Cryptographic Engineering 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Practical Optimizations for ZK Systems
//
// 1. NTT (Number Theoretic Transform):
//
//    FFT over finite fields
//    O(n log n) polynomial multiplication
//    Twiddle factors precomputed
//
//    Requirements:
//      p - 1 must have 2^k divisor
//      Large prime fields: 2^32, 2^64
//
//    Example (BLS12-381 Fr):
//      p - 1 = 2^32 × 3^1 × ...
//      up to 2^32 NTT size supported
//
//    Cooley-Tukey butterfly:
//      x[k]   = x[k] + ω^k · x[k+n/2]
//      x[k+n/2] = x[k] - ω^k · x[k+n/2]

// 2. Batch Inversion (Montgomery's trick):
//
//    단일 inversion: 매우 비쌈 (~100 mul)
//    배치 inversion: amortized cheaper
//
//    For a_1, a_2, ..., a_n:
//      Step 1: compute prefix products
//        p_i = a_1 · a_2 · ... · a_i
//      Step 2: invert final product
//        inv = 1 / p_n (single inversion)
//      Step 3: back-substitute
//        a_i^(-1) = p_{i-1} · (inv · suffix)
//
//    Cost: 3(n-1) mul + 1 inv
//    vs naive: n · inv

// 3. Coset FFT:
//
//    표준 FFT: evaluate at roots of unity
//      ω^0, ω^1, ..., ω^{n-1}
//
//    Coset FFT: shift domain
//      c, cω, cω², ...
//      (c = coset shift)
//
//    장점:
//      Avoid vanishing polynomial issues
//      Useful in quotient computation
//      Low-degree extension

// 4. Lazy Merkle Tree:
//
//    Only compute needed paths
//    Store leaves only (not internal)
//    Compute internal nodes on-demand
//
//    Memory: O(leaves) vs O(n) for full tree
//    Useful when queries sparse

// 5. SIMD Hashing:
//
//    Modern CPUs: 256-bit SIMD registers
//    Parallel 4 x SHA-256 (AVX2)
//    8 x per instruction cycle
//
//    Merkle tree construction:
//      Leaves → parallel hash → next level
//      Speedup: 4-8x

// 6. Field-specific optimizations:
//
//    Montgomery form:
//      Avoid modular reduction
//      Fast mult + mod combined
//
//    Barrett reduction:
//      Fast mod by constant
//
//    Mersenne primes:
//      p = 2^k - 1
//      Reduction = bit ops only
//
//    Solinas primes:
//      p = 2^k - c (small c)
//      Fast reduction

// 실무 구현:
//   - arkworks-rs (Rust)
//   - gnark (Go)
//   - libiop (C++)
//   - RUSTCRYPTO/ff (field primitives)
//   - blst (BLS12-381 optimized)`}
        </pre>
      </div>
    </section>
  );
}
