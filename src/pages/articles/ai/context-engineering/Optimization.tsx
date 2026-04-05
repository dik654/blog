import OptimizationViz from './viz/OptimizationViz';

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨텍스트 윈도우 최적화</h2>
      <div className="not-prose mb-8"><OptimizationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          컨텍스트 윈도우는 유한한 자원 — 200K 토큰이라도 무한하지 않음<br />
          각 소스에 토큰 예산을 배분하고, 임계값 도달 시 자동 압축하는 전략 필수
        </p>
        <p>
          <strong>"Lost in the Middle"</strong> — 긴 컨텍스트의 중간부에 놓인 정보는 LLM이 잘 참조하지 못하는 현상<br />
          중요 정보는 컨텍스트의 앞(시스템 프롬프트)이나 끝(최근 메시지)에 배치
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Context Window 관리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Token Budget 분배 전략
//
// Total Budget: 128K (GPT-4-turbo)
//
// Priority-based allocation:
//   System Prompt:     5K  (고정)
//   Current Query:     1K  (변동)
//   History (recent):  10K (동적)
//   RAG Results:       30K (동적)
//   Tool Outputs:      5K  (동적)
//   Scratchpad:        3K  (동적)
//   Output Buffer:     4K  (예약)
//   Safety Margin:     5K  (예약)
//   ─────────────────────
//   Used:              63K
//   Available:         65K
//
// 초과 시 대응:
//   1. Truncate oldest history
//   2. Summarize middle content
//   3. Compress RAG results
//   4. Drop low-relevance items

// Compression 기법:
//
// 1. Summarization (LLM)
//    10K tokens → 1K summary
//    품질: 높음, 비용: 중간
//
// 2. Extractive
//    핵심 문장만 선택
//    비용: 낮음, 손실: 있음
//
// 3. Semantic Compression
//    임베딩 기반 redundancy 제거
//    중복 정보 제거
//
// 4. LLMLingua
//    토큰 수준 압축 (논문)
//    3~4x 압축률

// Lost in the Middle 완화:
//   - 중요 정보는 start/end 배치
//   - Key facts 반복
//   - Explicit referencing
//   - Attention sink tokens`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Prompt Caching</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prompt Caching (Anthropic, OpenAI 2024)
//
// 아이디어: 공통 프롬프트 prefix 캐싱
//   첫 호출: 전체 처리 (비싸고 느림)
//   이후 호출: 공통 부분 재사용 (싸고 빠름)
//
// Anthropic Prompt Caching:
//   - Cache writes: 1.25x base cost
//   - Cache reads: 0.1x base cost
//   - TTL: 5 minutes
//   - 최소 1024 tokens
//
// 예시:
//   System prompt: 5K tokens (같음)
//   RAG context: 20K tokens (같음, 캐시 가능)
//   User query: 100 tokens (변동)
//
//   Without cache: 25.1K × $3/M = $0.075
//   With cache:
//     Cache write (1회): 25K × $3.75/M = $0.094
//     Cache hit (N회): 25K × $0.30/M + 100 × $3/M = $0.008
//
//   100 queries 처리:
//     Without: $7.50
//     With: $0.094 + 99 × $0.008 = $0.88
//     → 88% 비용 절감!

// 캐시 활용 조건:
//   ✓ 같은 system prompt 반복 사용
//   ✓ 같은 RAG context 다중 쿼리
//   ✓ Few-shot examples 고정
//   ✗ 매번 바뀌는 내용 (의미 없음)

// OpenAI Prompt Caching (자동):
//   - 1024+ tokens prefix 자동 캐싱
//   - 50% 할인
//   - 1시간 TTL
//
// KV Cache (모델 내부):
//   - Transformer attention의 K, V 저장
//   - 같은 prefix 재사용
//   - Inference 가속

// 실무 팁:
//   - 정적 내용 앞쪽 배치
//   - 동적 내용 뒤쪽
//   - Cache invalidation 주의
//   - 모니터링 (cache hit rate)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Priority-based budget</strong> 분배로 context 관리.<br />
          요약 2: <strong>Lost in the Middle</strong>은 긴 문맥의 고질적 문제.<br />
          요약 3: <strong>Prompt Caching</strong>으로 비용 90% 절감 가능 (2024).
        </p>
      </div>
    </section>
  );
}
