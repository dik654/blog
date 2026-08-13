import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

const LOGIN_TRACE = [
  [
    "MODEL",
    "1 · 제안",
    "read_file·grep_search로 401 원인을 찾고 edit_file과 test command를 호출하겠다고 제안합니다.",
  ],
  [
    "HOST · HARDENING",
    "2 · Authority ceiling",
    "Workspace·credential·network·process의 최대 권한을 먼저 고정합니다. 내부 mode나 승인으로 이 한도를 넓힐 수 없어야 합니다.",
  ],
  [
    "HOST · PINNED",
    "3 · Mode와 rule",
    "실제 tool name과 input을 required mode·denied tool·deny/ask/allow rule에 대입합니다.",
  ],
  [
    "HUMAN + HOST",
    "4 · 좁은 승인",
    "Edit 또는 test가 추가 확인을 요구하면 action·actor·executor·scope·expiry·사용 횟수를 묶어 승인합니다.",
  ],
  [
    "HOST · PINNED",
    "5 · Executor 앞 검사",
    "Denied면 file handle이나 process를 만들지 않고, Allowed인 호출만 executor에 전달합니다.",
  ],
  [
    "HOST · HARDENING",
    "6 · Receipt와 검증",
    "수정 전후 digest와 test command·cwd·exit code를 남겨 승인한 작업과 실제 effect가 같았는지 확인합니다.",
  ],
] as const;

const OWNERS = [
  [
    "Model이 고르는 것",
    "다음에 시도할 tool, arguments 초안, 원인 가설과 수정 후보",
  ],
  [
    "Host가 결정하는 것",
    "사용 가능한 tool, 최대 authority, policy 판정, 승인 유효성, executor 호출 여부",
  ],
  [
    "OS·sandbox가 제한하는 것",
    "실제로 열 수 있는 file·process·network·credential과 resource limit",
  ],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        권한은 모델의 제안을 실제 effect로 바꾸기 전에 host가 내리는 결정입니다
      </h2>

      <ContentBoundary article="claw-permissions" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          사용자가 “로그인 버튼이 401을 반환하니 원인을 찾아 최소 수정하고
          deterministic test로 확인해 줘”라고 요청했다고 해 보겠습니다. 모델은
          source를 읽고 검색한 뒤 <code>src/auth.ts</code>를 고치고 test를
          실행하자고 제안할 수 있습니다. 그러나 모델의 tool call은
          <strong> 실행 제안</strong>일 뿐, 사용자가 그 file write와 process
          실행을 모두 승인했다는 증거는 아닙니다.
        </p>
        <p>
          Authorization은 “이 주체가 이 resource에 이 action을 해도 되는가”를
          판정하는 일입니다. 인증된 사용자라고 해서 모든 작업이 허용되는 것은
          아니며, 모델이 그럴듯한 이유를 제시했다고 권한이 생기는 것도 아닙니다.
          따라서 model proposal과 host enforcement를 먼저 분리해야 합니다.
          Tool의 schema·dispatch는{" "}
          <a href="/ai/claw-tool-system">도구 시스템</a>, 실제 Bash semantics는{" "}
          <a href="/ai/claw-bash">Bash 경계</a>, OS 격리는
          <a href="/ai/agent-sandbox-security">에이전트 sandbox 보안</a>에서
          이어서 다룹니다.
        </p>
        <p>
          이 글의 구현 설명은 Claw Code의 pinned commit
          <code>b71afdd…</code>에만 해당합니다. 아래 흐름에서
          <strong> PINNED</strong>는 source에서 확인한 동작이고,
          <strong> HARDENING</strong>은 안전한 배포를 위해 추가로 갖춰야 할
          계약입니다. 특히 outer authority ceiling과 durable receipt는 현재
          <code>PermissionPolicy</code>가 완성해 둔 기능이 아닙니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {LOGIN_TRACE.map(([owner, step, detail]) => (
          <div
            key={step}
            className="grid min-w-0 gap-2 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5"
          >
            <div className="min-w-0">
              <p className="break-words text-[0.65rem] font-bold tracking-wide text-muted-foreground">
                {owner}
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-primary">
                {step}
              </p>
            </div>
            <p className="min-w-0 break-words text-sm leading-6 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>가장 바깥 한도를 먼저 정한 뒤 안쪽 판정을 진행합니다</h3>
        <p>
          안전한 순서는{" "}
          <strong>
            authority ceiling → mode → rule → approval lifetime → executor
          </strong>
          입니다. Authority ceiling은 이 process가 애초에 가질 수 있는 최대
          file·network·credential 권한입니다. 예를 들어 로그인 작업에는 현재
          repository 읽기, 승인된 workspace file 수정, 지정한 test만 주고
          production credential과 arbitrary network는 제거할 수 있습니다. 이
          한도는 <code>DangerFullAccess</code>나 사람의 승인으로도 넓어지지
          않아야 합니다.
        </p>
        <p>
          그 안에서 permission mode가 세션의 기본 경계를 정하고, rule은 실제
          tool과 input을 보고 deny·ask·allow를 좁힙니다. 승인이 필요하면 “Bash를
          허용”처럼 넓게 저장하지 않고, 특정 action과 실행자·repository·branch,
          만료와 사용 횟수에 묶습니다. 마지막으로 executor 바로 앞에서 판정을
          소비해야 deny된 edit가 disk에 닿지 않습니다.
        </p>
        <p>
          이 ceiling은 정상 사례만으로 검증할 수 없습니다. Workspace 밖 path와
          symlink, production credential 접근, 임의 network egress, 승인하지
          않은 process 실행을 각각 시도하고, 내부 mode나 유효한 approval이
          있어도 host·sandbox·OS 경계에서 막히는지 negative test로 확인해야
          합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 md:grid-cols-3">
        {OWNERS.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Policy의 Allow와 실제 성공도 구분합니다</h3>
        <p>
          Policy가 Allow를 반환했다는 말은 runtime이 실행을 시도해도 된다는
          뜻입니다. 파일이 read-only이거나 sandbox가 network를 막으면 executor는
          여전히 실패할 수 있습니다. 반대로 Deny가 나왔다면 executor 자체를
          시작하지 않아야 합니다. 그래서 permission decision, effect result,
          deterministic test receipt를 서로 다른 artifact로 연결해야 합니다.
        </p>
      </div>

      <div
        id="paper-openai-tool-guardrails-approval"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          비교 근거 · OpenAI Agents guardrails와 human review
        </p>
        <CitationBlock
          source="OpenAI Developers — Guardrails and human review"
          citeKey={1}
          type="paper"
          href="https://developers.openai.com/api/docs/guides/agents/guardrails-approvals"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 자동 검증과 사람이 승인해야 하는 side
              effect를 같은 model 응답 뒤에서 어떻게 구분할지 정해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> 공식 문서는 input·output·tool
              guardrail과, edit·shell·민감한 MCP action 전에 run을 멈추는 human
              review의 역할을 구분합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> Application이 실제 tool arguments와
              effect를 승인 UI에 전달하고, pause·approve/reject·resume 상태를
              보존해야 합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Tool 주변 자동 검사와 side effect 전
              승인이라는 일반 runtime control 경계를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> OpenAI의 API가 Claw Code의 내부 구현을
              증명하거나, human approval이 sandbox·OS 권한을 대신한다는 뜻은
              아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-owasp-authorization-cheat-sheet"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          보안 기준 · OWASP Authorization Cheat Sheet
        </p>
        <CitationBlock
          source="OWASP Cheat Sheet Series — Authorization"
          citeKey={2}
          type="paper"
          href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 누락된 검사 한 곳이나 unmatched request의
              암묵적 허용이 전체 authorization을 우회할 수 있습니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Least privilege, deny by
              default, every-request validation, 올바른 enforcement 위치와 실패
              시 안전한 종료를 권고합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> Subject·resource·action과 trust
              boundary를 실제 application threat model에 맞춰 정의해야 합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Outer ceiling, fail-closed, executor
              앞 강제와 negative authorization test의 일반 기준입니다.
            </p>
            <p>
              <strong>비주장:</strong> 이 원칙을 인용했다고 pinned Claw build가
              OWASP 준수나 production security review를 통과했다는 뜻은
              아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
