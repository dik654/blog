import StepViz from '@/components/ui/step-viz';
import { BatcherStep0, BatcherStep1, BatcherStep2, BatcherStep3 } from './BatcherFlowSteps';

const STEPS = [
  {
    label: 'Batcher 전체 흐름: loop() → AddL2Block → processBlocks → TxData',
    body: 'BatchSubmitter.loop()가 주기적으로 L2 블록을 수집하고,\nchannelManager가 블록을 채널로 압축·프레임화하여 L1 트랜잭션으로 제출한다.',
  },
  {
    label: 'AddL2Block(): L2 블록을 큐에 추가',
    body: 'channelManager.AddL2Block(block)은 블록의 ParentHash와 tip을 비교하여 reorg을 감지한다.\n정상이면 blocks 큐에 추가하고 tip을 갱신한다.',
  },
  {
    label: 'processBlocks(): 큐 → 채널 패킹',
    body: 'blockCursor부터 순회하며 currentChannel에 블록을 추가한다.\n채널이 가득 차거나(IsFull) 큐가 비면 중단한다.\n왜 한 번에 안 보내나? 채널 크기를 최대한 채워야 L1 가스 효율이 높다.',
  },
  {
    label: 'TxData(): DA 타입 선택 → L1 트랜잭션 생성',
    body: 'channelManager.TxData()가 채널에서 프레임을 꺼내 L1 TX를 생성한다.\nblob vs calldata를 동적으로 전환 — L1 가스 가격에 따라 최적 경로를 선택한다.',
  },
];

export default function BatcherFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <BatcherStep0 />}
          {step === 1 && <BatcherStep1 />}
          {step === 2 && <BatcherStep2 />}
          {step === 3 && <BatcherStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
