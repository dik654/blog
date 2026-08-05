import { useMemo, useState } from 'react';
import { Images, ScanSearch, Tags, TextSearch } from 'lucide-react';

type AlignmentStep = 'pairs' | 'matrix' | 'space' | 'use';

const STEPS: Array<[AlignmentStep, string]> = [['pairs', '쌍'], ['matrix', 'Batch 점수'], ['space', '공유 좌표'], ['use', 'Zero-shot']];

const pairs = [
  { image: '미세 scratch', text: 'fine scratch', color: 'border-amber-500/60 bg-amber-500/[0.06]' },
  { image: '세척 잔류물', text: 'surface residue', color: 'border-sky-500/60 bg-sky-500/[0.06]' },
  { image: '정상 금속면', text: 'clean metal surface', color: 'border-emerald-500/60 bg-emerald-500/[0.06]' },
];

export function ClipAlignmentLab() {
  const [step, setStep] = useState<AlignmentStep>('pairs');
  return (
    <div data-clip-alignment-lab data-step={step} className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_20rem] md:items-end">
        <div><p className="text-[10px] font-black uppercase text-muted-foreground">Contrastive alignment</p><p className="mt-2 text-base font-bold">같은 image-text 쌍의 방향을 맞춘다</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">생성 문장을 학습하는 것이 아니라 서로 비교 가능한 vector를 학습한다.</p><p className="mt-2 text-[10px] font-bold text-muted-foreground">교육용 수치 fixture · 실제 model 출력 아님</p></div>
        <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-background p-1" role="group" aria-label="CLIP 정렬 단계 선택">{STEPS.map(([key, label]) => <button key={key} type="button" onClick={() => setStep(key)} aria-pressed={step === key} className={`min-h-11 rounded-sm px-1 text-[10px] font-bold sm:text-xs ${step === key ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>{label}</button>)}</div>
      </div>
      <div className="min-h-[25rem] p-4 sm:p-6">
        {step === 'pairs' && <div className="grid gap-3">{pairs.map((pair, index) => <div key={pair.image} className="grid min-w-0 gap-2 border-y border-border py-4 sm:grid-cols-[3rem_minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-center"><span className="font-mono text-sm font-black text-muted-foreground">0{index + 1}</span><div className={`min-w-0 border px-4 py-3 ${pair.color}`}><Images className="h-4 w-4" /><p className="mt-2 text-sm font-bold">{pair.image}</p><p className="mt-1 text-[10px] text-muted-foreground">image encoder → u{index + 1}</p></div><span className="hidden text-center text-muted-foreground sm:block">↔</span><div className={`min-w-0 border px-4 py-3 ${pair.color}`}><TextSearch className="h-4 w-4" /><p className="mt-2 break-words text-sm font-bold">{pair.text}</p><p className="mt-1 text-[10px] text-muted-foreground">text encoder → v{index + 1}</p></div></div>)}</div>}
        {step === 'matrix' && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0"><div className="grid grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] gap-1 text-center text-[10px] sm:text-xs"><div />{pairs.map((pair) => <div key={pair.text} className="min-w-0 break-words px-1 py-2 font-semibold text-muted-foreground">{pair.text}</div>)}{pairs.flatMap((pair, row) => [<div key={`${row}-label`} className="flex min-w-0 items-center pr-2 text-left font-semibold text-muted-foreground">{pair.image}</div>, ...pairs.map((_, col) => <div key={`${row}-${col}`} className={`flex aspect-square min-h-16 items-center justify-center border text-base font-black sm:min-h-20 ${row === col ? 'border-emerald-500/70 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300' : 'border-red-500/25 bg-red-500/[0.025] text-muted-foreground'}`}>{row === col ? ['4.2', '3.8', '4.5'][row] : ['-0.4', '0.2', '-0.8'][(row + col) % 3]}</div>)])}</div></div>
          <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"><p className="text-sm font-bold">대각선이 정답 쌍</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">행 기준 softmax는 이미지가 맞는 text를 찾고, 열 기준 softmax는 text가 맞는 이미지를 찾는다. 나머지 칸은 같은 batch에서 만든 negative다.</p><div className="mt-5 border-l-2 border-amber-500/60 pl-3 text-xs leading-relaxed text-muted-foreground">Caption이 모호하거나 batch 안에 사실상 같은 이미지가 있으면 false negative가 생길 수 있다.</div></div>
        </div>}
        {step === 'space' && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="grid gap-2 sm:hidden">
            {pairs.map((pair) => <div key={pair.image} className={`grid grid-cols-2 gap-2 border p-3 text-[10px] font-bold ${pair.color}`}><span>image · {pair.image}</span><span>text · {pair.text}</span></div>)}
            <p className="border-l-2 border-border pl-3 text-xs leading-relaxed text-muted-foreground">모바일에서는 겹치는 2D label 대신 가까워져야 할 pair를 행으로 표시한다.</p>
          </div>
          <div className="relative hidden min-h-[20rem] overflow-hidden border border-border bg-muted/15 sm:block">
            <div className="absolute left-[10%] top-[16%] h-[1px] w-[80%] bg-border" /><div className="absolute bottom-[12%] left-[50%] h-[76%] w-[1px] bg-border" />
            {[
              ['img · scratch', 'left-[20%] top-[25%] bg-amber-500'], ['text · fine scratch', 'left-[30%] top-[34%] bg-amber-300'],
              ['img · residue', 'right-[20%] top-[25%] bg-sky-500'], ['text · surface residue', 'right-[28%] top-[36%] bg-sky-300'],
              ['img · clean', 'left-[47%] bottom-[19%] bg-emerald-500'], ['text · clean metal', 'left-[56%] bottom-[27%] bg-emerald-300'],
            ].map(([label, pos]) => <div key={label} className={`absolute ${pos} max-w-[8rem] border-2 border-background px-2 py-1 text-[9px] font-bold text-zinc-950 shadow-sm`}>{label}</div>)}
          </div>
          <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"><p className="text-sm font-bold">좌표값보다 방향</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">L2 normalization 뒤에는 vector 길이보다 angle이 similarity를 결정한다. 가까운 pair가 의미적으로 대응하도록 encoder 둘을 함께 학습한다.</p><p className="mt-5 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">주의.</strong> 이 2D 그림은 이해용 projection이다. 실제 embedding의 축에 “scratch”라는 사람이 읽을 수 있는 이름이 붙는다는 뜻은 아니다.</p></div>
        </div>}
        {step === 'use' && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 border border-border p-4 sm:p-6"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center bg-zinc-900 text-white"><ScanSearch className="h-5 w-5" /></div><div><p className="text-sm font-bold">새 wafer crop</p><p className="text-xs text-muted-foreground">image encoder → normalized q</p></div></div><div className="mt-6 space-y-2">{[['fine scratch', 0.88], ['surface residue', 0.43], ['clean metal surface', 0.22]].map(([label, score]) => <div key={String(label)} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-3"><div className="min-w-0"><div className="mb-1 flex justify-between text-xs"><span className="truncate">{label}</span></div><div className="h-2 bg-muted"><div className={`h-full ${Number(score) > 0.8 ? 'bg-emerald-500' : 'bg-zinc-400'}`} style={{ width: `${Number(score) * 100}%` }} /></div></div><span className="font-mono text-xs font-black">{Number(score).toFixed(2)}</span></div>)}</div></div>
          <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"><Tags className="h-4 w-4" /><p className="mt-4 text-sm font-bold">Text label을 classifier weight처럼 사용</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">여러 prompt template의 text vector를 평균해 class prototype을 만들고 새 image vector와 비교한다.</p><p className="mt-5 border-l-2 border-red-500/50 pl-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">하지 않는 일.</strong> Global CLIP score만으로 scratch의 box나 mask가 나오지 않는다. Region grounding detector 또는 segmenter가 별도로 필요하다.</p></div>
        </div>}
      </div>
    </div>
  );
}

type RetrievalCase = 'correct' | 'false-neighbor' | 'prompt-shift';

const CASES = {
  correct: { label: '정상 이웃', query: '미세한 직선 scratch', ranks: ['같은 공정 scratch', '얕은 scratch', '다른 lot scratch'], metric: 'P@3 1.00 · MRR 1.00', action: '근거 crop과 lot metadata를 함께 반환한다.' },
  'false-neighbor': { label: '시각적 오답', query: '미세한 직선 scratch', ranks: ['연마 무늬 · 오답', '얕은 scratch', '반사선 · 오답'], metric: 'P@3 0.33 · MRR 0.50', action: '공정·원인 label의 hard negative를 추가하고 domain encoder와 비교한다.' },
  'prompt-shift': { label: 'Prompt 이동', query: 'thin linear anomaly', ranks: ['세척 잔류물 · 오답', '반사선 · 오답', '얕은 scratch'], metric: 'P@3 0.33 · MRR 0.33', action: '한·영 template와 용어집을 version하고 holdout에서 prototype을 다시 검증한다.' },
} as const;

export function RetrievalFailureLab() {
  const [fixture, setFixture] = useState<RetrievalCase>('false-neighbor');
  const selected = CASES[fixture];
  const tone = useMemo(() => fixture === 'correct' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300', [fixture]);
  return (
    <div data-clip-retrieval-lab data-fixture={fixture} data-evidence-status="illustrative-fixture" className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div><p className="text-[10px] font-black uppercase text-muted-foreground">Retrieval failure audit</p><p className="mt-2 text-base font-bold">가까운 vector가 같은 원인이라는 보장은 없다</p><p className="mt-2 text-[10px] font-bold text-muted-foreground">교육용 수치 fixture · 실측 아님</p></div><div className="flex flex-wrap gap-1" role="group" aria-label="CLIP 검색 실패 선택">{(Object.entries(CASES) as Array<[RetrievalCase, typeof selected]>).map(([key, item]) => <button key={key} type="button" onClick={() => setFixture(key)} aria-pressed={fixture === key} className={`min-h-11 rounded-sm border px-3 text-[10px] font-bold ${fixture === key ? 'bg-foreground text-background' : 'border-border text-muted-foreground'}`}>{item.label}</button>)}</div></div>
      <div className="grid gap-px bg-border lg:grid-cols-[0.8fr_1.2fr_0.9fr]"><div className="min-w-0 bg-background p-5"><p className="text-[10px] font-bold text-muted-foreground">QUERY</p><p className="mt-3 text-sm font-bold leading-relaxed">{selected.query}</p></div><div className="min-w-0 bg-background p-5"><p className="text-[10px] font-bold text-muted-foreground">TOP 3</p><ol className="mt-3 space-y-2">{selected.ranks.map((rank, index) => <li key={rank} className="grid grid-cols-[1.5rem_minmax(0,1fr)] text-xs"><span className="font-mono font-black">{index + 1}</span><span className="break-words text-muted-foreground">{rank}</span></li>)}</ol></div><div className="min-w-0 bg-background p-5"><p className={`font-mono text-base font-black ${tone}`}>{selected.metric}</p><p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">모든 fixture에 P@3와 첫 정답 순위의 역수인 MRR을 함께 표시한다.</p><p className="mt-4 text-xs leading-relaxed text-muted-foreground">{selected.action}</p></div></div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-4" aria-label="CLIP retrieval evidence receipt">
        {[['Source crop', 'fixture-001'], ['Encoder digest', '미연결'], ['Prompt set', '미연결'], ['Reviewer label', '미연결']].map(([label, value]) => <div key={label} className="bg-muted/15 px-4 py-3"><p className="text-[9px] font-black uppercase text-muted-foreground">{label}</p><p className="mt-1 font-mono text-[10px] font-bold">{value}</p></div>)}
      </div>
      <p className="border-t border-border px-5 py-3 text-[10px] font-semibold leading-relaxed text-muted-foreground">Evidence receipt가 완성되기 전에는 이 수치를 release evidence로 사용할 수 없다.</p>
    </div>
  );
}
