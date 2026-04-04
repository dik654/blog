import StepViz from '@/components/ui/step-viz';
import Step8 from './pairing/Step8FinalExp';
import Step9 from './pairing/Step9Easy1';
import Step10 from './pairing/Step10Easy2';
import Step11 from './pairing/Step11Hard';

const STEPS = [
  { label: 'Final Exp 개요: (p¹²-1)/r을 3단계로 분해',
    body: '~3000-bit 지수를 Easy1 → Easy2 → Hard 순서로 처리.' },
  { label: 'Easy 1: f^(p⁶-1) = 켤레 ÷ 원본',
    body: '켤레 f̄(부호 반전) · f⁻¹. 역원 1번 + 곱셈 1번.' },
  { label: 'Easy 2: g^(p²+1) = Frobenius + 곱셈 1번',
    body: 'Frobenius(상수 스케일링 ≈ 0) 2회 + Fp12 곱 1번.' },
  { label: 'Hard: h^d를 x-체인 + Frobenius로',
    body: 'd를 BN254 파라미터 x의 다항식으로 표현 → 곱 ~30 + Frobenius 4번.' },
];

const COMPONENTS = [Step8, Step9, Step10, Step11];

export default function FinalExpViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
