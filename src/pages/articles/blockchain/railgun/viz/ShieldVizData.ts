export const C = {
  erc20: '#0ea5e9', hash: '#6366f1', merkle: '#10b981', event: '#f59e0b',
};

export const STEPS = [
  {
    label: 'shield(note, tokenData) 호출',
    body: '사용자가 1000 USDC를 RAILGUN에 입금한다.\nmsg.sender = 0xUser, token = 0xUSDC, amount = 1000',
  },
  {
    label: 'Line 1: transferFrom(msg.sender, this, 1000)',
    body: 'IERC20(0xUSDC).transferFrom(0xUser, 0xRailgun, 1000)\n→ balances[0xUser]: 5000 → 4000\n→ balances[0xRailgun]: 0 → 1000',
  },
  {
    label: 'Line 2: commitment = hashCommitment(note)',
    body: 'poseidon(npk=0xa3f2.., token=0xUSDC, value=1000, random=0x7b1e..)\n→ commitment = 0x2d8a..f1e2',
  },
  {
    label: 'Line 3: merkleTree.insertLeaf(commitment)',
    body: 'leaves[42] = 0x2d8a..f1e2\nnextIndex: 42 → 43\nroot 재계산 시작',
  },
  {
    label: 'Line 4: emit Shield(commitment, root)',
    body: 'Shield(0x2d8a.., 0xf1e2..)\n이 이벤트만 온체인에 공개. 금액·토큰 종류는 숨겨진다.',
  },
];
