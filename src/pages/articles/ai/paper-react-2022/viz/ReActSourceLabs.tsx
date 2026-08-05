import { useState } from 'react';
import { ArrowDown, Check, Search, SquareTerminal, TriangleAlert } from 'lucide-react';

type Transition = 'thought' | 'action' | 'finish';

const transitionData: Record<Transition, {
  label: string;
  proposal: string;
  context: string;
  environment: string;
  observation: string;
}> = {
  thought: {
    label: 'Thought · language action',
    proposal: '“두 번째 도시의 국가를 먼저 찾아야 한다.”',
    context: '문장이 history에 추가됨',
    environment: '변화 없음',
    observation: '외부 observation 없음',
  },
  action: {
    label: 'Action · search[entity]',
    proposal: 'search[Colorado orogeny]',
    context: 'action과 새 observation이 추가됨',
    environment: 'Wikipedia API를 호출함',
    observation: '첫 다섯 문장을 반환',
  },
  finish: {
    label: 'Finish · finish[answer]',
    proposal: 'finish[United States]',
    context: '최종 answer가 기록됨',
    environment: 'episode 종료',
    observation: 'task reward를 계산',
  },
};

export function ReActTransitionLab() {
  const [transition, setTransition] = useState<Transition>('thought');
  const selected = transitionData[transition];

  return (
    <figure data-react-transition-lab className="not-prose my-8 border-y border-border">
      <header className="grid grid-cols-3 border-x border-border" role="tablist" aria-label="ReAct transition 유형">
        {(Object.keys(transitionData) as Transition[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-label={transitionData[key].label}
            aria-selected={transition === key}
            onClick={() => setTransition(key)}
            className={`min-h-12 border-b-2 px-3 text-xs font-bold sm:text-sm ${transition === key ? 'border-foreground bg-muted/35' : 'border-transparent text-muted-foreground hover:bg-muted/20'}`}
          >
            {transitionData[key].label.split(' · ')[0]}
          </button>
        ))}
      </header>
      <div className="py-5">
        <p className="text-xs font-semibold text-muted-foreground">Policy proposal</p>
        <p className="mt-2 break-words font-mono text-sm font-bold leading-relaxed">{selected.proposal}</p>
        <ArrowDown className="my-4 size-4 text-muted-foreground" aria-hidden="true" />
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {[
            ['Context cₜ₊₁', selected.context],
            ['Environment', selected.environment],
            ['Observation oₜ₊₁', selected.observation],
          ].map(([label, value], index) => (
            <div key={label} className={`min-w-0 p-4 ${index === 1 && transition === 'action' ? 'bg-emerald-950 text-emerald-50 dark:bg-emerald-100 dark:text-emerald-950' : 'bg-background'}`}>
              <p className={`text-xs font-semibold ${index === 1 && transition === 'action' ? 'text-current/70' : 'text-muted-foreground'}`}>{label}</p>
              <p className="mt-2 text-sm font-bold leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="pb-5 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">불변식.</strong> Thought는 다음 판단에 보일 context만 바꾼다. Action만 environment를 호출하고 observation을 되돌려 받는다. Finish는 answer를 제출하고 loop를 닫는다.
      </figcaption>
    </figure>
  );
}

type Task = 'hotpot' | 'fever' | 'alfworld' | 'webshop';

const taskData: Record<Task, {
  label: string;
  metric: string;
  rows: Array<{ method: string; value: number; display: string; note?: string }>;
  boundary: string;
}> = {
  hotpot: {
    label: 'HotpotQA',
    metric: 'EM · 높을수록 좋음',
    rows: [
      { method: 'Standard', value: 28.7, display: '28.7' },
      { method: 'CoT', value: 29.4, display: '29.4' },
      { method: 'Act', value: 25.7, display: '25.7' },
      { method: 'CoT-SC', value: 33.4, display: '33.4' },
      { method: 'ReAct', value: 27.4, display: '27.4' },
      { method: 'CoT-SC → ReAct', value: 34.2, display: '34.2' },
      { method: 'ReAct → CoT-SC', value: 35.1, display: '35.1', note: 'best prompting result' },
    ],
    boundary: 'ReAct 단독은 CoT-SC보다 낮다. 서로 다른 실패를 보완한 hybrid가 가장 높다.',
  },
  fever: {
    label: 'FEVER',
    metric: 'Accuracy · 높을수록 좋음',
    rows: [
      { method: 'Standard', value: 57.1, display: '57.1' },
      { method: 'CoT', value: 56.3, display: '56.3' },
      { method: 'CoT-SC', value: 60.4, display: '60.4' },
      { method: 'Act', value: 58.9, display: '58.9' },
      { method: 'ReAct', value: 60.9, display: '60.9' },
      { method: 'CoT-SC → ReAct', value: 64.6, display: '64.6', note: 'best prompting result' },
      { method: 'ReAct → CoT-SC', value: 62.0, display: '62.0' },
    ],
    boundary: 'FEVER에서는 ReAct 단독도 CoT-SC를 조금 넘지만, hybrid의 개선 폭이 더 크다.',
  },
  alfworld: {
    label: 'ALFWorld',
    metric: 'Success rate · 134 tasks',
    rows: [
      { method: 'BUTLER', value: 37, display: '37%' },
      { method: 'Act', value: 45, display: '45%' },
      { method: 'ReAct-IM', value: 53, display: '53%' },
      { method: 'ReAct · best of 6', value: 71, display: '71%', note: 'best run' },
    ],
    boundary: 'Sparse thought가 subgoal과 exception을 추적해 action-only보다 성공률을 높였다. 여섯 prompt/run 중 best 결과임을 함께 읽어야 한다.',
  },
  webshop: {
    label: 'WebShop',
    metric: 'Task score / success rate',
    rows: [
      { method: 'IL', value: 59.9, display: '59.9 / 29.1%' },
      { method: 'IL + RL', value: 62.4, display: '62.4 / 28.7%' },
      { method: 'Act', value: 62.3, display: '62.3 / 30.1%' },
      { method: 'ReAct', value: 66.6, display: '66.6 / 40.0%', note: 'best model result' },
      { method: 'Human', value: 82.1, display: '82.1 / 59.6%' },
    ],
    boundary: 'ReAct가 model baselines를 넘었지만 human과 큰 간격이 남았다. Partial score와 exact success를 같은 수치로 합치면 안 된다.',
  },
};

export function ReActEvidenceLab({ defaultTask = 'hotpot' }: { defaultTask?: Task }) {
  const [task, setTask] = useState<Task>(defaultTask);
  const selected = taskData[task];
  const max = Math.max(...selected.rows.map((row) => row.value));

  return (
    <figure data-react-evidence-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-wrap gap-1 py-4" role="tablist" aria-label="ReAct evidence task">
        {(Object.keys(taskData) as Task[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={task === key}
            onClick={() => setTask(key)}
            className={`min-h-9 rounded-md border px-3 text-xs font-bold ${task === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'}`}
          >
            {taskData[key].label}
          </button>
        ))}
      </header>
      <div className="border-t border-border py-5">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-bold">{selected.label}</p>
          <p className="text-xs text-muted-foreground">{selected.metric}</p>
        </div>
        <div className="space-y-4">
          {selected.rows.map((row) => (
            <div key={row.method} className="grid min-w-0 gap-2 sm:grid-cols-[9rem_minmax(0,1fr)_8rem] sm:items-center">
              <p className="text-xs font-semibold sm:text-sm">{row.method}</p>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${row.note ? 'bg-emerald-600' : 'bg-foreground/45'}`} style={{ width: `${(row.value / max) * 100}%` }} />
              </div>
              <p className="font-mono text-xs font-bold sm:text-right">{row.display}</p>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="flex gap-2 pb-5 text-xs leading-relaxed text-muted-foreground">
        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
        {selected.boundary}
      </figcaption>
    </figure>
  );
}

type FailureMode = 'success' | 'failure';

export function ReActFailureLab() {
  const [mode, setMode] = useState<FailureMode>('failure');
  const rows = mode === 'success'
    ? [
      ['True positive', 94, '근거와 답이 맞음'],
      ['Hallucination', 6, '성공 label이지만 근거 연결에 오류'],
    ] as const
    : [
      ['Reasoning error', 47, '찾은 정보를 잘못 연결하거나 다음 판단이 틀림'],
      ['Non-informative search', 23, '검색 action이 필요한 observation을 못 줌'],
      ['Hallucination', 0, '수동 분석 sample에서는 관측되지 않음'],
      ['CoT failure의 hallucination', 56, '도구 근거가 없는 CoT 실패와 대조'],
    ] as const;

  return (
    <figure data-react-failure-lab className="not-prose my-8 border-y border-border">
      <header className="grid border-x border-border sm:grid-cols-2" role="tablist" aria-label="ReAct 수동 오류 분석">
        {([
          ['success', 'ReAct 성공 trajectory'],
          ['failure', 'ReAct 실패 · CoT 대조'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`min-h-12 border-b-2 px-3 text-xs font-bold sm:text-sm ${mode === key ? 'border-foreground bg-muted/35' : 'border-transparent text-muted-foreground hover:bg-muted/20'}`}
          >
            {label}
          </button>
        ))}
      </header>
      <div className="space-y-5 py-5">
        {rows.map(([label, value, note]) => (
          <div key={label} className="grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)_3rem] sm:items-center">
            <div>
              <p className="text-xs font-bold sm:text-sm">{label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${label.includes('CoT') ? 'bg-amber-500' : 'bg-foreground/60'}`} style={{ width: `${Math.max(1, value)}%` }} />
            </div>
            <p className="font-mono text-xs font-bold sm:text-right">{value}%</p>
          </div>
        ))}
      </div>
      <figcaption className="flex gap-2 pb-5 text-xs leading-relaxed text-muted-foreground">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        Table 2는 HotpotQA의 성공·실패 trajectory를 각각 50개씩 수동 분류한 분석이다. 모든 category를 합쳐 100%가 되는 단일 분포가 아니며,
        FEVER의 오류 분포로 일반화하지 않는다. 실패 원인이 “환각만”이 아니라 reasoning과 search quality로 이동했다는 비교로 읽는다.
      </figcaption>
    </figure>
  );
}

export function WikipediaActionTrace() {
  const [step, setStep] = useState(0);
  const steps = [
    { action: 'search[Milhouse]', observation: 'Milhouse Mussolini Van Houten is a recurring character in The Simpsons...', owner: 'entity 이름을 Wikipedia page의 첫 문장들로 바꾼다.' },
    { action: 'lookup[named after]', observation: 'Milhouse was named after U.S. president Richard Nixon, whose middle name was Milhous.', owner: '현재 page에서 exact string을 포함한 다음 근거 문장을 찾는다.' },
    { action: 'finish[Richard Nixon]', observation: 'Episode closed · answer submitted', owner: '찾은 근거에서 답을 제출하고 더 이상의 action을 막는다.' },
  ];
  const selected = steps[step];

  return (
    <figure data-react-wikipedia-trace className="not-prose my-8 border-y border-border">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-2">
          {step < 2 ? <Search className="size-4 text-muted-foreground" aria-hidden="true" /> : <SquareTerminal className="size-4 text-muted-foreground" aria-hidden="true" />}
          <p className="text-sm font-bold">Wikipedia API trace</p>
        </div>
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setStep(index)}
              aria-label={`Step ${index + 1}`}
              className={`size-9 rounded-md border text-xs font-bold ${step === index ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">Action</p>
          <p className="mt-2 break-words font-mono text-sm font-bold">{selected.action}</p>
        </div>
        <div className="min-w-0 bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">Observation</p>
          <p className="mt-2 text-sm leading-relaxed">{selected.observation}</p>
        </div>
      </div>
      <figcaption className="py-5 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">이 step의 책임.</strong> {selected.owner}
      </figcaption>
    </figure>
  );
}
