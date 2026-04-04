export interface MerkleStep {
  title: string;
  desc: string;
}

export const MERKLE_STEPS: MerkleStep[] = [
  {
    title: 'PrefixSet 로드',
    desc: 'ExecutionStage가 write_to_storage() 시 기록한 변경 키 접두사를 읽는다. "어떤 account/storage가 변경되었는지" 인덱스 역할이다.',
  },
  {
    title: '증분 상태 루트 계산',
    desc: 'StateRoot::overlay_root()가 변경된 서브트리만 재해시한다. 기존 DB의 트라이 노드는 그대로 두고, PrefixSet에 해당하는 경로만 계산한다.',
  },
  {
    title: '헤더 state_root 대조',
    desc: '계산한 루트와 블록 헤더의 state_root를 비교한다. 불일치하면 ExecutionStage의 실행 결과가 잘못된 것이므로 파이프라인이 중단된다.',
  },
];
