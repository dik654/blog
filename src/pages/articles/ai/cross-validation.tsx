import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
import { SplitContractLab } from './practical-strategy/viz/CompetitionEvidenceLabs';

export default function CrossValidationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">교차 검증은 평균 점수 제조기가 아니다</h2>
        <QuestionLead
          question="Class ratio를 보존한 stratified 5-fold면 6월의 새 거래를 제대로 흉내 낸 것일까?"
          answer="아니다. Stratification은 label 비율만 보존한다. 미래 예측, 반복 고객, 병원·기기·원본 영상 같은 group과 label 도착 지연은 data-generating process에 맞는 별도 경계가 필요하다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Validation의 목적은 학습 데이터 일부를 떼는 것이 아니라 <strong>배포 후 처음 만날
            관측을 작은 시간 여행으로 재현</strong>하는 것이다. 그래서 split 이름을 외우기 전에
            “무엇이 새로 등장하는가”를 쓴다. 새 행인가, 새 고객인가, 미래 월인가, 새 장비인가,
            아니면 이 축들이 동시에 바뀌는가?
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'IID', meaning: 'Train과 future sample이 같은 분포에서 독립적으로 나온다는 가정', why: 'Random K-fold가 타당하려면 이 가정이 실제 생성 과정과 가까워야 한다.' },
          { term: 'Group', meaning: '같은 실체에서 반복 생성된 행의 묶음', why: '한 사람·장비·원본이 양쪽 fold에 있으면 identity를 외운 성능이 된다.' },
          { term: 'Forward validation', meaning: '과거로 학습하고 이후 구간으로 평가하는 시간 분할', why: 'Prediction 시점 이후 정보가 거꾸로 흘러오는 것을 막는다.' },
          { term: 'Fit boundary', meaning: '통계·변환·model이 배울 수 있는 행의 경계', why: 'Split만 먼저 해도 preprocessing을 전체 data에 fit하면 leakage가 다시 생긴다.' },
        ]} />
        <SplitContractLab />
      </section>

      <section id="split-selection" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Split은 label 비율이 아니라 새로움의 축을 따른다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['독립 표본', '고정 random K-fold', '중복, group, time dependence가 없다는 audit가 먼저다.'],
            ['희귀 class', 'Stratified K-fold', 'Fold별 class ratio를 안정화하지만 group/time leakage는 막지 않는다.'],
            ['반복 실체', 'GroupKFold 또는 group holdout', '같은 고객·환자·source가 fold를 건너지 않게 한다.'],
            ['미래 예측', 'Expanding/rolling forward split', '모든 feature의 timestamp가 prediction cutoff 이전인지 함께 검사한다.'],
            ['Group + time', '시간 holdout + group 정책', '신규 group 일반화와 기존 group의 미래 행동을 별도 slice로 평가한다.'],
          ].map(([goal, split, audit]) => (
            <div key={goal} className="grid gap-2 py-4 md:grid-cols-[8rem_12rem_minmax(0,1fr)]">
              <strong className="text-sm">{goal}</strong>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{split}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{audit}</p>
            </div>
          ))}
        </div>
        <Misconception>Metric이 split을 결정하지 않는다. Metric은 prediction을 채점하고, split은 데이터가 생기는 과정과 배포 경계를 모사한다. 둘은 같은 업무 계약에서 만나지만 책임은 다르다.</Misconception>
      </section>

      <section id="fit-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Fold 바깥에서 배운 것은 feature가 아니라 정답 힌트다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Scaling, imputation, target/frequency encoding, feature selection, oversampling, dimensionality
            reduction, calibration은 모두 data에서 parameter를 배운다. 각 fold에서 train 부분으로
            <code>fit</code>하고 validation에는 <code>transform</code>만 해야 한다. SMOTE를 split
            전에 실행하면 validation 근처의 합성 sample이 train에 생길 수 있다.
          </p>
          <p>
            Group aggregate도 cutoff를 가진다. 3월 거래를 예측하면서 4~5월의 고객 합계를 사용하면
            groupby 문법은 맞아도 시간 계약은 틀렸다. Point-in-time join과 fold-local pipeline을
            함께 사용해야 한다.
          </p>
        </div>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
          {[
            ['01 Split manifest', '행의 train/valid 역할을 먼저 고정'],
            ['02 Fold-train fit', '통계·encoder·sampler·model 학습'],
            ['03 Fold-valid transform', '고정된 학습 결과만 적용'],
            ['04 OOF ledger', '원래 행 위치에 prediction과 fold 기록'],
          ].map(([title, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <p className="text-xs font-bold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <StopRule>전처리 단계별 fit 대상 행을 설명할 수 없거나 validation row가 aggregate·sampling·selection에 참여했다면 해당 score를 폐기한다.</StopRule>
      </section>

      <section id="nested" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">선택과 평가는 같은 data를 무한히 공유할 수 없다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Hyperparameter, feature set, ensemble weight, calibration과 threshold를 같은 validation에
            반복해서 맞추면 사람이 validation label을 간접 학습한다. 작은 프로젝트에서는 immutable
            split과 trial budget, 마지막 untouched audit holdout으로 이 위험을 제한할 수 있다.
            더 엄격한 추정이 필요하면 outer fold는 최종 평가만 하고 inner fold에서 선택하는 nested
            CV를 쓴다.
          </p>
          <p>
            Nested CV가 항상 필수는 아니다. 계산 비용과 의사결정 위험을 비교해야 한다. 다만 “test는
            한 번만 본다”는 말은 제출 파일을 한 번 만든다는 뜻이 아니라, test 결과가 feature와
            model 선택 loop에 들어오지 않는다는 뜻이다.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Fold mean 뒤의 불안정성을 함께 읽는다</h2>
        <div data-formula-pair className="not-prose my-6 min-w-0 overflow-hidden border-y border-border px-1 py-4 sm:px-3">
          <MathFormula display>{String.raw`\underbrace{\bar s}_{\text{평균 성능}}=\frac{1}{K}\sum_{k=1}^{K}s_k,\qquad \underbrace{\operatorname{SE}(\bar s)}_{\text{fold 변동의 표시}}=\frac{\operatorname{sd}(s_1,\ldots,s_K)}{\sqrt{K}}`}</MathFormula>
          <FormulaNote
            meaning="평균 하나만 남기지 말고 fold별 값, worst fold와 slice를 같이 보존한다. Fold가 독립 표본이 아닐 수 있으므로 이 SE를 보편적인 신뢰구간으로 과해석하지 않는다."
            symbols={[
              [String.raw`s_k`, 'k번째 validation fold의 score'],
              [String.raw`K`, 'Fold 수'],
              [String.raw`\operatorname{sd}`, 'Fold score의 표준편차'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OOF prediction은 모든 train 행에 대해 “그 행을 보지 않은 model”이 만든 prediction을
            모은 artifact다. 이것으로 전체 metric, slice, threshold와 base model 간 error
            correlation을 같은 행 기준으로 계산할 수 있다. Fold mean만 로그하고 OOF를 버리면
            뒤의 calibration과 stacking을 안전하게 재구성하기 어렵다.
          </p>
        </div>
      </section>

      <section id="leaderboard" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Public leaderboard는 또 하나의 fold가 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Public subset에 반복 제출하고 그 점수로 feature와 seed를 고르면 public label을 API
            형태로 학습한다. 제출은 parser·distribution shift·local CV 방향을 확인하는 제한된
            external audit로 사용하고, 후보 수와 해석 규칙을 미리 정한다. CV-LB 불일치가 생기면
            local score를 버리기 전에 split, train/test drift, metric 구현, 중복과 제출 pipeline을
            순서대로 조사한다.
          </p>
          <p>
            다음은 <InternalLink slug="experiment-tracking">실험 관리</InternalLink>다. 같은 split을
            썼다는 기억이 아니라 manifest와 OOF artifact로 증명해야 한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'IID, stratified, group, time, group+time split을 생성 과정으로 선택할 수 있다.',
          '모든 학습형 preprocessing의 fold-local fit boundary를 그릴 수 있다.',
          'OOF prediction과 fold/slice spread를 함께 evidence로 남길 수 있다.',
          'Public leaderboard를 반복 최적화 target과 구분할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'scikit-learn · Cross-validation', href: 'https://scikit-learn.org/stable/modules/cross_validation.html', note: 'KFold, stratification, group 및 time-aware splitter의 공식 설명.' },
          { label: 'scikit-learn · Common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html', note: 'Split-before-preprocessing과 Pipeline을 이용한 leakage 방지 지침.' },
        ]} />
      </section>
    </div>
  );
}
