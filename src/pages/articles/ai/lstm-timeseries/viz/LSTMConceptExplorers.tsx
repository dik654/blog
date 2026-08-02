import { useState } from 'react';
import { ArrowRight, BrainCircuit, Database, Eye, Filter, Gauge, Plus, Radio, Sigma } from 'lucide-react';

export function MemoryGradientLab() {
  const [distance, setDistance] = useState(8);
  const [forgetRetention, setForgetRetention] = useState(0.96);
  const rnnGradient = Math.pow(0.58, distance);
  const cellGradient = Math.pow(forgetRetention, distance);
  const steps = Array.from({ length: distance + 1 }, (_, index) => index);

  return (
    <figure data-memory-gradient-lab className="foundation-viz-explorer not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">Gradient path lab</p>
        <h3 className="mt-1 text-base font-bold sm:text-lg">먼 과거의 책임이 현재까지 얼마나 남는지 곱해 본다</h3>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          역전파 거리 · {distance} step
          <input
            aria-label="역전파 거리"
            className="mt-1 block h-11 w-full cursor-pointer accent-rose-700"
            type="range"
            min="2"
            max="12"
            value={distance}
            onChange={(event) => setDistance(Number(event.target.value))}
          />
        </label>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          LSTM forget 유지율 · {forgetRetention.toFixed(2)}
          <input
            aria-label="LSTM forget gate 유지율"
            className="mt-1 block h-11 w-full cursor-pointer accent-emerald-700"
            type="range"
            min="0.7"
            max="1"
            step="0.01"
            value={forgetRetention}
            onChange={(event) => setForgetRetention(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {[
          {
            label: 'Vanilla RNN',
            detail: '매 step의 recurrent Jacobian을 다시 곱한다',
            value: rnnGradient,
            base: 0.58,
            color: 'bg-rose-600 dark:bg-rose-400',
          },
          {
            label: 'LSTM cell path',
            detail: 'cell state의 직접 경로에서는 forget gate를 곱한다',
            value: cellGradient,
            base: forgetRetention,
            color: 'bg-emerald-600 dark:bg-emerald-400',
          },
        ].map((row) => (
          <div key={row.label} className="grid min-w-0 gap-3 sm:grid-cols-[9rem_minmax(0,1fr)_6rem] sm:items-center">
            <div>
              <strong className="text-sm">{row.label}</strong>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.detail}</p>
            </div>
            <div className="grid min-w-0 gap-1" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-hidden="true">
              {steps.map((step) => {
                const opacity = Math.max(0.08, Math.pow(row.base, step));
                return <span key={step} className={`h-8 rounded-sm ${row.color} transition-opacity duration-200`} style={{ opacity }} />;
              })}
            </div>
            <div className="min-w-0 border-l-2 border-border pl-3">
              <span className="block text-xs text-muted-foreground">남은 기울기</span>
              <strong className="mt-1 block break-all font-mono text-sm">{row.value.toExponential(2)}</strong>
            </div>
          </div>
        ))}
        <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          이 실험은 구조를 분리해 보는 근사다. 실제 LSTM gradient에는 gate를 만드는 경로도 함께 들어간다. Forget gate가 항상 1인 것도 아니므로 LSTM이 장기 기억을 자동 보장하는 것은 아니다.
        </p>
      </div>
    </figure>
  );
}

const cellStages = [
  { id: 'forget', label: '1 · 과거 선택', icon: Filter, color: 'border-rose-600/45 bg-rose-500/[0.06]' },
  { id: 'write', label: '2 · 새 후보 기록', icon: Database, color: 'border-amber-600/45 bg-amber-500/[0.06]' },
  { id: 'update', label: '3 · Cell 갱신', icon: Plus, color: 'border-emerald-600/45 bg-emerald-500/[0.06]' },
  { id: 'read', label: '4 · Hidden 출력', icon: Eye, color: 'border-blue-600/45 bg-blue-500/[0.06]' },
] as const;

export function LSTMCellLab() {
  const [stageId, setStageId] = useState<(typeof cellStages)[number]['id']>('update');
  const [forget, setForget] = useState(0.75);
  const [input, setInput] = useState(0.4);
  const previousCell = 0.8;
  const candidate = 0.6;
  const output = 0.7;
  const kept = forget * previousCell;
  const written = input * candidate;
  const cell = kept + written;
  const hidden = output * Math.tanh(cell);
  const activeStage = cellStages.findIndex((stage) => stage.id === stageId);

  const stageDetails = [
    `${forget.toFixed(2)} × ${previousCell.toFixed(2)} = ${kept.toFixed(2)}`,
    `${input.toFixed(2)} × ${candidate.toFixed(2)} = ${written.toFixed(2)}`,
    `${kept.toFixed(2)} + ${written.toFixed(2)} = ${cell.toFixed(2)}`,
    `${output.toFixed(2)} × tanh(${cell.toFixed(2)}) = ${hidden.toFixed(2)}`,
  ];

  return (
    <figure data-lstm-cell-lab className="foundation-viz-explorer not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">One cell, one timestamp</p>
        <h3 className="mt-1 text-base font-bold sm:text-lg">게이트는 기억의 내용이 아니라 각 성분의 통과 비율을 만든다</h3>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          Forget gate fₜ · {forget.toFixed(2)}
          <input
            aria-label="Forget gate 값"
            className="mt-1 block h-11 w-full cursor-pointer accent-rose-700"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={forget}
            onChange={(event) => setForget(Number(event.target.value))}
          />
        </label>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          Input gate iₜ · {input.toFixed(2)}
          <input
            aria-label="Input gate 값"
            className="mt-1 block h-11 w-full cursor-pointer accent-amber-700"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={input}
            onChange={(event) => setInput(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4" aria-label="LSTM cell 계산 단계">
        {cellStages.map((stage) => {
          const Icon = stage.icon;
          const selected = stage.id === stageId;
          return (
            <button
              key={stage.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setStageId(stage.id)}
              className={`min-w-0 border-b bg-background p-3 text-left transition-colors sm:border-b-0 ${selected ? stage.color : 'border-transparent hover:bg-muted/40'}`}
            >
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <strong className="mt-2 block text-xs leading-snug">{stage.label}</strong>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
          {[
            { label: '남긴 과거', value: kept, detail: 'fₜ ⊙ Cₜ₋₁', color: 'border-rose-600/35 bg-rose-500/[0.05]' },
            { label: '기록할 후보', value: written, detail: 'iₜ ⊙ C̃ₜ', color: 'border-amber-600/35 bg-amber-500/[0.05]' },
            { label: '새 cell state', value: cell, detail: 'Cₜ', color: 'border-emerald-600/35 bg-emerald-500/[0.05]' },
          ].map((item, index) => (
            <div key={item.label} className="contents">
              <div className={`min-w-0 rounded-md border p-4 ${item.color} ${activeStage === index || (activeStage === 3 && index === 2) ? 'ring-2 ring-foreground/15' : ''}`}>
                <span className="block text-xs font-semibold text-muted-foreground">{item.label}</span>
                <strong className="mt-2 block font-mono text-2xl">{item.value.toFixed(2)}</strong>
                <span className="mt-1 block font-mono text-xs text-muted-foreground">{item.detail}</span>
              </div>
              {index < 2 && <ArrowRight className="mx-auto hidden h-4 w-4 self-center text-muted-foreground sm:block" aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div aria-live="polite" className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center">
          <div>
            <span className="text-xs font-semibold text-muted-foreground">현재 계산</span>
            <p className="mt-1 break-words font-mono text-sm font-bold">{stageDetails[activeStage]}</p>
          </div>
          <div className="rounded-md border border-blue-600/30 bg-blue-500/[0.05] p-3">
            <span className="block text-xs font-semibold text-muted-foreground">외부 출력 hₜ</span>
            <strong className="mt-1 block font-mono text-xl">{hidden.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </figure>
  );
}

const modelChoices = [
  {
    name: 'LSTM',
    icon: Radio,
    signal: '한 step씩 들어오는 streaming과 고정 크기 state',
    keep: '작은 recurrent baseline, bounded inference memory, 짧은 재학습 주기',
    pay: '학습 병렬성이 낮고 긴 과거를 하나의 state에 압축한다.',
  },
  {
    name: 'Transformer · TSFM',
    icon: BrainCircuit,
    signal: '많은 관련 series와 긴 context를 patch/token으로 함께 학습',
    keep: '병렬 학습, direct multi-horizon head, zero/few-shot pretrained 후보',
    pay: 'Context·KV·adapter 비용과 forecast-time interface 검증이 필요하다.',
  },
  {
    name: 'SSM · Hybrid',
    icon: Sigma,
    signal: '긴 sequence에서 state update와 parallel scan을 함께 노림',
    keep: '선형 시간 recurrence와 일부 attention을 조합할 수 있다.',
    pay: 'Forecasting 개선이 자동 보장되지 않으며 별도 architecture benchmark가 필요하다.',
  },
] as const;

export function SequenceModelChoice() {
  return (
    <div data-sequence-model-choice className="not-prose my-7 divide-y divide-border border-y border-border">
      {modelChoices.map(({ name, icon: Icon, signal, keep, pay }, index) => (
        <article key={name} className="grid min-w-0 gap-3 py-5 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)] sm:gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted/20">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="mt-1 text-sm font-bold">{name}</h3>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-relaxed">{signal}</p>
            <div className="mt-3 grid gap-3 text-xs leading-relaxed text-muted-foreground sm:grid-cols-2">
              <p className="border-l-2 border-emerald-600/40 pl-3"><strong className="text-foreground">얻는 것.</strong> {keep}</p>
              <p className="border-l-2 border-amber-600/40 pl-3"><strong className="text-foreground">치르는 것.</strong> {pay}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ForecastShapeStrip() {
  const items = [
    { icon: Database, label: 'Input', value: '[batch, time, feature]' },
    { icon: BrainCircuit, label: 'State', value: 'hₜ와 Cₜ' },
    { icon: Gauge, label: 'Head', value: 'point·quantile·H-step' },
  ];
  return (
    <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Icon className="h-4 w-4" aria-hidden="true" />{label}</div>
          <p className="mt-2 break-words font-mono text-sm font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}
