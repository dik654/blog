/** ProofDB Viz -- 색상 + 스텝 정의 */

export const C = {
  evm: '#8b5cf6',     // 보라 — EVM (revm)
  proofdb: '#3b82f6',  // 파랑 — ProofDB
  rpc: '#f59e0b',      // 앰버 — RPC 프로바이더
  cache: '#10b981',    // 녹색 — 캐시 히트
  alert: '#ef4444',    // 빨강 — 에러
  verify: '#06b6d4',   // 시안 — 검증
};

export const STEPS = [
  {
    label: 'ProofDB 흐름 -- EVM이 상태를 요청하면 캐시 확인 후 RPC 조회',
    body: 'EVM(revm)이 balance, nonce 등을 요청하면 ProofDB가 중간에서 처리.\n캐시 키는 (address, block_number) — 같은 블록 내 동일 주소는 캐시 히트.\n블록이 바뀌면 state_root가 달라지므로 캐시 무효화.',
  },
  {
    label: '에러 3가지 -- 증명 흐름의 어느 지점에서 실패하는가',
    body: 'ProofMissing: RPC가 증명을 반환하지 않음 (비표준 프로바이더).\nMerkleMismatch: 증명의 해시가 state_root와 불일치 (악의적 프로바이더).\nRlpDecodeError: 리프 데이터가 유효한 Account로 디코딩되지 않음.',
  },
];
