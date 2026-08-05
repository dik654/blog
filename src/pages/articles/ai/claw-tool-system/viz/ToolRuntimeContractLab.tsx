import { useMemo, useState } from 'react';
import { Braces, CircleAlert, Eye, Play, ReceiptText, ShieldCheck } from 'lucide-react';

type Origin = 'builtin' | 'plugin' | 'runtime';
type Mode = 'read-only' | 'workspace-write' | 'danger-full-access' | 'prompt';
type Scenario = {
  id: string;
  name: string;
  origin: Origin;
  requirement: 'read-only' | 'workspace-write' | 'danger-full-access' | 'dynamic';
  executor: string;
  effect: string;
};

const scenarios: Scenario[] = [
  {
    id: 'read',
    name: 'read_file',
    origin: 'builtin',
    requirement: 'read-only',
    executor: 'built-in match → run_read_file',
    effect: '파일 내용 또는 명시적 오류',
  },
  {
    id: 'bash-read',
    name: 'bash: rg TODO',
    origin: 'builtin',
    requirement: 'dynamic',
    executor: 'bash classifier → run_bash',
    effect: 'stdout·stderr·exit status',
  },
  {
    id: 'bash-write',
    name: 'bash: rm build.log',
    origin: 'builtin',
    requirement: 'dynamic',
    executor: 'bash classifier → run_bash',
    effect: '삭제 결과와 exit status',
  },
  {
    id: 'plugin',
    name: 'acme_deploy',
    origin: 'plugin',
    requirement: 'danger-full-access',
    executor: 'PluginTool::execute',
    effect: 'plugin subprocess JSON result',
  },
  {
    id: 'runtime',
    name: 'mcp__db__query',
    origin: 'runtime',
    requirement: 'read-only',
    executor: 'higher-level runtime/MCP executor',
    effect: 'remote protocol result',
  },
];

const rank: Record<Mode, number> = {
  'read-only': 0,
  'workspace-write': 1,
  'danger-full-access': 2,
  prompt: 3,
};

const origins: Record<Origin, string> = {
  builtin: '정적 built-in spec',
  plugin: 'plugin manifest',
  runtime: 'runtime discovery',
};

export default function ToolRuntimeContractLab() {
  const [scenarioId, setScenarioId] = useState('read');
  const [mode, setMode] = useState<Mode>('read-only');
  const [definitionVisible, setDefinitionVisible] = useState(true);
  const [forcedCall, setForcedCall] = useState(false);
  const [askRequired, setAskRequired] = useState(false);
  const [promptApproved, setPromptApproved] = useState(false);
  const [executorAllowed, setExecutorAllowed] = useState(true);
  const [runtimeExecutorWired, setRuntimeExecutorWired] = useState(false);

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const required = scenario.requirement === 'dynamic'
    ? scenario.id === 'bash-read' ? 'read-only' : 'danger-full-access'
    : scenario.requirement;

  const result = useMemo(() => {
    if (!definitionVisible && !forcedCall) {
      return {
        status: 'hidden',
        label: 'model 선택 공간에서 제거됨',
        detail: 'definition이 request에 없으므로 정상 model 경로는 이 이름을 제안하지 못한다. 강제 ToolUse는 별도 경계다.',
      };
    }
    if (askRequired && !promptApproved) {
      return {
        status: 'approval',
        label: '명시적 ask가 사용자 결정을 기다림',
        detail: 'ask rule 또는 hook Ask가 prompter를 호출한다. active mode가 Prompt라는 이유만으로 항상 묻지는 않는다.',
      };
    }
    if (rank[mode] < rank[required]) {
      return {
        status: 'denied',
        label: 'permission denied',
        detail: `${required}가 필요하지만 현재 mode는 ${mode}다. executor에 들어가기 전에 닫혀야 한다.`,
      };
    }
    if (!executorAllowed) {
      return {
        status: 'executor-blocked',
        label: 'executor allowlist가 차단',
        detail: 'definition 노출과 policy 통과 뒤에도 concrete executor가 같은 이름을 다시 거부한다.',
      };
    }
    if (scenario.origin === 'runtime' && !runtimeExecutorWired) {
      return {
        status: 'unwired',
        label: 'definition은 보이지만 executor가 없음',
        detail: 'GlobalToolRegistry::execute는 이 runtime definition을 직접 dispatch하지 않는다. 상위 runtime이 protocol executor를 연결해야 한다.',
      };
    }
    return {
      status: 'observed',
      label: 'executor result 관찰',
      detail: scenario.effect,
    };
  }, [
    askRequired,
    definitionVisible,
    executorAllowed,
    forcedCall,
    mode,
    promptApproved,
    required,
    runtimeExecutorWired,
    scenario,
  ]);

  const tone = result.status === 'observed'
    ? 'border-emerald-600/35 bg-emerald-500/[0.06]'
    : result.status === 'denied'
      ? 'border-red-600/35 bg-red-500/[0.05]'
      : 'border-amber-600/35 bg-amber-500/[0.05]';

  return (
    <div
      data-tool-runtime-lab
      data-tool-result={result.status}
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="border-b border-border bg-muted/25 px-4 py-4 sm:px-5">
        <h3 className="text-base font-bold">보임·허용됨·실행됨은 서로 다른 계약이다</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
          도구와 mode를 바꾸면 request에 실리는 definition부터 최종 observation까지 어느 경계에서 멈추는지 달라진다.
        </p>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:p-5">
        <label className="grid min-w-0 gap-1.5 text-xs font-semibold">
          호출 후보
          <select
            aria-label="호출 후보"
            className="min-h-11 min-w-0 rounded-md border border-border bg-background px-3 text-sm"
            value={scenarioId}
            onChange={(event) => setScenarioId(event.target.value)}
          >
            {scenarios.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-xs font-semibold">
          active permission mode
          <select
            aria-label="active permission mode"
            className="min-h-11 rounded-md border border-border bg-background px-3 text-sm"
            value={mode}
            onChange={(event) => setMode(event.target.value as Mode)}
          >
            <option value="read-only">read-only</option>
            <option value="workspace-write">workspace-write</option>
            <option value="danger-full-access">danger-full-access</option>
            <option value="prompt">prompt</option>
          </select>
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm sm:col-span-2">
          <input
            checked={definitionVisible}
            type="checkbox"
            onChange={(event) => {
              setDefinitionVisible(event.target.checked);
              if (event.target.checked) setForcedCall(false);
            }}
          />
          이 도구를 model request의 definitions에 포함
        </label>
        <label className={`flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm ${
          definitionVisible ? 'text-muted-foreground' : 'cursor-pointer'
        }`}>
          <input
            checked={forcedCall}
            disabled={definitionVisible}
            type="checkbox"
            onChange={(event) => setForcedCall(event.target.checked)}
          />
          숨긴 이름의 ToolUse를 강제 주입
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm">
          <input checked={executorAllowed} type="checkbox" onChange={(event) => setExecutorAllowed(event.target.checked)} />
          executor allowlist 통과
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm">
          <input
            checked={askRequired}
            type="checkbox"
            onChange={(event) => {
              setAskRequired(event.target.checked);
              if (!event.target.checked) setPromptApproved(false);
            }}
          />
          ask rule 또는 hook Ask
        </label>
        <label className={`flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm ${
          askRequired ? 'cursor-pointer' : 'text-muted-foreground'
        }`}>
          <input
            checked={promptApproved}
            disabled={!askRequired}
            type="checkbox"
            onChange={(event) => setPromptApproved(event.target.checked)}
          />
          사용자 승인
        </label>
        <label
          className={`flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm sm:col-span-2 ${
            scenario.origin === 'runtime' ? 'cursor-pointer' : 'text-muted-foreground'
          }`}
        >
          <input
            aria-label="higher-level runtime executor 연결"
            checked={runtimeExecutorWired}
            disabled={scenario.origin !== 'runtime'}
            type="checkbox"
            onChange={(event) => setRuntimeExecutorWired(event.target.checked)}
          />
          higher-level runtime executor 연결
          {scenario.origin !== 'runtime' ? <span className="text-xs">(runtime-origin 전용)</span> : null}
        </label>
      </div>

      <ol className="grid gap-px border-y border-border bg-border md:grid-cols-4">
        <li className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <Eye className="h-4 w-4" aria-hidden="true" /> 1. Definition
          </div>
          <strong className="mt-3 block break-words text-sm">
            {definitionVisible ? scenario.name : forcedCall ? '숨김 · 강제 ToolUse' : 'request에서 숨김'}
          </strong>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">{origins[scenario.origin]}</span>
        </li>
        <li className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" /> 2. Permission
          </div>
          <strong className="mt-3 block break-words text-sm">
            {definitionVisible || forcedCall ? askRequired ? `${required} + ask` : required : '평가하지 않음'}
          </strong>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {askRequired
              ? promptApproved ? 'prompter 승인 뒤 계속' : 'prompter 응답 대기'
              : mode === 'prompt' ? 'plain requirement는 mode 순서 비교로 허용 가능'
                : scenario.requirement === 'dynamic' ? 'command 내용을 분류해 결정' : 'registry projection에서 읽음'}
          </span>
        </li>
        <li className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <Play className="h-4 w-4" aria-hidden="true" /> 3. Executor
          </div>
          <strong className="mt-3 block break-words text-sm">
            {result.status === 'observed'
              ? scenario.executor
              : result.status === 'unwired'
                ? 'executor 미배선'
                : result.status === 'executor-blocked'
                  ? 'allowlist에서 거부'
                : '진입하지 않음'}
          </strong>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {scenario.origin === 'runtime' ? 'registry execute와 별도 배선' : '이름별 실행 경로'}
          </span>
        </li>
        <li className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <ReceiptText className="h-4 w-4" aria-hidden="true" /> 4. Observation
          </div>
          <strong className="mt-3 block break-words text-sm">{result.label}</strong>
          <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">{result.detail}</span>
        </li>
      </ol>

      <div className={`m-4 flex gap-3 rounded-md border p-4 text-sm leading-6 sm:m-5 ${tone}`}>
        {result.status === 'observed'
          ? <Braces className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          : <CircleAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />}
        <p>
          <strong>{result.label}.</strong> {result.detail}
          {result.status === 'observed' ? ' 이 반환값이 ConversationRuntime에 기록되어야 다음 model turn의 관찰이 된다.' : ''}
        </p>
      </div>
    </div>
  );
}
