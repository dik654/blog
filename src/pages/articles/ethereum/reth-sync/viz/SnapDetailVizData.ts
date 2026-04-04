export const C = { range: '#6366f1', proof: '#10b981', store: '#f59e0b', db: '#8b5cf6', next: '#0ea5e9' };

export const STEPS = [
  {
    label: 'GetAccountRange — 해시 범위 요청',
    body: '해시 공간 [start..end]의 계정 데이터를 피어에 요청하며 Merkle proof가 포함됩니다.',
  },
  {
    label: 'Merkle Proof 검증',
    body: '응답의 proof를 상태 루트로 검증하여 악의적 피어의 잘못된 데이터를 거부합니다.',
  },
  {
    label: 'GetStorageRanges — 스토리지 다운로드',
    body: '각 계정의 스토리지 슬롯을 범위 요청하며 동일한 Merkle proof 검증을 적용합니다.',
  },
  {
    label: 'DB 기록 → 다음 범위 진행',
    body: '검증된 데이터를 MDBX에 기록하고 start를 갱신하여 전체 해시 공간을 커버합니다.',
  },
];
