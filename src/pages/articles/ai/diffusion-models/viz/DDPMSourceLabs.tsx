import { useMemo, useState } from 'react';
import { Check, CircleDot, FlaskConical, Shuffle } from 'lucide-react';

function scheduleAt(t: number) {
  let alphaBar = 1;
  let alphaBarPrev = 1;
  let beta = 0.0001;
  for (let step = 1; step <= t; step += 1) {
    beta = 0.0001 + (0.02 - 0.0001) * ((step - 1) / 999);
    alphaBarPrev = alphaBar;
    alphaBar *= 1 - beta;
  }
  return { alpha: 1 - beta, alphaBar, alphaBarPrev, beta };
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`min-w-0 px-4 py-3 ${accent ? 'bg-foreground text-background' : 'bg-background'}`}>
      <p className={`text-xs font-semibold ${accent ? 'text-background/70' : 'text-muted-foreground'}`}>{label}</p>
      <p className="mt-1 break-words font-mono text-base font-bold sm:text-lg">{value}</p>
    </div>
  );
}

export function PosteriorBalanceLab() {
  const [t, setT] = useState(500);
  const values = useMemo(() => {
    const { alpha, alphaBar, alphaBarPrev, beta } = scheduleAt(t);
    const x0 = 0.8;
    const epsilon = -0.6;
    const xt = Math.sqrt(alphaBar) * x0 + Math.sqrt(1 - alphaBar) * epsilon;
    const x0Weight = (Math.sqrt(alphaBarPrev) * beta) / (1 - alphaBar);
    const xtWeight = (Math.sqrt(alpha) * (1 - alphaBarPrev)) / (1 - alphaBar);
    const posteriorMean = x0Weight * x0 + xtWeight * xt;
    const posteriorVariance = ((1 - alphaBarPrev) / (1 - alphaBar)) * beta;
    return { beta, xt, x0Weight, xtWeight, posteriorMean, posteriorVariance };
  }, [t]);

  return (
    <figure data-ddpm-posterior-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div>
          <p className="text-sm font-bold">Posterior balance lab</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">현재 noisy state와 clean anchor가 직전 state의 평균을 얼마나 나눠 설명하는지 계산한다.</p>
        </div>
        <div className="flex gap-1" aria-label="Posterior timestep">
          {[100, 500, 900].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setT(value)}
              className={`min-h-9 rounded-md border px-3 text-xs font-bold transition-colors ${t === value ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted'}`}
            >
              t={value}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-px border-x border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="관측한 noisy xₜ" value={values.xt.toFixed(4)} />
        <Metric label="x₀가 주는 평균 계수" value={values.x0Weight.toFixed(4)} />
        <Metric label="xₜ가 주는 평균 계수" value={values.xtWeight.toFixed(4)} />
        <Metric label="posterior 평균 μ̃ₜ" value={values.posteriorMean.toFixed(4)} accent />
      </div>
      <div className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold">새 noise variance βₜ</span>
            <span className="font-mono">{values.beta.toFixed(6)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-amber-500" style={{ width: `${Math.min(100, values.beta * 5000)}%` }} /></div>
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold">조건을 본 posterior variance β̃ₜ</span>
            <span className="font-mono">{values.posteriorVariance.toFixed(6)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-emerald-600" style={{ width: `${Math.min(100, values.posteriorVariance * 5000)}%` }} /></div>
        </div>
      </div>
      <figcaption className="pb-5 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">읽는 법.</strong> x₀라는 추가 단서를 조건으로 보았기 때문에 β̃ₜ는 βₜ보다 크지 않다. Reverse model은 inference에서 x₀를 모르므로 network가 이 posterior mean을 근사해야 한다.
      </figcaption>
    </figure>
  );
}

type ObjectiveMode = 'vlb' | 'simple';

export function ObjectiveTradeoffLab() {
  const [mode, setMode] = useState<ObjectiveMode>('simple');
  const [t, setT] = useState(500);
  const { alpha, alphaBar, beta } = scheduleAt(t);
  const vlbWeight = beta / (2 * alpha * (1 - alphaBar));
  const normalized = Math.min(100, 8 + Math.log10(1 + vlbWeight * 10000) * 23);

  return (
    <figure data-ddpm-objective-lab className="not-prose my-8 border-y border-border">
      <header className="grid border-x border-border sm:grid-cols-2" role="tablist" aria-label="DDPM objective 비교">
        {([
          ['vlb', 'Variational bound · codelength'],
          ['simple', 'L simple · sample quality'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`min-h-12 border-b-2 px-3 text-xs font-bold sm:text-sm ${mode === key ? 'border-foreground bg-muted/35 text-foreground' : 'border-transparent text-muted-foreground hover:bg-muted/20'}`}
          >
            {label}
          </button>
        ))}
      </header>
      <div className="grid gap-6 py-5 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-end">
        <div>
          <label htmlFor="ddpm-objective-t" className="text-xs font-semibold text-muted-foreground">오차가 생긴 timestep · {t}</label>
          <input id="ddpm-objective-t" type="range" min="1" max="1000" step="1" value={t} onChange={(event) => setT(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-[width,background-color] duration-300 ${mode === 'vlb' ? 'bg-amber-500' : 'bg-emerald-600'}`}
              style={{ width: `${mode === 'vlb' ? normalized : 62}%` }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {mode === 'vlb'
              ? `σₜ²=βₜ를 고른 Eq. 12의 noise-MSE weight 예시: ${vlbWeight.toExponential(2)}. timestep마다 같은 오차가 다른 codelength 기여를 갖는다.`
              : 'Eq. 14는 timestep을 균등하게 뽑고 이 weight를 버린다. 작은-noise 항의 지배를 줄여 더 어려운 denoising에 학습 용량을 돌린다.'}
          </p>
        </div>
        <div className="border-l-2 border-border pl-4">
          <p className="text-xs font-semibold text-muted-foreground">논문 Table 2에서</p>
          <p className="mt-2 text-lg font-black">{mode === 'vlb' ? 'NLL 3.70 bits/dim' : 'FID 3.17 · IS 9.46'}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {mode === 'vlb' ? 'fixed isotropic variance의 exact bound가 더 나은 codelength를 보였다.' : 'reweighted objective가 훨씬 나은 sample quality를 보였다.'}
          </p>
        </div>
      </div>
      <figcaption className="flex gap-2 pb-5 text-xs leading-relaxed text-muted-foreground">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
        같은 network라도 “확률적 압축을 잘하는가”와 “샘플이 좋아 보이는가”는 같은 최적화 목표가 아니다.
      </figcaption>
    </figure>
  );
}

export function SamplerStepLab() {
  const [t, setT] = useState(500);
  const [epsilonPrediction, setEpsilonPrediction] = useState(-0.35);
  const { alpha, alphaBar, alphaBarPrev, beta } = scheduleAt(t);
  const xt = 0.35;
  const z = t > 1 ? 0.6 : 0;
  const correction = (beta / Math.sqrt(1 - alphaBar)) * epsilonPrediction;
  const mean = (xt - correction) / Math.sqrt(alpha);
  const betaTilde = ((1 - alphaBarPrev) / (1 - alphaBar)) * beta;
  const stochastic = Math.sqrt(Math.max(0, betaTilde)) * z;
  const previous = mean + stochastic;

  return (
    <figure data-ddpm-sampler-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-2">
          <Shuffle className="size-4 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-bold">Algorithm 2 · one-step executor</p>
        </div>
        <div className="flex gap-1" aria-label="Sampling timestep">
          {[500, 1].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setT(value)}
              className={`min-h-9 rounded-md border px-3 text-xs font-bold ${t === value ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'}`}
            >
              {value === 1 ? 't=1 · 마지막' : 't=500'}
            </button>
          ))}
        </div>
      </header>
      <div className="pb-5">
        <label htmlFor="ddpm-epsilon-prediction" className="text-xs font-semibold text-muted-foreground">network의 ε 예측 · {epsilonPrediction.toFixed(2)}</label>
        <input id="ddpm-epsilon-prediction" type="range" min="-1" max="1" step="0.05" value={epsilonPrediction} onChange={(event) => setEpsilonPrediction(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
      </div>
      <div className="grid gap-px border-x border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="현재 xₜ" value={xt.toFixed(4)} />
        <Metric label="noise correction" value={(-correction).toFixed(4)} />
        <Metric label={t === 1 ? 'σₜz · 강제로 0' : 'σₜz · stochastic'} value={stochastic.toFixed(4)} />
        <Metric label="다음 xₜ₋₁" value={previous.toFixed(4)} accent />
      </div>
      <figcaption className="grid gap-3 py-5 sm:grid-cols-2">
        <p className="flex gap-2 text-xs leading-relaxed text-muted-foreground"><CircleDot className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" /><span><strong className="text-foreground">t&gt;1:</strong> 이 lab은 σₜ²=β̃ₜ를 골랐다. mean에 Gaussian noise를 더해 reverse distribution에서 sample한다.</span></p>
        <p className="flex gap-2 text-xs leading-relaxed text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" /><span><strong className="text-foreground">t=1:</strong> z=0으로 두고 마지막 mean을 그대로 x₀로 반환한다.</span></p>
      </figcaption>
    </figure>
  );
}
