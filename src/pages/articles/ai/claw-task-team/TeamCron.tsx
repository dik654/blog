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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct Team {
    pub id: TeamId,
    pub name: String,
    pub description: String,

    // 팀 구성
    pub worker_pool: Vec<WorkerConfig>,
    pub max_concurrent_tasks: usize,

    // 스코프
    pub task_tags: Vec<String>,        // 이 팀이 받을 task 태그
    pub file_patterns: Vec<String>,    // 작업 범위 (glob)
    pub excluded_patterns: Vec<String>,

    // 계약
    pub team_claude_md: Option<String>,  // 팀 전용 CLAUDE.md
}

pub struct WorkerConfig {
    pub model: String,
    pub system_prompt_extension: String,
}`}</pre>
        <p>
          <strong>Team = Worker pool + 스코프 + 계약</strong><br />
          worker_pool: 같은 팀 여러 worker가 병렬 작업<br />
          task_tags: 특정 태그의 task만 받음 (<code>"backend"</code> 태그 task → backend 팀)<br />
          team_claude_md: 팀별 커스텀 가이드라인 — 시스템 프롬프트에 삽입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TeamCreate 도구</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// LLM이 런타임에 팀 생성
tool_use {
  name: "TeamCreate",
  input: {
    name: "frontend",
    description: "React/TS 작업 담당",
    task_tags: ["frontend", "react"],
    file_patterns: ["src/web/**", "src/components/**"],
    excluded_patterns: ["src/web/legacy/**"],
    max_concurrent_tasks: 3,
    team_claude_md: "React 19 사용. TypeScript strict 모드. ..."
  }
}`}</pre>
        <p>
          <strong>런타임 팀 생성</strong>: LLM이 작업을 논리적으로 분할 가능<br />
          "frontend vs backend" 자동 분리 → task 배정 자동화<br />
          team_claude_md로 팀별 코딩 컨벤션 주입 — 일관성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Task 자동 배정 — assign_by_team()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TeamRegistry {
    pub async fn assign_task_to_team(&self, task: &TaskPacket) -> Option<TeamId> {
        let teams = self.teams.read().await;

        // 태그 기반 매칭
        let tag_matches: Vec<_> = teams.values()
            .filter(|team| {
                task.tags.iter().any(|tag| team.task_tags.contains(tag))
            })
            .collect();

        if tag_matches.is_empty() {
            // 파일 패턴 기반 매칭 (fallback)
            return self.match_by_file_patterns(task);
        }

        // 부하가 적은 팀 선택
        let least_loaded = tag_matches.iter()
            .min_by_key(|team| team.current_task_count());

        least_loaded.map(|t| t.id.clone())
    }
}`}</pre>
        <p>
          <strong>2단계 매칭</strong>: 태그 우선 → 파일 패턴 폴백<br />
          여러 팀 매칭 시 <strong>부하 최소 팀</strong> 선택<br />
          max_concurrent_tasks 초과 팀은 pool에서 제외
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cron 스케줄링</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct CronJob {
    pub id: CronId,
    pub name: String,
    pub schedule: String,           // "0 2 * * *" (매일 새벽 2시)
    pub task_template: TaskPacket,
    pub last_run: Option<DateTime<Utc>>,
    pub next_run: DateTime<Utc>,
    pub enabled: bool,
}

// CronCreate 도구 사용
tool_use {
  name: "CronCreate",
  input: {
    name: "nightly-cleanup",
    schedule: "0 2 * * *",
    task_template: {
      title: "Clean up stale branches",
      tags: ["maintenance"],
      goals: [...]
    }
  }
}`}</pre>
        <p>
          <strong>표준 cron 표현식</strong>: 5필드 (분 시 일 월 요일)<br />
          <code>task_template</code>: 매 실행마다 이 템플릿으로 새 task 생성<br />
          시간 지나면 task가 자동 쌓임 — 정기 작업 자동화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CronScheduler — 실행 루프</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct CronScheduler {
    jobs: RwLock<HashMap<CronId, CronJob>>,
}

impl CronScheduler {
    pub async fn run_loop(&self) {
        loop {
            tokio::time::sleep(Duration::from_secs(60)).await;  // 1분 주기

            let now = Utc::now();
            let mut jobs = self.jobs.write().await;

            for job in jobs.values_mut() {
                if !job.enabled { continue; }
                if job.next_run > now { continue; }

                // task 생성
                let mut task = job.task_template.clone();
                task.title = format!("{} ({})", task.title, now.format("%Y-%m-%d"));
                task.created_at = now;

                // 레지스트리에 등록
                let task_id = global_task_registry().create(task).await.ok();
                log::info!("cron '{}' created task {:?}", job.name, task_id);

                // 다음 실행 시각 계산
                job.last_run = Some(now);
                job.next_run = parse_cron_next(&job.schedule, now);
            }
        }
    }
}`}</pre>
        <p>
          <strong>1분 주기 체크</strong>: cron은 분 단위 정밀도<br />
          각 실행 시 task 사본 생성 — 템플릿은 불변<br />
          task 제목에 날짜 붙임 — 구분 용이
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">cron 파서 — parse_cron_next()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`use cron::Schedule;

fn parse_cron_next(expr: &str, from: DateTime<Utc>) -> DateTime<Utc> {
    let schedule: Schedule = expr.parse().expect("invalid cron");
    schedule.after(&from).next().unwrap()
}

// 지원 형식
// "*/5 * * * *"      매 5분
// "0 */2 * * *"      매 2시간
// "0 9 * * MON-FRI"  평일 오전 9시
// "0 0 1 * *"        매월 1일 자정`}</pre>
        <p>
          <code>cron</code> crate: 표준 Unix cron 표현식 파싱<br />
          요일 이름(MON, TUE), 범위(MON-FRI), 증분(<code>*/5</code>) 지원<br />
          <code>schedule.after(from)</code>: 기준 시각 이후 다음 실행 시점 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사용 시나리오</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오 1: 매일 새벽 의존성 업데이트
cron: "0 2 * * *"
task: "cargo update && cargo test"

// 시나리오 2: 매주 월요일 오래된 이슈 정리
cron: "0 9 * * MON"
task: "stale 이슈 검토 후 close 처리"

// 시나리오 3: 매시간 빌드 상태 체크
cron: "0 * * * *"
task: "main 브랜치 CI 상태 확인, 실패 시 알림"

// 시나리오 4: 분기별 보안 패치 점검
cron: "0 0 1 */3 *"
task: "security advisory 목록 확인, 패치 필요 시 PR 생성"`}</pre>

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
