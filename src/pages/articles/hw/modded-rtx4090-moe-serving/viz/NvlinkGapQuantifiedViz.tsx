import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./NvlinkGapQuantifiedVizData";
import { Step0, Step1, Step2, Step3 } from "./NvlinkGapQuantifiedVizSteps";
import { Step4, Step5, Step6 } from "./NvlinkGapQuantifiedVizSteps2";

export default function NvlinkGapQuantifiedViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: "auto" }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          {step === 5 && <Step5 />}
          {step === 6 && <Step6 />}
        </svg>
      )}
    </StepViz>
  );
}
