import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./ReleaseGateVizData";
import { Step0, Step1, Step2, Step3, Step4, Step5, Step6 } from "./ReleaseGateVizSteps";

const R = [Step0, Step1, Step2, Step3, Step4, Step5, Step6];

export default function ReleaseGateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 376" className="w-full max-w-2xl">
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
