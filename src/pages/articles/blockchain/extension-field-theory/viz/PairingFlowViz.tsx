import StepViz from '@/components/ui/step-viz';
import Step0 from './pairing/Step0Curve';
import Step1 from './pairing/Step1Finite';
import Step2 from './pairing/Step2G1';
import Step3 from './pairing/Step3G2';
import Step4 from './pairing/Step4Pairing';
import Step5 from './pairing/Step5Pipeline';
import Step6 from './pairing/Step6MillerIdea';
import Step7 from './pairing/Step7MillerIter';
import Step8 from './pairing/Step8FinalExp';
import Step9 from './pairing/Step9Easy1';
import Step10 from './pairing/Step10Easy2';
import Step11 from './pairing/Step11Hard';
import { PAIRING_STEPS } from './pairing/steps';

const COMPONENTS = [Step0, Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10, Step11];

export default function PairingFlowViz() {
  return (
    <StepViz steps={PAIRING_STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
