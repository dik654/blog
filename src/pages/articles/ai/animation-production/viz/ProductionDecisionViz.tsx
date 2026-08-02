import type { LucideIcon } from 'lucide-react';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import {
  AlertTriangle,
  Captions,
  Check,
  Clapperboard,
  Database,
  FileCheck,
  Gauge,
  Lock,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
  Timer,
} from 'lucide-react';

type Tone = 'cyan' | 'emerald' | 'coral' | 'violet' | 'amber' | 'neutral';

const tones: Record<Tone, string> = {
  cyan: 'border-cyan-500/35 bg-cyan-500/[0.07] text-cyan-800 dark:text-cyan-200',
  emerald: 'border-emerald-500/35 bg-emerald-500/[0.07] text-emerald-800 dark:text-emerald-200',
  coral: 'border-rose-500/35 bg-rose-500/[0.07] text-rose-800 dark:text-rose-200',
  violet: 'border-violet-500/35 bg-violet-500/[0.07] text-violet-800 dark:text-violet-200',
  amber: 'border-amber-500/35 bg-amber-500/[0.07] text-amber-800 dark:text-amber-200',
  neutral: 'border-border bg-muted/20 text-foreground',
};

function DecisionViz({
  steps,
  children,
}: {
  steps: StepDef[];
  children: (step: number) => React.ReactNode;
}) {
  return (
    <div
      className="not-prose min-w-0 [&_.step-viz]:my-8 [&_.step-viz__stage]:min-h-[250px] sm:[&_.step-viz__stage]:min-h-[310px]"
      data-animation-viz
    >
      <StepViz steps={steps}>{children}</StepViz>
    </div>
  );
}

function Stage({
  icon: Icon,
  number,
  title,
  detail,
  tone,
}: {
  icon: LucideIcon;
  number: string;
  title: string;
  detail: string;
  tone: Tone;
}) {
  return (
    <div className={`min-w-0 border-l-2 px-3 py-3 ${tones[tone]}`}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] font-bold text-muted-foreground">{number}</span>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <strong className="min-w-0 text-sm leading-tight">{title}</strong>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

export function ProductionContractViz() {
  const steps: StepDef[] = [
    { label: '성공 계약을 먼저 적는다', body: 'Shot 목적, 바뀌면 안 되는 것과 바꿔도 되는 것을 분리한다.' },
    { label: '같은 조건에서 base failure를 잰다', body: 'Prompt·seed·runtime을 고정해 최초 실패 frame을 찾는다.' },
    { label: '실패를 가르칠 근거 데이터만 남긴다', body: 'Clip의 provenance와 시간 좌표를 함께 보존한다.' },
    { label: '관측과 연출 의도를 조건으로 나눈다', body: '화면 사실, camera, audio와 production intent를 섞지 않는다.' },
    { label: '설명 가능한 최소 개입을 고른다', body: 'Prompt에서 시작해 필요한 경우에만 control·LoRA·full tune으로 올라간다.' },
    { label: '시간 표현을 별도 finishing 단계로 검사한다', body: 'Native cadence를 보존하고 VFI·blur·encode가 만든 변화를 분리한다.' },
    { label: '품질·runtime·권리 증거로 release를 닫는다', body: '평균 점수보다 hard gate와 되돌릴 artifact를 함께 본다.' },
  ];
  const stages = [
    { icon: Clapperboard, number: '01', title: '성공 계약', detail: 'shot 목적, 보존할 identity·timing, 바꿔도 되는 style을 적는다.', tone: 'cyan' as Tone },
    { icon: ScanSearch, number: '02', title: 'Base 측정', detail: '같은 prompt·seed·runtime으로 earliest failure를 기록한다.', tone: 'neutral' as Tone },
    { icon: Database, number: '03', title: '근거 데이터', detail: '실패를 실제로 가르칠 clip과 provenance만 남긴다.', tone: 'emerald' as Tone },
    { icon: Captions, number: '04', title: '조건 신호', detail: '보이는 사실, 연출 의도, audio를 서로 다른 필드로 만든다.', tone: 'violet' as Tone },
    { icon: SlidersHorizontal, number: '05', title: '최소 개입', detail: 'Prompt → control → LoRA → full 순으로 필요한 만큼만 바꾼다.', tone: 'amber' as Tone },
    { icon: Timer, number: '06', title: '시간 표현', detail: 'Native cadence와 VFI·blur·encode의 책임 경계를 나눈다.', tone: 'cyan' as Tone },
    { icon: FileCheck, number: '07', title: 'Release 증거', detail: '품질 hard gate, runtime, license와 rollback artifact를 함께 묶는다.', tone: 'coral' as Tone },
  ];
  return (
    <DecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage, index) => (
            <div
              key={stage.number}
              className={`transition-all duration-300 ${
                index === step
                  ? 'opacity-100 ring-1 ring-inset ring-current/25'
                  : index < step
                    ? 'opacity-85'
                    : 'opacity-70'
              }`}
            >
              <Stage {...stage} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <div className="bg-background px-3 py-3 text-xs"><strong className="block text-foreground">바꾸려는 것</strong><span className="mt-1 block text-muted-foreground">예: 손 동작과 line stability</span></div>
          <div className="bg-background px-3 py-3 text-xs"><strong className="block text-foreground">보존할 것</strong><span className="mt-1 block text-muted-foreground">캐릭터 identity와 impact timing</span></div>
          <div className="bg-background px-3 py-3 text-xs"><strong className="block text-foreground">제약</strong><span className="mt-1 block text-muted-foreground">GPU budget, shot 길이, 사용 가능 source</span></div>
        </div>
      </div>}
    </DecisionViz>
  );
}

const frameCells = [
  { id: '01', label: '준비', tone: 'neutral' as Tone },
  { id: '02', label: 'hold', tone: 'neutral' as Tone },
  { id: '03', label: 'anticipation', tone: 'cyan' as Tone },
  { id: '04', label: 'smear', tone: 'amber' as Tone },
  { id: '05', label: 'impact', tone: 'coral' as Tone },
  { id: '06', label: 'settle', tone: 'emerald' as Tone },
];

export function ClipContractViz() {
  const steps: StepDef[] = frameCells.map((frame) => ({
    label: `${frame.label} frame을 보존한다`,
    body: frame.label === 'hold'
      ? '같은 drawing을 유지하는 의도된 시간인지 확인한다.'
      : frame.label === 'smear'
        ? '빠른 이동을 읽히게 하는 과장 drawing을 중복·blur로 버리지 않는다.'
        : frame.label === 'impact'
          ? '동작의 힘이 모이는 한 frame을 clip 경계 밖으로 자르지 않는다.'
          : '앞뒤 motion beat와 함께 하나의 shot 단위로 기록한다.',
  }));
  return (
    <DecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {frameCells.map((frame, index) => (
            <div key={frame.id} className={`min-w-0 border px-2 py-3 text-center transition-all duration-300 ${tones[frame.tone]} ${index === step ? 'scale-[1.02] opacity-100 ring-2 ring-current/25' : index < step ? 'opacity-75' : 'opacity-55'}`}>
              <span className="font-mono text-[10px] text-muted-foreground">F{frame.id}</span>
              <div className="mx-auto my-3 h-8 w-8 border border-current/35 bg-current/10 [clip-path:polygon(50%_0,100%_100%,62%_76%,50%_100%,38%_76%,0_100%)]" aria-hidden="true" />
              <strong className="block text-xs [overflow-wrap:anywhere]">{frame.label}</strong>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <div><span className="font-mono text-[10px] font-bold text-muted-foreground">GROUP</span><p className="mt-1 text-sm font-semibold">source · character · shot</p></div>
          <div><span className="font-mono text-[10px] font-bold text-muted-foreground">TIME</span><p className="mt-1 text-sm font-semibold">source FPS · display FPS · frame count</p></div>
          <div><span className="font-mono text-[10px] font-bold text-muted-foreground">RIGHTS</span><p className="mt-1 text-sm font-semibold">origin · license · consent · transform</p></div>
        </div>
      </div>}
    </DecisionViz>
  );
}

export function CaptionContractViz() {
  const rows = [
    ['관측 사실', '캐릭터가 왼쪽에서 오른쪽으로 도약한다', 'cyan'],
    ['연출 의도', 'anticipation 뒤 1-frame impact를 강조한다', 'violet'],
    ['카메라', 'camera는 고정, 배경 parallax만 이동한다', 'emerald'],
    ['오디오', '대사 없음 · 착지 순간 짧은 impact sound', 'amber'],
    ['검수 상태', 'camera/object 혼동 수정 · 고유명사 확인', 'coral'],
  ] as const;
  const steps: StepDef[] = rows.map(([label, value]) => ({
    label: `${label}을(를) 독립 field로 확인한다`,
    body: value,
  }));
  return (
    <DecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="overflow-hidden border border-border">
          {rows.map(([label, value, tone], index) => (
            <div key={label} className={`grid min-w-0 border-b border-border transition-opacity duration-300 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] ${index === step ? 'opacity-100' : index < step ? 'opacity-75' : 'opacity-55'}`}>
              <div className={`border-b px-3 py-3 text-xs font-bold sm:border-b-0 sm:border-r ${tones[tone]}`}>{label}</div>
              <div className="min-w-0 bg-background px-3 py-3 text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">{value}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />VLM·ASR 출력은 초안이다. 학습 전에 source timecode와 대조한 review state가 필요하다.</p>
      </div>}
    </DecisionViz>
  );
}

export function AdaptationDecisionViz() {
  const lanes = [
    ['Prompt', '설명과 sampling만 변경', '가장 싸지만 weight와 control path는 그대로', 'cyan'],
    ['Control signal', 'pose·edge·depth·trajectory를 condition으로 공급', 'reference와 target의 시간 정렬이 필요', 'violet'],
    ['LoRA', '일부 선형층의 변화량을 학습', 'target 능력과 base retention을 함께 검사', 'amber'],
    ['Full tune', '광범위한 weight와 prior를 갱신', '데이터·compute·회귀·rollback 부담이 가장 큼', 'coral'],
  ] as const;
  const steps: StepDef[] = lanes.map(([name, action, boundary]) => ({
    label: `${name}으로 해결되는지 먼저 확인한다`,
    body: `${action}. ${boundary}.`,
  }));
  return (
    <DecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="space-y-2">
          {lanes.map(([name, action, boundary, tone], index) => (
            <div key={name} className={`grid min-w-0 border border-border transition-opacity duration-300 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)] ${index === step ? 'opacity-100' : index < step ? 'opacity-75' : 'opacity-55'}`}>
              <div className={`flex items-center justify-center border-b py-2 font-mono text-xs font-bold sm:border-b-0 sm:border-r sm:py-0 ${tones[tone]}`}>{index + 1}</div>
              <div className="border-b bg-muted/15 px-3 py-3 text-sm font-bold sm:border-b-0 sm:border-r">{name}</div>
              <div className="min-w-0 px-3 py-3"><p className="text-sm text-foreground">{action}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{boundary}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>개입이 커질수록 target score만 보지 말고 base capability retention과 되돌릴 artifact를 더 엄격히 남긴다.</span></div>
      </div>}
    </DecisionViz>
  );
}

export function CadenceDecisionViz() {
  const beats = [
    ['0', 'A', 'key'], ['1', 'A', 'hold'], ['2', 'B', 'key'], ['3', 'S', 'smear'],
    ['4', 'C', 'impact'], ['5', 'C', 'hold'], ['6', 'D', 'key'], ['7', 'D', 'hold'],
  ] as const;
  const steps: StepDef[] = [
    { label: '원본 cadence를 먼저 읽는다', body: '같은 drawing을 유지한 hold와 새 drawing을 구분한다.' },
    { label: 'smear와 impact를 보호한다', body: '중간 상태가 아니라 의도된 과장과 힘의 정점일 수 있다.' },
    { label: 'VFI가 만든 frame을 별도 variant로 본다', body: '표시 frame 수가 늘어도 연출 의도가 유지되는지 검사한다.' },
    { label: 'blur와 delivery encode까지 owner를 추적한다', body: '최초로 timing이 깨진 stage만 다음 실험에서 바꾼다.' },
  ];
  return (
    <DecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
        {beats.map(([time, drawing, kind], index) => {
          const tone: Tone = kind === 'smear' ? 'amber' : kind === 'impact' ? 'coral' : kind === 'hold' ? 'neutral' : 'cyan';
          const emphasized = step === 0 || (step === 1 && (kind === 'smear' || kind === 'impact')) || step >= 2;
          return (
            <div key={time} className={`min-w-0 border px-2 py-3 text-center transition-all duration-300 ${tones[tone]} ${emphasized ? 'opacity-100' : 'opacity-55'} ${step === 0 && index === 0 ? 'ring-2 ring-current/25' : ''}`}>
              <span className="font-mono text-[10px] text-muted-foreground">t{time}</span>
              <strong className="my-2 block text-lg">{drawing}</strong>
              <span className="block text-[10px] font-semibold [overflow-wrap:anywhere]">{kind}</span>
            </div>
          );
        })}
        </div>
        <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <div className={`bg-background px-3 py-3 transition-opacity ${step <= 1 ? 'opacity-100' : 'opacity-60'}`}><Timer className="h-4 w-4 text-cyan-700 dark:text-cyan-300" /><strong className="mt-2 block text-sm">Native cadence</strong><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Model이 낸 frame과 timestamp를 보존한다.</p></div>
          <div className={`bg-background px-3 py-3 transition-opacity ${step === 2 ? 'opacity-100' : 'opacity-60'}`}><Sparkles className="h-4 w-4 text-violet-700 dark:text-violet-300" /><strong className="mt-2 block text-sm">VFI</strong><p className="mt-1 text-xs leading-relaxed text-muted-foreground">없는 중간 frame을 추정한다. 연출 의도까지 아는 것은 아니다.</p></div>
          <div className={`bg-background px-3 py-3 transition-opacity ${step === 3 ? 'opacity-100' : 'opacity-60'}`}><Gauge className="h-4 w-4 text-amber-700 dark:text-amber-300" /><strong className="mt-2 block text-sm">Shutter blur</strong><p className="mt-1 text-xs leading-relaxed text-muted-foreground">한 exposure 구간의 움직임을 누적해 표현한다.</p></div>
        </div>
      </div>}
    </DecisionViz>
  );
}

export function ReleaseGateViz() {
  const gates = [
    ['Identity', '얼굴·의상·소품 drift 없음', true],
    ['Motion', '의도한 anticipation·impact가 읽힘', true],
    ['Line', 'outline 떨림과 color leak 허용 범위', true],
    ['Runtime', 'peak VRAM·latency·revision 재현', true],
    ['Rights', '모든 source·weight·output 사용 조건 확인', false],
  ] as const;
  const steps: StepDef[] = gates.map(([name, detail, pass]) => ({
    label: `${name} gate를 검사한다`,
    body: `${detail}. ${pass ? '이 예시에서는 통과한다.' : '이 예시에서는 미확인이라 release를 중단한다.'}`,
  }));
  return (
    <DecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="overflow-hidden border border-border">
          {gates.map(([name, detail, pass], index) => {
            const checked = index <= step;
            return (
              <div key={name} className={`grid min-w-0 grid-cols-[2.3rem_minmax(0,1fr)] border-b border-border transition-opacity duration-300 last:border-b-0 sm:grid-cols-[2.3rem_7rem_minmax(0,1fr)] ${index === step ? 'opacity-100' : checked ? 'opacity-75' : 'opacity-55'}`}>
                <div className={`flex items-center justify-center border-r ${checked ? (pass ? tones.emerald : tones.coral) : tones.neutral}`}>
                  {checked ? (pass ? <Check className="h-4 w-4" aria-label="통과" /> : <AlertTriangle className="h-4 w-4" aria-label="중단" />) : <span className="font-mono text-[10px]" aria-label="대기">··</span>}
                </div>
                <strong className="border-b px-3 py-3 text-sm sm:border-b-0 sm:border-r">{name}</strong>
                <span className="col-start-2 min-w-0 px-3 pb-3 text-xs leading-relaxed text-muted-foreground sm:col-start-3 sm:py-3">{detail}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {step < gates.length - 1
            ? '아직 모든 hard gate를 확인하지 않았으므로 release를 결정하지 않는다.'
            : <>Quality가 좋아도 rights gate가 닫혀 있으므로 release 상태는 <strong className="text-foreground">중단</strong>이다.</>}
        </p>
      </div>}
    </DecisionViz>
  );
}
