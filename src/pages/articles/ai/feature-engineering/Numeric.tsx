import ExplainedFormula from "@/components/ui/explained-formula";
import NumericViz from "./viz/NumericViz";

export default function Numeric() {
  return (
    <section id="numeric" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        수치형 변환은 값의 단위와 모델이 거리를 읽는 방식을 맞춥니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          소득 5,000만 원과 연체 횟수 2회를 그대로 한 vector에 놓으면 숫자 크기가
          다릅니다. 거리 기반 모델, regularized linear model과 신경망의 gradient는
          이 scale 차이에 영향을 받지만, tree는 보통 threshold의 순서만 사용하므로
          같은 정도로 민감하지 않습니다. Scaling은 분포를 예쁘게 만드는 의식이
          아니라 model geometry와 optimizer가 좌표를 다루는 방식을 조정하는
          선택입니다.
        </p>
      </div>

      <ExplainedFormula
        question="Standardization은 숫자를 무엇으로 바꾸며, 왜 validation 평균을 쓰면 안 될까?"
        idea={<>Training fold의 평균을 원점으로 옮기고 training fold의 표준편차를 한 칸의 크기로 삼습니다. Validation 값은 이미 정해진 자로 재야 합니다. Validation까지 포함해 자를 다시 만들면 평가 대상의 분포를 미리 본 것입니다.</>}
        formula={String.raw`z_i=\frac{x_i-\mu_{\mathrm{train}}}{\sigma_{\mathrm{train}}}`}
        annotatedFormula={String.raw`z_i=\underbrace{\frac{x_i-\mu_{\mathrm{train}}}{\sigma_{\mathrm{train}}}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{x_i-\mu_{\mathrm{train}}}{\sigma_{\mathrm{train}}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Training fold의 평균을 원점으로 옮기고","training fold의 표준편차를 한 칸의 크기로","삼습니다."] },
        ]}
        terms={[
          { symbol: "x_i", name: "raw value", description: "원래 단위를 가진 i번째 관측값입니다." },
          { symbol: "μ_train", name: "training mean", description: "현재 training fold에서만 계산한 중심입니다." },
          { symbol: "σ_train", name: "training standard deviation", description: "현재 training fold의 변동 크기이며 0이면 별도 상수 처리 규칙이 필요합니다." },
          { symbol: "z_i", name: "standardized coordinate", description: "Training 평균에서 표준편차 몇 배 떨어졌는지를 나타내는 무차원 값입니다." },
        ]}
        assumptions={["같은 column의 train·validation·serving 값이 같은 물리적·업무 단위를 사용합니다.", "Training variance가 0에 가깝지 않으며 결측 처리 순서가 고정돼 있습니다.", "평균과 표준편차가 배포 분포에서도 의미 있는 기준인지 drift로 확인합니다."]}
        interpretation="Standardization은 이상값을 제거하지 않습니다. 극단값이 μ와 σ를 크게 움직이면 median과 IQR을 쓰는 RobustScaler, clipping 또는 원인 조사를 별도 후보로 둡니다."
      />

      <div className="not-prose my-8"><NumericViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Log transform에는 기준 단위가 필요합니다</h3>
        <p>
          오른쪽 꼬리가 긴 거래액은 큰 값 사이 간격을 줄이면 관계가 더 단순해질
          수 있습니다. 다만 단위가 있는 값에 바로 log를 취한다는 표현은 엄밀하지
          않습니다. 예를 들어 원 단위를 1만 원으로 정했다면
          <code> log(1 + amount / 10,000원)</code>처럼 먼저 무차원 비율로 만들고,
          0·음수·환불의 의미와 inverse transform을 함께 기록합니다. 원래 통화
          단위의 MAE와 transformed-space loss는 같은 지표가 아닙니다.
        </p>
        <h3>결측, clipping과 binning은 서로 다른 결정을 담습니다</h3>
        <p>
          결측 대치는 관측되지 않은 값을 어떻게 표현할지 정하고, clipping은
          측정 오류나 정책상 상한을 다루며, binning은 연속값을 구간 결정으로
          바꿉니다. 결측이 업무 과정 자체를 나타낼 수 있으면 대치값과 함께
          missing indicator를 둡니다. Binning은 세율 구간처럼 실제 경계가 있을
          때 유용하지만, 임의 경계 양옆의 가까운 두 값을 전혀 다른 category로
          만들어 정보를 잃을 수 있습니다. 모든 통계와 경계는 fold 안에서
          fit하고 validation의 residual과 slice를 확인합니다.
        </p>
      </div>
    </section>
  );
}
