import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import PluginArchViz from "./viz/PluginArchViz";
import PluginVsMcpViz from "./viz/PluginVsMcpViz";

const ADAPTER_CONTRACT = [
  ["Definition", "qualified name · description · input/output schema"],
  ["Identity", "source kind · plugin/server ID · version · instance · generation"],
  ["Effect", "declared hint와 host가 계산한 filesystem·process·network capability"],
  ["Execution", "deadline · cancellation · credential owner · typed result/error"],
] as const;

const SOURCE_BOUNDARIES = [
  {
    source: "Plugin",
    discovery: "Local manifest와 enable/install registry",
    execution: "Plugin root에서 검증한 command·args를 subprocess로 실행",
    lifecycle: "Install · enable · init · shutdown · manifest validation",
  },
  {
    source: "MCP",
    discovery: "Server initialize 뒤 tools/list와 listChanged notification",
    execution: "Server identity에 묶인 tools/call request/response",
    lifecycle: "Transport · authorization · reconnect · server health",
  },
] as const;

const REGISTRY_SOURCES = [
  ["Built-in", "canonical built-in name", "compiled schema + required permission", "registry built-in branch"],
  ["Plugin", "plugin ID + tool name", "manifest schema + required permission", "plugin executor branch"],
  ["Runtime / MCP", "server-qualified runtime name", "tools/list schema + host-classified permission", "CLI-composed runtime/MCP branch"],
] as const;

export default function PluginTools() {
  return (
    <section id="plugin-tools" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Plugin과 MCP는 같은 tool surface로 보이지만 source lifecycle은 지우면 안 됩니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          로그인 오류를 조사하는 동안 local plugin과 두 MCP server가 모두
          <code>lookup_login_policy</code>라는 tool을 내놓았다고 가정하겠습니다. Model
          context에는 name과 schema가 필요하지만, host는 어느 code·server가
          실행되는지, 어떤 credential과 lifecycle을 쓰는지까지 알아야 합니다.
          단순히 마지막으로 등록된 definition으로 덮어쓰면 config 순서에 따라
          전혀 다른 effect가 실행됩니다.
        </p>
        <p>
          Adapter는 source 차이를 공통 dispatch contract로 번역합니다. 차이를 숨기는 일이 아닙니다. Name·schema·typed result는 통일하되
          source identity와 instance, permission hint, timeout, reconnect owner는 telemetry와 receipt에 남깁니다. 그래야
          장애·보안 판단을 되돌릴 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <PluginArchViz />
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ADAPTER_CONTRACT.map(([title, body]) => (
          <article key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>충돌은 등록 시점에 거부하고 identity를 정규화합니다</h3>
        <p>
          한 registry snapshot 안에서 model-visible name은 하나의 executor만 가리켜야 합니다. Pinned Claw source는 built-in과
          plugin, 여러 plugin, 이어 붙인 runtime tool 사이의 duplicate name을 거부합니다. 여러 MCP server의 같은 local name을 함께
          쓰려면 server identity를 포함한 qualified name을 만들고 사용자에게 보이는 title과 실행 identity를 분리합니다.
        </p>
        <p>
          Source label만 붙이는 것으로 끝나지는 않습니다. Plugin ID와 artifact
          version, MCP server instance와 authorization scope, schema digest를 registry
          entry에 묶어야 합니다. 그렇지 않으면 같은 <code>lookup_login_policy</code> 문자열이
          reload 전후 서로 다른 code와 권한을 가리켜도 trace에서 구분할 수 없습니다.
        </p>
      </div>

      <div className="not-prose my-7 min-w-0 space-y-3">
        {REGISTRY_SOURCES.map(([source, identity, schema, executor]) => (
          <article key={source} className="grid min-w-0 gap-4 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <h3 className="break-words text-sm font-semibold text-primary">{source}</h3>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Canonical identity</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{identity}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Model-facing contract</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{schema}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actual path</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{executor}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Canonical alias가 같은 name으로 정규화됐더라도 source 충돌을
          last-write-wins로 해결하지 않습니다. Registry visibility는 model이 call을
          제안할 수 있다는 뜻일 뿐이고 required permission과 실제 executor health는
          별도 판정입니다. Adapter error는 <code>source_unavailable</code> 같은 stable
          public code와 retryable 여부를 주되, 원 transport cause는 secret을
          redaction한 provenance로 보존합니다.
        </p>

        <h3>N세대 call은 N세대 schema와 executor로 끝냅니다</h3>
        <p>
          Turn 시작 시 모델에 schema N을 보여 줬는데 <code>tools/list_changed</code>나
          plugin reload로 N+1이 나왔다면, 이미 생성된 call을 N+1 validator와
          executor에 그대로 넘겨서는 안 됩니다. 안전한 contract는 call을 N의
          name·schema digest·source instance에 pin하고, 그 instance가 남아 있으면
          N으로 완료하며, 불가능하면 <code>stale_registry_generation</code>으로
          취소한 뒤 N+1 definition을 넣어 model에 다시 요청하는 것입니다.
        </p>
        <p>
          Pinned Claw source가 이러한 generation-pinned call envelope를 완성했다고 주장하지 않습니다. reload 중 schema drift와
          stale executor handle을 찾기 위한 hardening/evaluation requirement입니다. In-flight N call의 deadline까지 old
          instance를 drain할지 즉시 reject할지는 사전에 정합니다. stale rejection·re-discovery·재계획은 audit receipt에 남깁니다. N+1
          registry가 unhealthy하면 이전 registry snapshot과 executor instance로 atomic rollback할 수 있어야 합니다. release
          fixture에서는 N세대 call이 N+1 schema로 조용히 reinterpret되지 않는지 확인합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <PluginVsMcpViz />
      </div>

      <div className="not-prose my-7 min-w-0 space-y-3">
        {SOURCE_BOUNDARIES.map((item) => (
          <article key={item.source} className="grid min-w-0 gap-4 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <h3 className="break-words text-sm font-semibold text-primary">{item.source}</h3>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Discovery</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.discovery}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Execution</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.execution}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lifecycle owner</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.lifecycle}</p>
            </div>
          </article>
        ))}
      </div>

      <div
        id="paper-mcp-tools"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · MCP Tools specification</p>
        <CitationBlock
          source="Model Context Protocol — Tools, 2026-07-28"
          citeKey={3}
          href="https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Remote server가 tool을 발견·호출·변경 알림·결과로 제공할 때 client와 server가 공유할 protocol contract가 필요합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Spec은 tools capability, tools/list·tools/call·listChanged, name·input/output schema·annotations·result 구조와 여러 server를 합칠 때의 name collision 경계를 정의합니다.</p>
            <p><strong>전제·조건:</strong> Protocol version 2026-07-28과 negotiated capability를 기준으로 하며 server별 name uniqueness와 client가 여러 server를 합친 뒤의 uniqueness는 별개입니다.</p>
            <p><strong>근거 범위:</strong> MCP adapter의 discovery/call lifecycle, schema 변화와 source-qualified name, annotation을 untrusted hint로 취급하는 일반 경계를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> MCP server annotation이 실제 effect를 보장하거나, spec이 Claw의 plugin architecture·permission precedence·generation pinning을 구현하고 모든 call에 사람 승인을 강제한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-claw-plugin-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Claw Code plugin source snapshot</p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned plugins/src/lib.rs"
          citeKey={5}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/plugins/src/lib.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Local plugin manifest의 tool definition, command path와 required permission이 어떤 검증을 거쳐 executable tool로 바뀌는지 확인해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Pinned file은 plugin/tool manifest, duplicate·empty field·schema-object·permission label·command path validation, resolved PluginTool과 registry lifecycle을 공개합니다.</p>
            <p><strong>전제·조건:</strong> 지정 commit의 local plugin implementation이며 manifest declaration·path 존재 검사가 command 무해성과 sandbox 안전성을 보장하지는 않습니다.</p>
            <p><strong>근거 범위:</strong> 이 절의 project-specific plugin discovery/validation/executor identity와 MCP와 다른 lifecycle을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> Plugin manifest가 trustworthy하거나 MCP와 동일한 transport·credential·restart semantics를 가지며, schema generation pin·receipt envelope가 모두 구현됐다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release는 같은 login fixture의 paired evidence로 결정합니다</h3>
        <p>
          Base와 candidate의 full commit SHA를 고정합니다. 그리고 registry definition과 schema digest, plugin artifact,
          MCP config, workspace, user request, permission mode, fixture, normalizer를 전부 같게 둡니다. 그런 다음 built-
          in/plugin/MCP name collision과 N→N+1 schema drift, deny, timeout, partial write, login test failure를
          각각 주입해 trace·typed result·workspace effect·session exit를 비교합니다.
        </p>
        <p>
          Candidate가 collision을 조용히 덮거나 deny 뒤 effect를 만들고 ambiguous timeout을 success로 기록하거나 test failure를 완료로
          보고하면 즉시 rollback 대상입니다. Canary는 사전 등록한 latency와 context size, error rate, effect invariant
          threshold를 모두 만족해야 합니다. 실패하면 이전 binary와 registry/schema, plugin/MCP config, fixture 묶음으로 되돌립니다. 이
          paired test는 선택한 call contract의 회귀를 찾을 뿐 project의 실서비스 적합성을 보장하지 않습니다.
        </p>
        <p>
          Plugin 설치·활성화와 local artifact trust는 <Link to="/ai/claw-plugin">Plugin
          시스템</Link>에서, MCP transport·authorization·reconnect는
          <Link to="/ai/claw-mcp"> MCP lifecycle</Link>에서 이어서 확인할 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
