export const PEDERSEN_CODE = `Pedersen Commitment:
  C = v·G + r·H    (v: 값, r: 블라인딩)

  G, H: 독립 생성자 (이산로그 관계 미지)
  → 은닉성: r이 랜덤이면 v를 알 수 없음
  → 바인딩: 다른 (v',r')로 같은 C 생성 불가`;

export const ADDITIVE_CODE = `가법 동형성 (Additive Homomorphism):
  C₁ = v₁·G + r₁·H
  C₂ = v₂·G + r₂·H

  C₁ + C₂ = (v₁+v₂)·G + (r₁+r₂)·H
           = Commit(v₁+v₂, r₁+r₂)

  → 커밋먼트 덧셈 = 값의 덧셈
  → 암호화 상태에서 연산 가능!`;

export const KZG_HOMO_CODE = `KZG의 동형 속성:
  [f]₁ = f(τ)·G₁ = Σ fᵢ·[τⁱ]₁

  [f+g]₁ = [f]₁ + [g]₁           ✓ 가법 동형
  [α·f]₁ = α · [f]₁              ✓ 스칼라 곱
  [f·g]₁ = ???                    ✗ 곱은 불가!

  PLONK 활용:
  → linearization: 다항식 선형 결합 commit 재구성
  → batch opening: ν로 결합 후 단일 검증`;

export const APPLICATION_CODE = `활용 사례:
  ① PLONK Verifier:
     [F]₁ = [r]₁ + ν·[a]₁ + ν²·[b]₁ + ...
     → 개별 commit으로 combined commit 재구성

  ② Confidential Transaction:
     잔액 검증: Commit(in₁) + Commit(in₂)
              = Commit(out₁) + Commit(out₂) + Commit(fee)
     → 값을 노출하지 않고 합계 검증`;
