import { motion } from 'framer-motion';

interface Page { spa: string; assigned: boolean; asid: number; gpa: string; vmpl?: number[] }
const PERM_LABELS: Record<number, string[]> = {
  0: [], 1: ['R'], 3: ['R', 'W'], 7: ['R', 'W', 'X'], 15: ['R', 'W', 'X', 'S'],
};

interface Props { page: Page }

export default function RMPDetailPanel({ page }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-4 overflow-hidden"
    >
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold mb-3 text-foreground/70 font-mono">RmpEntry @ {page.spa}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
          {[
            ['assigned', String(page.assigned)],
            ['asid', String(page.asid)],
            ['gpa', page.gpa],
            ['immutable', 'false'],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="text-foreground/40">{k}: </span>
              <span className="font-mono text-foreground/80">{v}</span>
            </div>
          ))}
        </div>
        {page.vmpl && (
          <div>
            <p className="text-xs text-foreground/50 mb-2">vmpl_perms[VMPL 0–3]</p>
            <div className="flex gap-4">
              {page.vmpl.map((perm: number, i: number) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-foreground/40">VMPL{i}</span>
                  <div className="flex gap-0.5 min-h-[20px] items-center">
                    {(PERM_LABELS[perm] ?? []).length === 0 ? (
                      <span className="text-xs text-foreground/25">—</span>
                    ) : PERM_LABELS[perm].map((b: string) => (
                      <span key={b} className="px-1 py-0.5 rounded text-xs font-mono bg-primary/20 text-primary">{b}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
