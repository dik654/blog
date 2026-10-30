import { useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef, FileNode, FlowNode, ProjectMeta } from "./types";
import FileTree from "./FileTree";
import CodeSidebarHeader, { CodeSidebarDesc } from "./CodeSidebarHeader";
import AnnotationLegend from "./AnnotationLegend";
import CodeTable from "./CodeTable";
import CodeSidebarFlowPanel from "./CodeSidebarFlowPanel";

export default function CodeSidebar({
  codeRefKey: initialKey,
  codeRef: initialRef,
  onClose,
  onNavigate,
  codeRefs,
  fileTrees,
  projectMetas,
  flowData,
  FlowDiagram,
}: {
  codeRefKey: string | null;
  codeRef: CodeRef | null;
  onClose: () => void;
  onNavigate: (key: string, ref: CodeRef) => void;
  codeRefs: Record<string, CodeRef>;
  fileTrees: Record<string, FileNode>;
  projectMetas?: Record<string, ProjectMeta>;
  flowData?: Record<string, FlowNode[]>;
  FlowDiagram?: ComponentType<{
    nodes: FlowNode[];
    onNavigate?: (key: string) => void;
  }>;
}) {
  const [descOpen, setDescOpen] = useState(true);
  const [codeOpen, setCodeOpen] = useState(true);
  const [flowOpen, setFlowOpen] = useState(false);
  const panelRef = useRef<HTMLElement | null>(null);
  const hlRef = useRef<HTMLTableRowElement | null>(null);
  const codeScroll = useRef<HTMLDivElement>(null);
  const annotRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());

  useEffect(() => {
    if (initialRef && hlRef.current)
      hlRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [initialRef]);

  useEffect(() => {
    if (!initialRef) return;

    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusCloseButton = window.requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLButtonElement>("[data-code-sidebar-close]")
        ?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusCloseButton);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [initialRef, onClose]);

  const codeRef = initialRef;
  const projectId = codeRef?.path.split("/")[0] ?? "";
  const tree = fileTrees[projectId];
  const meta = projectMetas?.[projectId];
  const lineCount = codeRef?.code.split("\n").length ?? 0;
  const annotations = codeRef?.annotations ?? [];
  const flowNodes = initialKey && flowData ? flowData[initialKey] : undefined;

  const handleNav = (key: string) => {
    const ref = codeRefs[key];
    if (!ref) return;
    setFlowOpen(false);
    annotRefs.current.clear();
    onNavigate(key, ref);
  };
  const handleAnnotClick = (startLine: number) => {
    setFlowOpen(true);
    if (!codeOpen) {
      setCodeOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          annotRefs.current
            .get(startLine)
            ?.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      });
    } else
      annotRefs.current
        .get(startLine)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {initialRef && (
        <>
          <motion.div
            key="bd"
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${codeRef?.path ?? "소스 코드"} 코드 패널`}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-[1100px] flex flex-col bg-white dark:bg-[#0d1117] border-l border-[#d0d7de] dark:border-[#30363d] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {codeRef && (
              <CodeSidebarHeader
                codeRef={codeRef}
                projectMeta={meta}
                lineCount={lineCount}
                onClose={onClose}
              />
            )}
            {codeRef?.desc && (
              <CodeSidebarDesc
                desc={codeRef.desc}
                descOpen={descOpen}
                setDescOpen={setDescOpen}
              />
            )}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <button
                onClick={() => setCodeOpen((v) => !v)}
                className="w-full flex items-center gap-2 px-4 py-1.5 bg-[#f6f8fa] dark:bg-[#161b22] border-b border-[#d0d7de] dark:border-[#30363d] hover:bg-[#eaf2ff] dark:hover:bg-[#1c2d4a] transition-colors cursor-pointer text-left shrink-0"
              >
                <span className="text-xs">{}</span>
                <span className="text-[11px] font-semibold text-[#24292f] dark:text-[#e6edf3]">
                  소스 코드
                </span>
                <span className="ml-auto text-xs text-[#57606a] dark:text-[#8b949e]">
                  {codeOpen ? "▼ 접기" : "▶ 펼치기"}
                </span>
              </button>
              <AnimatePresence>
                {codeOpen && (
                  <motion.div
                    key="code-area"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: flowOpen ? "55%" : "100%", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col overflow-hidden min-h-0 shrink-0 sm:flex-row"
                  >
                    {tree && (
                      <details className="max-h-40 shrink-0 overflow-y-auto border-b border-[#d0d7de] bg-[#f6f8fa] dark:border-[#30363d] dark:bg-[#161b22] sm:hidden">
                        <summary className="cursor-pointer px-4 py-2 text-sm font-semibold">파일 선택</summary>
                        <FileTree root={tree} currentPath={codeRef?.path ?? ""} onSelect={handleNav} codeRefs={codeRefs} />
                      </details>
                    )}
                    {tree && (
                      <div className="hidden w-[200px] shrink-0 border-r border-[#d0d7de] dark:border-[#30363d] overflow-y-auto bg-[#f6f8fa] dark:bg-[#161b22] sm:block">
                        <div className="px-3 py-2 border-b border-[#d0d7de] dark:border-[#30363d]">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]">
                            {projectId}
                          </p>
                        </div>
                        <FileTree
                          root={tree}
                          currentPath={codeRef?.path ?? ""}
                          onSelect={handleNav}
                          codeRefs={codeRefs}
                        />
                      </div>
                    )}
                    <div className="min-h-0 min-w-0 flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0d1117]">
                      <AnnotationLegend
                        annotations={annotations}
                        flowNodes={flowNodes}
                        onAnnotClick={handleAnnotClick}
                      />
                      <div
                        ref={codeScroll}
                        className="flex-1 overflow-auto"
                        style={{ overscrollBehavior: "contain" }}
                      >
                        {codeRef && (
                          <CodeTable
                            codeRef={codeRef}
                            annotations={annotations}
                            flowNodes={flowNodes}
                            hlRef={hlRef}
                            annotRefs={annotRefs}
                            onFlowOpen={() => setFlowOpen(true)}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {flowNodes && FlowDiagram && (
                <CodeSidebarFlowPanel
                  flowNodes={flowNodes}
                  flowOpen={flowOpen}
                  setFlowOpen={setFlowOpen}
                  onNavigate={handleNav}
                  FlowDiagram={FlowDiagram}
                />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
