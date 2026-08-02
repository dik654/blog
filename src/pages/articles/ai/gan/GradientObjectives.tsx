import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';

function GradientExplorer() {
  const [score, setScore] = useState(0.08);
  const minimaxLoss = globalThis.Math.log(1 - score);
  const nonSaturatingLoss = -globalThis.Math.log(score);
  const minimaxGradient = score;
  const nonSaturatingGradient = 1 - score;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="gan-score" className="block text-xs font-semibold text-muted-foreground">D(G(z)) · fake를 real로 본 확률 {score.toFixed(2)}<input id="gan-score" type="range" min="0.01" max="0.99" step="0.01" value={score} onChange={(event) => setScore(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 border-l-4 border-zinc-400 pl-4"><p className="text-xs font-semibold text-muted-foreground">Minimax generator</p><p className="mt-2 font-mono text-lg font-bold">loss {minimaxLoss.toFixed(3)}</p><div className="mt-3 h-2 bg-muted"><div className="h-full bg-zinc-500" style={{ width: `${minimaxGradient * 100}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">logit gradient 크기 · {minimaxGradient.toFixed(2)}</p></div>
          <div className="min-w-0 border-l-4 border-blue-600 pl-4"><p className="text-xs font-semibold text-muted-foreground">Non-saturating generator</p><p className="mt-2 font-mono text-lg font-bold">loss {nonSaturatingLoss.toFixed(3)}</p><div className="mt-3 h-2 bg-muted"><div className="h-full bg-blue-600" style={{ width: `${nonSaturatingGradient * 100}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">logit gradient 크기 · {nonSaturatingGradient.toFixed(2)}</p></div>
        </div>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">학습 초기에 D가 fake를 쉽게 잡아 score가 0에 가까우면 minimax gradient는 거의 사라진다. Non-saturating 목적은 같은 fixed point를 향하지만 이 구간에서 큰 gradient를 준다.</p>
      </div>
    </div>
  );
}

export default function GradientObjectives() {
  return (
    <section id="game" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 균형을 향해도 generator loss는 왜 바꿔 쓸까?</h2>
      <QuestionLead
        question="강한 discriminator가 fake에 0에 가까운 점수를 주면 generator가 더 잘 배워야 하지 않을까?"
        answer="원래 minimax 식에서는 sigmoid가 포화된 구간의 gradient도 작아져 오히려 G가 거의 배우지 못한다. Non-saturating loss -log D(G(z))는 이 구간의 gradient를 크게 유지한다."
      />
      <GradientExplorer />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_G^{minimax}=\mathbb E_z[\log(1-D(G(z)))]`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_G^{NS}=-\mathbb E_z[\log D(G(z))]`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-border p-3 sm:col-span-2"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`D^*(x)=\frac{p_{data}(x)}{p_{data}(x)+p_g(x)}`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="고정된 generator에서 최적 discriminator는 real과 generated density의 비율을 복원한다. 이 이상적 D를 원래 value function에 대입하면 generator는 Jensen-Shannon divergence를 줄인다. 실제 학습에서는 D가 매 순간 최적이 아니므로 이론적 결론과 optimizer dynamics를 구분해야 한다."
        symbols={[
          ['D*', '현재 generator에 대한 이상적인 최적 discriminator'],
          ['p_g', 'z를 G로 보냈을 때 생기는 implicit distribution'],
          ['NS', '초기 gradient 포화를 줄이는 non-saturating objective'],
        ]}
      />
    </section>
  );
}
