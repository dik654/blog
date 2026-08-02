import { useState } from 'react';
import { SegmentedControl } from '../nlp-shared';

type ContextPreset = '32k' | '128k';

const contextTokens: Record<ContextPreset, number> = {
  '32k': 32_768,
  '128k': 131_072,
};

const totalLayers = 48;
const stateLayers = 36;
const attentionLayers = 12;
const heads = 8;
const keyDimension = 128;
const valueDimension = 128;
const bytesPerElement = 2;

function formatMiB(value: number) {
  if (value < 1) return `${Math.round(value * 1024)} KiB`;
  return Number.isInteger(value) ? `${value.toLocaleString()} MiB` : `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} MiB`;
}

export default function StateMemoryLedgerLab() {
  const [preset, setPreset] = useState<ContextPreset>('32k');
  const tokens = contextTokens[preset];
  const statePerLayer = (heads * keyDimension * valueDimension * bytesPerElement) / 2 ** 20;
  const attentionPerLayer = (2 * tokens * heads * keyDimension * bytesPerElement) / 2 ** 20;
  const stateTotal = stateLayers * statePerLayer;
  const attentionTotal = attentionLayers * attentionPerLayer;
  const hybridTotal = stateTotal + attentionTotal;
  const allAttentionTotal = totalLayers * attentionPerLayer;
  const reduction = 100 * (1 - hybridTotal / allAttentionTotal);
  const hybridWidth = 100 * hybridTotal / allAttentionTotal;

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background" data-state-memory-lab>
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black text-emerald-700 dark:text-emerald-300">MEMORY LEDGER · 교육용 48층 decoder</p>
          <h3 className="mt-2 text-lg font-bold">과거 token 목록과 고정 크기 state를 같은 단위로 더하기</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">3개 state layer 뒤에 1개 attention layer가 오는 cadence를 펼친다. Context가 길어져도 초록 state는 그대로지만 파란 KV는 token 수만큼 늘어난다.</p>
        </div>
        <SegmentedControl
          label="Context length"
          options={[{ value: '32k', label: '32K tokens' }, { value: '128k', label: '128K tokens' }]}
          value={preset}
          onChange={setPreset}
        />
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold text-muted-foreground">48개 layer type을 실제 순서로 펼침</p>
          <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-muted-foreground" aria-label="Layer type legend">
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 bg-emerald-500" />State 36</span>
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 bg-blue-600" />Attention 12</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-8 gap-1.5 sm:grid-cols-12" data-layer-cadence>
          {Array.from({ length: totalLayers }, (_, index) => {
            const isAttention = (index + 1) % 4 === 0;
            return (
              <div
                key={index}
                className={`grid aspect-square min-w-0 place-items-center border text-[9px] font-black ${isAttention ? 'border-blue-700/35 bg-blue-600 text-white' : 'border-emerald-700/25 bg-emerald-500/12 text-emerald-800 dark:text-emerald-200'}`}
                title={`Layer ${index + 1}: ${isAttention ? 'full attention' : 'state'}`}
              >
                {isAttention ? 'A' : 'S'}
              </div>
            );
          })}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-5">
          <Metric label="State · 한 층" value={formatMiB(statePerLayer)} attr="data-state-layer-bytes" />
          <Metric label={`KV · 한 층 · ${preset === '32k' ? '32K' : '128K'}`} value={formatMiB(attentionPerLayer)} attr="data-attention-layer-bytes" />
          <Metric label="Hybrid · 36S + 12A" value={formatMiB(hybridTotal)} attr="data-hybrid-memory" />
          <Metric label="All attention · 48A" value={formatMiB(allAttentionTotal)} attr="data-all-attention-memory" />
          <Metric label="Persistent memory 감소" value={`${reduction.toFixed(2)}%`} attr="data-memory-reduction" className="col-span-2 lg:col-span-1" accent />
        </dl>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
          <div className="space-y-4">
            <MemoryBar label="48개 all-attention layer" value={formatMiB(allAttentionTotal)} width={100} tone="bg-blue-600" />
            <MemoryBar label="36 state + 12 attention" value={formatMiB(hybridTotal)} width={hybridWidth} tone="bg-emerald-500" />
          </div>
          <div className="border-l-2 border-amber-500/50 bg-amber-500/[0.06] p-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="block text-foreground">이 수치는 구조를 읽기 위한 toy다.</strong>
            <span className="mt-2 block">실제 모델의 state shape, convolution buffer, gate·normalization state, allocator와 kernel workspace는 config와 runtime에서 따로 확인한다.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, attr, accent = false, className = '' }: { label: string; value: string; attr: string; accent?: boolean; className?: string }) {
  return (
    <div className={`min-w-0 bg-background p-4 ${accent ? 'text-emerald-800 dark:text-emerald-200' : ''} ${className}`} {...{ [attr]: value }}>
      <dt className="text-[10px] font-bold leading-relaxed text-muted-foreground">{label}</dt>
      <dd className="mt-2 break-words font-mono text-base font-black">{value}</dd>
    </div>
  );
}

function MemoryBar({ label, value, width, tone }: { label: string; value: string; width: number; tone: string }) {
  return (
    <div>
      <div className="flex min-w-0 items-baseline justify-between gap-3 text-xs">
        <span className="min-w-0 font-semibold">{label}</span>
        <span className="shrink-0 font-mono font-black">{value}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden bg-muted">
        <span className={`block h-full transition-[width] duration-500 ${tone}`} style={{ width: `${Math.max(1.5, width)}%` }} />
      </div>
    </div>
  );
}
