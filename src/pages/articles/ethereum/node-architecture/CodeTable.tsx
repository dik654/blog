import React from 'react';
import type { CodeRef, LineNote } from './archCodeRefs';
import type { FlowNode } from './FlowDiagram';
import { COLORS, CIRCLES } from './codeSidebarData';
import RustLine from './RustLine';

export default function CodeTable({
  codeRef, annotations, flowNodes, hlRef, annotRefs, onFlowOpen,
}: {
  codeRef: CodeRef;
  annotations: LineNote[];
  flowNodes: FlowNode[] | undefined;
  hlRef: React.MutableRefObject<HTMLTableRowElement | null>;
  annotRefs: React.MutableRefObject<Map<number, HTMLTableRowElement>>;
  onFlowOpen: () => void;
}) {
  return (
    <table className="w-full border-collapse font-mono text-[12px] leading-5">
      <tbody>
        {codeRef.code.split('\n').map((line, i) => {
          const ln      = i + 1;
          const annot   = annotations.find(a => ln >= a.lines[0] && ln <= a.lines[1]);
          const annotIdx = annot ? annotations.indexOf(annot) : -1;
          const isStart = annot && ln === annot.lines[0];
          const hl      = !annot && ln >= codeRef.highlight[0] && ln <= codeRef.highlight[1];
          const c       = annot ? COLORS[annot.color] : null;
          return (
            <tr key={ln}
              ref={el => {
                if (ln === codeRef.highlight[0]) hlRef.current = el;
                if (isStart && el) annotRefs.current.set(ln, el);
              }}
              style={c ? { backgroundColor: c.bg } : hl ? { backgroundColor: 'rgb(255,251,204)' } : undefined}
              className={`${!c && !hl ? 'hover:bg-[#f6f8fa] dark:hover:bg-[#161b22]' : ''} ${c && flowNodes ? 'cursor-pointer' : ''}`}
              onClick={c && flowNodes ? () => onFlowOpen() : undefined}
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
  );
}
