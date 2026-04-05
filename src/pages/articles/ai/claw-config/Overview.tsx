import CascadeViz from './viz/CascadeViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ConfigLoader &amp; 3단계 캐스케이드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CascadeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 설정 캐스케이드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 우선순위 오름차순
1. 시스템 기본값:    /etc/claw/config.json       (관리자)
2. 사용자 전역:       ~/.claw/config.json         (홈 디렉토리)
3. 프로젝트 로컬:     .claw/config.json           (워크스페이스)

// 병합 결과: 프로젝트 > 사용자 > 시스템
// 같은 키가 여러 파일에 있으면 하위 레벨이 이김`}</pre>
        <p>
          <strong>3단계 오버라이드</strong>: 시스템 &lt; 사용자 &lt; 프로젝트<br />
          병합은 deep-merge — 중첩 객체도 재귀적으로 병합<br />
          배열은 덮어쓰기 — <code>plugins: [...]</code> 같은 필드는 치환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">AppConfig 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct AppConfig {
    // 프로바이더
    pub provider: String,             // "anthropic" | "openai" | "xai"
    pub api_key: Option<String>,
    pub model: String,                // "claude-opus-4-6" 등
    pub base_url: Option<Url>,

    // 권한
    pub permission_mode: PermissionMode,
    pub trusted_plugins: HashSet<String>,
    pub trusted_mcp_servers: HashSet<String>,

    // 동작
    pub compact_config: CompactionConfig,
    pub max_tool_chain_length: usize,  // 25
    pub temperature: f32,              // 1.0

    // 훅 · 플러그인 · MCP
    pub hooks: HookConfig,
    pub plugin_paths: Vec<PathBuf>,
    pub mcp_servers: HashMap<String, McpServerConfig>,

    // 로깅 · 텔레메트리
    pub log_level: LogLevel,
    pub telemetry_sink: Option<TelemetrySink>,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ConfigLoader 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct ConfigLoader {
    paths: Vec<PathBuf>,
}

impl ConfigLoader {
    pub fn new() -> Self {
        Self {
            paths: vec![
                PathBuf::from("/etc/claw/config.json"),
                dirs::home_dir().unwrap().join(".claw/config.json"),
                std::env::current_dir().unwrap().join(".claw/config.json"),
            ],
        }
    }

    pub async fn load(&self) -> Result<AppConfig> {
        let mut merged = Value::Null;

        for path in &self.paths {
            if !path.exists() { continue; }
            let text = tokio::fs::read_to_string(path).await?;
            let layer: Value = serde_json::from_str(&text)?;
            merged = deep_merge(merged, layer);
        }

        // 환경 변수 오버라이드
        apply_env_overrides(&mut merged);

        // 최종 AppConfig로 역직렬화
        let config: AppConfig = serde_json::from_value(merged)?;
        Ok(config)
    }
}`}</pre>
        <p>
          <strong>4단계 로드</strong>: 시스템 → 사용자 → 프로젝트 → 환경 변수<br />
          파일 없으면 스킵 — 프로젝트 로컬 설정 없어도 문제없음<br />
          환경 변수가 최우선 — CI/도커 환경에서 동적 오버라이드
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">deep_merge — 재귀 병합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn deep_merge(base: Value, overlay: Value) -> Value {
    match (base, overlay) {
        (Value::Object(mut base_map), Value::Object(overlay_map)) => {
            // 객체 재귀 병합
            for (key, value) in overlay_map {
                let entry = base_map.entry(key).or_insert(Value::Null);
                *entry = deep_merge(entry.clone(), value);
            }
            Value::Object(base_map)
        }
        // 비객체는 오버라이드 (배열·원시값은 치환)
        (_, overlay) => overlay,
    }
}`}</pre>
        <p>
          <strong>객체만 재귀 병합, 나머지는 치환</strong><br />
          이유: 배열을 병합하면 순서·중복 처리가 애매함 — 치환이 예측 가능<br />
          사용자가 배열 전체를 커스터마이징 가능 — "확장이 아닌 대체"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">환경 변수 오버라이드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn apply_env_overrides(config: &mut Value) {
    // CLAW_PROVIDER → config.provider
    if let Ok(v) = std::env::var("CLAW_PROVIDER") {
        config["provider"] = v.into();
    }
    if let Ok(v) = std::env::var("CLAW_API_KEY") {
        config["api_key"] = v.into();
    }
    if let Ok(v) = std::env::var("CLAW_MODEL") {
        config["model"] = v.into();
    }
    if let Ok(v) = std::env::var("CLAW_LOG_LEVEL") {
        config["log_level"] = v.into();
    }

    // 특수 케이스: ANTHROPIC_API_KEY 호환
    if let Ok(v) = std::env::var("ANTHROPIC_API_KEY") {
        if config["provider"].as_str() == Some("anthropic") {
            config["api_key"] = v.into();
        }
    }
}`}</pre>
        <p>
          <strong>CLAW_* 환경 변수</strong>: claw-code 전용 오버라이드<br />
          기존 도구 환경 변수 호환: <code>ANTHROPIC_API_KEY</code>, <code>OPENAI_API_KEY</code><br />
          이미 환경 설정된 사용자가 별도 설정 없이 사용 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">설정 검증</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl AppConfig {
    pub fn validate(&self) -> Result<()> {
        // 1) 프로바이더 유효성
        if !["anthropic", "openai", "xai", "azure"].contains(&self.provider.as_str()) {
            return Err(anyhow!("unknown provider: {}", self.provider));
        }

        // 2) API 키 존재
        if self.api_key.is_none() && self.provider != "anthropic" {
            return Err(anyhow!("API key required for {}", self.provider));
        }

        // 3) 모델명 검증
        if self.model.is_empty() {
            return Err(anyhow!("model not specified"));
        }

        // 4) 수치 범위
        if self.temperature < 0.0 || self.temperature > 2.0 {
            return Err(anyhow!("temperature out of range"));
        }
        if self.max_tool_chain_length > 100 {
            return Err(anyhow!("max_tool_chain_length too large"));
        }

        // 5) 훅 파일 존재
        for hook in self.hooks.all_hooks() {
            let first_word = hook.command.split_whitespace().next().unwrap_or("");
            if first_word.starts_with('/') && !Path::new(first_word).exists() {
                log::warn!("hook not found: {}", hook.command);
            }
        }

        Ok(())
    }
}`}</pre>
        <p>
          <strong>5단계 검증</strong>: 프로바이더 → API 키 → 모델 → 수치 범위 → 훅 파일<br />
          부트스트랩 시 1회 수행 — 실패 시 시작 거부<br />
          훅 파일 누락은 warn만 — 선택적 기능이므로 비활성화 대신 경고
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 3단계가 "올바른" 숫자인가</p>
          <p>
            설정 캐스케이드 계층 수는 시스템마다 다름:<br />
            - Git: 4단계 (system/global/local/worktree)<br />
            - npm: 4단계 (builtin/global/user/project)<br />
            - Vim: N단계 (.vimrc 재귀)
          </p>
          <p className="mt-2">
            claw-code 3단계 선택 이유:<br />
            ✓ <strong>단순성</strong>: 사용자가 어디에 무엇을 쓸지 명확<br />
            ✓ <strong>개인-팀-조직</strong> 3축 매핑: 프로젝트(팀), 사용자(개인), 시스템(조직)<br />
            ✓ <strong>환경 변수 추가</strong>: 실질적 4단계 — 일회성 오버라이드
          </p>
          <p className="mt-2">
            <strong>작위적 예외</strong>: worktree 같은 서브-프로젝트 계층 없음<br />
            필요하면 프로젝트 설정에 <code>workspace_overrides</code> 배열로 표현 가능<br />
            기본 설계는 <strong>"간단한 것부터"</strong> — 복잡한 요구는 확장으로
          </p>
        </div>

      </div>
    </section>
  );
}
