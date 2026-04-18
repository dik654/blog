import MergeSummaryViz from './viz/MergeSummaryViz';
import ContinuousMergeViz from './viz/ContinuousMergeViz';

export default function SummaryMerge() {
  return (
    <section id="summary-merge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">요약 병합 & 연속 압축</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <MergeSummaryViz />
      </div>
      <ContinuousMergeViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 연쇄 압축의 필요성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">연쇄 압축 — 왜 단일 압축으로는 부족한가</h3>
        <p>
          장시간 작업(예: 하루 종일 코드베이스 탐색)에서는 1회 압축으로 부족<br />
          대화 진행 → 압축 → 대화 진행 → 또 압축... 연쇄적으로 발생<br />
          문제: <strong>매 압축마다 이전 요약이 "새 메시지"로 취급되어 다시 요약 대상이 됨</strong> → 정보가 점점 얇아짐
        </p>
        <div className="not-prose my-4">
          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-3">순진한 구현의 문제 (버그)</div>
            <div className="space-y-2">
              <div className="bg-background border border-border rounded p-3">
                <div className="text-xs font-semibold mb-1">1차 압축</div>
                <p className="text-xs text-muted-foreground">메시지 100개 → 요약 A (3K tok) / 세션 = [요약 A] + 최근 15개</p>
              </div>
              <div className="bg-background border border-red-200 dark:border-red-800 rounded p-3">
                <div className="text-xs font-semibold mb-1">2차 압축</div>
                <p className="text-xs text-muted-foreground">메시지 115개(요약 A 포함) → 요약 B / 세션 = [요약 B] + 최근 15개</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">요약 B는 요약 A를 "일반 메시지"로 보고 요약 — 정보 2중 손실</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>정답</strong>: 이전 요약(A)을 감지하고 <em>병합</em> — 원본 데이터를 유지하면서 통합<br />
          <code>merge_compact_summaries()</code>가 이 역할 담당
        </p>

        {/* ── 병합 흐름 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">merge_compact_summaries() 흐름</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">merge_compact_summaries(prev, new_raw) → Summary</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              <code className="text-xs">prev</code>이 <code className="text-xs">None</code>이면 <code className="text-xs">new_raw</code> 그대로 사용 / <code className="text-xs">Some</code>이면 필드별 병합:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">scope</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">merge_scope()</code> — 문장 수준 결합</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">current_work</div>
                <p className="text-xs text-muted-foreground mt-1">최신값 우선 (staleness 방지)</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">pending_work</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">union_sets()</code> — 합집합, 중복 제거</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">tool_usage</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">merge_counters()</code> — 호출 횟수 누적</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">file_candidates</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">union_paths()</code> — 경로 합집합</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">timeline</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">merge_timelines()</code> — 시간순 병합 정렬</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>필드별 병합 전략</strong>:<br />
          - <code>scope</code>: 문자열 결합 (range accumulation)<br />
          - <code>current_work</code>: 최신값 우선 (staleness 방지)<br />
          - <code>pending_work</code>, <code>file_candidates</code>: 집합 연산 (합집합)<br />
          - <code>tool_usage</code>: 카운터 누적 (Read 45 + 30 = 75)<br />
          - <code>timeline</code>: 시간순 정렬 유지하며 병합 (merge sort)
        </p>

        {/* ── 이전 요약 추출 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">이전 요약 추출 — extract_prior_summary()</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">extract_prior_summary(messages) → Option&lt;Summary&gt;</span>
            </div>
            <p className="text-xs text-muted-foreground">
              메시지 중 <code className="text-xs">Role::User</code>이면서 <code className="text-xs">&lt;prior-context&gt;</code>로 시작하고 <code className="text-xs">&lt;/prior-context&gt;</code>로 끝나는 것 탐지 → <code className="text-xs">parse_prior_context()</code>로 파싱
            </p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">parse_prior_context(text) → Option&lt;Summary&gt;</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2"><code className="text-xs">## </code> 헤더로 섹션 분리 후 각 섹션을 해당 파서로 처리</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-background border border-border rounded p-2 text-xs">
                <span className="font-mono font-semibold">"작업 범위"</span>
                <span className="text-muted-foreground ml-1">→ scope</span>
              </div>
              <div className="bg-background border border-border rounded p-2 text-xs">
                <span className="font-mono font-semibold">"진행 중"</span>
                <span className="text-muted-foreground ml-1">→ current_work</span>
              </div>
              <div className="bg-background border border-border rounded p-2 text-xs">
                <span className="font-mono font-semibold">"미완료"</span>
                <span className="text-muted-foreground ml-1">→ pending_work</span>
              </div>
              <div className="bg-background border border-border rounded p-2 text-xs">
                <span className="font-mono font-semibold">"도구 사용"</span>
                <span className="text-muted-foreground ml-1">→ tool_usage</span>
              </div>
              <div className="bg-background border border-border rounded p-2 text-xs">
                <span className="font-mono font-semibold">"관련 파일"</span>
                <span className="text-muted-foreground ml-1">→ file_candidates</span>
              </div>
              <div className="bg-background border border-border rounded p-2 text-xs">
                <span className="font-mono font-semibold">"타임라인"</span>
                <span className="text-muted-foreground ml-1">→ timeline</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>파서 전략</strong>: <code>## </code> 헤더로 섹션 분리 후 각 섹션을 해당 파서로 처리<br />
          <code>split_once('\n')</code>: 첫 줄(헤더)과 나머지(본문) 분리<br />
          포맷이 정확히 고정되어 있어 파서가 단순 — <code>format_compact_summary()</code>의 출력 포맷과 대칭
        </p>

        {/* ── 시간선 병합 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">merge_timelines() — 시간순 병합</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="font-semibold text-sm mb-3">TimelineEvent 구조체</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">timestamp: <span className="text-muted-foreground">DateTime&lt;Utc&gt;</span></div>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">kind: <span className="text-muted-foreground">EventKind</span></div>
                <p className="text-xs text-muted-foreground mt-1">UserMsg | ToolCall | Error | Milestone</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">summary: <span className="text-muted-foreground">String</span></div>
                <p className="text-xs text-muted-foreground mt-1">예: "Edit: main.rs 수정 (245줄)"</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">merge_timelines(prev, new) → Vec&lt;TimelineEvent&gt;</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Merge sort — 양쪽 입력이 이미 시간순 정렬 → O(n+m) 병합이 정렬 O(n log n)보다 빠름<br />
              <code className="text-xs">prev[i].timestamp &lt;= new[j].timestamp</code>이면 prev를, 아니면 new를 선택 후 나머지를 <code className="text-xs">extend_from_slice</code>
            </p>
          </div>
        </div>
        <p>
          <strong>Merge sort 선택 이유</strong>: 양쪽 입력이 이미 시간순 정렬 → O(n+m) 병합이 정렬(O(n log n))보다 빠름<br />
          <code>TimelineEvent::kind</code>의 4가지 분류: UserMsg(사용자 입력), ToolCall(도구 호출), Error(오류), Milestone(주요 이정표)<br />
          UI는 kind별로 다른 아이콘 렌더링 — 사용자가 대화 흐름을 빠르게 스캔 가능
        </p>

        {/* ── 타임라인 가지치기 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">타임라인 가지치기 — 크기 상한</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">prune_timeline(timeline) → Vec&lt;TimelineEvent&gt;</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">상한: <code className="text-xs">MAX_TIMELINE_EVENTS = 50</code> — 초과 시 가지치기</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                  <span className="text-xs font-semibold">필수 보존</span>
                </div>
                <p className="text-xs text-muted-foreground">Milestone + Error는 무조건 보존</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-xs font-semibold">최근 N개 유지</span>
                </div>
                <p className="text-xs text-muted-foreground">나머지는 최근 것만 유지, old UserMsg/ToolCall 희생</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
                  <span className="text-xs font-semibold">재병합 & 정렬</span>
                </div>
                <p className="text-xs text-muted-foreground">시간순으로 재정렬</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>3단계 가지치기</strong>:<br />
          1. Milestone·Error는 보존 필수 — 중요 이벤트 유실 방지<br />
          2. 나머지는 최근 N개만 유지 — old UserMsg/ToolCall은 희생<br />
          3. 재정렬 — 섞인 순서를 시간순으로 복원
        </p>
        <p>
          <strong>상한 50개</strong>: 너무 크면 요약 토큰 비대, 너무 작으면 맥락 부족 — 경험적 타협점<br />
          대화 100턴 이상에서도 타임라인은 50개 유지 → 요약 토큰 상한 보장
        </p>

        {/* ── scope 병합 전략 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">merge_scope() — 작업 범위 확장</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">merge_scope(prev, new) → String</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-semibold mb-1">동일 범위</div>
                <p className="text-xs text-muted-foreground"><code className="text-xs">prev == new</code> → 중복 제거, 그대로 반환</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-semibold mb-1">new가 prev의 확장</div>
                <p className="text-xs text-muted-foreground"><code className="text-xs">new.contains(prev)</code> → new만 사용</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-semibold mb-1">prev가 new의 확장</div>
                <p className="text-xs text-muted-foreground"><code className="text-xs">prev.contains(new)</code> → 축소 방지, prev 유지</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-semibold mb-1">교차 없음</div>
                <p className="text-xs text-muted-foreground">세미콜론으로 결합: <code className="text-xs">"prev; new"</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4가지 케이스</strong>:<br />
          1. 동일 범위 → 중복 제거<br />
          2. new가 prev를 포함 → 확장된 범위로 대체<br />
          3. prev가 new를 포함 → 축소 방지, 기존 유지<br />
          4. 교차 없음 → 세미콜론으로 결합 (맥락 확장)
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 연쇄 압축이 만드는 장기 기억 구조</p>
          <p>
            merge_compact_summaries 덕분에 대화 턴 수가 <strong>무제한</strong>으로 확장 가능<br />
            토큰 예산은 고정이지만, 요약 연쇄로 <strong>"대화 전체의 메타데이터"</strong>를 계속 보유<br />
            실제 사용 사례: 며칠에 걸친 코드 리뷰, 장기 리팩토링, 다단계 디버깅
          </p>
          <p className="mt-2">
            <strong>정보 손실 곡선</strong>:<br />
            - 원본 메시지 텍스트 → <strong>손실</strong> (1차 압축에서 제거)<br />
            - 도구 호출 결과 내용 → <strong>손실</strong> (횟수만 남김)<br />
            - 파일 경로·오류 요약·이정표 → <strong>보존</strong> (구조화 Summary)
          </p>
          <p className="mt-2">
            결과적으로 <strong>"작업의 뼈대"는 남고 "살"은 깎임</strong> — LLM이 전체 흐름을 이해하기에 충분한 수준<br />
            필요시 사용자가 <code>read_file()</code>로 원본 파일을 다시 읽게 하여 세부 복원 가능<br />
            압축된 요약은 <em>인덱스</em>, 원본 파일은 <em>데이터</em> — 두 레이어 구조가 무한 대화를 가능하게 함
          </p>
        </div>

      </div>
    </section>
  );
}
