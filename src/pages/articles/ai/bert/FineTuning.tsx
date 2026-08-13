import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TaskHeadViz from "./viz/TaskHeadViz";
export default function FineTuning() {
  return (
    <section id="fine-tuning" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Fine-tuning은 task의 출력 단위와 읽을 state를 맞춘다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          원 BERT recipe는 task head를 추가하고 encoder weight까지 함께
          update합니다. Sequence classification은 보통 pooled <code>[CLS]</code>
          , token classification은 각 token state, extractive QA는 각 위치의
          start·end score를 읽습니다. Learning rate·epoch·freezing은 dataset
          크기와 stability에 따라 검증해야 하며 원 논문의 좁은 search range를
          보편값으로 고정하면 안 됩니다.
        </p>
        <p>
          Batch <code>B</code>, sequence length <code>L</code>, hidden width
          <code>H</code>라면 encoder output은 <code>[B,L,H]</code>다. 3-class
          sequence classification은 CLS state를 읽어 <code>[B,3]</code>, C개
          label의 NER는 모든 token을 읽어 <code>[B,L,C]</code>, extractive QA는
          각 위치의 start·end score 두 묶음 <code>[B,L]</code>을 만든다. 같은 BERT
          encoder라도 무엇을 한 prediction 단위로 볼지에 따라 head의 축이 달라진다.
        </p>
      </div>
      <TaskHeadViz />
      <ExplainedFormula
        question="Sequence classification head는 BERT output을 label probability로 어떻게 바꿀까?"
        idea={
          <>
            마지막 layer의 [CLS] state 또는 pooler output에 linear projection을
            적용하고 softmax로 class distribution을 만듭니다.
          </>
        }
        formula={String.raw`p(y\mid\mathbf x)=\operatorname{softmax}(W_c\mathbf h_{\mathrm{CLS}}+\mathbf b_c)`}
        terms={[
          {
            symbol: "\\mathbf h_{\\mathrm{CLS}}",
            name: "sequence representation",
            description:
              "마지막 encoder layer의 첫 token state 또는 checkpoint가 정의한 pooled output입니다.",
          },
          {
            symbol: "W_c,\\mathbf b_c",
            name: "task head",
            description:
              "Downstream labels 수에 맞춰 새로 학습하는 projection입니다.",
          },
        ]}
        assumptions={[
          "Tokenizer packing과 truncation이 label에 필요한 evidence를 보존합니다.",
          "[CLS]가 일반적인 semantic distance에 최적이라는 가정은 별도 contrastive training 없이는 성립하지 않습니다.",
        ]}
        interpretation="Fine-tuning gradient는 head에서 encoder 전체로 흐르므로 task에 맞게 representation도 바뀝니다. Encoder를 freeze하고 head만 학습하는 linear probe와 같은 실험으로 해석하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Retrieval에서는 cross-encoder와 bi-encoder를 구분한다</h3>
        <p>
          Query와 document를 한 sequence로 넣는 cross-encoder는 모든 token이
          상호작용해 정교한 score를 만들지만 document마다 다시 forward해야
          합니다. Bi-encoder는 각각을 embedding으로 미리 계산할 수 있지만
          vanilla <code>[CLS]</code>가 곧바로 좋은 sentence embedding은
          아닙니다. Pair supervision과 pooling objective가 필요하며, 더 넓은
          검색 설계는{" "}
          <Link to="/ai/sentence-embeddings">Sentence embedding 글</Link>에서
          이어집니다.
        </p>
        <h3>Encoder model의 가치는 generative LLM과 별도 운영 축에서 본다</h3>
        <p>
          BERT 계열은 classification·NER·reranking처럼 출력 공간이 작고
          latency·throughput이 중요한 작업에서 여전히 합리적입니다. 반대로 자유
          형식 생성은 원래 역할이 아닙니다. Task metric뿐 아니라 calibration,
          max length로 잘린 evidence, batch throughput, memory와 재학습 비용을
          같은 production 조건에서 비교해야 합니다.
        </p>
      </div>
      <div
        id="paper-sentence-bert"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · Cross-encoder 비용에서 bi-encoder로
        </p>
        <p className="mt-2 text-sm font-semibold">
          Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문장 pair를 매번 함께 encoding하는 BERT 구조의 검색 비용을 지적하고
          siamese/triplet 구조와 pooling으로 독립 sentence vector를 학습합니다.
          Vanilla BERT의 모든 <code>[CLS]</code>가 자동으로 좋은 retrieval
          embedding이라는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/1908.10084"
          target="_blank"
          rel="noreferrer"
        >
          Sentence-BERT objective와 속도 비교 보기
        </a>
      </div>
    </section>
  );
}
