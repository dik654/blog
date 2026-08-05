import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  GitCompareArrows,
  Gauge,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';

const lifecycle = [
  {
    id: '01',
    label: 'SFT dataset',
    row: '{ prompt, demonstration }',
    maker: '평가자가 원하는 답을 직접 작성',
    update: 'completion token likelihood를 높임',
    icon: MessageSquareText,
    tone: 'text-blue-700 dark:text-blue-300',
  },
  {
    id: '02',
    label: 'RM dataset',
    row: '{ prompt, ranked completions[] }',
    maker: '현재 model 답 K개를 평가자가 순위화',
    update: '선호 순서를 scalar 차이로 맞힘',
    icon: GitCompareArrows,
    tone: 'text-violet-700 dark:text-violet-300',
  },
  {
    id: '03',
    label: 'PPO dataset',
    row: '{ prompt }',
    maker: '사람 label 없이 actor가 새 응답 생성',
    update: 'RM reward와 제약으로 policy를 이동',
    icon: Gauge,
    tone: 'text-amber-700 dark:text-amber-300',
  },
] as const;

export function RLHFDataContractViz() {
  return (
    <div className="not-prose my-8 border-y border-border" data-rlhf-data-contract>
      <div className="border-b border-border px-4 py-5 sm:px-6">
        <p className="text-[10px] font-black uppercase text-muted-foreground">One prompt, three contracts</p>
        <p className="mt-2 text-base font-black">같은 prompt라도 단계마다 사람이 만드는 데이터와 직접 맞히는 값이 다르다</p>
      </div>
      <div className="grid gap-px bg-border lg:grid-cols-3">
        {lifecycle.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="min-w-0 bg-background px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-2xl font-black text-muted-foreground/50">{step.id}</span>
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${step.tone}`} aria-hidden="true" />
                  {index < lifecycle.length - 1 && <ArrowRight className="hidden h-4 w-4 text-muted-foreground lg:block" aria-hidden="true" />}
                </div>
              </div>
              <p className={`mt-5 text-sm font-black ${step.tone}`}>{step.label}</p>
              <code className="mt-3 block break-words text-xs font-bold [overflow-wrap:anywhere]">{step.row}</code>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-[10px] font-black text-muted-foreground">데이터를 만드는 일</p>
                <p className="mt-1 text-sm font-bold leading-6">{step.maker}</p>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-[10px] font-black text-muted-foreground">직접 학습하는 일</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.update}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const completions = [
  { id: 'A', score: 1.2, rank: 1, note: '요청을 정확히 따르고 근거를 구분' },
  { id: 'B', score: 0.4, rank: 2, note: '대체로 유용하지만 한 제약을 놓침' },
  { id: 'C', score: -0.2, rank: 3, note: '관련은 있지만 장황하고 모호함' },
  { id: 'D', score: -1.0, rank: 4, note: '핵심 지시를 따르지 않음' },
  { id: 'E', score: -1.5, rank: 5, note: '부정확하고 위험한 단정을 포함' },
] as const;

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

export function RankingBatchLab() {
  const [k, setK] = useState<4 | 5>(4);
  const [offset, setOffset] = useState<0 | 100>(0);
  const active = completions.slice(0, k);
  const pairs = (() => {
    const next: Array<{ winner: typeof completions[number]; loser: typeof completions[number] }> = [];
    active.forEach((winner, i) => active.slice(i + 1).forEach((loser) => next.push({ winner, loser })));
    return next;
  })();
  const meanLoss = pairs.reduce((sum, pair) => sum - Math.log(sigmoid(pair.winner.score - pair.loser.score)), 0) / pairs.length;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-ranking-batch>
      <div className="grid gap-4 border-b border-border bg-muted/20 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground">Ranking batch lab</p>
          <p className="mt-2 text-base font-black">한 prompt의 K개 답을 한 묶음으로 유지한다</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button type="button" aria-pressed={k === 4} onClick={() => setK(4)} className={`min-h-11 rounded-md border px-3 text-xs font-black ${k === 4 ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground'}`}>K = 4</button>
          <button type="button" aria-pressed={k === 5} onClick={() => setK(5)} className={`min-h-11 rounded-md border px-3 text-xs font-black ${k === 5 ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground'}`}>K = 5</button>
          <button type="button" aria-pressed={offset === 0} onClick={() => setOffset(0)} className={`min-h-11 rounded-md border px-3 text-xs font-black ${offset === 0 ? 'border-violet-700 bg-violet-500/[0.08] text-violet-800 dark:text-violet-200' : 'border-border bg-background text-muted-foreground'}`}>원래 score</button>
          <button type="button" aria-pressed={offset === 100} onClick={() => setOffset(100)} className={`min-h-11 rounded-md border px-3 text-xs font-black ${offset === 100 ? 'border-violet-700 bg-violet-500/[0.08] text-violet-800 dark:text-violet-200' : 'border-border bg-background text-muted-foreground'}`}>모두 +100</button>
        </div>
      </div>

      <div className="grid gap-7 p-4 sm:p-6 xl:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)]">
        <div className="min-w-0">
          <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-black text-muted-foreground">평가자 순위</p>
              <p className="mt-1 text-xl font-black">{active.map((item) => item.id).join(' > ')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-muted-foreground">PAIR 수</p>
              <p className="mt-1 font-mono text-2xl font-black" data-pair-count>{pairs.length}</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {active.map((item) => (
              <div key={item.id} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3 py-4">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-border text-xs font-black">{item.id}</span>
                <div className="min-w-0">
                  <p className="text-xs font-black">{item.rank}위 응답</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
                </div>
                <code className="text-xs font-black text-violet-700 dark:text-violet-300">{(item.score + offset).toFixed(1)}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 border-t border-border pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-muted-foreground">같은 prompt 안에서 만든 비교</p>
              <p className="mt-1 text-sm font-black">K(K-1)/2 = {pairs.length}</p>
            </div>
            <GitCompareArrows className="h-5 w-5 text-violet-700 dark:text-violet-300" aria-hidden="true" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            {pairs.map(({ winner, loser }) => {
              const probability = sigmoid(winner.score - loser.score);
              return (
                <div key={`${winner.id}-${loser.id}`} className="min-w-0 bg-background px-3 py-3">
                  <p className="text-xs font-black">{winner.id} &gt; {loser.id}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">σ(Δ) = {probability.toFixed(3)}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-black text-muted-foreground">평균 pair loss</p>
              <p className="mt-1 font-mono text-xl font-black" data-rm-loss>{meanLoss.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground">Offset을 바꾼 뒤</p>
              <p className="mt-1 text-sm font-black text-emerald-700 dark:text-emerald-300">확률과 loss는 그대로</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            모든 score에 같은 상수를 더하면 차이는 변하지 않는다. 그래서 순위 학습만으로 reward의 절대 0점은 정해지지 않는다.
          </p>
        </div>
      </div>
    </div>
  );
}

type UpdateCase = 'positive' | 'negative' | 'inside';

const updateCases: Record<UpdateCase, {
  label: string;
  oldProbability: number;
  newProbability: number;
  advantage: number;
  explanation: string;
}> = {
  positive: {
    label: '좋은 token을 너무 올림',
    oldProbability: 0.2,
    newProbability: 0.27,
    advantage: 2,
    explanation: '좋았던 token의 확률을 높이는 방향은 맞지만 ratio 1.35의 추가 이득은 1.20에서 멈춘다.',
  },
  negative: {
    label: '나쁜 token을 너무 내림',
    oldProbability: 0.2,
    newProbability: 0.14,
    advantage: -2,
    explanation: '나쁜 token의 확률을 내리더라도 ratio 0.70까지 한 번에 이동한 것을 낙관적으로 보상하지 않는다.',
  },
  inside: {
    label: '허용 범위 안의 이동',
    oldProbability: 0.2,
    newProbability: 0.22,
    advantage: 1.5,
    explanation: 'ratio 1.10은 [0.80, 1.20] 안이므로 unclipped와 clipped 항이 같다.',
  },
};

export function PPOUpdateLab() {
  const [selected, setSelected] = useState<UpdateCase>('positive');
  const item = updateCases[selected];
  const epsilon = 0.2;
  const ratio = item.newProbability / item.oldProbability;
  const clippedRatio = Math.min(1 + epsilon, Math.max(1 - epsilon, ratio));
  const raw = ratio * item.advantage;
  const clipped = clippedRatio * item.advantage;
  const objective = Math.min(raw, clipped);
  const isClipped = Math.abs(raw - clipped) > 1e-9 && objective === clipped;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-ppo-update-lab>
      <div className="border-b border-border bg-muted/20 px-4 py-5 sm:px-6">
        <p className="text-[10px] font-black uppercase text-muted-foreground">PPO token update lab</p>
        <p className="mt-2 text-base font-black">같은 rollout token을 old policy와 current policy가 준 확률로 비교한다</p>
      </div>
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
        {(Object.keys(updateCases) as UpdateCase[]).map((key) => (
          <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)} className={`min-h-14 bg-background px-3 py-3 text-left text-xs font-black transition-colors ${selected === key ? 'text-amber-800 shadow-[inset_0_-2px_0_currentColor] dark:text-amber-200' : 'text-muted-foreground hover:bg-muted/35'}`}>
            {updateCases[key].label}
          </button>
        ))}
      </div>
      <div className="grid gap-7 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]">
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
            {[
              ['old 확률', item.oldProbability.toFixed(2)],
              ['current 확률', item.newProbability.toFixed(2)],
              ['advantage', `${item.advantage > 0 ? '+' : ''}${item.advantage.toFixed(1)}`],
              ['ε', epsilon.toFixed(1)],
            ].map(([label, value]) => (
              <div key={label} className="bg-background px-3 py-4">
                <p className="text-[10px] font-black text-muted-foreground">{label}</p>
                <p className="mt-1 font-mono text-lg font-black">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{item.explanation}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="grid gap-4">
            {[
              ['확률 비율', `${item.newProbability.toFixed(2)} / ${item.oldProbability.toFixed(2)} = ${ratio.toFixed(2)}`],
              ['그대로 계산', `${ratio.toFixed(2)} × ${item.advantage.toFixed(1)} = ${raw.toFixed(2)}`],
              ['clip 뒤 계산', `${clippedRatio.toFixed(2)} × ${item.advantage.toFixed(1)} = ${clipped.toFixed(2)}`],
            ].map(([label, value], index) => (
              <div key={label} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 border-b border-border pb-4 last:border-b-0">
                <span className="font-mono text-xs font-black text-muted-foreground">0{index + 1}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-muted-foreground">{label}</p>
                  <code className="mt-1 block break-words text-sm font-black [overflow-wrap:anywhere]">{value}</code>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="text-[10px] font-black text-muted-foreground">min이 고른 목적값</p>
              <p className="mt-1 font-mono text-2xl font-black" data-ppo-objective>{objective.toFixed(2)}</p>
            </div>
            <span className={`rounded-sm border px-2 py-1 text-[10px] font-black ${isClipped ? 'border-amber-700/40 bg-amber-500/[0.08] text-amber-800 dark:text-amber-200' : 'border-emerald-700/40 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-200'}`}>
              {isClipped ? 'CLIPPED' : 'IN RANGE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const guardrails = [
  {
    label: '한 update의 이동',
    title: 'old policy ratio + clipping',
    body: 'Rollout을 만든 policy와 현재 policy를 비교한다. 같은 batch를 여러 epoch 쓰는 동안 선택 token 확률의 과도한 이득을 잘라낸다.',
    icon: Scale,
    tone: 'text-amber-700 dark:text-amber-300',
  },
  {
    label: '누적된 분포 이동',
    title: 'frozen SFT reference + KL',
    body: '여러 update 뒤 actor가 시작 policy에서 얼마나 멀어졌는지 벌점으로 만든다. Clipping과 기준 model이 다르다.',
    icon: ShieldCheck,
    tone: 'text-violet-700 dark:text-violet-300',
  },
  {
    label: '기존 능력 유지',
    title: 'pretraining gradient mix',
    body: 'PPO-ptx는 pretraining text의 log likelihood gradient를 별도로 섞는다. InstructGPT에서는 KL 계수만 크게 한 것과 같은 효과가 아니었다.',
    icon: Braces,
    tone: 'text-teal-700 dark:text-teal-300',
  },
] as const;

export function TwoDistanceViz() {
  return (
    <div className="not-prose my-8 border-y border-border" data-two-distance>
      <div className="grid gap-px bg-border lg:grid-cols-3">
        {guardrails.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="min-w-0 bg-background px-4 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-2xl font-black text-muted-foreground/50">0{index + 1}</span>
                <Icon className={`h-5 w-5 ${item.tone}`} aria-hidden="true" />
              </div>
              <p className="mt-5 text-[10px] font-black text-muted-foreground">{item.label}</p>
              <p className={`mt-1 text-sm font-black ${item.tone}`}>{item.title}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-3 border-t border-border px-4 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:px-6">
        <BadgeCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        <p className="text-sm leading-6 text-muted-foreground"><strong className="text-foreground">세 장치는 대체 관계가 아니다.</strong> Local update, reference drift, capability retention이라는 서로 다른 실패를 맡는다.</p>
      </div>
    </div>
  );
}

export function PreferenceScopeBand() {
  return (
    <div className="not-prose my-8 grid gap-px border-y border-border bg-border sm:grid-cols-3" data-preference-scope>
      {[
        { icon: Users, label: '누가 평가했나', body: 'InstructGPT는 약 40명의 선별된 contractor와 연구자 지침에 의존했다.' },
        { icon: Scale, label: '무엇에 합의했나', body: '훈련 평가자 간 agreement도 100%가 아니었다. 선호에는 본질적인 불일치가 남는다.' },
        { icon: ShieldCheck, label: '어디까지 검증했나', body: 'Held-out 평가자도 같은 vendor 모집 범위였다. 사회 전체의 보편 가치 검증은 아니다.' },
      ].map(({ icon: Icon, label, body }) => (
        <div key={label} className="min-w-0 bg-background px-4 py-5 sm:px-5">
          <Icon className="h-4 w-4 text-violet-700 dark:text-violet-300" aria-hidden="true" />
          <p className="mt-4 text-xs font-black">{label}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}
