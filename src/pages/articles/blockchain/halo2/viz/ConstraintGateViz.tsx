import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const gates = [
  { id: 'add', label: '덧셈', formula: 'a + b = d', vals: ['a', 'b', '1', 'a+b'], note: 'c=1로 설정' },
  { id: 'mul', label: '곱셈', formula: 'b * c = d', vals: ['0', 'b', 'c', 'b*c'], note: 'a=0으로 설정' },
  { id: 'madd', label: '곱셈-덧셈', formula: 'a + b*c = d', vals: ['a', 'b', 'c', 'a+b*c'], note: '모든 값 사용' },
] as const;

export default function ConstraintGateViz() {
  const [sel, setSel] = useState<string>('add');
  const g = gates.find(x => x.id === sel)!;

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm font-semibold mb-3 text-foreground/80">Vertical Gate Strategy</p>
      <div className="flex gap-1 mb-4 p-1 rounded-lg border border-border w-fit">
        {gates.map(gt => (
          <button key={gt.id} onClick={() => setSel(gt.id)}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium
              ${sel === gt.id ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {gt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-6 items-start flex-wrap">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] text-muted-foreground mb-1">Advice Column</p>
          <AnimatePresence mode="wait">
            <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-0.5">
              {['cur (a)', 'next (b)', '+2 (c)', '+3 (out)'].map((r, i) => (
                <div key={r} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-16 text-right">{r}</span>
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    className="w-16 h-7 rounded border bg-blue-50 dark:bg-blue-950/30 border-blue-200
                      dark:border-blue-800 flex items-center justify-center text-xs font-mono">
                    {g.vals[i]}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-col justify-center min-h-[120px]">
          <p className="text-xs text-muted-foreground mb-1">제약 조건</p>
          <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200
            dark:border-amber-800">
            <p className="text-sm font-mono font-medium">q * (a + b*c - d) = 0</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">{g.note}</p>
            <p className="text-xs font-mono mt-1 text-foreground/70">{g.formula}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
