import JsonRpcViz from "./viz/JsonRpcViz";

export default function Stdio() {
  return (
    <section id="stdio" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        stdio transport: process와 JSON-RPC 경계 지키기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          MCP stdio transport에서는 client가 server를 child process로 시작하고 server는 stdin에서 JSON-RPC message를 읽어
          stdout으로 응답합니다. message는 UTF-8 JSON 한 줄로 구분되며 embedded newline을 포함하지 않습니다. stdout에 일반 log를 출력하면
          protocol stream이 오염되고 전체 연결이 깨질 수 있습니다.
        </p>
        <p className="leading-7">
          Claw Code snapshot의 <code>McpStdioProcess</code>는 process handle,
          stdin writer, stdout reader, pending request map과 background task를
          한 transport 객체에서 관리합니다. 중요한 점은 field 수가 아니라
          request를 쓰는 경로와 response를 읽는 경로를 분리하면서 종료와 오류를
          한곳에서 정리하는 것입니다.
        </p>

        <div className="not-prose my-8">
          <JsonRpcViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          stdout은 protocol, stderr는 diagnostic channel이다
        </h3>
        <p className="leading-7">
          process를 시작할 때 stdin, stdout, stderr를 각각 pipe로 확보합니다. request는 stdin에 쓰고 response와 notification은
          stdout에서 읽으며 diagnostic log는 stderr에서 별도 task로 drain합니다. stderr를 읽지 않으면 child의 pipe buffer가 차
          process가 멈출 수 있으므로 로그를 사용하지 않더라도 소비해야 합니다.
        </p>
        <p className="leading-7">
          command와 environment는 외부 입력이 아니라 신뢰 경계입니다. executable과 argument를 shell string으로 합치지 않고 process API에
          분리해 전달하며 secret은 필요한 server에만 주입합니다. child process의 작업 디렉터리와 상속 file descriptor도 최소화합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          request id로 비동기 응답을 올바른 caller에 돌려준다
        </h3>
        <p className="leading-7">
          동시에 여러 request를 보내면 응답 순서가 호출 순서와 같다는 보장이
          없습니다. client는 고유 id와 대기 중인 caller의 channel을
          <code>pending_requests</code>에 저장하고, reader loop가 응답 id를 읽어
          해당 channel에 전달합니다. id가 없는 message는 response가 아니라
          notification 경로로 보냅니다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`send(method, params):
  id = next_id()
  pending[id] = response_channel
  stdin.write(json_rpc_request(id, method, params) + "\\n")
  await response_channel with timeout

reader_loop:
  message = parse(next_stdout_line)
  if message.id exists: resolve pending[message.id]
  else: dispatch notification`}
        </pre>
        <p className="leading-7">
          pending map에 먼저 등록한 뒤 message를 써야 매우 빠른 응답이 map
          등록보다 먼저 도착하는 race를 막을 수 있습니다. write 실패, timeout,
          process 종료 때는 해당 entry를 반드시 제거하고 caller를 오류로 깨워야
          합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          parse 오류와 protocol 오류를 구분한다
        </h3>
        <p className="leading-7">
          stdout 한 줄이 JSON으로 parse되지 않는다면 server log가 섞였거나
          framing이 깨진 transport 오류일 수 있습니다. 경고만 남기고 계속
          건너뛰면 요청이 timeout 날 때까지 원인을 잃기 때문에 raw line의 안전한
          일부와 server identity를 기록하고 연결을 재시작할지 판단합니다.
        </p>
        <p className="leading-7">
          JSON-RPC error response는 정상적으로 framing된 protocol 결과입니다.
          tool 자체의 실행 실패는 MCP의 <code>CallToolResult.isError</code>로
          모델에 전달될 수 있고, method가 없거나 server가 tool call을 지원하지
          않는 경우는 protocol-level error로 처리합니다. 이 둘을 같은 transport
          failure로 취급하면 불필요하게 server process를 재시작하게 됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          timeout·취소·종료를 한 경로에서 정리한다
        </h3>
        <p className="leading-7">
          request timeout이 발생하면 기다리기를 멈추고 지원되는 revision에서는
          cancellation notification을 보냅니다. reader가 EOF를 만나거나 child가
          종료되면 모든 pending request를 동일한 connection-closed 오류로 완료해
          caller가 계속 대기하지 않게 합니다.
        </p>
        <p className="leading-7">
          정상 종료는 새 request를 막고 stdin을 닫은 뒤 child exit를 기다리는
          순서로 진행합니다. 제한 시간 안에 끝나지 않으면 terminate와 kill로
          escalation하고 reader·stderr task를 join합니다. process만 죽이고
          background task를 남기면 다음 연결의 log와 상태가 섞일 수 있습니다.
        </p>
      </div>
    </section>
  );
}
