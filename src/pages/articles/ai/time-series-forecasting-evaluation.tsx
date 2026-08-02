import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { ForecastContractWorkbench, RollingOriginExplorer } from './time-series-forecasting-evaluation/viz/ForecastEvaluationExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

function ProcessRow({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.2rem_10rem_minmax(0,1fr)] sm:gap-4"><span className="font-mono text-xs font-bold text-muted-foreground">{index}</span><strong className="text-sm">{title}</strong><div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div></div>;
}

function ModelCard({ name, version, input, output, useWhen, boundary }: { name: string; version: string; input: string; output: string; useWhen: string; boundary: string }) {
  return <article className="min-w-0 border-t border-border py-5 first:border-t-0"><div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"><h3 className="text-base font-bold">{name}</h3><span className="w-fit font-mono text-xs text-muted-foreground">{version}</span></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase text-muted-foreground">입력 → 출력</p><p className="mt-1 text-sm leading-relaxed">{input} → {output}</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">언제 후보인가?</p><p className="mt-1 text-sm leading-relaxed">{useWhen}</p></div></div><p className="mt-3 border-l-2 border-amber-500/60 pl-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">경계.</strong> {boundary}</p></article>;
}

const taskSchema = `type ForecastTask = {
  origin: string;                 // 예측을 실행하는 시각
  contextLength: number;          // origin까지 볼 과거 길이
  horizon: number;                // 미래 몇 step을 예측하는가
  target: 'hourly_sales';
  knownFuture: ['promotion_plan', 'holiday', 'weather_forecast_snapshot'];
  pastObserved: ['sales', 'inventory', 'weather'];
  staticFeatures: ['store_id', 'region'];
  refitCadence: 'weekly';
  metrics: ['MASE', 'weighted_pinball', 'coverage_90'];
};`;

const backtestSketch = `for (const origin of rollingOrigins) {
  const train = raw.filter(row => row.timestamp <= origin);
  const future = raw.filter(row =>
    origin < row.timestamp && row.timestamp <= origin + horizon
  );

  const transform = fitTransform(train);       // fold 안에서만 fit
  const trainSet = makeCausalWindows(transform(train));
  const knownFuture = snapshotPlans(origin, future.timestamps);

  for (const candidate of candidates) {
    const forecast = candidate.predict({ trainSet, knownFuture });
    record(origin, candidate.version, grade(forecast, future));
  }
}`;

export default function TimeSeriesForecastingEvaluationArticle() {
  return (
    <>
      <section id="forecast-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델보다 먼저 예측 시점을 고정한다</h2>
        <BeginnerOpening
          title="시계열 예측은 과거의 순서 있는 기록만 보고 아직 오지 않은 구간을 추정하는 일입니다."
          description={<>판매량, 전력 사용량, 온도처럼 시간에 따라 쌓이는 값을 다룬다. 예측을 평가하려면 먼저 “언제 예측했고, 그때까지 무엇을 알았으며, 앞으로 어디까지 맞히려 했는가”를 고정해야 한다.</>}
          familiarScene={<>오늘 08:00에 빵을 몇 개 만들지 결정한다고 하자. 어제까지의 판매량과 이미 확정된 할인 행사는 알 수 있지만, 오늘 저녁의 실제 날씨와 마감 재고는 아직 모른다. 나중에 완성된 표에 값이 들어 있다고 아침의 예측에 사용하면 미래를 미리 본 셈이다.</>}
          steps={[
            { label: '현재 시점을 세운다', detail: 'Forecast origin을 정해 이 시각 뒤에 생긴 정보가 입력으로 넘어오지 못하게 한다.' },
            { label: '그때 알 수 있던 값을 나눈다', detail: '과거 관측, 미리 확정된 미래 계획, 나중에야 알게 된 실측값을 구분한다.' },
            { label: '같은 방식으로 시간을 이동해 시험한다', detail: '여러 rolling origin에서 같은 horizon과 운영 절차를 반복해 우연한 점수를 걸러낸다.' },
          ]}
        />
        <QuestionLead question="오늘 08:00에 앞으로 24시간 판매량을 예측한다면, 모델은 정확히 어디까지 볼 수 있을까?" answer="08:00까지 생성·공개된 값만 볼 수 있다. 완료된 데이터 파일에 내일 실측 재고와 날씨가 들어 있어도 08:00에는 알 수 없었다. Forecast origin을 세로 경계로 세우고, 과거 관측과 미리 확정된 미래 계획을 분리해야 예측 문제가 비로소 정의된다." />
        <ConceptPrimer items={[
          { term: 'Forecast origin t', meaning: '예측을 실행하며 정보가 끊기는 현재 시점이다.', why: '같은 column도 t 이전에 공개됐는지 이후에 생성됐는지에 따라 입력 또는 누출이 된다.' },
          { term: 'Horizon H', meaning: 'origin 다음부터 예측할 미래 step 수다.', why: '1시간 예측과 24시간 예측은 필요한 pattern, 오차와 의사결정이 다르다.' },
          { term: 'Known-future covariate', meaning: '휴일·확정 프로모션처럼 미래 시각의 값이 origin에 이미 알려진 입력이다.', why: '미래 timestamp를 가진 모든 feature를 무조건 버리지 않고 실제 가용성으로 구분한다.' },
          { term: 'Rolling origin', meaning: 'origin을 시간 앞으로 옮기며 같은 horizon 예측을 반복하는 평가다.', why: '한 시점의 운을 배포 과정의 반복 신뢰성과 구분한다.' },
          { term: 'Fold', meaning: 'origin 하나가 만드는 학습 구간과 고정 test horizon 한 쌍이다.', why: '변환을 fit하는 범위와 누출 판정이 이 경계 안에서 결정된다.' },
        ]} />
        <ForecastContractWorkbench />
        <Formula latex={String.raw`\begin{aligned}
\underbrace{\mathcal I_t^{hist}}_{\text{현재까지 관측한 정보}}
&=\{y_{\le t},x^{obs}_{\le t}\}\\
\underbrace{\mathcal I_t^{known}}_{\text{미리 아는 미래·고정 정보}}
&=\{x^{known}_{t+1:t+H},s\}\\
\underbrace{\mathcal I_t}_{\text{예측 시점의 전체 정보}}
&=\mathcal I_t^{hist}\cup\mathcal I_t^{known}\\
\underbrace{\hat P_t}_{\text{미래 목표값의 예측 분포}}
&=f_\theta(\mathcal I_t)
\end{aligned}`} meaning="Forecasting model은 origin t에서 실제로 가용한 정보 집합만 받아 다음 H step target의 점 또는 확률 분포를 낸다. 미래 timestamp에 붙은 값이라도 origin에 계획으로 공개됐다면 사용할 수 있고, 과거 column이라도 집계가 늦게 끝나 t에 없었다면 사용할 수 없다." symbols={[[String.raw`t`, '예측을 실행하는 forecast origin'], [String.raw`H`, '예측할 미래 step 수'], [String.raw`y_{\le t}`, 'origin까지 관측된 target history'], [String.raw`x^{obs}_{\le t}`, 'origin까지 관측된 재고·날씨 같은 covariate'], [String.raw`x^{known}_{t+1:t+H}`, 'origin에 이미 공개된 휴일·프로모션 계획'], [String.raw`s`, '매장 ID·지역처럼 horizon 동안 고정된 속성'], [String.raw`\hat P_t`, '다음 H개 target에 대한 predictive distribution']]}/>
        <Misconception>시계열 split은 단순히 행을 날짜 순으로 자르는 일이 아니다. Feature의 생성 시각, 집계 지연, plan version과 transform fit 범위까지 origin 경계를 지켜야 한다.</Misconception>
      </section>

      <section id="availability-leakage" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Known future와 observed future를 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>프로모션 계획은 내일 값이지만 08:00 전에 승인됐다면 사용할 수 있다. 반대로 내일의 실제 마감 재고와 실측 날씨는 dataset에 나중에 채워진 값이다. 기상 예보를 쓰고 싶다면 “나중에 정정된 최신 예보”가 아니라 origin 시점에 발행돼 있던 forecast snapshot을 저장해야 한다.</p><p>누출은 input column에서만 생기지 않는다. 전체 기간 평균으로 normalization하면 미래의 level shift가 과거 fold에 들어온다. 전체 기간으로 결측치를 보간하거나 Fourier·decomposition을 먼저 계산해도 미래 구조가 섞일 수 있다. Overlapping window를 전부 만든 뒤 random split하면 거의 같은 168시간 history가 train과 validation 양쪽에 나타난다.</p></div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProcessRow index="01" title="잘못된 순서"><p><strong className="text-rose-700 dark:text-rose-300">전체 변환 → 전체 window → random split</strong>. 미래 통계와 겹치는 history가 train으로 들어간다.</p></ProcessRow>
          <ProcessRow index="02" title="Raw timeline split"><p>먼저 origin과 fold를 정한다. Validation target 이후 행은 그 fold의 어떤 fit에도 사용하지 않는다.</p></ProcessRow>
          <ProcessRow index="03" title="Fold-local fit"><p>Scaler, imputer, category vocabulary, feature selection과 hyperparameter를 train history에서만 fit한다.</p></ProcessRow>
          <ProcessRow index="04" title="Causal window"><p>각 sample의 feature timestamp와 available-at timestamp가 origin 이하인지 assertion한 뒤 window를 만든다.</p></ProcessRow>
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{taskSchema}</code></pre>
      </section>

      <section id="rolling-backtest" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Rolling origin으로 실제 운영을 재생한다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">마지막 구간 한 번의 점수는 특정 휴일이나 noise에 우연히 유리할 수 있다. 다음 장면은 origin 수와 horizon을 바꿔 각 행의 history·origin·target 구간을 이동시키고, 마지막 origin·전체 평균·최악 origin의 기준선 대비 MASE 변화를 비교한다.</p>
        <RollingOriginExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>그림의 파란 칸은 각 O<sub>i</sub>까지 사용할 수 있는 context, 검은 칸은 forecast origin, 주황 칸은 고정 horizon target이다. 실제 평가에서는 history가 계속 쌓이는 expanding context인지 최근 168시간만 쓰는 sliding context인지도 배포와 같게 고정한다. Production이 매주 refit한다면 backtest도 매주 fit을 갱신하고, weight를 고정한 zero-shot model이면 같은 checkpoint를 각 origin에 적용한다.</p><p>Protocol을 고르는 동안 여러 fold를 사용하되 마지막 기간은 untouched holdout으로 남긴다. 매장 전체 평균만 보지 않고 store, horizon step, promotion, 품절, 신규 매장과 변동성 slice를 나눈다. 평균 개선이 critical 매장이나 24번째 step 악화를 가리지 않게 한다.</p></div>
        <div data-weight-normalization-contract>
          <Formula latex={String.raw`\begin{aligned}
\underbrace{e_{o,h}}_{\text{시점 o의 h단계 오차}}
&=\underbrace{L(y_{o+h},\hat y_{o,h})}_{\text{같은 미래 값과 예측을 비교}}\\[0.45em]
\underbrace{\widehat R}_{\text{여러 시점의 정규화된 위험}}
&=\frac{1}{|\mathcal O|}\sum_{o\in\mathcal O}
\frac{\sum_{h=1}^{H}\underbrace{w_{o,h}}_{\text{업무 중요도}}\,e_{o,h}}
{\underbrace{\sum_{h=1}^{H}w_{o,h}}_{\text{origin 안의 weight 합}}}
\end{aligned}`} meaning="각 origin o에서 h step ahead 예측과 실제 값을 비교하고, 업무 중요도로 가중한 오차를 그 origin의 weight 합으로 나눈다. 따라서 모든 weight를 같은 양의 상수로 곱해도 위험값은 변하지 않는다. Weight의 상대 비율만 평가 우선순위를 바꾸며, origin·horizon별 e를 보존해야 worst slice와 drift를 찾을 수 있다." symbols={[[String.raw`\mathcal O`, '평가에 사용하는 forecast origin 집합'], [String.raw`o`, '각 forecast origin'], [String.raw`h`, 'origin에서 몇 step 앞인지 나타내는 horizon index'], [String.raw`H`, '최대 prediction length'], [String.raw`L`, 'absolute error 등 한 예측을 채점하는 loss'], [String.raw`w_{o,h}`, '평가 전에 정한 0 이상의 업무 중요도 weight'], [String.raw`\sum_h w_{o,h}`, 'weight의 절대 크기가 아니라 상대 비율만 남기기 위한 정규화 분모']]}/>
          <p className="not-prose -mt-3 mb-6 border-l-2 border-blue-600/45 pl-3 text-xs leading-relaxed text-muted-foreground">
            불변성 확인 · 오차가 2, 4이고 weight가 1, 3이면 위험은 3.5다. Weight를 10, 30으로 모두 10배해도 분자와 분모가 함께 커져 위험은 여전히 3.5다.
          </p>
        </div>
      </section>

      <section id="baselines" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Foundation model 전에 이겨야 할 기준선을 둔다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>시계열에서는 복잡한 모델이 아무것도 하지 않는 단순 기준선보다 못한 경우가 흔하다. Last-value는 마지막 값을 반복하고, hourly retail의 seasonal-naïve는 24시간 전 같은 시각 값을 반복한다. 이 기준선은 싸고 설명 가능하며 장애 시 fallback으로도 쓸 수 있다.</p><p>ARIMA·ETS는 trend, seasonality와 autocorrelation으로 설명 가능한 부분을 측정한다. Tree나 LSTM은 known covariate와 nonlinear memory가 실제로 추가 이득을 주는지 본다. Foundation model은 “최신이라서 baseline”이 아니라 이 모든 cheap candidate와 같은 origin·horizon에서 비교되는 또 하나의 candidate다.</p></div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProcessRow index="01" title="Last value"><p>센서나 짧은 horizon에서 변화가 작다는 가장 싼 가설이다.</p></ProcessRow>
          <ProcessRow index="02" title="Seasonal naïve"><p>직전 하루·주기의 같은 위치를 반복한다. 강한 retail·energy 주기를 드러낸다.</p></ProcessRow>
          <ProcessRow index="03" title="Local fitted model"><p>ARIMA/ETS 또는 제한된 feature model로 target history의 설명 가능한 구조를 fit한다.</p></ProcessRow>
          <ProcessRow index="04" title="Pretrained candidate"><p>zero-shot·few-shot 이점과 함께 download, memory, latency, covariate adapter와 fallback 비용을 측정한다.</p></ProcessRow>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            통계 기준선의 계산과 실패 진단은{' '}
            <InternalLink slug="arima" learningPathId="ai-timeseries-forecasting">ARIMA 기반 글</InternalLink>
            에서, 여러 관련 series의 likelihood와 joint sample path가 현대 확률 예측으로 이어진 기준점은{' '}
            <InternalLink slug="paper-deepar-2017" learningPathId="ai-timeseries-forecasting">DeepAR 원문 글</InternalLink>
            에서, recurrent memory가 추가 이득을 주는 조건은{' '}
            <InternalLink slug="lstm-timeseries" learningPathId="ai-timeseries-forecasting">LSTM 시계열 글</InternalLink>
            에서 이어진다. 세 글 모두 이 절의 origin·horizon·metric 계약으로 다시 검증한다.
          </p>
        </div>
      </section>

      <section id="metrics-calibration" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">점 예측과 불확실성을 따로 검증한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>MAE는 단위가 큰 매장의 오차가 전체를 지배한다. MASE는 candidate absolute error를 train history에서 계산한 seasonal-naïve one-step error로 나눠 서로 다른 scale을 비교한다. 분모를 전체 기간에서 계산하면 다시 미래 정보가 섞인다.</p></div>
        <Formula latex={String.raw`\begin{aligned}\underbrace{D_{train}}_{\text{학습 구간의 계절 오차 기준}}&=\frac{1}{n-m}\sum_{i=m+1}^{n}\left|\underbrace{y_i-y_{i-m}}_{\text{학습 구간의 계절 차이}}\right|\\[0.45em]\underbrace{\mathrm{MASE}}_{\text{크기가 보정된 절대 오차}}&=\frac{\frac{1}{H}\sum_{h=1}^{H}\left|\underbrace{y_{t+h}-\hat y_{t,h}}_{\text{예측 오차}}\right|}{D_{train}}\end{aligned}`} meaning="분자는 현재 origin의 H-step 평균 absolute error이고, 분모는 해당 fold의 train history에서 seasonal-naïve가 내는 평균 absolute error다. Frozen zero-shot checkpoint에서도 fold의 train history는 origin 이전에 관측된 target history를 뜻한다. MASE가 1보다 작으면 그 fold의 seasonal-naïve scale보다 좋다는 뜻이다. 분모가 0에 가까운 상수 series는 별도 처리한다." symbols={[[String.raw`n`, '현재 fold의 train history 길이'], [String.raw`m`, '24시간 또는 7일 같은 seasonal period'], [String.raw`D_{train}`, 'train history만 사용한 seasonal-naïve error scale'], [String.raw`H`, 'forecast horizon'], [String.raw`y_{t+h}`, 'h step 뒤 실제 target'], [String.raw`\hat y_{t,h}`, 'origin t에서 만든 h-step forecast'], [String.raw`|\cdot|`, '오차 부호를 없애 크기만 세는 absolute value']]}/>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>발주에는 점 하나보다 범위가 필요하다. Quantile forecast는 10%, 50%, 90% 같은 조건부 분위수를 낸다. Pinball loss는 실제 값이 quantile보다 위인지 아래인지에 따라 비대칭 비용을 준다. Nominal 90% interval이라고 쓰였다고 90%가 자동 보장되는 것은 아니다. 90% 예측 구간의 실제 coverage가 61%로 나오면 불확실성을 심하게 과소평가했다는 신호다. 낮은 분위수 예측이 높은 분위수보다 커지는 quantile crossing도 함께 검사한다.</p></div>
        <Formula latex={String.raw`\begin{aligned}\underbrace{\rho_q(y-\hat y_q)}_{\text{q 분위수의 핀볼 손실}}&=\begin{cases}\underbrace{q(y-\hat y_q)}_{\text{실제가 분위수보다 큼}},&y\ge\hat y_q\\[0.25em]\underbrace{(1-q)(\hat y_q-y)}_{\text{실제가 분위수보다 작음}},&y<\hat y_q\end{cases}\\[0.6em]\underbrace{\widehat{C}_{90}}_{\text{90\% 구간의 실제 포함률}}&=\frac{1}{N}\sum_{j=1}^{N}\underbrace{\mathbf 1[\ell_j\le y_j\le u_j]}_{\text{실제가 예측 구간 안이면 1}}\end{aligned}`} meaning="Pinball loss는 q에 따라 under-forecast와 over-forecast의 penalty를 다르게 준다. Coverage는 평가 관측 N개 중 실제 값이 lower·upper interval 안에 들어간 비율이다. 90% interval의 coverage가 61%면 interval width, quantile crossing, distribution shift와 slice별 calibration을 다시 점검한다." symbols={[[String.raw`q`, '0과 1 사이의 목표 quantile level'], [String.raw`\hat y_q`, 'model이 예측한 q-quantile'], [String.raw`\rho_q`, 'quantile을 학습·평가하는 asymmetric absolute loss'], [String.raw`\ell_j,u_j`, 'j번째 예측 interval의 lower와 upper bound'], [String.raw`\mathbf 1[\cdot]`, '조건이 참이면 1, 거짓이면 0인 indicator'], [String.raw`N`, 'coverage를 계산한 전체 forecast point 수']]}/>
      </section>

      <section id="foundation-models" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최신 모델은 이름보다 interface로 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>2026년 현재 공개 TSFM은 모두 “숫자를 Transformer에 넣는다”로 묶이지 않는다. Context를 patch나 token으로 바꾸는 방식, 여러 variable의 상호작용, known-future covariate, point·quantile·sample output과 최대 horizon이 다르다. 먼저 target contract를 쓰고 맞는 interface만 후보로 올린다.</p></div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ModelCard name="TimesFM 2.5" version="Google Research · repository 2026-07" input="univariate history, 선택적 XReg covariate" output="point와 optional continuous quantiles, 최대 1K horizon" useWhen="긴 univariate context와 quantile forecast가 필요하고 XReg로 external regressor를 연결할 때" boundary="공식 repository는 200M, 16K context와 quantile head를 공개한다. Open release는 범용 성능 보증 제품이 아니며 XReg preprocessing과 local calibration을 검증해야 한다." />
          <ModelCard name="Chronos-2" version="Amazon Science · official release" input="univariate·multivariate history와 covariate-informed context" output="zero-shot probabilistic forecast" useWhen="매장·변수 관계와 known-future covariate를 하나의 general interface로 시험할 때" boundary="In-context capability가 target fine-tuning을 줄여도 origin별 local evaluation은 사라지지 않는다. Covariate snapshot이 forecast time에 실제 존재했는지 별도로 감사한다." />
          <ModelCard name="Moirai 2.0" version="Salesforce Research · arXiv 2511.11698" input="instance-normalized univariate series, single patch" output="multi-quantile·multi-token forecast" useWhen="작은 decoder-only model의 accuracy·speed tradeoff와 quantile output을 시험할 때" boundary="논문은 multivariate dataset을 variable별 독립 univariate task로 처리하며 cross-variate forecasting을 지원하지 않는다고 명시한다. 변수 상호작용이 핵심이면 interface가 맞지 않는다." />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>GIFT-Eval은 domain, frequency, variate 수와 prediction length를 넓게 나누고 non-leaking pretraining set을 제공한다. 동시에 foundation model이 높은 frequency나 긴 horizon에서 항상 우세하지 않고, pretraining overlap이 있으면 test 성능이 부풀 수 있음을 보여 준다. 공개 leaderboard는 후보 탐색 근거이지 우리 매장 배포 증거가 아니다.</p><p>TimesFM의 in-context fine-tuning 연구처럼 관련 series example을 prompt context로 넣는 방법도 등장했다. 이때 example을 test future에서 고르거나 성능을 본 뒤 유리한 example만 선택하면 새 누출이 된다. Example selector도 train fold에서 정하고 version을 남긴다.</p></div>
      </section>

      <section id="implementation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Leakage assertion에서 release gate까지 닫는다</h2>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{backtestSketch}</code></pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Pipeline은 모든 feature에 <code>event_time</code>, <code>available_at</code>, <code>version</code>를 요구한다. 각 fold에서 <code>available_at &lt;= origin</code>을 assertion하고, transform의 <code>fit_end</code>도 origin을 넘지 않는지 검사한다. Model checkpoint, pretraining-data disclosure, context/horizon config와 quantile postprocessing을 결과와 함께 저장한다.</p></div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProcessRow index="01" title="Data gate"><p>Raw split, feature availability, fold-local transform와 pretraining overlap audit가 통과해야 한다.</p></ProcessRow>
          <ProcessRow index="02" title="Accuracy gate"><p>전체뿐 아니라 critical store·promotion·horizon slice에서 같은 origin의 결과를 한 쌍으로 맞춰 seasonal-naïve·local baseline과 비교한다.</p></ProcessRow>
          <ProcessRow index="03" title="Uncertainty gate"><p>90% interval coverage와 width, quantile crossing을 origin·slice별로 검증하고 calibration을 고정한다.</p></ProcessRow>
          <ProcessRow index="04" title="Runtime gate"><p>batch latency, memory, model load, 비용과 timeout 때 seasonal fallback이 동작하는지 fault injection한다.</p></ProcessRow>
          <ProcessRow index="05" title="Final holdout"><p>Protocol 선택에 쓰지 않은 마지막 기간을 한 번 열어 release decision과 남은 위험을 기록한다.</p></ProcessRow>
        </div>
        <Misconception>Zero-shot은 target dataset으로 weight를 학습하지 않는다는 뜻이다. Target 분포에서 task contract, leakage, accuracy, calibration과 운영 비용을 검증하지 않아도 된다는 뜻이 아니다.</Misconception>
        <CapabilityCheck items={[
          'Forecast origin, context, horizon, target와 retraining cadence를 한 문장과 schema로 고정한다.',
          'Known-future plan과 미래에 관측되는 realization을 available-at timestamp로 구분한다.',
          'Raw timeline split 뒤 fold-local transform과 causal window를 만드는 순서를 설계한다.',
          '여러 rolling origin에서 deployment와 같은 refit·update cadence를 재생한다.',
          'Last-value, seasonal-naïve, ARIMA/ETS와 pretrained candidate의 역할을 구분한다.',
          'Train-only denominator로 MASE를 계산하고 horizon·store slice를 보존한다.',
          'Quantile pinball loss와 empirical interval coverage로 uncertainty calibration을 평가한다.',
          'TimesFM 2.5, Chronos-2와 Moirai 2.0을 covariate·multivariate·output 계약으로 선택한다.',
          'Pretraining overlap, version, latency, memory와 fallback을 release evidence에 포함한다.',
          '누출·critical slice·coverage·runtime gate를 모두 통과할 때만 배포한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Google Research · TimesFM repository', href: 'https://github.com/google-research/timesfm', note: 'TimesFM 2.5의 현재 200M checkpoint, 16K context, quantile head, XReg와 2026 update 기록.' },
          { label: 'Amazon Science · Chronos-2', href: 'https://www.amazon.science/blog/introducing-chronos-2-from-univariate-to-universal-forecasting', note: 'univariate·multivariate·covariate-informed zero-shot forecasting interface의 공식 설명.' },
          { label: 'Moirai 2.0', href: 'https://arxiv.org/abs/2511.11698', note: 'decoder-only, quantile·multi-token 설계와 cross-variate 지원 경계를 명시한 1차 논문.' },
          { label: 'GIFT-Eval', href: 'https://arxiv.org/abs/2410.10393', note: 'domain·frequency·horizon·variate별 benchmark, non-leaking pretraining data와 leakage 분석.' },
          { label: 'Forecasting: Principles and Practice · Time-series cross-validation', href: 'https://otexts.robjhyndman.com/fpp3/tscv.html', note: 'rolling forecasting origin과 multi-step error evaluation의 기준 설명.' },
          { label: 'Hyndman & Koehler · Another look at measures of forecast accuracy', href: 'https://robjhyndman.com/papers/another-look-at-measures-of-forecast-accuracy.pdf', note: '서로 다른 scale의 series를 비교하는 MASE 정의와 동기.' },
          { label: 'Google Research · TimesFM few-shot learners', href: 'https://www.research.google/blog/time-series-foundation-models-can-be-few-shot-learners/', note: '관련 time-series example과 separator를 사용하는 in-context adaptation의 공식 연구 설명.' },
        ]} />
      </section>
    </>
  );
}
