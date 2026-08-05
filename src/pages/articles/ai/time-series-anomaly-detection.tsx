import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  AlertContractStrip,
  AlertEventLab,
  AnomalyTypeLab,
} from './time-series-anomaly-detection/viz/AnomalyDetectionExplorers';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div className="not-prose my-6 min-w-0">
      <div className="min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function DecisionRow({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.4rem_11rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-bold text-muted-foreground">{index}</span>
      <strong className="text-sm">{title}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

const replaySketch = `for (const cutoff of historicalCutoffs) {
  const snapshot = features.asOf(cutoff);       // cutoff 전에 도착한 값만
  const expected = baseline.predict(snapshot);
  const score = robustResidual(actualAt(cutoff), expected);
  const pointAlert = score >= thresholdFromPast(cutoff);
  incidentBuilder.push({ cutoff, score, pointAlert });
}

const incidents = incidentBuilder.closeWith({
  allowedGap: 1,
  minimumDuration: 2,
});

grade(incidents, labelsFinalizedBy(reviewDate), {
  metrics: ['event_recall', 'false_alerts_per_day', 'time_to_detect'],
});`;

export default function TimeSeriesAnomalyDetectionArticle() {
  return (
    <>
      <section id="alert-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">점수보다 먼저 어떤 알람을 만들지 정한다</h2>
        <BeginnerBridge title="화재 경보기는 연기를 본 매초마다 새 화재를 신고하지 않는다">
          같은 연기가 5분 동안 이어지면 센서는 여러 번 이상을 감지할 수 있지만, 소방대가 대응할 사건은 보통 하나다. 시계열 이상 탐지도 먼저 <strong>숫자 한 점이 튄 것</strong>과 <strong>사람이 조치할 하나의 사건</strong>을 구분해야 한다.
        </BeginnerBridge>
        <QuestionLead
          question="센서가 5분 동안 흔들려 점 5개가 threshold를 넘었다면, 장애를 5번 찾은 것일까?"
          answer="대부분은 하나의 사건을 여러 번 관측한 것이다. 시계열 이상 탐지는 점별 score를 만드는 문제와 score를 incident·ticket·조치로 바꾸는 문제를 분리해야 한다. 먼저 사건의 시작·끝, 허용 탐지 지연, 정상 기간의 알람 예산과 label 확정 시점을 고정한다."
        />
        <ConceptPrimer items={[
          { term: 'Score', meaning: '각 시점이나 구간이 정상 기준에서 얼마나 벗어났는지 나타내는 연속값이다.', why: '모델의 순위 신호와 운영의 이진 알람을 분리해야 threshold를 바꿔도 다시 평가할 수 있다.' },
          { term: 'Point alert', meaning: '한 시점의 score가 threshold를 넘었다는 임시 판정이다.', why: '같은 장애에서 여러 번 울릴 수 있으므로 incident와 같지 않다.' },
          { term: 'Incident', meaning: '서로 가까운 point alert를 하나의 시작·끝 구간으로 병합한 운영 단위다.', why: '사람이 받는 티켓 수와 event recall을 실제 조치 단위로 계산하게 해 준다.' },
          { term: 'Detection delay', meaning: '실제 사건 시작부터 첫 유효 알람까지 걸린 시간이다.', why: '늦게 맞힌 모델과 사고 전에 알려 준 모델을 같은 recall로 취급하지 않는다.' },
          { term: 'Alert budget', meaning: '시간당·일별 허용 가능한 오탐 티켓 수다.', why: 'Threshold는 통계적 희귀도만이 아니라 대응 인력과 자동 조치 비용까지 반영해야 한다.' },
        ]} />
        <AlertContractStrip />
        <Misconception>“이상”은 데이터에 붙어 있는 자연법칙 라벨이 아니다. 같은 진동도 생산 전환 중에는 정상이고 정속 운전 중에는 장애 신호일 수 있다. 모델보다 먼저 운영 상태와 조치 계약을 쓴다.</Misconception>
      </section>

      <section id="anomaly-types" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">점·맥락·구간 이상은 서로 다른 질문이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>전체 분포에서 극단적인 <strong>점 이상</strong>은 한 행의 tail probability로도 찾을 수 있다. 그러나 새벽 3시의 높은 전력 사용처럼 값 자체는 흔하지만 시간대에 맞지 않는 <strong>맥락 이상</strong>은 달력·운영 mode·known covariate를 조건으로 봐야 한다. 값 하나씩은 평범해도 상승이 오래 이어지거나 순서가 뒤집힌 <strong>구간 이상</strong>은 window의 지속시간과 모양을 봐야 한다.</p>
          <p>따라서 <InternalLink slug="ecod" learningPathId="ai-timeseries-anomaly">ECOD</InternalLink> 같은 피처별 분포 기준선은 유용하지만 시계열 이상 탐지 전체를 대신하지 않는다. 시간축을 한 행의 lag·rolling feature로 바꿔 넣을 수는 있어도, 그 feature가 어느 cutoff에서 실제로 가용했는지는 <InternalLink slug="time-features" learningPathId="ai-timeseries-anomaly">point-in-time 시간 feature</InternalLink> 계약으로 따로 증명해야 한다.</p>
        </div>
        <AnomalyTypeLab />
      </section>

      <section id="residual-baseline" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">가장 싼 시작점은 “예상과 실제의 차이”다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>원시 값에 하나의 전역 threshold를 그으면 낮과 밤, 평일과 휴일, 서로 다른 센서 scale이 섞인다. 먼저 seasonal-naive, median profile, ARIMA나 작은 forecasting model로 <strong>그 시점에 예상되는 값</strong>을 만든다. 그리고 실제 값과 예측의 차이를 과거 residual scale로 나눈다. 이때 model과 scale은 모두 현재 cutoff 이전 자료에서만 fit해야 한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\hat y_{t\mid t-1}}_{\text{t 직전까지 만든 정상 기대값}}
&=\underbrace{f_{\theta_{t-1}}(\mathcal I_{t-1})}_{\text{과거 정보만 쓰는 기준선}}\\
\underbrace{e_t}_{\text{현재 residual}}
&=\underbrace{y_t-\hat y_{t\mid t-1}}_{\text{실제에서 정상 기대값을 뺌}}\\
\underbrace{m_{t-1}}_{\text{과거 residual 중앙값}}
&=\operatorname{median}_{k<t}(e_k)\\
\underbrace{s_{t-1}}_{\text{과거 residual의 robust scale}}
&=\operatorname{median}_{j<t}|e_j-m_{t-1}|+\varepsilon\\
\underbrace{r_t}_{\text{scale이 보정된 residual}}
&=\frac{\underbrace{|e_t-m_{t-1}|}_{\text{과거의 체계적 bias를 뺀 현재 오차}}}{s_{t-1}}
\end{aligned}`}
          meaning="먼저 t 직전까지 가용한 정보로 정상 기대값을 만들고 residual e_t를 계산한다. 현재 residual에서 과거 residual 중앙값을 빼 체계적인 예측 bias를 중심화한 뒤 robust scale로 나눈다. 예를 들어 정상 residual이 계속 +5였다면 현재 residual +5는 0에 가까워야 한다. 중앙값·분모·model parameter에 t 이후 자료가 들어가면 이상 탐지에서도 미래 누출이다."
          symbols={[
            [String.raw`\mathcal I_{t-1}`, 't 직전까지 실제로 도착한 target·covariate history'],
            [String.raw`\theta_{t-1}`, '과거 자료에서만 fit한 baseline parameter'],
            [String.raw`e_t,e_j`, '현재 또는 과거 시점의 out-of-sample one-step residual'],
            [String.raw`m_{t-1}`, '과거 residual의 중앙값'],
            [String.raw`s_{t-1}`, '현재 시점 전 residual만으로 계산한 robust scale'],
            [String.raw`\operatorname{median}`, '극단값 하나에 scale이 크게 흔들리지 않는 중앙값 연산'],
            [String.raw`\varepsilon`, '과거 residual이 거의 0일 때 0으로 나누는 일을 막는 작은 상수'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>예측 분포나 quantile이 있다면 실제 값이 prediction interval 밖으로 얼마나 나갔는지를 score로 만들 수 있다. 다만 “90% interval 밖”을 곧바로 장애라고 부르지 않는다. 정상 분포에서도 약 10%는 원래 밖에 나올 수 있고, model calibration이 틀리면 실제 오탐률은 더 커진다. 같은 rolling replay에서 coverage와 alert rate를 다시 측정한다.</p>
          <p>Forecasting baseline과 MASE·quantile calibration 계산은 <InternalLink slug="time-series-forecasting-evaluation" learningPathId="ai-timeseries-forecasting">시계열 예측 검증</InternalLink>에서 먼저 닫을 수 있다.</p>
        </div>
      </section>

      <section id="event-threshold" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Threshold를 넘은 점을 사건으로 묶는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Threshold가 낮으면 빠르게 찾지만 정상 변동도 많이 울린다. 높으면 오탐은 줄지만 초기 징후를 놓치고 탐지 지연이 커진다. Threshold는 test label을 보며 고르는 값이 아니라 과거 calibration 구간에서 alert budget이나 비용을 만족하도록 선택하고, 마지막 기간에서는 고정한다.</p>
          <p>설비 장애가 잠시 정상 범위로 돌아왔다 다시 튈 수 있다면 짧은 gap을 같은 사건으로 묶는다. 반대로 서로 다른 원인의 두 장애를 하나로 합치지 않도록 최대 gap, 최소 지속시간, cooldown과 severity aggregation 규칙을 release manifest에 남긴다.</p>
        </div>
        <AlertEventLab />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{b_t}_{\text{점 알람}}&=\underbrace{\mathbf 1[r_t\ge \tau]}_{\text{score가 고정 threshold 이상}}\\
\underbrace{E_m}_{\text{m번째 운영 사건}}&=\underbrace{\operatorname{merge}_{g,k}\{t:b_t=1\}}_{\text{gap g와 최소 지속 k로 점 알람을 병합}}
\end{aligned}`}
          meaning="연속 score r_t를 threshold τ로 잘라 point alert b_t를 만든 뒤, 가까운 alert들을 merge 규칙으로 incident E_m에 묶는다. 모델 score, threshold, incident 병합 규칙은 서로 다른 책임이며 각각 version을 남겨야 한다."
          symbols={[
            [String.raw`\tau`, '과거 calibration 구간에서 고정한 score threshold'],
            [String.raw`\mathbf 1[\cdot]`, '조건이 참이면 1인 indicator'],
            [String.raw`g`, '두 alert를 같은 사건으로 볼 최대 정상 gap'],
            [String.raw`k`, '짧은 spike를 버리기 위한 최소 alert 수 또는 지속시간'],
            [String.raw`E_m`, '티켓·조치·event metric의 단위가 되는 하나의 incident'],
          ]}
        />
      </section>

      <section id="evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Point accuracy만으로는 운영 품질을 설명하지 못한다</h2>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <DecisionRow index="01" title="Event recall"><p>실제 incident 구간마다 허용 지연 안에 적어도 한 번 유효 알람을 냈는지 센다. 긴 장애에서 같은 알람을 반복한 횟수로 recall을 부풀리지 않는다.</p></DecisionRow>
          <DecisionRow index="02" title="False alerts / day"><p>정상 운영 시간당 만들어진 incident 수를 센다. Point false-positive rate가 같아도 merge 규칙에 따라 사람이 받는 티켓 수는 달라진다.</p></DecisionRow>
          <DecisionRow index="03" title="Time to detect"><p>사건 시작에서 첫 알람까지의 지연 분포를 본다. 평균뿐 아니라 critical slice의 p95와 deadline 초과율을 남긴다.</p></DecisionRow>
          <DecisionRow index="04" title="Coverage slice"><p>설비·매장·운영 mode·계절·severity별로 label coverage와 metric을 분리한다. Label이 늦게 확정되는 최근 구간은 아직 negative로 채점하지 않는다.</p></DecisionRow>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{I_m}_{\text{m번째 탐지 허용 구간}}
&=[s_m,s_m+\Delta]\\
\underbrace{\mathcal G}_{\text{겹침 후보 edge}}
&=\{(m,n):\hat E_n\cap I_m\ne\varnothing\}\\
\underbrace{\mathcal M^\star}_{\text{중복 없는 사건 대응}}
&=\operatorname{MaxMatch}(\mathcal G)\\
\underbrace{\operatorname{Recall}_{event}}_{\text{사건 단위 탐지율}}
&=\frac{|\mathcal M^\star|}{M}\\
\underbrace{\mathcal F}_{\text{대응되지 않은 예측 사건}}
&=\{\hat E_n:(m,n)\notin\mathcal M^\star\;\forall m\}\\
\underbrace{\operatorname{FAR}_{day}}_{\text{정상 일별 오탐}}
&=\frac{|\mathcal F|}{D_{normal}}
\end{aligned}`}
          meaning="실제 사건과 예측 incident 사이에 허용 지연 안의 겹침 edge를 만든 뒤, 각 실제 사건과 각 예측 사건을 최대 한 번만 쓰는 maximum-cardinality matching을 고정한다. 이렇게 해야 긴 예측 사건 하나가 여러 실제 사건의 recall을 동시에 올리거나, 같은 예측을 hit와 false alert 양쪽에서 다르게 세는 일을 막는다. FAR/day는 matching 뒤 남은 예측 incident를 정상 운영 일수로 나눈다."
          symbols={[
            [String.raw`[s_m,s_m+\Delta]`, 'm번째 사건 시작부터 허용 가능한 탐지 deadline까지의 구간'],
            [String.raw`I_m`, 'm번째 사건이 제때 탐지됐다고 인정하는 시간 구간'],
            [String.raw`\mathcal G`, '실제 사건의 허용 구간과 예측 incident가 겹치는 모든 후보 edge'],
            [String.raw`\hat E`, '모델 score와 merge 규칙으로 만든 예측 incident'],
            [String.raw`\mathcal M^\star`, '각 실제·예측 incident를 최대 한 번만 쓰는 최대 cardinality matching'],
            [String.raw`\mathcal F`, 'matching에 사용되지 않은 예측 incident 집합'],
            [String.raw`\hat E_n`, 'threshold와 merge 규칙으로 만든 n번째 예측 incident'],
            [String.raw`D_{normal}`, 'label이 확정됐고 실제 장애가 없던 정상 평가 일수'],
          ]}
        />
      </section>

      <section id="model-ladder" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">남은 실패가 설명할 때만 더 복잡한 모델로 간다</h2>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <DecisionRow index="01" title="Rule·robust tail"><p>물리 한계, median·MAD, seasonal profile과 ECOD 같은 싼 ranking으로 obvious point anomaly를 먼저 잡는다.</p></DecisionRow>
          <DecisionRow index="02" title="Forecast residual"><p>시간대·요일·known covariate 때문에 정상 범위가 움직이면 one-step prediction residual과 calibrated interval을 쓴다.</p></DecisionRow>
          <DecisionRow index="03" title="Change·sequence"><p>점 하나가 아니라 평균·분산·주파수·순서 변화가 반복 실패로 남을 때 change-point, window feature 또는 sequence model을 비교한다.</p></DecisionRow>
          <DecisionRow index="04" title="Representation model"><p>고차원 waveform·image·multisensor interaction이 수작업 residual로 분리되지 않을 때만 autoencoder·contrastive representation 비용을 연다.</p></DecisionRow>
        </div>
        <StopRule>robust seasonal residual과 incident 평가가 운영 요구를 만족하면 여기서 멈춘다. “딥러닝 이상 탐지”라는 이름만으로 autoencoder·Transformer를 추가하지 않는다.</StopRule>
      </section>

      <section id="implementation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Historical replay가 production과 같은 시계를 써야 한다</h2>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{replaySketch}</code></pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>각 cutoff에서 당시 도착해 있던 feature snapshot과 당시 배포 가능했던 model·threshold version을 재생한다. 최신 정정값, 사건 종료 뒤 붙은 label, 전체 기간 normalization을 과거 시점에 넣지 않는다. Score, point alert, incident, ticket acknowledgement와 실제 조치를 별도 table로 남기면 어느 단계가 실패했는지 되돌릴 수 있다.</p>
          <p>Sensor sampling과 filter delay가 이상처럼 보이는 artifact를 만드는 경우는 <InternalLink slug="signals-systems-convolution" learningPathId="ai-timeseries-anomaly">신호와 시스템</InternalLink>으로 내려가 확인한다.</p>
        </div>
        <CapabilityCheck items={[
          '점 이상, 맥락 이상과 구간 이상이 서로 다른 기준선을 요구하는 이유를 설명할 수 있다.',
          '과거 정보만 사용해 robust forecast residual과 고정 threshold를 계산할 수 있다.',
          'Point alert를 incident로 병합하는 gap·duration·cooldown 규칙을 version으로 남길 수 있다.',
          'Event recall, false alerts/day와 time-to-detect를 함께 계산해 threshold를 비교할 수 있다.',
          'ECOD·forecast residual·sequence·representation model 중 다음 복잡도를 열 근거를 말할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Chandola et al. · Anomaly Detection: A Survey', href: 'https://doi.org/10.1145/1541880.1541882', note: 'Point, contextual, collective anomaly와 탐지 문제의 고전적 분류.' },
          { label: 'Lavin & Ahmad · Numenta Anomaly Benchmark', href: 'https://arxiv.org/abs/1510.03336', note: '실시간 시계열에서 조기 탐지와 application profile을 포함한 benchmark 설계.' },
          { label: 'Tatbul et al. · Precision and Recall for Time Series', href: 'https://proceedings.neurips.cc/paper/2018/hash/8f468c873a32bb0619eaeb2050ba45d1-Abstract.html', note: 'Range overlap, position과 cardinality를 반영하는 시계열 event metric의 1차 근거.' },
          { label: 'Li et al. · ECOD', href: 'https://arxiv.org/abs/2201.00382', note: '피처별 경험적 tail probability를 결합하는 training-free tabular outlier 기준선.' },
          { label: 'scikit-learn · Novelty and Outlier Detection', href: 'https://scikit-learn.org/stable/modules/outlier_detection.html', note: 'Outlier detection과 novelty detection, score와 binary prediction API 경계.' },
        ]} />
      </section>
    </>
  );
}
