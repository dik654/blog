import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ExtensionChoiceViz from "./viz/ExtensionChoiceViz";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        계절성과 외생 변수를 더하되 forecast 시점의 정보 경계를 지킨다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          비계절 차분 뒤에도 lag s마다 dependence가 반복되면 seasonal difference와
          seasonal AR·MA polynomial을 추가한 SARIMA를 고려한다. 월별 자료의 연간
          pattern에 s=12가 자연스러울 수 있지만 영업일 수, 이동 휴일과 promotion
          calendar처럼 실제 업무 주기가 sampling frequency와 다르면 plot과 domain
          schedule에서 period를 확인해야 한다.
        </p>
      </div>

      <ExplainedFormula
        question="비계절 dynamics와 s주기 계절 dynamics를 한 ARIMA operator에 어떻게 결합할까?"
        idea={<>비계절 AR·MA polynomial과 B^s를 사용하는 seasonal polynomial을 곱합니다. 차분도 (1−B)^d와 (1−B^s)^D로 분리해 local trend와 반복되는 seasonal level을 따로 제거합니다.</>}
        formula={String.raw`\begin{aligned}W_t&=(1-B)^d(1-B^s)^D Y_t\\A(B)W_t&=c+M(B)\varepsilon_t\\A(B)&=\Phi(B^s)\phi(B)\\M(B)&=\Theta(B^s)\theta(B)\end{aligned}`}
        terms={[
          { symbol: "(p,d,q)", name: "non-seasonal order", description: "인접 lag의 AR, difference와 MA 차수입니다." },
          { symbol: "(P,D,Q)_s", name: "seasonal order", description: "s 간격 lag에 적용하는 AR, difference와 MA 차수입니다." },
          { symbol: "\\Phi,\\Theta", name: "seasonal polynomials", description: "B^s, B^{2s}처럼 seasonal lag를 읽습니다." },
          { symbol: "s", name: "season length", description: "관측 간격으로 표현한 실제 반복 주기입니다." },
        ]}
        assumptions={["하나의 안정된 season length가 있고 계절 구조가 forecasting 기간에도 유지됩니다.", "여러 계절성이나 이동하는 calendar effect는 이 단일 seasonal polynomial로 충분하지 않을 수 있습니다."]}
        interpretation="SARIMA는 계절 label을 붙이는 기능이 아니라 seasonal lag에 별도 difference와 dynamics를 두는 모델입니다. s를 calendar 이름만 보고 정하지 않습니다."
      />

      <ExtensionChoiceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Exogenous variable은 예측 시점에 실제로 이용할 수 있어야 한다</h3>
        <p>
          회귀식에 ARIMA error를 결합하는 dynamic regression은 가격, 날씨, 행사처럼
          target 밖의 정보를 사용할 수 있다. 그러나 test period의 실제 weather나
          확정되지 않은 promotion 결과를 그대로 넣으면 future leakage가 된다.
          Production에서 미래 값을 알 수 없다면 해당 variable 자체를 먼저
          forecast하거나 scenario로 제공하고, 그 uncertainty가 최종 interval에
          빠져 있음을 명시한다.
        </p>

        <h3>ARIMA를 계속 쓸 때와 넘어갈 때</h3>
        <p>
          짧은 단일 series의 선형 dependence와 설명 가능성이 중요하면 ARIMA는
          훌륭한 baseline이다. 다수 series가 공통 pattern을 공유하거나 여러
          seasonality, regime change와 강한 nonlinear interaction이 핵심이면
          state-space, tree, global neural forecasting model을 같은 cutoff와 horizon,
          metric에서 비교한다. <a href="https://www.jstatsoft.org/article/view/v027i03" target="_blank" rel="noreferrer">Hyndman–Khandakar 절차</a>는
          unit-root test, AICc와 stepwise search를 결합해 ARIMA order 탐색을
          자동화하지만, forecast contract와 out-of-sample validation까지 대신하지는
          않는다.
        </p>
        <div id="paper-auto-arima" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Automatic ARIMA search</p>
          <p className="mt-2 text-sm font-semibold">Automatic Time Series Forecasting: The forecast Package for R</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Hyndman과 Khandakar는 unit-root·seasonal-root test로 차분 후보를 정하고 AICc 기반
            stepwise search로 ARIMA order를 탐색하는 실용 절차를 제시했습니다. 이는 논문의
            likelihood·candidate space·implementation 조건에서 search 비용을 줄이는 방법이지,
            선택된 model이 모든 horizon·structural break에서 최적이거나 rolling-origin 검증을
            생략해도 된다는 결론은 아닙니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jstatsoft.org/article/view/v027i03" target="_blank" rel="noreferrer">원 논문의 차분·AICc·stepwise 절차 보기</a>
        </div>
        <p>
          순환 신경망으로 window와 hidden state를 학습하는 경로는
          <Link to="/ai/lstm-timeseries"> LSTM 시계열 글</Link>에서 이어진다.
          그 글에서도 ARIMA를 지우지 않고, 복잡한 model이 rolling-origin error와
          operational cost에서 실제 추가 가치를 주는지 확인할 기준선으로 남긴다.
        </p>
        <p>
          실제 교체 판단은 같은 forecast origins·horizons·available features에서 point error와
          interval coverage, event·structural-break slice, p95 latency와 memory를 함께 비교한다.
          Automatic search 결과도 이 gate를 통과해야 하며, canary에서 중요한 horizon의 error나
          coverage가 hard limit를 넘으면 이전 ARIMA order·transform artifact로 rollback한다.
        </p>
      </div>
    </section>
  );
}
