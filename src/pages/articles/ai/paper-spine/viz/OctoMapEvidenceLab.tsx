import { useState } from 'react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const logistic = (value: number) => 1 / (1 + Math.exp(-value));

type QueryDepth = 'leaf' | 'coarse';

export default function OctoMapEvidenceLab() {
  const [hits, setHits] = useState(3);
  const [freeRays, setFreeRays] = useState(2);
  const [upperClamp, setUpperClamp] = useState(3.5);
  const [queryDepth, setQueryDepth] = useState<QueryDepth>('leaf');
  const logOdds = clamp(hits * .85 - freeRays * .4, -2, upperClamp);
  const probability = logistic(logOdds);
  const stable = logOdds >= upperClamp - .01 || logOdds <= -1.99;
  const observedLeaf = probability >= .5 ? 'occupied' : 'free';
  const leafStates = ['free', 'free', 'unknown', observedLeaf, 'free', 'free', 'free', 'free'] as const;
  const visibleNodes = queryDepth === 'leaf' ? 8 : 1;
  const conservativeOccupied = leafStates.includes('occupied');
  const contradictionRays = Math.max(0, Math.ceil(logOdds / .4));

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">OCTOMAP EVIDENCE LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">같은 leaf evidence가 clamp와 query depth에 따라 안정성·압축·보수성을 바꾼다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${probability >= .5 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{(probability * 100).toFixed(1)}% · {probability >= .5 ? 'occupied' : 'free'}</span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-violet-500/[0.025] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">endpoint hits · {hits}<input className="mt-3 block w-full accent-red-700" type="range" min="0" max="8" value={hits} onChange={(event) => setHits(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">traversing free rays · {freeRays}<input className="mt-3 block w-full accent-emerald-700" type="range" min="0" max="10" value={freeRays} onChange={(event) => setFreeRays(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">upper clamp · {upperClamp.toFixed(1)}<input className="mt-3 block w-full accent-violet-700" type="range" min="1" max="5" step=".5" value={upperClamp} onChange={(event) => setUpperClamp(Number(event.target.value))} /></label>
        <SegmentedControl label="octree query depth" options={[{ value: 'leaf', label: 'Leaf resolution' }, { value: 'coarse', label: 'Parent resolution' }]} value={queryDepth} onChange={setQueryDepth} />
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_.85fr]">
        <div>
          <div className={`grid aspect-[2/1] gap-1 ${queryDepth === 'leaf' ? 'grid-cols-4 grid-rows-2' : 'grid-cols-1'}`}>
            {(queryDepth === 'leaf' ? leafStates : [conservativeOccupied ? 'occupied' : 'free'] as const).map((state, index) => <div key={`${state}-${index}`} className={`relative flex items-center justify-center rounded-[2px] border ${state === 'occupied' ? 'border-red-600 bg-red-500/20' : state === 'free' ? 'border-emerald-600 bg-emerald-500/12' : 'border-border bg-muted/20'}`}>
              <span className="font-mono text-[10px] font-black sm:text-xs">{state === 'occupied' ? 'OCC' : state === 'free' ? 'FREE' : '?'}</span>
            </div>)}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{queryDepth === 'leaf' ? 'Leaf에서는 한 occupied voxel의 위치와 주변 free·unknown을 구분한다.' : 'Parent query는 max-child rule 때문에 한 child만 occupied여도 전체 큰 volume을 occupied로 본다.'}</p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="relative h-6 rounded-sm bg-gradient-to-r from-emerald-500/20 via-muted to-red-500/20 ring-1 ring-inset ring-border">
            <span className="absolute inset-y-0 w-1 bg-foreground transition-all" style={{ left: `${clamp(probability * 100, 1, 99)}%` }} />
          </div>
          <div className="mt-5 grid gap-2 text-xs">
            <div className="flex justify-between border-b border-border pb-2"><span>현재 leaf evidence</span><strong className="font-mono">L = {logOdds.toFixed(2)}</strong></div>
            <div className="flex justify-between border-b border-border pb-2"><span>stable/prunable 후보</span><strong>{stable ? '예' : '아니오'}</strong></div>
            <div className="flex justify-between border-b border-border pb-2"><span>반대 free rays로 뒤집기</span><strong>{contradictionRays}회</strong></div>
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6">
        <MetricGrid mobileColumns={2} items={[
          { label: 'query nodes', value: String(visibleNodes), note: queryDepth === 'leaf' ? 'fine detail' : '8 children → 1 parent' },
          { label: 'collision answer', value: conservativeOccupied ? 'occupied' : 'free', accent: queryDepth === 'coarse' },
          { label: 'adaptability', value: contradictionRays <= 6 ? '빠름' : '느림', note: 'clamp가 상한을 제한' },
          { label: 'compression', value: stable ? 'prune 가능' : 'leaf 유지', accent: stable },
        ]} />
      </div>
    </figure>
  );
}
