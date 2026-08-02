import { ArrowDown, CircleCheck, CircleHelp, CircleX } from 'lucide-react';

const GROUPS = [
  {
    name: 'deny_rules',
    result: '즉시 Deny',
    text: '가장 먼저 평가한다. hook Allow도 이 결과를 뒤집지 못한다.',
    icon: CircleX,
    color: 'text-rose-700 dark:text-rose-300',
  },
  {
    name: 'ask_rules',
    result: 'Prompt 또는 Deny',
    text: 'prompter가 있으면 사용자에게 묻고, 없으면 fail-closed로 거부한다.',
    icon: CircleHelp,
    color: 'text-amber-700 dark:text-amber-300',
  },
  {
    name: 'allow_rules',
    result: 'Allow 후보',
    text: 'deny와 ask를 통과한 뒤 mode 비교와 함께 허용 근거가 된다.',
    icon: CircleCheck,
    color: 'text-emerald-700 dark:text-emerald-300',
  },
];

export default function PolicyViz() {
  return (
    <figure
      aria-label="deny ask allow 규칙 그룹의 실제 우선순위"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="min-w-0 border-b border-border px-4 py-3">
        <p className="min-w-0 break-words text-sm font-semibold [overflow-wrap:anywhere]">세 규칙 목록은 역할과 우선순위가 다르다</p>
        <p className="mt-1 min-w-0 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
          각 목록 안에서는 첫 matching rule을 찾지만, 전체 정책은 deny → ask → allow 한 줄로 끝나지 않는다.
        </p>
      </figcaption>
      <div className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_28px_1fr_28px_1fr] md:items-stretch">
          {GROUPS.map((group, index) => {
            const Icon = group.icon;
            return (
              <div key={group.name} className="contents">
                <div className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-[13px] font-semibold">{group.name}</code>
                    <Icon className={`h-4 w-4 shrink-0 ${group.color}`} aria-hidden="true" />
                  </div>
                  <p className={`mt-3 text-xs font-semibold ${group.color}`}>{group.result}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{group.text}</p>
                </div>
                {index < GROUPS.length - 1 && (
                  <div className="flex items-center justify-center py-1 text-muted-foreground md:py-0">
                    <ArrowDown className="h-4 w-4 md:-rotate-90" aria-hidden="true" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 rounded-md bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          등록되지 않은 tool의 required mode 기본값은 <code className="text-xs">DangerFullAccess</code>다. 새 도구 누락은 낮은
          권한에서는 mode 부족으로 거부된다. 단, 현재 <code className="text-xs">Prompt</code> mode는 derived order 결함 때문에
          이 요구도 묵시적으로 허용할 수 있다.
        </p>
      </div>
    </figure>
  );
}
