import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CircleAlert, CircleCheck, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

type ScenarioId = 'consume' | 'remote' | 'degraded' | 'timeout' | 'serve';

const scenarios = [
  { id: 'consume', label: 'stdio 도구 소비' },
  { id: 'remote', label: 'HTTP 설정' },
  { id: 'degraded', label: '부분 실패' },
  { id: 'timeout', label: 'tool timeout' },
  { id: 'serve', label: 'Claw를 서버로' },
] as const;

const scenarioData: Record<ScenarioId, {
  direction: string;
  status: 'ready' | 'pending' | 'degraded' | 'reset';
  statusLabel: string;
  summary: string;
  stages: Array<{ label: string; value: string; tone?: 'ok' | 'warn' | 'muted' }>;
  invariant: string;
}> = {
  consume: {
    direction: 'Claw client → child MCP server',
    status: 'ready',
    statusLabel: 'READY',
    summary: 'stdio process를 필요할 때 띄우고 initialize와 tools/list를 거쳐 qualified tool을 만든다.',
    stages: [
      { label: 'CONFIG', value: 'Stdio(command, args, env)' },
      { label: 'SPAWN', value: 'child stdin / stdout pipe' },
      { label: 'DISCOVER', value: 'initialize → tools/list', tone: 'ok' },
      { label: 'EXPOSE', value: 'mcp__demo__echo', tone: 'ok' },
    ],
    invariant: 'raw tool name과 server name을 함께 보존해야 call 때 정확한 subprocess로 되돌아간다.',
  },
  remote: {
    direction: 'Config descriptor ⇢ manager boundary',
    status: 'pending',
    statusLabel: 'UNSUPPORTED',
    summary: 'HTTP와 OAuth 정보는 bootstrap에 남지만 현재 stdio manager는 process를 만들지 않는다.',
    stages: [
      { label: 'CONFIG', value: 'Http(url, headers, OAuth)' },
      { label: 'BOOTSTRAP', value: 'McpClientTransport::Http' },
      { label: 'MANAGER', value: 'UnsupportedMcpServer', tone: 'warn' },
      { label: 'RUNTIME', value: 'pending · no HTTP call', tone: 'muted' },
    ],
    invariant: '표현 가능한 설정과 실행 가능한 transport를 같은 “지원”으로 세면 안 된다.',
  },
  degraded: {
    direction: 'two servers → best-effort discovery',
    status: 'degraded',
    statusLabel: 'DEGRADED',
    summary: '정상 서버의 도구는 남기고 실패 서버는 phase와 원인을 가진 report로 분리한다.',
    stages: [
      { label: 'SERVER A', value: 'tools/list 성공', tone: 'ok' },
      { label: 'SERVER B', value: 'initialize 실패', tone: 'warn' },
      { label: 'INDEX', value: 'A의 qualified tools 유지', tone: 'ok' },
      { label: 'REPORT', value: 'B는 pending / failed', tone: 'warn' },
    ],
    invariant: '부분 실패가 전체 도구 삭제로 번지지 않지만, 실패 사실도 조용히 숨기지 않는다.',
  },
  timeout: {
    direction: 'qualified tool → tools/call',
    status: 'reset',
    statusLabel: 'RESET',
    summary: 'timeout이면 현재 호출은 실패하고 process를 reset한다. 같은 side effect를 즉시 재실행하지 않는다.',
    stages: [
      { label: 'ROUTE', value: 'mcp__pay__charge → pay / charge' },
      { label: 'CALL', value: 'tools/call · 60s default' },
      { label: 'TIMEOUT', value: 'error returned', tone: 'warn' },
      { label: 'RESET', value: 'next call will respawn', tone: 'muted' },
    ],
    invariant: '응답 유실과 실행 실패는 같지 않으므로 side-effect call의 자동 재전송을 피한다.',
  },
  serve: {
    direction: 'external MCP client → Claw server',
    status: 'ready',
    statusLabel: 'SERVING',
    summary: 'Claw의 mvp tool specs를 외부 client가 발견하고 호출할 수 있는 반대 방향이다.',
    stages: [
      { label: 'COMMAND', value: 'claw mcp serve' },
      { label: 'SERVER', value: 'McpServer · stdio frames' },
      { label: 'METHODS', value: 'initialize · tools/list · tools/call', tone: 'ok' },
      { label: 'HANDLER', value: 'execute_tool', tone: 'ok' },
    ],
    invariant: '이 경로는 resources나 sampling server가 아니라 세 request method의 tool server다.',
  },
};

const statusClass = {
  ready: 'border-teal-600/30 bg-teal-500/[0.06] text-teal-800 dark:text-teal-200',
  pending: 'border-border bg-muted/35 text-muted-foreground',
  degraded: 'border-amber-600/30 bg-amber-500/[0.06] text-amber-800 dark:text-amber-200',
  reset: 'border-rose-600/30 bg-rose-500/[0.06] text-rose-800 dark:text-rose-200',
} as const;

export default function McpRuntimeLab() {
  const [scenario, setScenario] = useState<ScenarioId>('consume');
  const selected = useMemo(() => scenarioData[scenario], [scenario]);

  return (
    <div data-mcp-runtime-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold text-muted-foreground">MCP EXECUTION BOUNDARY LAB</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="MCP 실행 시나리오">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={scenario === item.id}
              onClick={() => setScenario(item.id)}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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

      <AnimatePresence mode="wait">
        <motion.div
          key={scenario}
          data-mcp-scenario={scenario}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="min-w-0"
        >
          <div className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="min-w-0 px-4 py-4 sm:px-5">
              <p className="break-words font-mono text-[10px] font-bold text-muted-foreground">{selected.direction}</p>
              <p className="mt-2 text-sm leading-relaxed">{selected.summary}</p>
            </div>
            <div className="flex items-center border-t border-border px-4 py-3 lg:border-l lg:border-t-0 sm:px-5">
              <span className={`inline-flex items-center gap-2 rounded border px-2.5 py-1.5 font-mono text-[10px] font-bold ${statusClass[selected.status]}`}>
                {selected.status === 'ready' ? <CircleCheck className="h-3.5 w-3.5" /> : selected.status === 'reset' ? <RotateCcw className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
                {selected.statusLabel}
              </span>
            </div>
          </div>

          <div className="grid min-w-0 gap-0 px-4 py-5 sm:grid-cols-4 sm:px-5">
            {selected.stages.map((stage, index) => (
              <div key={`${scenario}-${stage.label}`} className="flex min-w-0 sm:block">
                <div className={`min-w-0 flex-1 border-l-2 py-2 pl-3 sm:border-l-0 sm:border-t-2 sm:pb-0 sm:pl-0 sm:pr-3 sm:pt-3 ${
                  stage.tone === 'ok'
                    ? 'border-teal-600/50'
                    : stage.tone === 'warn'
                      ? 'border-amber-600/50'
                      : 'border-border'
                }`}>
                  <p className="font-mono text-[9px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')} · {stage.label}</p>
                  <p className="mt-1 break-words text-xs font-semibold leading-relaxed [overflow-wrap:anywhere]">{stage.value}</p>
                </div>
                {index < selected.stages.length - 1 && (
                  <ArrowRight className="mx-2 mt-5 hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-muted/15 px-4 py-3 sm:px-5">
            <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">지켜야 할 경계.</strong> {selected.invariant}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
