/** RpcMethods Viz — 색상 + 스텝 정의 */

export const C = {
  proof: '#6366f1',    // 보라 — Merkle 증명 (검증 경로)
  rpc: '#3b82f6',      // 파랑 — RPC 요청
  ok: '#10b981',       // 녹색 — 검증 완료
  bloom: '#f59e0b',    // 앰버 — Bloom filter
  trust: '#ef4444',    // 빨강 — 신뢰 지점 (비검증)
  muted: '#94a3b8',    // 회색 — 비활성
};

export const STEPS = [
  {
    label: '4개 메서드 공통 패턴 — get_proof → verify → extract',
    body: 'getBalance, getCode, getStorageAt, getTransactionCount 모두 동일한 3단계를 거친다.\nRPC에서 Merkle 증명을 받고, state_root 기준으로 검증한 뒤, RLP에서 원하는 필드를 추출한다.',
  },
  {
    label: 'getLogs — Bloom Filter로 로그 포함 여부 검증',
    body: '블록 헤더의 logsBloom(2048비트)에 address와 topic을 해싱해서 3개 비트 위치를 검사한다.\n비트가 모두 1이면 "포함 가능", 하나라도 0이면 "확실히 미포함" — false positive는 있지만 false negative는 없다.',
  },
  {
    label: 'sendRawTransaction — 유일한 신뢰 지점',
    body: '읽기(4개)는 전부 Merkle 증명으로 검증 가능하지만, 쓰기(TX 제출)는 체인 합의가 필요하므로 로컬 검증이 불가능하다.\nRPC에 그대로 위임하고, TX 해시를 기록해서 나중에 receipt 증명으로 포함을 확인한다.',
  },
];
