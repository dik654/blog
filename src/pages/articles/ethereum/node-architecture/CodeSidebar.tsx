import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CodeRef } from './archCodeRefs';
import { codeRefs } from './archCodeRefs';
import { lighthouseTree, rethTree } from './archFileTrees';
import FileTree from './FileTree';
import { flowData } from './archFlowData';
import CodeSidebarHeader, { CodeSidebarDesc } from './CodeSidebarHeader';
import AnnotationLegend from './AnnotationLegend';
import CodeTable from './CodeTable';
import CodeSidebarFlowPanel from './CodeSidebarFlowPanel';

export default function CodeSidebar({
  codeRefKey: initialKey, codeRef: initialRef, onClose, onNavigate,
}: {
  codeRefKey: string | null; codeRef: CodeRef | null;
  onClose: () => void; onNavigate: (key: string, ref: CodeRef) => void;
}) {
  const [currentKey, setCurrentKey]   = useState<string | null>(initialKey);
  const [currentRef, setCurrentRef]   = useState<CodeRef | null>(initialRef);
  const [descOpen, setDescOpen]       = useState(true);
  const [codeOpen, setCodeOpen]       = useState(true);
  const [flowOpen, setFlowOpen]       = useState(false);
  const [pendingLine, setPendingLine] = useState<number | null>(null);
  const hlRef      = useRef<HTMLTableRowElement | null>(null);
  const codeScroll = useRef<HTMLDivElement>(null);
  const annotRefs  = useRef<Map<number, HTMLTableRowElement>>(new Map());

  useEffect(() => { setCurrentKey(initialKey); setCurrentRef(initialRef); setDescOpen(true); setCodeOpen(true); setFlowOpen(false); annotRefs.current.clear(); }, [initialKey, initialRef]);
  useEffect(() => { if (currentRef && hlRef.current) hlRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [currentRef?.path]);
  useEffect(() => { if (codeOpen && pendingLine !== null) { annotRefs.current.get(pendingLine)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); setPendingLine(null); } }, [codeOpen, pendingLine]);

  const codeRef = currentRef;
  const isReth = codeRef?.path.startsWith('reth/') ?? false;
  const tree = isReth ? rethTree : lighthouseTree;
  const lineCount = codeRef?.code.split('\n').length ?? 0;
  const annotations = codeRef?.annotations ?? [];
  const flowNodes = currentKey ? flowData[currentKey] : undefined;

  const handleFlowNavigate = (key: string) => {
    const ref = codeRefs[key]; if (!ref) return;
    setCurrentKey(key); setCurrentRef(ref); setFlowOpen(false); annotRefs.current.clear(); onNavigate(key, ref);
  };
  const handleAnnotClick = (startLine: number) => {
    setFlowOpen(true);
    if (!codeOpen) { setCodeOpen(true); setPendingLine(startLine); }
    else annotRefs.current.get(startLine)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {initialRef && (
        <>
          <motion.div key="bd" className="fixed inset-0 z-40 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside key="panel" className="fixed top-0 right-0 z-50 h-full w-full max-w-[1100px] flex flex-col bg-white dark:bg-[#0d1117] border-l border-[#d0d7de] dark:border-[#30363d] shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            {codeRef && <CodeSidebarHeader codeRef={codeRef} isReth={isReth} lineCount={lineCount} onClose={onClose} />}
            {codeRef?.desc && <CodeSidebarDesc desc={codeRef.desc} descOpen={descOpen} setDescOpen={setDescOpen} />}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <button onClick={() => setCodeOpen(v => !v)}
                className="w-full flex items-center gap-2 px-4 py-1.5 bg-[#f6f8fa] dark:bg-[#161b22] border-b border-[#d0d7de] dark:border-[#30363d] hover:bg-[#eaf2ff] dark:hover:bg-[#1c2d4a] transition-colors cursor-pointer text-left shrink-0">
                <span className="text-[10px]">{ }</span>
                <span className="text-[11px] font-semibold text-[#24292f] dark:text-[#e6edf3]">소스 코드</span>
                <span className="ml-auto text-[10px] text-[#57606a] dark:text-[#8b949e]">{codeOpen ? '▼ 접기' : '▶ 펼치기'}</span>
              </button>
              <AnimatePresence>
                {codeOpen && (
                  <motion.div key="code-area" initial={{ height: 0, opacity: 0 }} animate={{ height: flowOpen ? '55%' : '100%', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="flex overflow-hidden min-h-0 shrink-0">
                    <div className="w-[200px] shrink-0 border-r border-[#d0d7de] dark:border-[#30363d] overflow-y-auto bg-[#f6f8fa] dark:bg-[#161b22]">
                      <div className="px-3 py-2 border-b border-[#d0d7de] dark:border-[#30363d]">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]">{isReth ? 'reth / crates' : 'lighthouse'}</p>
                      </div>
                      <FileTree root={tree} currentPath={codeRef?.path ?? ''} onSelect={key => { const r = codeRefs[key]; if (r) handleFlowNavigate(key); }} />
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0d1117]">
                      <AnnotationLegend annotations={annotations} flowNodes={flowNodes} onAnnotClick={handleAnnotClick} />
                      <div ref={codeScroll} className="flex-1 overflow-auto" style={{ overscrollBehavior: 'contain' }}>
                        {codeRef && <CodeTable codeRef={codeRef} annotations={annotations} flowNodes={flowNodes} hlRef={hlRef} annotRefs={annotRefs} onFlowOpen={() => setFlowOpen(true)} />}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {flowNodes && <CodeSidebarFlowPanel flowNodes={flowNodes} flowOpen={flowOpen} setFlowOpen={setFlowOpen} onNavigate={handleFlowNavigate} />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
