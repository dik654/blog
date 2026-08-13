import {
  PermissionFrame,
  PermissionRule,
  PermissionSteps,
} from "./PermissionVizPrimitives";

const binding = [
  ["Actor", "user · session · delegation chain"],
  ["Action", "edit_file + validated patch"],
  ["Resource", "canonical workspace/src/auth.ts"],
  ["Effect", "filesystem write"],
  ["Generation", "tool schema + policy version"],
] as const;

const invalidators = [
  ["Arguments", "Patch나 command가 달라짐"],
  ["Resource", "Workspace·repository·target identity가 달라짐"],
  ["Authority", "Actor·delegation·policy generation이 달라짐"],
  ["Lifetime", "한 번 소비·session 종료·expiry·revoke"],
] as const;

export default function OverrideViz() {
  return (
    <PermissionFrame
      label="SCOPED APPROVAL · LOGIN EDIT"
      title="승인은 ‘이 tool 전체’가 아니라 사용자가 확인한 action digest와 lifetime에 묶입니다"
      description="401 수정용 auth.ts edit를 승인해도 이어지는 login test command는 다른 action이므로 별도 판정을 거칩니다."
      note="UI의 Always를 global allow로 저장하지 않습니다. Persisted 예외라도 repository·tool·resource·effect·owner·expiry·revoke를 가져야 하며, admin deny와 sandbox·OS boundary를 우회하지 못합니다."
    >
      <section className="min-w-0 rounded-lg border border-border/70 bg-background p-4 sm:p-5">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-wide text-primary">
              APPROVAL BINDING
            </p>
            <code className="mt-3 block min-w-0 break-words text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
              digest(actor, action, resource, effect, generation)
            </code>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              Prompt에 보여 준 내용과 executor가 받을 입력이 이 identity에서
              같아야 합니다.
            </p>
          </div>

          <dl className="grid min-w-0 gap-x-5 gap-y-3 sm:grid-cols-2">
            {binding.map(([term, value]) => (
              <div
                key={term}
                className="min-w-0 border-t border-border/70 pt-2"
              >
                <dt className="break-words text-[11px] font-bold text-muted-foreground">
                  {term}
                </dt>
                <dd className="mt-1 min-w-0 break-words text-xs leading-5 text-foreground/80 [overflow-wrap:anywhere]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="my-6 border-t border-border/70" />

      <PermissionSteps
        columns={3}
        items={[
          {
            label: "ONCE",
            title: "Attempt scope",
            body: "동일 call attempt에서 한 번 소비합니다. Timeout retry가 새 attempt라면 자동 재사용하지 않습니다.",
            tone: "blue",
          },
          {
            label: "SESSION",
            title: "Task scope",
            body: "Workspace·tool·resource·effect를 제한하고 session 종료나 delegation 종료 때 폐기합니다.",
            tone: "violet",
          },
          {
            label: "PERSISTED",
            title: "User policy scope",
            body: "Owner·reason·expiry·last used·revoke가 있는 신뢰된 user-level 설정으로만 저장합니다.",
            tone: "amber",
          },
        ]}
      />

      <div className="mt-7 min-w-0">
        <p className="text-[11px] font-bold tracking-wide text-primary">
          INVALIDATE AND RE-EVALUATE
        </p>
        <div className="mt-3 divide-y divide-border/70 border-y border-border/70">
          {invalidators.map(([change, result]) => (
            <div
              key={change}
              className="grid min-w-0 gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4"
            >
              <p className="break-words text-xs font-semibold text-foreground">
                {change}
              </p>
              <p className="break-words text-xs leading-5 text-muted-foreground">
                {result} → 기존 approval 폐기 후 다시 판정
              </p>
            </div>
          ))}
        </div>
      </div>

      <PermissionRule>
        Approval은 Allow 결과를 넓히는 master token이 아닙니다. 같은 tool
        이름이라도 patch·target·effect가 달라지면 action digest가 달라지며,
        login test 역시 새로운 action으로 enforcer를 다시 통과합니다.
      </PermissionRule>
    </PermissionFrame>
  );
}
