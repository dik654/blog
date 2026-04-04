export const TOXIC_WASTE_CODE = `τ (tau)   : 비밀 평가점 — QAP 다항식을 τ에서 평가하여 커브 포인트로 인코딩
α (alpha) : 지식 계수 — A, B가 올바른 구조로 만들어졌는지 강제
β (beta)  : 교차항 계수 — A, B, C가 같은 witness에서 나왔는지 결합
γ (gamma) : public 구분자 — 공개 변수의 commitment를 γ로 나눔
δ (delta) : private 구분자 — 비공개 변수 + h(τ)t(τ)를 δ로 나눔`;

export const SETUP_CODE = `① toxic waste 생성
   τ, α, β, γ, δ ← Fr* (0이 아닌 랜덤)

② 기본 커브 포인트 계산
   [α]₁, [β]₁, [β]₂, [δ]₁, [δ]₂, [γ]₂

③ QAP 다항식을 τ에서 평가
   각 변수 j: aⱼ(τ), bⱼ(τ), cⱼ(τ) ∈ Fr

④ Query 벡터 생성
   a_query[j]    = [aⱼ(τ)]₁
   b_g2_query[j] = [bⱼ(τ)]₂

⑤ LC 계산 및 public/private 분리
   lcⱼ = β·aⱼ(τ) + α·bⱼ(τ) + cⱼ(τ)
   공개:  ic[j]      = [lcⱼ / γ]₁
   비공개: l_query[j'] = [lcⱼ / δ]₁

⑥ h_query 생성
   h_query[i] = [τⁱ · t(τ) / δ]₁

⑦ VK에 e(α, β) 사전 계산 저장`;
