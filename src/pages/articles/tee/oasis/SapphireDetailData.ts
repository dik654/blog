export const precompileCode = `// Sapphire 암호화 프리컴파일 주소
library Sapphire {
  // 랜덤 바이트 생성 (SGX 내 PRNG)
  address constant RANDOM_BYTES = 0x01...01;

  // 키 유도 (HKDF)
  address constant DERIVE_KEY = 0x01...02;

  // 대칭 암호화/복호화 (DeoxysII-256)
  address constant ENCRYPT = 0x01...03;
  address constant DECRYPT = 0x01...04;

  // 디지털 서명 (Ed25519, Secp256k1)
  address constant GENERATE_SIGNING_KEYPAIR = 0x01...05;
  address constant SIGN_DIGEST   = 0x01...06;
  address constant VERIFY_DIGEST = 0x01...07;
}

// 사용 예시: 기밀 난수 생성
bytes memory rand = Sapphire.randomBytes(32, "");
uint256 secret = abi.decode(rand, (uint256));`;

export const precompileAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: '난수 & 키 유도 프리컴파일' },
  { lines: [7, 12] as [number, number], color: 'emerald' as const, note: '암호화/복호화 프리컴파일' },
  { lines: [14, 18] as [number, number], color: 'amber' as const, note: '서명 프리컴파일' },
  { lines: [20, 22] as [number, number], color: 'violet' as const, note: '기밀 난수 사용 예시' },
];
