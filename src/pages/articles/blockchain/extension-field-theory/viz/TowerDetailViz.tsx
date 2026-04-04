import StepViz from '@/components/ui/step-viz';
import Fp2Element from './tower/Fp2Element';
import Fp2Multiply from './tower/Fp2Multiply';
import Fp2Karatsuba from './tower/Fp2Karatsuba';
import Fp6Element from './tower/Fp6Element';
import Fp12Element from './tower/Fp12Element';

const STEPS = [
  { label: 'Fp² 원소: a + bu (복소수와 동일)',
    body: 'Fp 2개로 Fp² 원소 구성. u²=−1 규칙. 복소수와 같은 구조.' },
  { label: 'Fp² 곱셈: (a+bu)(c+du) 전개',
    body: 'FOIL 전개 후 u²=−1 대입 → 실수부 (ac−bd), 허수부 (ad+bc)u.' },
  { label: 'Karatsuba 트릭: 4곱 → 3곱',
    body: 'M₁=ac, M₂=bd, M₃=(a+b)(c+d). 곱셈 25% 절감.' },
  { label: 'Fp⁶ 원소: Fp² 3개로 구성',
    body: 'a+bv+cv² (v³=ξ). Karatsuba로 Fp² 곱 6번 = Fp 곱 18번.' },
  { label: 'Fp¹² 원소: Fp⁶ 2개로 구성 → G1/G2/GT 매핑',
    body: 'a+bw (w²=v). 2×3×2=12차 타워. G1=Fp, G2=Fp², GT=Fp¹².' },
];

const COMPONENTS = [Fp2Element, Fp2Multiply, Fp2Karatsuba, Fp6Element, Fp12Element];

export default function TowerDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
