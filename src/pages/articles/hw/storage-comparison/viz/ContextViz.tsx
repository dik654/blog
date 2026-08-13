import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ContextVizData";
import { StepRequirements, StepStack, StepSata } from "./ContextVizSteps";
import { StepSas, StepNvme } from "./ContextVizSteps2";

const SCENES = [StepRequirements, StepStack, StepSata, StepSas, StepNvme];

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
