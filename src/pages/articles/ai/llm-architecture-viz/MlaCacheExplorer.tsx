import { useMemo, useState } from 'react';
import { SegmentedControl } from '../nlp-shared';

type Mode = 'mha' | 'gqa' | 'mla';
type Context = '4096' | '32768' | '131072';

const layers = 60;
const queryHeads = 128;
const kvHeads = 8;
const headDimension = 128;
const latentDimension = 512;
const ropeDimension = 64;
const bytesPerElement = 2;

const layouts = {
  mha: {
    label: 'MHA',
    short: 'K/V head 128개',
    tone: 'bg-rose-600',
    border: 'border-rose-600/30 bg-rose-500/[0.045]',
    stored: '각 head의 K와 V',
    width: 2 * queryHeads * headDimension,
    steps: ['hidden 입력', '128개 K/V 투영', 'head별 K/V 저장', '같은 head끼리 조회'],
  },
  gqa: {
    label: 'GQA',
    short: 'K/V head 8개',
    tone: 'bg-blue-600',
    border: 'border-blue-600/30 bg-blue-500/[0.045]',
    stored: '공유 K/V head 8쌍',
    width: 2 * kvHeads * headDimension,
    steps: ['hidden 입력', '8개 K/V 투영', '공유 K/V 저장', 'Q 16개씩 공동 조회'],
  },
  mla: {
    label: 'MLA',
    short: 'latent 512 + RoPE 64',
    tone: 'bg-emerald-600',
    border: 'border-emerald-600/30 bg-emerald-500/[0.045]',
    stored: '공유 KV latent와 RoPE key',
    width: latentDimension + ropeDimension,
    steps: ['hidden 입력', '공유 latent 압축', 'latent + RoPE 저장', '흡수된 투영으로 조회'],
  },
} as const;

function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MiB`;
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

export default function MlaCacheExplorer() {
  const [mode, setMode] = useState<Mode>('mla');
  const [context, setContext] = useState<Context>('32768');
  const [batch, setBatch] = useState(2);

  const result = useMemo(() => {
    const tokenCount = Number(context);
    const selected = layouts[mode];
    const mhaBytesPerToken = layers * layouts.mha.width * bytesPerElement;
    const bytesPerToken = layers * selected.width * bytesPerElement;
    const totalBytes = batch * tokenCount * bytesPerToken;
    const mhaBytes = batch * tokenCount * mhaBytesPerToken;
    const saving = 100 * (1 - totalBytes / mhaBytes);
    return { selected, bytesPerToken, totalBytes, mhaBytes, saving };
  }, [batch, context, mode]);

  return (
    <div data-kv-layout-lab className="not-prose my-10 overflow-hidden rounded-md border border-border bg-background">
      <header className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">CACHE LAYOUT LAB · 같은 context, 다른 저장 단위</p>
          <h3 className="mt-2 text-lg font-bold">Head를 줄이는가, 저장 표현을 바꾸는가?</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            DeepSeek-V2의 60-layer, Q head 128개, head 폭 128, fp16을 같은 비교 틀로 둔다. GQA 8-head는 비교 기준선이고, MLA는 실제 latent 저장 폭을 사용한다.
          </p>
        </div>
        <SegmentedControl
          label="KV cache layout"
          options={[
            { value: 'mha', label: 'MHA' },
            { value: 'gqa', label: 'GQA' },
            { value: 'mla', label: 'MLA' },
          ]}
          value={mode}
          onChange={setMode}
        />
      </header>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Context</p>
            <div className="mt-2">
              <SegmentedControl
                label="KV cache context"
                options={[
                  { value: '4096', label: '4K' },
                  { value: '32768', label: '32K' },
                  { value: '131072', label: '128K' },
                ]}
                value={context}
                onChange={setContext}
              />
            </div>
          </div>

          <label htmlFor="kv-cache-batch" className="mt-6 block text-xs font-semibold text-muted-foreground">
            <span className="flex items-center justify-between gap-3">
              <span>동시 sequence 수</span>
              <span className="font-mono font-bold text-foreground">B = {batch}</span>
            </span>
            <input
              id="kv-cache-batch"
              aria-label="KV cache batch size"
              type="range"
              min="1"
              max="4"
              step="1"
              value={batch}
              onChange={(event) => setBatch(Number(event.target.value))}
              className="mt-3 block w-full accent-emerald-600"
            />
          </label>

          <div className="mt-7 space-y-3">
            {(Object.keys(layouts) as Mode[]).map((layoutMode) => {
              const layout = layouts[layoutMode];
              const width = (layout.width / layouts.mha.width) * 100;
              return (
                <button
                  key={layoutMode}
                  type="button"
                  onClick={() => setMode(layoutMode)}
                  aria-pressed={mode === layoutMode}
                  className={`block w-full border p-3 text-left transition-colors ${mode === layoutMode ? layout.border : 'border-border bg-background hover:bg-muted/20'}`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-bold">{layout.label}</span>
                    <span className="text-right font-mono text-[11px] text-muted-foreground">{layout.short}</span>
                  </span>
                  <span className="mt-2 block h-1.5 bg-muted">
                    <span className={`block h-full ${layout.tone}`} style={{ width: `${Math.max(2, width)}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            <Metric label="Token당 cache" value={formatBytes(result.bytesPerToken)} detail={`${result.selected.width.toLocaleString()} elements/layer`} />
            <Metric label={`${Number(context).toLocaleString()} tokens · B=${batch}`} value={formatBytes(result.totalBytes)} detail={result.selected.stored} dataAttr="data-kv-layout-total" />
            <Metric label="MHA 대비 절감" value={`${result.saving.toFixed(2)}%`} detail={`MHA ${formatBytes(result.mhaBytes)}`} dataAttr="data-kv-layout-saving" />
          </div>

          <div className="mt-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-muted-foreground">한 token이 cache에 들어가고 다시 읽히는 순서</p>
              <span className={`border px-2 py-1 font-mono text-[10px] font-bold ${result.selected.border}`}>{result.selected.label}</span>
            </div>
            <ol className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-4">
              {result.selected.steps.map((step, index) => (
                <li key={step} className="min-w-0 bg-background p-3">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white ${result.selected.tone}`}>{index + 1}</span>
                  <p className="mt-3 text-xs font-semibold leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={`mt-6 border p-4 ${result.selected.border}`}>
            <p className="text-xs font-bold">이 숫자가 뜻하는 것</p>
            <p className="mt-2 text-sm leading-relaxed">
              {mode === 'mha' && 'Query head마다 K/V를 따로 저장한다. 표현 공유가 없지만 긴 context와 batch가 곱해지면 cache가 가장 빠르게 커진다.'}
              {mode === 'gqa' && '128개 query는 유지하고 8개 K/V head를 16개씩 공유한다. Q와 output projection까지 1/16로 줄어드는 것은 아니다.'}
              {mode === 'mla' && 'Head별 K/V 대신 512차원 공유 latent와 64차원 RoPE key를 저장한다. 그래서 GQA의 head 공유 비율로 설명하지 않는다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  dataAttr,
}: {
  label: string;
  value: string;
  detail: string;
  dataAttr?: string;
}) {
  return (
    <div className="min-w-0 bg-background p-4" {...(dataAttr ? { [dataAttr]: value } : {})}>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-xl font-black leading-none">{value}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}
