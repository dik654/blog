import { useState } from 'react';

type StateRepresentation = 'position' | 'position-velocity';

const histories = [
  {
    id: 'from-left',
    label: '왼쪽에서 접근',
    previous: -1,
    position: 0,
    velocity: 1,
    next: 1,
  },
  {
    id: 'from-right',
    label: '오른쪽에서 접근',
    previous: 1,
    position: 0,
    velocity: -1,
    next: -1,
  },
];

export function MarkovSufficiencyLab() {
  const [representation, setRepresentation] =
    useState<StateRepresentation>('position');
  const sufficient = representation === 'position-velocity';

  return (
    <figure
      data-markov-state
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-teal-800 dark:text-teal-300">
          STATE TEST
        </span>
        <strong className="min-w-0 text-sm">
          같은 현재 표현으로 묶인 history가 같은 다음 분포를 가지는가?
        </strong>
        <span
          data-markov-verdict
          aria-live="polite"
          aria-atomic="true"
          className={`w-fit rounded px-2 py-1 text-xs font-black ${
            sufficient
              ? 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-600/10 text-rose-800 dark:text-rose-300'
          }`}
        >
          {sufficient ? 'MARKOV PASS' : 'STATE 부족'}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-teal-500/[0.035] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">1차원 로봇이 coast action으로 속도를 유지한다</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Dynamics는 x′=x+v다. 센서는 현재 위치 x=0만 보여 주고 속도는 숨긴다.
          </p>
        </div>
        <div
          role="group"
          aria-label="상태 표현 선택"
          className="grid grid-cols-2 rounded-md border border-border bg-background p-1"
        >
          <button
            type="button"
            aria-pressed={representation === 'position'}
            onClick={() => setRepresentation('position')}
            className={`h-9 px-3 text-xs font-bold ${
              representation === 'position'
                ? 'rounded bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            위치만
          </button>
          <button
            type="button"
            aria-pressed={representation === 'position-velocity'}
            onClick={() => setRepresentation('position-velocity')}
            className={`h-9 px-3 text-xs font-bold ${
              representation === 'position-velocity'
                ? 'rounded bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            위치 + 속도
          </button>
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2">
        {histories.map((history) => (
          <div key={history.id} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black text-teal-800 dark:text-teal-300">
                {history.label}
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                H: {history.previous} → {history.position}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
              <div className="border border-border p-3">
                <p className="text-xs text-muted-foreground">현재 표현</p>
                <p className="mt-2 font-mono text-base font-black">
                  {sufficient
                    ? `(x=${history.position}, v=${history.velocity > 0 ? '+' : ''}${history.velocity})`
                    : `o=(x=${history.position})`}
                </p>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="border border-border p-3">
                <p className="text-xs text-muted-foreground">coast 뒤</p>
                <p className="mt-2 font-mono text-base font-black">x′={history.next}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              숨은 속도 v={history.velocity > 0 ? '+' : ''}{history.velocity}가 다음 위치를
              결정한다.
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-muted/15 p-4">
        <p data-markov-explanation className="text-xs leading-relaxed text-muted-foreground">
          {sufficient
            ? '두 history는 서로 다른 state key로 분리된다. 각 (x,v)와 action을 알면 다음 위치가 하나로 정해지므로 이 dynamics 아래에서 현재 표현이 충분하다.'
            : '두 history가 같은 o=(x=0) key에 합쳐지지만 다음 위치는 +1과 -1로 갈린다. History를 아는 쪽의 예측과 observation만 아는 쪽의 예측이 다르므로 위치만으로는 Markov state가 아니다.'}
        </p>
      </div>
    </figure>
  );
}

const Q_SAFE = 2.8;
const Q_RISK = 0.765;
const POLICY_PROBABILITIES = [0.25, 0.5, 0.75];

function fixed(value: number, digits = 3) {
  const normalized = Math.abs(value) < 1e-10 ? 0 : value;
  const factor = 10 ** digits;
  const rounded =
    Math.sign(normalized) *
    (Math.round((Math.abs(normalized) + Number.EPSILON) * factor) / factor);
  return rounded.toFixed(digits);
}

export function ValueConditioningLab() {
  const [safeProbability, setSafeProbability] = useState(0.5);
  const riskProbability = 1 - safeProbability;
  const value = safeProbability * Q_SAFE + riskProbability * Q_RISK;
  const safeAdvantage = Q_SAFE - value;
  const riskAdvantage = Q_RISK - value;
  const weightedAdvantage =
    safeProbability * safeAdvantage + riskProbability * riskAdvantage;

  return (
    <figure
      data-value-conditioning
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-violet-800 dark:text-violet-300">
          VALUE LEDGER
        </span>
        <strong className="min-w-0 text-sm">
          Q는 행동을 고정하고 V는 policy 확률로 Q를 평균한다
        </strong>
        <span
          data-policy-value
          aria-live="polite"
          aria-atomic="true"
          className="font-mono text-lg font-black"
        >
          Vπ = {fixed(value)}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-violet-500/[0.035] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          같은 state에서 Q(s,safe)=2.800, Q(s,risk)=0.765를 고정하고 policy만 바꾼다.
        </p>
        <div
          role="group"
          aria-label="안전 행동 확률 선택"
          className="grid grid-cols-3 rounded-md border border-border bg-background p-1"
        >
          {POLICY_PROBABILITIES.map((probability) => (
            <button
              key={probability}
              type="button"
              aria-pressed={safeProbability === probability}
              onClick={() => setSafeProbability(probability)}
              className={`h-9 min-w-16 px-2 text-xs font-bold ${
                safeProbability === probability
                  ? 'rounded bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              πsafe {Math.round(probability * 100)}%
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2">
        <div className="bg-background p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-violet-800 dark:text-violet-300">SAFE</p>
            <p className="font-mono text-xs text-muted-foreground">
              π={safeProbability.toFixed(2)}
            </p>
          </div>
          <p className="mt-3 font-mono text-base font-semibold text-muted-foreground">
            고정 Q = {Q_SAFE.toFixed(3)}
          </p>
          <p
            data-safe-advantage
            aria-live="polite"
            aria-atomic="true"
            className="mt-2 font-mono text-2xl font-black"
          >
            A = {fixed(safeAdvantage)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            첫 행동을 safe로 고정한 return과 policy 평균의 차이다.
          </p>
        </div>
        <div className="bg-background p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-amber-800 dark:text-amber-300">RISK</p>
            <p className="font-mono text-xs text-muted-foreground">
              π={riskProbability.toFixed(2)}
            </p>
          </div>
          <p className="mt-3 font-mono text-base font-semibold text-muted-foreground">
            고정 Q = {Q_RISK.toFixed(3)}
          </p>
          <p
            data-risk-advantage
            aria-live="polite"
            aria-atomic="true"
            className="mt-2 font-mono text-2xl font-black"
          >
            A = {fixed(riskAdvantage)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            같은 state의 baseline V보다 낮으면 advantage가 음수가 된다.
          </p>
        </div>
      </div>

      <div className="grid gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Vπ={safeProbability.toFixed(2)}·2.800 + {riskProbability.toFixed(2)}·0.765.
          Advantage를 같은 policy로 다시 평균하면 양수와 음수가 정확히 상쇄된다.
        </p>
        <p
          data-weighted-advantage
          aria-live="polite"
          aria-atomic="true"
          className="font-mono text-lg font-black"
        >
          Eπ[A] = {fixed(weightedAdvantage)}
        </p>
      </div>
    </figure>
  );
}
