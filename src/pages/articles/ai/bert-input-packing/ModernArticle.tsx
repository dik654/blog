import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { BertPackingViz } from "../bert/viz/ModernBertViz";

export default function BertInputPackingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          BERT input은 token 한 줄이 아니라 같은 길이의 네 tensor입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 <code>[CLS] A [SEP] B [SEP]</code>라는 token sequence를
            만듭니다. 그 다음 각 slot에 position, segment, padding visibility를
            한 줄씩 맞춥니다. 이 네 줄은 값을 더하거나 mask에 쓰는 위치가 서로
            다릅니다.
          </p>
        </div>
        <TermBreakdown
          title="한 줄에 하나씩 보는 입력 tensor"
          items={[
            {
              term: "input_ids",
              description:
                "WordPiece와 CLS·SEP·PAD의 vocabulary row 번호입니다.",
              boundary:
                "Tokenizer와 checkpoint revision이 다르면 같은 숫자의 의미가 바뀝니다.",
            },
            {
              term: "position_ids",
              description:
                "각 slot의 absolute order를 가리키는 embedding row 번호입니다.",
              boundary:
                "Learned table의 maximum position을 넘으면 자동 일반화하지 않습니다.",
            },
            {
              term: "token_type_ids",
              description:
                "각 token이 segment A 또는 B에 속한다는 소속표입니다.",
              boundary: "Checkpoint에 type-vocab row가 하나뿐일 수도 있습니다.",
            },
            {
              term: "attention_mask",
              description:
                "실제 content slot은 1, PAD slot은 0으로 표시합니다.",
              boundary: "Vocabulary의 [MASK] token과 다른 물체입니다.",
            },
          ]}
        />
        <BertPackingViz />
        <ContentBoundary article="bert-input-packing" />
      </section>
      <section id="special-tokens" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Special token은 순서와 경계를 표시하고 PAD는 내용이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>[CLS]</code>는 sequence head가 읽을 첫 slot,{" "}
            <code>[SEP]</code>는 segment 끝, <code>[PAD]</code>는 batch length를
            맞추는 빈 slot입니다. 어떤 token도 이름만 보고 ID를 추측하지 않고
            tokenizer config에서 확인합니다.
          </p>
        </div>
      </section>
      <section id="aligned-tensors" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          세 embedding row를 더한 뒤 padding은 attention logit에서 제거합니다
        </h2>
        <ExplainedFormula
          question="각 slot의 encoder input vector는 어떻게 만들어지나요?"
          idea={
            <p>
              Token identity, absolute position, segment identity가 같은 hidden
              width의 vector를 가리킵니다. 세 vector를 coordinate별로 더해 첫
              encoder layer에 넣습니다.
            </p>
          }
          formula={String.raw`e_i=E_{tok}[x_i]+E_{pos}[i]+E_{seg}[s_i]`}
          annotatedFormula={String.raw`\begin{aligned}e_i^{\mathrm{token}}&=\underbrace{E_{\mathrm{tok}}[x_i]}_{\text{vocabulary ID의 의미 row 조회}}\\e_i^{\mathrm{position}}&=\underbrace{E_{\mathrm{pos}}[i]}_{\text{현재 slot의 순서 row 조회}}\\e_i^{\mathrm{segment}}&=\underbrace{E_{\mathrm{seg}}[s_i]}_{\text{A·B 소속 row 조회}}\\e_i&=\underbrace{e_i^{\mathrm{token}}+e_i^{\mathrm{position}}+e_i^{\mathrm{segment}}}_{\text{세 정보를 같은 hidden 좌표에 결합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`E_{\mathrm{tok}}[x_i]`,
              annotation: [
                "discrete token ID로",
                "checkpoint embedding row 조회",
              ],
            },
            {
              expression: String.raw`E_{\mathrm{pos}}[i]`,
              annotation: ["slot index로", "absolute position row 조회"],
            },
            {
              expression: String.raw`E_{\mathrm{seg}}[s_i]`,
              annotation: ["segment label로", "A·B ownership row 조회"],
            },
            {
              expression: String.raw`e_i^{tok}+e_i^{pos}+e_i^{seg}`,
              annotation: [
                "같은 hidden width의 세 vector를",
                "coordinate별로 합성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "x_i",
              name: "Token ID",
              description:
                "Special token을 포함한 i slot의 vocabulary index입니다.",
            },
            {
              symbol: "i",
              name: "Position ID",
              description: "Sequence 안 absolute slot index입니다.",
            },
            {
              symbol: "s_i",
              name: "Segment ID",
              description: "A 또는 B 소속을 나타내는 type index입니다.",
            },
          ]}
          assumptions={[
            "세 embedding table의 output width가 같습니다.",
            "Tokenizer와 checkpoint config가 일치합니다.",
          ]}
          interpretation="Attention mask는 이 합에 더하는 semantic embedding이 아닙니다. Attention score 단계에서 PAD key를 제거하는 별도 control tensor입니다."
        />
      </section>
      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Truncation·padding side·type-vocab은 checkpoint별 입력 계약입니다
        </h2>
        <TermBreakdown
          title="Release 전에 고정할 항목"
          items={[
            {
              term: "Tokenizer revision",
              description:
                "Vocabulary와 special-token ID를 checkpoint digest와 묶습니다.",
            },
            {
              term: "Maximum length",
              description:
                "Position table 범위와 task evidence 보존 길이를 함께 봅니다.",
            },
            {
              term: "Padding·truncation",
              description:
                "Left/right policy와 label alignment를 train·serve에서 맞춥니다.",
            },
            {
              term: "Tensor receipt",
              description:
                "네 tensor의 shape·dtype·첫 fixture 값을 저장합니다.",
            },
          ]}
        />
        <div id="paper-bert-input" className="not-prose mt-8">
          <CitationBlock
            source="Hugging Face Transformers — BERT inputs"
            citeKey={1}
            type="paper"
            href="https://huggingface.co/docs/transformers/model_doc/bert"
          >
            현재 API의 input_ids·attention_mask·token_type_ids·position_ids
            shape와 의미를 확인합니다. 특정 checkpoint가 모든 optional tensor를
            같은 방식으로 사용한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
