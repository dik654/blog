import { useMemo, useState } from 'react';
import { BoxSelect, Crosshair, Gauge, ScanSearch, Tags, Video } from 'lucide-react';

type TaskKey = 'classify' | 'detect' | 'segment' | 'track';

const TASKS: Record<TaskKey, {
  label: string;
  eyebrow: string;
  question: string;
  schema: string;
  cannot: string;
}> = {
  classify: {
    label: '분류', eyebrow: 'CLASS', question: '이 frame에 불량이 있는가?',
    schema: '{ class, score }', cannot: '불량이 두 개인지, 어느 pixel인지 답하지 못한다.',
  },
  detect: {
    label: '객체 탐지', eyebrow: 'BOX', question: '각 불량은 어디에 있고 무엇인가?',
    schema: '[{ class, score, box_xyxy }]', cannot: '얇은 scratch의 실제 경계와 면적은 box만으로 모른다.',
  },
  segment: {
    label: 'Instance mask', eyebrow: 'MASK', question: '각 불량이 차지하는 pixel은 어디인가?',
    schema: '[{ instance_id, class?, mask }]', cannot: '다음 frame의 같은 객체라는 보장은 별도 identity 계약이 필요하다.',
  },
  track: {
    label: 'Tracking', eyebrow: 'IDENTITY', question: '가림 뒤에도 같은 불량 ID인가?',
    schema: '[{ frame, track_id, box|mask, state }]', cannot: '새 ID와 재등장 ID를 구분할 memory·association 규칙이 필요하다.',
  },
};

function InspectionScene({ task }: { task: TaskKey }) {
  const showBox = task === 'detect' || task === 'track';
  const showMask = task === 'segment';
  return (
    <div className="relative aspect-[4/3] min-h-0 overflow-hidden border border-border bg-zinc-950 sm:aspect-[16/10] sm:min-h-[19rem]" aria-label="표면 결함 검사 장면">
      <div className="absolute inset-x-[7%] top-[12%] h-[76%] border border-zinc-700 bg-zinc-900 shadow-inner" />
      <div className="absolute left-[18%] top-[30%] h-[2px] w-[29%] rotate-[7deg] bg-amber-300/75" />
      <div className="absolute left-[54%] top-[54%] h-[2px] w-[21%] -rotate-[13deg] bg-sky-300/75" />
      <div className="absolute left-[68%] top-[28%] h-8 w-8 rounded-full border border-zinc-600 bg-zinc-800" />
      {task === 'classify' && (
        <div className="absolute bottom-4 left-4 right-4 border-l-2 border-amber-400 bg-black/75 px-3 py-2 text-xs text-white">
          <strong>표면 불량</strong><span className="ml-2 text-zinc-300">0.94</span>
        </div>
      )}
      {showBox && (
        <>
          <div className="absolute left-[15%] top-[23%] h-[22%] w-[36%] border-2 border-amber-400"><span className="absolute -top-6 left-0 bg-amber-400 px-1.5 py-1 text-[9px] font-black text-black">scratch · 0.91</span></div>
          <div className="absolute left-[51%] top-[46%] h-[22%] w-[28%] border-2 border-sky-400"><span className="absolute -bottom-6 right-0 bg-sky-400 px-1.5 py-1 text-[9px] font-black text-black">{task === 'track' ? 'ID 07' : 'scratch · 0.86'}</span></div>
        </>
      )}
      {showMask && (
        <>
          <div className="absolute left-[16%] top-[26%] h-[17%] w-[34%] rotate-[7deg] border border-amber-300 bg-amber-300/25" />
          <div className="absolute left-[53%] top-[49%] h-[15%] w-[24%] -rotate-[13deg] border border-sky-300 bg-sky-300/25" />
        </>
      )}
      {task === 'track' && <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-black/70 px-2 py-1 text-[9px] font-bold text-zinc-200"><Video className="h-3 w-3" /> frame 128 · memory active</div>}
    </div>
  );
}

export function TaskContractLab() {
  const [task, setTask] = useState<TaskKey>('detect');
  const selected = TASKS[task];
  return (
    <div data-vision-task-lab data-task={task} className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div className="min-w-0"><p className="text-[10px] font-black uppercase text-muted-foreground">Output contract lab</p><p className="mt-2 text-base font-bold">같은 장면도 어떤 답을 요구하느냐에 따라 task가 달라진다</p><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">버튼을 바꾸면 모델 이름이 아니라 출력이 주장하는 범위가 바뀐다.</p></div>
        <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1" role="group" aria-label="비전 작업 선택">
          {(Object.entries(TASKS) as Array<[TaskKey, typeof selected]>).map(([key, item]) => <button key={key} type="button" onClick={() => setTask(key)} aria-pressed={task === key} className={`min-h-11 rounded-sm px-2 text-xs font-bold ${task === key ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}>{item.label}</button>)}
        </div>
      </div>
      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.8fr)]">
        <InspectionScene task={task} />
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-mono text-[10px] font-black text-blue-700 dark:text-blue-300">{selected.eyebrow}</p>
          <p className="mt-3 text-lg font-bold leading-snug">{selected.question}</p>
          <div className="mt-5 border-y border-border py-4"><p className="text-[10px] font-bold text-muted-foreground">OUTPUT SCHEMA</p><code className="mt-2 block break-words text-xs leading-relaxed">{selected.schema}</code></div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">이 출력만으로 못 하는 일.</strong> {selected.cannot}</p>
        </div>
      </div>
    </div>
  );
}

type TransformKey = 'letterbox' | 'stretch' | 'crop';

const TRANSFORMS: Record<TransformKey, { label: string; params: string[]; modelBox: string; restored: string; warning: string }> = {
  letterbox: {
    label: '비율 유지 + 여백', params: ['scale = 1/3', 'pad_x = 0', 'pad_y = 140'],
    modelBox: '(320, 230) → (480, 410)', restored: '(960, 270) → (1440, 810)', warning: 'y에서도 3배만 하면 여백 140까지 확대해 420px가 밀린다.',
  },
  stretch: {
    label: '축별 늘이기', params: ['scale_x = 1/3', 'scale_y = 16/27', 'padding = 0'],
    modelBox: '(320, 160) → (480, 480)', restored: '(960, 270) → (1440, 810)', warning: 'x scale을 y에 재사용하면 box 높이가 틀어진다.',
  },
  crop: {
    label: '중앙 crop', params: ['crop_x = 420', 'crop_y = 0', 'scale = 16/27'],
    modelBox: '(320, 160) → (604, 480)', restored: '(960, 270) → (1439, 810)', warning: 'crop origin을 더하지 않으면 원본에서 왼쪽으로 420px 이동한다.',
  },
};

export function CoordinateTransformLab() {
  const [mode, setMode] = useState<TransformKey>('letterbox');
  const selected = TRANSFORMS[mode];
  return (
    <div data-coordinate-transform-lab data-transform={mode} className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div><p className="text-[10px] font-black uppercase text-muted-foreground">Coordinate round trip</p><p className="mt-2 text-base font-bold">원본 1920×1080 → 모델 640×640 → 원본 box</p></div>
        <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-muted/20 p-1" role="group" aria-label="입력 변환 선택">
          {(Object.entries(TRANSFORMS) as Array<[TransformKey, typeof selected]>).map(([key, item]) => <button key={key} type="button" onClick={() => setMode(key)} aria-pressed={mode === key} className={`min-h-11 rounded-sm px-2 text-[10px] font-bold sm:text-xs ${mode === key ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>{item.label}</button>)}
        </div>
      </div>
      <div className="grid gap-px bg-border lg:grid-cols-[1fr_1fr_1fr]">
        <div className="min-w-0 bg-background p-4 sm:p-5"><p className="font-mono text-[10px] font-black text-muted-foreground">01 · SOURCE PIXEL</p><div className="relative mt-4 aspect-video border border-border bg-muted/30"><div className="absolute left-1/2 top-1/4 h-1/2 w-1/4 border-2 border-amber-500" /></div><p className="mt-3 text-xs text-muted-foreground">box · (960, 270) → (1440, 810)</p></div>
        <div className="min-w-0 bg-background p-4 sm:p-5"><p className="font-mono text-[10px] font-black text-muted-foreground">02 · MODEL INPUT</p><div className="mt-4 flex aspect-video items-center justify-center border border-border bg-zinc-950"><div className={`relative border border-zinc-700 bg-zinc-900 ${mode === 'letterbox' ? 'aspect-video w-full' : mode === 'crop' ? 'aspect-square h-full' : 'h-full w-full'}`}><div className="absolute left-1/2 top-1/4 h-1/2 w-1/4 border-2 border-sky-400" /></div></div><p className="mt-3 break-words text-xs text-muted-foreground">model box · {selected.modelBox}</p></div>
        <div className="min-w-0 bg-background p-4 sm:p-5"><p className="font-mono text-[10px] font-black text-muted-foreground">03 · INVERSE</p><div className="mt-4 space-y-2">{selected.params.map((param) => <div key={param} className="border-l-2 border-blue-500/60 py-1 pl-3 font-mono text-xs">{param}</div>)}</div><p className="mt-4 break-words text-sm font-bold">복원 · {selected.restored}</p><p className="mt-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">Scale만 기억하면: {selected.warning}</p></div>
      </div>
    </div>
  );
}

type VisionFailure = 'unmeasured' | 'pass' | 'geometry' | 'small' | 'identity' | 'runtime';

const FAILURE_LABELS: Array<[VisionFailure, string]> = [['unmeasured', '실측 없음'], ['pass', '통과 예시'], ['geometry', '좌표 역변환'], ['small', '작은 객체'], ['identity', 'ID 유지'], ['runtime', '지연시간']];

export function VisionReleaseGate() {
  const [failure, setFailure] = useState<VisionFailure>('unmeasured');
  const unmeasured = failure === 'unmeasured';
  const gates = useMemo(() => [
    { key: 'geometry', icon: Crosshair, label: 'Geometry', value: unmeasured ? 'round-trip evidence 미연결' : failure === 'geometry' ? '원본 box 18px 오차' : 'round-trip ≤ 1px' },
    { key: 'small', icon: ScanSearch, label: 'Small-object', value: unmeasured ? 'critical slice evidence 미연결' : failure === 'small' ? '12–20px recall 0.61' : 'slice recall 0.91' },
    { key: 'identity', icon: Tags, label: 'Identity', value: unmeasured ? 'occlusion fixture evidence 미연결' : failure === 'identity' ? 'occlusion 뒤 ID swap' : 'critical swap 0건' },
    { key: 'runtime', icon: Gauge, label: 'Runtime', value: unmeasured ? 'target device trace 미연결' : failure === 'runtime' ? 'p95 84ms > 50ms' : 'p95 43ms' },
  ], [failure, unmeasured]);
  const pass = failure === 'pass';
  return (
    <div data-vision-release-gate data-decision={pass ? 'release' : 'blocked'} data-evidence-status={unmeasured ? 'missing' : 'illustrative-fixture'} className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div><p className="text-[10px] font-black uppercase text-muted-foreground">Fail-closed release</p><p className="mt-2 text-base font-bold">평균 AP가 높아도 blocking slice 하나면 멈춘다</p><p className="mt-2 inline-flex border border-amber-500/40 bg-amber-500/[0.06] px-2 py-1 text-[10px] font-bold text-amber-800 dark:text-amber-200">교육용 fixture · 실측 아님</p></div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="비전 릴리스 실패 선택">{FAILURE_LABELS.map(([key, label]) => <button key={key} type="button" onClick={() => setFailure(key)} aria-pressed={failure === key} className={`min-h-11 rounded-sm border px-3 text-[10px] font-bold ${failure === key ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground'}`}>{label}</button>)}</div>
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{gates.map((gate) => { const Icon = gate.icon; const ok = pass || (!unmeasured && failure !== gate.key); return <div key={gate.key} className="min-w-0 bg-background p-4 sm:p-5"><Icon className={`h-4 w-4 ${ok ? 'text-emerald-600' : 'text-red-600'}`} /><p className="mt-4 text-xs font-bold">{gate.label}</p><p className={`mt-2 text-xs leading-relaxed ${ok ? 'text-muted-foreground' : 'font-semibold text-red-700 dark:text-red-300'}`}>{gate.value}</p></div>; })}</div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-4" aria-label="비전 릴리스 evidence receipt">
        {[['Dataset slice', unmeasured ? '미연결' : 'fixture-v1'], ['Run ID', unmeasured ? '미연결' : 'demo-run'], ['Device', unmeasured ? '미연결' : 'demo-device'], ['Artifact digest', unmeasured ? '미연결' : 'demo-only']].map(([label, value]) => <div key={label} className="bg-muted/15 px-4 py-3"><p className="text-[9px] font-black uppercase text-muted-foreground">{label}</p><p className="mt-1 font-mono text-[10px] font-bold">{value}</p></div>)}
      </div>
      <div className={`flex items-center gap-3 border-t border-border px-4 py-4 text-sm font-black sm:px-6 ${pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}><BoxSelect className="h-4 w-4" />decision · {pass ? 'release' : 'blocked'}</div>
    </div>
  );
}
