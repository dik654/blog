import AgentSelectionViz from './viz/AgentSelectionViz';
import AgentScoreChartViz from './viz/AgentScoreChartViz';

export default function AgentSelection() {
  return (
    <section id="agent-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">베스트11 — 태스크별 에이전트 선택</h2>
      <AgentSelectionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 동적 선택이 필요한가</h3>
        <p>
          Claude Code가 사용 가능한 sub-agent는 수십~수백개<br />
          모든 agent를 매번 system prompt에 나열하면:<br />
          - <strong>프롬프트 팽창</strong>: 각 agent spec이 100-200 tokens → 전체 5K+ tokens<br />
          - <strong>선택 노이즈</strong>: LLM이 유사한 agent 중 엉뚱한 것 선택 가능<br />
          - <strong>성능 저하</strong>: 불필요한 맥락이 attention 분산
        </p>
        <p>
          <strong>해결: 태스크별 동적 선택</strong><br />
          - 사용자 요청 분석 → 관련 태그 추출<br />
          - 태그 매칭으로 후보 agent 필터링<br />
          - 랭킹 점수 상위 7-11개만 활성화 → system prompt에 포함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Agent 메타데이터 구조</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">AgentDefinition</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <ul className="list-none pl-0 space-y-1">
              <li><code>agent_type</code> — <code>"Explore"</code> | <code>"Plan"</code> | ...</li>
              <li><code>description</code> — LLM이 선택 시 참고하는 설명</li>
              <li><code>tags</code> — <code>["search", "code", "analysis"]</code></li>
              <li><code>allowed_tools</code> — 이 agent가 사용 가능한 도구 목록</li>
            </ul>
            <ul className="list-none pl-0 space-y-1">
              <li><code>model_preference</code> — opus/sonnet/haiku (optional)</li>
              <li><code>system_prompt</code> — agent별 특화 prompt</li>
              <li><code>recent_success_rate</code> — 최근 호출 성공률 (bandit 학습)</li>
            </ul>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">선택 알고리즘 — <code>rank_agents</code></p>
          <div className="space-y-2 text-sm">
            <p><strong>점수 산출</strong>: <code>tag_overlap x 0.6</code> + <code>domain_fit x 0.3</code> + <code>recent_success_rate x 0.1</code></p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-background border border-border rounded px-3 py-2 text-center">
                <p className="font-medium">tag_overlap</p>
                <p className="text-xs text-muted-foreground">태스크 태그와 agent 태그 교집합 비율</p>
                <p className="text-lg font-bold">60%</p>
              </div>
              <div className="bg-background border border-border rounded px-3 py-2 text-center">
                <p className="font-medium">domain_fit</p>
                <p className="text-xs text-muted-foreground">도메인 적합도 (임베딩 기반)</p>
                <p className="text-lg font-bold">30%</p>
              </div>
              <div className="bg-background border border-border rounded px-3 py-2 text-center">
                <p className="font-medium">success_rate</p>
                <p className="text-xs text-muted-foreground">최근 호출 성공률</p>
                <p className="text-lg font-bold">10%</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">cutoff <code>0.3</code> 미만 제거 → 상위 11개("Best 11") 선택</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Selection 예시</h3>
        <AgentScoreChartViz />
        <p>
          <strong>2단계 필터링</strong>: tag overlap 기반 1차 필터 (cutoff 0.3) → 점수 기준 top-3 선택<br />
          10개 후보 중 5개가 통과, 최상위 3개(debug-agent · security · Explore)만 system prompt에 포함<br />
          필터링 덕분에 system prompt 길이를 <code>10 × 150 = 1.5K</code> 토큰 → <code>3 × 150 = 450</code> 토큰으로 축소
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">태그 추출 — 사용자 요청 분석</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code>extract_task_tags</code> — 3단계 추출</p>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-sm mb-2">1) 키워드 사전 매칭 (빠름)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">debug</code>
                  <p className="text-muted-foreground mt-0.5">bug, error, crash, broken, fail</p>
                </div>
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">refactor</code>
                  <p className="text-muted-foreground mt-0.5">refactor, cleanup, rename, move, extract</p>
                </div>
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">feature</code>
                  <p className="text-muted-foreground mt-0.5">add, implement, new, create</p>
                </div>
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">review</code>
                  <p className="text-muted-foreground mt-0.5">review, audit, check, verify</p>
                </div>
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">docs</code>
                  <p className="text-muted-foreground mt-0.5">document, readme, explain, describe</p>
                </div>
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">test</code>
                  <p className="text-muted-foreground mt-0.5">test, spec, coverage, unit</p>
                </div>
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">auth</code>
                  <p className="text-muted-foreground mt-0.5">login, password, token, session, auth</p>
                </div>
                <div className="bg-background border border-border rounded px-2 py-1.5">
                  <code className="font-semibold">perf</code>
                  <p className="text-muted-foreground mt-0.5">slow, faster, optimize, performance</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium mb-1">2) 파일 확장자 힌트</p>
                <p className="text-muted-foreground"><code>.rs</code> → <code>rust</code>, <code>.ts/.tsx</code> → <code>typescript</code></p>
              </div>
              <div>
                <p className="font-medium mb-1">3) 경로 힌트</p>
                <p className="text-muted-foreground"><code>/auth/</code> → <code>auth</code>, <code>/api/</code> → <code>api</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>결정론적 매칭이 LLM보다 빠름</strong>:<br />
          - 선택 단계에서 LLM 호출 추가 → 비용·지연 증가<br />
          - 간단한 키워드 매칭만으로도 90% 정확도<br />
          - 실패한 경우 나중에 fallback으로 LLM 사용 가능
        </p>
        <p>
          <strong>유지보수 문제</strong>: 키워드 사전이 정적 — 도메인 확장 시 수동 업데이트<br />
          대안: embedding 기반 similarity — 하지만 cold start 비용 ↑
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">활성화 타이밍 — 언제 re-rank?</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">RerankTrigger — Agent pool 재평가 시점</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>SessionStart</code></p>
              <p className="text-xs text-muted-foreground">새 세션 시작 시 1회</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>TaskSwitch</code></p>
              <p className="text-xs text-muted-foreground">사용자 요청이 전환된 것으로 판단</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>PeriodicRefresh</code></p>
              <p className="text-xs text-muted-foreground">N turns 마다 (기본 10)</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>ExplicitHint</code></p>
              <p className="text-xs text-muted-foreground">"switch to X agent" 명시</p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2">TaskSwitch 감지 — Jaccard similarity</p>
          <p className="text-sm">
            현재 요청의 태그와 이전 태스크 태그의 <strong>Jaccard similarity</strong>(교집합/합집합)를 계산<br />
            similarity &lt; <code>0.3</code>이면 새 태스크로 판단 → agent pool re-rank<br />
            Session 중간에 pool 변경 시 system prompt의 agent 목록 섹션만 재작성, 기존 대화 이력은 유지
          </p>
        </div>
        <p>
          <strong>너무 자주 re-rank</strong>: prompt cache invalidation → API 비용 ↑<br />
          <strong>너무 드물게 re-rank</strong>: 무관한 agent가 system prompt에 남음<br />
          claw는 "task switch 감지 + N turns 주기"의 hybrid 전략
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">System Prompt 주입 형태</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code>build_system_prompt</code> — 선택된 agents를 system prompt에 포함</p>
          <p className="text-sm mb-3">
            <code>BASE_SYSTEM_PROMPT</code>에 <code># Available Sub-Agents</code> 섹션 추가<br />
            각 agent마다 <code>agent_type</code>, <code>description</code>, <code>allowed_tools</code> 나열
          </p>
          <p className="font-medium text-sm mb-2">결과 예시 (실제 Claude Code system prompt)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-semibold">Explore</p>
              <p className="text-muted-foreground">Fast agent specialized for exploring codebases...</p>
              <p className="text-xs mt-1">Tools: <code>Read</code>, <code>Grep</code>, <code>Glob</code>, <code>WebFetch</code></p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-semibold">Plan</p>
              <p className="text-muted-foreground">Software architect agent for designing implementation plans...</p>
              <p className="text-xs mt-1">Tools: <code>Read</code>, <code>Grep</code>, <code>Glob</code> (analysis-only)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>각 agent당 100-200 tokens 소비</strong> — 11개면 1.5-2K tokens<br />
          이 비용은 모든 turn마다 반복 — prompt caching으로 완화<br />
          많을수록 LLM이 "뭘 쓸지" 판단에 많은 attention 할당 → 정확도 저하 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Multi-Armed Bandit 사용</p>
          <p>
            <strong>recent_success_rate</strong> 필드는 exploration/exploitation 균형:<br />
            - 성공률 높은 agent가 더 자주 선택됨 (exploit)<br />
            - 하지만 새 agent도 주기적 테스트 필요 (explore)<br />
            - Epsilon-greedy 또는 Thompson sampling으로 조절
          </p>
          <p className="mt-2">
            <strong>학습 루프</strong>:<br />
            1. Agent 실행 → tool_calls, 최종 결과 관찰<br />
            2. 사용자 피드백 (accept/reject/redo) 수집<br />
            3. success_rate 업데이트<br />
            4. 다음 선택 시 반영
          </p>
        </div>

      </div>
    </section>
  );
}
