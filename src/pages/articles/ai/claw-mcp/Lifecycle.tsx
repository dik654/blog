import McpLifecycleViz from './viz/McpLifecycleViz';

export default function Lifecycle() {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">McpLifecycleValidator — 11단계 상태 전이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <McpLifecycleViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">11단계 상태 enum</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded mr-1">1</span>
            <span className="text-sm font-semibold">Uninitialized</span>
            <p className="text-xs text-muted-foreground mt-1">초기 상태</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-blue-200 dark:bg-blue-700 px-1.5 py-0.5 rounded mr-1">2</span>
            <span className="text-sm font-semibold">Spawning</span>
            <p className="text-xs text-muted-foreground mt-1">프로세스 시작 중</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-blue-200 dark:bg-blue-700 px-1.5 py-0.5 rounded mr-1">3</span>
            <span className="text-sm font-semibold">Spawned</span>
            <p className="text-xs text-muted-foreground mt-1">프로세스 시작됨</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-indigo-200 dark:bg-indigo-700 px-1.5 py-0.5 rounded mr-1">4</span>
            <span className="text-sm font-semibold">Initializing</span>
            <p className="text-xs text-muted-foreground mt-1">initialize 요청 전송 중</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-indigo-200 dark:bg-indigo-700 px-1.5 py-0.5 rounded mr-1">5</span>
            <span className="text-sm font-semibold">Initialized</span>
            <p className="text-xs text-muted-foreground mt-1">initialize 응답 수신</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-violet-200 dark:bg-violet-700 px-1.5 py-0.5 rounded mr-1">6</span>
            <span className="text-sm font-semibold">CapabilityListing</span>
            <p className="text-xs text-muted-foreground mt-1">tools/list, resources/list 조회 중</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-emerald-200 dark:bg-emerald-700 px-1.5 py-0.5 rounded mr-1">7</span>
            <span className="text-sm font-semibold">Ready</span>
            <p className="text-xs text-muted-foreground mt-1">사용 가능 상태</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-amber-200 dark:bg-amber-700 px-1.5 py-0.5 rounded mr-1">8</span>
            <span className="text-sm font-semibold">Degraded</span>
            <p className="text-xs text-muted-foreground mt-1">일부 기능 실패, 계속 작동</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-orange-200 dark:bg-orange-700 px-1.5 py-0.5 rounded mr-1">9</span>
            <span className="text-sm font-semibold">Disconnecting</span>
            <p className="text-xs text-muted-foreground mt-1">연결 종료 중</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded mr-1">10</span>
            <span className="text-sm font-semibold">Disconnected</span>
            <p className="text-xs text-muted-foreground mt-1">연결 종료 완료</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <span className="text-xs font-mono bg-red-200 dark:bg-red-700 px-1.5 py-0.5 rounded mr-1">11</span>
            <span className="text-sm font-semibold">Failed</span>
            <p className="text-xs text-muted-foreground mt-1">복구 불가 오류</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">각 단계 실행 로직</h3>
        <div className="space-y-2 my-4">
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="font-semibold text-sm">Uninitialized → Spawning</p>
            <p className="text-sm text-muted-foreground">즉시 전이 — 시작 트리거</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="font-semibold text-sm">Spawning → Spawned</p>
            <p className="text-sm text-muted-foreground"><code>McpStdioProcess::spawn(&config)</code>로 서브프로세스 생성</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
            <p className="font-semibold text-sm">Spawned → Initializing</p>
            <p className="text-sm text-muted-foreground"><code>initialize</code> 요청 전송 — <code>protocolVersion: "2024-11-05"</code></p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
            <p className="font-semibold text-sm">Initializing → Initialized</p>
            <p className="text-sm text-muted-foreground">응답 대기 (타임아웃 10초) → <code>parse_capabilities(resp)</code>로 서버 능력 파싱</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg p-3">
            <p className="font-semibold text-sm">CapabilityListing → Ready</p>
            <p className="text-sm text-muted-foreground"><code>fetch_tools()</code> + <code>fetch_resources()</code> 조회 — resources 실패 시 빈 기본값</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <p className="font-semibold text-sm">Ready | Degraded</p>
            <p className="text-sm text-muted-foreground">정상 작동 — 도구 호출 가능 상태</p>
          </div>
        </div>
        <p>
          <strong>상태별 진입 동작</strong>: 각 상태 도달 시 자동으로 다음 단계 작업 수행<br />
          initialize는 MCP 프로토콜 필수 첫 메시지 — 서버 능력 협상<br />
          CapabilityListing 실패 시 Degraded — 일부만 작동해도 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Degraded 모드 — 부분 실패 대응</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-amber-700 dark:text-amber-300 mb-2">Degraded 전이 조건</p>
            <p className="text-sm"><code>fetch_resources()</code>에서 <code>resources/list</code> 호출 실패 시 <code>McpState::Degraded</code>로 전이</p>
            <p className="text-xs text-muted-foreground mt-1"><code>log::warn!</code>으로 실패 로그 기록</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-2">Degraded에서도 가능한 것</p>
            <p className="text-sm">성공한 <code>tools/list</code>의 도구는 호출 가능<br />실패한 <code>resources/list</code>는 "지원 안 함" 취급<br />클라이언트는 리소스 기능 없이 계속 작동</p>
          </div>
        </div>
        <p>
          <strong>graceful degradation</strong>: 전체 실패 대신 부분 기능으로 계속<br />
          MCP 서버가 리소스 지원 안 할 수도 있음 — 정상적인 Degraded<br />
          Ready와 Degraded 모두에서 <strong>도구 호출 가능</strong> — 실패한 기능만 비활성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">timeout &amp; 재시도 로직</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">5s</p>
            <p className="text-xs text-muted-foreground">Spawn 타임아웃</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">10s</p>
            <p className="text-xs text-muted-foreground">Init 타임아웃</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-violet-700 dark:text-violet-300">5s</p>
            <p className="text-xs text-muted-foreground">Capability 타임아웃</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-purple-700 dark:text-purple-300">30s</p>
            <p className="text-xs text-muted-foreground">Call 타임아웃</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2">재시도 전략 — <code>advance_with_retry()</code></p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-center">
              <p className="text-sm font-mono font-semibold">1차</p>
              <p className="text-xs text-muted-foreground">500ms 대기 후 재시도</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-center">
              <p className="text-sm font-mono font-semibold">2차</p>
              <p className="text-xs text-muted-foreground">1000ms 대기 후 재시도</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded p-2 text-center">
              <p className="text-sm font-mono font-semibold">3차 실패</p>
              <p className="text-xs text-muted-foreground">Failed 전이</p>
            </div>
          </div>
        </div>
        <p>
          <strong>타임아웃 4개</strong>: Spawn(5s), Init(10s), Capability(5s), Call(30s)<br />
          재시도 3회 — 500ms, 1000ms, 1500ms 지수 백오프<br />
          최종 실패 시 Failed — 자동 복구 없음, 사용자 개입 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">종료 흐름 — shutdown()</h3>
        <div className="space-y-2 my-4">
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="font-semibold text-sm">사전 체크</p>
            <p className="text-sm text-muted-foreground">이미 <code>Disconnected</code>면 즉시 반환 → <code>Disconnecting</code> 상태로 전이</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-blue-200 dark:bg-blue-700 px-1.5 py-0.5 rounded mt-0.5">1</span>
            <div>
              <p className="font-semibold text-sm">진행 중 요청 완료 대기</p>
              <p className="text-sm text-muted-foreground"><code>wait_pending_requests()</code> — 최대 5초 타임아웃</p>
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-indigo-200 dark:bg-indigo-700 px-1.5 py-0.5 rounded mt-0.5">2</span>
            <div>
              <p className="font-semibold text-sm">shutdown 메시지 전송</p>
              <p className="text-sm text-muted-foreground">JSON-RPC <code>"method": "shutdown"</code> — MCP 표준 종료 신호</p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-purple-200 dark:bg-purple-700 px-1.5 py-0.5 rounded mt-0.5">3</span>
            <div>
              <p className="font-semibold text-sm">프로세스 종료</p>
              <p className="text-sm text-muted-foreground"><code>proc.kill()</code> 호출 → 상태 <code>Disconnected</code></p>
            </div>
          </div>
        </div>
        <p>
          <strong>graceful shutdown 3단계</strong>: 요청 완료 대기 → shutdown 메시지 → 프로세스 종료<br />
          5초 대기는 진행 중 요청이 끝날 기회 부여 — 중간에 잘라내면 데이터 손실<br />
          shutdown 메시지는 MCP 표준 — 서버가 리소스 정리 후 종료 기대
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 11단계는 과한가?</p>
          <p>
            단순하게는 Connected/Disconnected 2단계로도 가능<br />
            11단계로 세분화한 이유:
          </p>
          <p className="mt-2">
            1. <strong>오류 격리</strong>: 어느 단계에서 실패했는지 명확 (Spawning vs Initializing)<br />
            2. <strong>부분 기능 지원</strong>: Degraded 상태 존재 — 일부만 작동해도 사용<br />
            3. <strong>디버깅</strong>: 로그에서 "어느 상태에서 멈췄는지" 추적 가능<br />
            4. <strong>UI 피드백</strong>: "연결 중..." "도구 목록 조회 중..." 등 사용자 인지 가능
          </p>
          <p className="mt-2">
            트레이드오프: 상태 머신 복잡도 ↑, 하지만 디버깅·관측성이 이를 상쇄<br />
            MCP 서버 연결 실패는 <strong>흔한 운영 이슈</strong> — 세분화된 상태가 진단에 필수
          </p>
        </div>

      </div>
    </section>
  );
}
