import { defineNarrativeFlow } from "@/components/viz/narrative-flow";
import { GLM_B300_OPTIMIZATION_LAYERS } from "@/content/sionic-glm-b300";

export const STACK_STEPS = defineNarrativeFlow(
  GLM_B300_OPTIMIZATION_LAYERS.map((layer) => ({
    label: `${layer.label}: ${layer.goal}`,
  })),
);
