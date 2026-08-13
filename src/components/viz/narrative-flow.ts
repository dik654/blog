import type { ReactNode } from "react";

export interface NarrativeFlowStep {
  label: string;
  body?: ReactNode;
}

export interface NarrativeCodeAction {
  label?: string;
  onClick: () => void;
}

export function defineNarrativeFlow<
  const T extends readonly NarrativeFlowStep[],
>(steps: T): T {
  if (steps.length < 2) {
    throw new Error("A narrative flow needs at least two steps.");
  }
  return steps;
}
