import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import AttentionContractViz from "./viz/AttentionContractViz";

export default function QKVComputation() {
  return (
    <section id="attention-boundary" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Attention 계약: Q의 위치가 어떤 K·V source를 읽을 수 있는지 mask가
        결정한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Q·K·V라는 이름보다 먼저 source와 visibility를 확인해야 합니다. Encoder
          self-attention은 보통 같은 입력의 모든 유효 위치를 읽고, decoder
          causal self-attention은 미래 key를 가립니다. Cross-attention에서는 Q가
          decoder에서 오지만 K·V는 encoder output에서 옵니다. Attention
          score·multi-head의 상세 유도는
          <Link to="/ai/attention-theory"> Attention 이론 정본 글</Link>이
          소유합니다.
        </p>
      </div>

      <AttentionContractViz />

      <ExplainedFormula
        question="Attention mask는 허용하지 않은 key가 softmax 확률을 받지 못하게 어떻게 막는가?"
        idea={
          <>
            QKᵀ score에 additive mask를 더한 뒤 row별 softmax를 적용합니다.
            허용된 pair는 0을 더하고, 미래나 padding key처럼 금지된 pair는 −∞를
            더해 확률을 0으로 만듭니다.
          </>
        }
        formula={String.raw`\begin{aligned}A&=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)\\Y&=AV\end{aligned}`}
        terms={[
          {
            symbol: "Q,K,V",
            name: "query·key·value tensors",
            description:
              "한 head에서 각각 [n_q,d_k], [n_k,d_k], [n_k,d_v] shape를 갖습니다.",
          },
          {
            symbol: "M",
            name: "additive visibility mask",
            description:
              "읽을 수 있는 pair는 0, 가릴 pair는 매우 작은 값 또는 −∞입니다.",
          },
          {
            symbol: "A",
            name: "attention weights",
            description: "각 query row가 읽을 key 위치에 만든 확률 분포입니다.",
          },
          {
            symbol: "Y",
            name: "mixed values",
            description: "Query마다 허용된 value vector를 가중합한 출력입니다.",
          },
        ]}
        assumptions={[
          "한 head를 표기했으며 multi-head는 head별 결과를 concat하고 output projection을 적용합니다.",
          "Softmax 구현은 all-masked row와 낮은 precision에서 NaN이 나지 않도록 별도 처리가 필요합니다.",
        ]}
        interpretation="Mask는 attention 뒤에 결과를 지우는 장치가 아니라 softmax 정규화에 들어가기 전에 visibility를 정의합니다. Causal mask와 padding mask를 결합할 때 query·key 축 방향을 잘못 잡으면 leakage가 생깁니다."
      />

      <ExplainedFormula
        question="Standard full attention의 긴 context 병목은 어느 tensor에서 생기는가?"
        idea={
          <>
            Query n개가 key n개를 모두 비교하면 QKᵀ와 attention probability가
            n×n입니다. Projection과 FFN은 대체로 n에 선형이지만
            score·probability materialization은 n²로 증가합니다.
          </>
        }
        formula={String.raw`\begin{aligned}\operatorname{cost}_{\mathrm{attn}}&=O(n^2d)\\\operatorname{memory}_{\mathrm{scores}}&=O(n^2)\end{aligned}`}
        terms={[
          {
            symbol: "n",
            name: "sequence length",
            description:
              "Attention에서 동시에 비교하는 query와 key position 수입니다.",
          },
          {
            symbol: "d",
            name: "hidden/head dimension",
            description:
              "Dot product와 value aggregation에 들어가는 feature 폭입니다.",
          },
          {
            symbol: "n^2",
            name: "pair count",
            description:
              "모든 query–key 조합 수이며 full visibility일 때의 핵심 병목입니다.",
          },
        ]}
        assumptions={[
          "Standard dense full attention의 asymptotic cost입니다.",
          "FlashAttention은 IO와 materialization을 줄이지만 모든 pair를 계산하는 exact attention의 n² arithmetic 자체를 선형으로 바꾸지는 않습니다.",
        ]}
        interpretation="긴 context 구조를 비교할 때는 kernel 최적화와 attention pattern 변경을 구분합니다. Sliding-window·linear/recurrent attention은 계산 graph를 바꾸고, FlashAttention은 같은 exact 결과를 더 효율적으로 계산합니다."
      />
    </section>
  );
}
