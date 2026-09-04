import { CitationBlock } from "@/components/ui/citation";
import EnforcerViz from "./viz/EnforcerViz";

const DISPATCH_TRACE = [
  [
    "read_file · grep_search",
    "Path argument parse",
    "Workspace 안이면 ReadOnly, 바깥으로 분류되면 DangerFullAccess",
    "Source와 401 evidence만 읽음",
  ],
  [
    "edit_file",
    "Target path parse",
    "Workspace 안이면 WorkspaceWrite, escape로 분류되면 DangerFullAccess",
    "허용된 뒤에만 auth.ts를 수정",
  ],
  [
    "bash · test",
    "Command·path heuristic",
    "알려진 read 계열과 workspace path인지에 따라 동적으로 분류",
    "별도 process effect와 test result를 생성",
  ],
] as const;

const SEAMS = [
  [
    "확인된 구현",
    "Built-in dispatch가 typed input을 parse하고 operation별 required mode를 계산한 뒤 optional enforcer를 호출합니다.",
  ],
  [
    "중요한 예외",
    "Enforcer가 주입되지 않으면 검사가 생략됩니다. Active Prompt mode의 일반 check도 interactive caller에 위임하려 Allowed를 반환합니다.",
  ],
  [
    "필요한 hardening",
    "모든 executor path가 같은 판정 receipt를 요구하고, prompt deferral이 실제 승인 없이 실행으로 이어지지 않음을 composition test로 검증해야 합니다.",
  ],
] as const;

const RECEIPT_FIELDS = [
  ["Proposal", "call ID · tool · canonical arguments digest"],
  ["Decision", "mode · matched rule/version · actor · approval scope/expiry"],
  ["Effect", "operation ID · before/after digest · status · executor result"],
  ["Verification", "test command · cwd · exit code · artifact digest"],
] as const;

const TOKEN_FIELDS = [
  ["Scope", "policy · action · optional repository · optional branch"],
  ["Identity", "approving_actor · approved_executor · delegation chain"],
  ["Lifetime", "Pending · Granted · Consumed · Expired · Revoked"],
  ["Replay", "expires_at · max_uses · uses · exact scope/executor validation"],
] as const;

export default function Enforcer() {
  return (
    <section id="enforcer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Enforcer는 판정을 executor 호출 여부로 바꾸지만, 현재 seam의 한계도
        있습니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Policy가 Deny를 계산해도 executor가 그 결과를 확인하지 않으면 아무런 효과가 없습니다. 로그인 사례의 read/search, edit, test는 각각 다른
          arguments와 effect를 가지므로 dispatch는 tool name만 보지 않고 실제 path·command를 먼저 parse해야 합니다. 그 뒤 계산한 required
          mode와 active policy를 비교하고 Denied면 file write나 process 실행 전에 멈춥니다.
        </p>
        <p>
          Pinned <code>GlobalToolRegistry</code>의 built-in 실행 경로는 이
          순서를 따릅니다. 다만 registry의 enforcer는 optional이며,
          plugin·runtime·MCP executor 전체가 똑같은 경로를 거친다고 source가
          증명하지 않습니다. 따라서 “공통 choke point가 이미 완성됐다”가 아니라
          “확인된 dispatch seam과 우회 가능성을 함께 test해야 한다”고 읽어야
          합니다.
        </p>
        <p>
          Registry에 없는 tool name은 unsupported-tool error로 끝나며 executor를 시작하지 않습니다. 등록된 built-in은 사정이 다릅니다.
          enforcer가 주입되지 않으면 permission check를 건너뛸 수 있으므로 “unknown은 막힌다”와 “known tool은 항상 검사된다”를 같은 주장으로 묶으면 안
          됩니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <EnforcerViz />
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {DISPATCH_TRACE.map(([tool, parse, permission, effect]) => (
          <div
            key={tool}
            className="grid min-w-0 gap-2 p-4 lg:grid-cols-[9rem_9rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5"
          >
            <code className="break-words text-xs font-bold text-primary">
              {tool}
            </code>
            <p className="break-words text-sm font-semibold">{parse}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {permission}
            </p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {effect}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Prompt mode의 두 경로를 섞어 설명하면 안 됩니다</h3>
        <p>
          <code>PermissionPolicy.authorize</code>는 prompt가 필요할 때 실제
          prompter가 없으면 Deny합니다. 반면 pinned
          <code>PermissionEnforcer.check</code>와
          <code>check_with_required_mode</code>는 active mode가 Prompt이면
          interactive caller가 처리하도록 <code>Allowed</code>를 반환합니다.
          이것은 승인이 끝났다는 뜻이 아니라{" "}
          <strong>
            caller가 다음 approval 단계를 반드시 소유한다는 deferral
          </strong>
          입니다.
        </p>
        <p>
          그래서 composition test에서는 Prompt mode에서 enforcer가 Allowed를
          반환한 뒤 실제 prompter 없이 executor가 시작되지 않는지 확인해야
          합니다. 이 연결이 없으면 policy는 fail-closed인데 dispatch 조합은
          fail-open이 되는 모순이 생깁니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 md:grid-cols-3">
        {SEAMS.map(([label, body]) => (
          <article
            key={label}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{label}</h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Approval token은 범위·실행자·수명을 가진 예외 record입니다</h3>
        <p>
          Pinned ledger의 <code>ApprovalScope</code>는 policy와 action, 선택적인
          repository와 branch를 묶습니다. Grant는 승인한 actor와 실행할 actor를
          나누고 만료 시각과 최대 사용 횟수를 가질 수 있습니다. 기본 최대 사용
          횟수는 한 번이며, consume할 때 uses가 증가해 한도에 이르면
          <code>Consumed</code>가 됩니다.
        </p>
        <p>
          Verify와 consume은 token 존재, Pending·Consumed·Expired·Revoked 상태,
          현재 시각, exact scope와 exact executor를 검사합니다. 따라서
          <code>edit_file(auth.ts)</code> 승인을 다른 branch나 다른 executor가
          가져다 쓰면 scope mismatch 또는 unauthorized delegate로 실패해야
          합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {TOKEN_FIELDS.map(([field, value]) => (
          <div
            key={field}
            className="grid min-w-0 gap-2 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-sm font-semibold">{field}</p>
            <code className="break-words text-xs leading-6 text-primary">
              {value}
            </code>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Repository 전체 call-site를 확인하면 이 ledger는 runtime module로
          export되고 unit test는 있지만 PermissionPolicy나 tools dispatch에
          연결된 실제 소비 경로는 확인되지 않습니다. 또한 in-memory
          <code>BTreeMap</code>이므로 process restart 뒤에도 token과 revoke가
          유지되는 durable approval service라고 볼 수 없습니다.
        </p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>문자열 분류는 유용하지만 sandbox의 대체물이 아닙니다</h3>
        <p>
          Pinned tools dispatch는 존재하는 path를 canonicalize하고 workspace 밖 symlink나 absolute path를 높은 mode로 분류하려고
          합니다. Bash도 알려진 read 계열 command와 path를 보수적으로 검사합니다. 그러나 shell language 전체를 이해하는 parser는 아니며 source
          스스로 heuristic의 한계를 남깁니다. Missing path, TOCTOU, interpreter, redirect, 새 shell syntax는 계속 negative
          test가 필요합니다.
        </p>
        <p>
          TOCTOU(time-of-check to time-of-use)는 path나 policy를 확인한 뒤 실제 사용 직전에 대상이 바뀌는 문제입니다. 안전한 목표 설계에서는 승인한
          canonical arguments와 policy generation을 digest로 묶고 executor 직전에 다시 검증합니다. File handle 기반 API,
          sandbox, non-root OS identity, egress 제한도 마지막 경계로 남습니다. 이 재검증 protocol은 pinned enforcer의 완성된 기능이 아니라
          hardening 요구사항입니다.
        </p>

        <h3>실행 성공과 승인 소비는 crash에서도 연결돼야 합니다</h3>
        <p>
          Edit가 실제로 적용된 직후 process가 죽으면 tool result는 없지만 effect는 남을 수 있습니다. 재개할 때 approval을 다시 쓰고 edit를 blind
          replay하면 중복 effect가 생깁니다. Stable operation ID, planned operation, before/after digest, status
          lookup을 보존해 둡니다. completed면 기존 effect에 result를 붙이고 failed면 안전 조건을 확인한 뒤 retry하며 unknown이면 사람의 확인이나
          compensation으로 보냅니다. Exactly-once를 주장하기보다 idempotency와 reconciliation을 설계하는 편이 정확합니다.
        </p>
        <p>
          구체적으로는 token과 stable operation ID를 planned operation에 먼저 묶고 실행 직전에는 scope·executor·expiry를 다시 확인합니다.
          Consume을 effect 전에 끝내면 실행 실패 시 승인을 잃고 effect 뒤에만 하면 crash 때 같은 token이 재사용될 수 있습니다. 일반 file write와
          in-memory ledger 사이에는 원자적 transaction이 없으므로 어느 시점을 택하든 status lookup과 reconciliation을 release
          contract에 포함해야 합니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {RECEIPT_FIELDS.map(([stage, fields]) => (
          <div
            key={stage}
            className="grid min-w-0 gap-2 p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-sm font-semibold">{stage}</p>
            <code className="break-words text-xs leading-6 text-primary">
              {fields}
            </code>
          </div>
        ))}
      </div>

      <div
        id="paper-claw-permission-enforcer-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          구현 근거 · Pinned PermissionEnforcer
        </p>
        <CitationBlock
          source="Claw Code pinned permission_enforcer.rs"
          citeKey={4}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permission_enforcer.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> PermissionPolicy 결과와 동적으로 계산한
              required mode를 executor 앞의 Allowed·Denied로 바꿔야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned source는
              EnforcementResult, 일반 check, explicit required-mode check와
              file-write·bash helper를 제공합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> 같은 commit의 PermissionPolicy,
              registry composition과 caller의 Prompt approval 흐름을 함께 읽어야
              합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 snapshot의 allow/deny result,
              helper와 Prompt deferral seam입니다.
            </p>
            <p>
              <strong>비주장:</strong> Enforcer가 모든 path에 필수이고 Prompt가
              자체 승인이며 path·shell·network escape를 완전히 막는다는 뜻은
              아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-claw-tool-dispatch-permission-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          구현 근거 · Pinned tool dispatch
        </p>
        <CitationBlock
          source="Claw Code pinned tools dispatch"
          citeKey={5}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/tools/src/lib.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Model-facing tool name이 아니라 실제
              path·command를 분류해 executor 전에 permission을 확인해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned dispatch는 built-in
              input을 typed value로 parse하고 operation별 required mode를 계산한
              뒤 optional enforcer를 호출합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> 같은 commit의 runtime enforcer가
              어디서 주입되는지, plugin·runtime tool의 별도 execution path를
              함께 확인합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Built-in dispatch의 argument-specific
              permission call path와 unsupported-tool error입니다.
            </p>
            <p>
              <strong>비주장:</strong> Enforcer가 항상 존재하고 모든
              plugin·MCP·custom executor가 이 path를 거치며 heuristic이 모든
              effect를 이해한다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-claw-approval-token-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          구현 근거 · Pinned approval token ledger
        </p>
        <CitationBlock
          source="Claw Code pinned approval_tokens.rs"
          citeKey={6}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/approval_tokens.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Human approval을 넓은 boolean flag가 아니라
              action·resource·actor·executor·expiry·use count가 있는 lifecycle로
              표현해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned source는
              ApprovalScope, typed status와 in-memory ledger의
              insert·verify·consume·revoke, scope/executor/replay 검사를
              제공합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> Commit b71afdd…의 module export와
              call-site를 함께 검색하고 standalone ledger의 behavior만 현재
              사실로 취급합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 snapshot의 token scope, executor
              binding, expiry, maximum-use lifecycle과 typed error입니다.
            </p>
            <p>
              <strong>비주장:</strong> Ledger가 PermissionPolicy·dispatch에 이미
              연결됐거나 restart-safe durable approval, distributed revocation,
              exactly-once consume을 제공한다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
