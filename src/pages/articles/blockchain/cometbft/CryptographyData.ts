export const CRYPTO_STACK_CODE = `CometBFT 암호화 스택

해시 함수:
  SHA-256        → 블록 해시, TX 해시, 머클 트리
  TMHash         → SHA-256 상위 20바이트 (주소 생성)

디지털 서명:
  Ed25519        → 기본 서명 (밸리데이터 투표)
  Secp256k1      → 비트코인 호환 (레거시)
  BLS12-381      → 집계 서명 (대규모 밸리데이터)

머클 트리:
  RFC-6962       → Certificate Transparency 표준
  리프: SHA256(0x00 || data)
  내부: SHA256(0x01 || left || right)

P2P 보안:
  X25519         → ECDH 키 교환
  ChaCha20-Poly1305  → 전송 암호화 (AEAD)`;

export const CRYPTO_STACK_ANNOTATIONS = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '해시 함수' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '서명 알고리즘' },
  { lines: [12, 15] as [number, number], color: 'amber' as const, note: '머클 트리' },
  { lines: [17, 19] as [number, number], color: 'violet' as const, note: 'P2P 보안' },
];

export const SIGN_VERIFY_CODE = `서명 검증 흐름

1. 밸리데이터가 투표 서명 생성
   signBytes = VoteSignBytes(chainID, vote)
   signature = privKey.Sign(signBytes)

2. 네트워크에서 서명 검증
   valid = pubKey.VerifySignature(signBytes, sig)
   → 주소 검증: pubKey.Address() == vote.ValidatorAddress

3. 배치 검증 최적화 (Ed25519)
   batchVerifier = ed25519.NewBatchVerifier()
   for vote in votes:
     batchVerifier.Add(pubKey, signBytes, sig)
   ok, results = batchVerifier.Verify()

4. 이중 서명 탐지
   같은 (Height, Round)에서 다른 BlockID 투표
   → DuplicateVoteEvidence 생성 → 슬래싱`;

export const SIGN_VERIFY_ANNOTATIONS = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '서명 생성' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '개별 검증' },
  { lines: [11, 14] as [number, number], color: 'amber' as const, note: '배치 검증' },
  { lines: [16, 18] as [number, number], color: 'rose' as const, note: '이중 서명' },
];

export const SIG_COMPARE_TABLE = [
  { algo: 'Ed25519', keySize: '32B/64B', sigSize: '64B', speed: '가장 빠름', use: '기본 (합의 투표)' },
  { algo: 'Secp256k1', keySize: '32B/33B', sigSize: '64B', speed: '보통', use: 'BTC 호환 (레거시)' },
  { algo: 'BLS12-381', keySize: '32B/96B', sigSize: '96B', speed: '느림', use: '집계 서명 (확장성)' },
] as const;
