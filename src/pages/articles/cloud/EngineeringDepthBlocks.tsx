export type EngineeringSectionId =
  | "overview"
  | "black-box"
  | "case"
  | "picture"
  | "need"
  | "names"
  | "mechanism"
  | "source"
  | "comparison"
  | "limits";

export interface EngineeringLedgerData {
  section: EngineeringSectionId;
  title: string;
  question: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  conclusion: string;
}

export interface EngineeringEvidenceData {
  section: EngineeringSectionId;
  eyebrow: string;
  title: string;
  question: string;
  body: string;
  language?: string;
  command?: string;
  normal?: {
    label: string;
    output: string;
    reading: string;
  };
  failure?: {
    label: string;
    output: string;
    reading: string;
  };
  source?: {
    label: string;
    href: string;
    location: string;
  };
}

export interface EngineeringSourceData {
  label: string;
  href: string;
  claim: string;
  checkedAt: string;
}

export interface EngineeringDepthData {
  ledgers: readonly EngineeringLedgerData[];
  evidence: readonly EngineeringEvidenceData[];
  sources: readonly EngineeringSourceData[];
}

function LedgerTable({ ledger }: { ledger: EngineeringLedgerData }) {
  return (
    <figure
      className="not-prose my-8 min-w-0 border-y border-border py-5"
      data-viz="engineering-ledger"
      data-teach-level={ledger.section === "mechanism" ? "4" : undefined}
    >
      <figcaption>
        <p className="text-xs font-bold text-primary">확인 순서</p>
        <p className="mt-1 font-semibold text-foreground">{ledger.title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{ledger.question}</p>
      </figcaption>
      <div className="mt-4 grid gap-3 lg:hidden">
        {ledger.rows.map((row, rowIndex) => (
          <div key={`${ledger.title}-mobile-${rowIndex}`} className="min-w-0 rounded-xl border border-border bg-background p-4">
            {row.map((cell, cellIndex) => (
              <div key={`${cellIndex}-${cell}`} className={cellIndex === 0 ? "" : "mt-3 border-t border-border pt-3"}>
                <p className="text-xs font-semibold text-foreground">{ledger.columns[cellIndex]}</p>
                <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-muted-foreground">{cell}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 hidden max-w-full overflow-x-auto lg:block">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              {ledger.columns.map((column) => (
                <th key={column} className="min-w-40 px-3 py-3 font-semibold text-foreground">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ledger.rows.map((row, rowIndex) => (
              <tr key={`${ledger.title}-${rowIndex}`} className="border-b border-border align-top">
                {row.map((cell, cellIndex) => (
                  <td key={`${cellIndex}-${cell}`} className="min-w-40 whitespace-pre-line px-3 py-3 leading-6 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-6 text-foreground">{ledger.conclusion}</p>
    </figure>
  );
}

function OutputPanel({
  tone,
  label,
  output,
  reading,
}: {
  tone: "normal" | "failure";
  label: string;
  output: string;
  reading: string;
}) {
  const toneClass =
    tone === "normal"
      ? "border-emerald-600/30 bg-emerald-500/5"
      : "border-rose-600/30 bg-rose-500/5";

  return (
    <div
      className={`min-w-0 rounded-xl border p-4 ${toneClass}`}
      data-teach-level={tone === "normal" ? "6" : "7"}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-foreground">{label}</p>
      <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-background p-3 text-xs leading-5 text-foreground">
        <code>{output}</code>
      </pre>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{reading}</p>
    </div>
  );
}

function EvidenceBlock({ evidence }: { evidence: EngineeringEvidenceData }) {
  return (
    <figure className="not-prose my-8 min-w-0 rounded-xl border border-border bg-muted/10 p-4 sm:p-5" data-viz="engineering-evidence">
      <figcaption>
        <p className="text-xs font-bold text-primary">{evidence.eyebrow}</p>
        <p className="mt-1 font-semibold text-foreground">{evidence.title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{evidence.question}</p>
      </figcaption>
      <p className="mt-4 text-sm leading-7 text-foreground">{evidence.body}</p>
      {evidence.command ? (
        <div className="mt-4 min-w-0" data-teach-level="5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            실제 명령·설정{evidence.language ? ` · ${evidence.language}` : ""}
          </p>
          <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 text-xs leading-5 text-foreground">
            <code>{evidence.command}</code>
          </pre>
        </div>
      ) : null}
      {evidence.normal || evidence.failure ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {evidence.normal ? <OutputPanel tone="normal" {...evidence.normal} /> : null}
          {evidence.failure ? <OutputPanel tone="failure" {...evidence.failure} /> : null}
        </div>
      ) : null}
      {evidence.source ? (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          근거: <a className="font-semibold text-primary underline underline-offset-4" href={evidence.source.href} target="_blank" rel="noreferrer">{evidence.source.label}</a>
          {` · ${evidence.source.location}`}
        </p>
      ) : null}
    </figure>
  );
}

function SourceLedger({ sources }: { sources: readonly EngineeringSourceData[] }) {
  return (
    <aside className="not-prose my-8 min-w-0 border-y border-border py-5">
      <p className="text-xs font-bold text-primary">확인에 쓴 1차 자료</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">어떤 판단을 어느 문서에서 확인했나</h3>
      <ul className="mt-4 space-y-3">
        {sources.map((source) => (
          <li key={`${source.label}-${source.href}`} className="rounded-xl border border-border bg-background p-4">
            <a className="font-semibold text-primary underline underline-offset-4" href={source.href} target="_blank" rel="noreferrer">
              {source.label}
            </a>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.claim}</p>
            <p className="mt-2 text-xs text-muted-foreground">확인일: {source.checkedAt}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function EngineeringDepthBlocks({
  data,
  section,
}: {
  data: EngineeringDepthData;
  section: EngineeringSectionId;
}) {
  const ledgers = data.ledgers.filter((ledger) => ledger.section === section);
  const evidence = data.evidence.filter((item) => item.section === section);

  return (
    <>
      {ledgers.map((ledger) => <LedgerTable key={`${section}-${ledger.title}`} ledger={ledger} />)}
      {evidence.map((item) => <EvidenceBlock key={`${section}-${item.title}`} evidence={item} />)}
      {section === "limits" ? <SourceLedger sources={data.sources} /> : null}
    </>
  );
}
