import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { highlightPython } from './python-highlight';

export interface Annotation {
  lines: [number, number];
  color: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose';
  note: string;
}

interface Props {
  title: string;
  code: string;
  lang?: string;
  annotations?: Annotation[];
  defaultOpen?: boolean;
  startLine?: number;
}

export const COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  sky:     { bg: 'rgba(14,165,233,0.08)', border: '#0ea5e9', badge: 'bg-sky-500/15 text-sky-400' },
  emerald: { bg: 'rgba(16,185,129,0.08)', border: '#10b981', badge: 'bg-emerald-500/15 text-emerald-400' },
  amber:   { bg: 'rgba(245,158,11,0.08)', border: '#f59e0b', badge: 'bg-amber-500/15 text-amber-400' },
  violet:  { bg: 'rgba(139,92,246,0.08)', border: '#8b5cf6', badge: 'bg-violet-500/15 text-violet-400' },
  rose:    { bg: 'rgba(244,63,94,0.08)',  border: '#f43f5e', badge: 'bg-rose-500/15 text-rose-400' },
};

function renderLine(line: string, lang?: string): ReactNode {
  if (lang === 'python') return highlightPython(line);
  return line;
}

export default function CodePanel({ title, code, lang, annotations, defaultOpen = false, startLine = 1 }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const lines = code.trimEnd().split('\n');

  const getAnnotation = (lineNum: number) =>
    annotations?.find((a) => lineNum >= a.lines[0] && lineNum <= a.lines[1]);

  return (
    <div className="not-prose my-4 rounded-lg border border-border/60 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-accent transition-colors cursor-pointer text-left"
      >
        <span className="text-xs font-mono text-muted-foreground">{'</>'}</span>
        <span className="text-sm font-medium text-foreground/80 flex-1">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-muted-foreground text-xs">▾</motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            {annotations && annotations.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-border/40">
                {annotations.map((a, i) => (
                  <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${COLORS[a.color].badge}`}>
                    L{a.lines[0]}–{a.lines[1]}: {a.note}
                  </span>
                ))}
              </div>
            )}
            <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
              <table className="w-full text-xs font-mono leading-relaxed">
                <tbody>
                  {lines.map((line, i) => {
                    const num = startLine + i;
                    const ann = getAnnotation(num);
                    return (
                      <tr key={num} style={ann ? { background: COLORS[ann.color].bg, borderLeft: `2px solid ${COLORS[ann.color].border}` } : undefined}>
                        <td className="text-right pr-3 pl-3 py-0 text-muted-foreground/40 select-none w-8">{num}</td>
                        <td className="pr-4 py-0 whitespace-pre text-foreground/80">{renderLine(line, lang)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
