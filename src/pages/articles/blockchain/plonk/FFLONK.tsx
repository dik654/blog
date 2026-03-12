export default function FFLONK() {
  return (
    <section id="fflonk" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FFLONK 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">PLONK Round 5의 비효율</h3>
        <p>PLONK의 Round 5는 6개 다항식을 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ζ</code>에서, 1개를 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ζω</code>에서 열어야 한다. 서로 다른 2개의 evaluation point에 대해 2개의 quotient polynomial과 custom pairing 등식이 필요하다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`PLONK Round 5:
  W_ζ(x):  6개 다항식을 ζ에서 open  → 1개 proof
  W_ζω(x): 1개 다항식을 ζω에서 open → 1개 proof
  → 2개의 opening proof + custom pairing 등식

FFLONK Round 5:
  7개를 1개 combined polynomial로 합침
  → kzg::batch_open 1번 → 1개의 opening proof
  → kzg::batch_verify 1번 → 검증 완료`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG의 가법 동형성 (Additive Homomorphism)</h3>
        <p>KZG commitment은 선형 연산이므로 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">commit(f + g) = commit(f) + commit(g)</code>가 성립한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`commit(f) = [f(τ)]₁ = Σᵢ fᵢ · [τⁱ]₁

commit(f + ν·g + ν²·h) = commit(f) + ν·commit(g) + ν²·commit(h)

→ Verifier는 개별 commitment [f]₁, [g]₁, [h]₁로부터
  combined commitment를 스칼라 곱 + 덧셈만으로 재구성
→ combined polynomial을 Prover에게서 받을 필요 없음

제약: 곱에 대해서는 동형이 아님!
  G1 × G1 → G1 연산은 없음 (G1은 덧셈군)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Combined Polynomial 구성</h3>
        <p>FFLONK은 서로 다른 점에서 열리는 다항식들을 <strong>하나의 combined polynomial</strong>로 합친다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`ζ에서 열리는 6개:  r, a, b, c, σ_A, σ_B
ζω에서 열리는 1개: Z

ν ← Fiat-Shamir challenge

combined(x) = r(x) + ν·a(x) + ν²·b(x) + ν³·c(x)
            + ν⁴·σ_A(x) + ν⁵·σ_B(x) + ν⁶·Z(x)

evaluation points:
  combined(ζ)  에서의 값 = r̄ + ν·ā + ν²·b̄ + ...
  combined(ζω) 에서의 값 = ... + ν⁶·z̄_ω

→ kzg::batch_open({ζ, ζω})로 한 번에 증명`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">장점 정리</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Opening proof 감소:</strong> 2개 → 1개</li>
          <li><strong>코드 재사용:</strong> 기존 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">kzg::batch_open</code> / <code className="bg-accent px-1.5 py-0.5 rounded text-sm">batch_verify</code> 그대로 사용</li>
          <li><strong>검증 단순화:</strong> custom pairing 등식 대신 표준 KZG batch verify</li>
          <li><strong>가스 절감:</strong> on-chain 검증 시 pairing 연산 감소</li>
        </ul>
      </div>
    </section>
  );
}
