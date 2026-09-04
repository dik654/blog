import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { StructuredPruningViz } from "../pruning/viz/ModernPruningViz";
import CompressionTaxonomy from "./CompressionTaxonomy";
import PruningGranularity from "./PruningGranularity";
import SparseKernelExecution from "./SparseKernelExecution";

export default function StructuredPruningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Structured pruning은 계산 graph의 dimension을 실제로 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            channel 하나를 제거하면 현재 layer의 output과 다음 layer의 input이 함께 줄어 더 작은 dense matrix가 됩니다. N:M이 거는 계약은 이와
            별개입니다. shape는 그대로 두고 local group의 pattern만 hardware가 읽을 수 있게 제한합니다.
          </p>
        </div>
        <TermBreakdown
          title="서로 다른 두 구조"
          items={[
            {
              term: "Channel pruning",
              description: "Output dimension 전체를 제거합니다.",
              example: "W1의 열과 W2의 대응 행을 함께 줄입니다.",
              boundary: "Residual·norm·projection dependency를 함께 고칩니다.",
            },
            {
              term: "Head pruning",
              description: "Attention head 단위를 제거합니다.",
              example: "Head output과 output projection slice를 함께 줄입니다.",
              boundary:
                "원래 hidden width로 다시 채우면 dense shape는 줄지 않을 수 있습니다.",
            },
            {
              term: "N:M sparsity",
              description:
                "Reduction axis의 모든 M개 group에서 N개만 남깁니다.",
              example: "2:4는 네 weight마다 두 개를 남깁니다.",
              boundary: "전체 50% arbitrary mask와 같지 않습니다.",
            },
          ]}
        />
        <StructuredPruningViz />
        <ContentBoundary article="structured-pruning" />
      </section>
      <CompressionTaxonomy />
      <section id="shape-propagation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          앞 layer의 output 축과 뒤 layer의 input 축을 같은 계약으로 줄입니다
        </h2>
        <ExplainedFormula
          question="Input·output width를 각각 75% 남기면 주된 dense 계산은 얼마나 남나요?"
          idea={
            <p>
              두 retention ratio를 곱하는 이유는 linear layer가 각 token row에 대해 모든 input과 output 조합을 계산하기 때문입니다.
            </p>
          }
          formula={String.raw`C\approx2Td_{in}d_{out},\quad C'/C\approx\alpha\beta`}
          annotatedFormula={String.raw`\begin{aligned}C&=\underbrace{2T d_{in}d_{out}}_{\text{모든 token·input·output 곱과 합}}\\d'_{in}&=\underbrace{\alpha d_{in}}_{\text{남긴 input width}}\\d'_{out}&=\underbrace{\beta d_{out}}_{\text{남긴 output width}}\\\frac{C'}{C}&=\underbrace{\alpha\beta}_{\text{두 축 축소 효과를 곱함}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`2Td_{in}d_{out}`,
              annotation: [
                "token·input·output 조합을 곱해",
                "dense arithmetic 기준량 계산",
              ],
            },
            {
              expression: String.raw`\alpha d_{in}`,
              annotation: ["input retention을 곱해", "새 입력 dimension 계산"],
            },
            {
              expression: String.raw`\alpha\beta`,
              annotation: [
                "두 dimension 감소를 결합해",
                "남은 arithmetic 비율 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Token rows",
              description: "Batch×sequence row 수입니다.",
            },
            {
              symbol: String.raw`d_{in},d_{out}`,
              name: "Input·output widths",
              description: "Weight matrix의 두 dimension입니다.",
            },
            {
              symbol: String.raw`\alpha,\beta`,
              name: "Retention ratios",
              description: "각 축에서 남긴 비율입니다.",
            },
          ]}
          assumptions={[
            "Graph dependency를 실제로 제거했습니다.",
            "Bias·memory·launch는 제외한 arithmetic 근사입니다.",
            "Alignment와 occupancy 때문에 latency 비율은 다를 수 있습니다.",
          ]}
          interpretation=".75×.75=.5625이므로 주된 arithmetic은 56.25%가 남습니다. 이는 latency가 정확히 43.75% 줄었다는 뜻이 아닙니다."
        />
      </section>
      <section id="nm-pattern" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          N:M은 전체 비율이 아니라 모든 local group의 규칙입니다
        </h2>
        <ExplainedFormula
          question="왜 [1110|1000]은 전체 50%인데 2:4가 아닌가요?"
          idea={
            <p>
              전체 mask를 세지 않고 reduction axis의 각 네 자리 묶음을
              독립적으로 검사합니다.
            </p>
          }
          formula={String.raw`\forall g\in\mathcal G_M:\ \sum_{i\in g}M_i=N`}
          annotatedFormula={String.raw`\begin{aligned}\mathcal G_M&=\underbrace{\operatorname{groups}(M,\text{axis},M)}_{\text{kernel 축에서 local 묶음 생성}}\\k_g&=\underbrace{\sum_{i\in g}M_i}_{\text{각 묶음의 남은 weight 수}}\\\text{eligible}&=\underbrace{\bigwedge_{g\in\mathcal G_M}[k_g=N]}_{\text{모든 묶음이 규칙을 만족해야 승인}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{groups}(M,\text{axis},M)`,
              annotation: [
                "mask를 kernel reduction 축에서 나눠",
                "검사할 local groups 생성",
              ],
            },
            {
              expression: String.raw`\sum_{i\in g}M_i`,
              annotation: ["각 group의 1을 더해", "남은 수 계산"],
            },
            {
              expression: String.raw`\bigwedge_g[k_g=N]`,
              annotation: [
                "모든 group 판정을 AND로 묶어",
                "전체 eligibility 결정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathcal G_M`,
              name: "Local groups",
              description: "정해진 축의 M개 weight 묶음입니다.",
            },
            {
              symbol: "N:M",
              name: "Pattern",
              description: "각 group에서 N개를 남긴다는 규칙입니다.",
            },
            {
              symbol: String.raw`k_g`,
              name: "Group kept count",
              description: "한 group의 mask 1 개수입니다.",
            },
          ]}
          assumptions={[
            "N을 남긴 수로 쓰는 convention입니다.",
            "Axis·layout·dtype·operator를 고정합니다.",
            "Eligibility와 chosen tactic·latency는 별도로 확인합니다.",
          ]}
          interpretation="[1100|1010]은 각 group이 2개를 남겨 적격입니다. [1110|1000]은 3개와 1개라 전체 density .5여도 부적격입니다."
        />
      </section>
      <PruningGranularity />
      <SparseKernelExecution />
      <section id="paper-structured-sparsity" className="scroll-mt-20">
        <CitationBlock
          source="NVIDIA TensorRT · Structured Sparsity"
          citeKey={5}
          href="https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/advanced.html#structured-sparsity"
        >
          <strong>문제:</strong> 2:4 weight를 지원 tactic으로 실행함.{" "}
          <strong>기여:</strong> 대상 layer·axis·precision·builder 조건을
          문서화. <strong>전제:</strong> 해당 TensorRT와 GPU.{" "}
          <strong>근거 범위:</strong> eligibility와 tactic selection.{" "}
          <strong>과장 금지:</strong> 적격 layer가 항상 sparse tactic을
          선택한다는 뜻은 아닙니다.
        </CitationBlock>
      </section>
    </div>
  );
}
