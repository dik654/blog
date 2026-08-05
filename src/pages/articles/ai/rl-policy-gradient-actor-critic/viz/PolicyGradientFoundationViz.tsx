import { useMemo, useState } from 'react';

const REWARD_A = 2;
const REWARD_B = -1;
const REWARDS = [1, -2, 4];

function fixed(value: number) {
  return Math.abs(value) < 0.00005 ? '0.0000' : value.toFixed(4);
}

export function PolicyGradientBanditLab() {
  const [logit, setLogit] = useState(0);
  const [baseline, setBaseline] = useState(0);
  const probabilityA = 1 / (1 + Math.exp(-logit));
  const probabilityB = 1 - probabilityA;
  const objective = probabilityA * REWARD_A + probabilityB * REWARD_B;
  const exactGradient = probabilityA * probabilityB * (REWARD_A - REWARD_B);
  const sampleA = (REWARD_A - baseline) * probabilityB;
  const sampleB = (REWARD_B - baseline) * -probabilityA;
  const expectedSample = probabilityA * sampleA + probabilityB * sampleB;
  const sampleVariance =
    probabilityA * (sampleA - expectedSample) ** 2 +
    probabilityB * (sampleB - expectedSample) ** 2;
  const optimalBaseline = probabilityB * REWARD_A + probabilityA * REWARD_B;

  const presets = [
    { label: 'b = 0', value: 0 },
    { label: 'b = b*', value: optimalBaseline },
    { label: 'b = 2', value: 2 },
  ];

  return (
    <figure
      data-policy-gradient-bandit
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-teal-800 dark:text-teal-300">
          BASELINE LAB
        </span>
        <strong className="min-w-0 text-sm">
          평균 gradient는 그대로 두고 표본의 흔들림만 바꾼다
        </strong>
        <span className="font-mono text-xs font-black text-muted-foreground">
          J = {objective.toFixed(3)}
        </span>
      </figcaption>

      <div className="grid gap-5 border-b border-border bg-teal-500/[0.035] p-4 sm:grid-cols-2">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          Action A logit θ · {logit.toFixed(2)}
          <input
            aria-label="Action A logit"
            type="range"
            min="-4"
            max="4"
            step="0.1"
            value={logit}
            onChange={(event) => setLogit(Number(event.target.value))}
            className="mt-3 block w-full accent-teal-700"
          />
        </label>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted-foreground">
            <span>Baseline b · {baseline.toFixed(3)}</span>
            <span className="font-mono">b* = {optimalBaseline.toFixed(3)}</span>
          </div>
          <input
            aria-label="State baseline"
            type="range"
            min="-2"
            max="3"
            step="0.1"
            value={baseline}
            onChange={(event) => setBaseline(Number(event.target.value))}
            className="mt-3 block w-full accent-teal-700"
          />
          <div
            role="group"
            aria-label="Baseline presets"
            className="mt-3 grid grid-cols-3 rounded-md border border-border bg-background p-1"
          >
            {presets.map((preset) => {
              const active = Math.abs(baseline - preset.value) < 0.0001;
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBaseline(preset.value)}
                  className={`h-9 min-w-0 px-2 text-xs font-bold ${
                    active
                      ? 'rounded bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(15rem,0.72fr)] sm:p-6">
        <div className="min-w-0 space-y-5">
          {[
            {
              label: `A · reward ${REWARD_A}`,
              probability: probabilityA,
              gradient: sampleA,
              color: 'bg-teal-700',
            },
            {
              label: `B · reward ${REWARD_B}`,
              probability: probabilityB,
              gradient: sampleB,
              color: 'bg-amber-500',
            },
          ].map((action) => (
            <div key={action.label} className="min-w-0">
              <div className="mb-2 grid gap-1 text-xs sm:grid-cols-[1fr_auto] sm:items-center">
                <strong>{action.label}</strong>
                <span className="break-words font-mono text-muted-foreground">
                  π {action.probability.toFixed(3)} · sample ∇ {action.gradient.toFixed(3)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-sm bg-muted">
                <div
                  className={`h-full ${action.color}`}
                  style={{ width: `${action.probability * 100}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs leading-relaxed text-muted-foreground">
            이 2-action·1-logit 예제에서는 b*를 쓰면 두 행동이 우연히 같은 gradient를
            만들어 분산이 0이 된다. 일반 문제에서는 critic이 최적 baseline을 정확히
            알지 못하므로 분산이 완전히 사라지지는 않는다.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-md border border-border sm:grid-rows-3">
          <div className="border-b border-border p-4">
            <p className="text-xs text-muted-foreground">정확한 dJ/dθ</p>
            <p data-exact-gradient className="mt-1 font-mono text-xl font-black">
              {fixed(exactGradient)}
            </p>
          </div>
          <div className="border-b border-border p-4">
            <p className="text-xs text-muted-foreground">Sample gradient 기대값</p>
            <p data-expected-gradient className="mt-1 font-mono text-xl font-black">
              {fixed(expectedSample)}
            </p>
          </div>
          <div className="bg-teal-500/[0.045] p-4">
            <p className="text-xs text-muted-foreground">Sample gradient 분산</p>
            <p
              data-sample-variance
              className="mt-1 font-mono text-xl font-black text-teal-800 dark:text-teal-300"
            >
              {fixed(sampleVariance)}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

type ReturnMode = 'full' | 'causal';

export function ReturnToGoViz() {
  const [mode, setMode] = useState<ReturnMode>('causal');
  const fullReturn = REWARDS.reduce((sum, reward) => sum + reward, 0);
  const returnToGo = useMemo(
    () => REWARDS.map((_, time) => REWARDS.slice(time).reduce((sum, reward) => sum + reward, 0)),
    [],
  );

  return (
    <figure
      data-return-to-go
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <span className="font-mono text-xs font-black text-blue-800 dark:text-blue-300">
            CAUSAL CREDIT
          </span>
          <strong className="mt-1 block text-sm">
            미래 행동은 이미 지나간 보상을 바꿀 수 없다
          </strong>
        </div>
        <div
          role="group"
          aria-label="Return estimator"
          className="grid grid-cols-2 rounded-md border border-border bg-background p-1"
        >
          {[
            { key: 'full' as const, label: '전체 return' },
            { key: 'causal' as const, label: 'Reward-to-go' },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={mode === option.key}
              onClick={() => setMode(option.key)}
              className={`h-9 min-w-28 px-3 text-xs font-bold ${
                mode === option.key
                  ? 'rounded bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </figcaption>

      <div className="border-b border-border bg-blue-500/[0.035] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        고정 trajectory · γ=1 · reward=[1, -2, 4]. 각 행은 시점 t의 policy score에
        곱할 weight를 보여 준다.
      </div>

      <div>
        {REWARDS.map((_, time) => {
          const weight = mode === 'full' ? fullReturn : returnToGo[time];
          return (
            <div
              key={time}
              className="grid gap-3 border-b border-border p-4 last:border-0 sm:grid-cols-[4.5rem_minmax(0,1fr)_7rem] sm:items-center"
            >
              <div className="flex items-center justify-between sm:block">
                <span className="font-mono text-xs font-black text-blue-800 dark:text-blue-300">
                  SCORE
                </span>
                <strong className="font-mono text-lg">∇logπ{time}</strong>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {REWARDS.map((reward, rewardTime) => {
                  const isPast = rewardTime < time;
                  const used = mode === 'full' || !isPast;
                  return (
                    <div
                      key={rewardTime}
                      className={`min-w-0 border px-2 py-2 text-center ${
                        !used
                          ? 'border-dashed border-border bg-muted/20 text-muted-foreground'
                          : isPast
                            ? 'border-amber-500/45 bg-amber-500/[0.06]'
                            : 'border-blue-600/30 bg-blue-500/[0.045]'
                      }`}
                    >
                      <p className="font-mono text-[11px] font-bold">r{rewardTime + 1}</p>
                      <p className={`font-mono text-sm font-black ${!used ? 'line-through' : ''}`}>
                        {reward}
                      </p>
                      <p className="mt-1 text-[10px] leading-tight">
                        {!used ? '과거라 제거' : isPast ? '인과 없음·잡음' : '행동 뒤 보상'}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-l-2 border-blue-600 pl-3 sm:text-right">
                <p className="text-[11px] font-bold text-muted-foreground">곱할 weight</p>
                <p data-return-weight={time} className="font-mono text-xl font-black">
                  {weight}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {mode === 'full' ? `R=${fullReturn}` : `G${time}=${returnToGo[time]}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="border-t border-border bg-muted/15 p-4 text-xs leading-relaxed text-muted-foreground">
        전체 return도 평균적으로는 맞지만 t=1,2의 score에 이미 확정된 과거 reward를
        곱한다. Reward-to-go는 기대값이 0인 그 항을 제거해 같은 gradient를 더 적은
        잡음으로 추정한다.
      </p>
    </figure>
  );
}
