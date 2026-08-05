import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, InternalLink, SourceNotes } from '@/components/learning/ArticleLearning';

const concepts = [
  { symbol: 'H(P)', title: 'Entropy', question: '실제 분포 자체가 얼마나 불확실한가?', note: 'P만으로 결정되며 모델이 바꿀 수 없는 기준선이다.' },
  { symbol: 'H(P,Q)', title: 'Cross-entropy', question: 'P에서 나온 데이터를 Q의 확률로 표현하면 비용이 얼마인가?', note: '분류 학습에서 실제로 평균 내는 negative log probability다.' },
  { symbol: 'KL(P∥Q)', title: 'KL divergence', question: 'Q를 사용해 생기는 추가 비용은 얼마인가?', note: '0 이상이지만 대칭이 아니므로 거리가 아니다.' },
];

export default function EntropyKLPractice() {
  return (
    <section id="entropy-kl-practice" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Entropy, cross-entropy, KL은 어떻게 구분할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          데이터가 따르는 실제 분포를 P, 모델 분포를 Q라고 하자. Cross-entropy는 데이터 자체의 피할 수 없는 불확실성 H(P)와
          모델이 실제 분포를 잘못 근사해서 추가된 비용 KL(P∥Q)로 분해된다. 같은 데이터셋에서는 H(P)가 고정이므로
          cross-entropy를 최소화하는 것과 KL을 최소화하는 것은 같은 최적점을 갖는다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-sm sm:text-lg">{String.raw`\underbrace{H(P,Q)}_{\text{모델이 실제로 내는 평균 비용}}=\underbrace{H(P)}_{\text{데이터의 피할 수 없는 불확실성}}+\underbrace{D_{\mathrm{KL}}(P\Vert Q)}_{\text{모델이 추가한 비용}}`}</Math></div>
      <div className="not-prose my-8 grid gap-3 lg:grid-cols-3">
        {concepts.map((concept) => (
          <div key={concept.title} className="min-w-0 rounded-md border border-border p-4">
            <p className="font-mono text-xs font-bold text-blue-600">{concept.symbol}</p>
            <p className="mt-2 text-base font-bold">{concept.title}</p>
            <p className="mt-4 text-sm font-semibold leading-relaxed">{concept.question}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{concept.note}</p>
          </div>
        ))}
      </div>
      <div className="not-prose my-5 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`H(P)=\underbrace{-\sum_c P(c)\log P(c)}_{\text{실제 분포의 평균 정보량}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`D_{\mathrm{KL}}(P\Vert Q)=\underbrace{\sum_c P(c)\log\frac{P(c)}{Q(c)}}_{\text{실제 빈도로 가중한 확률 비율}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="KL은 P에서 자주 나오는 사건에 Q가 낮은 확률을 줄 때 커진다. 방향을 바꾸면 가중치도 바뀌므로 KL(P∥Q)와 KL(Q∥P)는 일반적으로 다르다."
        symbols={[
          [String.raw`P`, '데이터를 생성한 실제 분포 또는 target 분포'],
          [String.raw`Q`, '모델이 예측한 분포'],
          [String.raw`H(P)`, '데이터에 내재된 불확실성'],
          [String.raw`D_{\mathrm{KL}}(P\Vert Q)`, 'P를 Q로 근사해 추가로 지불하는 평균 정보 비용'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>One-hot이 아니면 피할 수 없는 loss 바닥이 생긴다</h3>
        <p>
          한 샘플의 one-hot target은 한 class만 확률 1이므로 entropy가 0이다. 그러나 label smoothing, 지식 증류, 여러
          annotator의 vote처럼 target 자체가 분포이면 <Math>{String.raw`H(P)>0`}</Math>이다. 이때 완벽한 모델
          <Math>{String.raw`Q=P`}</Math>도 cross-entropy를 0으로 만들 수 없고, 최솟값은 target entropy
          <Math>{String.raw`H(P)`}</Math>다.
        </p>
      </div>
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`P_\varepsilon=\underbrace{(1-\varepsilon)y}_{\text{정답 class의 주 질량}}+\underbrace{\frac{\varepsilon}{C}\mathbf{1}}_{\text{모든 class에 나눈 완화 질량}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\min_Q H(P,Q)=\underbrace{H(P)}_{\text{soft target이 가진 loss 바닥}}\quad\text{at}\quad Q=P`}</Math></div>
      </div>
      <FormulaNote
        meaning="Label smoothing은 정답 class의 질량 일부를 모든 class에 나눠 target을 one-hot이 아닌 분포로 만든다. 그래서 모델이 target을 정확히 맞춰도 target 자체의 entropy H(P)는 남으며 cross-entropy의 최솟값이 0이 아니다."
        symbols={[
          [String.raw`\varepsilon`, '정답 질량 중 전체 class로 나눌 smoothing 비율'],
          [String.raw`C`, 'class 개수로, ε/C가 각 class에 더해진다'],
          [String.raw`\mathbf 1`, '모든 class 위치가 1인 vector'],
          [String.raw`Q=P`, '모델 분포가 soft target 분포와 일치한 최적점'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>LLM에서는 같은 값이 perplexity로 다시 보인다</h3>
        <p>
          언어 모델은 다음 token의 평균 negative log-likelihood를 cross-entropy로 보고, 그 지수값을 perplexity로 보고한다.
          평균 loss가 0.1 nat 줄면 perplexity는 단순히 0.1만 줄지 않고 <Math>{String.raw`e^{-0.1}\approx0.905`}</Math>배가
          된다. 즉 약 9.5% 감소한다. Tokenizer와 평가 corpus가 다르면 같은 perplexity 숫자를 직접 비교하면 안 된다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-violet-500/40 bg-violet-500/[0.055] p-3"><Math display className="my-0 text-sm sm:text-lg">{String.raw`\underbrace{\mathrm{PPL}}_{\text{평균 분기 수의 해석}}=\underbrace{\exp\!\left(\frac{1}{T}\sum_{t=1}^{T}-\log p(x_t\mid x_{<t})\right)}_{\text{token 평균 NLL을 지수로 되돌림}}`}</Math></div>
      <FormulaNote
        meaning="Token별 확률은 곱해지면 너무 작아지므로 negative log를 더해 평균낸다. Perplexity는 exp로 log 단위를 되돌려 모델이 매 위치에서 평균적으로 몇 개 선택지 사이에서 헷갈리는지에 가까운 scale로 읽는다. Tokenizer와 corpus가 달라지면 T와 token 사건 자체가 달라져 직접 비교할 수 없다."
        symbols={[
          [String.raw`T`, '평가 sequence의 token 수'],
          [String.raw`p(x_t\mid x_{<t})`, '이전 token prefix에서 실제 다음 token에 준 확률'],
          [String.raw`\frac1T\sum_t-\log p`, 'token당 평균 negative log-likelihood'],
          [String.raw`\exp`, 'log 단위의 평균 비용을 원래 multiplicative scale로 되돌리는 연산'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>KL의 방향은 바꾸면 질문도 바뀐다</h3>
        <p>
          <Math>{String.raw`D_{KL}(P\Vert Q)`}</Math>는 실제 분포 P가 자주 내는데 Q가 놓친 사건을 크게 벌준다. 반대로
          <Math>{String.raw`D_{KL}(Q\Vert P)`}</Math>는 Q가 질량을 둔 곳에서 P가 작은 경우를 크게 벌준다. 그래서 두 방향은
          같은 최적점을 가질 수 있어도 유한한 모델과 제한된 표현에서는 서로 다른 근사 행동을 만든다. 정보량과 기대값의
          기초가 더 필요하면 <InternalLink slug="probability-information-theory">확률·정보이론 글</InternalLink>에서 내려가고,
          posterior와 prior 사이 KL은 <InternalLink slug="vae">VAE 글</InternalLink>에서 이어서 본다.
        </p>
      </div>

      <CapabilityCheck
        items={[
          '정답 확률 0.9와 0.1의 cross-entropy를 계산하고 차이를 설명할 수 있다.',
          'maximum likelihood가 negative log-likelihood 최소화로 바뀌는 과정을 설명할 수 있다.',
          'softmax cross-entropy의 logit gradient p-y가 각 class를 어느 방향으로 움직이는지 말할 수 있다.',
          '코드에서 raw logits를 fused cross-entropy에 전달해야 하는 이유를 설명할 수 있다.',
          'entropy, cross-entropy, KL divergence를 서로 다른 질문으로 구분할 수 있다.',
          '확률 공간의 -1/p와 실제 logit gradient p-y를 구분하고 CE가 포화되지 않는 이유를 설명할 수 있다.',
          'soft target의 cross-entropy 최솟값과 token 평균 NLL에서 perplexity 변화를 계산할 수 있다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'PyTorch · CrossEntropyLoss', href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html', note: 'logits 입력, class target, reduction과 label smoothing의 공식 계약' },
          { label: 'The Elements of Information Theory', href: 'https://web.stanford.edu/class/ee376a/files/cover-and-chapters.pdf', note: 'entropy, relative entropy, mutual information의 표준적 정의' },
          { label: 'Deep Learning · Information Theory', href: 'https://www.deeplearningbook.org/contents/prob.html', note: '머신러닝 관점의 cross-entropy와 KL divergence' },
        ]}
      />
    </section>
  );
}
