import { motion, AnimatePresence } from 'framer-motion';
import { modules } from './archData';

export default function ArchDetail({
  sel,
  onSelect,
}: {
  sel: string | null;
  onSelect: (id: string) => void;
}) {
  const mod = sel ? modules[sel] : null;

  return (
    <AnimatePresence mode="wait">
      {mod && (
        <motion.div
          key={sel}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="rounded-lg border bg-accent/30 p-4 space-y-3.5">

            {/* JWT 통신 방식 (notes) */}
            {mod.notes && (
              <div className="rounded-md border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 p-3">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                  통신 방식 (JWT)
                </p>
                <ul className="space-y-1">
                  {mod.notes.map((n) => (
                    <li key={n} className="text-xs text-amber-800 dark:text-amber-300 flex gap-2">
                      <span className="shrink-0">▸</span>{n}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key functions with descriptions */}
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1.5">
                Key Functions
              </p>
              <div className="space-y-1.5">
                {mod.fns.map((f) => (
                  <div key={f.sig} className="flex gap-2 items-start">
                    <code className="text-[11px] bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono shrink-0">
                      {f.sig}
                    </code>
                    <span className="text-xs text-foreground/75 pt-0.5">{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connects To */}
            {mod.links.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1.5">
                  Connects To
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.links.map((l) => (
                    <button
                      key={l.target}
                      onClick={() => onSelect(l.target)}
                      className="text-xs bg-background border rounded px-2 py-0.5 hover:bg-accent transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span className="">{l.dir}</span>
                      <span className="font-medium">{modules[l.target]?.label ?? l.target}</span>
                      <span className="">({l.via})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
