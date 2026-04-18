import ParityHarnessViz from './viz/ParityHarnessViz';
import SseFlowViz from './viz/SseFlowViz';
import ParityPipelineViz from './viz/ParityPipelineViz';

export default function ParityHarness() {
  return (
    <section id="parity-harness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Mock 패리티 하네스 — 결정론적 검증 인프라</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ParityHarnessViz />

        {/* ── 하네스 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">mock-anthropic-service 크레이트</h3>
        <p>
          <code>mock-anthropic-service</code>는 Anthropic Messages API를 완벽히 모사하는 로컬 HTTP 서버<br />
          포트 바인딩: 기본값 <code>localhost:3070</code> — 환경 변수 <code>ANTHROPIC_BASE_URL</code>로 리다이렉션<br />
          핵심 가치: <strong>API 키 없이 전체 에이전트 루프를 재현</strong> — CI 환경에서 네트워크 격리 상태로 테스트 가능
        </p>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-2 border-b border-border">
            <span className="text-sm font-semibold">mock-anthropic-service/main.rs</span>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-medium">1</span>
              <span><code className="text-xs bg-muted px-1 py-0.5 rounded">TcpListener::bind("127.0.0.1:3070")</code> 로컬 서버 바인딩</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-medium">2</span>
              <span><code className="text-xs bg-muted px-1 py-0.5 rounded">parse_scenario_from_headers()</code> 요청의 <code className="text-xs bg-muted px-1 py-0.5 rounded">X-Mock-Scenario</code> 헤더에서 시나리오 선택</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-medium">3</span>
              <span><code className="text-xs bg-muted px-1 py-0.5 rounded">serve_scenario(stream, scenario)</code> 해당 시나리오의 SSE 스트림 재생</span>
            </div>
          </div>
        </div>
        <p>
          클라이언트가 <code>X-Mock-Scenario: streaming-text</code> 헤더를 보내면 서버가 해당 시나리오의
          SSE 스트림을 재생<br />
          시나리오 미지정 시 기본값 <code>streaming-text</code> 사용<br />
          요청-응답이 1:1 결정론 — 동일 시나리오는 항상 동일 바이트 시퀀스 반환
        </p>

        {/* ── 12개 시나리오 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">12개 시나리오 상세</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-violet-50 dark:bg-violet-950/30 px-4 py-2 border-b border-border">
            <span className="text-sm font-semibold">enum Scenario</span>
            <span className="text-xs text-muted-foreground ml-2">scenarios.rs — 12개 시나리오</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">1</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">StreamingText</code> <span className="text-muted-foreground">— 순수 텍스트 스트리밍 (제어군)</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">2</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">ReadFileRoundtrip</code> <span className="text-muted-foreground">— tool_use → tool_result 왕복</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">3</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">BashPermissionPrompt</code> <span className="text-muted-foreground">— bash 호출 → Prompt → 재시도</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">4</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">MultiToolParallel</code> <span className="text-muted-foreground">— 병렬 3개 도구 호출</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">5</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">McpToolCall</code> <span className="text-muted-foreground">— MCP 브릿지 경유</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">6</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">SessionCompact</code> <span className="text-muted-foreground">— 토큰 초과 → 압축 트리거</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">7</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">HookPreExec</code> <span className="text-muted-foreground">— pre-exec 훅 차단</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">8</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">SubAgentSpawn</code> <span className="text-muted-foreground">— 서브에이전트 생성</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">9</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">ErrorRecovery</code> <span className="text-muted-foreground">— API 429 → 재시도 → 성공</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">10</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">TokenLimitExceeded</code> <span className="text-muted-foreground">— 토큰 한계 초과</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">11</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">ToolResultTruncation</code> <span className="text-muted-foreground">— 결과 절단 (&gt;8K)</span></div>
            </div>
            <div className="bg-background p-2.5 text-xs flex items-start gap-2">
              <span className="shrink-0 w-5 text-muted-foreground text-right">12</span>
              <div><code className="bg-muted px-1 py-0.5 rounded">ConversationFork</code> <span className="text-muted-foreground">— 대화 분기 & 되감기</span></div>
            </div>
          </div>
        </div>
        <p>
          <strong>시나리오 선정 기준</strong>: 에이전트 루프의 모든 주요 경로를 망라<br />
          1. 정상 흐름 — #1, #2, #4<br />
          2. 보안 경로 — #3(권한), #7(훅)<br />
          3. 확장 경로 — #5(MCP), #8(서브에이전트)<br />
          4. 예외 경로 — #6(압축), #9(재시도), #10(한계), #11(절단), #12(포크)
        </p>

        {/* ── SSE 프레임 구조 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">SSE 프레임 구조 — content_block_* 이벤트</h3>

        <SseFlowViz />
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 border-b border-border">
            <span className="text-sm font-semibold">SSE 프레임 순서 — 단순 텍스트</span>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-2 text-xs">
              <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <code className="bg-muted px-1 py-0.5 rounded font-medium">message_start</code>
              <span className="text-muted-foreground">메시지 ID + role:assistant 초기화</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-xs">
              <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <code className="bg-muted px-1 py-0.5 rounded font-medium">content_block_start</code>
              <span className="text-muted-foreground">type:text 블록 시작 (빈 텍스트)</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-xs bg-emerald-50/50 dark:bg-emerald-950/10">
              <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <code className="bg-muted px-1 py-0.5 rounded font-medium">content_block_delta</code>
              <span className="text-muted-foreground">text_delta: "..." (N회 반복, 토큰 단위 청크)</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-xs">
              <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <code className="bg-muted px-1 py-0.5 rounded font-medium">content_block_stop</code>
              <span className="text-muted-foreground">블록 종료</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-xs">
              <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">5</span>
              <code className="bg-muted px-1 py-0.5 rounded font-medium">message_delta</code>
              <span className="text-muted-foreground">stop_reason:end_turn + output_tokens 집계</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-xs">
              <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">6</span>
              <code className="bg-muted px-1 py-0.5 rounded font-medium">message_stop</code>
              <span className="text-muted-foreground">스트림 종료</span>
            </div>
          </div>
        </div>
        <p>
          <strong>프레임 6단계</strong>: message_start → content_block_start → (delta × N) →
          content_block_stop → message_delta → message_stop<br />
          각 프레임은 <code>event:</code> 이름과 <code>data:</code> JSON 페이로드로 구성<br />
          <code>content_block_delta</code>가 실제 텍스트를 청크 단위로 전달 — 토큰 단위 스트리밍 구현
        </p>

        {/* ── tool_use SSE ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">tool_use SSE 프레임 — JSON 델타 스트리밍</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 border-b border-border">
            <span className="text-sm font-semibold">tool_use SSE 프레임 — JSON 델타 스트리밍</span>
          </div>
          <div className="divide-y divide-border">
            <div className="px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <code className="bg-muted px-1 py-0.5 rounded font-medium">content_block_start</code>
                <span className="text-amber-600 dark:text-amber-400 font-medium">type: tool_use</span>
              </div>
              <span className="text-muted-foreground">도구 이름(<code className="bg-muted px-1 py-0.5 rounded">read_file</code>)과 ID 전달, input은 빈 객체</span>
            </div>
            <div className="px-4 py-2.5 text-xs bg-amber-50/50 dark:bg-amber-950/10">
              <div className="flex items-center gap-2 mb-1">
                <code className="bg-muted px-1 py-0.5 rounded font-medium">content_block_delta</code>
                <span className="text-amber-600 dark:text-amber-400 font-medium">input_json_delta</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>partial_json 조각:</span>
                <code className="bg-muted px-1 py-0.5 rounded">{`{"path"`}</code>
                <span>+</span>
                <code className="bg-muted px-1 py-0.5 rounded">{`:"/tmp/x"}`}</code>
                <span>→ 누적 결과:</span>
                <code className="bg-muted px-1 py-0.5 rounded">{`{"path":"/tmp/x"}`}</code>
              </div>
            </div>
            <div className="px-4 py-2.5 text-xs">
              <code className="bg-muted px-1 py-0.5 rounded font-medium">content_block_stop</code>
              <span className="text-muted-foreground ml-2">입력 JSON 완성, 도구 실행 트리거</span>
            </div>
          </div>
        </div>
        <p>
          <code>input_json_delta</code>는 도구 입력 JSON을 부분 문자열로 스트리밍<br />
          클라이언트는 이 조각들을 이어붙여 완전한 JSON으로 파싱 — 중간 스트리밍 중에는 파싱 불가<br />
          <code>partial_json</code> 누적값: <code>{`{"path":"/tmp/x"}`}</code> (두 델타 병합 결과)
        </p>
        <p>
          <strong>설계 의도</strong>: 사용자에게 "LLM이 도구 호출 중"이라는 진행 상황을 실시간 표시하기 위함<br />
          UI는 <code>content_block_start</code>에서 도구 아이콘 표시, <code>content_block_stop</code>에서
          입력 완성 표시
        </p>

        {/* ── 패리티 검증 흐름 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">Rust ↔ Python 패리티 검증 파이프라인</h3>
        <ParityPipelineViz />
        <p>
          <strong>검증 주기</strong>: 매 PR마다 12개 시나리오 × (Rust, Python) 조합 실행 — 총 24회<br />
          실행 시간: 약 3초 (시나리오당 250ms) — 실제 LLM 호출 대비 수백 배 빠름<br />
          <strong>검증 범위</strong>: Session 전체 상태 — 메시지, 도구 호출, 권한 체크, 토큰 사용량
        </p>

        {/* ── 확장성 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">하네스 확장성</h3>
        <p>
          새로운 에이전트 기능 추가 시 절차:<br />
          1. <code>Scenario</code> enum에 새 variant 추가<br />
          2. <code>scenarios/&lt;name&gt;.sse</code> 파일에 SSE 프레임 시퀀스 작성<br />
          3. Python PortRuntime에 시뮬레이션 로직 추가<br />
          4. Rust runtime에 구현 추가<br />
          5. CI에서 패리티 검증 자동 실행
        </p>
        <p>
          <strong>시나리오 파일 포맷</strong>:
        </p>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="text-sm font-semibold">시나리오 파일 포맷</span>
            <span className="text-xs text-muted-foreground ml-2">scenarios/read_file_roundtrip.sse</span>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-xs text-muted-foreground font-mono w-12">구분자</span>
              <span><code className="text-xs bg-muted px-1 py-0.5 rounded">---</code> 로 프레임 분리 — 읽기 쉬운 텍스트 포맷</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-xs text-muted-foreground font-mono w-12">주석</span>
              <span><code className="text-xs bg-muted px-1 py-0.5 rounded">#</code> 라인은 파서가 무시 — 시나리오 문서화 가능</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-xs text-muted-foreground font-mono w-12">프레임</span>
              <span><code className="text-xs bg-muted px-1 py-0.5 rounded">event:</code> + <code className="text-xs bg-muted px-1 py-0.5 rounded">data:</code> JSON 페이로드 쌍</span>
            </div>
          </div>
        </div>
        <p>
          <code>---</code> 구분자로 프레임 분리 — 읽기 쉬운 텍스트 포맷<br />
          주석 라인(<code>#</code>)은 파서가 무시 — 시나리오 문서화 가능<br />
          신규 시나리오 작성 난이도 낮음 — 기존 프레임 복사 후 수정
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 결정론적 Mock의 3가지 가치</p>
          <p>
            <strong>1. API 비용 절감</strong>:<br />
            실제 LLM 호출은 토큰당 과금 — CI 매 PR마다 12개 시나리오 × 각 수천 토큰 = 누적 비용 상당<br />
            Mock은 비용 0 — 제한 없는 테스트 가능
          </p>
          <p className="mt-2">
            <strong>2. 결정론 보장</strong>:<br />
            실제 LLM은 샘플링으로 비결정론적 응답 — 같은 입력에 다른 결과<br />
            Mock은 항상 동일 바이트 시퀀스 — 회귀 탐지가 정확
          </p>
          <p className="mt-2">
            <strong>3. 오프라인 개발</strong>:<br />
            네트워크 없는 환경(비행기, 격리 VPC)에서도 개발 가능<br />
            API 키 부재 기여자도 즉시 PR 가능
          </p>
        </div>

      </div>
    </section>
  );
}
