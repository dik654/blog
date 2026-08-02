import { useState } from 'react';
import { motion } from 'framer-motion';
import { Braces, Code2, Gauge, Sigma } from 'lucide-react';

const contracts = [
  {
    key: 'accuracy',
    label: '수학적 정답',
    owner: 'math parser + verifier',
    input: 'gold solution + completion',
    output: '동치 1 · 비동치/검증 실패 0',
    failure: 'Gold parse 실패와 model 오답을 같은 0으로 숨기면 data 오류를 찾지 못한다.',
    Icon: Sigma,
  },
  {
    key: 'format',
    label: '출력 구조',
    owner: 'regex / tag contract',
    input: '직렬화된 completion 전체',
    output: '요구한 태그·순서를 지키면 1',
    failure: '형식 통과는 reasoning의 사실성이나 인과적 충실성을 증명하지 않는다.',
    Icon: Braces,
  },
  {
    key: 'length',
    label: '길이·반복',
    owner: 'regularization reward',
    input: 'completion token·n-gram',
    output: '반복·과도한 길이에 penalty',
    failure: '길이 자체를 보상하면 쉬운 문제에서도 장황한 overthinking을 학습할 수 있다.',
    Icon: Gauge,
  },
  {
    key: 'code',
    label: '코드 실행',
    owner: 'external sandbox',
    input: 'candidate code + hidden tests',
    output: '통과율 또는 binary success',
    failure: 'Trainer host에서 직접 실행하면 model output에 infrastructure 권한을 넘기는 보안 사고다.',
    Icon: Code2,
  },
] as const;

export default function RewardPipelineViz() {
  const [selected, setSelected] = useState(0);
  const contract = contracts[selected];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-reward-contract>
      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
        {contracts.map(({ label, Icon }, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            className={`relative min-h-24 border-b border-r border-border px-3 py-4 text-left transition-colors sm:border-b-0 ${selected === index ? 'bg-amber-50/80 dark:bg-amber-950/20' : 'hover:bg-muted/40'}`}
          >
            <Icon className={`h-4 w-4 ${selected === index ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`} aria-hidden="true" />
            <span className="mt-4 block text-xs font-black">{label}</span>
            {selected === index && <motion.span layoutId="reward-contract" className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500" />}
          </button>
        ))}
      </div>
      <motion.div key={contract.key} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="grid gap-px bg-border md:grid-cols-3">
        <div className="min-w-0 bg-background p-5">
          <p className="font-mono text-[10px] font-black uppercase text-muted-foreground">Input</p>
          <p className="mt-3 break-words text-sm font-bold [overflow-wrap:anywhere]">{contract.input}</p>
        </div>
        <div className="min-w-0 bg-background p-5">
          <p className="font-mono text-[10px] font-black uppercase text-muted-foreground">Output</p>
          <p className="mt-3 break-words text-sm font-bold [overflow-wrap:anywhere]">{contract.output}</p>
        </div>
        <div className="min-w-0 bg-background p-5">
          <p className="font-mono text-[10px] font-black uppercase text-rose-700 dark:text-rose-300">Failure owner · {contract.owner}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{contract.failure}</p>
        </div>
      </motion.div>
    </div>
  );
}
