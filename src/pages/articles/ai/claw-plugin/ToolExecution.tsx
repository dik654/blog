import ExecutionViz from './viz/ExecutionViz';

export default function ToolExecution() {
  return (
    <section id="tool-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">플러그인 도구 서브프로세스 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ExecutionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">LLM → 플러그인 도구 호출 흐름</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">도구 호출 라우팅</div>
          <div className="p-4 space-y-2">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <p className="text-sm">LLM 응답: <code className="text-xs bg-muted px-1 py-0.5 rounded">tool_use {"{"} name: "lint_check", input: {"{"} path: "src/main.rs" {"}"} {"}"}</code></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">handle_tool_use()</code> → <code className="text-xs bg-muted px-1 py-0.5 rounded">execute_tool("lint_check", input)</code></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">3</span>
              <div className="text-sm">
                <p><code className="text-xs bg-muted px-1 py-0.5 rounded">match name</code>: 빌트인 40개 매칭 시도</p>
                <p className="text-xs text-muted-foreground mt-0.5">매칭 실패 시 → <code className="text-xs">find_plugin_tool(name)</code>으로 플러그인 도구 폴백</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center">4</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">execute_plugin_tool(plugin_tool, input)</code> 호출</p>
            </div>
          </div>
        </div>
        <p>
          플러그인 도구 네임스페이스는 빌트인과 동일 — 사용자는 구분 없이 호출<br />
          도구 등록 시 <strong>이름 충돌 검사</strong>로 모호성 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">execute_plugin_tool() 구현</h3>
        <p>
          7단계로 플러그인 도구를 서브프로세스로 실행.
          <code>--tool</code> 플래그로 호출할 도구 이름 전달 — 플러그인이 여러 도구 제공 시 구분.
        </p>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">execute_plugin_tool() 7단계</div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
              <span className="flex-shrink-0 text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 w-5 h-5 rounded-full flex items-center justify-center">1</span>
              <div className="text-sm">
                <strong>서브프로세스 생성</strong>
                <p className="text-xs text-muted-foreground"><code className="text-xs">Command::new(entrypoint).arg("--tool").arg(name)</code></p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
              <span className="flex-shrink-0 text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 w-5 h-5 rounded-full flex items-center justify-center">2</span>
              <div className="text-sm">
                <strong>rlimit 적용</strong>
                <p className="text-xs text-muted-foreground">CPU, 메모리, 파일 크기 제한 (Unix)</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
              <span className="flex-shrink-0 text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 w-5 h-5 rounded-full flex items-center justify-center">3</span>
              <div className="text-sm">
                <strong>환경 변수 3개 주입</strong>
                <p className="text-xs text-muted-foreground"><code className="text-xs">CLAW_PLUGIN</code>, <code className="text-xs">CLAW_TOOL</code>, <code className="text-xs">CLAW_WORKSPACE</code></p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
              <span className="flex-shrink-0 text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 w-5 h-5 rounded-full flex items-center justify-center">4</span>
              <div className="text-sm">
                <strong>spawn</strong>
                <p className="text-xs text-muted-foreground"><code className="text-xs">cmd.spawn()</code>으로 자식 프로세스 시작</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
              <span className="flex-shrink-0 text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 w-5 h-5 rounded-full flex items-center justify-center">5</span>
              <div className="text-sm">
                <strong>stdin JSON 전송</strong>
                <p className="text-xs text-muted-foreground"><code className="text-xs">serde_json::to_vec(&input)</code> → stdin write</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
              <span className="flex-shrink-0 text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 w-5 h-5 rounded-full flex items-center justify-center">6</span>
              <div className="text-sm">
                <strong>타임아웃 적용</strong>
                <p className="text-xs text-muted-foreground"><code className="text-xs">tokio::time::timeout(timeout_ms)</code></p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2 sm:col-span-2">
              <span className="flex-shrink-0 text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 w-5 h-5 rounded-full flex items-center justify-center">7</span>
              <div className="text-sm">
                <strong>결과 파싱</strong>
                <p className="text-xs text-muted-foreground"><code className="text-xs">parse_plugin_output(output)</code> — stdout JSON을 ToolOutput으로 변환</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">plugin output 프로토콜</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
            <div className="bg-green-50 dark:bg-green-950/30 px-4 py-2 border-b border-green-200 dark:border-green-800 text-sm font-semibold">성공 응답</div>
            <div className="p-4 space-y-2 text-sm">
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">success</code>: <code className="text-xs">true</code></div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">output</code>: 주 출력 — LLM에게 <code className="text-xs">tool_result</code>로 전달</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">stderr_info</code>: 부가 정보 (로깅 전용)</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">metadata</code>: 선택적 추가 데이터 (예: <code className="text-xs">files_checked: 15</code>)</div>
            </div>
          </div>
          <div className="border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950/30 px-4 py-2 border-b border-red-200 dark:border-red-800 text-sm font-semibold">실패 응답</div>
            <div className="p-4 space-y-2 text-sm">
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">success</code>: <code className="text-xs">false</code></div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">error</code>: 에러 메시지 (예: <code className="text-xs">"lint failed: undefined variable 'x'"</code>)</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">output</code>: 빈 문자열</div>
            </div>
          </div>
        </div>
        <p>
          <code>metadata</code>: 플러그인이 추가 정보 제공 — 텔레메트리·감사에 활용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">parse_plugin_output() — 응답 처리</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">parse_plugin_output() 2단계 검증</div>
          <div className="p-4 space-y-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">1. exit code 확인</div>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">output.status.success()</code> 실패 시 stderr 포함하여 에러 반환 — 디버깅 용이
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">2. stdout JSON 파싱</div>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">serde_json::from_slice</code>로 <code className="text-xs">PluginResponse</code> 역직렬화.
                <code className="text-xs bg-muted px-1 py-0.5 rounded">parsed.success</code>이면 <code className="text-xs">ToolOutput::text(output)</code>, 아니면 에러
              </p>
            </div>
          </div>
        </div>
        <p>
          JSON 파싱 실패 = 플러그인 버그 — 프로토콜 위반으로 즉시 에러
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">rlimit 적용 (Unix)</h3>
        <p>
          <code>pre_exec</code>는 fork 후 exec 전에 실행 — 자식 프로세스에만 적용.
          한계 초과 시 kernel이 SIGKILL 자동 전송 — 플러그인이 "자원 폭주" 불가.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">RLIMIT_CPU</div>
            <p className="text-sm font-semibold">CPU 시간 제한</p>
            <p className="text-xs text-muted-foreground mt-1"><code className="text-xs bg-muted px-1 py-0.5 rounded">max_cpu_seconds</code>에서 설정</p>
            <p className="text-xs text-muted-foreground">초과 시 SIGKILL</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">RLIMIT_AS</div>
            <p className="text-sm font-semibold">메모리 제한</p>
            <p className="text-xs text-muted-foreground mt-1"><code className="text-xs bg-muted px-1 py-0.5 rounded">max_memory_mb</code> x 1024 x 1024 bytes</p>
            <p className="text-xs text-muted-foreground">address space 상한</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">RLIMIT_FSIZE</div>
            <p className="text-sm font-semibold">파일 크기 제한</p>
            <p className="text-xs text-muted-foreground mt-1">고정값 10MB</p>
            <p className="text-xs text-muted-foreground">생성 파일 크기 상한</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 크래시 처리</h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-700 dark:text-green-300">0</div>
            <p className="text-xs text-muted-foreground">정상 종료</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-amber-700 dark:text-amber-300">1</div>
            <p className="text-xs text-muted-foreground">일반 에러</p>
            <p className="text-xs text-muted-foreground">error 응답 포함</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-700 dark:text-red-300">137</div>
            <p className="text-xs text-muted-foreground">SIGKILL (128+9)</p>
            <p className="text-xs text-muted-foreground">rlimit 초과</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-700 dark:text-red-300">139</div>
            <p className="text-xs text-muted-foreground">SIGSEGV (128+11)</p>
            <p className="text-xs text-muted-foreground">메모리 오류</p>
          </div>
        </div>
        <p>
          플러그인 버그가 메인 프로세스에 영향 없음 — 서브프로세스 격리의 가치
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 서브프로세스 vs FFI 비교</p>
          <p>
            플러그인 확장 방식 2가지:<br />
            1. <strong>서브프로세스</strong> (claw-code 선택): 별도 프로세스, JSON 프로토콜<br />
            2. <strong>FFI/dylib</strong>: 공유 라이브러리 로드, 함수 호출
          </p>
          <p className="mt-2">
            <strong>서브프로세스 장점</strong>:<br />
            ✓ 언어 무관 (Python, Go, Bash 등)<br />
            ✓ 격리 — 크래시·메모리 누수가 메인에 영향 없음<br />
            ✓ 자원 제한 가능 (rlimit)<br />
            ✓ 보안 — 샌드박스 적용 가능
          </p>
          <p className="mt-2">
            <strong>서브프로세스 단점</strong>:<br />
            ✗ 호출당 오버헤드(~20ms) — fork/exec + JSON 파싱<br />
            ✗ 상태 공유 없음 — 매번 파일/DB로 복원
          </p>
          <p className="mt-2">
            claw-code는 <strong>안전 &gt; 속도</strong> 선택 — 에이전트 도구는 초당 수십 번 호출 안 함<br />
            20ms 오버헤드는 LLM 응답 시간(수 초) 대비 무시할 수준
          </p>
        </div>

      </div>
    </section>
  );
}
