import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ContextVizData";
import { StepGoal, StepCapacity, StepOperations } from "./ContextVizSteps";
import { StepFailure, StepDecision } from "./ContextVizSteps2";

const R = [StepGoal, StepCapacity, StepOperations, StepFailure, StepDecision];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg
            viewBox="0 0 480 200"
            className="w-full max-w-2xl"
            style={{ height: "auto" }}
          >
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
