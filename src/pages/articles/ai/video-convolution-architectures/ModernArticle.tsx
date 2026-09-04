import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { VideoConvolutionViz } from "../video-understanding/viz/ModernVideoUnderstandingViz";

export default function VideoConvolutionArchitecturesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Video convolution의 차이는 시간 관계를 어디서, 어떤 rate로
          섞는가입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            2D frame encoder 뒤 평균을 내는 baseline은 각 frame의 공간 모양은
            읽지만 시간 순서를 직접 계산하지 않습니다. 3D convolution, R(2+1)D,
            SlowFast는 모두 시간 정보를 넣지만 operator와 pretraining handoff,
            frame-rate budget이 다릅니다. 먼저 한 output이 원본 timeline의 몇
            초를 보는지 계산합니다.
          </p>
        </div>
        <TermBreakdown
          title="시간 convolution을 읽는 용어"
          items={[
            {
              term: "Temporal kernel",
              description:
                "한 output을 만들 때 직접 읽는 시간축 sample 위치 수입니다.",
            },
            {
              term: "Temporal dilation",
              description:
                "Kernel 위치 사이를 sampled-frame 단위로 벌리는 간격입니다.",
            },
            {
              term: "Inflation",
              description:
                "2D image filter에 시간축을 추가해 3D filter 초기값으로 옮기는 handoff입니다.",
            },
            {
              term: "Factorization",
              description:
                "한 3D operator를 spatial stage와 temporal stage로 나누는 구조입니다.",
            },
          ]}
        />
        <VideoConvolutionViz />
        <ContentBoundary article="video-convolution-architectures" />
      </section>

      <section id="receptive-span" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Sampled-frame span을 원본 seconds로 되돌립니다
        </h2>
        <ExplainedFormula
          question="Temporal kernel이 직접 보는 첫·마지막 source timestamp 차이는 얼마인가요?"
          idea={
            <p>
              kernel 위치 수와 dilation으로 sampled-frame index 폭을 만들고 input stride를 곱해 source-frame 폭으로 바꾼 뒤 source
              FPS로 나눕니다.
            </p>
          }
          formula={String.raw`D_{\rm span}=(k_t-1)d_ts/f_{\rm src}`}
          annotatedFormula={String.raw`\begin{aligned}g_t&=\underbrace{k_t-1}_{\text{kernel 위치 사이 간격 수}}\\w_t&=\underbrace{g_td_t}_{\text{dilation을 반영한 sampled-frame 폭}}\\\Delta i&=\underbrace{w_ts}_{\text{input stride로 source-frame 폭 변환}}\\D_{\rm span}&=\underbrace{\Delta i/f_{\rm src}}_{\text{frame 폭을 seconds로 변환}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`k_t-1`,
              annotation: [
                "kernel 위치 수에서 하나를 빼",
                "첫·마지막 사이 gap을 구함",
              ],
            },
            {
              expression: String.raw`g_td_t`,
              annotation: [
                "gap에 dilation을 곱해",
                "sampled-frame span을 늘림",
              ],
            },
            {
              expression: String.raw`w_ts`,
              annotation: ["input stride를 곱해", "source index 폭으로 되돌림"],
            },
            {
              expression: String.raw`\Delta i/f_{\rm src}`,
              annotation: [
                "source frame 폭을 FPS로 나눠",
                "실제 seconds를 구함",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`k_t`,
              name: "Temporal kernel size",
              description: "직접 읽는 temporal positions 수입니다.",
            },
            {
              symbol: String.raw`d_t`,
              name: "Temporal dilation",
              description: "Kernel positions 사이 sampled-frame 간격입니다.",
            },
            {
              symbol: "s",
              name: "Input sampling stride",
              description: "Model frames 사이 source-frame 간격입니다.",
            },
            {
              symbol: String.raw`D_{\rm span}`,
              name: "Timestamp span",
              description: "첫·마지막 직접 관측 사이 seconds입니다.",
            },
          ]}
          assumptions={[
            "한 layer의 direct span입니다.",
            "Padding boundary에서는 실제 frame 수가 줄 수 있습니다.",
            "Span 안 모든 frame의 영향이 같다는 뜻은 아닙니다.",
          ]}
          interpretation="30 fps, kₜ=3, dilation 1, input stride 2이면 indexes 0·2·4를 읽어 span은 4/30≈.133초입니다."
        />
      </section>

      <section id="inflation-factorization" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          I3D는 weight를 옮기고 R(2+1)D는 operator path를 나눕니다
        </h2>
        <TermBreakdown
          title="서로 다른 두 설계"
          items={[
            {
              term: "I3D inflation",
              description:
                "kh×kw image filter를 kt×kh×kw로 반복하고 scale을 맞춰 video pretraining의 초기값으로 사용합니다.",
            },
            {
              term: "Video pretraining",
              description:
                "Inflated weight 뒤 motion representation을 실제 video corpus에서 학습하는 별도 단계입니다.",
            },
            {
              term: "Spatial convolution",
              description:
                "1×kh×kw operator가 각 시간 위치의 공간 모양을 먼저 섞습니다.",
            },
            {
              term: "Temporal convolution",
              description:
                "kt×1×1 operator가 공간 feature의 시간 변화를 읽으며 중간 activation이 추가됩니다.",
            },
          ]}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div id="paper-i3d" className="not-prose scroll-mt-24">
            <CitationBlock
              type="paper"
              citeKey={1}
              source="Carreira & Zisserman — I3D"
              href="https://openaccess.thecvf.com/content_cvpr_2017/html/Carreira_Quo_Vadis_Action_CVPR_2017_paper.html"
            >
              <div className="space-y-2 text-sm leading-6">
                <p>
                  <strong>문제.</strong> Image architecture와 pretraining을
                  video action recognition으로 확장합니다.
                </p>
                <p>
                  <strong>기여.</strong> 2D filters를 3D로 inflate한 I3D와
                  Kinetics pretraining transfer를 제시합니다.
                </p>
                <p>
                  <strong>가정.</strong> Kinetics·UCF101·HMDB51와 RGB/flow
                  recipe를 전제로 합니다.
                </p>
                <p>
                  <strong>근거 범위.</strong> 논문의 action-classification
                  architecture와 transfer 실험입니다.
                </p>
                <p>
                  <strong>일반화 금지.</strong> Inflation만으로 motion
                  knowledge가 생기거나 모든 video task에 우월하다는 뜻은
                  아닙니다.
                </p>
              </div>
            </CitationBlock>
          </div>
          <div id="paper-r2plus1d" className="not-prose scroll-mt-24">
            <CitationBlock
              type="paper"
              citeKey={2}
              source="Tran et al. — R(2+1)D"
              href="https://openaccess.thecvf.com/content_cvpr_2018/html/Tran_A_Closer_Look_CVPR_2018_paper.html"
            >
              <div className="space-y-2 text-sm leading-6">
                <p>
                  <strong>문제.</strong> Full 3D와 spatial-temporal
                  factorization의 optimization 차이를 비교합니다.
                </p>
                <p>
                  <strong>기여.</strong> Spatial 2D와 temporal 1D convolution
                  사이에 nonlinearity를 둔 block을 제시합니다.
                </p>
                <p>
                  <strong>가정.</strong> 논문의 residual architectures·capacity
                  matching·video datasets를 전제로 합니다.
                </p>
                <p>
                  <strong>근거 범위.</strong> Controlled spatiotemporal
                  convolution experiments 범위입니다.
                </p>
                <p>
                  <strong>일반화 금지.</strong> 모든 hardware와 domain에서 같은
                  speedup·accuracy gain을 보장하지 않습니다.
                </p>
              </div>
            </CitationBlock>
          </div>
        </div>
      </section>

      <section id="slowfast" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          SlowFast는 같은 duration을 다른 rate와 channel capacity로 읽습니다
        </h2>
        <ExplainedFormula
          question="Fast path의 frame 수와 channel 수는 Slow path에서 어떻게 정하나요?"
          idea={
            <p>
              fast path는 시간축을 α배 촘촘하게 읽고 그 비용을 제한하도록 channel capacity는 β배만 사용합니다.
            </p>
          }
          formula={String.raw`T_f=\alpha T_s,\quad C_f=\beta C_s`}
          annotatedFormula={String.raw`\begin{aligned}T_f&=\underbrace{\alpha T_s}_{\substack{\text{rate ratio를 곱해}\\\text{motion을 촘촘히 관측}}}\\[4pt]C_f&=\underbrace{\beta C_s}_{\substack{\text{channel ratio를 곱해}\\\text{Fast 비용을 제한}}}\\[4pt]H&=\underbrace{\operatorname{lateral}(F_f,F_s)}_{\substack{\text{두 rate의 features를}\\\text{변환한 뒤 연결}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\alpha T_s`,
              annotation: [
                "Slow frames에 rate ratio를 곱해",
                "Fast temporal samples를 만듦",
              ],
            },
            {
              expression: String.raw`\beta C_s`,
              annotation: [
                "Slow channels에 작은 비율을 곱해",
                "Fast capacity를 제한",
              ],
            },
            {
              expression: String.raw`\operatorname{lateral}(F_f,F_s)`,
              annotation: [
                "Fast와 Slow features를 변환·연결해",
                "motion과 semantics를 결합",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\alpha`,
              name: "Frame-rate ratio",
              description: "Fast가 Slow보다 몇 배 촘촘한지 나타냅니다.",
            },
            {
              symbol: String.raw`\beta`,
              name: "Channel ratio",
              description:
                "Fast channel capacity가 Slow의 몇 배인지 나타냅니다.",
            },
            {
              symbol: "H",
              name: "Fused representation",
              description: "Lateral connection 뒤 두 pathway evidence입니다.",
            },
          ]}
          assumptions={[
            "두 pathways가 같은 원본 duration을 관측합니다.",
            "Lateral placement와 transform을 architecture contract에 기록합니다.",
            "α·β는 hyperparameters이며 실제 latency는 측정합니다.",
          ]}
          interpretation="Slow 8 frames×256 channels, α=8, β=1/8이면 Fast는 64 frames×32 channels입니다."
        />
        <div id="paper-slowfast" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={3}
            source="Feichtenhofer et al. — SlowFast Networks"
            href="https://openaccess.thecvf.com/content_ICCV_2019/html/Feichtenhofer_SlowFast_Networks_for_Video_Recognition_ICCV_2019_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 공간 의미와 빠른 motion을 같은
                capacity·frame rate로 처리하는 비효율을 다룹니다.
              </p>
              <p>
                <strong>기여.</strong> Low-rate Slow와 high-rate lightweight
                Fast pathways 및 lateral fusion을 제안합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 action datasets·α·β·architecture와
                training recipe를 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> SlowFast video recognition
                experiments 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 고정 α·β가 모든 event duration과
                runtime에서 최적이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
