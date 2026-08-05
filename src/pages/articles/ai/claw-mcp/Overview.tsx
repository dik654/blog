import McpRuntimeLab from './viz/McpRuntimeLab';

const phases = [
  ['01', 'ConfigLoad', '설정 읽기'],
  ['02', 'ServerRegistration', '서버 등록'],
  ['03', 'SpawnConnect', '프로세스 연결'],
  ['04', 'InitializeHandshake', '초기화 응답'],
  ['05', 'ToolDiscovery', '도구 발견'],
  ['06', 'ResourceDiscovery', '리소스 발견'],
  ['07', 'Ready', '호출 가능'],
  ['08', 'Invocation', '도구 호출'],
  ['09', 'ErrorSurfacing', '오류 기록'],
  ['10', 'Shutdown', '종료 시작'],
  ['11', 'Cleanup', '정리 완료'],
] as const;

const transportRows = [
  ['Stdio', 'command · args · env · timeout', '현재 manager가 실행'],
  ['Sse', 'url · headers · helper · OAuth', '설정과 bootstrap만'],
  ['Http', 'url · headers · helper · OAuth', '설정과 bootstrap만'],
  ['WebSocket', 'url · headers · helper', '설정과 bootstrap만'],
  ['Sdk', 'SDK server name', '설정과 bootstrap만'],
  ['ManagedProxy', 'url · proxy id', '설정과 bootstrap만'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>같은 프로토콜에서 화살표가 두 번 뒤집힌다</h2>
          <p>
            MCP는 모델 자체의 기능이 아니다. 에이전트와 외부 프로그램이 어떤 도구가 있는지 발견하고,
            JSON 입력으로 호출하고, 결과를 돌려받는 계약이다. Claw의 평소 실행에서는
            <code> Claw → 외부 MCP 서버</code>로 요청이 간다. <code>claw mcp serve</code>에서는
            다른 MCP client가 <code>외부 client → Claw</code>로 요청한다.
          </p>
          <p>
            이 두 방향을 먼저 분리해야 <code>McpServerManager</code>와 <code>McpServer</code>를
            같은 객체로 착각하지 않는다. 전자는 외부 서버 프로세스를 관리하는 client 쪽이고,
            후자는 Claw의 기본 도구를 내주는 server 쪽이다. 아래 실험에서 정상 소비, 부분 실패,
            timeout, 역방향 노출을 바꿔 보라.
          </p>
        </div>
        <McpRuntimeLab />
      </section>

      <section id="transport-boundary" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>설정이 아는 transport와 runtime이 실행하는 transport는 다르다</h2>
          <p>
            <code>McpClientTransport</code>에는 여섯 variant가 있다. HTTP와 SSE에는 headers,
            header helper, OAuth descriptor까지 들어간다. 따라서 “Claw 설정은 stdio만 표현한다”는
            설명은 틀렸다. 그러나 <code>McpServerManager::from_servers()</code>는
            <code> McpTransport::Stdio</code>만 managed server map에 넣고 나머지는
            <code> UnsupportedMcpServer</code>로 기록한다.
          </p>
          <p>
            이것은 지원 여부를 두 층으로 나눠 읽어야 한다는 뜻이다. config와 bootstrap은 미래의
            실행기를 위한 연결 정보를 보존한다. 현재 실제 child process, discovery, tool call
            경로는 stdio만 닫혀 있다. remote descriptor가 존재한다는 사실만으로 HTTP 요청이
            전송된다고 결론 내리면 안 된다.
          </p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {transportRows.map(([name, descriptor, runtime]) => (
            <div key={name} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)_10rem] sm:items-center sm:gap-4">
              <code className="text-xs font-bold">{name}</code>
              <span className="break-words text-xs leading-relaxed text-muted-foreground">{descriptor}</span>
              <span className={`text-xs font-semibold ${name === 'Stdio' ? 'text-teal-700 dark:text-teal-300' : 'text-muted-foreground'}`}>{runtime}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="client-runtime" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>발견한 도구는 이름, 스키마, 권한을 얻는다</h2>
          <p>
            CLI startup의 <code>RuntimeMcpState::new()</code>는 manager를 만들고
            <code> discover_tools_best_effort()</code>를 한 번 실행한다. 각 stdio 서버는 필요할 때
            spawn되고 <code>initialize</code>를 통과한 뒤 <code>tools/list</code>의 모든 cursor
            page를 읽는다. raw tool name이 <code>echo</code>라면
            <code> mcp__demo__echo</code> 같은 qualified name을 만들고, manager는 이 이름에서
            다시 server와 raw name을 찾을 수 있도록 route index를 보관한다.
          </p>
          <p>
            발견 결과는 CLI의 <code>RuntimeToolDefinition</code>으로 변환된다. 설명과 input schema는
            MCP tool metadata를 쓰고, schema가 없으면 추가 property를 허용하는 object로 대체한다.
            권한은 annotation으로 계산한다. <code>readOnlyHint=true</code>이고 destructive와
            open-world hint가 모두 거짓일 때만 <code>ReadOnly</code>다. destructive 또는
            open-world면 <code>DangerFullAccess</code>, 그 외는 <code>WorkspaceWrite</code>다.
          </p>
          <p>
            best-effort가 중요한 이유는 서버 하나가 끊겨도 전체 startup을 실패시키지 않기 때문이다.
            정상 서버의 qualified tool은 registry에 남고, 실패 서버와 아직 실행하지 못하는 remote
            transport는 pending 목록과 degraded report로 노출된다. 단, 정상 서버가 하나도 없으면
            “부분 성공”이라 부를 수 없으므로 manager 내부의 <code>degraded_startup</code>은
            만들어지지 않는다.
          </p>
        </div>
      </section>

      <section id="framing-recovery" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>stdio는 줄 단위 채팅이 아니라 길이가 붙은 frame이다</h2>
          <p>
            <code>McpStdioProcess</code>는 child stdin과 stdout을 pipe로 잡는다. JSON body 앞에는
            <code> Content-Length: N\r\n\r\n</code> header를 붙인다. 수신 쪽은 header 이름의
            대소문자를 무시하고 정확히 N byte를 읽은 뒤 JSON으로 역직렬화한다. 그 다음
            <code>jsonrpc == "2.0"</code>과 response id가 request id와 같은지 확인한다.
            이 검사가 없으면 다른 요청의 결과를 현재 도구의 결과로 받아들일 수 있다.
          </p>
          <p>
            현재 <code>request()</code>는 요청 하나를 쓰고 응답 하나를 곧바로 읽는 순차 경로다.
            여러 in-flight request를 id map으로 병렬 조립하는 reader task는 없다. id는 응답
            정합성을 검증하지만, 그 자체가 multiplexing 구현을 뜻하지 않는다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            ['1 · frame', 'JSON byte 길이를 먼저 읽어 message 경계를 확정한다.'],
            ['2 · protocol', 'jsonrpc 2.0인지 확인해 다른 wire 형식을 거부한다.'],
            ['3 · identity', '보낸 id와 받은 id가 같아야 결과를 반환한다.'],
          ].map(([label, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[10px] font-bold text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>재시도는 모든 메서드에 똑같이 적용되지 않는다</h3>
          <p>
            initialize, tool discovery, resource list/read는 transport 오류나 timeout이면 process를
            reset하고 한 번 더 시도할 수 있다. 반면 <code>tools/call</code>은 현재 호출을 자동으로
            재실행하지 않는다. transport·timeout·invalid response면 server state를 reset하고
            오류를 반환한다. 다음 호출이 오면 다시 spawn과 initialize를 거친다.
          </p>
          <p>
            이 차이는 side effect 때문이다. 호출 결과를 못 받았다고 서버가 작업을 실행하지 않았다고
            단정할 수 없다. 같은 tool call을 자동 재전송하면 결제나 삭제 같은 작업을 두 번 수행할 수
            있다. 기본 tool-call timeout은 60초이며 stdio server 설정으로 바꿀 수 있다.
          </p>
        </div>
      </section>

      <section id="lifecycle-contract" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>11단계는 실행 객체가 아니라 검증 가능한 공통 어휘다</h2>
          <p>
            <code>McpLifecycleValidator</code>는 phase를 실행하는 callback을 받지 않는다.
            <code> run_phase()</code>가 하는 일은 현재 phase에서 다음 phase로 갈 수 있는지 확인하고,
            timestamp와 success 또는 failure를 기록하는 것이다. manager 오류는 method 이름에 따라
            handshake, discovery, invocation 같은 phase로 분류되지만, manager가 validator를
            내부 엔진으로 소유하지는 않는다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {phases.map(([index, phase, meaning]) => (
            <div key={phase} className="min-w-0 bg-background px-4 py-3">
              <p className="font-mono text-[9px] font-bold text-muted-foreground">{index}</p>
              <code className="mt-1 block break-words text-xs font-bold">{phase}</code>
              <p className="mt-1 text-xs text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            정상 시작은 ConfigLoad에서 출발한다. ToolDiscovery 뒤 ResourceDiscovery를 거쳐도 되고
            바로 Ready로 가도 된다. Ready와 Invocation은 반복할 수 있다. 대부분의 phase에서
            ErrorSurfacing 또는 Shutdown으로 빠질 수 있지만 Cleanup에서 되돌아갈 수는 없다.
            recoverable failure 뒤에는 ErrorSurfacing에서 Ready로 복귀할 수 있고, non-recoverable
            failure 뒤에는 같은 복귀가 거부된다.
          </p>
        </div>
      </section>

      <section id="server-direction" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>claw mcp serve는 같은 선을 반대 방향으로 연다</h2>
          <p>
            <code>run_mcp_serve()</code>는 <code>mvp_tool_specs()</code>를 MCP tool 목록으로 바꾸고,
            handler에 <code>execute_tool</code>을 연결한다. 새 <code>McpServer</code>는 stdin에서
            Content-Length frame을 읽고 stdout으로 응답한다. protocol version은
            <code> 2025-03-26</code>이다.
          </p>
          <p>
            이 server는 현재 <code>initialize</code>, <code>tools/list</code>,
            <code> tools/call</code> 세 request만 dispatch한다. notification은 id가 없으므로 응답하지
            않고 지나간다. resources, prompts, sampling까지 구현됐다고 넓혀 말할 근거는 없다.
            handler 오류는 JSON-RPC transport error가 아니라 <code>isError: true</code>인 text
            tool result로 감싼다.
          </p>
          <p>
            별도 <code>McpToolRegistry</code>도 존재하지만 이것을 CLI의 직접 dispatch 경로와
            합치면 안 된다. registry는 tools crate의 범용 <code>MCP</code>·resource surface를 위해
            server metadata와 manager를 연결한다. 실제 rusty CLI는
            <code> RuntimeMcpState</code>를 보유하고 qualified runtime tool을 직접 manager로 보낸다.
          </p>
        </div>
      </section>
    </>
  );
}
