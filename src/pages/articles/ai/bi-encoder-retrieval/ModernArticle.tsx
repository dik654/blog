import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { BiEncoderFlowViz } from "../sentence-embeddings/viz/ModernSentenceEmbeddingViz";

export default function BiEncoderRetrievalArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Bi-encoder는 더 작은 BERT가 아니라 document 계산을 query 사이에서 재사용하는 구조입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">검색할 문서가 백만 개라면 새 질문 하나마다 백만 pair를 Transformer에 넣을 수 없습니다. Bi-encoder는 document를 query 없이도 표현할 수 있게 학습하고, 그 결과를 미리 저장해 이 반복을 없앱니다.</p></div>
      <TermBreakdown title="먼저 분리할 세 계산 단위" items={[
        { term: "Cross-encoder", description: "Query와 document token을 한 입력으로 넣어 두 text 사이의 token interaction으로 점수를 만듭니다.", boundary: "정교하지만 새 query마다 각 document pair를 다시 읽습니다." },
        { term: "Bi-encoder", description: "Query와 document를 각각 vector로 만든 뒤 similarity로 비교합니다.", example: "Document vector는 밤에 만들고 query vector는 요청 때 만듭니다." },
        { term: "ANN index", description: "저장된 모든 vector를 exact scan하지 않고 가까운 후보를 빠르게 찾는 검색 artifact입니다.", boundary: "Approximation과 설정에 따라 candidate recall이 달라집니다." },
      ]} />
      <BiEncoderFlowViz />
      <ContentBoundary article="bi-encoder-retrieval" />
    </section>

    <section id="offline-index" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Offline index는 공짜가 아니라 query마다 반복하지 않기로 한 계산입니다</h2>
      <ExplainedFormula question="Corpus M개를 검색할 때 cross-encoder와 bi-encoder는 online에서 무엇을 계산하나요?" idea={<p>Cross-encoder는 query가 달라질 때마다 M개 pair를 모두 forward합니다. Bi-encoder는 document forward를 corpus generation 때 끝내고 online에는 query forward와 ANN search만 남깁니다.</p>} formula={String.raw`C_{\rm cross}(q)=\sum_{j=1}^{M}C_{\rm pair}(q,d_j),\quad C_{\rm bi}(q)=C_q+C_{\rm ANN}`} annotatedFormula={String.raw`\begin{aligned}C_{\rm cross}(q)&=\underbrace{\sum_{j=1}^{M}C_{\rm pair}(q,d_j)}_{\substack{\text{query마다}\\\text{M pair 반복}}}\\C_{\rm offline}(g)&=\underbrace{\sum_{j=1}^{M}C_d(d_j)}_{\substack{\text{generation마다}\\\text{문서 계산 선불}}}\\C_{\rm bi}(q)&=\underbrace{C_q}_{\text{query 1회}}+\underbrace{C_{\rm ANN}(q,g)}_{\text{index 탐색}}\end{aligned}`} operations={[
        { expression: String.raw`\sum_{j=1}^{M}C_{\rm pair}(q,d_j)`, annotation: ["query를 각 document와 결합하고", "M번의 pair-forward 비용을 누적"] },
        { expression: String.raw`\sum_{j=1}^{M}C_d(d_j)`, annotation: ["query와 무관한 document 계산을", "corpus generation마다 한 번 선불"] },
        { expression: String.raw`C_q+C_{\rm ANN}`, annotation: ["요청 때 query encode와 index search만 더해", "online critical path를 구성"] },
      ]} terms={[
        { symbol: "M", name: "Corpus size", description: "Index에 들어간 document 또는 chunk 수입니다." },
        { symbol: String.raw`C_{\rm pair}`, name: "Pair-forward cost", description: "Cross-encoder가 query와 한 document를 함께 읽는 비용입니다." },
        { symbol: String.raw`C_{\rm ANN}`, name: "ANN search cost", description: "Index generation g에서 candidate를 찾는 비용입니다." },
        { symbol: "g", name: "Index generation", description: "Corpus·encoder·pooling·dtype가 함께 고정된 배포 세대입니다." },
      ]} assumptions={["Offline build와 update 비용은 별도 장부에 기록합니다.", "ANN cost와 recall은 index type·settings·hardware에 따라 달라집니다.", "Cross-encoder와 bi-encoder가 같은 ranking 품질을 가진다고 가정하지 않습니다."]} interpretation="문서 10,000개면 cross-encoder는 query당 pair forward 10,000번을 요구합니다. Bi-encoder는 document 계산을 재사용하지만 index build·memory와 후보 누락 가능성을 새로 떠안습니다." />
    </section>

    <section id="candidate" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Candidate set은 reranker가 볼 수 있는 세계의 경계입니다</h2>
      <TermBreakdown title="두 단계 검색에서 섞지 말아야 할 용어" items={[
        { term: "Relevant set", description: "Label snapshot이 query의 정답으로 인정한 모든 document 집합입니다." },
        { term: "Candidate set", description: "첫 retriever가 corpus에서 가져와 다음 단계에 넘긴 k개 document입니다." },
        { term: "Reranker", description: "Candidate 내부 pair를 더 정교하게 읽고 순서만 다시 매기는 두 번째 model입니다.", boundary: "별도 retrieval을 하지 않는 한 candidate 밖 문서는 추가할 수 없습니다." },
      ]} />
      <ExplainedFormula question="첫 단계가 정답을 하나도 가져오지 못했다면 reranker가 복구할 수 있나요?" idea={<p>Reranker 출력은 candidate set 안의 문서로만 구성됩니다. 따라서 candidate와 relevant set의 교집합이 비어 있으면 순서를 아무리 바꿔도 relevant 문서가 생기지 않습니다.</p>} formula={String.raw`\mathcal R_q\cap C_k(q)=\varnothing\Rightarrow\mathcal R_q\cap\operatorname{Rerank}(C_k(q))=\varnothing`} annotatedFormula={String.raw`\begin{aligned}\underbrace{\operatorname{Docs}(\operatorname{Rerank}(C_k(q)))\subseteq C_k(q)}_{\text{reranker는 받은 candidate 안에서만 순서를 변경}}\\\underbrace{\mathcal R_q\cap C_k(q)=\varnothing}_{\text{첫 단계가 relevant document를 하나도 전달하지 않음}}\\\Longrightarrow\quad\underbrace{\mathcal R_q\cap\operatorname{Rerank}(C_k(q))=\varnothing}_{\text{순서 변경만으로 새 정답을 만들 수 없음}}\end{aligned}`} operations={[
        { expression: String.raw`\operatorname{Rerank}(C_k)\subseteq C_k`, annotation: ["출력 문서 집합을 candidate의 subset으로 제한해", "두 번째 단계의 권한을 고정"] },
        { expression: String.raw`\mathcal R_q\cap C_k(q)`, annotation: ["정답 집합과 후보 집합을 교차해", "첫 단계가 전달한 정답 수를 계산"] },
        { expression: String.raw`\varnothing\Rightarrow\varnothing`, annotation: ["입력 교집합이 비었다는 전제에서", "rerank 뒤 교집합도 비었음을 도출"] },
      ]} terms={[
        { symbol: String.raw`\mathcal R_q`, name: "Relevant set", description: "Query q의 정답 문서 전체입니다." },
        { symbol: String.raw`C_k(q)`, name: "Candidate set", description: "첫 retriever가 반환한 k개 문서입니다." },
        { symbol: "Rerank", name: "Reranking operator", description: "Candidate의 pair score와 순서를 다시 계산합니다." },
      ]} assumptions={["Reranker가 corpus를 새로 탐색하지 않습니다.", "Relevant set은 같은 corpus snapshot을 기준으로 합니다.", "Sparse·dense union처럼 후보를 추가하는 stage에는 이 단일-set 전제를 그대로 쓰지 않습니다."]} interpretation="Relevant {A,B,C}, candidate {A,D,E,F,G}이면 reranker가 얻을 수 있는 relevant coverage 상한은 1/3입니다. 먼저 k에 따른 recall–latency를 정한 뒤 reranking 품질을 봅니다." />
    </section>

    <section id="reranking" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">좋은 two-stage pipeline은 recall을 먼저 확보하고 precision을 뒤에서 다듬습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>첫 단계의 일은 모든 문서를 완벽하게 정렬하는 것이 아니라 제한된 k 안에 정답을 넣는 것입니다. 두 번째 단계는 그 작은 집합에서 query–document token interaction을 사용해 위쪽 순서를 정교하게 바꿉니다. k를 키우면 candidate recall은 오를 수 있지만 reranking latency와 다음 model에 전달할 context 비용도 함께 늘어납니다.</p></div>
      <div id="paper-sbert-retrieval" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Reimers & Gurevych — Sentence-BERT" href="https://aclanthology.org/D19-1410/">독립 sentence embedding으로 pairwise BERT 계산의 조합 비용을 바꾼 기준 연구입니다. 논문의 비교 시간은 당시 task·hardware 조건이며 현대 ANN의 고정 speedup 숫자가 아닙니다.</CitationBlock></div>
    </section>
  </div>;
}
