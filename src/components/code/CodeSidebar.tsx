import { useEffect, useRef, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion';
import type { CodeRef, FileNode, FlowNode, ProjectMeta } from './types';
import FileTree from './FileTree';
import CodeSidebarHeader, { CodeSidebarDesc } from './CodeSidebarHeader';
import AnnotationLegend from './AnnotationLegend';
import CodeTable from './CodeTable';
import CodeSidebarFlowPanel from './CodeSidebarFlowPanel';

export default function CodeSidebar({
  codeRefKey: initialKey, codeRef: initialRef, onClose, onNavigate,
  codeRefs, fileTrees, projectMetas, flowData,
  FlowDiagram,
}: {
  codeRefKey: string | null; codeRef: CodeRef | null;
  onClose: () => void; onNavigate: (key: string, ref: CodeRef) => void;
  codeRefs: Record<string, CodeRef>;
  fileTrees: Record<string, FileNode>;
  projectMetas?: Record<string, ProjectMeta>;
  flowData?: Record<string, FlowNode[]>;
  FlowDiagram?: ComponentType<{ nodes: FlowNode[]; onNavigate?: (key: string) => void }>;
}) {
  const [currentKey, setCurrentKey] = useState<string | null>(initialKey);
  const [currentRef, setCurrentRef] = useState<CodeRef | null>(initialRef);
  const [descOpen, setDescOpen] = useState(true);
  const [codeOpen, setCodeOpen] = useState(true);
  const [flowOpen, setFlowOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  );
  const [pendingLine, setPendingLine] = useState<number | null>(null);
  const hlRef = useRef<HTMLTableRowElement | null>(null);
  const codeScroll = useRef<HTMLDivElement>(null);
  const annotRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const mobileDragControls = useDragControls();

  useEffect(() => {
    setCurrentKey(initialKey);
    setCurrentRef(initialRef);
    setDescOpen(!isMobile);
    setCodeOpen(true);
    setFlowOpen(false);
    setFilesOpen(false);
    setMobileExpanded(isMobile);
    annotRefs.current.clear();
  }, [initialKey, initialRef, isMobile]);
  useEffect(() => { if (currentRef && hlRef.current) hlRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [currentRef?.path]);
  useEffect(() => { if (codeOpen && pendingLine !== null) { annotRefs.current.get(pendingLine)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); setPendingLine(null); } }, [codeOpen, pendingLine]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(query.matches);
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // 모바일: 패널 열려있는 동안 배경 body 스크롤 잠금 (drawer 내 스크롤이 경계에 닿을 때 본문이 따라 움직이는 것 방지)
  useEffect(() => {
    if (!initialRef) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [initialRef]);

  // ESC 로 닫기 (모바일 hardware back 대비)
  useEffect(() => {
    if (!initialRef) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [initialRef, onClose]);

  const codeRef = currentRef;
  const projectId = codeRef?.path.split('/')[0] ?? '';
  const tree = fileTrees[projectId];
  const meta = projectMetas?.[projectId];
  const lineCount = codeRef?.code.split('\n').length ?? 0;
  const annotations = codeRef?.annotations ?? [];
  const flowNodes = currentKey && flowData ? flowData[currentKey] : undefined;

  const handleNav = (key: string) => {
    const ref = codeRefs[key]; if (!ref) return;
    setCurrentKey(key); setCurrentRef(ref); setFlowOpen(false); setFilesOpen(false); annotRefs.current.clear(); onNavigate(key, ref);
  };
  const handleAnnotClick = (startLine: number) => {
    setFlowOpen(true);
    if (!codeOpen) { setCodeOpen(true); setPendingLine(startLine); }
    else annotRefs.current.get(startLine)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  const handleMobileDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldMoveDown = info.offset.y > 90 || info.velocity.y > 700;
    const shouldMoveUp = info.offset.y < -45 || info.velocity.y < -500;

    if (shouldMoveUp) {
      setMobileExpanded(true);
      return;
    }

    if (shouldMoveDown) {
      if (mobileExpanded) setMobileExpanded(false);
      else onClose();
    }
  };

  return (
    <AnimatePresence>
      {initialRef && (
        <>
          <motion.div key="bd" className="fixed inset-0 z-40 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          {isMobile ? (
            <motion.aside key="mobile-panel" className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-lg border border-b-0 border-[#d0d7de] bg-white shadow-2xl overscroll-contain dark:border-[#30363d] dark:bg-[#0d1117]"
              style={{ touchAction: 'pan-y' }}
              drag="y" dragControls={mobileDragControls} dragListener={false} dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.08, bottom: 0.35 }} onDragEnd={handleMobileDragEnd}
              initial={{ y: '100%', height: '78dvh' }} animate={{ y: 0, height: mobileExpanded ? '92dvh' : '78dvh' }}
              exit={{ y: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 320 }}>
              <div className="shrink-0 border-b border-[#d0d7de] bg-[#f6f8fa] px-3 pb-2 pt-1.5 dark:border-[#30363d] dark:bg-[#161b22]">
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="코드 해설 패널 높이 조절"
                  onPointerDown={(event) => mobileDragControls.start(event)}
                  className="mx-auto mb-1 h-4 w-16 touch-none cursor-grab rounded-full py-1 active:cursor-grabbing"
                >
                  <div className="mx-auto h-1 w-9 rounded-full bg-[#d0d7de] dark:bg-[#30363d]" />
                </div>
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1.5">
                      {meta && (
                        <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                      )}
                      <span className="text-[10px] text-[#57606a] dark:text-[#8b949e]">
                        {lineCount} lines · L{codeRef?.highlight[0]}-{codeRef?.highlight[1]}
                      </span>
                    </div>
                    <code className="block truncate font-mono text-[11px] text-[#24292f] dark:text-[#e6edf3]">{codeRef?.path}</code>
                  </div>
                  <button onClick={onClose}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[#d0d7de] text-sm text-[#24292f] transition-colors hover:bg-[#f3f4f6] dark:border-[#30363d] dark:text-[#e6edf3] dark:hover:bg-[#21262d]">
                    ✕
                  </button>
                </div>
              </div>
              {codeRef?.desc && <CodeSidebarDesc desc={codeRef.desc} descOpen={descOpen} setDescOpen={setDescOpen} />}
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {tree && (
                  <div className="shrink-0 border-b border-[#d0d7de] dark:border-[#30363d]">
                    <button onClick={() => setFilesOpen(v => !v)}
                      className="flex w-full items-center gap-2 bg-[#f6f8fa] px-3 py-2 text-left transition-colors hover:bg-[#eaf2ff] dark:bg-[#161b22] dark:hover:bg-[#1c2d4a]">
                      <span className="font-mono text-[10px] font-semibold uppercase text-[#57606a] dark:text-[#8b949e]">{projectId}</span>
                      <span className="ml-auto text-[10px] text-[#57606a] dark:text-[#8b949e]">{filesOpen ? '▲ 파일 닫기' : '▼ 파일 열기'}</span>
                    </button>
                    <AnimatePresence>
                      {filesOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="max-h-40 overflow-y-auto bg-[#f6f8fa] dark:bg-[#161b22]">
                          <FileTree root={tree} currentPath={codeRef?.path ?? ''} onSelect={handleNav} codeRefs={codeRefs} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <button onClick={() => setCodeOpen(v => !v)}
                  className="flex w-full shrink-0 items-center gap-2 border-b border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 text-left transition-colors hover:bg-[#eaf2ff] dark:border-[#30363d] dark:bg-[#161b22] dark:hover:bg-[#1c2d4a]">
                  <span className="text-[11px] font-semibold text-[#24292f] dark:text-[#e6edf3]">소스 코드</span>
                  <span className="ml-auto text-[10px] text-[#57606a] dark:text-[#8b949e]">{codeOpen ? '▼ 접기' : '▶ 펼치기'}</span>
                </button>
                <AnimatePresence>
                  {codeOpen && (
                    <motion.div key="mobile-code-area" initial={{ height: 0, opacity: 0 }} animate={{ height: flowOpen ? '58%' : '100%', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="flex min-h-0 shrink-0 flex-col overflow-hidden bg-white dark:bg-[#0d1117]">
                      <AnnotationLegend annotations={annotations} flowNodes={flowNodes} onAnnotClick={handleAnnotClick} />
                      <div ref={codeScroll} className="flex-1 overflow-auto" style={{ overscrollBehavior: 'contain' }}>
                        {codeRef && <CodeTable codeRef={codeRef} annotations={annotations} flowNodes={flowNodes} hlRef={hlRef} annotRefs={annotRefs} onFlowOpen={() => setFlowOpen(true)} />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {flowNodes && FlowDiagram && <CodeSidebarFlowPanel flowNodes={flowNodes} flowOpen={flowOpen} setFlowOpen={setFlowOpen} onNavigate={handleNav} FlowDiagram={FlowDiagram} />}
              </div>
            </motion.aside>
          ) : (
            <motion.aside key="panel" className="fixed top-0 right-0 z-50 h-full w-full max-w-[1100px] flex flex-col bg-white dark:bg-[#0d1117] border-l border-[#d0d7de] dark:border-[#30363d] shadow-2xl overscroll-contain"
              style={{ touchAction: 'pan-y' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              {codeRef && <CodeSidebarHeader codeRef={codeRef} projectMeta={meta} lineCount={lineCount} onClose={onClose} />}
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
                      {tree && (
                        <div className="w-[200px] shrink-0 border-r border-[#d0d7de] dark:border-[#30363d] overflow-y-auto bg-[#f6f8fa] dark:bg-[#161b22]">
                          <div className="px-3 py-2 border-b border-[#d0d7de] dark:border-[#30363d]">
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]">{projectId}</p>
                          </div>
                          <FileTree root={tree} currentPath={codeRef?.path ?? ''} onSelect={handleNav} codeRefs={codeRefs} />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0d1117]">
                        <AnnotationLegend annotations={annotations} flowNodes={flowNodes} onAnnotClick={handleAnnotClick} />
                        <div ref={codeScroll} className="flex-1 overflow-auto" style={{ overscrollBehavior: 'contain' }}>
                          {codeRef && <CodeTable codeRef={codeRef} annotations={annotations} flowNodes={flowNodes} hlRef={hlRef} annotRefs={annotRefs} onFlowOpen={() => setFlowOpen(true)} />}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {flowNodes && FlowDiagram && <CodeSidebarFlowPanel flowNodes={flowNodes} flowOpen={flowOpen} setFlowOpen={setFlowOpen} onNavigate={handleNav} FlowDiagram={FlowDiagram} />}
              </div>
            </motion.aside>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
