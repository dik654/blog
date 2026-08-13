import MissingViz from "./viz/MissingViz";

export default function Missing() {
  return (
    <section id="missing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">결측률보다 왜 비어 있는지를 추적한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          결측값은 단순한 빈칸이 아니라 수집 과정의 결과입니다. MCAR은 결측이
          관측값과 결측값 모두와 무관한 경우, MAR은 관측된 변수로 설명할 수 있는
          경우, MNAR은 관측되지 않은 값 자체와 결측 확률이 연결된 경우를
          가리킵니다. 이 구분은 heatmap만 보고 확정할 수 없으며, 수집 시스템과
          업무 규칙을 함께 확인해야 합니다.
        </p>
        <p>
          먼저 column별 비율만 보지 말고 시간, 장비, 사용자군과 label별로
          결측 패턴을 나눠 봅니다. 특정 센서가 없는 장비에서만 비어 있거나
          장애 직전에 기록이 끊긴다면 결측 여부 자체가 유용한 신호일 수 있어
          missing indicator를 별도 피처로 남깁니다.
        </p>
      </div>
      <div className="not-prose my-8"><MissingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>대체 방법도 validation pipeline 안에서 학습한다</h3>
        <p>
          평균·중앙값 대체, KNN imputation, iterative imputation 중 무엇이
          적절한지는 결측 메커니즘과 downstream model에 따라 달라집니다.
          대체값과 scaler를 전체 데이터에서 계산하면 validation 정보가 training
          fold로 들어가므로, 모든 전처리는 fold 내부에서 fit하고 validation과
          test에는 transform만 적용합니다.
        </p>
        <p>
          피처를 제거할지 여부도 “결측률 50%” 같은 일괄 기준으로 정하지 않습니다.
          적은 관측만으로도 안정적인 신호가 있는지, 수집 시점이 inference에서도
          같은지, 유지 비용이 어떤지를 함께 평가합니다. LightGBM처럼 missing
          value를 자체 처리하는 모델에는 NaN을 유지하는 baseline을 먼저 두고,
          임의의 sentinel 값은 실제 값 범위와 충돌하지 않는지 확인합니다.
        </p>
      </div>
    </section>
  );
}
