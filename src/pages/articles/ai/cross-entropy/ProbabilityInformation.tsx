import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';

const events = [
  { label: '동전 앞면', probability: '1/2', bits: '1.00 bit', width: '15%', tone: 'bg-teal-600' },
  { label: '주사위 6', probability: '1/6', bits: '2.58 bit', width: '39%', tone: 'bg-amber-600' },
  { label: '100개 중 당첨', probability: '1/100', bits: '6.64 bit', width: '100%', tone: 'bg-rose-600' },
];

export default function ProbabilityInformation() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">확률 하나가 어떻게 학습 신호가 될까?</h2>
      <BeginnerBridge title="같은 정답이라도 얼마나 확신했는지에 따라 채점이 달라지는 퀴즈를 생각합니다.">
        두 학생이 모두 정답을 골랐지만 한 학생은 90% 확신했고 다른 학생은 51%만 확신했다고 하자. 맞음·틀림만 세면 둘은 같지만, 다음 문제에서 더 나은 확률을 내게 가르치려면 확신의 정도까지 비용으로 바꿔야 한다. Cross-entropy는 그 채점 규칙이다.
      </BeginnerBridge>
      <QuestionLead
        question="모델이 정답에 90%와 10%를 줬다는 차이를 하나의 loss로 어떻게 표현할까?"
        answer="실제로 일어난 정답에 모델이 부여한 확률을 보고, 그 사건의 정보량 -log p를 비용으로 사용한다. 확신한 정답은 작은 비용, 확신한 오답은 매우 큰 비용이 된다."
      />
      <ConceptPrimer
        items={[
          { term: '확률분포', meaning: '가능한 결과의 확률을 모두 더하면 1이 되는 값들의 묶음이다.', why: '모델 출력을 서로 비교 가능한 확신으로 해석하게 한다.' },
          { term: '로그', meaning: '곱셈을 덧셈으로 바꾸며 작은 확률의 차이를 넓혀 보여 주는 함수다.', why: '여러 샘플 likelihood의 곱을 안정적인 loss의 합으로 바꾼다.' },
          { term: '기대값', meaning: '각 결과의 값에 그 결과가 일어날 확률을 곱해 더한 장기 평균이다.', why: '사건별 정보량을 분포 전체의 평균 비용으로 바꾼다.' },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          정보량은 “이 사건을 미리 맞히려면 몇 번의 이진 질문이 필요한가”로 생각할 수 있다. 흔한 사건은 짧게 표현해도
          되지만 드문 사건은 더 긴 설명이 필요하다. 밑이 2인 로그는 bit, 자연로그는 nat 단위를 만든다. 머신러닝 loss는
          보통 자연로그를 쓰지만 밑이 달라도 최적의 모델은 바뀌지 않고 값의 배율만 달라진다.
        </p>
        <p>
          여기서 2.58 bit처럼 소수가 나오는 값은 사건 하나를 실제로 2.58번 질문한다는 뜻이 아니라 이상적인 평균 code
          length다. 여러 사건을 긴 block으로 함께 부호화하면 사건당 평균 길이가 이 값에 가까워진다.
        </p>
      </div>

      <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <span className="text-sm font-bold">확률이 작을수록 정답을 놓친 비용은 커진다</span>
          <span className="font-mono text-[10px] font-bold text-rose-700 dark:text-rose-300">−LOG₂ P</span>
        </figcaption>
        <div className="space-y-5 p-4 sm:p-6">
          {events.map((event) => (
            <div key={event.label} className="grid min-w-0 gap-2 sm:grid-cols-[9rem_minmax(0,1fr)_5rem] sm:items-center">
              <div><p className="text-sm font-semibold">{event.label}</p><p className="text-xs text-muted-foreground">p = {event.probability}</p></div>
              <div className="relative h-3 overflow-hidden rounded-sm bg-muted"><div className={`h-full ${event.tone}`} style={{ width: event.width }} /></div>
              <p className="font-mono text-xs font-bold sm:text-right">{event.bits}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-border bg-rose-500/[0.035] px-4 py-3 text-[11px] text-muted-foreground sm:px-6">
          <span>확신한 정답</span><span className="h-px bg-gradient-to-r from-teal-600 via-amber-500 to-rose-600" /><span>확신한 오답</span>
        </div>
      </figure>

      <div className="not-prose my-5 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{I(x)}_{\text{사건이 준 정보량}}=\underbrace{-\log p(x)}_{\text{희귀할수록 큰 비용}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{-\log(ab)}_{\text{함께 일어날 비용}}=\underbrace{-\log a-\log b}_{\text{각 비용을 더해 계산}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="독립 사건이 함께 일어날 확률은 곱하지만, 그 사건들의 정보량은 더해진다. 이 가법성 때문에 여러 학습 샘플의 비용을 합산하기가 쉬워진다."
        symbols={[
          [String.raw`p(x)`, '사건 x에 모델이 부여한 확률'],
          [String.raw`I(x)`, '사건 x 하나가 주는 정보량 또는 surprisal'],
          [String.raw`-\log`, '확률 1에는 0을, 확률 0에 가까울수록 큰 양의 비용을 주는 변환'],
          [String.raw`\mathbb{E}`, '여러 가능한 사건의 정보량을 확률로 가중 평균하는 연산'],
        ]}
      />
    </section>
  );
}
