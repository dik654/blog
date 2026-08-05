import { motion, useReducedMotion } from 'framer-motion';
import { Braces, Cpu, Layers3, ScanSearch } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const stages = [
  {
    number: '01',
    title: '입력 계약',
    code: 'set_inputs_first_pass()',
    detail: 'target hidden state, token과 position을 draft 입력으로 정렬',
    icon: Braces,
    tone: 'border-sky-500/45 bg-sky-500/[0.07]',
  },
  {
    number: '02',
    title: 'Attention 계약',
    code: 'build_per_layer_attn_metadata()',
    detail: '각 layer가 읽을 KV slot과 causal 범위를 구성',
    icon: Layers3,
    tone: 'border-violet-500/45 bg-violet-500/[0.07]',
  },
  {
    number: '03',
    title: 'Draft 실행',
    code: 'forward_context()',
    detail: 'batch bucket을 고르고 경량 proposer를 한 번 실행',
    icon: Cpu,
    tone: 'border-amber-500/45 bg-amber-500/[0.07]',
  },
  {
    number: '04',
    title: '후보 추출',
    code: 'token_indices_to_sample',
    detail: '검증할 K개 위치의 state만 모아 target verifier에 전달',
    icon: ScanSearch,
    tone: 'border-emerald-500/45 bg-emerald-500/[0.07]',
  },
] as const;

const steps = [
  { label: '1. Target state를 draft 입력 좌표로 바꾼다.', body: '후보 생성이 빨라도 token, position과 hidden state가 어긋나면 verifier가 다른 조건을 검사하게 된다.' },
  { label: '2. 각 layer의 KV와 causal 범위를 먼저 고정한다.', body: 'Attention metadata는 어느 slot을 읽고 쓸지 정하는 실행 계약이다.' },
  { label: '3. 준비된 batch에서 proposer forward를 실행한다.', body: 'CUDAGraph bucket과 실제 batch가 맞아야 빠른 실행 경로를 재사용할 수 있다.' },
  { label: '4. 필요한 위치만 추출해 아직 미확정인 후보로 넘긴다.', body: '이 결과는 output이 아니다. Target의 acceptance와 recovery를 통과한 prefix만 commit된다.' },
];

function PipelineStage({ active }: { active: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full" data-spec-draft-pipeline>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === active;
          const isComplete = index < active;
          return (
            <motion.div
              key={stage.number}
              initial={false}
              animate={{ opacity: isActive ? 1 : isComplete ? 0.72 : 0.42, y: isActive && !reduceMotion ? -2 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
              className={`grid min-h-[116px] min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] border p-3 ${stage.tone} ${isActive ? 'shadow-sm ring-1 ring-foreground/10' : ''}`}
            >
              <div className="flex flex-col items-center gap-2 border-r border-current/15 pr-3">
                <span className="font-mono text-[11px] font-bold text-muted-foreground">{stage.number}</span>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 pl-3">
                <strong className="block text-sm text-foreground">{stage.title}</strong>
                <code className="mt-1.5 block min-w-0 whitespace-normal break-words text-[12px] leading-snug text-foreground [overflow-wrap:anywhere]">{stage.code}</code>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-t border-border/70 pt-3 text-xs">
        <span className="min-w-0 text-muted-foreground">target evidence</span>
        <span className="font-mono font-bold text-foreground">→ draft candidate →</span>
        <span className="min-w-0 text-right font-semibold text-foreground">아직 commit 아님</span>
      </div>
    </div>
  );
}

export default function SpecDraftPipelineViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <PipelineStage active={step} />}
    </StepViz>
  );
}
