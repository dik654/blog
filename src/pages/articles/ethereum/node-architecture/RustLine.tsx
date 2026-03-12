type Seg = { start: number; end: number; type: string; val: string };

const KW  = /\b(pub|fn|let|mut|async|await|impl|struct|use|if|else|return|Ok|Err|match|for|where|Arc|Box|Option|Some|None|true|false|self|Self|super|crate|mod|type|const|static|enum|trait|dyn|move|in|ref|loop|break|continue|unsafe|extern)\b/g;
const STR = /("(?:[^"\\]|\\.)*")/g;
const MAC = /\b(\w+)!/g;

export default function RustLine({ text }: { text: string }) {
  if (!text.trim()) return <span>&nbsp;</span>;
  if (text.trimStart().startsWith('///'))
    return <span className="text-[#0550ae] dark:text-[#79c0ff] italic">{text}</span>;
  if (text.trimStart().startsWith('//'))
    return <span className="text-[#6e7781] dark:text-[#8b949e] italic">{text}</span>;

  const parts: React.ReactNode[] = [];
  const segs: Seg[] = [
    ...[...text.matchAll(KW)].map( m => ({ start: m.index!, end: m.index! + m[0].length, type: 'kw',  val: m[0] })),
    ...[...text.matchAll(STR)].map(m => ({ start: m.index!, end: m.index! + m[0].length, type: 'str', val: m[0] })),
    ...[...text.matchAll(MAC)].map(m => ({ start: m.index!, end: m.index! + m[0].length, type: 'mac', val: m[0] })),
  ].sort((a, b) => a.start - b.start);

  let last = 0;
  for (const s of segs) {
    if (s.start < last) continue;
    if (s.start > last) parts.push(<span key={last}>{text.slice(last, s.start)}</span>);
    const cls = s.type === 'kw'  ? 'text-[#cf222e] dark:text-[#ff7b72] font-semibold'
              : s.type === 'str' ? 'text-[#0a3069] dark:text-[#a5d6ff]'
              :                    'text-[#8250df] dark:text-[#d2a8ff]';
    parts.push(<span key={s.start} className={cls}>{s.val}</span>);
    last = s.end;
  }
  if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
  return <>{parts}</>;
}
