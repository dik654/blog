export const C = {
  sk: '#6366f1', null: '#ef4444', check: '#10b981', store: '#f59e0b',
};

export const STEPS = [
  {
    label: 'nullifier = poseidon(spendingKey, leafIndex)',
    body: 'spendingKey = 0x9c4d.. (비밀키, 오프체인 보관)\nleafIndex = 42 (Merkle tree 위치)\nnullifier = poseidon(0x9c4d.., 42) → 0xbe71..a3f2',
  },
  {
    label: '같은 Note → 항상 같은 nullifier',
    body: '(spendingKey, leafIndex)가 고정이면 nullifier도 고정.\n두 번째 사용 시 동일한 0xbe71..a3f2가 계산된다.',
  },
  {
    label: 'require(!nullifiers[nullifier])',
    body: 'nullifiers[0xbe71..a3f2] == false → 통과 ✓\n만약 true였다면 → "Already spent" 리버트',
  },
  {
    label: 'nullifiers[nullifier] = true',
    body: 'nullifiers[0xbe71..a3f2]: false → true\n이후 같은 nullifier로 재사용 시도 시 Line 3에서 차단.',
  },
];
