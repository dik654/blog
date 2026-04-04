import { useState } from 'react';
import type { FileNode } from './fileTree';
import { codeRefs } from './codeRefs';

function Node({ node, onSelect, depth = 0 }: {
  node: FileNode; onSelect: (key: string) => void; depth?: number;
}) {
  const [open, setOpen] = useState(node.type === 'dir');
  const pl = depth * 12 + 8;
  if (node.type === 'dir') {
    return (
      <div>
        <button onClick={() => setOpen(o => !o)} style={{ paddingLeft: pl }}
          className="flex items-center gap-1.5 w-full text-left py-[3px] pr-2 hover:bg-[#f3f4f6] dark:hover:bg-[#161b22] cursor-pointer">
          <span className="text-[10px] w-3 shrink-0 text-[#57606a]">{open ? '\u25BE' : '\u25B8'}</span>
          <span className="text-[10px] text-[#24292f] dark:text-[#e6edf3] truncate">{node.name}</span>
        </button>
        {open && node.children?.map(c => (
          <Node key={c.name} node={c} onSelect={onSelect} depth={depth + 1} />
        ))}
      </div>
    );
  }
  const hasRef = !!node.codeKey && !!codeRefs[node.codeKey];
  return (
    <button onClick={() => node.codeKey && hasRef && onSelect(node.codeKey)}
      disabled={!hasRef} style={{ paddingLeft: pl }}
      className={`flex items-center gap-1.5 w-full text-left py-[3px] pr-2
        ${hasRef ? 'hover:bg-[#f3f4f6] dark:hover:bg-[#161b22] cursor-pointer' : 'cursor-default opacity-55'}`}>
      <span className="text-[10px] w-3 shrink-0 text-[#57606a]">{hasRef ? '\u25C7' : '\u00B7'}</span>
      <span className="text-[10px] truncate text-[#24292f] dark:text-[#e6edf3]">{node.name}</span>
    </button>
  );
}

export default function SP1FileTree({ root, onSelect }: {
  root: FileNode; onSelect: (key: string) => void;
}) {
  return (
    <div className="font-mono py-1 select-none">
      <Node node={root} onSelect={onSelect} />
    </div>
  );
}
