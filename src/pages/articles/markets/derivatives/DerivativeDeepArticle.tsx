import { Fragment } from "react";
import type { ComponentProps, ReactNode } from "react";
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

/** 절 id → 문단 번호 → 그 문단 바로 앞에 놓을 Viz. 없으면 기존과 똑같이 문단 묶음 하나로 렌더합니다. */
export type DerivativeVizBefore = Readonly<Record<string, Readonly<Record<number, ReactNode>>>>;

function paragraphGroups(paragraphs: readonly string[], viz?: Readonly<Record<number, ReactNode>>) {
  if (!viz) return [{ start: 0, viz: null as ReactNode, paragraphs }];
  const starts = paragraphs.map((_, index) => index).filter((index) => index === 0 || viz[index] !== undefined);
  return starts.map((start, n) => ({ start, viz: viz[start] ?? null, paragraphs: paragraphs.slice(start, starts[n + 1] ?? paragraphs.length) }));
}

export default function DerivativeDeepArticle({ data, vizBefore }: { data: DerivativeDeepArticleData; vizBefore?: DerivativeVizBefore }) {
  return (
    <div className="space-y-16">
      {data.sections.map((section) => (
        <LessonSection key={section.id} id={section.id} level={section.level} title={section.title} bridge={section.bridge}>
          {paragraphGroups(section.paragraphs, vizBefore?.[section.id]).map((group) => (
            <Fragment key={group.start}>
              {group.viz}
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                {group.paragraphs.map((paragraph) => <p key={paragraph} className={section.id === "overview" ? "text-lg leading-8" : "leading-8"}>{paragraph}</p>)}
              </div>
            </Fragment>
          ))}
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
