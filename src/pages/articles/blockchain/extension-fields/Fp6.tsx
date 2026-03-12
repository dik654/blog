export default function Fp6() {
  return (
    <section id="fp6" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fp6 삼차 확장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          페어링 결과가 사는 Fp12를 효율적으로 만들기 위한 중간 단계다.{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">Fp6 = Fp2[v] / (v³ − β)</code>에서{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">β = 9 + u</code>는 Fp2의 cubic non-residue다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">타워 구조에서의 위치</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Fp6 원소 = c₀ + c₁·v + c₂·v²
  c₀, c₁, c₂ ∈ Fp2  (각각이 복소수)
  v³ = β = 9 + u ∈ Fp2

총 차원: Fp2 × 3 = Fp × 6`}</code></pre>
        <p>
          Fp12를 한 번에 12차로 만들 수도 있지만, 타워(2×3×2=12)로 쌓으면
          각 층에서 Karatsuba를 적용할 수 있어 연산 비용이 크게 줄어든다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Karatsuba 곱셈 (9회 → 6회)</h3>
        <p>
          Fp6 곱셈을 전개하면{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">v³</code> 이상의 항이 나오고,{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">v³ = β</code>로 대체한다.
          나이브하게 Fp2 곱셈 9회가 필요하지만, Karatsuba로 6회로 줄인다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`v₀ = a₀b₀,  v₁ = a₁b₁,  v₂ = a₂b₂        ← 3회

c₀ = v₀ + β·((a₁+a₂)(b₁+b₂) - v₁ - v₂)   ← 1회
c₁ = (a₀+a₁)(b₀+b₁) - v₀ - v₁ + β·v₂      ← 1회
c₂ = (a₀+a₂)(b₀+b₂) - v₀ + v₁ - v₂         ← 1회
                                          합계: 6회`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">역원: Norm Reduction 패턴</h3>
        <p>
          타워 전체를 관통하는 핵심 패턴 — <strong>역원을 구할 때 한 층 아래로 내려간다</strong>.
          Fp6의 norm은 <strong>Fp2 원소</strong>가 되어, Fp2::inv를 재활용한다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`t₀ = c₀² - β·c₁c₂
t₁ = β·c₂² - c₀c₁
t₂ = c₁² - c₀c₂

norm = c₀·t₀ + β·(c₂·t₁ + c₁·t₂)  ∈ Fp2  ← 차원이 내려감!

inv 호출 체인:
  Fp6::inv() → norm ∈ Fp2
    └─ Fp2::inv() → norm ∈ Fp
        └─ Fp::inv() → Fermat: a^(p-2)`}</code></pre>
        <p>
          최종적으로 <strong>Fp의 pow 연산 하나</strong>로 귀결된다.
          이 &quot;norm reduction&quot; 패턴은 Fp12에서도 동일하게 반복된다.
        </p>
      </div>
    </section>
  );
}
