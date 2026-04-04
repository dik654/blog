import type { ReactNode } from 'react';

const KEYWORDS = /\b(def|class|import|from|if|elif|else|for|while|return|self|async|await|with|try|except|finally|raise|as|in|not|and|or|is|None|True|False|yield|lambda|pass|break|continue|assert)\b/g;
const DECORATORS = /^(\s*@[\w.]+)/gm;
const STRINGS = /("""[\s\S]*?"""|'''[\s\S]*?'''|f?"[^"]*"|f?'[^']*')/g;
const COMMENTS = /(#.*$)/gm;
const NUMBERS = /\b(\d+\.?\d*)\b/g;

type Seg = { text: string; cls?: string };

function splitSegs(segs: Seg[], re: RegExp, cls: string): Seg[] {
  const next: Seg[] = [];
  for (const s of segs) {
    if (s.cls) { next.push(s); continue; }
    let last = 0;
    const regex = new RegExp(re.source, re.flags);
    for (const m of s.text.matchAll(regex)) {
      if (m.index! > last) next.push({ text: s.text.slice(last, m.index!) });
      next.push({ text: m[0], cls });
      last = m.index! + m[0].length;
    }
    if (last < s.text.length) next.push({ text: s.text.slice(last) });
  }
  return next;
}

export function highlightPython(line: string): ReactNode {
  if (!line.trim()) return line;

  let segs: Seg[] = [{ text: line }];
  segs = splitSegs(segs, COMMENTS, 'text-emerald-600/60');
  segs = splitSegs(segs, STRINGS, 'text-amber-400/80');
  segs = splitSegs(segs, DECORATORS, 'text-yellow-500/80');
  segs = splitSegs(segs, KEYWORDS, 'text-purple-400');
  segs = splitSegs(segs, NUMBERS, 'text-orange-400/80');

  return (
    <>
      {segs.map((s, i) =>
        s.cls ? <span key={i} className={s.cls}>{s.text}</span> : s.text
      )}
    </>
  );
}
