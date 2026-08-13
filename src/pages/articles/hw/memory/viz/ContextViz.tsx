import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ContextVizData";
import {
  StepRequirements,
  StepBandwidth,
  StepPopulation,
} from "./ContextVizSteps";
import { StepEccLayers, StepCompatibility } from "./ContextVizSteps2";

const SCENES = [
  StepRequirements,
  StepBandwidth,
  StepPopulation,
  StepEccLayers,
  StepCompatibility,
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
