import { useMemo, useState } from 'react';

type ScenarioId = 'all' | 'without-local' | 'invalid-current' | 'invalid-legacy';

const files = [
  { scope: 'USER', short: '~/.claw.json', detail: 'legacy · model haiku · raw env.A · MCP home' },
  { scope: 'USER', short: '~/.claw/settings.json', detail: 'model sonnet · raw env.A2 · plan · PreToolUse' },
  { scope: 'PROJECT', short: './.claw.json', detail: 'legacy · model project-compat · raw env.B' },
  { scope: 'PROJECT', short: './.claw/settings.json', detail: 'raw env.C · PostToolUse · MCP project' },
  { scope: 'LOCAL', short: './.claw/settings.local.json', detail: 'model opus · acceptEdits' },
] as const;

const scenarios = [
  { id: 'all', label: '다섯 파일' },
  { id: 'without-local', label: 'local 없음' },
  { id: 'invalid-current', label: 'current 오류' },
  { id: 'invalid-legacy', label: 'legacy 오류' },
] as const;

const results: Record<ScenarioId, {
  model: string;
  permission: string;
  env: string;
  mcp: string;
  status: string;
  note: string;
}> = {
  all: {
    model: 'opus',
    permission: 'WorkspaceWrite',
    env: 'A · A2 · B · C',
    mcp: 'home(USER) · project(PROJECT)',
    status: 'RuntimeConfig 반환',
    note: '뒤 scalar가 이기고, 중첩 object의 서로 다른 key는 함께 남는다.',
  },
  'without-local': {
    model: 'project-compat',
    permission: 'ReadOnly',
    env: 'A · A2 · B · C',
    mcp: 'home(USER) · project(PROJECT)',
    status: 'RuntimeConfig 반환',
    note: 'local이 없으면 project legacy의 model과 user의 plan이 최종 typed value가 된다.',
  },
  'invalid-current': {
    model: '반환 없음',
    permission: '반환 없음',
    env: '반환 없음',
    mcp: '반환 없음',
    status: 'ConfigError::Parse',
    note: '현재 settings의 parse/schema 오류는 load를 즉시 중단한다. 부분 RuntimeConfig는 없다.',
  },
  'invalid-legacy': {
    model: 'opus',
    permission: 'WorkspaceWrite',
    env: 'A2 · B · C',
    mcp: 'project(PROJECT)',
    status: 'RuntimeConfig 반환',
    note: 'legacy .claw.json의 parse 또는 top-level shape 오류는 호환을 위해 그 파일만 건너뛴다.',
  },
};

export default function CascadeViz() {
  const [scenario, setScenario] = useState<ScenarioId>('all');
  const result = results[scenario];
  const visibleFiles = useMemo(() => files.map((file, index) => ({
    ...file,
    state:
      scenario === 'without-local' && index === 4 ? 'missing'
        : scenario === 'invalid-current' && index === 3 ? 'error'
          : scenario === 'invalid-legacy' && index === 0 ? 'ignored'
            : 'loaded',
  })), [scenario]);

  return (
    <div data-config-contract-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">CONFIG PRECEDENCE LAB</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="설정 파일 시나리오">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={scenario === item.id}
              onClick={() => setScenario(item.id)}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                scenario === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)]">
        <div className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-border bg-muted/30 px-4 py-2 text-[10px] font-semibold text-muted-foreground sm:grid-cols-[3rem_6rem_minmax(0,1fr)] sm:px-5">
            <span>ORDER</span>
            <span className="hidden sm:block">SCOPE</span>
            <span>FILE · CONTRIBUTION</span>
          </div>
          {visibleFiles.map((file, index) => (
            <div
              key={file.short}
              data-file-state={file.state}
              className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-y-1 border-b border-border/70 px-4 py-3 last:border-b-0 sm:grid-cols-[3rem_6rem_minmax(0,1fr)] sm:px-5 ${
                file.state === 'error' ? 'bg-red-50 dark:bg-red-950/20'
                  : file.state === 'ignored' || file.state === 'missing' ? 'opacity-45'
                    : ''
              }`}
            >
              <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <span className="hidden text-[10px] font-bold text-muted-foreground sm:block">{file.scope}</span>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <code className="break-all text-[11px] font-bold">{file.short}</code>
                  <span className={`text-[10px] font-semibold ${
                    file.state === 'error' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                  }`}>
                    {file.state === 'loaded' ? 'LOADED' : file.state.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{file.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div data-config-result={scenario} className="min-w-0 px-4 py-4 sm:px-5">
          <p className="text-[10px] font-semibold text-muted-foreground">LOAD OUTCOME</p>
          <p className={`mt-2 text-sm font-bold ${
            scenario === 'invalid-current' ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            {result.status}
          </p>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {[
              ['model', result.model],
              ['permission', result.permission],
              ['raw env keys', result.env],
              ['MCP + source', result.mcp],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 py-2.5 sm:grid-cols-[6rem_minmax(0,1fr)]">
                <dt className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</dt>
                <dd className="min-w-0 break-words text-xs font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{result.note}</p>
        </div>
      </div>
    </div>
  );
}
