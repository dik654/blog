import SessionStructViz from './viz/SessionStructViz';
import MessageTypesViz from './viz/MessageTypesViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Session 구조 &amp; 메시지 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SessionStructViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Session — 대화 단위 상태 컨테이너</h3>
        <p>
          <code>Session</code>은 "하나의 대화 턴 집합 + 연관 메타데이터"를 담는 최상위 구조체<br />
          생명주기: 프로세스 시작 ~ 종료, 또는 <code>fork</code>로 분기된 시점 ~ 병합<br />
          모든 메시지·도구 호출·권한 결정·토큰 사용량이 하나의 Session에 누적
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">식별</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">id: SessionId</code></p>
            <p className="text-xs text-muted-foreground">UUID v4 — 세션 식별자, 로그·추적 키</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">분기</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">parent: Option&lt;SessionId&gt;</code></p>
            <p className="text-xs text-muted-foreground">fork로 파생된 경우 원본 세션 참조</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">대화</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">messages: Vec&lt;Message&gt;</code></p>
            <p className="text-xs text-muted-foreground">대화 메시지 배열 (아래 Message 구조)</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">도구</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">tool_calls: Vec&lt;ToolCallLog&gt;</code></p>
            <p className="text-xs text-muted-foreground">도구 호출 로그 — 디버깅·텔레메트리용</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">권한</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">permission_log: Vec&lt;PermDecision&gt;</code></p>
            <p className="text-xs text-muted-foreground">모든 권한 판정 이력 — Allow/Deny/Prompt</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">비용</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">token_usage: TokenUsage</code></p>
            <p className="text-xs text-muted-foreground">입력·출력·캐시 토큰 누적</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">경로</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">workspace_root: PathBuf</code></p>
            <p className="text-xs text-muted-foreground">워크스페이스 경계 검증 기준</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">시각</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">started_at: DateTime&lt;Utc&gt;</code></p>
            <p className="text-xs text-muted-foreground">세션 시작 시각 (UTC)</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">메타</div>
            <p className="text-sm font-semibold mb-1"><code className="text-xs">metadata: SessionMeta</code></p>
            <p className="text-xs text-muted-foreground">사용자 정의 태그·플래그</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Message — 대화 턴의 기본 단위</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2">Message 구조체</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs">role: Role</code>
                <p className="text-[11px] text-muted-foreground mt-1">User | Assistant | System | Tool</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs">content: Vec&lt;ContentBlock&gt;</code>
                <p className="text-[11px] text-muted-foreground mt-1">멀티모달 콘텐츠 블록</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs">timestamp</code>
                <p className="text-[11px] text-muted-foreground mt-1">DateTime&lt;Utc&gt;</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs">metadata</code>
                <p className="text-[11px] text-muted-foreground mt-1">MessageMeta</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm font-semibold mb-2">Role (4종)</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-blue-500" /><span className="text-sm"><code className="text-xs">User</code> — 사용자 입력</span></div>
                <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-green-500" /><span className="text-sm"><code className="text-xs">Assistant</code> — LLM 응답</span></div>
                <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-gray-400" /><span className="text-sm"><code className="text-xs">System</code> — 시스템 프롬프트</span></div>
                <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-orange-500" /><span className="text-sm"><code className="text-xs">Tool</code> — 도구 실행 결과</span></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Anthropic Messages API 스키마와 정렬</p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm font-semibold mb-2">ContentBlock (4종)</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2"><span className="text-sm font-mono text-muted-foreground shrink-0">Text</span><span className="text-sm">일반 텍스트 (<code className="text-xs">String</code>)</span></div>
                <div className="flex items-start gap-2"><span className="text-sm font-mono text-muted-foreground shrink-0">ToolUse</span><span className="text-sm">도구 호출 요청 (<code className="text-xs">id, name, input</code>)</span></div>
                <div className="flex items-start gap-2"><span className="text-sm font-mono text-muted-foreground shrink-0">ToolResult</span><span className="text-sm">도구 결과 (<code className="text-xs">tool_use_id, output, is_error</code>)</span></div>
                <div className="flex items-start gap-2"><span className="text-sm font-mono text-muted-foreground shrink-0">Image</span><span className="text-sm">이미지 (<code className="text-xs">media_type, data</code>)</span></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">하나의 Message에 여러 ContentBlock 가능 — 예: 텍스트 + 병렬 도구 호출 3개</p>
            </div>
          </div>
        </div>
      </div>
      <MessageTypesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TokenUsage — 세부 토큰 회계</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold"><code className="text-xs">input_tokens</code></p>
              <p className="text-xs text-muted-foreground mt-1">입력 토큰 (누적)</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">표준 요금</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold"><code className="text-xs">output_tokens</code></p>
              <p className="text-xs text-muted-foreground mt-1">출력 토큰 (누적)</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">표준 요금</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold"><code className="text-xs">cache_creation</code></p>
              <p className="text-xs text-muted-foreground mt-1">프롬프트 캐시 생성 비용</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">1.25배 요금</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold"><code className="text-xs">cache_read</code></p>
              <p className="text-xs text-muted-foreground mt-1">캐시 적중으로 절약</p>
              <p className="text-[11px] text-green-600 dark:text-green-400 mt-1">0.1배 요금 — 대폭 절감</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2"><code className="text-xs">total_cost_usd()</code> — USD 비용 계산</p>
            <p className="text-xs text-muted-foreground">
              모델별 단가 테이블(<code className="text-xs">ModelInfo::pricing</code>) 조회 후, 4종 토큰 각각에 단가를 곱하여 합산.
              Anthropic API 응답의 <code className="text-xs">usage</code> 필드 구조와 동일. 사용자에게 실시간 표시.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">세션 생성 & 초기화</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2"><code className="text-xs">Session::new(workspace_root)</code></p>
            <p className="text-xs text-muted-foreground mb-2">빈 세션 생성 — 워크스페이스 경로만 필수</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" /><span><code className="text-[11px]">SessionId::new()</code> — UUID v4 생성</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" /><span><code className="text-[11px]">parent: None</code></span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" /><span>모든 컬렉션 빈 상태</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" /><span><code className="text-[11px]">Utc::now()</code> 시작 시각</span></div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2"><code className="text-xs">Session::fork()</code></p>
            <p className="text-xs text-muted-foreground mb-2">현재 상태를 복제 후 부모 링크 설정 — "대화 분기"</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /><span>새 <code className="text-[11px]">SessionId</code> 발급</span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /><span><code className="text-[11px]">parent = Some(self.id)</code></span></div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /><span><code className="text-[11px]">messages.clone()</code> — 전체 복사</span></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">가설 탐색에 유용 — 원본 대화를 깨뜨리지 않고 실험 가능</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ContentBlock 직렬화 — Anthropic API 매핑</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3">ContentBlock 직렬화 — Rust enum → JSON</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded border bg-muted/50 p-3">
                <p className="text-xs font-semibold mb-1">Text</p>
                <p className="text-xs font-mono text-muted-foreground">{"{"} "type": "text", "text": "..." {"}"}</p>
              </div>
              <div className="rounded border bg-muted/50 p-3">
                <p className="text-xs font-semibold mb-1">ToolUse</p>
                <p className="text-xs font-mono text-muted-foreground">{"{"} "type": "tool_use", "id": "toolu_01", "name": "read_file", "input": {"{"}"path":"src/main.rs"{"}"} {"}"}</p>
              </div>
              <div className="rounded border bg-muted/50 p-3">
                <p className="text-xs font-semibold mb-1">ToolResult</p>
                <p className="text-xs font-mono text-muted-foreground">{"{"} "type": "tool_result", "tool_use_id": "...", "output": "..." {"}"}</p>
              </div>
              <div className="rounded border bg-muted/50 p-3">
                <p className="text-xs font-semibold mb-1">Image</p>
                <p className="text-xs font-mono text-muted-foreground">{"{"} "type": "image", "media_type": "image/png", "data": "..." {"}"}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <code className="text-xs">type</code> 필드가 discriminator — 수신 측에서 enum 분기 결정.
            Rust 내부 표현과 API wire format 사이에 <strong>변환 층 없음</strong> → 오버헤드 최소
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Session Lifecycle 상태 전이</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 p-4">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Active</p>
              <p className="text-xs text-muted-foreground mt-1">정상 동작 — 메시지 수신·처리</p>
              <p className="text-[11px] font-mono text-muted-foreground mt-2">저장: 메모리 (핫 데이터)</p>
            </div>
            <div className="rounded-lg border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-4">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Suspended</p>
              <p className="text-xs text-muted-foreground mt-1">일시 정지 — UI 닫혔지만 복원 가능</p>
              <p className="text-[11px] font-mono text-muted-foreground mt-2">저장: 메모리 + 디스크 (checkpoint)</p>
            </div>
            <div className="rounded-lg border-2 border-red-500/50 bg-red-50 dark:bg-red-950/20 p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Terminated</p>
              <p className="text-xs text-muted-foreground mt-1">종료 — 리소스 해제, 복원 불가</p>
              <p className="text-[11px] font-mono text-muted-foreground mt-2">저장: 디스크 전용 (immutable archive)</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold mb-2">상태 전이</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              <div><span className="text-green-600 dark:text-green-400">Active</span> → <span className="text-amber-600 dark:text-amber-400">Suspended</span>: 사용자가 UI 닫음 or 네트워크 끊김</div>
              <div><span className="text-amber-600 dark:text-amber-400">Suspended</span> → <span className="text-green-600 dark:text-green-400">Active</span>: 사용자 재연결</div>
              <div><span className="text-green-600 dark:text-green-400">Active</span> → <span className="text-red-600 dark:text-red-400">Terminated</span>: /exit 또는 에러</div>
              <div><span className="text-amber-600 dark:text-amber-400">Suspended</span> → <span className="text-red-600 dark:text-red-400">Terminated</span>: 24시간 경과</div>
            </div>
          </div>
        </div>
        <p>
          <strong>3단계 lifecycle</strong>로 메모리 사용량과 복원 가능성의 균형<br />
          Suspended 상태의 세션은 토큰 사용량이 합산되지 않음 — 비용 절감<br />
          Terminated 후에도 archive에서 세션 로그 조회 가능 — 디버깅 지원
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Session 중심 아키텍처의 장점</p>
          <p>
            "모든 상태를 Session 하나에 모음" → 디버깅·재현·테스트가 간결<br />
            - <strong>재현</strong>: Session을 JSON으로 직렬화하여 버그 리포트에 첨부 가능<br />
            - <strong>테스트</strong>: 원하는 Session 상태를 만들어 특정 시나리오 재현<br />
            - <strong>fork</strong>: 상태 복제 비용이 낮음 (clone 가능한 구조체만)
          </p>
          <p className="mt-2">
            반대 극: "상태를 여러 서비스에 분산" — 관측은 편하지만 재현 어려움<br />
            claw-code는 단일 프로세스·단일 세션 모델로 복잡도 최소화
          </p>
        </div>

      </div>
    </section>
  );
}
