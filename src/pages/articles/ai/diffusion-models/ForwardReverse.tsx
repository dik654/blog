import { CitationBlock } from '@/components/ui/citation';
import DiffusionProcessViz from './viz/DiffusionProcessViz';
import ForwardMathSection from './ForwardMathSection';

export default function ForwardReverse() {
  return (
    <section id="forward-reverse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Forward & Reverse Process</h2>
      <div className="not-prose mb-8"><DiffusionProcessViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Forward Process (노이즈 추가)</h3>
        <p>
          Forward process — 원본 이미지 x_0에 T 단계에 걸쳐 가우시안 노이즈를 점진적으로 추가<br />
          각 단계 t에서 <strong>q(x_t | x_(t-1))</strong>는 소량의 노이즈를 더하는 가우시안 전이<br />
          스케줄 beta_t가 노이즈 강도를 제어
        </p>

        <ForwardMathSection />

        <CitationBlock source="Ho et al., NeurIPS 2020 — Section 2" citeKey={2} type="paper"
          href="https://arxiv.org/abs/2006.11239">
          <p className="italic">
            "A notable property of the forward process is that it admits sampling x_t at
            an arbitrary timestep t in closed form using the notation
            alpha_bar_t = prod(1 - beta_s)."
          </p>
          <p className="mt-2 text-xs">
            Reparameterization trick 덕분에 중간 단계를 거치지 않고
            원본에서 임의 시점 t의 노이즈 이미지를 직접 샘플링할 수 있습니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Reverse Process (디노이징)</h3>
        <p>
          Reverse process — x_T ~ N(0, I)에서 시작하여 단계별로 노이즈 제거<br />
          신경망 epsilon_theta가 각 시점에서 <strong>추가된 노이즈를 예측</strong>하고 이를 빼서 x_(t-1)을 복원<br />
          학습 목표: 단순한 <strong>MSE 손실</strong>(예측 노이즈와 실제 노이즈 간의 차이를 최소화)
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Forward Process 수식 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Forward Process: q(x_t | x_{t-1}) = N(sqrt(1-β_t)·x_{t-1}, β_t·I)
//
// 단일 스텝:
//   x_t = sqrt(1-β_t) · x_{t-1} + sqrt(β_t) · ε_t
//
// 여기서 ε_t ~ N(0, I), β_t는 노이즈 스케줄
//
// Nice Property (핵심 트릭):
//   α_t = 1 - β_t
//   ᾱ_t = ∏_{s=1}^{t} α_s = α_1 · α_2 · ... · α_t
//
// 그러면:
//   q(x_t | x_0) = N(sqrt(ᾱ_t)·x_0, (1-ᾱ_t)·I)
//
//   ⇒ x_t = sqrt(ᾱ_t)·x_0 + sqrt(1-ᾱ_t)·ε
//
// 의미:
//   - 임의 시점 t의 x_t를 직접 샘플링 가능 (중간 스텝 불필요)
//   - reparameterization으로 학습 가능
//   - 시점 t를 batch에서 랜덤 선택하여 학습
//
// 한계 동작:
//   t=0: x_0 = x_0 (원본)
//   t=T (T=1000): ᾱ_T ≈ 0, x_T ≈ ε ~ N(0, I) (순수 노이즈)

// 노이즈 스케줄 예시 (Linear):
//   β_1 = 0.0001, β_T = 0.02
//   β_t = 0.0001 + (0.02 - 0.0001) · (t-1)/(T-1)
//
// Cosine Schedule (개선):
//   ᾱ_t = cos²(π/2 · (t/T + s)/(1+s))
//   - 초기 노이즈 추가가 더 부드러움
//   - 높은 품질 학습`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Reverse Process와 학습</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Reverse Process: p_θ(x_{t-1} | x_t)
//
// 이상적 reverse (analytically):
//   p(x_{t-1} | x_t, x_0) = N(μ̃_t(x_t, x_0), β̃_t·I)
//
// 하지만 inference 시 x_0 모름 → 신경망이 추정
//
// 신경망 학습:
//   ε_θ(x_t, t): x_t에서 추가된 노이즈 ε 예측
//
// Simple Loss (Ho 2020):
//   L_simple(θ) = E_{t, x_0, ε} [||ε - ε_θ(x_t, t)||²]
//
//   여기서:
//     t ~ Uniform(1, T)
//     x_0 ~ 데이터 분포
//     ε ~ N(0, I)
//     x_t = sqrt(ᾱ_t)·x_0 + sqrt(1-ᾱ_t)·ε
//
// 학습 알고리즘:
//   for each batch:
//     x_0 = batch 샘플
//     t = randint(1, T)
//     ε = randn_like(x_0)
//     x_t = sqrt(ᾱ_t)·x_0 + sqrt(1-ᾱ_t)·ε
//     ε̂ = network(x_t, t)
//     loss = MSE(ε̂, ε)
//     loss.backward()

// 샘플링 알고리즘 (생성):
//   x_T ~ N(0, I)
//   for t = T, T-1, ..., 1:
//     z = randn_like(x_T) if t > 1 else 0
//     ε̂ = ε_θ(x_t, t)
//     x_{t-1} = (x_t - (1-α_t)/sqrt(1-ᾱ_t)·ε̂) / sqrt(α_t) + σ_t·z
//   return x_0

// 빠른 샘플링:
//   - DDIM: 결정론적, 50 스텝으로 충분
//   - DPM-Solver: 20 스텝
//   - Consistency Models: 1-4 스텝`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>ᾱ_t 누적곱</strong>으로 x_0에서 x_t 직접 계산 — 핵심 트릭.<br />
          요약 2: 학습은 <strong>노이즈 예측 MSE</strong> — 매우 간단.<br />
          요약 3: 샘플링은 <strong>T 스텝 순차 denoising</strong> — 현재 연구는 스텝 수 줄이기.
        </p>
      </div>
    </section>
  );
}
