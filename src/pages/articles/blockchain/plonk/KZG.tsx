export default function KZG() {
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG 다항식 Commitment</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 KZG가 필요한가?</h3>
        <p>Groth16은 <strong>회로별 trusted setup</strong>이 필요하다. 회로가 바뀌면 setup을 처음부터 다시 해야 한다. KZG는 <strong>universal setup</strong>으로 이 문제를 해결한다. 비밀 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">τ</code> 하나로 모든 다항식에 재사용할 수 있다.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Commitment 크기: G1 1개 = 64 bytes</li>
          <li>Opening proof: G1 1개 = 64 bytes</li>
          <li>검증 시간: O(1) - 페어링 2회</li>
          <li>Setup: 1회 (universal), 파라미터 τ 1개</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심: 다항식 인수정리 (Factor Theorem)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`f(z) = y  ⟺  (x - z) | (f(x) - y)

즉, f(x) - y = q(x) · (x - z) 인 다항식 q(x)가 존재

증명자: "f(z) = y"를 주장
→ q(x) = (f(x) - y) / (x - z) 를 계산해서 제출
검증자: 타원곡선 위에서 pairing으로 확인
  e([q]₁, [τ - z]₂) = e([f - y]₁, G₂)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">SRS (Structured Reference String)</h3>
        <p>비밀 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">τ</code>를 직접 노출하지 않고, 타원곡선 위의 점으로 인코딩한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`SRS = { [τ⁰]₁, [τ¹]₁, ..., [τᵈ]₁, [τ]₂ }

여기서 [x]₁ = x · G₁,  [x]₂ = x · G₂
τ 자체는 MPC 세레모니 후 폐기 (toxic waste)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Commit / Open / Verify</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Commit(f):
  C = Σᵢ fᵢ · [τⁱ]₁ = [f(τ)]₁    ← MSM 연산

Open(f, z):
  y = f(z)
  q(x) = (f(x) - y) / (x - z)    ← 다항식 나눗셈
  π = [q(τ)]₁                     ← 증거 (G1 점 1개)

Verify(C, z, y, π):
  e(π, [τ - z]₂) == e(C - [y]₁, G₂)
  = e([q(τ)]₁, [τ - z]₂) == e([f(τ) - y]₁, G₂)
  양변 = [q(τ)(τ - z)]_T == [(f(τ) - y)]_T  ✓`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Batch Opening</h3>
        <p>여러 다항식을 같은 점 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">z</code>에서 한 번에 열 수 있다. 검증자가 랜덤 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ν</code>를 선택하여 선형 결합한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`combined(x) = f₀(x) + ν·f₁(x) + ν²·f₂(x) + ...
combined_y   = y₀ + ν·y₁ + ν²·y₂ + ...

하나의 quotient로 증명:
  q(x) = (combined(x) - combined_y) / (x - z)

검증: commitment도 선형 결합
  C_combined = C₀ + ν·C₁ + ν²·C₂ + ...
  → 단일 pairing check로 완료`}</code></pre>
      </div>
    </section>
  );
}
