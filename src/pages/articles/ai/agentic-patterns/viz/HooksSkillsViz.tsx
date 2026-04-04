import StepViz from '@/components/ui/step-viz';
import { STEPS } from './HooksSkillsData';
import { HooksView, SkillsView } from './HooksSkillsParts';
import CombinedView from './HooksSkillsCombined';

const W = 460, H = 220;

export default function HooksSkillsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {(step === 0 || step === 1) && <HooksView step={step} />}
          {step === 2 && <SkillsView />}
          {step === 3 && <CombinedView />}
        </svg>
      )}
    </StepViz>
  );
}
