export default function QAP() {
  return (
    <section id="qap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QAP (Quadratic Arithmetic Program)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 다항식으로 변환하는가</h3>
        <p>R1CS의 m개 개별 등식을 검증자가 일일이 확인하면 O(m) 비용이 든다. QAP는 이를 하나의 다항식 항등식으로 압축하여 O(1) 검증을 가능하게 한다. 이것이 ZK-SNARK의 &quot;Succinct&quot;를 실현하는 핵심이다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`R1CS: m개 개별 등식 → O(m) 검증
  ⟨a₁,s⟩·⟨b₁,s⟩ = ⟨c₁,s⟩, ..., ⟨aₘ,s⟩·⟨bₘ,s⟩ = ⟨cₘ,s⟩

QAP: 하나의 다항식 항등식 → O(1) 검증
  a(x)·b(x) - c(x) = h(x)·t(x)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS → QAP 변환 파이프라인</h3>
        <p>R1CS 행렬의 각 열을 Lagrange 보간으로 다항식으로 변환한 뒤, witness 벡터로 결합하고, 소거 다항식으로 나누어떨어지는지 확인한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`① 도메인 선택: D = {ω₁, ..., ωₘ}
② 열별 Lagrange 보간: aⱼ(ωᵢ) = A[i,j]
③ 소거 다항식: t(x) = ∏(x - ωᵢ)
④ Witness 결합: a(x) = Σⱼ sⱼ·aⱼ(x)
⑤ h(x) = (a(x)·b(x) - c(x)) / t(x)

핵심 동치:
  R1CS 만족 ⟺ t(x) | (a(x)·b(x) - c(x))
             ⟺ h(x)가 다항식 (나머지 없음)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange 보간</h3>
        <p>n개의 점을 지나는 유일한 degree &lt; n 다항식을 구한다. 기저 다항식 L_i(x)는 정확히 하나의 도메인 점에서만 1이고 나머지에서 0이다(Kronecker delta 성질).</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Lᵢ(x) = ∏_{j≠i} (x - xⱼ) / (xᵢ - xⱼ)
p(x) = Σᵢ yᵢ · Lᵢ(x)

예: 점 (1,3), (2,5) → p(x) = 2x + 1
  L₀(x) = -(x-2),  L₁(x) = x-1
  p(x) = 3·(-(x-2)) + 5·(x-1) = 2x + 1
  p(1)=3 ✓,  p(2)=5 ✓`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Schwartz-Zippel 보조정리</h3>
        <p>차수 d인 비영 다항식이 랜덤 점에서 0일 확률은 d/|F| 이하이다. BN254에서 d=1000이면 확률은 약 10^(-74)으로 사실상 0이다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Pr[p(τ) = 0] ≤ d / |F|

BN254: d ≈ 1,000,  |F| ≈ 2²⁵⁴
→ Pr ≤ 1000 / 2²⁵⁴ ≈ 10⁻⁷⁴ ≈ 0

결론: 랜덤 τ에서 a(τ)·b(τ) - c(τ) = h(τ)·t(τ)가 성립하면
      모든 x에서 성립한다고 2²⁵⁴ 대 1의 확률로 확신 가능`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">소거 다항식 (Vanishing Polynomial)</h3>
        <p>도메인의 모든 점에서 0이 되는 다항식이다. 프로덕션에서는 roots of unity를 사용하여 t(x) = x^m - 1로 극도로 희소하게 만든다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`t(x) = (x - ω₁)(x - ω₂)···(x - ωₘ)

교육용: t(x) = (x-1)(x-2)(x-3) = x³ - 6x² + 11x - 6
프로덕션: roots of unity → t(x) = xᵐ - 1
  → O(1) 저장, O(log m) 평가

역할: p(x)가 모든 ωᵢ에서 0 ⟺ t(x) | p(x)`}</code></pre>
      </div>
    </section>
  );
}
