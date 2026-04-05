import EnforcerViz from './viz/EnforcerViz';

export default function Enforcer() {
  return (
    <section id="enforcer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PermissionEnforcer — 런타임 강제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <EnforcerViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PermissionEnforcer의 위치</h3>
        <p>
          <code>PermissionEnforcer</code>는 권한 시스템의 <strong>유일한 게이트</strong><br />
          모든 도구 호출은 <code>execute_tool()</code> 직전에 <code>enforcer.check()</code>를 통과<br />
          우회 불가 — enforcer를 건너뛰고 도구를 실행하는 경로가 구조적으로 없음
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PermissionEnforcer {
    pub mode: PermissionMode,
    pub policy: PermissionPolicy,
    pub prompt_handler: Arc<dyn PromptHandler>,  // 사용자 Y/N 입력 인터페이스
    pub workspace_root: PathBuf,
    pub blacklist: PathBlacklist,
}

pub enum EnforcementResult {
    Allow,
    Deny(String),
    Prompt(String),
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">check() — 5단계 판정</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PermissionEnforcer {
    pub fn check(&self, tool: &str, input: &Value) -> EnforcementResult {
        let ctx = Ctx::from_input(tool, input, &self.session);

        // 1) Policy 평가 (가장 세밀)
        match self.policy.evaluate(&ctx) {
            Action::Deny   => return EnforcementResult::Deny(ctx.reason_or_default()),
            Action::Allow  => return EnforcementResult::Allow,
            Action::Prompt => return EnforcementResult::Prompt(ctx.summary()),
        }

        // 2) Mode 비교
        let required = self.registry.get_spec(tool)?.required_permission;
        if self.mode >= required {
            // 3) 경로 검증 (파일 I/O만)
            if let Some(path) = ctx.path {
                if let err @ EnforcementResult::Deny(_) = self.check_path(path) {
                    return err;
                }
            }
            // 4) 명령 의도 분류 (bash만)
            if tool == "bash" {
                if let Some(cmd) = ctx.command {
                    if CommandIntent::classify(cmd) == CommandIntent::Destructive {
                        return EnforcementResult::Prompt(format!("파괴적 명령: {}", cmd));
                    }
                }
            }
            return EnforcementResult::Allow;
        }

        // 5) 차액 판정
        if self.can_prompt() {
            return EnforcementResult::Prompt(ctx.summary());
        }
        EnforcementResult::Deny(format!("{} requires {:?}", tool, required))
    }
}`}</pre>
        <p>
          <strong>판정 순서</strong>: Policy → Mode → 경로 → 명령 의도 → 차액<br />
          Policy가 가장 먼저 — 사용자 규칙이 기본 모드보다 우선<br />
          경로/명령 검증은 <strong>mode가 통과한 후</strong> 추가 방어층 역할
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PromptHandler — 사용자 확인 인터페이스</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[async_trait]
pub trait PromptHandler: Send + Sync {
    async fn prompt(&self, message: &str, options: PromptOptions) -> PromptResponse;
}

pub struct PromptOptions {
    pub remember: bool,  // "이번만/항상" 옵션 제공
    pub timeout: Duration,
}

pub enum PromptResponse {
    Yes,
    No,
    YesRemember,  // 이 도구+입력 조합을 Policy에 추가
    Timeout,      // 사용자 응답 없음 → Deny로 처리
}

// 구현체: CliPromptHandler
impl PromptHandler for CliPromptHandler {
    async fn prompt(&self, msg: &str, opts: PromptOptions) -> PromptResponse {
        println!("\\n⚠️  {}", msg);
        println!("  [y] Yes, [n] No{}", if opts.remember { ", [a] Always" } else { "" });
        print!("  > ");
        // stdin 읽기 (timeout 적용)
        match timeout(opts.timeout, read_line()).await {
            Ok(Ok(line)) => match line.trim() {
                "y" | "Y" => PromptResponse::Yes,
                "a" | "A" => PromptResponse::YesRemember,
                _         => PromptResponse::No,
            },
            _ => PromptResponse::Timeout,
        }
    }
}`}</pre>
        <p>
          <strong>3가지 옵션</strong>: Yes(1회만), No(거부), Always(Policy에 추가)<br />
          "Always" 선택 시 <strong>동적으로 Policy에 Allow 규칙 추가</strong> — 재확인 불필요<br />
          Timeout(기본 60초): 사용자 부재 시 안전하게 Deny — 의도치 않은 실행 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">경로 검증 — check_path()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn check_path(&self, path: &Path) -> EnforcementResult {
    // 1) 절대 경로화
    let absolute = if path.is_absolute() {
        path.to_path_buf()
    } else {
        self.workspace_root.join(path)
    };

    // 2) 워크스페이스 경계
    if !absolute.starts_with(&self.workspace_root) {
        return EnforcementResult::Deny(
            format!("outside workspace: {:?}", path));
    }

    // 3) 블랙리스트
    if self.blacklist.matches(&absolute) {
        return EnforcementResult::Deny(
            format!("blacklisted path: {:?}", path));
    }

    // 4) 심링크 이스케이프
    if let Ok(real) = absolute.canonicalize() {
        if !real.starts_with(&self.workspace_root) {
            return EnforcementResult::Deny("symlink escape".into());
        }
    }

    EnforcementResult::Allow
}`}</pre>
        <p>
          <strong>4단계 경로 검증</strong>: 절대 경로화 → 워크스페이스 → 블랙리스트 → 심링크<br />
          <code>canonicalize()</code>는 심링크를 따라가 실제 경로 반환 — OS 레벨 시스템 콜<br />
          심링크 이스케이프는 <strong>가장 교묘한 우회 경로</strong> — 공격자가 <code>workspace/x → /etc/passwd</code> 설정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">permission_log에 판정 기록</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// check() 호출마다 Session의 permission_log에 기록
pub struct PermDecision {
    pub timestamp: DateTime<Utc>,
    pub tool: String,
    pub result: EnforcementResult,
    pub reason: String,
    pub prompt_response: Option<PromptResponse>,
}

// 사용 예
self.session.permission_log.push(PermDecision {
    timestamp: Utc::now(),
    tool: tool.into(),
    result: decision.clone(),
    reason: reason_text,
    prompt_response: if let EnforcementResult::Prompt(_) = decision {
        Some(user_response)
    } else { None },
});`}</pre>
        <p>
          <strong>감사 로그(audit trail)</strong>: 모든 권한 판정이 Session에 기록<br />
          나중에 "왜 이 작업이 차단됐나?" 질문에 답할 수 있음<br />
          CI 환경에서 <code>permission_log</code>를 분석하여 정책 개선 힌트 획득 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 단일 게이트의 보안 이점</p>
          <p>
            "모든 도구 호출이 하나의 함수를 거침"이 보안 감사의 핵심<br />
            - 코드 리뷰 시 <code>check()</code> 하나만 깊게 검토하면 전체 커버<br />
            - 새 도구 추가 시 <strong>우회 불가</strong> — 반드시 enforcer 거쳐야 호출 가능<br />
            - 감사 로그가 단일 소스 — permission_log만 보면 전체 행위 이력 파악
          </p>
          <p className="mt-2">
            반대 극(분산 게이트): 각 도구가 자체 검증 구현<br />
            - 코드 리뷰 복잡도 O(N) — N개 도구 각각 검토<br />
            - 누락 위험 — 새 도구가 검증 빠뜨릴 수 있음<br />
            - 일관성 부족 — 도구마다 에러 메시지·로그 포맷 다름
          </p>
        </div>

      </div>
    </section>
  );
}
