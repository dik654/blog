import { CitationBlock } from "@/components/ui/citation";
import ArchitectureViz from "./viz/ArchitectureViz";
import ArchitectureDetailViz from "./viz/ArchitectureDetailViz";

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Host가 사용자·model·권한을 소유하고 client는 server별 통신을 맡는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Host</strong>는 사용자가 실제로 쓰는 AI application입니다. 대화
          state와 model, 연결할 server, 사용자 승인 UI와 credential을 관리합니다.
          Host 안의 <strong>client</strong>는 보통 한 server와 protocol message를
          주고받으며, <strong>server</strong>는 filesystem·database·issue tracker처럼
          좁은 domain의 capability를 제공합니다. 연결별 context를 분리하면 한
          server가 다른 server의 결과나 전체 대화를 불필요하게 보지 않도록 만들
          수 있습니다.
        </p>
        <p>
          이 역할 구분은 process topology와 같지 않습니다. Server가 local subprocess일 수도 있고 remote service일 수도 있지만 별도
          process라는 사실만으로 sandbox가 생기지는 않습니다. Local server에는 OS permission과 filesystem isolation이 필요하고 remote
          server에는 TLS·authorization·tenant isolation이 필요합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ArchitectureViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>현재 core에는 initialize session이 없다</h3>
        <p>
          2026-07-28 core는 이전 revision의 <code>initialize</code> handshake와
          protocol-level session을 제거했습니다. 대신 모든 request가 <code>_meta</code>
          에 protocol version, client capability, client information을 포함하므로
          server는 이전 connection state를 조회하지 않고도 요청을 해석할 수
          있습니다. 아래는 구조를 보여 주기 위해 params를 줄인 예이며, 실제
          field 이름은 namespaced key를 사용합니다.
        </p>
        <pre className="whitespace-pre-wrap break-words"><code>{`{
  "jsonrpc": "2.0",
  "id": 17,
  "method": "tools/list",
  "params": {},
  "_meta": {
    "io.modelcontextprotocol/protocolVersion": "2026-07-28",
    "io.modelcontextprotocol/clientCapabilities": {},
    "io.modelcontextprotocol/clientInfo": {
      "name": "example-host", "version": "1.4.0"
    }
  }
}`}</code></pre>
        <p>
          Stateless라는 말은 server가 database나 job state를 갖지 못한다는 뜻이 아닙니다. 장기 job, shopping basket, browser
          context처럼 호출 사이에 상태가 필요하면 creation tool이 opaque handle을 반환하고 후속 tool이 그 handle을 argument로 받습니다.
          Server는 매 호출마다 caller의 권한과 expiry를 다시 확인해야 하며 handle을 가진 것만으로 권한이 생긴다고 보면 안 됩니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ArchitectureDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Server discovery는 호환 정보를 주지만 신원을 증명하지 않는다</h3>
        <p>
          Server는 <code>server/discover</code>를 구현해야 하고 client는 필요할 때 이를
          호출해 지원 protocol version, capability, serverInfo, instructions와 cache
          정보를 확인할 수 있습니다. 다만 client의 discovery 호출은 선택적이며,
          serverInfo는 server가 스스로 적은 metadata입니다. 따라서 호환 version을
          고르는 데는 쓸 수 있어도 TLS identity나 OAuth issuer 검증을 대신할 수는
          없습니다.
        </p>

        <div id="paper-mcp-changelog" className="not-prose scroll-mt-24">
          <CitationBlock
            source="MCP 2026-07-28 Changelog"
            citeKey={2}
            href="https://modelcontextprotocol.io/specification/2026-07-28/changelog"
          >
            Changelog는 session 제거, 요청별 _meta, server/discover, explicit
            application state, MRTR, routing header와 cache hint를 현 revision의
            주요 변경으로 기록합니다. 이전 initialize·session 설명은 legacy
            compatibility 문맥에서만 사용해야 하며, 각 SDK가 어느 revision까지
            구현했는지는 별도로 확인해야 합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
