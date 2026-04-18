import TeamCronViz from './viz/TeamCronViz';

export default function TeamCron() {
  return (
    <section id="team-cron" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TeamCronRegistry — 팀 &amp; 크론 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TeamCronViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Team 개념</h3>
        <p>
          Team: <strong>작업 집합을 담당하는 에이전트 그룹</strong><br />
          사용 사례:<br />
          - "backend 팀" = DB 관련 작업 전담<br />
          - "docs 팀" = 문서 작성·업데이트 전담<br />
          - "qa 팀" = 테스트·검증 전담
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Team 구조</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">식별 / 구성</p>
            <p className="text-sm"><code>id: TeamId</code> / <code>name</code> / <code>description</code></p>
            <p className="text-sm"><code>worker_pool: Vec&lt;WorkerConfig&gt;</code> — 워커 설정 목록</p>
            <p className="text-sm"><code>max_concurrent_tasks: usize</code> — 동시 작업 한도</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">스코프 / 계약</p>
            <p className="text-sm"><code>task_tags</code> — 이 팀이 받을 task 태그</p>
            <p className="text-sm"><code>file_patterns</code> / <code>excluded_patterns</code> — 작업 범위 glob</p>
            <p className="text-sm"><code>team_claude_md</code> — 팀 전용 CLAUDE.md (시스템 프롬프트 삽입)</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border md:col-span-2">
            <p className="text-xs font-semibold text-muted-foreground mb-2">WorkerConfig</p>
            <p className="text-sm"><code>model: String</code> — 사용할 모델 / <code>system_prompt_extension: String</code> — 프롬프트 확장</p>
          </div>
        </div>
        <p>
          <strong>Team = Worker pool + 스코프 + 계약</strong><br />
          worker_pool: 같은 팀 여러 worker가 병렬 작업<br />
          task_tags: 특정 태그의 task만 받음 (<code>"backend"</code> 태그 task → backend 팀)<br />
          team_claude_md: 팀별 커스텀 가이드라인 — 시스템 프롬프트에 삽입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TeamCreate 도구</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border divide-y divide-border">
          <div className="p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">도구: <code>TeamCreate</code> — LLM이 런타임에 팀 생성</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">name</span>
            <span><code>"frontend"</code> — React/TS 작업 담당</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">task_tags</span>
            <span><code>["frontend", "react"]</code></span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">file_patterns</span>
            <span><code>["src/web/**", "src/components/**"]</code> / excluded: <code>["src/web/legacy/**"]</code></span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 p-3 text-sm">
            <span className="text-muted-foreground font-medium">team_claude_md</span>
            <span>"React 19 사용. TypeScript strict 모드. ..."</span>
          </div>
        </div>
        <p>
          <strong>런타임 팀 생성</strong>: LLM이 작업을 논리적으로 분할 가능<br />
          "frontend vs backend" 자동 분리 → task 배정 자동화<br />
          team_claude_md로 팀별 코딩 컨벤션 주입 — 일관성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Task 자동 배정 — assign_by_team()</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">assign_task_to_team(task) — 2단계 매칭</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <div>
                <strong>태그 매칭</strong> — task의 <code>tags</code>와 각 팀의 <code>task_tags</code> 교집합 검사
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">2</span>
              <div>
                <strong>폴백</strong> — 태그 매칭 없으면 <code>match_by_file_patterns()</code> 파일 패턴 기반 매칭
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">여러 팀 매칭 시 <code>min_by_key(current_task_count)</code> — 부하 최소 팀 선택</p>
        </div>
        <p>
          <strong>2단계 매칭</strong>: 태그 우선 → 파일 패턴 폴백<br />
          여러 팀 매칭 시 <strong>부하 최소 팀</strong> 선택<br />
          max_concurrent_tasks 초과 팀은 pool에서 제외
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cron 스케줄링</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">CronJob 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><code>id: CronId</code> / <code>name: String</code></p>
              <p><code>schedule: String</code> — 예: <code>"0 2 * * *"</code> (매일 새벽 2시)</p>
              <p><code>task_template: TaskPacket</code> — 매 실행 시 사본 생성</p>
              <p><code>last_run</code> / <code>next_run</code> / <code>enabled</code></p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg border border-border divide-y divide-border">
            <div className="p-3">
              <p className="text-xs font-semibold text-muted-foreground">도구: <code>CronCreate</code></p>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2 p-3 text-sm">
              <span className="text-muted-foreground font-medium">name</span>
              <span><code>"nightly-cleanup"</code></span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2 p-3 text-sm">
              <span className="text-muted-foreground font-medium">schedule</span>
              <span><code>"0 2 * * *"</code></span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2 p-3 text-sm">
              <span className="text-muted-foreground font-medium">template</span>
              <span>title: "Clean up stale branches" / tags: <code>["maintenance"]</code></span>
            </div>
          </div>
        </div>
        <p>
          <strong>표준 cron 표현식</strong>: 5필드 (분 시 일 월 요일)<br />
          <code>task_template</code>: 매 실행마다 이 템플릿으로 새 task 생성<br />
          시간 지나면 task가 자동 쌓임 — 정기 작업 자동화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CronScheduler — 실행 루프</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">CronScheduler::run_loop() — 1분 주기 체크</p>
          <p className="text-sm mb-3"><code>jobs: RwLock&lt;HashMap&lt;CronId, CronJob&gt;&gt;</code></p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <div>
                <code>tokio::time::sleep(60s)</code> → 매 1분마다 wake
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">2</span>
              <div>
                각 job: <code>!enabled</code> 또는 <code>next_run &gt; now</code> → skip
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">3</span>
              <div>
                <code>task_template.clone()</code> → 제목에 날짜 추가 → <code>global_task_registry().create()</code>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">4</span>
              <div>
                <code>parse_cron_next()</code>로 다음 실행 시각 갱신
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>1분 주기 체크</strong>: cron은 분 단위 정밀도<br />
          각 실행 시 task 사본 생성 — 템플릿은 불변<br />
          task 제목에 날짜 붙임 — 구분 용이
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">cron 파서 — parse_cron_next()</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">parse_cron_next(expr, from)</p>
            <p className="text-sm"><code>cron::Schedule</code> crate로 표현식 파싱 → <code>schedule.after(&from).next()</code>로 다음 실행 시점</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">지원 형식</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><code>*/5 * * * *</code> — 매 5분</div>
              <div><code>0 */2 * * *</code> — 매 2시간</div>
              <div><code>0 9 * * MON-FRI</code> — 평일 오전 9시</div>
              <div><code>0 0 1 * *</code> — 매월 1일 자정</div>
            </div>
          </div>
        </div>
        <p>
          <code>cron</code> crate: 표준 Unix cron 표현식 파싱<br />
          요일 이름(MON, TUE), 범위(MON-FRI), 증분(<code>*/5</code>) 지원<br />
          <code>schedule.after(from)</code>: 기준 시각 이후 다음 실행 시점 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 시나리오</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">매일 새벽 의존성 업데이트</p>
            <p className="text-sm"><code>0 2 * * *</code></p>
            <p className="text-sm text-muted-foreground">cargo update && cargo test</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">매주 월요일 이슈 정리</p>
            <p className="text-sm"><code>0 9 * * MON</code></p>
            <p className="text-sm text-muted-foreground">stale 이슈 검토 후 close 처리</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">매시간 빌드 상태 체크</p>
            <p className="text-sm"><code>0 * * * *</code></p>
            <p className="text-sm text-muted-foreground">main CI 상태 확인, 실패 시 알림</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">분기별 보안 패치 점검</p>
            <p className="text-sm"><code>0 0 1 */3 *</code></p>
            <p className="text-sm text-muted-foreground">security advisory 확인, 패치 PR 생성</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 팀과 크론의 결합 가치</p>
          <p>
            Team + Cron + PolicyEngine 결합 시 <strong>완전 자율 팀</strong> 구성 가능<br />
            예: "매일 새벽 2시 보안팀이 의존성 업데이트 Task 받고 자동 수행"
          </p>
          <p className="mt-2">
            이 구조의 가치:<br />
            ✓ <strong>명시적 책임</strong>: 팀이 담당 영역 가짐<br />
            ✓ <strong>정기성</strong>: cron으로 반복 작업 자동화<br />
            ✓ <strong>확장성</strong>: 새 팀·크론 추가 쉬움<br />
            ✓ <strong>관찰성</strong>: 팀별 작업 진행 추적 가능
          </p>
          <p className="mt-2">
            <strong>사람 팀과의 유사성</strong>:<br />
            - 사람 팀도 domain 분할 (frontend/backend/infra)<br />
            - 사람 팀도 정기 작업 (sprint planning, retrospective)<br />
            - 에이전트 팀도 같은 구조 재사용
          </p>
          <p className="mt-2">
            claw-code는 <strong>"사람 조직 구조를 AI에 매핑"</strong> — 이해하기 쉽고 운영하기 편함
          </p>
        </div>

      </div>
    </section>
  );
}
