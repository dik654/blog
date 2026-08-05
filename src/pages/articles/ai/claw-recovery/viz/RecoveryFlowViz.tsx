import { useMemo, useState } from 'react';
import {
  Check,
  CircleAlert,
  RotateCcw,
  Route,
  ShieldAlert,
} from 'lucide-react';

type ScenarioKey =
  | 'trust'
  | 'prompt'
  | 'stale'
  | 'compile'
  | 'mcp'
  | 'plugin'
  | 'provider';

type FailureMode = 'success' | 'first' | 'later';

type Scenario = {
  label: string;
  source: string;
  displaySource: string;
  upstream: string;
  reachableFromWorkerBoot: boolean;
  steps: string[];
  policy: 'AlertHuman' | 'LogAndContinue' | 'Abort';
};

const scenarios: Record<ScenarioKey, Scenario> = {
  trust: {
    label: 'Trust prompt',
    source: 'TrustPromptUnresolved',
    displaySource: 'trust_prompt_unresolved',
    upstream: 'TrustGate · ToolPermissionGate',
    reachableFromWorkerBoot: true,
    steps: ['AcceptTrustPrompt'],
    policy: 'AlertHuman',
  },
  prompt: {
    label: 'Prompt delivery',
    source: 'PromptMisdelivery',
    displaySource: 'prompt_misdelivery',
    upstream: 'PromptDelivery',
    reachableFromWorkerBoot: true,
    steps: ['RedirectPromptToAgent'],
    policy: 'AlertHuman',
  },
  stale: {
    label: 'Stale branch',
    source: 'StaleBranch',
    displaySource: 'stale_branch',
    upstream: 'worker_boot bridge에는 mapping 없음',
    reachableFromWorkerBoot: false,
    steps: ['RebaseBranch', 'CleanBuild'],
    policy: 'AlertHuman',
  },
  compile: {
    label: 'Cross-crate compile',
    source: 'CompileRedCrossCrate',
    displaySource: 'compile_red_cross_crate',
    upstream: 'worker_boot bridge에는 mapping 없음',
    reachableFromWorkerBoot: false,
    steps: ['CleanBuild'],
    policy: 'AlertHuman',
  },
  mcp: {
    label: 'MCP handshake',
    source: 'McpHandshakeFailure',
    displaySource: 'mcp_handshake_failure',
    upstream: 'Protocol',
    reachableFromWorkerBoot: true,
    steps: ['RetryMcpHandshake(5000ms)'],
    policy: 'Abort',
  },
  plugin: {
    label: 'Partial plugin',
    source: 'PartialPluginStartup',
    displaySource: 'partial_plugin_startup',
    upstream: 'worker_boot bridge에는 mapping 없음',
    reachableFromWorkerBoot: false,
    steps: ['RestartPlugin(stalled)', 'RetryMcpHandshake(3000ms)'],
    policy: 'LogAndContinue',
  },
  provider: {
    label: 'Provider',
    source: 'ProviderFailure',
    displaySource: 'provider_failure',
    upstream: 'Provider · StartupNoEvidence',
    reachableFromWorkerBoot: true,
    steps: ['RestartWorker'],
    policy: 'AlertHuman',
  },
};

const emptyAttempts = (): Record<ScenarioKey, number> => ({
  trust: 0,
  prompt: 0,
  stale: 0,
  compile: 0,
  mcp: 0,
  plugin: 0,
  provider: 0,
});

const fieldClass =
  'min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground';

export default function RecoveryFlowViz() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('plugin');
  const [failureMode, setFailureMode] = useState<FailureMode>('later');
  const [attempts, setAttempts] = useState<Record<ScenarioKey, number>>(emptyAttempts);
  const [result, setResult] = useState('아직 실행하지 않음');
  const [events, setEvents] = useState<string[]>([]);
  const [executedSteps, setExecutedSteps] = useState<string[]>([]);
  const scenario = scenarios[scenarioKey];
  const attemptCount = attempts[scenarioKey];
  const supportsLaterFailure = scenario.steps.length > 1;

  const effectiveFailureMode = useMemo(
    () => (failureMode === 'later' && !supportsLaterFailure ? 'success' : failureMode),
    [failureMode, supportsLaterFailure],
  );

  const attempt = () => {
    if (attemptCount >= 1) {
      const reason = `max recovery attempts (1) exceeded for ${scenario.displaySource}`;
      setExecutedSteps([]);
      setResult(`EscalationRequired { reason: "${reason}" }`);
      setEvents([
        `RecoveryAttempted { ${scenario.displaySource}, EscalationRequired }`,
        'Escalated',
      ]);
      return;
    }

    setAttempts((current) => ({ ...current, [scenarioKey]: 1 }));

    if (effectiveFailureMode === 'first') {
      setExecutedSteps([]);
      setResult(
        `EscalationRequired { reason: "recovery failed at first step for ${scenario.displaySource}" }`,
      );
      setEvents([
        `RecoveryAttempted { ${scenario.displaySource}, EscalationRequired }`,
        'Escalated',
      ]);
      return;
    }

    if (effectiveFailureMode === 'later') {
      setExecutedSteps([scenario.steps[0]]);
      setResult(
        `PartialRecovery { recovered: [${scenario.steps[0]}], remaining: [${scenario.steps
          .slice(1)
          .join(', ')}] }`,
      );
      setEvents([
        `RecoveryAttempted { ${scenario.displaySource}, PartialRecovery }`,
        'RecoveryFailed',
      ]);
      return;
    }

    setExecutedSteps(scenario.steps);
    setResult(`Recovered { steps_taken: ${scenario.steps.length} }`);
    setEvents([
      `RecoveryAttempted { ${scenario.displaySource}, Recovered }`,
      'RecoverySucceeded',
    ]);
  };

  const reset = () => {
    setAttempts(emptyAttempts());
    setResult('아직 실행하지 않음');
    setEvents([]);
    setExecutedSteps([]);
  };

  const selectScenario = (next: ScenarioKey) => {
    setScenarioKey(next);
    setResult('아직 실행하지 않음');
    setEvents([]);
    setExecutedSteps([]);
    if (failureMode === 'later' && scenarios[next].steps.length === 1) {
      setFailureMode('success');
    }
  };

  return (
    <div
      data-recovery-boundary-lab
      data-viz-canvas
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border bg-muted/25 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <Route className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold">분류된 실패가 어느 결과와 event로 닫히는지 실행한다</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              source의 분기 순서를 그대로 따라가되, step 실행은 실제 effect가 아닌 테스트용 simulation이다.
            </p>
          </div>
        </div>
      </header>

      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="recovery-input-heading">
          <div className="flex items-center justify-between gap-3">
            <h4 id="recovery-input-heading" className="text-xs font-bold uppercase text-muted-foreground">
              1. scenario와 실패 지점
            </h4>
            <button
              type="button"
              onClick={reset}
              aria-label="복구 실험 초기화"
              title="초기화"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <label className="mt-4 grid gap-1.5 text-xs font-medium">
            FailureScenario
            <select
              aria-label="failure scenario"
              className={fieldClass}
              value={scenarioKey}
              onChange={(event) => selectScenario(event.target.value as ScenarioKey)}
            >
              {(Object.entries(scenarios) as Array<[ScenarioKey, Scenario]>).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </label>

          <fieldset className="mt-4">
            <legend className="text-xs font-medium">simulated step outcome</legend>
            <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
              {([
                ['success', '모두 성공'],
                ['first', '첫 step 실패'],
                ['later', '뒤 step 실패'],
              ] as Array<[FailureMode, string]>).map(([mode, label]) => {
                const disabled = mode === 'later' && !supportsLaterFailure;
                return (
                  <button
                    key={mode}
                    type="button"
                    disabled={disabled}
                    aria-pressed={failureMode === mode}
                    onClick={() => {
                      setFailureMode(mode);
                      setResult('아직 실행하지 않음');
                      setEvents([]);
                      setExecutedSteps([]);
                    }}
                    className={`min-w-0 bg-background px-2 py-3 text-[11px] font-bold ${
                      failureMode === mode ? 'bg-foreground text-background' : 'hover:bg-muted'
                    } disabled:cursor-not-allowed disabled:opacity-35`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={attempt}
            className="mt-5 min-h-11 w-full rounded-md bg-foreground px-4 text-sm font-bold text-background"
          >
            복구 시도
          </button>
        </section>

        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="recovery-recipe-heading">
          <h4 id="recovery-recipe-heading" className="text-xs font-bold uppercase text-muted-foreground">
            2. recipe와 attempt gate
          </h4>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">upstream</dt>
              <dd className="break-words text-xs leading-5 [overflow-wrap:anywhere]">
                {scenario.upstream}
                <span className={`ml-2 font-bold ${
                  scenario.reachableFromWorkerBoot
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {scenario.reachableFromWorkerBoot ? 'bridge 도달' : '다른 producer 필요'}
                </span>
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">steps</dt>
              <dd className="space-y-1">
                {scenario.steps.map((step, index) => (
                  <code
                    key={step}
                    className={`block break-words text-xs [overflow-wrap:anywhere] ${
                      executedSteps.includes(step) ? 'font-bold text-emerald-700 dark:text-emerald-300' : ''
                    }`}
                  >
                    {index + 1}. {step}
                  </code>
                ))}
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">attempts</dt>
              <dd className="font-mono text-xs font-bold" data-recovery-attempt-count>
                {attemptCount} / 1 · scenario별 count
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">policy metadata</dt>
              <dd className="font-mono text-xs font-bold">{scenario.policy}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="border-t border-border px-4 py-5 sm:px-5" aria-labelledby="recovery-result-heading">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)]">
          <div className="min-w-0">
            <h4 id="recovery-result-heading" className="text-xs font-bold uppercase text-muted-foreground">
              3. exact RecoveryResult
            </h4>
            <code
              data-recovery-result
              data-recovery-decision
              aria-live="polite"
              className="mt-3 block min-h-16 break-words border-l-2 border-foreground bg-muted/20 px-3 py-3 text-xs leading-6 [overflow-wrap:anywhere]"
            >
              {result}
            </code>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">4. emitted events</h4>
            <ol data-recovery-events className="mt-3 min-h-16 space-y-1 border-y border-border py-3">
              {events.length > 0 ? events.map((event, index) => (
                <li key={`${event}-${index}`} className="break-words font-mono text-[11px] leading-5 [overflow-wrap:anywhere]">
                  {index + 1}. {event}
                </li>
              )) : (
                <li className="text-xs text-muted-foreground">아직 event 없음</li>
              )}
            </ol>
          </div>
        </div>

        <div
          data-recovery-effect-owner
          className="mt-4 flex gap-3 border border-amber-600/30 bg-amber-500/[0.05] p-3 text-sm leading-6"
        >
          <ShieldAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>아직 실행되지 않은 것:</strong> <code>{scenario.policy}</code>는 recipe에 저장된 정책 이름이다.
            이 함수는 사람 알림, 계속 진행, process abort를 호출하지 않는다. 외부 coordinator가 event와
            policy를 읽고 실제 effect와 영수증을 책임져야 한다.
          </p>
        </div>
      </section>

      <footer className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        <div className="flex gap-2 bg-background p-4 text-xs leading-5">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
          <span><strong>현재 보장:</strong> scenario별 한 번의 gate, exact result와 event 기록.</span>
        </div>
        <div className="flex gap-2 bg-background p-4 text-xs leading-5">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          <span><strong>현재 미보장:</strong> 실제 step effect, idempotency, lane/global budget.</span>
        </div>
      </footer>
    </div>
  );
}
