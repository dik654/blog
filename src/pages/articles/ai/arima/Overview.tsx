import ExplainedFormula from "@/components/ui/explained-formula";
import ForecastContractViz from "./viz/ForecastContractViz";
import DifferencingViz from "./viz/DifferencingViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ARIMA는 복잡한 모델이 이겨야 할 해석 가능한 기준선이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          다음 달 수요를 예측하려는데 최근 몇 달의 상승세가 계속될지, 직전의
          일시적 충격이 얼마나 남을지부터 설명하지 못한다면 더 큰 neural model을
          넣어도 개선 이유를 알기 어렵다. ARIMA(AutoRegressive Integrated Moving
          Average)는 한 시계열을 차분해 안정된 변화량으로 만든 뒤, 과거 값의
          관성과 과거 예측 오차의 잔여 효과를 선형식으로 분리한다. 적은 data에서도
          강한 기준선이 되고 parameter의 역할과 residual을 진단할 수 있다는 점이
          여전히 중요하다.
        </p>
        <p>
          다만 ARIMA는 p·d·q를 자동으로 맞히는 주문이 아니다. Target의 sampling
          interval, forecast horizon, 예측 시점에 알 수 있는 feature를 먼저 고정하고,
          stationary representation을 찾은 다음 ARMA dynamics를 추정해야 한다.
          마지막에는 미래를 흉내 낸 validation과 residual diagnostic으로 가정을
          다시 확인한다. 이 순서를 지켜야 in-sample fit이 아니라 forecasting
          system으로 읽을 수 있다.
        </p>
      </div>

      <ForecastContractViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ARMA가 다루는 대상은 weakly stationary series다</h3>
        <p>
          Weak stationarity(약정상성)는 평균과 분산이 시간에 따라 일정하고,
          두 시점의 covariance가 달력상의 절대 위치보다 lag에만 의존한다는
          second-order 가정이다. 모든 joint distribution이 shift에 불변인 strict
          stationarity보다 약하며, 실제 ARIMA 계산은 이 평균·공분산 구조를
          기준으로 한다.
        </p>
      </div>

      <ExplainedFormula
        question="ARMA가 같은 parameter로 모든 시점을 설명하려면 어떤 통계량이 시간에 대해 안정돼야 할까?"
        idea={<>시점 t 자체가 아니라 lag k만 같으면 같은 covariance를 갖도록 두면, 고정된 AR·MA coefficient가 시간 전체에 동일한 dependence를 설명할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}\mathbb E[Z_t]&=\mu\\\operatorname{Var}(Z_t)&=\sigma^2<\infty\\\operatorname{Cov}(Z_t,Z_{t-k})&=\gamma(k)\end{aligned}`}
        terms={[
          { symbol: "Z_t", name: "stationary representation", description: "원 series Yt를 필요에 따라 변환·차분한 뒤 ARMA에 넣는 값입니다." },
          { symbol: "\\mu,\\sigma^2", name: "constant moments", description: "시간 t에 따라 바뀌지 않는 평균과 유한한 분산입니다." },
          { symbol: "\\gamma(k)", name: "autocovariance", description: "두 관측 사이의 lag k에만 의존하는 공분산입니다." },
        ]}
        assumptions={["Second moment가 존재하고 sampling interval이 일관적입니다.", "이 조건은 Gaussianity나 strict stationarity를 의미하지 않습니다."]}
        interpretation="Stationarity는 plot이 평평해 보인다는 뜻이 아니라 parameter와 dependence가 시간에 따라 변하지 않는다는 모델링 가정입니다. Unit-root test 하나만으로 모든 형태의 stationarity를 증명할 수는 없습니다."
      />

      <DifferencingViz />

      <ExplainedFormula
        question="추세가 있는 level series를 ARMA가 다룰 변화량으로 어떻게 바꿀까?"
        idea={<>Difference operator는 현재 level에서 직전 level을 빼 increment를 남깁니다. d번 반복한 Zt=(1−B)^dYt에 stationary ARMA를 맞추고, forecast는 누적해 원래 level로 되돌립니다.</>}
        formula={String.raw`\begin{aligned}BY_t&=Y_{t-1}\\\Delta Y_t&=(1-B)Y_t=Y_t-Y_{t-1}\\Z_t&=\Delta^dY_t=(1-B)^dY_t\end{aligned}`}
        terms={[
          { symbol: "B", name: "backshift operator", description: "시계열을 한 lag 뒤로 이동시키는 연산자입니다." },
          { symbol: "\\Delta", name: "difference operator", description: "연속한 level의 차이를 계산하는 1−B입니다." },
          { symbol: "d", name: "integration order", description: "Stationary representation에 도달하기 위해 적용한 차분 횟수입니다." },
        ]}
        assumptions={["차분으로 제거할 수 있는 stochastic trend가 주요 nonstationarity라고 가정합니다.", "Deterministic trend·seasonal difference·variance stabilization은 별도 선택입니다."]}
        interpretation="차분은 정보를 공짜로 정리하지 않습니다. d를 늘리면 low-frequency signal을 지우고 uncertainty를 키울 수 있으므로 validation과 residual을 만족하는 최소 차수를 선택합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ADF(Augmented Dickey–Fuller) test는 unit root가 있다는 null hypothesis를
          검토한다. Reject하지 못했다고 unit root가 증명되는 것도 아니고, reject한
          뒤 모든 종류의 stationarity가 보장되는 것도 아니다. Deterministic term과
          lag 선택에 따라 결과가 달라지므로 plot, domain event, ACF와 차분 후
          residual을 함께 보며 over-differencing을 피한다. Unit-root estimator의
          비표준 분포가 필요한 이유는 <a href="https://doi.org/10.1080/01621459.1979.10482531" target="_blank" rel="noreferrer">Dickey–Fuller 원 논문</a>에서
          확인할 수 있다.
        </p>
      </div>

      <div id="paper-dickey-fuller" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Unit-root 검정의 출발점</p>
        <p className="mt-2 text-sm font-semibold">Distribution of the Estimators for Autoregressive Time Series with a Unit Root</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Dickey와 Fuller는 AR coefficient가 unit root 경계에 있을 때 estimator와 test statistic이
          통상적인 t 분포를 따르지 않는 문제를 다뤘습니다. 핵심 기여는 이 경계 상황의 비표준
          limit distribution을 유도한 것이며, deterministic term과 error 가정이 정해진 모형 안에서
          읽어야 합니다. ADF p-value 하나가 모든 추세·계절성·구조 변화를 진단하거나 stationarity를
          보장한다는 결론으로 일반화하면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1080/01621459.1979.10482531" target="_blank" rel="noreferrer">원 논문의 unit-root 경계와 검정 분포 보기</a>
      </div>
    </section>
  );
}
