import ARIMAPipelineViz from './viz/ARIMAPipelineViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  ConceptPrimer,
  InternalLink,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ARIMA는 왜 지금도 먼저 세우는 기준선인가</h2>
      <QuestionLead
        question="어제와 비슷한 오늘을 예측하는 데 거대한 모델이 정말 필요한가?"
        answer="먼저 마지막 값과 같은 계절 위치를 반복하고, 그 다음 ARIMA로 과거 값과 과거 예측 오차의 선형 구조를 설명한다. 이 싼 후보를 같은 rolling origin에서 이기지 못하면 더 복잡한 모델을 채택할 근거가 없다."
      />
      <ConceptPrimer
        items={[
          {
            term: 'Lag',
            meaning: '현재에서 k step 전의 관측값 또는 오차다.',
            why: '시간 순서가 아니라 몇 step 떨어졌는지를 AR·MA 계수의 입력으로 쓰기 때문이다.',
          },
          {
            term: 'Difference',
            meaning: '현재 값에서 직전 또는 한 계절 전 값을 빼 level 변화를 제거하는 연산이다.',
            why: '시간에 따라 움직이는 평균을 줄여 같은 lag 규칙을 미래에도 적용할 근거를 만든다.',
          },
          {
            term: 'Innovation',
            meaning: '이전 예측이 설명하지 못한 새 오차다.',
            why: 'MA는 관측값 평균이 아니라 최근 innovation의 흔적을 다음 예측에 반영한다.',
          },
          {
            term: 'Residual',
            meaning: '모델을 fit한 뒤 실제 값에서 fitted value를 뺀 남은 신호다.',
            why: '잔차에 반복 구조가 남으면 모델이 아직 예측 가능한 패턴을 놓쳤다는 뜻이기 때문이다.',
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          TimesFM·Chronos 같은 시계열 foundation model을 평가할 때도 첫 질문은 “최신 모델인가?”가 아니다. 같은 시간 경계와 같은 예측 구간에서 <strong>마지막 값 반복, seasonal-naïve, ARIMA 같은 싼 기준선보다 실제로 나은가</strong>가 먼저다. ARIMA는 과거 값의 관성과 과거 예측 오차의 흔적을 명시적인 선형 구조로 분해하므로, 데이터가 무엇을 예측 가능하게 만드는지 확인하는 최소 실험이 된다.
        </p>
        <p>
          이름은 <strong>AutoRegressive Integrated Moving Average</strong>다. 먼저 원시 시계열을 필요한 만큼 차분하고(<strong>I</strong>), 차분된 값의 과거 lag(<strong>AR</strong>)와 과거 innovation, 즉 새 예측 오차(<strong>MA</strong>)로 다음 변화를 예측한다. “moving average”는 최근 관측값의 단순 평균이 아니라 <strong>오차항의 가중합</strong>이라는 점이 중요하다.
        </p>
        <p>
          아래 흐름은 한 번에 <M>p,d,q</M>를 맞히는 레시피가 아니다. 후보를 세우고, 잔차에서 실패 이유를 찾고, 시간 순서가 보존된 바깥 검증에서 기준선을 이길 때까지 되돌아가는 <strong>진단 루프</strong>다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <ARIMAPipelineViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>정상성은 “그래프가 평평해 보인다”는 뜻이 아니다</h3>
        <p>
          ARMA 부분이 안정적으로 같은 규칙을 학습하려면, 모델에 넣는 차분 시계열의 평균과 분산이 시간에 따라 크게 이동하지 않고 두 시점의 관계가 달력 위치가 아니라 시차에 주로 의존해야 한다. 이를 약한 정상성이라고 한다.
        </p>
        <M display>{'\\begin{aligned} \\underbrace{E[Y_t] = \\mu}_{\\text{시간이 지나도 평균이 일정}} &\\qquad \\underbrace{\\mathrm{Var}(Y_t) = \\sigma^2}_{\\text{변동 폭이 일정}} \\\\ \\underbrace{\\mathrm{Cov}(Y_t,Y_{t-k}) = \\gamma(k)}_{\\text{두 값의 관계는 시차 k로 결정}} \\end{aligned}'}</M>
        <FormulaNote
          meaning="이 조건은 원시 데이터가 언제나 평평해야 한다는 명령이 아니다. ARIMA에서는 필요한 변환과 차분을 적용한 뒤의 시계열이 이 성질에 가까운지 본다. 그래야 같은 lag 계수를 미래에도 사용할 근거가 생긴다."
          symbols={[
            ['Y_t', '시점 t에서 모델이 다루는 값. ARIMA에서는 보통 d번 차분한 값이다.'],
            ['E[Y_t]=\\mu', '시간 구간이 달라져도 중심이 크게 이동하지 않는다는 조건'],
            ['\\mathrm{Var}(Y_t)=\\sigma^2', '시간 구간이 달라져도 흔들림의 크기가 크게 달라지지 않는다는 조건'],
            ['\\mathrm{Cov}(Y_t,Y_{t-k})=\\gamma(k)', 't가 언제인지보다 두 관측값 사이 거리 k가 관계를 결정한다는 조건'],
          ]}
        />

        <h3>처리 순서 1: 흔들림의 폭부터 안정화한다</h3>
        <p>
          수준이 커질수록 계절 진폭과 오차 폭도 함께 커진다면 차분보다 먼저 log 또는 Box–Cox 변환을 검토한다.
          Box–Cox는 log를 한 경우로 포함하며, 양수 값을 여러 거듭제곱 형태로 바꿔 변동 폭을 고르게 만드는 변환족이다.
          차분은 평균의 이동을 줄이는 연산이지, 분산 증가를 자동으로 고치는 연산이 아니다. log는 양수 데이터에서
          절대 변화가 아니라 비율 변화로 읽히게 해, 큰 값 구간의 흔들림이 모델을 압도하는 문제를 줄인다.
        </p>
        <p>
          변환 공간에서 log 예측이 평균 <M>{'\\widehat{\\mu}_h'}</M>, 분산 <M>{'\\widehat{\\sigma}_h^2'}</M>인
          정규분포에 가깝다고 가정하면, 단순 지수 역변환은 원래 단위 분포의 중앙값이고 평균은 더 크다.
        </p>
        <M display>{'\\begin{aligned}\\underbrace{\\widehat y_{h,\\mathrm{median}}}_{\\text{원래 단위 중앙값}}&=\\underbrace{\\exp(\\widehat\\mu_h)}_{\\text{log 예측을 단순 역변환}}\\\\\\underbrace{\\widehat y_{h,\\mathrm{mean}}}_{\\text{합산 가능한 평균}}&=\\underbrace{\\exp\\!\\left(\\widehat\\mu_h+\\tfrac12\\widehat\\sigma_h^2\\right)}_{\\text{log-normal 가정의 편향 보정}}\\end{aligned}'}</M>
        <FormulaNote
          meaning="지점별 판매량을 더해 총판매량을 만들려면 중앙값보다 평균이 필요하다. 다만 아래 평균 식은 log 공간의 예측 분포가 정규분포라는 가정에서 정확하다. 실제 운영에서는 원래 단위의 예측구간이 실제값을 포함한 rolling origin의 비율, 즉 구간 포함률까지 확인한다."
          symbols={[
            ['\\widehat\\mu_h', 'log 공간에서 h-step 예측 분포의 평균'],
            ['\\widehat\\sigma_h^2', 'log 공간에서 h-step 예측 분포의 분산'],
            ['\\exp(\\widehat\\mu_h)', '대칭인 log 분포를 원래 단위로 되돌린 중앙값'],
            ['\\exp(\\widehat\\mu_h+\\widehat\\sigma_h^2/2)', 'log-normal 가정에서 분산에 따른 치우침을 반영한 평균'],
          ]}
        />

        <h3>처리 순서 2: 계절 차분 뒤에 최소 d를 고른다</h3>
        <p>
          ADF 검정의 귀무가설은 “단위근이 있다”이다. 작은 p-value는 그 가설을 기각할 근거지만, 큰 p-value가 곧 “반드시 비정상”을 증명하는 것은 아니다. 짧은 표본에서는 검정력이 약하고 구조 변화·계절성·결정적 추세에 따라 결과가 달라질 수 있다. KPSS는 반대로 “정상이다”를 귀무가설로 두므로 두 검정이 같은 방향의 확답을 주는 것이 아니라 서로 다른 실패를 살핀다. 원시 플롯, 계절 패턴, ACF와 이 보완 검정을 함께 보고 <strong>가장 작은 d</strong>를 선택한다.
        </p>
        <p>
          차분을 너무 많이 하면 원래 없던 음의 자기상관과 불필요한 변동을 만들 수 있다. 강한 계절성이 있다면 계절 차분을 먼저 검토하고, 그 뒤에도 필요한 경우에만 비계절 차분을 추가한다.
        </p>
        <h3>처리 순서 3: 한 번의 영구 점프를 단위근으로 오해하지 않는다</h3>
        <p>
          정책 시행 직후 평균이 한 번 뛰고 새 수준에서 머문다면 이는 <strong>level shift</strong>일 수 있다.
          매 시점의 충격이 계속 누적되는 단위근과는 다른 가설이다. 차분을 더하면 shift 시점의 큰 spike는 남고
          정상 구간에는 불필요한 음의 자기상관을 만들 수 있다. 사건 날짜와 지속 방식이 알려졌다면 step 개입변수를
          비교하고, 사건 뒤 데이터가 사실상 새 체제라면 post-break 구간만으로 다시 적합한 후보도 비교한다.
          어느 쪽이 맞는지는 전체 데이터에서 한 번 정하지 않고 각 rolling-origin의 과거 안에서만 선택한다.
        </p>

        <h3>이 글의 위치</h3>
        <p>
          이 글은 ARIMA의 계산과 진단을 이해하는 기반 글이다. 실제 후보들을 공정하게 비교하는 정보 가용성,
          rolling-origin 분할, 예측 horizon과 확률 예측 보정은{' '}
          <InternalLink slug="time-series-forecasting-evaluation" learningPathId="ai-timeseries-forecasting">
            시계열 예측 검증: Rolling Backtest에서 Foundation Model까지
          </InternalLink>
          에서 이어진다.
        </p>
        <SourceNotes sources={[
          { label: 'FPP3 · Stationarity and differencing', href: 'https://otexts.com/fpp3/stationarity.html', note: '분산은 변환으로, 평균 이동은 차분으로 다루며 계절 차분을 먼저 검토하고 최소 차분을 쓰라는 근거.' },
          { label: 'FPP3 · Transformations and adjustments', href: 'https://otexts.com/fpp3/transformations.html', note: '수준과 함께 변동 폭이 커질 때 log·Box–Cox 변환을 적용하는 근거.' },
          { label: 'FPP2 · Bias adjustments', href: 'https://otexts.com/fpp2/transformations.html', note: '단순 역변환의 중앙값과 log-normal 가정의 평균 편향 보정 식을 명시한 근거.' },
          { label: 'Dickey & Fuller · Unit root estimators (1979)', href: 'https://doi.org/10.1080/01621459.1979.10482531', note: 'ADF 계열 단위근 검정의 원 통계적 근거.' },
        ]} />
      </div>
    </section>
  );
}
