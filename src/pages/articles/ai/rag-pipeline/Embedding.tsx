import ExplainedFormula from "@/components/ui/explained-formula";
import EmbeddingViz from "./viz/EmbeddingViz";

export default function Embedding() {
  return (
    <section id="embedding" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Embedding model을 바꾸는 일은 파일 하나를 교체하는 일이 아니라 검색 공간 전체의 version을 바꾸는 일입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Query와 document는 checkpoint가 학습한 instruction·pooling·normalization 규약으로 encode합니다. 이 원리는 <a href="/ai/sentence-embeddings">문장 임베딩 정본</a>에서 다루며, 여기서는 corpus snapshot과 index를 함께 배포하는 계약에 집중합니다.</p>
        <p>같은 dimension이라고 같은 좌표계는 아닙니다. Encoder checkpoint나 query prefix, truncation 또는 normalization을 바꾸면 기존 document vector와 새 query vector의 내적을 해석할 근거가 사라집니다. 기존 active index는 보존한 채 새 version으로 corpus를 다시 encode해 blue/green shadow index를 만들고, exact-search subset의 ANN recall, 동일 query의 paired retrieval 품질, latency와 storage를 함께 비교합니다. Gate를 통과하면 alias를 원자적으로 전환하고, 문제가 생기면 보존한 이전 index와 query encoder tuple로 즉시 rollback합니다.</p>
      </div>
      <ExplainedFormula
        question="어떤 값이 같아야 query와 index가 같은 검색 공간이라고 말할 수 있을까요?"
        idea={<>Index version을 임의의 이름이 아니라 입력부터 source snapshot까지의 tuple로 정의합니다. Tuple의 한 항이라도 바뀌면 새 index를 만들고 비교 가능성을 다시 검증합니다.</>}
        formula={String.raw`V_{\mathrm{index}}=(h_E,h_T,h_P,d,\nu,\delta,h_C,h_A)`}
        annotatedFormula={String.raw`V_{\mathrm{index}}=\underbrace{(h_E,h_T,h_P,d,\nu,\delta,h_C,h_A)}_{\text{tokenizer · 계산}}`}
        operations={[
          { expression: String.raw`(h_E,h_T,h_P,d,\nu,\delta,h_C,h_A)`, annotation: ["tokenizer · preprocessing","hashes이(가) 식의 결과에 기여하는 방식을 계산합니다.","Index version을 임의의 이름이 아니라 입력부터","source snapshot까지의 tuple로 정의합니다."] },
        ]}
        terms={[
          { symbol: "h_E", name: "encoder hash", description: "Embedding checkpoint와 revision의 식별자입니다." },
          { symbol: "h_T,h_P", name: "tokenizer · preprocessing hashes", description: "Tokenizer, role instruction, pooling, truncation 규약입니다." },
          { symbol: "d,nu,delta", name: "vector contract", description: "Dimension d, normalization ν, distance metric δ입니다." },
          { symbol: "h_C", name: "corpus snapshot", description: "Source와 chunk revision을 고정한 식별자입니다." },
          { symbol: "h_A", name: "ANN config", description: "Index type·build/search parameter·library version입니다." },
        ]}
        assumptions={["Query service가 active index와 같은 tuple의 encoder path를 사용합니다.", "Hash는 실제 artifact와 configuration을 재현할 수 있는 registry에 연결됩니다.", "동일 tuple은 검색 재현 조건이지 relevance 품질 보증이 아닙니다."]}
        interpretation="Checkpoint만 같아도 document는 normalized인데 query는 raw vector라면 다른 contract입니다. Alias 전환과 rollback도 이 tuple 단위로 수행합니다."
      />
      <div className="not-prose my-8"><EmbeddingViz /></div>
    </section>
  );
}
