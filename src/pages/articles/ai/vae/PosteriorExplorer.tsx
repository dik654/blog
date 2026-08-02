import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';

function GaussianPlot({ mean, sigma }: { mean: number; sigma: number }) {
  const points = useMemo(() => {
    const values = Array.from({ length: 101 }, (_, index) => {
      const x = -4 + index * 0.08;
      const density = globalThis.Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * globalThis.Math.sqrt(2 * globalThis.Math.PI));
      return { x, density };
    });
    const max = globalThis.Math.max(...values.map((value) => value.density));
    return values.map(({ x, density }) => `${48 + ((x + 4) / 8) * 504},${184 - (density / max) * 132}`).join(' ');
  }, [mean, sigma]);
  const meanX = 48 + ((mean + 4) / 8) * 504;

  return (
    <figure aria-label={`평균 ${mean.toFixed(1)}, 표준편차 ${sigma.toFixed(2)}인 정규분포`}>
      <div className="mb-2 flex justify-end">
        <span className="rounded-sm border border-amber-500/35 bg-amber-500/5 px-2 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
          μ = {mean.toFixed(1)}
        </span>
      </div>
      <svg viewBox="0 0 600 190" aria-hidden="true" className="block aspect-[600/190] w-full">
        <line x1="48" y1="184" x2="552" y2="184" stroke="currentColor" opacity="0.25" />
        {[-4, -2, 0, 2, 4].map((tick) => {
          const x = 48 + ((tick + 4) / 8) * 504;
          return <line key={tick} x1={x} y1="176" x2={x} y2="184" stroke="currentColor" opacity="0.35" />;
        })}
        <polygon points={`48,184 ${points} 552,184`} fill="#2563eb" opacity="0.12" />
        <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="3" />
        <line x1={meanX} y1="34" x2={meanX} y2="184" stroke="#d97706" strokeWidth="2" strokeDasharray="5 5" />
      </svg>
      <div className="grid grid-cols-5 px-[8%] font-mono text-xs text-muted-foreground" aria-hidden="true">
        {[-4, -2, 0, 2, 4].map((tick) => <span key={tick} className="text-center">{tick}</span>)}
      </div>
    </figure>
  );
}

function PosteriorControl() {
  const [mean, setMean] = useState(0.6);
  const [logVariance, setLogVariance] = useState(-0.8);
  const variance = globalThis.Math.exp(logVariance);
  const sigma = globalThis.Math.sqrt(variance);
  const kl = 0.5 * (mean ** 2 + variance - 1 - logVariance);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="vae-mean" className="block text-xs font-semibold text-muted-foreground">평균 μ · {mean.toFixed(1)}<input id="vae-mean" type="range" min="-2.5" max="2.5" step="0.1" value={mean} onChange={(event) => setMean(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="vae-logvar" className="block text-xs font-semibold text-muted-foreground">log variance · {logVariance.toFixed(1)}<input id="vae-logvar" type="range" min="-2.5" max="1.5" step="0.1" value={logVariance} onChange={(event) => setLogVariance(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <GaussianPlot mean={mean} sigma={sigma} />
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3" aria-live="polite">
          {[['variance', variance.toFixed(3)], ['standard deviation', sigma.toFixed(3)], ['KL to N(0,1)', kl.toFixed(3)]].map(([label, value]) => <div key={label} className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-1 font-mono text-lg font-bold">{value}</p></div>)}
        </div>
      </div>
    </div>
  );
}

export default function PosteriorExplorer() {
  return (
    <section id="posterior" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Encoder는 z가 아니라 z의 분포 파라미터를 출력한다</h2>
      <QuestionLead
        question="분산이 음수가 될 수 없는데 neural network가 이를 안정적으로 어떻게 예측할까?"
        answer="Encoder는 평균 μ와 log variance를 제한 없는 실수로 출력한다. exp(log σ²)로 양수 variance를 얻고, 필요할 때 0.5배 후 exp해 standard deviation σ로 바꾼다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          평균은 입력 x가 latent 공간에서 놓일 중심을 정하고, 분산은 그 위치의 불확실성과 허용 영역을 정한다. 아래에서 평균을
          prior 중심 0에서 멀리 보내거나 분산을 1과 다르게 만들면 KL이 커진다. 이 값이 각 posterior를 공통 prior에 붙잡아 두는
          규제 비용이다.
        </p>
      </div>
      <PosteriorControl />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\sigma^2=\exp(\mathrm{logvar}),\quad \sigma=\exp(\tfrac12\mathrm{logvar})`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`D_{KL}=\tfrac12(\mu^2+\sigma^2-1-\log\sigma^2)`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="표준 정규 prior와 1차원 Gaussian posterior 사이의 KL은 closed form으로 계산된다. 여러 latent 차원에서는 각 차원의 값을 더하고 batch에서는 평균한다."
        symbols={[
          ['μ', '입력 x에 대한 posterior 중심'],
          ['logvar', '수치적으로 안정적으로 예측하는 log σ²'],
          ['σ', '분포의 폭이자 sampling noise의 scale'],
          ['KL', 'posterior가 표준 정규 prior에서 벗어난 정보 비용'],
        ]}
      />
    </section>
  );
}
