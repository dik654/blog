import Retrieval from "./retrieval-ranking-funnel/Retrieval";
import ContentBoundary from "@/components/articles/content-boundary";

export default function RetrievalRankingFunnelArticle() {
  return (
    <div className="space-y-12">
      <header id="overview" className="scroll-mt-20">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            검색 품질은 마지막 reranker 하나의 점수가 아닙니다. 이 글은 허가된
            candidate universe에서 <strong>lexical·dense lane으로 recall을 확보하고,
            rank evidence를 합친 뒤 bounded candidate만 정교하게 재정렬</strong>하는
            funnel을 다룹니다. 각 단계는 다음 단계가 복구할 수 없는 누락과 별도의
            latency·memory 비용을 만듭니다.
          </p>
          <p>
            Ingestion·chunk·index revision, generation context와 claim citation까지의
            전체 수명주기는 <a href="/ai/rag-pipeline">RAG 파이프라인 글</a>에서
            이어집니다.
          </p>
        </div>
        <ContentBoundary article="retrieval-ranking-funnel" />
      </header>
      <Retrieval />
    </div>
  );
}
