import { ArrowDown, ArrowRight } from 'lucide-react';
import { ConceptPrimer, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const comparisons = [
  { model: 'VAE', signal: 'Reconstruction + KL', path: 'Prior z → decoder → x', tradeoff: '안정적이지만 likelihood 가정과 posterior gap을 지불' },
  { model: 'GAN', signal: 'Discriminator gradient', path: 'Noise z → generator → x', tradeoff: '빠르고 선명하지만 game의 불안정성과 mode collapse 위험' },
  { model: 'Diffusion', signal: 'Known noise target', path: 'Noise xT → 작은 correction 반복 → x0', tradeoff: '안정적인 supervised loss 대신 반복 sampling 비용' },
];

function DecompositionFigure() {
  const stages = [
    ['x₀', 'clean data'],
    ['xₜ', 'noise level t'],
    ['εθ', 'local correction'],
    ['xₜ₋₁', '조금 더 clean'],
  ];
  return (
    <figure className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <figcaption className="mb-2 text-sm font-bold">큰 생성 문제를 noise level별 local correction으로 분해</figcaption>
      <p className="mb-5 text-xs leading-relaxed text-muted-foreground">Forward는 학습 데이터를 여러 난이도의 noisy input으로 바꾸고, reverse model은 각 난이도에서 한 단계의 방향만 배운다.</p>
      <div className="grid items-center gap-3 lg:grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr]">
        {stages.map(([symbol, note], index) => <div key={symbol} className="contents"><div className={`min-w-0 rounded-md border p-4 text-center ${index === 2 ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}><p className="font-mono text-xl font-bold">{symbol}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p></div>{index < stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>)}
      </div>
    </figure>
  );
}

export default function WhyDiffusion() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">한 번의 어려운 생성을 왜 여러 작은 문제로 나눌까?</h2>
      <QuestionLead
        question="무작위 noise에서 복잡한 이미지를 한 번에 만들지 않고, 왜 일부러 수십 번에 걸쳐 조금씩 고칠까?"
        answer="Noise level이 고정된 한 단계에서는 해야 할 일이 제한된다. 모델은 이미지 분포 전체를 한 번에 매핑하는 대신 현재 noisy state에서 제거할 noise나 이동 방향만 예측한다. 학습 target은 forward에서 직접 넣은 noise라 정확히 알고 있다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          VAE는 tractable likelihood bound를 얻기 위해 posterior 근사를 두고, GAN은 likelihood를 버리는 대신 계속 움직이는
          discriminator를 학습한다. Diffusion은 다른 교환을 선택한다. 실제 data에 Gaussian noise를 조금씩 더하는
          <strong>고정된 forward process</strong>를 만들고, 그 경로를 되돌리는 local denoising을 neural network에 맡긴다.
        </p>
        <p>
          따라서 “생성 모델 계보”의 핵심은 연도가 아니다. <strong>무엇을 정답으로 알고 있으며, 어려운 분포 차이를 어떤 작은
          학습 문제로 바꿨는가</strong>다. 아래 개념을 잡은 뒤 forward와 reverse를 분리해 읽는다.
        </p>
      </div>
      <ConceptPrimer
        items={[
          { term: 'timestep t', meaning: '현재 sample에 noise가 얼마나 섞였는지 나타내는 이산 또는 연속 시간 좌표다.', why: '같은 network가 여러 noise 난이도에서 서로 다른 correction을 하게 한다.' },
          { term: 'noise schedule', meaning: '각 t에서 signal과 noise의 비율을 정하는 규칙이다.', why: '학습 난이도와 sampler가 지나갈 경로를 결정한다.' },
          { term: 'score / noise target', meaning: 'Noisy density에서 data가 많은 방향을 가리키는 값 또는 그와 변환 가능한 noise다.', why: '모델이 reverse 방향을 예측할 supervised target을 제공한다.' },
          { term: 'sampler / solver', meaning: '모델 예측을 사용해 xₜ에서 xₜ₋₁ 또는 다음 연속 상태를 계산하는 알고리즘이다.', why: '학습된 network와 실제 생성 속도·품질을 분리해 생각하게 한다.' },
        ]}
      />
      <DecompositionFigure />
      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {comparisons.map((item) => <article key={item.model} className="grid gap-2 py-4 sm:grid-cols-[6rem_1fr_1fr] lg:grid-cols-[6rem_1fr_1fr_1.2fr]"><h3 className="text-sm font-bold">{item.model}</h3><p className="text-sm leading-relaxed">{item.signal}</p><p className="text-sm leading-relaxed text-muted-foreground">{item.path}</p><p className="text-sm leading-relaxed text-muted-foreground sm:col-span-2 lg:col-span-1">{item.tradeoff}</p></article>)}
      </div>
      <Misconception>
        Forward process가 실제 생성 때 이미지를 망가뜨린 뒤 되돌리는 것은 아니다. Forward는 학습용 noisy pair를 만드는 규칙이고, generation은 처음부터 random xT를 뽑아 reverse solver만 실행한다.
      </Misconception>
    </section>
  );
}
