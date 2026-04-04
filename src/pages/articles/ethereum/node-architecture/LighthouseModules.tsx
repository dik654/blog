import type { Mod } from './lighthouseModulesData';
import { vc, beacon, store, net } from './lighthouseModulesData';

function Box({ m, style }: { m: Mod; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl border-2 p-3 ${m.border} ${m.bg}`} style={style}>
      <p className={`text-xs font-bold mb-2 ${m.title}`}>{m.name}</p>
      <div className="flex flex-col gap-1">
        {m.items.map(([name, desc]) => (
          <div key={name} className={`rounded border ${m.inner} bg-background/70 dark:bg-background/20 px-2 py-1.5`}>
            <p className="text-[11px] font-medium text-foreground/80 leading-tight">{name}</p>
            <p className="text-[10px] text-foreground/75 leading-tight mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HArr({ label, dir, style }: { label: string; dir: string; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col items-center justify-start pt-5 px-1 shrink-0 gap-0.5" style={style}>
      <span className="text-[11px] text-foreground/75 whitespace-nowrap leading-none">{label}</span>
      <div className="relative w-8 h-3.5 flex items-center mt-0.5">
        <div className="absolute inset-x-0 h-px bg-border" />
        <span className="absolute right-0 text-[10px] leading-none text-foreground/75">▶</span>
        {dir === '↔' && <span className="absolute left-0 text-[10px] leading-none text-foreground/75">◀</span>}
      </div>
    </div>
  );
}

function VConn({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col items-center py-1 gap-0.5" style={style}>
      <span className="text-[10px] text-foreground/75">▲</span>
      <div className="w-px flex-1 min-h-[16px] bg-border" />
      <span className="text-[11px] text-foreground/75 whitespace-nowrap">{label}</span>
      <div className="w-px flex-1 min-h-[16px] bg-border" />
      <span className="text-[10px] text-foreground/75">▼</span>
    </div>
  );
}

export default function LighthouseModules() {
  return (
    <div className="not-prose overflow-x-auto">
      <div className="min-w-[580px]" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr' }}>
        <Box m={vc}     style={{ gridColumn: 1, gridRow: 1 }} />
        <HArr label="Beacon API" dir="↔" style={{ gridColumn: 2, gridRow: 1 }} />
        <Box m={beacon} style={{ gridColumn: 3, gridRow: 1 }} />
        <HArr label="직접 호출" dir="↔" style={{ gridColumn: 4, gridRow: 1 }} />
        <Box m={store}  style={{ gridColumn: 5, gridRow: 1 }} />
        <VConn label="tokio ch" style={{ gridColumn: 3, gridRow: 2 }} />
        <Box m={net}    style={{ gridColumn: 3, gridRow: 3 }} />
      </div>
    </div>
  );
}
