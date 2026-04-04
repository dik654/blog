import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { FlowNode, CodeRef } from './types';
import { COLORS } from './codeSidebarData';
import CodePreview from './CodePreview';

const SLATE = { bg: 'rgba(100,116,139,0.09)', border: '#94a3b8', badgeText: '#334155' };
const anim = { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' as const }, exit: { opacity: 0, height: 0 } };

function getColor(color: FlowNode['color']) {
  if (color === 'slate') return { border: SLATE.border, bg: SLATE.bg, text: SLATE.badgeText };
  const c = COLORS[color];
  return { border: c.border, bg: c.bg, text: c.badgeText };
}

export function Arrow() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <div className="w-px h-3 bg-border/60" />
      <span className="text-[9px] text-foreground/75 leading-none">&#8595;</span>
    </div>
  );
}

const btnBase = 'text-[9px] px-1.5 py-0.5 rounded border cursor-pointer leading-none';

export default function FlowNodeCard({ node, depth = 0, onNavigate, codeRefs }: {
  node: FlowNode; depth?: number; onNavigate?: (key: string) => void;
  codeRefs: Record<string, CodeRef>;
}) {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const c = getColor(node.color);
  const hasChildren = !!(node.children?.length);
  const ref = node.codeRefKey ? codeRefs[node.codeRefKey] : undefined;

  return (
    <div className="w-full">
      <div className="rounded-lg border px-3 py-2.5 select-none"
        style={{ borderLeftWidth: 4, borderLeftColor: c.border, background: c.bg, borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <code className="text-[11px] font-bold block font-mono leading-tight" style={{ color: c.text }}>{node.fn}</code>
            <p className="text-[11px] text-foreground/80 mt-0.5 leading-snug">{node.desc}</p>
            <AnimatePresence>
              {showDetail && node.detail && (
                <motion.p {...anim} className="text-[10px] text-foreground/75 mt-1.5 leading-relaxed whitespace-pre-line overflow-hidden">
                  {node.detail}
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showCode && ref && (
                <motion.div {...anim} className="overflow-hidden"><CodePreview codeRef={ref} /></motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {node.codeRefKey && onNavigate && (
              <button onClick={(e) => { e.stopPropagation(); onNavigate(node.codeRefKey!); }}
                className={`${btnBase} font-semibold`}
                style={{ borderColor: c.border, color: c.text, background: 'rgba(255,255,255,0.7)' }}
                title="전체 코드 뷰로 이동">&#8599; 소스</button>
            )}
            {ref && (
              <button onClick={() => setShowCode(v => !v)} className={btnBase}
                style={{ borderColor: c.border, color: c.text }}>{showCode ? '코드 닫기' : '코드'}</button>
            )}
            {node.detail && (
              <button onClick={() => setShowDetail(v => !v)} className={btnBase}
                style={{ borderColor: c.border, color: c.text }}>{showDetail ? '닫기' : '상세'}</button>
            )}
            {hasChildren && (
              <button onClick={() => setOpen(v => !v)}
                className="text-[9px] px-1.5 py-0.5 rounded cursor-pointer leading-none text-foreground/75 border border-border hover:bg-accent">
                {open ? '접기' : '내부 보기'}</button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && hasChildren && (
          <motion.div {...anim} className="overflow-hidden">
            <div className="ml-5 mt-1 pl-3 border-l-2 border-dashed border-border/60">
              {node.children!.map((child, i) => (
                <div key={child.id}>
                  {i > 0 && <Arrow />}
                  <FlowNodeCard node={child} depth={depth + 1} onNavigate={onNavigate} codeRefs={codeRefs} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
