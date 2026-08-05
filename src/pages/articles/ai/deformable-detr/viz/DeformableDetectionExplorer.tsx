import { useMemo, useState } from 'react';
import { Crosshair, Layers3, ScanSearch } from 'lucide-react';

type ObjectSize = 'small' | 'large';

const POINTS = {
  small: [[24, 28], [40, 38], [56, 31], [47, 54]],
  large: [[25, 25], [70, 28], [32, 68], [67, 67]],
} as const;

export default function DeformableDetectionExplorer() {
  const [objectSize, setObjectSize] = useState<ObjectSize>('small');
  const [levels, setLevels] = useState(4);
  const [points, setPoints] = useState(4);
  const samples = useMemo(() => 300 * 8 * levels * points, [levels, points]);

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border" data-deformable-detr-lab>
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
        <div><p className="text-[10px] font-black uppercase text-muted-foreground">Sparse sampling lab · 교육용 좌표</p><p className="mt-2 text-base font-bold">Query는 모든 pixel이 아니라 학습된 위치만 읽는다</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">점 위치는 실제 checkpoint 출력이 아닌 mechanism 설명용 fixture다. 작은 객체에서는 고해상도 level과 객체 주변 offset에 sample이 도달하는지가 특히 중요하다.</p></div>
        <div className="grid grid-cols-2 rounded-md border border-border bg-background p-1">
          <button type="button" onClick={() => setObjectSize('small')} aria-pressed={objectSize === 'small'} className={`min-h-11 rounded-sm text-xs font-bold ${objectSize === 'small' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>작은 객체</button>
          <button type="button" onClick={() => setObjectSize('large')} aria-pressed={objectSize === 'large'} className={`min-h-11 rounded-sm text-xs font-bold ${objectSize === 'large' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>큰 객체</button>
        </div>
      </div>

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((level) => (
            <div key={level} className={`min-w-0 rounded-md border p-3 ${level < levels ? 'border-blue-500/35 bg-blue-500/[0.035]' : 'border-border opacity-35'}`}>
              <div className="flex items-center justify-between"><span className="font-mono text-[10px] font-black">Level {level + 1}</span><span className="text-[9px] text-muted-foreground">stride {2 ** (level + 3)}</span></div>
              <div className="relative mt-3 aspect-square overflow-hidden rounded-sm border border-border bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:25%_25%]">
                <div className={`absolute border-2 border-amber-500/80 bg-amber-500/10 ${objectSize === 'small' ? 'left-[42%] top-[40%] h-[18%] w-[18%]' : 'left-[22%] top-[22%] h-[55%] w-[55%]'}`} />
                {POINTS[objectSize].slice(0, points).map(([x, y], index) => (
                  <span key={index} className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-blue-600 shadow-sm transition-all duration-300" style={{ left: `${Math.min(88, x + level * 3)}%`, top: `${Math.min(88, y + level * 2)}%` }} />
                ))}
                <Crosshair className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-foreground/55" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div><label htmlFor="detr-levels" className="flex items-center justify-between text-xs font-bold"><span>Feature levels</span><span>{levels}</span></label><input id="detr-levels" className="mt-2 h-11 w-full cursor-pointer accent-foreground" type="range" min="1" max="4" value={levels} onChange={(event) => setLevels(Number(event.target.value))} /></div>
          <div><label htmlFor="detr-points" className="flex items-center justify-between text-xs font-bold"><span>Points / level</span><span>{points}</span></label><input id="detr-points" className="mt-2 h-11 w-full cursor-pointer accent-foreground" type="range" min="1" max="4" value={points} onChange={(event) => setPoints(Number(event.target.value))} /></div>
          <div className="rounded-md border border-border p-4"><ScanSearch className="h-4 w-4" aria-hidden="true" /><p className="mt-3 text-[10px] font-black uppercase text-muted-foreground">300 queries · 8 heads</p><p className="mt-1 font-mono text-2xl font-black">{samples.toLocaleString()}</p><p className="mt-1 text-xs text-muted-foreground">sample reads / layer</p></div>
          <div className="flex gap-3 border-l-2 border-amber-500/60 pl-3"><Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" /><p className="text-xs leading-relaxed text-muted-foreground">각 level은 backbone stage를 독립 projection한 feature다. FPN의 top-down fusion 표기가 아니다. 샘플 수가 적다는 사실만으로 충분하지 않고 offset이 필요한 scale과 위치로 학습되어야 한다.</p></div>
        </div>
      </div>
    </div>
  );
}
