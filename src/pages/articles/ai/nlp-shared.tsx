import type { ReactNode } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MathFormula from '@/components/ui/math';

type Tone = 'teal' | 'blue' | 'violet' | 'amber' | 'green';

const toneClasses: Record<Tone, { border: string; dot: string; number: string }> = {
  teal: { border: 'border-teal-600/25 bg-teal-500/[0.035]', dot: 'bg-teal-600', number: 'text-teal-700/40 dark:text-teal-300/45' },
  blue: { border: 'border-blue-600/25 bg-blue-500/[0.035]', dot: 'bg-blue-600', number: 'text-blue-700/40 dark:text-blue-300/45' },
  violet: { border: 'border-violet-600/25 bg-violet-500/[0.035]', dot: 'bg-violet-600', number: 'text-violet-700/40 dark:text-violet-300/45' },
  amber: { border: 'border-amber-600/25 bg-amber-500/[0.035]', dot: 'bg-amber-600', number: 'text-amber-700/40 dark:text-amber-300/45' },
  green: { border: 'border-emerald-600/25 bg-emerald-500/[0.035]', dot: 'bg-emerald-600', number: 'text-emerald-700/40 dark:text-emerald-300/45' },
};
const toneOrder: Tone[] = ['teal', 'blue', 'violet', 'amber', 'green'];

export function NlpSection({
  id,
  title,
  question,
  marker,
  tone = 'blue',
  children,
}: {
  id: string;
  title: string;
  question: string;
  marker?: string;
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <section id={id} data-formula-pair className="mb-16 scroll-mt-20">
      <header className={`mb-6 grid items-start gap-3 border-t pt-5 ${marker ? 'grid-cols-[3.25rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)]' : ''}`}>
        {marker && <span className={`inline-flex h-[1.5em] select-none items-center font-mono text-4xl font-black leading-none sm:text-5xl ${toneClasses[tone].number}`} aria-hidden="true">{marker}</span>}
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold leading-relaxed text-muted-foreground"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneClasses[tone].dot}`} aria-hidden="true" />{question}</p>
          <h2 className="text-2xl font-bold leading-tight">{title}</h2>
        </div>
      </header>
      {children}
    </section>
  );
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-md border border-border bg-muted/25 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 rounded border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${value === option.value ? 'border-border bg-background text-foreground shadow-sm' : 'border-transparent text-muted-foreground hover:border-border/70 hover:text-foreground'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function FlowRow({
  items,
  activeIndex,
}: {
  items: ReadonlyArray<{ label: string; value?: string; latex?: string; note?: string; tone?: Tone }>;
  activeIndex?: number;
}) {
  return (
    <div className="grid min-w-0 gap-2 lg:flex lg:items-stretch">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="contents">
          <motion.div layout className={`min-w-0 rounded-md border p-3 shadow-[0_1px_2px_rgba(0,0,0,0.025)] lg:flex-1 ${toneClasses[item.tone ?? toneOrder[index % toneOrder.length]].border} ${activeIndex === index ? 'ring-1 ring-foreground/15' : ''}`}>
            <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneClasses[item.tone ?? toneOrder[index % toneOrder.length]].dot}`} aria-hidden="true" />{item.label}</p>
            {item.latex ? (
              <div className="mt-1 min-w-0 break-words font-mono text-sm font-bold leading-relaxed [overflow-wrap:anywhere]">
                <MathFormula>{item.latex}</MathFormula>
              </div>
            ) : item.value ? (
              <p className="mt-1 break-words font-mono text-sm font-bold leading-relaxed">{item.value}</p>
            ) : null}
            {item.note && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</p>}
          </motion.div>
          {index < items.length - 1 && (
            <span className="flex items-center justify-center text-muted-foreground lg:w-5 lg:shrink-0" aria-hidden="true">
              <ArrowDown className="h-4 w-4 lg:hidden" />
              <ArrowRight className="hidden h-4 w-4 lg:block" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function MetricGrid({
  items,
  mobileColumns = 1,
}: {
  items: ReadonlyArray<{ label: string; value: string; note?: string; accent?: boolean }>;
  mobileColumns?: 1 | 2;
}) {
  const responsiveColumns = items.length >= 4
    ? 'sm:grid-cols-2 lg:grid-cols-4'
    : items.length === 3
      ? 'sm:grid-cols-3'
      : items.length === 2
        ? 'sm:grid-cols-2'
        : '';

  return (
    <dl className={`grid gap-px overflow-hidden rounded-md border border-border bg-border ${responsiveColumns} ${mobileColumns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {items.map((item) => (
        <div key={item.label} className={`min-w-0 bg-background p-3 ${item.accent ? 'text-blue-700 dark:text-blue-300' : ''}`}>
          <dt className="text-xs font-semibold text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 break-words font-mono text-base font-bold">{item.value}</dd>
          {item.note && <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function ProbabilityBars({
  items,
  label,
  scaleMax,
  formatValue,
}: {
  items: ReadonlyArray<{ label: string; value: number; color?: string }>;
  label: string;
  scaleMax?: number;
  formatValue?: (value: number) => string;
}) {
  const max = Math.max(scaleMax ?? Math.max(...items.map((item) => item.value), 0.0001), 0.0001);
  return (
    <div aria-label={label} className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="grid min-w-0 grid-cols-[minmax(3.5rem,auto)_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
          <span className="truncate font-medium" title={item.label}>{item.label}</span>
          <span className="h-2 overflow-hidden rounded-sm bg-muted ring-1 ring-inset ring-border/40">
            <motion.span
              data-bar-value={item.value}
              className="block h-full rounded-sm"
              initial={false}
              animate={{ width: `${Math.min(100, Math.max(0, (item.value / max) * 100))}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              style={{ backgroundColor: item.color ?? '#2563eb' }}
            />
          </span>
          <span className="text-right font-mono text-muted-foreground">
            {formatValue
              ? formatValue(item.value)
              : Number.isInteger(item.value)
                ? item.value.toLocaleString('ko-KR')
                : item.value.toFixed(3)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 border-y border-border bg-muted/15 px-4 py-4 text-sm leading-relaxed">
      <strong>핵심 연결.</strong> {children}
    </div>
  );
}
