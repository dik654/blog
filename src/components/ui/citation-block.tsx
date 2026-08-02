import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Code2, FileText } from 'lucide-react';

interface CitationBlockProps {
  source: string;
  citeKey: number;
  type?: 'paper' | 'code';
  children: ReactNode;
  href?: string;
}

export function CitationBlock({ source, citeKey, type = 'paper', children, href }: CitationBlockProps) {
  const [open, setOpen] = useState(false);

  const accent = type === 'code'
    ? 'border-emerald-500/40 bg-emerald-500/5'
    : 'border-blue-500/40 bg-blue-500/5';

  const badgeColor = type === 'code'
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : 'bg-blue-500/15 text-blue-400 border-blue-500/30';

  const SourceIcon = type === 'code' ? Code2 : FileText;

  return (
    <div className="not-prose my-3">
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          inline-flex min-h-11 max-w-full items-center gap-2 px-3 py-2
          rounded-lg border text-xs font-medium
          cursor-pointer select-none transition-all duration-200
          ${open ? accent + ' border-opacity-100' : 'border-border hover:bg-accent'}
        `}
      >
        <span className={`
          inline-flex items-center justify-center
          w-6 h-6 rounded-full text-xs font-bold border
          ${badgeColor}
        `}>
          {citeKey}
        </span>
        <SourceIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className={`min-w-0 break-words text-left ${open ? 'text-foreground' : 'text-muted-foreground'}`}>{source}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-muted-foreground">
          <ChevronDown className="size-4" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`mt-2 rounded-lg border-l-4 ${accent} p-4`}>
              {href && (
                <a href={href} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-blue-400 hover:underline mb-2 block">{href}</a>
              )}
              <div className={`text-sm leading-relaxed ${type === 'code' ? 'font-mono' : ''}`}>
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
