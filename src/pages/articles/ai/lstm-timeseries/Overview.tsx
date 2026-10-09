import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import ForecastWindowViz from "./viz/ForecastWindowViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">과거 6개 step은 입력이고 다음 3개 step은 target입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
            Forecast origin t를 기준으로 t−5부터 t까지 여섯 관측을 input으로 묶고,
            t+1부터 t+3까지 세 값을 target으로 묶습니다. 경계 오른쪽의 실제 미래값은
            학습 loss나 사후 평가 때만 공개됩니다.
          </p>
        <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
        <ol>
          <li>t 시점의 값은 input에 포함될까요?</li>
          <li>t+1의 실제 target을 t 시점 feature로 넣어도 될까요?</li>
          <li>이 sample의 input length L과 horizon H는 각각 6과 3일까요?</li>
        </ol>
        <p>답은 <strong>예, 아니요, 예</strong>입니다. Forecast origin에서 실제로 알 수 없는 미래 target이나 사후 집계값을 넣으면 leakage가 됩니다.</p>
      </div>
      <ForecastWindowViz />
      <ContentBoundary article="lstm-timeseries" />
      <ExplainedFormula
        question="연속된 시계열 하나를 LSTM이 학습할 input–target sample로 어떻게 바꿀까?"
        idea={<>Forecast origin t를 하나 고른 뒤 그 이전 L개 step을 input으로, 그 다음 H개 step을 target으로 묶습니다. Origin을 stride S만큼 이동하면 다음 sample이 생깁니다.</>}
        formula={String.raw`\begin{aligned}X_t&=[\mathbf x_{t-L+1},\ldots,\mathbf x_t]\in\mathbb R^{L\times F}\\Y_t&=[\mathbf y_{t+1},\ldots,\mathbf y_{t+H}]\in\mathbb R^{H\times D_y}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}X_t&=\underbrace{[\mathbf x_{t-L+1},\ldots,\mathbf x_t]}_{\text{origin t 이전 L step}}\in\underbrace{\mathbb R^{L\times F}}_{\text{step마다 F feature}}\\Y_t&=\underbrace{[\mathbf y_{t+1},\ldots,\mathbf y_{t+H}]}_{\text{origin 다음 H step}}\in\underbrace{\mathbb R^{H\times D_y}}_{\text{step마다 D_y target}}\end{aligned}`}
        operations={[
          { expression: String.raw`[\mathbf x_{t-L+1},\ldots,\mathbf x_t]\in\mathbb R^{L\times F}`, annotation: ["forecast origin t에서 뒤로 L개 step의 feature를","input window로 묶습니다. 계절 주기보다 L이","짧으면 lag feature를 추가하거나 L을 늘립니다"] },
          { expression: String.raw`[\mathbf y_{t+1},\ldots,\mathbf y_{t+H}]\in\mathbb R^{H\times D_y}`, annotation: ["같은 origin에서 앞으로 H개 step의 target을","정답으로 묶습니다. origin을 stride S만큼 옮기면","다음 sample이 생기지만 독립 관측은 안 늡니다"] },
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
