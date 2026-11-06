import { Fragment, type ReactNode } from "react";
import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

type SectionId = "overview" | "black-box" | "case" | "picture" | "need" | "names" | "mechanism" | "source" | "comparison" | "limits";

export interface WorldHistorySection {
  id: SectionId;
  level: "S" | "B" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  title: string;
  bridge: string;
  paragraphs: readonly [string, string, ...string[]];
}

export interface WorldHistoryArticleData {
  sections: readonly WorldHistorySection[];
  overviewFlow: { title: string; steps: readonly { actor: string; movement: string; receives: string }[] };
  numericCase: { title: string; steps: readonly { label: string; value: string; detail: string }[] };
  terms: { title: string; items: readonly { term: string; description: string; example: string; boundary: string }[] };
  sources: readonly [
    { source: string; excerpt: string; application: string; citation: string; href: string; note: string },
    { source: string; excerpt: string; application: string; citation: string; href: string; note: string },
  ];
  review: readonly [string, string, string];
  /** 절 id → 문단 번호(0부터) → 그 문단 바로 앞에 둘 Viz. 없으면 문단을 한 덩어리로 그립니다. */
  figures?: Partial<Record<SectionId, Readonly<Record<number, ReactNode>>>>;
}

/** figures가 가리키는 문단 앞에서 prose를 나눠, 문단 묶음과 Viz를 번갈아 그립니다. */
function SectionProse({ section, figures = {} }: { section: WorldHistorySection; figures?: Readonly<Record<number, ReactNode>> }) {
  const paragraphClass = section.id === "overview" ? "text-lg leading-8" : "leading-8";
  const starts = section.paragraphs.map((_, index) => index).filter((index) => index === 0 || figures[index] !== undefined);
  return (
    <>
      {starts.map((start, position) => (
        <Fragment key={start}>
          {figures[start]}
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {section.paragraphs.slice(start, starts[position + 1]).map((paragraph) => <p key={paragraph} className={paragraphClass}>{paragraph}</p>)}
          </div>
        </Fragment>
      ))}
    </>
  );
}

export default function WorldHistoryArticle({ data }: { data: WorldHistoryArticleData }) {
  return (
    <div className="space-y-16">
      {data.sections.map((section) => (
        <LessonSection key={section.id} id={section.id} level={section.level} title={section.title} bridge={section.bridge}>
          <SectionProse section={section} figures={data.figures?.[section.id]} />
          {section.id === "black-box" ? <FlowRail title={data.overviewFlow.title} steps={[...data.overviewFlow.steps]} /> : null}
          {section.id === "case" ? <NumericPath title={data.numericCase.title} steps={[...data.numericCase.steps]} /> : null}
          {section.id === "names" ? <TermBreakdown title={data.terms.title} items={[...data.terms.items]} /> : null}
          {section.id === "source" ? (
            <>
              <SourceApplication source={data.sources[0].source} excerpt={data.sources[0].excerpt} application={data.sources[0].application} />
              <CitationBlock source={data.sources[0].citation} citeKey={1} href={data.sources[0].href}>{data.sources[0].note}</CitationBlock>
            </>
          ) : null}
          {section.id === "comparison" ? (
            <>
              <SourceApplication source={data.sources[1].source} excerpt={data.sources[1].excerpt} application={data.sources[1].application} />
              <CitationBlock source={data.sources[1].citation} citeKey={2} href={data.sources[1].href}>{data.sources[1].note}</CitationBlock>
            </>
          ) : null}
          {section.id === "limits" ? <ReviewPrompts questions={[...data.review]} /> : null}
        </LessonSection>
      ))}
    </div>
  );
}
