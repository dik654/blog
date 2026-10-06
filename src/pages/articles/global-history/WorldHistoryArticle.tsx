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
}

export default function WorldHistoryArticle({ data }: { data: WorldHistoryArticleData }) {
  return (
    <div className="space-y-16">
      {data.sections.map((section) => (
        <LessonSection key={section.id} id={section.id} level={section.level} title={section.title} bridge={section.bridge}>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {section.paragraphs.map((paragraph) => <p key={paragraph} className={section.id === "overview" ? "text-lg leading-8" : "leading-8"}>{paragraph}</p>)}
          </div>
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
