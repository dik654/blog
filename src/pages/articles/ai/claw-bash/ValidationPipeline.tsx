import ValidationStagesViz from './viz/ValidationStagesViz';
import BannedPatternsViz from './viz/BannedPatternsViz';
import PathEscapeCheckViz from './viz/PathEscapeCheckViz';

export default function ValidationPipeline() {
  return (
    <section id="validation-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">6단계 검증 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ValidationStagesViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">BashValidator 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct BashValidator<'a> {
    cmd: &'a BashCommandInput,
    config: &'a BashConfig,
}

impl<'a> BashValidator<'a> {
    pub fn validate(&self) -> Result<()> {
        self.check_empty()?;           // 1단계
        self.check_length()?;          // 2단계
        self.check_banned_patterns()?; // 3단계
        self.classify_intent()?;       // 4단계
        self.check_working_dir()?;     // 5단계
        self.check_resource_limits()?; // 6단계
        Ok(())
    }
}`}</pre>
        <p>
          <strong>6단계 순차 검증</strong>: 빠른 검증을 먼저, 비싼 검증을 나중에<br />
          한 단계라도 실패하면 즉시 <code>Err</code> 반환 — 이후 검증 스킵
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — check_empty()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn check_empty(&self) -> Result<()> {
    let trimmed = self.cmd.command.trim();
    if trimmed.is_empty() {
        return Err(anyhow!("empty command"));
    }
    Ok(())
}`}</pre>
        <p>
          <strong>가장 빠른 검증</strong>: 문자열 trim + 길이 비교 — O(n) 1회 스캔<br />
          빈 명령은 LLM 환각의 대표적 패턴 — <code>bash("")</code>, <code>bash("  ")</code> 차단<br />
          shell은 빈 명령을 오류 없이 받아들임 → 사전 차단 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — check_length()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`const MAX_COMMAND_LENGTH: usize = 10 * 1024;  // 10KB

fn check_length(&self) -> Result<()> {
    if self.cmd.command.len() > MAX_COMMAND_LENGTH {
        return Err(anyhow!(
            "command too long: {} bytes (max {})",
            self.cmd.command.len(), MAX_COMMAND_LENGTH
        ));
    }
    Ok(())
}`}</pre>
        <p>
          <strong>10KB 상한</strong>: 대부분의 shell 명령은 수백 바이트 이내 — 10KB는 안전 마진<br />
          거대한 명령은 LLM 환각(반복 패턴) 또는 공격 시도 의심 — 조기 차단<br />
          실제 한계는 OS 기본 ARG_MAX(보통 128KB) — 이보다 훨씬 보수적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3단계 — check_banned_patterns()</h3>
        <BannedPatternsViz />
        <p>
          <strong>절대 차단 패턴</strong>: 복구 불가능한 시스템 파괴 명령<br />
          - <code>rm -rf /</code>: 루트 삭제<br />
          - fork bomb: 시스템 자원 고갈<br />
          - <code>dd of=/dev/sda</code>: 디스크 덮어쓰기<br />
          - <code>curl | sh</code>: MITM 공격 벡터
        </p>
        <p>
          <strong>Prompt도 없이 즉시 Deny</strong> — 실수로라도 실행하지 못하게<br />
          이 패턴들은 정당한 사용 케이스가 거의 없음 — 사용자가 진짜 필요하면 직접 터미널에서 실행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4단계 — classify_intent()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn classify_intent(&self) -> Result<()> {
    let intent = CommandIntent::classify(&self.cmd.command);

    match intent {
        CommandIntent::Destructive => {
            // Prompt 필요 표시 (Enforcer가 처리)
            self.cmd.metadata_mut().require_prompt = true;
        }
        CommandIntent::System => {
            // 시스템 제어는 항상 Prompt + 이중 확인
            self.cmd.metadata_mut().require_prompt = true;
            self.cmd.metadata_mut().require_confirm = true;
        }
        CommandIntent::Network => {
            // 네트워크 호출은 로깅 강화
            self.cmd.metadata_mut().log_network = true;
        }
        _ => {}
    }

    Ok(())
}`}</pre>
        <p>
          <strong>8가지 의도 분류</strong>: Read, Write, Destructive, Network, Execute, Package, System, Unknown<br />
          분류는 <strong>첫 단어 매칭</strong> — <code>rm</code>, <code>curl</code>, <code>sudo</code> 등<br />
          복합 파이프(<code>ls | grep x</code>)는 첫 명령(<code>ls</code>)로 분류 — 보수적 판정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">5단계 — check_working_dir()</h3>
        <PathEscapeCheckViz />
        <p>
          <strong>작업 디렉토리 경계 검증</strong>: bash 실행 경로도 워크스페이스 내부여야 함<br />
          심링크 이스케이프 방지 — <code>canonicalize()</code>로 실제 경로 해석 후 비교<br />
          LLM이 <code>working_directory: "/etc"</code> 시도해도 즉시 거부
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">6단계 — check_resource_limits()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn check_resource_limits(&self) -> Result<()> {
    // Timeout 상한
    let timeout_ms = self.cmd.timeout.unwrap_or(120_000);
    if timeout_ms > MAX_TIMEOUT_MS {
        return Err(anyhow!(
            "timeout too large: {}ms (max {}ms)",
            timeout_ms, MAX_TIMEOUT_MS
        ));
    }

    // run_in_background: 허용 여부
    if self.cmd.run_in_background && !self.config.allow_background {
        return Err(anyhow!("background execution disabled"));
    }

    Ok(())
}

const MAX_TIMEOUT_MS: u64 = 30 * 60 * 1000;  // 30분`}</pre>
        <p>
          <strong>타임아웃 상한 30분</strong>: 더 긴 명령은 거부 — 의도하지 않은 무한 루프 방지<br />
          30분은 대부분의 빌드·테스트 케이스 커버 — <code>cargo build --release</code>도 보통 10분 이내<br />
          <code>allow_background</code>: 설정으로 백그라운드 실행 자체를 끌 수 있음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">검증 실패 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 검증 실패 시 LLM에게 돌려주는 에러 메시지
if let Err(e) = validator.validate() {
    return Ok(ToolOutput {
        stdout: String::new(),
        stderr: format!("validation failed: {}", e),
        exit_code: -1,
    });
}

// LLM은 이 에러를 보고:
// 1. 다른 명령을 시도하거나
// 2. 사용자에게 제약 사항 설명`}</pre>
        <p>
          <strong>에러도 ToolOutput으로 반환</strong> — 세션을 종료하지 않고 LLM이 재시도 가능<br />
          에러 메시지는 LLM이 이해할 수 있게 구체적 — "validation failed: banned pattern: rm -rf /"<br />
          LLM은 이를 학습하여 다음 시도에서 반영 — "안전한 대체 명령" 제안
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 검증 순서 최적화</p>
          <p>
            6단계 순서는 <strong>"빠르고 확실한 것부터"</strong> 원칙:<br />
            1. empty (O(n))<br />
            2. length (O(1))<br />
            3. banned patterns (O(n×m), m=상수 9)<br />
            4. intent classify (O(n))<br />
            5. working_dir (fs 호출, 비쌈)<br />
            6. resource limits (O(1))
          </p>
          <p className="mt-2">
            working_dir가 5번째인 이유: <code>canonicalize()</code>가 <strong>파일 시스템 호출</strong>이라 가장 느림<br />
            앞 단계에서 이미 거부됐으면 fs 호출 없이 빠르게 종료<br />
            전체 검증 시간: 0.1ms 미만 (fs 호출 있을 때 ~1ms)
          </p>
        </div>

      </div>
    </section>
  );
}
