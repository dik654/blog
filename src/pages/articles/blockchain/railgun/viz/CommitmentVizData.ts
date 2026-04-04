export const C = {
  input: '#6366f1', hash: '#f59e0b', merkle: '#10b981', root: '#ef4444',
};

export const STEPS = [
  {
    label: 'hashCommitment 입력 — 4개 필드',
    body: 'npk = 0xa3f2..\ntoken = 0xA0b8.. (USDC)\nvalue = 1000\nrandom = 0x7b1e..',
  },
  {
    label: 'poseidon4() 해시 계산',
    body: 'Poseidon(npk, token, value, random)\n= Poseidon(0xa3f2.., 0xA0b8.., 1000, 0x7b1e..)\n→ commitment = 0x2d8a..f1e2',
  },
  {
    label: 'insertLeaf — tree.leaves[42] = 0x2d8a..',
    body: 'Merkle tree depth=16, nextIndex=42\nleaves[42] ← 0x2d8a..f1e2\n이제 leaf에서 root까지 재계산한다.',
  },
  {
    label: 'Merkle root 재계산 — 재귀 해시',
    body: 'depth 0: poseidon(leaves[42], leaves[43]) → parent₀\ndepth 1: poseidon(parent₀, sibling₁) → parent₁\n...\ndepth 15: → root = 0xf1e2..ab34',
  },
];
