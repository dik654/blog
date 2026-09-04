import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import InputContractViz from "./viz/InputContractViz";

export default function DataPrep() {
  return (
    <section id="input-contract" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        입력 계약: token ID·position·padding mask를 서로 다른 tensor로 보존한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Transformer가 직접 받는 것은 문자열이나 one-hot vector가 아니라
          tokenizer가 만든 정수 ID입니다. Embedding layer는 각 ID에 대응하는
          row를 조회해 dense vector로 바꿉니다. 문자열 normalization·subword
          분할·special token ID는
          <Link to="/ai/tokenizer"> Tokenizer 정본 글</Link>이 소유하며, 이 글은
          그 결과가 model tensor가 되는 경계부터 다룹니다.
        </p>
      </div>

      <InputContractViz />

      <ExplainedFormula
        question="Token ID 하나가 첫 Transformer block의 hidden state가 되려면 무엇을 합하는가?"
        idea={
          <>
            Token embedding table에서 ID에 해당하는 row를 고르고, 같은 d_model
            차원의 position signal을 더합니다. 일부 encoder model은 segment
            embedding도 더하지만 모든 Transformer의 필수 항은 아닙니다.
          </>
        }
        formula={String.raw`X^{(0)}_{b,t,:}=E_{\mathrm{tok}[b,t],:}+P_{t,:}`}
        annotatedFormula={String.raw`X^{(0)}_{b,t,:}=\underbrace{E_{\mathrm{tok}[b,t],:}+P_{t,:}}_{\text{initial hidden states 계산}}`}
        operations={[
          { expression: String.raw`E_{\mathrm{tok}[b,t],:}+P_{t,:}`, annotation: ["initial hidden states이(가) 식의 결과에","기여하는 방식을 계산합니다.","Token embedding table에서 ID에 해당하는","row를 고르고, 같은 d_model 차원의 position"] },
        ]}
        terms={[
          {
            symbol: "b,t",
            name: "batch·position index",
            description: "Batch 안의 sample과 그 안의 token 위치를 가리킵니다.",
          },
          {
            symbol: "E",
            name: "token embedding table",
            description:
              "Vocabulary size×d_model shape의 학습 가능한 lookup table입니다.",
          },
          {
            symbol: "P",
            name: "position signal",
            description:
              "Absolute embedding일 수도 있고 다른 위치 방식에서는 이 합이 생략될 수도 있습니다.",
          },
          {
            symbol: "X^{(0)}",
            name: "initial hidden states",
            description:
              "Shape [batch, sequence, d_model]로 block에 들어가는 tensor입니다.",
          },
        ]}
        assumptions={[
          "설명을 위해 absolute position signal을 더하는 구조로 썼습니다. RoPE·ALiBi는 다른 위치에 적용됩니다.",
          "Padding token도 embedding row는 갖지만 attention mask와 loss mask로 영향 범위를 제한해야 합니다.",
        ]}
        interpretation="Embedding lookup은 one-hot×E와 수학적으로 같지만 one-hot을 materialize하지 않습니다. Model·tokenizer checkpoint가 어긋나면 같은 ID가 다른 row를 가리키므로 shape가 맞아도 의미는 깨집니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Padding mask와 loss mask는 같은 질문에 답하지 않는다</h3>
        <p className="leading-8">
          Attention mask는 어떤 key position을 읽을 수 있는지 정하고 loss mask는 어떤 target token을 objective에 포함할지 정합니다.
          Padding을 attention에서 가렸다고 loss에서도 자동으로 빠지는 것은 아닙니다. Batch padding side와 position ID, causal mask와
          label shift를 따로 검사해야 silent training bug를 막을 수 있습니다.
        </p>
      </div>
    </section>
  );
}
