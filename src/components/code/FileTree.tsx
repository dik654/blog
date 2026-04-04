import { useState } from 'react';
import type { FileNode, CodeRef } from './types';

function containsPath(node: FileNode, path: string): boolean {
  if (node.path === path) return true;
  return node.children?.some(c => containsPath(c, path)) ?? false;
}

function Node({
  node, currentPath, onSelect, codeRefs, depth = 0,
}: {
  node: FileNode; currentPath: string; onSelect: (key: string) => void;
  codeRefs: Record<string, CodeRef>; depth?: number;
}) {
  const isCurrent = node.path === currentPath;
  const [open, setOpen] = useState(node.type === 'dir' && containsPath(node, currentPath));
  const pl = depth * 12 + 8;

  if (node.type === 'dir') {
    return (
      <div>
        <button onClick={() => setOpen(o => !o)} style={{ paddingLeft: pl }}
          className="flex items-center gap-1.5 w-full text-left py-[3px] pr-2 hover:bg-[#f3f4f6] dark:hover:bg-[#161b22] transition-colors cursor-pointer group">
          <span className="text-[#57606a] dark:text-[#8b949e] text-[10px] w-3 shrink-0">{open ? '▾' : '▸'}</span>
          <span className="text-[10px] text-[#24292f] dark:text-[#e6edf3] truncate">{node.name}</span>
        </button>
        {open && node.children?.map(c => (
          <Node key={c.name} node={c} currentPath={currentPath} onSelect={onSelect} codeRefs={codeRefs} depth={depth + 1} />
        ))}
      </div>
    );
  }

  const hasRef = !!node.codeKey && !!codeRefs[node.codeKey];
  return (
    <button onClick={() => node.codeKey && onSelect(node.codeKey)} disabled={!hasRef}
      style={{ paddingLeft: pl }}
      className={`flex items-center gap-1.5 w-full text-left py-[3px] pr-2 transition-colors
        ${isCurrent ? 'bg-[#ddf4ff] dark:bg-[#1c2d3f] border-r-2 border-[#0969da] dark:border-[#388bfd] font-semibold'
          : hasRef ? 'hover:bg-[#f3f4f6] dark:hover:bg-[#161b22] cursor-pointer' : 'cursor-default opacity-55'}`}>
      <span className={`text-[10px] w-3 shrink-0 ${isCurrent ? 'text-[#0969da] dark:text-[#388bfd]' : 'text-[#57606a] dark:text-[#8b949e]'}`}>
        {isCurrent ? '◆' : hasRef ? '◇' : '·'}
      </span>
      <span className={`text-[10px] truncate ${isCurrent ? 'text-[#0969da] dark:text-[#388bfd]' : 'text-[#24292f] dark:text-[#e6edf3]'}`}>
        {node.name}
      </span>
    </button>
  );
}

export default function FileTree({
  root, currentPath, onSelect, codeRefs,
}: {
  root: FileNode; currentPath: string; onSelect: (key: string) => void;
  codeRefs: Record<string, CodeRef>;
}) {
  return (
    <div className="font-mono py-1 select-none">
      <Node node={root} currentPath={currentPath} onSelect={onSelect} codeRefs={codeRefs} depth={0} />
    </div>
  );
}
