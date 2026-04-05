import RecipesViz from './viz/RecipesViz';

export default function Recipes() {
  return (
    <section id="recipes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RecoveryRecipe — 시나리오별 복구 절차</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RecipesViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">RecoveryRecipe 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct RecoveryRecipe {
    pub name: String,
    pub matches: FailureClassMatcher,
    pub steps: Vec<RecoveryStep>,
}

pub enum RecoveryStep {
    Rebase { target: String },
    ResetToHead,
    SendToLLM { prompt: String, context_from_failure: bool },
    RerunCi,
    WaitForChange { timeout: Duration },
    DeleteFiles { paths: Vec<String> },
    RunCommand(String),
    ForkLane,
}`}</pre>
        <p>
          <strong>8종 복구 단계</strong>: VCS 조작, LLM 호출, CI 재실행, 파일 조작<br />
          단계를 조합하여 복잡한 복구 시나리오 구성<br />
          각 단계는 독립적으로 실패 가능 — 다음 단계로 진행 여부 결정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">기본 레시피 — BuildFailed 대응</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`RecoveryRecipe {
    name: "build-failure-retry".into(),
    matches: FailureClassMatcher::BuildFailed,
    steps: vec![
        // 1. LLM에게 컴파일 에러 전달 + 수정 요청
        RecoveryStep::SendToLLM {
            prompt: "빌드 실패. 아래 에러를 분석하고 수정:".into(),
            context_from_failure: true,  // 에러 로그 자동 포함
        },
        // 2. CI 재실행
        RecoveryStep::RerunCi,
        // 3. 결과 대기 (10분)
        RecoveryStep::WaitForChange {
            timeout: Duration::from_secs(600),
        },
    ],
}`}</pre>
        <p>
          <strong>3단계 복구</strong>: LLM 수정 → CI 재실행 → 대기<br />
          LLM에게 <code>context_from_failure=true</code>로 빌드 로그 자동 전달<br />
          CI 대기 10분 — 대부분 빌드·테스트 완료되는 시간
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MergeConflict 레시피</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`RecoveryRecipe {
    name: "merge-conflict-rebase".into(),
    matches: FailureClassMatcher::MergeConflict,
    steps: vec![
        // 1. target 브랜치 최신화 후 rebase 시도
        RecoveryStep::Rebase { target: "main".into() },
        // 2. 충돌 난 파일을 LLM에게 전달하여 해결 요청
        RecoveryStep::SendToLLM {
            prompt: "rebase 충돌. 충돌 마커를 해결:".into(),
            context_from_failure: true,
        },
        // 3. rebase --continue
        RecoveryStep::RunCommand("git rebase --continue".into()),
        // 4. CI 재실행
        RecoveryStep::RerunCi,
    ],
}`}</pre>
        <p>
          <strong>Git rebase 워크플로우</strong>: rebase 시도 → LLM 충돌 해결 → continue → CI<br />
          LLM에게 충돌 파일 전체 내용 전달 — conflict marker 포함<br />
          rebase 성공하면 linear history 유지 — merge commit 오염 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TestFailed 레시피</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`RecoveryRecipe {
    name: "test-failure-fix".into(),
    matches: FailureClassMatcher::TestFailed,
    steps: vec![
        // 1. LLM에게 실패 테스트 목록 + 로그 전달
        RecoveryStep::SendToLLM {
            prompt: "테스트 실패. 원인 파악 후 수정:".into(),
            context_from_failure: true,
        },
        // 2. 수정 후 로컬 테스트 실행 (전체 대신 실패 테스트만)
        RecoveryStep::RunCommand("cargo test failing_test_name".into()),
        // 3. 성공 시 전체 CI 재실행
        RecoveryStep::RerunCi,
    ],
}`}</pre>
        <p>
          <strong>타겟 테스트 우선 실행</strong>: 전체 CI 대기 전에 빠른 피드백<br />
          로컬에서 실패 테스트만 실행 — 10초 내 결과 확인<br />
          통과 시 전체 CI 실행 — 회귀 없음 확인
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Stalled 레시피 — 무활동 감지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`RecoveryRecipe {
    name: "stalled-kick".into(),
    matches: FailureClassMatcher::Stalled,
    steps: vec![
        // 1. 현재 상황 요약 LLM에게 전달 + 다음 단계 요청
        RecoveryStep::SendToLLM {
            prompt: "Lane이 1시간 활동 없음. 현재 상태 분석 후 다음 단계 결정:".into(),
            context_from_failure: true,
        },
    ],
}`}</pre>
        <p>
          <strong>간단한 레시피</strong>: LLM에게 상황 전달만<br />
          LLM이 "현재 상태 보고 다음 할 일" 판단 → 자율적 진행 재개<br />
          복잡한 로직 없음 — LLM 지능에 위임
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">execute() — 레시피 실행</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl RecoveryRecipe {
    pub async fn execute(&self, lane: &Lane) -> Result<RecoveryOutcome> {
        log::info!("executing recipe '{}' for lane {}", self.name, lane.id);

        for (idx, step) in self.steps.iter().enumerate() {
            log::info!("  step {}/{}: {:?}", idx + 1, self.steps.len(), step);

            match step.execute(lane).await {
                Ok(()) => continue,
                Err(e) => {
                    log::warn!("step {} failed: {}", idx + 1, e);

                    // 부분 복구 판정
                    if idx > 0 {
                        return Ok(RecoveryOutcome::PartiallyRecovered);
                    } else {
                        return Ok(RecoveryOutcome::Failed(e.to_string()));
                    }
                }
            }
        }

        Ok(RecoveryOutcome::Succeeded)
    }
}`}</pre>
        <p>
          <strong>순차 실행</strong>: 한 단계라도 실패하면 중단<br />
          첫 단계 실패 = Failed, 이후 실패 = PartiallyRecovered<br />
          부분 복구는 Lane 상태가 일부 개선됐음을 의미 — 다음 평가에서 재시도
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 실행 — RecoveryStep::execute()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl RecoveryStep {
    pub async fn execute(&self, lane: &Lane) -> Result<()> {
        match self {
            Self::Rebase { target } => {
                git_client::rebase_onto(&lane.branch, target).await
            }

            Self::SendToLLM { prompt, context_from_failure } => {
                let ctx = if *context_from_failure {
                    build_failure_context(lane).await?
                } else {
                    String::new()
                };
                let full_prompt = format!("{}\\n\\n{}", prompt, ctx);
                llm_session::send_and_wait(&lane.id, &full_prompt).await?;
                Ok(())
            }

            Self::RerunCi => ci_client::trigger_rerun(&lane.branch).await,

            Self::WaitForChange { timeout } => {
                let deadline = Instant::now() + *timeout;
                loop {
                    if Instant::now() > deadline {
                        return Err(anyhow!("timeout waiting for change"));
                    }
                    if ci_client::has_new_result(&lane.branch).await? { break; }
                    tokio::time::sleep(Duration::from_secs(30)).await;
                }
                Ok(())
            }

            Self::RunCommand(cmd) => {
                let status = tokio::process::Command::new("/bin/sh")
                    .arg("-c").arg(cmd)
                    .status().await?;
                if !status.success() { return Err(anyhow!("command failed")); }
                Ok(())
            }

            // ... 나머지 단계
            _ => Ok(()),
        }
    }
}`}</pre>
        <p>
          <strong>각 단계가 독립적 async 함수</strong>: 명확한 책임<br />
          Rebase → git_client 호출, SendToLLM → LLM 세션 재사용<br />
          WaitForChange는 polling 기반 — 더 나은 구현은 webhook 기반
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 복구 레시피 확장성</p>
          <p>
            기본 레시피만으로는 모든 프로젝트 커버 불가 — 사용자 확장 필수
          </p>
          <p className="mt-2">
            <strong>확장 방법 3가지</strong>:<br />
            1. <strong>YAML 레시피</strong>: <code>.claw/recovery-recipes.yaml</code>에 정의<br />
            2. <strong>스크립트 단계</strong>: <code>RunCommand</code>로 임의 셸 실행<br />
            3. <strong>LLM 위임</strong>: <code>SendToLLM</code>으로 복잡한 판단 위임
          </p>
          <p className="mt-2">
            LLM 위임의 가치: <strong>"경험 기반 휴리스틱"</strong>을 코드로 표현 불필요<br />
            - "이 에러 패턴은 보통 X 때문이다"<br />
            - "이 상황에서는 Y 접근이 더 나았다"<br />
            → LLM 프롬프트로 전달하여 판단 맡김
          </p>
          <p className="mt-2">
            claw-code의 레시피는 <strong>"기계적 + 판단적"</strong> 혼합<br />
            Rebase/RunCommand는 기계적, SendToLLM은 판단적<br />
            이 혼합이 "완전 자동 & 지능적" 복구 가능하게 함
          </p>
        </div>

      </div>
    </section>
  );
}
