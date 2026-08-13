import ExplainedFormula from "@/components/ui/explained-formula";
import KernelWindowViz from "./viz/KernelWindowViz";
import SpatialGeometryViz from "./viz/SpatialGeometryViz";
export default function ConvolutionLayer() {
  return (
    <section id="convolution-layer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Convolution layer는 local correlation을 모든 위치에서 반복한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          한 output channel의 한 위치는 input의 local window와 kernel을 원소별로
          곱해 모두 더하고 bias를 붙인다. Kernel은 spatial 크기뿐 아니라 모든
          input channel을 관통한다. Deep-learning library의 <code>Conv2d</code>
          는 대개 kernel을 뒤집지 않는 cross-correlation을 계산하지만, kernel
          자체를 학습하므로 관례상 convolution layer라고 부른다.
        </p>
        <p>
          숫자로 보면 2×2 patch <code>[[1,2],[3,4]]</code>와 kernel
          <code>[[1,0],[0,−1]]</code>의 score는
          <code>1·1+2·0+3·0+4·(−1)=−3</code>이다. 이 한 계산을 같은 kernel로
          다른 위치에서 반복하는 것이 weight sharing이며, kernel을 수학적
          convolution처럼 뒤집지 않는다는 점이 cross-correlation이라는 이름의
          이유다.
        </p>
      </div>
      <KernelWindowViz />
      <ExplainedFormula
        question="Input의 local patch에서 output channel o의 한 값을 어떻게 계산할까?"
        idea={
          <>
            Output grid (i,j)에 맞춘 input window를 꺼내고, input channel c와
            kernel offset (u,v) 전체의 weighted sum을 계산합니다. 같은 K가 모든
            (i,j)에 재사용됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}Y_{oij}=b_o+\sum_c\sum_{u,v}K_{ocuv}\,X_{c,r,q}\\r=si+\delta u-p,\quad q=sj+\delta v-p\end{aligned}`}
        terms={[
          {
            symbol: "K_{ocuv}",
            name: "shared kernel",
            description:
              "Output channel o가 input channel c의 offset (u,v)에 적용하는 학습 weight입니다.",
          },
          {
            symbol: "s",
            name: "stride",
            description:
              "Output이 한 칸 이동할 때 input에서 이동하는 간격입니다.",
          },
          {
            symbol: "\\delta",
            name: "dilation",
            description: "Kernel tap 사이의 input 간격입니다.",
          },
          {
            symbol: "p",
            name: "padding",
            description: "Output 경계 계산을 위해 input 좌표에 둔 여백입니다.",
          },
        ]}
        assumptions={[
          "Index가 input 경계를 벗어날 때 zero·reflect 등 padding mode를 명시합니다.",
          "Library의 tensor layout(NCHW/NHWC)과 grouped convolution 설정은 별도 계약입니다.",
        ]}
        interpretation="Locality는 u,v 범위에서, weight sharing은 K에 output 위치 i,j index가 없다는 데서 드러납니다. Kernel이 edge를 찾는다는 설명은 학습 결과의 한 사례이며 수식 자체가 edge detector를 고정하지 않습니다."
      />
      <SpatialGeometryViz />
      <ExplainedFormula
        question="Kernel·stride·padding·dilation을 정했을 때 output height는 몇 칸일까?"
        idea={
          <>
            Dilated kernel의 실제 span은 δ(k−1)+1입니다. Padding을 더한 input
            길이에서 이 span을 빼고 stride 간격으로 놓을 수 있는 시작 위치 수를
            셉니다.
          </>
        }
        formula={String.raw`H_{out}=\left\lfloor\frac{H+2p-\delta(k-1)-1}{s}+1\right\rfloor`}
        terms={[
          {
            symbol: "H",
            name: "input height",
            description: "Convolution 전 feature map의 세로 크기입니다.",
          },
          {
            symbol: "k",
            name: "kernel size",
            description: "세로 방향 kernel tap 수입니다.",
          },
          {
            symbol: "s,p,\delta",
            name: "geometry controls",
            description: "각각 stride·padding·dilation입니다.",
          },
        ]}
        assumptions={[
          "대칭 padding과 정수 scalar parameter의 한 축 표현이며 width에도 같은 식을 별도 적용합니다.",
          "ceil mode·asymmetric padding은 framework 규칙을 따로 확인합니다.",
        ]}
        interpretation="‘same padding’이라는 이름만 믿지 말고 짝수 kernel과 stride>1에서 실제 좌우 padding과 output shape를 확인해야 합니다. Shape가 같아도 zero padding은 경계에 인공적인 값을 넣습니다."
      />
      <ExplainedFormula
        question="Dense 2D convolution의 parameter 수는 input resolution과 어떤 관계일까?"
        idea={
          <>
            각 output channel마다 kₕ×k𝓌×Cᵢₙ kernel과 bias 하나가 있습니다. 같은
            weight를 모든 spatial position에 쓰므로 H와 W는 parameter 수에
            들어가지 않습니다.
          </>
        }
        formula={String.raw`P_{conv}=k_hk_wC_{in}C_{out}+C_{out}`}
        terms={[
          {
            symbol: "C_{in}",
            name: "input channels",
            description: "RGB 또는 이전 layer feature channel 수입니다.",
          },
          {
            symbol: "C_{out}",
            name: "output channels",
            description: "학습하는 filter bank의 개수입니다.",
          },
        ]}
        assumptions={[
          "groups=1인 dense convolution이며 bias를 사용한다고 가정합니다.",
          "FLOPs와 activation memory는 Hout·Wout에 비례하므로 parameter가 작아도 실행 비용은 클 수 있습니다.",
        ]}
        interpretation="Resolution은 parameter 수를 바꾸지 않지만 같은 kernel을 적용하는 위치 수를 늘립니다. Model size·FLOPs·latency·activation memory를 하나의 ‘가벼움’ 지표로 합치지 않아야 합니다."
      />
    </section>
  );
}
