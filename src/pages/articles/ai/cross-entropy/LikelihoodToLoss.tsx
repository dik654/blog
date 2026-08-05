import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const steps = [
  { index: '01', title: '데이터를 고정한다', body: '관측한 입력 x와 정답 y는 이미 주어져 있다.' },
  { index: '02', title: '모델이 확률을 낸다', body: '파라미터 θ가 정답마다 pθ(y|x)를 만든다.' },
  { index: '03', title: '정답들의 likelihood를 곱한다', body: '모든 정답을 동시에 잘 설명하는 θ를 찾는다.' },
  { index: '04', title: '-log로 최소화 문제로 바꾼다', body: '곱은 합이 되고, 최대화는 최소화가 된다.' },
];

export default function LikelihoodToLoss() {
  return (
    <section id="likelihood-to-loss" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Likelihood를 최대화하면 왜 cross-entropy가 나올까?</h2>
      <QuestionLead
        question="정답 확률을 높이고 싶다는 말이 loss 최소화와 정확히 어떻게 연결될까?"
        answer="독립인 학습 샘플들의 정답 확률을 모두 곱한 likelihood를 최대화한다. 여기에 -log를 취하면 샘플별 negative log-likelihood의 합이 되고, one-hot 분류에서는 바로 cross-entropy가 된다."
      />
      <div className="not-prose my-8 grid items-stretch gap-2 lg:grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)_1.25rem_minmax(0,1fr)_1.25rem_minmax(0,1fr)]">
        {steps.map((step, index) => (
          <div key={step.index} className="contents">
            <div className="min-w-0 rounded-md border border-border border-l-[3px] border-l-blue-600 bg-background p-4">
              <p className="font-mono text-xs font-bold text-blue-600">{step.index}</p>
              <p className="mt-3 text-sm font-bold">{step.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center text-muted-foreground">
                <ArrowDown className="size-4 lg:hidden" aria-hidden="true" />
                <ArrowRight className="hidden size-4 lg:block" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\mathcal{J}(\theta)}_{\text{전체 정답 설명력}}=\underbrace{\prod_{n=1}^{N}p_\theta(y_n\mid x_n)}_{\text{샘플별 정답 확률을 곱함}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\theta^*=\arg\min_\theta\underbrace{\left[-\sum_{n=1}^{N}\log p_\theta(y_n\mid x_n)\right]}_{\text{곱을 합으로 바꾼 학습 비용}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\ell_n=\underbrace{-\sum_{c=1}^{C}y_{n,c}\log \hat p_{n,c}}_{\text{정답 분포와 예측 분포 비교}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\ell_n=\underbrace{-\log \hat p_{n,y_n}}_{\text{one-hot이면 정답 위치만 남음}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="one-hot 정답 y에서는 실제 class 위치만 1이고 나머지는 0이다. 합을 전부 계산해도 결국 정답 class에 준 확률 하나의 negative log만 남는다."
        symbols={[
          [String.raw`\theta`, '학습으로 바꾸는 모델 파라미터 전체'],
          [String.raw`N`, '학습 샘플 수'],
          [String.raw`C`, 'class 수'],
          [String.raw`\hat p`, 'softmax가 만든 예측 확률분포'],
          [String.raw`y`, '정답 class를 표시한 one-hot 분포'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>확률과 likelihood는 같은 숫자지만 질문이 다르다</h3>
        <p>
          확률은 파라미터를 고정하고 “어떤 데이터가 나올까”를 묻는다. Likelihood는 관측 데이터를 고정하고 “어떤 파라미터가
          이 데이터를 잘 설명할까”를 묻는다. 학습은 두 번째 질문이다. 미니배치에서는 합 또는 평균을 쓰며, 평균은 batch
          크기가 달라도 gradient 규모를 비교하기 쉽게 만든다.
        </p>
      </div>
      <Misconception>
        확률분포 식만 보면 one-hot label에서 정답 class의 <Math>{String.raw`-\log p_y`}</Math> 하나만 남는다. 그렇다고 오답
        logit이 계산에서 사라지는 것은 아니다. <Math>{String.raw`p_y`}</Math>의 softmax 분모에 모든 logit이 들어가므로 정답
        logit을 올리고 오답 logit을 내리는 경쟁이 함께 일어난다. 다음 절의 <Math>{String.raw`p-y`}</Math>가 그 책임을 class별로 보여 준다.
      </Misconception>
    </section>
  );
}
