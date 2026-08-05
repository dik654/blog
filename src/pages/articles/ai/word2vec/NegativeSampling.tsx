import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { InternalLink, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const pairs = [
  { pair: '커피를 · 따뜻한', label: '1 · positive', score: '2.0', probability: '0.881', gradient: '-0.119', action: 'score 올리기' },
  { pair: '커피를 · 자동차', label: '0 · negative', score: '1.2', probability: '0.769', gradient: '+0.769', action: 'score 내리기' },
  { pair: '커피를 · 해왕성', label: '0 · negative', score: '-0.7', probability: '0.332', gradient: '+0.332', action: '약하게 내리기' },
];

export default function NegativeSampling() {
  return (
    <section id="negative-sampling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">어휘 전체를 보지 않고 어떻게 embedding을 학습할까?</h2>
      <QuestionLead
        question="positive context 하나만 알면 모든 다른 단어를 오답으로 비교해야 하지 않을까?"
        answer="각 positive pair마다 noise distribution에서 k개 negative 단어만 뽑아 실제 pair인지 이진 분류한다. 한 update가 건드리는 output vector가 V개에서 k+1개로 줄어든다."
      />
      <div data-formula-pair>
        <div className="not-prose my-6 space-y-2">
          <div className="min-w-0 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\mathcal{L}_{+}}_{\text{실제 문맥쌍의 비용}}=-\log\sigma\!\left(\underbrace{u_O^\top v_I}_{\text{실제 pair score는 올리기}}\right)`}</Math></div>
          <div className="min-w-0 rounded-md border border-rose-500/40 bg-rose-500/5 p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\mathcal{L}_{-}}_{\text{noise pair들의 비용}}=-\sum_{i=1}^{k}\log\sigma\!\left(\underbrace{-u_i^\top v_I}_{\text{noise pair score는 낮추기}}\right)`}</Math></div>
          <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{\frac{\partial\mathcal{L}}{\partial s}}_{\text{score가 받을 gradient}}=\underbrace{\sigma(s)}_{\text{현재 pair 확률}}-\underbrace{y}_{\text{실제 label}}`}</Math></div>
        </div>
        <FormulaNote
          meaning="pair score s를 sigmoid 확률로 바꾸면 gradient는 cross-entropy에서 본 prediction-target 형태다. Positive는 score를 올리고 sampled negative는 score를 내리는 신호를 받는다."
          symbols={[
            [String.raw`u_O,v_I`, '실제 context와 중심 단어의 output/input vector'],
            [String.raw`u_i`, 'noise distribution에서 뽑은 negative output vector'],
            [String.raw`k`, 'positive 하나당 sampling한 negative 수'],
            [String.raw`y\in\{0,1\}`, '실제 pair면 1, noise pair면 0인 binary label'],
          ]}
        />
      </div>
      <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <figcaption className="flex items-center border-b border-border bg-muted/20 px-4 py-3 text-sm font-bold">
          한 중심 단어 update의 pair별 신호
        </figcaption>
        <div className="hidden border-b border-border bg-muted/10 px-4 py-2 lg:grid lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(4rem,0.7fr))_minmax(0,0.9fr)] lg:gap-3">
          <span className="text-[10px] font-bold text-muted-foreground">word-context pair</span>
          <span className="font-mono text-[10px] font-bold text-muted-foreground">score</span>
          <span className="font-mono text-[10px] font-bold text-muted-foreground">σ(s)</span>
          <span className="font-mono text-[10px] font-bold text-muted-foreground">σ(s)-y</span>
          <span className="text-[10px] font-bold text-muted-foreground">update</span>
        </div>
        {pairs.map((row) => (
          <div key={row.pair} className="grid min-w-0 gap-3 border-b border-border p-4 last:border-0 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(4rem,0.7fr))_minmax(0,0.9fr)] lg:items-center">
            <div><p className="text-sm font-bold">{row.pair}</p><p className="mt-1 text-xs text-muted-foreground">{row.label}</p></div>
            <dl className="grid grid-cols-3 gap-2 lg:contents">
              <div><dt className="text-[10px] text-muted-foreground lg:hidden">score</dt><dd className="font-mono text-xs">{row.score}</dd></div>
              <div><dt className="text-[10px] text-muted-foreground lg:hidden">σ(s)</dt><dd className="font-mono text-xs">{row.probability}</dd></div>
              <div><dt className="text-[10px] text-muted-foreground lg:hidden">σ(s)-y</dt><dd className="font-mono text-xs font-bold">{row.gradient}</dd></div>
            </dl>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{row.action}</p>
          </div>
        ))}
        <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">이미 score가 낮은 negative는 <Math>{String.raw`\sigma(s)`}</Math>가 작아 gradient도 작다. 학습 신호는 현재 모델이 실제 문맥처럼 헷갈리는 hard negative에 더 크게 집중된다.</p>
      </figure>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Negative는 어떻게 뽑을까?</h3>
        <p>
          원 구현은 unigram frequency의 3/4 거듭제곱에 비례하는 분포를 사용해 매우 흔한 단어의 지배력을 누그러뜨리면서도
          실제 corpus 빈도를 반영한다. 고빈도 token subsampling과 dynamic context window도 생성되는 pair 분포를 바꾼다.
          이 설정들은 단순한 속도 옵션이 아니라 embedding geometry에 영향을 주는 데이터 설계다.
        </p>
      </div>
      <div data-formula-pair className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="border-b border-border bg-muted/20 px-4 py-3">
          <p className="text-sm font-bold">반복된 update가 결국 맞추는 통계량</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Gradient 한 번의 방향에서 corpus 전체의 word-context geometry로 올라간다.</p>
        </div>
        <div className="grid min-w-0 gap-3 p-4 sm:p-5 lg:grid-cols-2">
          <div className="min-w-0 rounded-md border border-border p-4">
            <p className="text-xs font-bold text-violet-700 dark:text-violet-300">우연보다 얼마나 자주 함께 나오는가</p>
            <Math display className="my-4 text-xs sm:text-sm">{String.raw`\underbrace{\operatorname{PMI}(w,c)}_{\text{우연 대비 동시 등장 정보}}=\log\frac{\underbrace{P(w,c)}_{\text{함께 등장}}}{\underbrace{P(w)P(c)}_{\text{독립이면 기대되는 빈도}}}`}</Math>
            <p className="text-xs leading-relaxed text-muted-foreground">함께 등장할 확률이 독립 가정보다 열 배 크면 자연로그 기준 PMI는 <Math>{String.raw`\log 10\approx2.303`}</Math>이다.</p>
          </div>
          <div className="min-w-0 rounded-md border border-border p-4">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">기대 gradient가 0인 균형점</p>
            <Math display className="my-4 text-xs sm:text-sm">{String.raw`\underbrace{\sigma(s^*)}_{\text{최적 pair 확률}}=\frac{\underbrace{P(w,c)}_{\text{positive 빈도}}}{P(w,c)+\underbrace{kP(w)P_n(c)}_{\text{기대 noise 빈도}}}`}</Math>
            <p className="text-xs leading-relaxed text-muted-foreground">같은 pair가 positive로 오는 횟수와 noise로 오는 횟수의 가중 gradient가 서로 상쇄되는 지점이다.</p>
          </div>
          <div className="min-w-0 rounded-md border border-border p-4 lg:col-span-2">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">균형 확률을 logit으로 되돌린 score</p>
            <Math display className="my-4 text-xs sm:text-sm">{String.raw`\underbrace{s^*=u_c^\top v_w}_{\text{sigmoid를 역으로 푼 score}}=\log\frac{P(w,c)}{kP(w)P_n(c)}`}</Math>
            <Math display className="my-4 text-xs sm:text-sm">{String.raw`P_n(c)=P(c)\quad\Longrightarrow\quad\underbrace{s^*=\operatorname{PMI}(w,c)-\log k}_{\text{shifted PMI}}`}</Math>
            <p className="text-xs leading-relaxed text-muted-foreground">PMI 2.303, <Math>{String.raw`k=5`}</Math>이면 목표 score는 약 <Math>{String.raw`2.303-1.609=0.694`}</Math>다.</p>
          </div>
        </div>
        <FormulaNote
          meaning="왜 PMI부터 시작하나: positive pair가 독립 빈도보다 얼마나 자주 함께 나오는지를 log-ratio로 고정하기 위해서다. 왜 균형 확률을 구하나: 같은 pair가 실제 문맥과 noise에서 주는 기대 gradient가 0이 되는 score를 찾기 위해서다. 그 확률에 logit을 취하면 dot-product score가 나오고, noise가 unigram이면 PMI에서 log k를 뺀 shifted-PMI가 된다."
          symbols={[
            [String.raw`\operatorname{PMI}(w,c)`, 'word w와 context c의 독립 가정 대비 동시 등장 정보'],
            [String.raw`P_n(c)`, 'negative context를 뽑는 noise distribution'],
            [String.raw`k`, 'positive pair 하나당 negative sample 수'],
            [String.raw`s^*=u_c^\top v_w`, '기대 positive·negative gradient가 균형을 이루는 pair score'],
          ]}
        />
        <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">
          이 단순한 shifted-PMI 식은 negative를 empirical unigram에서 뽑는 해석이다. 실제 Word2Vec의 <Math>{String.raw`P_n(c)\propto P(c)^{3/4}`}</Math>를
          쓰면 <Math>{String.raw`P(c)`}</Math> 대신 noise 분포 <Math>{String.raw`P_n(c)`}</Math>가 들어간다. 낮은 차원의 두 행렬은 거대한
          word-context 표를 모든 칸에서 정확히 외우는 것이 아니라 중요한 패턴을 압축해 근사한다.
        </p>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          PMI의 log-ratio가 낯설면 <InternalLink slug="probability-information-theory">확률과 정보 이론</InternalLink>에서 내려가고,
          두 얇은 행렬로 큰 word-context 표를 근사한다는 뜻은 <InternalLink slug="linear-algebra-decompositions">부분공간과 행렬 분해</InternalLink>에서
          확인한다. <Math>{String.raw`\sigma(s)-y`}</Math>의 유도는 <InternalLink slug="cross-entropy">크로스 엔트로피</InternalLink>가 소유한다.
        </p>
      </div>
      <Misconception>
        negative sampling은 full-softmax 확률을 매 step 정확히 근사해 계산하는 방식이 아니다. 어휘 정규화 likelihood 대신 sampled binary classification objective를 최적화하며, 그 결과가 유용한 embedding을 만든다.
      </Misconception>
    </section>
  );
}
