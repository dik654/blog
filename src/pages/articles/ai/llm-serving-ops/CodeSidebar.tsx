import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeRef } from './codeRefs';
import { highlightPython } from '@/components/ui/python-highlight';
import { COLORS } from '@/components/ui/code-panel';
import { Header, Tabs, AnnotationBar } from './CodeSidebarParts';

interface Props {
  refs: CodeRef[];
  trigger?: React.ReactNode;
}

export default function CodeSidebar({ refs, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = refs[active];
  const lines = ref.code.trimEnd().split('\n');

  const getAnn = (n: number) =>
    ref.annotations.find((a) => n >= a.lines[0] && n <= a.lines[1]);

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono
            hover:bg-accent border border-border/50 rounded-md
            transition-colors cursor-pointer text-foreground/70"
        >
          <span className="text-muted-foreground">{'</>'}</span>
          소스 코드 보기
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-background
                border-l border-border z-50 flex flex-col"
            >
              <Header title={ref.file} onClose={() => setOpen(false)} />
              <Tabs refs={refs} active={active} onSelect={setActive} />
              <AnnotationBar annotations={ref.annotations} />
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs font-mono leading-relaxed">
                  <tbody>
                    {lines.map((line, i) => {
                      const num = ref.startLine + i;
                      const ann = getAnn(num);
                      return (
                        <tr key={num} style={ann ? {
                          background: COLORS[ann.color].bg,
                          borderLeft: `2px solid ${COLORS[ann.color].border}`,
                        } : undefined}>
                          <td className="text-right pr-3 pl-3 py-0 text-muted-foreground/40 select-none w-10">
                            {num}
                          </td>
                          <td className="pr-4 py-0 whitespace-pre text-foreground/80">
                            {highlightPython(line)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
