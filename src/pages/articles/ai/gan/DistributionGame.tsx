import { ArrowDown, ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { ConceptPrimer, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const stages = [
  { symbol: 'z ~ p(z)', label: 'Random source', note: '단순한 prior에서 noise를 뽑는다.' },
  { symbol: 'x̃ = Gθ(z)', label: 'Generator', note: 'Noise를 data space의 sample로 바꾼다.' },
  { symbol: 'Dψ(x)', label: 'Discriminator', note: 'Real일 확률을 0~1 점수로 낸다.' },
];

export default function DistributionGame() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Likelihood 없이 sample을 비교해 분포를 배운다</h2>
      <QuestionLead
        question="pθ(x)를 계산하지 못하는 generator에 어떤 방향의 gradient를 줄 수 있을까?"
        answer="Real sample과 generated sample을 구별하는 discriminator를 함께 학습한다. Discriminator가 fake라고 판단한 근거를 generator 입력까지 미분하면, generated distribution을 real distribution 쪽으로 옮기는 학습 신호가 된다."
      />
      <ConceptPrimer
        items={[
          { term: 'implicit distribution', meaning: 'Sample은 만들 수 있지만 주어진 x의 density pθ(x)를 직접 계산하기 어려운 분포다.', why: 'GAN이 likelihood 대신 discriminator를 사용하는 이유를 설명한다.' },
          { term: 'generator Gθ', meaning: '단순한 noise z를 data space의 sample x̃로 바꾸는 함수다.', why: '학습 후에는 이 한 번의 forward가 sampling 경로가 된다.' },
          { term: 'discriminator Dψ', meaning: '입력이 real data에서 왔을 확률을 추정하는 binary classifier다.', why: 'Real과 fake의 density ratio에 관한 학습 신호를 만든다.' },
          { term: 'adversarial game', meaning: '서로 다른 목적을 가진 두 모델의 파라미터를 번갈아 최적화하는 문제다.', why: '일반적인 고정 loss 최적화와 다른 불안정성의 근원이다.' },
        ]}
      />
      <figure className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
        <figcaption className="mb-5 text-sm font-bold">Generated sample이 받는 gradient 경로</figcaption>
        <div className="grid items-center gap-3 lg:grid-cols-[1fr_2rem_1fr_2rem_1fr]">
          {stages.map((stage, index) => <div key={stage.label} className="contents"><div className={`min-w-0 rounded-md border p-4 text-center ${index === 1 ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}><p className="break-words font-mono text-sm font-bold">{stage.symbol}</p><p className="mt-2 text-sm font-semibold">{stage.label}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.note}</p></div>{index < stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>)}
        </div>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">G를 업데이트할 때 D의 weight는 고정하지만, D의 연산 그래프를 지나 G까지 이어지는 input gradient는 유지한다. “D를 고정한다”와 “D를 detach한다”는 같은 말이 아니다.</p>
      </figure>
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3">
          <p className="mb-2 text-xs font-bold text-muted-foreground">Discriminator objective · minimization form</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathcal L_D^{real}=-\mathbb E_x\log D_\psi(x)`}</MathFormula>
            <MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathcal L_D^{fake}=-\mathbb E_z\log(1-D_\psi(G_\theta(z)))`}</MathFormula>
          </div>
          <MathFormula display className="my-2 text-xs sm:text-base">{String.raw`\mathcal L_D=\mathcal L_D^{real}+\mathcal L_D^{fake}`}</MathFormula>
        </div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><p className="mb-2 text-xs font-bold text-muted-foreground">실무에서 먼저 쓰는 non-saturating generator objective</p><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\min_\theta\;-\mathbb E_{z\sim p(z)}\log D_\psi(G_\theta(z))`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="원래 GAN은 D가 최대화하고 G가 최소화하는 minimax game으로 정의된다. 위 G 식은 원 논문도 학습 초기에 더 강한 gradient를 얻기 위해 제안한 non-saturating 대체식이다. log는 확신에 찬 오답을 크게 벌점화한다. 두 업데이트는 같은 batch에서 동시에 한 backward로 처리하는 것이 아니라 목적과 gradient 경계를 나눠 수행한다."
        symbols={[
          ['θ', 'generator 파라미터'],
          ['ψ', 'discriminator 파라미터'],
          ['x', 'real data sample'],
          ['z', 'generator의 random source'],
        ]}
      />
      <Misconception>
        GAN이 real sample을 복사해 저장하는 것이 목표는 아니다. Discriminator가 구별할 수 없는 distribution을 만드는 것이 목표지만, 유한한 모델과 불안정한 학습에서는 일부 mode만 재현하는 해법에 머물 수 있다.
      </Misconception>
    </section>
  );
}
