import { defineNarrativeFlow } from "@/components/viz/narrative-flow";
import { EUREKA_PIPELINE } from "@/content/sionic-eureka";

export const PIPELINE_STEPS = defineNarrativeFlow(
  EUREKA_PIPELINE.map((step) => ({
    label: `${step.label} → ${step.artifact}`,
  })),
);
