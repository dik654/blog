import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

function ReparameterizationExplorer() {
  const [mean, setMean] = useState(0.5);
  const [sigma, setSigma] = useState(0.8);
  const [epsilon, setEpsilon] = useState(-0.6);
  const z = mean + sigma * epsilon;
  const stages = [
    { label: '고정 noise', value: `ε = ${epsilon.toFixed(1)}`, note: 'ε ~ N(0,1)' },
    { label: '위치·크기 변환', value: 'μ + σ·ε', note: `${mean.toFixed(1)} + ${sigma.toFixed(1)}·${epsilon.toFixed(1)}` },
    { label: 'latent sample', value: `z = ${z.toFixed(2)}`, note: 'decoder 입력' },
  ];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-3 sm:p-6">
        <label htmlFor="reparam-mean" className="block text-xs font-semibold text-muted-foreground">μ · {mean.toFixed(1)}<input id="reparam-mean" type="range" min="-2" max="2" step="0.1" value={mean} onChange={(event) => setMean(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="reparam-sigma" className="block text-xs font-semibold text-muted-foreground">σ · {sigma.toFixed(1)}<input id="reparam-sigma" type="range" min="0.1" max="2" step="0.1" value={sigma} onChange={(event) => setSigma(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="reparam-epsilon" className="block text-xs font-semibold text-muted-foreground">ε · {epsilon.toFixed(1)}<input id="reparam-epsilon" type="range" min="-2.5" max="2.5" step="0.1" value={epsilon} onChange={(event) => setEpsilon(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="grid items-center gap-3 p-4 sm:p-6 lg:grid-cols-[1fr_2rem_1fr_2rem_1fr]">
        {stages.map((stage, index) => <div key={stage.label} className="contents"><div className={`min-w-0 rounded-md border p-4 text-center ${index === 2 ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}><p className="text-xs font-semibold text-muted-foreground">{stage.label}</p><p className="mt-2 break-words font-mono text-lg font-bold">{stage.value}</p><p className="mt-2 text-xs text-muted-foreground">{stage.note}</p></div>{index < stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>)}
      </div>
    </div>
  );
}

export default function ReparameterizationPath() {
  return (
    <section id="reparameterization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Sampling node를 어떻게 역전파 가능한 계산으로 바꿀까?</h2>
      <QuestionLead
        question="z를 qφ(z|x)에서 무작위로 뽑으면 reconstruction loss의 gradient가 encoder까지 어떻게 갈까?"
        answer="무작위성 ε을 파라미터와 무관한 외부 입력으로 분리하고 z=μ+σε라는 결정적 함수로 다시 쓴다. 그러면 같은 ε이 주어진 계산 그래프 안에서 μ와 σ의 미분 경로가 명시된다."
      />
      <ReparameterizationExplorer />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-3">
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\epsilon\sim\mathcal N(0,I)`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`z=\mu_\phi(x)+\sigma_\phi(x)\odot\epsilon`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\frac{\partial z}{\partial\mu}=1,\quad \frac{\partial z}{\partial\sigma}=\epsilon`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="분포의 위치 μ를 바꾸면 모든 sample이 같은 만큼 움직이고, scale σ의 gradient는 그때 뽑은 ε에 비례한다. 여러 ε sample의 Monte Carlo 평균으로 기대값 gradient를 근사한다."
        symbols={[
          ['ε', '파라미터와 독립인 표준 정규 noise'],
          ['⊙', 'latent 각 차원에서 수행하는 element-wise 곱'],
          ['z', 'decoder가 받는 posterior sample'],
        ]}
      />
      <Misconception>
        Reparameterization은 random sampling을 없애지 않는다. 무작위성이 계산 그래프의 어느 위치에 있는지 옮겨 gradient가 파라미터를 통과할 경로를 만든다.
      </Misconception>
    </section>
  );
}
