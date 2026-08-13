import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ContextVizData";
import { StepWorkload, StepCapacity, StepIntensity } from "./ContextVizSteps";
import { StepScale, StepCooling, StepDecision } from "./ContextVizSteps2";

const RENDERERS = [
  StepWorkload,
  StepCapacity,
  StepIntensity,
  StepScale,
  StepCooling,
  StepDecision,
];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Scene = RENDERERS[step];
        return (
          <svg
            viewBox="0 0 480 200"
            className="w-full max-w-3xl"
            style={{ height: "auto" }}
          >
            <Scene />
          </svg>
        );
      }}
    </StepViz>
  );
}
