import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowRight, Check, GitMerge, Layers3, TimerReset } from 'lucide-react';

type AssignmentStage = 'raw' | 'match' | 'loss';

function nextTabIndex(event: KeyboardEvent<HTMLButtonElement>, index: number, length: number) {
  if (event.key === 'Home') return 0;
  if (event.key === 'End') return length - 1;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') return (index + 1) % length;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') return (index - 1 + length) % length;
  return null;
}

const assignments = [
  { query: 'Q01', prediction: '고양이 · box A', target: '고양이', cost: 0.18, loss: '−log p(cat) + box loss', duplicate: false },
  { query: 'Q02', prediction: '고양이 · box A′', target: '∅', cost: null, loss: '0.1 × [−log p(∅)]', duplicate: true },
  { query: 'Q03', prediction: '강아지 · box B', target: '강아지', cost: 0.22, loss: '−log p(dog) + box loss', duplicate: false },
  { query: 'Q04', prediction: '배경', target: '∅', cost: null, loss: '0.1 × [−log p(∅)]', duplicate: false },
] as const;

export function HungarianAssignmentLab() {
  const [stage, setStage] = useState<AssignmentStage>('match');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabs = [['raw', '예측 집합'], ['match', '일대일 배정'], ['loss', '학습 loss']] as const;

  return (
    <figure data-detr-assignment-lab className="not-prose my-8 border-y border-border">
      <header className="grid grid-cols-3 border-x border-border" role="tablist" aria-label="DETR assignment stage">
        {tabs.map(([key, label], index) => (
          <button
            key={key}
            id={`detr-assignment-tab-${key}`}
            ref={(node) => { tabRefs.current[index] = node; }}
            type="button"
            role="tab"
            aria-selected={stage === key}
            aria-controls="detr-assignment-panel"
            tabIndex={stage === key ? 0 : -1}
            onClick={() => setStage(key)}
            onKeyDown={(event) => {
              const next = nextTabIndex(event, index, tabs.length);
              if (next == null) return;
              event.preventDefault();
              setStage(tabs[next][0]);
              tabRefs.current[next]?.focus();
            }}
            className={`min-h-12 border-b-2 px-2 text-xs font-bold sm:text-sm ${stage === key ? 'border-foreground bg-muted/35' : 'border-transparent text-muted-foreground hover:bg-muted/20'}`}
          >
            {label}
          </button>
        ))}
      </header>
      <div id="detr-assignment-panel" role="tabpanel" aria-labelledby={`detr-assignment-tab-${stage}`} className="divide-y divide-border py-2">
        {assignments.map((row) => (
          <div key={row.query} className="grid min-w-0 gap-3 py-4 sm:grid-cols-[3rem_minmax(0,0.9fr)_2rem_minmax(0,1.1fr)] sm:items-center">
            <p className="font-mono text-xs font-black">{row.query}</p>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">Prediction</p>
              <p className="mt-1 text-sm font-bold leading-relaxed">{row.prediction}</p>
            </div>
            <div className="flex items-center justify-center text-muted-foreground">
              <ArrowDown className="size-4 sm:hidden" aria-hidden="true" />
              <ArrowRight className="hidden size-4 sm:block" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              {stage === 'raw' ? (
                <>
                  <p className="text-xs font-semibold text-muted-foreground">아직 책임 없음</p>
                  <p className="mt-1 text-sm leading-relaxed">같은 객체를 여러 query가 예측해도 정리되지 않았다.</p>
                </>
              ) : stage === 'match' ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">Matched target</p>
                    <p className="font-mono text-xs font-bold">
                      {row.cost == null ? 'cost const 0.00' : `cost ${row.cost.toFixed(2)}`}
                    </p>
                  </div>
                  <p className={`mt-1 text-sm font-black ${row.duplicate ? 'text-amber-700 dark:text-amber-300' : ''}`}>{row.target}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-muted-foreground">Hungarian loss term</p>
                  <p className="mt-1 break-words font-mono text-xs font-bold leading-relaxed">{row.loss}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="flex gap-2 pb-5 text-xs leading-relaxed text-muted-foreground">
        <GitMerge className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
        정답 두 개를 N=4로 맞추려고 두 개의 ∅ target을 pad한 fixture다. Q02의 고양이 중복 예측은 같은 고양이 정답을 함께 차지할 수 없으므로 ∅에 배정되어 class loss를 받는다. 실제 assignment는 전체 cost 합이 최소인 permutation을 Hungarian algorithm으로 찾는다.
      </figcaption>
    </figure>
  );
}

const pipeline = [
  { label: 'CNN', value: 'C×H/32×W/32', note: 'Spatial feature 추출' },
  { label: 'Encoder', value: 'd×HW', note: 'Flatten + global context' },
  { label: 'N queries', value: '100×d', note: 'Learned slots · 병렬' },
  { label: 'Decoder', value: '100×d', note: 'Self + cross-attention' },
  { label: 'Shared FFN', value: '100 outputs', note: 'Class·box 또는 ∅' },
] as const;

export function DetrQueryPipeline() {
  const [active, setActive] = useState(2);

  return (
    <figure data-detr-query-pipeline className="not-prose my-8 border-y border-border">
      <header className="flex items-center justify-between gap-4 py-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Execution path</p>
          <p className="mt-1 text-sm font-bold">Object query는 token을 한 개씩 생성하지 않는다</p>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">단계 선택</p>
      </header>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {pipeline.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            className={`min-h-28 min-w-0 border-y-2 px-2 py-3 text-left transition-colors motion-reduce:transition-none ${active === index ? 'border-blue-600 bg-blue-500/10' : 'border-border hover:bg-muted/30'} ${index === pipeline.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
          >
            <span className="block text-xs font-black">{item.label}</span>
            <span className="mt-3 block break-words font-mono text-xs font-bold">{item.value}</span>
            <span className="mt-2 block text-xs leading-snug text-muted-foreground">{item.note}</span>
          </button>
        ))}
      </div>
      <div className="my-5 grid gap-3 border-l-2 border-blue-600 pl-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <p className="text-sm font-black">{pipeline[active].label}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {active === 0 && 'Backbone은 image를 낮은 해상도의 spatial feature로 바꾼다. 이 stage에서 사라진 작은 객체 정보는 뒤 query가 되살릴 수 없다.'}
          {active === 1 && 'Encoder는 HW spatial position을 sequence로 보고 global relation을 섞는다. Positional encoding이 2D 위치를 구분한다.'}
          {active === 2 && 'N개의 learned query embedding은 서로 다른 output slot을 만든다. 모두 같은 decoder layer에서 동시에 갱신되며 autoregressive order가 없다.'}
          {active === 3 && 'Query끼리 self-attention하고 encoded image를 cross-attention으로 읽는다. 여러 decoder layer의 중간 출력에도 auxiliary Hungarian loss를 붙였다.'}
          {active === 4 && '모든 decoder output에 parameter를 공유하는 prediction head를 적용한다. 각 slot은 class+box 또는 ∅를 독립적으로 예측한다.'}
        </p>
      </div>
      <figcaption className="pb-5 text-xs leading-relaxed text-muted-foreground">
        원 논문은 보통 N=100을 사용했다. Query 번호가 고정 class를 뜻하지 않으며, self/cross-attention을 거치며 image마다 다른 객체를 맡는다.
      </figcaption>
    </figure>
  );
}

type EvidenceView = 'scale' | 'schedule' | 'loss';

export function DetrEvidenceLab() {
  const [view, setView] = useState<EvidenceView>('scale');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabs = [['scale', '객체 크기'], ['schedule', '수렴 비용'], ['loss', 'Loss ablation']] as const;

  const scaleRows = [
    { label: 'Faster R-CNN-FPN+', ap: 42.0, small: 26.6, large: 53.4 },
    { label: 'DETR', ap: 42.0, small: 20.5, large: 61.1 },
  ];
  const lossRows = [
    { label: 'Class + L1', value: 35.8, small: 13.7 },
    { label: 'Class + GIoU', value: 39.9, small: 19.9 },
    { label: 'Class + L1 + GIoU', value: 40.6, small: 19.9 },
  ];

  return (
    <figure data-detr-evidence-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">DETR source evidence</p>
          <p className="mt-1 text-sm font-bold">같은 AP 뒤의 객체 크기·학습 시간·loss 역할을 분리한다</p>
        </div>
        <div className="grid grid-cols-3 gap-1" role="tablist" aria-label="DETR evidence type">
          {tabs.map(([key, label], index) => (
            <button
              key={key}
              id={`detr-evidence-tab-${key}`}
              ref={(node) => { tabRefs.current[index] = node; }}
              type="button"
              role="tab"
              aria-selected={view === key}
              aria-controls="detr-evidence-panel"
              tabIndex={view === key ? 0 : -1}
              onClick={() => setView(key)}
              onKeyDown={(event) => {
                const next = nextTabIndex(event, index, tabs.length);
                if (next == null) return;
                event.preventDefault();
                setView(tabs[next][0]);
                tabRefs.current[next]?.focus();
              }}
              className={`min-h-11 rounded-md border px-2 text-xs font-bold ${view === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <div id="detr-evidence-panel" role="tabpanel" aria-labelledby={`detr-evidence-tab-${view}`}>
      {view === 'scale' && (
        <div className="divide-y divide-border border-y border-border">
          {scaleRows.map((row) => (
            <div key={row.label} className="grid gap-4 py-5 sm:grid-cols-[11rem_repeat(3,minmax(0,1fr))] sm:items-end">
              <p className="text-sm font-black">{row.label}</p>
              {[['전체 AP', row.ap], ['AP_small', row.small], ['AP_large', row.large]].map(([label, value]) => (
                <div key={label}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-mono text-sm font-black">{Number(value).toFixed(1)}</p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${label === 'AP_small' ? 'bg-amber-500' : label === 'AP_large' ? 'bg-emerald-600' : 'bg-foreground/60'}`} style={{ width: `${Number(value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {view === 'schedule' && (
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {[
            ['Ablation schedule', '300 epochs', '16 V100에서 약 3일 · 200 epoch 뒤 LR drop'],
            ['Baseline comparison', '500 epochs', '400 epoch 뒤 LR drop · shorter schedule보다 +1.5 AP'],
            ['해석', '300 → 500', 'DETR은 200 epoch를 더 써 +1.5 AP를 얻었다. Epoch를 현재 detector에 보편값으로 복사하지 않는다.'],
          ].map(([label, value, note]) => (
            <div key={label} className="min-w-0 bg-background p-5">
              <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              <p className="mt-3 font-mono text-2xl font-black">{value}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      )}
      {view === 'loss' && (
        <div className="divide-y divide-border border-y border-border">
          {lossRows.map((row) => (
            <div key={row.label} className="grid gap-3 py-5 sm:grid-cols-[12rem_minmax(0,1fr)_5rem_5rem] sm:items-center">
              <p className="text-sm font-black">{row.label}</p>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-blue-600" style={{ width: `${(row.value / 42) * 100}%` }} />
              </div>
              <p className="font-mono text-xs font-bold sm:text-right">AP {row.value}</p>
              <p className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 sm:text-right">S {row.small}</p>
            </div>
          ))}
        </div>
      )}
      </div>
      <figcaption className="flex gap-2 py-5 text-xs leading-relaxed text-muted-foreground">
        {view === 'schedule' ? <TimerReset className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" /> : view === 'loss' ? <Layers3 className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" /> : <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />}
        {view === 'scale' && 'Table 1의 ResNet-50 비교다. DETR은 전체 AP가 같아도 작은 객체에서 −6.1 AP, 큰 객체에서 +7.7 AP였다.'}
        {view === 'schedule' && '긴 schedule은 원 DETR의 실질적 수렴 병목이다. Deformable DETR의 개선을 읽을 때 품질뿐 아니라 같은 schedule까지 비교해야 한다.'}
        {view === 'loss' && 'Table 4의 ablation이다. L1만으로는 box scale 차이에 약했고, GIoU가 대부분의 AP를 책임했지만 둘을 함께 썼을 때 전체 AP가 가장 높았다.'}
      </figcaption>
    </figure>
  );
}
