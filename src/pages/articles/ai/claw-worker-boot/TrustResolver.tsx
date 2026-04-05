import TrustDecisionViz from './viz/TrustDecisionViz';
import RiskSignalsFlagsViz from './viz/RiskSignalsFlagsViz';

export default function TrustResolver() {
  return (
    <section id="trust-resolver" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TrustResolver — 경로 기반 신뢰 판정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TrustDecisionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">신뢰 판정이 필요한 이유</h3>
        <p>
          Worker는 <strong>임의의 워크스페이스</strong>에서 실행 — 신뢰할 수 없는 코드·설정 포함 가능<br />
          해당 워크스페이스의 CLAUDE.md, .claw/, hooks 등이 claw-code 동작을 좌우<br />
          악의적 설정이 있으면 Worker가 엉뚱한 동작 — 따라서 <strong>실행 전 신뢰 판정</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TrustDecision 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum TrustDecision {
    FullyTrusted,              // 완전 신뢰 — 모든 설정 적용
    Restricted(Vec<TrustFlag>), // 부분 신뢰 — 특정 기능만 제한
    Untrusted(String),         // 불신 — 실행 차단
}

pub enum TrustFlag {
    NoHooks,        // 훅 실행 금지
    NoSlashCmds,    // 커스텀 슬래시 명령 금지
    NoMcpServers,   // MCP 서버 시작 금지
    NoAutoRun,      // 자동 실행 비활성
    ReadOnlyFs,     // 파일 시스템 읽기 전용
}`}</pre>
        <p>
          <strong>3단계 신뢰 수준</strong>: Fully → Restricted → Untrusted<br />
          Restricted는 가장 흔한 판정 — 완전 신뢰하기 어려운 외부 프로젝트<br />
          TrustFlag로 세밀 제한 — 훅만 금지, MCP만 금지 등
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">판정 기준 — 5개 검사</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TrustResolver {
    pub async fn resolve(workspace: &Path) -> Result<TrustDecision> {
        // 1) 사용자 명시 신뢰 리스트 확인
        if is_user_trusted(workspace).await? {
            return Ok(TrustDecision::FullyTrusted);
        }

        // 2) 글로벌 신뢰 패턴 매칭 (~/.claw/trust.json)
        let flags = match_global_trust_patterns(workspace)?;

        // 3) 해당 워크스페이스에 이전 실행 기록이 있는가
        let history = load_trust_history(workspace).await?;
        if history.has_user_approval() {
            return Ok(TrustDecision::Restricted(flags));
        }

        // 4) 자동 위험 신호 탐지
        let risks = detect_risk_signals(workspace).await?;
        if risks.is_critical() {
            return Ok(TrustDecision::Untrusted(risks.reason()));
        }

        // 5) 사용자 Prompt
        let user_response = prompt_user_trust(workspace, &risks).await?;
        match user_response {
            TrustPromptResponse::Trust     => Ok(TrustDecision::FullyTrusted),
            TrustPromptResponse::Restrict  => Ok(TrustDecision::Restricted(flags)),
            TrustPromptResponse::Reject    => Ok(TrustDecision::Untrusted("user rejected".into())),
        }
    }
}`}</pre>
        <p>
          <strong>5단계 판정</strong>: 사용자 리스트 → 글로벌 패턴 → 이력 → 위험 신호 → 사용자 Prompt<br />
          조기 반환 — 확실한 케이스는 Prompt 없이 즉시 결정<br />
          최종 폴백이 사용자 Prompt — 자동 판정 실패 시 사용자가 결정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">사용자 신뢰 리스트 — ~/.claw/trust.json</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ~/.claw/trust.json
{
  "fully_trusted": [
    "/home/user/my-projects",         // 디렉토리 (재귀)
    "/home/user/work/*",              // 글롭 패턴
    "/home/user/oss/claude-code"      // 특정 프로젝트
  ],
  "restricted": [
    {"path": "/home/user/experiments", "flags": ["NoHooks"]}
  ],
  "untrusted": [
    "/tmp/*",                         // 임시 디렉토리 불신
    "/mnt/external/*"                 // 외장 미디어 불신
  ]
}`}</pre>
        <p>
          <strong>3 계층 리스트</strong>: fully_trusted, restricted, untrusted<br />
          글롭 패턴 지원 — <code>/home/user/work/*</code>는 모든 서브디렉토리 매칭<br />
          우선순위: untrusted &gt; restricted &gt; fully_trusted (엄격 우선)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">위험 신호 탐지 → 제한 적용</h3>
        <RiskSignalsFlagsViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn detect_risk_signals(workspace: &Path) -> Result<RiskSignals> {
    let mut signals = RiskSignals::default();

    // settings.json의 훅 분석
    if let Some(settings) = load_settings(workspace).await? {
        for hook in &settings.hooks {
            let cmd = hook.command.clone();
            if cmd.contains("curl") && cmd.contains(".env") {
                signals.has_env_exfil = true;
            }
            if cmd.contains("rm -rf") || cmd.contains("> /dev/") {
                signals.has_suspicious_hooks = true;
            }
        }
    }

    // ... 기타 신호 탐지

    Ok(signals)
}`}</pre>
        <p>
          <strong>5가지 위험 신호</strong>: 의심 훅, 원격 MCP, env 유출, 권한 이상, 최근 변경<br />
          <code>curl + .env</code> 조합은 크리덴셜 유출 시도 — 대표적 공격 패턴<br />
          <code>rm -rf</code>, <code>dd</code> 같은 파괴적 명령이 훅에 있으면 즉시 경고
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰 이력 — 학습형 판정</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ~/.claw/trust_history.json
{
  "/home/user/repo-abc": {
    "first_seen": "2026-03-01T10:00:00Z",
    "total_runs": 47,
    "last_run": "2026-04-04T18:30:00Z",
    "user_decisions": ["trust", "trust", "restrict"],
    "incidents": [],
    "checksum": "sha256:..."  // 워크스페이스 파일 체크섬
  }
}`}</pre>
        <p>
          <strong>과거 결정을 재사용</strong>: 같은 워크스페이스를 반복 실행 시 재Prompt 불필요<br />
          <code>checksum</code>: 워크스페이스 파일 해시 — 변경 탐지 시 재Prompt<br />
          <code>incidents</code> 비어있지 않으면 신뢰도 하락 — 과거 문제가 있었던 프로젝트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">사용자 Prompt UI</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`⚠️  새 워크스페이스: /home/user/unknown-repo

이 프로젝트는 처음 실행됩니다.
다음 잠재적 위험이 감지되었습니다:
  • settings.json에 원격 MCP 서버 정의됨
  • CLAUDE.md가 최근 24시간 내 수정됨

신뢰 수준을 선택하세요:
  [t] 완전 신뢰 (Trust)
  [r] 제한 신뢰 (Restrict: 훅·MCP 금지)
  [n] 거부 (Reject)
  [?] 상세 보기`}</pre>
        <p>
          <strong>정보 제공 우선</strong>: 위험 신호를 명시하여 사용자가 판단 근거 확보<br />
          <code>[?]</code> 옵션으로 상세 분석 볼 수 있음 — 훅 내용, MCP 서버 URL 등<br />
          기본값은 <code>[r]</code> (제한 신뢰) — 안전 편향
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 1회 Prompt로 지속 신뢰 구축</p>
          <p>
            사용자는 <strong>매번 묻는 것을 싫어함</strong> — Prompt 피로도는 보안 무효화의 주범<br />
            claw-code는 3가지 메커니즘으로 Prompt 빈도 최소화:
          </p>
          <p className="mt-2">
            1. <strong>trust_history</strong>: 과거 결정 기억<br />
            2. <strong>명시 신뢰 리스트</strong>: <code>/home/user/my-projects/*</code> 같은 glob<br />
            3. <strong>체크섬 기반 재검증</strong>: 파일 변경 없으면 재Prompt 생략
          </p>
          <p className="mt-2">
            결과: 개인 프로젝트 개발자는 초기 1회만 Prompt, 이후 자동 신뢰<br />
            외부 프로젝트 실행 시만 경고 — 진짜 위험한 케이스에 집중<br />
            <strong>"안전과 편의의 균형"</strong> — 이것이 TrustResolver의 설계 목표
          </p>
        </div>

      </div>
    </section>
  );
}
