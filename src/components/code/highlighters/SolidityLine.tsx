import type { ReactNode } from "react";

const TOKEN = /\/\/.*|\/\*.*?\*\/|\/\*.*|(?:unicode|hex)?"(?:[^"\\]|\\.)*"|(?:unicode|hex)?'(?:[^'\\]|\\.)*'|\b(?:pragma|solidity|import|contract|interface|library|is|using|for|function|constructor|modifier|event|error|emit|returns|return|if|else|while|do|break|continue|try|catch|revert|require|assert|new|delete|mapping|struct|enum|address|bool|string|bytes\d*|u?int\d*|public|private|internal|external|view|pure|payable|constant|immutable|memory|storage|calldata|indexed|anonymous|virtual|override|abstract|assembly|unchecked|true|false)\b/g;
const COMMENT = "text-[#6e7781] dark:text-[#8b949e] italic";

export default function SolidityLine({ text }: { text: string }) {
  if (!text.trim()) return <span>&nbsp;</span>;
  if (text.trimStart().startsWith("*")) return <span className={COMMENT}>{text}</span>;

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(TOKEN)) {
    const start = match.index;
    if (start > cursor) parts.push(text.slice(cursor, start));
    const token = match[0];
    const className = token.startsWith("/")
      ? COMMENT
      : /^(?:unicode|hex)?["']/.test(token)
        ? "text-[#0a3069] dark:text-[#a5d6ff]"
        : "text-[#cf222e] dark:text-[#ff7b72] font-semibold";
    parts.push(<span key={start} className={className}>{token}</span>);
    cursor = start + token.length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}
