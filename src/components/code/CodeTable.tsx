import React from 'react';
import type { CodeRef, LineNote, FlowNode } from './types';
import { COLORS, CIRCLES } from './codeSidebarData';
import CodeLine from './highlighters';

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
  const lineStart = codeRef.lineStart ?? 1;
  return (
    <table className="min-w-max w-full border-collapse font-mono text-[11px] leading-[17px] md:text-[12px] md:leading-5">
      <tbody>
        {codeRef.code.split('\n').map((line, i) => {
          const ln      = lineStart + i;
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
              <td className="w-8 select-none border-r border-[#eaecef] py-0 pl-0.5 pr-1 text-right text-[9px] align-top text-[#57606a] dark:border-[#21262d] dark:text-[#636e7b] md:w-16 md:pl-4 md:pr-2 md:text-[11px]">
                <span className="flex items-center justify-end gap-1">
                  {isStart && <span className="text-[9px] font-bold leading-none md:text-[10px]" style={{ color: c!.dot }}>{CIRCLES[annotIdx]}</span>}
                  <span>{ln}</span>
                </span>
              </td>
              <td className="whitespace-pre py-0 pl-1 pr-2 align-top text-[#24292f] dark:text-[#e6edf3] md:pl-5 md:pr-5"
                style={c ? { borderLeft: `3px solid ${c.border}` } : hl ? { borderLeft: '3px solid #d4a72c' } : { borderLeft: '3px solid transparent' }}>
                <CodeLine text={line} lang={codeRef.lang} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
