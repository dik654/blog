import { useMemo, useState } from 'react';
import { CalendarClock, Check, CloudSun, PackageOpen, Store, Tag, TriangleAlert } from 'lucide-react';

const variables = [
  {
    id: 'promotion',
    label: '프로모션 계획',
    icon: Tag,
    type: 'known',
    verdict: '사용 가능',
    summary: '08:00 전에 승인·versioned 된 향후 할인 계획은 known-future covariate다.',
    condition: '계획 변경 timestamp가 origin 이후라면 이전 version만 사용한다.',
  },
  {
    id: 'inventory',
    label: '실제 마감 재고',
    icon: PackageOpen,
    type: 'leak',
    verdict: '미래 누출',
    summary: '각 시간의 실제 마감 재고는 판매가 끝난 뒤 관측된다. 미래 구간의 값을 입력하면 target 결과를 미리 본다.',
    condition: 'origin 시점 재고와 미리 확정된 입고 계획은 별도 feature로 사용할 수 있다.',
  },
  {
    id: 'weather',
    label: '실측 날씨',
    icon: CloudSun,
    type: 'leak',
    verdict: '그대로는 누출',
    summary: '내일의 실측 날씨는 오늘 08:00에 없다. 완료된 dataset의 값은 forecast-time availability를 말해 주지 않는다.',
    condition: '08:00에 발행돼 있던 기상 예보 snapshot으로 교체하면 known-future input이 된다.',
  },
  {
    id: 'store',
    label: '매장 ID·지역',
    icon: Store,
    type: 'static',
    verdict: '사용 가능',
    summary: '매장 ID, 지역, 면적처럼 horizon 동안 변하지 않는 값은 static covariate다.',
    condition: '새 매장 cold-start를 평가하려면 store split을 시간 split과 별도로 설계한다.',
  },
] as const;

const typeStyle = {
  known: 'border-emerald-600/40 bg-emerald-500/[0.06]',
  leak: 'border-rose-600/40 bg-rose-500/[0.06]',
  static: 'border-blue-600/35 bg-blue-500/[0.05]',
} as const;

export function ForecastContractWorkbench() {
  const [activeId, setActiveId] = useState<(typeof variables)[number]['id']>('inventory');
  const active = variables.find((variable) => variable.id === activeId) ?? variables[0];
  const ActiveIcon = active.icon;
  const renderTimeline = (offsets: number[]) => offsets.map((offset) => {
    const origin = offset === 0;
    const future = offset > 0;
    return (
      <div key={offset} className="min-w-0 text-center">
        <div className={`h-9 rounded-sm border ${origin ? 'border-foreground bg-foreground' : future ? 'border-amber-600/25 bg-amber-500/[0.09]' : 'border-blue-600/20 bg-blue-500/[0.07]'}`} />
        <span className={`mt-1 block whitespace-nowrap font-mono text-xs ${origin ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{origin ? '08:00' : `${offset > 0 ? '+' : ''}${offset}h`}</span>
      </div>
    );
  });

  return (
    <figure data-forecast-contract className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">FORECAST CONTRACT</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">08:00 선을 넘기 전에 실제로 알고 있던 값만 남긴다</h3>
      </figcaption>

      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="grid grid-cols-7 gap-1 sm:hidden" aria-label="예측 시점 타임라인">
            {renderTimeline([-6, -4, -2, 0, 2, 4, 6])}
          </div>
          <div className="hidden grid-cols-[repeat(13,minmax(0,1fr))] gap-1 sm:grid" aria-hidden="true">
            {renderTimeline(Array.from({ length: 13 }, (_, index) => index - 6))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {variables.map((variable) => {
              const Icon = variable.icon;
              const selected = active.id === variable.id;
              return (
                <button
                  key={variable.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveId(variable.id)}
                  className={`min-h-24 min-w-0 rounded-md border p-3 text-left transition-colors ${typeStyle[variable.type]} ${selected ? 'ring-2 ring-foreground/20 ring-offset-1 ring-offset-background' : 'hover:border-foreground/30'}`}
                >
                  <span className="flex items-center justify-between gap-2"><Icon className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="text-xs font-bold leading-tight text-muted-foreground">{variable.verdict}</span></span>
                  <strong className="mt-3 block break-keep text-xs leading-snug">{variable.label}</strong>
                </button>
              );
            })}
          </div>
          <div aria-live="polite" className={`mt-3 flex min-w-0 gap-3 rounded-md border p-4 ${typeStyle[active.type]}`}>
            <ActiveIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-relaxed">{active.summary}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">허용 조건</strong> · {active.condition}</p>
            </div>
          </div>
        </div>

        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4" aria-hidden="true" /><h4 className="text-sm font-bold">24시간 예측 계약</h4></div>
          <dl className="mt-3 space-y-3 text-xs">
            <div><dt className="font-semibold text-muted-foreground">Origin</dt><dd className="mt-1 font-mono">2026-07-20 08:00 KST</dd></div>
            <div><dt className="font-semibold text-muted-foreground">Context</dt><dd className="mt-1">직전 168시간, origin 포함</dd></div>
            <div><dt className="font-semibold text-muted-foreground">Target</dt><dd className="mt-1">다음 24개 hourly sales</dd></div>
            <div><dt className="font-semibold text-muted-foreground">Decision</dt><dd className="mt-1">발주·인력 배치, 09:00 실행</dd></div>
          </dl>
          <div className="mt-4 flex gap-2 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <p>데이터 column 이름이 아니라 origin 시점의 생성·공개 timestamp로 허용 여부를 판정한다.</p>
          </div>
        </aside>
      </div>
    </figure>
  );
}

const errorPatterns = [
  [-12, -4, 3, 8, -2, 5, 11, -7],
  [-9, 6, 12, -3, -16, 9, 14, -5],
  [-20, -8, 9, 15, 2, 12, 18, -4],
] as const;

export function RollingOriginExplorer() {
  const [origins, setOrigins] = useState(5);
  const [horizon, setHorizon] = useState(24);
  const errors = useMemo(() => {
    const pattern = horizon <= 12 ? errorPatterns[0] : horizon <= 24 ? errorPatterns[1] : errorPatterns[2];
    return pattern.slice(0, origins);
  }, [horizon, origins]);
  const mean = errors.reduce((sum, value) => sum + value, 0) / errors.length;
  const worst = Math.max(...errors);
  const final = errors.at(-1) ?? 0;

  return (
    <figure data-rolling-origin className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">ROLLING ORIGIN LAB</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">마지막 한 구간의 승리가 반복 운영에서도 유지되는지 본다</h3>
      </figcaption>

      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          평가 origin 수 · {origins}개
          <input aria-label="평가 origin 수" className="mt-1 block h-11 w-full cursor-pointer accent-blue-700" type="range" min="3" max="8" value={origins} onChange={(event) => setOrigins(Number(event.target.value))} />
        </label>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          예측 horizon · {horizon}시간
          <input aria-label="예측 horizon" className="mt-1 block h-11 w-full cursor-pointer accent-amber-700" type="range" min="12" max="48" step="12" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} />
        </label>
      </div>

      <div className="p-4 sm:p-5">
        <div className="space-y-2" aria-label="rolling origin folds">
          {errors.map((error, row) => {
            const originCell = 2 + row;
            const targetCells = horizon / 12;
            return (
              <div key={`${row}-${error}`} data-rolling-fold className="grid min-w-0 grid-cols-[2.4rem_minmax(0,1fr)_3.8rem] items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">O{row + 1}</span>
                <div className="grid h-7 min-w-0 grid-cols-[repeat(16,minmax(0,1fr))] gap-px overflow-hidden rounded-sm border border-border bg-border">
                  {Array.from({ length: 16 }, (_, cell) => {
                    const inTarget = cell > originCell && cell <= originCell + targetCells;
                    return <span key={cell} data-segment={cell === originCell ? 'origin' : inTarget ? 'target' : cell < originCell ? 'history' : 'unused'} className={cell < originCell ? 'bg-blue-500/20' : cell === originCell ? 'bg-foreground' : inTarget ? 'bg-amber-400/55 dark:bg-amber-400/35' : 'bg-muted'} />;
                  })}
                </div>
                <span className={`text-right font-mono text-xs font-bold ${error > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{error > 0 ? '+' : ''}{error}%</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-blue-500/20" />origin까지의 train/context</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-foreground" />forecast origin</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-amber-400/55 dark:bg-amber-400/35" />고정 horizon target</span>
        </div>
      </div>

      <div className="border-t border-border" aria-live="polite">
        <p className="bg-muted/15 px-4 py-2 text-xs font-semibold text-muted-foreground sm:px-5">기준선 대비 MASE 변화 · 음수이면 개선</p>
        <div className="grid grid-cols-3 gap-px bg-border">
          <div className="min-h-28 min-w-0 bg-background p-3 sm:p-4"><span className="block text-xs leading-snug text-muted-foreground">마지막 origin</span><strong className={`mt-2 block font-mono text-lg sm:text-xl ${final > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{final > 0 ? '+' : ''}{final.toFixed(1)}%</strong><p className="mt-1 text-xs leading-snug text-muted-foreground">한 시점의 효과</p></div>
          <div className="min-h-28 min-w-0 bg-blue-500/[0.035] p-3 sm:p-4"><span className="block text-xs leading-snug text-muted-foreground">origin 평균</span><strong className="mt-2 block font-mono text-lg sm:text-xl">{mean > 0 ? '+' : ''}{mean.toFixed(1)}%</strong><p className="mt-1 text-xs leading-snug text-muted-foreground">반복 배포 평균</p></div>
          <div className="min-h-28 min-w-0 bg-rose-500/[0.035] p-3 sm:p-4"><span className="block text-xs leading-snug text-muted-foreground">최악 origin</span><strong className="mt-2 block font-mono text-lg text-rose-700 dark:text-rose-300 sm:text-xl">+{worst.toFixed(1)}%</strong><p className="mt-1 text-xs leading-snug text-muted-foreground">기준선보다 악화</p></div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /><p>표시된 error는 평가 구조를 설명하는 예시다. 실제 release에서는 store·horizon·promotion slice별 paired error와 uncertainty coverage를 저장한다.</p></div>
    </figure>
  );
}
