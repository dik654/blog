export const C = {
  slot: '#6366f1', proof: '#10b981', balance: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 1: 스토리지 슬롯 계산',
    body: 'let slot = keccak256(abi::encode([address, BALANCE_SLOT]))\nERC-20 balanceOf의 Solidity 매핑 슬롯을 계산.\nSlot = keccak256(key || slot_number).',
  },
  {
    label: 'Line 2~3: Merkle 증명 요청 & 검증',
    body: 'helios.get_proof(token_contract, &[slot], block)\nverify_storage_proof(proof.storage_proof[0])\neth_getProof 응답의 스토리지 Merkle 증명을 로컬 검증.',
  },
  {
    label: 'Line 4: 잔액 디코딩',
    body: 'let balance = U256::from_be_bytes(balance_bytes)\n검증된 스토리지 값을 U256으로 변환.\n예: 1,000,000,000 = 1,000 USDC (6 decimals).',
  },
  {
    label: 'Line 5~6: NFT (ERC-721) 소유자 확인',
    body: 'slot = keccak256(tokenId || OWNER_SLOT)\nlet owner = Address::from(verify_storage_proof(nft_proof))\n같은 패턴으로 NFT 소유자도 증명 기반 확인.',
  },
];
