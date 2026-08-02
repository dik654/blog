import { useMemo, useState } from 'react';

const rewardSafe = 4;
const rewardDanger = -8;
const sensorAccuracy = 0.85;
const probeCost = 0.5;

function actValue(probabilityDangerLeft: number) {
  const openLeft = probabilityDangerLeft * rewardDanger + (1 - probabilityDangerLeft) * rewardSafe;
  const openRight = probabilityDangerLeft * rewardSafe + (1 - probabilityDangerLeft) * rewardDanger;
  return {
    openLeft,
    openRight,
    best: Math.max(openLeft, openRight),
    action: openLeft >= openRight ? '왼쪽 문 열기' : '오른쪽 문 열기',
  };
}

function branch(
  probabilityDangerLeft: number,
  observed: 'left' | 'right',
) {
  const likelihoodLeft = observed === 'left' ? sensorAccuracy : 1 - sensorAccuracy;
  const likelihoodRight = observed === 'right' ? sensorAccuracy : 1 - sensorAccuracy;
  const evidence =
    probabilityDangerLeft * likelihoodLeft +
    (1 - probabilityDangerLeft) * likelihoodRight;
  const posteriorLeft = (probabilityDangerLeft * likelihoodLeft) / evidence;
  return {
    evidence,
    posteriorLeft,
    decision: actValue(posteriorLeft),
  };
}

function signed(value: number) {
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return `${rounded >= 0 ? '+' : ''}${rounded.toFixed(2)}`;
}

export function ActiveSensingLab() {
  const [probabilityDangerLeft, setProbabilityDangerLeft] = useState(0.5);
  const result = useMemo(() => {
    const actNow = actValue(probabilityDangerLeft);
    const leftSignal = branch(probabilityDangerLeft, 'left');
    const rightSignal = branch(probabilityDangerLeft, 'right');
    const probe =
      -probeCost +
      leftSignal.evidence * leftSignal.decision.best +
      rightSignal.evidence * rightSignal.decision.best;
    return {
      actNow,
      leftSignal,
      rightSignal,
      probe,
      probeAdvantage: probe - actNow.best,
    };
  }, [probabilityDangerLeft]);
  const shouldProbe = result.probeAdvantage > 0;

  return (
    <figure
      data-active-sensing
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">
          VALUE OF INFORMATION
        </span>
        <strong className="text-sm leading-snug">
          지금 행동할 가치와 관측 비용을 낸 뒤 행동할 가치를 같은 단위로 비교한다
        </strong>
        <span
          data-sensing-choice
          className={`w-fit rounded-sm px-2 py-1 font-mono text-xs font-black ${
            shouldProbe
              ? 'bg-violet-600/10 text-violet-800 dark:text-violet-200'
              : 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-200'
          }`}
        >
          {shouldProbe ? 'PROBE FIRST' : 'ACT NOW'}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-amber-500/[0.035] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          위험 위치를 맞혀 안전한 문을 열면 +4, 틀리면 -8이다. Probe는 0.50의 비용을 내고
          85% 정확도의 위치 신호를 한 번 얻는다.
        </p>
        <div className="inline-grid grid-cols-3 rounded-md border border-border bg-background p-1" role="group" aria-label="왼쪽 위험 prior">
          {[0.5, 0.8, 0.9].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={probabilityDangerLeft === value}
              onClick={() => setProbabilityDangerLeft(value)}
              className={`min-h-9 px-3 text-xs font-bold transition-colors ${
                probabilityDangerLeft === value
                  ? 'rounded-sm bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted/40'
              }`}
            >
              p(left) {(value * 100).toFixed(0)}%
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-2">
        <div className="bg-background p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">ACT NOW</p>
            <p data-act-now-value className="font-mono text-2xl font-black">
              {result.actNow.best.toFixed(2)}
            </p>
          </div>
          <p className="mt-3 text-sm font-semibold">{result.actNow.action}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            현재 belief에서 두 문 중 expected reward가 더 큰 쪽을 바로 연다.
          </p>
        </div>
        <div className="bg-violet-500/[0.035] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black text-violet-700 dark:text-violet-300">PROBE, THEN ACT</p>
            <p data-probe-value className="font-mono text-2xl font-black">
              {result.probe.toFixed(2)}
            </p>
          </div>
          <p className="mt-3 text-sm font-semibold">
            Signal branch의 최선 행동을 확률로 평균한 뒤 비용 0.50을 뺀다
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Probe advantage <strong className="font-mono text-foreground">{signed(result.probeAdvantage)}</strong>
          </p>
        </div>
      </div>

      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        {[
          ['왼쪽 위험 신호', result.leftSignal],
          ['오른쪽 위험 신호', result.rightSignal],
        ].map(([label, value]) => {
          const signal = value as ReturnType<typeof branch>;
          return (
            <div key={label as string} className="min-w-0 bg-background p-4">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold">{label as string}</span>
                <span className="font-mono text-muted-foreground">
                  P(signal) {signal.evidence.toFixed(2)}
                </span>
              </div>
              <p className="mt-3 font-mono text-sm font-black">
                posterior p(left) {(signal.posteriorLeft * 100).toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {signal.decision.action} · value {signal.decision.best.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        Entropy가 줄었다는 이유만으로 probe가 좋은 것은 아니다. 관측 뒤 실제 행동 가치가 얼마나
        개선되는지에서 sensing cost를 뺀 값이 양수여야 한다.
      </p>
    </figure>
  );
}
