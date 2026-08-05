import { useMemo, useState } from 'react';
import { Check, CircleAlert, GitMerge, ListFilter, ShieldCheck } from 'lucide-react';

type LaneContext = {
  green: number;
  staleMinutes: number;
  startupBlocked: boolean;
  reviewPassed: boolean;
  scopedDiff: boolean;
  completed: boolean;
  reconciled: boolean;
};

type PolicyAction =
  | { kind: 'action'; label: string }
  | { kind: 'chain'; actions: PolicyAction[] };

type Rule = {
  name: string;
  priority: number;
  condition: (context: LaneContext) => boolean;
  conditionLabel: string;
  action: PolicyAction;
};

const action = (label: string): PolicyAction => ({ kind: 'action', label });
const chain = (...actions: PolicyAction[]): PolicyAction => ({ kind: 'chain', actions });

function flattenAction(policyAction: PolicyAction): string[] {
  if (policyAction.kind === 'action') return [policyAction.label];
  return policyAction.actions.flatMap(flattenAction);
}

function describeAction(policyAction: PolicyAction): string {
  if (policyAction.kind === 'action') return policyAction.label;
  return `Chain[${policyAction.actions.map(describeAction).join(', ')}]`;
}

const rules: Rule[] = [
  {
    name: 'escalate startup blocker',
    priority: 60,
    condition: (context) => context.startupBlocked,
    conditionLabel: 'startup blocker',
    action: action('Escalate(startup blocked)'),
  },
  {
    name: 'recover stale lane',
    priority: 40,
    condition: (context) => context.staleMinutes >= 60,
    conditionLabel: 'branch age ≥ 60m',
    action: action('RecoverOnce'),
  },
  {
    name: 'close reconciled lane',
    priority: 5,
    condition: (context) => context.reconciled,
    conditionLabel: 'reconciled',
    action: chain(action('CloseoutLane'), action('CleanupSession')),
  },
  {
    name: 'merge verified work',
    priority: 20,
    condition: (context) =>
      context.green >= 3 && context.reviewPassed && context.scopedDiff && context.completed,
    conditionLabel: 'green ≥ 3 ∧ review ∧ scoped ∧ completed',
    action: chain(action('MergeToDev'), chain(action('Notify(review)'))),
  },
];

const fieldClass =
  'min-h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-foreground';

export default function PolicyEvaluationLab() {
  const [context, setContext] = useState<LaneContext>({
    green: 3,
    staleMinutes: 75,
    startupBlocked: false,
    reviewPassed: true,
    scopedDiff: true,
    completed: true,
    reconciled: false,
  });

  const evaluated = useMemo(
    () =>
      [...rules]
        .sort((left, right) => left.priority - right.priority)
        .map((rule) => ({ ...rule, matched: rule.condition(context) })),
    [context],
  );
  const actions = evaluated.filter((rule) => rule.matched).flatMap((rule) => flattenAction(rule.action));

  const toggle = (key: keyof LaneContext) => {
    setContext((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div
      data-policy-evaluation-lab
      data-matched-rule-count={evaluated.filter((rule) => rule.matched).length}
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="border-b border-border bg-muted/25 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <ListFilter className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold">Lane evidence를 바꿔 정책 결과를 다시 계산한다</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              아래 규칙은 원문 enum을 이용한 학습용 조합이다. 성능 수치나 실제 운영 규칙 세트가 아니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="policy-input-heading">
          <h4 id="policy-input-heading" className="text-xs font-bold uppercase text-muted-foreground">
            1. LaneContext
          </h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-medium">
              green level (raw u8)
              <select
                aria-label="green level"
                className={fieldClass}
                value={context.green}
                onChange={(event) =>
                  setContext((current) => ({ ...current, green: Number(event.target.value) }))
                }
              >
                {[0, 1, 2, 3, 4].map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-xs font-medium">
              branch age
              <select
                aria-label="branch age"
                className={fieldClass}
                value={context.staleMinutes}
                onChange={(event) =>
                  setContext((current) => ({ ...current, staleMinutes: Number(event.target.value) }))
                }
              >
                <option value={15}>15분</option>
                <option value={59}>59분</option>
                <option value={60}>60분</option>
                <option value={75}>75분</option>
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {([
              ['reviewPassed', 'review approved'],
              ['scopedDiff', 'diff scoped'],
              ['completed', 'lane completed'],
              ['reconciled', 'already reconciled'],
              ['startupBlocked', 'startup blocked'],
            ] as Array<[keyof LaneContext, string]>).map(([key, label]) => (
              <label
                key={key}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm"
              >
                <input
                  checked={Boolean(context[key])}
                  type="checkbox"
                  onChange={() => toggle(key)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="policy-result-heading">
          <h4 id="policy-result-heading" className="text-xs font-bold uppercase text-muted-foreground">
            2. priority 정렬 뒤 모든 규칙 평가
          </h4>
          <ol className="mt-4 space-y-2">
            {evaluated.map((rule) => (
              <li
                key={rule.name}
                className={`grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border px-3 py-3 ${
                  rule.matched ? 'border-emerald-600/35 bg-emerald-500/[0.06]' : 'border-border'
                }`}
              >
                <span
                  className="font-mono text-xs text-muted-foreground"
                  data-policy-rule-priority={rule.priority}
                >
                  p{rule.priority}
                </span>
                <span className="min-w-0">
                  <strong className="block break-words text-sm">{rule.name}</strong>
                  <span className="mt-0.5 block break-words font-mono text-[11px] leading-5 text-muted-foreground">
                    {rule.conditionLabel}
                  </span>
                  <span className="mt-0.5 block break-words font-mono text-[11px] leading-5 text-muted-foreground">
                    action: {describeAction(rule.action)}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold">
                  {rule.matched ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                  {rule.matched ? 'match' : 'skip'}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="border-t border-border px-4 py-5 sm:px-5" aria-labelledby="policy-actions-heading">
        <div className="flex items-center gap-2">
          <GitMerge className="h-4 w-4" aria-hidden="true" />
          <h4 id="policy-actions-heading" className="text-sm font-bold">
            3. 반환된 action intent
          </h4>
        </div>
        <div className="mt-3 flex min-h-11 flex-wrap items-center gap-2" data-policy-actions>
          {actions.length > 0 ? actions.map((action, index) => (
            <span
              key={`${action}-${index}`}
              className="rounded border border-border bg-muted/30 px-2.5 py-1.5 font-mono text-xs"
              data-policy-action={index}
            >
              {index + 1}. {action}
            </span>
          )) : (
            <span className="text-sm text-muted-foreground">일치한 규칙이 없어 빈 Vec를 반환한다.</span>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex gap-2 rounded-md border border-emerald-600/30 bg-emerald-500/[0.05] p-3 text-sm leading-6">
            <ShieldCheck className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
            <span><strong>보장:</strong> priority 순서와 Chain 내부 순서를 보존한 typed intent가 나온다.</span>
          </div>
          <div className="flex gap-2 rounded-md border border-amber-600/30 bg-amber-500/[0.05] p-3 text-sm leading-6">
            <CircleAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
            <span><strong>보장하지 않음:</strong> branch merge, lane mutation, effect receipt는 아직 일어나지 않았다.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
