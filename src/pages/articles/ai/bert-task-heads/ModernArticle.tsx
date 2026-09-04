import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { BertTaskHeadViz } from "../bert/viz/ModernBertViz";

export default function BertTaskHeadsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Fine-tuning은 task의 답 단위와 읽을 BERT state를 맞추는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Encoder output <code>[B,L,H]</code>를 먼저 고정합니다. 그 다음 답이
            sequence 하나인지, token마다 하나인지, span의 두 끝인지에 따라 읽을
            state와 output axis를 정합니다.
          </p>
        </div>
        <TermBreakdown
          title="Task별 prediction unit"
          items={[
            {
              term: "Sequence head",
              description:
                "CLS 또는 pooler state 하나를 class logits로 바꿉니다.",
              example: "3-class output은 [B,3]입니다.",
            },
            {
              term: "Token head",
              description: "각 token state를 C개 label logits로 바꿉니다.",
              example: "NER output은 [B,L,C]입니다.",
              boundary: "Subword와 word label alignment가 필요합니다.",
            },
            {
              term: "Span head",
              description: "각 위치에서 start와 end score를 따로 만듭니다.",
              example: "두 tensor 모두 [B,L]입니다.",
              boundary: "Answer span이 truncated input 안에 있어야 합니다.",
            },
            {
              term: "Retrieval interface",
              description:
                "Pair를 함께 읽을지 독립 vector로 저장할지 선택합니다.",
              boundary:
                "Vanilla CLS가 자동으로 좋은 sentence embedding은 아닙니다.",
            },
          ]}
        />
        <BertTaskHeadViz />
        <ContentBoundary article="bert-task-heads" />
      </section>
      <section id="task-head" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Sequence head는 CLS state를 label axis로 투영합니다
        </h2>
        <ExplainedFormula
          question="[B,L,H]에서 [B,C] class probability를 어떻게 만드나요?"
          idea={
            <p>
              각 sequence의 CLS row만 모아 [B,H]를 만들고 linear projection으로 C logits를 만든 뒤 softmax합니다.
            </p>
          }
          formula={String.raw`p(y\mid x)=softmax(W_c h_{CLS}+b_c)`}
          annotatedFormula={String.raw`\begin{aligned}h_{\mathrm{seq}}&=\underbrace{H[:,0,:]}_{\text{각 sequence의 CLS row 선택}}\\z&=\underbrace{W_c h_{\mathrm{seq}}+b_c}_{\text{hidden axis를 class logits로 투영}}\\p(y\mid x)&=\underbrace{\operatorname{softmax}(z)}_{\text{class score를 합이 1인 확률로 변환}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`H[:,0,:]`,
              annotation: ["sequence tensor에서", "CLS position row만 선택"],
            },
            {
              expression: String.raw`W_c h+b_c`,
              annotation: [
                "hidden feature를 weighted sum해",
                "class별 logit 생성",
              ],
            },
            {
              expression: String.raw`\operatorname{softmax}(z)`,
              annotation: [
                "class logits를 exponentiate·정규화해",
                "categorical probability 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "H",
              name: "Encoder output",
              description: "Shape [B,L,H]의 final contextual states입니다.",
            },
            {
              symbol: "W_c,b_c",
              name: "Task head",
              description:
                "Hidden width를 C labels로 바꾸는 trainable projection입니다.",
            },
            {
              symbol: "p(y|x)",
              name: "Class distribution",
              description: "각 sequence의 C-class probability입니다.",
            },
          ]}
          assumptions={[
            "CLS position과 tokenizer packing이 checkpoint와 일치합니다.",
            "Task evidence가 truncation 뒤에도 남습니다.",
          ]}
          interpretation="Fine-tuning하면 gradient가 head를 지나 encoder에도 흐릅니다. Encoder를 freeze한 linear probe와 다른 실험입니다."
        />
      </section>
      <section id="token-span" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Token과 span task는 sequence length 축을 보존합니다
        </h2>
        <ExplainedFormula
          question="NER와 extractive QA는 어느 output shape를 만들까요?"
          idea={
            <p>
              NER는 각 hidden row를 C labels로 투영하고, QA는 각 row를 start와
              end scalar 두 개로 투영합니다.
            </p>
          }
          formula={String.raw`Z_{NER}=HW_{tok},\quad s=Hw_s,\quad e=Hw_e`}
          annotatedFormula={String.raw`\begin{aligned}Z_{\mathrm{NER}}&=\underbrace{H W_{\mathrm{tok}}}_{\text{각 token state를 C label로 투영}}\\s&=\underbrace{H w_s}_{\text{각 위치의 answer-start score}}\\e&=\underbrace{H w_e}_{\text{각 위치의 answer-end score}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`H W_{\mathrm{tok}}`,
              annotation: [
                "length axis는 유지하고",
                "hidden axis만 token-label axis로 변환",
              ],
            },
            {
              expression: String.raw`H w_s`,
              annotation: [
                "각 token state를 scalar로 줄여",
                "start 후보 score 생성",
              ],
            },
            {
              expression: String.raw`H w_e`,
              annotation: [
                "같은 token states를 별도 vector로 읽어",
                "end 후보 score 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "Z_{NER}",
              name: "Token logits",
              description: "Shape [B,L,C]의 label scores입니다.",
            },
            {
              symbol: "s,e",
              name: "Span boundary scores",
              description: "각각 shape [B,L]의 start·end scores입니다.",
            },
            {
              symbol: "H",
              name: "Contextual token states",
              description:
                "PAD를 포함한 fixed length tensor이며 loss mask가 필요합니다.",
            },
          ]}
          assumptions={[
            "PAD·special token loss를 제외합니다.",
            "Word/subword label alignment와 impossible-answer rule을 고정합니다.",
          ]}
          interpretation="같은 encoder라도 prediction unit이 달라지면 head axis, label construction, loss mask가 모두 달라집니다."
        />
      </section>
      <section id="retrieval" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Cross-encoder는 pair interaction을, bi-encoder는 vector 재사용을
          선택합니다
        </h2>
        <TermBreakdown
          title="Retrieval의 두 계산 경로"
          items={[
            {
              term: "Cross-encoder",
              description:
                "Query와 document를 한 input으로 packing해 모든 token이 상호작용한 pair score를 만듭니다.",
              example: "상위 100개 후보 reranking에 사용합니다.",
              boundary: "Document마다 query와 다시 forward해야 합니다.",
            },
            {
              term: "Bi-encoder",
              description:
                "Query와 document를 각각 vector로 만들고 similarity로 후보를 찾습니다.",
              example: "100만 document vector를 미리 index합니다.",
              boundary:
                "Pair token-level interaction을 retrieval 전에 볼 수 없습니다.",
            },
            {
              term: "Two-stage retrieval",
              description:
                "Bi-encoder ANN으로 recall 후보를 만들고 cross-encoder로 정밀 rerank합니다.",
              example: "Recall@100과 NDCG@10, p95를 따로 측정합니다.",
            },
          ]}
        />
        <div id="paper-sentence-bert" className="not-prose mt-8">
          <CitationBlock
            source="Reimers & Gurevych — Sentence-BERT"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1908.10084"
          >
            Pair를 매번 함께 encoding하는 비용을 siamese/triplet 구조와
            pooling으로 줄입니다. Vanilla BERT CLS가 추가 학습 없이 강한
            retrieval vector라는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
