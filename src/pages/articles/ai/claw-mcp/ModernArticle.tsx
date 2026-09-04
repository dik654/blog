import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { McpCorrelationViz, McpLifecycleViz } from "./viz/ModernMcpViz";

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-8 text-foreground/90">{children}</p>;
}

export default function ModernMcpArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">MCP를 처음부터</p><h2 className="text-3xl font-bold tracking-tight">MCP는 tool 목록이 아니라 client·server 사이의 discovery와 호출 protocol이다</h2></header>
        <Lead>
          Model Context Protocol(MCP)은 AI application인 client가 외부 server의 tool·resource를 발견하고 호출하기 위한 protocol입니다. Model이 직접 subprocess나 network socket을 다루는 것은 아닙니다. Host가 server config를 읽고 transport를 연결하며, capability를 발견해 model-facing tool로 바꾸고, 실제 호출 결과를 다시 runtime observation으로 변환합니다.
        </Lead>
        <p>
          이 글의 고정 예시는 <code>docs</code>라는 stdio server가 제공하는 <code>search</code> tool입니다. 사용자가 “hook의 종료 코드를 찾아줘”라고 요청하면 Claw는 server를 초기화하고 tool을 발견한 뒤 model에 <code>mcp__docs__search</code>라는 이름으로 노출합니다. Model의 입력 <code>{`{"query":"hook exit code"}`}</code>가 어떤 frame과 request ID를 거쳐 결과로 돌아오는지 따라가겠습니다.
        </p>
        <McpLifecycleViz />
        <ContentBoundary article="claw-mcp" />
      </section>

      <section id="lifecycle" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Bootstrap과 lifecycle</p><h2 className="mt-2 text-2xl font-bold">Config를 읽었다고 server가 Ready인 것은 아니다</h2></header>
        <p>
          Pinned manager는 server name과 transport config에서 bootstrap을 만들고, stdio라면 child process의 stdin·stdout을 pipe로 연결합니다. 이어 <code>initialize</code>가 성공해야 tool·resource discovery를 진행할 수 있습니다. “등록됨”, “process가 살아 있음”, “initialize 완료”, “tool 목록이 현재 instance에서 발견됨”은 서로 다른 상태입니다.
        </p>
        <p>
          별도의 hardened lifecycle module에는 ConfigLoad부터 Cleanup까지 11 phase와 degraded report가 정의되어 있습니다. 하지만 type과 validator가 존재한다는 사실만으로 active manager의 모든 경로가 그 state machine을 통과한다고 단정할 수는 없습니다. 실제 caller·test의 연결을 확인하지 못한 부분은 <strong>integration gap</strong>으로 남겨야 합니다.
        </p>
        <ExplainedFormula
          question="한 번의 docs.search 호출에 허용할 end-to-end deadline은 어떻게 나누는가?"
          idea={<>연결, 초기화, 발견, 호출은 서로 다른 실패 지점이므로 budget도 따로 잡아 합칩니다. 예를 들어 500 ms, 1,000 ms, 1,000 ms, 1,500 ms를 배정하면 전체 상한은 4,000 ms입니다.</>}
          formula={String.raw`\begin{aligned}T_{total}&=T_s+T_i+T_d+T_c\\&=500+1000+1000+1500\\&=4000\ \mathrm{ms}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}T_{total}&=\underbrace{T_s+T_i+T_d+T_c}_{\text{연결 budget 계산}}\\&=\underbrace{500+1000+1000+1500}_{\text{오른쪽 항으로 결과 계산}}\\&=\underbrace{4000\ \mathrm{ms}}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
          operations={[
            { expression: String.raw`T_s+T_i+T_d+T_c`, annotation: ["연결 budget이(가) 식의 결과에 기여하는 방식을","계산합니다.","연결, 초기화, 발견, 호출은 서로 다른 실패 지점이므로","budget도 따로 잡아 합칩니다."] },
            { expression: String.raw`500+1000+1000+1500`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","연결, 초기화, 발견, 호출은 서로 다른 실패 지점이므로","budget도 따로 잡아 합칩니다."] },
            { expression: String.raw`4000\ \mathrm{ms}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","연결, 초기화, 발견, 호출은 서로 다른 실패 지점이므로","budget도 따로 잡아 합칩니다."] },
          ]}
          terms={[
            { symbol: "T_s", name: "연결 budget", description: "Stdio child를 만들고 pipe를 사용할 수 있을 때까지의 시간입니다." },
            { symbol: "T_i", name: "초기화 budget", description: "Protocol initialize request와 response가 끝날 때까지의 시간입니다." },
            { symbol: "T_d", name: "발견 budget", description: "tools/list 등 capability snapshot을 얻는 데 허용한 시간입니다." },
            { symbol: "T_c", name: "호출 budget", description: "선택한 tool request가 terminal result 또는 error에 도달하는 시간입니다." },
          ]}
          assumptions={["네 단계가 한 요청의 critical path에서 순차로 일어납니다.", "Retry가 있으면 별도 attempt budget과 전체 deadline 안에 포함합니다.", "숫자는 운영 예시이며 pinned source의 보편 default라고 주장하지 않습니다."]}
          interpretation="전체 timeout 하나만 두면 어느 phase가 budget을 소진했는지 알 수 없습니다. Phase별 deadline과 server·instance·request identity를 함께 남겨야 degraded 판단과 retry가 안전해집니다."
        />
        <div id="paper-claw-mcp-source"><CitationBlock type="code" source="Claw Code · pinned MCP runtime sources" citeKey={1} href="https://github.com/ultraworkers/claw-code/tree/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src">
          <p><strong>문제:</strong> Server config가 실제 stdio process, discovery registry와 tool call로 어떻게 이어지는지 확인해야 합니다.</p>
          <p><strong>기여:</strong> mcp.rs, mcp_client.rs, mcp_stdio.rs, mcp_tool_bridge.rs와 hardened lifecycle source가 pinned 구현 범위를 보여 줍니다.</p>
          <p><strong>전제와 근거 범위:</strong> commit b71afdd…의 source와 같은 commit test에 한정합니다. 최신 MCP 규격 준수, remote transport 보안, 장기 connection 효율을 인증하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="stdio-jsonrpc" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Transport와 correlation</p><h2 className="mt-2 text-2xl font-bold">Byte frame을 읽는 것과 올바른 response를 받는 것은 다르다</h2></header>
        <p>
          Pinned <code>McpStdioProcess</code>의 JSON-RPC helper는 <code>Content-Length</code> header와 빈 줄 뒤에 지정된 byte 수를 읽는 frame을 사용합니다. 그 안의 JSON을 parse한 다음에도 <code>jsonrpc</code>가 <code>2.0</code>인지, response ID가 보낸 request ID와 같은지 검사합니다. Frame length가 맞아도 ID가 2인데 기다리던 ID가 3이면 그 결과를 <code>docs.search</code>의 답으로 받아들이지 않습니다.
        </p>
        <McpCorrelationViz />
        <aside className="rounded-lg border border-amber-500/35 bg-amber-500/5 p-5 text-sm leading-6">
          <strong>Version 경계:</strong> Pinned Claw의 initialize·JSON-RPC·Content-Length framing은 그 commit의 구현 사실입니다. MCP 공식 문서는 revision에 따라 lifecycle과 standard transport 규칙이 달라졌으므로, “MCP라면 항상 이 framing을 쓴다”고 일반화하면 안 됩니다. Client와 server가 합의한 specification revision과 transport profile을 함께 고정해야 합니다.
        </aside>
        <div id="paper-mcp-transports"><CitationBlock source="Model Context Protocol · official transports" citeKey={2} href="https://modelcontextprotocol.io/specification/2026-07-28/basic/transports">
          <p><strong>문제:</strong> Client와 server가 message를 주고받는 표준 transport와 보안 책임을 정해야 합니다.</p>
          <p><strong>기여:</strong> 해당 revision의 transport 요구 사항과 구현자가 지켜야 할 연결 경계를 규정합니다.</p>
          <p><strong>전제와 근거 범위:</strong> 링크된 2026-07-28 revision에만 적용합니다. Pinned Claw commit이 자동으로 이 revision과 호환되거나 Content-Length helper가 표준이라는 뜻은 아닙니다.</p>
        </CitationBlock></div>
      </section>

      <section id="tool-bridge" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Discovery와 tool bridge</p><h2 className="mt-2 text-2xl font-bold">Server tool을 model tool로 바꿔도 실행 주체와 generation을 잃지 않는다</h2></header>
        <p>
          Claw는 server와 tool 이름을 정규화해 <code>mcp__server__tool</code> 형태의 qualified name을 만듭니다. <code>docs/search</code>는 <code>mcp__docs__search</code>가 됩니다. 이 namespacing은 서로 다른 server의 <code>search</code>가 이름만으로 충돌하는 문제를 줄이지만, normalize 결과 충돌·server reload·schema 변경까지 자동 해결하지는 않습니다.
        </p>
        <p>
          Bridge는 server가 Connected인지, 발견 목록에 tool이 있는지 확인한 다음 manager를 통해 호출합니다. Pinned call path는 별도
          current-thread runtime을 만들고 discovery를 다시 수행한 뒤 tool을 호출하고 manager를 shutdown합니다. registry에 보인 장기 연결과
          실제 call instance가 같은 generation인지, 매 호출의 discovery·shutdown 비용이 어떤지는 측정해 봐야 알 수 있습니다.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[740px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">보존할 값</th><th className="p-3">docs.search 예시</th><th className="p-3">잃었을 때 생기는 문제</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3">Server·instance</td><td className="p-3">docs · process generation 7</td><td className="p-3">reload 뒤 다른 process 결과를 같은 call로 오인</td></tr><tr><td className="p-3">Tool·schema digest</td><td className="p-3">search · schema a91…</td><td className="p-3">model이 본 argument 계약과 executor가 달라짐</td></tr><tr><td className="p-3">Request ID·attempt</td><td className="p-3">id 3 · attempt 1</td><td className="p-3">timeout 뒤 late response와 retry 결과 혼동</td></tr><tr><td className="p-3">Terminal outcome</td><td className="p-3">result·RPC error·timeout·disconnect</td><td className="p-3">부분 실패를 성공 text로 표시</td></tr></tbody></table></div>
        <div id="paper-mcp-tools"><CitationBlock source="Model Context Protocol · official tools" citeKey={3} href="https://modelcontextprotocol.io/specification/2026-07-28/server/tools">
          <p><strong>문제:</strong> Server가 tool capability와 input contract를 공개하고 client가 호출 결과를 해석해야 합니다.</p>
          <p><strong>기여:</strong> 링크된 revision의 discovery·invocation contract와 tool metadata 의미를 제공합니다.</p>
          <p><strong>전제와 근거 범위:</strong> Protocol surface의 근거이며 server command의 안전성, Claw permission integration, schema가 실제 effect를 완전히 기술한다는 보장은 아닙니다.</p>
        </CitationBlock></div>
      </section>

      <section id="degraded-release" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · Degraded와 배포</p><h2 className="mt-2 text-2xl font-bold">Timeout 뒤 retry는 새 request identity와 old response 처리를 함께 설계한다</h2></header>
        <p>
          Timeout, EOF, 잘못된 version·ID, child 종료는 모두 “검색 결과 없음”과 다릅니다. Manager가 connection을 reset하거나 한 번
          retry하더라도 첫 attempt가 실제 server에서 effect를 냈을 가능성을 지울 수는 없습니다. Read-only search와 write tool은 같은 retry
          policy를 사용해서는 안 됩니다. write에는 operation key·status lookup·effect receipt가 필요합니다.
        </p>
        <p>
          역검사의 기초 여섯 문제는 MCP의 host/client/server 역할, lifecycle 여섯 단계, 4,000 ms budget, Content-Length frame과 request ID, qualified tool name, registry와 call instance의 차이를 묻습니다. 심화 네 문제는 version mismatch, timeout·late response, reload generation, write-tool retry를 다룹니다. 위 정의와 docs.search 수치만으로 답할 수 있어야 합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Release gate:</strong> Pinned client·server revision과 schema를 고정하고 정상 initialize/list/call 외에 partial frame, oversized length, wrong JSON-RPC version, mismatched ID, EOF, timeout, late response, process crash, tool rename·schema reload를 주입합니다. Base/candidate의 discovered registry·instance generation·terminal outcome·shutdown receipt를 비교하며 write fixture에서는 duplicate effect가 0이어야 합니다.</aside>
      </section>
    </article>
  );
}
