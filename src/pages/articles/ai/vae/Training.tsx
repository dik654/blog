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
    </section>
  );
}
