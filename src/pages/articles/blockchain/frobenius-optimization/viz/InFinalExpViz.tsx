import StepViz from '@/components/ui/step-viz';
import { ExponentFormula, EasyPart1, EasyPart2, HardPart } from './InFinalExpVizParts';

const STEPS = [
  { label: '전체 지수: (p12-1)/r = (p6-1) * (p2+1) * (p4-p2+1)/r' },
  { label: 'Easy1: f^(p6) = conjugate. f^(p6-1) = conj/원본 = 곱 2번' },
  { label: 'Easy2: g^(p2) = Frobenius 2회. g^(p2+1) = 곱 1번' },
  { label: 'Hard: 각 p^k = Frobenius(무료). 곱셈은 c 체인에만' },
];

export default function InFinalExpViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ExponentFormula step={step} />
          <EasyPart1 step={step} />
          <EasyPart2 step={step} />
          <HardPart step={step} />
        </svg>
      )}
    </StepViz>
  );
}
