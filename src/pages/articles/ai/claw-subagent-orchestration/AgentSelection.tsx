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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct AgentDefinition {
    pub agent_type: String,            // "Explore" | "Plan" | ...
    pub description: String,           // LLM이 선택 시 참고
    pub tags: Vec<String>,             // ["search", "code", "analysis"]
    pub allowed_tools: Vec<String>,    // 이 agent가 사용 가능한 도구
    pub model_preference: Option<String>, // opus/sonnet/haiku
    pub system_prompt: String,         // agent별 특화 prompt
    pub recent_success_rate: f32,      // 최근 호출 성공률 (bandit)
}

// 선택 알고리즘
fn rank_agents(task: &Task, pool: &[AgentDefinition]) -> Vec<&AgentDefinition> {
    pool.iter()
        .map(|a| {
            let tag_overlap = a.tags.iter()
                .filter(|t| task.tags.contains(t))
                .count() as f32 / task.tags.len() as f32;

            let domain_fit = compute_domain_fit(a, task);

            let score = tag_overlap * 0.6
                      + domain_fit * 0.3
                      + a.recent_success_rate * 0.1;

            (a, score)
        })
        .filter(|(_, score)| *score > 0.3)
        .collect::<Vec<_>>()
        .sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap())
        .into_iter()
        .take(11)  // "Best 11"
        .map(|(a, _)| a)
        .collect()
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Selection 예시</h3>
        <AgentScoreChartViz />
        <p>
          <strong>2단계 필터링</strong>: tag overlap 기반 1차 필터 (cutoff 0.3) → 점수 기준 top-3 선택<br />
          10개 후보 중 5개가 통과, 최상위 3개(debug-agent · security · Explore)만 system prompt에 포함<br />
          필터링 덕분에 system prompt 길이를 <code>10 × 150 = 1.5K</code> 토큰 → <code>3 × 150 = 450</code> 토큰으로 축소
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">태그 추출 — 사용자 요청 분석</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 사용자 요청에서 태스크 태그 자동 추출
fn extract_task_tags(user_message: &str) -> Vec<String> {
    let mut tags = Vec::new();
    let lower = user_message.to_lowercase();

    // 1) 키워드 사전 매칭 (빠름)
    let keyword_map: &[(&str, &[&str])] = &[
        ("debug",    &["bug", "error", "crash", "broken", "fail"]),
        ("refactor", &["refactor", "cleanup", "rename", "move", "extract"]),
        ("feature",  &["add", "implement", "new", "create"]),
        ("review",   &["review", "audit", "check", "verify"]),
        ("docs",     &["document", "readme", "explain", "describe"]),
        ("test",     &["test", "spec", "coverage", "unit"]),
        ("auth",     &["login", "password", "token", "session", "auth"]),
        ("perf",     &["slow", "faster", "optimize", "performance"]),
    ];

    for (tag, keywords) in keyword_map {
        if keywords.iter().any(|kw| lower.contains(kw)) {
            tags.push(tag.to_string());
        }
    }

    // 2) 파일 확장자 힌트
    if lower.contains(".rs") { tags.push("rust".into()); }
    if lower.contains(".ts") || lower.contains(".tsx") {
        tags.push("typescript".into());
    }

    // 3) 경로 힌트 — 디렉토리명이 도메인 힌트
    if lower.contains("/auth/") { tags.push("auth".into()); }
    if lower.contains("/api/") { tags.push("api".into()); }

    tags
}`}</pre>
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Agent pool 재평가 시점
enum RerankTrigger {
    SessionStart,        // 새 세션 시작 시 1회
    TaskSwitch,          // 사용자 요청이 전환된 것으로 판단
    PeriodicRefresh,     // N turns 마다 (기본 10)
    ExplicitHint,        // 사용자가 "switch to X agent" 명시
}

// TaskSwitch 감지
fn detect_task_switch(prev: &TaskSummary, curr: &str) -> bool {
    let curr_tags = extract_task_tags(curr);
    let prev_tags = &prev.tags;

    // Jaccard similarity < 0.3이면 새 태스크로 판단
    let intersection = curr_tags.iter()
        .filter(|t| prev_tags.contains(t)).count();
    let union = (curr_tags.len() + prev_tags.len()) - intersection;

    if union == 0 { return true; }
    let similarity = intersection as f32 / union as f32;
    similarity < 0.3
}

// Session 중간에 agent pool 변경 시
// → System prompt 재작성 (agent 목록 섹션만)
// → 기존 conversation history 유지`}</pre>
        <p>
          <strong>너무 자주 re-rank</strong>: prompt cache invalidation → API 비용 ↑<br />
          <strong>너무 드물게 re-rank</strong>: 무관한 agent가 system prompt에 남음<br />
          claw는 "task switch 감지 + N turns 주기"의 hybrid 전략
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">System Prompt 주입 형태</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 선택된 agents가 system prompt에 어떻게 포함되는지

fn build_system_prompt(selected: &[AgentDefinition]) -> String {
    let mut prompt = String::from(BASE_SYSTEM_PROMPT);
    prompt.push_str("\\n\\n# Available Sub-Agents\\n");
    prompt.push_str("Spawn them via the Agent tool.\\n\\n");

    for agent in selected {
        prompt.push_str(&format!(
            "## {}\\n{}\\n- Tools: {}\\n\\n",
            agent.agent_type,
            agent.description,
            agent.allowed_tools.join(", "),
        ));
    }

    prompt
}

// 결과 예시 (실제 Claude Code system prompt)
// ## Explore
// Fast agent specialized for exploring codebases...
// - Tools: Read, Grep, Glob, WebFetch
//
// ## Plan
// Software architect agent for designing implementation plans...
// - Tools: Read, Grep, Glob (analysis-only)`}</pre>
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
