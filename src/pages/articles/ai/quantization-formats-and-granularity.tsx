import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import QuantizationFormatsAndGranularityViz from "./quantization-formats-and-granularity/viz/QuantizationFormatsAndGranularityViz";

/**
 * 양자화 숫자 형식과 granularity: 비트 폭과 스케일 단위
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function QuantizationFormatsAndGranularityArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 quantizer도 숫자 형식과 scale 폭에 따라 다른 artifact가 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/quantization#affine-map">Scale·zero-point로 code를 만드는 규약</Link>
            은 하나지만, 그 위에 어떤 bit 수·숫자 형식을 쓰는지와 scale을 얼마나
            잘게 나눠 공유하는지는 서로 다른 두 축입니다. 이 글은 그 두 축만
            다룹니다.
          </p>
          <p>
            첫 축은 정수 code부터 floating-point code, 극단적 저bit weight까지
            몇 bit로 몇 개의 값을 어떻게 표현하는지입니다.
          </p>
          <p>
            둘째 축은 zero-point 선택과{" "}
            <Link to="/ai/ptq-calibration#scale-granularity">
              scale 공유 범위
            </Link>
            에 block quantization을 더해, scale을 얼마나 잘게 나누는지를
            정합니다.
          </p>
        </div>
        <QuantizationFormatsAndGranularityViz />
        <ContentBoundary article="quantization-formats-and-granularity" />
      </section>

      <section id="integer-formats" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Bit 수가 절반이 되면 표현 code 수는 16분의 1이 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>INT8 quantization</strong>과{" "}
            <strong>INT4 quantization</strong>은 affine quantizer가 만드는
            등간격 정수 code의 개수를 bit 수로 고정한 구체적 format입니다.
            8bit는 2⁸=256개, 4bit는 2⁴=16개의 code를 균일한 간격으로
            나눠 가집니다.
          </p>
          <p>
            Bit 수를 절반으로 줄이면 code 수는 절반이 아니라 16분의
            1(256/16)로 줄어드는 지수적 관계입니다. 같은 실수 range를 더 적은
            code로 나누면 code 사이 간격(step)이 넓어져 rounding error가
            커집니다.
          </p>
          <p>
            <Link to="/ai/weight-only-quantization#artifact-boundary">
              GPTQ·AWQ 같은 weight 변환 method
            </Link>
            가 이름만 언급하던 INT4가 실제로 무슨 값을 표현하는지는 이 code
            수와 간격이 정합니다.
          </p>
        </div>
      </section>

      <section id="floating-point-formats" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Exponent bit는 dynamic range를, mantissa bit는 정밀도를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            정수 code는 등간격이지만 <strong>FP8 quantization</strong>과{" "}
            <strong>FP4 quantization</strong>은 sign·exponent·mantissa로 값을
            표현해 같은 bit 수로도 지수 구간마다 다른 step을 갖습니다. FP8은
            4bit exponent·3bit mantissa인 E4M3와 5bit exponent·2bit
            mantissa인 E5M2 두 변형을 흔히 씁니다.
          </p>
          <p>
            <strong>NVFP4</strong>는 NVIDIA Blackwell이 쓰는 4bit
            floating-point format으로, 1bit sign에 2bit exponent·1bit
            mantissa(E2M1)를 더해 0부터 6까지 여덟 개 값을 표현합니다.
          </p>
          <p>
            같은 4bit인 INT4가 16개 code를 균일 간격으로 나누는 것과 달리,
            NVFP4는 0 근처를 촘촘히 나누고 큰 값 쪽은 성기게 나눠 더 넓은
            dynamic range를 얻습니다.
          </p>
          <p>
            Exponent bit가 늘수록 표현 가능한 값의 폭(dynamic range)은
            넓어지지만 mantissa bit가 줄어 같은 지수 구간 안의 정밀도는
            낮아집니다. E5M2가 E4M3보다 넓은 range를, E4M3가 E5M2보다 높은
            정밀도를 갖는 이유입니다.
          </p>
        </div>
        <div id="paper-fp8" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA Transformer Engine · FP8 Current Scaling"
            citeKey={1}
            href="https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/features/low_precision_training/fp8_current_scaling/fp8_current_scaling.html"
          >
            <strong>문제:</strong> FP8의 좁은 dynamic range에서 tensor를
            안전하게 표현함. <strong>기여:</strong> E4M3·E5M2 bit 배치와 amax
            기반 scaling 단계를 명시. <strong>전제:</strong> Transformer
            Engine 해당 version과 지원 GPU·shape. <strong>근거 범위:</strong>{" "}
            FP8 format과 current scaling 절차. <strong>과장 금지:</strong>{" "}
            모든 model·shape에서 동일 정확도를 보장하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-nvfp4" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA · Introducing NVFP4"
            citeKey={2}
            href="https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/"
          >
            <strong>문제:</strong> 4bit inference에서 정확도 손실 없이 memory
            대역폭을 더 줄임. <strong>기여:</strong> E2M1 4bit code에
            16개 원소마다 FP8(E4M3) micro-block scale과 tensor 하나의 FP32
            scale을 더한 two-level scaling을 제시. <strong>전제:</strong>{" "}
            NVIDIA Blackwell 세대 GPU와 문서의 model·benchmark 조건.{" "}
            <strong>근거 범위:</strong> 문서가 보고한 DeepSeek-R1 계열
            benchmark 변환과 측정. <strong>과장 금지:</strong> 모든
            model·task에서 1% 이하 정확도 저하를 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="extreme-low-bit" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Binary·ternary weight는 INT4보다도 적은 값만 남깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Binary weight</strong>는 weight 하나를 1bit로{" "}
            {"{-1, +1}"} 두 값 중 하나로 만들고,{" "}
            <strong>ternary weight</strong>는 log₂3≈1.58bit로{" "}
            {"{-1, 0, +1}"} 세 값 중 하나로 만듭니다. INT4의 16개 code보다도
            훨씬 적은 값만 남기는 극단적 저bit weight quantization입니다.
          </p>
          <p>
            BitNet b1.58은 이 세 값만으로 학습부터 진행해, 학습이 끝난
            checkpoint를 변환하는 PTQ나 fake quantization으로 재학습하는
            QAT와 달리 처음부터 ternary weight를 optimizer가 직접 다룹니다.
          </p>
        </div>
        <div id="paper-bitnet" className="scroll-mt-24">
          <CitationBlock
            source="The Era of 1-bit LLMs (BitNet b1.58)"
            citeKey={3}
            href="https://arxiv.org/abs/2402.17764"
          >
            <strong>문제:</strong> INT4보다도 낮은 bit에서 학습부터 진행하는
            LLM이 float 성능을 유지할 수 있는지. <strong>기여:</strong>{" "}
            {"{-1, 0, +1}"} ternary weight로 처음부터 학습하는 BitNet b1.58을
            제시하고 같은 크기·토큰 수의 FP16 baseline과 perplexity·zero-shot
            정확도를 비교. <strong>전제:</strong> 논문의 model 크기·학습
            토큰 수·평가 조건. <strong>근거 범위:</strong> 논문이 보고한
            학습·추론 실험. <strong>과장 금지:</strong> 모든 model
            크기·task에서 동일한 memory·속도 이득을 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="zero-point-symmetry" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Zero-point가 0이면 대칭, 아니면 비대칭 range가 됩니다
        </h2>
        <ExplainedFormula
          question="같은 quantize·dequantize 식에서 symmetric과 asymmetric은 어디가 다른가요?"
          idea={
            <p>
              Zero-point z가 정확히 0이면 code 범위가 원점을 중심으로
              대칭이고, z가 0이 아니면 code 범위가 실수 range의 한쪽으로
              치우친 구간을 덮습니다.
            </p>
          }
          formula={String.raw`q=\mathrm{clip}\!\left(\mathrm{round}\left(\frac{x}{s}\right)+z,\,q_{\min},q_{\max}\right),\quad \hat{x}=s\,(q-z)`}
          annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{\mathrm{clip}\!\left(\underbrace{\mathrm{round}(x/s)}_{\text{정수 눈금으로}}+\underbrace{z}_{\text{zero-point 이동}},\,q_{\min},q_{\max}\right)}_{\text{quantize}}\\\hat{x}&=\underbrace{s\,(q-z)}_{\text{dequantize: 눈금을 다시 실수로}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathrm{round}(x/s)+z`,
              annotation: [
                "실수를 scale로 나눠 정수 눈금에 놓고",
                "zero-point만큼 이동",
              ],
            },
            {
              expression: String.raw`s\,(q-z)`,
              annotation: ["저장된 code에서 이동을 되돌리고", "scale을 곱해 복원"],
            },
          ]}
          terms={[
            {
              symbol: "s",
              name: "Scale",
              description: "정수 눈금 한 칸이 나타내는 실수 폭입니다.",
            },
            {
              symbol: "z",
              name: "Zero-point",
              description: "실수 0이 어느 정수 code에 대응하는지입니다.",
            },
            {
              symbol: String.raw`q_{\min},q_{\max}`,
              name: "Code 범위",
              description: "bit 수가 정하는 최소·최대 정수 code입니다.",
            },
          ]}
          assumptions={[
            "Round는 nearest, clip은 범위 밖을 경계값으로 자릅니다.",
            "s>0이며 하나의 tensor·channel·group 안에서 고정됩니다.",
            "z=0이 항상 더 정확하다는 뜻은 아닙니다.",
          ]}
          interpretation="Weight처럼 원점 대칭 분포는 symmetric(z=0)이 code space를 낭비 없이 쓰지만, ReLU 이후 activation처럼 값이 [0, 6] 같은 한쪽으로 치우친 range면 asymmetric(z≠0)이 같은 bit 수로 더 촘촘한 step을 만듭니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            예를 들어 activation range가 [-2, 6]이고 8bit code가 [0, 255]면
            scale=8/255≈0.0314, zero-point=round(0-(-2)/0.0314)≈64입니다.
            Code 64가 실수 0에 대응하도록 range 전체를 옮긴 것이며, weight
            range가 [-3, 3]처럼 원점 대칭이면 scale=3/127≈0.0236,
            zero-point=0인 symmetric 쪽이 code 절반을 버리지 않습니다.
          </p>
        </div>
      </section>

      <section id="granularity" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Scale 공유 범위를 좁힐수록 정확도와 metadata가 함께 늘어납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <Link to="/ai/ptq-calibration#scale-granularity">
              Per-tensor·per-channel·group-wise
            </Link>
            는 scale 하나를 얼마나 넓게 공유하는지로 갈수록 좁아지는
            스펙트럼입니다. Tensor 전체가 scale 하나를 공유하는 쪽에서
            출발해, 출력 channel마다 따로 두는 쪽을 거쳐, N개 원소 묶음마다
            따로 두는 쪽으로 갈수록 범위가 좁아집니다.
          </p>
          <p>
            <strong>Block quantization</strong>은 이 스펙트럼을 한 단계 더
            확장합니다. NVFP4처럼 좁은 단위(원소 16개) 하나마다 낮은 정밀도
            scale을 두고, 그 block scale들을 다시 tensor 하나의 scale로
            정규화하는 second-level scaling을 더합니다.
          </p>
          <p>
            4096×4096 weight matrix(원소 16,777,216개)라면 per-tensor는
            scale 1개, per-channel(4096개 출력 channel)은 scale 4096개가
            필요합니다.
          </p>
          <p>
            Group-wise(128개 단위)는 131,072개, NVFP4식 block(16개 단위)은
            1,048,576개의 block scale에 tensor scale 1개를 더해야 합니다.
            좁힐수록 outlier 하나가 전체 scale을 망치는 정도는 줄지만
            저장해야 할 scale metadata는 늘어납니다.
          </p>
        </div>
      </section>
    </div>
  );
}
