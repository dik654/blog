import { AnimatePresence, motion } from 'framer-motion';
import type { CodeRef, ProjectMeta } from './types';

export default function CodeSidebarHeader({
  codeRef, projectMeta, lineCount, onClose,
}: {
  codeRef: CodeRef; projectMeta?: ProjectMeta; lineCount: number; onClose: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] shrink-0">
      {projectMeta && (
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${projectMeta.badgeClass}`}>
          {projectMeta.label}
        </span>
      )}
      <code className="flex-1 text-[11px] text-[#24292f] dark:text-[#e6edf3] font-mono truncate min-w-0">{codeRef.path}</code>
      <span className="text-[10px] text-[#57606a] dark:text-[#8b949e] shrink-0">
        {lineCount} lines · L{codeRef.highlight[0]}–{codeRef.highlight[1]}
      </span>
      <button onClick={onClose}
        className="shrink-0 ml-2 rounded-md px-2 py-0.5 text-xs border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#e6edf3] hover:bg-[#f3f4f6] dark:hover:bg-[#21262d] cursor-pointer transition-colors">
        ✕
      </button>
    </div>
  );
}

export function CodeSidebarDesc({
  desc, descOpen, setDescOpen,
}: {
  desc: string; descOpen: boolean; setDescOpen: (fn: (v: boolean) => boolean) => void;
}) {
  return (
    <div className="shrink-0 border-b border-[#d0d7de] dark:border-[#30363d]">
      <button onClick={() => setDescOpen(v => !v)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-[#fffbeb] dark:bg-[#2d2200] hover:bg-[#fff3cd] dark:hover:bg-[#3d2f00] transition-colors cursor-pointer text-left">
        <span className="text-[11px] font-semibold text-[#7d4e00] dark:text-[#e3a000]">코드 해설</span>
        <span className="ml-auto text-[10px] text-[#92400e] dark:text-[#d97706]">{descOpen ? '▲ 접기' : '▼ 펼치기'}</span>
      </button>
      <AnimatePresence>
        {descOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-3 bg-[#fffbeb] dark:bg-[#2d2200]">
              <p className="text-[12px] text-[#3d2900] dark:text-[#ffd966] leading-relaxed whitespace-pre-line">{desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
