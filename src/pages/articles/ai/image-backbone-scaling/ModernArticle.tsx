import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ImageBackboneViz } from "../image-classification-pipeline/viz/ModernImageClassificationViz";

export default function ImageBackboneScalingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Backbone은 image를 reusable representation으로 바꾸는 model body입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Classifier는 보통 <strong>backbone</strong>과 classifier head로
            나뉩니다. Backbone은 pixels를 feature map이나 token sequence로
            바꾸고, head는 그 representation을 class logits로 투영합니다. 따라서
            backbone 선택은 유명한 이름을 고르는 일이 아니라 어떤 spatial
            interaction과 resource path를 살 것인지 고르는 일입니다.
          </p>
          <p>
            CNN의 local convolution은 가까운 pattern과 translation structure를
            반복 사용합니다. ViT는 patches를 tokens로 만들어 넓은 관계를
            attention으로 계산합니다. ViT 내부 shape는{" "}
            <Link to="/ai/vision-transformer">Vision Transformer 정본</Link>
            에서, 여기서는 resolution이 두 family의 비용을 어떻게 바꾸는지
            비교합니다.
          </p>
        </div>
        <TermBreakdown
          title="Backbone 후보를 읽는 네 축"
          items={[
            {
              term: "Spatial prior",
              description:
                "Local convolution·window·global attention처럼 위치 관계를 섞는 구조적 규칙입니다.",
            },
            {
              term: "Pretrained handoff",
              description:
                "Weight와 architecture config·input transform·label head 호환성을 함께 넘기는 계약입니다.",
            },
            {
              term: "Scaling knobs",
              description:
                "Depth·channel width·input resolution·patch size처럼 capacity와 비용을 바꾸는 축입니다.",
            },
            {
              term: "Runtime frontier",
              description:
                "Target hardware에서 quality와 latency·throughput·memory가 더 이상 함께 좋아지지 않는 후보 경계입니다.",
            },
          ]}
        />
        <ImageBackboneViz />
        <ContentBoundary article="image-backbone-scaling" />
      </section>

      <section id="resolution-cost" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Resolution을 두 배로 키우면 pixel은 4배, global token pairs는 16배가
          됩니다
        </h2>
        <ExplainedFormula
          question="정사각 image의 한 변 r을 두 배로 키울 때 CNN area와 ViT attention pair 수는 어떻게 달라지나요?"
          idea={
            <p>
              Patch 한 변 P가 고정이면 한 축 patch 수는 r/P, 전체 token 수는 그
              제곱입니다. Global attention은 모든 token 쌍을 비교합니다.
            </p>
          }
          formula={String.raw`N=(r/P)^2,\quad C_{\rm pair}=N^2`}
          annotatedFormula={String.raw`\begin{aligned}n_{\rm axis}&=\underbrace{r/P}_{\substack{\text{image 한 축을 patch 폭으로 나눠}\\\text{축별 patch 수 계산}}}\\[4pt]N&=\underbrace{n_{\rm axis}^2}_{\substack{\text{높이와 너비 위치를 곱해}\\\text{전체 token 수 계산}}}\\[4pt]C_{\rm CNN}&\propto\underbrace{r^2}_{\text{pixel area에 비례}}\\[4pt]C_{\rm pair}&\propto\underbrace{N^2}_{\substack{\text{모든 query-key 쌍을 만들어}\\\text{global interaction 계산}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`r/P`,
              annotation: [
                "image 길이를 patch 폭으로 나눠",
                "한 축 token 위치를 구함",
              ],
            },
            {
              expression: String.raw`n_{\rm axis}^2`,
              annotation: [
                "두 spatial 축의 위치 수를 곱해",
                "전체 patch tokens를 구함",
              ],
            },
            {
              expression: String.raw`r^2`,
              annotation: [
                "높이와 너비를 곱해",
                "CNN이 훑는 spatial area를 구함",
              ],
            },
            {
              expression: String.raw`N^2`,
              annotation: [
                "query 수와 key 수를 곱해",
                "global attention pair 수를 구함",
              ],
            },
          ]}
          terms={[
            {
              symbol: "r",
              name: "Input side",
              description:
                "정사각형으로 단순화한 input 한 변의 pixel 수입니다.",
            },
            {
              symbol: "P",
              name: "Patch side",
              description:
                "ViT token 하나가 묶는 patch 한 변의 pixel 수입니다.",
            },
            {
              symbol: "N",
              name: "Patch tokens",
              description: "Special token을 제외한 image patch 위치 수입니다.",
            },
            {
              symbol: String.raw`C_{\rm pair}`,
              name: "Pair count",
              description:
                "Global attention score matrix의 entry 수에 비례하는 항입니다.",
            },
          ]}
          assumptions={[
            "Patch size와 layer width·depth는 고정합니다.",
            "Global attention 지배항만 비교하며 local/window attention은 다릅니다.",
            "FLOPs는 latency가 아니므로 memory traffic과 kernel을 target runtime에서 측정합니다.",
          ]}
          interpretation="P=16에서 224px는 14×14=196 tokens, 448px는 28×28=784 tokens입니다. Token은 4배지만 pair entries는 38,416→614,656으로 16배입니다."
        />
      </section>

      <section id="compound-scaling" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Compound scaling은 depth·width·resolution을 한 resource 단계로
          묶습니다
        </h2>
        <ExplainedFormula
          question="EfficientNet의 compound coefficient는 세 capacity 축을 어떻게 함께 움직이나요?"
          idea={
            <p>
              공통 단계가 하나 증가할 때 depth·width·resolution을 미리 탐색한 비율로 각각 늘리고 convolutional compute가 대략 두 배가 되도록 비율을
              제한합니다.
            </p>
          }
          formula={String.raw`d=\alpha^\phi,\ w=\beta^\phi,\ r=\gamma^\phi`}
          annotatedFormula={String.raw`\begin{aligned}d&=\underbrace{\alpha^\phi}_{\text{block depth를 단계별 확대}}\\[3pt]w&=\underbrace{\beta^\phi}_{\text{channel width를 단계별 확대}}\\[3pt]r&=\underbrace{\gamma^\phi}_{\text{input resolution을 단계별 확대}}\\[3pt]2&\approx\underbrace{\alpha\beta^2\gamma^2}_{\substack{\text{세 증가율의 compute 효과를 묶어}\\\text{한 단계 budget을 제한}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\alpha^\phi`,
              annotation: [
                "depth 비율을 단계 수만큼 누적해",
                "network 반복 수를 키움",
              ],
            },
            {
              expression: String.raw`\beta^\phi`,
              annotation: [
                "width 비율을 단계 수만큼 누적해",
                "channel capacity를 키움",
              ],
            },
            {
              expression: String.raw`\gamma^\phi`,
              annotation: [
                "resolution 비율을 누적해",
                "spatial evidence를 늘림",
              ],
            },
            {
              expression: String.raw`\alpha\beta^2\gamma^2`,
              annotation: ["세 축의 cost 효과를 곱해", "단계별 compute를 근사"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\phi`,
              name: "Compound step",
              description: "Model family의 전체 resource scale 단계입니다.",
            },
            {
              symbol: String.raw`\alpha`,
              name: "Depth ratio",
              description: "한 단계마다 depth를 늘리는 비율입니다.",
            },
            {
              symbol: String.raw`\beta`,
              name: "Width ratio",
              description: "한 단계마다 channel width를 늘리는 비율입니다.",
            },
            {
              symbol: String.raw`\gamma`,
              name: "Resolution ratio",
              description: "한 단계마다 input side를 늘리는 비율입니다.",
            },
          ]}
          assumptions={[
            "원 논문의 convolutional cost 근사와 baseline search를 전제로 합니다.",
            "비율은 architecture·dataset·accelerator를 바꾸면 다시 검증합니다.",
            "Pretrained checkpoint가 해당 scale과 input contract를 지원해야 합니다.",
          ]}
          interpretation="세 축을 균형 있게 키운다는 설계 heuristic입니다. 식의 비율만 보고 target GPU에서 가장 빠른 model을 고를 수는 없습니다."
        />
      </section>

      <section id="budget-comparison" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          최종 backbone은 같은 evidence와 target runtime의 Pareto frontier에서
          고릅니다
        </h2>
        <TermBreakdown
          title="후보별로 같은 열에 놓을 값"
          items={[
            {
              term: "Quality",
              description:
                "Macro recall·NLL·중요 slice와 seed별 uncertainty를 같은 split에서 계산합니다.",
            },
            {
              term: "Latency",
              description:
                "Target batch·precision·warmup·concurrency에서 p50·p95를 측정합니다.",
            },
            {
              term: "Capacity",
              description:
                "Throughput·peak device memory·model artifact size를 함께 기록합니다.",
            },
            {
              term: "Provenance",
              description:
                "Pretraining data scope, weight revision, license와 input transform을 보존합니다.",
            },
          ]}
        />
        <div id="paper-efficientnet" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Tan & Le — EfficientNet"
            href="https://proceedings.mlr.press/v97/tan19a.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Fixed resource에서 ConvNet
                depth·width·resolution을 어떻게 늘릴지 정합니다.
              </p>
              <p>
                <strong>기여.</strong> 세 축을 compound coefficient로 함께
                조절하는 scaling method를 제시합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 NAS baseline·ImageNet·transfer
                benchmark와 compute 근사를 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Scaling ablation과
                accuracy–efficiency 비교 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 논문의 constants와 model 순위가
                모든 target runtime에서 최적이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <div id="paper-convnext" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Liu et al. — ConvNeXt"
            href="https://openaccess.thecvf.com/content/CVPR2022/html/Liu_A_ConvNet_for_the_2020s_CVPR_2022_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Transformer 시대의 training·architecture
                선택으로 standard ConvNet을 재검토합니다.
              </p>
              <p>
                <strong>기여.</strong> ResNet에서 여러 recipe와 block 선택을
                단계적으로 바꾼 ConvNeXt family를 제시합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 pretraining·downstream
                task·accelerator 조건입니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Cumulative modernization ablation과
                benchmark 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 한 block 변경이 모든 CNN 우위를
                만든다는 단일 원인 주장이 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <div id="paper-vit" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={3}
            source="Dosovitskiy et al. — Vision Transformer"
            href="https://openreview.net/forum?id=YicbFdNTTy"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Image patches에 표준 Transformer
                encoder를 적용할 수 있는지 검증합니다.
              </p>
              <p>
                <strong>기여.</strong> Patch projection과 large-scale
                pretraining 뒤 transfer하는 vision architecture를 제시합니다.
              </p>
              <p>
                <strong>가정.</strong> 원 논문의 대규모 data·compute·fine-tuning
                recipe입니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Image classification transfer와
                scaling 관찰 범위입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 작은 target dataset의 scratch
                ViT가 항상 CNN보다 우월하다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
