import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ForecastWindowViz from "./viz/ForecastWindowViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LSTM을 고르기 전에 예측 시점을 먼저 고정한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
            “최근 24시간으로 다음 6시간의 전력 수요를 예측한다”는 문장에는 모델보다 중요한 계약이 들어 있다. Target과 관측 간격, 예측을 시작하는 forecast origin,
            필요한 horizon, 그 시점에 실제로 알 수 있는 정보가 정해져야 비로소 학습 sample을 만들 수 있다.
          </p>
        <p>LSTM은 이 sample의 과거 값을 순서대로 읽으며 hidden·cell state를 갱신하는 함수다. 비선형 시간 의존성을 학습할 수 있지만 추세·계절성·데이터 누출을 알아서 해결하지는 않는다. Gate와 cell state의 수학은 <Link to="/ai/lstm">LSTM 구조 글</Link>이 소유하고, 이 글은 window·state lifecycle·horizon과 평가 계약에 집중한다. 선형 기준선이 필요하면 <Link to="/ai/arima">ARIMA 글</Link>을 함께 보면 된다.</p>
      </div>
      <ForecastWindowViz />
      <ExplainedFormula
        question="연속된 시계열 하나를 LSTM이 학습할 input–target sample로 어떻게 바꿀까?"
        idea={<>Forecast origin t를 하나 고른 뒤 그 이전 L개 step을 input으로, 그 다음 H개 step을 target으로 묶습니다. Origin을 stride S만큼 이동하면 다음 sample이 생깁니다.</>}
        formula={String.raw`\begin{aligned}X_t&=[\mathbf x_{t-L+1},\ldots,\mathbf x_t]\in\mathbb R^{L\times F}\\Y_t&=[\mathbf y_{t+1},\ldots,\mathbf y_{t+H}]\in\mathbb R^{H\times D_y}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}X_t&=\underbrace{[\mathbf x_{t-L+1},\ldots,\mathbf x_t]\in\mathbb R^{L\times F}}_{\text{look-back 계산}}\\Y_t&=\underbrace{[\mathbf y_{t+1},\ldots,\mathbf y_{t+H}]\in\mathbb R^{H\times D_y}}_{\text{target dimension 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`[\mathbf x_{t-L+1},\ldots,\mathbf x_t]\in\mathbb R^{L\times F}`, annotation: ["look-back이(가) 식의 결과에 기여하는 방식을","계산합니다.","Forecast origin t를 하나 고른 뒤 그 이전 L개","step을 input으로, 그 다음 H개 step을"] },
          { expression: String.raw`[\mathbf y_{t+1},\ldots,\mathbf y_{t+H}]\in\mathbb R^{H\times D_y}`, annotation: ["target dimension이(가) 식의 결과에 기여하는","방식을 계산합니다.","Forecast origin t를 하나 고른 뒤 그 이전 L개","step을 input으로, 그 다음 H개 step을"] },
        ]}
        terms={[
          { symbol: "L", name: "look-back", description: "모델이 한 origin에서 직접 읽는 과거 step 수입니다." },
          { symbol: "H", name: "forecast horizon", description: "한 origin에서 평가할 미래 step 수입니다." },
          { symbol: "F", name: "input features", description: "Target lag와 calendar·known covariate 등 origin에서 사용할 수 있는 feature 수입니다." },
          { symbol: "D_y", name: "target dimension", description: "동시에 예측하는 target 변수의 수입니다." },
        ]}
        assumptions={["모든 feature는 해당 forecast origin에서 실제로 관측 가능해야 합니다.", "겹치는 window는 sample 수를 늘리지만 독립 관측을 같은 비율로 늘리지는 않습니다."]}
        interpretation="L과 H는 단순한 tensor 크기가 아니라 모델이 볼 수 있는 원인 구간과 운영에서 답해야 하는 미래 구간입니다. 계절 주기보다 L이 짧다면 lag feature를 추가하거나 window를 늘리는 선택이 필요합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Window가 길수록 기억력이 좋아지는 것은 아니다</h3>
        <p>
            Look-back을 늘리면 더 오래된 관측을 제공하지만 sequence 길이와 optimization path도 함께 늘어난다. 필요한 계절 주기와 지연 효과가 들어오지 않으면
            under-specification이다. 관련 없는 오래된 구간까지 넣으면 계산량과 분산이 커진다. domain에서 가능한 원인 구간을 후보로 정한 뒤 같은 rolling-
            origin validation에서 비교한다.
          </p>
      </div>
    </section>
  );
}
