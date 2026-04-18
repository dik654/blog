import GANTrainingViz from './viz/GANTrainingViz';
import GANFailureViz from './viz/GANFailureViz';

const trainingSteps = [
  {
    num: 1,
    title: 'D 학습 — 진짜 데이터',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    desc: '실제 데이터 x_real을 D에 입력 → D(x_real)이 1에 가까워지도록 학습.',
    loss: 'L_D(real) = −log D(x_real)',
    detail: 'target = 1. BCE가 D(x_real)을 1로 끌어올려, D가 "진짜"를 정확히 구별하게 만든다.',
  },
  {
    num: 2,
    title: 'D 학습 — 가짜 데이터',
    color: '#f59e0b',
    bg: '#fffbeb',
    desc: '노이즈 z → G(z)로 가짜 샘플 생성 → D(x_fake)가 0에 가까워지도록 학습.',
    loss: 'L_D(fake) = −log(1 − D(G(z)))',
    detail: 'target = 0. G는 detach하여 D만 업데이트. D가 "가짜"를 정확히 걸러내게 만든다.',
  },
  {
    num: 3,
    title: 'G 학습',
    color: '#10b981',
    bg: '#ecfdf5',
    desc: '새 노이즈 z → G(z) → D(G(z))가 1에 가까워지도록 학습.',
    loss: 'L_G = −log D(G(z))',
    detail: 'target = 1 (D를 속이는 방향). D는 고정, G의 파라미터만 업데이트. D가 가짜를 진짜로 믿게 만든다.',
  },
  {
    num: 4,
    title: '교대 반복 → 내쉬 균형',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    desc: '매 epoch마다 D 업데이트(step 1-2) → G 업데이트(step 3)를 번갈아 실행.',
    loss: 'min_G max_D V(D, G)',
    detail: 'D가 강해지면 G가 더 정교한 샘플을 만들고, G가 강해지면 D가 더 민감해진다. 이론적으로 D(x) = 0.5인 내쉬 균형에 수렴.',
  },
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
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {trainingSteps.map((s) => (
          <div
            key={s.num}
            className="rounded-xl border p-5"
            style={{ backgroundColor: s.bg, borderColor: s.color + '40' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: s.color }}
              >
                {s.num}
              </span>
              <h4 className="font-semibold text-base">{s.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">{s.desc}</p>
            <code
              className="block text-xs font-mono rounded px-2 py-1 mb-2"
              style={{ backgroundColor: s.color + '15', color: s.color }}
            >
              {s.loss}
            </code>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">GAN 학습의 주요 실패 모드와 WGAN</h3>
        <div className="not-prose"><GANFailureViz /></div>
        <p className="leading-7">
          요약 1: <strong>Mode Collapse·Non-convergence</strong>가 GAN 학습의 양대 고질병.<br />
          요약 2: <strong>WGAN-GP</strong>는 Wasserstein 거리로 안정성 확보 — 현대 GAN의 표준.<br />
          요약 3: 학습률·업데이트 비율·Lipschitz 제약 조정이 실무 튜닝의 핵심.
        </p>
      </div>
    </section>
  );
}
