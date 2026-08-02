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
import { FeatureCutoffLab } from './practical-data/viz/DataEvidenceLabs';

export default function FeatureEngineeringArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">피처는 column이 아니라 시점이 있는 주장이다</h2>
        <QuestionLead
          question="설비별 30일 평균 온도가 가장 강한 피처라면, 그 평균이 예측 이후의 측정과 validation 설비까지 포함해도 좋은 피처일까?"
          answer="아니다. 값이 강한 이유가 미래와 validation을 미리 요약했기 때문일 수 있다. 피처 설계는 원시 사실을 메커니즘에 맞는 신호로 바꾸되, prediction cutoff와 fold train 경계를 절대 넘지 않는 작업이다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 <InternalLink slug="eda-workflow">데이터 감사</InternalLink>에서 row, target,
            cutoff, group/time split이 고정됐다고 가정한다. 그 전에는 feature recipe를 늘리지 않는다.
            좋은 피처는 “점수가 오른 column”이 아니라 <strong>운영 시점에 재현 가능하고, 어떤
            메커니즘을 표현하며, OOF에서 안정적으로 기여한 변환</strong>이다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Fit state', meaning: '평균, vocabulary, category 통계처럼 데이터에서 배운 parameter', why: 'Validation을 포함해 계산하면 입력 자체가 target을 보지 않아도 누출된다.' },
          { term: 'Point-in-time correct', meaning: '각 예측 시점 이전에 실제로 존재한 기록만 사용한 상태', why: '현재 database의 최종 상태로 과거를 재구성하는 look-ahead를 막는다.' },
          { term: 'Unknown category', meaning: 'Train에는 없고 validation·production에 처음 나타난 범주', why: 'Encoder의 fallback과 drift policy가 없으면 배포에서 실패한다.' },
          { term: 'OOF ablation', meaning: '고정 split의 out-of-fold prediction에서 피처 묶음을 빼고 더해 비교', why: 'In-sample importance가 아니라 보지 않은 행의 증거로 기여를 판단한다.' },
          { term: 'Selection stability', meaning: 'Fold·seed·기간이 바뀌어도 선택 결과가 유지되는 정도', why: '한 번의 noisy ranking을 causal signal처럼 믿는 것을 막는다.' },
        ]} />
        <FeatureCutoffLab />
      </section>

      <section id="fit-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 fit과 transform을 분리한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Log처럼 행 하나만으로 계산되는 고정 함수는 별도 fit state가 없지만, median imputation,
            scaling, category vocabulary, frequency·target encoding, feature selection은 다른 행을
            본다. 교차 검증에서는 매 fold의 train 부분으로만 이 상태를 학습하고 validation에는
            고정된 상태를 적용한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\theta^{(k)}&=\operatorname{fit}\!\left(\underbrace{D_{\mathrm{train}}^{(k)}}_{\text{fold }k\text{의 학습 행만}}\right)\\[2pt]\widetilde X_{\mathrm{val}}^{(k)}&=\operatorname{transform}\!\left(\underbrace{X_{\mathrm{val}}^{(k)}}_{\text{처음 보는 검증 행}};\underbrace{\theta^{(k)}}_{\text{학습에서 고정한 상태}}\right)\end{aligned}`}
          meaning="Fold마다 preprocessing 상태 θ를 train 행만으로 다시 학습한다. Validation은 θ를 바꾸지 않고 transform만 받아야 OOF score가 새로운 데이터 성능을 모사한다."
          symbols={[
            [String.raw`\theta^{(k)}`, 'Fold k에서 학습한 imputer, scaler, encoder 또는 selector 상태'],
            [String.raw`D_{\mathrm{train}}^{(k)}`, '해당 fold의 model과 변환이 볼 수 있는 전체 학습 자료'],
            [String.raw`\widetilde X_{\mathrm{val}}^{(k)}`, 'Train 상태로 변환한 validation 입력'],
          ]}
        />
        <StopRule>Feature table을 한 번 전체 생성한 뒤 fold만 나누는 pipeline이라면, 각 연산이 row-local인지 data-fitted인지 분류하기 전에는 결과를 채택하지 않는다.</StopRule>
      </section>

      <section id="numeric-categorical" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">숫자와 범주는 model이 놓치는 구조만 보완한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            표준화는 단위 차이에 민감한 linear model, 거리 기반 model과 neural network에 중요하지만,
            tree split에는 같은 의미가 아닐 수 있다. Log 변환은 양의 값에서 비율 차이를 표현할 때
            유용하지만 0·음수와 inverse transform 정책이 필요하다. Binning은 threshold 효과를
            드러낼 수 있지만 경계 선택을 전체 data에 맞추면 또 하나의 fit state다.
          </p>
          <p>
            One-hot encoding은 범주 사이의 가짜 순서를 만들지 않지만 vocabulary가 커질 수 있다.
            Ordinal encoding은 실제 순서가 있을 때만 쓴다. Frequency encoding은 target을 직접 보지
            않아도 validation의 category 빈도를 전체 data에서 계산하면 distribution 정보를 미리
            본다. Unknown category는 error, all-zero, reserved bucket 중 정책을 manifest에 고정한다.
          </p>
          <p>
            Target encoding은 category별 평균 label을 사용하므로 특히 강한 누출 통로다. 행 자신과
            validation label을 빼는 out-of-fold encoding, smoothing, unseen fallback을 함께 설계한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}n_c^{(k)}&=\underbrace{\sum_{i\in D_{\mathrm{train}}^{(k)}}\mathbf{1}[x_i=c]}_{\text{fold train의 category 개수}}\\[2pt]s_c^{(k)}&=\underbrace{\sum_{i\in D_{\mathrm{train}}^{(k)}}\mathbf{1}[x_i=c]y_i}_{\text{fold train의 양성 합}}\\[2pt]\operatorname{TE}^{(k)}(c)&=\frac{\underbrace{s_c^{(k)}+\alpha\mu^{(k)}}_{\text{희귀 범주를 전체 평균으로 완화}}}{n_c^{(k)}+\alpha}\end{aligned}`}
          meaning="Validation 행의 category 값은 fold train에서 계산한 target 평균으로만 변환한다. α smoothing은 표본이 적은 category의 극단값을 fold-train 전체 평균 μ 쪽으로 당긴다."
          symbols={[
            [String.raw`c`, '인코딩할 category'],
            [String.raw`n_c^{(k)},s_c^{(k)}`, 'Fold train에서 센 category 개수와 양성 합'],
            [String.raw`\mu^{(k)}`, 'Fold k의 train label 전체 평균'],
            [String.raw`\alpha`, '희귀 category를 완화하는 smoothing 강도'],
          ]}
        />
        <Misconception>“Tree model은 preprocessing이 필요 없다”는 말은 scaling에 한정해도 과장이다. 단위 오류, cutoff, missingness, category 처리와 target leakage는 model 종류와 무관하게 남는다.</Misconception>
      </section>

      <section id="time-aggregate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">집계는 group보다 cutoff가 먼저다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “설비별 평균”만 쓰면 과거와 미래를 합친다. 각 prediction row마다 cutoff 이전 event만
            모으고, window start와 end를 명시한다. 데이터베이스의 현재 snapshot에서 `groupby`한
            값이 아니라 과거 시점으로 replay 가능한 as-of join이 필요하다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\overline x_{g,[t-h,t)}=\frac{\underbrace{\sum_j \mathbf{1}[g_j=g]\mathbf{1}[t-h\le t_j<t]x_j}_{\text{같은 group의 cutoff 이전 event만 합산}}}{\underbrace{\sum_j \mathbf{1}[g_j=g]\mathbf{1}[t-h\le t_j<t]}_{\text{실제로 관측된 과거 event 수}}}`}
          meaning="Group g의 prediction 시각 t에서 길이 h인 과거 window만 평균낸다. t 이후 event와 현재 행의 label 결과는 들어가지 않는다."
          symbols={[
            [String.raw`t`, 'Prediction cutoff'],
            [String.raw`h`, '과거를 얼마나 볼지 정한 window 길이'],
            [String.raw`t_j`, '원시 event j가 실제로 발생한 시각'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            비율 피처는 denominator가 0에 가까울 때 폭발하고, interaction은 조합 수가 빠르게 늘어난다.
            먼저 domain mechanism을 한 문장으로 적는다. “부하/정격 용량은 설비마다 다른 크기를
            정규화한다”는 주장은 검증 가능하지만 “모든 column을 곱해 본다”는 것은 탐색 예산을
            validation에 전가한다.
          </p>
        </div>
      </section>

      <section id="selection" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Importance는 존재 증명이 아니라 model 의존 진단이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Tree impurity importance는 고유값이 많은 feature를 선호할 수 있다. Permutation
            importance는 validation에서 한 column을 섞었을 때 score가 얼마나 떨어지는지 보지만,
            서로 강하게 상관된 feature가 정보를 대신하면 둘 다 낮게 보일 수 있다. SHAP도 선택한
            model과 background data의 설명이지 인과 효과의 자동 증명이 아니다.
          </p>
          <p>
            선택은 pipeline 안에서 수행하고, 고정 split의 OOF에서 피처 묶음별 ablation을 비교한다.
            Fold와 기간별 기여 방향, worst slice, inference cost와 missingness drift까지 본다. 작은
            개선이 반복 변동보다 작거나 선택 목록이 fold마다 완전히 바뀌면 feature를 더 늘리기보다
            data contract를 다시 본다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Mechanism', '이 feature가 target과 연결되는 현실 과정을 한 문장으로 설명한다.'],
            ['Availability', 'Cutoff 이전에 production query로 같은 값을 재현한다.'],
            ['Ablation', '고정 OOF에서 묶음을 더하고 빼며 예상 slice의 변화를 본다.'],
            ['Stability', 'Fold·seed·기간마다 기여 방향과 선택 빈도를 기록한다.'],
            ['Cost', '산출 latency, freshness, storage와 실패 fallback을 release manifest에 넣는다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최종 산출물은 feature schema와 OOF evidence다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Feature 이름, dtype, source, owner, event timestamp, cutoff rule, fit state, unknown/missing
            policy, version과 checksum을 schema에 남긴다. Training과 serving이 같은 변환 코드를
            공유하거나 최소한 golden-row fixture로 같은 결과를 내는지 검사한다.
          </p>
          <p>
            이 분기는 다시 <InternalLink slug="cross-validation">교차 검증</InternalLink>과
            <InternalLink slug="experiment-tracking">실험 장부</InternalLink>로 돌아가야 끝난다.
            Feature가 늘었다는 사실이 아니라 재현 가능한 OOF delta와 운영 query가 release 근거다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Row-local 변환과 data-fitted 변환을 구분해 fold 내부 pipeline을 만들 수 있다.',
          'Target encoding과 aggregate를 cutoff·OOF 경계 안에서 계산할 수 있다.',
          'Unknown category, missing value와 denominator failure 정책을 명시할 수 있다.',
          'Importance를 model 의존 진단으로 읽고 ablation·stability evidence로 선택할 수 있다.',
          'Training-serving feature schema와 point-in-time replay를 release artifact로 남길 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Pipeline, feature selection과 permutation importance의 API·주의점은 아래 공식 문서에
          근거한다. Point-in-time manifest와 채택 gate는 이 경로의 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'scikit-learn · Common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html', note: 'Preprocessing을 train에만 fit하고 Pipeline으로 leakage를 줄이는 공식 원칙.' },
          { label: 'scikit-learn · Feature selection', href: 'https://scikit-learn.org/stable/modules/feature_selection.html', note: 'Selector 종류와 Pipeline 안에서의 사용 범위.' },
          { label: 'scikit-learn · Permutation importance', href: 'https://scikit-learn.org/stable/modules/permutation_importance.html', note: 'Validation permutation 계산과 correlated feature 해석의 한계.' },
        ]} />
      </section>
    </div>
  );
}
