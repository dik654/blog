export default function Prove() {
  return (
    <section id="prove" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prove</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          증명자는 PK와 witness를 사용하여 증명 <strong>Proof = (A, B, C)</strong>를 생성합니다.
          BN254 기준으로 G1 2개 + G2 1개 = <strong>256 bytes</strong>의 간결한 증명입니다.
          핵심 연산은 MSM(Multi-Scalar Multiplication)이며, 복잡도는 O(n)입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">A 계산 (G1)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`A = [α]₁ + Σⱼ wⱼ · [aⱼ(τ)]₁ + r · [δ]₁

  [α]₁              ← 구조적 태그 (α 포함을 보장)
  + Σ wⱼ·[aⱼ(τ)]₁   ← witness에 의한 a(τ) 값
  + r·[δ]₁           ← 블라인딩 (영지식성)

결과: A = [α + a(τ) + rδ]₁`}</code></pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">B 계산 (G2 + G1)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`B  ∈ G2: [β]₂ + Σⱼ wⱼ · [bⱼ(τ)]₂ + s · [δ]₂
B' ∈ G1: [β]₁ + Σⱼ wⱼ · [bⱼ(τ)]₁ + s · [δ]₁

B는 검증에서 e(A, B)에 사용 (G2 필요)
B'는 C 계산에서 r·B'로 사용 (G1 필요)
→ G1 ↔ G2 변환이 불가능하므로 두 버전을 따로 계산`}</code></pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">C 계산 (G1)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`C = Σ_{j∈private} wⱼ · l_query[j']   ← 비공개 변수 기여
  + Σᵢ hᵢ · h_query[i]               ← QAP 만족의 증거
  + s·A + r·B' - r·s·[δ]₁            ← 블라인딩

블라인딩 항 전개:
  s·A = sα + s·a(τ) + rsδ
  r·B' = rβ + r·b(τ) + rsδ
  -rs·δ
  합계 = sα + s·a(τ) + rβ + r·b(τ) + rsδ`}</code></pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">영지식성: r, s 블라인딩</h3>
        <p>
          매 증명마다 새로운 랜덤 r, s를 사용하므로, 같은 witness라도 매번 다른 (A, B, C)가 생성됩니다.
          이로 인해 개별 증명에서 witness 정보를 추출하는 것이 불가능하며,
          이것이 <strong>완전 영지식(perfect zero-knowledge)</strong>을 보장합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`r = s = 0 이면: 같은 witness → 항상 같은 증명 → 정보 유출 위험
r, s ≠ 0 이면: 같은 witness라도 매번 다른 증명 → 시뮬레이션 가능
→ "시뮬레이터"가 witness 없이도 동일 분포의 증명 생성 가능`}</code></pre>
      </div>
    </section>
  );
}
