type Seg = { start: number; end: number; type: string; val: string };

const KW  = /\b(const|let|var|function|class|interface|type|import|export|from|return|if|else|for|while|do|switch|case|default|async|await|new|this|true|false|null|undefined|extends|implements|typeof|instanceof|void|never|any|string|number|boolean|enum|abstract|private|protected|public|static|readonly|as|in|of|throw|try|catch|finally|yield|delete|break|continue|super)\b/g;
const STR = /(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;

export default function TypeScriptLine({ text }: { text: string }) {
  if (!text.trim()) return <span>&nbsp;</span>;
  if (text.trimStart().startsWith('//'))
    return <span className="text-[#6e7781] dark:text-[#8b949e] italic">{text}</span>;

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
