import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DepthwiseViz } from "../cnn/viz/ModernCnnViz";

export default function DepthwiseArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Depthwise separable convolution은 공간을 찾는 일과 channel을 섞는 일을
          나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Dense convolution은 kernel 하나가 spatial tap과 모든 input channel을 동시에 읽어 output channel을 만듭니다.
            Depthwise 단계는 channel 안에서만 pattern을 찾고 뒤의 1×1 pointwise 단계가 같은 위치의 channel vector를 섞습니다.
          </p>
        </div>
        <TermBreakdown
          title="두 operator를 따로 보기"
          items={[
            {
              term: "Depthwise",
              description:
                "Input channel마다 별도 k×k spatial kernel 하나를 적용합니다.",
            },
            {
              term: "Pointwise",
              description:
                "1×1 projection으로 같은 위치의 Cin 값을 Cout 값으로 섞습니다.",
            },
            {
              term: "MAC count",
              description:
                "Arithmetic work의 이론상 횟수이며 latency 자체는 아닙니다.",
            },
            {
              term: "Runtime boundary",
              description:
                "Memory traffic·launch·vectorization·fusion과 quality를 실제 device에서 측정합니다.",
            },
          ]}
        />
        <DepthwiseViz />
        <ContentBoundary article="depthwise-separable-convolution" />
      </section>
      <section id="cost" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Dense의 k²CinCout을 k²Cin과 CinCout 두 항으로 분리합니다
        </h2>
        <ExplainedFormula
          question="왜 depthwise separable convolution의 MAC가 작아지나요?"
          idea={
            <p>
              Dense는 spatial tap마다 모든 input-output channel pair를 연결합니다. 분해하면 spatial tap은 channel별로만 처리합니다.
              channel pair 연결은 1×1에서 한 번만 일어납니다.
            </p>
          }
          formula={String.raw`\rho=\frac{k^2C_{in}+C_{in}C_{out}}{k^2C_{in}C_{out}}`}
          annotatedFormula={String.raw`\begin{aligned}M_{\mathrm{dense}}&=\underbrace{k^2C_{in}C_{out}}_{\text{tap·channel pair 계산}}\\M_{\mathrm{dw}}&=\underbrace{k^2C_{in}}_{\text{channel별 spatial filter}}\\M_{\mathrm{pw}}&=\underbrace{C_{in}C_{out}}_{\text{1×1 channel mixing}}\\\rho&=\underbrace{(M_{\mathrm{dw}}+M_{\mathrm{pw}})/M_{\mathrm{dense}}}_{\text{dense 대비 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`k^2C_{in}C_{out}`,
              annotation: [
                "tap과 모든 channel pair를 곱해",
                "dense 위치당 MAC 계산",
              ],
            },
            {
              expression: String.raw`k^2C_{in}+C_{in}C_{out}`,
              annotation: [
                "spatial filtering과 channel mixing을 분리해",
                "separable 위치당 MAC 계산",
              ],
            },
            {
              expression: String.raw`M_{\mathrm{sep}}/M_{\mathrm{dense}}`,
              annotation: [
                "같은 output 위치 기준으로 나눠",
                "서로 다른 규모를 비율로 비교",
              ],
            },
          ]}
          terms={[
            {
              symbol: "k",
              name: "Kernel width",
              description: "Square spatial kernel의 한 축 tap 수입니다.",
            },
            {
              symbol: "C_{in}",
              name: "Input channels",
              description: "입력 feature channel 수입니다.",
            },
            {
              symbol: "C_{out}",
              name: "Output channels",
              description: "Pointwise projection이 만드는 channel 수입니다.",
            },
          ]}
          assumptions={[
            "Bias·batch·H·W 공통 factor를 생략한 위치당 MAC 비교입니다.",
            "같은 output geometry를 만든다고 가정합니다.",
          ]}
          interpretation="k=3,Cin=64,Cout=128이면 비율은 (576+8192)/73728≈0.119입니다."
        />
      </section>
      <section id="runtime" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          MAC 0.119가 latency 0.119를 보장하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 kernel launch, intermediate feature write/read, 낮은 arithmetic intensity, accelerator별 depthwise
            primitive 품질이 실제 시간을 바꿉니다. batch와 shape, dtype, layout을 같게 맞춘 뒤 dense와 separable의 median·p95,
            memory traffic, energy, task quality를 함께 측정합니다.
          </p>
        </div>
      </section>
      <section id="paper-mobilenet" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          MobileNet evidence는 정확도–resource trade-off 안에서 읽습니다
        </h2>
        <div className="not-prose">
          <CitationBlock
            source="Howard et al. — MobileNets"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1704.04861"
          >
            Depthwise separable convolution과 width·resolution multiplier를
            mobile vision에 적용합니다. MAC 감소가 모든 accelerator에서 동일한
            latency·energy 감소를 만든다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
