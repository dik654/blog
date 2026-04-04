import CodePanel from '@/components/ui/code-panel';
import GANTrainingViz from './viz/GANTrainingViz';

const trainCode = `# GAN 학습 루프 (PyTorch 스타일)
for epoch in range(epochs):
    # 1) Discriminator 학습
    real_labels = torch.ones(batch)
    fake_labels = torch.zeros(batch)

    z = torch.randn(batch, latent_dim)
    fake = generator(z).detach()

    d_loss = BCE(disc(real), real_labels) \\
           + BCE(disc(fake), fake_labels)
    d_loss.backward()
    opt_d.step()

    # 2) Generator 학습
    z = torch.randn(batch, latent_dim)
    g_loss = BCE(disc(generator(z)), real_labels)
    g_loss.backward()
    opt_g.step()`;

const annotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: 'D 학습: 진짜=1, 가짜=0' },
  { lines: [10, 14] as [number, number], color: 'emerald' as const, note: 'D 손실: BCE 합산' },
  { lines: [16, 20] as [number, number], color: 'amber' as const, note: 'G 학습: D를 속이도록' },
];

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 역학 & 안정성</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        D와 G를 교대 학습. Mode Collapse, 학습 불안정이 주요 과제.<br />
        WGAN — Earth Mover's Distance로 안정적 학습.
      </p>
      <GANTrainingViz />
      <div className="mt-6">
        <CodePanel title="GAN 학습 루프" code={trainCode} annotations={annotations} />
      </div>
    </section>
  );
}
