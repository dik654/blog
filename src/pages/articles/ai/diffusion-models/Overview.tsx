import { CitationBlock } from '@/components/ui/citation';
import GenerativeTimelineViz from './viz/GenerativeTimelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 모델 계보와 Diffusion의 등장</h2>
      <div className="not-prose mb-8"><GenerativeTimelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          생성 모델의 계보: <strong>GAN</strong>(2014, 적대적 학습) → <strong>VAE</strong>(잠재 공간 학습) → <strong>Normalizing Flow</strong>(역변환 가능한 분포 변환) → <strong>Diffusion Model</strong>
        </p>
        <p>
          DDPM(Denoising Diffusion Probabilistic Models) — 2020년 Ho et al. 제안<br />
          데이터에 <strong>점진적으로 노이즈를 추가</strong>한 뒤 이를 <strong>역으로 제거</strong>하는 과정을 학습<br />
          GAN과 달리 mode collapse(모드 붕괴, 다양성 상실) 없음 — 학습이 안정적
        </p>

        <CitationBlock source="Ho et al., NeurIPS 2020 — DDPM" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2006.11239">
          <p className="italic">
            "We show that diffusion models can generate samples matching the quality of GANs,
            while offering stable training and mode coverage."
          </p>
          <p className="mt-2 text-xs">
            DDPM은 이미지 생성 품질에서 GAN에 필적하면서도 학습 안정성과
            다양성 측면에서 우위를 보여, Diffusion 모델 시대를 열었습니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어</h3>
        <p>
          DDPM의 핵심 — <strong>마르코프 체인</strong>(Markov Chain, 현재 상태가 직전 상태에만 의존하는 확률 과정)을 통한 점진적 변환<br />
          Forward process: T 단계에 걸쳐 가우시안 노이즈 추가<br />
          Reverse process: 신경망이 각 단계의 노이즈를 예측하여 제거<br />
          최종적으로 순수 가우시안 노이즈에서 고품질 이미지 생성
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Diffusion 모델의 수학적 기반</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Denoising Diffusion Probabilistic Models (DDPM, 2020)
//
// 핵심 아이디어:
//   데이터 분포 p(x_0)를 직접 학습하기 어렵다면,
//   점진적으로 노이즈를 추가하는 forward process를 정의하고
//   역방향 process (노이즈 → 데이터)를 신경망으로 학습
//
// Forward Process (정해진, 학습 없음):
//   q(x_t | x_{t-1}) = N(x_t; sqrt(1-β_t)·x_{t-1}, β_t·I)
//   T 스텝 후: x_T ~ N(0, I) (순수 가우시안 노이즈)
//
// Reverse Process (학습 대상):
//   p_θ(x_{t-1} | x_t) = N(x_{t-1}; μ_θ(x_t, t), Σ_θ(x_t, t))
//   신경망이 각 스텝의 역방향 분포 파라미터 학습
//
// 학습 목표:
//   ELBO 최대화 → Simple Loss (Ho et al. 2020):
//   L_simple = E[||ε - ε_θ(x_t, t)||²]
//
// 즉, "각 시점에서 어떤 노이즈가 추가되었는지" 예측
//
// 생성 과정:
//   1. x_T ~ N(0, I) 샘플링
//   2. for t = T, T-1, ..., 1:
//        ε̂ = ε_θ(x_t, t)
//        x_{t-1} = (x_t - coef·ε̂) / sqrt(α_t) + noise
//   3. 최종 x_0 출력

// 노이즈 스케줄 β_t:
//   보통 β_1 = 10^-4 → β_T = 0.02 (linear)
//   T = 1000 (표준)
//   또는 cosine schedule (Nichol & Dhariwal 2021)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Diffusion vs GAN vs VAE</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 생성 모델 비교 (2024 기준)
//
// ┌──────────────┬──────────┬──────────┬──────────┐
// │    측면      │   GAN    │   VAE    │ Diffusion│
// ├──────────────┼──────────┼──────────┼──────────┤
// │ 학습 안정성  │ 불안정   │ 안정     │ 매우안정 │
// │ 샘플 품질    │ 선명     │ 흐림     │ 최고     │
// │ 다양성       │ mode collapse│ 높음  │ 매우높음│
// │ 생성 속도    │ 1 step   │ 1 step   │ 50~1000 │
// │ 학습 목표    │ adversarial│ ELBO   │ denoise │
// │ 조건부 생성  │ 어려움   │ 가능     │ 매우쉬움 │
// └──────────────┴──────────┴──────────┴──────────┘
//
// Diffusion의 장점:
//   1. 학습 매우 안정 (단일 MSE loss)
//   2. Mode coverage (다양성 우수)
//   3. Classifier-free guidance로 조건 제어
//   4. scaling 잘됨 (더 큰 모델 = 더 좋은 결과)
//
// Diffusion의 단점:
//   1. 추론 느림 (T=50~1000 스텝)
//   2. 계산 비용 큼 (각 스텝마다 UNet forward)
//   3. 메모리 사용량 큼

// 시대별 변화:
//   2014-2020: GAN 전성기 (StyleGAN 등)
//   2020-2022: Diffusion 부상 (DDPM, Stable Diffusion)
//   2022-현재: Diffusion 주류
//   2023-: Consistency Models (1-step diffusion)
//   2024-: Flow Matching, Rectified Flow`}
        </pre>
        <p className="leading-7">
          요약 1: Diffusion은 <strong>점진적 denoising</strong>으로 이미지 생성 — GAN의 적대적 학습과 반대.<br />
          요약 2: <strong>Simple Loss (MSE)</strong>만으로 학습 — GAN 대비 훨씬 안정.<br />
          요약 3: 2022년 이후 <strong>생성 모델의 주류</strong> — Stable Diffusion·DALL-E·Sora 등.
        </p>
      </div>
    </section>
  );
}
