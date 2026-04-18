import TurnLoopViz from './viz/TurnLoopViz';
import AgentLoopDetailViz from './viz/AgentLoopDetailViz';

export default function ConversationRuntime() {
  return (
    <section id="conversation-runtime" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ConversationRuntime 오케스트레이션</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TurnLoopViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">에이전트 루프의 중심</h3>
        <p>
          <code>ConversationRuntime</code>은 LLM 대화 루프의 오케스트레이터<br />
          역할: 사용자 입력 → API 호출 → 응답 파싱 → 도구 실행 → 반복<br />
          다른 모든 runtime 서브시스템(enforcer, hooks, compact)을 소유하고 조율
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold"><code className="text-xs">session: Session</code></p>
            <p className="text-xs text-muted-foreground mt-1">현재 세션 상태 컨테이너</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold"><code className="text-xs">client: Box&lt;dyn ProviderClient&gt;</code></p>
            <p className="text-xs text-muted-foreground mt-1">API 클라이언트 추상화 — 런타임에 프로바이더 교체 가능</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold"><code className="text-xs">enforcer: PermissionEnforcer</code></p>
            <p className="text-xs text-muted-foreground mt-1">도구 호출 전 권한 게이트</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold"><code className="text-xs">hooks: HookRunner</code></p>
            <p className="text-xs text-muted-foreground mt-1">Pre/Post 훅 실행기</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold"><code className="text-xs">compact_config: CompactionConfig</code></p>
            <p className="text-xs text-muted-foreground mt-1">컨텍스트 압축 설정</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold"><code className="text-xs">event_tx: Sender&lt;RuntimeEvent&gt;</code></p>
            <p className="text-xs text-muted-foreground mt-1">mpsc 채널 — 비동기 UI 이벤트 전송</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">run_turn() — 단일 턴 처리</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">run_turn(user_input)</code> — 8단계 턴 루프</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">1</span>
                <div><p className="text-xs font-semibold">사용자 메시지 추가</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">messages.push(Message::user(input))</code></p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">2</span>
                <div><p className="text-xs font-semibold">컨텍스트 적합성 검사</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">ensure_context_fits()</code> — 토큰 초과 시 압축 트리거</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">3</span>
                <div><p className="text-xs font-semibold">API 호출 (스트리밍)</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">client.send_message(build_request())</code></p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">4</span>
                <div><p className="text-xs font-semibold">스트림 수신 & 파싱</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">consume_stream()</code> — SSE 상태 머신</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">5</span>
                <div><p className="text-xs font-semibold">응답 기록</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">messages.push(assistant)</code> + <code className="text-[11px]">token_usage.accumulate()</code></p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0 mt-0.5">6</span>
                <div><p className="text-xs font-semibold">tool_use 추출</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">ContentBlock::ToolUse</code> 필터 — 없으면 <code className="text-[11px]">break</code></p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0 mt-0.5">7</span>
                <div><p className="text-xs font-semibold">도구 병렬 실행</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">handle_tool_uses_parallel(tool_uses)</code></p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0 mt-0.5">8</span>
                <div><p className="text-xs font-semibold">tool_result 추가 → 루프</p><p className="text-[11px] text-muted-foreground">LLM이 후속 도구 호출을 요청할 수 있으므로 3번으로 돌아감</p></div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              루프 종료 조건: LLM 응답에 <code className="text-[11px]">tool_use</code>가 없을 때. 최대 체인 길이 기본 25 (설정 가능)
            </p>
          </div>
        </div>

      </div>
      <AgentLoopDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">consume_stream() — SSE 파서</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">consume_stream()</code> — SSE 상태 머신</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground w-32 shrink-0"><code className="text-[11px]">MessageStart</code></span>
                <span className="text-muted-foreground">→</span>
                <span><code className="text-[11px]">builder.set_id(id)</code></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground w-32 shrink-0"><code className="text-[11px]">ContentBlockStart</code></span>
                <span className="text-muted-foreground">→</span>
                <span><code className="text-[11px]">builder.open_block(index, block)</code></span>
              </div>
              <div className="flex items-center gap-2 text-xs rounded bg-blue-50 dark:bg-blue-950/30 p-1.5">
                <span className="font-mono text-blue-600 dark:text-blue-400 w-32 shrink-0"><code className="text-[11px]">ContentBlockDelta</code></span>
                <span className="text-muted-foreground">→</span>
                <span><code className="text-[11px]">apply_delta()</code> + UI에 실시간 이벤트 전파</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground w-32 shrink-0"><code className="text-[11px]">ContentBlockStop</code></span>
                <span className="text-muted-foreground">→</span>
                <span><code className="text-[11px]">builder.close_block(index)</code></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground w-32 shrink-0"><code className="text-[11px]">MessageDelta</code></span>
                <span className="text-muted-foreground">→</span>
                <span><code className="text-[11px]">builder.set_usage(usage, stop_reason)</code></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground w-32 shrink-0"><code className="text-[11px]">MessageStop</code></span>
                <span className="text-muted-foreground">→</span>
                <span><code className="text-[11px]">break</code> — <code className="text-[11px]">builder.finalize()</code> 호출</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              <code className="text-[11px]">ResponseBuilder</code>는 청크를 누적하여 완전한 메시지를 조립. 각 Delta는 UI에 즉시 전파 — 스트리밍 경험 제공
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">build_request() — API 요청 조립</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">build_request()</code> — API 요청 조립</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold"><code className="text-[11px]">model</code></p>
                <p className="text-[11px] text-muted-foreground">모델명 (config 참조)</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold"><code className="text-[11px]">system</code></p>
                <p className="text-[11px] text-muted-foreground">시스템 프롬프트 (별도 필드)</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold"><code className="text-[11px]">messages</code></p>
                <p className="text-[11px] text-muted-foreground">System 제외, API 형식 변환</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold"><code className="text-[11px]">tools</code></p>
                <p className="text-[11px] text-muted-foreground">40+ 도구 Anthropic 형식 직렬화</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold"><code className="text-[11px]">max_tokens</code></p>
                <p className="text-[11px] text-muted-foreground">최대 출력 토큰 수</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold"><code className="text-[11px]">stream: true</code></p>
                <p className="text-[11px] text-muted-foreground">항상 스트리밍 모드</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              System 메시지는 배열에서 필터링되어 별도 <code className="text-[11px]">system</code> 필드로 이동 — Anthropic API 규격
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">에러 처리 & 재시도</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">call_with_retry()</code> — 3가지 에러 처리</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-3">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">재시도 가능 (5xx, 429)</p>
                <p className="text-[11px] text-muted-foreground mt-1">지수 백오프로 재시도</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-1">250ms × 2^attempt</p>
              </div>
              <div className="rounded-lg border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-950/20 p-3">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">컨텍스트 초과</p>
                <p className="text-[11px] text-muted-foreground mt-1">즉시 압축 후 재시도</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-1"><code className="text-[11px]">force_compact()</code> — 사용자 개입 없음</p>
              </div>
              <div className="rounded-lg border-2 border-red-500/50 bg-red-50 dark:bg-red-950/20 p-3">
                <p className="text-xs font-semibold text-red-700 dark:text-red-400">기타 오류</p>
                <p className="text-[11px] text-muted-foreground mt-1">즉시 전파</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-1"><code className="text-[11px]">return Err(e)</code> — 사용자 처리</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 도구 루프의 무한 실행 방지</p>
          <p>
            LLM이 도구 호출을 반복하며 무한 루프에 빠질 수 있음 — 같은 도구 계속 호출, 진전 없는 상태<br />
            claw-code의 방어책:<br />
            - <strong>최대 체인 길이 25</strong>: 기본값, 설정으로 조정<br />
            - <strong>반복 패턴 감지</strong>: 같은 도구를 같은 입력으로 3회 연속 호출 시 경고<br />
            - <strong>토큰 예산 체크</strong>: 매 턴 시작 시 ensure_context_fits() — 초과 시 압축
          </p>
          <p className="mt-2">
            트레이드오프: 25가 너무 작으면 복잡한 태스크 실패, 너무 크면 비용 폭증<br />
            경험적 관찰: 대부분의 코딩 태스크는 10-15턴 내 완료
          </p>
        </div>

      </div>
    </section>
  );
}
