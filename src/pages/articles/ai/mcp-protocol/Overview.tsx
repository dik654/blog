import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import OverviewViz from "./viz/OverviewViz";
import OverviewDetailViz from "./viz/OverviewDetailViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        MCP는 AI 애플리케이션과 외부 기능 사이의 공통 통신 규약이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          AI 애플리케이션이 파일, issue tracker, 사내 database를 사용하려면 먼저
          어떤 기능이 있는지 알아내고, 올바른 인자를 보내며, 결과와 오류를 다시
          model이 이해할 형태로 받아야 합니다. 서비스마다 이 연결 코드를 따로
          만들면 host와 service 조합이 늘어날수록 adapter도 함께 늘어납니다.
          <strong> Model Context Protocol(MCP)</strong>은 이 반복되는 연결 부분을
          JSON-RPC 2.0 기반의 공통 message contract로 맞춥니다.
        </p>
        <p>
          핵심은 “model에 외부 시스템 권한을 주는 규격”이 아니라는 데 있습니다.
          MCP가 표준화하는 것은 기능 발견, 요청과 결과의 형태, progress·cancel
          같은 통신 의미입니다. 반면 어느 server를 신뢰할지, 어떤 tool을 model에
          보여 줄지, 사용자의 확인이 필요한지, 실제 resource 권한이 있는지는
          host와 server가 계속 판단해야 합니다. 이 경계를 놓치면 protocol 호환을
          security 보장으로 잘못 해석하게 됩니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>한 요청이 끝날 때까지 무엇이 일어나는가</h3>
        <p>
          Host는 먼저 server가 제공하는 Tool·Resource·Prompt를 확인한 다음, 현재
          요청과 권한에 필요한 항목만 model context에 넣습니다. Model이 tool
          call을 제안하면 host가 policy와 사용자 동의를 검사하고 client가 MCP
          request를 보냅니다. Server는 schema와 권한을 다시 검사해 domain
          operation을 실행하며, client는 typed result를 받아 model의 다음 판단에
          observation으로 제공합니다. 즉 MCP는 agent loop 전체가 아니라 그
          가운데의 <em>발견과 통신 경계</em>를 맡습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          흔히 “AI 애플리케이션의 USB” 또는 “N×M 통합을 N+M으로 줄이는 규격”이라
          비유하지만, 이는 wire contract를 재사용할 수 있다는 설명입니다. 같은
          tool 이름이라도 domain 의미와 품질은 다를 수 있고, 악의적인 server도
          명세에 맞는 JSON을 보낼 수 있습니다. 따라서 호환성과 신뢰성은 별도로
          검증해야 합니다.
        </p>
        <ContentBoundary article="mcp-protocol" />

        <div id="paper-mcp-2026-spec" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Model Context Protocol 2026-07-28 Specification"
            citeKey={1}
            href="https://modelcontextprotocol.io/specification/2026-07-28"
          >
            현행 명세는 MCP를 host·client·server가 JSON-RPC 2.0 message를
            교환하는 stateless protocol로 정의하고, Tool·Resource·Prompt와
            progress·cancellation·error·extension의 기본 의미를 규정합니다. 이
            글은 2026-07-28 revision을 기준으로 하며 특정 SDK의 구현 완성도나
            server의 안전성을 보장하는 자료로 확대하지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
