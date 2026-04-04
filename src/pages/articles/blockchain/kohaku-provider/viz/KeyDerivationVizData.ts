export const C = {
  seed: '#6366f1', key: '#10b981', path: '#f59e0b', addr: '#ef4444',
};

export const STEPS = [
  {
    label: 'Line 1: PBKDF2로 시드 생성',
    body: 'let seed = pbkdf2(mnemonic, salt, 2048)\n니모닉(12/24단어) → 64바이트 시드. 2048라운드 키 스트레칭.',
  },
  {
    label: 'Line 2: 마스터 키 + 체인 코드',
    body: 'let (master_key, chain_code) = hmac_sha512("Bitcoin seed", &seed)\nHMAC-SHA512로 마스터 비밀키와 체인 코드 분리.',
  },
  {
    label: 'Line 3~4: BIP-44 경로 파생',
    body: "path = \"m/44'/60'/0'/0/0\"  // 이더리움 경로\nlet child = derive_path(&master_key, &chain_code, path)\n하드/소프트 파생으로 자식 키 생성.",
  },
  {
    label: 'Line 5~6: 공개키 → 주소 변환',
    body: 'secp256k1 공개키 → keccak256 → 하위 20바이트 = 주소.\n모든 과정이 로컬에서 수행. RPC 서버에 키가 전송되지 않는다.',
  },
];
