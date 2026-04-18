import ChunkingViz from './viz/ChunkingViz';

export default function Chunking() {
  return (
    <section id="chunking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">문서 청킹 전략</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          청킹(chunking)은 RAG 품질의 첫 번째 분기점 — 너무 작으면 맥락 손실, 너무 크면 검색 정밀도 하락<br />
          문서를 어떻게 나누느냐에 따라 동일한 임베딩 모델로도 검색 정확도가 크게 달라진다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">청킹 전략 4가지</h3>
        <ul>
          <li><strong>고정 크기(Fixed-size)</strong> — 512 토큰 등 일정 크기로 자름, 가장 단순</li>
          <li><strong>재귀 청킹(Recursive)</strong> — 단락 → 문장 → 단어 순서로 분할, 의미 경계 유지</li>
          <li><strong>의미 단위(Semantic)</strong> — 임베딩 유사도 변화 지점에서 분할, 가장 정교</li>
          <li><strong>계층적(Hierarchical)</strong> — 문서 → 섹션 → 단락 계층 구조 유지, 요약과 세부 모두 검색 가능</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <ChunkingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">오버랩 설정</h3>
        <p>
          청크 간 오버랩 — 청크 경계에 있는 문맥을 보존하기 위해 10~20% 중첩을 둔다<br />
          예: 512 토큰 청크 + 50 토큰 오버랩 → 이전 청크의 마지막 50토큰이 다음 청크 시작에 포함
        </p>
        <p>
          제조 매뉴얼처럼 "이전 단계 설명 → 현재 단계 실행" 흐름이 강한 문서에서는 오버랩이 특히 중요
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 청크 크기 실험</p>
        <p className="text-sm">
          128/256/512/1024 토큰으로 동일 쿼리를 실험해 검색 정확도를 비교하라<br />
          기술 문서·법률 문서는 작은 청크(256), 서술형 보고서는 큰 청크(1024)가 유리한 경향이 있다
        </p>
      </div>
    </section>
  );
}
