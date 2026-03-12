import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CodeRef, LineNote } from './archCodeRefs';
import { codeRefs } from './archCodeRefs';
import { lighthouseTree, rethTree } from './archFileTrees';
import FileTree from './FileTree';
import FlowDiagram from './FlowDiagram';
import { flowData } from './archFlowData';
import RustLine from './RustLine';

const COLORS: Record<LineNote['color'], {
  bg: string; border: string; badgeBg: string; badgeText: string; dot: string;
}> = {
  sky:     { bg: 'rgba(14,165,233,0.09)',  border: '#0ea5e9', badgeBg: '#e0f2fe', badgeText: '#0369a1', dot: '#0ea5e9' },
  emerald: { bg: 'rgba(16,185,129,0.09)',  border: '#10b981', badgeBg: '#d1fae5', badgeText: '#065f46', dot: '#10b981' },
  amber:   { bg: 'rgba(245,158,11,0.09)',  border: '#f59e0b', badgeBg: '#fef3c7', badgeText: '#92400e', dot: '#f59e0b' },
  violet:  { bg: 'rgba(139,92,246,0.09)',  border: '#8b5cf6', badgeBg: '#ede9fe', badgeText: '#4c1d95', dot: '#8b5cf6' },
  rose:    { bg: 'rgba(244,63,94,0.09)',   border: '#f43f5e', badgeBg: '#ffe4e6', badgeText: '#881337', dot: '#f43f5e' },
};
const CIRCLES = ['①', '②', '③', '④', '⑤', '⑥'];

export default function CodeSidebar({
  codeRefKey: initialKey, codeRef: initialRef, onClose, onNavigate,
}: {
  codeRefKey: string | null;
  codeRef: CodeRef | null;
  onClose: () => void;
  onNavigate: (key: string, ref: CodeRef) => void;
}) {
  const [currentKey, setCurrentKey]   = useState<string | null>(initialKey);
  const [currentRef, setCurrentRef]   = useState<CodeRef | null>(initialRef);
  const [descOpen, setDescOpen]       = useState(true);
  const [codeOpen, setCodeOpen]       = useState(true);
  const [flowOpen, setFlowOpen]       = useState(false);
  const [pendingLine, setPendingLine] = useState<number | null>(null);

  const hlRef      = useRef<HTMLTableRowElement>(null);
  const codeScroll = useRef<HTMLDivElement>(null);
  const annotRefs  = useRef<Map<number, HTMLTableRowElement>>(new Map());

  // 외부 props가 바뀌면 (다른 모듈 클릭) 동기화
  useEffect(() => {
    setCurrentKey(initialKey);
    setCurrentRef(initialRef);
    setDescOpen(true);
    setCodeOpen(true);
    setFlowOpen(false);
    annotRefs.current.clear();
  }, [initialKey, initialRef]);

  // 코드 ref가 바뀌면 하이라이트 라인으로 스크롤
  useEffect(() => {
    if (currentRef && hlRef.current)
      hlRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [currentRef?.path]);

  // 코드가 열리면 pendingLine으로 스크롤
  useEffect(() => {
    if (codeOpen && pendingLine !== null) {
      annotRefs.current.get(pendingLine)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setPendingLine(null);
    }
  }, [codeOpen, pendingLine]);

  const codeRef    = currentRef;
  const codeRefKey = currentKey;
  const isReth     = codeRef?.path.startsWith('reth/');
  const tree       = isReth ? rethTree : lighthouseTree;
  const lineCount  = codeRef?.code.split('\n').length ?? 0;
  const annotations = codeRef?.annotations ?? [];
  const flowNodes  = codeRefKey ? flowData[codeRefKey] : undefined;

  const handleFlowNavigate = (key: string) => {
    const ref = codeRefs[key];
    if (!ref) return;
    setCurrentKey(key);
    setCurrentRef(ref);
    setFlowOpen(false);
    annotRefs.current.clear();
    onNavigate(key, ref);
  };

  const handleAnnotClick = (startLine: number) => {
    setFlowOpen(true);
    if (!codeOpen) {
      setCodeOpen(true);
      setPendingLine(startLine);
    } else {
      annotRefs.current.get(startLine)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {initialRef && (
        <>
          <motion.div key="bd" className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />

          <motion.aside key="panel"
            className="fixed top-0 right-0 z-50 h-full w-full max-w-[1100px] flex flex-col bg-white dark:bg-[#0d1117] border-l border-[#d0d7de] dark:border-[#30363d] shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] shrink-0">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${isReth ? 'bg-[#fff3cd] border-[#d4a72c] text-[#7d4e00]' : 'bg-[#ddf4ff] border-[#54aeff] text-[#0550ae]'}`}>
                {isReth ? 'Reth · EL' : 'Lighthouse · CL'}
              </span>
              <code className="flex-1 text-[11px] text-[#24292f] dark:text-[#e6edf3] font-mono truncate min-w-0">{codeRef?.path}</code>
              <span className="text-[10px] text-[#57606a] dark:text-[#8b949e] shrink-0">
                {lineCount} lines · L{codeRef?.highlight[0]}–{codeRef?.highlight[1]}
              </span>
              <button onClick={onClose}
                className="shrink-0 ml-2 rounded-md px-2 py-0.5 text-xs border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#e6edf3] hover:bg-[#f3f4f6] dark:hover:bg-[#21262d] cursor-pointer transition-colors">
                ✕
              </button>
            </div>

            {/* Korean desc (접기 가능) */}
            {codeRef?.desc && (
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
                        <p className="text-[12px] text-[#3d2900] dark:text-[#ffd966] leading-relaxed whitespace-pre-line">{codeRef.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">

              {/* 코드 섹션 토글 바 */}
              <button onClick={() => setCodeOpen(v => !v)}
                className="w-full flex items-center gap-2 px-4 py-1.5 bg-[#f6f8fa] dark:bg-[#161b22] border-b border-[#d0d7de] dark:border-[#30363d] hover:bg-[#eaf2ff] dark:hover:bg-[#1c2d4a] transition-colors cursor-pointer text-left shrink-0">
                <span className="text-[10px]">{ }</span>
                <span className="text-[11px] font-semibold text-[#24292f] dark:text-[#e6edf3]">소스 코드</span>
                <span className="ml-auto text-[10px] text-[#57606a] dark:text-[#8b949e]">{codeOpen ? '▼ 접기' : '▶ 펼치기'}</span>
              </button>

              {/* 코드 영역 (접기 가능) */}
              <AnimatePresence>
                {codeOpen && (
                  <motion.div key="code-area"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: flowOpen ? '55%' : '100%', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="flex overflow-hidden min-h-0 shrink-0">

                    {/* file tree */}
                    <div className="w-[200px] shrink-0 border-r border-[#d0d7de] dark:border-[#30363d] overflow-y-auto bg-[#f6f8fa] dark:bg-[#161b22]">
                      <div className="px-3 py-2 border-b border-[#d0d7de] dark:border-[#30363d]">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]">
                          {isReth ? 'reth / crates' : 'lighthouse'}
                        </p>
                      </div>
                      <FileTree root={tree} currentPath={codeRef?.path ?? ''}
                        onSelect={key => { const r = codeRefs[key]; if (r) handleFlowNavigate(key); }} />
                    </div>

                    {/* code panel */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0d1117]">

                      {/* annotation legend */}
                      {annotations.length > 0 && (
                        <div className="shrink-0 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] px-4 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]">코드 구간 설명</p>
                            {flowNodes && <span className="text-[9px] text-[#0969da] dark:text-[#58a6ff]">클릭 → 해당 줄 이동 + 흐름 탐색</span>}
                          </div>
                          {annotations.map((a, idx) => {
                            const c = COLORS[a.color];
                            return (
                              <div key={idx}
                                className="flex items-baseline gap-2 rounded px-1 -mx-1 py-0.5 cursor-pointer hover:bg-[#e8f0fe] dark:hover:bg-[#1c2d4a] transition-colors"
                                onClick={() => handleAnnotClick(a.lines[0])}>
                                <span className="shrink-0 text-[11px] font-bold" style={{ color: c.dot }}>{CIRCLES[idx]}</span>
                                <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded"
                                  style={{ background: c.badgeBg, color: c.badgeText }}>L{a.lines[0]}–{a.lines[1]}</span>
                                <span className="text-[11px] text-[#24292f] dark:text-[#e6edf3] leading-snug">{a.note}</span>
                                <span className="ml-auto text-[9px] text-[#0969da] dark:text-[#58a6ff] shrink-0">↵</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* code table */}
                      <div ref={codeScroll} className="flex-1 overflow-auto" style={{ overscrollBehavior: 'contain' }}>
                        <table className="w-full border-collapse font-mono text-[12px] leading-5">
                          <tbody>
                            {codeRef?.code.split('\n').map((line, i) => {
                              const ln      = i + 1;
                              const annot   = annotations.find(a => ln >= a.lines[0] && ln <= a.lines[1]);
                              const annotIdx = annot ? annotations.indexOf(annot) : -1;
                              const isStart = annot && ln === annot.lines[0];
                              const hl      = !annot && codeRef && ln >= codeRef.highlight[0] && ln <= codeRef.highlight[1];
                              const c       = annot ? COLORS[annot.color] : null;
                              return (
                                <tr key={ln}
                                  ref={el => {
                                    if (ln === codeRef?.highlight[0]) (hlRef as React.MutableRefObject<HTMLTableRowElement | null>).current = el;
                                    if (isStart && el) annotRefs.current.set(ln, el);
                                  }}
                                  style={c ? { backgroundColor: c.bg } : hl ? { backgroundColor: 'rgb(255,251,204)' } : undefined}
                                  className={`${!c && !hl ? 'hover:bg-[#f6f8fa] dark:hover:bg-[#161b22]' : ''} ${c && flowNodes ? 'cursor-pointer' : ''}`}
                                  onClick={c && flowNodes ? () => setFlowOpen(true) : undefined}
                                >
                                  <td className="select-none text-right pr-2 pl-4 py-0 text-[11px] text-[#57606a] dark:text-[#636e7b] w-16 align-top border-r border-[#eaecef] dark:border-[#21262d]">
                                    <span className="flex items-center justify-end gap-1">
                                      {isStart && <span className="text-[10px] font-bold leading-none" style={{ color: c!.dot }}>{CIRCLES[annotIdx]}</span>}
                                      <span>{ln}</span>
                                    </span>
                                  </td>
                                  <td className="pl-5 pr-5 py-0 whitespace-pre align-top text-[#24292f] dark:text-[#e6edf3]"
                                    style={c ? { borderLeft: `3px solid ${c.border}` } : hl ? { borderLeft: '3px solid #d4a72c' } : { paddingLeft: '23px' }}>
                                    <RustLine text={line} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 호출 흐름 패널 */}
              {flowNodes && (
                <div className="border-t border-[#d0d7de] dark:border-[#30363d] flex flex-col min-h-0"
                  style={{ flex: flowOpen ? '1 1 0' : '0 0 auto' }}>
                  <button onClick={() => setFlowOpen(v => !v)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-[#f6f8fa] dark:bg-[#161b22] hover:bg-[#eaf2ff] dark:hover:bg-[#1c2d4a] transition-colors cursor-pointer text-left shrink-0">
                    <span className="text-[11px]">⬡</span>
                    <span className="text-[11px] font-semibold text-[#0969da] dark:text-[#58a6ff]">호출 흐름 탐색</span>
                    {!flowOpen && <span className="text-[10px] text-[#57606a] dark:text-[#8b949e] ml-1">— 색상 구간 클릭 또는 여기서 열기</span>}
                    <span className="ml-auto text-[10px] text-[#57606a] dark:text-[#8b949e]">{flowOpen ? '▼ 닫기' : '▲ 열기'}</span>
                  </button>
                  <AnimatePresence>
                    {flowOpen && (
                      <motion.div key="flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="bg-[#f6f8fa] dark:bg-[#161b22] min-h-0"
                        style={{ flex: '1 1 0', overflowY: 'auto', overscrollBehavior: 'contain' }}>
                        <FlowDiagram nodes={flowNodes} onNavigate={handleFlowNavigate} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
