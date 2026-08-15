import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { EmbeddingArtifactViz } from "../sentence-embeddings/viz/ModernSentenceEmbeddingViz";

export default function EmbeddingServingContractArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Embedding model은 weight 파일 하나가 아니라 입력 규칙과 index를 포함한 generation입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">같은 checkpoint를 불러도 query prefix를 빼거나 tokenizer revision을 바꾸거나 normalization을 끄면 다른 vector 공간이 됩니다. 더 위험한 경우는 document index는 예전 설정으로 만들고 query server만 새 설정으로 바꾸는 것입니다. 요청은 성공하지만 서로 다른 좌표계를 비교해 검색 품질이 조용히 무너집니다.</p></div>
      <TermBreakdown title="한 generation에 함께 묶을 artifact" items={[
        { term: "Checkpoint revision", description: "Encoder weight와 config의 정확한 version입니다." },
        { term: "Serialization contract", description: "Query·passage prefix, instruction 위치, language, special-token 규칙입니다.", boundary: "보기 좋은 prompt가 아니라 training input의 일부입니다." },
        { term: "Pooling contract", description: "CLS·mean·last token, mask, normalization을 결정하는 vector 생성 규칙입니다." },
        { term: "Index generation", description: "Corpus snapshot을 특정 encoder·serialization·pooling·dimension·dtype로 변환한 검색 artifact 세대입니다.", example: "g42 receipt가 corpus c17과 encoder e9를 함께 가리킵니다." },
      ]} />
      <EmbeddingArtifactViz />
      <ContentBoundary article="embedding-serving-contract" />
    </section>

    <section id="serialization" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Query와 passage는 같은 text라도 서로 다른 역할로 직렬화될 수 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>E5 계열처럼 training에서 <code>query:</code>와 <code>passage:</code> prefix를 쓴 checkpoint는 배포에서도 두 역할을 보존해야 합니다. 질문 “연차 규정?”은 <code>query: 연차 규정?</code>, 문서 “연차는 15일”은 <code>passage: 연차는 15일</code>로 들어갑니다.</p><p>반대로 prefix를 학습하지 않은 model에 이 문자열을 복사한다고 같은 효과가 생기지 않습니다. Model card가 요구한 문구·위치·language·document-side 적용 여부를 정확한 artifact로 다뤄야 합니다.</p></div>
      <div id="paper-e5" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Wang et al. — E5" href="https://arxiv.org/abs/2212.03533">Heterogeneous weak pairs의 contrastive pretraining과 supervised fine-tuning, query·passage role prefix를 결합한 연구입니다. E5의 prefix를 다른 family에 붙인다고 결과가 이전되는 것은 아닙니다.</CitationBlock></div>
    </section>

    <section id="truncation" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Maximum length는 원문 길이가 아니라 직렬화가 끝난 token 예산입니다</h2>
      <ExplainedFormula question="Instruction과 special token이 먼저 자리를 쓰면 본문은 얼마나 남나요?" idea={<p>전체 encoder limit에서 special token과 instruction token을 먼저 뺍니다. 남은 content budget과 원문 token 수 중 실제로 보존한 수의 비율을 따로 계산합니다.</p>} formula={String.raw`L_{\rm content}^{\max}=L_{\max}-L_{\rm special}-L_{\rm instruction},\quad \kappa_i=L_{{\rm kept},i}/L_{{\rm content},i}`} annotatedFormula={String.raw`\begin{aligned}L_0&=\underbrace{L_{\max}-L_{\rm special}}_{\substack{\text{자동 token 자리}\\\text{먼저 예약}}}\\L_{\rm content}^{\max}&=\underbrace{L_0-L_{\rm instruction}}_{\substack{\text{instruction 자리도 빼고}\\\text{본문 예산만 남김}}}\\L_{{\rm kept},i}&=\underbrace{\min(L_{{\rm content},i},L_{\rm content}^{\max})}_{\text{예산 안의 token만 유지}}\\\kappa_i&=\underbrace{L_{{\rm kept},i}/L_{{\rm content},i}}_{\text{원문 대비 보존 비율}}\end{aligned}`} operations={[
        { expression: String.raw`L_{\max}-L_{\rm special}`, annotation: ["전체 좌석에서 자동 token 자리를 빼고", "사용 가능한 입력 예산을 계산"] },
        { expression: String.raw`-L_{\rm instruction}`, annotation: ["role instruction이 소비한 자리도 빼서", "본문용 예산만 남김"] },
        { expression: String.raw`\min(L_{\rm content},L_{\rm content}^{\max})`, annotation: ["원문 길이와 남은 예산 중 작은 값을 골라", "실제로 유지할 token 수를 제한"] },
        { expression: String.raw`L_{\rm kept}/L_{\rm content}`, annotation: ["보존 token을 원문 token으로 나눠", "문서 규모가 다른 retention을 비교"] },
      ]} terms={[
        { symbol: String.raw`L_{\max}`, name: "Encoder limit", description: "Runtime가 허용하는 전체 input token 수입니다." },
        { symbol: String.raw`L_{\rm instruction}`, name: "Instruction length", description: "Role·task prompt가 차지하는 token 수입니다." },
        { symbol: String.raw`\kappa_i`, name: "Content retention", description: "문서 i 원문 중 encoder가 실제로 본 token 비율입니다." },
      ]} assumptions={["Checkpoint와 같은 tokenizer·normalizer·special-token insertion을 사용합니다.", "Truncation side와 chunking rule을 고정합니다.", "Token 보존 비율이 answer evidence 보존 확률과 같다고 가정하지 않습니다."]} interpretation="Limit 512, special 2, instruction 30이면 content budget은 480입니다. 800-token 문서의 retention은 .6이지만 정답이 뒤쪽에 있으면 head truncation으로 핵심 evidence를 전부 잃을 수 있습니다." />
    </section>

    <section id="index-artifact" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Raw vector 크기와 실제 index 크기를 분리하고 generation receipt로 함께 배포합니다</h2>
      <ExplainedFormula question="문서 vector의 원자료와 실제 ANN index는 각각 얼마나 차지하나요?" idea={<p>문서 수마다 dimension 개수만큼 scalar를 저장하므로 raw payload는 세 값을 곱합니다. 그 위에 ANN graph·codebook·ID·metadata·alignment·replica가 추가됩니다.</p>} formula={String.raw`S_{\rm raw}=Mdb,\quad S_{\rm index}=S_{\rm raw}+S_{\rm ANN}+S_{\rm meta}`} annotatedFormula={String.raw`\begin{aligned}N&=\underbrace{M\times d}_{\substack{\text{vector 행·열을 곱해}\\\text{scalar 수 계산}}}\\S_{\rm raw}&=\underbrace{N\times b}_{\substack{\text{scalar 수에 byte를 곱해}\\\text{원자료 크기 계산}}}\\S_{\rm search}&=\underbrace{S_{\rm ANN}+S_{\rm meta}}_{\substack{\text{검색 구조와}\\\text{운영 metadata 추가}}}\\S_{\rm index}&=\underbrace{S_{\rm raw}+S_{\rm search}}_{\text{실제 index 예산}}\end{aligned}`} operations={[
        { expression: String.raw`M\times d`, annotation: ["vector 행 수와 dimension 열 수를 곱해", "저장할 scalar 총개수를 계산"] },
        { expression: String.raw`(Md)\times b`, annotation: ["scalar 수에 dtype byte를 곱해", "raw payload를 byte로 변환"] },
        { expression: String.raw`S_{\rm raw}+S_{\rm ANN}+S_{\rm meta}`, annotation: ["원자료와 검색 구조·운영 metadata를 더해", "실제 배포 index 예산을 구성"] },
      ]} terms={[
        { symbol: "M", name: "Indexed vectors", description: "Document 또는 chunk vector 수입니다." },
        { symbol: "d", name: "Embedding dimension", description: "Vector 하나의 scalar 성분 수입니다." },
        { symbol: "b", name: "Bytes per component", description: "FP32=4, FP16=2, int8 payload≈1 byte입니다." },
        { symbol: String.raw`S_{\rm ANN},S_{\rm meta}`, name: "Index overhead", description: "검색 구조와 ID·revision·replica의 추가 저장량입니다." },
      ]} assumptions={["Dense raw payload 계산이며 allocator와 filesystem overhead는 별도 측정합니다.", "Quantization·dimension 변경 뒤 같은 retrieval validation을 다시 수행합니다.", "Query server와 index가 같은 generation receipt를 확인한 뒤 traffic을 받습니다."]} interpretation="1천만×1,024×2 bytes는 raw 20.48GB입니다. 실제 index RSS와 disk는 이보다 크거나 compression으로 작을 수 있으므로 build 결과를 receipt에 실측값으로 남깁니다." />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Release 시에는 checkpoint revision, tokenizer, prefix, pooling, normalization, max length, dimension, dtype, corpus snapshot, ANN parameters와 measured index size를 한 generation ID 아래 기록합니다. Query encoder와 index가 같은 ID를 확인하지 못하면 요청을 받지 않는 것이 조용한 품질 회귀보다 안전합니다.</p></div>
    </section>
  </div>;
}
