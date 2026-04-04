import type { CodeRef } from './codeRefs';
import { COLORS } from '@/components/ui/code-panel';

export function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
      <span className="text-xs font-mono text-muted-foreground">{'</>'}</span>
      <span className="text-sm font-medium text-foreground/80 flex-1 truncate">{title}</span>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg cursor-pointer">
        &times;
      </button>
    </div>
  );
}

export function Tabs({ refs, active, onSelect }: {
  refs: CodeRef[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex gap-1 px-3 py-2 border-b border-border/40 overflow-x-auto">
      {refs.map((r, i) => (
        <button key={r.id} onClick={() => onSelect(i)}
          className={`px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap cursor-pointer
            ${i === active ? 'bg-sky-500/15 text-sky-400' : 'text-muted-foreground hover:bg-accent'}`}
        >{r.title}</button>
      ))}
    </div>
  );
}

export function AnnotationBar({ annotations }: { annotations: CodeRef['annotations'] }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-border/30">
      {annotations.map((a, i) => (
        <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${COLORS[a.color].badge}`}>
          L{a.lines[0]}-{a.lines[1]}: {a.note}
        </span>
      ))}
    </div>
  );
}
