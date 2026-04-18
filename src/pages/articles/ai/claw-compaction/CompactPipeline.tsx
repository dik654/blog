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
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">conversation_runtime.rs</div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">async fn</span>
              <span className="font-semibold text-sm">ensure_context_fits(&mut self) → Result&lt;()&gt;</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="shrink-0 text-muted-foreground font-mono text-xs mt-0.5">if</span>
                <span className="text-muted-foreground"><code className="text-xs">should_compact()</code> 확인 — true 시 압축 실행</span>
              </div>
              <div className="flex items-start gap-2 text-sm ml-4">
                <span className="shrink-0 text-muted-foreground font-mono text-xs mt-0.5">→</span>
                <span className="text-muted-foreground"><code className="text-xs">compact_session()</code> 호출 후 <code className="text-xs">self.session</code>을 교체</span>
              </div>
              <div className="flex items-start gap-2 text-sm ml-4">
                <span className="shrink-0 text-muted-foreground font-mono text-xs mt-0.5">→</span>
                <span className="text-muted-foreground"><code className="text-xs">Event::Compacted</code> 방출: <code className="text-xs">removed_count</code> + <code className="text-xs">summary_tokens</code></span>
              </div>
            </div>
          </div>
        </div>
        <p>
          자동 트리거는 API 호출 <strong>직전</strong>에 수행 — 토큰 초과 오류 방지<br />
          압축 후 <code>self.session</code>을 교체 — 이후 API 호출은 압축된 세션 사용<br />
          <code>Event::Compacted</code> 이벤트를 UI로 방출 → 사용자에게 "N개 메시지 압축됨" 표시
        </p>

        {/* ── 1단계: preserve_recent 분리 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — preserve_recent 분리</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">compact_session(session, config) → Result&lt;CompactionResult&gt;</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background border border-border rounded p-3">
                <div className="text-sm font-semibold mb-1">keep 계산</div>
                <p className="text-xs text-muted-foreground">
                  <code className="text-xs">config.preserve_recent_messages.min(total)</code><br />
                  메시지 수보다 preserve_recent가 크면 전체 보존
                </p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="text-sm font-semibold mb-1">split_at 분리</div>
                <p className="text-xs text-muted-foreground">
                  <code className="text-xs">split_at(total - keep)</code> — 참조 슬라이스 분리, 복사 없음, O(1)<br />
                  앞부분 = 압축 대상, 뒷부분 = 원본 보존
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>split_at()</code>는 슬라이스를 두 개로 쪼개는 Rust 표준 연산 — 복사 없음, O(1)<br />
          <strong>preserve_recent_messages 기본값 권장</strong>: 10-20<br />
          너무 작으면(예: 2) 현재 작업 맥락이 사라짐, 너무 크면(예: 100) 압축 효과 약화
        </p>

        {/* ── 2단계: 시스템 메시지 필터 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — 시스템 메시지 격리</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="font-semibold text-sm mb-2">partition() — 시스템 메시지 격리</div>
            <p className="text-xs text-muted-foreground mb-3">
              <code className="text-xs">old_messages</code>를 <code className="text-xs">partition()</code>으로 분리 — 조건 true는 <code className="text-xs">system_msgs</code>, false는 <code className="text-xs">compactable_msgs</code>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">제외 조건 1</div>
                <p className="text-xs text-muted-foreground"><code className="text-xs">Role::System</code> — 시스템 프롬프트</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">제외 조건 2</div>
                <p className="text-xs text-muted-foreground"><code className="text-xs">&lt;prior-context&gt;</code>로 시작 — 이전 압축 요약</p>
              </div>
            </div>
          </div>
        </div>
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
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-2">
              <code className="text-xs">let summary = summarize_messages(&compactable_msgs)?;</code>
            </div>
            <div className="font-semibold text-sm mb-3">Summary 구조체 — 6개 필드</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">scope: <span className="text-muted-foreground">String</span></div>
                <p className="text-xs text-muted-foreground mt-1">전체 작업 범위</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">current_work: <span className="text-muted-foreground">Option&lt;String&gt;</span></div>
                <p className="text-xs text-muted-foreground mt-1">진행 중 작업</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">pending_work: <span className="text-muted-foreground">Vec&lt;String&gt;</span></div>
                <p className="text-xs text-muted-foreground mt-1">미완 항목 리스트</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">tool_usage: <span className="text-muted-foreground">HashMap</span></div>
                <p className="text-xs text-muted-foreground mt-1">도구별 호출 횟수</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">file_candidates: <span className="text-muted-foreground">Vec&lt;PathBuf&gt;</span></div>
                <p className="text-xs text-muted-foreground mt-1">언급된 파일 경로</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">timeline: <span className="text-muted-foreground">Vec&lt;TimelineEvent&gt;</span></div>
                <p className="text-xs text-muted-foreground mt-1">주요 이벤트 시간순</p>
              </div>
            </div>
          </div>
        </div>
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
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">format_compact_summary(summary) → String</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3"><code className="text-xs">&lt;prior-context&gt;</code> XML 태그로 감싸진 마크다운 포맷 생성</p>
            <div className="bg-background border border-border rounded p-3">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="text-muted-foreground">&lt;prior-context&gt;</div>
                <div className="ml-3">
                  <div className="font-semibold">## 작업 범위</div>
                  <div className="text-muted-foreground ml-2">scope 내용</div>
                </div>
                <div className="ml-3">
                  <div className="font-semibold">## 진행 중</div>
                  <div className="text-muted-foreground ml-2">current_work <span className="italic">(있을 때만)</span></div>
                </div>
                <div className="ml-3">
                  <div className="font-semibold">## 미완료</div>
                  <div className="text-muted-foreground ml-2">- pending 항목들 <span className="italic">(비어있지 않을 때만)</span></div>
                </div>
                <div className="ml-3">
                  <div className="font-semibold">## 도구 사용</div>
                  <div className="text-muted-foreground ml-2">- tool: N회</div>
                </div>
                <div className="ml-3">
                  <div className="font-semibold">## 관련 파일</div>
                  <div className="text-muted-foreground ml-2">- 파일 경로들</div>
                </div>
                <div className="ml-3">
                  <div className="font-semibold">## 타임라인</div>
                  <div className="text-muted-foreground ml-2">- 이벤트 목록</div>
                </div>
                <div className="text-muted-foreground">&lt;/prior-context&gt;</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>출력 포맷</strong>: 마크다운 헤더 + XML 태그 래핑<br />
          <code>&lt;prior-context&gt;</code> 태그는 LLM에게 "이 부분이 압축 요약"임을 명시 — 파싱과 병합의 경계 역할<br />
          섹션 순서: 범위 → 진행 중 → 미완료 → 도구 사용 → 관련 파일 → 타임라인 (중요도 내림차순)
        </p>

        {/* ── 5단계: 압축 세션 조립 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">5단계 — 압축된 Session 재조립</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="font-semibold text-sm mb-3">새 세션 메시지 조립 순서</div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 bg-background border border-border rounded p-3">
                <span className="shrink-0 w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">a</span>
                <div>
                  <div className="text-sm font-semibold">시스템 메시지 보존</div>
                  <p className="text-xs text-muted-foreground"><code className="text-xs">system_msgs</code> 원본 그대로 삽입</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded p-3">
                <span className="shrink-0 w-6 h-6 rounded bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold">b</span>
                <div>
                  <div className="text-sm font-semibold">압축 요약 삽입</div>
                  <p className="text-xs text-muted-foreground">
                    <code className="text-xs">Role::User</code> + <code className="text-xs">formatted_summary</code> + <code className="text-xs">MessageMeta::compact_marker()</code>
                    <br />UI가 회색 톤으로 렌더링
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded p-3">
                <span className="shrink-0 w-6 h-6 rounded bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold">c</span>
                <div>
                  <div className="text-sm font-semibold">연속 메시지 추가</div>
                  <p className="text-xs text-muted-foreground"><code className="text-xs">get_compact_continuation_message()</code></p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded p-3">
                <span className="shrink-0 w-6 h-6 rounded bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-xs font-bold">d</span>
                <div>
                  <div className="text-sm font-semibold">최근 메시지 원본</div>
                  <p className="text-xs text-muted-foreground"><code className="text-xs">recent_messages</code> 그대로 복원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>새 세션 메시지 배치 순서</strong>: 시스템 → 요약 → 연속 메시지 → 최근 원본<br />
          압축 요약을 <strong>user 역할</strong>로 삽입 — LLM이 "사용자가 제공한 컨텍스트"로 인식하여 더 적극 참조<br />
          <code>MessageMeta::compact_marker()</code>로 UI 렌더링 구분 — 사용자는 요약과 실제 대화를 시각적으로 구별
        </p>

        {/* ── 6단계: 결과 반환 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">6단계 — CompactionResult 반환</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="font-semibold text-sm mb-3">CompactionResult 구조체</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">summary: <span className="text-muted-foreground">Summary</span></div>
                <p className="text-xs text-muted-foreground mt-1">구조화 Summary 객체</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">formatted_summary: <span className="text-muted-foreground">String</span></div>
                <p className="text-xs text-muted-foreground mt-1">XML 래핑 텍스트</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">compacted_session: <span className="text-muted-foreground">Session</span></div>
                <p className="text-xs text-muted-foreground mt-1">새 세션 (교체 대상)</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">removed_count: <span className="text-muted-foreground">usize</span></div>
                <p className="text-xs text-muted-foreground mt-1">제거된 메시지 수</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5 sm:col-span-2">
                <div className="text-xs font-mono font-semibold">token_savings: <span className="text-muted-foreground">usize</span></div>
                <p className="text-xs text-muted-foreground mt-1">절약된 추정 토큰</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">호출 사이트: <code className="text-xs">self.session = result.compacted_session</code>으로 교체 후 로깅</p>
          </div>
        </div>
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
