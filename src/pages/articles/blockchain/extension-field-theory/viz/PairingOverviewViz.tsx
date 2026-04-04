import StepViz from '@/components/ui/step-viz';
import Step0 from './pairing/Step0Curve';
import Step1 from './pairing/Step1Finite';
import Step2 from './pairing/Step2G1';
import Step3a from './pairing/Step3aG1Only';
import Step3b from './pairing/Step3bExpand';
import Step3c from './pairing/Step3cProblem';
import Step3d from './pairing/Step3dTwist';
import Step4 from './pairing/Step4Pairing';
import Step5 from './pairing/Step5Pipeline';

const STEPS = [
  { label: '타원곡선 위의 점 덧셈',
    body: '두 점의 직선 → 세 번째 교점 반사 = P+Q. 군을 이룬다.' },
  { label: '유한체 위의 곡선',
    body: 'Fp 위에서 곡선 정의. 점 덧셈 공식 동일, 전부 mod p.' },
  { label: 'G1 — BN254 곡선 위 점들의 군',
    body: 'y²=x³+3, 256-bit 소수 p. 위수 r ≈ 10⁷⁶.' },
  { label: 'G2가 필요한 이유 — Fp에는 G1만',
    body: '페어링은 서로 다른 두 군의 점을 입력받는다.' },
  { label: '좌표를 Fp²로 넓히면 점이 더 나온다',
    body: '좌표를 a+bu(Fp²)로 허용 → 추가 점 중 위수 r 부분군 = G2 후보.' },
  { label: '문제: 직접 쓰면 Fp¹²가 필요하다',
    body: 'G2를 직접 넣으면 Fp¹² 확장. 점 1개 = Fp 원소 24개.' },
  { label: 'twist로 해결: Fp¹² → Fp²로 압축',
    body: '곡선 변형(b→b/ξ)으로 같은 군을 Fp² 좌표로 표현. 24→4.' },
  { label: '페어링 = 두 점 → 하나의 값',
    body: 'e(P,Q): G1×G2→GT. 양선형성: e(aP,bQ)=e(P,Q)^(ab).' },
  { label: '파이프라인: P,Q → Miller Loop → Final Exp → GT',
    body: 'Miller Loop(254회) → Final Exp → GT. 총 ~20,000 Fp곱.' },
];

const COMPONENTS = [Step0, Step1, Step2, Step3a, Step3b, Step3c, Step3d, Step4, Step5];

export default function PairingOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
