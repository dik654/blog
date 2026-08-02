import { useState } from 'react';

const LAYERS = [8, 12, 16, 20];

export function ActivationPatchingLab() {
  const [layer, setLayer] = useState(16);
  const [position, setPosition] = useState<'subject' | 'last'>('subject');
  const restorationMap: Record<string, number> = {
    '8-subject': 12, '12-subject': 47, '16-subject': 81, '20-subject': 28,
    '8-last': 5, '12-last': 18, '16-last': 32, '20-last': 21,
  };
  const restoration = restorationMap[`${layer}-${position}`];

  return (
    <div
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
      data-activation-patching-lab
      data-selected-layer={layer}
      data-selected-position={position}
    >
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <p className="text-xs font-black uppercase text-muted-foreground">Activation patching lab</p>
        <p className="mt-2 text-base font-bold">깨진 run에 clean activation 하나를 옮겨 원인을 좁힌다</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">아래 restoration 값은 실험 구조를 설명하는 개념 예시다. 실제 값은 model·prompt pair·metric마다 다시 측정한다.</p>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <fieldset>
            <legend className="mb-2 text-xs font-bold text-muted-foreground">Patch할 layer</legend>
            <div className="grid grid-cols-4 gap-2">
              {LAYERS.map((value) => <button key={value} type="button" data-patch-layer={value} onClick={() => setLayer(value)} aria-pressed={layer === value} className={`min-h-11 rounded-md border px-2 text-xs font-bold ${layer === value ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>L{value}</button>)}
            </div>
          </fieldset>
          <fieldset className="mt-3">
            <legend className="mb-2 text-xs font-bold text-muted-foreground">Patch할 token position</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" data-patch-position="subject" onClick={() => setPosition('subject')} aria-pressed={position === 'subject'} className={`min-h-11 rounded-md border px-2 text-xs font-bold ${position === 'subject' ? 'border-blue-500/55 bg-blue-500/[0.07]' : 'border-border'}`}>subject token</button>
              <button type="button" data-patch-position="last" onClick={() => setPosition('last')} aria-pressed={position === 'last'} className={`min-h-11 rounded-md border px-2 text-xs font-bold ${position === 'last' ? 'border-blue-500/55 bg-blue-500/[0.07]' : 'border-border'}`}>last token</button>
            </div>
          </fieldset>
          <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <div className="rounded-md border border-emerald-500/35 p-4"><p className="text-xs font-black text-muted-foreground">CLEAN</p><p className="mt-2 text-sm font-bold">France → Paris</p></div>
            <span className="hidden text-muted-foreground sm:block">→</span>
            <div className="rounded-md border border-rose-500/35 p-4"><p className="text-xs font-black text-muted-foreground">CORRUPTED</p><p className="mt-2 text-sm font-bold">Italy → Rome</p></div>
            <span className="hidden text-muted-foreground sm:block">→</span>
            <div className="rounded-md border border-blue-500/40 p-4"><p className="text-xs font-black text-muted-foreground">PATCH</p><p className="mt-2 text-sm font-bold">L{layer} · {position}</p></div>
          </div>
        </div>
        <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" role="status" aria-live="polite" aria-atomic="true">
          <p className="font-mono text-3xl font-black" data-restoration-value={restoration}>{restoration}%</p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">clean logit difference 복원</p>
          <div className="mt-4 h-2 overflow-hidden rounded-sm bg-muted"><span className="block h-full bg-blue-600" style={{ width: `${restoration}%` }} /></div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">높은 복원은 이 activation이 clean behavior를 전달하는 데 관여했다는 증거다. Patch가 만든 비현실적 state와 다른 component의 중복 경로는 control이 필요하다.</p>
        </div>
      </div>
    </div>
  );
}

export function AttributionGraphExplorer() {
  const [threshold, setThreshold] = useState(20);
  const nodes = [31, 24, 18, 11, 8, 5, 3];
  const kept = nodes.filter((value) => value >= threshold);
  const shown = kept.reduce((sum, value) => sum + value, 0);
  const omitted = nodes.reduce((sum, value) => sum + value, 0) - shown;
  const fidelity = 84;

  return (
    <div className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border" data-attribution-graph>
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div><p className="text-xs font-black uppercase text-muted-foreground">Graph pruning · 구조 예시</p><p className="mt-2 text-base font-bold">읽기 쉬운 graph와 충분한 attribution mass는 충돌한다</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Edge mass와 fidelity 숫자는 threshold tradeoff를 보여 주는 모형이며 논문 실측치를 재현한 값이 아니다.</p></div>
        <label htmlFor="graph-threshold" className="grid grid-cols-[1fr_auto] gap-2 text-xs font-bold text-muted-foreground"><span>표시 threshold</span><code className="text-foreground">{threshold}%</code><input id="graph-threshold" data-graph-threshold type="range" min="3" max="31" step="1" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} className="col-span-2 h-11 w-full accent-violet-600" /></label>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {nodes.map((value, index) => (
            <div key={index} className={`min-w-0 rounded-md border p-3 ${value >= threshold ? 'border-violet-500/40 bg-violet-500/[0.05]' : 'border-border opacity-35'}`}>
              <p className="font-mono text-xs font-black text-muted-foreground">feature {index + 1}</p><p className="mt-2 text-sm font-bold">edge {value}%</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="grid gap-3 sm:grid-cols-3" role="status" aria-live="polite" aria-atomic="true"><div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 sm:block"><p className="font-mono text-xl font-black" data-fidelity={fidelity}>{fidelity}%</p><p className="text-xs leading-snug text-muted-foreground">replacement fidelity</p></div><div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 sm:block"><p className="font-mono text-xl font-black" data-shown-mass={shown}>{shown}%</p><p className="text-xs leading-snug text-muted-foreground">shown edge mass</p></div><div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 sm:block"><p className="font-mono text-xl font-black" data-omitted-mass={omitted}>{omitted}%</p><p className="text-xs leading-snug text-muted-foreground">omitted edge mass</p></div></div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Threshold를 높이면 graph는 간단해지지만 설명하지 않은 mass가 커진다. Fidelity와 error node를 함께 표시하지 않은 예쁜 graph는 강한 mechanism claim을 지지하지 못한다.</p>
        </div>
      </div>
    </div>
  );
}
