import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import OutputContractViz from "./viz/OutputContractViz";

export default function LinearSoftmax() {
  return (
    <section id="output-head" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        출력 계약: hidden state를 logits로 바꾸고 training objective와 decoding
        policy를 분리한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Decoder language model의 LM head는 각 position의 d_model hidden
          state를 vocabulary 크기의 logits로 투영합니다. Training은 정답 next
          token의 likelihood를 높이지만 inference는 정답을 받지 않습니다.
          Temperature·top-k·top-p는 학습된 model weight가 아니라 logits를
          token으로 바꾸는 decoding policy입니다.
        </p>
        <p>
          Input IDs가 <code>[BOS, 나는, 간다]</code>라면 next-token target은 한 칸
          이동한 <code>[나는, 간다, EOS]</code>다. Causal attention mask는 각 위치가
          미래 input을 읽지 못하게 하고, loss mask는 prompt·padding처럼 채점하지
          않을 target을 제외한다. 두 mask는 shape가 비슷해도 서로 다른 질문에
          답한다.
        </p>
      </div>

      <OutputContractViz />

      <ExplainedFormula
        question="Causal language model은 어떤 token을 target으로 삼아 sequence loss를 계산하는가?"
        idea={
          <>
            Position t의 hidden state로 vocabulary logits를 만들고, 이전 token
            y&lt;t가 주어진 상태에서 실제 다음 token y*t의 negative
            log-probability를 더합니다. Padding·prompt token을 학습하지 않으려면
            loss mask가 별도로 필요합니다.
          </>
        }
        formula={String.raw`\begin{aligned}z_t&=h_tW_{\mathrm{vocab}}+b\\p_t&=\operatorname{softmax}(z_t)\\\mathcal L&=-\sum_t m_t\log p_t(y_t^*)\end{aligned}`}
        terms={[
          {
            symbol: "h_t",
            name: "final hidden state",
            description: "t번째 position의 d_model representation입니다.",
          },
          {
            symbol: "z_t",
            name: "vocabulary logits",
            description: "정규화 전의 vocabulary별 real-valued score입니다.",
          },
          {
            symbol: "y_t^*",
            name: "target next token",
            description:
              "Label shift 뒤 현재 position이 예측해야 하는 정답 token ID입니다.",
          },
          {
            symbol: "m_t",
            name: "loss mask",
            description:
              "해당 target을 objective에 포함하면 1, 무시하면 0인 weight입니다.",
          },
        ]}
        assumptions={[
          "Decoder-only next-token objective를 설명했습니다. Encoder classifier와 seq2seq decoder head는 target 계약이 다릅니다.",
          "실제 kernel은 full probability tensor를 저장하지 않고 fused log-softmax·NLL을 계산할 수 있습니다.",
        ]}
        interpretation="Attention mask는 model이 읽을 위치를, loss mask는 gradient를 낼 target을 정합니다. 두 mask를 혼동하면 prompt token 학습이나 padding loss 같은 오류가 생깁니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Input embedding과 output projection의 weight를 공유하는 weight tying도
          흔하지만 필수는 아닙니다. Vocabulary가 커지면 LM head
          parameter·communication·softmax 비용도 커집니다. Cross-entropy와
          log-sum-exp 안정화는
          <Link to="/ai/cross-entropy"> Cross-entropy 정본 글</Link>에서 자세히
          다룹니다.
        </p>
      </div>
    </section>
  );
}
