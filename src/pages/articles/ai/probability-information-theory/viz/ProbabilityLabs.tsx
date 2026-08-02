import { useMemo, useState } from 'react';
import { ArrowDown, RotateCcw, TriangleAlert } from 'lucide-react';

const outcomeLabels = ['A', 'B', 'C'] as const;
const outcomeValues = [0, 1, 2] as const;
const distributionPresets = [
  { label: '관측 비율', weights: [5, 4, 1] },
  { label: '균등', weights: [1, 1, 1] },
  { label: '한곳 집중', weights: [8, 1, 1] },
] as const;

export function logForEntropy(value: number) {
  return value > 0 ? globalThis.Math.log(value) : 0;
}

export function negativeLogQ(value: number) {
  return value > 0 ? -globalThis.Math.log(value) : Number.POSITIVE_INFINITY;
}

function entropy(values: number[], base = globalThis.Math.E) {
  return -values.reduce((sum, value) => sum + value * logForEntropy(value), 0)
    / globalThis.Math.log(base);
}

function format(value: number, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : '∞';
}

function RangeControl({
  id,
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block min-w-0 py-1">
      <span className="flex min-h-6 items-baseline justify-between gap-3 text-xs">
        <strong className="min-w-0">{label}</strong>
        <span className="shrink-0 font-mono font-bold text-muted-foreground">{valueLabel}</span>
      </span>
      <span className="flex min-h-11 items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="block w-full accent-blue-700 dark:accent-blue-300"
        />
      </span>
    </label>
  );
}

export function DistributionMomentLab() {
  const [weights, setWeights] = useState<number[]>([5, 4, 1]);
  const total = weights.reduce((sum, value) => sum + value, 0);
  const probabilities = weights.map((value) => value / globalThis.Math.max(1, total));
  const expectation = probabilities.reduce(
    (sum, probability, index) => sum + probability * outcomeValues[index],
    0,
  );
  const variance = probabilities.reduce(
    (sum, probability, index) => sum + probability * (outcomeValues[index] - expectation) ** 2,
    0,
  );
  const entropyBits = entropy(probabilities, 2);

  const updateWeight = (index: number, next: number) => {
    setWeights((current) => {
      const updated = current.map((value, valueIndex) => valueIndex === index ? next : value);
      return updated.every((value) => value === 0) ? current : updated;
    });
  };

  return (
    <figure
      data-distribution-moment-lab
      data-total-weight={total}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">DISTRIBUTION LAB</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">
          질량을 정규화하면 중심, 퍼짐, 불확실성이 함께 바뀐다
        </h3>
      </figcaption>

      <div className="grid min-w-0 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-border p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <p className="mb-3 text-xs font-bold text-muted-foreground">RAW WEIGHT · 아직 확률 아님</p>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
            {distributionPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setWeights([...preset.weights])}
                className="min-h-11 min-w-0 bg-background px-2 py-2 text-xs font-semibold leading-tight hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {weights.map((value, index) => (
              <RangeControl
                key={outcomeLabels[index]}
                id={`distribution-weight-${outcomeLabels[index]}`}
                label={`${outcomeLabels[index]} · 값 ${outcomeValues[index]}`}
                valueLabel={String(value)}
                min={0}
                max={10}
                step={1}
                value={value}
                onChange={(next) => updateWeight(index, next)}
              />
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            합계 {total}로 각 weight를 나누어야 비로소 합이 1인 분포가 된다.
          </p>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_13rem] xl:items-center">
            <div className="min-w-0 space-y-4">
              {probabilities.map((probability, index) => (
                <div key={outcomeLabels[index]} className="min-w-0">
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-semibold">P({outcomeLabels[index]})</span>
                    <span className="font-mono font-bold">{probability.toFixed(3)}</span>
                  </div>
                  <div className="h-5 overflow-hidden rounded-sm bg-muted" aria-hidden="true">
                    <div
                      className={`h-full transition-[width] duration-200 ${
                        index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                      style={{ width: `${probability * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border xl:grid-cols-1">
              <div className="min-w-0 bg-background p-3">
                <dt className="text-[11px] font-semibold text-muted-foreground">가중 중심 E[X]</dt>
                <dd data-distribution-expectation className="mt-1 font-mono text-lg font-black">
                  {format(expectation)}
                </dd>
              </div>
              <div className="min-w-0 bg-background p-3">
                <dt className="text-[11px] font-semibold text-muted-foreground">평균 제곱 거리 Var</dt>
                <dd data-distribution-variance className="mt-1 font-mono text-lg font-black">
                  {format(variance)}
                </dd>
              </div>
              <div className="min-w-0 bg-background p-3">
                <dt className="text-[11px] font-semibold text-muted-foreground">평균 surprisal H</dt>
                <dd data-distribution-entropy className="mt-1 font-mono text-lg font-black">
                  {format(entropyBits)} <span className="text-xs text-muted-foreground">bit</span>
                </dd>
              </div>
            </dl>
          </div>
          <p aria-live="polite" className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            같은 세 결과라도 질량이 한곳에 모이면 entropy가 줄고, 값의 위치까지 고려하는 expectation과 variance는
            서로 다른 방향으로 움직일 수 있다.
          </p>
        </div>
      </div>
    </figure>
  );
}

export function BayesEvidenceLab() {
  const [prevalence, setPrevalence] = useState(1);
  const [sensitivity, setSensitivity] = useState(99);
  const [falsePositiveRate, setFalsePositiveRate] = useState(5);
  const population = 10_000;
  const affected = population * prevalence / 100;
  const unaffected = population - affected;
  const truePositive = affected * sensitivity / 100;
  const falsePositive = unaffected * falsePositiveRate / 100;
  const allPositive = truePositive + falsePositive;
  const posterior = allPositive > 0 ? truePositive / allPositive : 0;

  return (
    <figure
      data-bayes-evidence-lab
      data-bayes-posterior={posterior.toFixed(6)}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">BAYES EVIDENCE LAB</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">
          관측 방향을 뒤집으려면 positive가 생긴 모든 경로를 세어야 한다
        </h3>
      </figcaption>

      <div className="grid min-w-0 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-border p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <RangeControl
            id="bayes-prevalence"
            label="상태 D의 비율"
            valueLabel={`${prevalence.toFixed(1)}%`}
            min={0.1}
            max={20}
            step={0.1}
            value={prevalence}
            onChange={setPrevalence}
          />
          <RangeControl
            id="bayes-sensitivity"
            label="D일 때 positive"
            valueLabel={`${sensitivity.toFixed(0)}%`}
            min={50}
            max={100}
            step={1}
            value={sensitivity}
            onChange={setSensitivity}
          />
          <RangeControl
            id="bayes-false-positive"
            label="D가 아닐 때 positive"
            valueLabel={`${falsePositiveRate.toFixed(1)}%`}
            min={0.1}
            max={20}
            step={0.1}
            value={falsePositiveRate}
            onChange={setFalsePositiveRate}
          />
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-stretch">
            <div className="min-w-0 rounded-md border border-emerald-600/30 bg-emerald-500/[0.055] p-4">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">D 경로 · 진양성</p>
              <p className="mt-2 font-mono text-2xl font-black">{truePositive.toFixed(0)}명</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {affected.toFixed(0)}명 × {sensitivity.toFixed(0)}%
              </p>
            </div>
            <div className="flex min-h-8 items-center justify-center text-muted-foreground">
              <span className="text-lg font-black sm:hidden">+</span>
              <ArrowDown className="hidden h-5 w-5 -rotate-90 sm:block" aria-hidden="true" />
            </div>
            <div className="min-w-0 rounded-md border border-amber-600/30 bg-amber-500/[0.055] p-4">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-200">¬D 경로 · 위양성</p>
              <p className="mt-2 font-mono text-2xl font-black">{falsePositive.toFixed(0)}명</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {unaffected.toFixed(0)}명 × {falsePositiveRate.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <strong className="text-sm">positive {allPositive.toFixed(0)}명 안에서 다시 정규화</strong>
              <span data-bayes-posterior-output className="font-mono text-xl font-black text-emerald-800 dark:text-emerald-200">
                P(D|+)={(posterior * 100).toFixed(1)}%
              </span>
            </div>
            <div
              className="flex h-12 overflow-hidden rounded-sm border border-border bg-muted"
              aria-label={`positive 집단 중 진양성 ${(posterior * 100).toFixed(1)}%, 위양성 ${((1 - posterior) * 100).toFixed(1)}%`}
            >
              <div className="h-full bg-emerald-600 transition-[width] duration-200" style={{ width: `${posterior * 100}%` }} />
              <div className="h-full bg-amber-600 transition-[width] duration-200" style={{ width: `${(1 - posterior) * 100}%` }} />
            </div>
            <p aria-live="polite" className="mt-3 text-xs leading-relaxed text-muted-foreground">
              sensitivity가 높아도 ¬D 모집단이 훨씬 크면 위양성 수가 진양성 수를 앞설 수 있다. 그래서
              P(+|D) 하나를 P(D|+)로 읽으면 안 된다.
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

function stableSoftmax(logits: number[], temperature: number, shift: number) {
  const scaled = logits.map((value) => (value + shift) / temperature);
  const maximum = globalThis.Math.max(...scaled);
  const exponentials = scaled.map((value) => globalThis.Math.exp(value - maximum));
  const denominator = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / denominator);
}

export function ScoreToLossLab() {
  const initialLogits = [2, 1, -1];
  const [logits, setLogits] = useState(initialLogits);
  const [temperature, setTemperature] = useState(1);
  const [trueClass, setTrueClass] = useState(1);
  const [shift, setShift] = useState(0);
  const empirical = [0.5, 0.4, 0.1];
  const probabilities = useMemo(
    () => stableSoftmax(logits, temperature, shift),
    [logits, temperature, shift],
  );
  const nll = negativeLogQ(probabilities[trueClass]);
  const crossEntropy = empirical.reduce(
    (sum, value, index) => value === 0 ? sum : sum + value * negativeLogQ(probabilities[index]),
    0,
  );
  const empiricalEntropy = entropy(empirical);
  const kl = crossEntropy - empiricalEntropy;
  const prediction = probabilities.indexOf(globalThis.Math.max(...probabilities));

  const reset = () => {
    setLogits(initialLogits);
    setTemperature(1);
    setTrueClass(1);
    setShift(0);
  };

  return (
    <figure
      data-score-to-loss-lab
      data-softmax-values={probabilities.map((value) => value.toFixed(6)).join(',')}
      data-nll={nll.toFixed(6)}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="flex min-w-0 items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-muted-foreground">SCORE → LOSS LAB</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">
            점수는 정규화되고, 정답 확률은 학습 비용이 된다
          </h3>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-border hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="초기값으로 되돌리기"
          title="초기값으로 되돌리기"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </figcaption>

      <div className="grid min-w-0 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-border p-4 sm:p-5 xl:border-b-0 xl:border-r">
          <div className="space-y-1">
            {logits.map((value, index) => (
              <RangeControl
                key={outcomeLabels[index]}
                id={`score-logit-${outcomeLabels[index]}`}
                label={`${outcomeLabels[index]} logit`}
                valueLabel={value.toFixed(1)}
                min={-4}
                max={4}
                step={0.1}
                value={value}
                onChange={(next) => setLogits((current) => current.map((item, itemIndex) => itemIndex === index ? next : item))}
              />
            ))}
          </div>
          <RangeControl
            id="score-temperature"
            label="temperature T"
            valueLabel={temperature.toFixed(1)}
            min={0.4}
            max={3}
            step={0.1}
            value={temperature}
            onChange={setTemperature}
          />

          <p className="mb-2 mt-3 text-xs font-bold text-muted-foreground">정답 class</p>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
            {outcomeLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                aria-pressed={trueClass === index}
                onClick={() => setTrueClass(index)}
                className={`min-h-11 min-w-0 bg-background px-2 text-sm font-bold ${
                  trueClass === index ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-4 text-xs font-bold text-muted-foreground">공통 shift</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
            {[0, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={shift === value}
                onClick={() => setShift(value)}
                className={`min-h-11 min-w-0 bg-background px-2 font-mono text-xs font-bold ${
                  shift === value ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'
                }`}
              >
                z {value === 0 ? '' : '+ 5'}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(7rem,1fr)_2rem_minmax(0,1.3fr)_2rem_minmax(7rem,1fr)] lg:items-center">
            <div className="min-w-0 rounded-md border border-border bg-muted/15 p-4">
              <p className="text-xs font-bold text-muted-foreground">1 · SCORE</p>
              <p className="mt-2 break-words font-mono text-sm font-black">
                ({logits.map((value) => (value + shift).toFixed(1)).join(', ')})
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                정규화 전 비교값이다. 음수와 임의의 합을 허용한다.
              </p>
            </div>
            <ArrowDown className="mx-auto h-5 w-5 text-muted-foreground lg:-rotate-90" aria-hidden="true" />
            <div className="min-w-0 rounded-md border border-blue-600/30 bg-blue-500/[0.055] p-4">
              <p className="text-xs font-bold text-blue-800 dark:text-blue-200">2 · SOFTMAX Q</p>
              <div className="mt-3 space-y-2.5">
                {probabilities.map((probability, index) => (
                  <div key={outcomeLabels[index]} className="grid grid-cols-[1rem_minmax(0,1fr)_3.6rem] items-center gap-2 text-xs">
                    <strong>{outcomeLabels[index]}</strong>
                    <div className="h-3 overflow-hidden rounded-sm bg-muted">
                      <div
                        className={index === trueClass ? 'h-full bg-emerald-600' : 'h-full bg-blue-600'}
                        style={{ width: `${probability * 100}%` }}
                      />
                    </div>
                    <span className="text-right font-mono font-bold">{probability.toFixed(3)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                예측 {outcomeLabels[prediction]} · 합 {probabilities.reduce((sum, value) => sum + value, 0).toFixed(3)}
              </p>
            </div>
            <ArrowDown className="mx-auto h-5 w-5 text-muted-foreground lg:-rotate-90" aria-hidden="true" />
            <div className="min-w-0 rounded-md border border-emerald-600/30 bg-emerald-500/[0.055] p-4">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">3 · LEARNING COST</p>
              <dl className="mt-3 space-y-3">
                <div>
                  <dt className="text-[11px] text-muted-foreground">한 표본 · 정답 {outcomeLabels[trueClass]}</dt>
                  <dd data-score-nll-output className="font-mono text-2xl font-black">NLL {format(nll)}</dd>
                </div>
                <div className="border-t border-border pt-3">
                  <dt className="text-[11px] text-muted-foreground">P=(0.5, 0.4, 0.1) 평균</dt>
                  <dd className="mt-1 font-mono text-sm font-bold">CE {format(crossEntropy)} nat</dd>
                  <dd className="font-mono text-sm font-bold">KL {format(kl)} nat</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-5 flex gap-3 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <p aria-live="polite">
              모든 logit에 {shift === 0 ? '5를 더해도' : '더한 5를 다시 빼도'} Q와 loss는 같다.
              softmax가 absolute score가 아니라 class 사이 차이만 보존하기 때문이다. T는 차이를 나누므로
              분포의 날카로움은 바꾸지만 순서는 바꾸지 않는다.
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
