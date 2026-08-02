import { motion } from 'framer-motion';
import { Archive, Filter, FlaskConical, GitBranch, Server } from 'lucide-react';

const stages = [
  { label: 'Teacher sampling', sub: 'prompt당 여러 trace', Icon: Server, tone: 'text-blue-700 dark:text-blue-300' },
  { label: 'Verifier gate', sub: '정답·실행·형식', Icon: Filter, tone: 'text-amber-700 dark:text-amber-300' },
  { label: 'Data audit', sub: 'dedup·8-gram 오염', Icon: GitBranch, tone: 'text-violet-700 dark:text-violet-300' },
  { label: 'Versioned dataset', sub: 'source·config·hash', Icon: Archive, tone: 'text-teal-700 dark:text-teal-300' },
  { label: 'Held-out eval', sub: '고정 sampling', Icon: FlaskConical, tone: 'text-rose-700 dark:text-rose-300' },
] as const;

export default function DataFlowViz() {
  return (
    <div className="not-prose my-8 grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-5" data-open-r1-data-loop>
      {stages.map(({ label, sub, Icon, tone }, index) => (
        <motion.div
          key={label}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="min-h-32 bg-background p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
          </div>
          <p className="mt-5 text-sm font-black">{label}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
