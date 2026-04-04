export const C = { block: '#6366f1', err: '#ef4444', ok: '#10b981', stage: '#f59e0b', db: '#8b5cf6' };

export const STEPS = [
  {
    label: 'EL 클라이언트의 역할',
    body: '피어에서 블록 도착 → 검증 → TX 실행 → 상태 저장하며 CL이 FCU로 목표를 지시합니다.',
  },
  {
    label: '수억 개 블록을 따라잡아야 함',
    body: '제네시스부터 약 2천만 블록을 따라잡는 초기 동기화에 며칠~주일이 소요됩니다.',
  },
  {
    label: '문제: 모놀리식 처리',
    body: 'Geth의 InsertChain은 다운로드·검증·실행·저장을 하나의 함수에서 순차 처리합니다.',
  },
  {
    label: '문제: 크래시 복구 불가',
    body: '노드가 죽으면 진행 상황 기록이 없어 마지막 DB 커밋 지점부터 전체 재시작해야 합니다.',
  },
  {
    label: '해결: Stage 분리 (reth 핵심 설계)',
    body: 'Headers → Bodies → Senders → Execution → Merkle로 각 단계를 독립 Stage로 분리합니다.',
  },
  {
    label: '해결: 체크포인트 + unwind',
    body: '각 Stage가 체크포인트에 진행 상황을 저장하여 크래시 복구와 reorg 시 해당 Stage만 롤백합니다.',
  },
];
