type Seg = { start: number; end: number; type: string; val: string };

const KW  = /\b(def|class|import|from|return|if|elif|else|for|in|while|try|except|finally|with|as|yield|async|await|None|True|False|self|cls|lambda|raise|pass|and|or|not|is|break|continue|global|nonlocal|assert|del)\b/g;
const STR = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
const DEC = /^(\s*@\w[\w.]*)/g;

export default function PythonLine({ text }: { text: string }) {
  if (!text.trim()) return <span>&nbsp;</span>;
  if (text.trimStart().startsWith('#'))
    return <span className="text-[#6e7781] dark:text-[#8b949e] italic">{text}</span>;

  const decMatch = text.match(DEC);
  if (decMatch)
    return <span className="text-[#8250df] dark:text-[#d2a8ff]">{text}</span>;

  const parts: React.ReactNode[] = [];
  const segs: Seg[] = [
    ...[...text.matchAll(KW)].map( m => ({ start: m.index!, end: m.index! + m[0].length, type: 'kw',  val: m[0] })),
    ...[...text.matchAll(STR)].map(m => ({ start: m.index!, end: m.index! + m[0].length, type: 'str', val: m[0] })),
  ].sort((a, b) => a.start - b.start);

  let last = 0;
  for (const s of segs) {
    if (s.start < last) continue;
    if (s.start > last) parts.push(<span key={last}>{text.slice(last, s.start)}</span>);
    const cls = s.type === 'kw'
      ? 'text-[#cf222e] dark:text-[#ff7b72] font-semibold'
      : 'text-[#0a3069] dark:text-[#a5d6ff]';
    parts.push(<span key={s.start} className={cls}>{s.val}</span>);
    last = s.end;
  }
  if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
  return <>{parts}</>;
}
