import { useMemo, useState } from 'react';
import { Boxes, Gauge, MemoryStick, MoveRight, Sigma, Zap } from 'lucide-react';

type Mode = 'materialized' | 'tiled';

function bytesLabel(bytes: number) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GiB`;
  return `${(bytes / 1024 ** 2).toFixed(0)} MiB`;
}

export function AttentionIOLab() {
  const [mode, setMode] = useState<Mode>('tiled');
  const [sequence, setSequence] = useState(4096);
  const matrixBytes = useMemo(() => 2 * sequence * sequence * 2, [sequence]);
  const tiled = mode === 'tiled';

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground">Attention IO lab</p>
          <p className="mt-2 text-base font-bold">같은 exact attention, 다른 중간 배열의 수명</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">핵심은 FLOP을 없애는 것이 아니라 N×N score·probability를 HBM에 완성해 두지 않는 것이다.</p>
        </div>
        <div className="grid grid-cols-2 rounded-md border border-border bg-background p-1">
          <button type="button" onClick={() => setMode('materialized')} aria-pressed={!tiled} className={`min-h-10 rounded-sm px-2 text-xs font-bold ${!tiled ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>기본 구현</button>
          <button type="button" onClick={() => setMode('tiled')} aria-pressed={tiled} className={`min-h-10 rounded-sm px-2 text-xs font-bold ${tiled ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>Flash 방식</button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="rounded-md border border-border p-4">
            <label htmlFor="attention-sequence" className="text-xs font-bold">Sequence length</label>
            <input id="attention-sequence" className="mt-4 w-full accent-foreground" type="range" min="1024" max="8192" step="1024" value={sequence} onChange={(event) => setSequence(Number(event.target.value))} />
            <p className="mt-2 font-mono text-3xl font-black">{sequence.toLocaleString()}</p>
            <p className="mt-4 text-[10px] font-black uppercase text-muted-foreground">FP16/BF16 · score+prob</p>
            <p className="mt-1 text-sm font-bold">{bytesLabel(matrixBytes)}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">개념적 N×N 중간 배열 크기다. 실제 총 traffic과 workspace는 kernel·shape에 따라 다르다.</p>
          </div>

          <div className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              <div className="rounded-md border border-blue-500/35 bg-blue-500/[0.05] p-4"><MemoryStick className="h-5 w-5 text-blue-600" aria-hidden="true" /><p className="mt-3 text-sm font-bold">HBM의 Q·K·V</p><p className="mt-2 text-xs text-muted-foreground">필요한 block만 SRAM으로 읽기</p></div>
              <MoveRight className="mx-auto hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
              <div className={`rounded-md border p-4 ${tiled ? 'border-emerald-500/40 bg-emerald-500/[0.05]' : 'border-rose-500/40 bg-rose-500/[0.05]'}`}><Boxes className="h-5 w-5" aria-hidden="true" /><p className="mt-3 text-sm font-bold">{tiled ? 'SRAM tile에서 score' : 'HBM에 N×N score'}</p><p className="mt-2 text-xs text-muted-foreground">{tiled ? 'running max·sum으로 즉시 축약' : 'softmax를 위해 다시 읽고 probability 저장'}</p></div>
              <MoveRight className="mx-auto hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
              <div className="rounded-md border border-violet-500/35 bg-violet-500/[0.04] p-4"><Sigma className="h-5 w-5 text-violet-600" aria-hidden="true" /><p className="mt-3 text-sm font-bold">출력 O만 기록</p><p className="mt-2 text-xs text-muted-foreground">수학적으로 같은 softmax(QKᵀ)V</p></div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                [Gauge, 'Semantics', '정확한 attention 유지'],
                [MemoryStick, 'N×N materialization', tiled ? '없음' : bytesLabel(matrixBytes)],
                [Zap, '병목', tiled ? 'tile·occupancy·compute' : 'HBM read/write'],
              ].map(([Icon, label, value]) => {
                const ItemIcon = Icon as typeof Gauge;
                return <div key={label as string} className="rounded-md border border-border p-3"><ItemIcon className="h-4 w-4" aria-hidden="true" /><p className="mt-3 text-[10px] font-black uppercase text-muted-foreground">{label as string}</p><p className="mt-1 text-xs font-bold">{value as string}</p></div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
