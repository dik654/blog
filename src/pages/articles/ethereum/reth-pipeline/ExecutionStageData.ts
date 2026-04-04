export interface ExecCompare {
  aspect: string;
  geth: string;
  reth: string;
}

export const EXEC_COMPARISONS: ExecCompare[] = [
  {
    aspect: 'DB 커밋 단위',
    geth: '블록마다 stateDB.Commit()',
    reth: '10,000블록 누적 후 한 번에 기록',
  },
  {
    aspect: 'I/O 횟수 (100K 블록)',
    geth: '~100,000회',
    reth: '~10회 (commit_threshold 단위)',
  },
  {
    aspect: '상태 저장 구조',
    geth: 'stateDB (트라이 직접 조작)',
    reth: 'BundleState (인메모리 해시맵)',
  },
  {
    aspect: '크래시 복구',
    geth: '마지막 커밋 블록부터 재실행',
    reth: '체크포인트부터 재실행 (최대 10K 블록)',
  },
];
