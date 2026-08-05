import { useState } from 'react';
import {
  Ban,
  Check,
  CircleDashed,
  GitBranch,
  OctagonX,
  Play,
  SearchX,
  SkipForward,
} from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

type ScenarioKey = 'allow' | 'hook-deny' | 'policy-deny' | 'unknown-tool';
type StageState = 'active' | 'complete' | 'waiting' | 'skipped';

const stages = [
  {
    label: 'Pre-hook',
    code: 'run_pre_tool_use_hook(name, input)',
    title: 'Pre-hook이 원본 입력을 먼저 검사한다',
    body: '훅은 입력을 수정할 수 있고, 취소·실패·거부를 반환해 뒤 단계를 막을 수도 있다. 권한 정책은 원본이 아니라 이 단계가 만든 effective_input을 본다.',
  },
  {
    label: '권한 판정',
    code: 'authorize_with_context(effective_input)',
    title: '권한 정책이 실제 실행될 입력을 판정한다',
    body: 'Pre-hook의 permission override와 수정된 입력을 함께 사용한다. Deny이면 executor와 post-hook은 호출하지 않고 즉시 오류 tool_result를 만든다.',
  },
  {
    label: '실행',
    code: 'tool_executor.execute(name, input)',
    title: '이름을 handler에 연결해 외부 효과를 실행한다',
    body: '등록된 이름이면 handler가 실행된다. 이름이 없거나 실행이 실패하면 성공값 대신 오류가 만들어지고 failure post-hook 경로로 이동한다.',
  },
  {
    label: 'Post-hook',
    code: 'post_tool_use[_failure](...)',
    title: '성공과 실패가 서로 다른 post-hook으로 들어간다',
    body: '성공은 PostToolUse, 오류는 PostToolUseFailure가 관찰한다. 훅의 메시지는 원래 output에 합쳐지고, 훅 자체가 실패하면 최종 결과도 오류가 된다.',
  },
  {
    label: '결과 기록',
    code: 'push_message(tool_result) · record_finished',
    title: '모든 경로를 같은 tool_result 계약으로 닫는다',
    body: '성공, 정책 거부, 미등록 도구가 모두 tool_use_id를 보존한 tool_result가 된다. 세션은 결과를 기록하고 다음 model turn이 원인을 읽게 한다.',
  },
] as const;

const scenarios: Array<{
  key: ScenarioKey;
  label: string;
  short: string;
  path: number[];
  outcome: string;
  evidence: string;
  tone: 'success' | 'danger' | 'warning';
}> = [
  {
    key: 'allow',
    label: '정상 실행',
    short: '모든 단계 통과',
    path: [0, 1, 2, 3, 4],
    outcome: 'tool_result · success',
    evidence: 'executor가 실행되고 PostToolUse가 결과를 보강한다.',
    tone: 'success',
  },
  {
    key: 'hook-deny',
    label: 'Hook 중단',
    short: 'Pre-hook에서 종료',
    path: [0, 4],
    outcome: 'tool_result · hook denied',
    evidence: '권한·executor·post-hook은 호출되지 않는다.',
    tone: 'danger',
  },
  {
    key: 'policy-deny',
    label: '권한 거부',
    short: '정책에서 종료',
    path: [0, 1, 4],
    outcome: 'tool_result · permission denied',
    evidence: 'executor와 post-hook은 호출되지 않는다.',
    tone: 'danger',
  },
  {
    key: 'unknown-tool',
    label: '미등록 도구',
    short: '실행 단계에서 실패',
    path: [0, 1, 2, 3, 4],
    outcome: 'tool_result · unknown tool',
    evidence: '오류를 PostToolUseFailure가 관찰한 뒤 세션이 계속된다.',
    tone: 'warning',
  },
];

const toneClasses = {
  success: 'border-emerald-600/35 bg-emerald-500/[0.06] text-emerald-800 dark:text-emerald-200',
  danger: 'border-red-600/35 bg-red-500/[0.06] text-red-800 dark:text-red-200',
  warning: 'border-amber-600/35 bg-amber-500/[0.07] text-amber-900 dark:text-amber-100',
};

function stateFor(path: number[], stageIndex: number, activeStep: number): StageState {
  if (!path.includes(stageIndex)) return 'skipped';
  if (stageIndex === activeStep) return 'active';
  if (stageIndex < activeStep) return 'complete';
  return 'waiting';
}

function StateIcon({ state }: { state: StageState }) {
  if (state === 'complete') return <Check className="h-3.5 w-3.5" aria-hidden="true" />;
  if (state === 'skipped') return <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />;
  if (state === 'active') return <Play className="h-3.5 w-3.5" aria-hidden="true" />;
  return <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />;
}

export default function DispatchViz() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('allow');
  const scenario = scenarios.find((item) => item.key === scenarioKey) ?? scenarios[0];

  return (
    <div data-dispatch-decision-lab>
      <StepViz steps={stages.map((stage) => ({ label: stage.title, body: stage.body }))}>
        {(activeStep) => (
          <div className="mx-auto grid w-full max-w-4xl min-w-0 gap-5">
            <div
              role="group"
              aria-label="도구 실행 시나리오"
              className="grid min-w-0 grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4"
            >
              {scenarios.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setScenarioKey(item.key)}
                  aria-pressed={scenarioKey === item.key}
                  data-dispatch-scenario={item.key}
                  className={`min-w-0 bg-background px-3 py-3 text-left transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 ${
                    scenarioKey === item.key ? 'bg-foreground text-background' : 'hover:bg-muted'
                  }`}
                >
                  <span className="block text-xs font-bold leading-5">{item.label}</span>
                  <span className={`mt-0.5 block text-[11px] leading-4 ${
                    scenarioKey === item.key ? 'text-background/70' : 'text-muted-foreground'
                  }`}>
                    {item.short}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid min-w-0 grid-cols-5 gap-1.5 sm:gap-2" aria-label={`${scenario.label} 실행 경로`}>
              {stages.map((stage, index) => {
                const state = stateFor(scenario.path, index, activeStep);
                const stateLabel = {
                  active: '현재 장면',
                  complete: '통과',
                  waiting: '대기',
                  skipped: '건너뜀',
                }[state];
                return (
                  <div
                    key={stage.label}
                    data-dispatch-stage={index}
                    data-stage-state={state}
                    className={`min-w-0 border px-2 py-3 transition-colors sm:px-3 ${
                      state === 'active'
                        ? 'border-blue-600 bg-blue-500/[0.07]'
                        : state === 'complete'
                          ? 'border-foreground/20 bg-background'
                          : state === 'skipped'
                            ? 'border-border bg-muted/35 text-muted-foreground'
                            : 'border-border bg-background text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold">{String(index + 1).padStart(2, '0')}</span>
                      <span
                        title={stateLabel}
                        aria-label={stateLabel}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          state === 'active'
                            ? 'border-blue-600 text-blue-700 dark:text-blue-300'
                            : state === 'complete'
                              ? 'border-emerald-600/50 text-emerald-700 dark:text-emerald-300'
                              : 'border-border text-muted-foreground'
                        }`}
                      >
                        <StateIcon state={state} />
                      </span>
                    </div>
                    <strong className={`mt-2 block break-words text-[11px] leading-4 sm:text-xs sm:leading-5 ${
                      state === 'skipped' ? 'line-through decoration-1' : ''
                    }`}>
                      {stage.label}
                    </strong>
                  </div>
                );
              })}
            </div>

            <div className="grid min-w-0 gap-1 border-y border-border bg-background px-4 py-3 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-baseline">
              <span className="text-[11px] font-bold text-muted-foreground">현재 호출</span>
              <code className="min-w-0 break-words text-[11px] leading-5 [overflow-wrap:anywhere]">
                {stages[activeStep].code}
              </code>
            </div>

            <div
              data-dispatch-outcome
              aria-live="polite"
              className={`grid min-w-0 gap-3 border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center ${toneClasses[scenario.tone]}`}
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                {scenarioKey === 'allow' ? (
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                ) : scenarioKey === 'unknown-tool' ? (
                  <SearchX className="h-4 w-4" aria-hidden="true" />
                ) : scenarioKey === 'hook-deny' ? (
                  <OctagonX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Ban className="h-4 w-4" aria-hidden="true" />
                )}
                <code className="break-all text-[11px]">{scenario.outcome}</code>
              </div>
              <p className="min-w-0 text-xs leading-5">{scenario.evidence}</p>
            </div>
          </div>
        )}
      </StepViz>
    </div>
  );
}
