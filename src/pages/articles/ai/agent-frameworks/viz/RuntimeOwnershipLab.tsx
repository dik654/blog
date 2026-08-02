import { useMemo, useState, type ComponentType } from 'react';
import {
  Bot,
  Check,
  CircleDot,
  Database,
  FileClock,
  GitBranch,
  Network,
  Play,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Wrench,
} from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const executionStages: Array<{
  label: string;
  short: string;
  owner: string;
  evidence: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  {
    label: '업무 계약을 고정한다',
    short: 'Admission',
    owner: 'Application',
    evidence: '성공 조건 · 권한 · 예산',
    icon: CircleDot,
  },
  {
    label: '모델은 다음 행동을 제안한다',
    short: 'Proposal',
    owner: 'Model runtime',
    evidence: 'tool 이름 · typed 인자',
    icon: Bot,
  },
  {
    label: '정책을 검사하고 실행 대상을 찾는다',
    short: 'Gate',
    owner: 'Runtime + app',
    evidence: 'policy rule · decision',
    icon: ShieldCheck,
  },
  {
    label: '중단 가능한 상태와 승인을 보존한다',
    short: 'Checkpoint',
    owner: 'Durable runtime',
    evidence: 'state revision · approval',
    icon: FileClock,
  },
  {
    label: '외부 시스템에 실제 변경을 요청한다',
    short: 'Commit',
    owner: 'Application tool',
    evidence: 'idempotency key · receipt',
    icon: Wrench,
  },
  {
    label: '실제 효과를 확인하고 실행을 닫는다',
    short: 'Verify',
    owner: 'Application + eval',
    evidence: 'end state · trace · verdict',
    icon: Check,
  },
];

const executionSteps = executionStages.map((stage) => ({
  label: stage.label,
  body: `${stage.owner}가 책임지고 ${stage.evidence}를 다음 단계가 읽을 수 있는 증거로 남긴다.`,
}));

export function RuntimeExecutionViz() {
  return (
    <StepViz steps={executionSteps}>
      {(step) => (
        <div className="grid min-h-[17rem] w-full min-w-0 content-center gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {executionStages.map((stage, index) => {
            const Icon = stage.icon;
            const active = index === step;
            const complete = index < step;

            return (
              <div
                key={stage.short}
                className={`min-w-0 bg-background p-4 transition-colors sm:min-h-32 ${
                  active ? 'bg-blue-50 text-blue-950 dark:bg-blue-950/45 dark:text-blue-50' : ''
                }`}
                aria-current={active ? 'step' : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${
                    active
                      ? 'border-blue-500/50 bg-blue-600 text-white'
                      : complete
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-border text-muted-foreground'
                  }`}>
                    {complete ? <Check className="size-4" aria-hidden /> : <Icon className="size-4" aria-hidden />}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-4 text-sm font-bold">{stage.short}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.owner}</p>
                <p className="mt-3 break-words text-xs leading-relaxed">{stage.evidence}</p>
              </div>
            );
          })}
        </div>
      )}
    </StepViz>
  );
}

type Scenario = 'brief' | 'tool' | 'rag' | 'long' | 'team' | 'impact';
type Guarantee = 'resume' | 'approval' | 'replay' | 'data' | 'parallel';
type RuntimeFamily = 'own' | 'sdk' | 'graph' | 'data' | 'crew';

const scenarios: Record<Scenario, {
  label: string;
  task: string;
  base: RuntimeFamily;
}> = {
  brief: {
    label: '짧은 답변',
    task: '한 번의 model 응답과 typed output으로 끝난다.',
    base: 'own',
  },
  tool: {
    label: '도구 사용',
    task: '여러 turn에서 read-only tool을 고르고 결과를 다시 모델에 넣는다.',
    base: 'sdk',
  },
  rag: {
    label: '자료 조사',
    task: '여러 source를 읽고 retrieval state와 citation을 함께 관리한다.',
    base: 'data',
  },
  long: {
    label: '장기 작업',
    task: 'process가 끊겨도 step state를 복원하고 deterministic 단계와 agent 단계를 섞는다.',
    base: 'graph',
  },
  team: {
    label: '역할 분담',
    task: '독립 worker가 각 artifact를 만들고 한 owner가 결과를 병합한다.',
    base: 'crew',
  },
  impact: {
    label: '고위험 변경',
    task: '승인, idempotency, effect 검증과 replay가 없으면 실행하면 안 된다.',
    base: 'graph',
  },
};

const guaranteeOptions: Array<{
  id: Guarantee;
  label: string;
  note: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'resume', label: '재시작 후 재개', note: 'checkpoint와 stable run ID', icon: RotateCcw },
  { id: 'approval', label: '사람 승인', note: '중단·검토·동일 action 재개', icon: UserCheck },
  { id: 'replay', label: '결정 재현', note: 'state diff와 versioned trace', icon: GitBranch },
  { id: 'data', label: '자료 중심', note: 'retrieval·citation·data lineage', icon: Database },
  { id: 'parallel', label: '병렬 역할', note: 'worker contract와 merge owner', icon: Network },
];

const runtimeFamilies: Record<RuntimeFamily, {
  eyebrow: string;
  title: string;
  examples: string;
  owns: string[];
  application: string[];
}> = {
  own: {
    eyebrow: '가장 작은 시작점',
    title: '직접 API + application loop',
    examples: 'Responses API 같은 model API를 직접 호출',
    owns: ['모델 요청과 응답', '짧은 typed output'],
    application: ['turn loop', 'tool dispatch', 'state와 retry', 'trace와 release gate'],
  },
  sdk: {
    eyebrow: '가벼운 agent runtime',
    title: 'Agent SDK',
    examples: 'OpenAI Agents SDK 같은 managed loop',
    owns: ['turn 반복', 'tool invocation', 'handoff·session·기본 trace'],
    application: ['업무 권한', '실제 effect 검증', 'idempotency', '제품 release gate'],
  },
  graph: {
    eyebrow: '명시적 상태 전이',
    title: 'Durable graph / workflow runtime',
    examples: 'LangGraph, Microsoft Agent Framework Workflows',
    owns: ['step routing', 'checkpoint·resume', 'interrupt와 state transition'],
    application: ['업무 DB invariant', '승인 권한 의미', '외부 effect reconciliation', 'retention·compliance'],
  },
  data: {
    eyebrow: '자료가 실행의 중심',
    title: 'Data-centered event workflow',
    examples: 'LlamaIndex Workflows',
    owns: ['event·step routing', 'retrieval component 연결', 'workflow state와 durable 실행 선택지'],
    application: ['source authority', 'citation acceptance', '업무 side effect', 'release evaluation'],
  },
  crew: {
    eyebrow: '분리 가능한 worker가 있을 때',
    title: 'Coordination / crew runtime',
    examples: 'CrewAI Crews + Flows',
    owns: ['역할·task coordination', 'flow routing', '선택적 state persistence'],
    application: ['worker 권한 격리', 'artifact verifier', '충돌·merge owner', '전체 비용·종료 조건'],
  },
};

function chooseRuntimePlan(
  scenario: Scenario,
  guarantees: Set<Guarantee>,
): { primary: RuntimeFamily; companions: RuntimeFamily[] } {
  const needsGraph = (
    scenario === 'impact'
    || scenario === 'long'
    || guarantees.has('resume')
    || guarantees.has('approval')
    || guarantees.has('replay')
  );
  const needsData = scenario === 'rag' || guarantees.has('data');
  const needsCrew = scenario === 'team' || guarantees.has('parallel');
  const specialized: RuntimeFamily[] = [
    ...(needsGraph ? ['graph' as const] : []),
    ...(needsData ? ['data' as const] : []),
    ...(needsCrew ? ['crew' as const] : []),
  ];

  if (specialized.length === 0) {
    return { primary: scenarios[scenario].base, companions: [] };
  }

  return {
    primary: specialized[0],
    companions: specialized.slice(1),
  };
}

export function RuntimeOwnershipLab() {
  const [scenario, setScenario] = useState<Scenario>('impact');
  const [guarantees, setGuarantees] = useState<Set<Guarantee>>(
    () => new Set<Guarantee>(['resume', 'approval', 'replay']),
  );

  const plan = useMemo(
    () => chooseRuntimePlan(scenario, guarantees),
    [guarantees, scenario],
  );
  const selected = runtimeFamilies[plan.primary];
  const familyPlan = [plan.primary, ...plan.companions];
  const runtimeOwned = Array.from(new Set(
    familyPlan.flatMap((family) => runtimeFamilies[family].owns),
  ));
  const applicationOwned = Array.from(new Set(
    familyPlan.flatMap((family) => runtimeFamilies[family].application),
  ));
  const selectedGuarantees = guaranteeOptions
    .filter((option) => guarantees.has(option.id))
    .map((option) => option.label);

  const toggleGuarantee = (id: Guarantee) => {
    setGuarantees((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      data-runtime-ownership-lab
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
      aria-labelledby="runtime-ownership-lab-title"
    >
      <header className="border-b border-border px-4 py-5 sm:px-6">
        <p className="text-xs font-bold text-muted-foreground">Runtime ownership lab</p>
        <h3 id="runtime-ownership-lab-title" className="mt-1 text-lg font-bold">
          필요한 보장에서 최소 runtime을 고른다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          특정 제품의 우승자를 정하는 도구가 아니다. 먼저 필요한 제어 책임을 드러내고,
          그 책임을 만족하는 가장 작은 runtime family에서 시작한다.
        </p>
      </header>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <fieldset>
            <legend className="text-xs font-bold text-muted-foreground">1. 업무를 고른다</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(scenarios) as Scenario[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={scenario === id}
                  onClick={() => setScenario(id)}
                  className={`min-h-12 rounded-md border px-3 py-2 text-left text-xs font-bold transition-colors ${
                    scenario === id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background hover:bg-muted/40'
                  }`}
                >
                  {scenarios[id].label}
                </button>
              ))}
            </div>
            <p className="mt-3 min-h-10 text-sm leading-relaxed text-muted-foreground">
              {scenarios[scenario].task}
            </p>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-xs font-bold text-muted-foreground">2. 반드시 지킬 보장을 더한다</legend>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {guaranteeOptions.map((option) => {
                const Icon = option.icon;
                const checked = guarantees.has(option.id);
                return (
                  <label
                    key={option.id}
                    className="flex min-w-0 cursor-pointer items-center gap-3 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGuarantee(option.id)}
                      className="peer sr-only"
                    />
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-md border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 ${
                      checked
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-border text-muted-foreground'
                    }`}>
                      {checked ? <Check className="size-4" aria-hidden /> : <Icon className="size-4" aria-hidden />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{option.note}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="min-w-0 p-4 sm:p-6" aria-live="polite">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Play className="size-4" aria-hidden />
            <p className="text-xs font-bold">{selected.eyebrow}</p>
          </div>
          <p data-runtime-result className="mt-2 text-xl font-black leading-tight">{selected.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.examples}</p>
          <div className="mt-5 border-y border-border py-4 text-sm leading-relaxed">
            <p className="font-semibold">
              {scenarios[scenario].label}: {scenarios[scenario].task}
            </p>
            <p className="mt-2 text-muted-foreground">
              선택한 보장: {selectedGuarantees.length > 0 ? selectedGuarantees.join(' · ') : '추가 보장 없음'}
            </p>
            {plan.companions.length > 0 && (
              <p data-runtime-supporting className="mt-2 text-amber-700 dark:text-amber-300">
                한 family로 축약하지 않는다. 함께 필요한 실행 성격:{' '}
                {plan.companions.map((family) => runtimeFamilies[family].title).join(' · ')}
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs font-bold text-muted-foreground">Runtime 조합에 맡길 후보</p>
            <ul className="mt-3 space-y-2">
              {runtimeOwned.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed">
                  <Check className="mt-1 size-3.5 shrink-0 text-emerald-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-bold text-muted-foreground">Application에 반드시 남는 책임</p>
            <ul className="mt-3 space-y-2">
              {applicationOwned.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed">
                  <CircleDot className="mt-1 size-3.5 shrink-0 text-amber-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
