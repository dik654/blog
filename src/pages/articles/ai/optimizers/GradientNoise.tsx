import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const variants = [
  { title: 'Full batch', sample: 'N개 전체', compute: 'step당 큼', noise: '낮음', use: '작은 데이터·정확한 곡률 분석' },
  { title: 'Single sample', sample: '1개', compute: 'step당 작음', noise: '매우 높음', use: '온라인 학습·이론적 SGD' },
  { title: 'Mini-batch', sample: 'B개', compute: 'GPU 병렬화', noise: '조절 가능', use: '현대 딥러닝의 기본 단위' },
];

export default function GradientNoise() {
  return (
    <section id="batch-variants" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Mini-batch gradient는 왜 매번 흔들릴까?</h2>
      <QuestionLead
        question="전체 데이터의 정확한 gradient 대신 일부 샘플의 부정확한 gradient를 쓰는 이유는 무엇일까?"
        answer="계산과 메모리를 줄이고 GPU가 처리하기 좋은 묶음으로 만들기 위해서다. 잘 섞인 mini-batch gradient는 전체 gradient의 확률적 추정치이며, 적당한 noise는 날카로운 방향에 고착되는 것을 완화하기도 한다."
      />
      <div className="not-prose my-8 grid gap-3 lg:grid-cols-3">
        {variants.map((variant) => (
          <div key={variant.title} className="min-w-0 rounded-md border border-border p-4">
            <p className="text-base font-bold">{variant.title}</p>
            <dl className="mt-4 grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs">
              <dt className="text-muted-foreground">샘플</dt><dd className="font-semibold">{variant.sample}</dd>
              <dt className="text-muted-foreground">계산</dt><dd className="font-semibold">{variant.compute}</dd>
              <dt className="text-muted-foreground">noise</dt><dd className="font-semibold">{variant.noise}</dd>
              <dt className="text-muted-foreground">용도</dt><dd className="font-semibold leading-relaxed">{variant.use}</dd>
            </dl>
          </div>
        ))}
      </div>
      <div className="not-prose my-6 space-y-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{g_t}_{\text{배치 추정치}}=\frac{1}{B}\sum_{i\in\mathcal{B}_t}\underbrace{\nabla_\theta \ell_i(\theta_t)}_{\text{샘플별 기울기}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\mathbb{E}_{\mathcal{B}}[g_t]}_{\text{여러 배치의 평균}}=\underbrace{\nabla_\theta L(\theta_t)}_{\text{전체 데이터 기울기}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="mini-batch를 데이터에서 편향 없이 뽑으면 여러 batch에 걸친 gradient의 평균은 전체 gradient와 같다. 한 step의 흔들림은 오류가 아니라 estimator의 variance다."
        symbols={[
          [String.raw`B`, 'mini-batch에 들어간 샘플 수'],
          [String.raw`\mathcal{B}_t`, 'step t에서 뽑힌 샘플 index 집합'],
          [String.raw`\ell_i`, '샘플 i 하나의 loss'],
          [String.raw`\mathbb{E}`, 'batch를 여러 번 다시 뽑았을 때의 평균'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Batch size를 키우면 함께 바뀌는 것</h3>
        <p>
          큰 batch는 gradient variance를 줄이고 장치를 더 채우지만, epoch당 update 횟수가 줄며 메모리를 더 쓴다. Gradient
          accumulation은 작은 micro-batch 여러 개의 gradient를 더한 뒤 한 번 step해 큰 effective batch를 흉내 낸다.
          이는 계산 그래프의 여러 분기에서 한 변수로 돌아오는 gradient를 더하는 동명의 규칙과 다르다. 여기서는 여러 forward/backward 실행 사이에 parameter gradient buffer를 누적하는 훈련 기법을 뜻한다.
          Batch size를 바꾸면 learning rate와 scheduler의 step 기준도 함께 재검증해야 한다.
        </p>
      </div>
      <Misconception>
        “batch가 클수록 항상 정확하다”는 규칙은 없다. 처리량, update 횟수, gradient noise, normalization 방식이 동시에 바뀌므로 같은 epoch 수만 비교해서는 optimizer 차이를 분리할 수 없다.
      </Misconception>
    </section>
  );
}
