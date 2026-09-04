import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import PermissionDecisionViz from "./viz/PermissionDecisionViz";

const DECISIONS = [
  ["Allow", "승인된 canonical effect와 attempt만 executor에 전달합니다."],
  ["Deny", "Executor·process·file handle을 만들지 않고 typed denial을 runtime에 반환합니다."],
  ["Ask", "사용자에게 실제 effect를 보여 주고 결정 전까지 call을 suspended 상태로 둡니다."],
] as const;

export default function PermissionGating() {
  return (
    <section id="permission-gating" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Permission은 tool label이 아니라 이번 arguments의 실제 effect를 판정합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          로그인 원인을 찾는 <code>read_file</code>, 인증 code를 바꾸는
          <code>edit_file</code>, 수정 뒤 test를 실행하는 command는 같은 tool
          pipeline을 지나지만 effect가 다릅니다. Registry에 이름이 있다는 사실은
          실행 가능성을 알려 줄 뿐이고, permission layer가 이번 call의 canonical
          path·command·network·credential 영향과 현재 policy를 비교해야 최종
          결정을 내릴 수 있습니다.
        </p>
        <p>
          Mode·rule 우선순위·override 수명은 <Link to="/ai/claw-permissions">Claw
          permission 모델</Link>이 정본으로 소유합니다. 이 절은 그 결과를
          executor 직전에 어떻게 강제하고, deny·ask가 side effect로 새지 않게
          만드는지에 집중합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <PermissionDecisionViz />
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-3">
        {DECISIONS.map(([title, body]) => (
          <article key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Model proposal부터 executor까지 순서를 바꾸지 않습니다</h3>
        <ol>
          <li>Registry snapshot에서 exact tool identity와 schema를 찾습니다.</li>
          <li>Schema와 domain validation을 끝내고 path·command를 canonical form으로 만듭니다.</li>
          <li>Arguments별 effect descriptor와 digest를 만들고 policy에 판정을 요청합니다.</li>
          <li>Allow면 같은 digest의 operation만 실행하고, deny면 executor 이전에 끝냅니다.</li>
          <li>Ask면 canonical effect를 사용자에게 보여 주며 승인 token을 call·attempt·digest에 묶습니다.</li>
          <li>Executor result와 permission decision ID를 receipt에 연결해 runtime에 반환합니다.</li>
        </ol>
        <p>
          승인을 받은 뒤 path나 command, schema generation 또는 arguments가 바뀌면 새로운 operation입니다. 이전 approval을 재사용하지 않고
          validation과 permission을 처음부터 반복합니다. 사용자에게 보여 준 요약과 실제 실행 effect의 digest가 같아야 “보여 준 것과 다른 command
          실행”을 막습니다.
        </p>

        <h3>Deny와 판정 불가는 executor 이전에 끝납니다</h3>
        <p>
          Workspace 밖 edit, 허용되지 않은 command, 누락된 actor나 해석할 수 없는
          effect는 민감한 operation에서 fail-closed해야 합니다. Deny 결과에는
          <code>permission_denied</code>와 reason을 남기되 process를 시작하거나
          file을 잠깐 열었다가 되돌리는 방식은 허용하지 않습니다. 그런 방식은
          rollback 실패와 외부 effect를 남길 수 있기 때문입니다.
        </p>
        <p>
          반대로 permission을 통과한 executor가 test error나 I/O error를 낸 것은 실행 실패입니다. 같은 approval을 다시 물을 문제가 아니라
          retry가 안전한지, partial effect가 있는지 판단할 문제입니다. Decision ID와 execution attempt, before/after digest,
          error category를 분리해 남겨야 model이 permission denial을 command 실패로 오해하고 우회 call을 만들지 않습니다.
        </p>

        <h3>Extension metadata는 힌트이지 보안 판정이 아닙니다</h3>
        <p>
          악성 plugin이나 MCP server가 <code>readOnlyHint=true</code>라고 표시해도
          arguments가 <code>../../.ssh</code>를 읽거나 URL을 통해 데이터를 외부로
          보낼 수 있습니다. Host는 source declaration과 별개로 path traversal,
          symlink resolution, canonical workspace, process, network와 credential
          effect를 검사합니다. 해석할 수 없는 effect는 낮은 risk로 추정하지 않고
          deny 또는 explicit ask로 올립니다.
        </p>
        <p>
          Sandbox는 permission을 대신하지 않습니다. Permission은 “이 요청을 실행해도 되는가”를 판정하고 sandbox·OS policy는 허용된 executor가
          약속한 범위를 넘어가지 못하게 제한합니다. 두 경계를 함께 통과시켜야 잘못된 metadata와 implementation bug가 하나의 방어 실패로 이어지지 않습니다.
        </p>
        <p>
          Negative fixture에는 schema-valid한 <code>read-only</code> plugin call이
          workspace 안 symlink를 따라 밖의 file을 쓰려는 경우와 network endpoint로
          내용을 보내려는 경우를 넣습니다. Expected result는 host의 effect
          reclassification 뒤 <code>permission_denied</code>, executor 호출 0,
          workspace·network effect 0입니다. Audit에는 source·canonical target·decision
          ID를 남기되 credential과 file content는 redaction하고, arguments를 바꾼
          재시도에는 이전 approval을 재사용하지 않습니다.
        </p>
      </div>

      <div
        id="paper-claw-permission-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Claw Code permission enforcer snapshot</p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned permission_enforcer.rs"
          citeKey={4}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permission_enforcer.rs"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Active permission mode, tool requirement와 workspace path가 실제 execution 전에 일관되게 검사되는지 project source에서 확인해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Pinned file은 Allowed·Denied enforcement result, tool별 required mode, file-write workspace boundary, Bash classification과 lexical path normalization을 구현합니다.</p>
            <p><strong>전제·조건:</strong> 지정 commit의 policy·heuristic이며 Prompt 처리도 generic check와 file/Bash helper에서 다르게 defer되므로 caller의 interactive flow를 함께 읽어야 합니다.</p>
            <p><strong>근거 범위:</strong> 이 절의 project-specific deny-before-effect, mode 비교와 lexical workspace check를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 이 heuristic이 symlink·shell grammar·OS capability·network·credential 공격을 모두 차단하거나 generic allow/deny/ask receipt와 digest-bound approval이 이미 완전하게 구현됐다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Shell grammar와 process cancellation은 <Link to="/ai/claw-bash">Bash 실행과
          검증</Link>에서, symlink·container·credential·egress 경계는
          <Link to="/ai/agent-sandbox-security"> agent sandbox security</Link>에서
          이어서 다룹니다.
        </p>
      </div>
    </section>
  );
}
