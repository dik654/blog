import { defineNarrativeFlow } from "@/components/viz/narrative-flow";
import { B300_SWITCHLESS_PIPELINE } from "@/content/b300-switchless-network";

export const PIPELINE_STEPS = defineNarrativeFlow(
  B300_SWITCHLESS_PIPELINE.map((step) => ({
    label: `${step.label} → ${step.artifact}`,
  })),
);
