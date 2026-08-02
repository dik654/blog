import CodePanel from '@/components/ui/code-panel';

const windowExample = `-- 사용자별 일일 요청 수 + 7 일 이동평균 + 전일 대비 변화율
SELECT
  user_id,
  date_trunc('day', created_at) AS day,
  COUNT(*) AS req_count,
  AVG(COUNT(*)) OVER (
    PARTITION BY user_id
    ORDER BY date_trunc('day', created_at)
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS req_7d_avg,
  COUNT(*) - LAG(COUNT(*)) OVER (
    PARTITION BY user_id
    ORDER BY date_trunc('day', created_at)
  ) AS req_change_vs_prev_day
FROM api_requests
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY user_id, date_trunc('day', created_at)
ORDER BY user_id, day;`;

const sessionExample = `-- 동일 session 의 LLM tool call 시퀀스 + 누적 token
WITH session_calls AS (
  SELECT
    session_id,
    created_at,
    tool_name,
    tool_args,
    input_tokens,
    output_tokens,
    ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at) AS step
  FROM llm_events
  WHERE created_at >= NOW() - INTERVAL '1 hour'
)
SELECT
  session_id,
  step,
  tool_name,
  SUM(input_tokens + output_tokens) OVER (
    PARTITION BY session_id
    ORDER BY step
  ) AS cumulative_tokens
FROM session_calls
WHERE session_id IN (
  -- 30 step 이상의 긴 session 만 (loop 의심)
  SELECT session_id FROM session_calls
  GROUP BY session_id HAVING COUNT(*) >= 30
)
ORDER BY session_id, step;`;

const explainExample = `-- 느린 쿼리 진단
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT *
FROM api_requests
WHERE user_id = 'abc123'
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 100;

-- 봐야 할 것:
-- · Seq Scan vs Index Scan (인덱스 안 타면 빨강)
-- · rows estimated vs actual (큰 차이면 통계 stale)
-- · Buffers: shared hit vs read (cache miss 비율)
-- · 실행 시간 분포 (전체 vs 단계별)`;

export default function SqlPatterns() {
  return (
    <section id="sql-patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. SQL 분석 패턴 — 운영 쿼리의 핵심</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          운영 분석에 자주 쓰는 패턴 4 가지 — <strong>window function · CTE · 시계열 join · explain plan</strong>.
          <br />
          이걸 못하면 시계열 비교 / 사용자 행동 / 사고 추적이 모두 불가능.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. Window function — 시계열 비교의 표준</h3>
        <p className="leading-7">
          PARTITION BY + ORDER BY + ROWS / RANGE 가 핵심. 이동평균, 전일 비교, ranking 모두 가능.
        </p>
        <CodePanel title="사용자별 요청수 + 7일 이동평균 + 전일 대비"
          code={windowExample}
          annotations={[
            { lines: [5, 11], color: 'sky', note: 'AVG OVER + ROWS BETWEEN — 7일 이동평균' },
            { lines: [12, 15], color: 'emerald', note: 'LAG OVER — 전일 값 가져오기' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. CTE 로 복잡 쿼리 단계화</h3>
        <p className="leading-7">
          WITH ... AS 로 가독성 ↑ + 중간 결과 재사용. AI 에이전트 session 분석 같은 다단계 쿼리에 필수.
        </p>
        <CodePanel title="LLM session 의 tool call 시퀀스 + 누적 token"
          code={sessionExample}
          annotations={[
            { lines: [2, 11], color: 'sky', note: 'CTE — session 내 step 번호 매김' },
            { lines: [13, 18], color: 'emerald', note: 'cumulative_tokens — 시퀀스 누적' },
            { lines: [21, 24], color: 'amber', note: '서브쿼리 — 30+ step session 만 필터' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. EXPLAIN 으로 느린 쿼리 진단</h3>
        <p className="leading-7">
          분석가가 느린 쿼리를 직접 봐야 하는 상황 — index 부족 / 통계 stale / cache miss.
        </p>
        <CodePanel title="EXPLAIN ANALYZE 의 핵심 항목"
          code={explainExample}
          annotations={[
            { lines: [2, 8], color: 'sky', note: 'ANALYZE BUFFERS — 실제 실행 + 캐시 hit 비율' },
            { lines: [10, 14], color: 'amber', note: '봐야 할 4 가지' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. 운영 시 주의</h3>
        <ul className="leading-7">
          <li><strong>read replica 사용</strong> — production primary 에 무거운 분석 쿼리 금지. read replica + statement_timeout.</li>
          <li><strong>statement_timeout</strong> — 분석가의 실수 query 가 prod 막지 않게. 5 초 또는 30 초 기본.</li>
          <li><strong>row count 추정</strong> — COUNT(*) 대신 pg_stat_all_tables 의 estimate 활용 (대용량 테이블).</li>
          <li><strong>인덱스 힌트 X</strong> — Postgres 는 hint 없음. 통계 정확하면 planner 가 잘 함. ANALYZE 자주.</li>
          <li><strong>prod 데이터 export</strong> — PII 포함 가능. 마스킹 / aggregation 후 노트북.</li>
        </ul>
      </div>
    </section>
  );
}
