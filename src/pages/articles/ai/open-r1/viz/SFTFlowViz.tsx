import { motion } from 'framer-motion';

const tokenRows = [
  { token: '<|im_start|>system', role: '구조', learn: false },
  { token: '도움이 되는 AI로 답하라', role: 'system', learn: false },
  { token: '<|im_start|>user', role: '구조', learn: false },
  { token: '2x + 3 = 7을 풀어라', role: 'prompt', learn: false },
  { token: '<|im_start|>assistant', role: '구조', learn: false },
  { token: '양변에서 3을 빼면…', role: 'completion', learn: true },
  { token: 'x = 2', role: 'completion', learn: true },
  { token: '<|im_end|>', role: 'EOS', learn: true },
] as const;

export default function SFTFlowViz() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-sft-token-contract>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-muted/25 px-4 py-4 sm:px-6">
        <p className="text-xs font-black">직렬화된 token sequence</p>
        <p className="text-right text-[10px] font-black text-muted-foreground">역할 · Loss mask</p>
      </div>
      <div className="px-4 py-2 sm:px-6">
        {tokenRows.map((row, index) => (
          <motion.div
            key={`${row.token}-${index}`}
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.035 }}
            className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 py-3 last:border-b-0"
          >
            <code className="min-w-0 break-words text-xs font-bold [overflow-wrap:anywhere]">{row.token}</code>
            <span className="grid justify-items-end gap-1 text-right">
              <span className="text-[10px] font-bold text-muted-foreground">{row.role}</span>
              <span className={`text-[10px] font-black ${row.learn ? 'text-teal-700 dark:text-teal-300' : 'text-muted-foreground'}`}>
                {row.learn ? '1 · 학습' : '0 · 문맥'}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-3 border-t border-border bg-blue-50/60 px-4 py-5 dark:bg-blue-950/20 sm:grid-cols-[8rem_minmax(0,1fr)] sm:px-6">
        <p className="font-mono text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">핵심 계약</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Template가 만든 마지막 token과 tokenizer의 EOS가 같아야 “여기서 답이 끝난다”는 학습 신호와 실제 generation stop이 일치한다.
        </p>
      </div>
    </div>
  );
}
