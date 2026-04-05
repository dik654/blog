import RulesDslViz from './viz/RulesDslViz';

export default function Rules() {
  return (
    <section id="rules" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PolicyRule &amp; PolicyCondition 선언적 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RulesDslViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PolicyCondition DSL</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum PolicyCondition {
    And(Vec<PolicyCondition>),
    Or(Vec<PolicyCondition>),
    Not(Box<PolicyCondition>),

    StatusIs(LaneStatus),
    StatusFor { status: LaneStatus, at_least: Duration },

    BuildGreen,
    TestsPass { min_coverage: Option<f32> },
    LintClean,

    FailureCount { at_least: u32 },
    TimeElapsed { since: TimeRef, at_least: Duration },

    Custom(String),  // JS/Lua 스크립트 평가
}`}</pre>
        <p>
          <strong>조합 연산자</strong>: And, Or, Not — 복합 조건 표현<br />
          <strong>상태 조건</strong>: StatusIs, StatusFor(지속 시간)<br />
          <strong>빌드 조건</strong>: BuildGreen, TestsPass, LintClean<br />
          <strong>시간 조건</strong>: FailureCount, TimeElapsed
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">선언적 YAML 규칙 파일</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# .claw/policies.yaml
rules:
  - name: "신규 Lane 자동 시작"
    priority: 100
    condition:
      status_is: Initialized
    action: transition(InProgress)

  - name: "빌드 성공 후 테스트 단계"
    priority: 90
    condition:
      and:
        - status_is: InProgress
        - build_green: true
    action: transition(Testing)

  - name: "테스트 통과 후 머지 준비"
    priority: 90
    condition:
      and:
        - status_is: Testing
        - tests_pass:
            min_coverage: 0.80
        - lint_clean: true
    action: transition(ReadyToMerge)

  - name: "24시간 Stale 폐기"
    priority: 50
    condition:
      and:
        - status_is: InProgress
        - time_elapsed:
            since: LastActivity
            at_least: 24h
    action: abandon_lane("stale")`}</pre>
        <p>
          <strong>YAML 기반 선언</strong>: 코드 수정 없이 정책 변경 가능<br />
          각 규칙은 이름 + 우선순위 + 조건 + 동작<br />
          우선순위 내림차순 평가 — 충돌 시 높은 우선순위 이김
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">evaluate() 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PolicyCondition {
    pub async fn evaluate(&self, ctx: &LaneContext) -> Result<bool> {
        match self {
            Self::And(children) => {
                for c in children {
                    if !c.evaluate(ctx).await? { return Ok(false); }
                }
                Ok(true)
            }
            Self::Or(children) => {
                for c in children {
                    if c.evaluate(ctx).await? { return Ok(true); }
                }
                Ok(false)
            }
            Self::Not(inner) => Ok(!inner.evaluate(ctx).await?),

            Self::StatusIs(status) => Ok(ctx.lane_status == *status),

            Self::StatusFor { status, at_least } => {
                Ok(ctx.lane_status == *status
                    && ctx.status_since_duration() >= *at_least)
            }

            Self::BuildGreen => Ok(ctx.last_build_status == Some(BuildStatus::Green)),

            Self::TestsPass { min_coverage } => {
                let pass = ctx.last_test_status == Some(TestStatus::Pass);
                if !pass { return Ok(false); }
                if let Some(min) = min_coverage {
                    return Ok(ctx.test_coverage.map_or(false, |c| c >= *min));
                }
                Ok(true)
            }

            Self::LintClean => Ok(ctx.lint_warnings.unwrap_or(1) == 0),

            Self::FailureCount { at_least } =>
                Ok(ctx.failure_count >= *at_least),

            Self::TimeElapsed { since, at_least } =>
                Ok(ctx.elapsed_since(*since) >= *at_least),

            Self::Custom(script) => evaluate_custom_script(script, ctx).await,
        }
    }
}`}</pre>
        <p>
          <strong>재귀적 평가</strong>: And/Or/Not은 하위 조건 재귀 호출<br />
          단락 평가(short-circuit): And에서 false 하나면 즉시 반환<br />
          BuildStatus/TestStatus는 최근 실행 결과 — LaneContext가 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Custom 스크립트 평가</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Lua 엔진 통합 (mlua crate)
async fn evaluate_custom_script(
    script: &str,
    ctx: &LaneContext,
) -> Result<bool> {
    use mlua::Lua;

    let lua = Lua::new();

    // 컨텍스트를 Lua 테이블로 변환
    let ctx_table = lua.create_table()?;
    ctx_table.set("status", format!("{:?}", ctx.lane_status))?;
    ctx_table.set("failure_count", ctx.failure_count)?;
    ctx_table.set("coverage", ctx.test_coverage.unwrap_or(0.0))?;
    lua.globals().set("ctx", ctx_table)?;

    // 스크립트 실행
    let result: bool = lua.load(script).eval()?;
    Ok(result)
}

// 사용 예시 (YAML)
- name: "커스텀 복합 조건"
  condition:
    custom: "ctx.failure_count >= 2 and ctx.coverage < 0.5"
  action: notify("quality-review")`}</pre>
        <p>
          <strong>Lua 스크립트</strong>: 복잡한 조건을 런타임에 평가<br />
          <code>mlua</code> crate로 Rust-Lua 인터op — 샌드박스 자동 적용<br />
          내장 조건으로 부족할 때만 사용 — 대부분 DSL로 충분
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">우선순위 기반 정렬</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PolicyEngine {
    fn sort_rules_by_priority(&mut self) {
        self.rules.sort_by(|a, b| b.priority.cmp(&a.priority));
        // 내림차순 — 높은 우선순위 먼저
    }
}

// 우선순위 전략
// 100: 치명적 상태 전이 (abandon)
//  90: 표준 상태 전이 (initialized→inprogress→testing→merged)
//  50: 시간 기반 정리 (stale, timeout)
//  10: 알림·로깅 (다른 규칙 방해 안 함)`}</pre>
        <p>
          <strong>우선순위 전략</strong>: 숫자가 클수록 우선<br />
          100대: 즉각적 중단 필요한 규칙<br />
          90대: 정상 흐름 전이<br />
          50대: 정리·청소<br />
          10대: 관측·알림 (부수 효과)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">규칙 충돌 감지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PolicyEngine {
    pub fn detect_conflicts(&self) -> Vec<RuleConflict> {
        let mut conflicts = Vec::new();

        // 동일 우선순위에서 같은 Lane에 다른 액션 수행 가능?
        for i in 0..self.rules.len() {
            for j in i+1..self.rules.len() {
                let a = &self.rules[i];
                let b = &self.rules[j];

                if a.priority == b.priority
                    && !actions_compatible(&a.action, &b.action) {
                    conflicts.push(RuleConflict {
                        rule_a: a.name.clone(),
                        rule_b: b.name.clone(),
                        reason: "same priority, conflicting actions".into(),
                    });
                }
            }
        }
        conflicts
    }
}`}</pre>
        <p>
          <strong>충돌 정의</strong>: 같은 우선순위 + 양립 불가 액션<br />
          예: Lane을 Merged로도 Abandoned로도 전이 불가<br />
          시작 시 충돌 감지 — 규칙 파일 검증의 일부
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DSL vs 범용 언어의 선택</p>
          <p>
            정책 규칙 표현 3가지 선택지:
          </p>
          <p className="mt-2">
            1. <strong>YAML 선언형 DSL</strong> (claw-code 기본):<br />
            ✓ 쉬운 학습, 안전, 정적 분석 가능<br />
            ✗ 표현력 한계 (복잡한 조건 어려움)
          </p>
          <p className="mt-2">
            2. <strong>임베디드 Lua</strong> (custom 필드):<br />
            ✓ 튜링 완전 표현력<br />
            ✗ 디버깅 복잡, 보안 위험 (샌드박스로 완화)
          </p>
          <p className="mt-2">
            3. <strong>Rust 네이티브</strong>:<br />
            ✓ 최고 성능·안전<br />
            ✗ 규칙 변경 시 재컴파일
          </p>
          <p className="mt-2">
            claw-code는 <strong>1 기본 + 2 탈출구</strong> 조합<br />
            95% 규칙은 YAML로 충분, 5%는 Lua<br />
            가장 흔한 요구사항을 가장 쉽게, 드문 요구사항은 유연하게
          </p>
        </div>

      </div>
    </section>
  );
}
