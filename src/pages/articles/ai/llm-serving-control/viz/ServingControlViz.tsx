import { useState } from 'react';
import { Activity, Clock3, Cpu, Gauge, type LucideIcon } from 'lucide-react';

const fixture = [
  { label: 'Ingress', value: '800 req/min', detail: 'Cold-start 구간에 들어오는 요청률이다.', Icon: Activity, color: 'text-sky-700 dark:text-sky-300' },
  { label: 'Startup', value: '240 s', detail: 'Weight load와 engine init까지의 fixture다. Readiness warmup은 그 뒤의 별도 gate다.', Icon: Clock3, color: 'text-amber-700 dark:text-amber-300' },
  { label: 'User latency', value: 'TTFT 1.4 s', detail: 'p95 TTFT는 악화됐지만 TPOT는 안정적이다.', Icon: Gauge, color: 'text-rose-700 dark:text-rose-300' },
  { label: 'Ready capacity', value: '5 / 8 Ready', detail: '정책을 통과한 free GPU는 6개이고 그중 한 replica가 warmup 중이다.', Icon: Cpu, color: 'text-violet-700 dark:text-violet-300' },
] satisfies Array<{ label: string; value: string; detail: string; Icon: LucideIcon; color: string }>;

export function IncidentFixtureStrip() {
  const [active, setActive] = useState(0);
  const current = fixture[active];

  return (
    <div data-serving-fixture className="not-prose my-6 min-w-0 border border-border bg-background">
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4" role="tablist" aria-label="공통 serving incident fixture">
        {fixture.map(({ label, value, Icon, color }, index) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={`min-w-0 bg-background p-3 text-left transition-colors hover:bg-muted/40 ${index === active ? 'shadow-[inset_0_-2px_0_var(--foreground)]' : ''}`}
          >
            <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
            <strong className="mt-2 block font-mono text-sm [overflow-wrap:anywhere]">{value}</strong>
            <span className="text-xs text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>
      <div className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-t border-border px-3 py-3 text-xs leading-relaxed" role="tabpanel" aria-live="polite">
        <strong className={current.color}>{current.label}</strong>
        <span className="min-w-0 text-muted-foreground">{current.detail}</span>
      </div>
    </div>
  );
}
