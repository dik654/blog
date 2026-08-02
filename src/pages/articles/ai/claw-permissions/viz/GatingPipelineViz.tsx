import { CircleCheck, CircleHelp, CircleX, ShieldCheck } from 'lucide-react';

const STAGES = [
  ['01', 'Deny rule', '같은 tool·subject에 맞는 deny가 있으면 즉시 거부한다.'],
  ['02', 'Hook context', 'Deny·Ask·Allow guidance를 보되 기존 deny를 뒤집지는 못한다.'],
  ['03', 'Ask rule', '명시적 ask가 있으면 prompter로 넘긴다.'],
  ['04', 'Allow / mode', 'allow rule, Allow mode, derived active ≥ required를 먼저 평가한다. Prompt도 여기서 허용될 수 있다.'],
  ['05', 'Escalation', '앞 비교를 통과하지 못한 Prompt 또는 workspace→full 격상만 사용자에게 묻는다.'],
  ['06', 'Final deny', '어느 허용 조건에도 들지 않으면 이유와 함께 거부한다.'],
];

const FINAL_OUTCOMES = [
  { label: 'Allow', text: '실행 경로로 이동', icon: CircleCheck, color: 'text-emerald-700 dark:text-emerald-300' },
  { label: 'Deny', text: '이유와 함께 종료', icon: CircleX, color: 'text-rose-700 dark:text-rose-300' },
];

export default function GatingPipelineViz() {
  return (
    <figure
      aria-label="PermissionPolicy가 deny부터 final deny까지 판정하는 순서"
      className="not-prose my-7 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="min-w-0 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
          <div className="min-w-0 break-words [overflow-wrap:anywhere]">
            <p className="min-w-0 break-words text-sm font-semibold [overflow-wrap:anywhere]">PermissionPolicy::authorize_with_context 경로</p>
            <p className="mt-1 min-w-0 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
              deny·ask·allow가 서로 다른 목록이다. direct file/bash helper에는 이 전체 순서가 적용되지 않는다.
            </p>
          </div>
        </div>
      </figcaption>
      <div className="divide-y divide-border">
        {STAGES.map(([number, title, text]) => (
          <div
            key={number}
            className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-3 gap-y-1 px-4 py-3 sm:grid-cols-[34px_120px_minmax(0,1fr)] sm:items-center"
          >
            <span className="text-xs font-bold text-muted-foreground">{number}</span>
            <code className="text-[13px] font-semibold">{title}</code>
            <p className="col-start-2 text-xs leading-relaxed text-muted-foreground sm:col-start-auto">{text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-border bg-amber-500/[0.04] px-4 py-3">
        <CircleHelp className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold">Ask는 중간 신호</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            prompter가 사람의 결정을 받아 최종 Allow 또는 Deny로 닫는다. prompter가 없으면 Deny다.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-rose-700 dark:text-rose-300">
            단, 현재 Prompt mode의 일반 requirement는 04의 derived 비교에서 먼저 Allow될 수 있다.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border-t border-border bg-border">
        {FINAL_OUTCOMES.map((outcome) => {
          const Icon = outcome.icon;
          return (
          <div key={outcome.label} className="flex items-center gap-3 bg-background px-4 py-3">
            <Icon className={`h-4 w-4 shrink-0 ${outcome.color}`} aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold">{outcome.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{outcome.text}</p>
            </div>
          </div>
          );
        })}
      </div>
    </figure>
  );
}
