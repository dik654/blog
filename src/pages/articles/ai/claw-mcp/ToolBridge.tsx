import ToolBridgeViz from './viz/ToolBridgeViz';

export default function ToolBridge() {
  return (
    <section id="tool-bridge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">McpToolRegistry — 도구 브릿지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ToolBridgeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">MCP 도구 → claw-code 도구 변환</h3>
        <p>
          MCP 서버가 제공하는 도구는 <strong>claw-code의 GlobalToolRegistry에 등록</strong>되어야 LLM이 호출 가능<br />
          McpToolRegistry가 이 브릿지 역할 — MCP 도구 스펙을 claw-code ToolSpec으로 변환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">도구 이름 네임스페이싱</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">MCP 서버 반환 (tools/list)</p>
            <div className="space-y-1 text-sm">
              <p><code>query_users</code> — 설명 + inputSchema</p>
              <p><code>insert_user</code> — 설명 + inputSchema</p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-2">claw-code 등록 이름</p>
            <div className="space-y-1 text-sm font-mono">
              <p><code>mcp__postgres__query_users</code></p>
              <p><code>mcp__postgres__insert_user</code></p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">형식: <code>{'mcp__<server>__<tool>'}</code></p>
          </div>
        </div>
        <p>
          <strong>네임스페이스 필수</strong>: 여러 MCP 서버가 같은 도구 이름 가질 수 있음<br />
          예: <code>search</code> 도구는 postgres·github·filesystem 서버에 모두 존재 가능<br />
          prefix로 충돌 회피 + 도구 출처 명확화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">McpToolRegistry 구조</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">McpToolRegistry</p>
            <p className="text-sm"><code>servers</code>: server_name → <code>McpServerHandle</code></p>
            <p className="text-sm"><code>tool_index</code>: qualified_name → (server_name, tool_name)</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-purple-700 dark:text-purple-300 mb-2">McpServerHandle</p>
            <p className="text-sm"><code>name</code>: 서버 이름</p>
            <p className="text-sm"><code>lifecycle</code>: <code>Arc&lt;Mutex&lt;McpLifecycleValidator&gt;&gt;</code></p>
            <p className="text-sm"><code>tools</code>: <code>Vec&lt;McpToolDef&gt;</code></p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">register_server() — 서버 등록</h3>
        <div className="space-y-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-blue-200 dark:bg-blue-700 px-1.5 py-0.5 rounded mt-0.5">1</span>
            <div>
              <p className="font-semibold text-sm">라이프사이클 시작 (Spawning → Ready)</p>
              <p className="text-sm text-muted-foreground"><code>advance_with_retry()</code> 반복 — Failed 도달 시 에러 반환</p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-emerald-200 dark:bg-emerald-700 px-1.5 py-0.5 rounded mt-0.5">2</span>
            <div>
              <p className="font-semibold text-sm">도구 목록 추출</p>
              <p className="text-sm text-muted-foreground"><code>lifecycle.tools.clone()</code></p>
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-indigo-200 dark:bg-indigo-700 px-1.5 py-0.5 rounded mt-0.5">3</span>
            <div>
              <p className="font-semibold text-sm">각 도구를 GlobalToolRegistry에 등록</p>
              <p className="text-sm text-muted-foreground">이름: <code>mcp__{'{name}'}__{'{tool.name}'}</code>, 실행기: <code>McpToolExecutor</code>, 인덱스에 매핑 추가</p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-purple-200 dark:bg-purple-700 px-1.5 py-0.5 rounded mt-0.5">4</span>
            <div>
              <p className="font-semibold text-sm">서버 핸들 저장</p>
              <p className="text-sm text-muted-foreground"><code>McpServerHandle</code> 생성 → <code>servers</code> 맵에 삽입</p>
            </div>
          </div>
        </div>
        <p>
          <strong>4단계 등록</strong>: 라이프사이클 → 도구 목록 → 개별 등록 → 핸들 저장<br />
          각 MCP 도구는 <strong>claw-code 관점에서는 일반 RuntimeTool</strong> — LLM이 구분 없이 호출<br />
          <code>McpToolExecutor</code>가 실제 호출 시 MCP 프로토콜로 변환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">convert_to_toolspec() — 스키마 변환</h3>
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>name</code></p>
            <p className="text-xs text-muted-foreground"><code>mcp__{'{server}'}__{'{name}'}</code> 형식으로 조합</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>description</code></p>
            <p className="text-xs text-muted-foreground">MCP 도구 설명 그대로 사용</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>input_schema</code></p>
            <p className="text-xs text-muted-foreground">MCP JSON Schema 그대로 재사용</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="font-semibold text-sm"><code>required_permission</code></p>
            <p className="text-xs text-muted-foreground">기본 <code>WorkspaceWrite</code> — <code>trusted_mcp_servers</code>로 조정 가능</p>
          </div>
        </div>
        <p>
          <strong>기본 권한 WorkspaceWrite</strong>: MCP 서버가 어떤 작업을 할지 모르므로 보수적<br />
          신뢰 리스트(<code>trusted_mcp_servers</code>) 등재 시 Prompt 없이 실행<br />
          input_schema는 MCP에서 이미 JSON Schema 형식 — 그대로 재사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">McpToolExecutor — 실행 시 MCP 호출</h3>
        <div className="space-y-2 my-4">
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <p className="font-semibold text-sm">McpToolExecutor 필드</p>
            <p className="text-sm text-muted-foreground"><code>server_name</code>, <code>tool_name</code>, <code>registry: Arc&lt;McpToolRegistry&gt;</code></p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="font-semibold text-sm">상태 검증</p>
            <p className="text-sm text-muted-foreground"><code>Ready</code> 또는 <code>Degraded</code>에서만 호출 허용 — 그 외는 에러 반환</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <p className="font-semibold text-sm">MCP 호출</p>
            <p className="text-sm text-muted-foreground"><code>tools/call</code> 요청: <code>name</code> = tool_name, <code>arguments</code> = input</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <p className="font-semibold text-sm">결과 변환</p>
            <p className="text-sm text-muted-foreground"><code>convert_mcp_result(result)</code> → <code>ToolOutput</code></p>
          </div>
        </div>
        <p>
          <strong>MCP tools/call</strong>: 표준 메서드 — arguments가 도구 입력<br />
          Ready 또는 Degraded 상태에서만 호출 — 그 외는 에러<br />
          응답은 <code>content</code> 필드에 텍스트/이미지/리소스 배열
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">convert_mcp_result() — 응답 변환</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">text</p>
            <p className="text-sm">텍스트 내용 추출 → <code>text_parts</code>에 수집</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-1">image</p>
            <p className="text-sm"><code>[image content]</code> placeholder</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-purple-700 dark:text-purple-300 mb-1">resource</p>
            <p className="text-sm"><code>[resource: uri]</code> placeholder</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-1">최종 처리</p>
          <p className="text-sm text-muted-foreground">content 블록을 <code>\\n</code>으로 합침 → <code>isError: true</code> 시 <code>Err</code>, 아니면 <code>ToolOutput::text(output)</code></p>
        </div>
        <p>
          <strong>3종 content 블록</strong>: text, image, resource<br />
          현재 claw-code는 주로 text만 활용 — image/resource는 placeholder<br />
          <code>isError: true</code> 시 Err로 반환 — LLM이 재시도 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">서버 재연결 — reconnect()</h3>
        <div className="space-y-2 my-4">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-red-200 dark:bg-red-700 px-1.5 py-0.5 rounded mt-0.5">1</span>
            <div>
              <p className="font-semibold text-sm">기존 서버 종료</p>
              <p className="text-sm text-muted-foreground"><code>servers.remove()</code> → <code>lifecycle.shutdown()</code></p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-amber-200 dark:bg-amber-700 px-1.5 py-0.5 rounded mt-0.5">2</span>
            <div>
              <p className="font-semibold text-sm">해당 서버의 모든 도구 등록 해제</p>
              <p className="text-sm text-muted-foreground"><code>tool_index</code>에서 서버명 필터 → <code>unregister_runtime_tool()</code></p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-start gap-3">
            <span className="text-xs font-mono bg-emerald-200 dark:bg-emerald-700 px-1.5 py-0.5 rounded mt-0.5">3</span>
            <div>
              <p className="font-semibold text-sm">설정 다시 로드 후 재등록</p>
              <p className="text-sm text-muted-foreground"><code>load_mcp_config()</code> → <code>register_server()</code></p>
            </div>
          </div>
        </div>
        <p>
          서버 장애 시 <strong>수동 재연결</strong>: 기존 연결 종료 → 도구 해제 → 새로 등록<br />
          자동 재연결은 하지 않음 — 무한 재시도 루프 위험<br />
          사용자가 <code>/mcp reconnect postgres</code> 슬래시 명령으로 호출
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Adapter 패턴의 실용 사례</p>
          <p>
            McpToolRegistry는 전형적인 <strong>Adapter 패턴</strong> 구현:<br />
            - 외부 인터페이스(MCP JSON-RPC) → 내부 인터페이스(ToolExecutor) 변환<br />
            - LLM은 MCP를 모름 — 일반 도구로만 인식<br />
            - MCP 프로토콜 변경 시 Adapter만 수정 — 나머지 코드 영향 없음
          </p>
          <p className="mt-2">
            이 패턴의 가치:<br />
            ✓ <strong>관심사 분리</strong>: MCP 지식이 한 모듈에 집중<br />
            ✓ <strong>테스트 용이</strong>: McpToolExecutor를 Mock으로 교체 가능<br />
            ✓ <strong>다중 프로토콜 지원</strong>: HTTP MCP, gRPC MCP 등 추가 시 Executor만 바꾸면 됨
          </p>
          <p className="mt-2">
            결과: claw-code는 MCP 표준 변경이나 새 프로토콜 등장에 유연하게 대응 가능
          </p>
        </div>

      </div>
    </section>
  );
}
