import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { QuantizerNumberLineViz } from "./viz/ModernQuantizationViz";

export default function QuantizationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          먼저 실수 하나를 작은 codebook에 올려 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Quantization</strong>은 연속적인 실수 값을 유한한 code 중
            하나로 바꾸고, 필요할 때 근사 실수로 복원하는 표현 계약입니다.
            “4-bit”는 code 수만 말할 뿐 scale·zero-point·공유
            범위·rounding·kernel까지 알려 주지는 않습니다.
          </p>
          <p>
            이 글은 숫자 하나의 이동만 다룹니다. 표본으로 scale을 고르는 과정은
            <a href="/ai/ptq-calibration"> PTQ calibration</a>, 학습으로 오차에
            적응하는 과정은
            <a href="/ai/quantization-aware-training"> QAT</a>, GPTQ·AWQ는
            <a href="/ai/weight-only-quantization"> weight-only quantization</a>
            , 실제 GPU 메모리와 속도는{" "}
            <a href="/ai/quantized-model-deployment">배포 장부</a>에서
            이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="Quantizer를 이루는 물체를 한 줄씩"
          items={[
            {
              term: "Codebook",
              description: "저장할 수 있는 유한한 code 집합입니다.",
              example: "Signed INT2라면 {-2,-1,0,1} 네 code입니다.",
              boundary: "FP8의 exponent·mantissa 표현과 같은 구조는 아닙니다.",
            },
            {
              term: "Scale s",
              description: "Code 한 칸이 실수 축에서 차지하는 간격입니다.",
              example: "s=.5이면 q=1은 실수 .5로 복원됩니다.",
              boundary:
                "작을수록 무조건 좋지 않고 표현 range도 함께 좁아집니다.",
            },
            {
              term: "Zero-point z",
              description: "실수 0이 대응할 integer code 위치입니다.",
              example: "z=3이면 q=3이 실수 0을 나타냅니다.",
              boundary: "Symmetric quantization은 보통 z=0으로 단순화합니다.",
            },
            {
              term: "Quantized code q",
              description: "Round와 clip이 끝난 뒤 실제로 저장하는 값입니다.",
              example: "x=.7,s=.5,z=0이면 q=1입니다.",
              boundary: "q 자체를 원래 실수와 같은 단위로 읽지 않습니다.",
            },
          ]}
        />
        <QuantizerNumberLineViz />
        <ContentBoundary article="quantization" />
      </section>

      <section id="affine-map" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          나누기·이동·반올림·자르기·복원 순서로 읽습니다
        </h2>
        <ExplainedFormula
          question="실수 x는 어떤 연산을 거쳐 integer code q가 되나요?"
          idea={
            <p>
              Scale로 실수 축을 code 간격으로 바꾸고 zero-point만큼 이동한 뒤,
              가장 가까운 integer와 허용 range를 차례로 적용합니다.
            </p>
          }
          formula={String.raw`u=\operatorname{round}(x/s)+z,\quad q=\operatorname{clip}(u,q_{\min},q_{\max}),\quad \hat x=s(q-z)`}
          annotatedFormula={String.raw`\begin{aligned}u_0&=\underbrace{x/s}_{\text{눈금 좌표}}\\u_1&=\underbrace{\operatorname{round}(u_0)+z}_{\text{정수 눈금·0 위치}}\\q&=\underbrace{\operatorname{clip}(u_1,q_{\min},q_{\max})}_{\text{bit range로 제한}}\\\hat x&=\underbrace{s(q-z)}_{\text{실수 단위로 복원}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`x/s`,
              annotation: [
                "실수 값을 scale 간격으로 나눠",
                "code 축 좌표로 변환",
              ],
            },
            {
              expression: String.raw`\operatorname{round}(x/s)+z`,
              annotation: ["가까운 눈금을 고르고", "zero-point 위치로 이동"],
            },
            {
              expression: String.raw`\operatorname{clip}(u,q_{\min},q_{\max})`,
              annotation: ["표현할 수 없는 code를", "양 끝 code로 포화"],
            },
            {
              expression: String.raw`s(q-z)`,
              annotation: ["integer 좌표를 되돌려", "근사 실수 생성"],
            },
          ]}
          terms={[
            {
              symbol: "x",
              name: "원래 실수",
              description: "Quantization 전 tensor 원소입니다.",
            },
            {
              symbol: "s",
              name: "Scale",
              description: "Code 한 칸의 실수 폭이며 양수입니다.",
            },
            {
              symbol: "z",
              name: "Zero-point",
              description: "실수 0에 대응하는 integer code입니다.",
            },
            {
              symbol: "q",
              name: "저장 code",
              description: "허용 integer range 안의 최종 code입니다.",
            },
            {
              symbol: String.raw`\hat x`,
              name: "복원값",
              description: "q와 metadata로 만든 근사 실수입니다.",
            },
          ]}
          assumptions={[
            "qmin·qmax와 signed convention을 고정합니다.",
            "Round tie-breaking을 artifact에 기록합니다.",
            "이 식은 affine integer quantizer이며 FP8 전체를 설명하지 않습니다.",
          ]}
          interpretation="s=.5,z=0,x=.7이면 round(1.4)=1, q=1, x̂=.5입니다. 저장량은 줄지만 .2의 근사 오차가 남습니다."
        />
      </section>

      <section id="error-shape" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Range 안의 반올림과 밖의 포화를 다른 오차로 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Range를 넓히면 outlier clipping은 줄지만 같은 bit 수에서 눈금 간격이
            넓어집니다. 반대로 scale을 줄이면 중앙 값은 정밀해져도 range 밖 값이
            끝점에 붙습니다.
          </p>
        </div>
        <ExplainedFormula
          question="왜 range 안의 s/2 bound를 outlier에도 적용하면 안 되나요?"
          idea={
            <p>
              Nearest rounding은 인접 눈금의 중간점보다 멀리 이동하지 않지만,
              clipping은 endpoint와 원래 값 사이 거리를 그대로 남깁니다.
            </p>
          }
          formula={String.raw`e=x-\hat x,\quad |e|\le s/2\;(x\in R),\quad |e|=|x-x_{\rm edge}|\;(x\notin R)`}
          annotatedFormula={String.raw`\begin{aligned}e&=\underbrace{x-\hat x}_{\text{원래 값에서 복원값을 빼 오차 정의}}\\|e|&\le\underbrace{s/2}_{\substack{\text{range 안 nearest rounding은}\\\text{눈금 반 칸 이내로 이동}}}\quad(x\in R)\\|e|&=\underbrace{|x-x_{\rm edge}|}_{\substack{\text{range 밖 값은 endpoint에 붙어}\\\text{outlier 거리만큼 오차 발생}}}\quad(x\notin R)\end{aligned}`}
          operations={[
            {
              expression: String.raw`x-\hat x`,
              annotation: ["원래 값과 복원값을 빼", "signed error 계산"],
            },
            {
              expression: String.raw`s/2`,
              annotation: [
                "인접 눈금 사이 폭을 반으로 나눠",
                "nearest-rounding 최대 거리 계산",
              ],
            },
            {
              expression: String.raw`|x-x_{\rm edge}|`,
              annotation: [
                "outlier와 endpoint 거리를 재어",
                "clipping error 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "R",
              name: "복원 가능 range",
              description: "qmin·qmax와 scale이 만드는 실수 구간입니다.",
            },
            {
              symbol: String.raw`x_{\rm edge}`,
              name: "Range endpoint",
              description: "Clipped code가 복원되는 최소 또는 최대 실수입니다.",
            },
            {
              symbol: "e",
              name: "Quantization error",
              description: "원래 값과 복원값의 차이입니다.",
            },
          ]}
          assumptions={[
            "Uniform grid와 nearest rounding을 가정합니다.",
            "Stochastic rounding과 nonuniform codebook에는 다른 bound가 필요합니다.",
            "작은 element error가 작은 task loss를 보장하지 않습니다.",
          ]}
          interpretation="Calibration은 하나의 magic scale을 찾는 일이 아니라 중앙 rounding과 tail clipping 사이의 손실을 실제 분포에서 선택하는 일입니다."
        />
      </section>

      <section id="format-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          INT codebook과 FP8 format을 같은 “8-bit”로 묶지 않습니다
        </h2>
        <div id="paper-transformer-engine-fp8" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA Transformer Engine · FP8 Current Scaling"
            citeKey={1}
            href="https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/features/low_precision_training/fp8_current_scaling/fp8_current_scaling.html"
          >
            <strong>문제:</strong> FP8의 좁은 dynamic range에서 tensor를
            안전하게 표현함. <strong>기여:</strong> E4M3·E5M2와 amax 기반
            current scaling 단계를 명시. <strong>전제:</strong> Transformer
            Engine 2.16과 지원 GPU·shape. <strong>근거 범위:</strong> FP8
            format과 scaling recipe. <strong>과장 금지:</strong> affine INT
            식이나 모든 operator의 자동 FP8 실행을 뜻하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
