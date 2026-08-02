import { useMemo, useState } from 'react';
import { Boxes, Gauge, MessageSquareText, ScanSearch, Tags } from 'lucide-react';

type Branch = 'fixed' | 'open';

const BRANCHES = {
  fixed: {
    label: 'Fixed vocabulary', title: '여섯 class를 매 frame 빠르게 찾는다',
    prompt: 'class IDs · helmet, vest, person…', output: 'class_id + score + box',
    flow: ['640px image', 'multi-scale features', 'object queries', 'box distribution refine', '6-class output'],
    tradeoff: 'Vocabulary가 바뀌면 label schema와 학습·검증 artifact도 다시 고정해야 한다.',
  },
  open: {
    label: 'Open vocabulary', title: '실행 중 입력한 문장으로 region을 찾는다',
    prompt: '“파란 조끼를 입고 쓰러진 사람”', output: 'phrase span + score + box',
    flow: ['image + text', 'vision/text features', 'language-guided query', 'cross-modal decoder', 'phrase-grounded boxes'],
    tradeoff: '표현이 자유로운 대신 동의어, 부정 표현, 속성 결합과 언어별 calibration을 별도 검증한다.',
  },
} as const;

export function DetectionBranchLab() {
  const [branch, setBranch] = useState<Branch>('fixed');
  const selected = BRANCHES[branch];
  return (
    <div data-detection-branch-lab data-branch={branch} className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end">
        <div><p className="text-xs font-black uppercase text-muted-foreground">Deployment branch</p><p className="mt-2 text-base font-bold">같은 box 출력이어도 vocabulary 계약이 다르다</p><p className="mt-2 text-xs font-bold text-muted-foreground">교육용 구조 fixture · 실제 detector 출력 아님</p></div>
        <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1" role="group" aria-label="객체 탐지 vocabulary 선택">{(Object.keys(BRANCHES) as Branch[]).map((key) => <button key={key} type="button" onClick={() => setBranch(key)} aria-pressed={branch === key} className={`min-h-11 rounded-sm px-2 text-xs font-bold ${branch === key ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>{BRANCHES[key].label}</button>)}</div>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]">
        <div className="min-w-0">
          <div className="relative aspect-[4/3] min-h-0 overflow-hidden border border-border bg-zinc-950 sm:aspect-[16/9] sm:min-h-[15rem]">
            <div className="absolute inset-x-[6%] bottom-[14%] h-[54%] border border-zinc-700 bg-zinc-900" />
            <div className="absolute left-[18%] bottom-[17%] h-[43%] w-[12%] bg-blue-900" />
            <div className="absolute left-[52%] bottom-[17%] h-[48%] w-[13%] bg-amber-900" />
            <div className="absolute left-[14%] bottom-[13%] h-[55%] w-[21%] border-2 border-sky-400"><span className="absolute -top-7 left-0 whitespace-nowrap bg-sky-400 px-1.5 py-1 text-xs font-black text-black">{branch === 'fixed' ? 'person · 0.96' : '“파란 조끼…” · 0.83'}</span></div>
            <div className={`absolute left-[48%] bottom-[13%] h-[59%] w-[22%] border-2 ${branch === 'fixed' ? 'border-amber-400' : 'border-zinc-600 opacity-40'}`} />
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-black/75 px-3 py-2 text-xs text-zinc-200">{branch === 'fixed' ? <Tags className="h-3.5 w-3.5 text-amber-300" /> : <MessageSquareText className="h-3.5 w-3.5 text-sky-300" />}<span className="break-words">{selected.prompt}</span></div>
          </div>
          <div className="mt-3 grid gap-px bg-border sm:grid-cols-5">{selected.flow.map((step, index) => <div key={step} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-center bg-background px-3 py-3 text-left sm:block sm:px-2 sm:text-center"><p className="font-mono text-xs font-black text-muted-foreground">0{index + 1}</p><p className="min-w-0 break-words text-xs font-semibold leading-snug sm:mt-1">{step}</p></div>)}</div>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><p className="text-lg font-bold leading-snug">{selected.title}</p><div className="mt-5 border-y border-border py-4"><p className="text-xs font-bold text-muted-foreground">OUTPUT</p><code className="mt-2 block break-words text-xs">{selected.output}</code></div><p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">운영 경계.</strong> {selected.tradeoff}</p></div>
      </div>
    </div>
  );
}

type DecisionCase = 'keep' | 'duplicate' | 'unknown' | 'coordinate';

const DECISIONS = {
  keep: { label: '정상 검출', score: '0.91', overlap: 'IoU 0.18', result: 'keep', body: '점수 gate를 넘고 다른 box와 같은 객체로 볼 overlap이 낮다.' },
  duplicate: { label: '중복 box', score: '0.88 / 0.84', overlap: 'IoU 0.82', result: 'suppress or match', body: '두 점수가 높아도 같은 객체를 중복 설명한다. NMS 또는 set assignment 책임이다.' },
  unknown: { label: '미검증 문장', score: '0.79', overlap: 'GT 없음', result: 'review', body: 'Open-vocabulary score는 의미 정답의 보증이 아니다. 동의어·속성 조합 fixture가 필요하다.' },
  coordinate: { label: '좌표 오류', score: '0.94', overlap: 'source IoU 0.41', result: 'blocked', body: 'Model 좌표에서는 좋아 보여도 padding을 제거하지 않으면 source pixel에서 틀린 box다.' },
} as const;

export function DetectionDecisionLab() {
  const [fixture, setFixture] = useState<DecisionCase>('duplicate');
  const selected = DECISIONS[fixture];
  return (
    <div data-detection-decision-lab data-fixture={fixture} data-result={selected.result} className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div><p className="text-xs font-black uppercase text-muted-foreground">Decision audit</p><p className="mt-2 text-base font-bold">Confidence와 overlap은 같은 숫자가 아니다</p><p className="mt-2 text-xs font-bold text-muted-foreground">교육용 수치 fixture · 실측 아님</p></div><div className="flex flex-wrap gap-1" role="group" aria-label="탐지 판정 사례 선택">{(Object.entries(DECISIONS) as Array<[DecisionCase, typeof selected]>).map(([key, item]) => <button key={key} type="button" onClick={() => setFixture(key)} aria-pressed={fixture === key} className={`min-h-11 rounded-sm border px-3 text-xs font-bold ${fixture === key ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground'}`}>{item.label}</button>)}</div></div>
      <div className="grid gap-px bg-border sm:grid-cols-[1fr_1fr_1.4fr]">
        <div className="bg-background p-5"><ScanSearch className="h-4 w-4 text-blue-600" /><p className="mt-4 text-xs font-bold text-muted-foreground">CLASS / PHRASE SCORE</p><p className="mt-2 font-mono text-xl font-black">{selected.score}</p></div>
        <div className="bg-background p-5"><Boxes className="h-4 w-4 text-amber-600" /><p className="mt-4 text-xs font-bold text-muted-foreground">GEOMETRIC OVERLAP</p><p className="mt-2 font-mono text-xl font-black">{selected.overlap}</p></div>
        <div className="min-w-0 bg-background p-5"><p className="font-mono text-xs font-black text-muted-foreground">DECISION · {selected.result}</p><p className="mt-3 text-sm leading-relaxed">{selected.body}</p></div>
      </div>
    </div>
  );
}

type DetectionFailure = 'unmeasured' | 'pass' | 'small' | 'phrase' | 'latency' | 'manifest';

export function DetectionReleaseGate() {
  const [failure, setFailure] = useState<DetectionFailure>('unmeasured');
  const unmeasured = failure === 'unmeasured';
  const items = useMemo(() => [
    ['small', ScanSearch, 'Small object', unmeasured ? 'critical slice evidence 미연결' : failure === 'small' ? 'AP_small regression' : 'critical slice pass'],
    ['phrase', MessageSquareText, 'Unseen phrase', unmeasured ? 'phrase fixture evidence 미연결' : failure === 'phrase' ? 'Korean attribute miss' : 'phrase fixtures pass'],
    ['latency', Gauge, 'Device p95', unmeasured ? 'target device trace 미연결' : failure === 'latency' ? '76ms > 50ms' : '44ms'],
    ['manifest', Tags, 'Manifest', unmeasured ? 'artifact manifest 미연결' : failure === 'manifest' ? 'postprocess revision 없음' : 'artifact·input·vocab pinned'],
  ] as const, [failure, unmeasured]);
  const pass = failure === 'pass';
  return (
    <div data-detection-release-gate data-decision={pass ? 'release' : 'blocked'} data-evidence-status={unmeasured ? 'missing' : 'illustrative-fixture'} className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div><p className="text-xs font-black uppercase text-muted-foreground">Detector release evidence</p><p className="mt-2 text-base font-bold">모델 score와 제품 release는 다른 결정이다</p><p className="mt-2 inline-flex border border-amber-500/40 bg-amber-500/[0.06] px-2 py-1 text-xs font-bold text-amber-800 dark:text-amber-200">교육용 fixture · 실측 아님</p></div><div className="flex flex-wrap gap-1" role="group" aria-label="탐지 릴리스 실패 선택">{([['unmeasured', '실측 없음'], ['pass', '통과 예시'], ['small', '작은 객체'], ['phrase', '미지 문장'], ['latency', '지연시간'], ['manifest', 'Manifest']] as Array<[DetectionFailure, string]>).map(([key, label]) => <button key={key} type="button" onClick={() => setFailure(key)} aria-pressed={failure === key} className={`min-h-11 rounded-sm border px-3 text-xs font-bold ${failure === key ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground'}`}>{label}</button>)}</div></div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{items.map(([key, Icon, label, value]) => { const ok = pass || (!unmeasured && failure !== key); return <div key={key} className="min-w-0 bg-background p-5"><Icon className={`h-4 w-4 ${ok ? 'text-emerald-600' : 'text-red-600'}`} /><p className="mt-4 text-xs font-bold">{label}</p><p className={`mt-2 text-xs leading-relaxed ${ok ? 'text-muted-foreground' : 'font-semibold text-red-700 dark:text-red-300'}`}>{value}</p></div>; })}</div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-4" aria-label="탐지 릴리스 evidence receipt">
        {[['Dataset slice', unmeasured ? '미연결' : 'fixture-v1'], ['Run ID', unmeasured ? '미연결' : 'demo-run'], ['Device trace', unmeasured ? '미연결' : 'demo-device'], ['Artifact digest', unmeasured ? '미연결' : 'demo-only']].map(([label, value]) => <div key={label} className="bg-muted/15 px-4 py-3"><p className="text-xs font-black uppercase text-muted-foreground">{label}</p><p className="mt-1 font-mono text-xs font-bold">{value}</p></div>)}
      </div>
      <div className={`border-t border-border px-5 py-4 text-sm font-black ${pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>decision · {pass ? 'release' : 'blocked'}</div>
    </div>
  );
}
