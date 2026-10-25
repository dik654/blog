import ExplainedFormula from "@/components/ui/explained-formula";
import EarlyFusionViz from "./viz/EarlyFusionViz";

export default function EarlyFusion() {
  return (
    <section id="early-fusion" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 좌표의 센서값만 입구에서 합칩니다</h2>
      <EarlyFusionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          정면 RGB와 깊이 영상이 같은 운동화를 찍어도 픽셀 (u, v)가 같은 물리 지점을
          가리킨다는 보장은 없습니다. 카메라 보정값과 재투영으로 깊이를 RGB 격자에 옮긴
          뒤에야 같은 위치의 채널로 묶을 수 있습니다. 이 조건이 맞으면 첫 층부터 색과
          거리의 조합을 배울 수 있습니다.
        </p>
        <p>
          입력 채널이 바뀌면 미리 학습한 첫 층의 가중치도 그대로 사용할 수 없습니다.
          가중치를 복제·평균할지, 첫 층을 새로 학습할지 기록하고 RGB와 깊이의 단위와
          정규화도 따로 보존합니다. RGB 평균과 표준편차를 깊이 센서에 그대로 적용하지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="정렬된 센서값을 채널로 합칠 때 실제 텐서에는 무엇이 들어갈까?"
        idea={<>각 센서를 공통 영상 격자로 옮기는 변환 Tᵥ를 먼저 적용하고, 같은 좌표 u의 관측값과 유효성 표시를 채널 축에 쌓습니다.</>}
        formula={String.raw`\begin{aligned}
\widetilde x_v(u)&=T_v(x_v)(u),\\
x_{\mathrm{obs}}(u)&=[\widetilde x_1(u);\ldots;\widetilde x_V(u)],\\
m(u)&=[m_1(u);\ldots;m_V(u)],\\
x_{\mathrm{cat}}(u)&=[x_{\mathrm{obs}}(u);m(u)].
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\widetilde x_v(u)&=\underbrace{T_v(x_v)(u),}_{\text{reference-grid 계산}}\\
x_{\mathrm{obs}}(u)&=\underbrace{[\widetilde x_1(u);\ldots;\widetilde x_V(u)],}_{\text{reference-grid 계산}}\\
m(u)&=\underbrace{[m_1(u);\ldots;m_V(u)],}_{\text{reference-grid 계산}}\\
x_{\mathrm{cat}}(u)&=[x_{\mathrm{obs}}(u);m(u)].
\end{aligned}`}
        operations={[
          { expression: String.raw`T_v(x_v)(u),`, annotation: ["센서 v의 좌표를 기준 격자 u로 옮김","RGB와 깊이가 같은 물리 지점을 가리키게 함","보정값과 촬영 시각 오차를 먼저 검사"] },
          { expression: String.raw`[\widetilde x_1(u);\ldots;\widetilde x_V(u)],`, annotation: ["같은 기준 좌표 u의 센서값을 채널로 이어 붙임","RGB 3채널과 깊이 1채널이 값 부분을 구성"] },
          { expression: String.raw`[m_1(u);\ldots;m_V(u)],`, annotation: ["각 센서값이 실제 관측인지 별도 채널로 표시","실제 값 0과 관측이 없는 0을 구분"] },
        ]}
        terms={[
          { symbol: "u", name: "기준 격자 좌표", description: "결합 텐서가 사용하는 공통 픽셀 또는 voxel 좌표입니다." },
          { symbol: "Tᵥ", name: "정합 변환", description: "v번째 센서 관측을 보정값에 따라 기준 격자로 옮기는 warp·projection입니다." },
          { symbol: "[ ; ]", name: "채널 이어 붙이기", description: "공간 좌표는 유지하고 센서 채널을 뒤에 이어 붙입니다." },
          { symbol: "mᵥ(u)", name: "픽셀 유효성", description: "Warp 범위 밖, 가림, 센서 장애처럼 해당 좌표의 값이 유효하지 않은 경우를 구분합니다." },
        ]}
        assumptions={["Tᵥ의 보정값과 촬영 시각 동기화 오차가 과제가 허용하는 범위 안에 있습니다.", "각 센서의 단위·범위·정규화 방법을 따로 기록합니다.", "보간으로 만든 값과 실제 관측값의 차이를 품질 표시나 평가에 반영합니다."]}
        interpretation="RGB 3채널, 깊이 1채널, 두 유효성 표시를 합치면 입력은 6채널입니다. 값만 0으로 채우면 실제 깊이 0과 관측이 없는 0이 같아지지만 mask를 함께 넣으면 모델이 두 상태를 구분할 수 있습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>임의의 촬영 각도를 포개는 방법은 아닙니다</h3>
        <p>
          채널 수가 고정되므로 센서 하나가 없을 때 값만 0으로 채우면 ‘관측되지 않음’과
          실제 값 0을 구분하지 못합니다. 유효성 표시를 추가하고 센서 누락 상태도 학습해야
          합니다. 측면·밑창처럼 좌표 자체가 다른 사진은 다음 절처럼 관측별 인코더를 두는
          표현 단계 결합이 더 자연스럽습니다.
        </p>
        <p>
          공유 인코더로 각 사진을 먼저 처리한 뒤 표현을 합치는 방식은 입력 단계 결합이
          아니라 표현 단계 결합입니다. 이 경계를 지켜야 모델 크기와 관측 사이 상호작용이
          왜 달라졌는지 설명할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
