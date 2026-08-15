import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { OneShotLlmPruningViz } from "../pruning/viz/ModernPruningViz";

export default function OneShotLlmPruningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          One-shot LLM pruning은 작은 prompt 표본으로 layer의 중요도를
          추정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            모든 원본 training data와 장기 retraining 없이 calibration
            prompt에서 layer input을 수집해 mask를 정합니다. 따라서 algorithm
            이름보다 먼저 표본이 deployment 언어·길이·domain을 대표하는지
            확인해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="표본에서 mask까지 필요한 물체"
          items={[
            {
              term: "Calibration prompts",
              description: "Importance 계산에 쓰는 작은 input 집합입니다.",
              example: "한국어·영어·code·long prompt slice를 둡니다.",
              boundary: "최종 test와 분리하고 tokenizer·packing을 기록합니다.",
            },
            {
              term: "Layer input X",
              description:
                "Prompt가 특정 linear layer에 도달했을 때의 activation입니다.",
              example:
                "X의 column norm은 input channel 사용 강도를 요약합니다.",
              boundary: "다른 traffic에서는 X 분포가 달라질 수 있습니다.",
            },
            {
              term: "One-shot mask",
              description:
                "긴 retraining 없이 한 번의 calibration pass로 만든 mask입니다.",
              example: "각 output row에서 score가 낮은 weight를 제거합니다.",
              boundary: "Quality와 runtime release는 별도입니다.",
            },
          ]}
        />
        <OneShotLlmPruningViz />
        <ContentBoundary article="one-shot-llm-pruning" />
      </section>
      <section id="calibration" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Activation은 “작은 weight가 실제 output에 얼마나 쓰이는가”를 바꿉니다
        </h2>
        <ExplainedFormula
          question="Wanda가 왜 |w|에 input norm을 곱하나요?"
          idea={
            <p>
              같은 weight라도 자주 크고 강하게 들어오는 input channel에 연결되면
              layer output에 더 큰 영향을 줄 수 있기 때문입니다.
            </p>
          }
          formula={String.raw`S_{ij}=|W_{ij}|\,\lVert X_{:,j}\rVert_2`}
          annotatedFormula={String.raw`\begin{aligned}a_j&=\underbrace{\sqrt{\sum_t X_{t,j}^2}}_{\text{calibration에서 input channel 세기 요약}}\\m_{ij}&=\underbrace{|W_{ij}|}_{\text{연결 자체의 크기}}\\S_{ij}&=\underbrace{m_{ij}a_j}_{\text{크기와 실제 사용 강도를 결합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_t X_{t,j}^2`,
              annotation: [
                "token별 activation 제곱을 더해",
                "channel 사용량 누적",
              ],
            },
            {
              expression: String.raw`\sqrt{\sum_t X_{t,j}^2}`,
              annotation: ["제곱합의 제곱근으로", "L2 scale 복원"],
            },
            {
              expression: String.raw`|W_{ij}|a_j`,
              annotation: [
                "weight 크기와 input 세기를 곱해",
                "output 영향 proxy 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`W_{ij}`,
              name: "Weight",
              description: "Output i와 input channel j의 연결입니다.",
            },
            {
              symbol: String.raw`X_{:,j}`,
              name: "Input column",
              description: "Calibration tokens에서 channel j activation입니다.",
            },
            {
              symbol: String.raw`S_{ij}`,
              name: "Wanda score",
              description: "Per-output 선택에 쓰는 중요도입니다.",
            },
          ]}
          assumptions={[
            "Activation collection recipe를 고정합니다.",
            "Score는 second-order compensation을 수행하지 않습니다.",
            "Sparse format과 runtime speedup을 자동 제공하지 않습니다.",
          ]}
          interpretation="|w|=.2인 두 연결의 input norm이 1과 10이면 score는 .2와 2입니다. Magnitude는 동률이지만 Wanda는 두 번째를 보호합니다."
        />
      </section>
      <section id="reconstruction" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          SparseGPT는 지운 뒤 남은 weight를 조정해 원래 layer output에 맞춥니다
        </h2>
        <ExplainedFormula
          question="왜 weight 차이 E만 보지 않고 X를 곱한 output error를 보나요?"
          idea={
            <p>
              실제 layer가 만드는 답은 XW이므로 calibration input이 거의 쓰지
              않는 방향의 weight error와 자주 쓰는 방향의 error를 다르게
              평가합니다.
            </p>
          }
          formula={String.raw`E=W-\widetilde W,\quad R=XW-X\widetilde W=XE,\quad \min\lVert R\rVert_F^2`}
          annotatedFormula={String.raw`\begin{aligned}E&=\underbrace{W-\widetilde W}_{\text{pruning·보정 뒤 weight 차이}}\\R&=\underbrace{XW-X\widetilde W}_{\text{같은 input에서 두 layer output 비교}}\\R&=\underbrace{XE}_{\text{weight error를 실제 input 방향으로 투영}}\\\mathcal J&=\underbrace{\lVert R\rVert_F^2}_{\text{모든 calibration output 오차 합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`W-\widetilde W`,
              annotation: ["원래 weight에서 후보를 빼", "weight error 생성"],
            },
            {
              expression: String.raw`XE`,
              annotation: [
                "weight error에 실제 layer input을 곱해",
                "output에 보이는 오차로 변환",
              ],
            },
            {
              expression: String.raw`\lVert R\rVert_F^2`,
              annotation: [
                "모든 output error를 제곱해 더해",
                "보정 objective 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "X",
              name: "Calibration layer input",
              description: "Prompt에서 수집한 activation matrix입니다.",
            },
            {
              symbol: String.raw`\widetilde W`,
              name: "Pruned·compensated weight",
              description: "Mask와 보정을 적용한 후보입니다.",
            },
            {
              symbol: "R",
              name: "Output residual",
              description: "원래와 후보 layer output 차이입니다.",
            },
          ]}
          assumptions={[
            "Layer-local reconstruction proxy입니다.",
            "Approximate second-order update의 전체 세부를 이 식 하나가 대신하지 않습니다.",
            "Generation quality와 runtime은 held-out에서 확인합니다.",
          ]}
          interpretation="같은 weight error norm이어도 X가 크게 투영하는 channel의 error가 R을 더 크게 만듭니다. 그래서 calibration coverage가 method 결과를 바꿉니다."
        />
      </section>
      <section id="papers" className="scroll-mt-20 space-y-6">
        <div id="paper-sparsegpt">
          <CitationBlock
            source="SparseGPT"
            citeKey={1}
            href="https://arxiv.org/abs/2301.00774"
          >
            <strong>문제:</strong> 대형 GPT를 retraining 없이 pruning.{" "}
            <strong>기여:</strong> layer-wise approximate second-order
            reconstruction. <strong>전제:</strong> 논문의
            checkpoints·calibration·patterns. <strong>근거 범위:</strong> 해당
            perplexity·task·time. <strong>과장 금지:</strong> 모든 LLM과
            runtime의 무손실·속도 보장이 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-wanda">
          <CitationBlock
            source="Wanda"
            citeKey={2}
            href="https://arxiv.org/abs/2306.11695"
          >
            <strong>문제:</strong> 가벼운 LLM importance score.{" "}
            <strong>기여:</strong> magnitude×activation norm의 per-output
            pruning. <strong>전제:</strong> 논문의 model·sample·grouping.{" "}
            <strong>근거 범위:</strong> 해당 quality 비교.{" "}
            <strong>과장 금지:</strong> SparseGPT와 같은 보정이나 모든 traffic
            우위를 뜻하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
