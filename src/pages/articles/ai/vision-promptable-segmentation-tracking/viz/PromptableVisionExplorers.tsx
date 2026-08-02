import { useMemo, useState } from 'react';
import {
  ArrowDown,
  Braces,
  Check,
  CircleDot,
  Focus,
  Gauge,
  Layers3,
  MemoryStick,
  MousePointer2,
  Sparkles,
  Tags,
  TriangleAlert,
} from 'lucide-react';

const taskModes = [
  {
    id: 'semantic',
    label: 'Semantic',
    prompt: 'class = cap',
    output: 'cap pixel을 하나의 class 영역으로 합침',
    count: '1 class mask',
    selected: [0, 1, 2, 4],
    insight: '같은 class의 서로 다른 물체를 구분하지 않는다.',
  },
  {
    id: 'instance',
    label: 'Instance',
    prompt: 'fixed label set',
    output: '각 cap을 별도 mask와 ID로 분리',
    count: '4 instance masks',
    selected: [0, 1, 2, 4],
    insight: '객체는 나누지만 학습 때 정한 category 밖의 표현은 다루기 어렵다.',
  },
  {
    id: 'pvs',
    label: 'Point PVS',
    prompt: 'click = object ②',
    output: '사용자가 가리킨 한 물체만 분할',
    count: '1 selected mask',
    selected: [1],
    insight: '점·박스는 개별 instance를 고른다. 같은 종류 전체를 찾는 명령이 아니다.',
  },
  {
    id: 'pcs',
    label: 'Text PCS',
    prompt: '“빨간 안전 캡”',
    output: '문구와 맞는 모든 instance를 찾고 분할',
    count: '3 concept masks',
    selected: [0, 1, 4],
    insight: '텍스트는 concept를 정의하고 출력은 그 concept와 맞는 모든 instance 집합이다.',
  },
] as const;

const sceneObjects = [
  { label: '①', red: true, shape: 'rounded-full', size: 'h-12 w-12' },
  { label: '②', red: true, shape: 'rounded-md', size: 'h-14 w-10' },
  { label: '③', red: false, shape: 'rounded-full', size: 'h-11 w-11' },
  { label: '④', red: false, shape: 'rounded-sm', size: 'h-12 w-12' },
  { label: '⑤', red: true, shape: 'rounded-full', size: 'h-10 w-14' },
  { label: '⑥', red: false, shape: 'rounded-md', size: 'h-14 w-9' },
] as const;

export function PromptContractExplorer() {
  const [activeId, setActiveId] = useState<(typeof taskModes)[number]['id']>('pcs');
  const active = taskModes.find((mode) => mode.id === activeId) ?? taskModes[0];

  return (
    <figure data-prompt-contract className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">PROMPT CONTRACT</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">같은 장면도 prompt 계약이 바뀌면 정답의 개수가 바뀐다</h3>
      </figcaption>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        {taskModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            aria-pressed={mode.id === active.id}
            onClick={() => setActiveId(mode.id)}
            className={`min-h-16 min-w-0 bg-background px-2 py-3 text-center text-[11px] font-bold transition-colors sm:text-xs ${mode.id === active.id ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'}`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid min-h-52 grid-cols-3 place-items-center gap-3 rounded-md border border-border bg-muted/15 p-4 sm:gap-5" aria-label="segmentation example scene">
            {sceneObjects.map((object, index) => {
              const selected = (active.selected as readonly number[]).includes(index);
              return (
                <div key={object.label} className="flex min-h-20 min-w-0 flex-col items-center justify-center gap-2">
                  <div className={`relative ${object.size} ${object.shape} border-2 transition-all duration-300 ${object.red ? 'bg-rose-500/55' : 'bg-blue-500/25'} ${selected ? 'border-foreground ring-4 ring-emerald-500/25' : 'border-border opacity-55'}`}>
                    {selected && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background"><Check className="h-3 w-3" aria-hidden="true" /></span>}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{object.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Prompt</p><p className="mt-1 break-words text-xs font-bold">{active.prompt}</p></div>
            <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Output</p><p className="mt-1 text-xs font-bold">{active.count}</p></div>
            <div className="min-w-0 bg-background p-3 sm:col-span-1"><p className="text-[9px] font-bold uppercase text-muted-foreground">Target rule</p><p className="mt-1 text-xs leading-relaxed">{active.output}</p></div>
          </div>
        </div>

        <aside aria-live="polite" className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex items-center gap-2"><Focus className="h-4 w-4" aria-hidden="true" /><h4 className="text-sm font-bold">먼저 고정할 질문</h4></div>
          <p className="mt-3 text-sm font-semibold leading-relaxed">사용자는 class 영역, 각 instance, 한 instance, concept 전체 중 무엇을 요구했는가?</p>
          <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">{active.insight}</p>
        </aside>
      </div>
    </figure>
  );
}

const lineage = [
  {
    id: 'sam1',
    label: 'SAM 1',
    year: '2023',
    icon: MousePointer2,
    contract: '점·박스·mask prompt로 한 image의 object mask를 고른다.',
    flow: ['image encoder', 'prompt encoder', 'mask decoder'],
    failure: '다음 frame에는 이전 object의 기억이 없다.',
    handoff: 'SAM 2가 streaming memory를 추가한다.',
  },
  {
    id: 'sam2',
    label: 'SAM 2',
    year: '2024',
    icon: MemoryStick,
    contract: '한 번 고른 object를 image와 video frame에 걸쳐 전파한다.',
    flow: ['frame encoder', 'memory attention', 'mask + memory encoder'],
    failure: '“빨간 안전 캡”이라는 concept에 맞는 모든 새 object를 찾는 detector가 없다.',
    handoff: 'SAM 3가 concept detector와 tracker를 결합한다.',
  },
  {
    id: 'sam3',
    label: 'SAM 3',
    year: '2025',
    icon: Tags,
    contract: '텍스트·exemplar concept와 맞는 모든 instance를 검출·분할·추적한다.',
    flow: ['concept detector', 'SAM 2-style tracker', 'detect ↔ match/update'],
    failure: 'object마다 memory path를 따로 실행해 비용이 N에 비례한다.',
    handoff: 'SAM 3.1이 object를 fixed-capacity bucket으로 묶는다.',
  },
  {
    id: 'sam31',
    label: 'SAM 3.1',
    year: '2026',
    icon: Layers3,
    contract: '여러 object의 spatial memory를 bucket마다 공동 처리한다.',
    flow: ['mux object masks', 'shared bucket memory', 'demux + object identity'],
    failure: '속도 향상이 모든 dataset의 품질 향상을 뜻하지는 않는다.',
    handoff: '품질·identity·runtime gate를 따로 검증해야 한다.',
  },
] as const;

export function VisionLineageExplorer() {
  const [activeId, setActiveId] = useState<(typeof lineage)[number]['id']>('sam31');
  const active = lineage.find((stage) => stage.id === activeId) ?? lineage[0];
  const ActiveIcon = active.icon;

  return (
    <figure data-vision-lineage className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">CONTRACT LADDER</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">계보는 연도가 아니라 직전 모델이 못 푼 실패로 읽는다</h3>
      </figcaption>
      <div className="grid grid-cols-4 gap-px border-b border-border bg-border">
        {lineage.map((stage) => (
          <button key={stage.id} type="button" aria-pressed={stage.id === active.id} onClick={() => setActiveId(stage.id)} className={`min-h-20 min-w-0 bg-background px-1.5 py-3 text-center transition-colors sm:px-3 ${stage.id === active.id ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'hover:bg-muted/35'}`}>
            <span className="block text-[10px] text-muted-foreground">{stage.year}</span>
            <strong className="mt-1 block text-[11px] sm:text-xs">{stage.label}</strong>
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-5" aria-live="polite">
        <div className="flex min-w-0 items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/20"><ActiveIcon className="h-4 w-4" aria-hidden="true" /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase text-muted-foreground">이 단계가 보장한 계약</p><p className="mt-1 text-sm font-bold leading-relaxed">{active.contract}</p></div></div>
        <div className="mt-5 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:items-center">
          {active.flow.map((step, index) => (
            <div key={step} className="contents">
              <div className="min-h-16 min-w-0 rounded-md border border-border bg-muted/15 p-3 text-center text-xs font-semibold leading-relaxed">{step}</div>
              {index < active.flow.length - 1 && <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:-rotate-90" aria-hidden="true" />}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="min-w-0 bg-rose-500/[0.055] p-4"><p className="flex items-center gap-2 text-[10px] font-bold uppercase text-rose-800 dark:text-rose-200"><TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />남은 실패</p><p className="mt-2 text-xs font-semibold leading-relaxed">{active.failure}</p></div>
          <div className="min-w-0 bg-emerald-500/[0.055] p-4"><p className="flex items-center gap-2 text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-200"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />다음 연결</p><p className="mt-2 text-xs font-semibold leading-relaxed">{active.handoff}</p></div>
        </div>
      </div>
    </figure>
  );
}

const trackingFrames = [
  { frame: 't0', state: '첫 검출', visible: true, memory: '입력', identity: 'A 유지', detector: '새 masklet A 생성', issue: '없음' },
  { frame: 't1', state: '정상 전파', visible: true, memory: '입력', identity: 'A 유지', detector: 'propagation과 일치', issue: '없음' },
  { frame: 't2', state: '가림', visible: false, memory: '차단', identity: 'A pointer 보존', detector: 'presence 낮음', issue: '빈 mask를 좋은 기억처럼 넣으면 drift가 시작됨' },
  { frame: 't3', state: '유사 물체', visible: true, memory: '보류', identity: 'A 위험', detector: 'distractor B도 검출', issue: 'mask IoU만 보면 A와 B의 ID swap을 놓침' },
  { frame: 't4', state: '재검출·교정', visible: true, memory: '입력', identity: 'A 복구', detector: '고신뢰 detection으로 re-prompt', issue: '교정 뒤 mask와 object pointer를 함께 검증' },
] as const;

export function TrackingMemoryExplorer() {
  const [index, setIndex] = useState(2);
  const active = trackingFrames[index];

  return (
    <figure data-tracking-memory className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">TRACKING MEMORY</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">현재 mask를 잘 그리는 것과 같은 object ID를 유지하는 것은 다르다</h3>
      </figcaption>
      <div className="grid grid-cols-5 gap-px border-b border-border bg-border">
        {trackingFrames.map((frame, frameIndex) => (
          <button key={frame.frame} type="button" aria-pressed={frameIndex === index} onClick={() => setIndex(frameIndex)} className={`min-h-16 min-w-0 bg-background px-1 py-2 text-center transition-colors sm:px-2 ${frameIndex === index ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'hover:bg-muted/35'}`}>
            <span className="font-mono text-[10px] font-bold">{frame.frame}</span><span className="mt-1 block text-[9px] leading-snug text-muted-foreground sm:text-[10px]">{frame.state}</span>
          </button>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/15">
          <div className={`absolute left-[20%] h-20 w-16 rounded-full border-2 transition-all duration-300 ${active.identity.includes('위험') ? 'translate-x-24 border-rose-600 bg-rose-500/20' : 'border-emerald-600 bg-emerald-500/20'} ${active.visible ? 'opacity-100' : 'opacity-15'}`}><span className="flex h-full items-center justify-center font-mono text-sm font-black">A</span></div>
          <div className="absolute right-[18%] h-20 w-16 rounded-full border-2 border-blue-600/45 bg-blue-500/15"><span className="flex h-full items-center justify-center font-mono text-sm font-black">B</span></div>
          {!active.visible && <div className="absolute inset-y-0 left-[35%] w-16 bg-foreground/80" aria-label="occluder" />}
          <span className="absolute bottom-3 left-3 rounded-sm bg-background/90 px-2 py-1 text-[10px] font-bold">{active.frame} · {active.state}</span>
        </div>
        <div className="min-w-0">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Detector</p><p className="mt-1 text-xs font-semibold leading-relaxed">{active.detector}</p></div>
            <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Object identity</p><p className="mt-1 text-xs font-semibold leading-relaxed">{active.identity}</p></div>
            <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Memory admission</p><p className="mt-1 text-xs font-semibold leading-relaxed">{active.memory}</p></div>
            <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Visible?</p><p className="mt-1 text-xs font-semibold leading-relaxed">{active.visible ? 'yes' : 'no · occlusion score 사용'}</p></div>
          </div>
          <div aria-live="polite" className="mt-3 flex min-w-0 gap-3 rounded-md border border-amber-600/30 bg-amber-500/[0.065] p-4"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-800 dark:text-amber-200" aria-hidden="true" /><p className="text-xs font-semibold leading-relaxed">{active.issue}</p></div>
        </div>
      </div>
    </figure>
  );
}

export function ObjectMultiplexExplorer() {
  const [objects, setObjects] = useState(37);
  const [selectedBucket, setSelectedBucket] = useState(0);
  const capacity = 16;
  const bucketCount = Math.ceil(objects / capacity);
  const buckets = useMemo(() => Array.from({ length: bucketCount }, (_, bucketIndex) => {
    const start = bucketIndex * capacity;
    return Array.from({ length: capacity }, (_, slot) => {
      const objectIndex = start + slot;
      return objectIndex < objects ? objectIndex + 1 : null;
    });
  }), [bucketCount, objects]);
  const activeBucket = Math.min(selectedBucket, bucketCount - 1);
  const idealReduction = objects / bucketCount;

  return (
    <figure data-object-multiplex className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">OBJECT MULTIPLEX</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">공간 계산은 bucket이 공유하고 object identity는 slot마다 남긴다</h3>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">추적 object 수 · {objects}개<input aria-label="추적 object 수" className="mt-3 block h-11 w-full cursor-pointer accent-blue-700" type="range" min="1" max="128" value={objects} onChange={(event) => { setObjects(Number(event.target.value)); setSelectedBucket(0); }} /></label>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border"><div className="bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Capacity M</p><p className="mt-1 font-mono text-lg font-black">16</p></div><div className="bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">Buckets B</p><p className="mt-1 font-mono text-lg font-black">{bucketCount}</p></div></div>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-2">
            {buckets.map((bucket, bucketIndex) => (
              <button key={bucketIndex} type="button" aria-pressed={bucketIndex === activeBucket} onClick={() => setSelectedBucket(bucketIndex)} className={`min-w-0 rounded-md border p-3 text-left transition-colors ${bucketIndex === activeBucket ? 'border-foreground bg-blue-500/[0.055]' : 'border-border hover:border-foreground/30'}`}>
                <span className="flex items-center justify-between gap-2"><strong className="text-[11px]">Bucket {bucketIndex + 1}</strong><span className="text-[9px] text-muted-foreground">{bucket.filter(Boolean).length}/16 slots</span></span>
                <span className="mt-3 grid grid-cols-8 gap-1" aria-label={`bucket ${bucketIndex + 1} slots`}>
                  {bucket.map((objectId, slot) => <i key={slot} title={objectId ? `object ${objectId}` : 'padding'} className={`aspect-square rounded-[2px] border ${objectId ? 'border-emerald-600/45 bg-emerald-500/30' : 'border-border bg-muted/50'}`} />)}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)_1.25rem_minmax(0,1fr)] sm:items-center">
            <div className="min-w-0 bg-background p-3 text-center"><Braces className="mx-auto h-4 w-4" aria-hidden="true" /><p className="mt-2 text-[10px] font-bold">object masks</p><p className="mt-1 text-[9px] text-muted-foreground">data space</p></div>
            <ArrowDown className="mx-auto h-3.5 w-3.5 text-muted-foreground sm:-rotate-90" aria-hidden="true" />
            <div className="min-w-0 bg-blue-500/[0.055] p-3 text-center"><MemoryStick className="mx-auto h-4 w-4" aria-hidden="true" /><p className="mt-2 text-[10px] font-bold">shared spatial memory</p><p className="mt-1 text-[9px] text-muted-foreground">bucket {activeBucket + 1}</p></div>
            <ArrowDown className="mx-auto h-3.5 w-3.5 text-muted-foreground sm:-rotate-90" aria-hidden="true" />
            <div className="min-w-0 bg-background p-3 text-center"><Tags className="mx-auto h-4 w-4" aria-hidden="true" /><p className="mt-2 text-[10px] font-bold">object embeddings</p><p className="mt-1 text-[9px] text-muted-foreground">identity 유지</p></div>
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex items-center gap-2"><Gauge className="h-4 w-4" aria-hidden="true" /><h4 className="text-sm font-bold">호출 구조</h4></div>
          <dl className="mt-4 space-y-4">
            <div><dt className="text-[10px] font-bold uppercase text-muted-foreground">SAM 3 per-object</dt><dd className="mt-1 font-mono text-xl font-black">{objects} passes</dd></div>
            <div><dt className="text-[10px] font-bold uppercase text-muted-foreground">SAM 3.1 bucket path</dt><dd className="mt-1 font-mono text-xl font-black">{bucketCount} passes</dd></div>
            <div><dt className="text-[10px] font-bold uppercase text-muted-foreground">이론상 호출 감소</dt><dd className="mt-1 font-mono text-xl font-black">{idealReduction.toFixed(1)}×</dd></div>
          </dl>
          <p className="mt-4 border-t border-border pt-4 text-[10px] leading-relaxed text-muted-foreground">이는 memory-path 호출 수의 비율이다. 실제 end-to-end 속도는 detector, association, postprocess와 GPU에 따라 달라진다. 공식 release는 H100·128 objects에서 약 7×를 보고했다.</p>
        </aside>
      </div>
      <div className="flex min-w-0 gap-3 border-t border-border bg-emerald-500/[0.045] px-4 py-4 sm:px-5"><CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-200" aria-hidden="true" /><p className="text-xs font-semibold leading-relaxed"><code>demux(mux(x))[valid]</code>가 원래 object 순서를 복원하고 padding slot을 버려야 한다. 이 invariant가 깨지면 mask가 좋아도 ID가 바뀐다.</p></div>
    </figure>
  );
}
