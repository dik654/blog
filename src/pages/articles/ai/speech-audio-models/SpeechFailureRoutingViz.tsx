import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  BadgeCheck,
  CircleStop,
  Ear,
  MessageSquareText,
  RadioTower,
  TimerReset,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

type TraceEvent = {
  id: string;
  time: number;
  label: string;
  owner: string;
  detail: string;
  icon: LucideIcon;
  color: string;
};

const events: TraceEvent[] = [
  {
    id: 'interrupt',
    time: 0,
    label: '사용자 정정',
    owner: '입력 경계',
    detail: '“아니요”가 microphone stream에 들어온다.',
    icon: Ear,
    color: '#2563eb',
  },
  {
    id: 'hypothesis',
    time: 80,
    label: 'Stable partial',
    owner: 'Recognition',
    detail: '정정 발화를 80 ms에 안정된 가설로 확정한다.',
    icon: MessageSquareText,
    color: '#0f766e',
  },
  {
    id: 'decision',
    time: 120,
    label: 'Cancel 발행',
    owner: 'Interaction',
    detail: '40 ms 뒤 현재 출력 취소를 결정한다.',
    icon: CircleStop,
    color: '#7c3aed',
  },
  {
    id: 'silence',
    time: 560,
    label: '실제 무음',
    owner: 'Output runtime',
    detail: '440 ms가 더 지나 speaker playout이 멈춘다.',
    icon: AudioLines,
    color: '#b42318',
  },
];

const deltas = [
  { label: '정정 감지', value: 80, owner: 'Recognition', healthy: true },
  { label: '중단 판단', value: 40, owner: 'Interaction policy', healthy: true },
  { label: '취소·버퍼 비우기', value: 440, owner: 'Output runtime', healthy: false },
];

function Connector({ complete }: { complete: boolean }) {
  return (
    <div
      className={`flex min-h-8 items-center justify-center transition-colors ${
        complete ? 'text-foreground' : 'text-muted-foreground/35'
      }`}
      aria-hidden="true"
    >
      <ArrowDown className="h-4 w-4 lg:hidden" />
      <ArrowRight className="hidden h-4 w-4 lg:block" />
    </div>
  );
}

function EventTimeline({ step }: { step: number }) {
  return (
    <div className="w-full min-w-0" data-speech-boundary-trace data-step={step}>
      <div className="flex min-w-0 flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">
            Interruption trace · 한 요청의 경계 시각
          </p>
          <p className="mt-1 text-sm font-semibold leading-6">
            “계속 말한다”는 증상을 네 개의 event로 바꾼다.
          </p>
        </div>
        <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-muted-foreground">
          stop 560 ms
        </span>
      </div>

      {step === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid min-w-0 gap-5 py-8 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center"
        >
          <div className="min-w-0">
            <p className="text-2xl font-black leading-tight sm:text-3xl">“아니요.”</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              사용자는 정정했지만 agent 음성은 반 초 넘게 남는다. 자연스러운 음질과 낮은
              final WER만으로는 어느 경계가 늦었는지 알 수 없다.
            </p>
          </div>
          <div className="flex min-h-28 items-center justify-center rounded-md border border-border bg-muted/15">
            <TimerReset className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
        </motion.div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 py-5 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)]">
          {events.map((event, index) => {
            const Icon = event.icon;
            const active = step === 1 || (step >= 2 && event.id === 'silence');
            const complete = step >= 1;
            return (
              <Fragment key={event.id}>
                <motion.div
                  animate={{
                    opacity: complete ? 1 : 0.7,
                    y: active ? -2 : 0,
                  }}
                  className="relative min-w-0 overflow-hidden rounded-md border bg-background px-4 py-4"
                  style={{
                    borderColor: active ? event.color : undefined,
                    backgroundColor: active ? `${event.color}0B` : undefined,
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-0.5"
                    style={{ backgroundColor: complete ? event.color : 'var(--border)' }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-sm font-black tabular-nums">{event.time} ms</span>
                    <Icon className="h-4 w-4 shrink-0" style={{ color: event.color }} aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-bold">{event.label}</p>
                  <p className="mt-1 text-[11px] font-semibold text-foreground/75">{event.owner}</p>
                  <p className={`mt-3 text-xs leading-5 text-foreground/80 ${active ? 'block' : 'hidden sm:block'}`}>
                    {event.detail}
                  </p>
                </motion.div>
                {index < events.length - 1 ? <Connector complete={step >= 1} /> : null}
              </Fragment>
            );
          })}
        </div>
      )}

      {step >= 2 ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3"
        >
          {deltas.map((delta) => (
            <div className="min-w-0 bg-background px-4 py-4" key={delta.label}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-foreground">{delta.label}</span>
                <span
                  className={`font-mono text-sm font-black tabular-nums ${
                    delta.healthy ? 'text-foreground' : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {delta.value} ms
                </span>
              </div>
              <p className="mt-2 text-[11px] font-medium leading-5 text-foreground">{delta.owner}</p>
              {!delta.healthy ? (
                <p className="mt-2 text-xs font-semibold leading-5 text-red-700 dark:text-red-300">
                  첫 비정상 구간
                </p>
              ) : null}
            </div>
          ))}
        </motion.div>
      ) : null}

      {step >= 3 ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 grid min-w-0 gap-4 border-t border-border pt-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <RadioTower className="h-4 w-4 text-violet-700 dark:text-violet-300" aria-hidden="true" />
              <p className="text-sm font-bold">먼저 열 분기 · Interaction runtime</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Cancel propagation, output queue와 speaker buffer를 추적한다. CTC와 codec은 이번
              trace의 첫 원인이 아니므로 아직 열지 않는다.
            </p>
          </div>
          <div className="min-w-0 sm:border-l sm:border-border sm:pl-4">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <p className="text-sm font-bold">
                {step >= 4 ? '종료 조건 · release evidence' : '다음에 남길 증거'}
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {step >= 4
                ? 'Interruption stop p95가 목표 안에 들고, 취소 뒤 stale audio가 재생되지 않으면 이 진단을 닫는다.'
                : 'Decision, cancel acknowledgement, audio queue drain과 playout silence 시각을 같은 trace ID로 묶는다.'}
            </p>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

const steps = [
  {
    label: '증상은 책임자가 아니다.',
    body: '사용자가 끼어들었는데 agent가 계속 말한다. 음질·WER·모델 이름보다 먼저 하나의 실행 trace를 남긴다.',
  },
  {
    label: '경계마다 절대 시각을 찍는다.',
    body: 'Interruption, stable partial, cancel decision, 실제 speaker silence를 같은 clock과 trace ID로 기록한다.',
  },
  {
    label: '인접 시각을 빼 첫 비정상 구간을 찾는다.',
    body: '80 ms와 40 ms 구간은 정상인데 cancel 뒤 440 ms가 남았다. Downstream 증상과 첫 원인을 분리한다.',
  },
  {
    label: '첫 고장을 소유한 분기만 연다.',
    body: '이번에는 interaction runtime을 연다. Final WER와 codec 음질을 먼저 고치는 실험은 보류한다.',
  },
  {
    label: '성공 기준이 생기면 허브에서 멈춘다.',
    body: 'End-to-end stop p95와 stale playback 제거를 release gate로 고정하고 해당 분기에서 검증한다.',
  },
] as const;

export default function SpeechFailureRoutingViz() {
  return (
    <StepViz
      steps={[...steps]}
      stageClassName="!items-stretch bg-[hsl(var(--muted)/0.08)]"
    >
      {(step) => <EventTimeline step={step} />}
    </StepViz>
  );
}
