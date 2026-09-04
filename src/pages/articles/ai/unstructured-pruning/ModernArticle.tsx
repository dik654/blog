import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { UnstructuredPruningViz } from "../pruning/viz/ModernPruningViz";

export default function UnstructuredPruningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Unstructured pruning은 weight를 개별 좌표에서 고르는 방법입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            행렬의 shape는 그대로 두고 임의의 weight를 제거하므로 같은
            sparsity에서 선택 자유도가 큽니다. 대신 남은 값의 위치를 알려 주는
            index와 irregular access 비용이 생깁니다.
          </p>
        </div>
        <TermBreakdown
          title="선택과 저장을 섞지 않고 한 줄씩"
          items={[
            {
              term: "Magnitude score",
              description: "현재 |w|가 작은 연결을 먼저 제거합니다.",
              example: "|.01|은 |.8|보다 먼저 제거 후보가 됩니다.",
              boundary: "Layer scale과 task adaptation을 보지 않습니다.",
            },
            {
              term: "Movement score",
              description:
                "Fine-tuning 중 task gradient가 weight를 어느 방향으로 움직이는지 봅니다.",
              example:
                "0에서 멀어지는 연결은 작은 값이어도 보호할 수 있습니다.",
              boundary:
                "한 step 직관과 실제 mask-training schedule을 구분합니다.",
            },
            {
              term: "Sparse payload",
              description:
                "남은 value와 위치 index·구조 metadata의 묶음입니다.",
              example: "CSR은 value·column index·row pointer를 둡니다.",
              boundary: "Format마다 손익분기가 다릅니다.",
            },
          ]}
        />
        <UnstructuredPruningViz />
        <ContentBoundary article="unstructured-pruning" />
      </section>
      <section id="storage-break-even" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          0을 생략한 대신 주소표를 저장한다는 비용부터 계산합니다
        </h2>
        <ExplainedFormula
          question="Sparse payload가 dense보다 작아지는 density는 어떻게 구하나요?"
          idea={
            <p>
              남은 원소 수에 value와 index byte를 곱하고 metadata를 더한 뒤
              dense value byte와 비교합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}B_d&=Nb_v\\B_s&=\rho N(b_v+b_i)+B_m\\B_s&<B_d\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}B_d&=\underbrace{N b_v}_{\text{모든 자리의 value 저장}}\\K&=\underbrace{\rho N}_{\text{density로 남은 수 계산}}\\B_p&=\underbrace{K(b_v+b_i)}_{\text{value와 index 저장}}\\B_s&=\underbrace{B_p+B_m}_{\text{구조 metadata까지 합산}}\\\rho&<\underbrace{\frac{b_v-B_m/N}{b_v+b_i}}_{\text{저장 임계 density}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`Nb_v`,
              annotation: [
                "전체 원소 수와 value byte를 곱해",
                "dense 기준량 계산",
              ],
            },
            {
              expression: String.raw`\rho N`,
              annotation: ["density와 전체 수를 곱해", "남은 value 개수 계산"],
            },
            {
              expression: String.raw`K(b_v+b_i)+B_m`,
              annotation: [
                "value와 주소 비용을 반복하고",
                "공통 metadata를 추가",
              ],
            },
            {
              expression: String.raw`B_s<B_d`,
              annotation: [
                "두 payload를 같은 byte로 비교해",
                "실제 저장 이득 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "N",
              name: "Dense 원소 수",
              description: "원래 tensor의 자리 수입니다.",
            },
            {
              symbol: String.raw`\rho`,
              name: "Density",
              description: "남긴 weight 비율입니다.",
            },
            {
              symbol: String.raw`b_v,b_i`,
              name: "Value·index bytes",
              description: "남은 값과 위치 하나의 byte 수입니다.",
            },
            {
              symbol: String.raw`B_m`,
              name: "Metadata bytes",
              description: "Pointer·block descriptor·alignment 비용입니다.",
            },
          ]}
          assumptions={[
            "Value마다 index 하나를 두는 단순 근사입니다.",
            "Allocator·compression·workspace는 별도 측정합니다.",
            "작은 payload가 낮은 latency를 보장하지 않습니다.",
          ]}
          interpretation="FP16 value 2 byte, 32-bit index 4 byte, metadata 0이면 ρ<1/3, 즉 sparsity>66.7%에서만 value+index가 dense보다 작습니다."
        />
      </section>
      <section id="movement-score" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          현재 크기 대신 task를 배우며 움직이는 방향을 봅니다
        </h2>
        <ExplainedFormula
          question="왜 gradient와 weight를 곱하나요?"
          idea={
            <p>
              weight를 mask로 약하게 만들 때 task loss가 변하는 1차 방향을 얻기 위해 현재 값과 local gradient를 결합합니다.
            </p>
          }
          formula={String.raw`g_i^{(t)}=\partial\mathcal L^{(t)}/\partial w_i^{(t)},\quad S_i\propto-\sum_t g_i^{(t)}w_i^{(t)}`}
          annotatedFormula={String.raw`\begin{aligned}g_i^{(t)}&=\underbrace{\frac{\partial\mathcal L^{(t)}}{\partial w_i^{(t)}}}_{\text{weight 변화에 대한 task-loss 방향}}\\m_i^{(t)}&=\underbrace{-g_i^{(t)}w_i^{(t)}}_{\text{0에서 멀어지는지 1차로 판정}}\\S_i&=\underbrace{\sum_t m_i^{(t)}}_{\text{여러 fine-tuning step의 신호 누적}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\partial\mathcal L/\partial w`,
              annotation: ["weight를 조금 바꿔", "task loss의 local 방향 측정"],
            },
            {
              expression: String.raw`-gw`,
              annotation: [
                "gradient와 현재 weight를 결합해",
                "0에서의 movement 방향 판정",
              ],
            },
            {
              expression: String.raw`\sum_t m_i^{(t)}`,
              annotation: [
                "한 step 신호를 시간에 따라 더해",
                "fine-tuning trajectory 요약",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathcal L`,
              name: "Task loss",
              description: "Downstream fine-tuning objective입니다.",
            },
            {
              symbol: "g",
              name: "Weight gradient",
              description: "현재 step의 local loss 방향입니다.",
            },
            {
              symbol: "S",
              name: "Movement score",
              description: "Mask 선택에 쓰는 누적 신호입니다.",
            },
          ]}
          assumptions={[
            "실제 방법은 mask parameter·threshold schedule을 포함합니다.",
            "Data와 optimizer path가 달라지면 score도 달라집니다.",
            "Score는 sparse runtime 성능을 예측하지 않습니다.",
          ]}
          interpretation="w=.1,g=-2이면 -gw=.2로 0에서 멀어지는 신호이고, g=2이면 -.2로 0 쪽 신호입니다."
        />
      </section>
      <section id="paper-movement-pruning" className="scroll-mt-20">
        <CitationBlock
          source="Movement Pruning"
          citeKey={1}
          href="https://arxiv.org/abs/2005.07683"
        >
          <strong>문제:</strong> magnitude가 downstream adaptation을 놓침.{" "}
          <strong>기여:</strong> task loss와 mask score를 함께 학습.{" "}
          <strong>전제:</strong> 논문의 BERT·task·schedule.{" "}
          <strong>근거 범위:</strong> 해당 sparsity와 평가.{" "}
          <strong>과장 금지:</strong> 모든 model과 runtime의 보편 비율이
          아닙니다.
        </CitationBlock>
      </section>
    </div>
  );
}
