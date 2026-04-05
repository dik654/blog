import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import SignViz from './viz/SignViz';
import { codeRefs } from './codeRefs';

export default function DilithiumSign({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dilithium-sign" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dilithium 서명 (NTT + 거부 샘플링)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서명 과정의 핵심은 <strong>거부 샘플링</strong>입니다.
          마스킹 벡터 y로 <code>z = y + c*s1</code>을 계산하되,
          z가 너무 크면 s1 정보가 노출될 수 있어 재시작합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('dilithium-sign', codeRefs['dilithium-sign'])} />
          <span className="text-[10px] text-muted-foreground self-center">sign() 내부</span>
        </div>
        <p>
          도전 다항식 <code>c</code>는 256개 계수 중 정확히 39개만 +1 또는 -1이고 나머지는 0입니다.
          이 희소성 덕분에 c*s1의 노름이 작게 유지되어, z가 s1을 숨길 수 있습니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 거부 샘플링의 직관: y 없이 z = c*s1만 공개하면 s1이 바로 드러납니다.
          y를 더해 z를 균일 분포처럼 만들되, z가 "너무 한쪽으로 치우치면"(= s1 방향) 재시도합니다.
        </p>
      </div>
      <div className="mt-8"><SignViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sign 알고리즘 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Dilithium Sign(sk, message)

function Sign(sk, M):
    (seed, tr, s1, s2, t_low) = sk

    // 1) hash of message
    μ = Hash(tr || M)

    κ = 0
    loop:
        κ += 1

        // 2) Sample masking vector
        ρ' = Hash(seed || μ || κ)
        y = ExpandMask(ρ', κ)  // short random vector

        // 3) Commit
        w = A · y
        w_high = HighBits(w, 2γ2)

        // 4) Challenge
        c = Hash(μ || w_high)  // sparse polynomial

        // 5) Response
        z = y + c · s1

        // 6) Rejection sampling (anti-leak)
        if ||z||_∞ >= γ1 - β:
            continue  // restart

        // 7) Verify no overflow from s2
        r = w - c · s2
        r_low = LowBits(r, 2γ2)
        if ||r_low||_∞ >= γ2 - β:
            continue

        // 8) Hint (compression)
        h = MakeHint(-c·t_low, r)

        // Check hint count
        if weight(h) > ω:
            continue

        return (c, z, h)

// 평균 3-7 iteration (typically)
// Worst case: unbounded (probabilistic)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">NTT (Number Theoretic Transform)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Polynomial multiplication 최적화
// Naive: O(n²)
// NTT: O(n log n)

// Dilithium에서 모든 polynomial 연산
// A·s, c·s1, c·s2, etc.
// R_q = Z_q[X]/(X^n + 1)

// NTT는 FFT의 정수론 버전
// Primitive n-th root of unity ω ∈ Z_q

// NTT: 계수 → 값 (pointwise)
// NTT(p) = (p(ω⁰), p(ω¹), ..., p(ωⁿ⁻¹))

// 곱셈
// Convert to NTT form: a_hat, b_hat
// Pointwise multiply: c_hat[i] = a_hat[i] * b_hat[i]
// Inverse NTT: c

// Dilithium2 parameters
// n = 256, q = 8380417
// Primitive 512-th root of unity 존재
// → NTT 가능

// 성능
// NTT (forward/inverse): ~500 cycles per polynomial
// Pointwise mult: ~256 mults
// Total for poly mult: ~1500 cycles
// vs naive: ~65000 cycles (256²)
// → 40x speedup

// Implementation tips
// - Precomputed ω table
// - Bit-reversal ordering
// - Montgomery multiplication
// - AVX2/AVX-512 vectorization`}</pre>

      </div>
    </section>
  );
}
