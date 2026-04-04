export const LAGRANGE_CODE = `① Lagrange 보간 — R1CS → 다항식
   R1CS 제약 i: aᵢ · wᵢ × bᵢ · wᵢ = cᵢ · wᵢ

   각 변수 j에 대해 3개 다항식 생성:
     aⱼ(x): 제약 i에서 변수 j의 A-계수를 보간
     bⱼ(x): 제약 i에서 변수 j의 B-계수를 보간
     cⱼ(x): 제약 i에서 변수 j의 C-계수를 보간

   평가점: ω⁰, ω¹, ..., ω^(n-1) (n-th 단위근)`;

export const QAP_CODE = `② QAP 다항식 구성
   A(x) = Σⱼ wⱼ · aⱼ(x)
   B(x) = Σⱼ wⱼ · bⱼ(x)
   C(x) = Σⱼ wⱼ · cⱼ(x)

   QAP 만족 조건:
   A(x) · B(x) - C(x) = h(x) · t(x)
   ∀ x ∈ {ω⁰,...,ω^(n-1)}에서 성립`;

export const QUOTIENT_CODE = `③ 몫 다항식 h(x) 계산 (FFT 기반)
   t(x) = (x-ω⁰)(x-ω¹)···(x-ω^(n-1)) = xⁿ - 1

   h(x) = [A(x)·B(x) - C(x)] / t(x)

   구현: 코셋 FFT 최적화
     1) IFFT: A,B,C를 계수 → 점별 값
     2) 코셋 이동: k·ω 도메인에서 평가
     3) 점별 곱: A(kωⁱ)·B(kωⁱ) - C(kωⁱ)
     4) 점별 나눗셈: / t(kωⁱ)
     5) IFFT: 결과를 다시 계수로 변환`;

export const VANISHING_CODE = `④ Vanishing Polynomial t(x)
   t(x) = xⁿ - 1  (n = 제약 수)

   성질: t(ωⁱ) = 0  ∀ i ∈ [0,n)
   → A(ωⁱ)B(ωⁱ) - C(ωⁱ) = 0 이면
     A(x)B(x) - C(x)가 t(x)로 나누어짐
   → h(x)가 다항식으로 존재 ⟺ R1CS 만족`;
