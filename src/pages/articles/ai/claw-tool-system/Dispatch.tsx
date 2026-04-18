import DispatchViz from './viz/DispatchViz';
import Pipeline5StepViz from './viz/Pipeline5StepViz';

export default function Dispatch() {
  return (
    <section id="dispatch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">execute_tool() 디스패치 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <DispatchViz />

        {/* ── 진입점 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ConversationRuntime → execute_tool() 경로</h3>
        <p>
          에이전트 루프는 LLM 응답에서 <code>tool_use</code> 블록을 발견하면 <code>execute_tool()</code>을 호출<br />
          호출 사이트는 단일 — <code>conversation_runtime.rs</code>의 <code>handle_tool_use()</code> 함수<br />
          이 단일 진입점이 모든 도구 실행의 게이트웨이 역할
        </p>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">conversation_runtime.rs &mdash; handle_tool_use()</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-semibold">권한 게이트</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code className="text-xs">enforcer.check(&name, &input)</code> — Deny 시 즉시 에러 반환, Prompt 시 사용자 Y/N 대기, Allow 시 통과</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-semibold">Pre-hook 실행</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code className="text-xs">hooks.pre_tool(&name, &input)</code> — 훅이 abort 반환 시 디스패치 스킵</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-sm font-semibold">디스패치</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code className="text-xs">execute_tool(&name, input.clone()).await</code> — 실제 도구 함수 호출</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="text-sm font-semibold">Post-hook 실행</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code className="text-xs">hooks.post_tool(&name, &input, &output)</code> — 실패해도 도구 결과는 반환</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs font-bold">5</span>
              <div>
                <p className="text-sm font-semibold">세션 로그 기록</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code className="text-xs">session.log_tool_call(id, name, input, output)</code> — <code className="text-xs">id</code>로 tool_use와 tool_result 매칭</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 파이프라인</strong>: 권한 → Pre-hook → 디스패치 → Post-hook → 세션 로그<br />
          각 단계는 독립적 — Pre-hook이 abort하면 디스패치 스킵, Post-hook 실패해도 도구 결과는 반환<br />
          <code>id</code> 필드는 tool_use와 tool_result를 매칭하는 상관 관계 키 — LLM이 병렬 도구 호출 결과를 구분할 때 사용
        </p>
      </div>
      <Pipeline5StepViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── match 분기 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">execute_tool() 내부 — 40개 match 분기</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">execute_tool() &mdash; match name 분기 (40개 중 발췌)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">파일 I/O (3개)</p>
              <p className="text-sm font-mono"><code className="text-xs">"read_file"</code> &rarr; <code className="text-xs">read_file(p).await</code></p>
              <p className="text-sm font-mono"><code className="text-xs">"write_file"</code> &rarr; <code className="text-xs">write_file(input).await</code></p>
              <p className="text-sm font-mono"><code className="text-xs">"edit_file"</code> &rarr; <code className="text-xs">edit_file(input).await</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">검색 (2개)</p>
              <p className="text-sm font-mono"><code className="text-xs">"glob_search"</code> &rarr; <code className="text-xs">glob_search(input).await</code></p>
              <p className="text-sm font-mono"><code className="text-xs">"grep_search"</code> &rarr; <code className="text-xs">grep_search(input).await</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">실행 (4개)</p>
              <p className="text-sm font-mono"><code className="text-xs">"bash"</code> / <code className="text-xs">"PowerShell"</code> / <code className="text-xs">"REPL"</code> / <code className="text-xs">"Sleep"</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">태스크 (6개)</p>
              <p className="text-sm font-mono"><code className="text-xs">"TaskCreate"</code> / <code className="text-xs">Get</code> / <code className="text-xs">List</code> / <code className="text-xs">Stop</code> / <code className="text-xs">Update</code> / <code className="text-xs">Output</code></p>
              <p className="text-xs text-muted-foreground mt-1">모두 <code className="text-xs">global_task_registry()</code> 메서드 위임</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">UI (4개)</p>
              <p className="text-sm font-mono"><code className="text-xs">"SendUserMessage"</code> / <code className="text-xs">"Config"</code> / <code className="text-xs">"EnterPlanMode"</code> / <code className="text-xs">"ExitPlanMode"</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">fallback</p>
              <p className="text-sm font-mono"><code className="text-xs">_ =&gt; Err("unknown tool")</code></p>
              <p className="text-xs text-muted-foreground mt-1">존재하지 않는 도구 호출 시 에러 반환 (세션 유지)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>match 분기 구조</strong>: 문자열 패턴 매칭 + 입력 역직렬화 + 도구 함수 호출<br />
          각 분기는 <code>serde_json::from_value::&lt;T&gt;(input)</code>로 타입 안전 변환 — 역직렬화 실패 시 즉시 에러<br />
          unknown tool 분기는 <strong>대화를 종료하지 않음</strong> — LLM에게 에러를 돌려주고 재시도 기회 제공
        </p>

        {/* ── 입력 타입 시스템 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">도구 입력 타입 — struct 매핑</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">도구별 입력 struct 매핑</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm font-bold mb-2">TextFilePayload</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">path</code>
                  <span className="text-xs text-muted-foreground">절대 경로</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">offset?</code>
                  <span className="text-xs text-muted-foreground">시작 줄 (0-indexed)</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">limit?</code>
                  <span className="text-xs text-muted-foreground">읽을 줄 수</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm font-bold mb-2">BashCommandInput</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">command</code>
                  <span className="text-xs text-muted-foreground">셸 명령</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">timeout?</code>
                  <span className="text-xs text-muted-foreground">ms, 기본 120000</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">description?</code>
                  <span className="text-xs text-muted-foreground">사용자 표시용</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">run_in_background</code>
                  <span className="text-xs text-muted-foreground">백그라운드 실행</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm font-bold mb-2">GrepSearchInput</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">pattern</code>
                  <span className="text-xs text-muted-foreground">정규식</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">path?</code>
                  <span className="text-xs text-muted-foreground">검색 디렉토리</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">output_mode?</code>
                  <span className="text-xs text-muted-foreground">content | files | count</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">head_limit?</code>
                  <span className="text-xs text-muted-foreground">최대 결과 수</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <code className="text-xs font-mono">case_insensitive</code>
                  <span className="text-xs text-muted-foreground">-i 플래그</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>타입 시스템의 역할</strong>: JSON Schema 역직렬화 시점에 타입 안전성 강제<br />
          <code>Option&lt;T&gt;</code>는 선택 파라미터 — LLM이 생략해도 컴파일 에러 없음<br />
          <code>enum OutputMode</code>는 허용 값 제한 — 잘못된 문자열 전달 시 역직렬화 실패
        </p>
        <p>
          <strong>설계 판단</strong>: JSON Schema → Rust struct 대응 관계를 수동으로 유지<br />
          자동 생성(코드젠)을 쓰지 않는 이유 — 도구가 40개로 고정적이고 수동 관리가 더 명시적<br />
          스키마 변경 시 struct도 함께 수정 — 두 곳 동기화 부담은 있지만 타입 안전성 확보
        </p>

        {/* ── 비동기 디스패치 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">async 디스패치 — tokio 런타임</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">execute_bash() &mdash; async 프로세스 실행</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-semibold">입력 역직렬화</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">serde_json::from_value::&lt;BashCommandInput&gt;(input)</code></p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-semibold">async 프로세스 실행</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">tokio::process::Command::new("/bin/bash").arg("-c").arg(&cmd.command)</code> &mdash; stdout/stderr 캡처</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-sm font-semibold">타임아웃 적용</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">tokio::time::timeout(Duration::from_millis(cmd.timeout.unwrap_or(120_000)))</code> &mdash; 기본 2분</p>
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="text-sm font-semibold">결과 반환</p>
                <p className="text-xs text-muted-foreground"><code className="text-xs">ToolOutput::text(String::from_utf8_lossy(&output.stdout))</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>async fn</code>은 tokio 런타임에서 협력적 멀티태스킹으로 실행<br />
          <strong>병렬 도구 호출 지원</strong>: LLM이 여러 tool_use 블록을 한 번에 보내면 <code>tokio::join!</code>으로 동시 실행<br />
          예: Read 3개 파일 병렬 호출 시, 순차 대비 3배 빠름 (I/O bound)
        </p>

        {/* ── 병렬 실행 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">병렬 도구 실행</h3>
        <div className="not-prose my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">handle_tool_uses_parallel() &mdash; 병렬 디스패치</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Step 1</p>
              <p className="text-sm font-semibold">Future 수집</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">blocks.map(handle_tool_use)</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Step 2</p>
              <p className="text-sm font-semibold">동시 실행</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">join_all(futures).await</code></p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Step 3</p>
              <p className="text-sm font-semibold">에러 격리</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">unwrap_or_else(error_raw)</code></p>
            </div>
          </div>
        </div>
        <p>
          <code>join_all</code>은 모든 future를 동시 실행 후 Vec 순서대로 결과 반환<br />
          <strong>순서 보장</strong>: 결과 순서는 입력 순서와 동일 — tool_use_id로 LLM이 매칭<br />
          <strong>에러 격리</strong>: 한 도구가 실패해도 다른 도구는 계속 실행 — <code>unwrap_or_else</code>로 에러도 결과로 변환
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: match 분기 vs 트레이트 기반 디스패치</p>
          <p>
            <strong>선택지 A — match 분기 (현재 구현)</strong>:<br />
            - 장점: 컴파일러가 모든 분기를 한눈에 볼 수 있음, cold path 최적화 가능<br />
            - 단점: 도구 추가 시 여러 파일 수정 필요 (ToolSpec + execute_tool + struct)
          </p>
          <p className="mt-2">
            <strong>선택지 B — 트레이트 객체 (<code>Box&lt;dyn ToolExecutor&gt;</code>)</strong>:<br />
            - 장점: 도구 추가가 단일 파일로 완결 (impl ToolExecutor 블록만 추가)<br />
            - 단점: 동적 디스패치 오버헤드, 컴파일 타임에 전체 도구 목록 확인 불가
          </p>
          <p className="mt-2">
            claw-code는 <strong>A를 선택</strong> — 도구가 40개로 고정적이고, 컴파일 타임 검증이 런타임 유연성보다
            중요하다는 판단<br />
            실제로 <code>_ =&gt; Err("unknown tool")</code> 분기가 LLM 환각 대응으로도 활용됨
          </p>
        </div>

      </div>
    </section>
  );
}
