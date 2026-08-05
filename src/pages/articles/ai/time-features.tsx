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
  RollingWindowLab,
  TemporalCutoffLab,
} from './practical-tabular/viz/TabularEvidenceLabs';

export default function TimeFeaturesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">시간 피처의 첫 질문은 “언제 일어났나”가 아니라 “언제 알았나”다</h2>
        <QuestionLead
          question="거래는 10:01에 발생했고 warehouse에는 10:07에 도착했다. 10:05에 내린 예측의 과거 피처에 이 거래를 넣어도 될까?"
          answer="안 된다. 현실에서는 10:05에 아직 알 수 없었다. 과거 training row도 당시 시스템이 본 상태를 재생해야 하므로 event time과 availability time이 모두 cutoff 조건을 통과해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 <InternalLink slug="eda-workflow">데이터 감사</InternalLink>에서 entity,
            target과 예측 단위를 정했다고 가정한다. 시간 피처는 timestamp column을 분해하는 기술
            모음이 아니다. 각 prediction row의 시각으로 돌아가 <strong>그때 실제로 존재했던
            사실만 재생하는 query</strong>다.
          </p>
          <p>
            같은 사건에도 여러 clock이 있다. 현실에서 일어난 시각, source가 기록한 시각, pipeline이
            수집한 시각, feature가 materialize된 시각과 label이 확정된 시각이 다를 수 있다. 하나의
            `timestamp`로 합치면 offline에서는 보였지만 online에서는 없던 정보가 조용히 섞인다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Entity', meaning: '피처 history를 묶을 설비, 사용자, 계정 같은 주체', why: '다른 entity의 미래·통계를 잘못 합치는 join 오류를 막는다.' },
          { term: 'Event time', meaning: '현실에서 사건이 발생한 시각', why: '어느 관측 window에 속하는지 정한다.' },
          { term: 'Availability time', meaning: '예측 system이 그 사건을 사용할 수 있게 된 시각', why: '늦게 도착한 과거 사건을 역사적 row가 미리 보는 offline leakage를 막는다.' },
          { term: 'Prediction cutoff', meaning: 'Feature 관측을 닫고 예측을 방출하는 시각 t', why: 'Feature window의 오른쪽 끝과 label horizon의 시작을 분리한다.' },
          { term: 'Label horizon', meaning: 'Cutoff 뒤 얼마 동안의 결과를 target으로 볼지 정한 구간', why: 'Feature와 label interval이 겹치거나 label 미확정 row를 train에 넣는 문제를 막는다.' },
        ]} />
        <TemporalCutoffLab />
      </section>

      <section id="clock-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Prediction row 하나를 네 시각으로 정의한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Entity i에 대해 cutoff t에서 예측한다고 하자. Feature는 t 이전 event 중 t까지 도착한
            것만 사용한다. Label은 t부터 horizon H까지의 결과로 만들고, label이 완전히 확정된
            시각이 dataset snapshot보다 늦다면 그 row는 아직 학습할 수 없다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}q_j(i,t)&=\underbrace{\mathbf 1[e_j=i]}_{\text{같은 entity}}\underbrace{\mathbf 1[s_j<t]}_{\text{이전 발생}}\\[2pt]&\quad\cdot\underbrace{\mathbf 1[a_j\le t]}_{\text{cutoff까지 도착}}\\[2pt]\mathcal H_i(t)&=\underbrace{\{j:q_j(i,t)=1\}}_{\text{사용 가능한 history}}\\[2pt]y_i(t;H)&=\underbrace{\operatorname{Target}\!\left(i,[t,t+H)\right)}_{\text{미래 label 구간}}\\[2pt]\operatorname{trainable}(i,t)&=\mathbf 1[r_i(t;H)\le t_{\mathrm{snapshot}}]\end{aligned}`}
          meaning="History 집합은 entity, event time과 availability time을 모두 확인한다. Target은 feature window가 끝난 t부터 시작하고, label 확정 시각 r이 dataset snapshot보다 늦은 row는 학습에서 제외한다."
          symbols={[
            [String.raw`s_j,a_j`, 'Event j의 발생 시각과 system 도착 시각'],
            [String.raw`t`, 'Prediction cutoff'],
            [String.raw`H`, 'Target을 관측할 미래 horizon 길이'],
            [String.raw`r_i(t;H)`, '해당 row의 label이 최종 확정된 시각'],
          ]}
        />
        <Misconception>Event time이 cutoff보다 이르다는 사실만으로 사용 가능하지 않다. 지연 ingestion, backfill과 정정 값은 당시 online system이 몰랐을 수 있다. 반대로 availability time만 쓰면 event가 어느 현실 구간에 속하는지 잃는다.</Misconception>
      </section>

      <section id="lag-window" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Lag와 rolling은 index 이동이 아니라 반열린 과거 query다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일정 간격 시계열에서 `shift(k)`는 k step 전 값을 가져온다. 하지만 event 간격이 불규칙하면
            한 행 전은 1초 전일 수도 한 달 전일 수도 있다. 이때 lag는 “t-Δ 이전에 발생했고 t까지
            도착한 가장 최근 값”처럼 시간 조건으로 정의한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}q_j(i,t,\Delta)&=\mathbf 1[e_j=i]\mathbf 1[s_j\le t-\Delta]\\[2pt]&\quad\cdot\mathbf 1[a_j\le t]\\[2pt]j^\star&=\underbrace{\arg\max_{j:q_j=1}s_j}_{\text{조건 안의 마지막 event}}\\[2pt]x_{i,\Delta}^{\mathrm{lag}}(t)&=\underbrace{x_{j^\star}}_{\text{재현한 lag 값}}\end{aligned}`}
          meaning="양수 Δ에 대해 entity i의 cutoff t에서 Δ만큼 과거인 기준 시각을 넘지 않는 event 중, 당시 도착해 있던 가장 최근 값을 lag로 쓴다. Δ=0의 현재 as-of 값은 history의 strict s<t 경계를 따로 적용한다. 적합한 event가 없을 때 missing·default 정책도 schema에 기록한다."
          symbols={[
            [String.raw`\Delta>0`, '얼마나 과거를 볼지 정한 양수 lag 시간'],
            [String.raw`j^\star`, '시간·도착 조건을 만족하는 마지막 event index'],
            [String.raw`x_{i,\Delta}^{\mathrm{lag}}(t)`, 'Cutoff t에서 재현한 entity i의 Δ-lag 값'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\begin{aligned}W_{i,w}(t)&=\left\{j:e_j=i,\ \underbrace{t-w\le s_j<t}_{\text{반열린 과거 window}},\ a_j\le t\right\}\\[2pt]\mu_{i,w}(t)&=\frac{\underbrace{\sum_{j\in W_{i,w}(t)}x_j}_{\text{과거 window 값의 합}}}{\underbrace{|W_{i,w}(t)|}_{\text{실제로 관측된 event 수}}}\end{aligned}`}
          meaning="Rolling mean은 [t-w, t) 안에서 발생하고 cutoff까지 도착한 event만 평균낸다. 오른쪽 끝 t를 제외해 label horizon 시작의 사건이 feature에 섞이는 것을 막는다."
          symbols={[
            [String.raw`w`, '과거 관측 window 길이'],
            [String.raw`W_{i,w}(t)`, 'Entity i의 합법적인 과거 event 집합'],
            [String.raw`|W_{i,w}(t)|`, '고정 row 수가 아니라 해당 window의 실제 event 개수'],
          ]}
        />
        <RollingWindowLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Mean만 만들지 않는다. Count는 관측 밀도, min/max는 극단, standard deviation은 변동,
            time-since-last-event는 freshness를 표현한다. 다만 window 후보를 validation score가
            오를 때까지 무한히 늘리면 또 다른 hyperparameter search다. Domain cycle과 latency
            가설로 작은 후보를 만들고 고정 temporal OOF에서 비교한다.
          </p>
        </div>
      </section>

      <section id="point-in-time" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Point-in-time join은 현재 database로 과거를 덮어쓰지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Training entity dataframe의 각 row에는 entity key와 prediction timestamp가 있어야 한다.
            Feature table에서 같은 entity의 row를 찾되 cutoff 뒤 record를 금지하고, TTL이 있다면 너무
            오래된 값도 제외한다. Feast의 historical retrieval이 설명하는 point-in-time join이
            이 replay 책임의 한 구현이다.
          </p>
          <p>
            원본 사건이 나중에 정정될 수 있다면 current value만 저장해서는 과거를 재생할 수 없다.
            Effective time과 system time을 함께 보존하는 bitemporal table, immutable event log 또는
            snapshot version이 필요하다. Training과 serving이 다른 query를 쓴다면 golden entity rows로
            두 결과를 비교한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}q_j(i,t)&=\mathbf 1[e_j=i]\mathbf 1[s_j<t]\\[2pt]&\quad\cdot\mathbf 1[a_j\le t]\mathbf 1[t-s_j\le\mathrm{TTL}]\\[2pt]j^\star(i,t)&=\underbrace{\arg\max_{j:q_j=1}s_j}_{\text{마지막 유효 row}}\\[2pt]\operatorname{Join}(i,t)&=\underbrace{f_{j^\star(i,t)}}_{\text{과거 feature snapshot}}\end{aligned}`}
          meaning="각 prediction row마다 같은 entity에서 cutoff 이전에 발생·도착했고 TTL 안에 있는 가장 최근 feature row만 붙인다. 현재 시점의 최신 row를 모든 과거 예측에 복사하는 join과 다르다."
          symbols={[
            [String.raw`\mathrm{TTL}`, 'Feature를 유효하다고 보는 최대 과거 기간'],
            [String.raw`f_j`, 'Feature table의 versioned row'],
            [String.raw`\operatorname{Join}(i,t)`, 'Entity i의 cutoff t에서 재현한 feature snapshot'],
          ]}
        />
        <StopRule>Historical training row와 online request에 같은 entity·cutoff를 넣었을 때 feature가 다르면 model tuning을 중단한다. 먼저 timestamp 의미, backfill, TTL과 transformation version을 맞춘다.</StopRule>
      </section>

      <section id="calendar" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">주기 인코딩은 경계의 이웃 관계를 표현한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시각 23과 0, 일요일과 월요일처럼 주기 경계 양쪽은 실제로 가깝다. Raw integer를 linear
            model에 넣으면 23과 0을 멀리 본다. Sin과 cos pair는 같은 phase를 원 위의 좌표로 옮겨
            경계가 이어지게 한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\theta(x)&=\underbrace{2\pi\frac{x}{P}}_{\text{주기 }P\text{ 안의 위치를 각도로 변환}}\\[2pt]z_{\sin}(x)&=\underbrace{\sin\theta(x)}_{\text{세로 좌표}},\qquad z_{\cos}(x)=\underbrace{\cos\theta(x)}_{\text{가로 좌표}}\end{aligned}`}
          meaning="주기값 x를 원 위의 두 좌표로 바꾸면 주기 끝과 시작이 인접한다. Sin 하나만 쓰면 서로 다른 phase가 같은 값이 될 수 있으므로 cos와 함께 쓴다."
          symbols={[
            [String.raw`P`, '24시간, 7일, 12개월 같은 한 주기의 길이'],
            [String.raw`\theta(x)`, '주기 안의 위치를 나타내는 각도'],
            [String.raw`z_{\sin},z_{\cos}`, '경계를 이어 주는 두 개의 주기 feature'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 변환의 효용은 model에 따라 다르다. Linear model은 하나의 sin/cos pair로 한 개의
            부드러운 harmonic을 표현하므로 아침·저녁의 복잡한 peak를 충분히 못 잡을 수 있다.
            One-hot, periodic spline, 여러 harmonic을 비교할 수 있다. Tree는 threshold split으로
            비선형을 표현하므로 raw·categorical calendar feature가 더 나을 수도 있다.
          </p>
        </div>
      </section>

      <section id="validation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">검증은 미래 운영의 순서와 label 지연을 재생한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Random K-fold는 미래 row로 과거를 학습할 수 있다. Forward split은 과거 train 뒤에
            validation을 놓는다. <strong>Gap</strong>은 두 구간 사이의 고정 시간대를 비우고,
            <strong> purge</strong>는 feature·label interval이 경계를 실제로 가로지르는 sample을
            제거한다. <strong>Embargo</strong>는 validation/test 바로 뒤의 구간이 나중 fold의
            train으로 다시 들어가는 검증 설계에서 그 구간을 추가로 막는다. 과거만 train으로 쓰는
            단순 expanding forward fold에는 test 뒤 embargo가 자동으로 필요한 것이 아니다.
            같은 entity가 양쪽에 있어도 되는지는 배포 목표가 “기존 entity의 미래”인지 “새
            entity”인지에 따라 달라진다.
          </p>
          <p>
            scikit-learn의 <code>TimeSeriesSplit</code>은 time-ordered sample과 누적 train,
            configurable gap을 제공한다. 공식 문서가 지적하듯 fold metric을 같은 기간으로 비교하려면
            표본 간격이 같아야 한다. 불규칙 event, 여러 entity와 overlapping label에는 timestamp
            기준의 custom splitter가 필요할 수 있다. 자세한 선택은
            <InternalLink slug="cross-validation">교차 검증</InternalLink>에서 이어진다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Deployment question', '기존 entity의 다음 기간인지, 처음 보는 entity·site의 미래인지 먼저 고정한다.'],
            ['Fold clock', 'Train cutoff, validation interval, label-finalization date와 gap·purge·embargo의 적용 이유를 기록한다.'],
            ['Fold-local fit', 'Imputer, scaler, encoder, window selection과 model을 train 기간에만 fit한다.'],
            ['Replay test', '몇 개 entity-cutoff fixture에서 historical query와 serving query의 값을 비교한다.'],
            ['Drift evidence', '기간별 metric, freshness, missingness, unseen category와 worst group을 함께 본다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Flat temporal baseline이 잃는 정보가 보일 때만 sequence로 간다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Lag, rolling, count, recency와 transition feature로 먼저 강한 flat baseline을 만든다.
            같은 집계를 가진 history의 event 순서가 target을 바꾸거나, event 간 간격과 long-range
            dependency가 반복 오류로 남으면 <InternalLink slug="sequence-modeling-tabular">event
            sequence model</InternalLink>을 추가한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Event time과 availability time을 분리해 cutoff에서 합법적인 event를 판정할 수 있다.',
          'Regular·irregular data에서 lag의 의미가 다른 이유와 as-of lag query를 설명할 수 있다.',
          '반열린 [t-w,t) rolling window와 point-in-time join을 수식과 query 조건으로 정의할 수 있다.',
          'Sin/cos 주기 인코딩의 장점과 linear/tree model별 한계를 설명할 수 있다.',
          'Label latency, gap, entity novelty와 online replay를 포함한 temporal validation을 설계할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          아래 공식 문서는 time split, periodic feature와 point-in-time retrieval의 구현 근거다.
          Bitemporal manifest와 sequence 승격 gate는 이 경로의 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'scikit-learn · TimeSeriesSplit', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html', note: '과거 train에서 미래 test로 진행하는 split, gap과 동일 간격 조건.' },
          { label: 'scikit-learn · Time-related feature engineering', href: 'https://scikit-learn.org/stable/auto_examples/applications/plot_cyclical_feature_engineering.html', note: 'Time-based CV와 one-hot·sin/cos·periodic spline 비교.' },
          { label: 'Feast · Point-in-time joins', href: 'https://docs.feast.dev/getting-started/concepts/point-in-time-joins', note: 'Entity timestamp마다 과거 feature 상태와 TTL을 재현하는 historical retrieval.' },
          { label: 'pandas · Window operations', href: 'https://pandas.pydata.org/docs/user_guide/window.html', note: 'Rolling·expanding·exponentially weighted window API의 공식 동작.' },
          { label: 'López de Prado · Advances in Financial Machine Learning', href: 'https://uat.store.wiley.com/en-us/advances-in-financial-machine-learning-p-9781119482109', note: '겹치는 금융 label을 위한 purging·embargo의 원 출처. 모든 forward split에 자동 적용하는 규칙은 아니다.' },
        ]} />
      </section>
    </div>
  );
}
