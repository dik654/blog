export const PIPELINE_CODE = `프로그램/함수 → [R1CS로 변환] → [QAP로 변환] → [Groth16 증명]
               중간 표현(IR)      다항식          암호학(페어링)`;

export const FORMAL_DEF_CODE = `하나의 제약: ⟨a, s⟩ · ⟨b, s⟩ = ⟨c, s⟩

행렬 형태: (A · s) ⊙ (B · s) = C · s
  A, B, C ∈ F^{m×n}  (m = 제약 수, n = 변수 수)
  s = (1, x₁, ..., xₗ, w₁, ..., wₘ)  ← witness 벡터
  ⊙ = Hadamard product (원소별 곱)

변수 분할:
  인덱스 0:     상수 1 (One) — 상수를 선형결합으로 표현
  인덱스 1..l:  공개 입력 (Instance) — 검증자도 아는 값
  인덱스 l+1..: 비공개 입력 (Witness) — 증명자만 아는 값`;

export const BUILDER_CODE = `// 1. 변수 할당
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
assert!(cs.is_satisfied());`;

export const WITNESS_CODE = `예: f(x) = x³ + x + 5, 입력 x=3

s[0] = 1         (상수 One)
s[2] = 3         (x — 비공개 입력)
s[3] = 3 × 3 = 9   (t₁ = x²)
s[4] = 9 × 3 = 27  (t₂ = x³)
s[1] = 27 + 3 + 5 = 35  (y — 공개 출력)

제약: x·x = t₁,  t₁·x = t₂,  (t₂+x+5)·1 = y
→ 곱셈 3번 = 제약 3개, 덧셈은 선형결합으로 흡수`;
