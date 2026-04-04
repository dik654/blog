export const C = {
  proof: '#6366f1', null: '#ef4444', commit: '#10b981', event: '#f59e0b',
};

export const STEPS = [
  {
    label: 'transact(proof, nullifiers, commitments) 호출',
    body: 'Alice가 Bob에게 shielded 전송.\ninputNullifiers = [0xbe71..] (Alice의 Note 소비)\noutputCommitments = [0x44ab..] (Bob의 새 Note)',
  },
  {
    label: 'Line 1: verifyProof(proof, publicInputs)',
    body: 'Groth16 검증: e(A,B) == e(α,β)·e(vk_x,γ)·e(C,δ)\npublicInputs = [nullifier, merkleRoot, outputCommitments]\n→ true (증명 유효)',
  },
  {
    label: 'Line 2: nullifier 이중사용 체크 루프',
    body: 'for i in 0..inputNullifiers.length:\n  require(!nullifiers[0xbe71..]) → false ✓ 통과\n  nullifiers[0xbe71..]: false → true',
  },
  {
    label: 'Line 3: output commitment 삽입',
    body: 'for i in 0..outputCommitments.length:\n  merkleTree.insertLeaf(0x44ab..)\n  leaves[43] = 0x44ab..\n  root 재계산 → 0xd2e1..',
  },
  {
    label: 'Line 4: emit Transact',
    body: 'Transact([0xbe71..], [0x44ab..])\n온체인에는 해시값만 기록. 금액·수신자·토큰 종류 비공개.',
  },
];
