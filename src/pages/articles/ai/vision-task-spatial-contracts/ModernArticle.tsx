import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { VisionTaskViz } from "../cnn/viz/ModernCnnViz";

export default function VisionTaskArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Vision task는 image에서 무엇을 답해야 하는지에 따라 보존할 공간 축이
          달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사진 전체에 이름 하나를 붙이는 classification과 모든 pixel에 label을
            붙이는 segmentation은 같은 feature를 요구하지 않습니다. 먼저
            prediction unit과 output tensor를 정하고, 그 답을 만들 수 있도록
            backbone의 output stride·receptive field·boundary detail을
            선택합니다.
          </p>
        </div>
        <TermBreakdown
          title="Task별 답의 단위"
          items={[
            {
              term: "Classification",
              description: "Image 하나에 class distribution 하나를 냅니다.",
            },
            {
              term: "Detection",
              description: "Object마다 class와 box 좌표를 냅니다.",
            },
            {
              term: "Segmentation",
              description: "Pixel마다 class 또는 mask membership을 냅니다.",
            },
            {
              term: "Restoration",
              description:
                "Output image의 color·texture·geometry를 원 좌표에 맞춰 복원합니다.",
            },
          ]}
        />
        <VisionTaskViz />
        <ContentBoundary article="vision-task-spatial-contracts" />
      </section>
      <section id="output-shapes" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Prediction unit을 먼저 고르면 head의 output axis가 결정됩니다
        </h2>
        <ExplainedFormula
          question="같은 feature tensor가 task별로 어떤 output shape가 되나요?"
          idea={
            <p>
              Classification은 spatial axis를 모으고 class axis만 남깁니다.
              Detection은 선택한 object 수 K에 class·box를 붙이고,
              segmentation은 H·W grid에 class axis를 유지합니다.
            </p>
          }
          formula={String.raw`F\in\mathbb R^{B\times C\times H\times W}\longrightarrow Y_{task}`}
          annotatedFormula={String.raw`\begin{aligned}Y_{cls}&\in\underbrace{\mathbb R^{B\times C_{cls}}}_{\text{image마다 class score 하나}}\\Y_{det}&\in\underbrace{\mathbb R^{B\times K\times(C_{cls}+4)}}_{\text{object마다 class와 box 좌표}}\\Y_{seg}&\in\underbrace{\mathbb R^{B\times C_{cls}\times H_o\times W_o}}_{\text{output pixel마다 class score}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`B\times C_{cls}`,
              annotation: [
                "spatial feature를 집계해",
                "image-level class axis만 남김",
              ],
            },
            {
              expression: String.raw`B\times K\times(C_{cls}+4)`,
              annotation: ["선택한 object마다", "class와 네 box 좌표를 결합"],
            },
            {
              expression: String.raw`B\times C_{cls}\times H_o\times W_o`,
              annotation: [
                "output spatial grid를 유지해",
                "pixel별 class score 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "B",
              name: "Batch",
              description: "동시에 처리하는 image 수입니다.",
            },
            {
              symbol: "K",
              name: "Object slots",
              description:
                "Detection head가 보존하거나 선택한 candidate 수입니다.",
            },
            {
              symbol: "H_o,W_o",
              name: "Output grid",
              description:
                "Segmentation label과 대응할 spatial resolution입니다.",
            },
          ]}
          assumptions={[
            "구현별 anchor·query·mask representation은 다를 수 있습니다.",
            "Output shape만으로 label geometry와 metric이 완성되지는 않습니다.",
          ]}
          interpretation="Task head는 이름이 아니라 prediction unit과 output coordinate contract로 선택합니다."
        />
      </section>
      <section id="preservation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Downsampling으로 지운 작은 물체와 경계는 head가 저절로 복원하지
          못합니다
        </h2>
        <TermBreakdown
          title="보존해야 할 spatial evidence"
          items={[
            {
              term: "Output stride",
              description:
                "한 feature cell이 input에서 몇 pixel 간격인지 나타냅니다.",
            },
            {
              term: "Multi-scale feature",
              description:
                "작은 object의 detail과 큰 object의 context를 서로 다른 resolution에서 보존합니다.",
            },
            {
              term: "Skip path",
              description:
                "Encoder의 높은-resolution feature를 decoder에 직접 전달합니다.",
            },
            {
              term: "Coordinate receipt",
              description:
                "Resize·crop·padding·augmentation과 label 변환을 같은 frame으로 기록합니다.",
            },
          ]}
        />
      </section>
      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Classification accuracy 하나가 다른 spatial task의 release evidence가
          되지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Detection은 object size별 AP와 box error, segmentation은 IoU와
            boundary slice, restoration은 distortion·perceptual metric과 failure
            image를 봅니다. Input resolution·latency·activation
            memory·pretraining·head budget을 맞춘 paired evaluation 뒤에만
            backbone을 채택합니다.
          </p>
        </div>
        <div id="paper-fcn" className="not-prose mt-8">
          <CitationBlock
            source="Long et al. — Fully Convolutional Networks"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1411.4038"
          >
            Classification network의 coarse semantic feature를 dense
            prediction으로 바꾸고 skip architecture로 detail을 결합합니다. 모든
            modern segmentation head나 다른 task의 metric을 대신 규정하지
            않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
