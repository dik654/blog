import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaPair from './practical-tabular/FormulaPair';
import {
  BoostingResidualLab,
  TreeSystemChoiceLab,
} from './practical-tabular/viz/TabularEvidenceLabs';

export default function GradientBoostingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">첫 목표는 최고 점수가 아니라 믿을 수 있는 강한 기준선이다</h2>
        <QuestionLead
          question="LightGBM이 XGBoost보다 빠르다는 말을 들었다. 그렇다면 첫 실험부터 LightGBM의 모든 옵션을 튜닝하면 될까?"
          answer="아니다. 먼저 같은 row·target·split·metric에서 재현되는 작은 tree baseline을 닫아야 한다. 그 뒤 병목과 실패 slice를 관측하고, 동일 예산으로 구현 후보를 비교해야 모델 이름의 효과와 데이터 누출을 구분할 수 있다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 <InternalLink slug="eda-workflow">데이터 감사</InternalLink>와
            <InternalLink slug="feature-engineering">피처 계약</InternalLink>이 끝났다고 가정한다.
            행 생성 단위와 cutoff가 틀리면 강한 tree는 누출을 더 잘 학습한다. 또한
            <InternalLink slug="evaluation-metrics">평가 지표</InternalLink>가 실제 행동을
            표현하지 못하면 낮은 loss도 좋은 기준선이 아니다.
          </p>
          <p>
            Gradient boosting은 작은 tree를 순서대로 더해 현재 model이 남긴 오차를 보정한다.
            핵심은 “여러 tree를 쓴다”가 아니라 <strong>현재 손실이 다음 weak learner에게 무엇을
            고쳐야 하는지 신호를 준다</strong>는 데 있다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Weak learner', meaning: '혼자서는 단순한 규칙만 표현하는 얕은 decision tree', why: '각 round가 작은 수정만 맡아 전체 함수를 단계적으로 만든다.' },
          { term: 'Residual', meaning: '정답에서 현재 예측을 뺀 남은 차이', why: 'Squared loss에서는 다음 tree가 근사할 음의 기울기와 같다.' },
          { term: 'Functional gradient', meaning: '파라미터 하나가 아니라 현재 예측 함수의 출력을 어느 방향으로 바꿀지 나타낸 기울기', why: '분류·랭킹처럼 residual만으로 설명되지 않는 손실까지 같은 원리로 확장한다.' },
          { term: 'Shrinkage', meaning: '새 tree 출력을 learning rate η만큼 줄여 더하는 것', why: '한 round가 train noise를 과도하게 고치는 것을 줄인다.' },
          { term: 'Early stopping', meaning: '별도 validation evidence가 더 좋아지지 않을 때 round 추가를 멈추는 선택 절차', why: 'Tree 수를 validation에 맞추므로 split 경계와 checkpoint 기록이 필요하다.' },
        ]} />
        <BoostingResidualLab />
      </section>

      <section id="residual-gradient" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Squared error의 residual에서 일반 손실의 음의 기울기로</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            현재 model을 <strong>F<sub>m-1</sub></strong>이라 하자. 각 표본에서 손실을 조금
            줄이려면 예측값을 음의 기울기 방향으로 움직여야 한다. 새 tree는 그 방향을 표본 전체에서
            근사하고, learning rate만큼 작게 더해진다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\widehat y_i^{(m-1)}&=\underbrace{F_{m-1}(x_i)}_{\text{현재 예측}}\\[2pt]g_i^{(m)}&=\left.\frac{\partial\,\ell(y_i,\widehat y)}{\partial\widehat y}\right|_{\widehat y=\widehat y_i^{(m-1)}}\\[2pt]r_i^{(m)}&=\underbrace{-g_i^{(m)}}_{\text{손실을 줄일 방향}}\\[2pt]h_m&=\arg\min_h\sum_i\left(r_i^{(m)}-h(x_i)\right)^2\\[2pt]F_m(x)&=F_{m-1}(x)+\underbrace{\eta h_m(x)}_{\text{작게 더한 보정}}\end{aligned}`}
          meaning="표본별 손실 기울기의 반대 방향을 새 tree가 근사하고, η만큼만 더한다. 따라서 boosting은 이전 tree의 정답을 외우는 과정이 아니라 현재 함수의 오류 방향을 반복해서 보정하는 과정이다."
          symbols={[
            [String.raw`\ell(y_i,F(x_i))`, '표본 i의 정답과 현재 예측 사이 손실'],
            [String.raw`g_i^{(m)}`, 'Round m 직전 예측 출력에 대한 손실 기울기'],
            [String.raw`h_m`, '이번 round에서 학습한 weak tree'],
            [String.raw`\eta`, '한 tree의 보정 크기를 줄이는 learning rate'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Squared error를 <code>½(y-F)²</code>로 쓰면 기울기는 <code>F-y</code>이고, 음의
            기울기는 <code>y-F</code>, 즉 residual이다. Logistic loss에서는 음의 기울기가 현재
            확률 오차를 반영하며 단순한 raw label 차이와 같지 않다. 그래서 “boosting은 항상 residual을
            맞춘다”보다 “선택한 손실의 음의 기울기를 맞춘다”가 더 정확하다.
          </p>
        </div>
        <StopRule>Train loss가 계속 줄어든다는 이유만으로 round를 늘리지 않는다. 고정 OOF의 평균·worst slice·calibration과 latency가 release gate를 넘지 못하면 더 깊은 tree나 더 많은 round를 채택하지 않는다.</StopRule>
      </section>

      <section id="xgboost-objective" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">XGBoost는 leaf 하나의 이득을 gradient와 curvature로 계산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            XGBoost는 새 tree가 추가될 때의 손실 변화를 2차 Taylor 근사로 계산한다. 각 표본의
            1차 기울기 <strong>g</strong>는 내려갈 방향을, 2차 기울기 <strong>h</strong>는 그
            방향에서 손실이 얼마나 굽어 있는지를 말한다. 같은 leaf에 모인 표본의 값을 합치면 leaf
            weight와 split gain을 빠르게 계산할 수 있다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}G_j&=\underbrace{\sum_{i\in I_j}g_i}_{\text{leaf }j\text{의 1차 기울기 합}},\qquad H_j=\underbrace{\sum_{i\in I_j}h_i}_{\text{leaf }j\text{의 곡률 합}}\\[2pt]w_j^\star&=\underbrace{-\frac{G_j}{H_j+\lambda}}_{\text{정규화한 최적 leaf 보정값}}\\[2pt]\operatorname{Score}(I_j)&=\underbrace{-\frac12\frac{G_j^2}{H_j+\lambda}}_{\text{해당 leaf가 만드는 근사 목적값}}+\gamma\end{aligned}`}
          meaning="Leaf에 들어온 표본의 gradient와 curvature를 합치면 최적 보정값을 닫힌식으로 얻는다. λ는 큰 leaf weight를 줄이고 γ는 leaf를 하나 더 만드는 비용을 부과한다."
          symbols={[
            [String.raw`I_j`, 'Leaf j에 배정된 표본 집합'],
            [String.raw`G_j,H_j`, 'Leaf 안의 1차·2차 손실 미분 합'],
            [String.raw`\lambda`, 'Leaf weight의 L2 regularization 강도'],
            [String.raw`\gamma`, 'Tree에 leaf를 추가하는 복잡도 비용'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\begin{aligned}S_L&=\frac{G_L^2}{H_L+\lambda},\qquad S_R=\frac{G_R^2}{H_R+\lambda}\\[2pt]S_P&=\frac{(G_L+G_R)^2}{H_L+H_R+\lambda}\\[2pt]\operatorname{Gain}&=\underbrace{\frac12(S_L+S_R-S_P)}_{\text{분리해서 얻는 손실 감소}}-\underbrace{\gamma}_{\text{새 leaf 비용}}\end{aligned}`}
          meaning="여기서 S는 부호와 ½을 붙이기 전의 양수 raw 항이라 위의 Score(I)와 같은 값이 아니다. 부모를 좌우 child로 나눴을 때 raw 항의 증가가 복잡도 비용을 충분히 넘어야 split을 유지한다. Gain이 양수라는 사실은 validation 일반화를 자동 보장하지 않는다."
          symbols={[
            [String.raw`G_L,H_L`, '왼쪽 child의 gradient와 curvature 합'],
            [String.raw`G_R,H_R`, '오른쪽 child의 gradient와 curvature 합'],
            [String.raw`S_L,S_R,S_P`, '부호와 ½을 붙이기 전 좌·우 child와 부모의 양수 raw 항'],
          ]}
        />
        <Misconception>Histogram split은 연속값을 몇 개 bin으로 요약해 후보 탐색을 줄이는 구현 전략이다. “256개 bin이면 언제나 정확도 손실이 없다”거나 “정렬이 완전히 사라진다”는 보편 명제는 아니다. 구현·버전·parameter에 따라 전처리와 탐색 방식이 달라진다.</Misconception>
      </section>

      <section id="systems" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">세 라이브러리는 같은 목표를 다른 병목에서 최적화한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            XGBoost는 regularized tree objective, sparse-aware split, approximate split과 시스템
            최적화를 하나의 scalable package로 정리했다. LightGBM 원 논문은 histogram,
            leaf-wise growth, GOSS와 EFB로 큰 표에서의 효율을 노렸다. CatBoost는 ordered target
            statistics와 ordered boosting으로 범주형 피처를 label leakage 없이 다루려는 문제를
            정면으로 다뤘다.
          </p>
          <p>
            이것은 고정 순위가 아니다. 현재 library의 CPU/GPU 구현, data density, category
            cardinality, memory, tuning budget과 serving 환경이 결과를 바꾼다. 따라서 “100만 행이면
            무조건 LightGBM” 같은 표보다 <strong>병목에 맞는 후보를 같은 증거 계약으로 비교</strong>하는
            편이 안전하다.
          </p>
        </div>
        <TreeSystemChoiceLab />
      </section>

      <section id="validation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Early stopping도 fold 안에서 일어나는 model 선택이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Category encoder, imputer와 feature selector는 fold train으로만 fit한다. 각 fold의
            validation curve로 best iteration을 선택하고, 그 iteration과 prediction을 기록한다.
            모든 fold의 best round가 크게 다르면 한 숫자로 평균내기 전에 기간·group·slice별
            distribution shift를 본다.
          </p>
          <p>
            확률이 필요한 문제에서는 ranking metric이 좋아졌다고 threshold를 바로 고르지 않는다.
            OOF probability로 calibration을 진단하고, calibrator와 operating threshold는 model
            fitting과 분리된 evidence로 선택한다. 자세한 경계는
            <InternalLink slug="imbalanced-data">희귀 사건 의사결정</InternalLink>에서 이어진다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Baseline identity', 'Dataset·split·feature schema·metric·seed·library version과 compute budget을 고정한다.'],
            ['Fold fit', 'Encoder, tree와 early stopping을 각 fold train/validation 경계 안에서 다시 수행한다.'],
            ['OOF evidence', '평균뿐 아니라 fold 분산, group/time slice, calibration과 오류 상관을 저장한다.'],
            ['Release cost', 'Model size, p50/p95 latency, memory, missing/unseen fallback과 rollback artifact를 함께 비교한다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음 단계는 tree를 버리는 것이 아니라 승격 조건을 쓰는 것이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            강한 tree baseline이 남긴 오류가 텍스트·이미지 표현, 여러 task의 공유 표현, pretraining
            prior 또는 event order와 연결된다면 <InternalLink slug="tabular-deep-learning">테이블
            neural·foundation model</InternalLink>을 같은 split에서 추가한다. 단순히 새 논문이
            나왔거나 GPU가 있다는 이유로 승격하지 않는다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Squared loss의 residual이 일반 손실의 음의 기울기의 한 사례임을 설명할 수 있다.',
          'XGBoost leaf weight와 split gain에서 gradient, curvature, λ와 γ의 역할을 읽을 수 있다.',
          'XGBoost·LightGBM·CatBoost를 고정 순위가 아니라 데이터 병목별 후보로 비교할 수 있다.',
          'Early stopping과 preprocessing을 fold 경계 안에 넣어 OOF prediction을 만들 수 있다.',
          '성능·calibration·latency·fallback을 포함한 tree baseline release artifact를 정의할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          아래 원문은 algorithm mechanism의 근거다. 후보 선택 lab과 release gate는 이 경로의
          engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'Friedman · Greedy Function Approximation', href: 'https://projecteuclid.org/journals/annals-of-statistics/volume-29/issue-5/Greedy-function-approximation--A-gradient-boosting-machine/10.1214/aos/1013203451.full', note: '손실의 음의 기울기를 stage-wise additive model로 근사하는 gradient boosting의 원류.' },
          { label: 'Chen & Guestrin · XGBoost', href: 'https://www.kdd.org/kdd2016/papers/files/rfp0697-chenAemb.pdf', note: 'Regularized objective, sparsity-aware split와 scalable system 설계.' },
          { label: 'Ke et al. · LightGBM', href: 'https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html', note: 'GOSS와 EFB를 포함한 efficient GBDT 설계.' },
          { label: 'Prokhorenkova et al. · CatBoost', href: 'https://proceedings.neurips.cc/paper_files/paper/2018/hash/14491b756b3a51daac41c24863285549-Abstract.html', note: 'Ordered target statistics와 ordered boosting의 누출·prediction shift 문제.' },
        ]} />
      </section>
    </div>
  );
}
