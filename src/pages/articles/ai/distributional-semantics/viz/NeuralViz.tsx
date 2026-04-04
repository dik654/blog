import StepViz from '@/components/ui/step-viz';
import Step0 from './neural/Step0Limit';
import Step1 from './neural/Step1Compare';
import Step2 from './neural/Step2Pipeline';

const STEPS = [
  {
    label: '통계 기반 방법의 근본 한계',
    body: '전체 코퍼스를 한 번에 처리, 코퍼스 커지면 행렬 폭발, 새 단어 추가 시 재계산.\n이 한계를 넘기 위해 추론 기반(prediction-based) 방법이 등장.',
  },
  {
    label: '통계 기반 vs 추론 기반 비교',
    body: '통계 기반: SVD 일괄 처리, O(V²) 메모리, 선형만.\n추론 기반: SGD 점진적, 미니배치로 무제한, 비선형 포착.\nMikolov (2013) Word2Vec → GloVe (2014) 통합.',
  },
  {
    label: '추론 기반 학습 파이프라인',
    body: '코퍼스 → 윈도우 추출 → 신경망 학습(SGD) → 밀집 벡터.\n미니배치 단위로 점진적 업데이트 → 대규모 코퍼스에도 확장 가능.\nGPU 병렬 처리와 자연스럽게 호환.',
  },
];

const COMPONENTS = [Step0, Step1, Step2];

export default function NeuralViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
