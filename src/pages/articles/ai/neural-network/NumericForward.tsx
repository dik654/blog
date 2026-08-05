import { useState } from 'react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

type TraceStage = {
  id: string;
  label: string;
  tex: string;
  detail?: string;
  result: string;
  values: string[][];
  tone: string;
};

const stages: TraceStage[] = [
  { id: 'input', label: '1. 입력', tex: String.raw`x=[1,2]`, result: '두 특징을 가진 샘플 하나가 들어온다.', values: [['shape', '[2]'], ['값', '1, 2']], tone: '#0f766e' },
  { id: 'linear1', label: '2. 은닉 선형', tex: String.raw`z_1=[1,2]\begin{bmatrix}1&-1\\0.5&2\end{bmatrix}+[0,0]=[2,3]`, result: '첫 출력은 1×1+2×0.5=2, 둘째 출력은 1×(-1)+2×2=3이다.', values: [['W₁', '[2,2]'], ['z₁', '[2]']], tone: '#7c3aed' },
  { id: 'relu', label: '3. ReLU', tex: String.raw`a_1=\max(0,z_1)=[2,3]`, result: '두 값이 모두 양수라 이번 예제에서는 그대로 통과한다.', values: [['입력', '2, 3'], ['출력', '2, 3']], tone: '#2563eb' },
  { id: 'logit', label: '4. 출력 선형', tex: String.raw`z_2=[2,3]\begin{bmatrix}1\\-1\end{bmatrix}+0.5`, detail: String.raw`=2-3+0.5=-0.5`, result: '은닉값 두 개를 하나의 binary logit으로 합친다.', values: [['W₂', '[2,1]'], ['logit', '-0.5']], tone: '#e11d48' },
  { id: 'prob', label: '5. 확률', tex: String.raw`\hat{y}=\sigma(-0.5)\approx0.378`, result: '양성 클래스일 확률을 약 37.8%로 예측한다.', values: [['logit', '-0.5'], ['확률', '0.378']], tone: '#d97706' },
];

function NumericTrace() {
  const [activeId, setActiveId] = useState(stages[0].id);
  const active = stages.find((stage) => stage.id === activeId) ?? stages[0];
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border" data-numeric-forward-trace>
      <div className="grid grid-cols-2 border-b border-border bg-muted/20 sm:grid-cols-5" role="tablist" aria-label="순전파 단계">
        {stages.map((stage) => (
          <button key={stage.id} type="button" role="tab" aria-selected={stage.id === active.id} onClick={() => setActiveId(stage.id)} className={`min-h-11 border-b-2 px-2 py-2 text-xs font-semibold ${stage.id === active.id ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{stage.label}</button>
        ))}
      </div>
      <div className="border-l-[3px] p-4 transition-colors sm:p-6" style={{ borderColor: active.tone, background: `color-mix(in oklch, ${active.tone} 4%, var(--background))` }}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          {active.values.map(([label, value]) => <div key={label} className="bg-background p-3 text-center"><dt className="text-xs font-semibold" style={{ color: active.tone }}>{label}</dt><dd className="mt-1 font-mono text-sm font-bold">{value}</dd></div>)}
        </dl>
        <div className="mt-5 min-w-0 rounded-md bg-muted/20 px-2 py-3">
          <Math display className="my-0 text-sm sm:text-base">{active.tex}</Math>
          {active.detail && <Math display className="my-0 text-sm sm:text-base">{active.detail}</Math>}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.result}</p>
      </div>
    </div>
  );
}

export default function NumericForward() {
  return (
    <section id="forward" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">두 층의 순전파를 숫자로 따라가 보자</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          입력 특징 2개, 은닉 뉴런 2개, binary 출력 1개인 가장 작은 MLP를 계산한다. 각 탭에서 값과 shape를 함께 보면
          “행렬곱 → 편향 → 활성화”가 반복되고 마지막 출력만 과제에 맞게 달라진다는 사실을 확인할 수 있다.
        </p>
      </div>
      <NumericTrace />
      <FormulaNote
        meaning="첫 행렬곱은 입력 특징별 기여를 출력 좌표마다 더해 [2,3]을 만든다. ReLU는 음수만 막으므로 이번 값은 유지된다. 둘째 행렬곱은 두 은닉값을 2-3으로 합치고 편향 0.5로 기준점을 옮겨 logit -0.5를 만든다. 순전파는 이 값을 계산할 뿐 파라미터를 바꾸지 않는다."
        symbols={[
          ['z₁', '첫 선형층의 활성화 전 출력'],
          ['a₁', 'ReLU를 적용해 다음 층에 전달할 은닉 표현'],
          ['z₂', '확률로 바꾸기 전 binary logit'],
          [String.raw`\sigma(x)=\frac{1}{1+e^{-x}}`, 'logit x를 0과 1 사이 확률로 바꾸는 sigmoid. 여기서는 x=-0.5를 넣어 약 0.378을 얻는다.'],
          ['ŷ', '현재 모델의 최종 예측'],
        ]}
      />
    </section>
  );
}
