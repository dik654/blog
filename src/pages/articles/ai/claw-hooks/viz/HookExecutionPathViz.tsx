import {
  Braces,
  CheckCircle2,
  CircleStop,
  GitBranch,
  Play,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Pre hook chain',
    detail: '원래 tool input을 stdin JSON과 HOOK_* env로 전달한다.',
    note: 'deny · failure · host cancel이면 여기서 종료',
    icon: Braces,
  },
  {
    n: '02',
    title: 'effective input',
    detail: '마지막으로 나온 updatedInput이 실제 permission 입력이 된다.',
    note: '없으면 model이 보낸 원본 input 유지',
    icon: RotateCcw,
  },
  {
    n: '03',
    title: 'Permission policy',
    detail: 'hook override와 static deny·ask, active mode를 함께 판정한다.',
    note: 'hook Allow도 deny·ask·부족한 mode를 우회하지 않음',
    icon: ShieldCheck,
  },
  {
    n: '04',
    title: 'Tool execution',
    detail: 'PermissionOutcome::Allow일 때만 effective input으로 tool을 실행한다.',
    note: '이 시점부터 실제 side effect가 생길 수 있음',
    icon: Play,
  },
] as const;

export default function HookExecutionPathViz() {
  return (
    <figure
      aria-label="Pre hook부터 permission, tool, post hook까지의 실제 실행 순서"
      className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background [&_code]:text-xs"
    >
      <figcaption className="border-b border-border bg-muted/15 px-4 py-3">
        <p className="text-sm font-semibold">한 번의 tool call이 통과하는 실제 순서</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Pre는 permission보다 먼저 input과 request context를 만들고, 성공·실패 post event는 tool 실행 뒤 갈린다.
        </p>
      </figcaption>

      <ol className="divide-y divide-border">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.n}
              className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-4 sm:grid-cols-[36px_28px_150px_minmax(0,1fr)_minmax(160px,0.72fr)] sm:items-start"
            >
              <span className="text-xs font-bold text-muted-foreground">{step.n}</span>
              <Icon className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
              <p className="text-sm font-semibold sm:col-start-3">{step.title}</p>
              <p className="col-start-2 text-xs leading-relaxed text-foreground sm:col-start-4">{step.detail}</p>
              <p className="col-start-2 text-xs leading-relaxed text-muted-foreground sm:col-start-5">{step.note}</p>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        <div className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <p className="text-sm font-semibold">Tool 성공</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <code>PostToolUse</code>
            <span className="text-muted-foreground">→ message 병합</span>
          </div>
        </div>
        <div className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2">
            <CircleStop className="h-4 w-4 text-rose-600" aria-hidden="true" />
            <p className="text-sm font-semibold">Tool 오류</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <code className="break-all">PostToolUseFailure</code>
            <span className="text-muted-foreground">→ error context 전달</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
