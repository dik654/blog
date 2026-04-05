import PolicyViz from './viz/PolicyViz';

export default function Policy() {
  return (
    <section id="policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PermissionPolicy — 규칙 기반 판정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PolicyViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 규칙 기반 정책이 필요한가</h3>
        <p>
          3단계 모드만으로는 프로젝트별 요구사항 대응 불가<br />
          - "읽기는 허용하되 <code>.env</code> 파일은 제외"<br />
          - "bash는 허용하되 <code>rm</code>, <code>sudo</code>는 차단"<br />
          - "특정 디렉토리만 쓰기 허용"<br />
          이런 세밀 제어를 위해 <strong>PermissionPolicy</strong>가 규칙 리스트를 평가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PermissionPolicy 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PermissionPolicy {
    pub rules: Vec<Rule>,
    pub default_action: Action,  // 모든 규칙 불일치 시 기본값
}

pub struct Rule {
    pub matcher: Matcher,        // 이 규칙이 적용되는 조건
    pub action: Action,          // allow | deny | prompt
    pub reason: Option<String>,  // 사용자에게 표시할 이유
}

pub enum Matcher {
    Tool(String),                          // 도구 이름 매칭
    ToolAndPath { tool: String, path_glob: String },  // 도구+경로
    BashCommand(String),                   // bash 명령 패턴
    Custom(Box<dyn Fn(&Ctx) -> bool>),     // 사용자 정의 조건
}

pub enum Action { Allow, Deny, Prompt }`}</pre>
        <p>
          <strong>Matcher 4종</strong>: Tool(이름만), ToolAndPath(이름+경로), BashCommand(bash 전용), Custom(클로저)<br />
          각 Rule은 <code>matcher.is_match(ctx)</code>가 true일 때 <code>action</code> 반환<br />
          <code>default_action</code>: 어떤 규칙도 매칭 안 되면 이 값 — 기본값은 <code>Allow</code>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">규칙 평가 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PermissionPolicy {
    pub fn evaluate(&self, ctx: &Ctx) -> Action {
        for rule in &self.rules {
            if rule.matcher.is_match(ctx) {
                return rule.action;  // 첫 매칭 규칙 반환
            }
        }
        self.default_action
    }
}

pub struct Ctx<'a> {
    pub tool_name: &'a str,
    pub input: &'a Value,
    pub path: Option<&'a Path>,
    pub command: Option<&'a str>,
    pub session: &'a Session,
}`}</pre>
        <p>
          <strong>first-match 전략</strong>: 첫 매칭 규칙이 최종 결정 — 순서 중요<br />
          규칙 순서: 위쪽이 우선, 아래쪽은 폴백 — "구체적 → 일반적" 순으로 배열<br />
          <code>Ctx</code> 구조체: 규칙 평가에 필요한 모든 정보 전달
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 규칙 예시 — settings.json</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`{
  "permissions": {
    "default": "allow",
    "rules": [
      {"matcher": {"tool_path": {"tool": "write_file", "glob": ".env*"}},
       "action": "deny", "reason": ".env 파일은 수정 금지"},
      {"matcher": {"tool_path": {"tool": "read_file", "glob": "**/*.pem"}},
       "action": "deny", "reason": "개인 키 파일 접근 금지"},
      {"matcher": {"bash": "rm -rf *"},
       "action": "deny", "reason": "대량 삭제 금지"},
      {"matcher": {"bash": "sudo *"},
       "action": "prompt", "reason": "sudo 확인 필요"},
      {"matcher": {"tool": "bash"},
       "action": "prompt", "reason": "모든 bash는 확인"}
    ]
  }
}`}</pre>
        <p>
          <strong>규칙 배열 순서</strong>: 구체적 거부(.env, .pem) → 특정 패턴 거부(rm -rf) → 특정 패턴 확인(sudo) → 일반 확인(bash)<br />
          이 순서로 "특수 케이스는 먼저 차단, 일반 케이스는 나중에 확인"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Matcher 구현 — glob 매칭</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Matcher {
    pub fn is_match(&self, ctx: &Ctx) -> bool {
        match self {
            Matcher::Tool(name) => ctx.tool_name == name,

            Matcher::ToolAndPath { tool, path_glob } => {
                if ctx.tool_name != tool { return false; }
                let Some(path) = ctx.path else { return false; };
                let pattern = glob::Pattern::new(path_glob).unwrap_or_default();
                pattern.matches_path(path)
            }

            Matcher::BashCommand(pattern) => {
                if ctx.tool_name != "bash" { return false; }
                let Some(cmd) = ctx.command else { return false; };
                glob::Pattern::new(pattern)
                    .map(|p| p.matches(cmd))
                    .unwrap_or(false)
            }

            Matcher::Custom(f) => f(ctx),
        }
    }
}`}</pre>
        <p>
          <strong>glob 라이브러리</strong>: <code>**/*.pem</code>, <code>.env*</code> 같은 쉘 스타일 패턴 지원<br />
          <code>matches_path()</code>: 경로 전체를 glob 패턴과 비교<br />
          BashCommand는 명령 문자열에 glob 적용 — <code>rm -rf *</code>는 <code>rm -rf</code>로 시작하는 모든 명령 매칭
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Policy 병합 — 전역 + 프로젝트 + 사용자</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 3단계 캐스케이드
global_policy:    /etc/claw/permissions.json        // 시스템 전역
project_policy:   ./.claw/permissions.json          // 프로젝트 전용
user_policy:      ~/.claw/permissions.json          // 사용자 오버라이드

// 병합 순서 (우선순위 역순으로 추가)
let mut combined = Policy::default();
combined.extend_from(&global_policy);
combined.extend_from(&project_policy);
combined.extend_from(&user_policy);`}</pre>
        <p>
          <strong>3단계 캐스케이드</strong>: global → project → user (우선순위 오름차순)<br />
          <code>extend_from()</code>: 새 규칙을 앞쪽에 추가 — 더 후행 계층이 앞서 평가<br />
          결과적으로 <strong>user &gt; project &gt; global</strong> 순으로 우선 적용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Policy 파싱 — TOML/JSON 지원</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// serde 기반 직렬화
#[derive(Deserialize, Serialize)]
pub struct PolicyFile {
    pub default: Action,
    pub rules: Vec<RuleFile>,
}

#[derive(Deserialize, Serialize)]
pub struct RuleFile {
    pub matcher: MatcherFile,
    pub action: Action,
    pub reason: Option<String>,
}

// JSON/TOML 자동 감지
pub fn load_policy(path: &Path) -> Result<PermissionPolicy> {
    let text = std::fs::read_to_string(path)?;
    let file: PolicyFile = if path.extension() == Some(OsStr::new("toml")) {
        toml::from_str(&text)?
    } else {
        serde_json::from_str(&text)?
    };
    Ok(file.into_policy())
}`}</pre>
        <p>
          <strong>파일 확장자로 포맷 감지</strong>: .toml은 toml crate, 나머지는 serde_json<br />
          TOML은 주석 지원 — 팀 협업 시 규칙 이유 문서화 용이<br />
          <code>Custom</code> Matcher는 JSON/TOML로 표현 불가 — 코드에서만 추가 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 선언적 정책 vs 명령형 훅</p>
          <p>
            <strong>정책(선언적)</strong>: JSON/TOML로 규칙만 기술<br />
            - 장점: 코드 불필요, 비개발자도 수정 가능, 감사(audit) 쉬움<br />
            - 단점: 표현력 한계 — 복잡한 조건(시간대별, 세션 이력 기반)은 불가
          </p>
          <p className="mt-2">
            <strong>훅(명령형)</strong>: 임의 스크립트 실행<br />
            - 장점: 표현력 무제한 — DB 조회, 네트워크 호출, 복합 판정<br />
            - 단점: 실행 시간 비용, 스크립트 유지보수 필요
          </p>
          <p className="mt-2">
            claw-code는 <strong>Policy는 99% 케이스 커버, Hook은 1% 고급 케이스</strong> 담당<br />
            대부분의 사용자는 JSON 몇 줄로 보안 요구사항 충족 — 훅까지 갈 필요 없음
          </p>
        </div>

      </div>
    </section>
  );
}
