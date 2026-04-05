import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const ELBO_CODE = `# ELBO = E[log p(x|z)] - KL(q(z|x) || p(z))
def vae_loss(x, x_recon, mu, log_var):
    # 재구성 손실: 입력과 출력의 차이
    recon_loss = F.binary_cross_entropy(x_recon, x, reduction='sum')

    # KL Divergence: 잠재 분포를 N(0,I)에 정규화
    kl_loss = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())

    return recon_loss + kl_loss

# Reparameterization Trick
def reparameterize(mu, log_var):
    std = torch.exp(0.5 * log_var)   # sigma
    eps = torch.randn_like(std)       # epsilon ~ N(0,1)
    return mu + eps * std             # z = mu + eps * sigma`;

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습: ELBO와 Reparameterization</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        ELBO = 재구성 손실 + KL Divergence.<br />
        Reparameterization: z = μ + ε·σ로 샘플링을 미분 가능하게 변환.
      </p>
      <CodePanel title="VAE Loss & Reparameterization (PyTorch)" code={ELBO_CODE}
        annotations={[
          { lines: [2, 4], color: 'sky', note: '재구성 손실' },
          { lines: [6, 8], color: 'amber', note: 'KL Divergence (해석적 해)' },
          { lines: [12, 15], color: 'emerald', note: 'Reparameterization Trick' },
        ]} defaultOpen />
      <CitationBlock source="Kingma & Welling, 2014 — Section 2.4"
        citeKey={3} type="paper" href="https://arxiv.org/abs/1312.6114">
        <p className="italic">
          "We reparameterize z as a deterministic variable z = g(eps, x)."
        </p>
      </CitationBlock>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VAE 전체 학습 루프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// VAE 학습 전체 파이프라인
import torch
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super().__init__()
        self.encoder_fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc_mu = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)
        self.decoder_fc1 = nn.Linear(latent_dim, hidden_dim)
        self.decoder_fc2 = nn.Linear(hidden_dim, input_dim)

    def encode(self, x):
        h = F.relu(self.encoder_fc1(x))
        return self.fc_mu(h), self.fc_logvar(h)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z):
        h = F.relu(self.decoder_fc1(z))
        return torch.sigmoid(self.decoder_fc2(h))

    def forward(self, x):
        mu, logvar = self.encode(x)
        z = self.reparameterize(mu, logvar)
        x_recon = self.decode(z)
        return x_recon, mu, logvar

def loss_fn(x_recon, x, mu, logvar):
    recon = F.binary_cross_entropy(x_recon, x, reduction='sum')
    kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    return recon + kl

# 학습 루프
model = VAE()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(20):
    for batch_x in train_loader:
        optimizer.zero_grad()
        x_recon, mu, logvar = model(batch_x)
        loss = loss_fn(x_recon, batch_x, mu, logvar)
        loss.backward()
        optimizer.step()`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">학습 트릭과 주의사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 일반적 문제와 해결
//
// 1. KL Collapse (Posterior Collapse)
//    현상: KL → 0, 모든 x가 같은 분포로 매핑
//    원인: 디코더가 강력하여 z 무시
//    해결:
//      - KL annealing (β를 0에서 1로 증가)
//      - Free bits (최소 KL 보장)
//      - 약한 decoder 사용
//
// 2. Blurry Output (흐릿한 출력)
//    원인: Gaussian likelihood의 평균화
//    해결:
//      - VAE-GAN 조합
//      - Perceptual loss
//      - VQ-VAE (이산 latent)
//
// 3. Latent Space 구조 부재
//    현상: 잠재 공간이 의미 없음
//    해결:
//      - β-VAE (higher β)
//      - InfoVAE
//      - Disentanglement 기법
//
// 4. Over-regularization
//    현상: KL이 너무 강해 재구성 망가짐
//    해결: β 감소, warmup 사용

// Hyperparameters:
//   latent_dim: 20~128 (MNIST), 256~1024 (이미지)
//   hidden_dim: 400~2048
//   learning_rate: 1e-3 (Adam)
//   batch_size: 128~256
//   epochs: 20~100

// 평가:
//   - Reconstruction Loss (낮을수록 좋음)
//   - FID Score (생성 품질)
//   - ELBO (전체 성능)
//   - Latent traversal (시각적 평가)`}
        </pre>
        <p className="leading-7">
          요약 1: VAE 학습은 <strong>encode → reparam → decode → loss → backprop</strong> 단순 파이프라인.<br />
          요약 2: <strong>KL collapse·blurry output</strong>이 주요 문제 — annealing·GAN 조합으로 해결.<br />
          요약 3: 평가는 <strong>재구성·FID·latent traversal</strong> 다각도로.
        </p>
      </div>
    </section>
  );
}
