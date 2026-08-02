import { useState } from 'react';

const cqlActions = [
  { name: '차선 유지', count: 640, q: 3.1 },
  { name: '감속', count: 260, q: 3.6 },
  { name: '급한 지름길', count: 2, q: 6.7 },
];

function logSumExp(values: number[]) {
  const maximum = Math.max(...values);
  return maximum + Math.log(values.reduce((sum, value) => sum + Math.exp(value - maximum), 0));
}

export function CqlGradientLab() {
  const [alpha, setAlpha] = useState(1.2);
  const learningRate = 0.5;
  const total = cqlActions.reduce((sum, action) => sum + action.count, 0);
  const qValues = cqlActions.map((action) => action.q);
  const logPartition = logSumExp(qValues);
  const behavior = cqlActions.map((action) => action.count / total);
  const candidate = qValues.map((value) => Math.exp(value - logPartition));
  const behaviorMean = qValues.reduce((sum, value, index) => sum + behavior[index] * value, 0);
  const regularizer = logPartition - behaviorMean;
  const rows = cqlActions.map((action, index) => {
    const gradient = candidate[index] - behavior[index];
    return {
      ...action,
      behavior: behavior[index],
      candidate: candidate[index],
      gradient,
      updatedQ: action.q - learningRate * alpha * gradient,
    };
  });

  return (
    <figure
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
      data-cql-gradient
    >
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-rose-700 dark:text-rose-300">CQL GRADIENT LAB</span>
        <strong className="text-sm leading-snug">임의 점수 대신 discrete CQL regularizer의 실제 gradient를 계산한다</strong>
        <span className="font-mono text-xs font-black" data-cql-regularizer>
          R(Q) {regularizer.toFixed(3)}
        </span>
      </figcaption>

      <div className="grid gap-3 border-b border-border bg-muted/25 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Candidate softmax가 dataset behavior share보다 크면 gradient가 양수라 Q를 내린다. 아래 값은 Bellman term을 제외한 regularizer 한 step의 방향이다.
        </p>
        <div className="flex flex-wrap gap-1" role="group" aria-label="CQL alpha">
          {[0, 1.2, 2.4].map((value) => (
            <button
              className={`min-h-9 border px-3 text-xs font-bold transition-colors ${alpha === value ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:border-foreground/40'}`}
              key={value}
              type="button"
              aria-pressed={alpha === value}
              onClick={() => setAlpha(value)}
            >
              α {value.toFixed(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-3">
        {rows.map((row) => (
          <div className="min-w-0 bg-background p-4 sm:p-5" data-cql-action={row.name} key={row.name}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black leading-snug">{row.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">dataset {row.count}회</p>
              </div>
              <span className={`font-mono text-sm font-black ${row.gradient > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-teal-700 dark:text-teal-300'}`}>
                {row.gradient > 0 ? 'Q ↓' : 'Q ↑'}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1 flex justify-between gap-3 text-xs text-muted-foreground">
                  <span>behavior share</span>
                  <span className="font-mono">{(row.behavior * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-muted"><div className="h-full bg-teal-600" style={{ width: `${row.behavior * 100}%` }} /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between gap-3 text-xs text-muted-foreground">
                  <span>softmax(Q) share</span>
                  <span className="font-mono">{(row.candidate * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-muted"><div className="h-full bg-rose-600" style={{ width: `${row.candidate * 100}%` }} /></div>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <div><dt className="text-xs text-muted-foreground">현재 Q</dt><dd className="mt-1 font-mono text-sm font-black">{row.q.toFixed(2)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">gradient</dt><dd className="mt-1 font-mono text-sm font-black" data-cql-gradient-value>{row.gradient.toFixed(3)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">1-step Q</dt><dd className="mt-1 font-mono text-sm font-black" data-cql-updated>{row.updatedQ.toFixed(2)}</dd></div>
            </dl>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4 text-xs leading-relaxed text-muted-foreground sm:px-6">
        α={alpha.toFixed(1)}에서 지름길의 gradient는 <strong className="text-foreground">{rows[2].gradient >= 0 ? '+' : ''}{rows[2].gradient.toFixed(3)}</strong>이고 한 step Q는 {rows[2].q.toFixed(2)} → {rows[2].updatedQ.toFixed(2)}다. 차선 유지의 gradient는 <strong className="text-foreground">{rows[0].gradient >= 0 ? '+' : ''}{rows[0].gradient.toFixed(3)}</strong>로 방향이 반대다. 실제 CQL은 이 항과 관측 transition의 Bellman error를 함께 최적화한다.
      </div>
    </figure>
  );
}

const supportedTrajectories = [
  { name: 'τA', behavior: 0.4, target: 0.6, returnValue: 8 },
  { name: 'τB', behavior: 0.5, target: 0.25, returnValue: 4 },
  { name: 'τC', behavior: 0.1, target: 0.15, returnValue: 12 },
];

export function OfflinePolicyEvaluationLab() {
  const [mode, setMode] = useState<'supported' | 'missing'>('supported');
  const weighted = supportedTrajectories.map((trajectory) => ({
    ...trajectory,
    weight: trajectory.target / trajectory.behavior,
  }));
  const weightSum = weighted.reduce((sum, trajectory) => sum + trajectory.weight, 0);
  const weightedReturn = weighted.reduce((sum, trajectory) => sum + trajectory.weight * trajectory.returnValue, 0);
  const ordinaryIs = weightedReturn / weighted.length;
  const selfNormalizedIs = weightedReturn / weightSum;
  const effectiveSampleSize = weightSum ** 2 / weighted.reduce((sum, trajectory) => sum + trajectory.weight ** 2, 0);
  const supported = mode === 'supported';

  return (
    <figure
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
      data-ope-lab
    >
      <figcaption className="grid gap-3 border-b border-border px-4 py-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
        <span className="font-mono text-xs font-black text-sky-700 dark:text-sky-300">OFF-POLICY EVALUATION</span>
        <strong className="text-sm leading-snug">배포하지 않고 target policy의 return을 추정할 수 있는지 먼저 판정한다</strong>
        <span className={`font-mono text-xs font-black ${supported ? 'text-teal-700 dark:text-teal-300' : 'text-rose-700 dark:text-rose-300'}`} data-ope-status>
          {supported ? '평가 가능' : '식별 불가'}
        </span>
      </figcaption>

      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/25 p-4" role="group" aria-label="OPE support mode">
        <button className={`min-h-9 border px-3 text-xs font-bold ${supported ? 'border-foreground bg-foreground text-background' : 'border-border bg-background'}`} type="button" aria-pressed={supported} onClick={() => setMode('supported')}>Support 겹침</button>
        <button className={`min-h-9 border px-3 text-xs font-bold ${!supported ? 'border-foreground bg-foreground text-background' : 'border-border bg-background'}`} type="button" aria-pressed={!supported} onClick={() => setMode('missing')}>Target-only 행동</button>
      </div>

      {supported ? (
        <>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            {weighted.map((trajectory) => (
              <div className="min-w-0 bg-background p-4" key={trajectory.name}>
                <div className="flex items-center justify-between gap-3"><strong className="font-mono text-sm">{trajectory.name}</strong><span className="text-xs text-muted-foreground">G={trajectory.returnValue}</span></div>
                <p className="mt-4 font-mono text-xs leading-relaxed">ρ = {trajectory.target.toFixed(2)} / {trajectory.behavior.toFixed(2)} = <strong>{trajectory.weight.toFixed(2)}</strong></p>
                <p className="mt-2 text-xs text-muted-foreground">weighted return <span className="font-mono text-foreground">{(trajectory.weight * trajectory.returnValue).toFixed(2)}</span></p>
              </div>
            ))}
          </div>
          <dl className="grid gap-px border-y border-border bg-border sm:grid-cols-3">
            <div className="bg-background p-4"><dt className="text-xs text-muted-foreground">Ordinary IS</dt><dd className="mt-1 font-mono text-xl font-black" data-ope-is>{ordinaryIs.toFixed(2)}</dd></div>
            <div className="bg-background p-4"><dt className="text-xs text-muted-foreground">Self-normalized IS</dt><dd className="mt-1 font-mono text-xl font-black" data-ope-wis>{selfNormalizedIs.toFixed(2)}</dd></div>
            <div className="bg-background p-4"><dt className="text-xs text-muted-foreground">Effective sample size</dt><dd className="mt-1 font-mono text-xl font-black" data-ope-ess>{effectiveSampleSize.toFixed(2)} / 3</dd></div>
          </dl>
          <p className="p-4 text-xs leading-relaxed text-muted-foreground sm:px-6">IS와 self-normalized IS가 다른 것은 오류가 아니라 bias–variance 선택이다. 여기서도 세 episode가 ESS 2.58개만큼의 정보로 줄었다. 긴 horizon에서 ratio를 계속 곱하면 소수 trajectory가 추정을 지배할 수 있다.</p>
        </>
      ) : (
        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,.75fr)] lg:items-start">
          <div>
            <p className="text-sm font-black">Target policy가 dataset에 한 번도 없는 action을 선택한다.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">그 action의 behavior probability는 0인데 target probability는 양수다. Ratio는 나눌 수 없고, 그 action 뒤의 reward도 log 안에 없다. 더 좋은 estimator를 고르는 것으로는 이 정보 부재를 복구할 수 없다.</p>
          </div>
          <div className="border-l-4 border-rose-600 bg-rose-500/[0.045] p-4">
            <p className="text-xs font-bold text-muted-foreground">지원 조건 위반</p>
            <p className="mt-2 font-mono text-lg font-black">π(a|s) &gt; 0</p>
            <p className="font-mono text-lg font-black text-rose-700 dark:text-rose-300">πβ(a|s) = 0</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">결론: policy를 behavior support 안으로 되돌리거나 새 data를 수집한다.</p>
          </div>
        </div>
      )}
    </figure>
  );
}
