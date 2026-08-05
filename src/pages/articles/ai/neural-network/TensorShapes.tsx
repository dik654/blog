import { useState } from 'react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';
import BatchShapeDebugger from './viz/BatchShapeDebugger';

const shapeModes = {
  sample: {
    label: '샘플 하나',
    nodes: [
      ['입력 x', '[d]'],
      ['가중치 W', '[d, h]'],
      ['편향 b', '[h]'],
      ['출력 z', '[h]'],
    ],
    detail: 'd개의 입력 특징 하나를 h개의 출력 특징으로 바꾼다.',
  },
  batch: {
    label: 'Batch',
    nodes: [
      ['입력 X', '[B, d]'],
      ['가중치 W', '[d, h]'],
      ['편향 b', '[h]'],
      ['출력 Z', '[B, h]'],
    ],
    detail: '같은 W와 b를 B개 샘플에 동시에 적용한다. b는 첫 차원으로 broadcast된다.',
  },
};

function ShapeFlow() {
  const [mode, setMode] = useState<keyof typeof shapeModes>('batch');
  const active = shapeModes[mode];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="입력 shape 모드">
        {(Object.keys(shapeModes) as Array<keyof typeof shapeModes>).map((key) => (
          <button key={key} type="button" role="tab" aria-selected={mode === key} onClick={() => setMode(key)} className={`min-h-11 border-b-2 px-3 text-sm font-semibold ${mode === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>
            {shapeModes[key].label}
          </button>
        ))}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-4">
        {active.nodes.map(([label, shape], index) => (
          <div key={label} className="min-w-0 bg-background p-4 text-center">
            <p className="font-mono text-[11px] font-bold text-muted-foreground">0{index + 1}</p>
            <p className="mt-3 text-sm font-semibold">{label}</p>
            <p className="mt-2 font-mono text-base font-bold">{shape}</p>
          </div>
        ))}
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">{active.detail}</p>
    </div>
  );
}

export default function TensorShapes() {
  return (
    <section id="tensor-shapes" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">행렬곱 전에 어떤 shape를 확인해야 할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          선형층의 입력 특징 수 d와 가중치 W의 첫 차원 d는 같아야 한다. 이 가운데 차원이 맞으면 사라지고, W의 두 번째
          차원 h가 출력 특징 수로 남는다. batch 차원 B는 샘플을 묶는 차원이므로 가중치와 곱해지지 않고 출력에도 그대로 남는다.
        </p>
      </div>

      <ShapeFlow />
      <Math display>{String.raw`X_{[B\times d]}W_{[d\times h]}+b_{[h]}=Z_{[B\times h]}`}</Math>
      <FormulaNote
        meaning="가중치의 입력 차원 d가 X의 마지막 차원과 같아야 한다. 편향 b는 h개 출력 특징에 맞춰 모든 batch 행에 반복해서 더해진다."
        symbols={[
          ['B', '한 번에 처리하는 샘플 수'],
          ['d', '현재 층이 받는 입력 특징 수'],
          ['h', '현재 층이 만드는 출력 특징 수'],
          ['broadcast', '실제 복사 없이 b를 각 샘플 행에 같은 방식으로 적용하는 규칙'],
        ]}
      />

      <Misconception>
        가중치 shape를 [h,d]로 저장하는 라이브러리도 있다. 수학 표기와 메모리 저장 방향이 다를 수 있으므로 외우기보다 사용하는 API의 입력·출력 shape를 확인해야 한다.
      </Misconception>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <h3>B=1에서 통과한 전치 코드는 왜 batch에서 깨질까?</h3>
        <p>
          PyTorch는 Linear 가중치를 <code>[out_features, in_features]</code>로 저장하지만 실제 변환은
          <Math>{String.raw`xW^\top+b`}</Math>다. 샘플 벡터 하나에 <code>W @ x</code>를 적용하면 결과가 나오므로 방향을 맞췄다고
          착각하기 쉽다. 그러나 같은 코드를 <code>X[B,d]</code>에 적용하면 batch 차원 B가 행렬곱 안쪽으로 들어가
          shape가 깨진다. 아래에서 입력만 batch로 바꿔 두 구현의 차이를 확인한다.
        </p>
      </div>
      <Math display>{String.raw`\begin{aligned}
W_{\mathrm{math}}\,[d,h] &= W_{\mathrm{store}}^{\mathsf T}\,[d,h] \\
Z &= XW_{\mathrm{math}}+b = XW_{\mathrm{store}}^{\mathsf T}+b
\end{aligned}`}</Math>
      <FormulaNote
        meaning="두 식은 같은 파라미터로 같은 출력을 만든다. 이 글의 수학 표기는 입력 방향 d를 먼저 적어 XW로 계산하고, PyTorch는 출력 방향 h를 먼저 저장하므로 계산할 때 저장 행렬을 전치한다."
        symbols={[
          [String.raw`W_{\mathrm{math}}\,[d,h]`, '입력 특징 d를 행, 출력 특징 h를 열로 놓은 이 글의 수학 표기'],
          [String.raw`W_{\mathrm{store}}\,[h,d]`, 'PyTorch Linear가 실제로 보관하는 가중치 shape'],
          ['T', '저장된 [h,d]의 두 축을 바꿔 [d,h]로 맞추는 전치'],
          ['B', '두 표기 모두 건드리지 않고 출력까지 보존하는 batch 축'],
        ]}
      />
      <BatchShapeDebugger />
    </section>
  );
}
