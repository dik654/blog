import CompactPipelineViz from './viz/CompactPipelineViz';
import PhaseTransitionViz from './viz/PhaseTransitionViz';

export default function CompactPipeline() {
  return (
    <section id="compact-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">compact_session() 파이프라인 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CompactPipelineViz />
      </div>
      <PhaseTransitionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 진입 조건 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">호출 진입점 3가지</h3>
        <p>
          <code>compact_session()</code>이 호출되는 경로는 3가지:<br />
          1. <strong>자동 트리거</strong>: 대화 루프가 매 턴마다 <code>should_compact()</code>를 확인 — true 시 자동 실행<br />
          2. <strong>명시적 명령</strong>: 사용자가 <code>/compact</code> 슬래시 명령 입력<br />
          3. <strong>API 오류 응답</strong>: <code>context_length_exceeded</code> 오류 수신 시 즉시 압축 후 재시도
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// conversation_runtime.rs — 자동 트리거
async fn ensure_context_fits(&mut self) -> Result<()> {
    if should_compact(&self.session, &self.compact_config) {
        let result = compact_session(&self.session, &self.compact_config)?;
        self.session = result.compacted_session;
        self.emit_event(Event::Compacted {
            removed: result.removed_count,
            summary_tokens: estimate_tokens(&result.formatted_summary),
        });
    }
    Ok(())
}`}</pre>
        <p>
          자동 트리거는 API 호출 <strong>직전</strong>에 수행 — 토큰 초과 오류 방지<br />
          압축 후 <code>self.session</code>을 교체 — 이후 API 호출은 압축된 세션 사용<br />
          <code>Event::Compacted</code> 이벤트를 UI로 방출 → 사용자에게 "N개 메시지 압축됨" 표시
        </p>

        {/* ── 1단계: preserve_recent 분리 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — preserve_recent 분리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn compact_session(
    session: &Session,
    config: &CompactionConfig,
) -> Result<CompactionResult> {
    let total = session.messages.len();
    let keep  = config.preserve_recent_messages.min(total);
    //    ↑ 메시지 수보다 preserve_recent가 크면 전체 보존

    let split_point = total - keep;
    let (old_messages, recent_messages) = session.messages.split_at(split_point);
    //    ↑ split_at: 참조 슬라이스 분리 (복사 없음, O(1))

    // 보존: 마지막 keep개 메시지 원본 그대로
    // 압축 대상: 앞부분 (old_messages)
    ...
}`}</pre>
        <p>
          <code>split_at()</code>는 슬라이스를 두 개로 쪼개는 Rust 표준 연산 — 복사 없음, O(1)<br />
          <strong>preserve_recent_messages 기본값 권장</strong>: 10-20<br />
          너무 작으면(예: 2) 현재 작업 맥락이 사라짐, 너무 크면(예: 100) 압축 효과 약화
        </p>

        {/* ── 2단계: 시스템 메시지 필터 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — 시스템 메시지 격리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시스템 프롬프트와 이전 압축 요약은 압축 대상에서 제외
let (system_msgs, compactable_msgs): (Vec<_>, Vec<_>) = old_messages
    .iter()
    .partition(|m| {
        matches!(m.role, Role::System) ||
        m.content.starts_with("<prior-context>")
    });`}</pre>
        <p>
          <strong>제외 조건 2가지</strong>:<br />
          1. <code>Role::System</code>: 시스템 프롬프트 (CLAUDE.md 등) — 압축하면 동작 기반 상실<br />
          2. <code>&lt;prior-context&gt;</code> 시작 메시지: 이전 압축 요약 — 이미 요약된 것을 다시 요약하면 정보 손실 가중
        </p>
        <p>
          <code>partition()</code>은 조건에 따라 Vec를 둘로 분리 — true는 system_msgs, false는 compactable_msgs<br />
          이전 압축 요약은 <code>merge_compact_summaries()</code>에서 별도 처리 (다음 섹션)
        </p>

        {/* ── 3단계: summarize_messages ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">3단계 — summarize_messages() 호출</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`let summary = summarize_messages(&compactable_msgs)?;
// summary는 구조화된 Summary 객체:
pub struct Summary {
    pub scope: String,                        // 전체 작업 범위
    pub current_work: Option<String>,         // 진행 중 작업
    pub pending_work: Vec<String>,            // 미완 항목
    pub tool_usage: HashMap<String, usize>,   // 도구별 호출 횟수
    pub file_candidates: Vec<PathBuf>,        // 언급된 파일 경로
    pub timeline: Vec<TimelineEvent>,         // 주요 이벤트
}`}</pre>
        <p>
          <strong>6개 필드의 역할</strong>:<br />
          - <code>scope</code>: 현재 세션이 무엇을 하는 중인지 (한 문장)<br />
          - <code>current_work</code>: 가장 최근 작업 (파일·오류 단서)<br />
          - <code>pending_work</code>: 사용자가 요청했지만 미완료인 항목 리스트<br />
          - <code>tool_usage</code>: Read 45회, Edit 12회 같은 분포 — 작업 성격 추론<br />
          - <code>file_candidates</code>: 대화에 등장한 파일 경로 — 맥락 복원 키<br />
          - <code>timeline</code>: 시간순 주요 이벤트 (tool_use, error, user_message)
        </p>

        {/* ── 4단계: format_compact_summary ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">4단계 — format_compact_summary()로 직렬화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn format_compact_summary(summary: &Summary) -> String {
    let mut out = String::new();
    out.push_str("<prior-context>\\n");

    // Scope
    out.push_str(&format!("## 작업 범위\\n{}\\n\\n", summary.scope));

    // Current / Pending
    if let Some(cw) = &summary.current_work {
        out.push_str(&format!("## 진행 중\\n{}\\n\\n", cw));
    }
    if !summary.pending_work.is_empty() {
        out.push_str("## 미완료\\n");
        for p in &summary.pending_work { out.push_str(&format!("- {}\\n", p)); }
        out.push_str("\\n");
    }

    // Tool usage
    out.push_str("## 도구 사용\\n");
    for (tool, count) in summary.tool_usage.iter() {
        out.push_str(&format!("- {}: {}회\\n", tool, count));
    }
    out.push_str("\\n");

    // Files
    if !summary.file_candidates.is_empty() {
        out.push_str("## 관련 파일\\n");
        for f in &summary.file_candidates { out.push_str(&format!("- {:?}\\n", f)); }
        out.push_str("\\n");
    }

    // Timeline
    out.push_str("## 타임라인\\n");
    for ev in &summary.timeline { out.push_str(&format!("- {}\\n", ev)); }

    out.push_str("</prior-context>");
    out
}`}</pre>
        <p>
          <strong>출력 포맷</strong>: 마크다운 헤더 + XML 태그 래핑<br />
          <code>&lt;prior-context&gt;</code> 태그는 LLM에게 "이 부분이 압축 요약"임을 명시 — 파싱과 병합의 경계 역할<br />
          섹션 순서: 범위 → 진행 중 → 미완료 → 도구 사용 → 관련 파일 → 타임라인 (중요도 내림차순)
        </p>

        {/* ── 5단계: 압축 세션 조립 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">5단계 — 압축된 Session 재조립</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`let mut new_messages: Vec<Message> = Vec::new();

// a) 시스템 메시지 보존
new_messages.extend(system_msgs.iter().cloned());

// b) 압축 요약을 user 메시지로 삽입
new_messages.push(Message {
    role: Role::User,
    content: formatted_summary.clone(),
    timestamp: Utc::now(),
    metadata: MessageMeta::compact_marker(),
    //        ↑ 압축 메시지임을 표시 — UI가 회색 톤으로 렌더링
});

// c) 연속 메시지 추가 (다음 섹션의 get_compact_continuation_message)
new_messages.push(get_compact_continuation_message());

// d) 원본 보존된 최근 메시지
new_messages.extend(recent_messages.iter().cloned());

let compacted_session = Session {
    messages: new_messages,
    ..session.clone()
};`}</pre>
        <p>
          <strong>새 세션 메시지 배치 순서</strong>: 시스템 → 요약 → 연속 메시지 → 최근 원본<br />
          압축 요약을 <strong>user 역할</strong>로 삽입 — LLM이 "사용자가 제공한 컨텍스트"로 인식하여 더 적극 참조<br />
          <code>MessageMeta::compact_marker()</code>로 UI 렌더링 구분 — 사용자는 요약과 실제 대화를 시각적으로 구별
        </p>

        {/* ── 6단계: 결과 반환 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">6단계 — CompactionResult 반환</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct CompactionResult {
    pub summary: Summary,              // 구조화 Summary 객체
    pub formatted_summary: String,     // XML 래핑 텍스트
    pub compacted_session: Session,    // 새 세션 (교체 대상)
    pub removed_count: usize,          // 제거된 메시지 수
    pub token_savings: usize,          // 절약된 추정 토큰
}

// 호출 사이트에서:
let result = compact_session(&session, &config)?;
self.session = result.compacted_session;
log::info!("compacted: removed {} msgs, saved ~{} tokens",
    result.removed_count, result.token_savings);`}</pre>
        <p>
          <code>summary</code>와 <code>formatted_summary</code>를 모두 반환 — 구조화 데이터와 텍스트를 UI가 선택적으로 사용<br />
          <code>removed_count</code>와 <code>token_savings</code>는 텔레메트리·UI 표시용 메타데이터<br />
          호출 사이트는 <code>compacted_session</code>만 사용하고 나머지는 로깅·관측용
        </p>

        {/* ── 절약 예시 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">실제 절약 예시</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">상황</th>
                <th className="border border-border px-3 py-2 text-right">압축 전</th>
                <th className="border border-border px-3 py-2 text-right">압축 후</th>
                <th className="border border-border px-3 py-2 text-right">절감률</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">코드베이스 탐색 (Read 45회)</td>
                <td className="border border-border px-3 py-2 text-right">120K tok</td>
                <td className="border border-border px-3 py-2 text-right">18K tok</td>
                <td className="border border-border px-3 py-2 text-right">85%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">리팩토링 (Edit 30회 + Read 20회)</td>
                <td className="border border-border px-3 py-2 text-right">95K tok</td>
                <td className="border border-border px-3 py-2 text-right">22K tok</td>
                <td className="border border-border px-3 py-2 text-right">77%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">디버깅 (Bash 15회 + Grep 40회)</td>
                <td className="border border-border px-3 py-2 text-right">160K tok</td>
                <td className="border border-border px-3 py-2 text-right">28K tok</td>
                <td className="border border-border px-3 py-2 text-right">82%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          * 추정치 — preserve_recent=15, max_estimated_tokens=160K 기준
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 구조화 Summary vs 자유형 요약</p>
          <p>
            <strong>자유형 요약의 단점</strong>: "LLM에게 요약해줘"라고 맡기면 매번 다른 포맷으로 출력<br />
            - 파싱 불가능 → merge_compact_summaries에서 재사용 어려움<br />
            - 길이 예측 불가 → 토큰 예산 넘칠 위험<br />
            - 일관성 없음 → 연속 압축 시 정보 유실 가중
          </p>
          <p className="mt-2">
            <strong>구조화 Summary의 장점</strong>:<br />
            - 고정 필드(scope, tool_usage 등) → 파싱 가능<br />
            - 각 필드가 독립적 용도 → 필요시 일부만 사용 가능<br />
            - 병합 로직 정의 가능 → 연쇄 압축에서 맥락 보존
          </p>
          <p className="mt-2">
            claw-code는 <strong>LLM 없이 Rust 코드로 요약을 생성</strong> — 정규식·HashMap·문자열 매칭 기반<br />
            LLM 호출 없음 → 토큰 비용 0, 결정론적, 0.1초 미만 실행<br />
            요약 품질은 "정확한 메타데이터"에 집중 — 자연어 서술이 아닌 사실 목록
          </p>
        </div>

      </div>
    </section>
  );
}
