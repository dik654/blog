import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import RegistryLayersViz from "./viz/RegistryLayersViz";

const TRACE_STEPS = [
  ["1 · 제안", "모델이 로그인 401을 조사하려고 read_file이나 grep_search 호출과 JSON 인자를 제안합니다."],
  ["2 · 조회", "Host가 turn 시작 때 고정한 registry snapshot에서 이름, schema, source identity를 찾습니다."],
  ["3 · 구조 검사", "그 snapshot의 JSON Schema로 required field, type, enum과 허용되지 않은 field를 검사합니다."],
  ["4 · 의미·영향 분석", "Path를 정규화하고 read·write·process·network 중 실제로 생길 effect를 arguments에서 계산합니다."],
  ["5 · 권한 판정", "현재 policy가 canonical effect를 allow·deny·ask 중 하나로 판정하며, ask는 승인 전까지 멈춥니다."],
  ["6 · 실행", "허용된 call만 executor와 sandbox 경계로 넘어가 file을 읽거나 수정하고 login test를 실행합니다."],
  ["7 · 결과·반영", "Typed result, artifact reference, effect receipt를 runtime에 돌려주면 session owner가 observation을 commit합니다."],
] as const;

const TOOL_ROLES = [
  ["읽기·탐색", "read_file · glob_search · grep_search", "원인을 찾되 workspace를 바꾸지 않습니다."],
  ["변경", "edit_file · write_file", "Canonical target과 before/after evidence가 필요한 side effect입니다."],
  ["실행·검증", "bash · deterministic login test", "Process와 filesystem effect를 분리해 기록하고 exit code로 완료 조건을 확인합니다."],
  ["확장", "plugin · MCP runtime tool", "서로 다른 lifecycle을 공통 definition으로 노출하되 source identity는 잃지 않습니다."],
] as const;

const LOGIN_TOOL_SPECS = [
  {
    name: "read_file",
    schema: '{path: string} · required: ["path"] · additionalProperties: false',
    hint: "read-only",
    domain: "Canonical path가 허용된 workspace/read scope 안인지 확인",
  },
  {
    name: "grep_search",
    schema: '{pattern: string, path?: string} · required: ["pattern"]',
    hint: "read-only",
    domain: "Pattern budget과 search root, binary/secret 제외 규칙 확인",
  },
  {
    name: "edit_file",
    schema: '{path: string, old_text: string, new_text: string} · 세 field required',
    hint: "workspace-write",
    domain: "Canonical target, before hash와 old_text의 현재 일치 여부 확인",
  },
  {
    name: "bash · login test",
    schema: '{command: string, cwd?: string} · required: ["command"]',
    hint: "arguments에서 재분류",
    domain: "Canonical cwd, command effect와 deterministic test identity 확인",
  },
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Tool call은 모델의 제안을 검증 가능한 host operation으로 바꾸는 과정입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사용자가 “로그인 버튼을 누르면 401이 납니다. 원인을 찾아 최소 수정한 뒤 test해 주세요”라고 요청했다고 가정하겠습니다. 모델은 먼저 인증 설정과 error 처리 코드를
          읽거나 검색하자고 제안할 수 있지만 이 제안이 곧 파일 접근 권한은 아닙니다. Host가 등록된 tool contract와 실제 arguments를 확인하고 권한을 허용한 뒤에야
          executor가 움직입니다.
        </p>
        <p>
          이 글에서 registry는 실행 가능한 tool definition을 이름으로 찾는 색인입니다. schema는 JSON input의 모양을 검사하는 규칙이고 executor는
          허용된 operation을 실제 filesystem이나 process로 옮기는 component입니다. Runtime은 이 셋을 소유하는 대신 반환된 observation을
          session에 반영하고 다음 model call 또는 종료를 결정합니다.
        </p>
      </div>

      <ContentBoundary article="claw-tool-system" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>로그인 오류 한 건을 일곱 경계로 추적합니다</h3>
        <p>
          첫 read부터 마지막 regression test까지 같은 call identity와 registry
          snapshot을 따라가면 “모델이 무엇을 원했는가”와 “host가 실제로 무엇을
          허용하고 실행했는가”를 나눌 수 있습니다. 각 단계가 남기는 artifact도
          다음 단계의 입력이 됩니다.
        </p>
      </div>

      <ol className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {TRACE_STEPS.map(([title, body]) => (
          <li key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 흐름을 재현하려면 같은 call ID로 묶을 것이 많습니다. 원 request와 registry snapshot 또는 digest, schema validation 결과,
          canonical effect, permission decision, 그리고 executor result와 workspace diff, test receipt, session
          exit state까지입니다. Final response만 남기면 denied call이 실제로 실행되지 않았는지, test가 수정 뒤에 실행됐는지 확인할 수 없습니다.
          Artifact에는 stable run ID를 두되 token·credential과 source의 secret은 redaction합니다. 원문은 접근 통제된 저장소의
          digest/reference로 연결합니다.
        </p>

        <h3>Tool 이름은 기능 분류이지 risk 등급이 아닙니다</h3>
        <p>
          <code>bash</code>처럼 같은 이름이라도 <code>git status</code>와 외부로
          데이터를 전송하는 command는 effect가 다르고, <code>read_file</code>도
          workspace 안 source와 credential path를 같은 위험으로 볼 수 없습니다.
          따라서 registry metadata는 후보를 찾는 데 쓰고, 최종 risk는 canonical
          arguments와 실행 환경을 바탕으로 다시 계산합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {TOOL_ROLES.map(([title, examples, boundary]) => (
          <article key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-1 break-words font-mono text-xs text-primary">{examples}</p>
            <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">{boundary}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>최소 ToolSpec은 구조와 permission hint까지만 약속합니다</h3>
        <p>
          아래는 로그인 사례를 설명하기 위한 최소 contract입니다. Name·description,
          input schema와 required permission hint를 model-facing definition으로
          제공하되, schema가 잡는 실패와 domain·authorization이 잡는 실패를
          구분합니다. 예를 들어 숫자 <code>path</code>는 schema error이고,
          존재하지 않는 old text는 domain error이며, workspace 밖의 정상 문자열
          path는 authorization error입니다.
        </p>
      </div>

      <div className="not-prose my-7 min-w-0 space-y-3">
        {LOGIN_TOOL_SPECS.map((item) => (
          <article key={item.name} className="grid min-w-0 gap-4 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[9rem_minmax(0,1.25fr)_minmax(0,.7fr)_minmax(0,1fr)]">
            <h3 className="break-words font-mono text-xs font-semibold text-primary">{item.name}</h3>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Input schema</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.schema}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Permission hint</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.hint}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Domain check</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.domain}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="not-prose my-8 min-w-0">
        <RegistryLayersViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned source와 이 글이 제안하는 hardening을 구분합니다</h3>
        <p>
          이 글이 고정한 Claw Code commit의 <code>GlobalToolRegistry</code>는
          built-in, plugin, runtime tool 이름이 충돌하면 등록을 거부하고, 모델에
          보낼 name·description·input schema definition을 만듭니다. Built-in과
          plugin 실행은 registry 경로에서 분기하며, runtime/MCP tool의 발견과
          실행 state는 CLI composition에서 별도로 연결됩니다. 그러므로 “모든
          source가 완전히 같은 lifecycle로 합쳐졌다”고 말하면 실제 code보다
          넓은 주장입니다.
        </p>
        <p>
          반면 call마다 source identity와 schema digest, registry generation을 고정하는 방식은 reload 중 계약이 바뀌는 문제를 막기 위해 이
          글이 요구하는 hardening contract입니다. Pinned source가 그 풍부한 snapshot envelope를 이미 모두 구현한다고 주장하지 않으며 release
          test에서 gap으로 따로 확인합니다.
        </p>
      </div>

      <div
        id="paper-claw-tool-snapshot"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Claw Code tool registry snapshot</p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned tools/src/lib.rs"
          citeKey={1}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/tools/src/lib.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Built-in, plugin과 runtime source가 tool 이름과 schema를 함께 노출할 때 충돌·dispatch·permission 책임이 어디에 있는지 source로 확인해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Pinned file은 ToolSpec·RuntimeToolDefinition·GlobalToolRegistry, source 간 이름 충돌 거부, definition 합성, allowed-tool normalization과 실행 분기를 공개합니다.</p>
            <p><strong>전제·조건:</strong> Commit b71afddae100ced324457337925a694686b8fef2의 Rust implementation snapshot이며 이름·구조·지원 tool은 이후 바뀔 수 있습니다.</p>
            <p><strong>근거 범위:</strong> 이 절의 project-specific registry composition, name/schema exposure와 충돌 거부 behavior를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 고정된 tool 개수, 모든 source의 동일 lifecycle, schema generation pin·풍부한 receipt·일반 병렬 실행이 이미 구현됐거나 이 공개 project가 실서비스 적합성을 보장한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <nav aria-label="도구 시스템 정본 경계" className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["전체 harness", "/ai/claw-overview", "tool result를 session과 최종 response로 연결하는 owner"],
          ["Permission", "/ai/claw-permissions", "mode·rule·override와 approval의 정본"],
          ["Bash", "/ai/claw-bash", "command parsing·process·cancellation의 세부 경계"],
          ["Plugin", "/ai/claw-plugin", "발견·설치·활성화·health lifecycle"],
          ["MCP", "/ai/claw-mcp", "initialize·tools/list·tools/call·transport lifecycle"],
          ["Sandbox security", "/ai/agent-sandbox-security", "OS·credential·filesystem·egress enforcement"],
        ].map(([label, href, note]) => (
          <Link key={href} to={href} className="min-w-0 rounded-lg border border-border/70 bg-background p-4 hover:border-primary/50">
            <span className="break-words text-sm font-semibold text-foreground">{label}</span>
            <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">{note}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
