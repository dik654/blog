import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ReceptiveFieldViz } from "../cnn/viz/ModernCnnViz";

export default function CnnReceptiveArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Receptive field는 hidden unit 하나에서 input까지 거꾸로 따라간 좌표
          범위입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 계산 graph에서 연결된 theoretical 범위를 셉니다. 그 다음 실제
            checkpoint에서 어느 pixel이 output을 크게 바꾸는지
            gradient·perturbation으로 측정합니다. 두 범위를 같은 것으로 부르면
            큰 이론상 창을 실제 사용 context로 과장하게 됩니다.
          </p>
        </div>
        <TermBreakdown
          title="범위를 한 층씩 쌓는 용어"
          items={[
            {
              term: "Jump jₗ",
              description:
                "현재 layer에서 이웃 unit 두 개가 원 input에서 떨어진 간격입니다.",
            },
            {
              term: "Theoretical RF rₗ",
              description: "현재 unit과 graph상 연결된 원 input span입니다.",
            },
            {
              term: "Effective RF",
              description:
                "연결 범위 중 실제 output에 의미 있게 기여한 영향 분포입니다.",
            },
            {
              term: "Dilation",
              description:
                "Tap 수는 유지하고 tap 사이 input 간격을 벌리는 geometry입니다.",
            },
          ]}
        />
        <ReceptiveFieldViz />
        <ContentBoundary article="cnn-receptive-fields" />
      </section>
      <section id="theoretical" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Layer의 stride는 jump를 늘리고 kernel span은 이전 jump만큼 receptive
          field를 넓힙니다
        </h2>
        <ExplainedFormula
          question="여러 convolution을 쌓았을 때 input span을 어떻게 누적하나요?"
          idea={
            <p>
              먼저 이전 layer unit 간 input 간격 j를 stride로 확대합니다. 그
              다음 현재 kernel의 첫 tap과 마지막 tap 사이 간격을 이전 jump
              단위로 receptive field에 더합니다.
            </p>
          }
          formula={String.raw`j_l=j_{l-1}s_l,\quad r_l=r_{l-1}+(k_l-1)d_lj_{l-1}`}
          annotatedFormula={String.raw`\begin{aligned}j_l&=\underbrace{j_{l-1}s_l}_{\text{stride가 다음 unit 사이 input 간격을 확대}}\\\Delta r_l&=\underbrace{(k_l-1)d_lj_{l-1}}_{\text{첫 tap과 마지막 tap 사이 input span 추가}}\\r_l&=\underbrace{r_{l-1}+\Delta r_l}_{\text{기존 범위와 현재 layer 확장을 결합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`j_{l-1}s_l`,
              annotation: [
                "이전 input 간격에 stride를 곱해",
                "현재 layer jump 계산",
              ],
            },
            {
              expression: String.raw`(k_l-1)d_lj_{l-1}`,
              annotation: ["kernel tap 간 span을", "원 input 좌표 단위로 변환"],
            },
            {
              expression: String.raw`r_{l-1}+\Delta r_l`,
              annotation: ["이전 연결 범위에", "현재 layer 확장량을 더함"],
            },
          ]}
          terms={[
            {
              symbol: "j_l",
              name: "Input jump",
              description:
                "현재 layer 이웃 unit 사이의 원 input 좌표 간격입니다.",
            },
            {
              symbol: "r_l",
              name: "Theoretical receptive field",
              description: "현재 unit이 graph상 연결된 input span입니다.",
            },
            {
              symbol: "k_l,s_l,d_l",
              name: "Kernel·stride·dilation",
              description: "현재 layer의 tap 수, 이동 간격, tap 간격입니다.",
            },
          ]}
          assumptions={[
            "한 축의 regular grid와 연속된 layer path를 계산합니다.",
            "Branch·asymmetric padding은 path별 좌표 범위를 추가 추적합니다.",
          ]}
          interpretation="Stride 1, dilation 1인 3×3 세 층은 한 축에서 3→5→7로 늘어납니다."
        />
      </section>
      <section id="effective" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Effective field는 graph가 아니라 특정 output의 실제 sensitivity로
          측정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Output scalar y를 고르고 input pixel별 <code>|∂y/∂xᵢⱼ|</code>{" "}
            heatmap 또는 pixel perturbation을 계산합니다.
            Sample·checkpoint·output class·nonlinearity에 따라 달라지므로 여러
            image와 위치에서 distribution으로 보고합니다.
          </p>
        </div>
        <div id="paper-effective-receptive-field" className="not-prose mt-8">
          <CitationBlock
            source="Luo et al. — Understanding the Effective Receptive Field"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1701.04128"
          >
            Theoretical 범위와 실제 영향 분포의 차이를 분석합니다. 특정 실험의
            Gaussian-like 관찰을 모든 trained CNN의 고정 법칙으로 일반화하지
            않습니다.
          </CitationBlock>
        </div>
      </section>
      <section id="dilation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Dilation은 span을 넓히지만 중간 좌표를 모두 읽는 dense kernel은
          아닙니다
        </h2>
        <TermBreakdown
          title="k=3, dilation=2의 형태"
          items={[
            {
              term: "Tap count",
              description: "학습하는 한 축 tap은 여전히 3개입니다.",
            },
            { term: "Effective span", description: "2×(3−1)+1=5칸입니다." },
            {
              term: "Read coordinates",
              description:
                "예를 들어 0·2·4를 읽고 1·3은 이 layer에서 건너뜁니다.",
            },
            {
              term: "Gridding boundary",
              description:
                "여러 layer의 dilation pattern이 겹치지 않으면 촘촘한 local evidence가 빠질 수 있습니다.",
            },
          ]}
        />
        <div id="paper-dilated-convolution" className="not-prose mt-8">
          <CitationBlock
            source="Yu & Koltun — Dilated Convolutions"
            citeKey={2}
            type="paper"
            href="https://arxiv.org/abs/1511.07122"
          >
            Dense prediction에서 resolution을 즉시 낮추지 않고 multi-scale
            context를 모은 근거입니다. Dilation이 모든
            aliasing·gridding·boundary 문제를 해결한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
