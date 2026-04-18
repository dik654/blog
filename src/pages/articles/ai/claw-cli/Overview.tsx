import ReplLoopViz from './viz/ReplLoopViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CLI 진입점 &amp; REPL 루프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ReplLoopViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">rusty-claude-cli 크레이트</h3>
        <p>
          <code>rusty-claude-cli</code>는 claw-code의 <strong>CLI 진입점</strong><br />
          ~10K LOC — 가장 큰 주변 크레이트<br />
          역할: 인자 파싱, REPL 루프, 터미널 렌더링, 슬래시 명령, 프로젝트 초기화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">main() 진입점</h3>
        <p>
          <code>main()</code>은 3단계로 구성: 인자 파싱 → 로깅 초기화 → 서브명령 분기<br />
          <code>tokio::main</code>: 비동기 런타임 — async 함수를 main으로 사용 가능
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose my-4">
          {[
            { cmd: 'Run', desc: 'REPL 시작 (기본값)', detail: 'claw만 입력하면 실행' },
            { cmd: 'Resume', desc: '이전 세션 재개', detail: 'session_id 인자 필수' },
            { cmd: 'ListSessions', desc: '세션 목록 표시', detail: '저장된 전체 세션' },
            { cmd: 'Init', desc: '프로젝트 초기화', detail: '.claw/ 디렉토리 생성' },
            { cmd: 'Config', desc: '설정 관리', detail: '서브커맨드로 분기' },
            { cmd: 'Version', desc: '버전 출력', detail: 'CARGO_PKG_VERSION' },
          ].map(({ cmd, desc, detail }) => (
            <div key={cmd} className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="font-mono text-sm font-semibold text-primary">{cmd}</p>
              <p className="text-sm mt-1">{desc}</p>
              <p className="text-xs text-muted-foreground mt-1">{detail}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">CliArgs 정의 — clap 사용</h3>
        <p>
          <strong>clap derive</strong>: 선언적 CLI 파싱 — <code>--help</code> 자동 생성, 각 필드 주석이 도움말 메시지로
        </p>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">CliArgs</span>
            <span className="text-xs text-muted-foreground ml-2">clap derive 매크로</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {[
              { flag: '--read-only', type: 'bool', desc: '읽기 전용 모드 (파일 수정 금지)' },
              { flag: '--dangerously-skip-permissions', type: 'bool', desc: '권한 확인 건너뛰기' },
              { flag: '--model', type: 'Option<String>', desc: '사용할 모델 지정' },
              { flag: '--provider', type: 'Option<String>', desc: 'API 프로바이더 지정' },
              { flag: '--verbose / -v', type: 'bool', desc: '상세 로깅 활성화' },
            ].map(({ flag, type: t, desc }) => (
              <div key={flag} className="bg-background p-3">
                <code className="text-xs font-semibold text-primary">{flag}</code>
                <span className="text-xs text-muted-foreground ml-2">({t})</span>
                <p className="text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">REPL 루프</h3>
        <p>
          <strong>무한 루프 + break</strong>: 사용자가 <code>/exit</code> 또는 Ctrl+D 시 종료<br />
          에러 발생해도 세션 계속 — <code>eprintln!</code>로 표시 후 다음 입력 대기
        </p>
        <div className="not-prose my-4 space-y-2">
          {[
            { step: '1', label: '부트스트랩', code: 'Bootstrap::new().run().await', desc: '런타임 초기화 + 설정 로드' },
            { step: '2', label: '환영 메시지', code: 'print_welcome(&runtime)', desc: '모델·모드·워크스페이스 표시' },
            { step: '3', label: '프롬프트 표시', code: 'print!("\\n> ")', desc: '입력 대기, flush로 즉시 출력' },
            { step: '4', label: '입력 읽기', code: 'read_user_input().await', desc: '사용자 텍스트 수신' },
            { step: '5', label: '슬래시 분기', code: 'starts_with(\'/\')', desc: '/ 시작이면 명령, 아니면 턴 실행' },
            { step: '6', label: '턴 실행', code: 'runtime.run_turn(input).await', desc: 'LLM 호출 + 도구 실행 + 응답' },
          ].map(({ step, label, code, desc }) => (
            <div key={step} className="flex items-start gap-3 bg-muted/30 border border-border rounded-lg p-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{step}</span>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{label} <code className="text-xs ml-1 font-normal">{code}</code></p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">멀티라인 입력</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">read_user_input()</span>
            <span className="text-xs text-muted-foreground ml-2">rustyline 기반</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">단일 줄</span>
              <p className="text-sm">프롬프트 <code className="text-xs">&gt;</code> 표시 후 한 줄 읽기 — 화살표 키, Ctrl+R 히스토리 지원</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">멀티라인</span>
              <div>
                <p className="text-sm"><code className="text-xs">```</code>로 시작 → <code className="text-xs">...</code> 프롬프트로 연속 입력 → <code className="text-xs">```</code>로 종료</p>
                <p className="text-xs text-muted-foreground mt-1">코드 블록 붙여넣기에 유용 — 에러 메시지 여러 줄 전달</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">환영 메시지</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">print_welcome()</span>
            <span className="text-xs text-muted-foreground ml-2">세션 시작 시 출력</span>
          </div>
          <div className="p-4">
            <div className="font-mono text-sm bg-zinc-900 text-zinc-100 rounded-lg p-4 leading-relaxed">
              <p>╭─ claw v0.1.0 ─╮</p>
              <p>│ <span className="text-blue-400">Model:</span> claude-opus-4-20250514</p>
              <p>│ <span className="text-green-400">Mode:</span>  WorkspaceWrite</p>
              <p>│ <span className="text-yellow-400">Workspace:</span> my-project</p>
              <p>╰────────────────────╯</p>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Unicode 박스 문자로 세션 경계 명확화 — 모델·권한·워크스페이스 한눈에 확인<br />
              첫 안내: <code className="text-xs">/help</code>, <code className="text-xs">/exit</code> 힌트
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">종료 시그널 처리 — Ctrl+C, Ctrl+D</h3>
        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <kbd className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs font-mono font-bold">Ctrl+C</kbd>
              <span className="text-sm font-semibold">현재 턴 중단</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">ReadlineError::Interrupted</code> 발생<br />
              REPL은 계속 — 다음 입력 대기
            </p>
          </div>
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <kbd className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs font-mono font-bold">Ctrl+D</kbd>
              <span className="text-sm font-semibold">세션 종료</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">ReadlineError::Eof</code> 발생<br />
              graceful shutdown 실행
            </p>
          </div>
        </div>
        <p>
          bash와 동일한 키바인딩 — 사용자 근육 기억 재사용
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CLI-first 설계 철학</p>
          <p>
            claw-code는 GUI·웹 UI 없이 <strong>CLI만 제공</strong><br />
            이 선택의 근거:
          </p>
          <p className="mt-2">
            1. <strong>개발자 타겟</strong>: 대상 사용자가 터미널 환경에 익숙<br />
            2. <strong>SSH·tmux 호환</strong>: 원격 서버에서도 동일 경험<br />
            3. <strong>자동화 친화</strong>: 스크립트·파이프로 통합 용이<br />
            4. <strong>가벼움</strong>: 웹 UI 대비 리소스 1/100
          </p>
          <p className="mt-2">
            <strong>CLI의 한계</strong>: 이미지 표시, 인라인 diff 등 시각적 피드백 부족<br />
            claw-code의 대응: ANSI 렌더링 최대한 활용 (다음 섹션)<br />
            필요시 외부 웹 뷰어에 데이터 내보내기 지원 로드맵
          </p>
        </div>

      </div>
    </section>
  );
}
