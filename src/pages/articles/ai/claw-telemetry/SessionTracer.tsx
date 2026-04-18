import SessionStatsViz from './viz/SessionStatsViz';

export default function SessionTracer() {
  return (
    <section id="session-tracer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SessionTracer &amp; TelemetrySink</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SessionStatsViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">SessionTracer 역할</h3>
        <p>
          SessionTracer: <strong>세션 단위 이벤트 추적·집계</strong><br />
          TelemetrySink가 일반적 이벤트 파이프라면, SessionTracer는 <strong>세션 중심 뷰</strong><br />
          세션 종료 시 요약 통계 생성 → 분석·청구에 활용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SessionTracer 구조</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">SessionTracer — 2계층 데이터</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">집계 카운터 (O(1) 업데이트)</p>
              <div className="space-y-2">
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">session_id</code> / <code className="text-xs font-mono">started_at</code>
                  <p className="text-xs text-muted-foreground">세션 식별 + 시작 시간</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">tool_calls: HashMap&lt;String, ToolStats&gt;</code>
                  <p className="text-xs text-muted-foreground">도구별 호출 통계</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">llm_requests</code> / <code className="text-xs font-mono">llm_errors</code> / <code className="text-xs font-mono">cache_hits</code>
                  <p className="text-xs text-muted-foreground">LLM 요청·실패·캐시 카운터</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">total_tokens_in</code> / <code className="text-xs font-mono">total_tokens_out</code>
                  <p className="text-xs text-muted-foreground">입출력 토큰 누적량</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">상세 타임라인 (최근 1000개)</p>
              <div className="bg-muted/50 rounded-lg p-3 mb-2">
                <code className="text-xs font-mono">events: VecDeque&lt;TracedEvent&gt;</code>
                <p className="text-xs text-muted-foreground">메모리 상한 — 오래된 이벤트 FIFO 드롭</p>
              </div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-3 mb-2">ToolStats</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs"><code className="font-mono">call_count</code> — 호출 횟수</p>
                <p className="text-xs"><code className="font-mono">success_count</code> — 성공 횟수</p>
                <p className="text-xs"><code className="font-mono">total_duration_ms</code> — 총 소요시간</p>
                <p className="text-xs"><code className="font-mono">max_duration_ms</code> — 최대 소요시간</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">record_tool_call()</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">record_tool_call(name, success, duration) 흐름</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">집계 업데이트</p>
                <p className="text-xs text-muted-foreground"><code>HashMap::entry(name).or_insert_with</code> — "있으면 업데이트, 없으면 생성" 원자적</p>
                <p className="text-xs text-muted-foreground"><code>call_count++</code>, <code>success_count++</code>, <code>total_duration_ms +=</code>, <code>max_duration_ms.max()</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">타임라인 추가</p>
                <p className="text-xs text-muted-foreground"><code>events.push_back(TracedEvent)</code> — <code>summary: "Read(42ms)"</code> 형태</p>
                <p className="text-xs text-muted-foreground">1000개 초과 시 <code>pop_front()</code> — FIFO 드롭</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">요약 통계 — SessionStats</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">SessionStats 필드 + generate_stats() 계산</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">duration</code>
              <p className="text-xs text-muted-foreground"><code>Utc::now() - started_at</code></p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">total_tool_calls</code>
              <p className="text-xs text-muted-foreground"><code>tool_calls.values().map(call_count).sum()</code></p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">tool_success_rate</code>
              <p className="text-xs text-muted-foreground"><code>total_success / total_calls.max(1)</code></p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">most_used_tool</code>
              <p className="text-xs text-muted-foreground"><code>max_by_key(call_count)</code> — 가장 많이 호출된 도구</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-amber-600 dark:text-amber-400">slowest_tool</code>
              <p className="text-xs text-muted-foreground"><code>max_by_key(max_duration_ms)</code> — 가장 느린 도구</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">cache_hit_rate</code>
              <p className="text-xs text-muted-foreground"><code>cache_hits / total_tokens_in</code></p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">total_cost_usd</code>
              <p className="text-xs text-muted-foreground"><code>compute_cost()</code> — 토큰 × 단가</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-red-600 dark:text-red-400">errors</code>
              <p className="text-xs text-muted-foreground"><code>llm_errors</code> — LLM 에러 횟수</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">요약 시점: 세션 종료 또는 <code>/status</code> 명령 — O(N) 집계, N은 고유 도구 이름 수(수십 개)</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">세션 종료 시 flush</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">ConversationRuntime::shutdown() 흐름</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">통계 생성</p>
                <p className="text-xs text-muted-foreground"><code>tracer.generate_stats()</code> → SessionStats</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">TelemetrySink 전송</p>
                <p className="text-xs text-muted-foreground"><code>emit(TelemetryEvent::SessionEnd)</code> — 외부 분석용</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-medium">사용자에게 요약 표시</p>
                <p className="text-xs text-muted-foreground"><code>print_session_summary</code> — Duration, Tool calls, Cost 등 요약</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">4</span>
              <div>
                <p className="text-sm font-medium">강제 flush</p>
                <p className="text-xs text-muted-foreground"><code>telemetry_sink.flush().await</code> — 프로세스 종료 전 버퍼 비우기</p>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Session Summary 출력 예시</p>
            <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
              <span className="text-muted-foreground">Duration</span><span>12m 34s</span>
              <span className="text-muted-foreground">Tool calls</span><span>42 (95.2% success)</span>
              <span className="text-muted-foreground">Most used</span><span>Read</span>
              <span className="text-muted-foreground">Slowest</span><span>Bash</span>
              <span className="text-muted-foreground">Cache hit</span><span>67.3%</span>
              <span className="text-muted-foreground">Cost</span><span>$0.4230</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">히스토리컬 분석</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">JSONL 로그 분석</p>
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">저장 경로</p>
              <p className="text-xs font-mono"><code>.claw/telemetry.jsonl</code> — FileExporter 기본 경로, 줄 단위 JSON</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold mb-1">세션별 비용 조회</p>
                <p className="text-xs font-mono text-muted-foreground"><code>jq 'select(.type == "SessionEnd") | .stats.total_cost_usd'</code></p>
                <p className="text-xs text-muted-foreground mt-1">→ 0.24, 0.67, 0.42</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold mb-1">총 비용 합산</p>
                <p className="text-xs font-mono text-muted-foreground"><code>jq '[... | .total_cost_usd] | add'</code></p>
                <p className="text-xs text-muted-foreground mt-1">→ "지난 주 총 비용 $1.33"</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">장기 로그 축적 → 주/월 단위 비용·사용 패턴 분석 — 자체 대시보드 구축 가능</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 텔레메트리의 실제 효과</p>
          <p>
            사용자에게 <strong>텔레메트리가 보여주는 것</strong>:
          </p>
          <p className="mt-2">
            1. <strong>비용 투명성</strong>: "이번 세션 $0.42" — 무의식적 낭비 방지<br />
            2. <strong>병목 식별</strong>: "bash가 평균 5초" — 성능 개선 지점<br />
            3. <strong>패턴 학습</strong>: "Read 60%, Edit 30%" — 탐색 중심 vs 수정 중심<br />
            4. <strong>에러 모니터링</strong>: "LLM 실패율 8%" — 모델·설정 조정 시그널
          </p>
          <p className="mt-2">
            <strong>실제 행동 변화 사례</strong>:<br />
            - "Read 80회 발생 → 검색 쿼리 더 구체적으로" (사용자)<br />
            - "캐시 히트율 30% → prompt caching 활성화" (운영)<br />
            - "bash 평균 3초 → tests를 target 테스트로 변경" (개발)
          </p>
          <p className="mt-2">
            텔레메트리 없으면 <strong>"무슨 일이 벌어지는지 모름"</strong><br />
            특히 에이전트 시스템은 비결정적 — 데이터 없이 개선 불가<br />
            claw-code는 기본 비활성이지만 <strong>활성 권장</strong> — 자기 사용 패턴 이해
          </p>
        </div>

      </div>
    </section>
  );
}
