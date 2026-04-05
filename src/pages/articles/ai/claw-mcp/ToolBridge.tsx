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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// MCP 서버가 반환한 tools/list 결과
[
  {"name": "query_users", "description": "...", "inputSchema": {...}},
  {"name": "insert_user", "description": "...", "inputSchema": {...}}
]

// claw-code에서 등록되는 이름
mcp__postgres__query_users
mcp__postgres__insert_user

// 네임스페이스 형식: mcp__<server_name>__<tool_name>`}</pre>
        <p>
          <strong>네임스페이스 필수</strong>: 여러 MCP 서버가 같은 도구 이름 가질 수 있음<br />
          예: <code>search</code> 도구는 postgres·github·filesystem 서버에 모두 존재 가능<br />
          prefix로 충돌 회피 + 도구 출처 명확화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">McpToolRegistry 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct McpToolRegistry {
    // server_name → 서버 핸들
    servers: HashMap<String, Arc<McpServerHandle>>,
    // qualified_name → (server_name, tool_name)
    tool_index: HashMap<String, (String, String)>,
}

pub struct McpServerHandle {
    pub name: String,
    pub lifecycle: Arc<Mutex<McpLifecycleValidator>>,
    pub tools: Vec<McpToolDef>,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">register_server() — 서버 등록</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpToolRegistry {
    pub async fn register_server(&mut self, name: String, config: McpServerConfig) -> Result<()> {
        // 1) 라이프사이클 시작 (Spawning → Ready까지)
        let mut lifecycle = McpLifecycleValidator::new(config);
        while lifecycle.state() != McpState::Ready && lifecycle.state() != McpState::Failed {
            lifecycle.advance_with_retry().await?;
        }

        if lifecycle.state() == McpState::Failed {
            return Err(anyhow!("MCP server {} failed to start", name));
        }

        // 2) 도구 목록 추출
        let tools = lifecycle.tools.clone();

        // 3) 각 도구를 claw-code 레지스트리에 등록
        for tool in &tools {
            let qualified = format!("mcp__{}__{}", name, tool.name);

            // GlobalToolRegistry에 등록
            global_tool_registry().register_runtime_tool(RuntimeToolDefinition {
                name: qualified.clone(),
                spec: convert_to_toolspec(tool),
                executor: Box::new(McpToolExecutor {
                    server_name: name.clone(),
                    tool_name: tool.name.clone(),
                    registry: self.clone_ref(),
                }),
            })?;

            // 인덱스 추가
            self.tool_index.insert(qualified, (name.clone(), tool.name.clone()));
        }

        // 4) 서버 핸들 저장
        self.servers.insert(name, Arc::new(McpServerHandle {
            name: name.clone(),
            lifecycle: Arc::new(Mutex::new(lifecycle)),
            tools,
        }));

        Ok(())
    }
}`}</pre>
        <p>
          <strong>4단계 등록</strong>: 라이프사이클 → 도구 목록 → 개별 등록 → 핸들 저장<br />
          각 MCP 도구는 <strong>claw-code 관점에서는 일반 RuntimeTool</strong> — LLM이 구분 없이 호출<br />
          <code>McpToolExecutor</code>가 실제 호출 시 MCP 프로토콜로 변환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">convert_to_toolspec() — 스키마 변환</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn convert_to_toolspec(mcp_tool: &McpToolDef) -> ToolSpec {
    ToolSpec {
        name: format!("mcp__{}__{}",
            mcp_tool.server, mcp_tool.name).leak(),
        description: mcp_tool.description.clone().leak(),

        // MCP inputSchema를 그대로 사용
        input_schema: mcp_tool.input_schema.clone(),

        // MCP 도구는 기본 WorkspaceWrite 권한 요구
        // (사용자가 trusted_mcp_servers로 ReadOnly 승격 가능)
        required_permission: PermissionMode::WorkspaceWrite,
    }
}`}</pre>
        <p>
          <strong>기본 권한 WorkspaceWrite</strong>: MCP 서버가 어떤 작업을 할지 모르므로 보수적<br />
          신뢰 리스트(<code>trusted_mcp_servers</code>) 등재 시 Prompt 없이 실행<br />
          input_schema는 MCP에서 이미 JSON Schema 형식 — 그대로 재사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">McpToolExecutor — 실행 시 MCP 호출</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct McpToolExecutor {
    server_name: String,
    tool_name: String,
    registry: Arc<McpToolRegistry>,
}

#[async_trait]
impl ToolExecutor for McpToolExecutor {
    async fn execute(&self, input: Value) -> Result<ToolOutput> {
        let server = self.registry.servers.get(&self.server_name)
            .ok_or(anyhow!("server not found"))?;

        let lifecycle = server.lifecycle.lock().await;
        if lifecycle.state() != McpState::Ready
            && lifecycle.state() != McpState::Degraded {
            return Err(anyhow!("MCP server not ready: {:?}", lifecycle.state()));
        }

        // MCP tools/call 요청
        let result = lifecycle.process.as_ref().unwrap().send("tools/call", json!({
            "name": self.tool_name,
            "arguments": input,
        })).await?;

        // MCP 응답 → ToolOutput 변환
        convert_mcp_result(result)
    }
}`}</pre>
        <p>
          <strong>MCP tools/call</strong>: 표준 메서드 — arguments가 도구 입력<br />
          Ready 또는 Degraded 상태에서만 호출 — 그 외는 에러<br />
          응답은 <code>content</code> 필드에 텍스트/이미지/리소스 배열
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">convert_mcp_result() — 응답 변환</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn convert_mcp_result(mcp_result: Value) -> Result<ToolOutput> {
    let content = mcp_result.get("content")
        .and_then(|v| v.as_array())
        .ok_or(anyhow!("invalid MCP result"))?;

    // 여러 content 블록을 하나로 합침
    let mut text_parts = Vec::new();
    for block in content {
        let block_type = block.get("type").and_then(|v| v.as_str()).unwrap_or("");
        match block_type {
            "text" => {
                if let Some(text) = block.get("text").and_then(|v| v.as_str()) {
                    text_parts.push(text.to_string());
                }
            }
            "image" => {
                text_parts.push("[image content]".into());
            }
            "resource" => {
                text_parts.push(format!("[resource: {:?}]",
                    block.get("uri")));
            }
            _ => {}
        }
    }

    // is_error 체크
    let is_error = mcp_result.get("isError")
        .and_then(|v| v.as_bool()).unwrap_or(false);

    let output = text_parts.join("\\n");
    if is_error {
        Err(anyhow!("MCP tool error: {}", output))
    } else {
        Ok(ToolOutput::text(output))
    }
}`}</pre>
        <p>
          <strong>3종 content 블록</strong>: text, image, resource<br />
          현재 claw-code는 주로 text만 활용 — image/resource는 placeholder<br />
          <code>isError: true</code> 시 Err로 반환 — LLM이 재시도 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">서버 재연결 — reconnect()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl McpToolRegistry {
    pub async fn reconnect_server(&mut self, server_name: &str) -> Result<()> {
        // 1) 기존 서버 종료
        if let Some(server) = self.servers.remove(server_name) {
            let mut lifecycle = server.lifecycle.lock().await;
            lifecycle.shutdown().await?;
        }

        // 2) 해당 서버의 모든 도구 등록 해제
        let qualified_names: Vec<_> = self.tool_index.iter()
            .filter(|(_, (s, _))| s == server_name)
            .map(|(k, _)| k.clone()).collect();
        for qn in &qualified_names {
            global_tool_registry().unregister_runtime_tool(qn)?;
            self.tool_index.remove(qn);
        }

        // 3) 설정 다시 로드 후 재등록
        let config = load_mcp_config(server_name)?;
        self.register_server(server_name.into(), config).await?;

        Ok(())
    }
}`}</pre>
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
