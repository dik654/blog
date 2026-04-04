import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GLOSSARY } from './flowDiagramData';

export default function GlossaryPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="shrink-0 border-b border-border/40">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-1.5 px-4 py-1.5 text-left hover:bg-accent/50 transition-colors cursor-pointer">
        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/75">📖 용어 사전</span>
        <span className="text-[9px] text-muted-foreground ml-auto">{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-3 space-y-1">
              {GLOSSARY.map(g => (
                <div key={g.term} className="flex gap-2">
                  <code className="shrink-0 text-[10px] font-bold text-[#0969da] dark:text-[#58a6ff] font-mono w-32">{g.term}</code>
                  <span className="text-[10px] text-foreground/75 leading-snug">{g.def}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
