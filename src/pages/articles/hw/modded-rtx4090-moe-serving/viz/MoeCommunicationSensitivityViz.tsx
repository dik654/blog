import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./MoeCommunicationSensitivityVizData";
import { Step0, Step1, Step2, Step3, Step4, Step5 } from "./MoeCommunicationSensitivityVizSteps";

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function MoeCommunicationSensitivityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
