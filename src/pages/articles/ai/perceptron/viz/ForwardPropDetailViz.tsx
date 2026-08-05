import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const d = 0.06;

function Line({ children, tone = 'default', delay = 0 }: {
  children: ReactNode;
  tone?: 'default' | 'muted' | 'blue' | 'green' | 'amber';
  delay?: number;
}) {
  const toneClass = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-700 dark:text-amber-400',
  }[tone];

  return (
    <motion.div
      className={`min-w-0 break-words text-[13px] leading-relaxed sm:text-sm ${toneClass}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ForwardPropDetailViz() {
  return (
    <div className="not-prose my-6 max-w-full rounded-lg border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/60 bg-muted/20 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Forward Propagation 수식</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          column-vector convention 기준. W^(l)의 행 하나가 다음 층의 뉴런 하나이고, a^(l-1)과 내적되어 z^(l)의 한 원소를 만든다.
        </p>
      </div>
      <div className="space-y-4 px-4 py-5">
        <Line tone="blue" delay={0}>
          <strong>l번째 층 계산</strong> <span className="text-muted-foreground">(column-vector convention)</span>
        </Line>
        <div className="space-y-2 rounded-md border border-border/70 bg-muted/15 p-3">
          <Line tone="default" delay={d}>
            <code className="font-mono">z^(l) = W^(l) · a^(l-1) + b^(l)</code>
          </Line>
          <Line tone="muted" delay={d * 2}>선형 변환: 이전 activation 전체를 현재 층 logit으로 바꾼다.</Line>
          <Line tone="green" delay={d * 3}>
            <code className="font-mono">a^(l) = activation(z^(l))</code>
          </Line>
          <Line tone="muted" delay={d * 4}>비선형 활성화: 각 logit에 원소별로 적용한다.</Line>
        </div>
        <div className="grid gap-2 rounded-md border border-amber-200/70 bg-amber-50/50 p-3 dark:border-amber-500/25 dark:bg-amber-500/10">
          <Line tone="amber" delay={d * 5}>
            <code className="font-mono">a^(l-1): [n_(l-1) × 1]</code>
          </Line>
          <Line tone="amber" delay={d * 6}>
            <code className="font-mono">W^(l): [n_l × n_(l-1)]</code>
          </Line>
          <Line tone="amber" delay={d * 7}>
            <code className="font-mono">b^(l), z^(l), a^(l): [n_l × 1]</code>
          </Line>
          <Line tone="amber" delay={d * 8}>
            <code className="font-mono">a^(0)=x, a^(L)=예측값</code>
          </Line>
        </div>
      </div>
    </div>
  );
}
