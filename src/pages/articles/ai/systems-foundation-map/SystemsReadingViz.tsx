import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  Braces,
  Cpu,
  Database,
  DatabaseZap,
  Network,
  ScanLine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type StageId = 'input' | 'state' | 'compute' | 'boundary' | 'verify';

type Stage = {
  id: StageId;
  number: string;
  label: string;
  question: string;
  example: string;
  color: string;
  icon: LucideIcon;
};

const stages: Stage[] = [
  {
    id: 'input',
    number: '01',
    label: '입력 표현',
    question: '한 작업 단위는 무엇인가?',
    example: 'token · tensor · sample',
    color: '#2563eb',
    icon: ScanLine,
  },
  {
    id: 'state',
    number: '02',
    label: '남는 상태',
    question: '다음 계산이 다시 읽는 값은?',
    example: 'cache · pose · IR',
    color: '#0f766e',
    icon: Database,
  },
  {
    id: 'compute',
    number: '03',
    label: '계산 소유자',
    question: '누가 값을 바꾸는가?',
    example: 'kernel · parser · policy',
    color: '#7c3aed',
    icon: Cpu,
  },
  {
    id: 'boundary',
    number: '04',
    label: '경계 계약',
    question: '무엇을 지키며 전달하는가?',
    example: 'shape · order · deadline',
    color: '#b7791f',
    icon: Braces,
  },
  {
    id: 'verify',
    number: '05',
    label: '검증 신호',
    question: '성공을 무엇으로 판정하는가?',
    example: 'test · metric · invariant',
    color: '#b42318',
    icon: BadgeCheck,
  },
];

function StageArrow() {
  return (
    <div className="flex min-h-9 items-center justify-center text-muted-foreground/60 xl:min-h-0">
      <ArrowDown className="h-4 w-4 xl:hidden" aria-hidden="true" />
      <ArrowRight className="hidden h-4 w-4 xl:block" aria-hidden="true" />
    </div>
  );
}

export function SystemsReadingSequence({ step }: { step: number }) {
  return (
    <div className="w-full min-w-0" data-systems-reading-sequence data-step={step}>
      <div className="mb-5 flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">One request · five ownership checks</p>
          <p className="mt-1 text-sm font-semibold leading-6">
            같은 분야가 아니라 같은 조사 순서
          </p>
        </div>
        <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-muted-foreground">
          {String(step + 1).padStart(2, '0')} / 05
        </span>
      </div>

      <div className="grid min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)]">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const active = index === step;
          const complete = index < step;
          return (
            <Fragment key={stage.id}>
              <motion.div
                animate={{ opacity: index <= step ? 1 : 0.56, y: active ? -2 : 0 }}
                transition={{ duration: 0.22 }}
                className="relative min-w-0 overflow-hidden rounded-md border bg-background px-4 py-4"
                style={{
                  borderColor: active ? stage.color : undefined,
                  backgroundColor: active ? `${stage.color}0D` : undefined,
                }}
                data-stage={stage.id}
                data-active={active ? 'true' : undefined}
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5"
                  style={{ backgroundColor: active || complete ? stage.color : 'var(--border)' }}
                />
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[11px] font-bold tabular-nums text-muted-foreground">{stage.number}</span>
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: active || complete ? stage.color : 'var(--muted-foreground)' }}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-4 text-sm font-bold">{stage.label}</p>
                <p className={`mt-1 text-xs leading-5 text-muted-foreground ${active ? 'block' : 'hidden sm:block'}`}>
                  {stage.question}
                </p>
                <p className={`mt-3 break-words font-mono text-[10px] leading-4 text-muted-foreground [overflow-wrap:anywhere] ${active ? 'block' : 'hidden xl:block'}`}>
                  {stage.example}
                </p>
              </motion.div>
              {index < stages.length - 1 ? <StageArrow /> : null}
            </Fragment>
          );
        })}
      </div>

      <motion.div
        animate={{ opacity: step === 4 ? 1 : 0.42 }}
        className="mt-5 flex min-w-0 items-start gap-3 border-t border-dashed border-border pt-4 text-sm leading-6 text-muted-foreground"
      >
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
        <p>
          검증 결과는 끝이 아니다. 실패 증거가 <strong className="text-foreground">입력 표현과 상태 갱신 규칙</strong>을
          바꾸며 다음 실행으로 돌아간다.
        </p>
      </motion.div>
    </div>
  );
}

type Scenario = {
  id: string;
  label: string;
  icon: LucideIcon;
  symptom: string;
  firstBreak: StageId;
  downstream: StageId[];
  evidence: string;
  next: string;
};

const scenarios: Scenario[] = [
  {
    id: 'hpc',
    label: 'GPU HPC',
    icon: Network,
    symptom: 'GPU를 8장에서 16장으로 늘렸는데 한 step이 오히려 길어졌다.',
    firstBreak: 'boundary',
    downstream: ['verify'],
    evidence: 'Kernel 시간은 그대로지만 all-reduce 대기와 tail latency가 증가했다.',
    next: 'NCCL trace, message byte, topology와 link별 bandwidth를 확인한다.',
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    icon: DatabaseZap,
    symptom: '답은 자연스럽지만 인용 링크가 주장과 다른 문단을 가리킨다.',
    firstBreak: 'boundary',
    downstream: ['verify'],
    evidence: 'Parser output에는 좌표가 있었지만 chunk → claim 변환에서 source anchor가 사라졌다.',
    next: 'Knowledge IR schema와 claim-evidence lineage verifier를 확인한다.',
  },
  {
    id: 'robot',
    label: 'Robot AI',
    icon: Bot,
    symptom: 'Controller output은 매끄럽지만 장애물에 늦게 반응한다.',
    firstBreak: 'boundary',
    downstream: ['state', 'compute', 'verify'],
    evidence: 'Queue에 남은 오래된 sensor sample이 deadline 뒤에도 소비된다.',
    next: 'Acquisition timestamp, QoS lifespan, queue depth와 callback deadline을 확인한다.',
  },
  {
    id: 'rlvr',
    label: 'Reasoning RL',
    icon: BrainCircuit,
    symptom: 'Training reward는 오르지만 held-out 정답률과 풀이 다양성은 떨어진다.',
    firstBreak: 'verify',
    downstream: [],
    evidence: 'Policy는 verifier의 빈틈을 최적화했지만 실제 성공 조건은 만족하지 못했다.',
    next: 'Reward ownership, adversarial verifier와 held-out evaluation을 분리한다.',
  },
  {
    id: 'moe',
    label: 'MoE SSD',
    icon: Cpu,
    symptom: 'RAM budget에는 맞지만 decode가 0.08 token/s에 머문다.',
    firstBreak: 'boundary',
    downstream: ['compute', 'verify'],
    evidence: 'Active parameter보다 SSD random-read miss byte가 critical path를 지배한다.',
    next: 'Expert load/token, byte-weighted hit rate와 effective random-read GB/s를 잰다.',
  },
];

function StageStatus({
  stage,
  scenario,
}: {
  stage: Stage;
  scenario: Scenario;
}) {
  const first = scenario.firstBreak === stage.id;
  const downstream = scenario.downstream.includes(stage.id);
  const status = first ? '첫 파손' : downstream ? '영향 전파' : '우선 정상';
  return (
    <div
      className={`min-w-0 border-t px-3 py-3 ${
        first
          ? 'border-rose-600 bg-rose-500/[0.05]'
          : downstream
            ? 'border-amber-500/70 bg-amber-500/[0.035]'
            : 'border-border bg-background'
      }`}
      data-diagnosis-stage={stage.id}
      data-status={first ? 'first-break' : downstream ? 'downstream' : 'nominal'}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold">{stage.label}</span>
        <span className={`text-[10px] font-bold ${first ? 'text-rose-700 dark:text-rose-300' : 'text-muted-foreground'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

export function SystemDiagnosisLab() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];

  return (
    <div className="not-prose my-9 min-w-0 overflow-hidden rounded-md border border-border bg-background" data-system-diagnosis-lab>
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">Transfer lab · symptom to first break</p>
        <h3 className="mt-1 text-base font-bold">증상이 보이는 곳과 처음 깨진 계약은 다를 수 있다</h3>
      </header>

      <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-5">
        {scenarios.map((item) => {
          const Icon = item.icon;
          const active = item.id === scenario.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setScenarioId(item.id)}
              className={`min-h-14 min-w-0 bg-background px-3 py-3 text-left transition-colors last:col-span-2 lg:last:col-span-1 ${
                active ? 'bg-blue-500/[0.07] text-foreground' : 'text-muted-foreground hover:bg-muted/35 hover:text-foreground'
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0 break-words text-xs font-bold">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={scenario.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="min-w-0"
      >
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div className="min-w-0 px-4 py-5 sm:px-5">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">관측한 증상</p>
            <p className="mt-2 text-base font-bold leading-7">{scenario.symptom}</p>
            <div className="mt-5 grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-5">
              {stages.map((stage) => <StageStatus key={stage.id} stage={stage} scenario={scenario} />)}
            </div>
          </div>
          <aside className="min-w-0 border-t border-border bg-muted/[0.12] px-4 py-5 lg:border-l lg:border-t-0 sm:px-5">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">왜 여기서 끊나</p>
              <p className="mt-2 text-sm leading-6">{scenario.evidence}</p>
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">다음 증거</p>
              <p className="mt-2 flex min-w-0 items-start gap-2 text-sm leading-6 text-muted-foreground">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
                <span>{scenario.next}</span>
              </p>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
