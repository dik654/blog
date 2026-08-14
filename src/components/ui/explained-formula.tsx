import type { ReactNode } from "react";
import Math from "@/components/ui/math";
import FormulaGuide, { type FormulaTerm } from "@/components/ui/formula-guide";

export interface FormulaOperationAnnotation {
  /** The smallest meaningful fragment to show under an underbrace. */
  expression: string;
  /** Why this operation exists, not merely how its symbols are named. */
  annotation: string | readonly string[];
}

interface ExplainedFormulaProps {
  question: string;
  idea: ReactNode;
  formula: string;
  /** A domain-specific KaTeX formula with underbrace/overbrace annotations. */
  annotatedFormula?: string;
  /** Domain-specific operation fragments. Generic fallbacks are inferred when omitted. */
  operations?: readonly FormulaOperationAnnotation[];
  terms: readonly FormulaTerm[];
  interpretation: string;
  assumptions?: readonly string[];
  title?: string;
}

function annotationLines(annotation: FormulaOperationAnnotation["annotation"]) {
  return typeof annotation === "string" ? [annotation] : [...annotation];
}

function escapeKatexText(value: string) {
  return value
    .replace(/\\/g, String.raw`\textbackslash{}`)
    .replace(/([{}%#$&_])/g, String.raw`\$1`)
    .replace(/\^/g, String.raw`\textasciicircum{}`)
    .replace(/~/g, String.raw`\textasciitilde{}`);
}

function annotatedOperation({
  expression,
  annotation,
}: FormulaOperationAnnotation) {
  const note = annotationLines(annotation)
    .map((line) => String.raw`\text{${escapeKatexText(line)}}`)
    .join(String.raw`\\`);
  return String.raw`\underbrace{${expression}}_{\substack{${note}}}`;
}

function inferOperations(formula: string): FormulaOperationAnnotation[] {
  const operations: FormulaOperationAnnotation[] = [];
  const add = (operation: FormulaOperationAnnotation) => {
    if (operations.length < 8) operations.push(operation);
  };

  if (/\\sum\b/.test(formula)) {
    add({
      expression: String.raw`\sum_{\text{index 범위}} \text{각 항}`,
      annotation: ["각 index에서 만든 기여를", "지정한 범위 전체에 누적"],
    });
  }
  if (/\\prod\b/.test(formula)) {
    add({
      expression: String.raw`\prod_{\text{index 범위}} \text{각 항}`,
      annotation: ["각 단계의 요인을", "순서대로 누적 곱"],
    });
  }
  if (/\\land|\\wedge/.test(formula)) {
    add({
      expression: String.raw`A_1\land A_2\land\cdots\land A_n`,
      annotation: ["모든 gate가 참일 때만", "전체 조건을 통과"],
    });
  }
  if (/\\lor|\\vee/.test(formula)) {
    add({
      expression: String.raw`A_1\lor A_2\lor\cdots\lor A_n`,
      annotation: ["후보 중 하나라도 참이면", "대안 조건을 통과"],
    });
  }
  if (/\\frac\s*\{/.test(formula)) {
    add({
      expression: String.raw`\frac{\text{관심량}}{\text{기준량}}`,
      annotation: ["서로 다른 규모를 비교하도록", "기준량당 비율로 정규화"],
    });
  }
  if (/\\arg\s*(?:min|max)|\\min|\\max/.test(formula)) {
    add({
      expression: String.raw`\underset{x\in\mathcal C}{\operatorname{min/max}}\ f(x)`,
      annotation: ["허용 후보 집합 안에서", "목적에 맞는 경계값을 선택"],
    });
  }
  if (/\\le|\\ge|[<>]/.test(formula)) {
    add({
      expression: String.raw`\text{요구량}\ \le\ \text{허용 예산}`,
      annotation: ["계산 결과를 예산과 비교해", "채택 가능성을 판정"],
    });
  }
  const hasImplicitProduct = /(?:[A-Za-z0-9}\)])\\,\s*(?:[A-Za-z0-9{\\(])/.test(
    formula,
  );
  if (/\\cdot|\\times|\\odot/.test(formula) || hasImplicitProduct) {
    add({
      expression: String.raw`\text{요인}_1\times\text{요인}_2`,
      annotation: ["두 요인을 함께 반영해", "한 항의 기여를 계산"],
    });
  }
  if (/\\log|\\ln/.test(formula)) {
    add({
      expression: String.raw`\log(\text{곱 또는 확률})`,
      annotation: ["곱셈 규모를 덧셈 규모로 바꿔", "작은 값도 안정적으로 비교"],
    });
  }
  if (/\\sigma\b/.test(formula)) {
    add({
      expression: String.raw`\sigma(\text{결합한 근거})`,
      annotation: ["결합한 근거를", "0과 1 사이 gate로 변환"],
    });
  }
  if (/\\tanh\b/.test(formula)) {
    add({
      expression: String.raw`\tanh(\text{결합한 내용})`,
      annotation: ["새로 쓸 내용을", "-1과 1 사이 값으로 제한"],
    });
  }
  if (/\\operatorname\{softmax\}|\\mathrm\{softmax\}|softmax/i.test(formula)) {
    add({
      expression: String.raw`\operatorname{softmax}(\text{scores})`,
      annotation: ["상대 score를 exponentiate·정규화해", "합이 1인 선택 비율 생성"],
    });
  }
  if (/\\mathbb\{E\}|\\operatorname\{E\}|\\mathbb E/.test(formula)) {
    add({
      expression: String.raw`\mathbb E[\text{관측량}]`,
      annotation: ["가능한 결과를 확률로 가중해", "장기 평균량을 계산"],
    });
  }
  if (/\\lVert|\\Vert|\\norm/.test(formula)) {
    add({
      expression: String.raw`\lVert\text{벡터 또는 오차}\rVert`,
      annotation: ["방향을 제거하고", "크기 하나로 비교"],
    });
  }
  if (/\\to|\\rightarrow|\\mapsto/.test(formula)) {
    add({
      expression: String.raw`\text{입력}\longrightarrow\text{출력}`,
      annotation: ["왼쪽 상태를 처리해", "오른쪽 상태로 전이"],
    });
  }
  if (/\\in\b/.test(formula)) {
    add({
      expression: String.raw`x\in\mathcal D`,
      annotation: ["계산에 들어올 수 있는", "허용 domain을 제한"],
    });
  }
  if (/=|\\iff|\\equiv/.test(formula)) {
    add({
      expression: String.raw`\text{결과}\ =\ \text{입력으로 만든 계산}`,
      annotation: ["왼쪽 결과가 어떻게 만들어지는지", "오른쪽 계산 규칙으로 정의"],
    });
  }
  if (operations.length === 0) {
    add({
      expression: String.raw`\mathcal F(\text{입력})\longrightarrow\text{결과}`,
      annotation: ["입력에서 결과까지", "이 식이 소유하는 변환"],
    });
  }

  return operations;
}

/**
 * 설명 없이 KaTeX부터 나타나는 일을 막는 수식 블록입니다.
 * 질문과 설계 아이디어를 먼저 읽고, 식과 기호 해설을 순서대로 따라갑니다.
 */
export default function ExplainedFormula({
  question,
  idea,
  formula,
  annotatedFormula,
  operations,
  terms,
  interpretation,
  assumptions = [],
  title,
}: ExplainedFormulaProps) {
  const operationAnnotations = operations?.length
    ? operations
    : inferOperations(formula);

  return (
    <div data-formula-explained className="not-prose my-9 min-w-0">
      <div className="mb-3 border-l border-primary/60 pl-4">
        <p className="text-xs font-bold text-primary">이 식이 답하는 질문</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
          {question}
        </p>
        <div className="mt-2 text-sm leading-6 text-muted-foreground">{idea}</div>
      </div>
      <div
        data-formula-annotation-mode={
          annotatedFormula && operations?.length ? "explicit" : "inferred"
        }
        className="min-w-0 overflow-x-auto rounded-lg border border-border/70 bg-background px-4 py-5 sm:px-6"
      >
        <Math display>{annotatedFormula ?? formula}</Math>
        <div data-formula-operations className="mt-4 border-t border-border/60 pt-4">
          <p className="text-xs font-bold text-primary">이 식 안에서 연산이 하는 일</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            바로 위 식의 항을 underbrace로 다시 잡아, 각 연산을 왜 하는지 읽습니다.
          </p>
          <div className="mt-3 grid min-w-0 gap-2 lg:grid-cols-2">
            {operationAnnotations.map((operation, index) => (
              <div
                key={`${operation.expression}-${index}`}
                data-formula-operation
                className="min-w-0 overflow-x-auto rounded-md border border-border/50 bg-muted/10 px-3 py-2"
              >
                <Math display className="my-0 text-sm">
                  {annotatedOperation(operation)}
                </Math>
              </div>
            ))}
          </div>
        </div>
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
