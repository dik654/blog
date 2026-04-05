import ValidationViz from './viz/ValidationViz';

export default function Validation() {
  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">패킷 검증 &amp; 스코프 해석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ValidationViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">TaskPacket::validate()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskPacket {
    pub fn validate(&self) -> Result<()> {
        // 1) 필수 필드
        if self.title.is_empty() {
            return Err(anyhow!("title required"));
        }
        if self.title.len() > 200 {
            return Err(anyhow!("title too long (max 200)"));
        }

        // 2) Goals 하나 이상
        if self.goals.is_empty() {
            return Err(anyhow!("at least one goal required"));
        }

        // 3) 의존성 self-reference
        if self.depends_on.contains(&self.id) {
            return Err(anyhow!("self-dependency"));
        }

        // 4) 완료 확인 명령 safety
        for goal in &self.goals {
            if let Some(cmd) = &goal.completion_check {
                if contains_dangerous_patterns(cmd) {
                    return Err(anyhow!("dangerous completion_check: {}", cmd));
                }
            }
        }

        // 5) 제약 일관성
        self.validate_constraints()?;

        Ok(())
    }
}`}</pre>
        <p>
          <strong>5단계 검증</strong>: 필수 필드 → Goals → 의존성 → 안전성 → 일관성<br />
          완료 확인 명령에 <code>rm -rf</code> 등 위험 패턴 차단<br />
          조기 검증으로 "생성된 task가 나중에 실패"하는 경우 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Constraint 일관성 체크</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskPacket {
    fn validate_constraints(&self) -> Result<()> {
        // NoTouchFiles와 OnlyLanguages 충돌 가능성
        for c in &self.constraints {
            match &c.kind {
                ConstraintKind::NoTouchFiles(files) => {
                    // 파일 패턴이 유효한지
                    for pattern in files {
                        glob::Pattern::new(pattern)
                            .map_err(|e| anyhow!("invalid glob '{}': {}", pattern, e))?;
                    }
                }
                ConstraintKind::MaxChanges(n) if *n == 0 => {
                    return Err(anyhow!("MaxChanges=0 makes task impossible"));
                }
                _ => {}
            }
        }

        // 중복 constraint 감지
        let kinds: HashSet<_> = self.constraints.iter()
            .map(|c| std::mem::discriminant(&c.kind))
            .collect();
        if kinds.len() != self.constraints.len() {
            log::warn!("duplicate constraint kinds");
        }

        Ok(())
    }
}`}</pre>
        <p>
          <strong>패턴 유효성</strong>: glob 파싱 실패 = invalid task<br />
          <strong>불가능 조건</strong>: MaxChanges=0 차단 — 작업 자체가 불가<br />
          중복 constraint는 경고만 — 허용하되 주의 환기
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스코프 해석 — resolve_scope()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskPacket {
    pub async fn resolve_scope(&self, workspace: &Path) -> Result<ResolvedScope> {
        let mut allowed_files = Vec::new();
        let mut denied_files = Vec::new();

        // 1) 팀의 file_patterns 적용
        if let Some(team_id) = &self.assigned_team {
            let team = global_team_registry().get(team_id).await?;
            for pattern in &team.file_patterns {
                allowed_files.extend(expand_glob(workspace, pattern).await?);
            }
            for pattern in &team.excluded_patterns {
                denied_files.extend(expand_glob(workspace, pattern).await?);
            }
        } else {
            // 팀 없으면 워크스페이스 전체
            allowed_files.push(workspace.to_path_buf());
        }

        // 2) Task constraint 적용
        for c in &self.constraints {
            if let ConstraintKind::NoTouchFiles(patterns) = &c.kind {
                for p in patterns {
                    denied_files.extend(expand_glob(workspace, p).await?);
                }
            }
        }

        // 3) 블랙리스트 (전역)
        denied_files.extend(default_blacklist_paths(workspace));

        Ok(ResolvedScope {
            allowed: allowed_files,
            denied: denied_files,
        })
    }
}`}</pre>
        <p>
          <strong>3단계 스코프 해석</strong>: 팀 패턴 → task constraint → 전역 블랙리스트<br />
          각 단계는 allow/deny 리스트에 누적<br />
          최종 결과: 명시적 allow 목록 + 명시적 deny 목록 (deny 우선)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ResolvedScope 활용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct ResolvedScope {
    pub allowed: Vec<PathBuf>,
    pub denied: Vec<PathBuf>,
}

impl ResolvedScope {
    pub fn is_allowed(&self, path: &Path) -> bool {
        // 1) denied 체크 (우선)
        if self.denied.iter().any(|d| path.starts_with(d)) {
            return false;
        }
        // 2) allowed 체크
        self.allowed.iter().any(|a| path.starts_with(a))
    }
}

// PermissionEnforcer와 통합
impl PermissionEnforcer {
    pub fn check_task_scope(&self, path: &Path) -> Result<()> {
        if let Some(scope) = &self.current_task_scope {
            if !scope.is_allowed(path) {
                return Err(anyhow!("path outside task scope: {:?}", path));
            }
        }
        Ok(())
    }
}`}</pre>
        <p>
          <strong>Task 스코프 = 추가 권한 레이어</strong><br />
          기본 워크스페이스 경계 위에 <strong>task별 서브 스코프</strong><br />
          예: "frontend 팀 task는 src/web/만 수정 가능"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">완료 판정 — check_completion()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskPacket {
    pub async fn check_completion(&self) -> CompletionStatus {
        let mut passed = 0;
        let mut total = 0;

        for goal in &self.goals {
            if let Some(cmd) = &goal.completion_check {
                total += 1;
                let success = tokio::process::Command::new("/bin/sh")
                    .arg("-c").arg(cmd)
                    .status()
                    .await
                    .map(|s| s.success())
                    .unwrap_or(false);

                if success { passed += 1; }
            }
        }

        if total == 0 {
            return CompletionStatus::ManualReview;
        }

        if passed == total {
            CompletionStatus::AllGoalsPassed
        } else if passed > 0 {
            CompletionStatus::PartiallyComplete { passed, total }
        } else {
            CompletionStatus::NotComplete
        }
    }
}`}</pre>
        <p>
          <strong>Goals의 completion_check 실행</strong>: 각 명령이 exit 0이면 통과<br />
          4가지 결과: AllGoalsPassed, PartiallyComplete, NotComplete, ManualReview<br />
          ManualReview: 자동 확인 명령 없음 → 사람이 검토 필요
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 검증의 계층적 구조</p>
          <p>
            TaskPacket은 3단계 검증을 거침:
          </p>
          <p className="mt-2">
            <strong>1단계 (생성 시)</strong>: validate() — 스키마·일관성<br />
            <strong>2단계 (실행 시)</strong>: resolve_scope() — 권한·범위<br />
            <strong>3단계 (완료 시)</strong>: check_completion() — 목표 달성
          </p>
          <p className="mt-2">
            각 단계가 독립 책임:<br />
            - 1단계: "task 자체가 말이 되나?"<br />
            - 2단계: "이 task가 접근 가능한 파일은?"<br />
            - 3단계: "task가 완료됐나?"
          </p>
          <p className="mt-2">
            이 계층이 제공하는 가치: <strong>각 단계에서 명확한 피드백</strong><br />
            1단계 실패 → task 수정<br />
            2단계 실패 → 팀·권한 조정<br />
            3단계 실패 → LLM 재작업<br />
            → 사용자가 무엇을 고쳐야 할지 명확히 알 수 있음
          </p>
        </div>

      </div>
    </section>
  );
}
