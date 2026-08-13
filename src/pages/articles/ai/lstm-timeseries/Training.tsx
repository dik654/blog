import ExplainedFormula from "@/components/ui/explained-formula";
import LeakageBoundaryViz from "./viz/LeakageBoundaryViz";

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">누출은 window 모양이 아니라 정보의 시점으로 판정한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">전체 시계열로 scaler를 fit하거나 window를 먼저 만든 뒤 무작위로 나누면 미래 구간의 level과 target이 train에 섞인다. 먼저 raw timeline에 cutoff를 긋고, 각 rolling fold의 train 구간으로만 결측 처리·scaler·feature selection을 fit해야 한다. 다만 validation의 첫 origin이 train 마지막 L step을 history로 사용하는 것은 정상이다. 과거를 가져오는 것과 미래의 통계를 미리 아는 것은 다른 문제다.</p>
      </div>
      <LeakageBoundaryViz />
      <ExplainedFormula
        question="Validation의 크기와 평균을 보지 않고 feature scale을 어떻게 맞출까?"
        idea={<>각 rolling fold에서 train 구간의 평균과 표준편차만 추정하고, 그 고정된 parameter를 validation·test에 그대로 적용합니다.</>}
        formula={String.raw`z_t=\frac{x_t-\mu_{\mathrm{tr}}}{\sigma_{\mathrm{tr}}}`}
        terms={[
          { symbol: "x_t", name: "raw feature", description: "시간 t에 실제로 관측된 feature 값입니다." },
          { symbol: "\mu_{\mathrm{tr}}", name: "training mean", description: "현재 fold의 forecast origin 이전 구간으로만 추정합니다." },
          { symbol: "\sigma_{\mathrm{tr}}", name: "training scale", description: "0에 가까운 variance와 outlier 처리 규칙도 train에서 정합니다." },
        ]}
        assumptions={["Production에서 이용 가능한 refit 주기와 history 범위를 validation에서도 동일하게 재현합니다.", "Global model은 series별 scaling인지 전체 training panel scaling인지 명시합니다."]}
        interpretation="Validation 값이 train 범위를 벗어나 z가 크게 나오는 것은 누출이 아니라 distribution shift의 신호입니다. 이를 validation 자체 통계로 다시 정규화하면 운영에서 알 수 없는 정보를 사용하게 됩니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Loss는 어떤 point 또는 distribution을 예측하는지 정한다</h3>
        <p>MSE를 최소화한 point forecast는 조건부 평균, MAE는 조건부 중앙값을 겨냥한다. 수요처럼 비대칭 비용이 있거나 prediction interval이 필요하면 여러 quantile의 pinball loss나 명시적인 likelihood를 사용한다. Horizon별 중요도가 다르면 평균 하나로 뭉개지 말고 weight와 horizon별 error를 함께 공개한다.</p>
      </div>
      <ExplainedFormula
        question="서로 다른 horizon과 비대칭 비용을 하나의 학습 objective로 어떻게 표현할까?"
        idea={<>Horizon h마다 업무 중요도 wₕ를 두고, quantile τ보다 실제값이 큰지 작은지에 따라 다른 기울기의 pinball loss를 적용합니다.</>}
        formula={String.raw`\begin{aligned}\mathcal L_\tau&=\frac1H\sum_{h=1}^{H}w_h\rho_\tau(y_{t+h}-\hat q_{\tau,t+h})\\\rho_\tau(u)&=u\bigl(\tau-\mathbb 1[u<0]\bigr)\end{aligned}`}
        terms={[
          { symbol: "\tau", name: "quantile level", description: "0.5는 조건부 median, 0.9는 상위 90% quantile을 겨냥합니다." },
          { symbol: "w_h", name: "horizon weight", description: "가까운 시점 또는 특정 운영 구간의 중요도를 반영합니다." },
          { symbol: "\rho_\tau", name: "pinball loss", description: "과소·과대 예측에 서로 다른 선형 비용을 줍니다." },
        ]}
        assumptions={["Quantile별 output이 교차하지 않는지 별도로 확인합니다.", "Loss weight를 바꾸면 평가 목표도 달라지므로 사전에 고정합니다."]}
        interpretation="Point RMSE가 좋아도 interval coverage가 맞는다는 뜻은 아닙니다. 여러 quantile을 예측했다면 empirical coverage와 interval width를 rolling origin별로 함께 측정합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Gradient clipping은 원인을 가리는 만능 설정이 아니다</h3>
        <p>긴 sequence에서 norm clipping은 exploding gradient를 제한할 수 있지만 <code>max_norm=1.0</code>이 모든 데이터의 정답은 아니다. Clip 전 norm과 clip 발생 비율을 기록하고, 거의 매 step 잘린다면 learning rate·initialization·sequence 길이·loss scale을 다시 살펴야 한다. Checkpoint 역시 train loss가 아니라 사전에 고정한 validation origin의 목표 metric으로 선택한다.</p>
      </div>
    </section>
  );
}
