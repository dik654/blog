export const C = {
  pubkey: '#6366f1', hash: '#10b981', addr: '#f59e0b',
  create: '#8b5cf6', create2: '#ef4444', dim: '#94a3b8',
};

export const STEPS = [
  {
    label: '공개키 → Keccak256 → Address 변환',
    body: 'secp256k1 공개키(64바이트) → Keccak256 해시(32바이트)\n하위 20바이트 = Address',
  },
  {
    label: 'CREATE: sender + nonce → Address',
    body: 'RLP([sender, nonce]) → Keccak256 → 하위 20바이트\n컨트랙트 배포 시 주소가 결정적으로 생성',
  },
  {
    label: 'CREATE2: 0xff + sender + salt + init_code_hash',
    body: '85바이트 입력 → Keccak256 → 하위 20바이트\nsalt로 배포 전 주소를 미리 계산 가능',
  },
  {
    label: 'CREATE vs CREATE2 비교',
    body: 'CREATE: nonce 의존 → nonce 변경 시 주소 변경\nCREATE2: salt + code 기반 → 결정적 주소',
  },
  {
    label: 'B256 ↔ Address: zero-padding 변환',
    body: 'Address(20B) → B256(32B): 상위 12바이트를 0으로 채움\nB256 → Address: 하위 20바이트만 추출',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'keccak-hash', 1: 'create-address',
  2: 'create2-address', 3: 'create2-address',
  4: 'keccak-hash',
};
