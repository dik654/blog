import type { ReactNode } from "react";

export function LearningHeader({
  n,
  kicker,
  title,
}: {
  n: string;
  kicker: string;
  title: string;
}) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-black tracking-[0.18em] text-primary">
        {n} · {kicker}
      </p>
      <h2 className="text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
    </header>
  );
}

export function LearningTerm({
  name,
  shape,
  meaning,
  example,
  boundary,
}: {
  name: string;
  shape: string;
  meaning: ReactNode;
  example: ReactNode;
  boundary: ReactNode;
}) {
  return (
    <div className="not-prose grid min-w-0 gap-px overflow-hidden border border-border bg-border md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
      <div className="min-w-0 bg-background p-5 sm:p-6">
        <p className="text-xs font-black text-primary">이 개념의 이름</p>
        <p className="mt-2 text-lg font-black leading-7">{name}</p>
        <p className="mt-4 break-words font-mono text-sm leading-6 text-foreground">
          {shape}
        </p>
      </div>
      <div className="min-w-0 space-y-5 bg-background p-5 sm:p-6">
        <TermRow label="뜻">{meaning}</TermRow>
        <TermRow label="작은 예">{example}</TermRow>
        <TermRow label="경계">{boundary}</TermRow>
      </div>
    </div>
  );
}

function TermRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-black text-primary">{label}</p>
      <div className="mt-1 text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function EvidenceFields({
  problem,
  contribution,
  assumptions,
  scope,
  notClaim,
}: {
  problem: string;
  contribution: string;
  assumptions: string;
  scope: string;
  notClaim: string;
}) {
  return (
    <dl className="grid gap-3 text-sm leading-6">
      {[
        ["문제", problem],
        ["기여", contribution],
        ["전제", assumptions],
        ["근거 범위", scope],
        ["일반화 금지", notClaim],
      ].map(([label, value]) => (
        <div key={label} className="grid gap-1 sm:grid-cols-[7rem_1fr]">
          <dt className="font-black text-foreground">{label}</dt>
          <dd className="min-w-0 text-muted-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
