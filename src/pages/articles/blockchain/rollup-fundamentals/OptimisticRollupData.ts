export interface SubSection {
  id: string;
  title: string;
  summary: string;
  detail: string;
  why: string;
  codeRefKeys: string[];
  codeRefLabels: string[];
}

export const SECTIONS: SubSection[] = [
  {
    id: 'derivation',
    title: '1. Derivation Pipeline — L1 → L2 블록 도출',
    summary: 'L1 블록 데이터를 7단계 pull 파이프라인으로 변환하여 L2 블록을 결정론적으로 재구성한다.',
    detail:
      'L1Traversal이 L1 블록을 순회하면, 각 스테이지가 역순으로 데이터를 당겨온다. ' +
      'FrameQueue → ChannelBank에서 프레임을 채널로 조립하고, ' +
      '최종 AttributesQueue가 PayloadAttributes를 생성하여 op-geth에 전달한다.',
    why: '왜 pull 방식인가? 각 단계가 필요할 때만 이전 단계에서 가져오므로 메모리를 절약한다. ' +
      'push 방식은 모든 데이터를 한 번에 처리해야 해서 메모리 사용량이 급증할 수 있다.',
    codeRefKeys: ['pipeline-new', 'pipeline-step', 'l1-traversal', 'channel-bank', 'attributes-queue'],
    codeRefLabels: ['파이프라인 생성', 'Step() 루프', 'L1 블록 순회', '채널 조립', 'PayloadAttributes 생성'],
  },
  {
    id: 'batch',
    title: '2. Batch 제출 — L2 → L1',
    summary: 'L2 블록을 압축·프레임화하여 L1에 calldata 또는 blob으로 제출한다.',
    detail:
      'op-batcher의 channelManager가 L2 블록을 zlib/brotli로 압축한다. ' +
      '압축 데이터를 고정 크기 프레임으로 분할하고, L1 트랜잭션으로 제출한다. ' +
      'DA 타입(calldata vs blob)을 가스 가격에 따라 동적으로 전환한다.',
    why: '왜 동적 DA 전환? EIP-4844 이후 blob이 보통 저렴하지만, blob 수요 급증 시에는 calldata가 ' +
      '더 경제적일 수 있다. 가스 오라클이 두 경로의 비용을 비교하여 최적을 선택한다.',
    codeRefKeys: ['channel-manager', 'add-l2-block', 'tx-data'],
    codeRefLabels: ['channelManager', '블록 추가', 'DA 전환'],
  },
  {
    id: 'fault',
    title: '3. Fault Proof — 분쟁 게임',
    summary: '이진 분할(bisection)으로 불일치 지점을 특정하고 단일 명령어 실행으로 판정한다.',
    detail:
      'Output Root에 이의 제기 시 분쟁 게임이 시작된다. ' +
      'Claim의 Position이 이진 트리 좌표이고, Attack/Defend로 범위를 절반씩 좁힌다. ' +
      '최대 깊이 도달 시 MIPS 단일 명령어를 온체인에서 실행하여 옳고 그름을 판정한다.',
    why: '왜 bisection? 수십억 개의 명령어 전체를 온체인에서 재실행하는 것은 불가능하다. ' +
      'O(log n) 단계의 이진 탐색으로 정확한 불일치 지점 1개만 찾아 검증하면 된다.',
    codeRefKeys: ['claim-struct', 'position', 'output-root'],
    codeRefLabels: ['Claim 구조체', 'Position (bisection)', 'Output Root'],
  },
];
