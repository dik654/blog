import type { ComponentProps } from "react";
import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { WorldHistoryArticleData, WorldHistorySection } from "../../global-history/WorldHistoryArticle";
import FlowRail from "../../world-systems/FlowRail";
import NumericPath from "../../world-systems/NumericPath";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import SourceApplication from "../../world-systems/SourceApplication";

/** 절 본문 바로 아래에 놓는 설명형 수식. 모형 계보·검산 식을 그 절의 숫자와 함께 보여 준다. */
export interface DerivativeArticleFormula {
  section: WorldHistorySection["id"];
  content: ComponentProps<typeof ExplainedFormula>;
}

export interface DerivativeDeepArticleData extends WorldHistoryArticleData {
  formulas?: readonly DerivativeArticleFormula[];
}

export default function DerivativeDeepArticle({ data }: { data: DerivativeDeepArticleData }) {
  return (
    <div className="space-y-16">
      {data.sections.map((section) => (
        <LessonSection key={section.id} id={section.id} level={section.level} title={section.title} bridge={section.bridge}>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {section.paragraphs.map((paragraph) => <p key={paragraph} className={section.id === "overview" ? "text-lg leading-8" : "leading-8"}>{paragraph}</p>)}
          </div>
          {data.formulas
            ?.filter((formula) => formula.section === section.id)
            .map((formula, index) => (
              <ExplainedFormula
                key={`${section.id}-${formula.content.question}-${index}`}
                title={formula.content.title}
                question={formula.content.question}
                idea={formula.content.idea}
                formula={formula.content.formula}
                annotatedFormula={formula.content.annotatedFormula}
                operations={formula.content.operations}
                terms={formula.content.terms}
                assumptions={formula.content.assumptions}
                interpretation={formula.content.interpretation}
              />
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
      ))}
    </div>
  );
}
