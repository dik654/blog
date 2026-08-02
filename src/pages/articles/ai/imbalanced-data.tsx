import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaPair from './practical-data/FormulaPair';
import { RareEventDecisionLab, ResamplingBoundaryLab } from './practical-data/viz/DataEvidenceLabs';
import M from '@/components/ui/math';

export default function ImbalancedDataArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">불균형은 비율이 아니라 희귀 사건의 의사결정 문제다</h2>
        <QuestionLead
          question="고장률이 0.7%이고 하루 120건만 점검할 수 있다면, 데이터를 50:50으로 만들고 threshold 0.5를 쓰면 해결될까?"
          answer="아니다. Resampling은 학습 신호를 바꾸고, calibration은 score를 확률에 맞추며, threshold·top-k는 행동 용량을 정한다. 네 책임을 분리하고 자연 prevalence의 validation에서 함께 평가해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 <InternalLink slug="eda-workflow">데이터 감사</InternalLink>로 label 지연,
            duplicate, group/time split과 base rate를 확인한다. 사건이 드문 이유가 실제 희귀성인지,
            label 누락인지, 수집 policy인지 다르면 대응도 달라진다. 양성 count가 너무 적으면 ratio보다
            fold마다 사건이 몇 개 있는지와 confidence range가 먼저다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Prevalence', meaning: '평가 population에서 실제 양성이 차지하는 비율', why: 'Precision, calibration과 운영 workload 해석의 기준이다.' },
          { term: 'Average precision', meaning: 'Recall이 증가하는 지점의 precision을 요약한 ranking metric', why: '희귀 양성의 상위 ranking 품질을 보지만 특정 용량의 행동은 별도다.' },
          { term: 'Resampling', meaning: 'Train에서 class 표본 수나 분포를 바꾸는 개입', why: 'Model이 보는 학습 신호를 바꾸지만 운영 prevalence를 바꾸지는 않는다.' },
          { term: 'Class weighting', meaning: 'Class별 오류가 loss에 기여하는 크기를 바꾸는 개입', why: '표본을 합성하지 않고 minority gradient의 책임을 키운다.' },
          { term: 'Calibration', meaning: 'Score를 실제 사건 빈도와 맞는 확률로 해석하게 하는 절차', why: 'Cost threshold와 자원 배분에 probability가 필요할 때 쓴다.' },
          { term: 'Decision policy', meaning: '확률·score를 경보, top-k와 행동으로 바꾸는 규칙', why: 'Model을 다시 학습하지 않고도 비용과 용량 변화에 맞춰 조정할 수 있다.' },
        ]} />
        <RareEventDecisionLab />
      </section>

      <section id="metrics" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 count, ranking, probability와 action을 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            10,000건 중 양성 70건에서 모두 음성이라고 답하면 accuracy는 99.3%다. 그래서 confusion
            matrix의 절대 count, precision과 recall을 먼저 본다. ROC AUC는 전체 양성·음성 쌍의
            ranking을 보지만, 음성이 매우 많으면 작은 false-positive rate도 수백 건의 false alarm이
            될 수 있다. PR curve와 average precision(AP)을 함께 보고 실제 용량이 120건이면
            Precision@120과 Recall@120을 직접 계산한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\underbrace{\mathrm{Precision}}_{\text{경보 중 실제 사건}}&=\frac{TP}{TP+FP}\\[3pt]\underbrace{\mathrm{Recall}}_{\text{실제 사건 중 포착}}&=\frac{TP}{TP+FN}\end{aligned}`}
          meaning="Precision은 조사 workload의 순도를, recall은 놓치지 않은 사건의 비율을 묻는다. 같은 model도 prevalence와 threshold가 바뀌면 두 값이 달라진다."
          symbols={[
            [String.raw`TP`, '맞게 경보한 희귀 사건'],
            [String.raw`FP`, '불필요한 경보'],
            [String.raw`FN`, '놓친 실제 사건'],
          ]}
        />
        <Misconception>PR-AUC와 average precision은 구현에 따라 같은 이름처럼 쓰이기도 하지만 계산 정의가 항상 동일한 것은 아니다. 도구의 metric 정의와 interpolation을 manifest에 고정한다.</Misconception>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Metric bundle 설계는 <InternalLink slug="evaluation-metrics">평가 지표</InternalLink>에서
            더 깊게 다룬다. 여기서는 AP를 primary ranking evidence, Recall@capacity를 action
            evidence, log loss·reliability curve를 probability evidence, fold·time slice를 stability
            evidence로 함께 둔다.
          </p>
        </div>
      </section>

      <section id="resampling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Resampling은 split 뒤 fold train 안에서만 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Random oversampling은 기존 minority sample을 반복해 gradient 빈도를 높이고, undersampling은
            majority 정보를 버리는 대신 계산을 줄인다. SMOTE는 가까운 minority sample 사이를
            보간한다. 어느 방법도 보편적으로 우월하지 않다. Duplicate memorization, 정보 손실,
            invalid synthetic point와 class overlap을 서로 다른 위험으로 비교한다.
          </p>
          <p>
            전체 dataset을 먼저 resample하면 synthetic 이웃 관계가 validation 정보를 사용하고,
            validation prevalence도 실제 운영과 달라진다. Group/time split manifest를 먼저 만든 뒤
            각 fold의 train에만 sampler를 fit_resample한다. Validation과 untouched test는 자연
            분포를 유지한다.
          </p>
        </div>
        <ResamplingBoundaryLab />
        <StopRule>Resampling 전후 class count, parent row와 fold membership을 추적할 수 없거나 validation prevalence가 바뀌었다면 해당 score를 폐기한다.</StopRule>
      </section>

      <section id="optimization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Class weight와 focal loss는 gradient 책임을 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Class weight는 minority 오류에 더 큰 loss를 주는 단순한 출발점이다. Focal loss는 정답
            class 확률이 높은 쉬운 예제의 기여를 줄여 어려운 예제에 집중한다. 이는 imbalance ratio만
            보고 자동 선택하는 공식이 아니다. Label noise와 hard negative(정답처럼 보이지만 실제로는
            음성인 어려운 사례)가 많은 data에서는 어려운 오답에 과도하게 집중할 수도 있다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\operatorname{FL}(p_t)=-\underbrace{\alpha_t}_{\text{class별 책임}}\underbrace{(1-p_t)^\gamma}_{\text{쉬운 예제의 기여를 줄임}}\underbrace{\log p_t}_{\text{정답 확률의 log loss}}`}
          meaning="-log p_t는 정답 확률이 1에 가까우면 0에 가까운 벌점, 0에 가까우면 큰 벌점으로 바꾼다. 독립 표본의 정답 확률을 곱해 평가하는 likelihood도 log를 취하면 표본별 손실의 합으로 계산할 수 있다. Cross entropy는 이 정답 class의 negative log-probability를 평균한 손실이다. (1-p_t)^γ는 이미 쉬운 예제의 기여를 더 줄이며, γ=0이면 α-weighted cross entropy로 돌아간다."
          symbols={[
            [String.raw`p_t`, '실제 정답 class에 model이 준 확률'],
            [String.raw`\alpha_t`, 'Class별 loss 가중치'],
            [String.raw`\gamma`, '쉬운 예제를 얼마나 강하게 낮출지 정하는 focusing parameter'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 split과 metric bundle에서 unweighted baseline, class weight, sampler, focal
            loss를 독립 ablation한다. 여러 개입을 한 번에 결합하고 점수가 오르면 무엇이 기여했는지
            알 수 없다. Worst time/group slice와 calibration도 함께 본다.
          </p>
        </div>
      </section>

      <section id="calibration-threshold" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 순위, 맞는 확률과 행동 threshold는 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Resampling과 class-weighted loss 뒤의 raw score는 실제 prevalence의 posterior
            probability가 아닐 수 있다. 비용 기반 threshold를 쓰려면 independent calibration set
            또는 OOF prediction으로 calibrator를 fit하고, 또 다른 evaluation boundary에서 probability
            quality와 policy를 검사한다. 같은 prediction으로 calibrator와 threshold를 고르고 성능까지
            보고하면 낙관적이다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}C_+(t)&=\underbrace{C_{\mathrm{FP}}\,FP(t)}_{\text{불필요한 행동 비용}}\\[2pt]C_-(t)&=\underbrace{C_{\mathrm{FN}}\,FN(t)}_{\text{놓친 사건 비용}}\\[2pt]t^\star&=\arg\min_{t\in\mathcal T}\left[C_+(t)+C_-(t)\right]\\[-1pt]&\phantom{=}\text{s.t.}\quad\underbrace{N_{\mathrm{alert}}(t)\le K}_{\text{처리 용량 제한}}\end{aligned}`}
          meaning="Threshold t마다 false alarm과 missed event의 비용을 합하고, 하루 처리 용량 K를 넘지 않는 후보 중 최소 비용을 고른다. 비용과 용량은 validation evidence에서 결정하며 test에는 한 번 적용한다."
          symbols={[
            [String.raw`C_{\mathrm{FP}},C_{\mathrm{FN}}`, 'False positive와 false negative 한 건의 업무 비용'],
            [String.raw`C_+(t),C_-(t)`, 'Threshold t에서 발생한 false alarm 비용과 missed-event 비용'],
            [String.raw`N_{\mathrm{alert}}(t)`, 'Threshold t에서 발생하는 전체 경보 수'],
            [String.raw`K`, '실제로 처리할 수 있는 경보 용량'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            확률이 calibration되고 오직 FP·FN 비용만 있으며 행동 용량 제약이 없다면
            <M>{String.raw`C_{\mathrm{FP}}/(C_{\mathrm{FP}}+C_{\mathrm{FN}})`}</M> 형태의 Bayes threshold를 유도할 수 있다. 그러나 확률이
            calibration되지 않았거나 score 순위만 의미 있거나 top-k capacity가 고정이면 이 식을
            기계적으로 적용하지 않는다. 실제 empirical cost curve를 본다.
          </p>
        </div>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Release artifact는 model과 policy를 따로 보존한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Model artifact에는 training prevalence, sampler/weight/loss config와 feature schema를
            남긴다. Calibration artifact에는 method, fit rows, probability metric과 validity
            period를 남긴다. Policy artifact에는 threshold 또는 K, cost matrix, capacity, guardrail,
            owner와 재검토 조건을 남긴다. Base rate나 업무 용량이 바뀌면 model을 재학습하지 않아도
            policy와 calibration을 먼저 재감사할 수 있다.
          </p>
          <p>
            최종 비교는 <InternalLink slug="cross-validation">고정 split</InternalLink>의 OOF,
            <InternalLink slug="experiment-tracking">run manifest</InternalLink>와 untouched test로
            닫는다. “1:100이므로 SMOTE”가 아니라 어떤 개입이 어떤 책임의 evidence를 개선했는지
            남긴다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Prevalence와 절대 양성 count, precision·recall·AP·top-k의 책임을 구분할 수 있다.',
          'Sampler를 group/time split 뒤 각 fold train 내부에 배치할 수 있다.',
          'Class weight, focal loss, calibration과 threshold를 서로 다른 개입으로 비교할 수 있다.',
          '비용과 처리 용량을 empirical threshold policy로 번역할 수 있다.',
          'Model, calibrator와 decision policy를 독립 artifact로 versioning할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Resampling leakage, calibration과 metric 정의는 아래 공식 문서에 근거한다. 네 책임의
          release artifact와 capacity gate는 이 경로의 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'imbalanced-learn · Common pitfalls', href: 'https://imbalanced-learn.org/stable/common_pitfalls.html', note: '전체 data resampling의 leakage와 train-only Pipeline 사용 원칙.' },
          { label: 'scikit-learn · Model evaluation', href: 'https://scikit-learn.org/stable/modules/model_evaluation.html', note: 'Precision, recall, average precision, ROC AUC와 probability metric 정의.' },
          { label: 'scikit-learn · Probability calibration', href: 'https://scikit-learn.org/stable/modules/calibration.html', note: '독립 data와 cross-validation을 이용한 calibrator fit 경계.' },
          { label: 'Lin et al. · Focal Loss', href: 'https://arxiv.org/abs/1708.02002', note: '쉬운 예제의 loss 기여를 낮추는 focal loss 원 정의.' },
        ]} />
      </section>
    </div>
  );
}
