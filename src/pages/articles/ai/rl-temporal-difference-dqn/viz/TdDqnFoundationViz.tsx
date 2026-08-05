import { useMemo, useState } from 'react';

const GAMMA = 0.9;
const REWARDS = [1, 2, 4];
const LAMBDAS = [0, 0.5, 0.9, 1];

function fixed(value: number, digits = 3) {
  const factor = 10 ** digits;
  return (Math.round((value + Number.EPSILON) * factor) / factor).toFixed(digits);
}

export function LambdaReturnLab() {
  const [lambda, setLambda] = useState(0.5);
  const returns = useMemo(() => {
    const oneStep = REWARDS[0] + GAMMA * 5;
    const twoStep = REWARDS[0] + GAMMA * REWARDS[1] + GAMMA ** 2 * 3;
    const monteCarlo =
      REWARDS[0] + GAMMA * REWARDS[1] + GAMMA ** 2 * REWARDS[2];
    return [oneStep, twoStep, monteCarlo];
  }, []);
  const weights = [1 - lambda, (1 - lambda) * lambda, lambda ** 2];
  const lambdaReturn = returns.reduce(
    (sum, value, index) => sum + weights[index] * value,
    0,
  );

  return (
    <figure
      data-lambda-return
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-sky-800 dark:text-sky-300">
          RETURN LAB
        </span>
        <strong className="min-w-0 text-sm">
          λ-return은 TD와 MC 두 숫자의 단순 보간이 아니다
        </strong>
        <span data-lambda-target className="font-mono text-sm font-black">
          Gλ = {fixed(lambdaReturn)}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-sky-500/[0.035] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">고정 trajectory의 여러 n-step 답을 먼저 만든다</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            r=[1,2,4], γ=.9, V(s1)=5, V(s2)=3, 세 번째 reward 뒤 진짜 terminal이다.
          </p>
        </div>
        <div
          role="group"
          aria-label="Lambda return coefficient"
          className="grid grid-cols-4 rounded-md border border-border bg-background p-1"
        >
          {LAMBDAS.map((candidate) => (
            <button
              key={candidate}
              type="button"
              aria-pressed={lambda === candidate}
              onClick={() => setLambda(candidate)}
              className={`h-9 min-w-12 px-2 text-xs font-bold ${
                lambda === candidate
                  ? 'rounded bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              λ {candidate}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-3">
        {returns.map((value, index) => (
          <div key={index} className="bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs font-black text-sky-800 dark:text-sky-300">
                {index + 1}-STEP
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                weight {fixed(weights[index])}
              </p>
            </div>
            <p className="mt-2 font-mono text-2xl font-black">{fixed(value)}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {index === 0
                ? 'reward 1개 뒤 V(s1)=5로 bootstrap'
                : index === 1
                  ? 'reward 2개 뒤 V(s2)=3으로 bootstrap'
                  : 'terminal까지 reward를 관측한 MC return'}
            </p>
            <p className="mt-3 border-t border-border pt-3 font-mono text-xs">
              contribution {fixed(weights[index] * value)}
            </p>
          </div>
        ))}
      </div>

      <p className="border-t border-border bg-muted/15 p-4 text-xs leading-relaxed text-muted-foreground">
        λ=0이면 1-step TD, λ=1이면 끝까지 관측한 MC가 된다. 중간 λ는 1·2·3-step
        return을 서로 다른 기하 가중치로 합친다.
      </p>
    </figure>
  );
}

type BoundaryMode = 'continuing' | 'terminated' | 'truncated';

export function ControlTargetLab() {
  const [boundary, setBoundary] = useState<BoundaryMode>('continuing');
  const mask = boundary === 'terminated' ? 0 : 1;
  const sarsaTarget = 1 + GAMMA * mask * 2;
  const qLearningTarget = 1 + GAMMA * mask * 6;

  return (
    <figure
      data-control-target
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <span className="font-mono text-xs font-black text-indigo-800 dark:text-indigo-300">
          CONTROL TARGET
        </span>
        <strong className="min-w-0 text-sm">
          같은 transition도 다음 행동의 주체와 episode 경계가 target을 바꾼다
        </strong>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-indigo-500/[0.035] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          r=1, γ=.9 · behavior는 다음에 left를 선택해 Q=2 · greedy action은 right이고 Q=6
        </p>
        <div
          role="group"
          aria-label="Episode boundary"
          className="grid grid-cols-3 rounded-md border border-border bg-background p-1"
        >
          {[
            { key: 'continuing' as const, label: '계속' },
            { key: 'terminated' as const, label: '진짜 종료' },
            { key: 'truncated' as const, label: '시간 제한' },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={boundary === option.key}
              onClick={() => setBoundary(option.key)}
              className={`h-9 min-w-16 px-2 text-xs font-bold ${
                boundary === option.key
                  ? 'rounded bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-[1fr_1fr_0.8fr]">
        <div className="bg-background p-5">
          <p className="text-xs font-black text-indigo-800 dark:text-indigo-300">SARSA · ON-POLICY</p>
          <p className="mt-2 text-sm font-bold">Behavior가 실제 고른 left를 평가</p>
          <p data-sarsa-target className="mt-3 font-mono text-2xl font-black">
            {fixed(sarsaTarget, 2)}
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            1 + .9·{mask}·2
          </p>
        </div>
        <div className="bg-background p-5">
          <p className="text-xs font-black text-amber-800 dark:text-amber-300">Q-LEARNING · OFF-POLICY</p>
          <p className="mt-2 text-sm font-bold">Target이 greedy right를 평가</p>
          <p data-q-target className="mt-3 font-mono text-2xl font-black">
            {fixed(qLearningTarget, 2)}
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            1 + .9·{mask}·6
          </p>
        </div>
        <div className="bg-indigo-500/[0.04] p-5">
          <p className="text-xs font-bold text-muted-foreground">미래 gate m</p>
          <p data-boundary-mask className="mt-2 font-mono text-3xl font-black">
            {mask}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {boundary === 'terminated'
              ? '목표가 끝난 terminal이므로 bootstrap을 끊는다.'
              : boundary === 'truncated'
                ? '시간 제한일 뿐 state는 유효하므로 bootstrap한다.'
                : 'Episode가 계속되므로 next Q를 이어 붙인다.'}
          </p>
        </div>
      </div>
    </figure>
  );
}

type BackupMode = 'dqn' | 'double';

export function DqnBackupLab() {
  const [mode, setMode] = useState<BackupMode>('dqn');
  const [terminated, setTerminated] = useState(false);
  const onlineNext = [2, 3];
  const targetNext = [2.1, 1.6];
  const selectionValues = mode === 'dqn' ? targetNext : onlineNext;
  const selectedAction = selectionValues.reduce(
    (best, value, index) => (value > selectionValues[best] ? index : best),
    0,
  );
  const evaluatedNext = targetNext[selectedAction];
  const mask = terminated ? 0 : 1;
  const target = 1 + GAMMA * mask * evaluatedNext;
  const prediction = 1.4;
  const residual = target - prediction;
  const loss = residual ** 2;

  return (
    <figure
      data-dqn-backup
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-cyan-800 dark:text-cyan-300">
          BACKUP LEDGER
        </span>
        <strong className="min-w-0 text-sm">
          Replay 한 행이 frozen target과 online residual로 바뀌는 순서
        </strong>
        <span className="font-mono text-xs font-black text-muted-foreground">
          (s,a,r=1,s′)
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-cyan-500/[0.035] p-4 sm:grid-cols-2 sm:items-center">
        <div
          role="group"
          aria-label="DQN backup mode"
          className="grid grid-cols-2 rounded-md border border-border bg-background p-1"
        >
          {[
            { key: 'dqn' as const, label: 'DQN' },
            { key: 'double' as const, label: 'Double DQN' },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={mode === option.key}
              onClick={() => setMode(option.key)}
              className={`h-9 px-3 text-xs font-bold ${
                mode === option.key
                  ? 'rounded bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-3 border-l-2 border-cyan-600 pl-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={terminated}
            onChange={(event) => setTerminated(event.target.checked)}
            className="h-4 w-4 accent-cyan-700"
          />
          이 transition은 진짜 terminal
        </label>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-4">
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">1 · ACTION SELECT</p>
          <p className="mt-2 text-sm font-black">
            {mode === 'dqn' ? 'Target max' : 'Online argmax'}
          </p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
            online=[{onlineNext.join(', ')}]
            <br />target=[{targetNext.join(', ')}]
          </p>
          <p data-selected-action className="mt-3 font-mono text-lg font-black">
            a{selectedAction}
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">2 · TARGET EVALUATE</p>
          <p className="mt-2 text-sm font-black">Frozen target Qθ⁻</p>
          <p className="mt-3 font-mono text-lg font-black">{fixed(evaluatedNext, 2)}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            선택과 평가는 gradient를 받지 않는 target 계산이다.
          </p>
        </div>
        <div className="bg-cyan-500/[0.04] p-4">
          <p className="text-xs font-bold text-muted-foreground">3 · TERMINAL GATE</p>
          <p data-dqn-target className="mt-2 font-mono text-xl font-black">
            Y = {fixed(target, 2)}
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            1 + .9·{mask}·{fixed(evaluatedNext, 1)}
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">4 · ONLINE REGRESSION</p>
          <p data-dqn-residual className="mt-2 font-mono text-lg font-black">
            δ = {fixed(residual, 2)}
          </p>
          <p data-dqn-loss className="mt-1 font-mono text-sm">
            δ² = {fixed(loss, 4)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Gradient는 Qθ(s,a)=1.40 쪽으로만 흐른다.
          </p>
        </div>
      </div>

      <p className="border-t border-border bg-muted/15 p-4 text-xs leading-relaxed text-muted-foreground">
        Double DQN은 online network가 action을 고르고 target network가 그 action을 평가해 같은
        noisy max가 선택과 평가를 동시에 맡는 경로를 끊는다. 모든 sample에서 더 작은 target을
        보장하는 장치는 아니다.
      </p>
    </figure>
  );
}
