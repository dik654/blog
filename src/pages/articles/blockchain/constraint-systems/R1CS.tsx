export default function R1CS() {
  return (
    <section id="r1cs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS (Rank-1 Constraint System)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZK 증명의 중간 표현</h3>
        <p>ZK 증명의 목표는 비밀 x를 공개하지 않고 f(x) = y임을 증명하는 것이다. R1CS는 임의의 계산을 증명 시스템이 이해하는 형태로 번역하는 중간 표현(IR)이다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`프로그램/함수 → [R1CS로 변환] → [QAP로 변환] → [Groth16 증명]
               중간 표현(IR)      다항식          암호학(페어링)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">형식적 정의</h3>
        <p>체 F 위의 R1CS 인스턴스는 행렬 A, B, C와 witness 벡터 s로 구성된다. 각 제약은 곱셈 게이트 하나를 표현하며, <strong>덧셈은 무료(선형결합)</strong>이고 곱셈만 비용이 든다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`하나의 제약: ⟨a, s⟩ · ⟨b, s⟩ = ⟨c, s⟩

행렬 형태: (A · s) ⊙ (B · s) = C · s
  A, B, C ∈ F^{m×n}  (m = 제약 수, n = 변수 수)
  s = (1, x₁, ..., xₗ, w₁, ..., wₘ)  ← witness 벡터
  ⊙ = Hadamard product (원소별 곱)

변수 분할:
  인덱스 0:     상수 1 (One) — 상수를 선형결합으로 표현
  인덱스 1..l:  공개 입력 (Instance) — 검증자도 아는 값
  인덱스 l+1..: 비공개 입력 (Witness) — 증명자만 아는 값`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">ConstraintSystem 빌더</h3>
        <p>회로를 빌드하는 인터페이스로, 변수를 할당하고 제약을 추가한 뒤 만족 여부를 확인한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 1. 변수 할당
let x = cs.alloc_witness(Fr::from_u64(3));   // 비공개
let y = cs.alloc_witness(Fr::from_u64(4));   // 비공개
let z = cs.alloc_instance(Fr::from_u64(12)); // 공개

// 2. 제약 추가: x * y = z
cs.enforce(
    LinearCombination::from(x),   // A = x
    LinearCombination::from(y),   // B = y
    LinearCombination::from(z),   // C = z
);

// 3. 검증: 3 * 4 = 12 ✓
assert!(cs.is_satisfied());`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Witness 생성</h3>
        <p>Witness 생성은 함수를 실제로 실행하는 것과 같다. 증명자는 f(x)를 계산하여 전체 witness 벡터를 채우고, 검증자는 계산 없이 증명만으로 f(x)=y를 확인한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`예: f(x) = x³ + x + 5, 입력 x=3

s[0] = 1         (상수 One)
s[2] = 3         (x — 비공개 입력)
s[3] = 3 × 3 = 9   (t₁ = x²)
s[4] = 9 × 3 = 27  (t₂ = x³)
s[1] = 27 + 3 + 5 = 35  (y — 공개 출력)

제약: x·x = t₁,  t₁·x = t₂,  (t₂+x+5)·1 = y
→ 곱셈 3번 = 제약 3개, 덧셈은 선형결합으로 흡수`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">비선형 연산의 제약 비용</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>덧셈 a + b</strong>: 0개 (무료 — 선형결합으로 흡수)</li>
          <li><strong>곱셈 a * b</strong>: 1개</li>
          <li><strong>거듭제곱 a^n</strong>: ~log₂(n)개 (square-and-multiply)</li>
          <li><strong>비트 분해</strong>: ~254개 (각 비트에 boolean 제약)</li>
          <li><strong>Poseidon hash</strong>: ~250개 (ZK-friendly)</li>
          <li><strong>SHA-256</strong>: ~25,000개 (비트 연산 기반 → 비효율)</li>
        </ul>
      </div>
    </section>
  );
}
