type Seg = { start: number; end: number; type: string; val: string };

const KW  = /\b(struct|union|enum|typedef|void|int|char|unsigned|long|short|bool|uint8_t|uint16_t|uint32_t|uint64_t|int32_t|int64_t|size_t|ssize_t|u8|u16|u32|u64|if|else|for|while|do|switch|case|default|return|break|continue|goto|sizeof|static|const|volatile|extern|inline|NULL|true|false|__attribute__|__packed__|__aligned__|ENOSYS|EINVAL|ENOMEM)\b/g;
const STR = /("(?:[^"\\]|\\.)*")/g;
const PP  = /^(\s*#\s*\w+)/g;

export default function CLine({ text }: { text: string }) {
  if (!text.trim()) return <span>&nbsp;</span>;
  if (text.trimStart().startsWith('/*') || text.trimStart().startsWith('*'))
    return <span className="text-[#6e7781] dark:text-[#8b949e] italic">{text}</span>;
  if (text.trimStart().startsWith('//'))
    return <span className="text-[#6e7781] dark:text-[#8b949e] italic">{text}</span>;

  const parts: React.ReactNode[] = [];
  const segs: Seg[] = [
    ...[...text.matchAll(KW)].map( m => ({ start: m.index!, end: m.index! + m[0].length, type: 'kw',  val: m[0] })),
    ...[...text.matchAll(STR)].map(m => ({ start: m.index!, end: m.index! + m[0].length, type: 'str', val: m[0] })),
    ...[...text.matchAll(PP)].map( m => ({ start: m.index!, end: m.index! + m[0].length, type: 'pp',  val: m[0] })),
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
