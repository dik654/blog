import CodePanel from '@/components/ui/code-panel';

const jqExample = `# LLM trace JSON 의 session 별 tool call 추출
cat llm-events.jsonl \\
  | jq -r 'select(.tool_call != null) | [.session_id, .timestamp, .tool_call.name] | @tsv' \\
  | sort | uniq -c | sort -rn | head -20

# 같은 session + 같은 tool 30 회 이상 = loop 의심
cat llm-events.jsonl \\
  | jq -r '[.session_id, .tool_call.name] | @tsv' \\
  | sort | uniq -c \\
  | awk '$1 >= 30'`;

const ripgrepExample = `# 5xx 응답 + 응답 시간 5s 초과만
rg --no-filename '"status":5\\d{2}' app.log \\
  | jq 'select(.duration_ms > 5000) | {time, path, duration_ms, error}'

# 같은 IP 의 1 분 내 100 회 이상 요청 (rate 의심)
awk '{print $1, substr($4, 2, 17)}' nginx.log \\
  | sort | uniq -c | awk '$1 >= 100'

# JA3 fingerprint 별 분포 (TLS 봇 식별)
zeek-cut id.orig_h ja3 ja3s < ssl.log \\
  | sort | uniq -c | sort -rn | head -20`;

const lokiExample = `# Loki LogQL — error 응답 + 5분 rate
sum by (path) (
  rate({app="api", level="error"} [5m])
) > 1.0

# 평소 baseline 과 비교 (이전 주 같은 시간)
sum(rate({app="api"} [5m]))
  /
sum(rate({app="api"} [5m] offset 7d))`;

export default function LogTooling() {
  return (
    <section id="log-tooling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. 로그 분석 도구 — jq · ripgrep · awk · Loki</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          분석가의 일상 도구. CLI 에서 빠르게 가설 검증 → 결과 보고 다음 쿼리.
          <br />
          UI dashboard 만 의존하면 못 잡는 영역이 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. jq — JSON 로그의 표준 도구</h3>
        <CodePanel title="LLM trace 의 tool call 시퀀스 추출"
          code={jqExample}
          annotations={[
            { lines: [2, 4], color: 'sky', note: 'select + 필드 추출 + uniq -c 빈도' },
            { lines: [7, 10], color: 'emerald', note: 'awk threshold filter — loop session 식별' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. ripgrep + awk — 텍스트 로그</h3>
        <CodePanel title="API · TLS · Nginx 로그 분석 패턴"
          code={ripgrepExample}
          annotations={[
            { lines: [2, 3], color: 'sky', note: 'rg + jq 조합 — 정규식 + JSON 추출' },
            { lines: [5, 7], color: 'emerald', note: 'awk uniq — IP 별 빈도' },
            { lines: [9, 11], color: 'amber', note: 'zeek-cut — 네트워크 분석 표준' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. LogQL (Loki) — 시계열 + 비교</h3>
        <CodePanel title="에러 rate + 옛주 baseline 비교"
          code={lokiExample}
          annotations={[
            { lines: [2, 5], color: 'sky', note: 'rate + sum by — 에러율' },
            { lines: [7, 11], color: 'emerald', note: 'offset 7d — 1 주 전 같은 시간 비교' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. 도구 선택 가이드</h3>
        <ul className="leading-7">
          <li><strong>JSON line 로그</strong> → jq + awk + sort. 1 GB 단일 파일까지 단순 빠름.</li>
          <li><strong>대용량 (10 GB+)</strong> → DuckDB 로 직접 query (read_json_auto). 메모리 효율 ↑.</li>
          <li><strong>실시간 stream</strong> → Vector / Fluentbit + Loki / OpenSearch.</li>
          <li><strong>장기 보관 + 검색</strong> → CloudWatch / Splunk / Elasticsearch. 비용 ↑ 검색 속도 ↑.</li>
          <li><strong>구조화 query</strong> → DataDog Logs query · Splunk SPL.</li>
          <li><strong>네트워크 specific</strong> → Zeek (구 Bro) + zeek-cut. JA3 등 표준.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-5. 분석가의 cheat sheet</h3>
        <ul className="leading-7">
          <li><code>{`jq -r 'select(.field) | .field'`}</code> — 조건부 필드 추출.</li>
          <li><code>{`sort | uniq -c | sort -rn`}</code> — 빈도 분포 (모든 분석의 시작).</li>
          <li><code>{`awk '$N >= K'`}</code> — threshold 필터.</li>
          <li><code>{`grep -A 5 -B 5`}</code> — 매치 주변 5줄 (사고 발생 시 컨텍스트).</li>
          <li><code>{`tail -F file | grep --line-buffered ...`}</code> — 실시간 monitoring.</li>
          <li><code>{`rg -j 8`}</code> — multi-thread (대용량 디렉토리).</li>
        </ul>
      </div>
    </section>
  );
}
