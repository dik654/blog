import { useMemo, useState } from 'react';
import { SegmentedControl } from '../nlp-shared';

type Context = '8192' | '32768' | '131072';
type WindowSize = '512' | '1024' | '4096';

const localLayers = 52;
const globalLayers = 10;
const totalLayers = localLayers + globalLayers;
const kvHeads = 16;
const headDimension = 128;
const bytesPerElement = 2;

function formatBytes(bytes: number) {
  return `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
}

function formatPairLayers(value: number) {
  return `${(value / 1e9).toFixed(2)}B`;
}

export default function LongContextWindowLab() {
  const [context, setContext] = useState<Context>('32768');
  const [windowSize, setWindowSize] = useState<WindowSize>('1024');
  const [batch, setBatch] = useState(2);
  const [depth, setDepth] = useState(7);

  const result = useMemo(() => {
    const n = Number(context);
    const w = Math.min(n, Number(windowSize));
    const bytesPerLayerToken = 2 * batch * kvHeads * headDimension * bytesPerElement;
    const fullUnits = totalLayers * n;
    const mixedUnits = globalLayers * n + localLayers * w;
    const fullCache = bytesPerLayerToken * fullUnits;
    const mixedCache = bytesPerLayerToken * mixedUnits;
    const cacheSaving = 100 * (1 - mixedCache / fullCache);

    const fullPairsPerLayer = (n * (n + 1)) / 2;
    const localPairsPerLayer = n >= w
      ? n * w - (w * (w - 1)) / 2
      : fullPairsPerLayer;
    const fullPairLayers = totalLayers * fullPairsPerLayer;
    const mixedPairLayers = globalLayers * fullPairsPerLayer + localLayers * localPairsPerLayer;
    const prefillSaving = 100 * (1 - mixedPairLayers / fullPairLayers);

    return {
      fullCache,
      mixedCache,
      cacheSaving,
      fullPairLayers,
      mixedPairLayers,
      prefillSaving,
      fullDecodeReads: fullUnits,
      mixedDecodeReads: mixedUnits,
    };
  }, [batch, context, windowSize]);

  const toyLength = 24;
  const toyWindow = 4;
  const isGlobal = depth % 6 === 0;
  const directVisible = isGlobal ? toyLength : toyWindow;
  const reachable = depth >= 6 ? toyLength : Math.min(toyLength, 1 + depth * (toyWindow - 1));
  const directStart = toyLength - directVisible + 1;
  const reachableStart = toyLength - reachable + 1;

  return (
    <div data-long-context-lab className="not-prose my-10 overflow-hidden rounded-md border border-border bg-background">
      <header className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <p className="text-xs font-bold text-muted-foreground">LOCAL / GLOBAL LAB · 저장 기간과 가시 범위</p>
        <h3 className="mt-2 text-lg font-bold">모든 layer가 128K를 직접 보는 것은 아니다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Gemma 3 27B형 설명 config로 52개 local layer와 10개 global layer를 분리한다. Local cache는 window까지만 남고, global cache는 context 전체와 함께 계속 커진다.
        </p>
      </header>

      <div className="grid gap-5 border-b border-border p-4 sm:p-6 lg:grid-cols-[auto_auto_minmax(12rem,1fr)] lg:items-end">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Context</p>
          <div className="mt-2">
            <SegmentedControl
              label="Long context length"
              options={[
                { value: '8192', label: '8K' },
                { value: '32768', label: '32K' },
                { value: '131072', label: '128K' },
              ]}
              value={context}
              onChange={setContext}
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Local window</p>
          <div className="mt-2">
            <SegmentedControl
              label="Local attention window"
              options={[
                { value: '512', label: '512' },
                { value: '1024', label: '1K' },
                { value: '4096', label: '4K' },
              ]}
              value={windowSize}
              onChange={setWindowSize}
            />
          </div>
        </div>
        <label htmlFor="long-context-batch" className="block text-xs font-semibold text-muted-foreground">
          <span className="flex items-center justify-between gap-3">
            <span>동시 sequence 수</span>
            <span className="font-mono font-bold text-foreground">B = {batch}</span>
          </span>
          <input
            id="long-context-batch"
            aria-label="Long context batch size"
            type="range"
            min="1"
            max="4"
            step="1"
            value={batch}
            onChange={(event) => setBatch(Number(event.target.value))}
            className="mt-3 block w-full accent-blue-600"
          />
        </label>
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-2">
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            <Metric label="모두 full일 때 KV" value={formatBytes(result.fullCache)} detail={`${totalLayers} layers × ${Number(context).toLocaleString()} tokens`} dataName="data-full-kv" />
            <Metric label="52 local + 10 global KV" value={formatBytes(result.mixedCache)} detail={`local은 ${Number(windowSize).toLocaleString()} tokens만 유지`} dataName="data-mixed-kv" />
            <Metric label="KV cache 절감" value={`${result.cacheSaving.toFixed(2)}%`} detail="global cache는 여전히 context에 비례" dataName="data-mixed-kv-saving" />
            <Metric label="Prefill pair-layer 절감" value={`${result.prefillSaving.toFixed(2)}%`} detail={`${formatPairLayers(result.fullPairLayers)} → ${formatPairLayers(result.mixedPairLayers)}`} dataName="data-prefill-saving" />
          </div>

          <div className="mt-6 border border-border">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 border-b border-border bg-muted/20 px-3 py-2 text-[10px] font-semibold text-muted-foreground">
              <span>다음 token decode</span>
              <span>모두 full</span>
              <span>mixed</span>
            </div>
            <div data-decode-read-positions={`${result.fullDecodeReads}:${result.mixedDecodeReads}`} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-3 py-3 text-xs">
              <span className="font-semibold">읽는 key 위치 × layer</span>
              <span className="font-mono">{result.fullDecodeReads.toLocaleString()}</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{result.mixedDecodeReads.toLocaleString()}</span>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Pair-layer와 read-position은 head·batch를 곱하기 전의 구조 비교 단위다. 실제 kernel 시간은 head 수, dtype, tiling, bandwidth에도 좌우된다.
          </p>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          <label htmlFor="visibility-depth" className="block text-xs font-semibold text-muted-foreground">
            <span className="flex items-center justify-between gap-3">
              <span>24-token toy에서 확인할 layer</span>
              <span className="font-mono font-bold text-foreground">layer {depth} · {isGlobal ? 'GLOBAL' : 'LOCAL'}</span>
            </span>
            <input
              id="visibility-depth"
              aria-label="Visibility layer depth"
              type="range"
              min="1"
              max="12"
              step="1"
              value={depth}
              onChange={(event) => setDepth(Number(event.target.value))}
              className="mt-3 block w-full accent-amber-600"
            />
          </label>

          <div className="mt-5 grid grid-cols-6 gap-1 sm:grid-cols-12" aria-label="Local and global layer cadence">
            {Array.from({ length: 12 }, (_, index) => {
              const layer = index + 1;
              const global = layer % 6 === 0;
              const selected = layer === depth;
              return (
                <div key={layer} className={`flex h-9 items-center justify-center border text-[10px] font-bold ${global ? 'border-amber-600/35 bg-amber-500/10 text-amber-800 dark:text-amber-200' : 'border-blue-600/20 bg-blue-500/[0.045] text-blue-800 dark:text-blue-200'} ${selected ? 'ring-2 ring-foreground/50 ring-offset-1 ring-offset-background' : ''}`}>
                  {global ? 'G' : 'L'}{layer}
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-blue-600" />이번 layer가 직접 읽음</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-emerald-500/45" />아래 layer를 통해 도달</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-muted" />아직 도달하지 못함</span>
            </div>
            <div className="mt-3 grid grid-cols-12 gap-1" aria-label="Token visibility strip">
              {Array.from({ length: toyLength }, (_, index) => {
                const token = index + 1;
                const direct = token >= directStart;
                const inherited = token >= reachableStart && !direct;
                return (
                  <span
                    key={token}
                    className={`flex aspect-square min-w-0 items-center justify-center text-[8px] font-bold sm:text-[9px] ${direct ? 'bg-blue-600 text-white' : inherited ? 'bg-emerald-500/35 text-foreground' : 'bg-muted text-muted-foreground'}`}
                  >
                    {token}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
            <Metric label="이번 layer의 직접 가시 token" value={`${directVisible} / ${toyLength}`} detail={isGlobal ? 'global layer가 prefix 전체를 직접 읽음' : `local window ${toyWindow}개만 직접 읽음`} dataName="data-direct-visible" />
            <Metric label="현재 표현에서 도달 가능한 token" value={`${reachable} / ${toyLength}`} detail={depth >= 6 ? 'layer 6의 global mixing을 상속' : 'local layer를 거치며 간접 범위 확장'} dataName="data-reachable-visible" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            도달 가능하다는 말은 계산 그래프에 경로가 있다는 뜻이다. 오래된 사실을 정확히 복사하거나 검색할 수 있다는 품질 보증은 아니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, detail, dataName }: { label: string; value: string; detail: string; dataName: string }) {
  return (
    <div className="min-w-0 bg-background p-4" {...{ [dataName]: value }}>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-lg font-black leading-none">{value}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}
