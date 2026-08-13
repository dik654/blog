import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import PrecisionLadderViz from "./viz/PrecisionLadderViz";

export default function Overview() {
  return <section id="overview" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">양자화는 숫자를 줄이는 일이 아니라, 허용할 오차와 실제 실행 경로를 함께 정하는 일입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-8">신경망은 weight와 activation을 실수 tensor로 계산합니다. 양자화(quantization)는 이 연속적인 값을 제한된 codebook에 대응시킨 뒤 더 적은 bit로 저장하거나 계산하는 근사입니다. 따라서 먼저 물어야 할 것은 “4-bit인가?”가 아니라 어떤 tensor를, 어느 범위와 scale로, 몇 값마다 함께 묶고, 어떤 kernel에서 어느 precision으로 누산할 것인가입니다.</p>
      <p>Weight-only W4는 weight 저장량과 읽기 traffic을 줄이지만 activation과 KV cache까지 4-bit가 되는 것은 아닙니다. W8A8처럼 activation도 줄이려면 input-dependent range와 outlier를 다뤄야 하며, target hardware에 해당 operator가 없으면 dequantize 뒤 FP kernel로 돌아가 latency가 오히려 늘 수 있습니다.</p>
      <p>이 글은 float 값이 integer code로 바뀌는 한 번의 계산에서 시작해 PTQ calibration, QAT의 fake quantization, GPTQ·AWQ의 서로 다른 보정, GGUF 같은 artifact format, 마지막으로 실제 memory·quality·latency 검증까지 내려갑니다.</p>
    </div>
    <ContentBoundary article="quantization" />
    <ExplainedFormula
      question="실수 x를 b-bit 정수 code로 바꾸고 다시 근사 실수로 복원하려면 어떻게 계산할까요?"
      idea={<>Affine quantizer는 실수 한 칸의 폭을 <code>s</code>로 정하고, 실수 0이 대응할 integer 위치를 <code>z</code>로 옮깁니다. 반올림 뒤 표현 범위를 벗어난 code는 끝값으로 잘라내고, 실행할 때 scale을 곱해 근사값을 복원합니다.</>}
      formula={String.raw`\begin{aligned}
u(x)&=\operatorname{round}(x/s)+z\\
q(x)&=\operatorname{clip}(u(x),q_{\min},q_{\max})\\
\hat x&=s\,(q-z)
\end{aligned}`}
      terms={[
        { symbol: "x", name: "floating-point value", description: "원 checkpoint나 runtime tensor의 양자화 전 실수입니다." },
        { symbol: "u(x)", name: "unclipped code", description: "Scale로 나눈 값을 반올림하고 zero-point를 더했지만 아직 표현 범위로 자르지 않은 정수입니다." },
        { symbol: "q", name: "quantized code", description: "b-bit가 표현할 수 있는 유한한 integer code입니다." },
        { symbol: "s", name: "scale", description: "Integer code 한 칸이 실수 축에서 나타내는 간격입니다." },
        { symbol: "z", name: "zero-point", description: "실수 0이 정확히 대응하도록 integer 축을 이동시키는 code입니다." },
        { symbol: "x-hat", name: "dequantized value", description: "Code와 scale로 복원한 근사 실수이며 일반적으로 원래 x와 다릅니다." },
      ]}
      assumptions={["s는 양수이며 qmin·qmax와 signed/unsigned convention을 고정합니다.", "Round의 tie-breaking, clipping range, zero-point dtype도 artifact 규약에 포함합니다.", "Floating-point FP8/FP4와 block-scaled format은 exponent·mantissa·scale 구조가 달라 이 affine INT 식과 동일하지 않습니다."]}
      interpretation="예를 들어 s=.5,z=0이면 x=.7은 q=1, x-hat=.5가 되어 .2의 오차가 남습니다. 같은 4-bit 이름이라도 scale 공유 범위와 codebook이 다르면 다른 근사입니다."
    />
    <ExplainedFormula
      question="양자화 오차는 왜 rounding error와 clipping error를 나눠 봐야 할까요?"
      idea={<>Range 안의 값은 가까운 grid point로 반올림되어 오차가 대체로 scale 절반 이내지만, range 밖의 outlier는 끝 code에 고정되어 값이 멀수록 clipping error가 커집니다.</>}
      formula={String.raw`\begin{aligned}
e(x)&=x-\hat x\\
|e(x)|&\le s/2 && (x\text{ is in range})\\
|e(x)|&=|x-x_{\mathrm{clip}}| && (x\text{ is clipped})
\end{aligned}`}
      terms={[
        { symbol: "e(x)", name: "quantization error", description: "원래 값과 dequantized 근사값의 차이입니다." },
        { symbol: "s/2", name: "rounding bound", description: "Uniform grid 안에서 nearest rounding을 쓸 때의 최대 반 칸 오차입니다." },
        { symbol: "x_clip", name: "range endpoint", description: "표현 범위를 벗어난 값이 고정되는 최소 또는 최대 복원값입니다." },
      ]}
      assumptions={["Uniform step과 round-to-nearest를 가정한 국소 bound입니다.", "Saturation 뒤 clipping error에는 s/2 bound가 적용되지 않습니다.", "작은 element-wise error가 곧 작은 task loss라는 보장은 없으며 layer와 input sensitivity를 측정해야 합니다."]}
      interpretation="Range를 넓히면 clipping은 줄지만 같은 bit 수에서 s가 커져 대부분 값의 rounding이 거칠어집니다. Calibration과 outlier 처리는 이 두 오차 사이의 선택입니다."
    />
    <div className="not-prose my-8"><PrecisionLadderViz /></div>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>Symmetric quantization은 보통 zero-point를 0에 고정하고 양수·음수 range를 대칭으로 잡아 실행이 단순한 대신 한쪽으로 치우친 분포의 code를 낭비할 수 있습니다. Asymmetric quantization은 zero-point를 옮겨 관측 range를 더 촘촘히 덮지만 offset correction과 kernel 지원을 확인해야 합니다.</p>
      <p>Static quantization은 calibration에서 scale을 정해 artifact에 저장하고, dynamic quantization은 실행할 input에서 activation scale을 다시 계산합니다. Dynamic 방식은 input 변화에 대응하지만 매번 range reduction과 quantization 비용이 생깁니다. 따라서 이 이름들은 품질 등급이 아니라 scale의 위치와 계산 시점을 설명합니다.</p>
    </div>
  </section>;
}
