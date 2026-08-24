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
        annotatedFormula={String.raw`\begin{aligned}z_t&=\underbrace{h_tW_{\mathrm{vocab}}+b}_{\text{final hidden state 계산}}\\p_t&=\underbrace{\operatorname{softmax}(z_t)}_{\text{선택 비율 정규화}}\\\mathcal L&=\underbrace{-\sum_t m_t\log p_t(y_t^*)}_{\text{로그 비용 변환}}\end{aligned}`}
        operations={[
          { expression: String.raw`h_tW_{\mathrm{vocab}}+b`, annotation: ["final hidden state이(가) 식의 결과에 기여하는","방식을 계산합니다.","Position t의 hidden state로","vocabulary logits를 만들고, 이전 token y"] },
          { expression: String.raw`\operatorname{softmax}(z_t)`, annotation: ["score를 합이 1인 선택 비율로 정규화합니다.","Position t의 hidden state로","vocabulary logits를 만들고, 이전 token y","t가 주어진 상태에서 실제 다음 token y*t의"] },
          { expression: String.raw`-\sum_t m_t\log p_t(y_t^*)`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Position t의 hidden state로","vocabulary logits를 만들고, 이전 token y","t가 주어진 상태에서 실제 다음 token y*t의"] },
        ]}
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

      <ExplainedFormula
        question="Label smoothing은 정답 token의 log-probability를 최대화하는 목표를 어떻게 바꾸는가?"
        idea={
          <>
            One-hot target은 정답에 확률 1, 나머지 모든 token에 0을 요구해
            모델이 정답 logit을 무한히 키우도록 유도합니다. Label smoothing은
            정답에는 1보다 살짝 작은 확률만, 나머지 K-1개 token에는 남은 확률을
            균등하게 나눠줘 모델이 유한한 확신에서 멈추게 만듭니다.
          </>
        }
        formula={String.raw`q'(k)=(1-\epsilon)\cdot\mathbf 1[k=y^*]+\frac{\epsilon}{K},\qquad \mathcal L_{\mathrm{ls}}=-\sum_k q'(k)\log p(k)`}
        annotatedFormula={String.raw`q'(k)=\underbrace{(1-\epsilon)\cdot\mathbf 1[k=y^*]}_{\text{정답 token에 1보다 살짝 작은 확률}}+\underbrace{\frac{\epsilon}{K}}_{\text{나머지 모든 token에 균등 분산}}`}
        operations={[
          {
            expression: String.raw`(1-\epsilon)\cdot\mathbf 1[k=y^*]`,
            annotation: ["정답 token에는", "1에서 조금 깎은 확률만 할당"],
          },
          {
            expression: String.raw`\epsilon/K`,
            annotation: ["남은 확률 질량을", "vocabulary 전체에 균등하게 분산"],
          },
          {
            expression: String.raw`-\sum_k q'(k)\log p(k)`,
            annotation: [
              "soft target과 model 확률 사이의",
              "cross-entropy를 그대로 계산",
            ],
          },
        ]}
        terms={[
          {
            symbol: String.raw`\epsilon`,
            name: "smoothing 강도",
            description:
              "정답 확률에서 덜어내 나머지 token에 나눠줄 양입니다. 원 논문은 0.1을 씁니다.",
          },
          {
            symbol: "K",
            name: "vocabulary 크기",
            description: "확률을 분산시킬 대상이 되는 전체 token 종류 수입니다.",
          },
          {
            symbol: "q'(k)",
            name: "smoothed target",
            description: "One-hot 대신 학습에 실제로 쓰는 soft target 분포입니다.",
          },
        ]}
        assumptions={[
          "Perplexity(정답 log-probability 자체)는 label smoothing 때문에 오히려 나빠질 수 있습니다 — 목적이 perplexity 최소화가 아니라 calibration과 downstream 품질(BLEU 등) 개선이기 때문입니다.",
        ]}
        interpretation="정답을 완벽히 맞혀도 loss가 0이 되지 않으므로, 모델은 정답 logit을 무한히 키우려 하지 않고 유한한 값에서 멈춥니다. 그 결과 확률 분포가 덜 뾰족해져, 정답이 아닌 다른 그럴듯한 후보의 확률을 완전히 0으로 밀어내지 않습니다."
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
