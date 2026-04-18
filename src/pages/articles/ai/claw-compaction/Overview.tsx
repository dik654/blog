import CompactionTriggerViz from './viz/CompactionTriggerViz';
import TokenBudgetViz from './viz/TokenBudgetViz';
import SummaryFanInViz from './viz/SummaryFanInViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨텍스트 압축</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CompactionTriggerViz />
      </div>
      <TokenBudgetViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 1. 압축이 필요한 이유 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">압축이 필요한 이유</h3>
        <p>
          LLM 컨텍스트 윈도우는 유한 — Claude Code 기준 ~200K 토큰<br />
          시스템 프롬프트, 도구 정의, CLAUDE.md 등 오버헤드를 빼면 실제 사용 가능량은 ~160-170K<br />
          긴 대화에서 오래된 메시지를 그대로 두면 토큰 예산을 초과하여 API 호출이 실패하거나 응답 품질이 급락<br />
          compact.rs(689 LOC)가 오래된 메시지를 구조화된 요약으로 교체하여 대화를 무한히 이어갈 수 있게 함
        </p>
        <p>
          압축의 핵심 트레이드오프: <strong>정보 손실 vs 컨텍스트 연속성</strong><br />
          모든 메시지를 보존하면 토큰 한계에 도달 → 대화 중단<br />
          전부 삭제하면 맥락을 잃음 → 작업 반복<br />
          요약으로 교체하면 핵심 맥락을 유지하면서 토큰을 60-80% 절감
        </p>

        {/* ── 2. CompactionConfig ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CompactionConfig — 압축 설정</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">CompactionConfig</div>
            <div className="font-semibold text-sm mb-2">preserve_recent_messages: <code className="text-xs bg-muted px-1 py-0.5 rounded">usize</code></div>
            <p className="text-sm text-muted-foreground">보존할 최근 메시지 수 — 절대 압축하지 않는 마지막 N개</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">CompactionConfig</div>
            <div className="font-semibold text-sm mb-2">max_estimated_tokens: <code className="text-xs bg-muted px-1 py-0.5 rounded">usize</code></div>
            <p className="text-sm text-muted-foreground">최대 토큰 예산 — 이 값을 초과하면 압축 트리거</p>
          </div>
        </div>
        <p>
          <code>preserve_recent_messages</code> — 절대 압축하지 않는 최근 메시지 개수<br />
          LLM은 최근 컨텍스트에 가장 강한 attention을 보이므로 최근 메시지를 원본 그대로 보존<br />
          <code>max_estimated_tokens</code> — 이 값을 초과하면 자동으로 압축이 트리거<br />
          보통 컨텍스트 윈도우의 75-92% 수준으로 설정하여 안전 마진 확보
        </p>

        {/* ── 3. should_compact() 판정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">should_compact() — 압축 판정</h3>
        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">should_compact(session, config) → bool</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">estimate_session_tokens(session)</code>이 <code className="text-xs">config.max_estimated_tokens</code>를 초과하면 <code className="text-xs">true</code> 반환
            </p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">estimate_session_tokens(session) → usize</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              메시지 텍스트의 총 문자 수를 4로 나눠 토큰 수를 근사
            </p>
            <div className="text-xs font-mono bg-muted rounded px-2 py-1 inline-block">
              session.messages.iter().map(|m| m.content.len()).sum::&lt;usize&gt;() / 4
            </div>
            <p className="text-xs text-muted-foreground mt-1">영어 기준 약 4바이트 = 1토큰 (BPE 토크나이저 근사)</p>
          </div>
        </div>
        <p>
          <code>estimate_session_tokens()</code>는 텍스트 길이를 4로 나눠 토큰 수를 근사<br />
          영어 기준 약 4바이트 = 1토큰이라는 경험적 근사 — 정확한 BPE 토큰화 없이도 실용적으로 작동<br />
          한국어·중국어 등 다중바이트 문자는 바이트당 토큰 비율이 다르지만,
          과대추정 방향이므로 안전 마진으로 기능 — 실제보다 일찍 압축을 트리거하여 한계 초과를 방지
        </p>

        {/* ── 4. compact_session() 파이프라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">compact_session() — 압축 파이프라인</h3>
        <p>
          파이프라인은 6단계로 구성되며, 각 단계가 명확한 단일 책임을 가짐<br />
          <strong>1단계</strong>: 최근 N개 메시지를 분리하여 원본 그대로 보존 — 현재 진행 중인 작업 맥락 유지<br />
          <strong>2단계</strong>: 나머지 오래된 메시지를 압축 대상으로 분류<br />
          <strong>3단계</strong>: 오래된 메시지에서 scope(작업 범위), tools(도구 사용), timeline(이벤트 시간순)을 추출<br />
          <strong>4단계</strong>: 구조화된 요약을 LLM이 이해할 수 있는 텍스트로 포맷<br />
          <strong>5단계</strong>: 압축 후 연속 메시지를 생성하여 대화 흐름 유지<br />
          <strong>6단계</strong>: 결과를 CompactionResult로 반환 — 압축된 세션 + 메타데이터
        </p>

        {/* ── 5. summarize_messages() 내부 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">summarize_messages() — 요약 생성 내부</h3>
        <SummaryFanInViz />
        <p>
          <code>extract_file_candidates()</code>는 메시지 텍스트에서 파일 경로를 정규식으로 추출<br />
          이 정보는 압축 후에도 "어떤 파일을 다뤘는지" 맥락을 보존하는 데 핵심적<br />
          <code>infer_current_work()</code>와 <code>infer_pending_work()</code>는 작업 연속성을 보장 —
          압축 후 LLM이 "지금 뭘 하고 있었는지" 즉시 파악 가능<br />
          도구별 호출 횟수 집계는 작업 패턴을 요약 — 예를 들어 Read가 많으면 탐색 단계,
          Edit가 많으면 구현 단계라는 맥락 제공
        </p>

        {/* ── 6. merge_compact_summaries() — 연속 압축 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">merge_compact_summaries() — 연속 압축</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">merge_compact_summaries(prev_summary, new_summary) → MergedSummary</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-muted-foreground"><code className="text-xs">&lt;prior-context&gt;</code> XML 태그에서 이전 요약 추출</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-muted-foreground">이전 요약의 scope, tools, timeline을 파싱</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-muted-foreground">새 요약과 병합: scope 통합, tools 누적, timeline 병합 정렬</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
                <span className="text-muted-foreground">병합된 요약을 새 <code className="text-xs">&lt;prior-context&gt;</code>로 래핑</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">대화가 아무리 길어도 전체 맥락의 연쇄 보존</p>
        </div>
        <p>
          대화가 매우 길면 압축이 여러 번 발생<br />
          1차 압축 → 요약 A 생성<br />
          2차 압축 → 요약 A + 새 메시지 → 요약 B로 병합<br />
          3차 압축 → 요약 B + 새 메시지 → 요약 C로 병합<br />
          이 연쇄 구조 덕분에 아무리 긴 대화도 전체 맥락을 잃지 않음<br />
          <code>&lt;prior-context&gt;</code> XML 태그는 이전 요약과 새 요약의 경계를 명확히 구분 —
          파싱과 병합을 안정적으로 수행할 수 있게 함
        </p>

        {/* ── 7. get_compact_continuation_message() ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">get_compact_continuation_message() — 연속 메시지</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">get_compact_continuation_message() → Message</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">압축 후 LLM에게 전달하는 연속 메시지 — <code className="text-xs">SYSTEM_PROMPT_DYNAMIC_BOUNDARY</code> 마커로 삽입 위치 지정</p>
            <div className="bg-background border border-border rounded p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs font-mono bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">role</span>
                <span className="font-mono text-sm">"user"</span>
                <span className="text-xs text-muted-foreground">(시스템이 아닌 사용자 메시지로 삽입)</span>
              </div>
              <div className="text-sm">
                <span className="text-xs font-mono bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">content</span>
                <div className="mt-1 ml-2 space-y-1 text-xs font-mono text-muted-foreground">
                  <div>"--- 컨텍스트 압축 발생 ---"</div>
                  <div className="text-foreground">formatted_summary</div>
                  <div>"위 요약을 참고하여 이어서 작업하세요."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          연속 메시지는 <code>user</code> 역할로 삽입 — assistant 역할이 아닌 이유는
          LLM이 사용자의 지시로 인식하여 요약을 더 적극적으로 참조하기 때문<br />
          <code>SYSTEM_PROMPT_DYNAMIC_BOUNDARY</code> 마커는 시스템 프롬프트 내에서
          동적으로 변하는 컨텍스트(압축 요약, 현재 작업 상태)가 삽입되는 위치를 표시<br />
          이 설계로 정적 시스템 프롬프트와 동적 컨텍스트가 깔끔하게 분리
        </p>

        {/* ── 8. SummaryCompressor 보조 압축 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SummaryCompressor — 2차 압축 레이어</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">summary_compression.rs (300 LOC)</div>
            <div className="font-semibold text-sm mb-1">SummaryCompressor</div>
            <p className="text-xs text-muted-foreground mb-3">
              <code className="text-xs">max_summary_tokens: usize</code> — 요약의 최대 토큰 수
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                  <span className="text-sm font-semibold">extract_key_facts()</span>
                </div>
                <p className="text-xs text-muted-foreground">핵심 사실만 추출</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-sm font-semibold">remove_noise()</span>
                </div>
                <p className="text-xs text-muted-foreground">반복, 불필요한 세부사항 제거</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
                  <span className="text-sm font-semibold">rank_by_relevance()</span>
                </div>
                <p className="text-xs text-muted-foreground">최근 작업과의 관련도로 정렬</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
                  <span className="text-sm font-semibold">truncate_to_budget()</span>
                </div>
                <p className="text-xs text-muted-foreground">토큰 예산에 맞게 자르기</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          1차 압축(compact.rs)이 메시지를 요약으로 교체한다면,
          2차 압축(SummaryCompressor)은 요약 자체를 더 짧게 만듦<br />
          <code>extract_key_facts()</code>는 요약에서 "파일 경로", "오류 메시지", "아키텍처 결정" 등
          핵심 사실만 추출 — 서술적 문장은 제거<br />
          <code>rank_by_relevance()</code>는 현재 작업과의 관련도를 기준으로 사실을 정렬 —
          관련 없는 오래된 사실은 후순위로 밀려나 토큰 예산 초과 시 먼저 제거<br />
          두 레이어 압축 구조: 메시지 → 요약(1차) → 핵심 사실(2차)
        </p>

        {/* ── 9. 인사이트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">설계 인사이트</h3>
        <p>
          압축 전략의 핵심은 <strong>"최근 N개는 그대로, 나머지는 요약"</strong>이라는 슬라이딩 윈도우 패턴<br />
          이는 LLM의 <strong>recency bias</strong>와 정확히 일치 — Transformer attention은
          최근 토큰에 더 강한 가중치를 부여하므로, 최근 메시지를 원본 보존하는 것이 최적<br />
          오래된 메시지는 요약만으로도 충분한 맥락을 제공
        </p>
        <p>
          4자 = 1토큰 추정은 영어 기준 근사<br />
          한국어는 UTF-8 인코딩에서 3바이트/자이고 BPE 분할도 다르지만,
          <strong>과대추정 방향</strong>이라 안전 마진으로 작동 — 실제 토큰 수보다 높게 추정하여
          한계 도달 전에 미리 압축을 트리거
        </p>
        <p>
          연속 압축(merge_compact_summaries)은 <strong>무한 대화</strong>를 가능하게 하는 핵심 메커니즘<br />
          매 압축마다 이전 요약을 병합하여 전체 대화 맥락의 연쇄를 유지<br />
          정보 손실은 불가피하지만, "현재 작업에 관련된 핵심 사실"은 rank_by_relevance()가
          높은 우선순위로 보존 — 실질적으로 중요한 맥락은 살아남는 구조
        </p>

      </div>
    </section>
  );
}
