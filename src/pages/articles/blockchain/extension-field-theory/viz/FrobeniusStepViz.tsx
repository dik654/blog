import StepViz from '@/components/ui/step-viz';
import Step0 from './frobenius/Step0What';
import Step3 from './frobenius/Step3Pairing';

const STEPS = [
  {
    label: 'Frobenius 사상: 원소를 p제곱하면?',
    body: 'φ(x)=xᵖ. u의 부호만 뒤집힌다 — 복소수 켤레와 동일.',
  },
  {
    label: '페어링에서의 역할: 거듭제곱을 공짜로',
    body: 'Fp12 계수를 상수로 재배열하는 치환 → 비용 ≈ 0.',
  },
];

const COMPONENTS = [Step0, Step3];

export default function FrobeniusStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
