import { useMemo, useState } from 'react';
import {
  CircleAlert,
  FileOutput,
  Play,
  ShieldCheck,
  Timer,
} from 'lucide-react';

type ScenarioKey = 'explore' | 'plan' | 'custom';
type TerminalKey = 'completed' | 'runtime-error' | 'panic' | 'spawn-error';

const scenarios = {
  explore: {
    label: 'Explore',
    type: 'Explore',
    attempted: 'edit_file',
    allowed: false,
    tools: ['read_file', 'glob_search', 'grep_search', 'WebFetch'],
  },
  plan: {
    label: 'Plan',
    type: 'Plan',
    attempted: 'TodoWrite',
    allowed: true,
    tools: ['read_file', 'glob_search', 'grep_search', 'TodoWrite'],
  },
  custom: {
    label: 'Custom type',
    type: 'security-review',
    attempted: 'edit_file',
    allowed: true,
    tools: ['bash', 'read_file', 'write_file', 'edit_file'],
  },
} as const;

const terminalCases = {
  completed: {
    label: '정상 완료',
    status: 'completed',
    derived: 'terminal state + finished event',
    error: '없음',
    spawnReturnsManifest: true,
  },
  'runtime-error': {
    label: 'runtime 오류',
    status: 'failed',
    derived: 'blocker 분류 + blocked/failed events',
    error: 'run_agent_job error',
    spawnReturnsManifest: true,
  },
  panic: {
    label: 'thread panic',
    status: 'failed',
    derived: 'blocked/failed events',
    error: 'sub-agent thread panicked',
    spawnReturnsManifest: true,
  },
  'spawn-error': {
    label: 'thread spawn 실패',
    status: 'failed',
    derived: 'failed manifest를 동기로 기록',
    error: 'execute_agent_with_spawn returns Err',
    spawnReturnsManifest: false,
  },
} as const;

export default function OrchestrationOverviewViz() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('explore');
  const [terminalKey, setTerminalKey] = useState<TerminalKey>('completed');
  const scenario = scenarios[scenarioKey];
  const terminal = terminalCases[terminalKey];

  const returnSummary = useMemo(() => {
    if (!terminal.spawnReturnsManifest) {
      return 'running manifest를 먼저 쓴 뒤 spawn 실패를 failed로 갱신하고 caller에는 Err를 반환';
    }
    return 'background thread를 시작한 직후 caller에는 status=running manifest를 반환';
  }, [terminal.spawnReturnsManifest]);

  return (
    <div
      data-orchestration-contract-lab
      data-viz-canvas
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border bg-muted/25 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <Play className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold">즉시 반환과 background terminal state를 분리해 본다</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              caller가 처음 받는 값과 나중에 manifest 파일에 남는 값은 같은 시점의 상태가 아니다.
            </p>
          </div>
        </div>
      </header>

      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="agent-request-heading">
          <h4 id="agent-request-heading" className="text-xs font-bold uppercase text-muted-foreground">
            1. request와 결과 조건
          </h4>
          <div role="group" aria-label="subagent runtime 사례" className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
            {(Object.entries(scenarios) as Array<[ScenarioKey, typeof scenarios[ScenarioKey]]>).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenarioKey(key)}
                aria-pressed={scenarioKey === key}
                className={`min-w-0 bg-background px-2 py-3 text-[11px] font-bold ${
                  scenarioKey === key ? 'bg-foreground text-background' : 'hover:bg-muted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="mt-4 grid gap-1.5 text-xs font-medium">
            background outcome
            <select
              aria-label="background outcome"
              value={terminalKey}
              onChange={(event) => setTerminalKey(event.target.value as TerminalKey)}
              className="min-h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
            >
              {(Object.entries(terminalCases) as Array<[TerminalKey, typeof terminalCases[TerminalKey]]>).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </label>

          <dl className="mt-4 divide-y divide-border border-y border-border">
            <div className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">type</dt>
              <dd className="font-mono text-xs font-bold">{scenario.type}</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">tool attempt</dt>
              <dd
                data-executor-gate
                className={`font-mono text-xs font-bold ${
                  scenario.allowed
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-red-700 dark:text-red-300'
                }`}
              >
                {scenario.attempted}: {scenario.allowed ? 'allowlist 포함' : '실행 전 차단'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="agent-lifecycle-heading">
          <h4 id="agent-lifecycle-heading" className="text-xs font-bold uppercase text-muted-foreground">
            2. execute_agent_with_spawn
          </h4>
          <ol className="mt-4 space-y-2">
            {[
              ['입력 검증', 'description·prompt가 비면 파일과 thread를 만들기 전에 Err'],
              ['durable 경로 준비', 'task markdown + status=running manifest + lane.started'],
              ['background job 구성', 'prompt + system prompt + 고정 allowed_tools'],
              ['spawn', returnSummary],
            ].map(([label, body], index) => (
              <li key={label} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
                <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
                <span className="min-w-0">
                  <strong className="block text-sm">{label}</strong>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{body}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-1">
            {scenario.tools.map((tool) => (
              <code key={tool} className="rounded border border-border px-2 py-1 text-[10px]">{tool}</code>
            ))}
          </div>
        </section>
      </div>

      <section className="border-t border-border px-4 py-5 sm:px-5">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 border-y border-border py-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold">
              <Timer className="h-4 w-4" aria-hidden="true" />
              caller가 즉시 아는 상태
            </span>
            <code
              data-manifest-immediate
              className="mt-3 block break-words text-xs leading-6 [overflow-wrap:anywhere]"
            >
              {terminal.spawnReturnsManifest
                ? 'AgentOutput { status: "running", completed_at: None, derived_state: "working" }'
                : 'Err("failed to spawn sub-agent: …")'}
            </code>
          </div>
          <div className="min-w-0 border-y border-border py-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold">
              <FileOutput className="h-4 w-4" aria-hidden="true" />
              파일에서 나중에 읽는 terminal state
            </span>
            <code
              data-manifest-terminal
              className="mt-3 block break-words text-xs leading-6 [overflow-wrap:anywhere]"
            >
              status: {terminal.status} · {terminal.derived} · error: {terminal.error}
            </code>
          </div>
        </div>

        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="flex gap-3 bg-background p-4 text-xs leading-5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <span>
              <strong>두 겹의 tool 경계:</strong> 같은 allowlist로 model-visible definition을 줄이고,
              <code>SubagentToolExecutor</code>가 dispatch 직전 다시 검사한다.
            </span>
          </div>
          <div className="flex gap-3 bg-background p-4 text-xs leading-5">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <span>
              <strong>아직 없는 계약:</strong> deadline, lease, late-result merge, parent acceptance와
              artifact effect verification.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
