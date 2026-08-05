import type { ReactNode } from 'react';
import { Code2 } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import type { CodeRef } from '@/components/code/types';

export function SectionTitle({
  number,
  kicker,
  children,
  promise,
}: {
  number: string;
  kicker: string;
  children: ReactNode;
  promise: string;
}) {
  return (
    <header className="not-prose mb-7 border-t border-border pt-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-2xl font-bold text-muted-foreground/60">{number}</span>
        <span className="text-xs font-semibold uppercase text-cyan-700 dark:text-cyan-300">{kicker}</span>
      </div>
      <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{children}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{promise}</p>
    </header>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose prose-neutral max-w-none dark:prose-invert">{children}</div>;
}

export function Formula({
  latex,
  latexCompact,
  meaning,
  symbols,
}: {
  latex: string;
  latexCompact?: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        {latexCompact ? (
          <>
            <Math display minScale={0.68} className="my-0 text-[12px] sm:hidden">{latexCompact}</Math>
            <Math display minScale={0.68} className="my-0 hidden sm:block sm:text-base">{latex}</Math>
          </>
        ) : (
          <Math display minScale={0.68} className="my-0 text-[12px] sm:text-base">{latex}</Math>
        )}
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export function CodeEvidence({
  codeKey,
  codeRef,
  onCodeRef,
  title,
  children,
}: {
  codeKey: string;
  codeRef: CodeRef;
  onCodeRef: (key: string, ref: CodeRef) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose my-7 flex min-w-0 flex-col gap-4 border-y border-border bg-muted/15 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
      <button
        type="button"
        onClick={() => onCodeRef(codeKey, codeRef)}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold transition-colors hover:bg-muted"
      >
        <Code2 className="h-4 w-4" aria-hidden="true" />
        실제 소스
      </button>
    </div>
  );
}

export function LabShell({
  dataAttribute,
  eyebrow,
  title,
  tabs,
  active,
  onChange,
  children,
}: {
  dataAttribute: string;
  eyebrow: string;
  title: string;
  tabs: readonly string[];
  active: number;
  onChange: (index: number) => void;
  children: ReactNode;
}) {
  return (
    <figure
      {...{ [dataAttribute]: '' }}
      className="not-prose my-9 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{eyebrow}</p>
        <p className="mt-1 text-lg font-bold">{title}</p>
      </figcaption>
      <div
        role="tablist"
        aria-label={title}
        className="grid min-w-0 grid-cols-2 gap-1 border-b border-border bg-muted/20 p-2 sm:flex sm:flex-wrap"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => onChange(index)}
            className={`min-h-11 min-w-0 rounded-md px-2 text-sm font-semibold leading-snug transition-colors sm:px-3 ${
              tabs.length % 2 === 1 && index === tabs.length - 1 ? 'col-span-2 sm:col-span-1' : ''
            } ${
              active === index
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-background hover:text-foreground'
            }`}
          >
            {index + 1}. {tab}
          </button>
        ))}
      </div>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
    </figure>
  );
}

export function Metric({
  label,
  value,
  note,
  tone = 'plain',
}: {
  label: string;
  value: string;
  note: string;
  tone?: 'plain' | 'cyan' | 'amber';
}) {
  const toneClass = tone === 'cyan'
    ? 'border-cyan-500/35 bg-cyan-500/[0.05]'
    : tone === 'amber'
      ? 'border-amber-500/35 bg-amber-500/[0.05]'
      : 'border-border bg-background';
  return (
    <div className={`min-w-0 rounded-md border p-4 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-xl font-bold [overflow-wrap:anywhere]">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}
