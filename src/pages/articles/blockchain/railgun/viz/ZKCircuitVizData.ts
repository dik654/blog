export const C = {
  public: '#6366f1', private: '#ef4444', constraint: '#10b981', sum: '#f59e0b',
};

export const STEPS = [
  {
    label: '회로 입력 분류 — public vs private',
    body: 'public: nullifier, merkleRoot, outputCommitments, fee\nprivate: spendingKey, leafIndex, siblings[16], noteValues',
  },
  {
    label: '제약 1: nullifier == poseidon(sk, idx)',
    body: 'spendingKey = 0x9c4d.., leafIndex = 42\nposeidon(0x9c4d.., 42) → 0xbe71..\nassert 0xbe71.. == nullifier (public input) → ✓',
  },
  {
    label: '제약 2: merkleVerify(commitment, siblings, root)',
    body: 'commitment = poseidon(npk, token, value, random)\nsiblings = [s₀, s₁, ..., s₁₅]\n해시 체인: poseidon(leaf, s₀) → poseidon(h₁, s₁) → ... → root\nassert root == merkleRoot (public input) → ✓',
  },
  {
    label: '제약 3: sum(inputs) == sum(outputs) + fee',
    body: 'inputValues = [1000]\noutputValues = [900]\nfee = 100\nassert 1000 == 900 + 100 → ✓\n밸런스 보존 증명 — 돈이 생성·소멸되지 않음.',
  },
];
