import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

const examples = [0.95, 0.7, 0.5, 0.1, 0.01];

function LossExplorer() {
  const [correctProbability, setCorrectProbability] = useState(0.7);
  const loss = -Math.log(correctProbability);
  const other = (1 - correctProbability) / 2;
  const distribution = [
    { label: '고양이 · 정답', value: correctProbability, color: 'bg-rose-600' },
    { label: '개', value: other, color: 'bg-cyan-600' },
    { label: '새', value: other, color: 'bg-violet-600' },
  ];
  const signalTone = correctProbability >= 0.8
    ? 'border-emerald-600 bg-emerald-500/[0.055]'
    : correctProbability >= 0.5
      ? 'border-amber-600 bg-amber-500/[0.055]'
      : 'border-rose-600 bg-rose-500/[0.07]';

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
        <p className="text-sm font-bold">정답 확률을 움직여 loss의 반응을 확인하기</p>
      </div>
      <div className="grid min-w-0 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:p-6">
        <div className="min-w-0 space-y-5">
          {distribution.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold">{item.label}</span><span className="font-mono font-bold">{(item.value * 100).toFixed(1)}%</span></div>
              <div className="h-3 overflow-hidden rounded-sm bg-muted"><div className={`h-full transition-[width] duration-300 ${item.color}`} style={{ width: `${item.value * 100}%` }} /></div>
            </div>
          ))}
          <div>
            <label htmlFor="correct-probability" className="text-xs font-semibold text-muted-foreground">정답 class 확률</label>
            <input id="correct-probability" type="range" min="0.01" max="0.99" step="0.01" value={correctProbability} onChange={(event) => setCorrectProbability(Number(event.target.value))} className="mt-3 w-full accent-blue-600" />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground"><span>0.01</span><span>0.99</span></div>
          </div>
        </div>
        <div className={`min-w-0 rounded-md border border-l-[3px] p-4 transition-colors ${signalTone}`}>
          <p className="text-xs font-semibold text-muted-foreground">학습 신호 · 이 샘플의 loss</p>
          <p className="mt-2 font-mono text-3xl font-bold">{loss.toFixed(3)}</p>
          <p className="mt-3 break-words font-mono text-xs text-muted-foreground">-ln({correctProbability.toFixed(2)})</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-background/70"><div className="h-full bg-current transition-[width] duration-300" style={{ width: `${Math.min(100, loss * 28)}%` }} /></div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            {correctProbability >= 0.8 ? '정답을 높은 확률로 맞혀 loss가 0에 가깝다.' : correctProbability >= 0.5 ? '정답이 가장 유력하지만 더 확신하도록 학습 신호가 남는다.' : '정답 확률이 낮아 큰 수정 신호를 만든다.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CrossEntropyExplorer() {
  return (
    <section id="numeric-example" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">정답 확률이 바뀔 때 loss는 얼마나 민감할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          아래 모델은 세 class의 확률 합을 항상 1로 유지한다. 정답인 고양이의 확률을 낮추면 나머지 두 class가 그 질량을
          나눠 갖는다. Cross-entropy는 “가장 큰 class가 정답인가”만 보는 accuracy와 달리 확신의 정도까지 연속적인 학습
          신호로 바꾼다.
        </p>
      </div>
      <LossExplorer />

      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] border-b border-border bg-muted/30 px-4 py-2 text-xs font-bold text-muted-foreground"><span>정답 확률</span><span className="text-right">-ln(p)</span></div>
        {examples.map((probability) => (
          <div key={probability} className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3 border-b border-border px-4 py-3 last:border-0">
            <div className="flex min-w-0 items-center gap-3"><span className="w-11 shrink-0 font-mono text-xs font-bold">{probability}</span><div className="h-2 min-w-0 flex-1 overflow-hidden rounded-sm bg-muted"><div className={`h-full ${probability >= 0.8 ? 'bg-emerald-600' : probability >= 0.5 ? 'bg-amber-600' : 'bg-rose-600'}`} style={{ width: `${probability * 100}%` }} /></div></div>
            <span className="text-right font-mono text-xs font-bold">{(-Math.log(probability)).toFixed(3)}</span>
          </div>
        ))}
      </div>
      <div className="not-prose grid min-w-0 gap-2">
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{\frac{\partial \ell}{\partial p_y}}_{\text{확률 자체에 대한 민감도}}=\underbrace{-\frac{1}{p_y}}_{\text{정답 확률이 낮을수록 가파름}}`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{\frac{\partial p_y}{\partial z_y}}_{\text{softmax의 logit 기울기}}=\underbrace{p_y(1-p_y)}_{\text{0과 1 근처에서 작아짐}}`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-teal-500/40 bg-teal-500/[0.055] p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\frac{\partial \ell}{\partial z_y}=-(1-p_y)=\underbrace{p_y-1}_{\text{p가 상쇄된 실제 backward 신호}}`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="-1/p는 확률 p를 직접 움직인다고 가정한 기울기다. 신경망은 확률이 아니라 logit z를 바꾸므로 softmax의 p(1-p)를 함께 곱해야 한다. 두 항의 p가 상쇄되어 실제 정답 logit 신호는 p-1이며 -1과 0 사이에 머문다."
        symbols={[
          [String.raw`p`, '현재 샘플의 정답 class에 부여한 확률'],
          [String.raw`z_y`, '정답 class의 softmax 이전 logit'],
          [String.raw`p_y-1`, '정답 class가 받는 bounded logit gradient'],
          [String.raw`\mathrm{accuracy}`, '확률의 크기는 버리고 최댓값 class가 맞는지만 세는 평가 지표'],
          [String.raw`\mathrm{calibration}`, '예측 확률 0.8인 샘플이 실제로도 약 80% 맞는 성질'],
        ]}
      />
    </section>
  );
}
