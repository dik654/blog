import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Ban,
  Box,
  Camera,
  Check,
  CircleGauge,
  Cpu,
  Database,
  GitBranch,
  LocateFixed,
  MessageSquareMore,
  Radio,
  RefreshCw,
  Route,
  ShieldCheck,
  TriangleAlert,
  Waves,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Tone = 'blue' | 'violet' | 'amber' | 'teal' | 'rose' | 'slate';

const toneClass: Record<Tone, {
  border: string;
  background: string;
  text: string;
  icon: string;
}> = {
  blue: {
    border: 'border-blue-500/35',
    background: 'bg-blue-500/[0.07]',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'text-blue-600 dark:text-blue-300',
  },
  violet: {
    border: 'border-violet-500/35',
    background: 'bg-violet-500/[0.07]',
    text: 'text-violet-800 dark:text-violet-200',
    icon: 'text-violet-600 dark:text-violet-300',
  },
  amber: {
    border: 'border-amber-500/40',
    background: 'bg-amber-500/[0.08]',
    text: 'text-amber-900 dark:text-amber-200',
    icon: 'text-amber-700 dark:text-amber-300',
  },
  teal: {
    border: 'border-teal-500/35',
    background: 'bg-teal-500/[0.07]',
    text: 'text-teal-800 dark:text-teal-200',
    icon: 'text-teal-700 dark:text-teal-300',
  },
  rose: {
    border: 'border-rose-500/35',
    background: 'bg-rose-500/[0.07]',
    text: 'text-rose-800 dark:text-rose-200',
    icon: 'text-rose-700 dark:text-rose-300',
  },
  slate: {
    border: 'border-border',
    background: 'bg-muted/30',
    text: 'text-foreground',
    icon: 'text-muted-foreground',
  },
};

function ToolHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-border bg-muted/15 px-4 py-4 sm:px-5">
      <p className="text-[11px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
      <h3 className="mt-1 text-base font-bold sm:text-lg">{title}</h3>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

function Metric({
  label,
  value,
  tone = 'slate',
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  const style = toneClass[tone];
  return (
    <div className={`min-w-0 border-l-2 px-3 py-1.5 ${style.border}`}>
      <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 break-words text-sm font-semibold leading-snug [overflow-wrap:anywhere] ${style.text}`}>
        {value}
      </p>
    </div>
  );
}

type ExecutionStage = {
  id: string;
  label: string;
  short: string;
  input: string;
  output: string;
  owner: string;
  cadence: string;
  evidence: string;
  failure: string;
  icon: LucideIcon;
  tone: Tone;
};

const executionStages: ExecutionStage[] = [
  {
    id: 'goal',
    label: 'Task goal',
    short: '무엇을 할까',
    input: '사용자 명령 · mission state',
    output: '검증 가능한 task goal',
    owner: 'Task planner',
    cadence: '사건 중심 · 느린 층',
    evidence: '대상·목적지·종료 조건이 명시됨',
    failure: '“정리해”처럼 성공 조건이 모호함',
    icon: MessageSquareMore,
    tone: 'violet',
  },
  {
    id: 'observation',
    label: 'Observation',
    short: '무엇을 봤나',
    input: 'camera · depth · encoder · timestamp',
    output: '시간이 붙은 sensor packet',
    owner: 'Sensor driver',
    cadence: 'sensor마다 반복',
    evidence: 'frame id · timestamp · drop/age',
    failure: '가림·noise·오래된 sample',
    icon: Camera,
    tone: 'blue',
  },
  {
    id: 'estimate',
    label: 'State estimate',
    short: '어디에 있나',
    input: 'observation · calibration · TF history',
    output: 'base/map frame의 object·robot state',
    owner: 'Perception · localization',
    cadence: 'observation 도착마다',
    evidence: 'confidence · covariance · transform age',
    failure: '맞는 pixel을 과거 pose에 투영',
    icon: LocateFixed,
    tone: 'teal',
  },
  {
    id: 'policy',
    label: 'Policy / plan',
    short: '어떻게 갈까',
    input: 'state estimate · goal · scene constraints',
    output: 'pose·path·action chunk 후보',
    owner: 'VLA · planner',
    cadence: '계획 갱신 시점',
    evidence: 'goal validity · collision-free candidate',
    failure: 'reachable하지 않거나 위험한 action',
    icon: GitBranch,
    tone: 'violet',
  },
  {
    id: 'trajectory',
    label: 'Trajectory',
    short: '언제 어디로',
    input: 'geometric path · dynamic limits',
    output: '시간이 붙은 q(t), velocity, acceleration',
    owner: 'Trajectory generator',
    cadence: '실행 전·재계획 시',
    evidence: 'limit · collision · continuity check',
    failure: 'path는 안전하지만 너무 빠르거나 불연속',
    icon: Route,
    tone: 'amber',
  },
  {
    id: 'control',
    label: 'Feedback control',
    short: '오차를 줄인다',
    input: 'reference · measured state',
    output: 'position·velocity·effort command',
    owner: 'Controller',
    cadence: '빠른 주기',
    evidence: 'tracking error · tolerance · saturation',
    failure: 'contact·slip·delay로 오차가 커짐',
    icon: CircleGauge,
    tone: 'teal',
  },
  {
    id: 'drive',
    label: 'Drive / plant',
    short: '힘을 만든다',
    input: 'actuator command · current feedback',
    output: 'torque·force·physical motion',
    owner: 'Embedded · motor drive · mechanics',
    cadence: '가장 빠른 실행 층',
    evidence: 'deadline · current · temperature · encoder',
    failure: 'jitter·overcurrent·backlash·thermal limit',
    icon: Zap,
    tone: 'slate',
  },
  {
    id: 'effect',
    label: 'Measured effect',
    short: '정말 됐나',
    input: '새 observation · contact · task state',
    output: 'success·retry·stop 판단',
    owner: 'Supervisor · evaluator',
    cadence: '매 loop와 task milestone',
    evidence: 'object pose · contact · task success',
    failure: '명령 성공과 실제 성공을 혼동',
    icon: ShieldCheck,
    tone: 'blue',
  },
];

export function ExecutionBoundaryLab() {
  const [selected, setSelected] = useState(0);
  const [staleTf, setStaleTf] = useState(false);
  const stage = executionStages[selected];
  const blockedAt = staleTf ? 2 : -1;
  const invalidated = staleTf && selected >= blockedAt;
  const invalidatedCount = staleTf ? executionStages.length - blockedAt : 0;
  const compactBoundaryLabel: Record<string, string> = {
    goal: '목표',
    observation: '관측',
    estimate: '상태 추정',
    policy: '계획',
    trajectory: '궤적',
    control: '피드백 제어',
    drive: '구동',
    effect: '효과 측정',
  };
  const followingStage = executionStages[selected + 1];
  const nextBoundary = staleTf && selected >= blockedAt
    ? '새 state 전까지 전달 금지'
    : followingStage
      ? compactBoundaryLabel[followingStage.id]
      : '효과 측정에서 종료';
  const StageIcon = stage.icon;

  return (
    <div
      data-robot-execution-lab
      data-stage={stage.id}
      data-scenario={staleTf ? 'stale-tf' : 'nominal'}
      data-chain-decision={staleTf ? 're-estimate' : 'execute'}
      data-invalidated-count={invalidatedCount}
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <ToolHeader
        eyebrow="Execution contract"
        title="한 명령이 물리 효과가 되기까지"
        description="단계를 누르면 그 경계의 입력·출력·담당자·증거가 바뀝니다. stale TF를 주입하면 어느 지점부터 뒤 출력이 무효가 되는지 확인할 수 있습니다."
      />

      <div className="border-b border-border px-4 py-3 sm:px-5">
        <button
          type="button"
          role="switch"
          aria-checked={staleTf}
          onClick={() => setStaleTf((value) => !value)}
          className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-md border px-3 text-left text-sm transition-colors sm:w-auto ${
            staleTf
              ? 'border-amber-500/45 bg-amber-500/[0.08] text-amber-900 dark:text-amber-200'
              : 'border-border bg-muted/20 hover:bg-muted/40'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {staleTf
              ? <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
              : <RefreshCw className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
            <span className="break-words">TF age 180 ms · 예제 limit 50 ms</span>
          </span>
          <span className="shrink-0 font-mono text-xs">{staleTf ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 py-4 sm:grid-cols-4 sm:px-5">
        {executionStages.map((item, index) => {
          const Icon = item.icon;
          const isSelected = index === selected;
          const isBlocked = staleTf && index >= blockedAt;
          const style = toneClass[item.tone];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={isSelected}
              className={`relative flex min-h-[5.5rem] min-w-0 flex-col justify-between rounded-md border p-3 text-left transition-colors ${
                isSelected
                  ? `${style.border} ${style.background}`
                  : 'border-border bg-background hover:bg-muted/25'
              }`}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {isBlocked
                  ? <Ban className="h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-300" aria-label="이 출력은 재사용할 수 없음" />
                  : <Icon className={`h-4 w-4 shrink-0 ${style.icon}`} aria-hidden="true" />}
              </span>
              <span className="mt-3 min-w-0">
                <span className="block break-words text-xs font-bold leading-snug [overflow-wrap:anywhere]">{item.label}</span>
                <span className="mt-1 block text-[10px] leading-snug text-muted-foreground">{item.short}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-px border-t border-border bg-border lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className={`min-w-0 bg-background p-5 ${invalidated ? 'bg-rose-500/[0.035]' : ''}`}>
          <div className="flex items-start gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md border ${toneClass[stage.tone].border} ${toneClass[stage.tone].background}`}>
              <StageIcon className={`h-5 w-5 ${toneClass[stage.tone].icon}`} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">선택한 경계</p>
              <p className="mt-1 break-words text-lg font-bold">{stage.label}</p>
              <p className={`mt-2 text-sm font-semibold ${invalidated ? 'text-amber-800 dark:text-amber-200' : 'text-teal-700 dark:text-teal-300'}`}>
                {invalidated ? '재계산 전까지 downstream 출력 금지' : '증거가 유효하면 다음 경계로 전달'}
              </p>
            </div>
          </div>
          {staleTf && (
            <p className="mt-4 border-l-2 border-amber-500 pl-3 text-sm leading-relaxed text-muted-foreground">
              Detection 자체는 맞아도 과거 camera pose로 만든 object state가 틀릴 수 있습니다.
              State estimate 이후의 pose, path, trajectory는 같은 오염을 물려받으므로 새 transform과 observation으로 다시 계산합니다.
            </p>
          )}
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <Metric label="Chain 위치" value={`${selected + 1} / ${executionStages.length}`} tone={stage.tone} />
            <Metric label="다음 경계" value={nextBoundary} />
            <Metric
              label={staleTf ? '무효가 된 경계' : '남은 경계'}
              value={staleTf ? `State 이후 ${invalidatedCount}개` : `${executionStages.length - selected - 1}개`}
              tone={staleTf ? 'amber' : 'teal'}
            />
          </div>
        </div>

        <div className="grid min-w-0 gap-4 bg-background p-5 sm:grid-cols-2">
          <Metric label="입력" value={stage.input} tone={stage.tone} />
          <Metric label="출력" value={stage.output} tone={stage.tone} />
          <Metric label="주요 담당" value={stage.owner} />
          <Metric label="상대 주기" value={stage.cadence} />
          <Metric label="통과 증거" value={stage.evidence} tone="teal" />
          <Metric label="대표 실패" value={stage.failure} tone="rose" />
        </div>
      </div>
    </div>
  );
}

type FeedbackScenario = {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: Tone;
  reference: string;
  estimate: string;
  error: string;
  disturbance: string;
  boundary: string;
  owner: string;
  cadence: string;
  detector: string;
  response: string;
  decision: 'continue' | 're-estimate' | 'slow-stop' | 'hold';
};

const feedbackScenarios: FeedbackScenario[] = [
  {
    id: 'nominal',
    label: '정상 추종',
    icon: Check,
    tone: 'teal',
    reference: '0.42 rad',
    estimate: '0.40 rad',
    error: '+0.02 rad',
    disturbance: '작은 마찰 오차',
    boundary: 'Feedback control',
    owner: 'Controller',
    cadence: '빠른 control tick',
    detector: 'tracking error',
    response: '제약 안에서 command를 갱신하며 계속',
    decision: 'continue',
  },
  {
    id: 'stale',
    label: '오래된 상태',
    icon: Radio,
    tone: 'amber',
    reference: '0.42 rad',
    estimate: '0.31 rad · age 180 ms > limit 50 ms',
    error: '계산값 신뢰 불가',
    disturbance: 'timestamp/TF 불일치',
    boundary: 'State estimate',
    owner: 'Perception · localization',
    cadence: 'observation 도착마다',
    detector: 'sample age · transform lookup · 이 셀의 50 ms limit',
    response: 'command를 만들지 말고 state를 다시 정렬',
    decision: 're-estimate',
  },
  {
    id: 'contact',
    label: '예상 밖 접촉',
    icon: Waves,
    tone: 'rose',
    reference: '0.42 rad',
    estimate: '0.38 rad · current 급증',
    error: '+0.04 rad',
    disturbance: '물체 접촉·load 변화',
    boundary: 'Drive / plant',
    owner: 'Drive safety monitor',
    cadence: '가장 빠른 실행 층',
    detector: 'effort/current limit',
    response: '속도를 낮추고 멈춘 뒤 재계획',
    decision: 'slow-stop',
  },
  {
    id: 'deadline',
    label: 'Deadline 누락',
    icon: Cpu,
    tone: 'rose',
    reference: '새 reference 미도착',
    estimate: '0.39 rad',
    error: '이전 command 재사용 위험',
    disturbance: 'executor·bus jitter',
    boundary: 'Drive / plant',
    owner: 'Embedded watchdog',
    cadence: '매 actuator update deadline',
    detector: 'deadline miss · sequence gap · 이 셀의 1회 누락 limit',
    response: '정의된 hold/stop 상태로 전환',
    decision: 'hold',
  },
  {
    id: 'compound',
    label: '복합 사고',
    icon: TriangleAlert,
    tone: 'rose',
    reference: '오염된 pose·path·trajectory 폐기',
    estimate: '0.31 rad · TF age 180 ms > limit 50 ms',
    error: 'stale state라 계산값 신뢰 불가',
    disturbance: '접촉 한계 초과 + actuator update 누락',
    boundary: 'Drive / plant → State estimate',
    owner: 'Embedded watchdog · safety supervisor',
    cadence: 'drive deadline에서 먼저 차단',
    detector: '1. watchdog · 2. contact guard · 3. TF age',
    response: '설정된 safe state → 정지 확인 → state 추정·plan 재계산',
    decision: 'hold',
  },
];

export function FeedbackDisturbanceLab() {
  const [scenarioId, setScenarioId] = useState('nominal');
  const scenario = feedbackScenarios.find((item) => item.id === scenarioId) ?? feedbackScenarios[0];
  const style = toneClass[scenario.tone];
  const ScenarioIcon = scenario.icon;

  return (
    <div
      data-feedback-disturbance-lab
      data-scenario={scenario.id}
      data-decision={scenario.decision}
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <ToolHeader
        eyebrow="Closed-loop debugger"
        title="같은 reference도 측정 증거에 따라 다른 결정을 낸다"
        description="외란을 바꾸면 오차의 의미와 안전한 다음 행동이 함께 바뀝니다. Policy 출력만으로 이 판단을 닫을 수 없는 이유를 확인하세요."
      />
      <div className="grid grid-cols-2 gap-2 px-4 py-4 sm:grid-cols-5 sm:px-5">
        {feedbackScenarios.map((item) => {
          const Icon = item.icon;
          const active = item.id === scenario.id;
          const itemStyle = toneClass[item.tone];
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setScenarioId(item.id)}
              className={`flex min-h-11 min-w-0 items-center gap-2 rounded-md border px-3 text-left text-sm font-semibold transition-colors ${
                active
                  ? `${itemStyle.border} ${itemStyle.background} ${itemStyle.text}`
                  : 'border-border hover:bg-muted/30'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? itemStyle.icon : 'text-muted-foreground'}`} aria-hidden="true" />
              <span className="min-w-0 break-words leading-snug">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-px border-t border-border bg-border lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="grid min-w-0 gap-4 bg-background p-5 sm:grid-cols-2">
          <Metric label="현재 reference rₖ" value={scenario.reference} tone="blue" />
          <Metric label="추정 state x̂ₖ" value={scenario.estimate} tone={scenario.tone} />
          <Metric label="계산 가능한 error eₖ" value={scenario.error} tone={scenario.tone} />
          <Metric label="외란 wₖ" value={scenario.disturbance} tone="rose" />
        </div>
        <div className={`min-w-0 bg-background p-5 ${style.background}`}>
          <div className="flex items-start gap-3">
            <ScenarioIcon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">첫 검출 경계</p>
              <p className="mt-1 break-words text-sm font-semibold">{scenario.boundary}</p>
              <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">
                {scenario.owner} · {scenario.cadence}
              </p>
              <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground">먼저 보는 증거</p>
              <p className="mt-1 break-words text-sm font-semibold">{scenario.detector}</p>
              <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground">안전한 다음 행동</p>
              <p className={`mt-1 break-words text-base font-bold leading-snug ${style.text}`}>{scenario.response}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type RosCase = {
  id: string;
  label: string;
  cue: string;
  contract: string;
  message: string;
  why: string;
  wrong: string;
  icon: LucideIcon;
  tone: Tone;
};

const rosCases: RosCase[] = [
  {
    id: 'stream',
    label: 'Camera stream',
    cue: '계속 흐르고 여러 소비자가 받는다',
    contract: 'Topic',
    message: 'sensor_msgs/Image + timestamp',
    why: '비동기 publish/subscribe가 연속 sensor data에 맞는다.',
    wrong: 'Service로 polling하면 호출 대기와 backpressure가 sensor 흐름을 왜곡할 수 있다.',
    icon: Radio,
    tone: 'teal',
  },
  {
    id: 'query',
    label: 'Calibration query',
    cue: '짧은 요청에 한 번의 응답이 필요하다',
    contract: 'Service',
    message: 'request → calibration response',
    why: '즉시 끝나는 request/response이며 진행 feedback이나 cancel이 필요 없다.',
    wrong: 'Action은 연결·상태 관리가 과하고, topic은 요청과 응답의 짝을 직접 관리해야 한다.',
    icon: Database,
    tone: 'teal',
  },
  {
    id: 'goal',
    label: 'Navigation goal',
    cue: '수 초 동안 진행되고 feedback·cancel이 필요하다',
    contract: 'Action',
    message: 'goal → feedback → result',
    why: '장시간 작업을 관찰하고 취소하거나 preempt할 수 있다.',
    wrong: 'Fire-and-forget topic은 누가 성공·실패를 돌려주는지 계약이 약해진다.',
    icon: Route,
    tone: 'amber',
  },
  {
    id: 'transform',
    label: 'Frame transform',
    cue: '좌표를 특정 시각의 다른 frame으로 옮긴다',
    contract: 'TF',
    message: 'camera → base → map @ timestamp',
    why: '좌표 관계와 시간을 함께 조회해야 같은 점을 같은 세계 위치로 해석한다.',
    wrong: '최신 transform만 무조건 쓰면 움직이는 robot에서 과거 image를 잘못 투영한다.',
    icon: LocateFixed,
    tone: 'amber',
  },
];

export function RosContractLab() {
  const [caseId, setCaseId] = useState('stream');
  const item = rosCases.find((entry) => entry.id === caseId) ?? rosCases[0];
  const style = toneClass[item.tone];
  const ItemIcon = item.icon;

  return (
    <div
      data-ros-contract-lab
      data-case={item.id}
      data-contract={item.contract.toLowerCase()}
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <ToolHeader
        eyebrow="ROS 2 interface chooser"
        title="데이터 모양이 아니라 상호작용 계약으로 고른다"
        description="업무를 선택하면 필요한 응답, 실행 시간, 취소 가능성, 좌표 시간이 달라지고 그에 맞는 interface가 결정됩니다."
      />
      <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
        {rosCases.map((entry) => {
          const Icon = entry.icon;
          const active = entry.id === caseId;
          const entryStyle = toneClass[entry.tone];
          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCaseId(entry.id)}
              className={`min-h-[6.5rem] min-w-0 bg-background p-4 text-left transition-colors ${
                active ? entryStyle.background : 'hover:bg-muted/25'
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${active ? entryStyle.icon : 'text-muted-foreground'}`} aria-hidden="true" />
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </span>
              <span className="mt-3 block break-words text-sm font-bold">{entry.label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{entry.cue}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-px border-t border-border bg-border lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div className={`grid min-h-40 place-items-center bg-background p-5 text-center ${style.background}`}>
          <div>
            <span className={`mx-auto grid h-11 w-11 place-items-center rounded-md border ${style.border} bg-background`}>
              <ItemIcon className={`h-5 w-5 ${style.icon}`} aria-hidden="true" />
            </span>
            <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">권장 contract</p>
            <p className={`mt-1 text-2xl font-black ${style.text}`}>{item.contract}</p>
          </div>
        </div>
        <div className="min-w-0 bg-background p-5">
          <p className="break-words font-mono text-xs text-muted-foreground">{item.message}</p>
          <p className="mt-3 text-sm leading-relaxed"><strong>맞는 이유.</strong> {item.why}</p>
          <p className="mt-3 border-l-2 border-rose-500 pl-3 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">잘못 고르면.</strong> {item.wrong}
          </p>
        </div>
      </div>
    </div>
  );
}

type OrchardScenario = {
  id: string;
  label: string;
  detected: string;
  ground: string;
  model: string;
  confidence: string;
  decision: string;
  status: 'go' | 'review' | 'stop';
  tone: Tone;
  icon: LucideIcon;
};

const orchardScenarios: OrchardScenario[] = [
  {
    id: 'clean',
    label: '깨끗한 두 row',
    detected: '좌 6 · 우 6 trunk',
    ground: 'calibration과 timestamp 유효',
    model: 'local robust line 2개',
    confidence: '0.94 · 양쪽 지지',
    decision: 'centerline trajectory 생성',
    status: 'go',
    tone: 'teal',
    icon: Check,
  },
  {
    id: 'missing',
    label: '한쪽 trunk 누락',
    detected: '좌 2 · 우 6 trunk',
    ground: 'metric point는 유효',
    model: 'temporal track + map prior',
    confidence: '0.61 · 한쪽 지지 부족',
    decision: '감속 후 다음 frame에서 재평가',
    status: 'review',
    tone: 'amber',
    icon: Activity,
  },
  {
    id: 'outlier',
    label: '오검출 1개',
    detected: 'row 밖 큰 residual 1점',
    ground: 'point 변환은 유효',
    model: 'least squares 대신 RANSAC',
    confidence: '0.82 · outlier 제외',
    decision: 'inlier centerline만 사용',
    status: 'go',
    tone: 'teal',
    icon: GitBranch,
  },
  {
    id: 'curve',
    label: '휘어진 row',
    detected: '국소 방향이 계속 변함',
    ground: 'metric point는 유효',
    model: 'sliding window · spline',
    confidence: '0.76 · 직선 underfit',
    decision: '짧은 horizon으로 재계획',
    status: 'review',
    tone: 'amber',
    icon: Route,
  },
  {
    id: 'person',
    label: '사람이 경로 진입',
    detected: 'centerline 위 dynamic obstacle',
    ground: 'object position 유효',
    model: 'row model과 별도 obstacle gate',
    confidence: 'path 자체는 0.93',
    decision: 'centerline과 무관하게 정지',
    status: 'stop',
    tone: 'rose',
    icon: Ban,
  },
];

export function OrchardEvidenceLab() {
  const [scenarioId, setScenarioId] = useState('clean');
  const scenario = orchardScenarios.find((item) => item.id === scenarioId) ?? orchardScenarios[0];
  const style = toneClass[scenario.tone];

  return (
    <div
      data-orchard-evidence-lab
      data-scenario={scenario.id}
      data-decision={scenario.status}
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <ToolHeader
        eyebrow="Field evidence"
        title="Pixel에서 주행 결정까지는 서로 다른 다섯 계약이다"
        description="현장 조건을 바꾸면 point 수, fitting model, confidence, 실행 결정이 함께 바뀝니다. Centerline이 있어도 obstacle gate는 독립적으로 남습니다."
      />
      <div className="grid grid-cols-2 gap-2 px-4 py-4 sm:grid-cols-3 sm:px-5 xl:grid-cols-5">
        {orchardScenarios.map((item) => {
          const Icon = item.icon;
          const active = item.id === scenarioId;
          const itemStyle = toneClass[item.tone];
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setScenarioId(item.id)}
              className={`flex min-h-11 min-w-0 items-center gap-2 rounded-md border px-3 text-left text-xs font-semibold transition-colors ${
                active
                  ? `${itemStyle.border} ${itemStyle.background} ${itemStyle.text}`
                  : 'border-border hover:bg-muted/30'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? itemStyle.icon : 'text-muted-foreground'}`} aria-hidden="true" />
              <span className="break-words leading-snug">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-px border-t border-border bg-border lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
        <div className="min-w-0 bg-background p-5">
          <div className="grid gap-2 sm:grid-cols-5">
            {[
              ['01', 'Image', scenario.detected, Camera],
              ['02', 'Ground point', scenario.ground, LocateFixed],
              ['03', 'Row model', scenario.model, GitBranch],
              ['04', 'Trajectory', scenario.confidence, Route],
              ['05', 'Safety gate', scenario.decision, ShieldCheck],
            ].map(([number, label, value, Icon], index) => {
              const StageIcon = Icon as LucideIcon;
              return (
                <div key={String(label)} className="relative min-w-0 rounded-md border border-border bg-muted/15 p-3">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] text-muted-foreground">{String(number)}</span>
                    <StageIcon className={`h-3.5 w-3.5 ${index === 4 ? style.icon : 'text-muted-foreground'}`} aria-hidden="true" />
                  </span>
                  <p className="mt-3 break-words text-[11px] font-bold leading-snug">{String(label)}</p>
                  <p className="mt-1 break-words text-[10px] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{String(value)}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`min-w-0 bg-background p-5 ${style.background}`}>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">최종 실행 결정</p>
          <p className={`mt-2 break-words text-lg font-black leading-snug ${style.text}`}>{scenario.decision}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {scenario.status === 'go' && '모든 중간 증거가 유효한 범위에서만 짧은 실행 horizon을 연다.'}
            {scenario.status === 'review' && '모델 신뢰가 낮으므로 속도와 horizon을 줄이고 새 관측으로 다시 판단한다.'}
            {scenario.status === 'stop' && '주행 가능 경로의 존재와 사람 앞에서 멈춰야 한다는 안전 판단은 서로 다른 계약이다.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SimulatorReleaseStrip() {
  const [stage, setStage] = useState<'sim' | 'shadow' | 'real'>('sim');
  const stages = [
    {
      id: 'sim' as const,
      label: 'Simulation',
      evidence: 'seed·domain별 success, instability, constraint violation',
      gate: '현실 안전 증거 아님',
      icon: Box,
      tone: 'violet' as Tone,
    },
    {
      id: 'shadow' as const,
      label: 'Bench / shadow',
      evidence: 'sensor replay, timing, workspace·limit check',
      gate: '저속·좁은 범위만 허용',
      icon: Activity,
      tone: 'amber' as Tone,
    },
    {
      id: 'real' as const,
      label: 'Real rollout',
      evidence: 'episode success, intervention, near-miss, hardware telemetry',
      gate: '독립 stop·recovery 유지',
      icon: ShieldCheck,
      tone: 'teal' as Tone,
    },
  ];
  const selected = stages.find((item) => item.id === stage) ?? stages[0];
  const style = toneClass[selected.tone];

  return (
    <div
      data-simulator-release-strip
      data-stage={selected.id}
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <ToolHeader
        eyebrow="Release evidence"
        title="Simulation success를 현실 안전으로 바로 승격하지 않는다"
        description="단계를 선택해 각 환경에서 확보할 수 있는 증거와 아직 열면 안 되는 실행 범위를 분리합니다."
      />
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {stages.map((item) => {
          const Icon = item.icon;
          const active = item.id === stage;
          const itemStyle = toneClass[item.tone];
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setStage(item.id)}
              className={`min-h-20 min-w-0 bg-background p-4 text-left transition-colors ${active ? itemStyle.background : 'hover:bg-muted/25'}`}
            >
              <span className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${active ? itemStyle.icon : 'text-muted-foreground'}`} aria-hidden="true" />
                <span className="text-sm font-bold">{item.label}</span>
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{item.gate}</span>
            </button>
          );
        })}
      </div>
      <div className={`border-t border-border px-5 py-5 ${style.background}`}>
        <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">이 단계가 주는 증거</p>
          <p className={`break-words text-sm font-semibold leading-relaxed ${style.text}`}>{selected.evidence}</p>
        </div>
      </div>
    </div>
  );
}
