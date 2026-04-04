import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoPatternsViz from './viz/GoPatternsViz';
import { GO_PATTERNS } from './GoPatternsData';

export default function GoPatterns() {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = GO_PATTERNS.find(p => p.id === selected);

  return (
    <section id="go-patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Go 코드 읽기 가이드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          OP Stack 코드를 읽기 전에 Go의 핵심 패턴 5가지를 먼저 이해해야 한다.<br />
          이 패턴들은 이후 섹션의 모든 코드에서 반복적으로 등장한다.
        </p>
      </div>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {GO_PATTERNS.map(p => (
          <button key={p.id}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === p.id ? p.color : 'var(--color-border)',
              background: selected === p.id ? `${p.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-xs" style={{ color: p.color }}>{p.title.split('(')[0].trim()}</p>
            <p className="text-[10px] text-foreground/60 mt-1">{p.title.match(/\((.+)\)/)?.[1] ?? ''}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.desc}</p>
            <pre className="text-xs bg-muted/40 rounded p-3 overflow-x-auto font-mono leading-relaxed mb-2">
              {sel.example}
            </pre>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
              {sel.why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="not-prose"><GoPatternsViz /></div>
    </section>
  );
}
