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
        <div className="not-prose my-4 space-y-2">
          {[
            { step: '1', label: '기존 확인', detail: '.claw/ 존재 시 덮어쓰기 확인 (y/N)', icon: '?' },
            { step: '2', label: '디렉토리 생성', detail: 'tokio::fs::create_dir_all로 .claw/ 생성', icon: '📁' },
            { step: '3', label: '프로젝트 감지', detail: 'detect_project_type() — 언어·빌드·프레임워크 탐색', icon: '🔍' },
            { step: '4', label: 'config.json 생성', detail: 'generate_default_config() — 감지 결과 기반 설정', icon: '⚙' },
            { step: '5', label: 'CLAUDE.md 생성', detail: 'generate_claude_md() — LLM 컨텍스트 템플릿', icon: '📝' },
            { step: '6', label: '.gitignore 업데이트', detail: 'update_gitignore() — .claw/sessions/ 등 제외', icon: '🔒' },
          ].map(({ step, label, detail, icon }) => (
            <div key={step} className="flex items-start gap-3 bg-muted/30 border border-border rounded-lg p-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{step}</span>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{icon} {label}</p>
                <p className="text-sm text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로젝트 타입 감지</h3>
        <p>
          <code>detect_project_type()</code>는 디렉토리 내 시그널 파일로 언어·빌드·프레임워크를 감지<br />
          여러 언어 동시 감지 가능 — monorepo 지원
        </p>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">ProjectDetection</span>
            <span className="text-xs text-muted-foreground ml-2">감지 결과 구조체</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { file: 'Cargo.toml', lang: 'Rust', build: 'Cargo' },
              { file: 'package.json', lang: 'TypeScript', build: 'Npm' },
              { file: 'pyproject.toml / setup.py', lang: 'Python', build: 'Python' },
              { file: 'go.mod', lang: 'Go', build: 'Go' },
            ].map(({ file, lang, build }) => (
              <div key={lang} className="flex items-center gap-2 bg-background border border-border rounded p-2">
                <code className="text-xs text-primary font-semibold">{file}</code>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm">{lang} + {build}</span>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background border border-border rounded p-2">
              <span className="font-semibold">has_git</span>
              <span className="text-muted-foreground ml-2">— <code className="text-xs">.git/</code> 디렉토리 존재 여부</span>
            </div>
            <div className="bg-background border border-border rounded p-2">
              <span className="font-semibold">has_tests</span>
              <span className="text-muted-foreground ml-2">— <code className="text-xs">*_test.*</code> / <code className="text-xs">test_*.*</code> 패턴</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">generate_claude_md() — CLAUDE.md 템플릿</h3>
        <p>
          <strong>자동 생성 + 수동 편집</strong>: 감지된 정보 + 빈 섹션<br />
          LLM이 매 세션 시작 시 이 파일을 시스템 프롬프트에 포함
        </p>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">CLAUDE.md 템플릿 구조</span>
          </div>
          <div className="divide-y divide-border">
            {[
              { section: '## Stack', content: '감지된 언어 목록 자동 채움', auto: true },
              { section: '## Commands', content: '빌드 시스템별 명령어 — Cargo: cargo build/test/clippy, Npm: npm run build/test', auto: true },
              { section: '## Coding Style', content: '빈 섹션 — 팀 코딩 컨벤션 직접 작성', auto: false },
              { section: '## Notes', content: '빈 섹션 — Claude가 주의할 프로젝트 특이사항', auto: false },
            ].map(({ section, content, auto }) => (
              <div key={section} className="flex items-start gap-3 p-3">
                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${auto ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                  {auto ? '자동' : '수동'}
                </span>
                <div>
                  <code className="text-sm font-semibold">{section}</code>
                  <p className="text-sm text-muted-foreground mt-0.5">{content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">generate_default_config()</h3>
        <p>
          기본 설정: <code>permission_mode: "WorkspaceWrite"</code>, <code>max_tool_chain_length: 25</code>
        </p>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">빌드 시스템별 블랙리스트</span>
            <span className="text-xs text-muted-foreground ml-2">path_blacklist 자동 구성</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
            {[
              { system: 'Cargo', paths: ['target/**'], desc: '빌드 결과물' },
              { system: 'Npm', paths: ['node_modules/**', 'dist/**'], desc: '의존성 + 번들' },
              { system: 'Python', paths: ['__pycache__/**', '.venv/**'], desc: '바이트코드 + 가상환경' },
            ].map(({ system, paths, desc }) => (
              <div key={system} className="bg-background p-3">
                <p className="font-semibold text-sm">{system}</p>
                <div className="mt-1 space-y-0.5">
                  {paths.map(p => (
                    <code key={p} className="block text-xs text-primary">{p}</code>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p>
          공통 블랙리스트: <code>.git/**</code> — 모든 프로젝트에 포함<br />
          <code>search_include</code>: 언어별 파일 패턴 (<code>lang.file_patterns()</code>)으로 검색 범위 제한
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">update_gitignore()</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">.gitignore 자동 업데이트</span>
            <span className="text-xs text-muted-foreground ml-2">이미 존재하면 건너뜀</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">제외 (gitignore 추가)</p>
              <div className="space-y-1">
                {['.claw/sessions/', '.claw/debug/', '.claw/tokens.json'].map(p => (
                  <div key={p} className="flex items-center gap-2 text-sm">
                    <span className="text-red-500">✕</span>
                    <code className="text-xs">{p}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">세션 로그·디버그 덤프·토큰 — 개인 데이터</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">포함 (git 관리)</p>
              <div className="space-y-1">
                {['.claw/config.json', '.claw/CLAUDE.md'].map(p => (
                  <div key={p} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <code className="text-xs">{p}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">설정·가이드 — 팀 공유</p>
            </div>
          </div>
        </div>

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
