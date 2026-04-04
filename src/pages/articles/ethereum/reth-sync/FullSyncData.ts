export interface PipelineStage {
  id: string;
  name: string;
  role: string;
  details: string;
  color: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'headers',
    name: 'HeadersStage',
    role: '블록 헤더 다운로드',
    details: '피어에서 블록 헤더를 범위별로 다운로드한다. 난이도(PoW) 또는 서명(PoS) 검증 후 DB에 저장. 병렬 다운로더가 여러 피어에서 동시에 수신.',
    color: '#6366f1',
  },
  {
    id: 'bodies',
    name: 'BodiesStage',
    role: '블록 바디 다운로드',
    details: '헤더에 대응하는 바디(트랜잭션 목록 + 엉클)를 다운로드한다. 헤더의 transactions_root로 무결성 검증. 빈 블록은 스킵.',
    color: '#0ea5e9',
  },
  {
    id: 'execution',
    name: 'ExecutionStage',
    role: 'EVM 블록 실행',
    details: 'revm으로 각 블록의 모든 트랜잭션을 실행한다. BundleState(상태 변경 목록)를 생성하고, DB에 기록. 가장 시간이 오래 걸리는 단계.',
    color: '#10b981',
  },
  {
    id: 'merkle',
    name: 'MerkleStage',
    role: '상태 루트 검증',
    details: '실행 결과로 Merkle Patricia Trie의 상태 루트를 재계산한다. 블록 헤더의 state_root와 비교하여 불일치 시 해당 블록을 거부.',
    color: '#f59e0b',
  },
];
