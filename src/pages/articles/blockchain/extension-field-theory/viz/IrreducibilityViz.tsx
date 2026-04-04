import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IrreducibilitySvg from './IrreducibilitySvg';

/** Interactive irreducibility check: x²+1 mod 7 vs x²-2 mod 7 */
export default function IrreducibilityViz() {
  const [poly, setPoly] = useState<'irred' | 'red'>('irred');
  const [highlight, setHighlight] = useState<number | null>(null);

  const irredRows = Array.from({ length: 7 }, (_, x) => {
    const val = (x * x + 1) % 7;
    return { x, result: val, isZero: val === 0 };
  });
  const redRows = Array.from({ length: 7 }, (_, x) => {
    const val = ((x * x - 2) % 7 + 7) % 7;
    return { x, result: val, isZero: val === 0 };
  });

  const rows = poly === 'irred' ? irredRows : redRows;
  const polyLabel = poly === 'irred' ? 'x² + 1' : 'x² − 2';

  return (
    <div className="rounded-xl border p-5 mb-6">
      <div className="flex gap-2 mb-5">
        {([
          { key: 'irred' as const, label: 'x² + 1 (기약)' },
          { key: 'red' as const, label: 'x² − 2 (가약)' },
        ]).map(p => (
          <button key={p.key} onClick={() => { setPoly(p.key); setHighlight(null); }}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer
              ${poly === p.key ? 'bg-primary/10 border-primary/30 text-primary' : 'hover:bg-accent'}`}>
            {p.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={poly} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <IrreducibilitySvg rows={rows} isIrreducible={poly === 'irred'}
            polyLabel={polyLabel} highlight={highlight} onHighlight={setHighlight} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
