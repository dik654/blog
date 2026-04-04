import { useState } from 'react';
import { motion } from 'framer-motion';
import { modules } from './archData';
import MsgsList from './MsgsList';

export function Node({ id, sel, connected, flowActive, onSelect }: {
  id: string; sel: string | null; connected: Set<string>; flowActive: Set<string>; onSelect: (id: string) => void;
}) {
  const mod = modules[id];
  const active = sel === id;
  const flow = !active && flowActive.has(id);
  const conn = !active && !flow && connected.has(id);
  return (
    <button onClick={() => onSelect(id)}
      className={`rounded-lg border-2 p-2.5 text-left transition-colors cursor-pointer w-full min-w-0
        ${active  ? 'border-foreground bg-foreground/10 shadow-sm'
          : flow  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm'
          : conn  ? 'border-sky-400 bg-sky-50/60 dark:bg-sky-950/20'
          :         'border-border bg-card hover:border-foreground/30'}`}>
      <p className="text-xs font-bold leading-tight">{mod.label}</p>
      <p className="text-[10px] text-foreground/75 mt-0.5 leading-tight">{mod.role}</p>
      <div className="mt-1.5 border-t border-border/50 pt-1.5">
        <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400 leading-tight truncate">{mod.fns[0].sig}</p>
        <p className="text-[10px] text-foreground/75 leading-tight mt-0.5 line-clamp-2">{mod.fns[0].desc}</p>
      </div>
    </button>
  );
}

export function HArrow({ label, dir = '→', animated = false, msgs }: {
  label: string; dir?: '→' | '←' | '↔'; animated?: boolean; msgs?: string[];
}) {
  const [open, setOpen] = useState(false);
  const shimmer = dir === '←' ? { x: ['150%', '-50%'] } : { x: ['-50%', '150%'] };
  return (
    <div className="relative flex flex-col items-center justify-center px-2 shrink-0 min-w-[60px] gap-1">
      <button onClick={() => msgs && setOpen(o => !o)}
        className={`text-[9px] text-foreground/75 text-center leading-none whitespace-nowrap ${msgs ? 'hover:text-foreground cursor-pointer' : 'cursor-default'}`}>
        {label}{msgs ? (open ? ' ▲' : ' ▼') : ''}
      </button>
      <div className="relative w-full h-5 flex items-center">
        <div className="absolute inset-x-3 h-px overflow-hidden">
          <div className={`absolute inset-0 transition-colors ${animated ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-border'}`} />
          {animated && (
            <motion.div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
              animate={shimmer} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} />
          )}
        </div>
        {(dir === '→' || dir === '↔') && <span className={`absolute right-0 text-[9px] leading-none transition-colors ${animated ? 'text-emerald-500' : 'text-muted-foreground'}`}>▶</span>}
        {(dir === '←' || dir === '↔') && <span className={`absolute left-0 text-[9px] leading-none transition-colors ${animated ? 'text-emerald-500' : 'text-muted-foreground'}`}>◀</span>}
      </div>
      {open && msgs && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 z-20 w-max max-w-2xl mt-1">
          <MsgsList msgs={msgs} />
        </div>
      )}
    </div>
  );
}

export function VConn({ label, animated = false, msgs }: { label: string; animated?: boolean; msgs?: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col items-center gap-0.5 py-1">
      <span className={`text-[9px] leading-none transition-colors ${animated ? 'text-emerald-500' : 'text-muted-foreground'}`}>▲</span>
      <div className="relative w-px h-5 overflow-hidden">
        <div className={`absolute inset-0 transition-colors ${animated ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-border'}`} />
        {animated && (
          <motion.div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-emerald-500 to-transparent"
            animate={{ y: ['-60%', '160%', '-60%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
        )}
      </div>
      <span className={`text-[9px] leading-none transition-colors ${animated ? 'text-emerald-500' : 'text-muted-foreground'}`}>▼</span>
      <button onClick={() => msgs && setOpen(o => !o)}
        className={`text-[9px] leading-tight whitespace-nowrap transition-colors text-center
          ${animated ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}
          ${msgs ? 'hover:text-foreground cursor-pointer' : 'cursor-default'}`}>
        {label}{msgs ? (open ? ' ▲' : ' ▼') : ''}
      </button>
      {open && msgs && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 z-20 w-max max-w-2xl mt-1">
          <MsgsList msgs={msgs} />
        </div>
      )}
    </div>
  );
}
