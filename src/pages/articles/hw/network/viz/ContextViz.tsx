import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ContextVizData";
import { StepTraffic, StepGoodput, StepFabric } from "./ContextVizSteps";
import { StepRdma, StepValidate } from "./ContextVizSteps2";

const SCENES = [StepTraffic, StepGoodput, StepFabric, StepRdma, StepValidate];

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
