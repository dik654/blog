import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { ConceptPrimer, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const aePoints = [[74, 75], [92, 61], [109, 79], [255, 143], [276, 126], [289, 153]];
const vaePoints = [[83, 73], [105, 64], [127, 78], [151, 93], [178, 105], [205, 117], [232, 129], [260, 139], [285, 151]];

function LatentCoverageFigure() {
  return (
    <figure className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-bold">Latent space에서 prior sample이 놓일 자리</figcaption>
      <div className="grid gap-5 lg:grid-cols-2">
        {[
          { label: 'Deterministic AE', points: aePoints, note: '관측 code 사이의 빈 공간은 decoder가 학습하지 않았다.' },
          { label: 'VAE', points: vaePoints, note: '분포가 겹치고 prior 주변을 채워 중간 지점도 decode할 근거가 생긴다.' },
        ].map((plot) => (
          <div key={plot.label} className="min-w-0">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{plot.label}</p>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted-foreground" aria-hidden="true">
              <span className="font-mono">z₂ ↑</span>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-600" />prior sample</span>
            </div>
            <svg viewBox="0 0 360 190" role="img" aria-label={`${plot.label} latent 분포`} className="block aspect-[360/190] w-full rounded-md border border-border bg-muted/10">
              <line x1="34" y1="160" x2="336" y2="160" stroke="currentColor" opacity="0.2" />
              <line x1="34" y1="20" x2="34" y2="160" stroke="currentColor" opacity="0.2" />
              {plot.label === 'VAE' && <path d="M60 58 C105 30 145 67 178 104 C215 144 265 164 307 139" fill="none" stroke="#2563eb" opacity="0.25" strokeWidth="28" strokeLinecap="round" />}
              {plot.points.map(([x, y], index) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill={index < plot.points.length / 2 ? '#2563eb' : '#059669'} opacity="0.9" />)}
              <circle cx="180" cy="105" r="5" fill="#d97706" />
            </svg>
            <p className="mt-1 text-right font-mono text-xs text-muted-foreground" aria-hidden="true">z₁ →</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{plot.note}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export default function FromAutoencoder() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">복원 가능한 code가 곧 생성 가능한 공간은 아니다</h2>
      <QuestionLead
        question="오토인코더의 decoder에 random code를 넣으면 왜 자연스러운 새 샘플이 나오지 않을까?"
        answer="일반 오토인코더는 학습 입력이 만든 몇 개의 code 지점만 복원하면 된다. Code 사이의 빈 공간과 전체 분포를 규제하지 않으므로 임의의 z가 decoder가 학습한 영역에 놓인다는 보장이 없다."
      />
      <ConceptPrimer
        items={[
          { term: 'prior p(z)', meaning: '생성할 때 latent를 뽑을 수 있도록 미리 정한 단순한 분포다.', why: '새 입력 x 없이도 z를 만들 출발점을 제공한다.' },
          { term: 'posterior p(z|x)', meaning: '관측 x가 주어졌을 때 가능한 latent 원인의 분포다.', why: '같은 x를 설명할 수 있는 z의 불확실성을 나타낸다.' },
          { term: 'approximate posterior qφ(z|x)', meaning: '계산하기 어려운 진짜 posterior를 encoder가 근사한 분포다.', why: '각 x마다 반복 최적화하지 않고 한 번의 forward로 분포 파라미터를 얻는다.' },
          { term: 'decoder likelihood pθ(x|z)', meaning: 'z가 주어졌을 때 관측 x가 나올 분포다.', why: '복원 오차를 확률 모델의 log-likelihood로 해석하게 한다.' },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          VAE는 encoder 출력 하나를 code로 확정하지 않는다. 각 입력에 대해 가능한 z의 <strong>평균과 분산</strong>을
          예측하고 그 분포에서 sample한다. 동시에 이 posterior들이 공통 prior 근처에 놓이도록 KL divergence로 규제한다.
          그래서 reconstruction뿐 아니라 prior에서 뽑은 z의 generation도 학습 목표에 들어온다.
        </p>
      </div>
      <LatentCoverageFigure />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><p className="mb-2 text-xs font-bold text-muted-foreground">Autoencoder</p><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`z=f_\phi(x),\quad \hat x=g_\theta(z)`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><p className="mb-2 text-xs font-bold text-muted-foreground">Variational autoencoder</p><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`q_\phi(z\mid x)=\mathcal N(\mu_\phi(x),\mathrm{diag}(\sigma_\phi^2(x)))`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="일반 Autoencoder는 입력마다 latent 점 하나를 결정하지만, VAE encoder는 각 입력이 만들 posterior의 평균과 분산을 출력한다. 이 분포에서 sample한 z를 decoder에 넣어야 prior에서 새 z를 뽑는 생성 경로까지 연결할 수 있다."
        symbols={[
          [String.raw`f_\phi`, '입력을 하나의 latent 점으로 보내는 deterministic encoder'],
          [String.raw`g_\theta`, 'latent를 관측 공간의 복원으로 바꾸는 decoder'],
          [String.raw`q_\phi(z\mid x)`, '입력 x를 본 뒤 latent z에 두는 approximate posterior'],
          [String.raw`\mu_\phi(x)`, 'posterior 중심을 정하는 encoder 출력'],
          [String.raw`\sigma_\phi^2(x)`, '각 latent 축의 허용 불확실성을 정하는 encoder 출력'],
        ]}
      />
      <Misconception>
        VAE의 V는 latent 값에 임의의 noise를 넣는다는 뜻이 아니다. 계산 불가능한 posterior를 분포족 qφ로 근사하고 evidence lower bound를 최적화하는 variational inference에서 나온 이름이다.
      </Misconception>
    </section>
  );
}
