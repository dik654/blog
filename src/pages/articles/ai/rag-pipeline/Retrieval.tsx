import ExplainedFormula from "@/components/ui/explained-formula";
import RetrievalViz from "./viz/RetrievalViz";

export default function Retrieval() {
  return (
    <section id="retrieval" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Retrieval은 하나의 점수로 정답을 고르는 단계가 아니라, 서로 다른 검색 신호로 후보를 넓게 회수한 뒤 정교한 모델로 좁히는 단계입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Sparse retrieval은 제품 코드·법 조항·고유명사처럼 정확한 token 일치에 강하고, dense retrieval은 표현이 달라도 의미가 가까운 문서를 찾는 데 유리합니다. 두 점수의 scale은 다르므로 검증 없이 더하지 않습니다. 간단한 baseline으로는 각 순위만 사용하는 Reciprocal Rank Fusion(RRF)을 쓸 수 있습니다.</p>
      </div>
      <ExplainedFormula
        question="Dense와 sparse 결과의 점수 범위가 다를 때 순위만으로 어떻게 합칠까요?"
        idea={<>각 검색기가 문서에 준 rank를 역수 형태로 바꿔 더합니다. 여러 목록에서 꾸준히 상위인 문서는 높은 점수를 얻고, k는 한 검색기의 1위가 지나치게 지배하는 정도를 완화합니다.</>}
        formula={String.raw`\operatorname{RRF}(d)=\sum_{r\in\mathcal R}\frac{1}{k+\operatorname{rank}_r(d)}`}
        terms={[
          { symbol: "d", name: "document", description: "두 검색 결과 중 하나 이상에 등장한 후보 문서입니다." },
          { symbol: "R", name: "rankers", description: "BM25·dense retriever처럼 합칠 검색기 집합입니다." },
          { symbol: "rank_r(d)", name: "rank", description: "검색기 r에서 문서 d의 1부터 시작하는 순위입니다." },
          { symbol: "k", name: "rank constant", description: "상위 한두 순위의 과도한 영향력을 완화하는 검증 parameter입니다." },
        ]}
        assumptions={["각 ranker의 cutoff와 누락 문서 처리 규칙을 고정합니다.", "RRF는 score calibration을 요구하지 않지만 query별 최적 relevance를 보장하지 않습니다.", "k와 candidate 수는 validation set에서 정하고 test 결과로 재선택하지 않습니다."]}
        interpretation="k=60일 때 dense 1위·sparse 10위 문서는 1/61+1/70을 얻습니다. 두 목록 모두 상위에 있는 문서가 한 목록에서만 우연히 1위인 문서보다 유리해질 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>ACL·tenant·valid-time filter는 candidate 생성 전에 적용합니다. 검색 후 forbidden 문서를 지우면 허가 문서가 top-k 밖으로 밀렸거나, 금지 문서의 text와 score가 뒤 단계에 노출될 수 있습니다. 넓은 후보는 query와 document를 함께 읽는 cross-encoder 또는 late-interaction model로 rerank하되, 이 모델은 candidate 밖 문서를 새로 만들 수 없습니다.</p>
      </div>
      <ExplainedFormula
        question="Reranker가 아무리 좋아도 첫 retrieval의 누락을 복구할 수 없는 이유는 무엇일까요?"
        idea={<>Reranker output은 candidate set의 부분집합입니다. 따라서 relevant set과의 교집합 크기는 candidate 단계보다 커질 수 없습니다.</>}
        formula={String.raw`\begin{aligned}
O_q&\subseteq C_q\\
|O_q\cap R_q|&\le |C_q\cap R_q|
\end{aligned}`}
        terms={[
          { symbol: "R_q", name: "relevant set", description: "질문 q에 답을 뒷받침하는 정답 문서 전체입니다." },
          { symbol: "C_q", name: "candidate set", description: "Dense·sparse·fusion이 reranker에 넘긴 문서입니다." },
          { symbol: "O_q", name: "reranked output", description: "Reranker가 Cq 안에서 골라 순서를 바꾼 최종 top-k입니다." },
        ]}
        assumptions={["Reranker가 외부 검색을 새로 수행하지 않고 Cq만 재정렬합니다.", "Relevant label은 multi-positive를 보존하고 corpus revision과 일치합니다.", "Output cutoff가 더 작으면 coverage는 같거나 줄 수 있습니다."]}
        interpretation="정답 문서 세 개 중 candidate가 두 개만 포함하면 뒤 단계가 완벽해도 최대 두 개만 남길 수 있습니다. 그래서 candidate Recall과 reranking NDCG를 따로 봅니다."
      />
      <div className="not-prose my-8"><RetrievalViz /></div>
      <div id="reading-dpr" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Dense Passage Retrieval</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">DPR은 질문과 passage를 두 encoder로 독립 변환하고 dense vector similarity로 open-domain QA 후보를 회수했습니다. 작은 수의 question–passage pair로 학습한 dual encoder가 논문 조건에서 강한 BM25 baseline보다 top-20 passage accuracy를 개선한 것이 핵심 결과입니다. 이 수치가 모든 언어·identifier-heavy corpus·최신 BM25 설정에서도 그대로 유지된다는 주장은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2004.04906" target="_blank" rel="noreferrer">Dual encoder와 평가 조건 보기</a>
      </div>
      <div id="reading-rrf" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 연구 · Reciprocal Rank Fusion</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Cormack·Clarke·Büttcher는 서로 다른 IR system의 순위를 1/(k+rank)로 합치는 단순한 fusion을 제안하고 당시 TREC·LETOR 실험에서 개별 system과 다른 fusion baseline을 비교했습니다. 핵심 기여는 score scale을 맞추지 않고 rank evidence를 합치는 방법이며, 특정 k나 모든 corpus의 성능 우위를 보장하는 법칙은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf" target="_blank" rel="noreferrer">RRF 정의와 실험 범위 보기</a>
      </div>
    </section>
  );
}
