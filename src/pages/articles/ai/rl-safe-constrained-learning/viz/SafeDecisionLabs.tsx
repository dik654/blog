import { useState } from 'react';

const cpoDeltas = [0.001, 0.02, 0.08] as const;
const cpoModes = {
  within: { label: '예산 안쪽', gap: -0.1 },
  over: { label: '예산 초과', gap: 0.04 },
} as const;

type CpoMode = keyof typeof cpoModes;

export function CpoLocalStepLab() {
  const [mode, setMode] = useState<CpoMode>('over');
  const [delta, setDelta] = useState<(typeof cpoDeltas)[number]>(0.08);
  const gap = cpoModes[mode].gap;
  const rewardGradient = 1;
  const costGradient = 0.6;
  const curvature = 1;
  const trustLimit = Math.sqrt((2 * delta) / curvature);
  const safetyUpper = -gap / costGradient;
  const lower = -trustLimit;
  const upper = Math.min(trustLimit, safetyUpper);
  const feasible = upper >= lower;
  const selected = feasible ? upper : null;
  const predictedGap = selected == null ? null : gap + costGradient * selected;
  const rewardGain = selected == null ? null : rewardGradient * selected;
  const position = (value: number) => `${Math.max(0, Math.min(100, ((value + 0.5) / 1) * 100))}%`;

  return (
    <figure data-cpo-step className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-sky-700 dark:text-sky-300">CPO LOCAL STEP LAB</span>
        <strong className="text-sm leading-snug">Reward 방향이 cost boundary와 trust interval 안에 남는지 푼다</strong>
        <span data-cpo-status className={`font-mono text-xs font-black ${feasible ? (selected && selected < 0 ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300') : 'text-rose-700 dark:text-rose-300'}`}>
          {feasible ? (selected && selected < 0 ? 'RECOVERY STEP' : 'REWARD STEP') : 'LOCAL INFEASIBLE'}
        </span>
      </figcaption>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex flex-wrap gap-2" aria-label="CPO budget state">
            {(Object.keys(cpoModes) as CpoMode[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`min-h-10 border px-3 text-xs font-bold ${mode === key ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground'}`}
              >
                {cpoModes[key].label} · c {cpoModes[key].gap > 0 ? '+' : ''}{cpoModes[key].gap.toFixed(2)}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            <div className="bg-background p-4"><p className="text-xs text-muted-foreground">Trust 허용 범위</p><p data-cpo-trust className="mt-1 font-mono text-xl font-black">±{trustLimit.toFixed(3)}</p></div>
            <div className="bg-background p-4"><p className="text-xs text-muted-foreground">Safety upper bound</p><p data-cpo-safety className="mt-1 font-mono text-xl font-black">{safetyUpper.toFixed(3)}</p></div>
            <div className={feasible ? 'bg-background p-4' : 'bg-rose-500/[0.045] p-4'}><p className="text-xs text-muted-foreground">선택 Δθ</p><p data-cpo-selected className="mt-1 font-mono text-xl font-black">{selected == null ? '없음' : selected.toFixed(3)}</p></div>
          </div>

          <div className="mt-5 overflow-hidden border border-border bg-muted/20 px-4 py-5">
            <div className="relative h-12" aria-label="CPO one-dimensional feasible geometry">
              <div className="absolute left-0 right-0 top-5 h-px bg-border" />
              <div className="absolute top-3 h-4 bg-sky-500/20" style={{ left: position(-trustLimit), width: `calc(${position(trustLimit)} - ${position(-trustLimit)})` }} />
              <div className="absolute bottom-0 top-0 w-px bg-rose-600" style={{ left: position(safetyUpper) }} />
              <div className="absolute bottom-0 top-0 w-px bg-foreground" style={{ left: '50%' }} />
              {selected != null && <div className="absolute top-3 h-4 w-4 -translate-x-1/2 rounded-full border border-sky-700 bg-background" style={{ left: position(selected) }} />}
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs font-semibold text-muted-foreground"><span>왼쪽 · cost 감소</span><span>0 · 현재 policy</span><span>오른쪽 · reward 증가</span></div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            이 그림은 <span className="font-mono font-bold text-foreground">g=1, b=.6, H=1</span>인 1차원 slice다. 실제 CPO는 고차원 QCQP를 풀지만, cost half-space와 KL ellipsoid가 동시에 남겨 둔 구간 안에서만 reward 방향을 선택한다는 판정은 같다.
          </p>
        </div>

        <div className="min-w-0 bg-sky-500/[0.035] p-4 sm:p-5">
          <p className="text-xs font-bold text-muted-foreground">Trust-region budget δ</p>
          <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
            {cpoDeltas.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`CPO delta ${value}`}
                onClick={() => setDelta(value)}
                className={`min-h-10 border px-3 text-left font-mono text-xs font-black ${delta === value ? 'border-sky-700 bg-sky-700 text-white' : 'border-border bg-background'}`}
              >
                δ {value.toFixed(3)}
              </button>
            ))}
          </div>
          <div className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            <p>예측 reward gain <span data-cpo-gain className="font-mono font-black text-foreground">{rewardGain == null ? 'N/A' : rewardGain.toFixed(3)}</span></p>
            <p className="mt-2">Update 뒤 cost gap <span data-cpo-gap className="font-mono font-black text-foreground">{predictedGap == null ? 'N/A' : predictedGap.toFixed(3)}</span></p>
            <p className="mt-3">Trust interval이 recovery boundary까지 닿지 않으면 이 local 근사 안에는 feasible step이 없다.</p>
          </div>
        </div>
      </div>
    </figure>
  );
}

export function LyapunovSlackLab() {
  const [fastProbability, setFastProbability] = useState(0.25);
  const currentBudget = 1.2;
  const fastBackup = 1.3;
  const slowBackup = 1.12;
  const mixtureBackup = fastProbability * fastBackup + (1 - fastProbability) * slowBackup;
  const slack = currentBudget - mixtureBackup;
  const feasible = slack >= -1e-9;
  const maximumFast = (currentBudget - slowBackup) / (fastBackup - slowBackup);

  return (
    <figure data-lyapunov-slack className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">LYAPUNOV SLACK LAB</span>
        <strong className="text-sm leading-snug">State budget L(s) 안에 남는 action mixture를 계산한다</strong>
        <span data-lyapunov-status className={`font-mono text-xs font-black ${feasible ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{feasible ? 'LOCAL FEASIBLE' : 'LOCAL VIOLATION'}</span>
      </figcaption>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1.3fr)_minmax(15rem,.7fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            <div className="bg-rose-500/[0.035] p-4"><p className="font-mono text-xs font-black text-rose-700 dark:text-rose-300">FAST</p><p className="mt-2 text-xs text-muted-foreground">immediate cost + next L</p><p className="mt-1 font-mono text-2xl font-black">1.300</p></div>
            <div className="bg-emerald-500/[0.035] p-4"><p className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">SLOW · BASELINE</p><p className="mt-2 text-xs text-muted-foreground">immediate cost + next L</p><p className="mt-1 font-mono text-2xl font-black">1.120</p></div>
          </div>
          <label className="mt-5 block text-xs font-semibold text-muted-foreground">Fast action probability · {(fastProbability * 100).toFixed(0)}%<input aria-label="Lyapunov fast probability" className="mt-3 block w-full accent-violet-700" type="range" min="0" max="1" step="0.05" value={fastProbability} onChange={(event) => setFastProbability(Number(event.target.value))} /></label>
          <div className="mt-5 h-3 overflow-hidden bg-muted" aria-label="Lyapunov action mixture">
            <div className="h-full bg-rose-600 transition-[width] duration-300" style={{ width: `${fastProbability * 100}%` }} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Fast만 보면 local backup이 current <span className="font-mono font-bold text-foreground">L(s)=1.200</span>을 넘는다. 확률 mixture는 허용되지만 fast 비율은 최대 <span className="font-mono font-bold text-foreground">{(maximumFast * 100).toFixed(1)}%</span>여야 한다.</p>
        </div>

        <div className={`min-w-0 p-4 sm:p-5 ${feasible ? 'bg-violet-500/[0.035]' : 'bg-rose-500/[0.045]'}`}>
          <p className="text-xs font-bold text-muted-foreground">Candidate Bellman backup</p>
          <p data-lyapunov-backup className="mt-2 font-mono text-3xl font-black">{mixtureBackup.toFixed(3)}</p>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">Local slack · L(s) - backup</p>
            <p data-lyapunov-slack-value className={`mt-1 font-mono text-2xl font-black ${feasible ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{slack >= 0 ? '+' : ''}{slack.toFixed(3)}</p>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">이 숫자는 model·cost value가 정확하고 feasible baseline에서 만든 L이 유효할 때만 global expected-cost 논리로 이어진다.</p>
        </div>
      </div>
    </figure>
  );
}

export function RecoveryTimingLab() {
  const [timeToCollision, setTimeToCollision] = useState(300);
  const [risk, setRisk] = useState(0.74);
  const threshold = 0.3;
  const detection = 60;
  const handoff = 20;
  const braking = 420;
  const required = detection + handoff + braking;
  const margin = timeToCollision - required;
  const recoveryTriggered = risk > threshold;
  const recoverable = recoveryTriggered && margin >= 0;
  const outcome = !recoveryTriggered ? 'RISK MISSED' : recoverable ? 'RECOVERABLE' : 'TOO LATE';

  return (
    <figure data-recovery-timing className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">RECOVERY TIMING LAB</span>
        <strong className="text-sm leading-snug">Risk gate가 켜진 뒤 실제로 멈출 시간이 남았는지 검사한다</strong>
        <span data-recovery-outcome className={`font-mono text-xs font-black ${recoverable ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{outcome}</span>
      </figcaption>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="grid gap-5 border-b border-border pb-5 sm:grid-cols-2">
            <label className="text-xs font-semibold text-muted-foreground">Time to collision · {timeToCollision}ms<input aria-label="Recovery time to collision" className="mt-3 block w-full accent-emerald-700" type="range" min="200" max="900" step="50" value={timeToCollision} onChange={(event) => setTimeToCollision(Number(event.target.value))} /></label>
            <label className="text-xs font-semibold text-muted-foreground">Predicted risk · {risk.toFixed(2)}<input aria-label="Recovery predicted risk" className="mt-3 block w-full accent-emerald-700" type="range" min="0" max="1" step="0.01" value={risk} onChange={(event) => setRisk(Number(event.target.value))} /></label>
          </div>

          <div className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            <div className="bg-sky-500/[0.035] p-4"><p className="text-xs text-muted-foreground">감지</p><p className="mt-1 font-mono text-xl font-black">60ms</p></div>
            <div className="bg-violet-500/[0.035] p-4"><p className="text-xs text-muted-foreground">Policy handoff</p><p className="mt-1 font-mono text-xl font-black">20ms</p></div>
            <div className="bg-amber-500/[0.035] p-4"><p className="text-xs text-muted-foreground">물리 제동</p><p className="mt-1 font-mono text-xl font-black">420ms</p></div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">AUROC가 높아도 충돌 직전 구간의 false negative와 latency를 숨길 수 있다. Risk score가 threshold를 넘는 것과 recovery action이 제시간에 plant를 멈추는 것은 서로 다른 검증이다.</p>
        </div>

        <div className={`min-w-0 p-4 sm:p-5 ${recoverable ? 'bg-emerald-500/[0.04]' : 'bg-rose-500/[0.045]'}`}>
          <p className="text-xs font-bold text-muted-foreground">Action gate · threshold .30</p>
          <p data-recovery-gate className="mt-2 font-mono text-xl font-black">{recoveryTriggered ? 'RECOVERY' : 'TASK ACTION'}</p>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">필요 시간</p>
            <p data-recovery-required className="mt-1 font-mono text-2xl font-black">{required}ms</p>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">제동 여유 · TTC - 필요 시간</p>
            <p data-recovery-margin className={`mt-1 font-mono text-2xl font-black ${margin >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{margin >= 0 ? '+' : ''}{margin}ms</p>
          </div>
          {!recoveryTriggered && <p className="mt-4 text-xs font-semibold leading-relaxed text-rose-700 dark:text-rose-300">위험을 놓쳤으므로 계산상 제동 여유가 있어도 recovery는 시작되지 않는다.</p>}
        </div>
      </div>
    </figure>
  );
}
