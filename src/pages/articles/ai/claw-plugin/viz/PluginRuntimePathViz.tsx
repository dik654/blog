import { ArrowDown, Braces, CircleX, GitMerge, ShieldCheck, TerminalSquare } from 'lucide-react';

const stages = [
  {
    title: 'PreToolUse hooks',
    detail: '취소·실패·deny면 실행 전에 닫고, updated input과 permission override를 다음 단계로 넘긴다.',
    icon: GitMerge,
  },
  {
    title: 'PermissionPolicy',
    detail: 'tool 이름과 입력을 rule, hook context, active mode, required mode로 authorize한다.',
    icon: ShieldCheck,
  },
  {
    title: 'CliToolExecutor',
    detail: 'allowedTools를 다시 확인하고 plugin tool을 GlobalToolRegistry에서 찾는다.',
    icon: Braces,
  },
  {
    title: 'PluginTool::execute',
    detail: '동기 Command를 spawn하고 JSON input을 stdin과 환경 변수에 넣은 뒤 종료까지 기다린다.',
    icon: TerminalSquare,
  },
];

export default function PluginRuntimePathViz() {
  return (
    <figure className="not-prose my-7 rounded-md border border-border bg-muted/[0.12] p-4 sm:p-5" aria-label="플러그인 도구 실행 호출 그래프">
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground">RUNTIME CALL GRAPH</p>
        <p className="mt-1 text-base font-bold">hook이 입력을 조정하고, policy가 승인한 뒤에만 command가 시작된다</p>
      </div>

      <ol className="mx-auto max-w-2xl">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <li key={stage.title}>
              <div className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-3 border-b border-border py-3 last:border-b-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">{stage.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{stage.detail}</p>
                </div>
              </div>
              {index < stages.length - 1 && (
                <ArrowDown className="mx-auto my-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-4">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">EXIT SUCCESS</p>
          <p className="mt-2 text-sm leading-relaxed">stdout을 JSON으로 검증하지 않고 trim한 문자열 그대로 tool result로 반환한다.</p>
        </div>
        <div className="bg-background p-4">
          <p className="flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <CircleX className="h-3.5 w-3.5" aria-hidden="true" />
            EXIT FAILURE
          </p>
          <p className="mt-2 text-sm leading-relaxed">stderr가 있으면 stderr를, 없으면 exit status를 CommandFailed에 넣고 failure hook으로 보낸다.</p>
        </div>
      </div>
    </figure>
  );
}
