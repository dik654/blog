import type { LineNote } from './archCodeRefs';
import type { FlowNode } from './FlowDiagram';
import { COLORS, CIRCLES } from './codeSidebarData';

export default function AnnotationLegend({
  annotations, flowNodes, onAnnotClick,
}: {
  annotations: LineNote[];
  flowNodes: FlowNode[] | undefined;
  onAnnotClick: (startLine: number) => void;
}) {
  if (annotations.length === 0) return null;

  return (
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
            onClick={() => onAnnotClick(a.lines[0])}>
            <span className="shrink-0 text-[11px] font-bold" style={{ color: c.dot }}>{CIRCLES[idx]}</span>
            <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: c.badgeBg, color: c.badgeText }}>L{a.lines[0]}–{a.lines[1]}</span>
            <span className="text-[11px] text-[#24292f] dark:text-[#e6edf3] leading-snug">{a.note}</span>
            <span className="ml-auto text-[9px] text-[#0969da] dark:text-[#58a6ff] shrink-0">↵</span>
          </div>
        );
      })}
    </div>
  );
}
