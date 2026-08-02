import { useState } from 'react';
import { motion } from 'framer-motion';
import { Braces, Cpu, Database, RefreshCw, Save, ShieldCheck } from 'lucide-react';

const stages = [
  {
    label: '문제 행',
    owner: 'Dataset',
    detail: 'problem·gold answer·source ID를 읽는다. 이 시점의 gold가 틀리면 뒤 verifier도 틀린 목표를 강화한다.',
    Icon: Database,
  },
  {
    label: '대화 직렬화',
    owner: 'Tokenizer',
    detail: 'System·user message를 chat template로 token sequence로 바꾼다. EOS와 template은 하나의 출력 계약이다.',
    Icon: Braces,
  },
  {
    label: 'G개 생성',
    owner: 'Policy + vLLM',
    detail: '같은 prompt에서 여러 completion을 sample한다. 이 단계가 GRPO의 가장 큰 추가 계산 비용이다.',
    Icon: Cpu,
  },
  {
    label: '검증',
    owner: 'Reward registry',
    detail: 'Accuracy·format·code test처럼 설정에서 고른 verifier가 각 completion을 서로 다른 축으로 채점한다.',
    Icon: ShieldCheck,
  },
  {
    label: '상대 update',
    owner: 'GRPOTrainer',
    detail: '같은 prompt의 평균보다 나은 completion은 올리고 낮은 completion은 내린다. 모두 같은 점수면 신호가 없다.',
    Icon: RefreshCw,
  },
  {
    label: '저장·평가',
    owner: 'Checkpoint',
    detail: '학습 state와 model을 저장하고, 고정한 held-out prompt·generation 설정으로 실제 능력을 다시 측정한다.',
    Icon: Save,
  },
] as const;

export default function E2EPipelineViz() {
  const [active, setActive] = useState(0);
  const current = stages[active];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-open-r1-lifecycle>
      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-3 xl:grid-cols-6">
        {stages.map(({ label, owner, Icon }, index) => {
          const selected = active === index;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={selected}
              className={`relative min-h-28 border-b border-r border-border px-3 py-4 text-left transition-colors sm:min-h-32 xl:border-b-0 ${selected ? 'bg-blue-50/80 dark:bg-blue-950/25' : 'hover:bg-muted/40'}`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className={`font-mono text-[10px] font-black ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Icon className={`h-4 w-4 ${selected ? 'text-blue-600 dark:text-blue-300' : 'text-muted-foreground'}`} aria-hidden="true" />
              </span>
              <span className="mt-4 block text-sm font-black leading-snug">{label}</span>
              <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">{owner}</span>
              {selected && <motion.span layoutId="open-r1-stage" className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />}
            </button>
          );
        })}
      </div>
      <motion.div
        key={current.label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid min-h-32 gap-3 px-4 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start sm:px-6"
      >
        <div>
          <p className="font-mono text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">현재 실행 주체</p>
          <p className="mt-2 text-sm font-black">{current.owner}</p>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{current.detail}</p>
      </motion.div>
    </div>
  );
}
