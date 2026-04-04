import StepViz from '@/components/ui/step-viz';
import Step0 from './minimal-poly/Step0Concept';
import Step1 from './minimal-poly/Step1Irred';
import Step2 from './minimal-poly/Step2Reduc';
import Step3 from './minimal-poly/Step3Extend';
import Step4 from './minimal-poly/Step4NoExtend';

const STEPS = [
  {
    label: '기약 = 쪼갤 수 없는 다항식',
    body: '해당 체 안에서 더 작은 다항식의 곱으로 분해할 수 없는 다항식.',
  },
  {
    label: 'x² + 1 은 F₇에서 기약',
    body: 'x²≡6 (mod 7)인 x가 없다 → 인수분해 불가 → 기약.',
  },
  {
    label: 'x² − 2 는 F₇에서 가약',
    body: '3²≡2, 4²≡2 → 근이 F₇ 안에 존재 → (x-3)(x-4)로 분해.',
  },
  {
    label: '기약 → 새 원소 추가 → 체 확장 성공',
    body: '근 u를 추가하면 a+bu 형태로 7×7=49개. F₇ → F₄₉.',
  },
  {
    label: '가약 → 근을 추가해도 체 불변',
    body: '근 3은 이미 F₇에 존재 → 추가해도 새로운 것 없음.',
  },
];

const COMPONENTS = [Step0, Step1, Step2, Step3, Step4];

export default function MinimalPolyStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
