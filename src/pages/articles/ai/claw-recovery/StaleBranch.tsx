import StaleBranchViz from './viz/StaleBranchViz';

export default function StaleBranch() {
  return (
    <section id="stale-branch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StaleBranch — 브랜치 신선도 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <StaleBranchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Stale Branch란</h3>
        <p>
          Stale Branch: <strong>오래된 브랜치</strong> — 활동 없이 시간이 경과하여 가치가 감소한 상태<br />
          방치 시 문제:<br />
          - target 브랜치와 drift 발생 → merge 어려움 ↑<br />
          - 저장소 저장소 오염 (브랜치 100개+)<br />
          - 리소스 낭비 (CI 재실행, 메모리)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">StaleBranchDetector 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct StaleBranchDetector {
    pub no_activity_threshold: Duration,     // 7일
    pub drift_threshold_commits: usize,      // 100
    pub failure_threshold: u32,              // 5회
}

pub enum StaleReason {
    NoActivity { duration: Duration },
    LargeDrift { commits_behind: usize },
    TooManyFailures { count: u32 },
    ExplicitlyAbandoned,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">3가지 stale 탐지 기준</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl StaleBranchDetector {
    pub async fn check(&self, lane: &Lane) -> Option<StaleReason> {
        // 1) 무활동 시간 체크
        let since_activity = Utc::now() - lane.last_activity;
        if since_activity > self.no_activity_threshold {
            return Some(StaleReason::NoActivity {
                duration: since_activity.to_std().unwrap(),
            });
        }

        // 2) target과의 drift 체크
        let behind = git_client::commits_behind(&lane.branch, "main").await.ok()?;
        if behind > self.drift_threshold_commits {
            return Some(StaleReason::LargeDrift { commits_behind: behind });
        }

        // 3) 누적 실패 횟수
        if lane.failure_count >= self.failure_threshold {
            return Some(StaleReason::TooManyFailures {
                count: lane.failure_count,
            });
        }

        None
    }
}`}</pre>
        <p>
          <strong>3가지 판정 기준</strong>: 시간, drift, 실패 횟수<br />
          하나라도 해당하면 stale 판정 — 보수적 접근<br />
          임계값은 프로젝트별 조정 — 빠른 변화 프로젝트는 낮은 threshold
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">stale 브랜치 처리 액션</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum StaleAction {
    RefreshBranch { rebase_onto: String },  // rebase 시도로 신선화
    NotifyOwner { message: String },        // 사용자에게 알림만
    AbandonLane,                             // 완전 폐기
    ArchiveBranch { tag: String },           // 별도 태그로 아카이브 후 삭제
}

// 기본 매핑
fn default_action(reason: &StaleReason) -> StaleAction {
    match reason {
        StaleReason::NoActivity { duration } if duration.as_secs() < 14 * 24 * 3600 => {
            StaleAction::NotifyOwner {
                message: "7일 이상 활동 없음".into(),
            }
        }
        StaleReason::NoActivity { .. } => StaleAction::AbandonLane,  // 14일+
        StaleReason::LargeDrift { .. } => StaleAction::RefreshBranch {
            rebase_onto: "main".into(),
        },
        StaleReason::TooManyFailures { .. } => StaleAction::AbandonLane,
        StaleReason::ExplicitlyAbandoned => StaleAction::ArchiveBranch {
            tag: format!("abandoned/{}", Utc::now().format("%Y%m%d")),
        },
    }
}`}</pre>
        <p>
          <strong>기본 정책</strong>:<br />
          - 7일 무활동 → 알림<br />
          - 14일+ 무활동 → 폐기<br />
          - drift 큼 → rebase 시도<br />
          - 실패 5회+ → 폐기<br />
          - 폐기 → 태그 백업 후 브랜치 삭제
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">refresh — rebase로 신선화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn refresh_stale_branch(
    branch: &str,
    target: &str,
) -> Result<RefreshOutcome> {
    // 1) target 최신화
    git_client::fetch(target).await?;

    // 2) rebase 시도
    let rebase_result = git_client::try_rebase(branch, target).await;

    match rebase_result {
        Ok(()) => Ok(RefreshOutcome::Clean),

        Err(e) if e.is_conflict() => {
            // 충돌 발생 → LLM 위임 필요
            Ok(RefreshOutcome::NeedsLLMHelp {
                conflicts: e.conflict_files(),
            })
        }

        Err(e) => Ok(RefreshOutcome::Failed(e.to_string())),
    }
}

pub enum RefreshOutcome {
    Clean,                          // 자동 rebase 성공
    NeedsLLMHelp { conflicts: Vec<PathBuf> },
    Failed(String),
}`}</pre>
        <p>
          <strong>3가지 결과</strong>: Clean, NeedsLLMHelp, Failed<br />
          Clean: 자동 rebase로 신선화 완료<br />
          NeedsLLMHelp: 충돌 발생 → Recovery 레시피로 에스컬레이션<br />
          Failed: rebase 시도 자체 실패 (권한 문제 등)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">아카이브 — ArchiveBranch</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn archive_branch(branch: &str, tag: &str) -> Result<()> {
    // 1) 태그 생성 (브랜치 현재 커밋 가리킴)
    git_client::create_tag(tag, branch).await?;

    // 2) 태그 푸시
    git_client::push_tag(tag).await?;

    // 3) 브랜치 삭제 (로컬 + 원격)
    git_client::delete_branch(branch).await?;
    git_client::push_delete_remote_branch(branch).await?;

    log::info!("archived {} as tag {}", branch, tag);
    Ok(())
}`}</pre>
        <p>
          <strong>태그 백업 후 삭제</strong>: 완전 삭제 대신 태그로 보존<br />
          태그는 나중에 복구 가능 — 실수 방지<br />
          태그 이름에 날짜 포함 — <code>abandoned/20260405</code> 형식
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 스캔 — stale_scan_loop</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn stale_scan_loop(
    engine: Arc<Mutex<PolicyEngine>>,
    detector: StaleBranchDetector,
) {
    loop {
        tokio::time::sleep(Duration::from_secs(3600)).await;  // 1시간 주기

        let lanes: Vec<_> = {
            let engine = engine.lock().await;
            engine.lanes.values().cloned().collect()
        };

        for lane in lanes {
            if let Some(reason) = detector.check(&lane).await {
                let action = default_action(&reason);
                log::info!("stale lane {}: {:?} → {:?}", lane.id, reason, action);

                // 액션 실행
                apply_stale_action(&lane, &action).await.ok();
            }
        }
    }
}`}</pre>
        <p>
          <strong>1시간 주기 스캔</strong>: PolicyEngine 평가(30초)와 별도<br />
          stale 탐지는 느린 변화 — 고주기 체크 불필요<br />
          모든 Lane 스캔 후 stale인 것만 처리
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 브랜치 관리의 심리적 요소</p>
          <p>
            자동 브랜치 삭제는 <strong>심리적 저항</strong>이 큼:<br />
            - "혹시 나중에 필요할 수도"<br />
            - "작업한 내용 사라질까 두려움"
          </p>
          <p className="mt-2">
            claw-code의 대응:<br />
            ✓ <strong>단계적 처리</strong>: 알림 → 폐기 → 아카이브<br />
            ✓ <strong>태그 백업</strong>: 절대 완전 삭제 안 함<br />
            ✓ <strong>명시적 사용자 확인</strong>: 14일+ 폐기 전 알림
          </p>
          <p className="mt-2">
            이 정책이 제공하는 것: <strong>심리적 안전 + 저장소 정리</strong><br />
            사용자는 "필요하면 복구 가능"이라고 안심<br />
            저장소는 활동적인 브랜치만 유지 — 탐색·머지 용이
          </p>
          <p className="mt-2">
            트레이드오프: 태그가 쌓이면 태그 오염 — <strong>오래된 태그 정리</strong> 추가 정책 필요<br />
            claw-code는 현재 이를 수동 관리 — 향후 자동화 로드맵
          </p>
        </div>

      </div>
    </section>
  );
}
