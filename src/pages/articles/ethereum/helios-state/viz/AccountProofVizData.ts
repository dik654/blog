export const C = {
  address: '#6366f1', proof: '#10b981', account: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 12~13: keccak256(address) → 경로',
    body: '주소를 해시해서 상태 트라이의 경로를 만든다.\n20바이트 주소 → 32바이트 해시 → 니블 경로.',
  },
  {
    label: 'Line 15~18: verify_proof() 호출',
    body: 'account_proof + state_root + 경로로 검증.\nMerkle-Patricia 트라이를 역추적해서 루트 도달 확인.',
  },
  {
    label: 'Line 20~22: RLP → Account 디코딩',
    body: '검증된 바이트를 RLP 디코딩.\nnonce, balance, storageRoot, codeHash 추출.',
  },
];
