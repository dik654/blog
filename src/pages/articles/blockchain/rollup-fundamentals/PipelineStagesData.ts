export interface PipelineStage {
  id: string;
  name: string;
  role: string;
  pullsFrom: string;
  detail: string;
  color: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'l1-traversal',
    name: 'L1Traversal',
    role: 'L1 블록 순회',
    pullsFrom: '(L1 RPC)',
    detail: 'L1 블록을 한 칸씩 전진시킨다. 다음 블록의 ParentHash가 현재 Hash와 불일치하면 reorg을 감지하고 파이프라인을 리셋한다.',
    color: '#6366f1',
  },
  {
    id: 'l1-retrieval',
    name: 'L1Retrieval',
    role: '트랜잭션 데이터 추출',
    pullsFrom: 'L1Traversal',
    detail: 'L1 블록에서 배처 주소(batcher address)가 보낸 트랜잭션을 필터링하고, calldata 또는 blob 데이터를 추출한다.',
    color: '#3b82f6',
  },
  {
    id: 'frame-queue',
    name: 'FrameQueue',
    role: '프레임 파싱',
    pullsFrom: 'L1Retrieval',
    detail: 'raw 바이트를 Frame 구조체로 디코딩한다. 하나의 L1 트랜잭션에 여러 프레임이 포함될 수 있으므로 큐로 관리한다.',
    color: '#0ea5e9',
  },
  {
    id: 'channel-bank',
    name: 'ChannelBank',
    role: '프레임 → 채널 조립',
    pullsFrom: 'FrameQueue',
    detail: '같은 Channel ID를 가진 프레임을 모아 하나의 채널로 조립한다. 타임아웃 초과 채널은 버리고, 완성된 채널만 통과시킨다.',
    color: '#10b981',
  },
  {
    id: 'channel-reader',
    name: 'ChannelReader',
    role: '채널 압축 해제',
    pullsFrom: 'ChannelBank',
    detail: '완성된 채널을 zlib 또는 brotli로 해제하여 원래 배치 데이터를 복원한다.',
    color: '#14b8a6',
  },
  {
    id: 'batch-queue',
    name: 'BatchQueue',
    role: '배치 정렬·검증',
    pullsFrom: 'ChannelReader',
    detail: '배치의 타임스탬프·에포크 번호를 검증하고 순서대로 정렬한다. 유효하지 않은 배치는 드롭한다.',
    color: '#f59e0b',
  },
  {
    id: 'attributes-queue',
    name: 'AttributesQueue',
    role: 'PayloadAttributes 생성',
    pullsFrom: 'BatchQueue',
    detail: '검증된 배치를 op-geth가 이해하는 PayloadAttributes로 변환한다. NoTxPool=true로 설정하여 결정론적 블록 생성을 보장한다.',
    color: '#ec4899',
  },
];

export const PULL_VS_PUSH = {
  pull: 'Pull: 각 스테이지가 필요할 때 이전 스테이지에서 데이터를 가져온다. 메모리에 미리 적재하지 않아 효율적이다.',
  push: 'Push: 이전 스테이지가 데이터를 다음으로 밀어넣는다. 모든 데이터를 한 번에 처리해야 해서 메모리 사용량이 급증할 수 있다.',
  why: 'OP Stack이 Pull을 선택한 이유: L1 블록이 점진적으로 도착하므로 필요할 때만 가져오는 게 자연스럽다. 역압(backpressure)이 자동으로 적용된다.',
};
