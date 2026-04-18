import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RAG가 왜 필요한가</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM의 한계 — 학습 시점 이후 지식 없음, 도메인 특화 문서 모름, 환각(hallucination)<br />
          <strong>RAG(Retrieval-Augmented Generation)</strong>는 외부 지식을 검색해서 LLM 응답에 주입<br />
          제조 매뉴얼·기술 문서·내부 보고서 기반 Q&amp;A 시스템에 직결
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">RAG vs Fine-tuning</h3>
        <ul>
          <li><strong>RAG</strong> — 지식을 외부 저장소에 두고 검색, 업데이트가 쉽고 출처 제시 가능</li>
          <li><strong>Fine-tuning</strong> — 지식을 모델 가중치에 주입, 스타일 학습은 가능하나 최신 정보 반영 어려움</li>
          <li><strong>결합</strong> — 제조 도메인 Fine-tuning + RAG로 문서 검색이 현실적 선택</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">RAG 파이프라인 구성 요소</h3>
        <ul>
          <li><strong>문서 로더</strong> — PDF, DOCX, HTML 등을 텍스트로 변환</li>
          <li><strong>청킹(Chunking)</strong> — 문서를 검색 단위로 분할</li>
          <li><strong>임베딩</strong> — 텍스트를 벡터로 변환</li>
          <li><strong>벡터 DB</strong> — 임베딩 저장 및 유사도 검색</li>
          <li><strong>리트리버(Retriever)</strong> — 쿼리에 관련된 청크 검색</li>
          <li><strong>생성기(LLM)</strong> — 검색 결과를 컨텍스트로 응답 생성</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: RAG는 검색이 9할</p>
        <p className="text-sm">
          LLM 모델을 바꿔도 답변 품질이 개선되지 않는다면 — 검색 단계가 병목<br />
          청킹 전략, 임베딩 모델, 리트리버 품질을 먼저 점검해야 한다
        </p>
      </div>
    </section>
  );
}
