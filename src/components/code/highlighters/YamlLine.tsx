const VALUE_TOKEN = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:true|false|null)\b|\b\d+(?:\.\d+)?\b|\[|]|\{|}|,)/g;
const PUNCTUATION = new Set(["[", "]", "{", "}", ","]);

function Value({ text }: { text: string }) {
  const parts = text.split(VALUE_TOKEN);
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        let className = "";
        if (/^(?:true|false|null)$/.test(part)) className = "text-[#cf222e] dark:text-[#ff7b72] font-semibold";
        else if (/^\d+(?:\.\d+)?$/.test(part)) className = "text-[#0550ae] dark:text-[#79c0ff]";
        else if (PUNCTUATION.has(part)) className = "text-[#8250df] dark:text-[#d2a8ff]";
        else if (/^["']/.test(part)) className = "text-[#0a3069] dark:text-[#a5d6ff]";
        return <span key={`${index}-${part}`} className={className}>{part}</span>;
      })}
    </>
  );
}

export default function YamlLine({ text }: { text: string }) {
  if (!text.trim()) return <span>&nbsp;</span>;
  if (text.trimStart().startsWith("#")) {
    return <span className="italic text-[#6e7781] dark:text-[#8b949e]">{text}</span>;
  }

  const match = text.match(/^(\s*(?:-\s+)?)([^:#][^:]*?)(:)(.*)$/);
  if (!match) return <Value text={text} />;

  return (
    <>
      <span>{match[1]}</span>
      <span className="font-semibold text-[#953800] dark:text-[#ffa657]">{match[2]}</span>
      <span className="text-[#8250df] dark:text-[#d2a8ff]">{match[3]}</span>
      <Value text={match[4]} />
    </>
  );
}
