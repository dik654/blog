import { ArrowDown, ArrowRight } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';

const inputs = [
  { name: 'x₁', value: '0.7', weight: 'w₁ = 0.8', contribution: '+0.56', width: '100%', tone: 'bg-teal-600' },
  { name: 'x₂', value: '0.2', weight: 'w₂ = -0.5', contribution: '-0.10', width: '18%', tone: 'bg-rose-600' },
  { name: 'bias', value: '1', weight: 'b = -0.3', contribution: '-0.30', width: '54%', tone: 'bg-amber-600' },
];

function WeightedSumViz() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm font-semibold sm:px-5">
        <span>입력의 기여를 더해 결정 하나를 만든다</span>
        <span className="font-mono text-[10px] text-amber-700 dark:text-amber-300">DOT PRODUCT + BIAS</span>
      </figcaption>
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {inputs.map((input) => (
          <div key={input.name} className="min-w-0 bg-background p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-sm font-bold">{input.name} = {input.value}</p>
              <p className="font-mono text-xs text-muted-foreground">{input.weight}</p>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${input.tone}`} style={{ width: input.width }} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>score 기여</span>
              <strong className="font-mono text-sm text-foreground">{input.contribution}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="grid items-stretch border-t border-border bg-muted/[0.12] p-4 sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,0.72fr)] sm:p-5">
        <div className="border-l-2 border-amber-600 bg-amber-500/[0.035] p-4 text-center">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">01 · SCORE</p>
          <p className="mt-1 font-mono text-base font-bold sm:text-lg">0.56 - 0.10 - 0.30 = 0.16</p>
        </div>
        <div className="flex h-8 items-center justify-center text-muted-foreground sm:h-auto" aria-hidden="true">
          <ArrowDown className="h-4 w-4 sm:hidden" />
          <ArrowRight className="hidden h-4 w-4 sm:block" />
        </div>
        <div className="border-l-2 border-emerald-600 bg-emerald-500/[0.035] p-4 text-center">
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">02 · DECISION</p>
          <p className="mt-1 font-mono text-base font-bold sm:text-lg">0.16 ≥ 0 → 1</p>
        </div>
      </div>
    </figure>
  );
}

export default function PerceptronCore() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">퍼셉트론 하나는 어떤 결정을 만들까?</h2>
      <BeginnerBridge title="여러 판단 근거에 점수를 매겨 마지막에 예·아니오를 고르는 장면부터 시작합니다.">
        대출 심사에서 소득은 승인 쪽 점수를 높이고, 연체 기록은 점수를 낮춘다고 생각해 보자. 각 근거가 준 점수를 모두 더한 뒤 기준선을 넘으면 승인, 넘지 못하면 거절한다. 퍼셉트론은 이 익숙한 결정을 숫자로 적은 가장 작은 학습 모델이다.
      </BeginnerBridge>
      <QuestionLead
        question="입력 여러 개를 어떻게 0 또는 1이라는 결정 하나로 바꿀까?"
        answer="각 입력의 중요도와 방향을 weight로 표현하고, 모든 기여와 bias를 더한 score가 기준 0을 넘는지 확인한다. 퍼셉트론은 가장 작은 선형 이진 분류기다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          입력 x의 각 원소는 관측한 특징이고, weight w는 그 특징이 양성 결정에 얼마나 기여하는지를 나타낸다. 양수 weight는
          입력이 커질수록 score를 높이고 음수 weight는 score를 낮춘다. Bias b는 입력이 모두 0이어도 남는 기준값으로,
          결정 경계의 위치를 옮긴다.
        </p>
      </div>

      <WeightedSumViz />
      <div data-formula-pair>
        <Math display>{String.raw`
\underbrace{s}_{\text{결정 전 점수}}
=
\underbrace{w^\top x}_{\text{입력별 기여의 합}}
+
\underbrace{b}_{\text{경계 위치 이동}}
`}</Math>
        <Math display>{String.raw`
\underbrace{\hat{y}}_{\text{최종 예측}}
=
\underbrace{\mathbf{1}[s\ge0]}_{\text{0을 기준으로 hard decision}}
`}</Math>
        <FormulaNote
          meaning="입력과 weight의 내적에 bias를 더해 score s를 만들고, score가 0 이상이면 1, 아니면 0을 출력한다."
          symbols={[
            [String.raw`x`, 'd개 입력 특징을 가진 벡터'],
            [String.raw`w`, '각 특징의 중요도와 방향을 가진 weight 벡터'],
            [String.raw`w^\top x`, '같은 위치의 입력과 weight를 곱해 모두 더한 내적'],
            [String.raw`b`, '결정 기준의 위치를 옮기는 bias'],
            [String.raw`\mathbf{1}[\text{조건}]`, '조건이 참이면 1, 거짓이면 0인 indicator'],
          ]}
        />
      </div>

      <ConceptPrimer items={[
        { term: 'Feature', meaning: '분류에 사용하는 입력의 한 축이다.', why: '각 weight가 무엇의 중요도를 나타내는지 정의한다.' },
        { term: 'Score', meaning: '확률이 아니라 선형 결정을 위한 부호 있는 숫자다.', why: '결정 경계의 어느 쪽에 입력이 놓였는지 알려 준다.' },
        { term: 'Bias', meaning: '항상 1인 입력에 연결된 weight로 볼 수 있다.', why: '경계가 반드시 원점을 지나야 하는 제약을 없앤다.' },
        { term: 'Decision rule', meaning: 'score를 최종 label로 바꾸는 규칙이다.', why: '연속적인 score와 이산적인 예측을 구분하게 한다.' },
      ]} />
    </section>
  );
}
