export const HANDSHAKE_CODE = `P2P 보안 핸드셰이크 (STS 프로토콜)

1. TCP 연결 수립
2. 임시 키 교환 (X25519 ECDH)
   → 각 피어가 임시 키 쌍 생성
   → Diffie-Hellman으로 공유 비밀 도출
3. 챌린지-응답 인증
   → Ed25519로 챌린지 서명
   → 피어의 Node ID(공개키 해시) 검증
4. 암호화 채널 설정
   → ChaCha20-Poly1305 AEAD
   → 프레임: [4B 길이][최대 1024B 데이터]
   → Nonce 자동 증가 (재생 공격 방지)

결과: 인증 + 암호화된 양방향 채널
  → 이더리움 devp2p의 RLPx 핸드셰이크와 유사`;

export const HANDSHAKE_ANNOTATIONS = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: 'ECDH 키 교환' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '디지털 서명 인증' },
  { lines: [10, 13] as [number, number], color: 'amber' as const, note: 'AEAD 암호화' },
];

export const DOS_CODE = `DoS 방어 메커니즘

1. Rate Limiting (토큰 버킷)
   rate: 초당 메시지 수 | burst: 버스트 허용량
   → 토큰 소진 시 메시지 차단

2. 대역폭 제한
   sendRate / recvRate: bytes/second
   → 버킷 기반 전송/수신 속도 제어

3. 연결 수 제한
   max_num_inbound_peers  = 40
   max_num_outbound_peers = 10
   → 중복 IP 차단 (allow_duplicate_ip = false)

4. 악성 피어 자동 차단
   PeerBehavior.TrustScore 계산:
     penalty = InvalidMessages*10 + TimeoutCount*5
     TrustScore = max(0, 100 - penalty)
   → 임계값 이하 시 BadPeerManager에 등록`;

export const DOS_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '메시지 속도 제한' },
  { lines: [9, 11] as [number, number], color: 'emerald' as const, note: '연결 수 제한' },
  { lines: [13, 17] as [number, number], color: 'rose' as const, note: '신뢰도 기반 차단' },
];

export const SECURITY_TABLE = [
  { layer: '전송 암호화', mechanism: 'ChaCha20-Poly1305 AEAD', compare: 'devp2p: AES-256-CTR + HMAC' },
  { layer: '키 교환', mechanism: 'X25519 ECDH', compare: 'devp2p: secp256k1 ECIES' },
  { layer: '인증', mechanism: 'Ed25519 서명', compare: 'devp2p: secp256k1 서명' },
  { layer: '피어 발견', mechanism: 'PEX Reactor + Seed 노드', compare: 'devp2p: Kademlia DHT' },
  { layer: 'DoS 방어', mechanism: 'Rate Limit + TrustScore', compare: 'devp2p: 연결 수 제한' },
] as const;
