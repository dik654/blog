import type { LineNote, FlowNode } from './types';
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
    <div className="max-h-24 shrink-0 overflow-y-auto border-b border-[#d0d7de] bg-[#f6f8fa] px-2 py-1.5 dark:border-[#30363d] dark:bg-[#161b22] md:max-h-none md:px-4 md:py-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]">코드 구간 설명</p>
        {flowNodes && <span className="shrink-0 text-[9px] text-[#0969da] dark:text-[#58a6ff]">클릭 → 해당 줄 이동</span>}
      </div>
      {annotations.map((a, idx) => {
        const c = COLORS[a.color];
        return (
          <div key={idx}
            className="-mx-1 flex cursor-pointer items-baseline gap-1.5 rounded px-1 py-0.5 transition-colors hover:bg-[#e8f0fe] dark:hover:bg-[#1c2d4a] md:gap-2"
            onClick={() => onAnnotClick(a.lines[0])}>
            <span className="shrink-0 text-[11px] font-bold" style={{ color: c.dot }}>{CIRCLES[idx]}</span>
            <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: c.badgeBg, color: c.badgeText }}>L{a.lines[0]}–{a.lines[1]}</span>
            <span className="min-w-0 text-[11px] leading-snug text-[#24292f] dark:text-[#e6edf3]">{a.note}</span>
            <span className="ml-auto text-[9px] text-[#0969da] dark:text-[#58a6ff] shrink-0">↵</span>
          </div>
        );
      })}
    </div>
  );
}
