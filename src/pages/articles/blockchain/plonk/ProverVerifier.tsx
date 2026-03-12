export default function ProverVerifier() {
  return (
    <section id="prover-verifier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONK Prover / Verifier</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">빌딩 블록의 결합</h3>
        <p>KZG(다항식 commit), PLONKish(범용 게이트), Permutation(와이어 연결)을 5라운드 프로토콜로 조립한다. 모든 제약을 다항식 등식으로 변환하고, quotient polynomial로 증명한 뒤 Fiat-Shamir로 비대화형 변환한다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">5-Round Prover</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Round 1: Wire Commitments
  a(x), b(x), c(x) — witness를 Lagrange 보간 후 KZG commit
  blinding: 각 다항식에 랜덤 항 추가 (zero-knowledge)
  → [a]₁, [b]₁, [c]₁ 전송

Round 2: Permutation Accumulator
  β, γ ← Fiat-Shamir (Round 1 transcript)
  Z(x) 계산: grand product accumulator
  → [Z]₁ 전송

Round 3: Quotient Polynomial
  α ← Fiat-Shamir
  t(x) = [gate(x) + α·perm₁(x) + α²·perm₂(x)] / Zₕ(x)
  Zₕ(x) = xⁿ - 1 (vanishing polynomial)
  t(x)를 3등분: t(x) = t_lo + xⁿ·t_mid + x²ⁿ·t_hi
  → [t_lo]₁, [t_mid]₁, [t_hi]₁ 전송`}</code></pre>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Round 4: Evaluations at ζ
  ζ ← Fiat-Shamir
  ā=a(ζ), b̄=b(ζ), c̄=c(ζ), σ̄_A=σ_A(ζ), σ̄_B=σ_B(ζ), z̄_ω=Z(ζω)
  → 6개 스칼라 전송

Round 5: Opening Proofs
  ν ← Fiat-Shamir
  linearization: r(x) = gate/perm 다항식들을 ā,b̄ 등으로 부분 평가
  W_ζ(x)  = [r(x) + ν(a(x)-ā) + ν²(b(x)-b̄) + ...] / (x-ζ)
  W_ζω(x) = [Z(x) - z̄_ω] / (x-ζω)
  → [W_ζ]₁, [W_ζω]₁ 전송`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Verifier</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`입력: 증명 π = ([a],[b],[c],[Z],[t_lo],[t_mid],[t_hi],
              ā,b̄,c̄,σ̄_A,σ̄_B,z̄_ω, [W_ζ],[W_ζω])

1. Fiat-Shamir로 β, γ, α, ζ, ν, u 재생성
2. Zₕ(ζ) = ζⁿ - 1 계산
3. Lagrange L₁(ζ) = (ζⁿ - 1) / (n(ζ - 1)) 계산
4. gate 관계 + permutation 관계 → r̄ 계산 (스칼라)
5. [F]₁ = linearization commitment 재구성
6. [E]₁ = 평가값들의 commitment
7. Pairing check:
   e([W_ζ] + u·[W_ζω], [τ]₂)
   = e(ζ·[W_ζ] + uζω·[W_ζω] + [F] - [E], G₂)`}</code></pre>
        <p>검증자는 <strong>페어링 2회</strong>와 소수의 G1 스칼라 곱만으로 검증을 완료한다. 전체 witness를 보지 않고 증명의 정당성을 확인할 수 있다.</p>
      </div>
    </section>
  );
}
