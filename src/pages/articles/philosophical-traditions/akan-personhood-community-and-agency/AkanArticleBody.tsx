import { Fragment, type ReactNode } from "react";
import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../../world-systems/FlowRail";
import NumericPath from "../../world-systems/NumericPath";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import SourceApplication from "../../world-systems/SourceApplication";
import type { TraditionArticleData } from "../TraditionArticle";
import HoursGridViz from "./viz/HoursGridViz";
import PersonhoodContrastViz from "./viz/PersonhoodContrastViz";
import TwoWayLoopViz from "./viz/TwoWayLoopViz";
import ZeroHoursBranchViz from "./viz/ZeroHoursBranchViz";

/** 공용 TraditionArticle과 같은 출력에, 문단 사이 Viz 자리만 더한 본문입니다. 키는 section id, 값은 Viz 뒤에 올 문단 번호입니다. */
const VIZ_BEFORE: Record<string, Record<number, ReactNode>> = {
  case: { 1: <HoursGridViz /> },
  picture: { 0: <TwoWayLoopViz /> },
  mechanism: { 0: <ZeroHoursBranchViz /> },
  source: { 0: <PersonhoodContrastViz /> },
};

export default function AkanArticleBody({ data }: { data: TraditionArticleData }) {
  return (
    <div className="space-y-16">
      {data.sections.map((section) => {
        const slots = VIZ_BEFORE[section.id] ?? {};
        const blocks: { viz?: ReactNode; paragraphs: string[] }[] = [];
        section.paragraphs.forEach((paragraph, index) => {
          if (index === 0 || slots[index]) blocks.push({ viz: slots[index], paragraphs: [] });
          blocks[blocks.length - 1].paragraphs.push(paragraph);
        });
        return (
          <LessonSection key={section.id} id={section.id} level={section.level} title={section.title} bridge={section.bridge}>
            {blocks.map((block, index) => (
              <Fragment key={index}>
                {block.viz}
                <div className="prose prose-neutral max-w-none dark:prose-invert">
                  {block.paragraphs.map((paragraph) => <p key={paragraph} className={section.id === "overview" ? "text-lg leading-8" : "leading-8"}>{paragraph}</p>)}
                </div>
              </Fragment>
            ))}
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
        );
      })}
    </div>
  );
}
