import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

const forwardNodes = [
  { step: '01', op: '곱하기', tex: String.raw`u=wx`, input: 'w=3, x=2', output: 'u=6' },
  { step: '02', op: '더하기', tex: String.raw`z=u+b`, input: 'u=6, b=1', output: 'z=7' },
  { step: '03', op: '제곱', tex: String.raw`a=z^2`, input: 'z=7', output: 'a=49' },
  { step: '04', op: '손실', tex: String.raw`\mathcal{L}=\frac12(a-y)^2`, input: 'a=49, y=40', output: 'L=40.5' },
];

const backwardNodes = [
  { step: '04', op: '손실에서 시작', tex: String.raw`\frac{\partial\mathcal{L}}{\partial a}=a-y`, input: '49−40', output: '9' },
  { step: '03', op: '제곱을 통과', tex: String.raw`\frac{\partial\mathcal{L}}{\partial z}=9\cdot2z`, input: '9×14', output: '126' },
  { step: '02', op: '더하기를 통과', tex: String.raw`\frac{\partial\mathcal{L}}{\partial u}=\frac{\partial\mathcal{L}}{\partial b}=126`, input: 'local slope=1', output: '126, 126' },
  { step: '01', op: '곱하기를 통과', tex: String.raw`\frac{\partial\mathcal{L}}{\partial w}=126x`, input: '126×2', output: '252' },
];

function GraphPassViz() {
  const [mode, setMode] = useState<'forward' | 'backward'>('forward');
  const nodes = mode === 'forward' ? forwardNodes : backwardNodes;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border" data-computational-graph>
      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="계산 그래프 방향">
        <button type="button" role="tab" aria-selected={mode === 'forward'} onClick={() => setMode('forward')} className={`min-h-11 border-b-2 px-3 text-sm font-semibold ${mode === 'forward' ? 'border-blue-600 bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>순전파 값</button>
        <button type="button" role="tab" aria-selected={mode === 'backward'} onClick={() => setMode('backward')} className={`min-h-11 border-b-2 px-3 text-sm font-semibold ${mode === 'backward' ? 'border-rose-600 bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>역전파 gradient</button>
      </div>
      <div className="grid items-stretch bg-border md:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] md:gap-px">
        {nodes.map((node, index) => (
          <div key={`${mode}-${node.step}`} className="contents">
            <div className="min-w-0 bg-background p-3 sm:p-4" data-computational-node={node.step}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">NODE {node.step}</span>
                <span className="text-xs font-medium text-muted-foreground">{node.op}</span>
              </div>
              <div className="mt-4 min-w-0"><Math display className="my-0 text-sm">{node.tex}</Math></div>
              <p className="mt-3 text-xs text-muted-foreground">입력 · {node.input}</p>
              <p className="mt-1 text-sm font-semibold">출력 · {node.output}</p>
            </div>
            {index < nodes.length - 1 && (
              <div className="flex min-h-8 items-center justify-center bg-background text-muted-foreground" aria-hidden="true" data-computational-arrow>
                <ArrowDown className="h-4 w-4 md:hidden" data-arrow-down />
                <span className="hidden h-px flex-1 bg-border md:block" />
                <ArrowRight className="hidden h-4 w-4 shrink-0 md:block" data-arrow-right />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {mode === 'forward'
          ? '순전파 실행 순서 01→04를 따라 값을 만들고 backward에 필요한 중간값을 저장한다.'
          : '역전파 실행 순서 04→01을 따라 upstream gradient와 local derivative를 곱한다.'}
      </p>
    </div>
  );
}

export default function ComputationalGraph() {
  return (
    <section id="computational-graph" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">긴 수식을 계산 그래프로 바꾸면 무엇이 쉬워질까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          입력 x=2, 가중치 w=3, 편향 b=1인 작은 모델을 보자. 모델은 먼저 w와 x를 곱하고 b를 더한 뒤 결과를
          제곱한다. 정답 y=40과의 제곱 오차가 최종 손실이다. 전체 식을 한 번에 미분하지 않고 곱하기, 더하기, 제곱,
          손실 네 연산으로 나누면 각 node는 자신의 입력과 local derivative만 기억하면 된다.
        </p>
      </div>

      <div data-formula-pair>
        <GraphPassViz />
        <FormulaNote
          meaning="Forward 탭에서는 값을 만들고, Backward 탭에서는 같은 node를 역순으로 방문한다. 제곱 node의 local derivative 2z=14가 upstream gradient 9를 126으로 증폭시키는 지점을 주의해서 본다."
          symbols={[
            [String.raw`x=2,\ y=40`, '입력과 정답이며 이 예제에서는 고정된 값'],
            [String.raw`w=3,\ b=1`, 'gradient를 구할 학습 가능한 파라미터'],
            [String.raw`u,z,a`, '순전파가 만든 중간값으로 backward 계산에 재사용'],
            [String.raw`\partial\mathcal{L}/\partial w=252`, 'w를 아주 조금 키울 때 손실이 빠르게 증가하는 정도'],
            [String.raw`\partial\mathcal{L}/\partial b=126`, 'b를 아주 조금 키울 때 손실이 증가하는 정도'],
          ]}
        />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 중간값을 저장할까?</h3>
        <p>
          제곱의 미분에는 순전파 입력 z가 필요하고, 곱셈의 미분에는 x와 w가 필요하다. 이 값을 저장하지 않으면 backward
          중에 다시 계산해야 한다. 저장하면 메모리를 더 쓰고, 다시 계산하면 시간이 더 든다. activation checkpointing은
          바로 이 메모리와 재계산 사이의 교환을 조절하는 기법이다.
        </p>
      </div>
    </section>
  );
}
