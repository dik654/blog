import EscalationViz from './viz/EscalationViz';
import EscalationTemplateVarsViz from './viz/EscalationTemplateVarsViz';

export default function Escalation() {
  return (
    <section id="escalation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에스컬레이션 정책 &amp; 이벤트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <EscalationViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">에스컬레이션이란</h3>
        <p>
          에스컬레이션: 자동 복구 실패 시 <strong>더 높은 권한자에게 넘김</strong><br />
          claw-code의 에스컬레이션 대상:<br />
          - 사용자 (로컬 터미널)<br />
          - Slack/Discord 채널<br />
          - 이슈 트래커 (GitHub/GitLab/Jira)<br />
          - 온콜 엔지니어 (PagerDuty 등)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EscalationPolicy 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct EscalationPolicy {
    pub levels: Vec<EscalationLevel>,
}

pub struct EscalationLevel {
    pub trigger: EscalationTrigger,
    pub target: EscalationTarget,
    pub message_template: String,
}

pub enum EscalationTrigger {
    RecipeFailedNTimes { recipe: String, n: u32 },
    LaneStuckFor { duration: Duration },
    CriticalFailure { class: FailureClass },
    ResourceLimit { resource: String },
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계별 에스컬레이션</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 실제 정책 예시 (YAML)
escalation:
  levels:
    # 레벨 1: 조용한 알림 (채널)
    - trigger:
        recipe_failed_n_times:
          recipe: "build-failure-retry"
          n: 3
      target:
        webhook:
          url: "https://hooks.slack.com/..."
      message: "Lane #{{lane}} 빌드 수정 3회 실패"

    # 레벨 2: 이슈 생성
    - trigger:
        lane_stuck_for: 2h
      target:
        create_issue:
          repo: "org/repo"
          labels: ["auto-issue", "needs-review"]
      message: "Lane #{{lane}}이 2시간 멈춤. 검토 필요"

    # 레벨 3: 온콜 페이지
    - trigger:
        critical_failure:
          class: PermissionDenied
      target:
        pagerduty:
          service_key: "..."
      message: "🚨 권한 거부 — 보안 검토 필요"`}</pre>
        <p>
          <strong>점진적 에스컬레이션</strong>: 조용한 알림 → 이슈 → 페이지<br />
          낮은 레벨부터 시도 — 큰일 아닌 경우 사람 괴롭히지 않음<br />
          Critical 케이스는 바로 높은 레벨로 점프
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">escalate() 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl RecoveryEngine {
    pub async fn escalate(
        &self,
        lane: &Lane,
        classification: &FailureClass,
    ) -> Result<RecoveryOutcome> {
        // 매칭 레벨 찾기
        let level = self.find_matching_escalation_level(lane, classification)?;

        // 메시지 템플릿 렌더링
        let message = render_template(&level.message_template, &[
            ("lane", lane.id.to_string().as_str()),
            ("branch", lane.branch.as_str()),
            ("failure", format!("{:?}", classification).as_str()),
        ]);

        // 타겟별 전송
        match &level.target {
            EscalationTarget::HumanUser => {
                print_to_terminal(&message);
            }
            EscalationTarget::Webhook(url) => {
                send_webhook(url, &message).await?;
            }
            EscalationTarget::CreateIssue { repo } => {
                let issue = create_github_issue(repo, &message, &lane).await?;
                log::info!("created issue: {}", issue.url);
            }
            EscalationTarget::PagerDuty { service_key } => {
                trigger_pager(service_key, &message).await?;
            }
            EscalationTarget::AbandonLane => {
                return Ok(RecoveryOutcome::Escalated);
            }
        }

        Ok(RecoveryOutcome::Escalated)
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">템플릿 변수</h3>
        <EscalationTemplateVarsViz />
        <p>
          <strong>템플릿 엔진</strong>: 간단한 <code>{"{{var}}"}</code> 치환<br />
          Jinja/Handlebars 같은 복잡 템플릿 엔진 사용 안 함 — 단순 변수 치환<br />
          URL 변수 제공으로 받는 사람이 바로 클릭 이동 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이벤트 로그 — 감사 추적</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct EscalationEvent {
    pub timestamp: DateTime<Utc>,
    pub lane_id: LaneId,
    pub level: u32,
    pub target_kind: String,
    pub success: bool,
    pub message: String,
}

impl RecoveryEngine {
    fn record_escalation(&mut self, event: EscalationEvent) {
        self.escalation_log.push(event.clone());

        // 외부 감사 시스템에도 전송
        if let Some(audit) = &self.audit_sink {
            let _ = audit.record(event);
        }
    }
}`}</pre>
        <p>
          <strong>모든 에스컬레이션 기록</strong>: 언제 누구에게 전달됐는지<br />
          감사·분석·튜닝의 기반 데이터<br />
          "이 Lane은 Slack 3회 + 이슈 1회" 같은 이력 조회 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">에스컬레이션 피로 방지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 같은 알림 반복 방지
impl EscalationPolicy {
    fn should_skip_duplicate(
        &self,
        lane: &LaneId,
        target: &EscalationTarget,
        cooldown: Duration,
    ) -> bool {
        let recent = self.escalation_log.iter()
            .filter(|e| &e.lane_id == lane)
            .filter(|e| e.target_kind == target.kind_string())
            .filter(|e| Utc::now() - e.timestamp < cooldown)
            .count();

        recent > 0  // 쿨다운 내 동일 알림 있으면 스킵
    }
}

// 기본 쿨다운: 1시간`}</pre>
        <p>
          <strong>알림 쿨다운</strong>: 같은 Lane + 같은 타겟에 1시간 이내 중복 알림 금지<br />
          Slack 채널이 동일 메시지로 도배되는 것 방지<br />
          단, 다른 타겟이나 다른 레벨은 별도 카운트 — 에스컬레이션 경로 보장
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 에스컬레이션의 디자인 원칙</p>
          <p>
            자동화 시스템의 에스컬레이션 설계 원칙:
          </p>
          <p className="mt-2">
            1. <strong>덜 방해, 나중에 방해</strong>: 낮은 레벨부터 조용히<br />
            2. <strong>맥락 충분 제공</strong>: 받는 사람이 즉시 상황 파악<br />
            3. <strong>실행 가능한 링크</strong>: CI URL, PR URL, 로그 링크 포함<br />
            4. <strong>중복 제거</strong>: 쿨다운·디듀프로 피로 방지<br />
            5. <strong>감사 로그</strong>: 누가 언제 무엇에 노출됐는지 추적
          </p>
          <p className="mt-2">
            <strong>안티패턴</strong>:<br />
            - 모든 실패에 즉시 페이지 → 온콜 burnout<br />
            - 메시지에 "실패" 한 단어만 → 사람이 상황 조사 시간 낭비<br />
            - 쿨다운 없이 1분마다 알림 → 메시지 무시 문화 형성
          </p>
          <p className="mt-2">
            claw-code는 이런 안티패턴을 정책 구조로 방지<br />
            "자동화가 일을 덜 만들어주는" 시스템 — 사람이 정말 필요할 때만 개입
          </p>
        </div>

      </div>
    </section>
  );
}
