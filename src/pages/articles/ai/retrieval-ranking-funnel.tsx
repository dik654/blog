import Retrieval from "./retrieval-ranking-funnel/Retrieval";
import HybridDepth from "./retrieval-ranking-funnel/HybridDepth";
import LateInteraction from "./retrieval-ranking-funnel/LateInteraction";
import RankingEvaluation from "./retrieval-ranking-funnel/RankingEvaluation";
import ContentBoundary from "@/components/articles/content-boundary";
import RetrievalViz from "./retrieval-ranking-funnel/viz/RetrievalViz";
import {
  RetrievalRankingLocator,
  RetrievalRankingReturn,
} from "./retrieval-ranking-funnel/RetrievalRankingLocator";

export default function RetrievalRankingFunnelArticle() {
  return (
    <div className="space-y-12">
      <header id="overview" className="scroll-mt-20">
        <RetrievalRankingLocator />
        <RetrievalViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            검색 품질은 마지막 재정렬기의 점수 하나로 결정되지 않습니다. 이 글은
            허가된 검색 범위에서 <strong>단어 일치 검색과 의미 검색으로 정답 후보를
            넓게 모으고, 두 순위의 근거를 합친 뒤 정해진 수의 후보만 자세히
            재정렬</strong>하는 과정을 다룹니다. 각 단계에서 생긴 누락은 뒤 단계가
            복구하지 못하며, 단계마다 지연 시간과 메모리 비용도 달라집니다.
          </p>
          <p>
            문서 수집·청크·색인 개정부터 생성 문맥과 답변 근거 표시까지의 전체
            수명주기는 <a href="/cs/ai/rag-pipeline">RAG 파이프라인 글</a>에서
            이어서 설명합니다.
          </p>
        </div>
        <ContentBoundary article="retrieval-ranking-funnel" />
      </header>
      <Retrieval />
      <HybridDepth />
      <LateInteraction />
      <RankingEvaluation />
      <RetrievalRankingReturn />
    </div>
  );
}
