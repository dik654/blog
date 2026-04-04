export const STEPS = [
  {
    label: '1. X25519 DH 키쌍 생성',
    desc: '임시(ephemeral) Diffie-Hellman 키쌍을 생성한다. 세션마다 새로 만든다.',
    detail: 'Keypair { secret, public } — 키 교환 전용. 서명에는 사용 불가.',
    color: '#6366f1',
  },
  {
    label: '2. 도메인 프리픽스 결합',
    desc: '"noise-libp2p-static-key:" + DH 공개키 바이트를 결합한다.',
    detail: '도메인 분리(Domain Separation): 같은 키로 다른 용도의 서명이 혼동되지 않도록 프리픽스를 붙인다.',
    color: '#10b981',
  },
  {
    label: '3. Ed25519로 서명',
    desc: 'libp2p identity 개인키(Ed25519)로 결합된 메시지에 서명한다.',
    detail: '서명 = "이 DH 공개키는 내 PeerId 소유다"를 증명하는 바인딩.',
    color: '#f59e0b',
  },
  {
    label: '4. AuthenticKeypair 완성',
    desc: 'DH 키쌍 + 서명을 묶어 AuthenticKeypair를 구성한다.',
    detail: '핸드셰이크 payload에 (identity_pubkey, signature)를 포함하여 전송한다.',
    color: '#ef4444',
  },
];
