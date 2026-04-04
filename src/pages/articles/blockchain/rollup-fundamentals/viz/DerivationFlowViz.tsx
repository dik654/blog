import StepViz from '@/components/ui/step-viz';
import { DerivStep0, DerivStep1 } from './DerivationFlowSteps';
import { DerivStep2, DerivStep3 } from './DerivationFlowSteps2';

const STEPS = [
  {
    label: 'Pull 호출 체인: Step()부터 역방향으로 데이터 요청',
    body: 'dp.Step()이 attrib.NextAttributes()를 호출하면,\n각 스테이지가 이전 스테이지의 Next*()를 재귀적으로 호출하여 L1 데이터를 끌어온다.',
  },
  {
    label: 'Step(): 파이프라인 진입점',
    body: 'DerivationPipeline.Step()은 먼저 리셋 상태를 확인한 뒤,\nattrib.NextAttributes()를 호출한다. EOF 반환 시 traversal.AdvanceL1Block()으로 L1을 전진.',
  },
  {
    label: 'Pull 체인 상위: Attributes → Batch → Channel',
    body: 'NextAttributes() → BatchMux.NextBatch() → ChannelInReader.NextBatch()\n각 함수가 이전 스테이지의 Next*를 호출하여 데이터를 끌어온다.',
  },
  {
    label: 'Pull 체인 하위: Channel → Frame → L1 데이터',
    body: 'ChannelMux.NextData() → FrameQueue.NextFrame() → L1Retrieval.NextData() → L1Traversal\n최종적으로 L1 RPC에서 블록 데이터를 가져온다.',
  },
];

export default function DerivationFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="df-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#6366f1" />
            </marker>
            <marker id="df-pull" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
              <path d="M6,0 L0,3 L6,6" fill="#ec4899" />
            </marker>
          </defs>
          {step === 0 && <DerivStep0 />}
          {step === 1 && <DerivStep1 />}
          {step === 2 && <DerivStep2 />}
          {step === 3 && <DerivStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
