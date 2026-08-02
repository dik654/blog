import { useState } from 'react';

const planningCounts = [0, 5, 50] as const;
const dynaModes = {
  before: {
    label: '변경 전',
    start: 0,
    target: 5,
    evidence: 'Model과 현실 모두 goal reward 5를 가리킨다.',
    tone: 'text-emerald-700 dark:text-emerald-300',
  },
  stale: {
    label: '벽 이동 · stale model',
    start: 4,
    target: 5,
    evidence: '실제 transition 한 번은 Q를 5→4로 낮췄지만 model은 옛 target 5를 계속 만든다.',
    tone: 'text-rose-700 dark:text-rose-300',
  },
  refreshed: {
    label: 'Model 교정 후',
    start: 4,
    target: 0,
    evidence: '새 transition으로 model target도 0이 되어 planning이 실제 교정을 전파한다.',
    tone: 'text-sky-700 dark:text-sky-300',
  },
} as const;

type DynaMode = keyof typeof dynaModes;

export function DynaStalenessLab() {
  const [mode, setMode] = useState<DynaMode>('stale');
  const [updates, setUpdates] = useState<(typeof planningCounts)[number]>(5);
  const current = dynaModes[mode];
  const alpha = 0.2;
  const q = current.target + (current.start - current.target) * (1 - alpha) ** updates;

  return (
    <figure data-dyna-staleness className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-sky-700 dark:text-sky-300">DYNA STALENESS LAB</span>
        <strong className="text-sm leading-snug">Planning 횟수는 model target을 더 빨리 믿게 한다</strong>
        <span data-dyna-q className={`font-mono text-lg font-black ${current.tone}`}>Q {q.toFixed(2)}</span>
      </figcaption>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex flex-wrap gap-2" aria-label="Dyna environment state">
            {(Object.keys(dynaModes) as DynaMode[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`min-h-10 border px-3 text-xs font-bold transition-colors ${mode === key ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}
              >
                {dynaModes[key].label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
            <div className="min-w-0 border-l-2 border-emerald-600 pl-3">
              <p className="text-xs font-bold text-muted-foreground">실제 evidence 뒤 Q</p>
              <p data-dyna-start className="mt-1 font-mono text-2xl font-black">{current.start.toFixed(2)}</p>
            </div>
            <div className="h-px w-8 bg-border sm:w-16" aria-hidden="true" />
            <div className="min-w-0 border-l-2 border-sky-600 pl-3">
              <p className="text-xs font-bold text-muted-foreground">Model target</p>
              <p data-dyna-target className="mt-1 font-mono text-2xl font-black">{current.target.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden bg-muted" aria-label="Q value on zero to five scale">
            <div className="h-full bg-sky-600 transition-[width] duration-300" style={{ width: `${Math.max(0, Math.min(100, (q / 5) * 100))}%` }} />
          </div>
          <p className="mt-3 text-xs font-semibold leading-relaxed text-muted-foreground">{current.evidence}</p>
        </div>

        <div className="min-w-0 bg-sky-500/[0.035] p-4 sm:p-5">
          <p className="text-xs font-bold text-muted-foreground">가상 backup 횟수 n</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {planningCounts.map((count) => (
              <button
                key={count}
                type="button"
                aria-label={`planning updates ${count}`}
                onClick={() => setUpdates(count)}
                className={`min-h-10 border font-mono text-xs font-black ${updates === count ? 'border-sky-700 bg-sky-700 text-white' : 'border-border bg-background'}`}
              >
                {count}
              </button>
            ))}
          </div>
          <div className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            <p><span className="font-mono font-black text-foreground">alpha .20</span>인 같은 scalar backup을 n번 반복한다.</p>
            <p className="mt-2">Stale 상태에서는 실제 교정 <span className="font-mono font-bold text-foreground">5→4</span>가 가상 update 뒤 다시 <span className="font-mono font-bold text-foreground">5</span> 쪽으로 지워진다.</p>
          </div>
        </div>
      </div>
    </figure>
  );
}

const muZeroSteps = [
  { depth: 1, action: 'RIGHT', prior: ['.30', '.45', '.25'], reward: 1, policy: ['.20', '.70', '.10'], value: '3.60', source: '보상은 실제 환경 기록 · policy는 MCTS 방문 비율 · value는 실제 보상과 bootstrap을 결합' },
  { depth: 2, action: 'BOOST', prior: ['.25', '.25', '.50'], reward: 0.5, policy: ['.10', '.20', '.70'], value: '2.40', source: '두 번째 실제 보상 · 해당 replay state의 MCTS 방문 비율 · n-step value target' },
  { depth: 3, action: 'BRAKE', prior: ['.60', '.20', '.20'], reward: -0.2, policy: ['.80', '.10', '.10'], value: '1.10', source: '세 번째 실제 보상 · 더 짧아진 미래 증거 · bootstrap을 포함한 value target' },
] as const;

export function MuZeroTargetTrace() {
  const [depth, setDepth] = useState(1);
  const current = muZeroSteps[depth - 1];

  return (
    <figure data-muzero-target className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">MUZERO TARGET TRACE</span>
        <strong className="text-sm leading-snug">가상 latent는 실제 reward·search policy·return target에 맞춰진다</strong>
      </figcaption>

      <div className="grid gap-px bg-border lg:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="bg-violet-500/[0.04] p-4">
          <p className="text-xs font-bold text-muted-foreground">Unroll depth</p>
          <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
            {muZeroSteps.map((step) => (
              <button
                key={step.depth}
                type="button"
                aria-label={`MuZero depth ${step.depth}`}
                onClick={() => setDepth(step.depth)}
                className={`min-h-10 border px-3 text-left font-mono text-xs font-black ${depth === step.depth ? 'border-violet-700 bg-violet-700 text-white' : 'border-border bg-background'}`}
              >
                k = {step.depth}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            <div className="min-w-0 bg-background p-4">
              <p className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">g · DYNAMICS</p>
              <p className="mt-3 text-xs text-muted-foreground">입력 action</p>
              <p data-muzero-action className="mt-1 font-mono text-lg font-black">{current.action}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">이전 latent에서 다음 latent와 reward prediction을 만든다.</p>
            </div>
            <div className="min-w-0 bg-background p-4">
              <p className="font-mono text-xs font-black text-sky-700 dark:text-sky-300">f · PREDICTION</p>
              <p className="mt-3 text-xs text-muted-foreground">Model policy prior</p>
              <p data-muzero-prior className="mt-1 break-words font-mono text-lg font-black">[{current.prior.join(', ')}]</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">새 latent만 보고 search 시작 전의 prior를 낸다.</p>
            </div>
            <div className="min-w-0 bg-amber-500/[0.035] p-4">
              <p className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">TRAINING TARGET</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">reward</p><p data-muzero-reward className="font-mono text-lg font-black">{current.reward.toFixed(1)}</p></div>
                <div><p className="text-xs text-muted-foreground">value</p><p data-muzero-value className="font-mono text-lg font-black">{current.value}</p></div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">MCTS policy target</p>
              <p data-muzero-policy className="mt-1 break-words font-mono text-base font-black">[{current.policy.join(', ')}]</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Search 뒤 바뀐 분포다. Pixel 정답은 없다.</p>
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold leading-relaxed text-muted-foreground">{current.source}</p>
        </div>
      </div>
    </figure>
  );
}

const lambdas = [0, 0.5, 0.8, 1] as const;

export function DreamerReturnLab() {
  const [lambda, setLambda] = useState<(typeof lambdas)[number]>(0.8);
  const [terminal, setTerminal] = useState(true);
  const rewards = [1, 2, 5];
  const values = [2, 1.5, 1, 4];
  const continues = terminal ? [1, 1, 0] : [1, 1, 1];
  const returns = (() => {
    const result = [0, 0, 0, values[3]];
    for (let index = 2; index >= 0; index -= 1) {
      result[index] = rewards[index] + 0.9 * continues[index] * ((1 - lambda) * values[index] + lambda * result[index + 1]);
    }
    return result;
  })();

  return (
    <figure data-dreamer-return className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">DREAMER RETURN LAB</span>
        <strong className="text-sm leading-snug">Posterior anchor 뒤 prior imagination을 terminal까지 역산한다</strong>
        <span data-dreamer-r0 className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-300">R0 {returns[0].toFixed(2)}</span>
      </figcaption>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="overflow-hidden border border-border">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 bg-sky-500/[0.055] px-3 py-3">
              <p className="font-mono text-xs font-black text-sky-700 dark:text-sky-300">REPLAY ANCHOR</p>
              <p className="text-xs leading-relaxed text-foreground">실제 observation을 본 posterior <span className="font-mono font-black">q</span>가 시작 state를 고정한다.</p>
            </div>
            <div className="border-t border-border bg-muted/20 px-3 py-2 text-xs font-bold text-muted-foreground">PRIOR IMAGINATION · 이후에는 새 pixel 없이 <span className="font-mono text-foreground">p(z|h)</span>로 전개</div>
            <div className="grid grid-cols-3 gap-px bg-border">
              {[0, 1, 2].map((index) => (
                <div key={index} className={`min-w-0 p-3 ${continues[index] === 0 ? 'bg-rose-500/[0.055]' : 'bg-background'}`}>
                  <p className="font-mono text-xs font-black">t{index}</p>
                  <p className="mt-2 text-xs text-muted-foreground">r {rewards[index]} · c {continues[index]}</p>
                  <p data-dreamer-return-step={index} className="mt-1 font-mono text-base font-black">R {returns[index].toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Continue가 <span className="font-mono font-bold text-foreground">c=0</span>을 예측하면 그 지점 뒤의 critic bootstrap이 차단된다.</p>
        </div>

        <div className="min-w-0 bg-emerald-500/[0.035] p-4 sm:p-5">
          <p className="text-xs font-bold text-muted-foreground">lambda · 짧은 bootstrap과 긴 rollout의 혼합</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {lambdas.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`Dreamer lambda ${value}`}
                onClick={() => setLambda(value)}
                className={`min-h-10 border font-mono text-xs font-black ${lambda === value ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-border bg-background'}`}
              >
                {value.toFixed(1)}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Dreamer terminal toggle"
            onClick={() => setTerminal((value) => !value)}
            className={`mt-4 min-h-11 w-full border px-3 text-xs font-bold ${terminal ? 'border-rose-700 bg-rose-700 text-white' : 'border-border bg-background'}`}
          >
            {terminal ? 't2에서 terminal · c2=0' : 'terminal 없음 · c2=1'}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><span className="font-mono font-bold text-foreground">gamma .90 · value [2, 1.5, 1, 4]</span>. Lambda가 커질수록 imagined reward를 더 멀리 잇지만 reward·continue model error에도 더 노출된다.</p>
        </div>
      </div>
    </figure>
  );
}
