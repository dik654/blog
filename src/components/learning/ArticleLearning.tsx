import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Check, CircleStop, ExternalLink, Lightbulb, Route, TriangleAlert } from 'lucide-react';
import { articlePath } from '@/lib/paths';

export function InternalLink({
  slug,
  learningPathId,
  children,
}: {
  slug: string;
  learningPathId?: string;
  children: ReactNode;
}) {
  const [searchParams] = useSearchParams();
  const activeLearningPathId = learningPathId ?? searchParams.get('path') ?? undefined;

  return (
    <Link
      className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
      data-learning-path-id={activeLearningPathId}
      state={activeLearningPathId ? { learningPathId: activeLearningPathId } : undefined}
      to={`${articlePath('ai', slug)}${activeLearningPathId ? `?path=${encodeURIComponent(activeLearningPathId)}` : ''}`}
    >
      {children}
    </Link>
  );
}

export interface LearningHandoffItem {
  label: '막히면' | '이어 읽기' | '되짚기' | '적용하기' | '원문으로';
  slug: string;
  title: string;
  reason: string;
  learningPathId?: string;
}

export function LearningHandoff({
  title = '여기서 다음 질문으로',
  description,
  items,
}: {
  title?: string;
  description?: string;
  items: LearningHandoffItem[];
}) {
  return (
    <nav
      aria-label={title}
      className="not-prose my-8 border-y border-border"
      data-learning-handoff
    >
      <div className="px-1 py-4 sm:px-2">
        <p className="text-xs font-bold text-muted-foreground">학습 경로 연결</p>
        <h3 className="mt-1 text-base font-bold leading-snug">{title}</h3>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <ol className="divide-y divide-border border-t border-border">
        {items.map((item) => (
          <li
            className="grid min-w-0 gap-2 px-1 py-4 sm:grid-cols-[5.25rem_minmax(0,1fr)] sm:gap-4 sm:px-2"
            key={`${item.label}-${item.slug}`}
          >
            <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
            <div className="min-w-0">
              <InternalLink slug={item.slug} learningPathId={item.learningPathId}>
                {item.title}
              </InternalLink>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.reason}</p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface SpecialistEntryLink {
  slug: string;
  title: string;
  reason: string;
  learningPathId?: string;
}

export interface SpecialistEntryProps {
  eyebrow?: string;
  title: string;
  description: string;
  prerequisites: string[];
  links: SpecialistEntryLink[];
}

export function SpecialistEntry({
  eyebrow = '전문 읽기 경로',
  title,
  description,
  prerequisites,
  links,
}: SpecialistEntryProps) {
  return (
    <section data-specialist-entry className="not-prose mb-8 min-w-0 border-y border-border">
      <div className="grid min-w-0 gap-3 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/25 text-muted-foreground" aria-hidden="true">
          <Route className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-bold leading-snug">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid min-w-0 gap-px border-t border-border bg-border lg:grid-cols-2">
        <div className="min-w-0 bg-background px-1 py-4 sm:px-2">
          <p className="text-xs font-bold text-muted-foreground">이 글이 이미 안다고 가정하는 것</p>
          <ul className="mt-3 grid gap-2">
            {prerequisites.map((item) => (
              <li key={item} className="grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] gap-2 text-sm leading-relaxed">
                <Check className="mt-1 h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label={`${title} 선행 학습`} className="min-w-0 divide-y divide-border bg-background px-1 sm:px-2">
          {links.map((link) => (
            <div key={link.slug} className="min-w-0 py-4">
              <InternalLink slug={link.slug} learningPathId={link.learningPathId}>{link.title}</InternalLink>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{link.reason}</p>
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}

export function StopRule({ children, title = '여기서 멈춘다.' }: { children: ReactNode; title?: string }) {
  return <div className="not-prose my-6 flex min-w-0 gap-3 rounded-md border border-amber-600/30 bg-amber-500/[0.04] p-4 text-sm leading-relaxed"><CircleStop className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" /><div className="min-w-0 break-words [overflow-wrap:anywhere]"><strong>{title}</strong> {children}</div></div>;
}

export function QuestionLead({
  question,
  answer,
  label = '먼저 답할 질문',
}: {
  question: string;
  answer: ReactNode;
  label?: string;
}) {
  return (
    <div data-learning-question className="not-prose mb-8 border-y border-border bg-muted/15 px-4 py-5 sm:px-6">
      <div className="learning-question__label">
        <span aria-hidden="true" />
        {label}
      </div>
      <p className="learning-question__question mt-2 text-lg font-bold leading-snug sm:text-xl">{question}</p>
      <div className="learning-question__answer mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{answer}</div>
    </div>
  );
}

export interface BeginnerOpeningStep {
  label: string;
  detail: string;
}

export function BeginnerOpening({
  title,
  description,
  familiarScene,
  steps,
}: {
  title: string;
  description: ReactNode;
  familiarScene: ReactNode;
  steps: BeginnerOpeningStep[];
}) {
  return (
    <div className="not-prose mb-8 border-y border-border" data-beginner-opening>
      <div className="grid min-w-0 gap-3 px-1 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/25 text-muted-foreground" aria-hidden="true">
          <BookOpen className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">이 글의 출발점</p>
          <h3 className="mt-1 max-w-3xl text-lg font-bold leading-snug text-foreground sm:text-xl">{title}</h3>
          <div className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</div>
        </div>
      </div>
      <div className="border-t border-border px-1 py-4 sm:px-2">
        <p className="text-xs font-bold text-muted-foreground">이미 알고 있는 장면에서 시작하기</p>
        <div className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground sm:text-base">{familiarScene}</div>
      </div>
      <ol className="grid border-t border-border sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={`${step.label}-${index}`}
            className={`grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-2.5 px-1 py-4 sm:block sm:px-4 ${index > 0 ? 'border-t border-border sm:border-l sm:border-t-0' : ''}`}
          >
            <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <div className="min-w-0 sm:mt-2">
              <p className="text-sm font-bold text-foreground">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function BeginnerBridge({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-beginner-opening className="not-prose mb-6 grid min-w-0 gap-3 border-y border-border px-1 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:px-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/25 text-muted-foreground" aria-hidden="true">
        <BookOpen className="h-4 w-4" />
      </span>
      <div className="min-w-0 max-w-3xl">
        <p className="text-xs font-bold text-muted-foreground">읽기 전에 떠올릴 한 장면</p>
        <h3 className="mt-1 text-base font-bold leading-snug text-foreground sm:text-lg">{title}</h3>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
      </div>
    </div>
  );
}

export interface PrimerItem {
  term: string;
  meaning: string;
  why: string;
}

export function ConceptPrimer({ title = '먼저 잡을 기초', items }: { title?: string; items: PrimerItem[] }) {
  return (
    <div data-concept-primer className="not-prose my-8">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item.term}
            className={`min-w-0 bg-background px-4 py-4 ${items.length % 2 === 1 && index === items.length - 1 ? 'sm:col-span-2' : ''}`}
          >
            <dt className="text-sm font-bold">{item.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.meaning}</dd>
            <dd className="mt-2 text-xs leading-relaxed text-foreground"><strong>왜 필요할까?</strong> {item.why}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Misconception({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 flex gap-3 rounded-md border border-border bg-muted/20 px-4 py-3 text-sm leading-relaxed">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 break-words [overflow-wrap:anywhere]"><strong>오해 방지.</strong> {children}</div>
    </div>
  );
}

export function CapabilityCheck({ title = '여기까지 오면', items }: { title?: string; items: string[] }) {
  return (
    <div className="not-prose my-8 border-y border-border py-5">
      <p className="mb-3 text-sm font-semibold">{title}</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-foreground" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface SourceLink {
  label: string;
  href: string;
  note: string;
}

export function SourceNotes({ sources }: { sources: SourceLink[] }) {
  return (
    <div className="not-prose my-8 border-t border-border pt-5">
      <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">근거와 더 읽을 자료</p>
      <ul className="space-y-2">
        {sources.map((source) => (
          <li key={source.href} className="text-sm leading-relaxed text-muted-foreground">
            <a
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              {source.label}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <span> · {source.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<string>>;
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-md border border-border">
      <table className="min-w-[640px] text-left text-sm">
        <thead className="bg-muted/45 text-xs text-muted-foreground">
          <tr>{headers.map((header) => <th key={header} className="px-3 py-2.5 font-semibold">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {rows.map((row) => (
            <tr key={row.join('|')} className="align-top">
              {row.map((cell, index) => (
                <td key={`${index}-${cell}`} className={`px-3 py-3 leading-relaxed ${index === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
