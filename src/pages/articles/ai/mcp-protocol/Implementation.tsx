import ImplementationViz from "./viz/ImplementationViz";
import ImplementationDetailViz from "./viz/ImplementationDetailViz";

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Production MCP server는 schema보다 먼저 effect와 trust boundary를 정한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SDK 예제에서 tool handler를 등록하는 일은 어렵지 않지만, 실제 사고는
          handler 바깥의 경계가 불분명할 때 발생합니다. 먼저 server가 소유할 한
          가지 domain responsibility를 정하고 read·write·destructive operation을
          분리합니다. 그다음 input/output schema, authorization rule, user
          confirmation, timeout·cancel, side-effect receipt와 retry semantics를 하나의
          contract로 만든 뒤 transport adapter를 붙이는 편이 안전합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ImplementationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Discovery와 model proposal은 실행 권한이 아니다</h3>
        <p>
          Tool description, annotation, serverInfo와 model reasoning은 모두 실행을
          제안하거나 설명하는 data입니다. Host는 사용자에게 노출할 tool을 좁히고
          위험한 call에는 confirmation을 받아야 하며, server는 매 request의 token
          issuer·audience·scope와 대상 resource ACL을 다시 확인해야 합니다.
          Credential은 model context나 tool argument에 복사하지 않고 transport의
          authorization channel에 두며, log에도 token·PII·전체 payload 대신 request
          id, operation, policy decision, latency, effect receipt를 남깁니다.
        </p>
        <h3>Timeout 뒤 재시도는 “실행되지 않았다”는 뜻이 아니다</h3>
        <p>
          Client가 response를 받지 못해도 server가 ticket이나 결제를 이미 만들었을
          수 있습니다. Read-only operation은 비교적 쉽게 retry할 수 있지만
          non-idempotent write에는 stable operation id를 받고 결과 receipt를 저장해야
          합니다. Timeout 뒤에는 먼저 같은 id로 완료 여부를 조회하고, server는
          중복 request에 새 effect를 만들지 않고 기존 receipt를 반환해야 합니다.
          Cancel도 같은 이유로 계산 중단과 external effect rollback을 구분합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ImplementationDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Core·extension·legacy 경로를 한데 섞지 않는다</h3>
        <p>
          현행 MCP는 작은 stateless core 위에 필요한 기능만 opt-in extension으로
          협상하는 방향입니다. Tasks 같은 extension을 사용한다면 capability와
          revision을 trace에 기록하고, 지원하지 않는 peer에는 명시적인 fallback을
          둡니다. 반면 Roots·Sampling·Logging과 legacy HTTP+SSE처럼 deprecated된
          기능은 신규 기본 경로로 만들지 않고 compatibility adapter에 격리합니다.
          MCP는 deprecated feature에 최소 12개월의 지원 기간을 두지만, 이는 영구
          지원을 뜻하지 않으므로 제거일·사용량·rollback 조건을 함께 관리해야 합니다.
        </p>
        <h3>구현 순서는 contract test에서 실제 host까지 확장한다</h3>
        <ol>
          <li>
            Protocol revision과 SDK version을 고정하고, 요청별 _meta와
            server/discover 호환 matrix를 만듭니다.
          </li>
          <li>
            Primitive별 schema, protocol error·tool execution error, list cache와
            explicit handle의 contract test를 작성합니다.
          </li>
          <li>
            Read/write permission, confirmation, token audience, tenant isolation과
            idempotency를 integration test로 확인합니다.
          </li>
          <li>
            stdio 또는 Streamable HTTP의 timeout·cancel·MRTR·subscription을 fault
            injection으로 검사합니다.
          </li>
          <li>
            Inspector와 실제 host에서 discovery부터 effect receipt까지 trace를
            재생하고, legacy 사용량이 0이 된 뒤 compatibility 경로를 제거합니다.
          </li>
        </ol>
        <p>
          완료 기준은 tool이 한 번 성공했다는 사실이 아닙니다. 권한 없는 호출,
          malformed body, schema-valid하지만 업무상 잘못된 값, response loss 뒤 retry,
          중간 사용자 거절, expired handle과 deprecated client까지 예상 가능한
          failure path가 모두 관측되고 안전하게 끝나야 production contract가
          완성됩니다.
        </p>
      </div>
    </section>
  );
}
