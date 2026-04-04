export const C = {
  prover: '#6366f1', verifier: '#10b981', pairing: '#f59e0b', onchain: '#ef4444',
};

export const STEPS = [
  {
    label: 'Prover: witness → R1CS → QAP',
    body: 'witness = (sk, idx, siblings, values, random)\nR1CS 제약 → 다항식 변환 (QAP)\nA(x)·B(x) - C(x) = H(x)·Z(x)',
  },
  {
    label: 'Prover: QAP → 증명 (A, B, C)',
    body: 'A ∈ G1: [α + a(τ)]₁\nB ∈ G2: [β + b(τ)]₂\nC ∈ G1: [c(τ) + h(τ)·z(τ)]₁\n이 3개 점이 증명(proof)이다. 크기 = 192 bytes.',
  },
  {
    label: 'Verifier: 페어링 검증 수식',
    body: 'e(A, B) == e(α, β) · e(vk_x, γ) · e(C, δ)\nvk_x = ic[0] + nullifier·ic[1] + root·ic[2] + ...\n4개 페어링 연산으로 증명 유효성 판정.',
  },
  {
    label: 'On-chain: Verifier.verifyProof()',
    body: 'Verifier.verifyProof([A], [B], [C], [publicInputs])\nEVM precompile 사용: ecAdd(0x06), ecMul(0x07), ecPairing(0x08)\n가스비 ≈ 250,000 gas → true/false 반환',
  },
];
