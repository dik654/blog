import StepViz from '@/components/ui/step-viz';
import { Step0, Step1 } from './RollupOverviewSteps';
import { Step2, Step3 } from './RollupOverviewSteps2';

const STEPS = [
  { label: 'L1의 한계: 모든 노드가 모든 TX를 실행' },
  { label: 'L2: 실행을 별도 체인으로 분리' },
  { label: 'L2 → L1: TX 데이터를 L1에 기록' },
  { label: '증명으로 L2 상태를 L1에서 확정' },
];

const R = [Step0, Step1, Step2, Step3];

export default function RollupOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
