import {
  PermissionFrame,
  PermissionRule,
  PermissionSteps,
} from "./PermissionVizPrimitives";

const decisions = [
  {
    result: "DENY",
    condition: "상위 policy·mode·host boundary가 차단",
    next: "STOP · executor를 열지 않고 deny evidence 기록",
    tone: "text-rose-700 dark:text-rose-300",
  },
  {
    result: "UNKNOWN",
    condition: "Path·effect·rule 또는 input을 확정할 수 없음",
    next: "FAIL-CLOSED · 민감 action은 effect 전에 종료",
    tone: "text-amber-700 dark:text-amber-300",
  },
  {
    result: "PROMPT",
    condition: "자동 경계는 통과했지만 사용자 의도가 더 필요",
    next: "WAIT · 같은 digest의 allow/deny만 받음",
    tone: "text-violet-700 dark:text-violet-300",
  },
  {
    result: "ALLOW",
    condition: "Action과 authority가 모두 일치",
    next: "CONTINUE · resource identity 재검사 뒤 executor 호출",
    tone: "text-emerald-700 dark:text-emerald-300",
  },
] as const;

export default function EnforcerViz() {
  return (
    <PermissionFrame
      label="ENFORCEMENT CHOKE POINT"
      title="정책 판정과 같은 action identity가 확인돼야 executor 경계가 열립니다"
      description="모델은 auth.ts edit를 제안하고 host는 canonical action을 판정합니다. Deny·Unknown은 파일 effect 전에 끝나며 Prompt·Allow도 실행 직전 identity를 다시 확인합니다."
      note="Policy Allow는 실행을 시도할 수 있다는 host 결정일 뿐 성공 결과가 아닙니다. Filesystem API·sandbox·OS permission은 독립적으로 거부할 수 있고, 그 executor result는 permission decision과 따로 기록합니다."
    >
      <PermissionSteps
        items={[
          {
            label: "PROPOSE · MODEL",
            title: "edit_file(auth.ts)",
            body: "모델은 validated 후보 arguments를 제안할 뿐 executor handle이나 실행 authority를 소유하지 않습니다.",
            tone: "slate",
          },
          {
            label: "BIND · HOST",
            title: "Canonical action digest",
            body: "Actor·session·tool generation·canonical path·patch·write effect를 하나의 identity로 묶습니다.",
            tone: "blue",
          },
          {
            label: "DECIDE · HOST",
            title: "Mode · policy · hook",
            body: "Authority ceiling을 보존하고 적용 rule과 scoped approval을 결합해 outcome과 이유를 만듭니다.",
            tone: "violet",
          },
          {
            label: "RECHECK · EXECUTOR",
            title: "Same input, current resource",
            body: "Approval 뒤 arguments나 symlink·repository head가 바뀌면 decision을 폐기하고 실행하지 않습니다.",
            tone: "emerald",
          },
        ]}
      />

      <div className="mt-7 min-w-0">
        <div className="grid min-w-0 grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] gap-3 border-b border-border/70 pb-2 text-[10px] font-bold tracking-wide text-muted-foreground sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)]">
          <span>OUTCOME</span>
          <span>CONDITION</span>
          <span className="hidden sm:block">EFFECT BOUNDARY</span>
        </div>
        <div className="divide-y divide-border/70">
          {decisions.map((item) => (
            <section
              key={item.result}
              className="grid min-w-0 grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] gap-3 py-3 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-4"
            >
              <p className={`break-words text-xs font-bold ${item.tone}`}>
                {item.result}
              </p>
              <p className="break-words text-xs leading-5 text-muted-foreground">
                {item.condition}
              </p>
              <p className="col-span-2 break-words text-xs font-semibold leading-5 text-foreground/80 sm:col-span-1">
                {item.next}
              </p>
            </section>
          ))}
        </div>
      </div>

      <section className="mt-7 min-w-0 rounded-lg border border-border/70 bg-background p-4">
        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-wide text-primary">
              EFFECT RECEIPT
            </p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              Decision ID와 action digest를 edit attempt, before/after
              identity와 executor result에 연결합니다.
            </p>
          </div>
          <div className="min-w-0 border-t border-border/70 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <p className="text-[11px] font-bold tracking-wide text-primary">
              NEXT ACTION
            </p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              Edit receipt가 생긴 뒤의 deterministic login test는 새 action
              digest로 같은 enforcer를 다시 통과합니다.
            </p>
          </div>
        </div>
      </section>

      <PermissionRule>
        Deny와 Unknown에서도 “실행하지 않았다”는 decision evidence가 남아야
        합니다. 허용된 call만 기록하면 우회 시도, 반복된 policy mismatch와
        fail-closed 동작을 검증할 수 없습니다.
      </PermissionRule>
    </PermissionFrame>
  );
}
