import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../../world-systems/FlowRail";
import NumericPath from "../../world-systems/NumericPath";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import SourceApplication from "../../world-systems/SourceApplication";
import { canadaHongKongSwitzerlandData as data } from "./derivative-operations-and-governance-data";

export default function CanadaHongKongSwitzerlandDerivativesArticle() {
  return (
    <div className="space-y-16">
      {data.sections.map((section) => (
        <LessonSection key={section.id} id={section.id} level={section.level} title={section.title} bridge={section.bridge}>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className={section.id === "overview" ? "text-lg leading-8" : "leading-8"}>{paragraph}</p>
            ))}
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
              {data.sources.slice(1).map((source, index) => (
                <div key={source.href} className={index > 0 ? "mt-8" : undefined}>
                  <SourceApplication source={source.source} excerpt={source.excerpt} application={source.application} />
                  <CitationBlock source={source.citation} citeKey={index + 2} href={source.href}>{source.note}</CitationBlock>
                </div>
              ))}
            </>
          ) : null}
          {section.id === "limits" ? <ReviewPrompts questions={[...data.review]} /> : null}
        </LessonSection>
      ))}
    </div>
  );
}
