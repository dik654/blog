import StepViz from '@/components/ui/step-viz';
import { FaultStep0, FaultStep1 } from './FaultGameFlowSteps';
import { FaultStep2, FaultStep3 } from './FaultGameFlowSteps2';

const STEPS = [
  {
    label: 'Claim 구조체: 분쟁 게임의 핵심 데이터',
    body: 'Claim은 Position(이진 트리 좌표), Value(상태 해시), Bond(예치금), Clock(체스 클럭)을 포함한다.\nCounteredBy가 설정되면 누군가 이 주장에 반박한 것이다.',
  },
  {
    label: 'Position 인코딩: depth + indexAtDepth → TraceIndex',
    body: 'Position은 (depth, indexAtDepth)로 이진 트리 좌표를 표현한다.\nTraceIndex()는 최대 깊이까지 확장하여 실행 트레이스 인덱스를 계산한다.\n비트 시프트: (indexAtDepth << (maxDepth - depth)) | ((1 << (maxDepth - depth)) - 1)',
  },
  {
    label: 'Attack vs Defend: 이진 트리 탐색',
    body: 'Attack() = move(false) → 왼쪽 자식 (범위의 앞 절반)\nDefend() = parent().move(true).move(false) → 오른쪽 형제의 왼쪽 자식\n각 이동마다 분쟁 범위가 절반으로 줄어든다.',
  },
  {
    label: 'AgreeWithClaimLevel: 깊이로 아군/적군 판별',
    body: 'depth % 2 == 0 → 방어자(짝수 깊이) 주장\ndepth % 2 == 1 → 도전자(홀수 깊이) 주장\nGame 인터페이스가 Claims(), GetParent(), ChessClock()으로 전체 상태를 추상화한다.',
  },
];

export default function FaultGameFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <FaultStep0 />}
          {step === 1 && <FaultStep1 />}
          {step === 2 && <FaultStep2 />}
          {step === 3 && <FaultStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
