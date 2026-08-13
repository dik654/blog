import ExplainedFormula from "@/components/ui/explained-formula";
import EarlyFusionViz from "./viz/EarlyFusionViz";

export default function EarlyFusion() {
  return (
    <section id="early-fusion" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Early fusion은 “같은 좌표”라는 강한 가정을 model 입구에서 사용합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RGB와 depth가 동일한 장면을 보더라도 pixel (u, v)가 같은 물리 지점을
          가리킨다는 보장은 없습니다. Camera calibration과 reprojection으로 공통
          좌표계에 옮긴 뒤에야 channel concat이 의미를 갖습니다. 이 조건이 맞으면
          첫 layer부터 색·거리처럼 low-level 신호의 조합을 학습할 수 있습니다.
        </p>
        <p>
          Input channel이 바뀌면 pretrained first-layer weight도 그대로 사용할 수
          없습니다. Weight를 복제·평균하거나 새 layer를 학습하는 방법을 비교하고,
          각 channel의 range와 normalization을 따로 보존합니다. 단순히 RGB
          normalization을 모든 sensor에 적용하지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="정렬된 sensor view를 channel로 합칠 때 실제 tensor에는 무엇이 들어갈까?"
        idea={<>각 sensor를 공통 image grid로 옮기는 변환 Tᵥ를 먼저 적용하고, 같은 좌표 u의 관측값과 availability mask를 channel axis에 쌓습니다.</>}
        formula={String.raw`\begin{aligned}
\widetilde x_v(u)&=T_v(x_v)(u),\\
x_{\mathrm{obs}}(u)&=[\widetilde x_1(u);\ldots;\widetilde x_V(u)],\\
m(u)&=[m_1(u);\ldots;m_V(u)],\\
x_{\mathrm{cat}}(u)&=[x_{\mathrm{obs}}(u);m(u)].
\end{aligned}`}
        terms={[
          { symbol: "u", name: "reference-grid coordinate", description: "Fusion tensor가 사용하는 공통 pixel 또는 voxel 좌표입니다." },
          { symbol: "Tᵥ", name: "registration transform", description: "v번째 sensor 관측을 calibration에 따라 reference grid로 옮기는 warp·projection입니다." },
          { symbol: "[ ; ]", name: "channel concatenation", description: "공간 좌표는 유지하고 sensor channel을 뒤에 이어 붙입니다." },
          { symbol: "mᵥ(u)", name: "pixel availability", description: "Warp 범위 밖, 가림, sensor failure처럼 해당 좌표의 값이 유효하지 않은 경우를 구분합니다." },
        ]}
        assumptions={["Tᵥ의 calibration과 timestamp 동기화 오차가 task가 허용하는 범위 안에 있습니다.", "각 sensor의 단위·range·normalization을 따로 기록합니다.", "Interpolation으로 만들어진 값과 실제 관측값의 차이가 품질 mask 또는 evaluation에 반영됩니다."]}
        interpretation="RGB 3 channel, depth 1 channel, 두 availability mask를 합치면 입력은 6 channel입니다. 단순 zero-fill만 하면 실제 depth 0과 결측 0이 같아지지만 mask를 함께 넣으면 model이 구분할 근거가 생깁니다."
      />
      <div className="not-prose my-8"><EarlyFusionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Missing view에 취약한 입력 계약입니다</h3>
        <p>
          Channel 수가 고정되므로 view 하나가 없을 때 zero-fill만 하면 “관측되지
          않음”과 실제 값 0을 구분하지 못합니다. Availability mask를 추가하고 view
          dropout으로 이 상태를 학습해야 하며, 결측 조합이 많다면 view별 encoder를
          두는 late fusion이 더 자연스럽습니다.
        </p>
        <p>
          Shared encoder로 각 image를 먼저 처리한 뒤 feature를 합치는 Siamese
          방식은 input-level early fusion이 아니라 representation-level fusion에
          가깝습니다. 이 구분을 유지해야 비교에서 parameter와 interaction 위치가
          무엇 때문에 달라졌는지 해석할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
