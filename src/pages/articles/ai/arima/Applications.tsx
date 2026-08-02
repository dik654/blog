import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SARIMA 확장과 실전 선택 경계</h2>
      <QuestionLead
        question="계절성·분산 증가·정책 level shift가 함께 있으면 SARIMA 하나로 충분한가?"
        answer="아니다. log/Box–Cox, 계절 차분, 필요한 경우의 일반 차분, step intervention 또는 post-break 창을 서로 다른 가설로 비교해야 한다. 그 전체 선택을 각 rolling origin 안에서 다시 수행하고 24-step seasonal-naive를 이길 때만 채택한다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>ARIMA가 유리한 문제부터 좁힌다</h3>
        <p>
          ARIMA는 하나 또는 소수의 시계열에서 lag 구조가 비교적 안정적이고, 데이터가 아주 많지 않으며, 왜 예측이 움직였는지 계수와 잔차로 진단해야 할 때 강한 기준선이다. 수요·트래픽·센서·경제 지표처럼 시간 간격이 일정한 데이터에서 먼저 시도할 가치가 있다. 그러나 “금융이므로 ARIMA”, “딥러닝 이전 모델이므로 작은 데이터에서 항상 우수” 같은 분야 이름만으로 선택하지 않는다.
        </p>
        <p>
          가장 좋은 용도는 <strong>설명 가능한 최소 모델</strong>이다. ARIMA가 이기면 복잡한 모델이 필요 없다는 근거가 되고, 지면 어떤 추가 정보나 비선형 구조가 실제 성능을 만드는지 비교할 기준이 된다.
        </p>

        <h3>SARIMA: 같은 계절 위치의 기억을 따로 모델링한다</h3>
        <p>
          매월 관측한 매출이 1년 전 같은 달과 반복적으로 연결된다면 짧은 lag와 lag 12는 역할이 다르다. SARIMA는 가까운 시점의 <M>(p,d,q)</M>와 한 계절 간격으로 작동하는 <M>(P,D,Q)_s</M>를 함께 둔다.
        </p>
        <M display>{'\\text{SARIMA}\\left(\\underbrace{p,d,q}_{\\text{가까운 시차 구조}}\\right)\\left(\\underbrace{P,D,Q}_{\\text{계절 시차 구조}}\\right)_{\\underbrace{s}_{\\text{한 계절의 관측 수}}}'}</M>
        <FormulaNote
          meaning="소문자 항은 직전 몇 시점의 관계를, 대문자 항은 s칸씩 떨어진 같은 계절 위치의 관계를 맡는다. D는 계절 간 차이를 먼저 만드는 횟수다. 강한 계절성이 보이면 계절 차분을 먼저 검토하고, 그래도 비계절 단위근이 남을 때만 d를 추가해 과차분을 피한다."
          symbols={[
            ['p,d,q', '가까운 시차에 적용하는 AR 차수, 비계절 차분 횟수, MA 차수'],
            ['P,D,Q', 's칸 간격의 계절 lag에 적용하는 AR 차수, 계절 차분 횟수, MA 차수'],
            ['s', '한 계절 안의 실제 관측 수. 월별 연간 주기라면 12지만 데이터 생성 주기로 확인해야 한다.'],
            ['D', '현재 값과 s시점 전 값을 빼는 계절 차분의 최소 횟수'],
          ]}
        />
        <p>
          <M>s</M>는 달력 이름으로 기계적으로 정하지 않는다. 시간별 전력에는 하루와 주간처럼 여러 계절성이 함께 있을 수 있고, 주별 연간 주기는 윤년과 달력 정렬 때문에 정확히 52로 닫히지 않을 수 있다. 관측 간격, 운영 주기, 계절 플롯과 스펙트럼을 함께 보고 정한다. 여러 긴 계절성이 겹치면 Fourier 항을 가진 동적 회귀, TBATS, 다른 전역 모델이 더 단순할 수 있다.
        </p>

        <h3>알려진 영구 level shift는 step 변수로 분리한다</h3>
        <p>
          정책 시행 시점 <M>T_0</M>가 기록되어 있고 이후 효과가 계속된다는 가설이 있다면,
          시행 전에는 0, 시행 뒤에는 1인 step 변수 <M>I_t</M>를 만든다. 회귀가 평균의 한 번 이동을 맡고,
          ARIMA 오차 <M>\eta_t</M>는 그 이동을 제거한 뒤에도 남은 시간 의존성을 맡는다.
        </p>
        <M display>{'\\begin{aligned}\\underbrace{I_t}_{\\text{정책 step}}&=\\begin{cases}0,&t<T_0\\\\1,&t\\ge T_0\\end{cases}\\\\\\underbrace{Y_t}_{\\text{관측값}}&=\\underbrace{\\beta_0+\\delta I_t}_{\\text{정책 전 기준과 영구 이동}}+\\underbrace{\\eta_t}_{\\text{ARIMA 오차}}\\end{aligned}'}</M>
        <FormulaNote
          meaning="δ는 정책 이후 평균이 얼마나 이동했는지를 나타낸다. 한 시점만 튀었다가 돌아오면 이후 계속 1인 step이 아니라 그 시점만 1인 spike 변수가 맞다. 기울기까지 바뀌면 piecewise trend를 비교한다."
          symbols={[
            ['T_0', '정책 또는 사건이 시작된 것으로 당시 알 수 있던 시점'],
            ['I_t', '사건 전 0, 사건 시점부터 1인 step 개입변수'],
            ['\\delta', '다른 항을 조건으로 둔 영구 평균 이동의 추정 계수'],
            ['\\eta_t', '개입 효과를 제거한 뒤 ARIMA 구조로 설명할 오차'],
          ]}
        />
        <p>
          step 가설이 맞으려면 사건 날짜와 지속 여부가 예측 origin에서 알려져 있어야 한다. 사건 뒤 생성 과정 자체가
          달라져 과거 계수가 더 이상 유효하지 않다면, step 하나로 두 체제를 평균내기보다 post-break 구간만 쓰거나
          짧은 rolling window를 쓰는 후보를 세운다. break 시점과 창 길이도 미래 전체를 보고 고정하지 않고 fold 안에서
          감지·선택해야 한다.
        </p>

        <h3>외부 변수를 넣을 때는 미래 가용성을 먼저 확인한다</h3>
        <p>
          가격·프로모션·휴일·날씨처럼 target 밖의 변수를 추가한 회귀 오차 ARIMA는 흔히 ARIMAX라고 불린다. 핵심은 변수를 많이 넣는 것이 아니라 <strong>예측 origin에서 미래 값을 실제로 알 수 있는가</strong>다. 예정된 가격과 휴일은 known future일 수 있지만 실제 미래 날씨는 예보값을 따로 사용해야 한다. 사후에 확정된 날씨를 넣으면 시간 누출이다.
        </p>
        <M display>{'\\underbrace{Y_t}_{\\text{예측 대상}}=\\underbrace{\\beta^\\top x_t}_{\\text{origin에서 가용한 외부 정보}}+\\underbrace{\\eta_t}_{\\text{ARIMA 구조를 가진 잔차}}'}</M>
        <FormulaNote
          meaning="회귀 부분은 캘린더나 가격처럼 설명 가능한 외부 효과를 맡고, ARIMA 오차는 그 효과를 제거한 뒤에도 시간에 따라 남는 자기상관을 맡는다. 미래 x가 확정되지 않았다면 x 자체의 예측 오차까지 전체 불확실성에 포함해야 한다."
          symbols={[
            ['Y_t', '시점 t에서 예측하려는 수요·매출·센서 값'],
            ['x_t', '예측 시점에 실제로 알려져 있거나 별도 시나리오로 제공되는 설명 변수'],
            ['\\beta', '각 설명 변수가 target에 미치는 선형 효과 계수'],
            ['\\eta_t', '회귀로 설명한 뒤에도 남아 ARIMA로 모델링하는 시간 의존 오차'],
          ]}
        />

        <h3>더 복잡한 모델로 넘어갈 증거</h3>
        <p>
          기준선 사다리는 보통 last-value → seasonal-naïve → ETS → ARIMA 순서로 세운다. ETS는 수준·추세·계절 성분의 변화 자체를 상태로 갱신하고, ARIMA는 lag와 innovation의 자기상관을 설명한다. 둘 중 하나가 항상 상위가 아니므로 같은 rolling origin에서 비교한다.
        </p>
        <div className="not-prose my-5 divide-y divide-border border-y border-border text-sm">
          {[
            ['ARIMA 유지', '소수 시계열, 안정적인 lag, 작은 표본, 빠른 재학습과 진단 가능성이 핵심일 때'],
            ['ETS 비교', '수준·추세·계절 상태가 부드럽게 변하며 lag 회귀보다 성분 갱신으로 설명하는 편이 자연스러울 때'],
            ['동적 회귀·상태공간', 'known future covariate, 시간에 따라 변하는 수준·추세, 결측과 불규칙 관측을 명시적으로 다뤄야 할 때'],
            ['전역 ML·딥러닝', '수천 개 관련 시계열에서 공유 패턴을 배우거나 비선형 covariate interaction이 rolling backtest에서 반복적으로 이득을 줄 때'],
            ['Foundation model', '새 시계열 zero/few-shot 전이가 실제 비용을 줄이고, 동일 평가 계약에서 local baseline을 넘을 때'],
          ].map(([label, detail]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
              <strong className="text-foreground">{label}</strong>
              <span className="text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
        <p>
          모델 클래스가 성능 순서를 보장하지 않는다. 데이터가 많아도 강한 seasonal-naïve가 이길 수 있고, 작은 데이터라도 여러 관련 series를 함께 학습한 전역 모델이 이길 수 있다. 같은 origin, horizon, metric, 비용 제약에서 얻은 증거로만 이동한다.
        </p>

        <h3>한 번에 엮어 읽기: 24개월 수요 예측</h3>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border">
          {[
            ['01', '분산 증가를 먼저 처리', '수준과 함께 흔들림이 커지므로 log/Box–Cox 후보를 fold 안에서 적합한다. 차분부터 누르지 않는다.'],
            ['02', '계절 차분을 먼저 확인', '월별 반복이 강하므로 lag 12의 D=1을 먼저 보고, 평균 이동이 남을 때만 d=1을 추가한다.'],
            ['03', '정책 shift를 별도 가설로 둠', '알려진 정책이면 step 변수를, 새 체제라면 post-break 창을 비교한다. level shift를 d 증가로 대체하지 않는다.'],
            ['04', '작은 SARIMA 후보를 만듦', 'ACF/PACF로 인접한 p·q·P·Q 후보만 제안하고 같은 학습 창에서 AICc로 선별한다.'],
            ['05', '잔차 실패를 원인별로 되돌림', '자기상관이면 lag 구조, 이분산이면 변환과 구간, shift면 intervention·창을 다시 본다.'],
            ['06', '24-step에서 출시를 결정', '각 fold에서 모든 선택을 다시 하고 horizon 1~24의 오차와 포함률을 seasonal-naive와 비교한다. 13~24개월에서 지면 출시하지 않는다.'],
          ].map(([index, title, body]) => (
            <div key={index} className="grid min-w-0 gap-2 bg-background p-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
              <span className="font-mono text-sm font-black text-blue-700 dark:text-blue-300">{index}</span>
              <div className="min-w-0">
                <p className="text-sm font-black text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <h3>운영에 내보내기 전 남겨야 할 기록</h3>
        <ol>
          <li><strong>예측 계약:</strong> origin, horizon, target 단위, 미래에 가용한 feature를 명시한다.</li>
          <li><strong>변환 계약:</strong> Box–Cox·log·계절 차분·일반 차분의 순서와 역변환을 기록한다.</li>
          <li><strong>선택 근거:</strong> 후보 범위, AICc 기준, 잔차 진단 결과와 되돌아간 이유를 남긴다.</li>
          <li><strong>바깥 검증:</strong> 각 rolling origin의 기준선 대비 오차와 예측 구간 포함률을 함께 본다.</li>
          <li><strong>실패 대응:</strong> 구조 변화 감지, 재학습 주기, seasonal-naïve fallback을 운영 계약에 넣는다.</li>
        </ol>

        <h3>이 글에서 멈추는 지점</h3>
        <p>
          단위근 검정의 점근 증명, Kalman filter를 이용한 최대우도 내부 구현, 큰 p·q 격자 탐색은 이 기반 글의 목표가 아니다. 독자는 차분 공간의 의미, 후보와 진단의 구분, fold-local 선택, naïve 대비 채택 조건을 설명할 수 있으면 다음 모델로 올라간다. 내부 수학을 더 깊게 볼 때는 상태공간·확률·최적화 기반 글로 내려간다.
        </p>
        <CapabilityCheck
          items={[
            'I·AR·MA가 각각 level 이동, 과거 값과 과거 innovation 중 무엇을 맡는지 설명할 수 있다.',
            'ADF p-value 하나가 아니라 최소 차분·계절성·잔차 진단을 함께 보는 이유를 설명할 수 있다.',
            'AICc로 고른 모델과 rolling-origin 승자가 다를 수 있는 이유를 말할 수 있다.',
            '영구 level shift를 단위근과 구분하고 step 변수와 post-break 창을 비교할 수 있다.',
            'log 역변환의 중앙값과 평균이 언제 달라지는지 설명할 수 있다.',
            'ARIMA가 seasonal-naive에 지면 복잡도를 키우지 않고 후보를 기각할 수 있다.',
          ]}
        />

        <SourceNotes sources={[
          { label: 'FPP3 · Seasonal ARIMA models', href: 'https://otexts.com/fpp3/seasonal-arima.html', note: '비계절 (p,d,q)와 계절 (P,D,Q)s 항, 계절 lag의 ACF/PACF 해석을 정의한 직접 근거.' },
          { label: 'FPP3 · Some useful predictors', href: 'https://otexts.com/fpp3/useful-predictors.html', note: '일회성 spike, 영구 level shift의 step 변수와 기울기 변화 개입을 구분한 근거.' },
          { label: 'FPP3 · Dynamic regression models', href: 'https://otexts.com/fpp3/dynamic.html', note: '회귀 효과와 ARIMA 오차를 분리하는 모델 구조의 근거.' },
          { label: 'FPP3 · Forecasting with dynamic regression', href: 'https://otexts.com/fpp3/forecasting.html', note: '미래 predictor가 알려지지 않으면 별도 예측이나 시나리오가 필요하고, predictor 불확실성도 경계해야 한다는 근거.' },
          { label: 'FPP3 · ARIMA versus ETS', href: 'https://otexts.com/fpp3/arima-ets.html', note: '모델 계열마다 표현 가능한 구조가 달라 동일한 바깥 검증에서 비교해야 한다는 연결점.' },
        ]} />
      </div>
    </section>
  );
}
