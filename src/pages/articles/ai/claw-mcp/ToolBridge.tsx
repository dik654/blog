import ToolBridgeViz from "./viz/ToolBridgeViz";

export default function ToolBridge() {
  return (
    <section id="tool-bridge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        MCP tool을 내부 실행 계약으로 바꾸는 bridge
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          MCP server의 <code>tools/list</code> 결과가 도착했다고 바로 model에
          노출할 수 있는 것은 아닙니다. client는 name, description, input
          schema를 내부 tool 형식으로 변환하고, 충돌 없는 이름과 권한 정책, 실행
          결과의 error semantics를 연결해야 합니다. 이 경계가{" "}
          <code>McpToolRegistry</code>와 executor의 역할입니다.
        </p>
        <p className="leading-7">
          MCP specification은 tool을 model-controlled primitive로 정의하지만 실제 user interaction과 승인 정책을 강제하지는 않습니다.
          외부 server가 tool을 광고했다는 사실은 capability discovery일 뿐 실행 권한이 아닙니다. 최종 호출은 harness의 permission enforcer를
          통과해야 합니다.
        </p>

        <div className="not-prose my-8">
          <ToolBridgeViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          이름에는 출처와 원래 tool을 함께 담는다
        </h3>
        <p className="leading-7">
          여러 server가 <code>search</code>나 <code>read</code>처럼 같은 이름을
          제공할 수 있으므로 내부 registry에는 server namespace를 붙입니다.
          snapshot은 <code>mcp__postgres__query_users</code>처럼 server와 tool을
          함께 표현합니다. model에 보여 주는 이름은 안정적이어야 하며, reconnect
          때 등록 순서가 바뀌어도 같은 tool이 같은 이름을 가져야 prompt cache와
          replay가 흔들리지 않습니다.
        </p>
        <p className="leading-7">
          server name과 tool name에 허용할 문자를 제한하고 정규화 뒤 충돌을 다시
          검사합니다. 단순 문자열 연결만 하면 separator가 원래 이름에 포함되거나
          서로 다른 이름이 같은 정규화 결과로 수렴할 수 있습니다. 내부 index에는
          qualified name에서 실제 server handle과 remote tool name으로 돌아가는
          매핑을 보존합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          schema는 복사하되 신뢰하지 않는다
        </h3>
        <p className="leading-7">
          MCP tool의 <code>inputSchema</code>는 JSON Schema이므로 내부 tool
          spec에 재사용할 수 있습니다. 하지만 malformed schema, 지나치게 큰
          description, 지원하지 않는 keyword가 들어올 수 있어 등록 전에 크기와
          구조를 검증합니다. model provider가 허용하는 schema subset과 다르면
          명시적으로 변환하고 손실된 제약을 기록해야 합니다.
        </p>
        <ul className="leading-7">
          <li>name과 description 길이에 상한을 둡니다.</li>
          <li>top-level object와 required field의 일관성을 검사합니다.</li>
          <li>
            provider가 지원하지 않는 JSON Schema keyword를 변환하거나
            거부합니다.
          </li>
          <li>tool catalog의 안정적인 정렬과 version을 유지합니다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          권한은 server 단위와 호출 단위를 나눠 본다
        </h3>
        <p className="leading-7">
          server를 신뢰 목록에 넣었다고 그 server의 모든 미래 tool을 자동 승인하는 것은 위험합니다. read-only search와 destructive database
          update가 같은 server에 있을 수 있고 reconnect 뒤 tool catalog가 바뀔 수도 있습니다. server identity와 tool annotation,
          argument, 현재 workspace 정책을 함께 평가해 실제 permission을 정합니다.
        </p>
        <p className="leading-7">
          등록 시점에는 기본 위험 등급을 붙이고 호출 시점에는 구체적인 argument로 다시 판정합니다. 승인 UI에는 remote server와 tool 이름, 영향 범위, 전달할 주요
          argument를 보여 줘야 사용자가 무엇을 허용하는지 알 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          실행 결과의 두 종류 오류를 보존한다
        </h3>
        <p className="leading-7">
          executor는 내부 tool call을 MCP <code>tools/call</code> request로
          바꾸고, response의 content와 structuredContent를 내부 결과로
          매핑합니다. tool이 정상적으로 실행됐지만 업무상 실패한 경우의{" "}
          <code>isError</code>와, connection·method·protocol 오류를 구분해야
          model이 자체 수정할 수 있는 실패와 재연결이 필요한 실패를 다르게
          처리할 수 있습니다.
        </p>
        <p className="leading-7">
          server가 끊기면 registry에서 무조건 tool을 즉시 지우기보다 unavailable 상태와 catalog version을 관리합니다. 재연결 후에는 catalog를
          다시 받아 diff를 검증합니다. 사라진 tool을 model이 호출하려 할 때 구조화된 unavailable error를 반환하면 세션 전체를 종료하지 않고 복구할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
