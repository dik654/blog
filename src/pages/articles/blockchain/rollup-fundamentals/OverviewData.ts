export interface OPComponent {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
  codeRefKeys?: string[];
}

export const OP_COMPONENTS: OPComponent[] = [
  {
    id: 'op-node',
    label: 'op-node',
    role: 'L2 블록 도출 엔진',
    details:
      'L1 블록 데이터를 읽어 L2 블록을 결정론적으로 재구성(derivation)한다. ' +
      '7단계 pull 파이프라인으로 L1Traversal → AttributesQueue까지 역순 요청.',
    why: '왜 별도 프로세스? EL(op-geth)과 분리하면 합의 로직을 독립적으로 업그레이드할 수 있다.',
    color: '#6366f1',
    codeRefKeys: ['pipeline-struct', 'pipeline-step'],
  },
  {
    id: 'op-geth',
    label: 'op-geth',
    role: 'EVM 실행 레이어',
    details:
      'go-ethereum 포크. op-node가 생성한 PayloadAttributes로 블록을 실행한다. ' +
      'Engine API로 op-node와 통신 — 이더리움 CL-EL 분리 구조를 그대로 차용.',
    why: '왜 geth 포크? 이더리움 EVM 호환성을 100% 유지하면서 최소한의 diff만 추가.',
    color: '#0ea5e9',
  },
  {
    id: 'op-batcher',
    label: 'op-batcher',
    role: 'L2 → L1 데이터 게시',
    details:
      'L2 트랜잭션을 압축(zlib/brotli)하고 프레임으로 분할하여 L1에 제출. ' +
      'EIP-4844 blob vs calldata를 가스 가격에 따라 동적 전환한다.',
    why: '왜 동적 전환? blob이 보통 저렴하지만, blob 수요 급증 시 calldata가 더 나을 수 있다.',
    color: '#10b981',
    codeRefKeys: ['batch-submitter', 'channel-manager'],
  },
  {
    id: 'op-proposer',
    label: 'op-proposer',
    role: 'Output Root 제출',
    details:
      'L2 상태의 해시(Output Root)를 주기적으로 L1 컨트랙트에 제출한다. ' +
      '이 Output Root가 fault proof의 시작점 — 챌린저가 이 값을 검증.',
    why: '왜 주기적? 매 블록 제출은 비용이 크므로 일정 간격으로 묶어서 제출한다.',
    color: '#f59e0b',
  },
  {
    id: 'op-challenger',
    label: 'op-challenger',
    role: '분쟁 게임 수행',
    details:
      'Output Root에 이의가 있으면 bisection 게임을 시작한다. ' +
      '이진 분할로 불일치 지점을 특정하고, 최종적으로 단일 명령어 실행으로 판정.',
    why: '왜 bisection? O(log n) 단계로 수십억 명령어 중 오류 지점을 찾을 수 있다.',
    color: '#ec4899',
    codeRefKeys: ['claim-struct', 'position'],
  },
];
