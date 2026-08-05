import { ArrowDown, ArrowRight, CornerUpLeft, Database, GitBranch, Network, RefreshCw, Sparkles, Target } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';

const systemSteps = [
  { icon: Database, label: '데이터', symbol: 'x, y', detail: '관측과 정답', color: 'text-teal-700 border-teal-600 bg-teal-500/[0.06] dark:text-teal-300' },
  { icon: Network, label: '모델', symbol: 'fθ', detail: '조절할 계산', color: 'text-violet-700 border-violet-600 bg-violet-500/[0.06] dark:text-violet-300' },
  { icon: Sparkles, label: '예측', symbol: 'ŷ', detail: '현재 모델의 답', color: 'text-blue-700 border-blue-600 bg-blue-500/[0.06] dark:text-blue-300' },
  { icon: Target, label: '손실', symbol: 'L', detail: '틀린 정도', color: 'text-rose-700 border-rose-600 bg-rose-500/[0.06] dark:text-rose-300' },
  { icon: GitBranch, label: '기울기', symbol: '∇θL', detail: '책임과 방향', color: 'text-amber-700 border-amber-600 bg-amber-500/[0.06] dark:text-amber-300' },
  { icon: RefreshCw, label: '업데이트', symbol: "θ'", detail: '다음 파라미터', color: 'text-emerald-700 border-emerald-600 bg-emerald-500/[0.06] dark:text-emerald-300' },
];

function LearningSystemMap() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span className="text-sm font-semibold">딥러닝 학습 시스템의 한 바퀴</span>
        <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">FORWARD → BACKWARD</span>
      </figcaption>
      <ol className="grid min-w-0 grid-cols-1 p-4 sm:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] sm:gap-y-4 lg:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] lg:p-5">
        {systemSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="contents">
              <li className={`relative min-w-0 rounded-sm border border-t-2 ${step.color} p-3`}>
                <div className="flex items-center justify-between gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold opacity-70">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">{step.label}</p>
                <p className="mt-0.5 font-mono text-base font-bold text-foreground">{step.symbol}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{step.detail}</p>
              </li>
              {index < systemSteps.length - 1 && (
                <li className={`${index === 2 ? 'sm:col-span-5 lg:col-span-1' : ''} flex h-7 items-center justify-center text-muted-foreground sm:h-auto`} aria-hidden="true">
                  <ArrowDown className="h-4 w-4 sm:hidden" />
                  <ArrowRight className="hidden h-4 w-4 sm:block" />
                </li>
              )}
            </div>
          );
        })}
      </ol>
      <div className="flex items-center gap-3 border-t border-border bg-emerald-500/[0.04] px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">
        <CornerUpLeft className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        <span><strong className="text-foreground">θ′가 다시 모델로 돌아간다.</strong> 다음 mini-batch에서 같은 순환을 반복하면 훈련이 된다.</span>
      </div>
    </figure>
  );
}

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">딥러닝을 한 장으로 보면 무엇이 보일까?</h2>
      <BeginnerOpening
        title="딥러닝은 처음부터 답을 아는 프로그램이 아니라, 틀린 답을 보고 내부 숫자를 고치는 학습 과정입니다."
        description={<>사람이 모든 판별 규칙을 코드로 적는 대신, 신경망이라는 계산에 많은 예시를 보여 준다. 신경망은 먼저 답을 내고, 정답과 얼마나 달랐는지 확인한 뒤, 다음 답이 나아지도록 내부의 <strong className="text-foreground">조절 숫자</strong>를 조금 바꾼다.</>}
        familiarScene={<>처음 보는 글자를 익히는 아이를 생각해 보자. 카드를 보고 답을 말하고, 틀리면 어느 획을 놓쳤는지 확인한 뒤 다시 본다. 카드 한 장을 외우는 것이 아니라 여러 예시에 반복해서 나타나는 모양을 붙잡아야 새 글자도 읽을 수 있다.</>}
        steps={[
          { label: '예시를 받는다', detail: '사진이나 문장 같은 입력과, 학습 때 확인할 정답을 준비한다.' },
          { label: '현재 답과 틀린 정도를 낸다', detail: '신경망이 예측하고 loss가 예측과 정답의 차이를 한 숫자로 만든다.' },
          { label: '내부 숫자를 조금 고친다', detail: '역전파가 수정 방향을 찾고 optimizer가 업데이트를 반복한다.' },
        ]}
      />
      <QuestionLead
        question="딥러닝은 거대한 신경망 자체일까, 아니면 그 신경망을 배우게 만드는 전체 과정일까?"
        answer="둘을 함께 봐야 한다. 신경망은 입력을 예측으로 바꾸는 함수이고, 학습은 예측의 오차를 이용해 그 함수의 파라미터를 반복해서 고치는 과정이다. 데이터와 평가 방법까지 포함해야 실제 딥러닝 시스템이 된다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          사진을 고양이와 강아지로 나누는 문제를 생각해 보자. 사진은 숫자 배열인 <strong>입력</strong>이 되고,
          신경망은 그 배열을 여러 층에서 변환해 두 클래스의 점수인 <strong>예측</strong>을 만든다. 처음의 가중치는
          무작위에 가까워 예측도 부정확하다. 그래서 정답과 예측의 차이를 <strong>손실</strong>이라는 하나의 숫자로 측정한다.
        </p>
        <p>
          역전파는 손실에 책임이 있는 파라미터와 수정 방향을 계산한다. 옵티마이저가 그 기울기를 사용해 파라미터를
          조금 바꾸고, 같은 과정을 다음 데이터에 대해 반복한다. “모델이 특징을 배운다”는 말은 이 반복을 거치며 유용한
          중간 표현을 만드는 파라미터가 남는다는 뜻이다.
        </p>
      </div>

      <LearningSystemMap />

      <Math display>{String.raw`\hat{y} = f_{\theta}(x), \qquad \theta' = \theta - \eta\nabla_{\theta}\mathcal{L}(\hat{y}, y)`}</Math>
      <FormulaNote
        meaning="첫 식은 현재 파라미터로 예측을 만드는 순전파다. 둘째 식은 손실을 줄이는 방향으로 파라미터를 조금 이동시키는 가장 기본적인 업데이트다."
        symbols={[
          ['x, y', '입력 데이터와 정답'],
          ['fθ', '파라미터 θ를 가진 신경망 함수'],
          ['ŷ', '현재 모델이 만든 예측'],
          ['L(ŷ, y)', '예측이 정답과 얼마나 다른지 나타내는 손실'],
          ['∇θL', '각 파라미터가 손실에 미치는 변화율'],
          ['η', '한 번에 얼마나 수정할지 정하는 학습률'],
        ]}
      />

      <ConceptPrimer
        items={[
          { term: '데이터', meaning: '입력 x와 원하는 출력 y의 관측값이다.', why: '모델이 무엇을 배울 수 있는지와 평가할 수 있는 범위를 결정한다.' },
          { term: '파라미터', meaning: '훈련 중 바뀌는 가중치와 편향이다.', why: '학습은 프로그램의 코드를 바꾸는 대신 이 숫자들을 바꾼다.' },
          { term: '손실 함수', meaning: '현재 예측의 오차를 하나의 scalar로 요약한다.', why: '수많은 파라미터를 어느 방향으로 바꿀지 공통 목표를 제공한다.' },
          { term: '일반화', meaning: '훈련에서 보지 않은 데이터에도 같은 규칙이 통하는 성질이다.', why: '훈련 데이터를 외운 모델과 실제로 유용한 모델을 구분한다.' },
        ]}
      />
    </section>
  );
}
