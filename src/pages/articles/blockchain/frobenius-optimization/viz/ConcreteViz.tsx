import StepViz from '@/components/ui/step-viz';
import { Fp2Example, Fp2Generalized, Fp12Extension } from './ConcreteVizParts';

const STEPS = [
  { label: 'F7-squared: (3, 5) -> Frobenius -> (3, 2). "5u -> -5u = 2u (mod 7)"' },
  { label: '일반화: (a, b) -> (a, -b mod p). Fp2 Frobenius = 부호 반전' },
  { label: 'Fp12: 하위 6개(Fp6 부분) 유지, 상위 6개(Fp6*w 부분)에 gamma 곱' },
];

export default function ConcreteViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <Fp2Example step={step} />
          <Fp2Generalized step={step} />
          <Fp12Extension step={step} />
        </svg>
      )}
    </StepViz>
  );
}
