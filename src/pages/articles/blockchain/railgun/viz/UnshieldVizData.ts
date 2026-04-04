export const C = {
  proof: '#6366f1', null: '#ef4444', transfer: '#10b981', balance: '#f59e0b',
};

export const STEPS = [
  {
    label: 'unshield(proof, to, token, amount) 호출',
    body: 'Bob이 500 USDC를 출금한다.\nto = 0xBob, token = 0xUSDC, amount = 500',
  },
  {
    label: 'Line 1: verifyProof — 소유권 증명',
    body: 'publicInputs = [nullifier, merkleRoot, to, token, amount]\nGroth16 검증: Bob이 해당 commitment의 spendingKey 소유자임을 증명\n→ true',
  },
  {
    label: 'Line 2: nullifiers[nullifier] = true',
    body: 'require(!nullifiers[0x55cd..]) → false ✓\nnullifiers[0x55cd..]: false → true\n이 Note는 더 이상 사용 불가.',
  },
  {
    label: 'Line 3: IERC20(token).transfer(to, amount)',
    body: 'IERC20(0xUSDC).transfer(0xBob, 500)\nbalances[0xRailgun]: 1000 → 500\nbalances[0xBob]: 0 → 500',
  },
];
