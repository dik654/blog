import type { ReactNode } from "react";
import Math from "@/components/ui/math";
import FormulaGuide, { type FormulaTerm } from "@/components/ui/formula-guide";

interface ExplainedFormulaProps {
  question: string;
  idea: ReactNode;
  formula: string;
  terms: readonly FormulaTerm[];
  interpretation: string;
  assumptions?: readonly string[];
  title?: string;
}

/**
 * 설명 없이 KaTeX부터 나타나는 일을 막는 수식 블록입니다.
 * 질문과 설계 아이디어를 먼저 읽고, 식과 기호 해설을 순서대로 따라갑니다.
 */
export default function ExplainedFormula({
  question,
  idea,
  formula,
  terms,
  interpretation,
  assumptions = [],
  title,
}: ExplainedFormulaProps) {
  return (
    <div data-formula-explained className="not-prose my-9 min-w-0">
      <div className="mb-3 border-l border-primary/60 pl-4">
        <p className="text-xs font-bold text-primary">이 식이 답하는 질문</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
          {question}
        </p>
        <div className="mt-2 text-sm leading-6 text-muted-foreground">{idea}</div>
      </div>
      <div className="min-w-0 overflow-x-auto rounded-lg border border-border/70 bg-background px-4 py-5 sm:px-6">
        <Math display>{formula}</Math>
      </div>
      <FormulaGuide
        title={title}
        terms={terms}
        assumptions={assumptions}
        interpretation={interpretation}
      />
    </div>
  );
}
