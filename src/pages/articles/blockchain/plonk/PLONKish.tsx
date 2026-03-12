export default function PLONKish() {
  return (
    <section id="plonkish" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONKish Arithmetization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS의 한계</h3>
        <p>R1CS 게이트는 본질적으로 곱셈 전용이다. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">x * y + x = z</code>를 표현하려면 보조변수와 2개 제약이 필요하다. PLONKish는 이를 <strong>하나의 범용 게이트</strong>로 처리한다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">범용 게이트 - 5개의 Selector</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`q_L·a + q_R·b + q_O·c + q_M·a·b + q_C = 0

a, b, c  — 3개의 wire 값 (left, right, output)
q_L      — left wire 선형 계수
q_R      — right wire 선형 계수
q_O      — output wire 선형 계수
q_M      — 곱셈 항 계수
q_C      — 상수 항`}</code></pre>
        <p>selector 값에 따라 게이트 유형이 결정된다:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>덧셈:</strong> q_L=1, q_R=1, q_O=-1 → a + b = c</li>
          <li><strong>곱셈:</strong> q_M=1, q_O=-1 → a · b = c</li>
          <li><strong>상수:</strong> q_L=1, q_C=-v → a = v</li>
          <li><strong>혼합:</strong> q_M=1, q_L=1, q_O=-1 → a·b + a = c (1개 제약)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Copy Constraint (와이어 연결)</h3>
        <p>각 게이트의 wire는 독립적이다. &quot;게이트 0의 output = 게이트 1의 left input&quot; 같은 연결을 <strong>copy constraint</strong>로 강제한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`예시: x * y = z,  z + w = out

Gate 0: a₀=x, b₀=y, c₀=z    (곱셈)
Gate 1: a₁=z, b₁=w, c₁=out  (덧셈)

Copy constraint: c₀ = a₁  (같은 값 z)
→ permutation σ: position(c₀) ↔ position(a₁)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Permutation Argument (Grand Product)</h3>
        <p>copy constraint를 다항식으로 인코딩한다. 핵심은 &quot;두 벡터가 permutation 관계&quot;임을 grand product로 증명하는 것이다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`검증자가 랜덤 β, γ를 선택

Grand product Z(x):
  Z(ω⁰) = 1
  Z(ωⁱ⁺¹) = Z(ωⁱ) · ∏ⱼ (wⱼ(ωⁱ) + β·ωⁱ·kⱼ + γ)
                        / (wⱼ(ωⁱ) + β·σⱼ(ωⁱ) + γ)

최종 확인: Z(ωⁿ⁻¹) · (마지막 항) = 1
→ 분자·분모 전체가 telescoping으로 상쇄
→ permutation이 올바르면 곱이 1`}</code></pre>
        <p>이 grand product는 <strong>accumulator 다항식</strong>으로 KZG commit되어 검증된다. 잘못된 와이어 연결이 있으면 Z가 1로 닫히지 않아 증명이 실패한다.</p>
      </div>
    </section>
  );
}
