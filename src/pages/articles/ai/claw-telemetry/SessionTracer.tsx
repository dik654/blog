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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct SessionTracer {
    session_id: SessionId,
    started_at: DateTime<Utc>,

    // 집계 카운터
    tool_calls: HashMap<String, ToolStats>,
    llm_requests: u64,
    llm_errors: u64,
    total_tokens_in: u64,
    total_tokens_out: u64,
    cache_hits: u64,

    // 이벤트 타임라인 (최근 1000개)
    events: VecDeque<TracedEvent>,
}

pub struct ToolStats {
    pub call_count: u64,
    pub success_count: u64,
    pub total_duration_ms: u64,
    pub max_duration_ms: u64,
}`}</pre>
        <p>
          <strong>2계층 데이터</strong>: 집계 카운터 + 상세 타임라인<br />
          카운터는 O(1) 업데이트 — 빠른 record<br />
          타임라인은 최근 1000개만 — 메모리 상한
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">record_tool_call()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl SessionTracer {
    pub fn record_tool_call(
        &mut self,
        name: &str,
        success: bool,
        duration: Duration,
    ) {
        let duration_ms = duration.as_millis() as u64;

        // 집계 업데이트
        let stats = self.tool_calls.entry(name.to_string())
            .or_insert_with(Default::default);
        stats.call_count += 1;
        if success { stats.success_count += 1; }
        stats.total_duration_ms += duration_ms;
        stats.max_duration_ms = stats.max_duration_ms.max(duration_ms);

        // 타임라인 추가
        self.events.push_back(TracedEvent {
            timestamp: Utc::now(),
            kind: EventKind::ToolCall,
            summary: format!("{}({}ms)", name, duration_ms),
        });
        if self.events.len() > 1000 { self.events.pop_front(); }
    }
}`}</pre>
        <p>
          <strong>HashMap entry API</strong>: "있으면 업데이트, 없으면 생성" 원자적<br />
          카운터 + max는 같이 업데이트 — 일관성 보장<br />
          타임라인 1000 초과 시 FIFO 드롭
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">요약 통계 — SessionStats</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct SessionStats {
    pub duration: Duration,
    pub total_tool_calls: u64,
    pub tool_success_rate: f64,
    pub most_used_tool: Option<String>,
    pub slowest_tool: Option<String>,
    pub total_cost_usd: f64,
    pub cache_hit_rate: f64,
    pub errors: u64,
}

impl SessionTracer {
    pub fn generate_stats(&self) -> SessionStats {
        let duration = Utc::now() - self.started_at;

        let total_calls: u64 = self.tool_calls.values()
            .map(|s| s.call_count).sum();
        let total_success: u64 = self.tool_calls.values()
            .map(|s| s.success_count).sum();

        let most_used = self.tool_calls.iter()
            .max_by_key(|(_, s)| s.call_count)
            .map(|(k, _)| k.clone());

        let slowest = self.tool_calls.iter()
            .max_by_key(|(_, s)| s.max_duration_ms)
            .map(|(k, _)| k.clone());

        let cache_hit_rate = if self.total_tokens_in > 0 {
            self.cache_hits as f64 / self.total_tokens_in as f64
        } else { 0.0 };

        SessionStats {
            duration: duration.to_std().unwrap(),
            total_tool_calls: total_calls,
            tool_success_rate: total_success as f64 / total_calls.max(1) as f64,
            most_used_tool: most_used,
            slowest_tool: slowest,
            total_cost_usd: self.compute_cost(),
            cache_hit_rate,
            errors: self.llm_errors,
        }
    }
}`}</pre>
        <p>
          <strong>요약 시점</strong>: 세션 종료 또는 <code>/status</code> 명령<br />
          O(N) 집계 — N은 고유 도구 이름 수(수십 개)<br />
          <strong>most_used_tool</strong>·<strong>slowest_tool</strong>: 개선 힌트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">세션 종료 시 flush</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl ConversationRuntime {
    pub async fn shutdown(&mut self) -> Result<()> {
        // 통계 생성
        let stats = self.tracer.generate_stats();

        // TelemetrySink에 전송
        self.telemetry_sink.emit(TelemetryEvent::SessionEnd {
            session_id: self.session.id.clone(),
            duration: stats.duration,
            stats: stats.clone(),
        }).await;

        // 사용자에게 표시
        print_session_summary(&stats);

        // TelemetrySink 강제 flush
        self.telemetry_sink.flush().await?;

        Ok(())
    }
}

fn print_session_summary(s: &SessionStats) {
    println!("\\n╭── Session Summary ──╮");
    println!("│ Duration:    {:?}", s.duration);
    println!("│ Tool calls:  {} ({:.1}% success)",
        s.total_tool_calls, s.tool_success_rate * 100.0);
    println!("│ Most used:   {:?}", s.most_used_tool);
    println!("│ Slowest:     {:?}", s.slowest_tool);
    println!("│ Cache hit:   {:.1}%", s.cache_hit_rate * 100.0);
    println!("│ Cost:        $\\{:.4}\\", s.total_cost_usd);
    println!("╰─────────────────────╯\\n");
}`}</pre>
        <p>
          <strong>세션 종료 시 집계·출력</strong>: 사용자에게 "이번 세션 요약" 제공<br />
          TelemetrySink에도 SessionEnd 이벤트 전송 — 외부 분석 가능<br />
          flush() 강제 호출 — 프로세스 종료 전 버퍼 비우기
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">히스토리컬 분석</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// .claw/telemetry.jsonl (FileExporter 기본 경로)
{"type":"SessionEnd","session_id":"abc","duration":1200,"stats":{...}}
{"type":"SessionEnd","session_id":"def","duration":3400,"stats":{...}}

// 분석 명령 예시
$ jq 'select(.type == "SessionEnd") | .stats.total_cost_usd' .claw/telemetry.jsonl
0.24
0.67
0.42

$ jq '[.[] | select(.type == "SessionEnd") | .stats.total_cost_usd] | add' .claw/telemetry.jsonl
1.33

// "지난 주 총 비용 $1.33"`}</pre>
        <p>
          <strong>JSONL 형식</strong>: 줄 단위 JSON — jq, awk로 분석 용이<br />
          장기 로그 축적 → 주/월 단위 비용·사용 패턴 분석<br />
          사용자가 자체 대시보드 구축 가능
        </p>

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
