import type { ReactNode } from 'react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  GeneralizationClaimLab,
  PairedDifferenceExplorer,
} from './statistics-generalization/viz/GeneralizationEvidenceLabs';

function SectionHeading({
  index,
  kicker,
  children,
}: {
  index: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose mb-6 border-t border-border pt-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm font-bold text-rose-700 dark:text-rose-300">{index}</span>
        <span className="text-xs font-bold text-muted-foreground">{kicker}</span>
      </div>
      <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{children}</h2>
    </div>
  );
}

function FormulaFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background px-3 py-4 sm:px-4">
      {children}
    </div>
  );
}

function TargetPopulation() {
  return (
    <section id="target-population" className="mb-20 scroll-mt-20">
      <SectionHeading index="01" kicker="CLAIM FIRST">
        “B가 더 좋다”는 누구에게, 언제, 무엇이 더 좋다는 뜻일까?
      </SectionHeading>

      <QuestionLead
        question="train loss가 낮거나 benchmark가 0.583%p 높으면 배포 결정을 내려도 될까?"
        answer={(
          <>
            아직 아니다. 먼저 미래에 만날 대상, 오류 한 번의 비용, 비교하려는 양과 관측
            단위를 고정해야 한다. 이 네 가지가 달라지면 같은 score도 다른 질문의 답이 된다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          모델은 미래를 직접 보지 못한다. 지난달 한 병원에서 모은 기록처럼 이미 관측한
          <strong> sample</strong>로, 다음 달 새 병원·새 기기에서 만날
          <strong> deployment population</strong>의 성능을 추정한다. 따라서 평가의 첫
          문장은 “accuracy를 계산한다”가 아니라 “어떤 미래 사례에 대한 어떤 비용의 평균을
          알고 싶은가?”여야 한다.
        </p>
        <p>
          이때 <strong>estimand</strong>는 알고 싶은 모집단의 양이고,
          <strong> estimate</strong>는 표본에서 실제로 계산한 숫자다. 예를 들어 “다음 달
          새 병원 환자의 평균 오분류 비용에서 B와 A의 차이”가 estimand라면, 지난달 같은
          사용자가 반복해서 만든 1,200행의 accuracy는 그 질문에 대한 하나의 불완전한
          estimate일 뿐이다.
        </p>
      </div>

      <ConceptPrimer
        title="네 단어를 같은 문장에 놓는다"
        items={[
          {
            term: 'Population',
            meaning: '결론을 적용하려는 미래 사례 전체다.',
            why: '병원, 시간, 기기나 사용자 구성이 달라지면 다른 population이다.',
          },
          {
            term: 'Estimand',
            meaning: '그 population에서 알고 싶은 위험 또는 모델 차이다.',
            why: '무엇을 추정하는지 고정해야 metric과 split을 고를 수 있다.',
          },
          {
            term: 'Independent unit',
            meaning: '새로운 정보를 하나 제공하는 sampling·resampling 단위다.',
            why: '한 사용자의 반복 행을 서로 독립인 15명처럼 세면 certainty가 부풀려진다.',
          },
          {
            term: 'Decision cost',
            meaning: '한 예측이 틀렸을 때 실제로 치르는 손실이다.',
            why: '희귀 질환 누락과 흔한 음성의 오탐은 같은 1건 오류가 아니다.',
          },
        ]}
      />

      <div className="not-prose my-8 grid min-w-0 gap-2 xl:grid-cols-3">
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`Z\sim\underbrace{P_{\mathrm{deploy}}}_{\text{결론을 적용할 미래 모집단}}`}
          </Math>
        </FormulaFrame>
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`L_\theta(Z)=\underbrace{\ell(f_\theta(Z))}_{\text{한 독립 단위의 오류 비용}}`}
          </Math>
        </FormulaFrame>
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`R_{\mathrm{deploy}}(\theta)=\underbrace{\mathbb E[L_\theta(Z)]}_{\text{모든 미래 조건에서 평균}}`}
          </Math>
        </FormulaFrame>
      </div>

      <FormulaNote
        meaning="계산 순서는 배포 모집단에서 한 단위를 생각하고, 그 단위의 의사결정 손실을 구한 뒤, 가능한 미래 조건에 걸쳐 평균내는 것이다. Population이나 loss가 바뀌면 R도 다른 양이 된다."
        symbols={[
          [String.raw`Z`, '한 개의 독립적인 배포 단위다. 표의 한 행과 자동으로 같지 않다.'],
          [String.raw`P_{\mathrm{deploy}}`, '결론을 적용하려는 사용자·시간·장소·기기 조건의 분포다.'],
          [String.raw`\ell`, '오류의 실제 비용을 숫자로 바꾸는 규칙이다.'],
          [String.raw`R_{\mathrm{deploy}}`, '직접 관측할 수 없는 미래 모집단 위험이다.'],
        ]}
      />

      <Misconception>
        “데이터가 많다”는 말만으로 일반화가 보장되지 않는다. 같은 사용자의 반복 로그,
        같은 영상의 crop, 인접 frame은 행 수를 늘리지만 새로운 독립 조건을 같은 수만큼
        늘리지 않는다.
      </Misconception>
    </section>
  );
}

function IndependentUnit() {
  return (
    <section id="independent-unit" className="mb-20 scroll-mt-20">
      <SectionHeading index="02" kicker="UNIT OF EVIDENCE">
        1,200행은 정말 1,200개의 독립적인 증거일까?
      </SectionHeading>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          한 사용자가 평균 15개의 기록을 남겨 총 1,200행이 생겼다고 하자. 같은 사용자의
          기록은 기기, 행동 습관, 촬영 환경과 label 오류를 공유한다. 한 행을 이미 보았을 때
          같은 사용자의 다음 행은 완전히 새로운 사람의 기록만큼 새롭지 않다.
        </p>
        <p>
          그래서 먼저 <strong>observation row</strong>와
          <strong> sampling unit</strong>을 분리한다. 이 예시에서는 1,200행을 계산에
          사용하되, split과 uncertainty를 만들 때는 80명의 사용자 묶음을 쪼개지 않는다.
          “유효 표본 수가 언제나 정확히 80”이라고 선언하는 것이 아니라, 사용자가 독립적으로
          모집됐다는 이 fixture의 가정 아래 <strong>resampling boundary</strong>를 80개
          group으로 고정하는 것이다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="grid gap-2 border-b border-border p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:px-5">
          <p className="font-mono text-3xl font-bold">1,200</p>
          <div>
            <p className="text-sm font-bold">관측 행</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              score를 계산하는 record 수. 반복 사용자의 event가 여러 개 들어 있다.
            </p>
          </div>
        </div>
        <div className="grid gap-2 border-b border-border p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:px-5">
          <p className="font-mono text-3xl font-bold">80</p>
          <div>
            <p className="text-sm font-bold">사용자 group</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              split과 재표본에서 함께 움직여야 하는 독립 정보의 경계다.
            </p>
          </div>
        </div>
        <div className="grid gap-2 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:px-5">
          <p className="font-mono text-3xl font-bold">1</p>
          <div>
            <p className="text-sm font-bold">배포 claim</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              다음 달 새 병원·기기라는 목표 조건은 아직 별도 holdout으로 관찰해야 한다.
            </p>
          </div>
        </div>
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-2 xl:grid-cols-2">
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{N_{\mathrm{row}}}_{\text{기록 수}}=1200,\qquad\underbrace{G}_{\text{사용자 group}}=80`}
          </Math>
        </FormulaFrame>
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\text{resampling unit}=\underbrace{g\in\{1,\ldots,80\}}_{\text{사용자를 통째로 다시 뽑음}}`}
          </Math>
        </FormulaFrame>
      </div>

      <FormulaNote
        meaning="행은 score 계산의 단위이고 group은 split·uncertainty의 단위다. 같은 group의 행을 train과 validation에 나누거나 bootstrap에서 따로 뽑으면 독립 정보가 실제보다 많아 보인다."
        symbols={[
          [String.raw`N_{\mathrm{row}}`, 'metric에 들어간 record 수다. independence를 보장하지 않는다.'],
          [String.raw`G`, '이 fixture에서 독립적으로 모집됐다고 가정한 사용자 group 수다.'],
          [String.raw`g`, '한 사용자의 모든 반복 기록을 담은 묶음이다.'],
          ['resampling unit', '불확실성을 다시 계산할 때 함께 선택하거나 제외하는 최소 묶음이다.'],
        ]}
      />

      <StopRule>
        같은 사용자·환자·문서·원본 영상·시간 구간이 split을 건너는지 설명할 수 없다면,
        표본 수와 confidence interval을 계산하기 전에 score부터 보류한다.
      </StopRule>

      <p className="text-sm leading-relaxed text-muted-foreground">
        GroupKFold, 시간 순서 holdout과 fold-local preprocessing의 구현은{' '}
        <InternalLink slug="cross-validation">교차 검증</InternalLink>에서 이어진다.
      </p>
    </section>
  );
}

function PairedComparison() {
  return (
    <section id="paired-comparison" className="mb-20 scroll-mt-20">
      <SectionHeading index="03" kicker="PAIRED DIFFERENCE">
        같은 사례를 본 두 모델은 왜 한 쌍으로 비교할까?
      </SectionHeading>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          A와 B가 같은 1,200행을 평가했다면 두 accuracy는 독립된 두 실험이 아니다. 쉬운 행은
          둘 다 맞히고 어려운 행은 둘 다 틀리는 경향을 공유한다. 따라서 “A의 interval과 B의
          interval이 겹치는가?”만 보기보다, <strong>같은 행에서 판단이 어떻게 달라졌는지</strong>
          를 먼저 본다.
        </p>
        <p>
          둘 다 맞힌 1,040행과 둘 다 틀린 49행은 두 모델의 공통 성능을 보여주지만 accuracy
          차이에서는 상쇄된다. A만 맞힌 52행과 B만 맞힌 59행의 순차이 7행이
          <strong> paired point difference</strong>를 만든다.
        </p>
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-2 xl:grid-cols-2">
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\widehat\Delta=\frac{\underbrace{n_{\text{B만 정답}}-n_{\text{A만 정답}}}_{\text{서로 다르게 판단한 행의 순차이}}}{\underbrace{N}_{\text{같은 평가 행}}}`}
          </Math>
        </FormulaFrame>
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\widehat\Delta=\frac{59-52}{1200}=0.00583=\underbrace{+0.583\%\mathrm p}_{\text{표본의 accuracy 차이}}`}
          </Math>
        </FormulaFrame>
      </div>

      <FormulaNote
        meaning="같은 사례에서 B가 추가로 맞힌 수에서 A가 추가로 맞힌 수를 빼고, 같은 평가 행 수로 나눈다. 이 연산은 point estimate만 만든다. 우연한 변동과 사용자 group 의존성은 별도로 추정해야 한다."
        symbols={[
          [String.raw`n_{\text{B만 정답}}`, 'A는 틀리고 B만 맞힌 행 수, 여기서는 59다.'],
          [String.raw`n_{\text{A만 정답}}`, 'B는 틀리고 A만 맞힌 행 수, 여기서는 52다.'],
          [String.raw`N`, '같은 조건에서 A와 B가 모두 평가한 관측 행 수, 여기서는 1,200이다.'],
          [String.raw`\widehat\Delta`, '관측 표본에서 계산한 B minus A 차이다.'],
          [String.raw`\%\mathrm p`, '두 비율의 차이를 percentage point로 표시한 단위다.'],
        ]}
      />

      <PairedDifferenceExplorer />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Paired는 independence 문제를 자동으로 해결하지 않는다</h3>
        <p>
          같은 행의 차이를 쓰는 것은 첫 단계다. 1,200행이 80명 안에 묶여 있다면 uncertainty는
          행 1,200개를 독립적으로 다시 뽑아 만들지 않는다. 사용자 80명을 재표본하고, 뽑힌
          사용자의 모든 행을 함께 유지한 뒤 paired difference를 다시 계산한다.
        </p>
        <p>
          이 글에는 사용자별 네 outcome의 배분이 주어지지 않았다. 따라서 +0.583%p는 정확히
          계산할 수 있지만 numeric confidence interval은 만들 수 없다. 없는 상세 데이터를
          가정해 그럴듯한 interval을 제시하는 것보다, 무엇이 더 필요한지를 표시하는 것이
          올바른 통계적 결론이다.
        </p>
      </div>
    </section>
  );
}

function SelectionBoundary() {
  const roles = [
    {
      name: 'Train',
      authority: '파라미터를 바꾼다',
      consumed: 'gradient, feature fit, augmentation policy',
    },
    {
      name: 'Validation',
      authority: '후보와 설정을 고른다',
      consumed: 'architecture, hyperparameter, threshold, early stopping',
    },
    {
      name: 'Untouched audit',
      authority: '선택된 후보의 마지막 주장을 제한한다',
      consumed: '선택이 끝난 뒤 한 번 여는 독립 evidence',
    },
  ];

  return (
    <section id="selection-boundary" className="mb-20 scroll-mt-20">
      <SectionHeading index="04" kicker="SELECTION CONSUMES EVIDENCE">
        Validation을 40번 보면 왜 마지막 score가 낙관적으로 보일까?
      </SectionHeading>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          데이터의 역할은 gradient를 받았는지로만 구분하지 않는다. 사람이 validation 결과를
          보고 model, feature, seed, threshold나 prompt를 바꾸면 그 evidence가 선택 과정에
          들어간다. 직접 backpropagation하지 않아도 의사결정 경로를 통해 후보에 반영된 것이다.
        </p>
        <p>
          40개 후보의 실제 성능이 비슷해도 validation에는 각 후보마다 우연한 흔들림이 있다.
          가장 높은 하나를 고르면 실제 효과와 함께 <strong>가장 운이 좋았던 흔들림</strong>도
          선택한다. Cawley와 Talbot의 2010년 분석은 model-selection criterion 자체도
          overfit될 수 있으며, 그 영향이 비교하려는 알고리즘 차이와 비슷한 규모가 될 수 있음을
          보였다. 이는 “40회면 반드시 얼마만큼 부풀려진다”는 보편 공식이 아니라, trial 수와
          selection variance를 증거 계약에 넣어야 한다는 경고다.
        </p>
        <p>
          Varma와 Simon의 2006년 분석은 후보 선택에 쓴 cross-validation 결과를 그대로 오류
          추정값으로 보고하면 편향될 수 있음을 보였다. 그래서 안쪽 절차는 후보를 고르고, 바깥
          절차나 untouched audit은 이미 고른 절차의 오류를 추정한다. 이 구분도 모든 배포
          조건의 타당성을 자동 보장하지는 않는다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {roles.map((role, index) => (
          <div
            key={role.name}
            className="grid gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[3rem_8rem_minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-start sm:px-5"
          >
            <p className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300">
              0{index + 1}
            </p>
            <p className="text-sm font-bold">{role.name}</p>
            <p className="text-sm font-semibold leading-relaxed">{role.authority}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{role.consumed}</p>
          </div>
        ))}
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-2 xl:grid-cols-2">
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\widehat\theta=\underbrace{\arg\min_{\theta\in\Theta}\widehat R_{\mathrm{val}}(\theta)}_{\text{validation으로 40개 후보 중 선택}}`}
          </Math>
        </FormulaFrame>
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{\widehat R_{\mathrm{audit}}(\widehat\theta)}_{\text{선택에 쓰지 않은 마지막 추정}}`}
          </Math>
        </FormulaFrame>
      </div>

      <FormulaNote
        meaning="Validation은 후보를 고르는 최적화 대상이고 audit은 이미 고른 후보를 평가하는 별도 evidence다. 같은 data를 두 역할에 쓰면 선택 과정에서 얻은 우연한 상승을 독립 검증으로 다시 보고하게 된다."
        symbols={[
          [String.raw`\Theta`, '검토한 model, hyperparameter, feature와 threshold 후보의 집합이다.'],
          [String.raw`\widehat\theta`, 'validation을 보고 최종 선택한 후보다.'],
          [String.raw`\widehat R_{\mathrm{val}}`, '선택에 소비된 표본 위험 추정이다.'],
          [String.raw`\widehat R_{\mathrm{audit}}`, '선택 과정에서 보지 않은 data로 계산한 마지막 추정이다.'],
        ]}
      />

      <Misconception>
        Test set만 반복해서 보면 leakage가 생기는 것이 아니다. Validation을 40번 보고 후보를
        고른 뒤 그 validation score를 “최종 성능”으로 말해도 adaptive selection bias가 생긴다.
      </Misconception>

      <StopRule>
        dataset과 split은 그대로인데 score를 본 뒤 후보·feature·threshold를 바꿨다면, 그
        split은 더 이상 untouched audit이 아니다. Nested selection이나 새 audit boundary를
        설계한다.
      </StopRule>
    </section>
  );
}

function UncertaintyProcedure() {
  const steps = [
    {
      index: '01',
      title: '사용자 80명을 복원추출한다',
      body: '각 bootstrap replicate에서 사용자를 중복 허용해 80번 뽑는다.',
    },
    {
      index: '02',
      title: '한 사용자의 행은 함께 움직인다',
      body: '반복 event를 쪼개지 않아 사용자 내부 dependence를 유지한다.',
    },
    {
      index: '03',
      title: '각 replicate의 paired 차이를 다시 계산한다',
      body: 'A-only와 B-only의 순차이를 같은 방법으로 구한다.',
    },
    {
      index: '04',
      title: '분포와 경계를 함께 보고한다',
      body: '사용한 bootstrap variant, quantile, group 수와 가정을 기록한다.',
    },
  ];

  return (
    <section id="uncertainty-procedure" className="mb-20 scroll-mt-20">
      <SectionHeading index="05" kicker="UNCERTAINTY IS A PROCEDURE">
        +0.583%p는 결론이 아니라 어디서부터 흔들리는지 묻는 시작점이다
      </SectionHeading>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>Point estimate</strong>는 가진 표본의 대표 숫자다. Standard error, seed/fold
          spread나 bootstrap distribution은 같은 절차를 다시 수행했을 때 그 숫자가 얼마나
          흔들리는지 본다. Interval은 이 변동을 한 구간으로 요약하지만, 계산법과 가정을
          생략하면 장식 숫자에 불과하다.
        </p>
        <p>
          Frequentist confidence interval의 95%는 “이번에 얻은 고정 구간 안에 실제 효과가
          95% 확률로 있다”는 뜻이 아니다. 같은 sampling·interval 절차를 반복했을 때 장기적으로
          정해진 비율의 구간이 target을 덮도록 설계됐다는 뜻이다. 실제 coverage는 independence,
          resampling unit, 표본 크기와 선택 절차 같은 가정에 달려 있다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {steps.map((step) => (
          <div
            key={step.index}
            className="grid gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[3rem_minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-start sm:px-5"
          >
            <p className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300">{step.index}</p>
            <p className="text-sm font-bold leading-relaxed">{step.title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-2 xl:grid-cols-2">
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\widehat\Delta^{*(1)},\widehat\Delta^{*(2)},\ldots,\widehat\Delta^{*(B)}`}
          </Math>
        </FormulaFrame>
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\widehat{CI}_{95\%}=\left[\underbrace{Q_{0.025}(\widehat\Delta^*)}_{\text{재표본 차이의 아래 경계}},\underbrace{Q_{0.975}(\widehat\Delta^*)}_{\text{재표본 차이의 위 경계}}\right]`}
          </Math>
        </FormulaFrame>
      </div>

      <FormulaNote
        meaning="별표가 붙은 Δ는 원래 행을 독립적으로 섞은 값이 아니라 사용자 group을 통째로 다시 뽑아 계산한 paired 차이다. Quantile interval은 가능한 방법 중 하나이며, bootstrap variant와 가정을 함께 보고해야 한다."
        symbols={[
          [String.raw`B`, 'bootstrap을 반복한 횟수다. model B와 다른 기호다.'],
          [String.raw`\widehat\Delta^*`, '한 번의 group-resampled dataset에서 다시 계산한 paired 차이다.'],
          [String.raw`Q_{0.025}`, '재표본 차이 분포의 아래쪽 2.5% quantile이다.'],
          [String.raw`Q_{0.975}`, '재표본 차이 분포의 위쪽 97.5% quantile이다.'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Statistical difference와 useful difference는 다른 질문이다</h3>
        <p>
          Interval이 0에서 떨어져 있어도 +0.583%p가 latency, 검토 인력, false negative 비용과
          모델 교체 위험을 상쇄하는지는 별도 판단이다. 반대로 interval이 넓다면 “효과가 없다”가
          아니라 현재 evidence로 효과의 방향과 크기를 충분히 좁히지 못했다는 뜻일 수 있다.
          Effect size와 uncertainty, 실제 의사결정 비용을 함께 본다.
        </p>
      </div>
    </section>
  );
}

function ShiftCalibration() {
  return (
    <section id="shift-calibration" className="mb-20 scroll-mt-20">
      <SectionHeading index="06" kicker="DEPLOYMENT CLOCK">
        같은 accuracy와 calibration이 새 병원에서도 그대로 유지될까?
      </SectionHeading>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Random split은 대개 현재 dataset에서 임의의 행을 나눈다. 하지만 실제 배포는 다음 달,
          새 병원, 새 기기와 새 사용자라는 여러 clock을 동시에 넘을 수 있다. 이때 input 빈도,
          label 비율, 센서 품질, 임상 workflow가 달라지므로 IID test의 평균은 배포 질문의 일부만
          답한다.
        </p>
        <p>
          WILDS는 병원, 시간, 위치와 population처럼 실제 data-generating process에서 생기는
          distribution shift를 benchmark로 분리했고, Ovadia 등의 연구는 shift가 커질 때
          uncertainty와 calibration 품질도 함께 나빠질 수 있음을 보였다. 따라서 calibration은
          모델에 영구히 붙은 고정 점수가 아니라 <strong>측정한 population과 시점에 조건부인
          evidence</strong>다.
        </p>
        <p>
          Guo 등의 2017년 실험은 연구에서 평가한 modern neural network가 높은 accuracy와
          별개로 poorly calibrated일 수 있음을 보여주었다. Temperature scaling이 그 실험들에서
          잘 작동했다는 결과는 출발점이지, 새 병원에서도 calibration이 유지된다는 보장은 아니다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-start sm:px-5">
          <p className="text-sm font-bold">사용자</p>
          <p className="text-xs leading-relaxed text-muted-foreground">현재 dataset의 반복 사용자</p>
          <p className="text-xs font-semibold leading-relaxed">새 사용자를 group holdout</p>
        </div>
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-start sm:px-5">
          <p className="text-sm font-bold">시간</p>
          <p className="text-xs leading-relaxed text-muted-foreground">지난달 random split</p>
          <p className="text-xs font-semibold leading-relaxed">다음 달 forward audit</p>
        </div>
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-start sm:px-5">
          <p className="text-sm font-bold">장소 · 기기</p>
          <p className="text-xs leading-relaxed text-muted-foreground">같은 병원·센서</p>
          <p className="text-xs font-semibold leading-relaxed">새 병원·새 기기 holdout</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-start sm:px-5">
          <p className="text-sm font-bold">오류 비용</p>
          <p className="text-xs leading-relaxed text-muted-foreground">전체 평균 +0.583%p</p>
          <p className="text-xs font-semibold leading-relaxed">희귀 subgroup -8%p와 calibration</p>
        </div>
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-2 xl:grid-cols-2">
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{\widehat p(x)\approx0.8}_{\text{모델이 말한 확률}}`}
          </Math>
        </FormulaFrame>
        <FormulaFrame>
          <Math display className="my-0 text-sm sm:text-base">
            {String.raw`\underbrace{\Pr(Y=1\mid\widehat p(X)\approx0.8)}_{\text{같은 population의 실제 빈도}}\approx0.8`}
          </Math>
        </FormulaFrame>
      </div>

      <FormulaNote
        meaning="Calibration은 0.8이라고 말한 사례들이 측정한 population에서 실제로 약 80% 양성인지 비교한다. Population이 바뀌면 조건부 빈도도 다시 측정해야 한다."
        symbols={[
          [String.raw`\widehat p(x)`, '모델이 한 사례에 출력한 예측 확률이다.'],
          [String.raw`\Pr(Y=1\mid\widehat p(X)\approx0.8)`, '비슷한 confidence bin의 실제 양성 빈도다.'],
          ['같은 population', '시간·장소·기기·사용자 조건을 고정한 평가 범위다.'],
          ['Shift', '그 조건이나 데이터 생성 과정이 배포에서 달라진 상태다.'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>평균 개선이 subgroup harm를 상쇄하지 않는다</h3>
        <p>
          전체 accuracy가 +0.583%p라도 희귀 subgroup에서 -8%p라면 “B가 더 좋다”는 한 문장은
          안전하지 않다. Primary metric은 주된 목표를, guardrail은 허용하지 않을 실패를,
          slice metric은 누구에게 문제가 생겼는지를 맡는다. Calibration과 threshold까지 포함한
          실제 metric bundle은 <InternalLink slug="evaluation-metrics">평가 지표</InternalLink>
          에서 설계한다.
        </p>
      </div>
    </section>
  );
}

function ClaimDecision() {
  return (
    <section id="claim-decision" className="mb-20 scroll-mt-20">
      <SectionHeading index="07" kicker="EVIDENCE CONTRACT">
        같은 +0.583%p라도 어떤 증거를 거쳤는지에 따라 문장이 달라진다
      </SectionHeading>

      <QuestionLead
        question="B를 배포해도 된다는 결론을 가장 먼저 막는 경계는 무엇일까?"
        answer={(
          <>
            점수 크기만으로는 정할 수 없다. 행 무작위 split이면 사용자 leakage가 먼저 막고,
            validation을 재사용했으면 selection bias가 막으며, future audit까지 있어도
            현재 사용자만 분리했을 뿐 새 병원·시간 경계를 넘지 않았다면 claim 범위가 제한된다.
            Future-site/group audit까지 있어도 subgroup과 calibration을 확인하지 않았다면
            배포 claim은 보류한다.
          </>
        )}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          아래 도구는 숫자를 바꾸지 않는다. 같은 paired point difference를 두고
          <strong> 평가 경계</strong>, <strong>선택에 사용한 evidence</strong>,
          <strong> 실패 guardrail</strong>만 바꾼다. 좋은 설계는 더 큰 숫자를 만드는 것이
          아니라, 허용되는 주장과 아직 남은 대체 설명을 분리한다.
        </p>
      </div>

      <GeneralizationClaimLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          가장 강한 상태도 “B가 보편적으로 우월하다”로 끝나지 않는다. “손대지 않은
          future-site/group audit와 확인한 slice 범위에서 paired 차이를 추정했다”처럼
          evidence가 실제로 덮은 조건을 문장 안에 남긴다. 새로운 병원이나 더 긴 시간이 추가되면
          새 evidence clock을 열어야 한다.
        </p>
      </div>
    </section>
  );
}

function NextRoutes() {
  const routes = [
    {
      slug: 'evaluation-metrics',
      label: '평가 지표',
      question: 'Primary, guardrail, slice, calibration과 threshold를 어떻게 묶을까?',
    },
    {
      slug: 'cross-validation',
      label: '교차 검증',
      question: 'Group, time, nested selection과 untouched audit split을 어떻게 구현할까?',
    },
    {
      slug: 'experiment-tracking',
      label: '실험 관리',
      question: 'Dataset, split, 40개 trial과 audit 개봉 기록을 어떻게 재현할까?',
    },
    {
      slug: 'probability-information-theory',
      label: '확률과 정보이론',
      question: '기대값, 조건부 확률과 likelihood가 막힐 때 어디까지 내려갈까?',
    },
  ];

  return (
    <section id="next-routes" className="scroll-mt-20">
      <SectionHeading index="08" kicker="HANDOFF">
        판단이 끝나면 metric, split, 기록을 각 구현 글로 넘긴다
      </SectionHeading>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 글의 끝은 통계 용어를 많이 기억하는 지점이 아니다. 다음 실험에서 estimand와 독립
          단위를 먼저 적고, 같은 사례의 paired 차이를 계산하고, selection과 audit evidence를
          분리한 뒤, 배포 shift와 guardrail까지 포함한 문장을 쓸 수 있으면 된다.
        </p>
      </div>

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {routes.map((route, index) => (
          <div
            key={route.slug}
            className="grid gap-2 py-4 sm:grid-cols-[3rem_11rem_minmax(0,1fr)] sm:items-start"
          >
            <p className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300">
              0{index + 1}
            </p>
            <p className="text-sm font-bold">
              <InternalLink slug={route.slug}>{route.label}</InternalLink>
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{route.question}</p>
          </div>
        ))}
      </div>

      <CapabilityCheck
        items={[
          '배포 population, estimand, estimate와 decision cost를 한 문장으로 고정할 수 있다.',
          '1,200행과 80명의 사용자 group을 서로 다른 증거 단위로 다룰 수 있다.',
          '같은 사례의 네 paired outcome에서 +0.583%p를 계산할 수 있다.',
          'Validation 40회 탐색과 untouched audit의 권한을 분리할 수 있다.',
          'Point estimate, group-aware uncertainty와 useful effect를 구분할 수 있다.',
          'Future shift, subgroup -8%p와 calibration을 전체 평균과 별도 guardrail로 판단할 수 있다.',
        ]}
      />

      <StopRule>
        모든 통계 검정을 외울 때까지 내려가지 않는다. 현재 실험의 target, unit, paired
        comparison, selection boundary, uncertainty와 deployment scope를 설명할 수 있으면
        필요한 구현 글로 올라간다.
      </StopRule>

      <SourceNotes
        sources={[
          {
            label: 'Cawley & Talbot · On Over-fitting in Model Selection, 2010',
            href: 'https://jmlr.org/papers/v11/cawley10a.html',
            note: 'Model-selection criterion 자체의 overfitting과 selection bias 경계.',
          },
          {
            label: 'Varma & Simon · Bias in error estimation, 2006',
            href: 'https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-7-91',
            note: 'Model selection과 error estimation에 같은 CV를 쓸 때의 bias 및 nested evaluation.',
          },
          {
            label: 'Guo et al. · On Calibration of Modern Neural Networks, 2017',
            href: 'https://proceedings.mlr.press/v70/guo17a.html',
            note: '연구에 포함된 modern neural network의 calibration 문제와 temperature scaling 실험.',
          },
          {
            label: 'Ovadia et al. · Predictive Uncertainty under Dataset Shift, 2019',
            href: 'https://proceedings.neurips.cc/paper_files/paper/2019/hash/8558cb408c1d76621371888657d2eb1d-Abstract.html',
            note: 'Dataset shift가 커질 때 uncertainty·calibration 평가가 약해질 수 있다는 benchmark evidence.',
          },
          {
            label: 'Koh et al. · WILDS, 2020',
            href: 'https://arxiv.org/abs/2012.07421',
            note: '병원, 시간, 지역, population 등 실제 distribution shift를 분리한 benchmark와 평가 계약.',
          },
        ]}
      />
    </section>
  );
}

export default function StatisticsGeneralizationArticle() {
  return (
    <>
      <TargetPopulation />
      <IndependentUnit />
      <PairedComparison />
      <SelectionBoundary />
      <UncertaintyProcedure />
      <ShiftCalibration />
      <ClaimDecision />
      <NextRoutes />
    </>
  );
}
