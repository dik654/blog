import JsonRpcViz from './viz/JsonRpcViz';

export default function Stdio() {
  return (
    <section id="stdio" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">McpStdioProcess — 프로세스 관리 &amp; JSON-RPC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <JsonRpcViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">McpStdioProcess 구조</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>child</code></p>
            <p className="text-xs text-muted-foreground">서브프로세스 핸들<br /><code>tokio::process::Child</code></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>stdin_writer</code></p>
            <p className="text-xs text-muted-foreground">JSON-RPC 요청 출력<br /><code>Arc&lt;Mutex&lt;ChildStdin&gt;&gt;</code></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>stdout_reader</code></p>
            <p className="text-xs text-muted-foreground">JSON-RPC 응답 입력<br /><code>Arc&lt;Mutex&lt;BufReader&gt;&gt;</code></p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>pending_requests</code></p>
            <p className="text-xs text-muted-foreground">id → 응답 채널 매핑<br /><code>HashMap&lt;u64, oneshot::Sender&gt;</code></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>next_request_id</code></p>
            <p className="text-xs text-muted-foreground">고유 ID 생성기<br /><code>AtomicU64</code></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>reader_task</code></p>
            <p className="text-xs text-muted-foreground">stdout 백그라운드 읽기<br /><code>JoinHandle&lt;()&gt;</code></p>
          </div>
        </div>
        <p>
          <strong>구성 요소</strong>:<br />
          - <code>child</code>: 서브프로세스 핸들<br />
          - stdin/stdout: JSON-RPC 입출력 채널<br />
          - <code>pending_requests</code>: id → 응답 채널 매핑<br />
          - <code>reader_task</code>: stdout 백그라운드 읽기 태스크
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">spawn() — 서브프로세스 시작</h3>
        <div className="space-y-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-blue-200 dark:bg-blue-700 px-1.5 py-0.5 rounded mt-0.5">1</span>
            <div>
              <p className="font-semibold text-sm">Command 구성</p>
              <p className="text-sm text-muted-foreground"><code>config.command</code> + <code>args</code> + <code>env</code> 설정, stdin/stdout/stderr 모두 <code>Stdio::piped()</code></p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-emerald-200 dark:bg-emerald-700 px-1.5 py-0.5 rounded mt-0.5">2</span>
            <div>
              <p className="font-semibold text-sm">프로세스 spawn + 3개 스트림 확보</p>
              <p className="text-sm text-muted-foreground"><code>child.stdin.take()</code>, <code>stdout.take()</code>, <code>stderr.take()</code></p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-amber-200 dark:bg-amber-700 px-1.5 py-0.5 rounded mt-0.5">3</span>
            <div>
              <p className="font-semibold text-sm">백그라운드 태스크 2개 시작</p>
              <p className="text-sm text-muted-foreground"><code>drain_stderr(stderr)</code> — 로그 drain<br /><code>reader_loop(stdout, pending)</code> — 응답 수신</p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-purple-200 dark:bg-purple-700 px-1.5 py-0.5 rounded mt-0.5">4</span>
            <div>
              <p className="font-semibold text-sm">구조체 반환</p>
              <p className="text-sm text-muted-foreground"><code>stdin_writer</code>, <code>pending_requests</code>, <code>next_request_id: 1</code> 초기화</p>
            </div>
          </div>
        </div>
        <p>
          <strong>3개 스트림 확보</strong>: stdin(요청), stdout(응답), stderr(로그)<br />
          stdout 리더는 <strong>독립 태스크</strong> — 응답 수신을 비동기로 처리<br />
          stderr는 별도 태스크가 drain — 버퍼 오버플로 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">reader_loop — 백그라운드 응답 수신</h3>
        <div className="space-y-2 my-4">
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="font-semibold text-sm">Line-delimited JSON 읽기</p>
            <p className="text-sm text-muted-foreground"><code>BufReader::new(stdout).lines()</code> — 한 줄 = 한 JSON-RPC 메시지</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="font-semibold text-sm">JSON 파싱 + 에러 스킵</p>
            <p className="text-sm text-muted-foreground"><code>serde_json::from_str(&line)</code> — 파싱 실패 시 <code>log::warn!</code> 후 <code>continue</code></p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
              <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">id 있음 → 응답</p>
              <p className="text-sm text-muted-foreground"><code>pending.remove(&id)</code>로 대기 채널 찾아 <code>sender.send(msg)</code></p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="font-semibold text-sm text-amber-700 dark:text-amber-300">id 없음 → 알림</p>
              <p className="text-sm text-muted-foreground"><code>handle_notification(msg)</code>로 별도 처리 (progress, log 등)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>JSON-RPC 프레이밍</strong>: 한 줄 = 한 메시지 (line-delimited JSON)<br />
          <code>id</code> 매칭으로 요청-응답 쌍 짝지음 — <code>pending_requests</code> 맵에서 찾아 전달<br />
          id 없는 메시지는 알림 — 별도 처리 (progress, log 등)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">send() — 요청 전송</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-blue-200 dark:bg-blue-700 px-1.5 py-0.5 rounded">1</span>
            <p className="font-semibold text-sm mt-1">고유 ID 생성</p>
            <p className="text-xs text-muted-foreground"><code>AtomicU64::fetch_add</code></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-emerald-200 dark:bg-emerald-700 px-1.5 py-0.5 rounded">2</span>
            <p className="font-semibold text-sm mt-1">oneshot 채널 등록</p>
            <p className="text-xs text-muted-foreground"><code>pending.insert(id, tx)</code></p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-indigo-200 dark:bg-indigo-700 px-1.5 py-0.5 rounded">3</span>
            <p className="font-semibold text-sm mt-1">JSON-RPC 요청 조립</p>
            <p className="text-xs text-muted-foreground"><code>jsonrpc</code>, <code>id</code>, <code>method</code>, <code>params</code></p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-violet-200 dark:bg-violet-700 px-1.5 py-0.5 rounded">4</span>
            <p className="font-semibold text-sm mt-1">stdin 전송</p>
            <p className="text-xs text-muted-foreground"><code>write_all</code> + <code>\\n</code> + <code>flush</code></p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-purple-200 dark:bg-purple-700 px-1.5 py-0.5 rounded">5</span>
            <p className="font-semibold text-sm mt-1">응답 대기</p>
            <p className="text-xs text-muted-foreground"><code>rx.await?</code></p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-red-200 dark:bg-red-700 px-1.5 py-0.5 rounded">6</span>
            <p className="font-semibold text-sm mt-1">에러 체크 + 반환</p>
            <p className="text-xs text-muted-foreground"><code>error</code> 필드 → <code>Err</code>, 아니면 <code>result</code> 반환</p>
          </div>
        </div>
        <p>
          <strong>6단계 전송</strong>: ID 생성 → 채널 등록 → 요청 조립 → 전송 → 응답 대기 → 결과 반환<br />
          <code>oneshot</code> 채널: 1회용 비동기 채널 — 요청-응답 쌍에 적합<br />
          ID는 <code>AtomicU64</code>로 동시성 안전 증가 — 여러 태스크에서 동시 요청 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">알림 처리 — handle_notification()</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">progress</p>
            <p className="text-sm">진행률 업데이트 — UI 표시</p>
            <p className="text-xs text-muted-foreground mt-1"><code>emit_event(McpProgress)</code></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-1">message</p>
            <p className="text-sm">서버 로그 메시지</p>
            <p className="text-xs text-muted-foreground mt-1"><code>log::info!</code></p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-amber-700 dark:text-amber-300 mb-1">cancelled</p>
            <p className="text-sm">작업 취소 알림</p>
            <p className="text-xs text-muted-foreground mt-1">알 수 없는 알림은 <code>log::debug!</code></p>
          </div>
        </div>
        <p>
          <strong>3종 표준 알림</strong>: progress, message, cancelled<br />
          progress 알림은 장시간 실행 도구(예: DB 쿼리)에서 유용 — 사용자에게 진행 표시<br />
          알려지지 않은 알림은 debug 로그로만 — 호환성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">stderr drain — 무한 대기 방지</h3>
        <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-1"><code>drain_stderr()</code></p>
          <p className="text-sm text-muted-foreground"><code>BufReader::new(stderr).lines()</code>로 지속 읽기 — 각 줄 <code>log::debug!</code>로 기록</p>
        </div>
        <p>
          <strong>stderr를 읽지 않으면 버퍼 가득 찰 수 있음</strong> → MCP 서버 block<br />
          별도 태스크로 지속적으로 drain — MCP 서버가 계속 로그 쓸 수 있게<br />
          서버 로그는 <code>log::debug!</code>로 기록 — 조사 필요 시 확인
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">kill() — 프로세스 강제 종료</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-blue-200 dark:bg-blue-700 px-1.5 py-0.5 rounded">1</span>
            <p className="font-semibold text-sm mt-1">리더 취소</p>
            <p className="text-xs text-muted-foreground"><code>reader_task.abort()</code></p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-amber-200 dark:bg-amber-700 px-1.5 py-0.5 rounded">2</span>
            <p className="font-semibold text-sm mt-1">대기 요청 정리</p>
            <p className="text-xs text-muted-foreground"><code>pending.drain()</code> → <code>"process killed"</code> 에러</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-orange-200 dark:bg-orange-700 px-1.5 py-0.5 rounded">3</span>
            <p className="font-semibold text-sm mt-1">SIGTERM</p>
            <p className="text-xs text-muted-foreground"><code>start_kill()</code> + 500ms 대기</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-red-200 dark:bg-red-700 px-1.5 py-0.5 rounded">4</span>
            <p className="font-semibold text-sm mt-1">SIGKILL</p>
            <p className="text-xs text-muted-foreground"><code>try_wait()</code> 확인 후 <code>kill()</code></p>
          </div>
        </div>
        <p>
          <strong>4단계 종료</strong>: 리더 취소 → 대기 요청 정리 → SIGTERM → SIGKILL<br />
          대기 요청을 "process killed" 에러로 완료 — deadlock 방지<br />
          SIGTERM → 500ms 대기 → SIGKILL — graceful 먼저, 안 되면 강제
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 stdio인가 — HTTP와 비교</p>
          <p>
            MCP는 stdio 외에도 HTTP SSE, WebSocket 등 전송 방식 가능<br />
            <strong>stdio의 장점</strong>:
          </p>
          <p className="mt-2">
            ✓ <strong>프로세스 수명 = 연결 수명</strong>: 프로세스 죽으면 연결 끊김 (명확)<br />
            ✓ <strong>보안</strong>: 로컬 IPC만 — 네트워크 노출 없음<br />
            ✓ <strong>권한 격리</strong>: 서브프로세스 권한은 부모가 제어<br />
            ✓ <strong>포트 충돌 없음</strong>: 여러 MCP 서버 동시 실행 용이
          </p>
          <p className="mt-2">
            <strong>stdio의 단점</strong>:<br />
            ✗ 원격 서버 불가 — 같은 머신에서만<br />
            ✗ 다중 클라이언트 불가 — 1:1 연결만
          </p>
          <p className="mt-2">
            claw-code는 <strong>로컬 도구 확장</strong>이 주 사용 사례 — stdio가 최적<br />
            원격 MCP 필요 시 HTTP 서버를 stdio 서브프로세스가 프록시하는 패턴 사용
          </p>
        </div>

      </div>
    </section>
  );
}
