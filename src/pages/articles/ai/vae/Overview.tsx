import { CitationBlock } from '@/components/ui/citation';
import VAEPipelineViz from './viz/VAEPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VAE 개요: 확률적 생성 모델</h2>
      <div className="not-prose mb-8"><VAEPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-2xl">
        <p>
          VAE(Variational Autoencoder) — 입력 데이터를 <strong>확률 분포</strong>로 압축한 뒤,
          그 분포에서 샘플링하여 새로운 데이터를 생성하는 모델이다.
        </p>
        <p>
          치킨집 비유로 이해해 보자.
          양념치킨 소스의 배합 비율(간장 몇 %, 마늘 몇 %)을 알면
          기존 맛을 재현할 뿐 아니라 <strong>비율을 살짝 바꿔 새 양념</strong>도 만들 수 있다.<br />
          VAE의 잠재 공간이 바로 이 "배합 비율표"에 해당한다.
        </p>

        <CitationBlock source="Kingma & Welling, 2014 — Auto-Encoding Variational Bayes"
          citeKey={1} type="paper" href="https://arxiv.org/abs/1312.6114">
          <p className="italic">
            "We introduce a stochastic variational inference and learning algorithm
            that scales to large datasets and, under some mild differentiability
            conditions, even works in the intractable case."
          </p>
          <p className="mt-2 text-xs">
            VAE 원논문 — Reparameterization Trick으로 역전파 가능한 샘플링을 제안
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">이 글의 흐름</h3>
        <ol>
          <li>AE vs VAE — 잠재 공간의 근본적 차이</li>
          <li>인코더 — 입력을 μ, log σ²로 변환하는 숫자 계산</li>
          <li>Reparameterization Trick — 역전파를 가능하게 만드는 핵심</li>
          <li>디코더 — z를 원본 크기로 복원</li>
          <li>손실 함수 — 재구성 손실 + KL Divergence</li>
        </ol>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VAE 변분 추론 수학적 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// VAE = Variational Inference + Neural Networks
//
// 목표: 관찰된 데이터 x의 로그 우도 log p(x) 최대화
//
// 문제: p(x) = ∫ p(x|z) p(z) dz 는 계산 불가능 (intractable)
//   - z는 고차원 잠재 변수
//   - 적분이 폐형해(closed form) 불가능
//
// 해결: 변분 분포 q(z|x)로 근사
//
// ELBO (Evidence Lower BOund) 유도:
//   log p(x) = log ∫ p(x|z) p(z) dz
//            = log ∫ q(z|x) · [p(x|z) p(z) / q(z|x)] dz
//            ≥ E_q[log p(x|z) + log p(z) - log q(z|x)]     (Jensen)
//            = E_q[log p(x|z)] - KL(q(z|x) || p(z))
//            = ELBO(x, q)
//
// log p(x) ≥ ELBO(x, q)
//
// ELBO 최대화 = log p(x) 최대화 + KL(q || posterior) 최소화
//
// 두 항의 해석:
//   1) E_q[log p(x|z)] = 재구성 항 (Reconstruction)
//      - 디코더가 z로부터 x를 얼마나 잘 복원?
//   2) KL(q(z|x) || p(z)) = 정규화 항 (Regularization)
//      - q(z|x)가 사전 분포 p(z)=N(0,I)에서 얼마나 벗어났는지?

// VAE는 -ELBO를 최소화:
//   Loss = -E_q[log p(x|z)] + KL(q(z|x) || p(z))
//        = Reconstruction Loss + KL Divergence
//
// 실무 구현:
//   - q(z|x) ≈ N(μ(x), σ²(x))  # 인코더 출력
//   - p(z) = N(0, I)            # 표준 정규분포
//   - p(x|z) = N(μ(z), σ²)     # 디코더 출력`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">AE vs VAE vs GAN 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 생성 모델 3대 패러다임 비교
//
// ┌──────────┬──────────────┬────────────┬────────────┐
// │  측면    │     AE       │    VAE     │    GAN     │
// ├──────────┼──────────────┼────────────┼────────────┤
// │ 목적     │ 차원축소     │ 생성+압축  │ 생성       │
// │ 학습     │ 재구성 손실  │ ELBO       │ adversarial│
// │ 잠재공간 │ 결정론적 점  │ 확률분포   │ 랜덤 노이즈│
// │ 샘플링   │ 불가         │ 가능       │ 가능       │
// │ 보간     │ 구멍 존재    │ 매끄러움   │ 매끄러움   │
// │ 안정성   │ 안정         │ 안정       │ 불안정     │
// │ 품질     │ 보통         │ 흐릿함     │ 선명함     │
// │ 다양성   │ N/A          │ 높음       │ 낮음(mode) │
// └──────────┴──────────────┴────────────┴────────────┘

// VAE의 장점:
//   - 안정적 학습 (GAN보다 훨씬 쉬움)
//   - 잠재 공간이 의미 있음 (보간·산술 연산 가능)
//   - 우도 계산 가능 (ELBO)
//   - 이상 탐지 가능
//
// VAE의 단점:
//   - 생성 이미지가 흐릿함 (blurry)
//   - 원인: 가우시안 픽셀 가정 + 평균화 경향
//   - 해결: β-VAE, VQ-VAE, VAE-GAN, Diffusion

// 역사적 의의:
//   2013: Kingma & Welling의 VAE 원논문
//   2015: β-VAE로 disentanglement 연구 활발
//   2017: VQ-VAE로 이산 latent
//   2020~: Diffusion 모델의 VAE 기반 latent space 활용
//
//   Stable Diffusion = VAE + Diffusion + CLIP
//     → VAE로 이미지 공간 → latent 공간 (8배 압축)
//     → latent에서 diffusion 학습 (효율)
//     → 다시 VAE 디코더로 이미지 복원`}
        </pre>
        <p className="leading-7">
          요약 1: VAE는 <strong>변분 추론 + 신경망</strong> — log p(x) 대신 ELBO 최대화.<br />
          요약 2: <strong>ELBO = 재구성 - KL</strong> — 두 항의 균형이 핵심.<br />
          요약 3: Stable Diffusion의 <strong>latent space</strong>도 VAE가 제공 — 여전히 실용적 중요성.
        </p>
      </div>
    </section>
  );
}
