export interface PipelineStageCard {
  id: string;
  label: string;
  role: string;
  detail: string;
  why: string;
  color: string;
}

export const PIPELINE_STAGES: PipelineStageCard[] = [
  {
    id: 'headers',
    label: 'HeadersStage',
    role: '헤더 다운로드',
    detail: '피어에게 GetBlockHeaders 요청. 508B 크기의 헤더만 먼저 가져와서 체인 구조(부모-자식 해시)를 빠르게 파악한다.',
    why: '헤더만으로 체인 유효성을 검사할 수 있다. 바디(수십~수백KB)를 나중에 받으면 대역폭을 절약한다.',
    color: '#6366f1',
  },
  {
    id: 'bodies',
    label: 'BodiesStage',
    role: '바디(TX 목록) 다운로드',
    detail: 'HeadersStage가 저장한 헤더의 tx_root를 기준으로 바디를 다운로드. 머클 루트 대조로 위변조를 탐지한다.',
    why: '헤더에 기록된 tx_root가 곧 "정답 해시". 바디를 받은 뒤 직접 머클 루트를 계산해서 대조하면 위조 TX를 즉시 걸러낸다.',
    color: '#0ea5e9',
  },
  {
    id: 'senders',
    label: 'SendersStage',
    role: 'TX sender 주소 복구',
    detail: 'TX에는 sender 필드가 없다. (v,r,s) ECDSA 서명에서 secp256k1 ecrecover로 공개키를 복구하고, 주소로 변환한다.',
    why: 'CPU 집약적 연산이다. rayon par_iter로 멀티코어 병렬 처리하면 10만 TX도 수초 내에 완료한다.',
    color: '#10b981',
  },
  {
    id: 'execution',
    label: 'ExecutionStage',
    role: 'revm으로 TX 실행',
    detail: '세 Stage(Headers+Bodies+Senders)가 저장한 데이터를 조합해 revm으로 블록 실행. 상태 변경을 BundleState에 누적한다.',
    why: 'Geth는 블록마다 stateDB.Commit()을 호출한다. Reth는 수천 블록을 누적 후 한 번에 DB 기록해서 I/O를 극적으로 줄인다.',
    color: '#f59e0b',
  },
  {
    id: 'merkle',
    label: 'MerkleStage',
    role: '상태 루트 검증',
    detail: 'ExecutionStage 실행 결과의 상태 루트를 계산한다. 헤더의 state_root와 대조해서 실행 정합성을 최종 검증한다.',
    why: 'PrefixSet으로 변경된 서브트리만 재해시한다. 전체 트라이 재계산 대비 10~100배 빠르다.',
    color: '#ec4899',
  },
];
