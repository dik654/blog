import ContextOverviewViz from './viz/ContextOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨텍스트 엔지니어링이란</h2>
      <div className="not-prose mb-8"><ContextOverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>컨텍스트 엔지니어링</strong> — LLM에게 전달되는 모든 정보를 설계하고 최적화하는 기술<br />
          프롬프트 한 줄이 아니라, 시스템 프롬프트 + RAG + 도구 결과 + 히스토리 + 메모리를 합산한 전체 입력이 성능을 결정
        </p>
        <p>
          모델을 GPT-4에서 Claude로 바꾸는 것보다, 같은 모델에 더 나은 컨텍스트를 주는 편이 효과적<br />
          컨텍스트 = LLM이 "읽는" 모든 토큰의 합
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">컨텍스트 구성 요소</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LLM Context의 구성
//
// 1. System Prompt
//    - 역할, 제약, 포맷
//    - 매 요청 공통
//    - 토큰 수: 500~5000
//
// 2. User Query
//    - 현재 질문
//    - 토큰 수: 50~1000
//
// 3. Conversation History
//    - 이전 turns
//    - 토큰 수: 0~무제한
//
// 4. Retrieved Context (RAG)
//    - 외부 지식베이스
//    - 토큰 수: 1000~50000
//
// 5. Tool Results
//    - 외부 API 응답
//    - 계산 결과
//    - 토큰 수: 가변
//
// 6. Memory / Scratchpad
//    - 에이전트 상태
//    - 장기 기억
//    - 토큰 수: 가변
//
// 7. Few-shot Examples
//    - 태스크 예시
//    - 토큰 수: 500~5000

// 총 예산:
//   GPT-4: 128K tokens
//   Claude 3.5: 200K tokens
//   Gemini 1.5: 1M-2M tokens
//   최신 OSS: 32K~128K

// 실무 분배 예:
//   System Prompt:  2K
//   RAG Context:    10K
//   History:        5K
//   Query:          500
//   Buffer:         2K
//   ─────────
//   Total:          ~20K

// 비용 계산:
//   GPT-4o: $5/M input tokens
//   Claude: $3/M input tokens (Sonnet)
//   20K context × 1M requests = $60-100/M reqs`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Context Engineering의 원칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 7대 원칙 (2024 실무)
//
// 1. Relevance > Volume
//    관련 있는 1K 토큰 > 무관한 10K 토큰
//    Lost in the Middle 방지
//
// 2. Hierarchy of Importance
//    System > Retrieved > History > Query
//    중요 정보는 앞이나 뒤
//
// 3. Explicit Instructions
//    모호함 제거
//    구체적 지시, 예시 포함
//
// 4. Context Compaction
//    대화 길어지면 요약
//    histogram/tail recency
//
// 5. Just-in-Time Retrieval
//    필요할 때만 검색
//    과잉 RAG 금지
//
// 6. Structured Output
//    XML, JSON으로 파싱 가능
//    다운스트림 연동 쉬움
//
// 7. Grounding
//    RAG 소스 인용
//    Hallucination 방지

// 측정 지표:
//   - Context utilization (%)
//   - Token cost per query
//   - Response quality (human eval)
//   - Latency (ttft, total)
//   - Cache hit rate (KV cache)

// 2024 트렌드:
//   - 긴 문맥 (1M+ tokens)
//   - Agentic workflows (multi-turn, tool use)
//   - Context caching (prompt caching)
//   - Retrieval + Reranking + Compression`}
        </pre>
        <p className="leading-7">
          요약 1: Context = <strong>7가지 요소</strong>의 조합 (system, RAG, history 등).<br />
          요약 2: <strong>Relevance &gt; Volume</strong> — 관련 있는 정보가 용량보다 중요.<br />
          요약 3: 2024 대형 모델의 1M 토큰이 <strong>새로운 엔지니어링 과제</strong> 생성.
        </p>
      </div>
    </section>
  );
}
