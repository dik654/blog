import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Code Mode: tool call의 연속을 한 프로그램으로
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p id="code-mode-definition" className="scroll-mt-24 leading-7">
          여기서 <strong>Code Mode</strong>는 코딩 에이전트의 다른 이름이
          아니다. 모델이 tool을 하나씩 호출하고 매번 결과를 다시 읽는 대신,
          허용된 tool을 API처럼 부르는 짧은 프로그램을 만들고 격리된 실행기가 그
          프로그램을 수행하는 패턴이다.
        </p>
        <ContentBoundary article="agent-code-mode" />

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          구현마다 이름과 표면은 다르다
        </h3>
        <p className="leading-7">
          Cloudflare는 MCP 서버를 typed API처럼 노출하는 방식을 Code Mode라고
          부르고, TanStack AI도 sandbox 안에서 TypeScript로 tool을 조합하는
          기능에 같은 이름을 쓴다. Anthropic은 동일한 문제를 “MCP tool을 code
          execution과 함께 사용하기”로 설명한다. 따라서 Code Mode는 단일 표준
          프로토콜이라기보다{" "}
          <strong>program을 중간 실행 표현으로 쓰는 설계군</strong>에 가깝다.
        </p>
        <div id="paper-anthropic-code-execution" className="scroll-mt-24">
          <CitationBlock source="Anthropic — Code execution with MCP" citeKey={1} href="https://www.anthropic.com/engineering/code-execution-with-mcp">
            Tool result 전체를 매번 model context로 보내지 않고 code execution
            environment에서 MCP call과 data reduction을 수행하는 패턴을 설명한다.
            이는 MCP protocol 자체가 Code Mode를 의무화한다는 뜻은 아니다.
          </CitationBlock>
        </div>
        <div id="paper-cloudflare-code-mode" className="scroll-mt-24">
          <CitationBlock source="Cloudflare — Code Mode for MCP" citeKey={2} href="https://blog.cloudflare.com/code-mode-mcp/">
            MCP server를 sandbox의 typed binding으로 노출하고 model이 program으로
            조합하는 구현을 Code Mode라고 부른다. Cloudflare runtime의 보안·비용
            결과를 모든 sandbox 구현에 그대로 일반화할 수는 없다.
          </CitationBlock>
        </div>
        <div id="paper-tanstack-code-mode" className="scroll-mt-24">
          <CitationBlock source="TanStack AI — Code Mode" citeKey={3} href="https://tanstack.com/ai/latest/docs/code-mode/code-mode">
            TypeScript program으로 typed tools를 조합하는 library interface를
            제공한다. Type safety는 argument/schema 오류를 줄이지만 authorization,
            network isolation과 effect atomicity를 대신하지 않는다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
