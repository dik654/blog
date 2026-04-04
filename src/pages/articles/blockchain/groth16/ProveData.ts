export const A_CALC_CODE = `A = [α]₁ + Σⱼ wⱼ · [aⱼ(τ)]₁ + r · [δ]₁

  [α]₁              ← 구조적 태그 (α 포함을 보장)
  + Σ wⱼ·[aⱼ(τ)]₁   ← witness에 의한 a(τ) 값
  + r·[δ]₁           ← 블라인딩 (영지식성)

결과: A = [α + a(τ) + rδ]₁`;

export const B_CALC_CODE = `B  ∈ G2: [β]₂ + Σⱼ wⱼ · [bⱼ(τ)]₂ + s · [δ]₂
B' ∈ G1: [β]₁ + Σⱼ wⱼ · [bⱼ(τ)]₁ + s · [δ]₁

B는 검증에서 e(A, B)에 사용 (G2 필요)
B'는 C 계산에서 r·B'로 사용 (G1 필요)
→ G1 ↔ G2 변환이 불가능하므로 두 버전을 따로 계산`;

export const C_CALC_CODE = `C = Σ_{j∈private} wⱼ · l_query[j']   ← 비공개 변수 기여
  + Σᵢ hᵢ · h_query[i]               ← QAP 만족의 증거
  + s·A + r·B' - r·s·[δ]₁            ← 블라인딩

블라인딩 항 전개:
  s·A = sα + s·a(τ) + rsδ
  r·B' = rβ + r·b(τ) + rsδ
  -rs·δ
  합계 = sα + s·a(τ) + rβ + r·b(τ) + rsδ`;

export const ZK_BLINDING_CODE = `r = s = 0 이면: 같은 witness → 항상 같은 증명 → 정보 유출 위험
r, s ≠ 0 이면: 같은 witness라도 매번 다른 증명 → 시뮬레이션 가능
→ "시뮬레이터"가 witness 없이도 동일 분포의 증명 생성 가능`;
