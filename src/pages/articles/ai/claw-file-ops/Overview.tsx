import FileOpsToolsViz from './viz/FileOpsToolsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파일 연산 개요 &amp; 보안 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <FileOpsToolsViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">파일 I/O 5개 도구</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">도구</th>
                <th className="border border-border px-3 py-2 text-left">권한</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>read_file</code></td>
                <td className="border border-border px-3 py-2">ReadOnly</td>
                <td className="border border-border px-3 py-2">파일 읽기 (offset/limit 지원)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>write_file</code></td>
                <td className="border border-border px-3 py-2">WorkspaceWrite</td>
                <td className="border border-border px-3 py-2">전체 파일 쓰기 (덮어쓰기)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>edit_file</code></td>
                <td className="border border-border px-3 py-2">WorkspaceWrite</td>
                <td className="border border-border px-3 py-2">문자열 치환 기반 편집</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>glob_search</code></td>
                <td className="border border-border px-3 py-2">ReadOnly</td>
                <td className="border border-border px-3 py-2">파일명 패턴 매칭</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>grep_search</code></td>
                <td className="border border-border px-3 py-2">ReadOnly</td>
                <td className="border border-border px-3 py-2">파일 내용 정규식 검색</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 모델 — 4단계 방어</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`모든 파일 연산은 다음 4단계를 거친다:

1. 권한 모드 체크       ReadOnly 모드에서 write/edit 즉시 거부
2. 워크스페이스 경계    path.starts_with(workspace_root) 필수
3. 블랙리스트           .env, .git/, *.pem 등 보호
4. 심링크 이스케이프    canonicalize() 후 재검증`}</pre>
        <p>
          각 단계는 독립적 — 한 층을 우회해도 다른 층이 방어<br />
          1, 2단계는 정적(문자열 비교), 3, 4단계는 동적(파일 시스템 호출)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">WorkspaceRoot 개념</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 세션 생성 시 결정, 변경 불가
pub struct Workspace {
    root: PathBuf,           // 절대 경로, canonicalize됨
    name: String,            // 표시용 이름
    git_root: Option<PathBuf>, // git 저장소 루트 (있으면)
}

impl Workspace {
    pub fn from_cwd() -> Result<Self> {
        let cwd = std::env::current_dir()?;
        let canonical = cwd.canonicalize()?;

        // git 루트 탐지 (선택)
        let git_root = find_git_root(&canonical);

        Ok(Self {
            root: canonical,
            name: extract_name(&canonical),
            git_root,
        })
    }
}`}</pre>
        <p>
          <strong>workspace_root은 세션 불변</strong>: 한 번 설정되면 세션 내내 고정<br />
          시작 시 <code>canonicalize()</code>로 심링크 해제 — 실제 경로로 저장<br />
          git 루트는 선택 — 있으면 "변경 파일 감지" 같은 고급 기능 활성화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">기본 블랙리스트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn default_blacklist() -> PathBlacklist {
    PathBlacklist::new(vec![
        // 환경 설정
        ".env", ".env.*",
        // 개인 키
        "*.pem", "*.key", "*.p12", "*.pfx",
        // 인증서
        "*.crt", "*.cer",
        // VCS 내부
        ".git/**",
        // 큰 바이너리/생성물
        "node_modules/**", "target/**", "dist/**", "build/**",
        // SSH 키
        "~/.ssh/**", "id_rsa*", "id_ed25519*",
        // AWS 등 클라우드 크리덴셜
        ".aws/credentials", ".aws/config",
    ])
}`}</pre>
        <p>
          <strong>보호 카테고리 5가지</strong>: 환경변수, 개인키, 인증서, VCS, 생성물<br />
          사용자는 <code>settings.json</code>에서 블랙리스트 확장/축소 가능<br />
          기본값은 <strong>과보호 편향</strong> — 의심스러우면 차단
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PathBlacklist 매칭</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PathBlacklist {
    patterns: Vec<glob::Pattern>,
}

impl PathBlacklist {
    pub fn matches(&self, path: &Path) -> bool {
        // 1) 파일명만 매칭
        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
            for p in &self.patterns {
                if p.matches(name) { return true; }
            }
        }
        // 2) 전체 경로 매칭
        let path_str = path.to_string_lossy();
        for p in &self.patterns {
            if p.matches(&path_str) { return true; }
        }
        false
    }
}`}</pre>
        <p>
          <strong>2차원 매칭</strong>: 파일명 단독 + 전체 경로<br />
          <code>.env</code>는 어느 경로에 있든 차단 (파일명 매칭)<br />
          <code>.git/config</code>는 경로 전체 매칭 필요 — <code>.git/**</code> 패턴
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">심링크 이스케이프 검증</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn validate_path(path: &Path, workspace: &Path) -> Result<()> {
    // 1) 절대 경로화
    let absolute = if path.is_absolute() {
        path.to_path_buf()
    } else {
        workspace.join(path)
    };

    // 2) 문자열 비교 (빠름)
    if !absolute.starts_with(workspace) {
        return Err(anyhow!("outside workspace"));
    }

    // 3) 심링크 해제 후 재검증
    let real = absolute.canonicalize()?;
    if !real.starts_with(workspace) {
        return Err(anyhow!("symlink escape: {:?} → {:?}", path, real));
    }

    Ok(())
}`}</pre>
        <p>
          <strong>2번 검증</strong>: 문자열 비교 → canonicalize 후 재비교<br />
          공격 시나리오: <code>workspace/link → /etc/passwd</code><br />
          1차 검증(문자열)은 통과 — <code>workspace/link</code>는 워크스페이스 안<br />
          2차 검증(canonicalize)에서 차단 — 실제 경로는 <code>/etc/passwd</code>
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 bash가 아닌 전용 도구인가</p>
          <p>
            이론적으로 <code>bash("cat file.txt")</code>로도 파일 읽기 가능<br />
            그럼에도 claw-code가 전용 도구(<code>read_file</code>)를 제공하는 이유:
          </p>
          <p className="mt-2">
            1. <strong>권한 분리</strong>: read_file은 ReadOnly, bash는 DangerFullAccess — 다른 신뢰 수준<br />
            2. <strong>구조화된 출력</strong>: offset/limit 파라미터, 줄 번호 포함 — LLM이 정확히 참조 가능<br />
            3. <strong>명시적 의도</strong>: "파일 읽기"라는 의도가 도구 이름에 표현됨 — 감사 로그 명료<br />
            4. <strong>샌드박스 불필요</strong>: 전용 도구는 Rust 코드로 직접 실행 — bwrap 오버헤드 없음<br />
            5. <strong>크로스 플랫폼</strong>: Windows에서도 동일 동작 (bash 없는 환경)
          </p>
          <p className="mt-2">
            <strong>bash는 탈출구(escape hatch)로만 유지</strong> — 일상 작업은 전용 도구로 처리
          </p>
        </div>

      </div>
    </section>
  );
}
