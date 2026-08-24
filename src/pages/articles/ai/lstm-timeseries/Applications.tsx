import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModelChoiceViz from "./viz/ModelChoiceViz";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">모델 선택은 같은 forecast origin에서 끝난다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">Random split이나 train fitted value로는 미래 성능을 판단할 수 없다. Forecast origin을 앞으로 이동시키며 매번 그 이전 데이터로 preprocessing과 model을 다시 fit하고, 실제 운영 horizon을 예측한다. 한 번의 holdout은 우연히 쉬운 계절이나 구조 변화에 걸릴 수 있으므로 여러 origin과 여러 series에서 error 분포를 본다.</p>
        <p><a href="https://otexts.com/fpp3/tscv.html" target="_blank" rel="noreferrer">Forecasting: Principles and Practice의 time-series cross-validation</a>과 <a href="https://doi.org/10.1016/S0169-2070(00)00065-0" target="_blank" rel="noreferrer">Tashman의 out-of-sample evaluation 연구</a>는 rolling origin, coefficient recalibration과 여러 test period를 구분한다. Production에서 매일 refit한다면 backtest도 매일 refit하고, 고정 model을 한 달 쓰면 그 조건을 그대로 평가해야 한다.</p>
      </div>
      <div id="paper-forecast-evaluation" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Out-of-sample forecast evaluation</p>
        <p className="mt-2 text-sm font-semibold">Out-of-sample Tests of Forecasting Accuracy</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tashman은 forecast origin·lead time·estimation window와 recalibration 주기를 분리해 실제
          예측 순서를 재현하는 평가 설계를 정리했습니다. 특정 rolling scheme 하나가 모든 series에
          최선이라는 주장이 아니라, 운영 때의 refit·horizon 조건을 backtest에 그대로 명시해야
          accuracy estimate를 해석할 수 있다는 근거입니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1016/S0169-2070(00)00065-0" target="_blank" rel="noreferrer">원 논문의 origin·window·recalibration 구분 보기</a>
      </div>
      <ModelChoiceViz />
      <ExplainedFormula
        question="단위와 크기가 다른 여러 series의 MAE를 naive forecast와 어떻게 비교할까?"
        idea={<>MASE는 test absolute error를 train 구간의 seasonal-naive one-step error로 나눕니다. 원 단위를 제거하면서 단순 기준선 대비 난도를 함께 반영합니다.</>}
        formula={String.raw`\operatorname{MASE}=\frac{\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|}{\frac1{T-m}\sum_{t=m+1}^{T}|y_t-y_{t-m}|}`}
        annotatedFormula={String.raw`\operatorname{MASE}=\underbrace{\frac{\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|}{\frac1{T-m}\sum_{t=m+1}^{T}|y_t-y_{t-m}|}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|}{\frac1{T-m}\sum_{t=m+1}^{T}|y_t-y_{t-m}|}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","MASE는 test absolute error를 train","구간의 seasonal-naive one-step error로","나눕니다."] },
        ]}
        terms={[
          { symbol: "N", name: "test forecasts", description: "모든 평가 origin·horizon에서 집계한 예측 error 수입니다." },
          { symbol: "T", name: "training length", description: "분모를 계산하는 해당 fold의 train 관측 수입니다." },
          { symbol: "m", name: "seasonal period", description: "Hourly weekly seasonality라면 보통 168이며 non-seasonal naive는 1을 씁니다." },
        ]}
        assumptions={["분모는 test가 아니라 각 fold의 train 구간으로만 계산합니다.", "상수 series처럼 naive error가 0인 경우의 예외 처리를 미리 정합니다."]}
        interpretation="MASE가 1보다 작으면 선택한 seasonal-naive scale보다 평균 absolute error가 작습니다. 다만 이는 같은 fold·aggregation 계약에서의 해석이며, horizon별 failure와 tail risk를 감추지 않도록 MAE·RMSE·coverage도 함께 봅니다."
      />
      <div id="paper-mase" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Scale-free forecast error</p>
        <p className="mt-2 text-sm font-semibold">Another Look at Measures of Forecast Accuracy</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Hyndman과 Koehler는 scale·zero·out-of-sample 비교에서 기존 percentage metric이 보이는
          문제를 정리하고, train naive error로 absolute error를 나누는 MASE를 제안했습니다.
          분모가 0이 아닌 같은 series·seasonality·training fold에서 비교한다는 전제가 있으며,
          MASE 하나가 horizon별 위험·bias·interval calibration을 모두 평가한다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1016/j.ijforecast.2006.03.001" target="_blank" rel="noreferrer">원 논문의 metric 비교와 MASE 정의 보기</a>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>LSTM이 맞는 조건은 sample 수 하나로 정해지지 않는다</h3>
        <p>LSTM은 관측이 한 점씩 들어올 때 state를 순차 갱신하거나, 여러 series가 공유하는 비선형 동역학을 학습할 때 유용할 수 있다. 반대로 긴 sequence의 병렬 학습에는 불리하며 state를 오래 유지하면 entity 경계와 distribution shift를 관리해야 한다. “10만 건 이하면 LSTM” 같은 고정 기준보다 series 수·frequency·horizon·feature availability·serving state를 함께 본다.</p>
        <p>DLinear 연구는 단순한 linear baseline이 여러 장기 예측 benchmark에서 당시 Transformer 계열을 앞설 수 있음을 보였고, PatchTST는 patching과 channel independence로 강한 결과를 제시했다. 어느 architecture가 영구히 우월하다는 뜻이 아니라 evaluation protocol과 inductive bias가 순위를 바꾼다는 증거다. Self-attention의 계산은 <Link to="/ai/attention-theory">Attention 이론 글</Link>에서 이어서 볼 수 있다.</p>
        <p>결론적으로 LSTM의 채택 근거는 이름이나 parameter 수가 아니라, naive·seasonal naive·<Link to="/ai/arima">ARIMA</Link>·단순 learned baseline을 같은 origin과 latency·memory budget에서 일관되게 이기는지에 있다. 평균 점수가 좋아도 구조 변화 구간이나 중요한 horizon에서 실패한다면 운영 모델로는 부족하다.</p>
        <p>Release gate에서는 동일 origin별 error를 paired bootstrap이나 series별 분포로 비교하고, MASE·MAE·interval coverage뿐 아니라 p95 latency·peak memory를 함께 남긴다. Candidate가 중요한 horizon·event slice에서 hard guardrail을 통과한 뒤 제한된 canary로 배포하며, error·coverage·state-reset 위반이 기준을 넘으면 이전 model과 transform artifact로 rollback한다.</p>
      </div>
      <div id="paper-dlinear" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 단순 learned baseline</p>
        <p className="mt-2 text-sm font-semibold">Are Transformers Effective for Time Series Forecasting?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Zeng 등은 입력 trend와 remainder에 단순 linear projection을 적용한 DLinear를 같은 장기
          예측 benchmark에서 비교해 복잡한 architecture의 우위가 평가 protocol에 민감하다는
          문제를 제기했습니다. 결과는 논문의 dataset·look-back·horizon·normalization 조건에
          한정되며, linear model이 모든 시계열과 운영 조건에서 LSTM·Transformer보다 낫다는
          결론은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2205.13504" target="_blank" rel="noreferrer">원 논문의 DLinear 구조와 비교 조건 보기</a>
      </div>
      <div id="paper-patchtst" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Patch-based Transformer</p>
        <p className="mt-2 text-sm font-semibold">A Time Series is Worth 64 Words</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Nie 등은 연속 시점을 patch token으로 묶고 channel-independent encoder를 사용해 긴
          look-back의 token 수와 representation을 바꾸는 PatchTST를 제안했습니다. 보고된 장기
          예측 성능은 논문의 multivariate benchmark·patch·normalization·training recipe 범위이며,
          모든 cross-channel interaction이 불필요하거나 실시간 latency가 자동으로 낮다는 뜻은
          아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2211.14730" target="_blank" rel="noreferrer">원 논문의 patching·channel independence·실험 보기</a>
      </div>
    </section>
  );
}
