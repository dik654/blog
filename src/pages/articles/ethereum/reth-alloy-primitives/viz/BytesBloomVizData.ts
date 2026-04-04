export const C = {
  bytes: '#6366f1', bloom: '#10b981', topic: '#f59e0b',
  bit: '#ef4444', filter: '#8b5cf6', dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'Bytes — 참조 카운팅 + COW 가변 길이 바이트',
    body: 'bytes crate의 Bytes 타입: Arc 기반 참조 카운팅\nclone이 데이터 복사 없이 포인터만 공유\nslice()도 새 할당 없이 범위만 조정',
  },
  {
    label: 'calldata, log data, bytecode가 Bytes인 이유',
    body: '가변 길이 데이터: 크기가 런타임에 결정\nclone이 잦은 환경에서 COW가 효율적\nFixedBytes는 고정 크기 전용, Bytes는 가변 크기 전용',
  },
  {
    label: 'Bloom(2048비트) — 3개 비트 위치 결정',
    body: 'Keccak256 해시의 처음 6바이트를 2바이트씩 쌍으로 사용\n각 쌍 mod 2048 → 비트 위치 3개\n해당 비트를 1로 설정',
  },
  {
    label: '로그 토픽 → 블룸 필터 비트 설정',
    body: '각 토픽을 블룸 필터에 accrue() → 3비트 설정\n블록의 모든 로그를 하나의 블룸에 누적\n블록 헤더에 logsBloom 필드로 저장',
  },
  {
    label: 'eth_getLogs: 블룸 필터로 O(1) 사전 필터링',
    body: '블룸 검사 통과 → 후보 블록 (false positive 포함)\n블룸 검사 실패 → 확실히 미포함 (false negative 없음)\n후보만 실제 로그 확인 → 검색 범위 축소',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'bloom-struct', 1: 'bloom-struct',
  2: 'bloom-accrue', 3: 'bloom-accrue',
  4: 'bloom-contains',
};
