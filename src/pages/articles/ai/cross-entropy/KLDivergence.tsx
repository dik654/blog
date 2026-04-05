import KLDivergenceViz from './viz/KLDivergenceViz';

export default function KLDivergence() {
  return (
    <section id="kl-divergence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KL Divergence</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        D_KL(P‖Q) = CE(P,Q) - H(P) — 두 분포 간의 순수한 차이.<br />
        비대칭(P‖Q ≠ Q‖P), 대칭 버전은 Jensen-Shannon Divergence.
      </p>
      <KLDivergenceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">KL Divergence 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Kullback-Leibler Divergence
// D_KL(P || Q) = Σ P(x) log(P(x)/Q(x))
//              = E_P[log(P(x)/Q(x))]
//              = H(P, Q) - H(P)

// 해석
// "P를 Q로 근사할 때 정보 손실"
// "P로부터 샘플을 Q로 인코딩 시 여분의 bits"

// 속성
// 1. D_KL(P || Q) >= 0 (Gibbs' inequality)
// 2. D_KL(P || Q) = 0 iff P = Q (almost everywhere)
// 3. 비대칭: D_KL(P || Q) ≠ D_KL(Q || P)
// 4. 삼각 부등식 안 성립 (metric 아님, divergence)

// Continuous 버전
// D_KL(P || Q) = ∫ p(x) log(p(x)/q(x)) dx

// Q(x) = 0인데 P(x) > 0 → divergence 발산
// → Q의 support가 P를 포함해야 함`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">비대칭성의 의미</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// D_KL(P || Q): "P를 기준으로 Q의 틀림 정도"
// D_KL(Q || P): "Q를 기준으로 P의 틀림 정도"

// Forward KL: D_KL(P || Q) — "mode covering"
// - P가 support한 모든 곳에 Q도 확률 할당해야
// - Q가 너무 퍼지는 경향
// - Mean-seeking

// Reverse KL: D_KL(Q || P) — "mode seeking"
// - Q는 P의 일부 mode만 집중
// - Q가 sharp하게 한 mode에 집중
// - Zero-forcing

// 예시: bimodal P, unimodal Q
// P = 0.5·N(-2, 1) + 0.5·N(2, 1)   (two peaks)
// Q = N(μ, σ²)                      (single peak)

// Forward KL: Q가 두 peak 사이(μ≈0)에 퍼짐
// Reverse KL: Q가 한 peak(μ=2 or μ=-2)에 집중

// 선택 기준
// - Forward KL (MLE): data matching
// - Reverse KL (VAE, variational): posterior 근사
// - Symmetric (JSD): 분포 비교`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">JS Divergence (대칭 버전)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Jensen-Shannon Divergence
// JSD(P || Q) = 0.5 · D_KL(P || M) + 0.5 · D_KL(Q || M)
// where M = 0.5(P + Q)

// 속성
// 1. 대칭: JSD(P || Q) = JSD(Q || P)
// 2. 유한: 0 <= JSD <= log 2
// 3. √JSD가 metric (Jensen-Shannon distance)

// 장점
// - 대칭 → "거리" 직관
// - 유한 값 → numerical stable
// - Zero overlap에서도 정의됨 (KL과 다름)

// 사용 사례
// - GAN evaluation (FID, KID)
// - Distribution comparison
// - Document similarity

// Python 구현
import numpy as np
from scipy.stats import entropy

def kl_divergence(p, q):
    p = np.asarray(p)
    q = np.asarray(q)
    # p(x) > 0인 곳만 (0·log(0/q) = 0)
    mask = p > 0
    return np.sum(p[mask] * np.log(p[mask] / q[mask]))

def js_divergence(p, q):
    p = np.asarray(p)
    q = np.asarray(q)
    m = 0.5 * (p + q)
    return 0.5 * kl_divergence(p, m) + 0.5 * kl_divergence(q, m)

# Or use scipy
# entropy(p, q) = KL(p || q) in natural log base`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ML에서 KL Divergence 사용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1. Variational Inference (VAE)
// q(z|x): approximate posterior
// p(z|x): true posterior (intractable)
// ELBO = log p(x) - KL(q(z|x) || p(z|x))
//      = E_q[log p(x,z)] - E_q[log q(z|x)]

// VAE loss:
// L = -ELBO = -E_q[log p(x|z)] + KL(q(z|x) || p(z))
// - 첫 항: reconstruction loss
// - 둘째 항: KL to prior N(0, I)

// 2. Reinforcement Learning (PPO)
// Policy constraint: KL divergence from old policy
// L = E[r_t(θ) · Â_t] - β · KL(π_old || π_new)
// - π_old: previous policy
// - π_new: updated policy
// - β controls policy deviation

// 3. Knowledge Distillation
// Teacher T, Student S
// L_KD = KL(T_softmax(T logits) || T_softmax(S logits))
// - Temperature T로 softmax 완화
// - Student가 teacher의 soft label 학습

// 4. Model Calibration
// ECE (Expected Calibration Error)
// 관련: KL(empirical || predicted)

// 5. Generative Models (GAN loss 변형)
// f-GAN: 다양한 f-divergence로 일반화
// - KL, Reverse KL, JS, Pearson χ²`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch에서 KL 계산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import torch
import torch.nn.functional as F

# 1) Discrete distributions (probs)
p = torch.tensor([0.1, 0.4, 0.5])
q = torch.tensor([0.2, 0.3, 0.5])

# Method 1: 직접 계산
kl = (p * torch.log(p / q)).sum()
print(kl.item())  # ~0.068

# Method 2: nn.KLDivLoss (log probabilities 입력)
log_q = torch.log(q)
kl_loss = F.kl_div(log_q, p, reduction='sum')
# 주의: nn.KLDivLoss 인자 순서: (log_input, target)
# 계산: target · (log(target) - input)

# 2) VAE case: Gaussian KL
# KL(N(μ, σ²) || N(0, 1))
# = 0.5 · (μ² + σ² - log(σ²) - 1)

def vae_kl(mu, log_var):
    return -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())

# VAE training
reconstruction_loss = F.mse_loss(x_recon, x, reduction='sum')
kl_loss = vae_kl(mu, log_var)
total_loss = reconstruction_loss + kl_loss

# 3) Knowledge distillation
teacher_logits = teacher(x)
student_logits = student(x)
T = 4.0  # temperature
kd_loss = F.kl_div(
    F.log_softmax(student_logits / T, dim=-1),
    F.softmax(teacher_logits / T, dim=-1),
    reduction='batchmean'
) * T * T`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: KL Divergence 대안</p>
          <p>
            <strong>문제점</strong>:<br />
            ✗ 비대칭 (metric 아님)<br />
            ✗ Support mismatch 시 무한<br />
            ✗ 해석 직관 부족
          </p>
          <p className="mt-2">
            <strong>대안 divergences</strong>:<br />
            - <strong>Wasserstein (Earth Mover's)</strong>: "분포 이동 비용", GAN 표준<br />
            - <strong>Total Variation</strong>: 0.5·Σ|P(x) - Q(x)|, bounded [0,1]<br />
            - <strong>Hellinger</strong>: √(1-Σ√(P·Q)), metric 성질<br />
            - <strong>Maximum Mean Discrepancy (MMD)</strong>: kernel-based
          </p>
          <p className="mt-2">
            <strong>언제 무엇을</strong>:<br />
            - 확률 분포 학습 (VAE): KL (closed-form 유도)<br />
            - 생성 모델 평가: Wasserstein (stable gradient)<br />
            - 분포 매칭 (domain adaptation): MMD<br />
            - Hypothesis testing: Hellinger
          </p>
        </div>

      </div>
    </section>
  );
}
