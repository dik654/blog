import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── InlineCitation ──────────────────────────────────────────────
   본문 해당 부분 옆에 배치하여, 클릭하면 논문 발췌/코드를 보여주는 컴포넌트.

   Usage:
     <Citation source="PagedAttention 논문, SOSP 2023" citeKey={1}>
       <p>"We propose PagedAttention, an attention algorithm inspired by
        the classic idea of virtual memory and paging in operating systems."</p>
     </Citation>

   또는 코드 스니펫:
     <Citation source="vllm/v1/engine/core.py" citeKey={2} type="code">
       <pre><code>{`class EngineCore:\n  def __init__(self):\n    ...`}</code></pre>
     </Citation>
────────────────────────────────────────────────────────────── */

interface CitationProps {
  /** 출처 라벨 (논문명, 파일 경로 등) */
  source: string;
  /** 숫자 키 (상위 번호) */
  citeKey: number;
  /** 'paper' | 'code' — 스타일 분기 */
  type?: 'paper' | 'code';
  /** 발췌 내용 */
  children: ReactNode;
  /** 선택적 URL */
  href?: string;
}

export function Citation({ source, citeKey, type = 'paper', children, href }: CitationProps) {
  const [open, setOpen] = useState(false);

  const accent = type === 'code'
    ? 'border-emerald-500/40 bg-emerald-500/5'
    : 'border-blue-500/40 bg-blue-500/5';

  const badgeColor = type === 'code'
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : 'bg-blue-500/15 text-blue-400 border-blue-500/30';

  const icon = type === 'code' ? '</>' : '📄';

  return (
    <span className="inline-flex items-baseline gap-0.5">
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

      {/* Portal-free inline popover — AnimatePresence를 block level로 렌더 */}
      <AnimatePresence>
        {open && (
          <motion.span
            className="block w-full"
            style={{ display: 'block', position: 'relative' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 아래 CitationBox에서 실제 렌더 */}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ── CitationBlock ───────────────────────────────────────────
   본문 아래에 배치하는 블록형 citation.
   문단 끝이나 <pre> 블록 아래에 두기 좋은 형태.
──────────────────────────────────────────────────────────── */

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

  const icon = type === 'code' ? '</>' : '📄';

  return (
    <div className="not-prose my-3">
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5
          rounded-lg border text-xs font-medium
          cursor-pointer select-none transition-all duration-200
          ${open ? accent + ' border-opacity-100' : 'bg-muted/50 border-border hover:bg-muted'}
        `}
      >
        <span className={`
          inline-flex items-center justify-center
          w-5 h-5 rounded-full text-[10px] font-bold border
          ${badgeColor}
        `}>
          {citeKey}
        </span>
        <span className="text-muted-foreground">{icon}</span>
        <span className={open ? 'text-foreground' : 'text-muted-foreground'}>
          {source}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          ▾
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
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline mb-2 block"
                >
                  {href}
                </a>
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
