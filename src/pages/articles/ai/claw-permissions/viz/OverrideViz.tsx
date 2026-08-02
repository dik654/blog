import { CircleCheck, CircleHelp, CircleX, LockKeyhole } from 'lucide-react';

const OVERRIDES = [
  {
    name: 'Deny',
    result: '즉시 거부',
    text: 'hook reason을 최종 거부 이유로 사용한다.',
    icon: CircleX,
    color: 'text-rose-700 dark:text-rose-300',
  },
  {
    name: 'Ask',
    result: '사용자에게 질문',
    text: 'prompter가 없으면 Deny로 닫힌다.',
    icon: CircleHelp,
    color: 'text-amber-700 dark:text-amber-300',
  },
  {
    name: 'Allow',
    result: '조건부 허용',
    text: 'ask rule이 있으면 여전히 prompt하며 deny rule은 이미 먼저 적용됐다.',
    icon: CircleCheck,
    color: 'text-emerald-700 dark:text-emerald-300',
  },
];

export default function OverrideViz() {
  return (
    <figure
      aria-label="요청 단위 PermissionOverride의 세 decision과 우선순위"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="border-b border-border px-4 py-3">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">현재 override는 lifetime stack이 아니라 요청 context다</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Once·Session·Persistent scope는 현재 타입에 없다. decision과 reason만 한 authorization 요청에 전달한다.
            </p>
          </div>
        </div>
      </figcaption>
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {OVERRIDES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <code className="text-[13px] font-semibold">{item.name}</code>
                <Icon className={`h-4 w-4 shrink-0 ${item.color}`} aria-hidden="true" />
              </div>
              <p className={`mt-3 text-xs font-semibold ${item.color}`}>{item.result}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </div>
      <p className="border-t border-border bg-muted/20 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        이 순서는 <code className="text-xs">PermissionPolicy::authorize_with_context()</code>에만
        적용된다. 얇은 enforcer의 <code className="text-xs">check()</code>는 Prompt mode에서 policy
        호출 전에 Allowed handoff 신호를 반환하며 context를 받지 않는다.
      </p>
    </figure>
  );
}
