import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { EquivarianceViz } from "../cnn/viz/ModernCnnViz";
import {
  VisionFoundationLocator,
  VisionMapReturn,
} from "../shared/VisionFoundationLocator";

export default function CnnEquivarianceArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <VisionFoundationLocator
          current="equivariance"
          question="이미지 속 무늬를 한 칸 옮기면 CNN의 반응도 정확히 한 칸 옮겨지나요?"
          fixture="같은 stride-1 kernel에서 pattern 위치 x=1과 x=2를 비교하고, stride 2에서 등식이 깨지는 반례까지 추적합니다."
          parentHref="/cs/ai/cnn#shared-kernel"
          parentLabel="CNN의 shared kernel"
        />
        <h2 className="mb-6 text-2xl font-bold">
          입력을 옮기면 feature도 같은 만큼 옮겨집니다
        </h2>
        <EquivarianceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 pattern의 input 좌표와 detector peak의 output 좌표를
            표시합니다. 두 좌표가 같은 변환을 따를 때 equivariant라고 합니다.
            최종 class score가 그대로인 invariance와는 다른 주장입니다.
          </p>
        </div>
        <TermBreakdown
          title="이동 관계를 이루는 네 용어"
          items={[
            {
              term: "Translation Tₐ",
              description: "Grid를 a만큼 옮기는 좌표 변환입니다.",
            },
            {
              term: "Shared operator f",
              description: "모든 위치에서 같은 kernel을 적용합니다.",
            },
            {
              term: "Equivariance",
              description: "f(Tₐx)=Tₐf(x)라는 output 좌표 대응입니다.",
            },
            {
              term: "Invariance",
              description:
                "g(Tₐx)=g(x)처럼 최종 값이 이동에 변하지 않는 성질입니다.",
            },
          ]}
        />
        <ContentBoundary article="cnn-translation-equivariance" />
      </section>
      <section id="equivariance" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          공유한 stride-1 kernel은 이동을 output에 전달합니다
        </h2>
        <ExplainedFormula
          question="왜 같은 kernel을 공유하면 translation이 output으로 전달되나요?"
          idea={
            <p>
              이동한 input을 cross-correlation 합에 대입합니다. 합의 input
              index를 바꾸면 원래 output을 이동한 식과 같아집니다.
            </p>
          }
          formula={String.raw`f(T_a x)[p]=T_a f(x)[p]`}
          annotatedFormula={String.raw`\begin{aligned}(T_a x)[r]&=\underbrace{x[r-a]}_{\text{input pattern을 }a\text{만큼 이동}}\\f(T_a x)[p]&=\underbrace{\sum_u w[u]x[p+u-a]}_{\text{같은 shared kernel로 이동 input 계산}}\\&=\underbrace{f(x)[p-a]}_{\text{원 output을 같은 }a\text{만큼 이동}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`x[r-a]`,
              annotation: ["input 좌표를 a만큼 당겨", "pattern을 이동"],
            },
            {
              expression: String.raw`\sum_u w[u]x[p+u-a]`,
              annotation: ["위치별 새 weight 없이", "같은 kernel로 score 계산"],
            },
            {
              expression: String.raw`f(x)[p-a]`,
              annotation: ["index를 다시 묶어", "output shift와 동일함을 확인"],
            },
          ]}
          terms={[
            {
              symbol: "a",
              name: "Translation offset",
              description: "Input과 output에 비교할 grid 이동량입니다.",
            },
            {
              symbol: "w",
              name: "Shared kernel",
              description: "Output 위치 p와 무관한 local parameter입니다.",
            },
            {
              symbol: "p",
              name: "Output coordinate",
              description: "Feature map의 현재 위치입니다.",
            },
          ]}
          assumptions={[
            "무한 또는 이동과 일관된 boundary grid입니다.",
            "Stride 1이고 다른 position-dependent operator가 없습니다.",
          ]}
          interpretation="이 식은 feature가 이동한다는 equivariance이고 class score가 같다는 invariance가 아닙니다."
        />
      </section>
      <section id="counterexamples" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Stride와 경계는 한 pixel 이동 관계를 깰 수 있습니다
        </h2>
        <TermBreakdown
          title="반례를 먼저 확인"
          items={[
            {
              term: "Stride phase",
              description:
                "Stride 2에서 한 pixel 이동은 sampling 위치의 짝·홀을 바꿉니다.",
            },
            {
              term: "Finite boundary",
              description:
                "Zero padding 가까이에서는 이동 전후 실제/가상 pixel 구성이 달라집니다.",
            },
            {
              term: "Pooling",
              description:
                "Aggregation window와 sampling phase가 위치 반응을 바꿀 수 있습니다.",
            },
            {
              term: "Augmentation",
              description:
                "Shift robustness를 학습할 수 있지만 수학적 exact equivariance와 같지 않습니다.",
            },
          ]}
        />
      </section>
      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Shift test는 위치와 이동량을 나눠 측정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 image와 checkpoint에서 input을 이동하고 feature map을
            inverse-shift해 차이를 측정합니다. Center와 boundary, 1-pixel과
            stride 배수, interpolation 없는 integer shift를 따로 기록해야 어떤
            operator가 관계를 깼는지 찾을 수 있습니다.
          </p>
        </div>
        <div id="paper-shift-invariance" className="not-prose mt-8">
          <CitationBlock
            source="Zhang — Making Convolutional Networks Shift-Invariant Again"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1904.11486"
          >
            Downsampling의 aliasing과 작은 input shift에 대한 output
            instability를 분석하고 anti-aliasing을 평가합니다. 모든 shift
            robustness가 한 filter로 해결되거나 exact group equivariance가 자동
            보장된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <VisionMapReturn
          title="같은 kernel은 이동 관계를 만들지만 stride와 경계가 그 관계를 바꿀 수 있습니다."
          detail="좌표가 어떻게 옮겨지는지 확인했으므로, 다음에는 출력 하나가 원본 이미지의 어느 범위까지 연결되는지 계산합니다."
          nextHref="/cs/ai/cnn-receptive-fields"
          nextLabel="출력 하나의 입력 범위 계산"
        />
      </section>
    </div>
  );
}
