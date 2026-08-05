import { ArrowDown, ArrowRight } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';

const ledgerStages = [
  { number: '01', title: '입력 고정', value: 'x=[1,2], y=1', note: '한 sample을 끝까지 유지' },
  { number: '02', title: '순전파', value: 'z → p', note: '현재 parameter의 예측' },
  { number: '03', title: '손실', value: 'L=0.644397', note: '정답 확률의 비용' },
  { number: '04', title: '역전파', value: 'δ → ∇w, ∇b', note: 'parameter별 책임' },
  { number: '05', title: '업데이트', value: 'θ → θ′', note: '새 parameter snapshot' },
  { number: '06', title: '재검산', value: 'L′=0.519057', note: '새 위치에서 다시 forward' },
];

export default function TrainingContract() {
  return (
    <section id="contract" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">흩어진 공식을 한 번의 학습으로 어떻게 묶을까?</h2>
      <BeginnerBridge title="재료가 계산대를 지날 때 같은 영수증 번호로 모든 변화를 기록한다고 생각합니다.">
        지금까지는 뉴런, 확률, 손실, 역전파와 optimizer를 따로 보았다. 실제 학습에서는 한 입력이 만든 예측과 손실, 그 손실이 만든 gradient, 새 parameter가 한 줄의 원장처럼 이어진다. 여기서는 예제를 바꾸지 않고 같은 숫자를 끝까지 추적한다.
      </BeginnerBridge>
      <QuestionLead
        question="퍼셉트론, sigmoid, cross-entropy, 역전파와 SGD를 각각 이해했는데도 왜 학습 코드 한 줄씩의 역할은 흐릿할까?"
        answer="각 글의 예제가 달라 값의 계보가 끊겼기 때문이다. 여기서는 한 sample과 한 parameter snapshot을 고정하고, 만들어진 숫자를 다음 단계가 그대로 받는 원장으로 학습 한 바퀴를 닫는다."
      />
      <ConceptPrimer
        items={[
          { term: 'parameter snapshot', meaning: '한 시점의 weight와 bias를 함께 보관한 상태다.', why: '어느 parameter로 예측하고 gradient를 계산했는지 섞이지 않게 한다.' },
          { term: 'logit', meaning: '확률로 변환하기 전의 제한 없는 실수 score다.', why: '분류 loss가 수치적으로 안정된 형태로 직접 받을 계산 신호다.' },
          { term: 'training step', meaning: '한 batch에서 forward, loss, backward, update를 한 번 수행하는 단위다.', why: 'epoch보다 작은 실제 parameter state transition을 추적한다.' },
        ]}
      />

      <div className="not-prose my-7 min-w-0 rounded-md border border-blue-500/40 bg-blue-500/[0.045] p-4">
        <Math display className="my-0 text-xs sm:text-base">
          {String.raw`\begin{gathered}
            \underbrace{x=[1,2],\ y=1}_{\text{이번 sample}}\\[4pt]
            \underbrace{w=[0.2,-0.1],\ b=0.1}_{\text{update 전 parameter}}
          \end{gathered}`}
        </Math>
      </div>
      <FormulaNote
        meaning="입력 x와 target y는 이번 원장의 관측값이다. w와 b는 이 sample을 보기 전의 모델 상태다. Gradient를 계산하는 동안 이 snapshot을 바꾸지 않고, optimizer 단계에서만 새 snapshot을 만든다."
        symbols={[
          [String.raw`x`, '모델이 읽는 두 feature'],
          [String.raw`y`, '이번 binary sample의 정답 label'],
          [String.raw`w`, '각 feature의 기여도를 조절하는 weight vector'],
          [String.raw`b`, '입력이 0이어도 남는 결정 기준인 bias'],
        ]}
      />

      <figure
        data-foundation-viz="true"
        data-viz-kind="flow"
        data-viz-has-caption="true"
        data-viz-sequence="00"
        data-viz-title="한 Training Step의 값 계보"
        className="not-prose my-8 overflow-hidden rounded-md border border-border"
      >
        <figcaption className="flex min-w-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <span className="min-w-0 text-sm font-bold">같은 값이 다음 단계의 입력이 되는 원장</span>
          <span className="shrink-0 font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300">1 SAMPLE · 1 STEP</span>
        </figcaption>
        <ol className="grid min-w-0 lg:grid-cols-[repeat(11,minmax(0,auto))] lg:items-stretch">
          {ledgerStages.map((stage, index) => (
            <li key={stage.number} className="contents">
              <div className="min-w-0 border-b border-border px-4 py-4 last:border-b-0 lg:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">{stage.number}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm font-bold">{stage.title}</p>
                <p className="mt-2 break-words font-mono text-xs font-semibold">{stage.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.note}</p>
              </div>
              {index < ledgerStages.length - 1 && (
                <div className="flex h-6 items-center justify-center border-b border-border text-muted-foreground lg:h-auto lg:w-5 lg:border-b-0" aria-hidden="true">
                  <ArrowDown className="h-4 w-4 lg:hidden" />
                  <ArrowRight className="hidden h-4 w-4 lg:block" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </figure>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 예제는 다층 신경망 전체가 아니라 가장 작은 binary logistic unit이다. 그러나 학습 루프의 계약은 완전하다.
          다층 신경망은 같은 local 계산을 tensor와 여러 layer로 확장하고, 역전파가 각 layer의 책임을 차례로 연결한다.
        </p>
      </div>
    </section>
  );
}
