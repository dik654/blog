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
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">EscalationLevel</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>trigger</code></p>
                <p className="text-xs text-muted-foreground mt-1">EscalationTrigger -- 발동 조건</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>target</code></p>
                <p className="text-xs text-muted-foreground mt-1">EscalationTarget -- 전달 대상</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>message_template</code></p>
                <p className="text-xs text-muted-foreground mt-1">String -- 메시지 템플릿</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">EscalationTrigger</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">RecipeFailedNTimes</p>
                <p className="text-[11px] text-muted-foreground">레시피 N회 실패</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">LaneStuckFor</p>
                <p className="text-[11px] text-muted-foreground">Lane 정체 시간</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">CriticalFailure</p>
                <p className="text-[11px] text-muted-foreground">치명적 실패 분류</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">ResourceLimit</p>
                <p className="text-[11px] text-muted-foreground">자원 한계 도달</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계별 에스컬레이션</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">YAML 정책 예시 -- 3단계 점진적 에스컬레이션</p>
          <div className="space-y-2">
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">Level 1</span>
                <span className="text-xs text-muted-foreground">조용한 알림</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">trigger:</span> <code>recipe_failed_n_times</code> (build-failure-retry, n=3)</div>
                <div><span className="text-muted-foreground">target:</span> Slack webhook</div>
                <div><span className="text-muted-foreground">message:</span> "Lane #{'{'}lane{'}'} 빌드 수정 3회 실패"</div>
              </div>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded font-semibold">Level 2</span>
                <span className="text-xs text-muted-foreground">이슈 생성</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">trigger:</span> <code>lane_stuck_for</code> 2시간</div>
                <div><span className="text-muted-foreground">target:</span> GitHub issue (labels: auto-issue, needs-review)</div>
                <div><span className="text-muted-foreground">message:</span> "Lane #{'{'}lane{'}'}이 2시간 멈춤. 검토 필요"</div>
              </div>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-2 py-0.5 rounded font-semibold">Level 3</span>
                <span className="text-xs text-muted-foreground">온콜 페이지</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">trigger:</span> <code>critical_failure</code> (PermissionDenied)</div>
                <div><span className="text-muted-foreground">target:</span> PagerDuty</div>
                <div><span className="text-muted-foreground">message:</span> "권한 거부 -- 보안 검토 필요"</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>점진적 에스컬레이션</strong>: 조용한 알림 → 이슈 → 페이지<br />
          낮은 레벨부터 시도 — 큰일 아닌 경우 사람 괴롭히지 않음<br />
          Critical 케이스는 바로 높은 레벨로 점프
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">escalate() 구현</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">RecoveryEngine::escalate(lane, classification) → Result&lt;RecoveryOutcome&gt;</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">매칭 레벨 찾기</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>find_matching_escalation_level(lane, classification)</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">메시지 템플릿 렌더링</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>render_template</code>에 lane, branch, failure 변수 주입</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">타겟별 전송</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-1.5">
                  <span className="bg-muted text-xs px-2 py-1 rounded text-center font-mono">HumanUser</span>
                  <span className="bg-muted text-xs px-2 py-1 rounded text-center font-mono">Webhook</span>
                  <span className="bg-muted text-xs px-2 py-1 rounded text-center font-mono">CreateIssue</span>
                  <span className="bg-muted text-xs px-2 py-1 rounded text-center font-mono">PagerDuty</span>
                  <span className="bg-muted text-xs px-2 py-1 rounded text-center font-mono">AbandonLane</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">모든 경로에서 <code>RecoveryOutcome::Escalated</code> 반환</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">템플릿 변수</h3>
        <EscalationTemplateVarsViz />
        <p>
          <strong>템플릿 엔진</strong>: 간단한 <code>{"{{var}}"}</code> 치환<br />
          Jinja/Handlebars 같은 복잡 템플릿 엔진 사용 안 함 — 단순 변수 치환<br />
          URL 변수 제공으로 받는 사람이 바로 클릭 이동 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이벤트 로그 — 감사 추적</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-3">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">EscalationEvent</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>timestamp</code></p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>lane_id</code></p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>level</code></p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>target_kind</code></p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>success</code></p>
              </div>
              <div className="bg-background rounded-md border p-2 text-center">
                <p className="text-xs font-mono"><code>message</code></p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-md border p-3">
            <p className="font-semibold text-sm mb-1"><code>record_escalation(event)</code></p>
            <p className="text-xs text-muted-foreground"><code>escalation_log</code>에 push + <code>audit_sink</code> 존재 시 외부 감사 시스템에도 전송</p>
          </div>
        </div>
        <p>
          <strong>모든 에스컬레이션 기록</strong>: 언제 누구에게 전달됐는지<br />
          감사·분석·튜닝의 기반 데이터<br />
          "이 Lane은 Slack 3회 + 이슈 1회" 같은 이력 조회 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">에스컬레이션 피로 방지</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">should_skip_duplicate(lane, target, cooldown) → bool</p>
          <div className="bg-background rounded-md border p-3">
            <p className="font-semibold text-sm mb-2">중복 알림 필터링</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p><code>escalation_log</code>에서 동일 <code>lane_id</code> 필터</p>
              <p>→ 동일 <code>target_kind</code> 필터</p>
              <p>→ <code>cooldown</code> 이내 타임스탬프 필터</p>
              <p>→ 1건이라도 있으면 <code>true</code> (스킵)</p>
            </div>
            <p className="text-xs mt-2 font-semibold">기본 쿨다운: 1시간</p>
          </div>
        </div>
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
