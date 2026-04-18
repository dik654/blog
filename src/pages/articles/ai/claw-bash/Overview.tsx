import BashPipelineViz from './viz/BashPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bash 실행 흐름 &amp; 샌드박스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <BashPipelineViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Bash 도구의 위험성</h3>
        <p>
          <code>bash</code>는 claw-code에서 가장 <strong>위험한 도구</strong><br />
          임의 쉘 명령을 실행 — 파일 삭제, 네트워크 접근, 시스템 조작 모두 가능<br />
          <code>DangerFullAccess</code> 권한 요구 — 기본 모드에서 항상 Prompt 발생
        </p>
        <div className="not-prose grid gap-3 my-4">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">위험 예시 1</p>
            <p className="text-sm mb-1">사용자: "임시 파일 정리해줘"</p>
            <p className="text-sm mb-1">에이전트: <code className="bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded text-xs">bash("rm -rf /tmp")</code></p>
            <p className="text-sm text-red-600 dark:text-red-400">의도: 임시 디렉토리 정리 → 실제: /tmp 전체 삭제, 다른 프로세스 영향</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">위험 예시 2</p>
            <p className="text-sm mb-1">사용자: "로그 확인해줘"</p>
            <p className="text-sm mb-1">에이전트: <code className="bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded text-xs">bash("cat /var/log/*")</code></p>
            <p className="text-sm text-red-600 dark:text-red-400">의도: 로그 읽기 → 실제: /etc/shadow 같은 파일도 접근 가능 (sudo 시)</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">BashCommandInput 구조</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold">BashCommandInput 구조체</p>
            </div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-[140px_1fr] px-4 py-2.5 text-sm">
                <span className="font-mono text-blue-600 dark:text-blue-400">command</span>
                <span><code className="text-xs bg-muted px-1 py-0.5 rounded">String</code> — 실행할 명령 (필수)</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] px-4 py-2.5 text-sm bg-muted/30">
                <span className="font-mono text-blue-600 dark:text-blue-400">timeout</span>
                <span><code className="text-xs bg-muted px-1 py-0.5 rounded">Option&lt;u64&gt;</code> — 밀리초, 기본 120000 (2분)</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] px-4 py-2.5 text-sm">
                <span className="font-mono text-blue-600 dark:text-blue-400">description</span>
                <span><code className="text-xs bg-muted px-1 py-0.5 rounded">Option&lt;String&gt;</code> — 사용자에게 표시할 설명</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] px-4 py-2.5 text-sm bg-muted/30">
                <span className="font-mono text-blue-600 dark:text-blue-400">run_in_background</span>
                <span><code className="text-xs bg-muted px-1 py-0.5 rounded">bool</code> — 백그라운드 실행 여부</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] px-4 py-2.5 text-sm">
                <span className="font-mono text-blue-600 dark:text-blue-400">working_directory</span>
                <span><code className="text-xs bg-muted px-1 py-0.5 rounded">Option&lt;PathBuf&gt;</code> — 실행 디렉토리 (기본: workspace)</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5개 필드</strong>: command(필수) + 4개 선택<br />
          <code>description</code>은 LLM이 "이 명령이 무엇을 하는지" 사용자에게 설명 — Prompt UI에 표시<br />
          <code>run_in_background</code>: 장시간 실행 명령(서버 등)은 백그라운드로 — stdout 파일로 리다이렉션
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실행 파이프라인 전체 흐름</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold">execute_bash(input) 흐름</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="grid grid-cols-[32px_140px_1fr] px-4 py-2.5 items-center">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">1</span>
                <span className="font-semibold">입력 파싱</span>
                <span className="text-muted-foreground">BashCommandInput 역직렬화</span>
              </div>
              <div className="px-4 py-2.5 bg-muted/30">
                <div className="grid grid-cols-[32px_140px_1fr] items-center">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">2</span>
                  <span className="font-semibold">6단계 검증</span>
                  <span className="text-muted-foreground">(다음 섹션)</span>
                </div>
                <div className="ml-8 mt-2 grid gap-1.5 text-xs text-muted-foreground">
                  <div className="grid grid-cols-[120px_1fr]"><span className="font-mono">a. Empty check</span><span>빈 명령 거부</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="font-mono">b. Length check</span><span>10KB 초과 거부</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="font-mono">c. Banned patterns</span><span>금지 패턴 매칭</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="font-mono">d. CommandIntent</span><span>Destructive 감지 → Prompt</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="font-mono">e. Path validation</span><span>작업 디렉토리 검증</span></div>
                  <div className="grid grid-cols-[120px_1fr]"><span className="font-mono">f. Resource limits</span><span>rlimit 적용</span></div>
                </div>
              </div>
              <div className="grid grid-cols-[32px_140px_1fr] px-4 py-2.5 items-center">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">3</span>
                <span className="font-semibold">샌드박스 결정</span>
                <span className="text-muted-foreground">bubblewrap 가능 여부 확인</span>
              </div>
              <div className="grid grid-cols-[32px_140px_1fr] px-4 py-2.5 items-center bg-muted/30">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">4</span>
                <span className="font-semibold">서브프로세스 실행</span>
                <span className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">tokio::process::Command</code></span>
              </div>
              <div className="grid grid-cols-[32px_140px_1fr] px-4 py-2.5 items-center">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">5</span>
                <span className="font-semibold">타임아웃 감시</span>
                <span className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">tokio::time::timeout</code></span>
              </div>
              <div className="grid grid-cols-[32px_140px_1fr] px-4 py-2.5 items-center bg-muted/30">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">6</span>
                <span className="font-semibold">출력 절단</span>
                <span className="text-muted-foreground">stdout 8KB, stderr 4KB 상한</span>
              </div>
              <div className="grid grid-cols-[32px_140px_1fr] px-4 py-2.5 items-center">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">7</span>
                <span className="font-semibold">결과 반환</span>
                <span className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">ToolOutput {'{'} stdout, stderr, exit_code {'}'}</code></span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">기본 실행 코드</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-violet-50 dark:bg-violet-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold"><code className="text-xs">execute_bash(input)</code> 핵심 로직</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="px-4 py-3">
                <p className="font-semibold text-violet-700 dark:text-violet-400 mb-1">입력 역직렬화</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">serde_json::from_value(input)</code> → <code className="text-xs bg-muted px-1 py-0.5 rounded">BashCommandInput</code></p>
              </div>
              <div className="px-4 py-3 bg-muted/30">
                <p className="font-semibold text-violet-700 dark:text-violet-400 mb-1">6단계 검증</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">BashValidator::new(&cmd).validate()?</code></p>
              </div>
              <div className="px-4 py-3">
                <p className="font-semibold text-violet-700 dark:text-violet-400 mb-1">샌드박스 래핑</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">Sandbox::is_available()</code> 분기 — 가용하면 <code className="text-xs bg-muted px-1 py-0.5 rounded">wrap_command()</code>, 아니면 직접 실행</p>
              </div>
              <div className="px-4 py-3 bg-muted/30">
                <p className="font-semibold text-violet-700 dark:text-violet-400 mb-1">프로세스 생성</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">tokio::process::Command::new(&program)</code> — stdout/stderr piped, working_directory 설정</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-semibold text-violet-700 dark:text-violet-400 mb-1">타임아웃 적용</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">tokio::time::timeout(timeout, child.wait_with_output())</code> — 기본 120초</p>
              </div>
              <div className="px-4 py-3 bg-muted/30">
                <p className="font-semibold text-violet-700 dark:text-violet-400 mb-1">결과 반환</p>
                <p className="text-muted-foreground">
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">ToolOutput</code>: stdout <code className="text-xs bg-muted px-1 py-0.5 rounded">truncate(8192)</code>, stderr <code className="text-xs bg-muted px-1 py-0.5 rounded">truncate(4096)</code>, exit_code
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">출력 절단 — truncate</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-orange-50 dark:bg-orange-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold"><code className="text-xs">truncate(text, max_bytes)</code> 동작</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="px-4 py-3">
                <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">길이 확인</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">text.len() &lt;= max_bytes</code> → 그대로 반환</p>
              </div>
              <div className="px-4 py-3 bg-muted/30">
                <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">절단 + 꼬리 메시지</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">text[..max_bytes]</code> 슬라이스 후 <code className="text-xs bg-muted px-1 py-0.5 rounded">[... truncated, N bytes total ...]</code> 추가</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">적용 한계</p>
                <div className="flex gap-4 text-muted-foreground">
                  <span>stdout: <code className="text-xs bg-muted px-1 py-0.5 rounded">8KB</code></span>
                  <span>stderr: <code className="text-xs bg-muted px-1 py-0.5 rounded">4KB</code></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>절단 한계</strong>: stdout 8KB, stderr 4KB<br />
          이유: LLM 컨텍스트에 들어가는 토큰 수 제한 — 10MB 로그가 대화를 오염시키는 것 방지<br />
          사용자가 전체 출력 필요 시 <code>head</code>, <code>tail</code>, 파일 리다이렉션 사용 권장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">백그라운드 실행 — run_in_background</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-sky-50 dark:bg-sky-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold">백그라운드 실행 흐름 (<code className="text-xs">run_in_background = true</code>)</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="px-4 py-3">
                <p className="font-semibold text-sky-700 dark:text-sky-400 mb-1">로그 파일 생성</p>
                <p className="text-muted-foreground">경로: <code className="text-xs bg-muted px-1 py-0.5 rounded">.claw/bg-logs/{'{'}uuid{'}'}.log</code> — UUID로 고유 파일명</p>
              </div>
              <div className="px-4 py-3 bg-muted/30">
                <p className="font-semibold text-sky-700 dark:text-sky-400 mb-1">stdout/stderr 리다이렉션</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">log_file.try_clone()</code>로 stdout과 stderr 모두 같은 파일에 기록</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-semibold text-sky-700 dark:text-sky-400 mb-1">프로세스 생성 + 즉시 반환</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">spawn()</code> 후 종료 대기 없음 — PID + 로그 경로를 <code className="text-xs bg-muted px-1 py-0.5 rounded">ToolOutput::background()</code>로 반환</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>백그라운드 실행 사용 사례</strong>: <code>npm run dev</code>, <code>cargo watch</code>, 테스트 서버 등<br />
          PID와 로그 파일 경로 반환 — 사용자가 후속 명령으로 로그 확인 가능<br />
          세션 종료 시 백그라운드 프로세스는 <strong>자동 종료</strong> (tokio Child가 Drop 시 kill)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: bash vs 전용 도구의 트레이드오프</p>
          <p>
            다른 에이전트 프레임워크는 bash를 금지하고 <strong>전용 도구만</strong> 제공<br />
            - <code>git_commit</code>, <code>npm_install</code>, <code>test_run</code> 같은 한정 도구<br />
            - 장점: 안전, 입력 검증 가능<br />
            - 단점: 표현력 부족 — 복합 파이프(<code>grep | sort | uniq</code>) 불가
          </p>
          <p className="mt-2">
            claw-code의 선택: <strong>bash 유지 + 다층 검증</strong><br />
            - 6단계 검증 + 샌드박스 + Prompt로 위험 최소화<br />
            - 대신 사용자가 bash를 쓸지 말지 선택 가능 (<code>--read-only</code>, Policy 규칙)<br />
            - LLM이 복합 작업을 한 명령으로 표현할 수 있어 효율 ↑
          </p>
          <p className="mt-2">
            이 선택은 "성인 사용자 가정" 철학 — "도구를 뺏기보다 안전 가드 제공"
          </p>
        </div>

      </div>
    </section>
  );
}
