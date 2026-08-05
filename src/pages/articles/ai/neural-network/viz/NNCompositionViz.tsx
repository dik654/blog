import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import TeX from '@/components/scene/TeX';

const stageSets = {
  sample: [
    { id: 'input', index: '01', label: '입력', shape: '[2]', detail: '특징 2개', tone: 'border-border bg-muted/10' },
    { id: 'linear-1', index: '02', label: '선형층', shape: 'W¹ [2×3]', detail: '관점 3개로 투영', tone: 'border-border border-l-violet-500 bg-violet-500/[0.035]' },
    { id: 'hidden', index: '03', label: '은닉 표현', shape: 'a¹ [3]', detail: 'ReLU 뒤 값', tone: 'border-border border-l-blue-500 bg-blue-500/[0.035]' },
    { id: 'linear-2', index: '04', label: '출력층', shape: 'W² [3×2]', detail: '클래스 2개로 투영', tone: 'border-border border-l-violet-500 bg-violet-500/[0.035]' },
    { id: 'output', index: '05', label: 'Logits', shape: '[2]', detail: '확률 전 점수', tone: 'border-border bg-muted/10' },
  ],
  batch: [
    { id: 'input', index: '01', label: '입력 Batch', shape: '[B,2]', detail: 'B개 샘플', tone: 'border-border bg-muted/10' },
    { id: 'linear-1', index: '02', label: '선형층', shape: 'W¹ [2×3]', detail: '각 샘플을 3차원으로', tone: 'border-border border-l-violet-500 bg-violet-500/[0.035]' },
    { id: 'hidden', index: '03', label: '은닉 표현', shape: 'A¹ [B,3]', detail: 'B는 그대로 보존', tone: 'border-border border-l-blue-500 bg-blue-500/[0.035]' },
    { id: 'linear-2', index: '04', label: '출력층', shape: 'W² [3×2]', detail: '각 샘플을 2점수로', tone: 'border-border border-l-violet-500 bg-violet-500/[0.035]' },
    { id: 'output', index: '05', label: 'Logits', shape: '[B,2]', detail: '샘플마다 점수 2개', tone: 'border-border bg-muted/10' },
  ],
} as const;

function FlowArrow() {
  return (
    <div className="flex h-7 items-center justify-center text-muted-foreground md:h-auto" aria-hidden="true" data-nn-flow-arrow>
      <ArrowDown className="h-4 w-4 md:hidden" data-arrow-down />
      <span className="hidden h-px flex-1 bg-border md:block" />
      <ArrowRight className="hidden h-4 w-4 shrink-0 md:block" data-arrow-right />
    </div>
  );
}

export default function NNCompositionViz() {
  const [mode, setMode] = useState<keyof typeof stageSets>('batch');
  const stages = stageSets[mode];

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background" data-nn-composition>
      <figcaption className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
        <span className="grid min-w-0 flex-1 gap-1">
          <span className="text-xs font-bold text-violet-700 dark:text-violet-300">SHAPE TRACE · ONE OR MANY SAMPLES</span>
          <span className="text-sm font-semibold">뉴런을 세는 대신, 층 경계마다 tensor의 모양을 추적한다</span>
        </span>
        <span className="grid w-full grid-cols-2 overflow-hidden rounded-md border border-border sm:w-auto sm:min-w-52" role="tablist" aria-label="신경망 shape 추적 모드">
          {(Object.keys(stageSets) as Array<keyof typeof stageSets>).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className={`min-h-9 px-3 text-xs font-semibold transition-colors ${
                mode === key ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted/40'
              }`}
            >
              {key === 'sample' ? '샘플 1개' : 'Batch B개'}
            </button>
          ))}
        </span>
      </figcaption>

      <div className="p-4 sm:p-5">
        <ol className="grid min-w-0 items-stretch md:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1.15fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1.15fr)_1rem_minmax(0,1fr)]">
          {stages.map((stage, index) => (
            <div key={stage.id} className="contents">
              <li className={`min-w-0 rounded-md border border-l-2 p-3 md:p-2.5 lg:p-3 ${stage.tone}`} data-nn-stage={stage.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{stage.index}</span>
                  <span className="font-mono text-xs font-bold text-foreground">{stage.shape}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">{stage.label}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{stage.detail}</p>
                {stage.id === 'hidden' && (
                  <div className="mt-3 grid grid-cols-3 gap-1" aria-label="은닉 뉴런 3개">
                    {[1, 2, 3].map((unit) => <span key={unit} className="flex h-6 items-center justify-center rounded-sm border border-blue-500/30 bg-background font-mono text-xs text-foreground">h{unit}</span>)}
                  </div>
                )}
              </li>
              {index < stages.length - 1 && <FlowArrow />}
            </div>
          ))}
        </ol>
      </div>

      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        <div className="min-w-0 bg-violet-500/[0.035] px-4 py-3 text-xs leading-relaxed sm:px-5">
          <strong className="text-foreground">값의 흐름</strong>
          <div className="mt-1 text-muted-foreground"><TeX text={String.raw`$x \rightarrow z^{(1)} \rightarrow a^{(1)} \rightarrow z^{(2)}$`} /></div>
        </div>
        <div className="min-w-0 bg-background px-4 py-3 text-xs leading-relaxed sm:px-5">
          <strong className="text-foreground">shape 검산</strong>
          <p className="mt-1 text-muted-foreground">
            앞 층의 출력 폭 3이 W²의 입력 폭 3과 일치해야 한다. Batch 모드에서는 B가 계산에 섞이지 않고 입력부터 출력까지 남는다.
          </p>
        </div>
      </div>
    </figure>
  );
}
