import { useMemo, useState, type ReactNode } from 'react';
import { Activity, Check, CircleAlert, RotateCcw } from 'lucide-react';
import {
  FlowRow,
  MetricGrid,
  ProbabilityBars,
  SegmentedControl,
} from '../../nlp-shared';

function LabShell({
  lab,
  eyebrow,
  title,
  children,
  footer,
}: {
  lab: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section data-lab={lab} className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background shadow-sm">
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </header>
      <div className="min-w-0 space-y-5 p-4 sm:p-5">{children}</div>
      <footer className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">
        {footer}
      </footer>
    </section>
  );
}

export function TrainingStepLab() {
  const [accumulation, setAccumulation] = useState<'1' | '2' | '4'>('4');
  const [microstep, setMicrostep] = useState<'1' | '2' | '3' | '4'>('3');
  const accumulationCount = Number(accumulation);
  const currentMicrostep = Math.min(Number(microstep), accumulationCount);
  const effectiveSamples = 8 * accumulationCount;
  const shouldUpdate = currentMicrostep === accumulationCount;

  return (
    <LabShell
      lab="training-step"
      eyebrow="Update boundary lab"
      title="Microbatch가 끝난 것과 parameter update가 끝난 것은 다르다"
      footer="AMP scale은 같은 effective batch 안에서 유지한다. unscale·gradient clipping·optimizer step·scale update는 누적이 끝난 update boundary에서 한 번만 실행한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="Gradient accumulation 횟수"
          value={accumulation}
          onChange={setAccumulation}
          options={[
            { value: '1', label: '1회 누적' },
            { value: '2', label: '2회 누적' },
            { value: '4', label: '4회 누적' },
          ]}
        />
        <SegmentedControl
          label="현재 microstep"
          value={String(currentMicrostep) as '1' | '2' | '3' | '4'}
          onChange={setMicrostep}
          options={Array.from({ length: accumulationCount }, (_, index) => ({
            value: String(index + 1) as '1' | '2' | '3' | '4',
            label: `${index + 1}번`,
          }))}
        />
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(4.5rem, 1fr))' }}
      >
        {Array.from({ length: accumulationCount }, (_, index) => {
          const step = index + 1;
          const done = step <= currentMicrostep;
          const boundary = step === accumulationCount;
          return (
            <div
              key={step}
              className={`min-w-0 border-t-2 px-2 py-3 text-center ${
                done ? 'border-blue-600 bg-blue-500/[0.06]' : 'border-border bg-muted/15'
              }`}
            >
              <p className="text-[11px] text-muted-foreground">micro {step}</p>
              <p className="mt-1 whitespace-nowrap text-xs font-bold">{done ? 'backward' : '대기'}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {boundary ? (done ? 'update 가능' : 'update 경계') : 'gradient 누적'}
              </p>
            </div>
          );
        })}
      </div>

      <MetricGrid
        mobileColumns={2}
        items={[
          { label: 'Microbatch', value: '8 sample' },
          { label: 'Effective batch', value: `${effectiveSamples} sample` },
          { label: '누적 손실 가중치', value: `1 / ${accumulationCount}`, note: 'AMP scale과 다른 값' },
          {
            label: 'Parameter update',
            value: shouldUpdate ? '지금 1회' : '아직 0회',
            note: shouldUpdate ? '누적이 닫혔다.' : `${accumulationCount - currentMicrostep} microstep 남음`,
            accent: shouldUpdate,
          },
        ]}
      />
    </LabShell>
  );
}

type SaveDepth = 'weights' | 'runtime' | 'full';
type SaveBoundary = 'micro' | 'update';

export function ResumeContractLab() {
  const [depth, setDepth] = useState<SaveDepth>('runtime');
  const [boundary, setBoundary] = useState<SaveBoundary>('micro');

  const saved = useMemo(() => {
    if (depth === 'weights') return ['model'];
    if (depth === 'runtime') return ['model', 'optimizer', 'scheduler', 'scaler', 'progress'];
    return [
      'model',
      'optimizer',
      'scheduler',
      'scaler',
      'progress',
      'RNG·sampler',
      'early-stop state',
      'manifest',
    ];
  }, [depth]);
  const complete = depth === 'full' && boundary === 'update';

  return (
    <LabShell
      lab="resume-contract"
      eyebrow="Resume contract lab"
      title="Checkpoint는 weight 파일이 아니라 실행 상태의 스냅샷이다"
      footer="Bitwise 재현은 같은 release·hardware에서도 별도 조건이 필요하다. 여기서 말하는 완전한 resume은 적어도 저장한 update boundary와 data order·선택 상태를 논리적으로 이어 가는 계약이다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="저장 깊이"
          value={depth}
          onChange={setDepth}
          options={[
            { value: 'weights', label: '가중치만' },
            { value: 'runtime', label: '실행 상태' },
            { value: 'full', label: '전체 계약' },
          ]}
        />
        <SegmentedControl
          label="저장 경계"
          value={boundary}
          onChange={setBoundary}
          options={[
            { value: 'micro', label: '누적 중간' },
            { value: 'update', label: 'update 직후' },
          ]}
        />
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(7rem, 1fr))' }}
      >
        {[
          'model',
          'optimizer',
          'scheduler',
          'scaler',
          'progress',
          'RNG·sampler',
          'early-stop state',
          'manifest',
        ].map((item) => {
          const present = saved.includes(item);
          return (
            <div
              key={item}
              className={`flex min-w-0 items-start gap-2 rounded border px-3 py-2 text-xs ${
                present ? 'border-emerald-600/25 bg-emerald-500/[0.05]' : 'border-border bg-muted/10 text-muted-foreground'
              }`}
            >
              {present
                ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-300" />
                : <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
              <span className="min-w-0 break-words font-medium">{item}</span>
            </div>
          );
        })}
      </div>

      <div className={`flex items-start gap-3 border-y py-4 ${complete ? 'border-emerald-600/30' : 'border-amber-600/30'}`}>
        {complete
          ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
          : <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />}
        <div>
          <p className="text-sm font-bold">{complete ? '논리적으로 같은 run을 재개할 준비 완료' : '재개하면 다른 run이 될 수 있음'}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {boundary === 'micro'
              ? '누적 중간 저장은 scaled gradient와 microstep 위치까지 별도로 다루지 않으면 repeat 또는 double update가 생긴다.'
              : depth === 'full'
                ? '다음 optimizer update와 다음 sample 위치를 명시적으로 복원할 수 있다.'
                : 'Update 경계는 안전하지만 누락된 runtime state가 trajectory를 바꾼다.'}
          </p>
        </div>
      </div>
    </LabShell>
  );
}

type ProbeResult = 'enough' | 'gap';
type DomainDistance = 'near' | 'far';
type LabelBudget = 'small' | 'large';

export function TransferGateLab() {
  const [probe, setProbe] = useState<ProbeResult>('gap');
  const [domain, setDomain] = useState<DomainDistance>('near');
  const [labels, setLabels] = useState<LabelBudget>('small');

  const decision = useMemo(() => {
    if (probe === 'enough') {
      return {
        candidate: 'Linear probe 유지',
        reason: '고정 representation이 target signal을 이미 분리한다.',
        next: 'Full tune보다 calibration·serving evidence를 먼저 닫는다.',
      };
    }
    if (domain === 'far' && labels === 'small') {
      return {
        candidate: 'Domain-adaptive pretraining 후보',
        reason: '표현 간극은 크지만 supervised label만으로 전체 weight를 바꾸기 어렵다.',
        next: 'Unlabeled in-domain corpus 품질과 continued-pretraining forgetting을 비교한다.',
      };
    }
    if (labels === 'large') {
      return {
        candidate: 'Partial → full tune 비교',
        reason: 'Probe가 부족하고 supervised evidence가 충분하다.',
        next: '점진적 unfreeze와 full tune을 같은 update budget에서 비교한다.',
      };
    }
    return {
      candidate: '상위 block 일부 unfreeze',
      reason: 'Representation은 가깝지만 target-specific 조정이 더 필요하다.',
      next: 'Probe 대비 gain과 seed 분산이 확인될 때만 더 아래 layer를 연다.',
    };
  }, [domain, labels, probe]);

  return (
    <LabShell
      lab="transfer-gate"
      eyebrow="Adaptation gate lab"
      title="Sample 수 표 대신 가장 작은 충분한 개입을 찾는다"
      footer="이 lab은 보편 정답표가 아니라 첫 비교 후보를 좁히는 engineering synthesis다. 최종 선택은 같은 split·seed·update budget에서 scratch와 probe를 포함해 검증한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="Linear probe 결과"
          value={probe}
          onChange={setProbe}
          options={[
            { value: 'enough', label: '목표 충족' },
            { value: 'gap', label: '성능 간극' },
          ]}
        />
        <SegmentedControl
          label="Source와 target domain 거리"
          value={domain}
          onChange={setDomain}
          options={[
            { value: 'near', label: '가까움' },
            { value: 'far', label: '멀음' },
          ]}
        />
        <SegmentedControl
          label="Supervised label 예산"
          value={labels}
          onChange={setLabels}
          options={[
            { value: 'small', label: '적음' },
            { value: 'large', label: '충분' },
          ]}
        />
      </div>

      <div className="grid gap-3 border-y border-border py-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">첫 승격 후보</p>
          <p className="mt-1 text-base font-bold leading-snug">{decision.candidate}</p>
        </div>
        <div className="min-w-0 space-y-2 text-sm leading-relaxed">
          <p><strong>왜:</strong> {decision.reason}</p>
          <p className="text-muted-foreground"><strong>다음 증거:</strong> {decision.next}</p>
        </div>
      </div>
    </LabShell>
  );
}

type Horizon = 'fixed' | 'metric' | 'branch';

export function UpdateClockLab() {
  const [horizon, setHorizon] = useState<Horizon>('fixed');
  const [accumulation, setAccumulation] = useState<'1' | '8'>('8');
  const updates = Math.floor(8000 / Number(accumulation));

  const policy = {
    fixed: {
      name: 'Warmup + cosine 후보',
      clock: 'optimizer update',
      call: 'optimizer.step() 뒤 scheduler.step()',
      why: '종료 update 수가 먼저 정해져 있어 전체 곡선을 정의할 수 있다.',
    },
    metric: {
      name: 'ReduceLROnPlateau 후보',
      clock: 'validation event',
      call: 'validate() 뒤 scheduler.step(val_metric)',
      why: '종료 horizon보다 관측된 정체가 update 축소 신호다.',
    },
    branch: {
      name: 'WSD 후보',
      clock: 'optimizer update + branch point',
      call: 'stable trunk에서 decay branch를 별도 checkpoint로 연다.',
      why: 'Pretraining 종료 예산이 바뀔 수 있어 reusable stable trunk가 필요하다.',
    },
  }[horizon];

  return (
    <LabShell
      lab="update-clock"
      eyebrow="Schedule clock lab"
      title="Epoch 이름보다 실제 optimizer update 수를 센다"
      footer="8,000 microbatch를 보더라도 8회 accumulation이면 update는 1,000회다. Scheduler의 total steps와 resume counter는 microbatch가 아니라 실제 update boundary에 맞춰야 한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="학습 horizon"
          value={horizon}
          onChange={setHorizon}
          options={[
            { value: 'fixed', label: '예산 고정' },
            { value: 'metric', label: '정체 기반' },
            { value: 'branch', label: '예산 가변' },
          ]}
        />
        <SegmentedControl
          label="Gradient accumulation"
          value={accumulation}
          onChange={setAccumulation}
          options={[
            { value: '1', label: '1회' },
            { value: '8', label: '8회' },
          ]}
        />
      </div>

      <MetricGrid
        mobileColumns={2}
        items={[
          { label: '읽은 microbatch', value: '8,000' },
          { label: '실제 update', value: updates.toLocaleString('ko-KR'), accent: true },
          { label: '선택 후보', value: policy.name },
          { label: 'Clock', value: policy.clock },
        ]}
      />

      <FlowRow
        activeIndex={horizon === 'metric' ? 3 : 2}
        items={[
          { label: 'Microbatch', value: 'forward · backward', note: 'gradient를 만든다.', tone: 'teal' },
          { label: 'Effective batch', value: `${accumulation}회 누적`, note: '아직 schedule을 넘기지 않는다.', tone: 'blue' },
          { label: 'Optimizer', value: 'parameter update', note: '일반 scheduler의 clock.', tone: 'violet' },
          { label: 'Validation', value: horizon === 'metric' ? 'metric 전달' : 'evidence 기록', note: policy.call, tone: 'amber' },
        ]}
      />
      <p className="text-sm leading-relaxed text-muted-foreground">{policy.why}</p>
    </LabShell>
  );
}

type FailureMode = 'overfit' | 'underfit' | 'calibration' | 'shift';

export function GeneralizationGateLab() {
  const [failure, setFailure] = useState<FailureMode>('overfit');
  const diagnosis = {
    overfit: {
      evidence: [
        { label: 'Train loss', value: 0.18 },
        { label: 'Val loss', value: 0.52 },
        { label: 'Rare slice', value: 0.68 },
      ],
      decision: '먼저 data·split과 capacity를 재검사',
      intervention: '그 뒤 weight decay, dropout, augmentation 또는 earlier checkpoint를 한 축씩 비교',
    },
    underfit: {
      evidence: [
        { label: 'Train loss', value: 0.71 },
        { label: 'Val loss', value: 0.76 },
        { label: 'Rare slice', value: 0.82 },
      ],
      decision: '정규화를 더 넣지 않는다',
      intervention: 'Optimization, feature signal, model capacity와 label 품질을 먼저 확인',
    },
    calibration: {
      evidence: [
        { label: 'Train loss', value: 0.22 },
        { label: 'Val loss', value: 0.31 },
        { label: 'Calibration', value: 0.64 },
      ],
      decision: 'Ranking gain과 확률 품질을 분리',
      intervention: 'Label smoothing은 후보일 뿐이다. 별도 calibration split에서 temperature scaling도 비교',
    },
    shift: {
      evidence: [
        { label: 'IID val', value: 0.28 },
        { label: 'Future slice', value: 0.67 },
        { label: 'New entity', value: 0.73 },
      ],
      decision: 'Parameter penalty로 shift를 가리지 않는다',
      intervention: 'Split, collection policy, domain adaptation과 fallback을 먼저 재설계',
    },
  }[failure];

  return (
    <LabShell
      lab="generalization-gate"
      eyebrow="Generalization evidence lab"
      title="기법 목록이 아니라 실패 모드에서 개입을 고른다"
      footer="Validation으로 intervention과 checkpoint를 고른 뒤 같은 validation을 최종 성능처럼 보고하지 않는다. 모든 결정을 닫은 후 untouched test 또는 별도 outer evaluation으로 한 번 확인한다."
    >
      <SegmentedControl
        label="관측된 실패"
        value={failure}
        onChange={setFailure}
        options={[
          { value: 'overfit', label: 'Train–Val gap' },
          { value: 'underfit', label: '둘 다 높음' },
          { value: 'calibration', label: '확률 과신' },
          { value: 'shift', label: '미래·신규 실패' },
        ]}
      />
      <ProbabilityBars
        label="선택한 실패 모드의 비교 지표"
        scaleMax={1}
        items={diagnosis.evidence.map((item, index) => ({
          ...item,
          color: ['#2563eb', '#7c3aed', '#d97706'][index],
        }))}
        formatValue={(value) => value.toFixed(2)}
      />
      <div className="grid gap-3 border-y border-border py-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <p className="flex items-start gap-2 text-sm font-bold leading-relaxed">
          <Activity className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          {diagnosis.decision}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{diagnosis.intervention}</p>
      </div>
    </LabShell>
  );
}
