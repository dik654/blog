import OverrideViz from "./viz/OverrideViz";

const OVERRIDES = [
  [
    "Deny",
    "즉시 거부",
    "Hook reason을 denial reason으로 사용합니다. 기존 allow rule이나 mode보다 앞섭니다.",
  ],
  [
    "Ask",
    "Prompt-or-deny",
    "구체적인 PermissionRequest를 만들고 prompter에게 묻습니다. Prompter가 없으면 Deny입니다.",
  ],
  [
    "Allow",
    "조건부 통과",
    "Ask rule을 우회하지 못하고, allow rule 또는 현재 mode가 tool requirement를 만족해야 합니다.",
  ],
] as const;

const RELEASE_CASES = [
  [
    "Rule conflict",
    "denied_tools·deny·ask·allow·override 충돌에서 예상 precedence",
  ],
  [
    "Unknown input",
    "미등록 tool·malformed subject·path escape·symlink·shell ambiguity",
  ],
  [
    "Approval",
    "Pending·expired·revoked·replayed·scope mismatch·wrong executor",
  ],
  [
    "Composition",
    "missing enforcer·Prompt deferral·policy reload·edit 뒤 crash",
  ],
  [
    "Outcome",
    "unauthorized execution 0 · deterministic login test receipt 존재",
  ],
] as const;

export default function ContextOverride() {
  return (
    <section id="context-override" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Context override와 approval token은 같은 것이 아니며 둘 다 상위 Deny를
        지우지 못합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          기존 본문에서 말한 <code>ContextOverride</code>라는 단일 기능은 pinned
          source에 없습니다. 실제로는 두 구조를 구분해야 합니다. 첫째,
          <code>PermissionContext</code>는 hook이나 higher-level orchestration이
          현재 판정에 Deny·Ask·Allow 의견과 이유를 전달하는 임시 context입니다.
          둘째, <code>ApprovalTokenLedger</code>는 policy exception을 action과
          actor·executor·resource·수명에 묶는 별도 in-memory ledger입니다.
        </p>
        <p>
          로그인 수정에서 pre-tool hook이 “이 edit는 허용해도 된다”고 말할 수는
          있지만, 그 말이 host authority를 새로 만들지는 않습니다.
          <code>denied_tools</code>와 deny rule은 context override보다 먼저
          적용되고, Ask rule도 hook Allow로 건너뛰지 않습니다. Hook의 전체
          lifecycle과 신뢰 경계는 <a href="/ai/claw-hooks">Claw hook 시스템</a>
          을 참고하면 됩니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <OverrideViz />
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {OVERRIDES.map(([decision, result, boundary]) => (
          <div
            key={decision}
            className="grid min-w-0 gap-2 p-4 sm:grid-cols-[5rem_9rem_minmax(0,1fr)] sm:gap-5"
          >
            <code className="break-words text-xs font-bold text-primary">
              {decision}
            </code>
            <p className="break-words text-sm font-semibold">{result}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {boundary}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          Standalone ledger와 context override를 자동으로 연결하지 않습니다
        </h3>
        <p>
          앞 절의 approval token ledger는 별도 module이고, 이 context override와
          dispatch에 연결된 소비 경로는 확인되지 않습니다. 따라서 hook Allow를
          token 발급으로 간주하거나, token이 존재한다고 current override가
          생긴다고 설명해서는 안 됩니다.
        </p>
        <p>
          안전한 통합에는 proposal의 canonical arguments, policy generation,
          approval scope와 executor가 같은 action을 가리킨다는 receipt가
          필요합니다. Generation A에서 승인한 edit를 실행 직전 policy B로
          reload했다면 stale decision을 폐기하고 다시 판정해야 합니다. Call ID,
          arguments digest, matched rule/version, actor, expiry/use count와
          effect digest를 연결하는 protocol은 <strong>필요한 hardening</strong>
          이지 pinned 구현 사실이 아닙니다.
        </p>

        <h3>Permission 변경은 같은 로그인 fixture로 paired 평가합니다</h3>
        <p>
          Base와 candidate의 full SHA, request, workspace, model, tool
          registry와 policy fixture를 고정한 뒤 아래 실패를 각각 주입합니다.
          목표는 단순히 “정상 edit가 성공한다”가 아니라, 금지된 effect가 한 번도
          실행되지 않고 허용된 경우에는 최종 deterministic test receipt까지
          이어지는지 확인하는 것입니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {RELEASE_CASES.map(([slice, check]) => (
          <div
            key={slice}
            className="grid min-w-0 gap-2 p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-5"
          >
            <p className="break-words text-sm font-semibold">{slice}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {check}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Canary에서는 unauthorized execution, unexpected prompt, false denial,
          effect/test receipt 누락을 관찰하고, 임계값을 넘으면 이전 pinned
          build와 policy artifact로 rollback합니다. 한 fixture의 성공은
          production 보안 인증이 아니므로 path·shell·network·credential과 실제
          sandbox E2E는 별도 test layer로 남겨야 합니다.
        </p>
      </div>
    </section>
  );
}
