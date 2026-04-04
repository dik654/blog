import StepViz from '@/components/ui/step-viz';
import Step0 from './dim-reduce/Step0Problem';
import Step1 from './dim-reduce/Step1SVD';
import Step2 from './dim-reduce/Step2LSA';

const STEPS = [
  {
    label: '문제: V x V 행렬은 너무 크다',
    body: 'V=10만이면 100억 개 원소. 메모리·연산 비용이 비현실적.\n하지만 대부분의 정보는 소수의 주요 축에 집중되어 있다.',
  },
  {
    label: 'SVD: 행렬을 세 조각으로 분해',
    body: 'X = UΣVᵀ. U는 단어 벡터, Σ는 특이값, Vᵀ는 맥락 벡터.\n상위 k개의 특이값만 유지하면 V차원이 k차원(100~300)으로 압축된다.',
  },
  {
    label: 'LSA와 통계 기반 방법의 한계',
    body: 'SVD를 단어-문서 행렬에 적용하면 동의어 문제를 해결한다.\n하지만 다의어 문제(문맥에 따른 의미 구별)는 미해결.\n선형 관계만 포착 가능하다는 근본적 한계.',
  },
];

const COMPONENTS = [Step0, Step1, Step2];

export default function DimReduceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
