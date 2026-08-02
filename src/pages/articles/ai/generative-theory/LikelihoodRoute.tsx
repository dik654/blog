import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';

const tokens = ['오늘', '하늘은', '아주', '맑다'];
const probabilities = [0.62, 0.55, 0.78, 0.71];

function AutoregressiveExplorer() {
  const [known, setKnown] = useState(1);
  const joint = probabilities.slice(0, known).reduce((product, probability) => product * probability, 1);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="ar-prefix" className="block text-xs font-semibold text-muted-foreground">
          현재까지 곱한 조건부 확률 · {known}/{tokens.length}
          <input id="ar-prefix" type="range" min="1" max={tokens.length} step="1" value={known} onChange={(event) => setKnown(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-4">
          {tokens.map((token, index) => (
            <div key={token} className={`min-w-0 border p-3 ${index < known ? 'border-blue-500/50 bg-blue-500/5' : 'border-border text-muted-foreground'}`}>
              <p className="text-[11px] font-semibold">step {index + 1}</p>
              <p className="mt-2 break-words text-sm font-bold">{token}</p>
              <p className="mt-2 font-mono text-xs">p={probabilities[index].toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="text-xs leading-relaxed text-muted-foreground">문장 전체 확률은 이미 생성한 prefix가 주어졌을 때 다음 token 확률을 차례로 곱한 값이다. 한 항이 매우 작으면 전체 likelihood도 빠르게 작아진다.</p>
          <div className="sm:text-right"><p className="text-xs font-semibold text-muted-foreground">현재 prefix의 joint probability</p><p className="mt-1 font-mono text-2xl font-bold">{joint.toFixed(4)}</p></div>
        </div>
      </div>
    </div>
  );
}

export default function LikelihoodRoute() {
  return (
    <section id="likelihood" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Likelihood를 계산할 수 있으면 무엇이 쉬워질까?</h2>
      <QuestionLead
        question="고차원 이미지나 문장의 pθ(x)를 한 번에 계산하기 어렵다면 분포 학습을 포기해야 할까?"
        answer="아니다. Autoregressive 모델은 확률의 chain rule로 공동분포를 조건부 확률의 곱으로 정확히 분해한다. 대신 생성도 같은 순서를 따라야 해서 병렬화가 제한된다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Maximum likelihood estimation은 데이터에 높은 확률을 주도록 파라미터를 바꾼다. 로그를 취하면 작은 확률의 긴 곱이
          안정적인 합으로 바뀌고, 데이터 전체의 평균 negative log-likelihood를 loss로 쓸 수 있다. 이 기준은 모델 비교와
          학습에 명확하지만, 분포를 계산하기 쉬운 형태로 설계해야 한다는 제약을 만든다.
        </p>
      </div>
      <AutoregressiveExplorer />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`p_\theta(x)=\prod_{t=1}^{T}p_\theta(x_t\mid x_{<t})`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\log p_\theta(x)=\sum_{t=1}^{T}\log p_\theta(x_t\mid x_{<t})`}</MathFormula></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3 sm:col-span-2"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_{NLL}=-\frac{1}{N}\sum_{i=1}^{N}\log p_\theta(x^{(i)})`}</MathFormula></div>
      </div>
      <FormulaNote
        meaning="각 관측 샘플의 log-likelihood를 높이는 것은 데이터가 자주 나타나는 영역에 모델 확률을 더 배분하는 일이다. Autoregressive factorization은 이를 정확히 계산 가능하게 하지만 샘플 하나를 만들 때 T번의 순차 예측이 필요하다."
        symbols={[
          ['x<t', '현재 위치보다 앞에서 이미 관측하거나 생성한 prefix'],
          ['T', '문장의 token 수 또는 순서화한 이미지 element 수'],
          ['NLL', 'likelihood 최대화를 minimization loss로 바꾼 negative log-likelihood'],
        ]}
      />
    </section>
  );
}
