import {
  PermissionFrame,
  PermissionRule,
  PermissionSteps,
} from "./PermissionVizPrimitives";

const ownership = [
  {
    owner: "MODEL · PROPOSAL",
    action: 'edit_file("src/auth.ts", patch)',
    detail:
      "401 원인을 찾은 뒤 다음 action을 제안하지만 실행 권한은 갖지 않습니다.",
  },
  {
    owner: "HOST · DECISION INPUT",
    action: "actor + canonical path + write effect + policy generation",
    detail:
      "Runtime이 raw arguments를 정규화하고 현재 authority와 mode에서 판정합니다.",
  },
] as const;

const outcomes = [
  ["DENY", "명시적 금지 또는 상위 ceiling", "executor 호출 없음"],
  [
    "PROMPT",
    "구체적인 action에 사용자 의도 필요",
    "같은 action digest만 승인 후보",
  ],
  [
    "ALLOW",
    "모든 적용 규칙과 boundary 통과",
    "enforcer가 실행 직전 identity 재검사",
  ],
  ["UNKNOWN", "effect·path·rule 해석 불가", "민감 경로에서는 fail-closed"],
] as const;

export default function PolicyViz() {
  return (
    <PermissionFrame
      label="POLICY EVALUATION · LOGIN 401"
      title="모델의 edit 제안을 host가 canonical action으로 바꾼 뒤 authority 순서대로 판정합니다"
      description="같은 흐름은 edit receipt 뒤 제안되는 deterministic login test에도 별도로 적용됩니다. 앞 action의 승인이 다음 action을 자동 허용하지 않습니다."
      note="이 도식은 권한 판정 contract를 보여 줍니다. 구체적인 mode 이름·기본값·rule merge 구현은 대상 snapshot에서 따로 확인해야 하며, project config나 hook이 상위 authority의 deny를 넓힐 수 있다고 가정하지 않습니다."
    >
      <div className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-6">
        {ownership.map((item) => (
          <section
            key={item.owner}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <p className="break-words text-[11px] font-bold tracking-wide text-primary">
              {item.owner}
            </p>
            <code className="mt-3 block min-w-0 break-words text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
              {item.action}
            </code>
            <p className="mt-2 min-w-0 break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {item.detail}
            </p>
          </section>
        ))}
      </div>

      <div className="my-6 border-t border-border/70" />

      <PermissionSteps
        items={[
          {
            label: "CEILING",
            title: "Host boundary · admin deny",
            body: "Sandbox·workspace·조직 정책처럼 낮은 source가 넓힐 수 없는 최대 경계를 먼저 보존합니다.",
            tone: "rose",
          },
          {
            label: "MODE",
            title: "Session capability",
            body: "현재 mode가 write와 command 실행을 허용할 수 있는 범위인지 확인합니다.",
            tone: "amber",
          },
          {
            label: "RULES",
            title: "Authority · priority · specificity",
            body: "같은 authority 안에서 actor·resource·effect에 맞는 후보를 결정적으로 결합합니다.",
            tone: "violet",
          },
          {
            label: "DECISION",
            title: "Outcome + reason",
            body: "결과와 matched rule, policy generation을 trace에 남겨 재현 가능한 판정을 만듭니다.",
            tone: "emerald",
          },
        ]}
      />

      <div className="mt-7 divide-y divide-border/70 border-y border-border/70">
        {outcomes.map(([result, condition, effect]) => (
          <div
            key={result}
            className="grid min-w-0 gap-1 py-3 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4"
          >
            <p className="break-words text-xs font-bold text-primary">
              {result}
            </p>
            <p className="break-words text-xs leading-5 text-muted-foreground">
              {condition}
            </p>
            <p className="break-words text-xs font-semibold leading-5 text-foreground/80">
              {effect}
            </p>
          </div>
        ))}
      </div>

      <PermissionRule>
        우선순위 핵심은 <strong>Deny → Prompt → Allow</strong>라는 단순 문자열
        정렬이 아니라 authority ceiling을 먼저 보존하는 데 있습니다. Effect를
        해석하지 못한 action은 안전하다고 추측하지 않고 fail-closed 경로로
        보냅니다.
      </PermissionRule>
    </PermissionFrame>
  );
}
