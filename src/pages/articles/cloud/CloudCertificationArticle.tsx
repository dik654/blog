import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock, { type AlgorithmStep } from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

type SectionId =
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

export interface CloudArticleSection {
  id: SectionId;
  level: "S" | "B" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  title: string;
  bridge: string;
  paragraphs: readonly [string, string, ...string[]];
}

export interface CloudCertificationArticleData {
  sections: readonly CloudArticleSection[];
  overviewFlow: {
    title: string;
    steps: readonly { actor: string; movement: string; receives: string }[];
  };
  numericCase: {
    title: string;
    steps: readonly { label: string; value: string; detail: string }[];
  };
  decision: {
    title: string;
    question: string;
    options: readonly { signal: string; choose: string; why: string }[];
  };
  terms: {
    title: string;
    items: readonly {
      term: string;
      description: string;
      example: string;
      boundary: string;
    }[];
  };
  algorithm: {
    title: string;
    input: readonly string[];
    steps: readonly AlgorithmStep[];
    output: string;
    repeatUntil?: string;
  };
  examScope?: {
    title: string;
    asOf: string;
    domains: readonly { name: string; weight: string; focus: string }[];
  };
  currentNotice?: {
    label: string;
    body: string;
    href: string;
    linkLabel: string;
  };
  sources: readonly [
    {
      source: string;
      excerpt: string;
      application: string;
      citation: string;
      href: string;
      note: string;
    },
    {
      source: string;
      excerpt: string;
      application: string;
      citation: string;
      href: string;
      note: string;
    },
  ];
  review: readonly [string, string, string];
}

function DecisionMatrix({ data }: { data: CloudCertificationArticleData["decision"] }) {
  return (
    <figure
      data-viz="cloud-decision-matrix"
      className="not-prose my-8 min-w-0 overflow-hidden rounded-2xl border border-border bg-muted/10"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold text-primary">선택 문제</p>
        <p className="mt-1 font-semibold text-foreground">{data.title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{data.question}</p>
      </figcaption>
      <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">
        {data.options.map((option, index) => (
          <div key={option.signal} className="min-w-0 rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-bold text-primary">조건 {index + 1}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{option.signal}</p>
            <p className="mt-3 break-words font-semibold text-foreground">{option.choose}</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{option.why}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function ExamScope({ data }: { data: NonNullable<CloudCertificationArticleData["examScope"]> }) {
  return (
    <figure data-viz="exam-scope" className="not-prose my-8 min-w-0 border-y border-border py-5">
      <figcaption>
        <p className="font-semibold text-foreground">{data.title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">공식 가이드 기준: {data.asOf}</p>
      </figcaption>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {data.domains.map((domain) => (
          <div key={domain.name} className="min-w-0 rounded-xl border border-border bg-background p-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <p className="min-w-0 break-words text-sm font-semibold text-foreground">{domain.name}</p>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {domain.weight}
              </span>
            </div>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{domain.focus}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export default function CloudCertificationArticle({ data }: { data: CloudCertificationArticleData }) {
  return (
    <div className="space-y-16">
      {data.sections.map((section) => (
        <LessonSection
          key={section.id}
          id={section.id}
          level={section.level}
          title={section.title}
          bridge={section.bridge}
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className={section.id === "overview" ? "text-lg leading-8" : "leading-8"}>
                {paragraph}
              </p>
            ))}
          </div>
          {section.id === "black-box" ? (
            <FlowRail title={data.overviewFlow.title} steps={[...data.overviewFlow.steps]} />
          ) : null}
          {section.id === "case" ? (
            <NumericPath title={data.numericCase.title} steps={[...data.numericCase.steps]} />
          ) : null}
          {section.id === "picture" ? <DecisionMatrix data={data.decision} /> : null}
          {section.id === "names" ? <TermBreakdown title={data.terms.title} items={[...data.terms.items]} /> : null}
          {section.id === "mechanism" ? (
            <AlgorithmBlock
              title={data.algorithm.title}
              input={data.algorithm.input}
              steps={data.algorithm.steps}
              output={data.algorithm.output}
              repeatUntil={data.algorithm.repeatUntil}
            />
          ) : null}
          {section.id === "source" ? (
            <>
              <SourceApplication
                source={data.sources[0].source}
                excerpt={data.sources[0].excerpt}
                application={data.sources[0].application}
              />
              <CitationBlock source={data.sources[0].citation} citeKey={1} href={data.sources[0].href}>
                {data.sources[0].note}
              </CitationBlock>
            </>
          ) : null}
          {section.id === "comparison" ? (
            <>
              {data.examScope ? <ExamScope data={data.examScope} /> : null}
              {data.currentNotice ? (
                <aside className="not-prose my-6 min-w-0 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300">{data.currentNotice.label}</p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{data.currentNotice.body}</p>
                  <a
                    className="mt-3 inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-primary underline underline-offset-4"
                    href={data.currentNotice.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.currentNotice.linkLabel}
                  </a>
                </aside>
              ) : null}
              <SourceApplication
                source={data.sources[1].source}
                excerpt={data.sources[1].excerpt}
                application={data.sources[1].application}
              />
              <CitationBlock source={data.sources[1].citation} citeKey={2} href={data.sources[1].href}>
                {data.sources[1].note}
              </CitationBlock>
            </>
          ) : null}
          {section.id === "limits" ? <ReviewPrompts questions={[...data.review]} /> : null}
        </LessonSection>
      ))}
    </div>
  );
}
