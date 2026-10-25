import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import VideoPathLocator, {
  VideoMapReturn,
} from "../video-understanding/VideoPathLocator";
import {
  I3DInflationViz,
  R2Plus1DFactorizationViz,
  SlowFastRateViz,
  TemporalReceptiveSpanViz,
  VideoConvolutionOverviewViz,
} from "./viz/VideoConvolutionArchitecturesViz";

const RECEPTIVE_FIELD_CODE = `function temporalReceptiveSteps(layers) {
  // 아직 한 input position만 보므로 receptive field와 jump를 1에서 시작합니다.
  let receptivePositions = 1;
  let outputJump = 1;

  return layers.map(({ kernel, dilation, stride }) => {
    // 현재 layer의 kernel gap을 이전 output 간격만큼 input 쪽으로 펼칩니다.
    receptivePositions += (kernel - 1) * dilation * outputJump;

    // 다음 layer가 보게 될 인접 output 사이의 input 간격을 갱신합니다.
    outputJump *= stride;
    return { receptivePositions, outputJump };
  });
}`;

export default function VideoConvolutionArchitecturesArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="30fps-source-stride-2"
        className="scroll-mt-20"
      >
        <VideoPathLocator current="convolution" />
        <h2 className="mb-6 text-2xl font-bold">
          같은 영상도 시간을 섞는 방식은 다릅니다
        </h2>
        <VideoConvolutionOverviewViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            30 fps 원본에서 source frame을 두 칸마다 읽는 clip을 가정하겠습니다.
            Model input position 0·1·2·3·4는 source index 0·2·4·6·8에
            대응합니다. 이 timestamp 입력을 고정해야 sampling 차이를 모델 구조의
            차이로 잘못 해석하지 않습니다.
          </p>
          <p>
            I3D·R(2+1)D·SlowFast는 모두 시간 정보를 사용하지만 같은 일을 하지
            않습니다. I3D는 2D weight를 3D 초기값으로 옮기고, R(2+1)D는 한 3D
            convolution을 공간·시간 연산으로 나눕니다. SlowFast는 같은 raw clip을
            서로 다른 sampling rate와 channel 수로 읽습니다. 먼저 이 구조들이
            공통으로 의존하는 temporal receptive span부터 source seconds로
            계산하겠습니다.
          </p>
        </div>
        <ContentBoundary article="video-convolution-architectures" />
        <TermBreakdown
          title="이 글에서 구분할 네 용어"
          items={[
            {
              term: "Temporal receptive field",
              description:
                "Output 하나에 직접 또는 여러 layer를 거쳐 연결된 input의 시간축 범위입니다.",
            },
            {
              term: "Inflation",
              description:
                "2D filter와 pooling kernel에 시간축을 더해 3D 구조와 초기값으로 옮기는 방법입니다.",
            },
            {
              term: "Factorization",
              description:
                "Full 3D convolution을 spatial convolution과 temporal convolution으로 나누는 연산 구조입니다.",
            },
            {
              term: "Multirate pathway",
              description:
                "같은 raw clip을 서로 다른 시간 간격과 feature capacity로 읽는 여러 경로입니다.",
            },
          ]}
        />
      </section>

      <section
        id="receptive-span"
        data-teach-level="2"
        className="scroll-mt-20"
      >
        <h2 className="mb-5 text-2xl font-bold">Temporal receptive span</h2>
        <TemporalReceptiveSpanViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            그림은 위에서 아래로 읽습니다. 첫 layer의 세 window가 input position
            0부터 4까지를 덮고, 둘째 layer의 output 하나가 그 세 window를 다시
            합칩니다. 그래서 연결된 input은 5개지만 first-last gap은 4개입니다.
            원본에서 input 한 칸이 source frame 두 칸이므로 4×2=8 frame gaps,
            시간으로는 8/30초입니다.
          </p>
          <p>
            여기서 <code>r</code>은 output 하나가 연결한 input position 수이고,
            <code> j</code>는 인접 output 두 개의 시작점이 input에서 몇 칸
            떨어지는지 나타냅니다. Layer stride는 현재 output의 receptive field를
            바로 넓히지 않고, 다음 layer가 보는 간격을 먼저 바꿉니다.
          </p>
        </div>

        <ExplainedFormula
          question="여러 temporal layer를 지난 output 하나는 원본에서 몇 초를 연결합니까?"
          idea={
            <p>
              각 layer에서 receptive position 수와 output jump를 갱신한 뒤,
              first-last gap에 source sampling stride를 곱하고 source FPS로
              나눕니다.
            </p>
          }
          formula={String.raw`r_l=r_{l-1}+(k_l-1)d_lj_{l-1},\quad j_l=j_{l-1}s_l`}
          annotatedFormula={String.raw`\begin{aligned}r_l&=\underbrace{r_{l-1}}_{\text{이전까지 연결한 position}}+\underbrace{(k_l-1)d_lj_{l-1}}_{\text{현재 kernel이 input 쪽에 더하는 gap}}\\j_l&=\underbrace{j_{l-1}s_l}_{\text{인접 output의 input 시작 간격}}\\\Delta t&=\underbrace{(r_L-1)s_{\rm in}/f_{\rm src}}_{\text{first-last source gap을 seconds로 변환}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`r_1=1+(3-1)\times1\times1=3,\quad j_1=1`,
              annotation: [
                "첫 layer의 kernel 3이",
                "input position 세 개를 연결",
              ],
            },
            {
              expression: String.raw`r_2=3+(3-1)\times1\times1=5,\quad j_2=2`,
              annotation: [
                "둘째 layer가 두 gap을 더하고",
                "stride 2로 다음 output 간격을 갱신",
              ],
            },
            {
              expression: String.raw`\Delta t=(5-1)\times2/30=8/30\approx0.267\ {\rm s}`,
              annotation: [
                "input gap 네 개를 source gap 여덟 개로 바꿔",
                "30 fps의 실제 시간으로 환산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`r_l`,
              name: "Receptive positions",
              description: "l번째 layer의 output 하나에 연결된 model input position 수입니다.",
            },
            {
              symbol: String.raw`j_l`,
              name: "Output jump",
              description: "l번째 layer의 인접 output이 model input에서 떨어진 간격입니다.",
            },
            {
              symbol: String.raw`s_{\rm in}`,
              name: "Input sampling stride",
              description: "Model input position 하나가 건너뛰는 source frame 수입니다.",
            },
            {
              symbol: String.raw`f_{\rm src}`,
              name: "Source FPS",
              description: "원본 영상에서 1초 동안 표시되는 frame 수입니다.",
            },
          ]}
          assumptions={[
            "두 layer 모두 dilation 1이고 kernel 3입니다. Layer 1 stride는 1, layer 2 stride는 2입니다.",
            "Padding 경계 밖의 가상 값은 세지 않고 interior output을 계산합니다.",
            "0.267초는 theoretical first-last span이며, 범위 안의 모든 timestamp가 같은 영향력을 가진다는 뜻은 아닙니다.",
          ]}
          interpretation="두 layer를 지난 output 하나는 model input position 다섯 개, source index 0·2·4·6·8에 연결됩니다. First-last timestamp span은 8/30≈0.267초입니다."
        />

        <div className="not-prose my-6 border-y border-border py-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground">
            이 글의 시각화가 사용하는 실제 TypeScript 계산
          </p>
          <pre className="overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6">
            <code>{RECEPTIVE_FIELD_CODE}</code>
          </pre>
        </div>
      </section>

      <section id="i3d" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">I3D inflation</h2>
        <I3DInflationViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2D filter를 시간축으로 세 번 그대로 복제하면 반복된 정지 영상에서 같은
            응답이 세 번 더해집니다. I3D 논문은 temporal depth가 <code>N</code>일 때
            각 slice를 <code>N</code>으로 나눠, 같은 이미지를 반복한 영상의 초기
            response가 2D network와 같아지도록 만듭니다. 논문은 이 조건을
            <em> boring-video fixed point</em>라고 부릅니다.
          </p>
          <p>
            이 보장은 초기화 시점의 반복 정지 영상에 한정됩니다. Inflation만으로
            motion representation이 만들어지는 것은 아닙니다. Inflated network를
            video data로 학습하면서 temporal slices가 서로 다른 값을 갖게 되고,
            그때부터 frame 사이 변화에 반응할 수 있습니다.
          </p>
        </div>

        <ExplainedFormula
          question="Temporal depth 3으로 옮겨도 2D response 6을 어떻게 유지합니까?"
          idea={<p>2D weight를 세 slice에 복제하되 각 slice를 3으로 나눕니다.</p>}
          formula={String.raw`W^{3D}_{\tau,:,:}=W^{2D}/N`}
          annotatedFormula={String.raw`\underbrace{W^{3D}_{\tau,:,:}}_{\text{각 temporal slice의 초기 weight}}=\frac{\underbrace{W^{2D}}_{\text{image filter weight}}}{\underbrace{N}_{\text{temporal slice 수}}}`}
          operations={[
            {
              expression: String.raw`6/3=2`,
              annotation: ["2D response 6을", "세 temporal slices에 같은 크기로 배분"],
            },
            {
              expression: String.raw`2+2+2=6`,
              annotation: ["반복된 세 frame의 slice response를 더해", "원래 2D response를 보존"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`W^{2D}`,
              name: "Image filter",
              description: "Image-pretrained 2D convolution weight입니다.",
            },
            {
              symbol: String.raw`W^{3D}_{\tau,:,:}`,
              name: "Temporal slice",
              description: "Inflated 3D filter에서 τ번째 시간축 slice입니다.",
            },
            {
              symbol: "N",
              name: "Temporal depth",
              description: "시간축으로 만든 filter slice 수입니다.",
            },
          ]}
          assumptions={[
            "Weight 합 6과 반복 frame 값 1은 계산을 보여 주기 위한 가정입니다.",
            "Convolution의 선형 부분을 단순화해 response scale만 비교합니다.",
            "실제 I3D는 filter뿐 아니라 pooling kernel과 temporal stride도 구조에 맞게 확장합니다.",
          ]}
          interpretation="Temporal depth 3이면 각 slice가 원래 filter의 1/3로 시작합니다. 반복된 세 frame에서 세 slice의 응답을 더해도 원래 2D response 6이 유지됩니다."
        />

        <div id="paper-i3d" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Carreira & Zisserman — I3D"
            href="https://openaccess.thecvf.com/content_cvpr_2017/html/Carreira_Quo_Vadis_Action_CVPR_2017_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>문제.</strong> 검증된 image architecture와 ImageNet weight를 video action recognition의 시공간 연산으로 옮깁니다.</p>
              <p><strong>이 글의 사용.</strong> 2D filter를 시간축으로 반복하고 반복 수로 나누는 boring-video fixed point를 inflation의 정확한 보장 범위로 사용합니다.</p>
              <p><strong>논문의 다음 단계.</strong> Inflated Inception-v1을 Kinetics에서 video data로 학습하고 RGB와 optical-flow stream을 비교합니다.</p>
              <p><strong>근거 범위.</strong> 논문의 I3D architecture, pretraining, action-classification 실험 범위입니다.</p>
              <p><strong>일반화 금지.</strong> Weight inflation만으로 motion knowledge가 생기거나 모든 video task에서 우월하다는 뜻은 아닙니다.</p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section
        id="r2plus1d"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <h2 className="mb-5 text-2xl font-bold">R(2+1)D factorization</h2>
        <R2Plus1DFactorizationViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            I3D가 2D weight를 3D filter의 초기값으로 옮겼다면, R(2+1)D는
            convolution block 안의 계산 순서를 바꿉니다. 먼저
            <code> 1×3×3</code> spatial convolution으로 각 시점의 공간 feature를
            만들고 ReLU를 적용한 뒤, <code>3×1×1</code> temporal convolution으로
            시간 변화를 계산합니다.
          </p>
          <p>
            공정하게 구조를 비교하려면 중간 channel 수 <code>M</code>을 임의로
            고르면 안 됩니다. 논문은 full 3D filter와 parameter 수가 가깝도록
            <code> M</code>을 정합니다. 그림의 4→4 channel 사례에서는 M=9이고,
            두 연산의 parameter 수 324와 108을 더하면 full 3D와 같은 432가 됩니다.
          </p>
        </div>

        <ExplainedFormula
          question="Full 3D와 parameter 수를 맞추는 중간 channel M은 얼마입니까?"
          idea={
            <p>
              Full 3D parameter 수를 spatial·temporal 두 연산의 channel당 parameter
              합으로 나누고 정수 아래값을 사용합니다.
            </p>
          }
          formula={String.raw`M=\lfloor\frac{td^2C_{in}C_{out}}{d^2C_{in}+tC_{out}}\rfloor`}
          annotatedFormula={String.raw`M=\lfloor\frac{\underbrace{td^2C_{in}C_{out}}_{\text{full 3D parameter 수}}}{\underbrace{d^2C_{in}}_{\text{spatial stage의 M당 parameter}}+\underbrace{tC_{out}}_{\text{temporal stage의 M당 parameter}}}\rfloor`}
          operations={[
            {
              expression: String.raw`P_{3D}=3\times3^2\times4\times4=432`,
              annotation: ["3×3×3 filter가", "4 input channels를 4 output channels로 변환"],
            },
            {
              expression: String.raw`M=\lfloor432/(3^2\times4+3\times4)\rfloor=9`,
              annotation: ["Full 3D budget을", "중간 channel 하나가 두 stage에 더하는 parameter 수로 나눔"],
            },
            {
              expression: String.raw`P_{2+1D}=3^2\times4\times9+3\times9\times4=324+108=432`,
              annotation: ["Spatial과 temporal parameter를", "같은 job boundary에서 합산"],
            },
          ]}
          terms={[
            { symbol: "t", name: "Temporal kernel", description: "Full 3D와 temporal stage의 시간축 크기입니다." },
            { symbol: "d", name: "Spatial kernel", description: "정사각형 spatial kernel 한 변의 크기입니다." },
            { symbol: String.raw`C_{in},C_{out}`, name: "Channel counts", description: "Block의 input과 output channel 수입니다." },
            { symbol: "M", name: "Intermediate channels", description: "Spatial stage가 만들고 temporal stage가 읽는 중간 feature channel 수입니다." },
          ]}
          assumptions={[
            "Temporal kernel 3, spatial kernel 3×3, input과 output channel 4는 설명용 가정입니다.",
            "두 경로 모두 bias parameter는 세지 않았습니다.",
            "Parameter 수가 같아도 ReLU, intermediate activation memory, kernel 구현, latency는 같지 않습니다.",
          ]}
          interpretation="M=9를 쓰면 full 3D와 R(2+1)D가 각각 432 parameters를 갖습니다. R(2+1)D에는 중간 ReLU와 activation tensor가 추가되므로 같은 연산을 표기만 바꾼 구조는 아닙니다."
        />

        <div id="paper-r2plus1d" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Tran et al. — R(2+1)D"
            href="https://openaccess.thecvf.com/content_cvpr_2018/html/Tran_A_Closer_Look_CVPR_2018_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>문제.</strong> Full 3D convolution과 공간·시간 factorization의 표현 및 optimization 차이를 비교합니다.</p>
              <p><strong>이 글의 사용.</strong> Spatial 2D convolution, 중간 ReLU, temporal 1D convolution의 순서와 parameter-matching 식을 사용합니다.</p>
              <p><strong>논문의 관찰.</strong> 같은 parameter 수에서 추가 nonlinearity가 생기며, 논문에 사용한 ResNet과 데이터셋에서는 R3D보다 optimization이 쉬운 결과를 보고합니다.</p>
              <p><strong>근거 범위.</strong> 논문의 residual architecture, capacity matching, action-recognition datasets와 학습 조건입니다.</p>
              <p><strong>일반화 금지.</strong> 모든 hardware와 domain에서 같은 accuracy나 latency 차이를 보장하지 않습니다.</p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="slowfast" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">SlowFast pathways</h2>
        <SlowFastRateViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SlowFast는 한 convolution을 둘로 쪼개는 block이 아니라 network 전체에
            두 pathway를 둡니다. 논문 표의 한 구성은 64-frame raw clip에서 Slow가
            16-frame 간격으로 4장을 읽고, Fast가 2-frame 간격으로 32장을 읽습니다.
            Fast는 여덟 배 촘촘하지만 channel도 Slow의 1/8인 8개만 사용합니다.
          </p>
          <p>
            두 feature는 시간 길이가 달라 그대로 더하거나 이어 붙일 수 없습니다.
            Lateral connection은 time-to-channel, time-strided sampling,
            time-strided convolution 같은 변환으로 시간축을 맞춘 뒤 Fast feature를
            Slow 쪽에 결합합니다. 시각화에서는 그중 time-strided sampling을 골라
            32×8을 4×8로 바꾸고 Slow 4×64와 연결했습니다.
          </p>
        </div>

        <ExplainedFormula
          question="Slow 4×64 feature에서 Fast frame 수와 channel 수는 어떻게 정합니까?"
          idea={<p>Slow frame 수에 frame-rate ratio α를 곱하고, Slow channel 수에는 channel ratio β를 곱합니다.</p>}
          formula={String.raw`T_f=\alpha T_s,\quad C_f=\beta C_s`}
          annotatedFormula={String.raw`\begin{aligned}T_f&=\underbrace{\alpha T_s}_{\text{같은 raw clip을 더 촘촘히 읽은 frame 수}}\\C_f&=\underbrace{\beta C_s}_{\text{Fast pathway에 배분한 channel 수}}\end{aligned}`}
          operations={[
            { expression: String.raw`T_f=8\times4=32\ {\rm frames}`, annotation: ["Slow 네 장에 rate ratio 8을 곱해", "Fast가 읽는 32장을 계산"] },
            { expression: String.raw`C_f=(1/8)\times64=8\ {\rm channels}`, annotation: ["Slow 64 channels에 channel ratio 1/8을 곱해", "Fast channel 수를 계산"] },
            { expression: String.raw`32\times8\xrightarrow{\text{sample every }8}4\times8`, annotation: ["설명용 lateral sampling으로 시간축을 줄여", "Slow의 네 time positions에 맞춤"] },
          ]}
          terms={[
            { symbol: String.raw`T_s,T_f`, name: "Temporal lengths", description: "Slow와 Fast pathway가 읽는 frame 수입니다." },
            { symbol: String.raw`C_s,C_f`, name: "Channel capacities", description: "두 pathway feature의 channel 수입니다." },
            { symbol: String.raw`\alpha`, name: "Frame-rate ratio", description: "Fast가 Slow보다 몇 배 많은 frames를 읽는지 나타냅니다." },
            { symbol: String.raw`\beta`, name: "Channel ratio", description: "Fast channel 수가 Slow의 몇 배인지 나타냅니다." },
          ]}
          assumptions={[
            "64-frame raw clip, Slow temporal stride 16, α=8, β=1/8은 논문 Table 1의 한 구성입니다.",
            "Lateral 계산은 논문이 비교한 방법 중 time-strided sampling을 설명용으로 선택했습니다.",
            "Shape는 latency나 accuracy가 아닙니다. Backbone, convolution placement, runtime과 input에서 별도로 측정해야 합니다.",
          ]}
          interpretation="같은 64-frame window에서 Slow는 4×64, Fast는 32×8 feature를 만듭니다. Fast feature는 시간축을 맞추는 lateral transform 뒤 Slow 쪽에 결합됩니다."
        />

        <div id="paper-slowfast" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={3}
            source="Feichtenhofer et al. — SlowFast Networks"
            href="https://openaccess.thecvf.com/content_ICCV_2019/html/Feichtenhofer_SlowFast_Networks_for_Video_Recognition_ICCV_2019_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p><strong>문제.</strong> 공간 의미와 빠른 motion을 같은 temporal rate와 channel capacity로 처리하는 구조를 다시 나눕니다.</p>
              <p><strong>이 글의 사용.</strong> Slow <code>{"{T,S²,C}"}</code>, Fast <code>{"{αT,S²,βC}"}</code> shape와 α=8·β=1/8인 Table 1 예시, lateral transformation의 역할을 사용합니다.</p>
              <p><strong>논문의 구성.</strong> Low-rate Slow와 high-rate lightweight Fast pathways를 두고 여러 stage에서 Fast feature를 Slow 쪽으로 결합합니다.</p>
              <p><strong>근거 범위.</strong> 논문의 SlowFast architecture와 action classification·detection 실험 범위입니다.</p>
              <p><strong>일반화 금지.</strong> α=8·β=1/8이나 한 lateral 방식이 모든 event duration과 runtime에서 최적이라는 뜻은 아닙니다.</p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="return-map" data-teach-level="6" className="scroll-mt-20">
        <VideoMapReturn current="convolution" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>세 구조를 같은 축에 놓지 않습니다</h2>
          <p>
            I3D는 초기 weight를 video network로 옮기는 규칙, R(2+1)D는 한
            convolution block의 연산 경로, SlowFast는 network 전체의 temporal
            rate와 channel 배분입니다. 그래서 셋 중 하나를 이름만 보고 고르는
            비교표는 질문부터 맞지 않습니다. 먼저 input timestamp와 receptive span을
            고정한 뒤, 초기화·block·pathway 중 어느 축을 바꾸는지 확인해야 합니다.
          </p>
          <p>
            구조가 스스로 보장하지 않는 것도 남습니다. Padding 경계는 실제 관측
            frame을 줄일 수 있고, inflation은 motion knowledge를 보장하지 않으며,
            factorization은 runtime speed를 보장하지 않습니다. 높은 sampling rate도
            원본에 motion blur나 빠진 timestamp가 있으면 정보를 복구하지 못합니다.
            실제 환경의 model 선택과 latency·memory 측정은 이 개념 경계를 입력으로
            삼는 별도 실무 판단입니다.
          </p>
          <h2>확인</h2>
          <ol>
            <li>두 temporal layer의 output 하나가 input 다섯 개를 볼 때 first-last gap은 왜 네 개입니까? <strong>(답: Temporal receptive span)</strong></li>
            <li>I3D가 temporal slices를 복제 수로 나누는 이유는 무엇이며, 그 단계가 motion 학습과 다른 이유는 무엇입니까? <strong>(답: I3D inflation)</strong></li>
            <li>R(2+1)D와 SlowFast는 각각 어느 범위의 구조를 바꿉니까? <strong>(답: R(2+1)D factorization·SlowFast pathways)</strong></li>
          </ol>
        </div>
      </section>
    </div>
  );
}
