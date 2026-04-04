import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const contexts = [
  { id: 0, label: 'Context 0', cells: 100, color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' },
  { id: 1, label: 'Context 1', cells: 50, color: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700' },
  { id: 2, label: 'Context 2', cells: 80, color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700' },
];

const physicals = [
  { label: 'Col 0', segments: ['a0..a99'], bp: 99, color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
  { label: 'Col 1', segments: ['b0..b49', 'c0..c49'], bp: 149, color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
  { label: 'Col 2', segments: ['c50..c79'], bp: null, color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800' },
];

export default function VirtualRegionViz() {
  const [step, setStep] = useState<0 | 1>(0);

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm font-semibold mb-3 text-foreground/80">가상 → 물리 컬럼 매핑</p>
      <div className="flex gap-1 mb-4 p-1 rounded-lg border border-border w-fit">
        {['가상 영역', '물리 컬럼'].map((t, i) => (
          <button key={t} onClick={() => setStep(i as 0 | 1)}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium
              ${step === i ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 flex-wrap">
            {contexts.map(c => (
              <div key={c.id} className={`rounded-lg border p-3 min-w-[140px] ${c.color}`}>
                <p className="text-xs font-medium mb-1">{c.label}</p>
                <p className="text-[10px] text-muted-foreground">{c.cells} cells</p>
                <div className="mt-1.5 h-2 rounded-full bg-foreground/10 overflow-hidden">
                  <div className="h-full rounded-full bg-foreground/25" style={{ width: `${c.cells / 1.2}%` }} />
                </div>
              </div>
            ))}
            <p className="w-full text-[10px] text-muted-foreground mt-2">
              총 230 cells, usable_rows = 100
            </p>
          </motion.div>
        ) : (
          <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 flex-wrap">
            {physicals.map(p => (
              <div key={p.label} className={`rounded-lg border p-3 min-w-[140px] ${p.color}`}>
                <p className="text-xs font-medium mb-1">{p.label}</p>
                {p.segments.map(s => (
                  <p key={s} className="text-[10px] font-mono text-foreground/70">{s}</p>
                ))}
                {p.bp && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                    BP @ row {p.bp}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
