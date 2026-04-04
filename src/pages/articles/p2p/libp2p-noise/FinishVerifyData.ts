export const CHECKS = [
  {
    label: 'DH 서명 검증',
    desc: 'STATIC_KEY_DOMAIN + DH 공개키에 대해 상대 Ed25519 키로 서명 검증',
    detail: '"noise-libp2p-static-key:" 프리픽스 + 원격 DH 공개키를 결합하여 verify() 호출. 실패 시 BadSignature 에러.',
    color: '#6366f1',
  },
  {
    label: 'WebTransport certhash',
    desc: 'Initiator만 수행. TLS 인증서 해시가 기대값의 부분집합인지 확인',
    detail: 'expected_certhashes.is_subset(remote_certhashes) 검증. WebTransport 연결이 아니면 이 단계를 건너뛴다.',
    color: '#10b981',
  },
  {
    label: 'TransportState 전환',
    desc: 'HandshakeState -> TransportState. ChaChaPoly 암호화 스트림 시작',
    detail: '3라운드 완료 후 snow 라이브러리가 내부 상태를 전환한다. 이후 모든 데이터는 ChaCha20-Poly1305로 암호화/인증.',
    color: '#f59e0b',
  },
];

export const PARAMS = {
  label: 'PARAMS_XX',
  value: 'Noise_XX_25519_ChaChaPoly_SHA256',
  parts: [
    { token: 'XX', desc: '핸드셰이크 패턴 (양방향 인증)', color: '#8b5cf6' },
    { token: '25519', desc: 'X25519 Diffie-Hellman', color: '#06b6d4' },
    { token: 'ChaChaPoly', desc: 'ChaCha20-Poly1305 AEAD', color: '#10b981' },
    { token: 'SHA256', desc: '해시 함수', color: '#f59e0b' },
  ],
};
