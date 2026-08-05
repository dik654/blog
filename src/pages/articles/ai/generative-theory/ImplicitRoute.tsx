import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';
import { useArticleTabs } from '@/components/learning/useArticleTabs';

type Family = 'gan' | 'diffusion';

const families: Record<Family, { label: string; question: string; stages: Array<[string, string]>; signal: string; sampling: string; failure: string }> = {
  gan: {
    label: 'GAN',
    question: '생성 sample과 real sample을 구별하는 판별자를 학습 신호로 쓴다.',
    stages: [['z', 'random source'], ['Gθ(z)', 'fake sample'], ['Dψ(x)', 'real/fake score']],
    signal: '판별자가 fake를 알아보는 방향의 gradient',
    sampling: '학습 뒤 G를 한 번 실행해 빠르게 생성',
    failure: '두 모델의 균형 붕괴, mode collapse, gradient saturation',
  },
  diffusion: {
    label: 'Diffusion',
    question: '정답 이미지에 직접 넣은 noise를 예측하는 supervised 문제를 만든다.',
    stages: [['x₀', 'clean sample'], ['xₜ', 'known noise 추가'], ['εθ(xₜ,t)', 'noise 예측']],
    signal: '실제 noise와 예측 noise 사이의 MSE',
    sampling: 'noise에서 여러 correction step을 반복',
    failure: '느린 sampling, schedule/solver 오차, 조건 과잉 유도',
  },
};

function FamilyExplorer() {
  const [family, setFamily] = useState<Family>('gan');
  const selected = families[family];
  const familyKeys = Object.keys(families) as Family[];
  const { getTabProps, panelProps } = useArticleTabs({ keys: familyKeys, value: family, onChange: setFamily });
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="암시적 생성과 반복 복원 비교">
        {familyKeys.map((key, index) => <button key={key} type="button" {...getTabProps(key, index)} className={`min-h-12 border-b-2 px-3 text-sm font-bold ${family === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{families[key].label}</button>)}
      </div>
      <div {...panelProps} className="p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-6">
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{selected.question}</p>
        <div className="grid items-center gap-2 lg:grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr]">
          {selected.stages.map(([symbol, description], index) => <div key={`${family}-${symbol}`} className="contents"><div className={`min-w-0 rounded-md border p-4 text-center ${index === 1 ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}><p className="break-words font-mono text-sm font-bold">{symbol}</p><p className="mt-2 text-xs text-muted-foreground">{description}</p></div>{index < selected.stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" /><ArrowRight className="hidden size-4 lg:block" /></div>}</div>)}
        </div>
        <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
          {[['학습 신호', selected.signal], ['샘플링', selected.sampling], ['대표 실패', selected.failure]].map(([term, value]) => <div key={term} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr]"><dt className="font-bold">{term}</dt><dd className="leading-relaxed text-muted-foreground">{value}</dd></div>)}
        </dl>
      </div>
    </div>
  );
}

export default function ImplicitRoute() {
  return (
    <section id="implicit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Likelihood를 직접 계산하지 않으면 어떤 신호로 배울까?</h2>
      <QuestionLead
        question="모델이 pθ(x)의 숫자를 내놓지 않아도 sample 분포를 실제 데이터에 맞출 수 있을까?"
        answer="GAN은 real과 fake를 비교하는 판별자를 학습해 density ratio 방향을 얻는다. Diffusion은 데이터에 넣은 noise를 정답으로 사용해 각 noise level의 복원 방향을 학습한다. 두 방식 모두 likelihood 계산을 다른 학습 문제로 우회한다."
      />
      <FamilyExplorer />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><p className="mb-2 text-xs font-bold text-muted-foreground">GAN · non-saturating generator</p><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_G=-\mathbb E_z[\log D(G_\theta(z))]`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-border p-3"><p className="mb-2 text-xs font-bold text-muted-foreground">Diffusion · noise prediction</p><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_{simple}=\mathbb E\|\epsilon-\epsilon_\theta(x_t,t)\|_2^2`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="두 식은 likelihood 계산을 우회하지만 정답 신호의 소유자가 다르다. GAN은 계속 학습되는 판별자의 score를 높이고, Diffusion은 forward 과정에서 직접 기록한 noise와 모델 예측 사이의 제곱 오차를 줄인다."
        symbols={[
          [String.raw`z`, 'generator에 넣는 random latent source'],
          [String.raw`G_\theta(z)`, 'generator가 만든 sample'],
          [String.raw`D`, 'sample이 real 쪽인지 평가하며 함께 변하는 discriminator'],
          [String.raw`x_t`, 'clean sample에 timestep t만큼 noise를 섞은 입력'],
          [String.raw`\epsilon_\theta`, 'denoiser가 예측한 noise'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          GAN의 학습 target은 다른 신경망이 계속 바꾸는 판별 경계다. Diffusion의 target noise는 forward 과정에서 직접 뽑아
          알고 있으므로 objective가 안정적이지만, 생성 시에는 그 작은 복원을 여러 번 반복해야 한다. 여기서 생성 품질,
          학습 안정성, sampling 비용 사이의 구조적 trade-off가 생긴다.
        </p>
      </div>
    </section>
  );
}
