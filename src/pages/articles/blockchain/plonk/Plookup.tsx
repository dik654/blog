export default function Plookup() {
  return (
    <section id="plookup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Plookup (Lookup Argument)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Lookup이 필요한가?</h3>
        <p>PLONK 게이트만으로 range check(<code className="bg-accent px-1.5 py-0.5 rounded text-sm">0 ≤ x &lt; 256</code>)를 하면 비트 분해에 약 16개 제약이 필요하다. Plookup은 테이블 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">T = {'{'}0..255{'}'}</code>에서 한 번의 lookup으로 1개 제약으로 줄인다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`PLONK만으로 range check:
  비트 분해 (8개 boolean gate) + 결합 확인 → ~16개 제약

Plookup으로:
  테이블 T = {0, 1, ..., 255}, lookup "x ∈ T?" → 1개 제약

XOR 연산도 마찬가지:
  PLONK: 비트 분해 + 비트별 XOR + 결합 → ~32개 제약 (8비트)
  Plookup: XOR 테이블에서 한 번의 lookup → 1개 제약`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어: 정렬된 병합</h3>
        <p>f의 모든 원소가 T에 있음을 <strong>&quot;f와 T를 T의 순서로 정렬할 수 있다&quot;</strong>는 것으로 환원한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`T = [0, 1, 2, 3],  f = [1, 2]
sorted(f ∪ T) = [0, 1, 1, 2, 2, 3]  ← T 순서 유지하며 f 삽입 가능

T = [0, 1, 2, 3],  f = [5]
5는 T에 없으므로 T 순서로 정렬 불가능!`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 단계</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`입력: t = (t₀,...,t_{d-1}) 테이블,  f = (f₀,...,f_{n-1}) 조회값
주장: f ⊆ t

1. 정렬된 병합: s = sort(f ∪ t)  (t의 순서 유지)
2. s를 중첩 분리: h₁ = s[..d],  h₂ = s[d-1..]
   (h₁의 마지막 = h₂의 첫 원소)
3. 검증자가 랜덤 β, γ 선택
4. Grand product Z(x) 계산`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Grand Product 검증</h3>
        <p>permutation argument와 동일한 패턴으로, 곱의 텔레스코핑으로 정렬의 올바름을 증명한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Z(ω⁰) = 1

Z(ωⁱ⁺¹) = Z(ωⁱ) · (1+β)·(γ+fᵢ)·(γ(1+β)+tᵢ+β·tᵢ₊₁)
                   / ((γ(1+β)+h₁ᵢ+β·h₁ᵢ₊₁)(γ(1+β)+h₂ᵢ+β·h₂ᵢ₊₁))

최종: Z(ωⁿ⁻¹) · (마지막 항) = 1
→ 분자/분모 전체가 상쇄되면 f ⊆ t 증명 완료`}</code></pre>
        <p>h₁, h₂는 증명자가 제공하는 witness이며, KZG로 commit된다. 연속 원소 쌍 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">(sᵢ, sᵢ₊₁)</code>의 관계가 멤버십을 보장한다.</p>
      </div>
    </section>
  );
}
