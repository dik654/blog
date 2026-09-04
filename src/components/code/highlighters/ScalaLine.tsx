type Seg = { start: number; end: number; type: string; val: string };

const KW =
  /\b(package|import|class|object|trait|extends|with|def|val|var|implicit|override|abstract|final|sealed|case|match|new|this|super|if|else|for|while|return|true|false|null|when|elsewhen|otherwise|Module|IO|Input|Output|Bundle)\b/g;
const STR = /("(?:[^"\\]|\\.)*")/g;
const TYPE = /\b([A-Z]\w*)\b/g;

export default function ScalaLine({ text }: { text: string }) {
  if (!text.trim()) return <span>&nbsp;</span>;
  const trimmed = text.trimStart();
  if (trimmed.startsWith("/**") || trimmed.startsWith("*") || trimmed.startsWith("*/"))
    return (
      <span className="text-[#0550ae] dark:text-[#79c0ff] italic">{text}</span>
    );
  if (trimmed.startsWith("//"))
    return (
      <span className="text-[#6e7781] dark:text-[#8b949e] italic">{text}</span>
    );

  const parts: React.ReactNode[] = [];
  const segs: Seg[] = [
    ...[...text.matchAll(KW)].map((m) => ({
      start: m.index!,
      end: m.index! + m[0].length,
      type: "kw",
      val: m[0],
    })),
    ...[...text.matchAll(STR)].map((m) => ({
      start: m.index!,
      end: m.index! + m[0].length,
      type: "str",
      val: m[0],
    })),
    ...[...text.matchAll(TYPE)].map((m) => ({
      start: m.index!,
      end: m.index! + m[0].length,
      type: "type",
      val: m[0],
    })),
  ].sort((a, b) => a.start - b.start);

  let last = 0;
  for (const s of segs) {
    if (s.start < last) continue;
    if (s.start > last)
      parts.push(<span key={last}>{text.slice(last, s.start)}</span>);
    const cls =
      s.type === "kw"
        ? "text-[#cf222e] dark:text-[#ff7b72] font-semibold"
        : s.type === "str"
          ? "text-[#0a3069] dark:text-[#a5d6ff]"
          : "text-[#8250df] dark:text-[#d2a8ff]";
    parts.push(
      <span key={s.start} className={cls}>
        {s.val}
      </span>,
    );
    last = s.end;
  }
  if (last < text.length)
    parts.push(<span key={last}>{text.slice(last)}</span>);
  return <>{parts}</>;
}
