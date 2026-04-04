import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export { CitationBlock } from './citation-block';

interface CitationProps {
  source: string;
  citeKey: number;
  type?: 'paper' | 'code';
  children: ReactNode;
  href?: string;
}

export function Citation({ source, citeKey, type = 'paper', children, href }: CitationProps) {
  const [open, setOpen] = useState(false);

  const accent = type === 'code'
    ? 'border-emerald-500/40 bg-emerald-500/5'
    : 'border-blue-500/40 bg-blue-500/5';

  return (
    <span className="relative inline-flex items-baseline gap-0.5">
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          inline-flex items-center justify-center
          w-[18px] h-[18px] rounded-full text-[10px] font-bold
          cursor-pointer select-none transition-all duration-200
          ${open
            ? 'bg-primary text-primary-foreground scale-110'
            : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary'
          }
        `}
        title={source}
        aria-expanded={open}
      >
        {citeKey}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            className="absolute left-0 top-full z-50 mt-1 w-72"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <span className={`block rounded-lg border-l-4 ${accent} p-3 shadow-lg bg-background`}>
              <span className="text-xs text-foreground/50 block mb-1">{source}</span>
              {href && (
                <a href={href} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-blue-400 hover:underline mb-1 block">{href}</a>
              )}
              <span className={`text-sm leading-relaxed block ${type === 'code' ? 'font-mono' : ''}`}>
                {children}
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
