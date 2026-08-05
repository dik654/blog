import { useState } from 'react';
import {
  Cable,
  Check,
  CircleDot,
  Database,
  ExternalLink,
  PlugZap,
  RefreshCw,
  ServerOff,
  TerminalSquare,
} from 'lucide-react';

type ScenarioKey = 'linter' | 'database' | 'shared';
type CallMode = 'first' | 'repeat' | 'failure';
type RuntimeKind = 'plugin' | 'mcp';

const scenarios: Array<{
  key: ScenarioKey;
  label: string;
  question: string;
  recommendation: RuntimeKind;
  reason: string;
}> = [
  {
    key: 'linter',
    label: '사내 린터',
    question: '프로젝트 안의 실행 파일을 한 번 호출하면 되는가?',
    recommendation: 'plugin',
    reason: '로컬 executable과 호출 단위 격리가 핵심이다. 장수명 연결이나 외부 클라이언트 표준이 필요하지 않다.',
  },
  {
    key: 'database',
    label: 'DB 세션',
    question: '인증된 연결과 schema context를 여러 호출이 공유해야 하는가?',
    recommendation: 'mcp',
    reason: '초기화 비용이 큰 연결을 서버가 소유하고, 여러 tool call이 같은 runtime state를 재사용하는 편이 유리하다.',
  },
  {
    key: 'shared',
    label: '외부 공유',
    question: '다른 에이전트와 클라이언트도 같은 도구 계약을 써야 하는가?',
    recommendation: 'mcp',
    reason: '표준 discovery와 tool call 계약이 배포 경계를 넘는 공유 비용을 낮춘다.',
  },
];

const lifecycle = {
  plugin: {
    first: ['프로세스 생성', 'stdin JSON 전달', 'stdout 결과', '프로세스 종료'],
    repeat: ['새 프로세스 생성', 'stdin JSON 전달', 'stdout 결과', '다시 종료'],
    failure: ['entrypoint 확인', '실행 실패', '구조화 오류 반환', '호스트는 계속 실행'],
  },
  mcp: {
    first: ['서버 연결·초기화', 'tool discovery', 'JSON-RPC 호출', '연결 유지'],
    repeat: ['기존 연결 재사용', 'discovery 재사용', 'JSON-RPC 호출', '연결 유지'],
    failure: ['연결·초기화 실패', 'degraded 상태 기록', '해당 도구 unavailable', '다른 도구는 유지'],
  },
} satisfies Record<RuntimeKind, Record<CallMode, string[]>>;

const modes: Array<{ key: CallMode; label: string }> = [
  { key: 'first', label: '첫 호출' },
  { key: 'repeat', label: '두 번째 호출' },
  { key: 'failure', label: '실패 경로' },
];

function RuntimeLane({
  kind,
  recommended,
  mode,
}: {
  kind: RuntimeKind;
  recommended: boolean;
  mode: CallMode;
}) {
  const isPlugin = kind === 'plugin';
  const title = isPlugin ? 'Plugin' : 'MCP';
  const subtitle = isPlugin ? '호출 수명 · 로컬 프로세스' : '연결 수명 · 관리되는 서버';
  const Icon = isPlugin ? TerminalSquare : Cable;

  return (
    <section
      data-runtime-kind={kind}
      data-recommended={recommended ? 'true' : 'false'}
      className={`min-w-0 border bg-background ${recommended ? 'border-foreground' : 'border-border'}`}
    >
      <header className="flex min-w-0 items-start justify-between gap-3 border-b border-border px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold">{title}</h4>
            <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {recommended && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-500/[0.07] px-2 py-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
            <Check className="h-3 w-3" aria-hidden="true" />
            권장
          </span>
        )}
      </header>

      <ol className="divide-y divide-border">
        {lifecycle[kind][mode].map((step, index) => {
          const failed =
            mode === 'failure' &&
            (isPlugin ? index === 1 || index === 2 : index <= 2);
          return (
            <li key={step} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 px-4 py-3">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold ${
                failed
                  ? 'border-red-600/40 bg-red-500/[0.06] text-red-700 dark:text-red-300'
                  : 'border-border text-muted-foreground'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`min-w-0 text-xs leading-5 ${failed ? 'font-bold text-red-700 dark:text-red-300' : ''}`}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>

      <footer className="border-t border-border bg-muted/20 px-4 py-3 text-[11px] leading-5 text-muted-foreground">
        {isPlugin
          ? mode === 'repeat'
            ? '구현 근거: plugins.rs의 execute()는 호출마다 새 child를 spawn하고 종료를 기다린다.'
            : '구현 근거: plugins.rs의 PluginTool::execute()가 stdin/stdout child process를 만든다.'
          : mode === 'repeat'
            ? '구현 근거: RuntimeMcpState가 manager와 discovery 상태를 runtime 수명 동안 보유한다.'
            : mode === 'failure'
              ? '구현 근거: cli_main.rs가 failed_servers와 available_tools를 degraded report에 함께 남긴다.'
              : '구현 근거: cli_main.rs의 RuntimeMcpState가 manager와 discovery 결과를 소유한다.'}
      </footer>
    </section>
  );
}

export default function PluginVsMcpViz() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('linter');
  const [mode, setMode] = useState<CallMode>('first');
  const scenario = scenarios.find((item) => item.key === scenarioKey) ?? scenarios[0];

  return (
    <figure
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
      data-plugin-mcp-decision-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <span className="block text-[11px] font-bold uppercase text-muted-foreground">Decision lab</span>
        <strong className="mt-1 block text-base">실행 파일인가, 연결된 도구 서버인가</strong>
      </figcaption>

      <div
        role="group"
        aria-label="확장 시나리오"
        className="grid grid-cols-3 gap-px border-b border-border bg-border"
      >
        {scenarios.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setScenarioKey(item.key);
            }}
            aria-pressed={scenarioKey === item.key}
            data-extension-scenario={item.key}
            className={`min-w-0 bg-background px-2 py-3 text-xs font-bold leading-5 transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 sm:px-4 ${
              scenarioKey === item.key ? 'bg-foreground text-background' : 'hover:bg-muted'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 border-b border-border px-4 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center sm:px-5">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">판단 질문</p>
          <p className="mt-1 text-sm font-semibold leading-6">{scenario.question}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{scenario.reason}</p>
        </div>
        <div
          role="group"
          aria-label="호출 상태"
          className="inline-grid min-w-0 grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border"
        >
          {modes.map((item) => {
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setMode(item.key)}
                aria-pressed={mode === item.key}
                data-call-mode={item.key}
                className={`min-w-0 bg-background px-3 py-2 text-[11px] font-bold transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-35 ${
                  mode === item.key ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid min-w-0 gap-px bg-border md:grid-cols-2">
        <RuntimeLane kind="plugin" recommended={scenario.recommendation === 'plugin'} mode={mode} />
        <RuntimeLane kind="mcp" recommended={scenario.recommendation === 'mcp'} mode={mode} />
      </div>

      <div
        data-extension-decision
        aria-live="polite"
        className="grid min-w-0 gap-3 border-t border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:px-5"
      >
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-bold">
          {scenario.recommendation === 'plugin' ? (
            <PlugZap className="h-3.5 w-3.5" aria-hidden="true" />
          ) : mode === 'failure' ? (
            <ServerOff className="h-3.5 w-3.5" aria-hidden="true" />
          ) : scenarioKey === 'database' ? (
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {scenario.recommendation === 'plugin' ? 'Plugin 권장' : 'MCP 권장'}
        </span>
        <p className="min-w-0 text-xs leading-5 text-muted-foreground">
          {mode === 'repeat' ? (
            <>
              <RefreshCw className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              두 번째 호출에서 수명 경계가 가장 선명하게 드러난다.
            </>
          ) : mode === 'failure' ? (
            <>
              <ServerOff className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              원격 실패는 전체 registry 실패가 아니라 해당 서버의 degraded 상태로 격리해야 한다.
            </>
          ) : (
            <>
              <CircleDot className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              기능 목록보다 누가 수명과 상태를 소유하는지를 먼저 비교한다.
            </>
          )}
        </p>
      </div>
      <div className="border-t border-border bg-muted/20 px-4 py-3 text-[11px] leading-5 text-muted-foreground sm:px-5">
        위 실행 단계는 현재 Claw snapshot의 <code>plugins.rs</code>와 <code>cli_main.rs</code>를 재구성했다.
        시나리오별 권장은 수명·상태 소유권에 따른 운영 설계 판단이다.
      </div>
    </figure>
  );
}
