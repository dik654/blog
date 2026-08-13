import type { ReactNode } from "react";

export type ArticleFlowStage =
  "background" | "problem" | "idea" | "implementation";

export interface ArticleFlowStep {
  id: string;
  stage: ArticleFlowStage;
  label: string;
  body?: ReactNode;
}

const STAGE_ORDER: Record<ArticleFlowStage, number> = {
  background: 0,
  problem: 1,
  idea: 2,
  implementation: 3,
};

/**
 * Keeps an article's narrative flow in one inspectable data source.
 * Renderers consume this list; they must not redefine the story or its order.
 */
export function defineArticleFlow<const T extends readonly ArticleFlowStep[]>(
  steps: T,
): T {
  if (steps.length === 0)
    throw new Error("Article flow must contain at least one step.");

  const ids = new Set<string>();
  let previousOrder = -1;

  for (const step of steps) {
    if (ids.has(step.id))
      throw new Error(`Duplicate article flow step id: ${step.id}`);
    ids.add(step.id);

    const order = STAGE_ORDER[step.stage];
    if (order < previousOrder) {
      throw new Error(`Article flow stage is out of order at: ${step.id}`);
    }
    previousOrder = order;
  }

  if (steps[0].stage !== "background")
    throw new Error("Article flow must start with background.");
  if (!steps.some((step) => step.stage === "problem"))
    throw new Error("Article flow must explain the problem.");
  if (!steps.some((step) => step.stage === "idea"))
    throw new Error("Article flow must explain the core idea.");
  if (!steps.some((step) => step.stage === "implementation")) {
    throw new Error("Article flow must end in implementation.");
  }

  return steps;
}
