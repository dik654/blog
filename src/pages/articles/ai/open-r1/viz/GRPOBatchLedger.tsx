import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Equal, XCircle } from 'lucide-react';

type GroupMode = 'mixed' | 'all-correct' | 'all-wrong';

const groups: Record<GroupMode, { label: string; rewards: number[]; summary: string }> = {
  mixed: {
    label: '비교 가능',
    rewards: [1, 1, 0, 0],
    summary: '성공과 실패가 함께 있어 어떤 completion을 올리고 내릴지 비교할 수 있다.',
  },
  'all-correct': {
    label: '전부 정답',
    rewards: [1, 1, 1, 1],
    summary: '이미 모두 성공했다. ε은 계산만 살리고, 서로의 차이는 만들지 못한다.',
  },
  'all-wrong': {
    label: '전부 오답',
    rewards: [0, 0, 0, 0],
    summary: '현재 policy가 성공 후보를 하나도 sample하지 못했다. 더 어려운 update가 아니라 탐색·curriculum 문제가 된다.',
  },
};

function NumericControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 border-l-2 border-border pl-3">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value) || min)))}
        className="h-11 w-full rounded-sm border border-border bg-background px-2 font-mono text-sm font-bold tabular-nums outline-none focus:border-blue-500"
      />
    </label>
  );
}

export default function GRPOBatchLedger() {
  const [mode, setMode] = useState<GroupMode>('mixed');
  const [prompts, setPrompts] = useState(8);
  const [generations, setGenerations] = useState(16);
  const [completionLength, setCompletionLength] = useState(2048);
  const group = groups[mode];

  const stats = useMemo(() => {
    const mean = group.rewards.reduce((sum, value) => sum + value, 0) / group.rewards.length;
    const variance = group.rewards.reduce((sum, value) => sum + (value - mean) ** 2, 0) / group.rewards.length;
    const std = Math.sqrt(variance);
    const advantages = group.rewards.map((value) => (std === 0 ? 0 : (value - mean) / std));
    return { mean, std, advantages };
  }, [group.rewards]);

  const tokenBudget = prompts * generations * completionLength;
  const StatusIcon = mode === 'mixed' ? CheckCircle2 : mode === 'all-correct' ? Equal : XCircle;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-grpo-ledger>
      <div className="grid gap-4 border-b border-border px-4 py-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-6">
        <div>
          <p className="font-mono text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">한 prompt · 축약된 4개 completion</p>
          <h3 className="mt-2 text-base font-black">Reward가 실제 update 신호가 되는 순간</h3>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-md bg-muted p-1" aria-label="reward group 상태">
          {(Object.keys(groups) as GroupMode[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              aria-pressed={mode === key}
              className={`min-h-11 rounded-sm px-2 text-xs font-bold transition-colors ${mode === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {groups[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {group.rewards.map((reward, index) => {
            const advantage = stats.advantages[index];
            const positive = advantage > 0;
            const negative = advantage < 0;
            return (
              <motion.div key={`${mode}-${index}`} initial={{ opacity: 0.4, y: 3 }} animate={{ opacity: 1, y: 0 }} className="min-w-0 border-t-2 border-border bg-muted/25 px-3 py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-muted-foreground">o{index + 1}</span>
                  <span className={`h-2 w-2 rounded-full ${reward ? 'bg-teal-500' : 'bg-rose-500'}`} aria-hidden="true" />
                </div>
                <p className="mt-4 font-mono text-xl font-black tabular-nums">r = {reward.toFixed(0)}</p>
                <p className={`mt-2 font-mono text-sm font-black tabular-nums ${positive ? 'text-teal-700 dark:text-teal-300' : negative ? 'text-rose-700 dark:text-rose-300' : 'text-muted-foreground'}`}>
                  A = {advantage > 0 ? '+' : ''}{advantage.toFixed(1)}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-border pt-5 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground">그룹 평균</p>
            <p className="mt-1 font-mono text-lg font-black tabular-nums">{stats.mean.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground">표준편차</p>
            <p className="mt-1 font-mono text-lg font-black tabular-nums">{stats.std.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={`mx-4 mb-6 flex min-h-20 items-start gap-3 border-l-2 px-4 py-3 lg:mx-6 ${mode === 'mixed' ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/20' : mode === 'all-wrong' ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/20' : 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/20'}`}>
        <StatusIcon className={`mt-0.5 h-4 w-4 shrink-0 ${mode === 'mixed' ? 'text-teal-700 dark:text-teal-300' : mode === 'all-wrong' ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300'}`} aria-hidden="true" />
        <p className="text-sm leading-6 text-muted-foreground">{group.summary}</p>
      </div>

      <div className="border-t border-border bg-muted/20 px-4 py-6 lg:px-6">
        <div className="mb-5 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-sm leading-6 text-muted-foreground">
            아래는 생성 상한이다. 실제 optimizer batch는 device 수, per-device batch, gradient accumulation과 trainer의 prompt 배치 방식으로 따로 결정된다.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumericControl label="서로 다른 prompt P" value={prompts} min={1} max={128} onChange={setPrompts} />
          <NumericControl label="prompt당 생성 G" value={generations} min={2} max={64} onChange={setGenerations} />
          <NumericControl label="최대 completion C" value={completionLength} min={128} max={32768} onChange={setCompletionLength} />
        </div>
        <div className="mt-6 grid gap-2 border-y border-border py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-black uppercase text-muted-foreground">P × G × C · sampled completion upper bound</p>
            <p className="mt-2 text-sm text-muted-foreground">{prompts} × {generations} × {completionLength.toLocaleString('ko-KR')}</p>
          </div>
          <p className="font-mono text-2xl font-black tabular-nums text-blue-700 dark:text-blue-300">{tokenBudget.toLocaleString('ko-KR')} tokens</p>
        </div>
      </div>
    </div>
  );
}
