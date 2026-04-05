import InitViz from './viz/InitViz';

export default function Init() {
  return (
    <section id="init" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로젝트 초기화 &amp; 감지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <InitViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">claw init 명령</h3>
        <p>
          <code>claw init</code>: 현재 디렉토리를 claw-code 프로젝트로 설정<br />
          생성 파일:<br />
          - <code>.claw/config.json</code>: 프로젝트 로컬 설정<br />
          - <code>.claw/CLAUDE.md</code>: LLM에게 전달할 프로젝트 가이드<br />
          - <code>.gitignore</code> 업데이트: <code>.claw/sessions/</code> 제외
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">init_project() 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn init_project(args: CliArgs) -> Result<()> {
    let cwd = std::env::current_dir()?;
    let claw_dir = cwd.join(".claw");

    // 이미 존재하는지 확인
    if claw_dir.exists() {
        print!("❗ .claw/ already exists. Overwrite? [y/N]: ");
        std::io::stdout().flush()?;
        let mut input = String::new();
        std::io::stdin().read_line(&mut input)?;
        if !input.trim().eq_ignore_ascii_case("y") {
            println!("Aborted.");
            return Ok(());
        }
    }

    // 디렉토리 생성
    tokio::fs::create_dir_all(&claw_dir).await?;

    // 프로젝트 특성 감지
    let detection = detect_project_type(&cwd).await?;

    // config.json 생성
    let config = generate_default_config(&detection);
    tokio::fs::write(
        claw_dir.join("config.json"),
        serde_json::to_string_pretty(&config)?,
    ).await?;

    // CLAUDE.md 생성
    let claude_md = generate_claude_md(&detection);
    tokio::fs::write(claw_dir.join("CLAUDE.md"), claude_md).await?;

    // .gitignore 업데이트
    update_gitignore(&cwd).await?;

    println!("✓ Project initialized.");
    println!("Edit .claw/CLAUDE.md to add project context.");
    Ok(())
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로젝트 타입 감지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct ProjectDetection {
    pub languages: Vec<Language>,
    pub frameworks: Vec<Framework>,
    pub build_systems: Vec<BuildSystem>,
    pub has_git: bool,
    pub has_tests: bool,
}

async fn detect_project_type(cwd: &Path) -> Result<ProjectDetection> {
    let mut det = ProjectDetection::default();

    // Git 확인
    det.has_git = cwd.join(".git").is_dir();

    // 빌드 시스템 감지
    if cwd.join("Cargo.toml").exists() {
        det.build_systems.push(BuildSystem::Cargo);
        det.languages.push(Language::Rust);
    }
    if cwd.join("package.json").exists() {
        det.build_systems.push(BuildSystem::Npm);
        det.languages.push(Language::TypeScript);
    }
    if cwd.join("pyproject.toml").exists() || cwd.join("setup.py").exists() {
        det.build_systems.push(BuildSystem::Python);
        det.languages.push(Language::Python);
    }
    if cwd.join("go.mod").exists() {
        det.build_systems.push(BuildSystem::Go);
        det.languages.push(Language::Go);
    }

    // 프레임워크 감지 (package.json 파싱 등)
    detect_frameworks(cwd, &mut det).await?;

    // 테스트 파일 확인
    det.has_tests = glob_exists(cwd, "**/*_test.*").await?
        || glob_exists(cwd, "**/test_*.*").await?;

    Ok(det)
}`}</pre>
        <p>
          <strong>감지 시그널</strong>: 빌드 파일, 설정 파일, 테스트 패턴<br />
          <code>Cargo.toml</code> → Rust 프로젝트, <code>package.json</code> → JS/TS<br />
          여러 언어 동시 감지 가능 — monorepo 지원
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">generate_claude_md() — CLAUDE.md 템플릿</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn generate_claude_md(det: &ProjectDetection) -> String {
    let mut md = String::new();
    md.push_str("# Project Guide\\n\\n");
    md.push_str("이 파일은 Claude에게 프로젝트 컨텍스트를 제공합니다.\\n\\n");

    md.push_str("## Stack\\n");
    for lang in &det.languages {
        md.push_str(&format!("- {}\\n", lang.display()));
    }
    md.push_str("\\n");

    md.push_str("## Commands\\n");
    for bs in &det.build_systems {
        match bs {
            BuildSystem::Cargo => {
                md.push_str("- Build: \`cargo build\`\\n");
                md.push_str("- Test: \`cargo test\`\\n");
                md.push_str("- Lint: \`cargo clippy\`\\n");
            }
            BuildSystem::Npm => {
                md.push_str("- Build: \`npm run build\`\\n");
                md.push_str("- Test: \`npm test\`\\n");
            }
            // ...
        }
    }
    md.push_str("\\n");

    md.push_str("## Coding Style\\n");
    md.push_str("<!-- 팀의 코딩 컨벤션을 여기에 추가 -->\\n\\n");

    md.push_str("## Notes\\n");
    md.push_str("<!-- Claude가 주의할 프로젝트 특이사항 -->\\n");

    md
}`}</pre>
        <p>
          <strong>자동 생성 + 수동 편집</strong>: 감지된 정보 + 빈 섹션<br />
          빈 섹션은 사용자가 채움 — 코딩 스타일, 주의사항 등<br />
          LLM이 매 세션 시작 시 이 파일을 시스템 프롬프트에 포함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">generate_default_config()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn generate_default_config(det: &ProjectDetection) -> Value {
    let mut config = json!({
        "permission_mode": "WorkspaceWrite",
        "max_tool_chain_length": 25,
    });

    // 언어별 파일 패턴 추가
    let mut file_patterns = Vec::new();
    for lang in &det.languages {
        file_patterns.extend(lang.file_patterns());
    }
    config["search_include"] = file_patterns.into();

    // 빌드 시스템별 블랙리스트
    let mut blacklist = vec![".git/**".to_string()];
    if det.build_systems.contains(&BuildSystem::Cargo) {
        blacklist.push("target/**".into());
    }
    if det.build_systems.contains(&BuildSystem::Npm) {
        blacklist.push("node_modules/**".into());
        blacklist.push("dist/**".into());
    }
    if det.build_systems.contains(&BuildSystem::Python) {
        blacklist.push("__pycache__/**".into());
        blacklist.push(".venv/**".into());
    }
    config["path_blacklist"] = blacklist.into();

    config
}`}</pre>
        <p>
          <strong>빌드 시스템별 블랙리스트</strong>: 언어별 무시 디렉토리<br />
          Cargo 프로젝트: <code>target/</code> 제외 (빌드 결과물)<br />
          npm 프로젝트: <code>node_modules/</code>, <code>dist/</code> 제외<br />
          Python 프로젝트: <code>__pycache__/</code>, <code>.venv/</code> 제외
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">update_gitignore()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn update_gitignore(cwd: &Path) -> Result<()> {
    let gi_path = cwd.join(".gitignore");
    let existing = if gi_path.exists() {
        tokio::fs::read_to_string(&gi_path).await?
    } else {
        String::new()
    };

    let claw_entries = r#"
# claw-code
.claw/sessions/
.claw/debug/
.claw/tokens.json
"#;

    if !existing.contains(".claw/sessions/") {
        let updated = format!("{}\\n{}", existing, claw_entries);
        tokio::fs::write(&gi_path, updated).await?;
        println!("✓ Updated .gitignore");
    }

    Ok(())
}`}</pre>
        <p>
          <strong>선택적 추가</strong>: 이미 <code>.claw/sessions/</code> 있으면 건너뜀<br />
          제외 대상: 세션 로그, 디버그 덤프, 토큰 파일<br />
          <code>.claw/config.json</code>과 <code>CLAUDE.md</code>는 <strong>git 관리</strong> — 팀 공유
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: "감지 + 템플릿" 패턴의 가치</p>
          <p>
            <code>claw init</code>은 프로젝트 타입을 자동 감지하여 <strong>맞춤 템플릿 생성</strong><br />
            이 패턴의 효과:
          </p>
          <p className="mt-2">
            ✓ <strong>진입장벽 낮춤</strong>: "그냥 <code>claw init</code>만 하면 됨"<br />
            ✓ <strong>실수 방지</strong>: 자동 블랙리스트로 <code>node_modules</code> 읽기 방지<br />
            ✓ <strong>교육적</strong>: 생성된 CLAUDE.md가 설정 가능성 안내<br />
            ✓ <strong>팀 통일</strong>: 커밋된 <code>.claw/</code>로 팀 전체 동일 환경
          </p>
          <p className="mt-2">
            대안은 <strong>"모든 걸 사용자가 직접 작성"</strong> — 진입장벽 높음<br />
            반대 극은 <strong>"강제 규칙"</strong> — 유연성 부족<br />
            claw-code의 "감지 + 템플릿"은 <strong>중간 지점</strong> — 기본값 제공 + 자유 편집
          </p>
        </div>

      </div>
    </section>
  );
}
