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
import { MetricDecisionLab } from './practical-strategy/viz/CompetitionEvidenceLabs';

function FormulaPair({
  formula,
  meaning,
  symbols,
}: {
  formula: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-6 min-w-0 overflow-hidden border-y border-border px-1 py-4 sm:px-3">
      <MathFormula display>{formula}</MathFormula>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function EvaluationMetricsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Metric은 점수판이 아니라 행동 계약이다</h2>
        <QuestionLead
          question="ROC AUC가 0.99면 하루 500건만 조사하는 사기 탐지 시스템도 좋은가?"
          answer="알 수 없다. ROC AUC는 모든 threshold의 전역 순위를 요약하지만, 조사 용량 안의 Recall@500, 희귀 양성에서의 precision, 확률의 calibration과 오류 비용은 별도로 계약해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Metric을 먼저 고르고 문제를 끼워 맞추면 model은 숫자를 잘 맞추면서 업무를 망칠 수 있다.
            먼저 prediction이 순위를 만드는지, 금액을 추정하는지, 확률로 자원을 배분하는지, threshold로
            행동을 발동하는지 묻는다. 그 뒤에 <strong>주 선택 지표(primary metric), 악화를 막을
            가드레일(guardrail), 부분집합 지표(slice), 반복 변동(uncertainty), 행동 기준
            (threshold policy)</strong>을 하나의 묶음으로 고정한다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Ranking quality', meaning: '양성을 음성보다 앞에 놓는 능력', why: '후보 우선순위를 만들지만 확률의 정확성이나 실제 처리 용량은 보장하지 않는다.' },
          { term: 'Calibration', meaning: '0.8이라고 예측한 집합에서 실제 사건이 약 80% 일어나는 성질', why: '확률로 비용, 손실 대비 적립금과 개입 강도를 정할 때 필요하다.' },
          { term: 'Threshold policy', meaning: 'Score를 행동으로 바꾸는 기준과 갱신 규칙', why: 'F1이 가장 높은 threshold와 운영 비용이 최소인 threshold는 다를 수 있다.' },
          { term: 'Slice metric', meaning: '신규 고객, 특정 월처럼 위험한 부분집합의 성능', why: '전체 평균이 작은 집단의 붕괴를 숨기는 것을 막는다.' },
          { term: 'Guardrail', meaning: 'Primary score가 올라도 악화되어서는 안 되는 보호 지표', why: '전체 평균 개선이 특정 집단의 오탐, latency 또는 비용 증가를 숨기는 것을 막는다.' },
          { term: 'Uncertainty', meaning: 'Fold·seed·표본 재추출에 따라 score가 흔들리는 범위', why: '0.001 상승이 실제 signal인지 우연한 변동인지 구분하는 기준이 된다.' },
        ]} />
        <MetricDecisionLab />
      </section>

      <section id="regression" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">회귀: 큰 오차를 얼마나 더 무겁게 볼 것인가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            MAE는 각 오차의 절댓값을 같은 비율로 센다. RMSE는 제곱한 뒤 평균하므로 큰 오차 하나가
            훨씬 더 많은 책임을 진다. 둘 중 어느 것이 “더 좋은 지표”가 아니라, 예측을 10만큼
            틀리는 일이 1만큼 열 번 틀리는 일보다 얼마나 더 비싼지가 선택을 결정한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\operatorname{MAE}=\frac{1}{n}\sum_{i=1}^{n}\underbrace{\left|y_i-\hat y_i\right|}_{\text{오차를 같은 비율로 계산}}`}
          meaning="MAE는 한 표본의 오차가 두 배가 되면 벌점도 두 배가 된다. Median에 가까운 예측을 선호하고 outlier의 영향이 비교적 작다."
          symbols={[
            [String.raw`y_i`, '실제 값'],
            [String.raw`\hat y_i`, '모델의 예측 값'],
            [String.raw`n`, '평가 표본 수'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\operatorname{RMSE}=\sqrt{\frac{1}{n}\sum_{i=1}^{n}\underbrace{(y_i-\hat y_i)^2}_{\text{큰 오차를 더 강하게 벌점}}}`}
          meaning="RMSE는 큰 오차를 제곱해 더 민감하게 반응한다. 단위는 원래 target과 같지만, 값 자체를 평균 오차처럼 단순 해석하면 안 된다."
          symbols={[
            [String.raw`(y_i-\hat y_i)^2`, '부호를 없애고 큰 오차의 책임을 키운 항'],
            [String.raw`\sqrt{\cdot}`, '제곱 단위를 원래 target 단위로 되돌리는 연산'],
          ]}
        />
        <Misconception>RMSLE(Root Mean Squared Logarithmic Error)는 실제값과 예측값에 `log(1+x)`를 적용한 뒤 계산하는 RMSE다. 단순히 “큰 값의 영향을 줄이는 RMSE”가 전부가 아니며, 음수 target에는 그대로 쓸 수 없고 비율 오차가 의미 있다는 domain 가정이 필요하다.</Misconception>
      </section>

      <section id="classification" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">분류: 맞혔는가보다 어떤 오류를 냈는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Precision은 경보 중 진짜 사건의 비율이고, recall은 실제 사건 중 잡아낸 비율이다.
            양성률 0.8%인 문제에서 accuracy 99.2%는 전부 음성이라고 답해도 얻는다. 그래서 먼저
            confusion matrix를 raw count로 보고, 업무 용량과 놓친 사건의 비용을 연결해야 한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\underbrace{\mathrm{Precision}}_{\text{경보의 신뢰도}}=\frac{TP}{TP+FP},\qquad \underbrace{\mathrm{Recall}}_{\text{사건의 포착률}}=\frac{TP}{TP+FN}`}
          meaning="Precision과 recall은 같은 confusion matrix를 다른 질문으로 읽는다. 전자는 조사할 가치, 후자는 놓친 사건의 규모를 본다."
          symbols={[
            [String.raw`TP`, '맞게 잡아낸 양성'],
            [String.raw`FP`, '잘못 울린 경보'],
            [String.raw`FN`, '놓친 실제 양성'],
          ]}
        />
        <FormulaPair
          formula={String.raw`F_{\beta}=(1+\beta^2)\frac{\underbrace{PR}_{\text{두 기준을 함께 만족}}}{\underbrace{\beta^2P+R}_{\text{recall 가중치를 조절}}}`}
          meaning="Precision과 recall을 곱하므로 한쪽이 0에 가까우면 전체도 낮아진다. β가 1보다 크면 recall을 더 중시하지만, 비용과 처리 용량을 자동으로 알아내지는 못한다."
          symbols={[
            [String.raw`P`, 'Precision'],
            [String.raw`R`, 'Recall'],
            [String.raw`\beta`, 'Recall을 precision보다 얼마나 더 중시할지 정하는 가중치'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            ROC AUC는 무작위 양성 하나가 무작위 음성보다 높은 score를 받을 확률로 해석할 수 있다.
            희귀 사건에서 FPR은 전체 음성 수로 나눈 비율이므로, 낮은 FPR도 절대 건수로는 감당하기
            어려운 false positive가 될 수 있다. 따라서 precision-recall curve와 average precision
            (AP, 여러 recall 구간의 precision을 요약한 값)을 함께 보고, 실제 용량이 고정이면
            Recall@K와 Precision@K를 직접 계산한다.
          </p>
        </div>
      </section>

      <section id="ranking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">랭킹: 앞쪽의 순서가 정말 더 중요한가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            검색과 추천에서는 정답을 찾았는지만큼 어디에 놓았는지가 중요하다. Average precision은
            relevant item을 만날 때마다 그 위치까지의 precision을 모은 뒤 정답 수로 평균낸다.
            NDCG(Normalized Discounted Cumulative Gain)는 높은 relevance를 앞에 둘수록 큰 gain을
            주고 이상적인 순서의 점수로 정규화한다. 이때 query 또는 user별로 후보 수와 정답 수가
            다르면 전체 행을 한 번에 평균내지 말고 평가 단위를 먼저 고정해야 한다.
          </p>
          <p>
            Top-K metric은 처리 용량을 표현하지만 K 밖의 품질을 보지 않는다. 반대로 global AUC는
            전체 순위를 보지만 첫 500개에 성능을 집중해야 한다는 정책을 표현하지 않는다. 따라서
            primary와 guardrail을 함께 둔다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\mathrm{DCG}@K&=\sum_{r=1}^{K}\frac{\underbrace{2^{\mathrm{rel}_r}-1}_{\text{관련도가 높을수록 큰 이득}}}{\underbrace{\log_2(r+1)}_{\text{뒤 순위일수록 할인}}}\\[2pt]\mathrm{NDCG}@K&=\frac{\underbrace{\mathrm{DCG}@K}_{\text{현재 순서의 점수}}}{\underbrace{\mathrm{IDCG}@K}_{\text{이상적 순서의 최대 점수}}}\end{aligned}`}
          meaning="DCG는 높은 관련 문서를 앞에 둘수록 크게 보상한다. NDCG는 query마다 다른 정답 수와 relevance 규모를 이상적 순서로 나누어 비교한다."
          symbols={[
            [String.raw`\mathrm{rel}_r`, '순위 r에 놓인 item의 relevance grade'],
            [String.raw`r`, '검색 결과의 순위 위치'],
            [String.raw`\mathrm{IDCG}@K`, '같은 후보를 relevance 내림차순으로 놓았을 때의 DCG'],
          ]}
        />
      </section>

      <section id="calibration" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">확률: 순서가 맞아도 숫자는 틀릴 수 있다</h2>
        <FormulaPair
          formula={String.raw`\operatorname{LogLoss}=-\frac{1}{n}\sum_{i=1}^{n}\underbrace{\left[y_i\log p_i+(1-y_i)\log(1-p_i)\right]}_{\text{정답에 준 확률의 책임}}`}
          meaning="정답에 매우 낮은 확률을 주면 큰 벌점을 받는다. Score 순서만 맞으면 되는 AUC와 달리 확률의 크기까지 평가한다."
          symbols={[
            [String.raw`p_i`, '표본 i가 양성일 예측 확률'],
            [String.raw`y_i\in\{0,1\}`, '실제 class label'],
            [String.raw`\log`, '과도하게 확신한 오답을 크게 벌주는 로그 함수'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Calibration model도 학습기다. 같은 validation prediction으로 확률 보정기(calibrator)를 fit하고 그
            결과를 다시 평가하면 낙관적이다. Calibration set을 따로 두거나 nested validation(선택용
            내부 분할과 평가용 외부 분할) 또는 OOF(out-of-fold, 해당 행을 학습하지 않은 fold model의
            예측) 절차를 사용하고, threshold 역시 최종 audit set을 보기 전에 정한다. Brier score는
            예측 확률과 0/1 label의 제곱 오차를 평균하며, reliability curve는 비슷한 예측 확률 구간의
            실제 양성 빈도를 비교한다.
          </p>
        </div>
      </section>

      <section id="metric-bundle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">하나의 우승 숫자 대신 metric bundle을 남긴다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Primary', '실험의 주된 선택 기준. 예: Average precision'],
            ['Action', '운영 용량에서의 결과. 예: Recall@500, review당 적중 수'],
            ['Guardrail', '좋아져서는 안 되는 실패. 예: 신규 고객 false-positive rate'],
            ['Probability', '확률 의미. 예: Log loss, Brier score, reliability curve'],
            ['Uncertainty', 'Fold/seed spread와 confidence interval 또는 bootstrap range'],
            ['Policy', 'Threshold를 누가 어떤 data로 언제 다시 정할지'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <StopRule>Primary score 하나만 높고 action, slice, calibration 또는 uncertainty를 설명할 수 없다면 model 선택을 확정하지 않는다.</StopRule>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음은 <InternalLink slug="cross-validation">교차 검증</InternalLink>이다. Metric이
            옳아도 같은 고객과 미래 정보가 train과 validation에 섞이면 그 숫자를 믿을 수 없다.
          </p>
        </div>
        <CapabilityCheck items={[
          'MAE와 RMSE를 오류 비용 구조로 선택할 수 있다.',
          'ROC AUC, average precision, top-k와 calibration의 책임을 구분할 수 있다.',
          'Threshold를 model score와 분리된 운영 정책으로 다룰 수 있다.',
          'Primary, guardrail, slice, uncertainty를 metric bundle로 고정할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Metric 정의와 calibration 원리는 아래 공식 문서에 근거한다. Primary·guardrail·slice를
          업무 계약으로 묶고 stop rule로 운영하는 방식은 이 학습 경로가 제안하는 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'scikit-learn · Metrics and scoring', href: 'https://scikit-learn.org/stable/modules/model_evaluation.html', note: '분류·회귀·랭킹 metric 정의와 scoring API의 공식 기준.' },
          { label: 'scikit-learn · Probability calibration', href: 'https://scikit-learn.org/stable/modules/calibration.html', note: 'Calibration curve, calibrator와 proper scoring rule의 공식 설명.' },
        ]} />
      </section>
    </div>
  );
}
