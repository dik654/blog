export default function TrustedSetup() {
  return (
    <section id="trusted-setup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Trusted Setup</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16의 첫 번째 단계는 <strong>Trusted Setup</strong>으로, QAP와 랜덤 파라미터를 결합하여
          ProvingKey(PK)와 VerifyingKey(VK)를 생성합니다. 이 과정에서 생성되는 비밀 값들을
          <strong> toxic waste</strong>라 부르며, 반드시 삭제해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">5개의 Toxic Waste 파라미터</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`τ (tau)   : 비밀 평가점 — QAP 다항식을 τ에서 평가하여 커브 포인트로 인코딩
α (alpha) : 지식 계수 — A, B가 올바른 구조로 만들어졌는지 강제
β (beta)  : 교차항 계수 — A, B, C가 같은 witness에서 나왔는지 결합
γ (gamma) : public 구분자 — 공개 변수의 commitment를 γ로 나눔
δ (delta) : private 구분자 — 비공개 변수 + h(τ)t(τ)를 δ로 나눔`}</code></pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">Setup 과정</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`① toxic waste 생성
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

⑦ VK에 e(α, β) 사전 계산 저장`}</code></pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">Public/Private 분리</h3>
        <p>
          witness 벡터에서 인덱스 0은 상수 1(One), 인덱스 1..l은 공개 Instance 변수,
          나머지는 비공개 Witness 변수입니다. IC는 검증자가 아는 공개 부분,
          L은 증명자만 아는 비공개 부분으로, 각각 gamma와 delta로 나누어 별도의 검증 채널을 형성합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">MPC Ceremony</h3>
        <p>
          프로덕션에서는 toxic waste 노출을 방지하기 위해 <strong>MPC(Multi-Party Computation) 세레모니</strong>를
          수행합니다. N명의 참여자가 각각 비밀 값을 생성하고, 최종 파라미터는 이들의 곱으로 결정됩니다.
          N명 중 단 1명이라도 자기 값을 삭제하면 안전한 <strong>1-of-N 신뢰 모델</strong>입니다.
        </p>
      </div>
    </section>
  );
}
