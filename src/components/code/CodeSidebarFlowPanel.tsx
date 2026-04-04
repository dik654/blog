import { AnimatePresence, motion } from 'framer-motion';
import type { FlowNode } from './types';
import type { ComponentType } from 'react';

export default function CodeSidebarFlowPanel({
  flowNodes, flowOpen, setFlowOpen, onNavigate, FlowDiagram,
}: {
  flowNodes: FlowNode[];
  flowOpen: boolean;
  setFlowOpen: (fn: (v: boolean) => boolean) => void;
  onNavigate: (key: string) => void;
  FlowDiagram: ComponentType<{ nodes: FlowNode[]; onNavigate?: (key: string) => void }>;
}) {
  return (
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
            <FlowDiagram nodes={flowNodes} onNavigate={onNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
