import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ContextVizData";
import { StepLayers, StepWorkload, StepThermal } from "./ContextVizSteps";
import { StepService, StepDecision } from "./ContextVizSteps2";

const SCENES = [
  StepLayers,
  StepWorkload,
  StepThermal,
  StepService,
  StepDecision,
];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Scene = SCENES[step];
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
